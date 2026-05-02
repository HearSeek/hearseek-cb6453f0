import { useState, FormEvent } from "react";
import { Apple, Check, Globe, Languages, MessageSquare, Mic, Play, Smartphone, Youtube, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/Section";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { FeatureCard } from "@/components/site/FeatureCard";
import { toast } from "@/hooks/use-toast";
import appScreen from "@/assets/hearseek-app-single.jpeg";

const AppPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're on the list!", description: `We'll email ${email} when the app launches.` });
    setEmail("");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Smartphone className="h-3 w-3 text-primary" /> Consumer App · $15/month
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Search every word <br /> you've <span className="text-gradient">ever heard.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Voice notes, lectures, podcasts, WhatsApp clips — find any spoken moment in
              seconds, across 160+ languages.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <a href="#waitlist">Join the Waitlist</a>
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-12 items-center gap-2 rounded-xl border border-border/60 bg-card px-4 text-sm">
                  <Apple className="h-5 w-5" /> App Store
                </div>
                <div className="flex h-12 items-center gap-2 rounded-xl border border-border/60 bg-card px-4 text-sm">
                  <Play className="h-5 w-5" /> Google Play
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -inset-8 bg-gradient-hero opacity-70 blur-2xl" aria-hidden />
            {/* Phone frame */}
            <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[3rem] border-[10px] border-foreground/80 bg-foreground/90 shadow-elegant animate-float overflow-hidden">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-6 w-28 rounded-full bg-foreground" />
              <img
                src={appScreen}
                alt="HearSeek mobile app screen"
                className="absolute inset-0 h-full w-full object-cover rounded-[2.25rem]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <Section eyebrow="Use Cases" centered title="One app. Every spoken corner of your life.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={MessageSquare} title="WhatsApp" description="Search your voice-note inbox like it's email." />
          <FeatureCard icon={Mic} title="Phone Audio Recordings" description="Find that one idea you recorded weeks ago — by what you said, not when." />
          <FeatureCard icon={Languages} title="Lectures" description="Search hours of class recordings by concept, term, or paraphrase." />
          <FeatureCard icon={Play} title="Podcasts" description="Jump to the exact moment a guest mentioned the topic you care about." />
        </div>
      </Section>

      {/* DEMO */}
      <Section eyebrow="See It In Action" centered title="Watch HearSeek search live.">
        <VideoEmbed label="Consumer app demo · coming soon" />
      </Section>

      {/* FEATURES */}
      <Section eyebrow="Features" centered title="Built for how people actually search.">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={Globe} title="Cross-Language" description="Type in English, find Urdu. Type in Hindi, find Arabic. Meaning travels across scripts." />
          <FeatureCard icon={Languages} title="Paraphrase &amp; Transliteration" description="Search 'Khudi' in Roman script and surface every Urdu mention — even rephrased ones." />
          <FeatureCard icon={MessageSquare} title="WhatsApp Companion" description="A plugin that turns your voice-note inbox into a searchable archive." />
          <FeatureCard icon={Film} title="Adobe Premiere Pro" description="Find the exact frame by spoken word — straight from your timeline." />
          <FeatureCard icon={Youtube} title="YouTube Plugin" description="Jump to the second a creator says what you're searching for." />
          <FeatureCard icon={Mic} title="Personal Archive" description="Your audio stays yours. Private indexing across all your devices." />
        </div>
      </Section>

      {/* PRICING + WAITLIST */}
      <Section id="waitlist" eyebrow="Pricing" centered title="Simple. One plan. All of it.">
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          <div className="rounded-3xl border border-primary/30 bg-gradient-card p-8 shadow-elegant">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">HearSeek Pro</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">$15</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Unlimited audio &amp; video indexing",
                "160+ languages with transliteration",
                "Cross-language semantic search",
                "WhatsApp, Premiere Pro &amp; YouTube plugins",
                "Private, end-to-end encrypted",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: f }} />
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-border/60 bg-gradient-card p-8 flex flex-col">
            <h3 className="font-display text-2xl font-bold">Be first in line.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We're rolling out access in waves. Drop your email and we'll bring you in
              early.
            </p>
            <div className="mt-6 flex flex-col gap-3 flex-1">
              <Input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              <Button type="submit" size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                Join the Waitlist
              </Button>
              <p className="text-xs text-muted-foreground">
                No spam. We'll email you only when there's news.
              </p>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
};

export default AppPage;