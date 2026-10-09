export const SITE = {
  name: "NEX BRO",
  handle: "@official-shadowx",
  age: 16,
  tagline: "16-Year-Old Full-Stack Engineer · Motion Architect",
  roles: [
    "Full-Stack Software Engineer",
    "C# / .NET Systems Developer",
    "Python Backend Architect",
    "Fabric Minecraft Modder",
    "Phonk / Aura Motion Designer",
  ],
  discordUserId: "1196692108581535814",
  discordUsername: "imran046529",
  discordInvite: "https://discord.gg/sy6YNgJmgx",
  discordInviteCode: "sy6YNgJmgx",
  github: "https://github.com/official-shadowx",
  githubUser: "official-shadowx",
} as const;

export type MoodId = "pink" | "cyan" | "white" | "emerald";

export const MOODS: Record<
  MoodId,
  { label: string; hex: string; rgb: string }
> = {
  pink: { label: "Phonk Pink", hex: "#ff2d95", rgb: "255, 45, 149" },
  cyan: { label: "Cyber Cyan", hex: "#22d3ee", rgb: "34, 211, 238" },
  white: { label: "Neon White", hex: "#f8fafc", rgb: "248, 250, 252" },
  emerald: { label: "Emerald", hex: "#34d399", rgb: "52, 211, 153" },
};

export type ProjectFilter = "all" | "desktop" | "web" | "mods" | "utilities";

export type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  filter: Exclude<ProjectFilter, "all">;
  preview: string;
};

export const PROJECTS: Project[] = [
  {
    id: "winforms-engine",
    title: "Obsidian Desktop Engine",
    description:
      "C# / .NET WinForms architecture with a custom GDI+ graphics pipeline, dark UI chrome, and high-refresh drawing loops.",
    href: "https://github.com/official-shadowx",
    tags: ["C#", ".NET", "WinForms", "GDI+"],
    filter: "desktop",
    preview:
      "Dark-mode desktop shell · custom paint cycles · glass panels · input routing.",
  },
  {
    id: "shadow-auth",
    title: "SHADOW-X AUTH Suite",
    description:
      "Multi-language auth surface spanning C#, C++, Java, and Python — desktop-first session tooling and file architecture.",
    href: "https://github.com/official-shadowx/SHADOW-X-AUTH-ALL-CS-FILE-",
    tags: ["C#", "C++", "Python"],
    filter: "desktop",
    preview: "Cross-language auth files · session flow · native desktop glue.",
  },
  {
    id: "flask-backends",
    title: "Flask / Firebase Backends",
    description:
      "Python Flask APIs, realtime sockets, and Firebase-backed architecture for live web applications.",
    href: "https://github.com/official-shadowx",
    tags: ["Python", "Flask", "Firebase"],
    filter: "web",
    preview: "REST + realtime · token sessions · Firebase data graphs.",
  },
  {
    id: "sea-level",
    title: "Sea Level Predictor",
    description:
      "Python data science pipeline that models historical tide data and forecasts long-horizon sea-level change.",
    href: "https://github.com/official-shadowx/sea-level--predictor",
    tags: ["Python", "Pandas", "SciPy"],
    filter: "web",
    preview: "Linear regression · NOAA-style datasets · matplotlib output.",
  },
  {
    id: "time-series",
    title: "Time Series Visualizer",
    description:
      "Page-view analytics visualizer with box plots, bar charts, and line overlays for seasonal traffic.",
    href: "https://github.com/official-shadowx/time-series-visualizer",
    tags: ["Python", "Matplotlib"],
    filter: "utilities",
    preview: "Seasonality plots · rolling windows · publication-ready charts.",
  },
  {
    id: "medical-viz",
    title: "Medical Data Visualizer",
    description:
      "Clinical dataset explorer with categorical breakdowns, heatmaps, and correlation matrices.",
    href: "https://github.com/official-shadowx/medical-data--visualizer",
    tags: ["Python", "Seaborn"],
    filter: "utilities",
    preview: "Health metrics · correlation heatmaps · categorical splits.",
  },
  {
    id: "fabric-pvp",
    title: "Fabric PvP 1.21.1",
    description:
      "Minecraft Fabric mod compiling custom items, combat cadence, and GFX systems for 1.21+ PvP.",
    href: "https://github.com/official-shadowx",
    tags: ["Java", "Fabric", "1.21.1"],
    filter: "mods",
    preview: "Custom items · hit-reg feel · particle GFX · mixin combat.",
  },
  {
    id: "phonk-edits",
    title: "Phonk / Aura Motion",
    description:
      "Premiere Pro + CapCut motion design: audio-locked cuts, glow stacks, and high-contrast montagem type.",
    href: "https://github.com/official-shadowx",
    tags: ["Premiere", "CapCut", "Motion"],
    filter: "utilities",
    preview: "Beat-synced cuts · neon type · aura trails · 24fps punch-ins.",
  },
  {
    id: "mean-var",
    title: "Mean-Variance Calculator",
    description:
      "Statistical utility computing mean, variance, standard deviation, and max/min across 3×3 matrices.",
    href: "https://github.com/official-shadowx/mean-variance-calculator",
    tags: ["Python", "NumPy"],
    filter: "utilities",
    preview: "Matrix stats · axis reductions · reusable compute helpers.",
  },
];
