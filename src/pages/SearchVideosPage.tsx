import { useEffect, useState } from "react";
import { SEO } from "@/components/site/SEO";
import { hs } from "@/lib/persona-analytics";
import { Hero } from "@/components/search-videos/Hero";
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

export default function SearchVideosPage() {
  const [usecases, setUsecases] = useState<Usecase[]>([]);
  const [sizeBand, setSizeBand] = useState<SizeBand | null>(null);
  const [plan, setPlan] = useState<PlanId>("free");

  useEffect(() => {
    hs("hs_page_view");
  }, []);

  return (
    <div className="sv-page min-h-screen bg-[hsl(var(--sv-bg))] font-sans text-[hsl(var(--sv-fg))]">
      <SEO
        title="HearSeek: Find Anything Inside Your Videos"
        description="Search your videos and podcasts by meaning and jump to the exact moment. Try it free."
        path="/search-videos"
        author="HearSeek"
        image="/og/search-videos.png"
      />

      <Hero />
      <LiveDemo />
      <HowItWorks />
      <Selectors
        usecases={usecases}
        onUsecases={setUsecases}
        sizeBand={sizeBand}
        onSizeBand={setSizeBand}
      />
      <Pricing plan={plan} onPlan={setPlan} />
      <Onboarding plan={plan} />
      <PageFooter />
    </div>
  );
}
