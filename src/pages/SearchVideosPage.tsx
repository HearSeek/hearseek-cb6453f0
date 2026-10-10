import { useEffect, useState } from "react";
import { useEngagementTracking } from "@/hooks/use-engagement-tracking";
import { SEO } from "@/components/site/SEO";
import { hs } from "@/lib/persona-analytics";
import { CompactHero, Benefits, Faq } from "@/components/search-videos/CompactHero";
import { LiveDemo } from "@/components/search-videos/LiveDemo";
import { HowItWorks } from "@/components/search-videos/HowItWorks";
import {
  Selectors,
  type SizeBand,
  type Usecase,
} from "@/components/search-videos/Selectors";
import { Pricing, type PlanId } from "@/components/search-videos/Pricing";
import { Onboarding } from "@/components/search-videos/Onboarding";
import { PageFooter } from "@/components/search-videos/PageFooter";

const DEMO = {
  query: "when did I talk about burnout?",
  title: "Episode 42 · Taking a break",
  snippet: "Honestly, I hit a wall last spring and had to step back for a month.",
  timestamp: "18:42",
};

const BENEFITS = [
  "Search every video by topic, not just titles.",
  "Jump straight to the exact moment.",
  "Works in any language.",
];

const FAQ = [
  { q: "What can I search?", a: "Your YouTube channel, playlists, podcasts or single video links." },
  { q: "Do I need the exact words?", a: "No. Search by meaning. Half-remembered is fine." },
  { q: "Which languages work?", a: "We index every spoken word, in any language." },
  { q: "What does it cost to start?", a: "Nothing. Your first 3 hours of video are free." },
];

export default function SearchVideosPage() {
  const [usecases, setUsecases] = useState<Usecase[]>([]);
  const [sizeBand, setSizeBand] = useState<SizeBand | null>(null);
  const [plan, setPlan] = useState<PlanId>("free");

  useEffect(() => {
    hs("hs_page_view");
  }, []);
  useEngagementTracking();

  return (
    <div className="sv-page min-h-screen bg-[hsl(var(--sv-bg))] font-sans text-[hsl(var(--sv-fg))]">
      <SEO
        title="HearSeek: Find Anything Inside Your Videos"
        description="Search your videos and podcasts by meaning and jump to the exact moment. Try it free."
        path="/search-videos"
        author="HearSeek"
        image="/og/search-videos-og-v2.png"
        imageAlt="HearSeek: Find Anything Inside Your Videos"
      />

      <CompactHero
        headline="Find Anything You've Ever Said"
        subhead="Search your videos by topic and jump to the exact moment."
        demo={DEMO}
      />
      <Benefits items={BENEFITS} />
      <Pricing plan={plan} onPlan={setPlan} />
      <Onboarding plan={plan} usecases={usecases} sizeBand={sizeBand} />
      <LiveDemo facade />
      <HowItWorks />
      <div data-section="selectors">
        <Selectors
          usecases={usecases}
          onUsecases={setUsecases}
          sizeBand={sizeBand}
          onSizeBand={setSizeBand}
        />
      </div>
      <Faq items={FAQ} />
      <PageFooter />
    </div>
  );
}
