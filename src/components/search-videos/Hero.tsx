import type { ReactNode } from "react";
import logoMark from "@/assets/hearseek-logo-mark.png";
import type { Persona } from "@/lib/persona-analytics";
import { CtaButton } from "./CtaButton";

type HeroProps = {
  eyebrow?: string;
  headline?: ReactNode;
  subhead?: ReactNode;
  ctaLabel?: string;
  persona?: Persona;
};

export function Hero({
  eyebrow = "For creators & podcasters",
  headline = "Find Anything You've Ever Said",
  subhead = "Search years of your videos and podcasts by topic, phrase, or something you half-remember saying. Jump straight to the exact moment.",
  ctaLabel = "Create my searchable library",
  persona,
}: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="sv-hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5 pt-8">
          <img src={logoMark} alt="HearSeek logo" className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">HearSeek</span>
        </div>

        {/* Headline block */}
        <div className="mx-auto max-w-3xl pb-20 pt-20 text-center md:pb-28 md:pt-28">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-[hsl(var(--sv-muted))]">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[hsl(var(--sv-muted))]">
            {subhead}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <CtaButton location="hero" persona={persona}>{ctaLabel}</CtaButton>
            <p className="text-sm text-[hsl(var(--sv-muted))]">
              Try for free up to 3 hours of video.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
