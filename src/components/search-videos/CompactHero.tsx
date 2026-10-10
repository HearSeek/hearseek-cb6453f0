import logoMark from "@/assets/hearseek-logo-mark.png";
import { Button } from "@/components/ui/button";
import type { Persona } from "@/lib/persona-analytics";
import { scrollToOnboarding } from "./CtaButton";
import { HeroDemo, type HeroDemoCopy } from "./HeroDemo";

export function CompactHero({
  headline,
  subhead,
  demo,
  persona,
}: {
  headline: string;
  subhead: string;
  demo: HeroDemoCopy;
  persona?: Persona;
}) {
  return (
    <header data-section="hero" className="relative overflow-hidden">
      <div className="sv-hero-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-3xl px-5 pb-8 pt-3 text-center md:pt-10">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <img src={logoMark} alt="HearSeek logo" width={24} height={24} className="h-6 w-6" />
          <span className="text-base font-bold tracking-tight">HearSeek</span>
        </div>
        <h1 className="mt-3 text-balance text-[1.75rem] font-bold leading-[1.1] tracking-normal md:mt-5 md:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-base leading-snug text-[hsl(var(--sv-fg)/0.8)]">
          {subhead}
        </p>
        <div className="mt-3 md:mt-5">
          <HeroDemo demo={demo} />
        </div>
        <div className="mt-3 flex flex-col items-center gap-1.5 md:mt-5">
          <Button
            variant="ghost"
            type="button"
            onClick={() => scrollToOnboarding("hero", persona)}
            className="sv-grad-btn sv-glow h-12 w-full max-w-md rounded-full px-8 text-base font-semibold text-[hsl(var(--sv-bg))] active:scale-[0.99]"
          >
            Try it free
          </Button>
          <p className="text-sm leading-5 text-[hsl(var(--sv-fg)/0.85)]">Free on up to 3 hours.</p>
          <Button
            variant="link"
            type="button"
            onClick={() =>
              document.getElementById("sv-pricing")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="h-7 p-0 text-base text-[hsl(var(--sv-fg)/0.85)] underline underline-offset-4"
          >
            See pricing
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Benefits({ items }: { items: string[] }) {
  return (
    <section data-section="benefits" aria-label="Benefits" className="mx-auto w-full max-w-md px-5 pb-14">
      <ul className="space-y-3">
        {items.map((b) => (
          <li
            key={b}
            className="flex items-start gap-3 rounded-xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] px-4 py-3 text-base"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--sv-cyan))]" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section data-section="faq" aria-label="FAQ" className="mx-auto w-full max-w-2xl px-5 pb-20">
      <h2 className="text-center text-2xl font-bold tracking-tight">Questions</h2>
      <div className="mt-6 divide-y divide-[hsl(var(--sv-border))] rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))]">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-base font-semibold">
              {f.q}
            </summary>
            <p className="mt-2 text-base leading-relaxed text-[hsl(var(--sv-fg)/0.8)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
