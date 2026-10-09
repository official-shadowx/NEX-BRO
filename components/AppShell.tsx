"use client";

import dynamic from "next/dynamic";
import { MoodProvider } from "@/hooks/useMood";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { MoodSwitcher } from "@/components/ui/MoodSwitcher";
import { type ReactNode } from "react";

const BackgroundFog = dynamic(
  () => import("@/components/ui/BackgroundFog").then((m) => m.BackgroundFog),
  { ssr: false },
);

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MoodProvider>
      <BackgroundFog />
      <CustomCursor />
      <MoodSwitcher />
      <div className="relative z-10">{children}</div>
      <AudioPlayer />
    </MoodProvider>
  );
}
