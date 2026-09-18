import logoMark from "@/assets/hearseek-logo-mark.png";
import type { Persona } from "@/lib/persona-analytics";
import { scrollToOnboarding } from "./CtaButton";

export function PageFooter({
  ctaLabel = "Create my searchable library",
  persona,
}: {
  ctaLabel?: string;
  persona?: Persona;
}) {
  return (
    <footer className="border-t border-[hsl(var(--sv-border))]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center gap-2.5 md:justify-start">
            <img src={logoMark} alt="HearSeek logo" className="h-6 w-6" />
            <span className="text-base font-bold tracking-tight">HearSeek</span>
          </div>
          <p className="mt-2 text-sm text-[hsl(var(--sv-muted))]">
            Making the spoken word searchable.
          </p>
          <a
            href="mailto:hello@hearseek.com"
            className="mt-1 inline-block text-sm text-[hsl(var(--sv-muted))] underline-offset-4 hover:text-[hsl(var(--sv-fg))] hover:underline"
          >
            inquiries@hearseek.com
          </a>
        </div>
        <button
          type="button"
          onClick={() => scrollToOnboarding("footer", persona)}
          className="sv-grad-btn sv-glow inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-[hsl(228_49%_8%)] transition-all duration-200 hover:brightness-110"
        >
          {ctaLabel}
        </button>
      </div>
    </footer>
  );
}
