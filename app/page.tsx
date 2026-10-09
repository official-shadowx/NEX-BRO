import { Hero } from "@/components/ui/Hero";
import { JourneyTimeline } from "@/components/ui/JourneyTimeline";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { StatsWidget } from "@/components/ui/StatsWidget";
import { DiscordCommunity } from "@/components/ui/DiscordCommunity";
import { SiteFooter } from "@/components/ui/SiteFooter";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <JourneyTimeline />
      <ProjectGrid />
      <StatsWidget />
      <DiscordCommunity />
      <SiteFooter />
    </main>
  );
}
