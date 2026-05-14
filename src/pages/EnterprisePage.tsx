import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Building2, Lock, Database, Search, DollarSign, GraduationCap, ShieldCheck, Server, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/Section";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { FeatureCard } from "@/components/site/FeatureCard";
import { StatCard } from "@/components/site/StatCard";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/site/SEO";

const EnterprisePage = () => {
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // wait for layout
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.pathname, location.hash]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo request received",
      description: `Thanks ${form.name || "—"}, we'll be in touch within 1 business day.`,
    });
    setForm({ name: "", email: "", org: "", message: "" });
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <SEO
        title="HearSeek Enterprise — On-Prem Search for Audio Archives"
        description="Speech Intel for media houses, broadcasters, and academic institutions. Deploy on-prem and turn decades of recordings into a searchable, monetizable archive."
        path="/enterprise"
      />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Building2 className="h-3 w-3 text-accent" /> Enterprise · Speech Intel
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Unlock your <br /><span className="text-gradient">private audio archives.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            For media houses, broadcasters, and academic institutions. Deploy on-prem,
            keep total data sovereignty, and turn decades of recordings into a searchable
            knowledge layer.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
              <a href="#demo">Book an Enterprise Demo <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <Section eyebrow="See It In Action" centered title="A quick walkthrough.">
        <VideoEmbed label="Enterprise demo · coming soon" />
      </Section>

      {/* VALUE PILLARS */}
      <Section eyebrow="Value Pillars" centered title="Why enterprises pick HearSeek.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={Lock} title="On-Prem &amp; Sovereign" description="Deploy inside your network. Your audio never leaves your infrastructure." />
          <FeatureCard icon={Database} title="Semantic Archive Search" description="Query decades of footage by meaning, not metadata." />
          <FeatureCard icon={DollarSign} title="Monetize Back-Catalogues" description="Turn dormant archives into licensable, discoverable assets." />
          <FeatureCard icon={GraduationCap} title="Institutional Licensing" description="Flexible licensing for universities, libraries, and research bodies." />
        </div>
      </Section>

      {/* FLAGSHIP PROOF */}
      <Section eyebrow="Proven At Scale" centered title="The International Iqbal Society flagship archive.">
        <div className="rounded-3xl border border-primary/30 bg-gradient-card p-8 md:p-12 shadow-elegant">
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <StatCard value="700+" label="Videos indexed" />
            <StatCard value="7.5M" label="Community served" />
            <StatCard value="100%" label="On-prem deployment" />
          </div>
          <div className="mb-10">
            <VideoEmbed label="Flagship project demo · coming soon" />
          </div>
          <div className="rounded-2xl bg-secondary/40 p-6 md:p-8 border border-border/40">
            <Quote className="h-8 w-8 text-primary mb-4" />
            <p className="font-display text-xl md:text-2xl leading-relaxed">
              "HearSeek has made our entire archive searchable in ways we didn't think
              were possible — and the data never left our servers."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— International Iqbal Society</p>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section eyebrow="How It Works" centered title="From raw audio to searchable in three steps.">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Server, title: "Ingest", desc: "Connect your archive — files, drives, or live feeds. Bulk or streaming." },
            { icon: Database, title: "Index", desc: "Our engine transcribes, translates, and embeds meaning across 160+ languages." },
            { icon: Search, title: "Search", desc: "Your team queries by meaning, paraphrase, or concept — and jumps to the exact moment." },
          ].map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-border/60 bg-gradient-card p-8">
              <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-waveform text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <step.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SECURITY STRIP */}
      <Section centered>
        <div className="rounded-3xl border border-border/60 bg-gradient-card p-8 md:p-10">
          <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
              <div>
                <div className="font-semibold">Data Sovereignty</div>
                <div className="text-sm text-muted-foreground">Air-gapped deployments supported.</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Lock className="h-10 w-10 text-primary shrink-0" />
              <div>
                <div className="font-semibold">End-to-End Encryption</div>
                <div className="text-sm text-muted-foreground">In transit and at rest.</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Server className="h-10 w-10 text-primary shrink-0" />
              <div>
                <div className="font-semibold">Autoscaling Core</div>
                <div className="text-sm text-muted-foreground">Production-ready at enterprise scale.</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* DEMO FORM */}
      <Section id="demo" className="scroll-mt-24" eyebrow="Get In Touch" centered title="Book an enterprise demo." subtitle="Tell us a bit about your archive — we'll tailor the walkthrough.">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto rounded-3xl border border-border/60 bg-gradient-card p-8 md:p-10 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={update("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required value={form.email} onChange={update("email")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="org">Organization</Label>
            <Input id="org" required value={form.org} onChange={update("org")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">What would you like to search?</Label>
            <Textarea id="message" rows={4} value={form.message} onChange={update("message")} placeholder="E.g. 20 years of broadcast archives in Arabic and English…" />
          </div>
          <Button type="submit" size="lg" className="w-full bg-gradient-waveform text-primary-foreground hover:opacity-90">
            Request Demo
          </Button>
        </form>
      </Section>
    </>
  );
};

export default EnterprisePage;