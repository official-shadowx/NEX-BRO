"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOODS, type MoodId } from "@/lib/constants";

type MoodContextValue = {
  mood: MoodId;
  setMood: (id: MoodId) => void;
  accent: string;
  soft: string;
};

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<MoodId>("pink");

  const setMood = useCallback((id: MoodId) => {
    setMoodState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("shadowx-mood", id);
    }
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("shadowx-mood") as MoodId | null;
    if (stored && MOODS.some((m) => m.id === stored)) {
      setMoodState(stored);
    }
  }, []);

  const palette = MOODS.find((m) => m.id === mood) ?? MOODS[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent-soft", palette.soft);
    root.dataset.mood = palette.id;
  }, [palette]);

  const value = useMemo(
    () => ({ mood, setMood, accent: palette.accent, soft: palette.soft }),
    [mood, palette, setMood],
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
}
