"use client";

import { AtmosphereProvider } from "@/components/providers/AtmosphereProvider";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MoodSwitcher } from "@/components/ui/MoodSwitcher";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const Fog = dynamic(
  () => import("@/components/ui/BackgroundFog").then((m) => m.BackgroundFog),
  { ssr: false },
);

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AtmosphereProvider>
      <Fog />
      <MoodSwitcher />
      <CustomCursor />
      {children}
      <AudioPlayer />
    </AtmosphereProvider>
  );
}
