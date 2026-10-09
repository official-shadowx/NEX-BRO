"use client";

import { useEffect, useState } from "react";
import { Activity, GitCommit, Server, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GITHUB_URL } from "@/lib/constants";

type Stats = {
  publicRepos: number;
  followers: number;
  pushed: string | null;
  members: number | null;
  presence: number | null;
};

export function StatsWidget() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const born = Date.now();
    const id = window.setInterval(() => setUptime(Date.now() - born), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (mounted) setStats(d);
      })
      .catch(() => {
        if (mounted) {
          setStats({ publicRepos: 12, followers: 0, pushed: null, members: null, presence: null });
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const hours = Math.floor(uptime / 3600000);
  const mins = Math.floor((uptime % 3600000) / 60000);
  const secs = Math.floor((uptime % 60000) / 1000);
  const clock = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const cards = [
    {
      icon: GitCommit,
      label: "Public Repos",
      value: stats ? String(stats.publicRepos) : "—",
      href: GITHUB_URL,
    },
    {
      icon: Activity,
      label: "GitHub Followers",
      value: stats ? String(stats.followers) : "—",
      href: GITHUB_URL,
    },
    {
      icon: Users,
      label: "Discord Members",
      value: stats?.members != null ? String(stats.members) : "LIVE",
      href: undefined,
    },
    {
      icon: Server,
      label: "Session Uptime",
      value: clock,
      href: undefined,
    },
  ];

  return (
    <section id="stats" className="relative mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">Telemetry</p>
      <h2 className="mt-3 font-display text-4xl text-white text-glow-white md:text-5xl">Realtime Stats</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <GlassCard key={card.label} className="p-5">
            <card.icon className="text-[var(--accent)]" size={18} />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{card.label}</p>
            <p className="mt-1 font-display text-3xl text-white">{card.value}</p>
            {stats?.pushed && card.label === "Public Repos" && (
              <p className="mt-2 text-[11px] text-white/40">Last push synced from GitHub</p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
