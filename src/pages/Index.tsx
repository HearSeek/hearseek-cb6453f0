import { Link } from "react-router-dom";
import { ArrowRight, Search, Globe, Brain, Layers, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { Waveform } from "@/components/site/Waveform";
import { FeatureCard } from "@/components/site/FeatureCard";
import { StatCard } from "@/components/site/StatCard";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import hearseekLogo from "@/assets/hearseek-logo.png";

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-waveform opacity-50" />
        <div className="container relative py-24 md:py-36 text-center">
          <img
            src={hearseekLogo}
            alt="HearSeek logo"
            className="mx-auto h-20 md:h-24 w-auto drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
          />
          <h1 className="mt-8 font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            The World's First <br />
            <span className="text-gradient">AI Search Engine</span> for Audio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
            HearSeek transforms silent spoken data into a searchable, intelligent layer of
            the internet — across 160+ languages.
          </p>

          {/* Mock search bar */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="relative rounded-2xl border border-border/80 bg-card/80 backdrop-blur p-2 shadow-elegant glow-primary">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base text-muted-foreground flex-1 text-left">
                  Search "Khudi" across 700 lectures…
                </span>
                <Waveform className="h-8 w-32" bars={20} />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
              <Link to="/enterprise#demo">Book a Demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app#waitlist">Join App Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section eyebrow="The Blind Spot" centered title={<>82.5% of internet traffic is <span className="text-gradient">audio &amp; video</span> — yet unsearchable.</>}
        subtitle="Today's search engines stop at titles, descriptions, and tags. The actual spoken content — the meaning, the moments, the knowledge — remains invisible.">
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-card p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today</div>
            <h3 className="mt-2 font-display text-xl font-semibold">A muted ocean</h3>
            <div className="mt-6 opacity-40">
              <Waveform bars={40} animated={false} />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Billions of hours of human knowledge locked inside audio and video files no
              one can search through.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-gradient-card p-8 shadow-elegant">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">With HearSeek</div>
            <h3 className="mt-2 font-display text-xl font-semibold">Every word, searchable</h3>
            <div className="mt-6">
              <Waveform bars={40} />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Semantic, multilingual, meaning-based search that finds the exact spoken
              moment — not just the file name.
            </p>
          </div>
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section eyebrow="What HearSeek Does" centered title="Built for the Audio Era" subtitle="A foundational infrastructure for spoken knowledge.">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={Globe} title="160+ Languages" description="Native scripts and Roman transliteration. Search 'Khudi' and find Urdu lectures instantly." />
          <FeatureCard icon={Brain} title="Meaning-Based Discovery" description="Cross-language, paraphrased, and contextual search across hours of spoken content." />
          <FeatureCard icon={Layers} title="Operational Duality" description="A consumer mobile app and an enterprise on-prem solution — one engine, two experiences." />
        </div>
      </Section>

      {/* TWO REVENUE STREAMS */}
      <Section eyebrow="Consumer App · app.hearseek.com" title="Search every word you've ever heard.">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-lg text-muted-foreground">
              Your personal audio search companion. Find any spoken moment across voice
              notes, lectures, podcasts, and WhatsApp clips — in 160+ languages.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Personal voice notes & meetings",
                "Lectures, podcasts & audiobooks",
                "WhatsApp voice message companion",
                "Cross-language & paraphrase search",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <span className="font-display text-2xl font-bold text-gradient">$15</span>
              <span className="text-muted-foreground"> / month</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <Link to="/app">Explore the App <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/app#waitlist">Join Waitlist</Link>
              </Button>
            </div>
          </div>
          <VideoEmbed label="App demo coming soon" />
        </div>
      </Section>

      <Section eyebrow="Enterprise · media.hearseek.com" title="Unlock your private audio archives.">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="lg:order-1 order-2">
            <VideoEmbed label="Enterprise demo coming soon" />
          </div>
          <div className="lg:order-2 order-1">
            <p className="text-lg text-muted-foreground">
              Speech Intel for media houses, broadcasters, and academic institutions.
              Turn decades of recordings into a searchable, monetizable knowledge base.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "On-prem deployment & data sovereignty",
                "Semantic archive search across back-catalogues",
                "Monetize legacy audio & video libraries",
                "Institutional licensing & SLAs",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <Link to="/enterprise#demo">Book a Demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/enterprise">See Enterprise</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* PILOT */}
      <Section eyebrow="Live Pilot" centered title="International Iqbal Society" subtitle="Indexing decades of philosophical lectures for a 7.5M-strong global community.">
        <div className="rounded-3xl border border-border/60 bg-gradient-card p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <StatCard value="700+" label="Videos indexed" sub="And growing weekly" />
            <StatCard value="7.5M" label="Global community" sub="Across 80+ countries" />
            <StatCard value="160+" label="Languages supported" sub="Including Urdu & transliteration" />
          </div>
          <div className="rounded-2xl bg-secondary/40 p-6 md:p-8 border border-border/40">
            <Quote className="h-8 w-8 text-primary mb-4" />
            <p className="font-display text-xl md:text-2xl leading-relaxed">
              "For the first time, a global audience can search through decades of Iqbal
              lectures by meaning — not just title."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— International Iqbal Society pilot</p>
          </div>
        </div>
      </Section>

      {/* VISION & TRACTION */}
      <Section eyebrow="Vision & Traction" centered title="Building search for the next 3 billion.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="1.5B" label="Speakers reachable today" sub="EN · UR · HI" />
          <StatCard value="3B" label="Target by Year 3" sub="+ AR · ZH" />
          <StatCard value="3.3M" label="Active users target" sub="End of Year 3" />
          <StatCard value="$2.5M" label="Monthly revenue target" sub="End of Year 3" />
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Pre-seed cleared · Bridge round in progress toward seed.
        </p>
      </Section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Make spoken knowledge <span className="text-gradient">searchable</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join us in rebuilding search for the Audio Era.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <Link to="/enterprise#demo">Book a Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app#waitlist">Join App Waitlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
