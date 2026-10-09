"use client";

import { type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useScrollTilt } from "@/hooks/useScrollTilt";

export function GlassCard({
  children,
  className,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const tiltRef = useScrollTilt<HTMLDivElement>();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={tilt ? tiltRef : undefined}
      onMouseMove={onMove}
      style={{ transformStyle: "preserve-3d" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition",
        "hover:border-[color-mix(in_srgb,var(--accent)_55%,white)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--accent) 18%, transparent), transparent 42%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
