import { useEffect, useState, FormEvent } from "react";
import { Check, Globe, Infinity as InfinityIcon, Languages, Layers, Loader2, MessageSquare, Mic, Play, Smartphone, Users, Youtube, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/Section";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { FeatureCard } from "@/components/site/FeatureCard";
import appScreen from "@/assets/hearseek-app-single-v2.jpg";
import { SEO } from "@/components/site/SEO";
import { trackEvent } from "@/lib/analytics";
import { hs, VARIANT, ACQ_SOURCE, SESSION_ID } from "@/lib/persona-analytics";
import { submitSignup } from "@/lib/signup-capture";
import { joinConsumerWaitlist } from "@/lib/hearseek";
import { consumerWaitlistSchema } from "@/lib/validation";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    perks: [
      "2 hours of your existing audio made searchable",
      "30 minutes of new audio each month",
      "Semantic and cross-language search",
      "Search as much as you like",
    ],
  },
  {
    name: "Premium",
    price: "$6.99",
    period: "/month",
    perks: [
      "20 hours of your existing audio",
      "2 hours of new audio each month",
      "Priority processing",
      "Everything in Free",
    ],
  },
  {
    name: "Power",
    price: "$14.99",
    period: "/month",
    badge: "For heavy recorders",
    perks: [
      "40 hours of your existing audio",
      "20 hours of new audio each month",
      "Highest processing priority",
      "Built for lectures, meetings and interviews",
    ],
  },
];

const RECORDS = ["lectures", "meetings", "interviews", "voice notes", "other"];

const AppPage = () => {
  const [email, setEmail] = useState("");
  const [records, setRecords] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    hs("hs_app_waitlist_view", {}, "app");
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = consumerWaitlistSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setError(null);
    if (gotcha) {
      setDone(true);
      return;
    }
    setSubmitting(true);
    // 1) HearSeek API, exactly as the original form: PUT /consumer/waitlist { email }.
    //    This decides success. Nothing containing the email is logged.
    try {
      await joinConsumerWaitlist(parsed.data.email);
    } catch {
      setSubmitting(false);
      setError("Something went wrong saving your details. Please try again.");
      return;
    }
    // 2) Formspree copy to a separate app-waitlist form. Skipped silently when
    //    VITE_WAITLIST_ENDPOINT is unset; failures don't affect the result.
    const waitlistEndpoint = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
    if (waitlistEndpoint) {
      void submitSignup({
      email: parsed.data.email,
      pasted_url: "",
      input_type: "",
      persona: "app",
      page_persona: "app",
      plan: "",
      price_point: "",
      usecases: "",
      size_band: "",
      session_id: SESSION_ID,
      variant: VARIANT,
      acq_source: ACQ_SOURCE,
      stage: "app_waitlist",
      submitted_at: new Date().toISOString(),
      page_path: window.location.pathname,
      host: window.location.host,
      _subject: "HearSeek signup: app, Android waitlist",
      _gotcha: "",
      records,
      }, waitlistEndpoint).catch(() => undefined);
    }
    setSubmitting(false);
    hs("hs_app_waitlist_submit", { records }, "app");
    setDone(true);
    setEmail("");
  };

  return (
    <>
      <SEO
        title="HearSeek for Android: Search Your Recordings by Meaning"
        description="Make voice notes, lectures and meetings searchable. Find the exact moment, across languages. Coming soon to Android."
        path="/app"
      />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Smartphone className="h-3 w-3 text-primary" /> Coming soon to Android
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Search every word <br /> you've <span className="text-gradient">ever heard.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Voice notes, lectures, meetings and recordings. Find any spoken moment in
              seconds, across languages.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
                <a href="#waitlist">Join the Waitlist</a>
              </Button>
              <a
                href="#waitlist"
                onClick={() => trackEvent("outbound_click", { destination: "google_play", placement: "hero" })}
                className="flex h-12 items-center gap-2 rounded-xl border border-border/60 bg-card px-4 text-sm transition hover:border-primary/40"
              >
                <Play className="h-5 w-5" /> Google Play · Coming soon
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -inset-8 bg-gradient-hero opacity-70 blur-2xl" aria-hidden />
            <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[3rem] border-[10px] border-foreground/80 bg-foreground/90 shadow-elegant animate-float overflow-hidden">
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
          <FeatureCard icon={MessageSquare} title="Voice notes" description="Search your voice notes by what was said, not when you recorded them." />
          <FeatureCard icon={Mic} title="Phone Audio Recordings" description="Find that one idea you recorded weeks ago — by what you said, not when." />
          <FeatureCard icon={Languages} title="Lectures" description="Search hours of class recordings by concept, term, or paraphrase." />
          <FeatureCard icon={Users} title="Meetings and interviews" description="Find the exact moment a decision, quote or idea came up." />
        </div>
      </Section>

      {/* DEMO */}
      <Section eyebrow="See It In Action" centered title="Watch HearSeek search live.">
        <VideoEmbed label="Consumer app demo · coming soon" />
      </Section>

      {/* FEATURES */}
      <Section eyebrow="Features" centered title="Built for how people actually search.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={Globe} title="Cross-Language" description="Type in English, find the moment it was said in German or Arabic. Meaning travels across languages." />
          <FeatureCard icon={Languages} title="Paraphrase & Transliteration" description="Search 'inshallah' in Latin letters and find every Arabic mention, even when it was phrased differently." />
          <FeatureCard icon={Layers} title="Your archive, step by step" description="HearSeek starts with your most recent audio and keeps making the rest searchable in the background. Search what's ready while it works." />
          <FeatureCard icon={InfinityIcon} title="Search as much as you like" description="No search limits. Your plan only sets how much new audio gets indexed." />
        </div>
        <div className="mt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Coming later</p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto opacity-80">
            {[
              { icon: MessageSquare, title: "WhatsApp Companion", d: "A plugin that turns your voice-note inbox into a searchable archive." },
              { icon: Film, title: "Adobe Premiere Pro", d: "Find the exact frame by spoken word — straight from your timeline." },
              { icon: Youtube, title: "YouTube Plugin", d: "Jump to the second a creator says what you're searching for." },
            ].map(({ icon: Icon, title, d }) => (
              <div key={title} className="rounded-xl border border-border/40 bg-card/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {title}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING + WAITLIST */}
      <Section id="waitlist" eyebrow="Pricing" centered title="Start free. Upgrade when you need more.">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((p) => (
            <div key={p.name} className="relative rounded-3xl border border-primary/30 bg-gradient-card p-8 shadow-elegant">
              {p.badge && (
                <span className="absolute right-5 top-5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {p.badge}
                </span>
              )}
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                {p.period && <span className="text-muted-foreground">{p.period}</span>}
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.perks.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Large backlog? One-time Archive Boosts will be available on paid plans. Launch pricing in USD; final prices confirmed at launch.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 max-w-xl mx-auto rounded-3xl border border-border/60 bg-gradient-card p-8 flex flex-col">
          <h3 className="font-display text-2xl font-bold">Be first in line.</h3>
          {done ? (
            <p role="status" className="mt-4 text-sm">
              You're on the list. We'll email you when the Android app is ready.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                We're rolling out access in waves. Drop your email and we'll bring you in
                early.
              </p>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                <Input
                  type="email"
                  required
                  aria-label="Email address for waitlist"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "waitlist-email-error" : undefined}
                  placeholder="you@domain.com"
                  value={email}
                  maxLength={254}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="h-12"
                />
                <label className="text-sm text-muted-foreground">
                  I mostly record (optional)
                  <select
                    value={records}
                    onChange={(e) => setRecords(e.target.value)}
                    className="mt-1 h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  >
                    <option value="">Choose one</option>
                    {RECORDS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                  className="absolute left-[-9999px] h-px w-px opacity-0"
                />
                {error && (
                  <p id="waitlist-email-error" role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="bg-gradient-waveform text-primary-foreground hover:opacity-90"
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? "Joining…" : "Join the Waitlist"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  No spam. We'll email you only when there's news.
                </p>
              </div>
            </>
          )}
        </form>
      </Section>
    </>
  );
};

export default AppPage;
