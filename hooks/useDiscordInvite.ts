"use client";

import { SITE } from "@/lib/site";
import { useEffect, useState } from "react";

export function useDiscordInvite() {
  const [online, setOnline] = useState<number | null>(null);
  const [members, setMembers] = useState<number | null>(null);
  const [guildName, setGuildName] = useState("NEX BRO");

  useEffect(() => {
    let live = true;
    fetch(
      `https://discord.com/api/v10/invites/${SITE.discordInviteCode}?with_counts=true`,
    )
      .then((r) => r.json())
      .then(
        (json: {
          guild?: { name?: string };
          approximate_presence_count?: number;
          approximate_member_count?: number;
        }) => {
          if (!live) return;
          setOnline(json.approximate_presence_count ?? null);
          setMembers(json.approximate_member_count ?? null);
          if (json.guild?.name) {
            const clean = json.guild.name.replace(/SHDX|SHADOW\s*X/gi, "NEX BRO");
            setGuildName(clean);
          }
        },
      )
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  return { online, members, guildName };
}
