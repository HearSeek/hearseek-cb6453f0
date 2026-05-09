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

const CreatorsPage = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Creators · Find every moment
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Search every word in <br /> your <span className="text-gradient">back-catalogue.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            HearSeek turns your YouTube channel, podcast feed, and long-form interviews into
            an instantly searchable, clip-ready archive — across 160+ languages.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
              <Link to="/demo">Experience the Magic <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app#waitlist">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <Section eyebrow="Use Cases" centered title="Every channel, podcast, and interview — searchable.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={Youtube} title="YouTube Archive" description="Index every video on your channel. Find any moment by what was said." />
          <FeatureCard icon={Mic} title="Podcast Back-Catalogue" description="Resurface gold from old episodes — by topic, guest, or paraphrase." />
          <FeatureCard icon={Film} title="Long-Form Interviews" description="Jump straight to the quote your audience is asking about." />
          <FeatureCard icon={Scissors} title="Clip & Shorts Mining" description="Spot quotable moments fast — feed your shorts pipeline." />
        </div>
      </Section>

      {/* DEMO */}
      <Section eyebrow="See It In Action" centered title="Watch HearSeek search live.">
        <VideoEmbed label="Creator demo · coming soon" />
      </Section>

      {/* FEATURES */}
      <Section eyebrow="Features" centered title="Built for how creators actually search.">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={Search} title="Semantic Search" description="Find moments by meaning — not just exact keywords or titles." />
          <FeatureCard icon={Globe} title="Cross-Language" description="Search English, find Urdu, Hindi, Arabic — meaning travels across scripts." />
          <FeatureCard icon={Languages} title="Paraphrase Matching" description="Type the gist — surface every paraphrased mention." />
          <FeatureCard icon={Share2} title="Embed & Share" description="Share deep-linked moments straight to YouTube at the exact second." />
          <FeatureCard icon={Film} title="Premiere Pro Plugin" description="Search your timeline by spoken word — straight from the editor." />
          <FeatureCard icon={DollarSign} title="Monetize Your Archive" description="Make your library a discoverable asset — not a forgotten folder." />
        </div>
      </Section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Make your back-catalogue <span className="text-gradient">searchable</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Try the live demo — or join the waitlist for early creator access.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <Link to="/demo">Experience the Magic <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app#waitlist">Join the Waitlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreatorsPage;
