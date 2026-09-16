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
import { CtaButton } from "@/components/search-videos/CtaButton";
import { Onboarding } from "@/components/search-videos/Onboarding";
import { PageFooter } from "@/components/search-videos/PageFooter";

export default function SearchVideosPage() {
  const [usecase, setUsecase] = useState<Usecase | null>(null);
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
        usecase={usecase}
        onUsecase={setUsecase}
        sizeBand={sizeBand}
        onSizeBand={setSizeBand}
      />
      <Pricing plan={plan} onPlan={setPlan} />

      {/* Mid-page CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 text-center md:pb-32">
        <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
          Ready to search your own archive?
        </h2>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton location="mid">Create my searchable library</CtaButton>
          <p className="text-sm text-[hsl(var(--sv-muted))]">
            Free on up to 3 hours of video
          </p>
        </div>
      </section>

      <Onboarding plan={plan} />
      <PageFooter />
    </div>
  );
}
