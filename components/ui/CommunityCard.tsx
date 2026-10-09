"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useDiscordInvite } from "@/hooks/useDiscordInvite";
import { SITE } from "@/lib/site";
import { MessageCircle } from "lucide-react";

export function CommunityCard() {
  const { online, members, guildName } = useDiscordInvite();

  return (
    <section id="community" className="relative z-10 px-5 pb-32 pt-10">
      <GlassCard className="mx-auto max-w-6xl overflow-hidden p-0">
        <div className="relative isolate px-8 py-14 md:px-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb),0.28),transparent_55%)]" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-white/50">
                <MessageCircle size={14} /> Discord community
              </p>
              <h2 className="mt-3 text-3xl font-bold text-glow-white md:text-5xl">
                {guildName}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/60">
                High-octane builds, phonk edits, Fabric PvP, and .NET systems talk.
                {members != null && ` ${members} members`}
                {online != null && ` · ${online} online now`}.
              </p>
            </div>
            <MagneticButton href={SITE.discordInvite} className="shrink-0">
              Join the Server
            </MagneticButton>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
