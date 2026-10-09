export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type LanyardSpotify = {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
  timestamps?: { start: number; end: number };
};

export type LanyardActivity = {
  id: string;
  name: string;
  type: number;
  details?: string | null;
  state?: string | null;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
};

export type LanyardData = {
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    discriminator: string;
    display_name?: string | null;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
};

export type LanyardState = {
  loading: boolean;
  connected: boolean;
  data: LanyardData | null;
};

export function avatarCdnUrl(userId: string, hash: string | null | undefined, size = 256) {
  if (!hash) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(userId) >> BigInt(22)) % 6}.png`;
  }
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=${size}`;
}

/** Same-origin proxy — Discord CDN often 403s when the browser sends a Referer. */
export function avatarUrl(userId: string, hash: string | null | undefined) {
  if (!hash || hash === "/nexbro.jpg") {
    return "/nexbro.jpg";
  }
  const q = new URLSearchParams({ id: userId, size: "256" });
  q.set("hash", hash);
  return `/api/discord/avatar?${q.toString()}`;
}

export function emptyPresence(user: LanyardData["discord_user"]): LanyardData {
  return {
    discord_user: user,
    discord_status: "offline",
    activities: [],
    listening_to_spotify: false,
    spotify: null,
    active_on_discord_desktop: false,
    active_on_discord_mobile: false,
    active_on_discord_web: false,
  };
}

export function statusMeta(status: DiscordStatus | undefined) {
  switch (status) {
    case "online":
      return { label: "Online", className: "bg-emerald-400 shadow-[0_0_12px_#34d399]" };
    case "idle":
      return { label: "Idle", className: "bg-amber-400 shadow-[0_0_12px_#fbbf24]" };
    case "dnd":
      return { label: "Do Not Disturb", className: "bg-rose-500 shadow-[0_0_12px_#f43f5e]" };
    default:
      return { label: "Offline", className: "bg-zinc-500 shadow-[0_0_8px_#71717a]" };
  }
}

export type PresenceActivity = {
  kind: "spotify" | "game" | "custom";
  title: string;
  subtitle: string;
  art: string | null;
  album: string | null;
};

export function primaryActivity(data: LanyardData | null): PresenceActivity | null {
  if (!data) return null;
  if (data.listening_to_spotify && data.spotify) {
    return {
      kind: "spotify" as const,
      title: data.spotify.song,
      subtitle: data.spotify.artist,
      art: data.spotify.album_art_url,
      album: data.spotify.album,
    };
  }
  const game = data.activities.find((a) => a.type === 0);
  if (game) {
    return {
      kind: "game" as const,
      title: game.name,
      subtitle: game.details ?? game.state ?? "In-game",
      art: null as string | null,
      album: game.assets?.large_text ?? null,
    };
  }
  const custom = data.activities.find((a) => a.type === 4);
  if (custom?.state) {
    return {
      kind: "custom" as const,
      title: "Status",
      subtitle: custom.state,
      art: null as string | null,
      album: null,
    };
  }
  return null;
}
