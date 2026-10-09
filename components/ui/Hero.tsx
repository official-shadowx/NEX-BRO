"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { DiscordPresenceCard } from "@/components/ui/DiscordPresenceCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DISPLAY_NAME, GITHUB_URL, HANDLE } from "@/lib/constants";

export function Hero() {
  const scrollProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center px-6 pb-24 pt-36 sm:pt-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs uppercase tracking-[0.42em] text-white/45"
          >
            {HANDLE} · Age 16
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-display text-5xl leading-[0.92] text-white text-glow-white sm:text-7xl lg:text-8xl"
          >
            {DISPLAY_NAME}
            <span className="block text-[length:0.55em] text-white/80">ghost in the machine.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            Full-stack engineer. C# / .NET systems architect. Python backend builder. Fabric Minecraft modder.
            Phonk / Aura motion artist.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton onClick={scrollProjects}>Explore Ecosystem</MagneticButton>
            <MagneticButton href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <Github size={16} /> View GitHub
            </MagneticButton>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, type: "spring" }}
          className="animate-floaty"
        >
          <DiscordPresenceCard />
        </motion.div>
      </div>
    </section>
  );
}
