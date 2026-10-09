"use client";

import { SITE } from "@/lib/site";
import { useEffect, useState } from "react";

export type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  name: string;
  loading: boolean;
};

export function useGithubStats() {
  const [stats, setStats] = useState<GithubStats>({
    publicRepos: 0,
    followers: 0,
    following: 0,
    name: SITE.name,
    loading: true,
  });

  useEffect(() => {
    let live = true;
    fetch(`https://api.github.com/users/${SITE.githubUser}`)
      .then((r) => r.json())
      .then((json: { public_repos?: number; followers?: number; following?: number; name?: string }) => {
        if (!live) return;
        setStats({
          publicRepos: json.public_repos ?? 0,
          followers: json.followers ?? 0,
          following: json.following ?? 0,
          name: json.name ?? SITE.name,
          loading: false,
        });
      })
      .catch(() => {
        if (live) setStats((s) => ({ ...s, loading: false }));
      });
    return () => {
      live = false;
    };
  }, []);

  return stats;
}
