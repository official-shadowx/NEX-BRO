export const DISCORD_USER_ID = "1196692108581535814";
export const DISCORD_INVITE = "https://discord.gg/sy6YNgJmgx";
export const DISCORD_INVITE_CODE = "sy6YNgJmgx";
export const DISCORD_USERNAME = "imran046529";
/** Cached hash used if live lookup is slow; refreshed from Discord user APIs. */
export const DISCORD_AVATAR_HASH = "1c67cf8bcae8f47572e1f1020a389d6b";
export const GITHUB_URL = "https://github.com/official-shadowx";
export const GITHUB_USER = "official-shadowx";
export const DISPLAY_NAME = "NEX BRO";
export const HANDLE = "@official-shadowx";

export const MOODS = [
  { id: "pink", label: "Phonk Pink", accent: "#ff3cac", soft: "#ff7ad9" },
  { id: "cyan", label: "Cyber Cyan", accent: "#22d3ee", soft: "#67e8f9" },
  { id: "white", label: "Neon White", accent: "#f8fafc", soft: "#e2e8f0" },
  { id: "emerald", label: "Emerald", accent: "#34d399", soft: "#6ee7b7" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export type ProjectCategory = "All" | "Desktop" | "Web" | "Game Mods" | "Utilities";

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  category: Exclude<ProjectCategory, "All">;
  tags: string[];
  href: string;
  preview: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "shadowx-auth",
    title: "SHADOW-X AUTH CORE",
    blurb:
      "Multi-language authentication kernel spanning C#, C++, Java, and Python — dark-mode desktop architecture with hardened session flow.",
    category: "Desktop",
    tags: ["C#", "C++", "Python", "WinForms"],
    href: "https://github.com/official-shadowx/SHADOW-X-AUTH-ALL-CS-FILE-",
    preview:
      "GDI+ framed login surfaces, encrypted token handoff, and a brutalist dark UI built for local systems work.",
  },
  {
    slug: "net-dark-ui",
    title: "OBSIDIAN DESKTOP SUITE",
    blurb:
      "WinForms + GDI+ graphics engine experiments: custom titlebars, neon stroke rendering, and low-level Windows UI control.",
    category: "Desktop",
    tags: [".NET", "GDI+", "WinForms"],
    href: GITHUB_URL,
    preview: "Hardware-adjacent drawing loops, custom paint events, and cinematic dark chrome.",
  },
  {
    slug: "flask-fire",
    title: "FLASK / FIREBASE BACKBONE",
    blurb:
      "Python API servers with Flask, real-time listeners, and Firebase-backed persistence for live web ecosystems.",
    category: "Web",
    tags: ["Python", "Flask", "Firebase"],
    href: GITHUB_URL,
    preview: "REST + websocket-ready backends, auth gates, and live data sync.",
  },
  {
    slug: "sea-level",
    title: "SEA LEVEL PREDICTOR",
    blurb:
      "Statistical modeling over NOAA-style time series — regression, visualization, and scientific Python tooling.",
    category: "Web",
    tags: ["Python", "Pandas", "Matplotlib"],
    href: "https://github.com/official-shadowx/sea-level--predictor",
    preview: "Linear + quadratic trend overlays on global sea-level data.",
  },
  {
    slug: "time-series",
    title: "TIME SERIES VISUALIZER",
    blurb:
      "Page-view analytics rendered as heatmaps, box plots, and line series for forensic web traffic reading.",
    category: "Utilities",
    tags: ["Python", "Seaborn", "NumPy"],
    href: "https://github.com/official-shadowx/time-series-visualizer",
    preview: "Calendar heatmaps and distribution plots from raw CSV telemetry.",
  },
  {
    slug: "medical-viz",
    title: "MEDICAL DATA VISUALIZER",
    blurb:
      "Clinical dataset exploration with categorical plots, correlation matrices, and health-metric dashboards.",
    category: "Utilities",
    tags: ["Python", "Pandas", "Data Viz"],
    href: "https://github.com/official-shadowx/medical-data--visualizer",
    preview: "Normalized health features mapped into high-contrast scientific charts.",
  },
  {
    slug: "fabric-pvp",
    title: "FABRIC 1.21.1 COMBAT MOD",
    blurb:
      "Minecraft Fabric 1.21.1 custom items, PvP mechanics, and GFX particle systems compiled against Yarn mappings.",
    category: "Game Mods",
    tags: ["Java", "Fabric", "1.21.1"],
    href: GITHUB_URL,
    preview: "Custom weapons, knockback curves, and client-side aura VFX for competitive servers.",
  },
  {
    slug: "phonk-edits",
    title: "PHONK / AURA MONTAGE ENGINE",
    blurb:
      "Premiere Pro + CapCut motion design: beat-synced transitions, glow-bleed titles, and high-contrast gaming edits.",
    category: "Utilities",
    tags: ["Premiere", "CapCut", "Motion"],
    href: GITHUB_URL,
    preview: "Frame-perfect phonk cuts, lens flares, and montagem typography stacks.",
  },
];

export const JOURNEY = [
  {
    year: "01",
    title: "C# & .NET Engineering",
    subtitle: "Desktop systems. Dark chrome. Native paint.",
    body: "WinForms UI architecture, GDI+ graphics rendering, and dark-mode desktop applications built close to the Windows graphics stack.",
    tags: ["C#", ".NET", "WinForms", "GDI+"],
  },
  {
    year: "02",
    title: "Python & Full-Stack Web",
    subtitle: "Flask servers. Firebase fire. Live APIs.",
    body: "Flask backends, API integrations, Firebase architecture, and real-time web application servers that stay hot under load.",
    tags: ["Python", "Flask", "Firebase"],
  },
  {
    year: "03",
    title: "Game Modding",
    subtitle: "Fabric 1.21+. Combat. GFX.",
    body: "Minecraft Fabric 1.21.1 custom items, PvP mechanics, and client GFX systems compiled into drop-in mods.",
    tags: ["Fabric", "Java", "PvP"],
  },
  {
    year: "04",
    title: "Motion Design & Content",
    subtitle: "Phonk timing. Aura glow. Cut on the kick.",
    body: "Premiere Pro and CapCut short-form editing — audio timing, phonk/aura transitions, and montagem-grade type glow.",
    tags: ["Premiere", "CapCut", "Phonk"],
  },
];
