"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  type: "file" | "procedural";
};

export const TRACKS: Track[] = [
  {
    id: "pros-bandido",
    title: "PROS BANDIDO (ULTRA SLOWED)",
    artist: "MATORO",
    src: "/songs/pros-bandido.mp3",
    type: "file",
  },
  {
    id: "mix",
    title: "PHONK MIX",
    artist: "NEX BRO",
    src: "/songs/mix.mp4",
    type: "file",
  },
  {
    id: "procedural",
    title: "Aura Phonk Loop (96 BPM)",
    artist: "NEX BRO Synth",
    src: "",
    type: "procedural",
  },
];

/**
 * Procedural phonk/aura loop via Web Audio API
 */
function startProceduralEngine(ctx: AudioContext, muted: boolean, volume: number) {
  const master = ctx.createGain();
  master.gain.value = muted ? 0 : volume;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  filter.connect(master);

  const kickGain = ctx.createGain();
  kickGain.connect(filter);

  const hatGain = ctx.createGain();
  hatGain.gain.value = 0.03;
  hatGain.connect(master);

  const bass = ctx.createOscillator();
  bass.type = "sawtooth";
  bass.frequency.value = 55;
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.05;
  const bassFilter = ctx.createBiquadFilter();
  bassFilter.type = "lowpass";
  bassFilter.frequency.value = 140;
  bass.connect(bassFilter);
  bassFilter.connect(master);
  bass.start();

  const pad = ctx.createOscillator();
  pad.type = "sine";
  pad.frequency.value = 110;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.02;
  pad.connect(padGain);
  padGain.connect(master);
  pad.start();

  let step = 0;
  const bpm = 96;
  const interval = (60 / bpm) * 1000 * 0.5;

  const tick = () => {
    const t = ctx.currentTime;
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(g);
      g.connect(kickGain);
      osc.start(t);
      osc.stop(t + 0.24);
    }
    if (step % 2 === 1) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.04, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      noise.connect(ng);
      ng.connect(hatGain);
      noise.start(t);
    }
    step += 1;
  };

  const id = window.setInterval(tick, interval);
  tick();

  return {
    master,
    stop: () => {
      window.clearInterval(id);
      try {
        bass.stop();
        pad.stop();
      } catch {}
    },
  };
}

export function AudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [levels, setLevels] = useState([0.3, 0.5, 0.4, 0.7, 0.45, 0.6, 0.35, 0.55]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<ReturnType<typeof startProceduralEngine> | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const currentTrack = TRACKS[trackIndex] || TRACKS[0];

  // Auto-play logic on mount for both PC and Mobile phones
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted) return;
      hasStarted = true;
      setPlaying(true);
      audio.volume = muted ? 0 : volume;
      audio.play().catch(() => {
        // If initial play without gesture was blocked, reset hasStarted to allow gesture unlock
        hasStarted = false;
      });
    };

    const onFirstUserGesture = () => {
      if (hasStarted) return;
      hasStarted = true;
      setPlaying(true);
      if (audio) {
        audio.volume = muted ? 0 : volume;
        audio.play().catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("touchstart", onFirstUserGesture);
      window.removeEventListener("pointerdown", onFirstUserGesture);
      window.removeEventListener("click", onFirstUserGesture);
      window.removeEventListener("scroll", onFirstUserGesture);
      window.removeEventListener("keydown", onFirstUserGesture);
    };

    // 1. Try immediate autoplay on page load (desktop browsers)
    startPlayback();

    // 2. Fallback listeners for mobile browsers (unlocked on first touch/tap/scroll)
    window.addEventListener("touchstart", onFirstUserGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", onFirstUserGesture, { once: true, passive: true });
    window.addEventListener("click", onFirstUserGesture, { once: true, passive: true });
    window.addEventListener("scroll", onFirstUserGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstUserGesture, { once: true, passive: true });

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Play/Pause and Track Switch
  useEffect(() => {
    const audio = audioRef.current;

    if (!playing) {
      if (audio) audio.pause();
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
      return;
    }

    if (currentTrack.type === "file") {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
      if (audio) {
        audio.volume = muted ? 0 : volume;
        audio.play().catch(() => {
          // If browser policy blocked it, wait for next user click
        });
      }
    } else {
      // Procedural engine
      if (audio) audio.pause();
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = ctxRef.current ?? new AudioCtx();
        ctxRef.current = ctx;
        if (ctx.state === "suspended") void ctx.resume();
        engineRef.current = startProceduralEngine(ctx, muted, volume);
      }
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, [playing, trackIndex, currentTrack, volume, muted]);

  // Handle Volume & Mute Updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
    if (engineRef.current) {
      engineRef.current.master.gain.value = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Animated Visualizer Spectrum
  useEffect(() => {
    if (!playing) {
      setLevels((prev) => prev.map(() => 0.18));
      return;
    }
    const id = window.setInterval(() => {
      setLevels((prev) => prev.map(() => 0.25 + Math.random() * 0.75));
    }, 130);
    return () => window.clearInterval(id);
  }, [playing]);

  const togglePlay = () => {
    setPlaying((p) => !p);
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setPlaying(true);
  };

  const handlePrev = () => {
    setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setPlaying(true);
  };

  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setPlaying(true);
    setShowPlaylist(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack.type !== "file" || !audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = percent * duration;
    setCurrentTime(percent * duration);
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
      className="fixed bottom-3 sm:bottom-4 inset-x-0 mx-auto z-[95] w-[min(94vw,440px)]"
    >
      {/* Hidden HTML5 Audio Element for playing files */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={handleNext}
      />

      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mb-2 overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Playlist ({TRACKS.length})</p>
              <button
                type="button"
                onClick={() => setShowPlaylist(false)}
                className="font-mono text-[10px] text-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-1 space-y-1 max-h-48 overflow-y-auto">
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition",
                    trackIndex === idx
                      ? "bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate font-display text-xs text-white">{t.title}</p>
                    <p className="truncate font-mono text-[10px] text-white/45">{t.artist}</p>
                  </div>
                  {trackIndex === idx && playing && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--accent)] shrink-0">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[var(--accent)]" />
                      PLAYING
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Player Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/85 p-2.5 sm:p-3 shadow-2xl backdrop-blur-2xl">
        {/* Top Seekable Progress Bar (for file tracks) */}
        {currentTrack.type === "file" && (
          <div
            onClick={handleSeek}
            className="group absolute left-0 right-0 top-0 h-1 cursor-pointer bg-white/10"
            title="Click to seek"
          >
            <div
              className="h-full bg-[var(--accent)] transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 pt-0.5">
          {/* Controls: Prev / Play / Next */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              type="button"
              aria-label="Previous Track"
              onClick={handlePrev}
              className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <SkipBack size={14} />
            </button>

            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-glow-sm transition hover:scale-105 hover:bg-white/20"
            >
              {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>

            <button
              type="button"
              aria-label="Next Track"
              onClick={handleNext}
              className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] shrink-0">
                Track {trackIndex + 1}/{TRACKS.length}
              </span>
              {currentTrack.type === "file" && duration > 0 && (
                <span className="font-mono text-[9px] text-white/40 truncate">
                  · {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>
            <p className="truncate font-display text-xs text-white sm:text-sm font-semibold">{currentTrack.title}</p>
            <p className="truncate font-mono text-[10px] text-white/50">{currentTrack.artist}</p>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="hidden sm:flex h-6 items-end gap-0.5 shrink-0">
            {levels.map((lvl, i) => (
              <span
                key={i}
                className="w-0.5 origin-bottom rounded-full bg-[var(--accent)]"
                style={{
                  height: 20,
                  transform: `scaleY(${lvl})`,
                  opacity: playing ? 0.9 : 0.3,
                  boxShadow: playing ? "0 0 6px var(--accent)" : undefined,
                }}
              />
            ))}
          </div>

          {/* Right Tools: Playlist & Volume */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="Toggle Playlist"
              onClick={() => setShowPlaylist((p) => !p)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition",
                showPlaylist
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              <ListMusic size={15} />
            </button>

            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => setMuted((m) => !m)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:text-white"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <input
              aria-label="Volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (muted) setMuted(false);
              }}
              className="h-1 w-12 cursor-pointer accent-[var(--accent)] hidden sm:block"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
