import { useEffect, useState } from "react";
import { useEngagementTracking } from "@/hooks/use-engagement-tracking";
import { SEO } from "@/components/site/SEO";
import { CompactHero, Benefits, Faq } from "@/components/search-videos/CompactHero";
import type { HeroDemoCopy } from "@/components/search-videos/HeroDemo";
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
  image: string;
  demoVideoId: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  demo: HeroDemoCopy;
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
    image: "/og/search-interviews-og-v2.png",
    demoVideoId: "MUxTTTwua-M",
    eyebrow: "FOR RESEARCHERS & JOURNALISTS",
    headline: "Find Any Theme Across Your Interviews and Recordings",
    subhead:
      "Search interviews by theme. Find the source moment.",
    demo: {
      query: "what did they say about trust?",
      title: "Interview recording",
      snippet: "It took time to feel comfortable sharing what really happened.",
      timestamp: "12:34",
    },
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
    demo: {
      query: "the line about starting over",
      title: "Raw footage",
      snippet: "We decided to begin again and try a different approach.",
      timestamp: "08:16",
    },
    image: "/og/search-raw-og-v2.png",
    demoVideoId: "Z-UCbmzzvm4",
    eyebrow: "FOR VIDEO EDITORS",
    headline: "Find Any Moment in Your Raw Footage",
    subhead:
      "Search raw footage by topic. Find the source clip.",
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
    demo: {
      query: "how does active recall work?",
      title: "Lecture recording",
      snippet: "Retrieving an idea from memory strengthens what you have learned.",
      timestamp: "21:08",
    },
    image: "/og/search-lectures-og-v2.png",
    demoVideoId: "u6j0IrXpp_o",
    eyebrow: "FOR EDUCATORS",
    headline: "Make Every Lecture Searchable",
    subhead:
      "Search lectures by concept. Find the explanation.",
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
  useEngagementTracking(config.persona);

  return (
    <div className="sv-page min-h-screen bg-[hsl(var(--sv-bg))] font-sans text-[hsl(var(--sv-fg))]">
      <SEO
        title={config.title}
        description={config.description}
        path={config.path}
        author="HearSeek"
        image={config.image}
        imageAlt={config.title}
      />

      <CompactHero
        headline={config.headline}
        subhead={config.subhead}
        demo={config.demo}
        persona={config.persona}
      />
      <Benefits items={[
        config.persona === "research" ? "Search interviews by theme." : config.persona === "editor" ? "Search footage by topic." : "Search lectures by concept.",
        "Jump straight to the exact moment.",
        "Works in any language.",
      ]} />
      <Pricing plan={plan} onPlan={setPlan} persona={config.persona} />
      <Onboarding
        plan={plan}
        ctaLabel={config.ctaLabel}
        persona={config.persona}
        usecases={usecases}
        sizeBand={sizeBand}
      />
      <LiveDemo facade persona={config.persona} videoId={config.demoVideoId} />
      <HowItWorks copy={config.howItWorks} />
      <div data-section="selectors">
        <Selectors
          usecases={usecases}
          onUsecases={setUsecases}
          sizeBand={sizeBand}
          onSizeBand={setSizeBand}
          persona={config.persona}
        />
      </div>
      <Faq items={[
        { q: "What can I search?", a: config.persona === "research" ? "Your interviews, recordings and audio or video links." : config.persona === "editor" ? "Your raw footage and audio or video links." : "Your lecture recordings and audio or video links." },
        { q: "Do I need the exact words?", a: "No. Search by meaning. Half-remembered is fine." },
        { q: "Which languages work?", a: "We index every spoken word, in any language." },
        { q: "What does it cost to start?", a: "Nothing. Your first 3 hours are free." },
      ]} />
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