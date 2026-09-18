import { Check } from "lucide-react";
import { hs } from "@/lib/persona-analytics";
import { cn } from "@/lib/utils";

export type PlanId = "free" | "starter" | "pro";

export const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  pricePoint: string;
  period?: string;
  hours: string;
  perks: string[];
}[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    pricePoint: "0",
    hours: "3 hours",
    perks: ["1 collection"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    pricePoint: "9.99",
    period: "/mo",
    hours: "50 hours",
    perks: [
      "3 collections",
      "Optional public shareable search page",
      "Additional indexing ~$0.25/hour",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    pricePoint: "29.99",
    period: "/mo",
    hours: "200 hours",
    perks: [
      "10 collections",
      "Public shareable search page included",
      "Additional indexing ~$0.17/hour",
    ],
  },
];

export function Pricing({
  plan,
  onPlan,
}: {
  plan: PlanId;
  onPlan: (p: PlanId) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-32" aria-label="Pricing">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        Simple pricing
      </h2>
      <p className="mt-3 text-center text-sm text-[hsl(var(--sv-muted))]">
        Pick a plan. You can change it later.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => {
          const active = plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                onPlan(p.id);
                hs("hs_plan_select", { plan: p.id, price_point: p.pricePoint });
              }}
              className={cn(
                "relative rounded-2xl border bg-[hsl(var(--sv-surface))] p-6 text-left transition-all duration-200",
                active
                  ? "border-transparent shadow-[0_0_0_2px_hsl(256_100%_65%),0_0_0_5px_hsl(188_86%_53%/0.35)]"
                  : "border-[hsl(var(--sv-border))] hover:border-[hsl(var(--sv-violet)/0.5)]",
              )}
            >
              {p.id === "starter" && (
                <span className="sv-grad-text absolute right-5 top-5 text-xs font-semibold uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--sv-muted))]">
                {p.name}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{p.price}</span>
                {p.period && (
                  <span className="text-sm text-[hsl(var(--sv-muted))]">{p.period}</span>
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--sv-cyan))]" aria-hidden />
                  {p.hours} searchable
                </li>
                {p.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2 text-[hsl(var(--sv-muted))]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--sv-cyan))]" aria-hidden />
                    {perk}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </section>
  );
}
