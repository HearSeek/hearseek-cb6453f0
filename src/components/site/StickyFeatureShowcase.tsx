import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShowcaseFeature {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  visual: ReactNode;
  accentClass?: string;
  shortLabel: string;
}

interface StickyFeatureShowcaseProps {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  features: ShowcaseFeature[];
}

export const StickyFeatureShowcase = ({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
  features,
}: StickyFeatureShowcaseProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative">
      <div className="container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* LEFT — sticky intro */}
          <div className="md:sticky md:top-24 md:self-start md:h-[calc(100vh-7rem)] flex">
            <div className="relative w-full rounded-3xl border border-border/60 bg-gradient-card p-5 md:p-6 shadow-elegant overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-hero opacity-40 pointer-events-none" />
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-waveform opacity-20 blur-3xl pointer-events-none" />
              <div className="relative">
                {eyebrow && (
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                    {eyebrow}
                  </span>
                )}
                <h2 className="font-display text-2xl md:text-[26px] lg:text-3xl font-bold tracking-tight leading-[1.15]">
                  {title}
                </h2>
                {description && (
                  <p className="mt-2.5 text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}

                <ul className="mt-4 grid grid-cols-2 gap-1.5">
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    const active = i === activeIndex;
                    return (
                      <li
                        key={f.title}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-all",
                          active
                            ? "border-primary/40 bg-secondary/60"
                            : "border-transparent text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md shrink-0 transition-colors",
                            active
                              ? "bg-gradient-waveform text-primary-foreground"
                              : "bg-secondary text-foreground/70",
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                        <span
                          className={cn(
                            "text-[12px] font-medium truncate",
                            active && "text-foreground",
                          )}
                        >
                          {f.shortLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {ctaHref && ctaLabel && (
                  <div className="mt-4">
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-waveform text-primary-foreground hover:opacity-90"
                    >
                      <Link to={ctaHref}>
                        {ctaLabel} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — scrolling feature cards */}
          <div className="space-y-6 md:space-y-10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  data-index={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="md:h-[calc(100vh-7rem)] flex"
                >
                  <div className="relative w-full rounded-3xl border border-border/60 bg-gradient-card p-6 md:p-8 shadow-elegant overflow-y-auto">
                    <div
                      className={cn(
                        "absolute -inset-px opacity-20 blur-2xl pointer-events-none",
                        f.accentClass ?? "bg-gradient-waveform",
                      )}
                    />
                    <div className="relative space-y-5">
                      <div
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground shadow-elegant",
                          f.accentClass ?? "bg-gradient-waveform",
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {f.eyebrow}
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                        {f.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                      {f.bullets && f.bullets.length > 0 && (
                        <ul className="space-y-2">
                          {f.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-3 text-sm text-foreground/90"
                            >
                              <span
                                className={cn(
                                  "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                                  f.accentClass ?? "bg-gradient-waveform",
                                )}
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="pt-2">{f.visual}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};