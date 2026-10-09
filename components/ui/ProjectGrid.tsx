"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { PROJECTS, type Project, type ProjectCategory } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/cn";

const FILTERS: ProjectCategory[] = ["All", "Desktop", "Web", "Game Mods", "Utilities"];

export function ProjectGrid() {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [preview, setPreview] = useState<Project | null>(null);
  const items = PROJECTS.filter((p) => filter === "All" || p.category === filter);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">Ecosystem</p>
      <h2 className="mt-3 font-display text-4xl text-white text-glow-white md:text-6xl">Project Matrix</h2>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition",
              filter === f
                ? "border-[var(--accent)] bg-[var(--accent)]/15 text-white shadow-glow-sm"
                : "border-white/10 text-white/50 hover:text-white",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <GlassCard className="flex h-full flex-col p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{project.category}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{project.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ y: -2 }}
                      className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <MagneticButton href={project.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-[11px]">
                    <ExternalLink size={14} /> Repo
                  </MagneticButton>
                  <MagneticButton onClick={() => setPreview(project)} className="flex items-center gap-2 px-4 py-2 text-[11px]">
                    <Play size={14} /> Preview
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a]"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--accent)]/30 via-black to-black">
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_20%,var(--accent),transparent_45%)] opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl" />
                </div>
                <p className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                  Simulated reel · {preview.category}
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-white">{preview.title}</h3>
                <p className="mt-2 text-sm text-white/60">{preview.preview}</p>
                <div className="mt-5 flex gap-3">
                  <MagneticButton href={preview.href} target="_blank" rel="noreferrer">
                    Open GitHub
                  </MagneticButton>
                  <MagneticButton onClick={() => setPreview(null)}>Close</MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
