"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useClickTone } from "@/hooks/useInteraction";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  target?: string;
  rel?: string;
};

export function MagneticButton({ children, className, onClick, href, type = "button", target, rel }: Props) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const tone = useClickTone();

  const spawn = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const next = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((r) => [...r, next]);
    tone();
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== next.id)), 650);
    onClick?.();
  };

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]"
            style={{ left: r.x, top: r.y, boxShadow: "0 0 24px var(--accent)" }}
          />
        ))}
      </AnimatePresence>
    </>
  );

  const cls = cn(
    "relative overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 font-display text-sm uppercase tracking-[0.18em] text-white backdrop-blur-xl transition hover:border-[var(--accent)] hover:shadow-glow-sm",
    className,
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={spawn}
        className={cls}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={spawn} className={cls}>
      {inner}
    </motion.button>
  );
}
