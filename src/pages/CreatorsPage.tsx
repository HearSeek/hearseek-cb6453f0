import { Link } from "react-router-dom";
import {
  ArrowRight,
  Youtube,
  Mic,
  Film,
  Scissors,
  Globe,
  Languages,
  Search,
  Share2,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { FeatureCard } from "@/components/site/FeatureCard";
import { StickyFeatureShowcase, ShowcaseFeature } from "@/components/site/StickyFeatureShowcase";
import { CollectionMarquee } from "@/components/site/CollectionMarquee";
import { cn } from "@/lib/utils";
import doacResults from "@/assets/creators/doac-results.png";
import doacShare from "@/assets/creators/doac-share.png";
import doacCollection from "@/assets/creators/doac-collection.png";
import { SEO } from "@/components/site/SEO";

const CreatorsPage = () => {
  const features: ShowcaseFeature[] = [
    {
      icon: DollarSign,
      shortLabel: "Monetize Archive",
      eyebrow: "01 · Monetize Your Archive",
      title: "Turn your library into a discoverable asset.",
      description:
        "Old uploads keep earning. When viewers can find every moment, watch-time on legacy content compounds — and your back-catalogue becomes a revenue engine.",
      accentClass: "bg-gradient-to-r from-accent to-primary",
      visual: (
        <div className="space-y-4">
          <div className="flex items-end gap-2 h-40">
            {[20, 28, 24, 36, 32, 48, 56, 52, 70, 82, 78, 96].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-waveform" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-2xl font-display font-bold text-gradient">+312%</div>
              <div className="text-xs text-muted-foreground">Avg. archive watch-time</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-gradient">$$$</div>
              <div className="text-xs text-muted-foreground">Long-tail revenue</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Search,
      shortLabel: "Semantic Search",
      eyebrow: "02 · Semantic Search",
      title: "Find moments by meaning, not keywords.",
      description:
        "Type a thought, a vibe, a question. HearSeek understands intent and surfaces the exact second someone said it — even if they never used your words.",
      bullets: [
        "No more scrubbing timelines or guessing titles",
        "Works on transcripts, captions, and raw audio",
        "Ranks by relevance, not upload date",
      ],
      accentClass: "bg-gradient-waveform",
      visual: (
        <div className="rounded-xl overflow-hidden border border-border/60 bg-background/60">
          <img src={doacResults} alt="HearSeek search results on Diary of A CEO" className="w-full h-auto" loading="lazy" />
        </div>
      ),
    },
    {
      icon: Globe,
      shortLabel: "Cross-Language",
      eyebrow: "03 · Cross-Language",
      title: "Search in English. Find in Urdu, Hindi, Arabic.",
      description:
        "Meaning travels across scripts. Your global audience finds your content in the language they think in — even when you never spoke a word of it.",
      accentClass: "bg-gradient-to-r from-primary to-accent",
      visual: (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-border/60 bg-background/60">
            <img src={doacCollection} alt="Diary of A CEO collection page on HearSeek" className="w-full h-auto" loading="lazy" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["English", "اردو", "हिन्दी", "العربية", "中文", "Français", "Español"].map((l) => (
              <span key={l} className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-medium">
                {l}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Languages,
      shortLabel: "Paraphrase Matching",
      eyebrow: "04 · Paraphrase Matching",
      title: "Type the gist. Surface every mention.",
      description:
        "You don't need to remember the exact phrase. HearSeek matches paraphrases, synonyms, and the underlying idea — across your entire library.",
      accentClass: "bg-gradient-to-r from-accent to-primary",
      visual: (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">You typed</div>
          <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 font-medium">
            "advice for first-time founders"
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground pt-2">Also matched</div>
          <div className="space-y-2">
            {["tips for new entrepreneurs", "what I wish I knew when starting out", "starting your first company"].map((m) => (
              <div key={m} className="rounded-lg border border-border/40 bg-secondary/30 px-3 py-2 text-sm">
                {m}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Share2,
      shortLabel: "Embed & Share",
      eyebrow: "05 · Embed & Share",
      title: "Deep-link straight to the moment.",
      description:
        "Every result is a shareable, second-precise link to the exact timestamp on YouTube. Drop it in a tweet, an email, a Slack thread — it just works.",
      accentClass: "bg-gradient-waveform",
      visual: (
        <div className="rounded-xl overflow-hidden border border-border/60 bg-background/60">
          <img src={doacShare} alt="Share and embed clip from Diary of A CEO" className="w-full h-auto" loading="lazy" />
        </div>
      ),
    },
    {
      icon: Film,
      shortLabel: "Premiere Pro Plugin",
      eyebrow: "06 · Premiere Pro Plugin",
      title: "Search your timeline by spoken word.",
      description:
        "Editing a long-form cut? Find the soundbite in seconds without scrubbing. HearSeek plugs into Premiere and YouTube Studio so search lives where you work.",
      accentClass: "bg-gradient-to-r from-primary to-accent",
      visual: (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-muted-foreground w-10">
                {String(i * 5).padStart(2, "0")}:00
              </div>
              <div className="flex-1 h-6 rounded bg-secondary/40 relative overflow-hidden">
                <div
                  className={cn(
                    "absolute top-0 bottom-0 rounded bg-gradient-waveform",
                    i === 2 ? "left-[20%] w-[35%] opacity-100" : "left-[10%] w-[60%] opacity-30",
                  )}
                />
              </div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground pt-2">Highlighted: matched clip on track 03</div>
        </div>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="HearSeek for Creators — Make Your YouTube Channel Searchable"
        description="Turn your YouTube channel, podcast, and long-form interviews into an instantly searchable, clip-ready archive. Monetize your back-catalogue across 160+ languages."
        path="/creators"
      />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-gradient-waveform opacity-30 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute top-10 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative py-28 md:py-40 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Creators · Find every moment
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
            Make every word in your <span className="text-gradient">YouTube Channel Discoverable.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            HearSeek turns your YouTube channel, podcast feed, and long-form interviews into
            an instantly searchable, clip-ready archive — across 160+ languages.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90 glow-primary">
              <Link to="/demo">Experience the Magic <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <Section eyebrow="Use Cases" centered title="Every channel, podcast, and interview — searchable.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={Youtube} title="YouTube Archive" description="Index every video on your channel. Find any moment by what was said." />
          <FeatureCard icon={Mic} title="Podcast Library" description="Resurface gold from old episodes — by topic, guest, or paraphrase." />
          <FeatureCard icon={Film} title="Long-Form Interviews" description="Jump straight to the quote your audience is asking about." />
          <FeatureCard icon={Scissors} title="Clip & Shorts Mining" description="Spot quotable moments fast — feed your shorts pipeline." />
        </div>
      </Section>

      {/* LIVE CREATOR COLLECTIONS */}
      <CollectionMarquee />

      {/* DEMO */}
      <Section eyebrow="See It In Action" centered title="Watch HearSeek search live.">
        <VideoEmbed label="Creator demo · coming soon" />
      </Section>

      {/* FEATURES — sticky-left, scrolling-right showcase */}
      <StickyFeatureShowcase
        eyebrow="Features"
        title="Built for how creators actually search."
        description="Six ways HearSeek turns your back-catalogue into an instantly searchable, clip-ready archive."
        ctaHref="/demo"
        ctaLabel="Experience the magic"
        features={features}
      />

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Make your YouTube content <span className="text-gradient">searchable</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Try the live demo and find every moment in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <Link to="/demo">Experience the Magic <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreatorsPage;
