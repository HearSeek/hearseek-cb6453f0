import type { ReactNode } from "react";
import { hs } from "@/lib/persona-analytics";
import { cn } from "@/lib/utils";

export type CtaLocation = "hero" | "mid" | "footer";

export function scrollToOnboarding(location: CtaLocation) {
  hs("hs_try_free_click", { cta_location: location });
  document
    .getElementById("sv-onboarding")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CtaButton({
  location,
  className,
  children,
}: {
  location: CtaLocation;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToOnboarding(location)}
      className={cn(
        "sv-grad-btn sv-glow inline-flex items-center justify-center rounded-full px-8 py-4",
        "text-base font-semibold text-[hsl(228_49%_8%)]",
        "transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
}
