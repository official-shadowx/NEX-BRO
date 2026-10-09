"use client";

import Image from "next/image";
import { Music2, Gamepad2 } from "lucide-react";
import { useLanyard } from "@/hooks/useLanyard";
import { DISCORD_INVITE, DISCORD_USER_ID, DISCORD_USERNAME, DISPLAY_NAME } from "@/lib/constants";
import { avatarUrl, primaryActivity, statusMeta } from "@/lib/lanyard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/cn";

export function DiscordPresenceCard({ compact = false }: { compact?: boolean }) {
  const { data, loading, connected } = useLanyard();
  const avatar = "/nexbro.jpg";
  const status = statusMeta(data?.discord_status);
  const activity = primaryActivity(data);
  const name = DISPLAY_NAME;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl",
        compact ? "w-full" : "w-full max-w-md",
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-[var(--accent)] opacity-40 blur-md" />
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt={name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {loading ? <div className="absolute inset-0 animate-pulse bg-white/10" /> : null}
          </div>
          <span
            className={cn(
              "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-obsidian",
              status.className,
              data?.discord_status === "online" && "after:absolute after:inset-0 after:animate-pulseRing after:rounded-full after:bg-emerald-400",
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            Live Discord {connected ? "· socket" : loading ? "· syncing" : "· rest"}
          </p>
          <h3 className="mt-1 font-display text-2xl text-white text-glow-white">{name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs text-white/60">@{DISCORD_USERNAME}</p>
            <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
              ID: {DISCORD_USERNAME}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/60">{status.label}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
        {activity?.kind === "spotify" ? (
          <div className="flex items-center gap-3">
            {activity.art ? (
              <Image
                src={activity.art}
                alt={activity.album ?? activity.title}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-500/20">
                <Music2 size={18} />
              </div>
            )}
            <div className="min-w-0">
              <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                <Music2 size={12} /> Spotify
              </p>
              <p className="truncate font-display text-sm text-white">{activity.title}</p>
              <p className="truncate text-xs text-white/55">{activity.subtitle}</p>
            </div>
          </div>
        ) : activity?.kind === "game" ? (
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Gamepad2 size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Playing</p>
              <p className="truncate font-display text-sm text-white">{activity.title}</p>
              <p className="truncate text-xs text-white/55">{activity.subtitle}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/50">
            {loading ? "Calibrating presence…" : activity?.subtitle ?? "Idle in the void — no rich presence."}
          </p>
        )}
      </div>

      <div className="mt-4">
        <MagneticButton href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="w-full text-center">
          Join Discord
        </MagneticButton>
      </div>
    </div>
  );
}
