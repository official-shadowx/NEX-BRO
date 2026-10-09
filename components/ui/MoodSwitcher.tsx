"use client";

import { motion } from "framer-motion";
import { MOODS } from "@/lib/constants";
import { useMood } from "@/hooks/useMood";
import { cn } from "@/lib/cn";

export function MoodSwitcher() {
  const { mood, setMood } = useMood();

  return (
    <div className="fixed inset-x-0 top-3 z-40 mx-auto flex w-fit max-w-[94vw] justify-center">
      <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/60 p-1.5 shadow-xl backdrop-blur-2xl">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMood(m.id)}
            className={cn(
                "relative shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition",
              mood === m.id && "text-white",
            )}
          >
            {mood === m.id && (
              <motion.span
                layoutId="mood-pill"
                className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: m.accent, boxShadow: `0 0 8px ${m.accent}` }} />
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
