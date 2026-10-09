import { NextResponse } from "next/server";
import { DISCORD_USERNAME, DISCORD_USER_ID, DISPLAY_NAME } from "@/lib/constants";
import { emptyPresence, type LanyardData } from "@/lib/lanyard";

export const dynamic = "force-dynamic";

type JapiUser = {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  discriminator: string;
};

async function fetchLanyard(): Promise<LanyardData | null> {
  const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { success?: boolean; data?: LanyardData };
  return json.success && json.data ? json.data : null;
}

async function fetchDiscordProfile(): Promise<LanyardData["discord_user"]> {
  try {
    const res = await fetch(`https://japi.rest/discord/v1/user/${DISCORD_USER_ID}`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: JapiUser };
      const u = json.data;
      if (u?.id) {
        return {
          id: u.id,
          username: DISCORD_USERNAME,
          global_name: DISPLAY_NAME,
          avatar: "/nexbro.jpg",
          discriminator: u.discriminator ?? "0",
          display_name: DISPLAY_NAME,
        };
      }
    }
  } catch {
    /* static fallback below */
  }

  return {
    id: DISCORD_USER_ID,
    username: DISCORD_USERNAME,
    global_name: DISPLAY_NAME,
    avatar: "/nexbro.jpg",
    discriminator: "0",
    display_name: DISPLAY_NAME,
  };
}

export async function GET() {
  const [lanyard, profile] = await Promise.all([fetchLanyard(), fetchDiscordProfile()]);

  if (lanyard?.discord_user) {
    lanyard.discord_user.global_name = DISPLAY_NAME;
    lanyard.discord_user.display_name = DISPLAY_NAME;
    lanyard.discord_user.username = DISCORD_USERNAME;
    lanyard.discord_user.avatar = "/nexbro.jpg";
    return NextResponse.json({ success: true, data: lanyard, source: "lanyard" });
  }

  return NextResponse.json({
    success: true,
    data: emptyPresence(profile),
    source: "profile",
  });
}
