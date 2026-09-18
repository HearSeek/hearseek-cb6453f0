import { useEffect, useState } from "react";
import { SEO } from "@/components/site/SEO";
import { Hero } from "@/components/search-videos/Hero";
import { LiveDemo } from "@/components/search-videos/LiveDemo";
import { HowItWorks, type HowItWorksCopy } from "@/components/search-videos/HowItWorks";
import {
  Selectors,
  type SizeBand,
  type Usecase,
} from "@/components/search-videos/Selectors";
import { Pricing, type PlanId } from "@/components/search-videos/Pricing";
import { Onboarding } from "@/components/search-videos/Onboarding";
import { PageFooter } from "@/components/search-videos/PageFooter";
import { hs, type Persona } from "@/lib/persona-analytics";

type PersonaLandingConfig = {
  persona: Exclude<Persona, "creator">;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  ctaLabel: string;
  howItWorks: HowItWorksCopy;
};

const pages = {
  research: {
    persona: "research",
    path: "/search-interviews",
    title: "HearSeek: Search Interviews and Recordings",
    description:
      "Locate every discussion of a topic across hours of interviews, news, and documentaries, even when different words were used.",
    eyebrow: "FOR RESEARCHERS & JOURNALISTS",
    headline: "Find Any Theme Across Your Interviews and Recordings",
    subhead:
      "Locate every discussion of a topic across hours of interviews, news, and documentaries, even when different words were used. Exact source and timestamp, every time.",
    ctaLabel: "Make my recordings searchable",
    howItWorks: {
      step1Title: "Step 1: Add your recordings or URLs",
      step1Body: "Add your recordings or URLs.",
      step3Title: "Step 3: Search by meaning across the whole set",
      step3Body: "Search by meaning across the whole set.",
    },
  },
  editor: {
    persona: "editor",
    path: "/search-raw",
    title: "HearSeek: Search Raw Footage",
    description:
      "Describe the line or topic you need and land on the source moment, without scrubbing through hours of footage.",
    eyebrow: "FOR VIDEO EDITORS",
    headline: "Find Any Moment in Your Raw Footage",
    subhead:
      "Describe the line or topic you need and land on the source moment, without scrubbing through hours of footage.",
    ctaLabel: "Make my footage searchable",
    howItWorks: {
      step1Title: "Step 1: Add your footage",
      step1Body: "Add your footage.",
      step3Title: "Step 3: Search a line and jump to the source clip",
      step3Body: "Search a line and jump to the source clip.",
    },
  },
  educator: {
    persona: "educator",
    path: "/search-lectures",
    title: "HearSeek: Search Every Lecture",
    description:
      "Let students search a question or concept and jump straight to where it was explained, across an entire course of recordings.",
    eyebrow: "FOR EDUCATORS",
    headline: "Make Every Lecture Searchable",
    subhead:
      "Let students search a question or concept and jump straight to where it was explained, across an entire course of recordings.",
    ctaLabel: "Make my lectures searchable",
    howItWorks: {
      step1Title: "Step 1: Add your lecture recordings",
      step1Body: "Add your lecture recordings.",
      step3Title: "Step 3: Students find any concept in seconds",
      step3Body: "Students find any concept in seconds.",
    },
  },
} satisfies Record<string, PersonaLandingConfig>;

function PersonaLandingPage({ config }: { config: PersonaLandingConfig }) {
  const [usecases, setUsecases] = useState<Usecase[]>([]);
  const [sizeBand, setSizeBand] = useState<SizeBand | null>(null);
  const [plan, setPlan] = useState<PlanId>("free");

  useEffect(() => {
    hs("hs_page_view", {}, config.persona);
  }, [config.persona]);

  return (
    <div className="sv-page min-h-screen bg-[hsl(var(--sv-bg))] font-sans text-[hsl(var(--sv-fg))]">
      <SEO
        title={config.title}
        description={config.description}
        path={config.path}
        author="HearSeek"
        image="/og/search-videos.png"
      />

      <Hero
        eyebrow={config.eyebrow}
        headline={config.headline}
        subhead={config.subhead}
        ctaLabel={config.ctaLabel}
        persona={config.persona}
      />
      <LiveDemo persona={config.persona} />
      <HowItWorks copy={config.howItWorks} />
      <Selectors
        usecases={usecases}
        onUsecases={setUsecases}
        sizeBand={sizeBand}
        onSizeBand={setSizeBand}
        persona={config.persona}
      />
      <Pricing plan={plan} onPlan={setPlan} persona={config.persona} />
      <Onboarding plan={plan} ctaLabel={config.ctaLabel} persona={config.persona} />
      <PageFooter ctaLabel={config.ctaLabel} persona={config.persona} />
    </div>
  );
}

export function SearchInterviewsPage() {
  return <PersonaLandingPage config={pages.research} />;
}

export function SearchRawPage() {
  return <PersonaLandingPage config={pages.editor} />;
}

export function SearchLecturesPage() {
  return <PersonaLandingPage config={pages.educator} />;
}