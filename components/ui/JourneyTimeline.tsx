"use client";

import { JOURNEY } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";

export function JourneyTimeline() {
  return (
    <section id="journey" className="relative mx-auto max-w-6xl px-6 py-28">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">Protocol 16</p>
      <h2 className="mt-3 font-display text-4xl text-white text-glow-white md:text-6xl">The 16-Year-Old Dev Journey</h2>
      <p className="mt-4 max-w-xl text-white/55">
        Not a resume. A combat log — systems, servers, mods, and motion, stacked in sequence.
      </p>

      <div className="relative mt-16">
        <div className="absolute left-[19px] top-0 hidden h-full w-px bg-gradient-to-b from-[var(--accent)] via-white/20 to-transparent md:left-1/2 md:block" />
        <div className="space-y-10">
          {JOURNEY.map((node, i) => (
            <div
              key={node.title}
              className={`relative grid items-center gap-6 md:grid-cols-2 ${i % 2 === 1 ? "md:text-right" : ""}`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 md:justify-start" style={i % 2 === 1 ? { justifyContent: undefined } : undefined}>
                    <span className="font-mono text-sm text-[var(--accent)]">{node.year}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">{node.title}</h3>
                  <p className="mt-1 text-sm text-[var(--accent)]">{node.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{node.body}</p>
                  <div className={`mt-5 flex flex-wrap gap-2 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>
              <div className={`hidden md:block ${i % 2 === 1 ? "md:order-1" : ""}`} />
              <span className="absolute left-[11px] top-8 hidden h-5 w-5 rounded-full border border-[var(--accent)] bg-obsidian shadow-glow-sm md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
