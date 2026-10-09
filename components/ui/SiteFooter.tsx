"use client";

import { DISCORD_INVITE, DISPLAY_NAME, GITHUB_URL, HANDLE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative mx-auto max-w-6xl px-6 pb-32 pt-8 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">
        {DISPLAY_NAME} · {HANDLE} · Built for the dark ·{" "}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
          GitHub
        </a>
        {" · "}
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
          Discord
        </a>
      </p>
    </footer>
  );
}
