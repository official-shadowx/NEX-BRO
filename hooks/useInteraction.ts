"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CursorMode = "pointer" | "aura" | "trail";

export function useClickTone() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  }, []);

  return play;
}

export function usePrefersFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const check = () => {
      const isDesktop = window.innerWidth >= 768;
      const isFine = window.matchMedia("(pointer: fine)").matches;
      setFine(isDesktop && isFine);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return fine;
}
