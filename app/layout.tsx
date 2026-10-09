import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Syne } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEX BRO — @official-shadowx",
  description:
    "16-year-old full-stack engineer, C#/.NET systems developer, Python backend architect, Fabric Minecraft modder, and phonk/aura motion designer.",
  metadataBase: new URL("https://github.com/official-shadowx"),
  openGraph: {
    title: "NEX BRO",
    description: "Ghost in the machine. Code in the dark.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body className="bg-obsidian antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
