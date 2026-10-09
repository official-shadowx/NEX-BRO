import { NextResponse } from "next/server";
import { DISCORD_INVITE_CODE, GITHUB_USER } from "@/lib/constants";

export const revalidate = 60;

export async function GET() {
  let publicRepos = 0;
  let followers = 0;
  let pushed: string | null = null;
  let members: number | null = null;
  let presence: number | null = null;

  try {
    const gh = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (gh.ok) {
      const json = (await gh.json()) as {
        public_repos: number;
        followers: number;
        updated_at: string;
      };
      publicRepos = json.public_repos;
      followers = json.followers;
      pushed = json.updated_at;
    }
  } catch {
    /* degrade */
  }

  try {
    const invite = await fetch(
      `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`,
      { next: { revalidate: 60 } },
    );
    if (invite.ok) {
      const json = (await invite.json()) as {
        approximate_member_count?: number;
        approximate_presence_count?: number;
      };
      members = json.approximate_member_count ?? null;
      presence = json.approximate_presence_count ?? null;
    }
  } catch {
    /* degrade */
  }

  return NextResponse.json({ publicRepos, followers, pushed, members, presence });
}
