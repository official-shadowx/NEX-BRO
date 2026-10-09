"use client";

import { DISCORD_INVITE } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GlassCard } from "@/components/ui/GlassCard";

export function DiscordCommunity() {
  return (
    <section id="community" className="relative mx-auto max-w-6xl px-6 py-24">
      <GlassCard className="overflow-hidden p-0" tilt={false}>
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="block">
          <div className="relative min-h-[240px] overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_35%,#050505),#050505_55%)] p-8 md:p-12">
            <div className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/50">Signal</p>
                <h2 className="mt-3 font-display text-4xl text-white text-glow-white md:text-5xl">
                  Drop into the NEX BRO Discord.
                </h2>
                <p className="mt-4 text-white/65">
                  PvP clips, .NET builds, Fabric drops, and phonk edits — live in the same room.
                </p>
                <div className="mt-8" onClick={(e) => e.stopPropagation()}>
                  <MagneticButton href={DISCORD_INVITE} target="_blank" rel="noreferrer">
                    Join Server
                  </MagneticButton>
                </div>
              </div>
              <div className="relative shrink-0 self-center md:self-auto">
                <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:h-44 md:w-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/nexbro.jpg"
                    alt="NEX BRO"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </a>
      </GlassCard>
    </section>
  );
}
