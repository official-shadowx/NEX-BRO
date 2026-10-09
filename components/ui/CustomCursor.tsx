"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { usePointer } from "@/hooks/usePointer";
import { usePrefersFinePointer, type CursorMode } from "@/hooks/useInteraction";
import { cn } from "@/lib/cn";

type Particle = { x: number; y: number; life: number; id: number };

export function CustomCursor() {
  const fine = usePrefersFinePointer();
  const { x, y, hovering } = usePointer();
  const [mode, setMode] = useState<CursorMode>("aura");
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.4 });
  const tx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.7 });
  const ty = useSpring(y, { stiffness: 120, damping: 22, mass: 0.7 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    sx.set(x);
    sy.set(y);
    tx.set(x);
    ty.set(y);
  }, [x, y, sx, sy, tx, ty]);

  useEffect(() => {
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");
    return () => document.body.classList.remove("has-custom-cursor");
  }, [fine]);

  useEffect(() => {
    if (mode !== "trail" || !fine) return;
    const p: Particle = { x, y, life: 1, id: idRef.current++ };
    setParticles((prev) => [...prev.slice(-18), p]);
  }, [x, y, mode, fine]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({ ...p, life: p.life - 0.08 })).filter((p) => p.life > 0),
      );
    }, 40);
    return () => window.clearInterval(id);
  }, []);

  if (!fine) return null;

  return (
    <>
      <div className="pointer-events-none fixed right-4 top-20 z-[80] hidden md:flex">
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
          {(["pointer", "aura", "trail"] as CursorMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
                mode === m ? "bg-white/15 text-white" : "text-white/50 hover:text-white",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "trail" &&
        particles.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none fixed z-[70] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: p.x,
              top: p.y,
              opacity: p.life,
              background: "var(--accent)",
              boxShadow: `0 0 12px var(--accent)`,
              transform: `translate(-50%, -50%) scale(${p.life})`,
            }}
          />
        ))}

      <motion.div
        className="pointer-events-none fixed z-[71] hidden md:block"
        style={{ left: tx, top: ty, x: "-50%", y: "-50%" }}
      >
        <div
          className={cn(
            "rounded-full border border-white/25 transition-all duration-200",
            hovering ? "h-12 w-12" : "h-9 w-9",
            mode === "pointer" && "opacity-40",
          )}
          style={{
            boxShadow: mode === "aura" || mode === "trail" ? "0 0 24px var(--accent)" : undefined,
            background:
              mode === "aura"
                ? "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)"
                : "transparent",
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed z-[72] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:block"
        style={{ left: sx, top: sy, x: "-50%", y: "-50%", boxShadow: "0 0 12px #fff" }}
      />
    </>
  );
}
