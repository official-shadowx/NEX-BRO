"use client";

import { MOODS, type MoodId } from "@/lib/site";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorMode = "pointer" | "aura" | "trail";

type Atmosphere = {
  mood: MoodId;
  setMood: (id: MoodId) => void;
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
};

const AtmosphereContext = createContext<Atmosphere | null>(null);

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<MoodId>("pink");
  const [cursorMode, setCursorMode] = useState<CursorMode>("aura");

  const setMood = useCallback((id: MoodId) => {
    setMoodState(id);
  }, []);

  useEffect(() => {
    const m = MOODS[mood];
    const root = document.documentElement;
    root.style.setProperty("--accent", m.hex);
    root.style.setProperty("--accent-rgb", m.rgb);
    root.dataset.mood = mood;
  }, [mood]);

  const value = useMemo(
    () => ({ mood, setMood, cursorMode, setCursorMode }),
    [mood, setMood, cursorMode],
  );

  return (
    <AtmosphereContext.Provider value={value}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) throw new Error("useAtmosphere must be used within AtmosphereProvider");
  return ctx;
}
