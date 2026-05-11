import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

interface FeatureShowcaseRowProps {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  visual: ReactNode;
  reverse?: boolean;
  accentClass?: string; // tailwind gradient classes for icon badge
}

export const FeatureShowcaseRow = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets = [],
  visual,
  reverse,
  accentClass = "bg-gradient-waveform",
}: FeatureShowcaseRowProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <div
      ref={ref}
      className={cn(
        "container min-h-[80vh] flex items-center py-16 md:py-24 transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
      )}
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center w-full">
        <div className={cn("space-y-5", reverse && "md:order-2")}>
          <div
            className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground shadow-elegant",
              accentClass,
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          {eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </div>
          )}
          <h3 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            {description}
          </p>
          {bullets.length > 0 && (
            <ul className="space-y-2 pt-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", accentClass)} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={cn("relative", reverse && "md:order-1")}>
          <div className="relative rounded-3xl border border-border/60 bg-gradient-card p-6 md:p-8 shadow-elegant overflow-hidden">
            <div className={cn("absolute -inset-px opacity-20 blur-2xl pointer-events-none", accentClass)} />
            <div className="relative">{visual}</div>
          </div>
        </div>
      </div>
    </div>
  );
};