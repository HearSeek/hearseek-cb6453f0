import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
}

export const Section = ({ id, className, children, eyebrow, title, subtitle, centered }: SectionProps) => {
  return (
    <section id={id} className={cn("container py-20 md:py-28", className)}>
      {(eyebrow || title || subtitle) && (
        <div className={cn("max-w-3xl mb-12 md:mb-16", centered && "mx-auto text-center")}>
          {eyebrow && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
};