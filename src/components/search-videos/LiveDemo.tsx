import { useEffect, useRef, useState } from "react";
import { Play, Search } from "lucide-react";
import { hs } from "@/lib/persona-analytics";

const DEMO_QUERY = "where did I talk about quitting my first company?";

const RESULTS = [
  {
    title: "The Real Reason I Left My First Startup — Full Story",
    timestamp: "42:17",
    excerpt:
      "“...so after three years I finally walked away from my first company, and honestly, it felt like losing a part of myself...”",
  },
  {
    title: "Ep. 87 — Burnout, Founders & Knowing When to Quit",
    timestamp: "18:05",
    excerpt:
      "“...the day I resigned from my first company, I had exactly four hundred dollars in the bank and no plan B...”",
  },
  {
    title: "Q&A Special: Would You Ever Start Another Company?",
    timestamp: "1:02:44",
    excerpt:
      "“...quitting my first company taught me more than building it ever did — and I'd do it all over again...”",
  },
];

export function LiveDemo() {
  const [query, setQuery] = useState(DEMO_QUERY);
  const [runId, setRunId] = useState(0);
  const firedRef = useRef(false);
  const queryRef = useRef(query);
  queryRef.current = query;

  // Results revealed on load — fire the demo-interact event once for it.
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    hs("hs_demo_interact", { demo_query_text: queryRef.current, demo_result_clicked: false });
  }, []);

  const onSearch = () => {
    hs("hs_demo_interact", { demo_query_text: query, demo_result_clicked: false });
    setRunId((n) => n + 1);
  };

  const onJump = () => {
    hs("hs_demo_interact", { demo_query_text: query, demo_result_clicked: true });
  };

  return (
    <section className="relative mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32" aria-label="Live search demo">
      {/* Search bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-3 shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 px-3">
          <Search className="h-5 w-5 shrink-0 text-[hsl(var(--sv-muted))]" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            aria-label="Search demo input"
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-[hsl(var(--sv-muted))]"
            placeholder={DEMO_QUERY}
          />
        </div>
        <button
          type="button"
          onClick={onSearch}
          className="sv-grad-btn sv-glow inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-[hsl(228_49%_8%)] transition-all duration-200 hover:brightness-110"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="mt-8 space-y-4" aria-live="polite">
        {RESULTS.map((r, i) => (
          <article
            key={`${runId}-${i}`}
            className="animate-fade-in-up rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-5 transition-colors hover:border-[hsl(var(--sv-violet)/0.4)] md:p-6"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug md:text-lg">
                {r.title}
              </h3>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface-2))] px-3 py-1 font-mono text-xs text-[hsl(var(--sv-cyan))]">
                <Play className="h-3 w-3" aria-hidden />
                {r.timestamp}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--sv-muted))]">
              {r.excerpt}
            </p>
            <button
              type="button"
              onClick={onJump}
              className="mt-4 text-sm font-semibold text-[hsl(var(--sv-cyan))] underline-offset-4 transition-colors hover:underline"
            >
              Jump to moment →
            </button>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-[hsl(var(--sv-muted))]">
        Search by meaning. Land on the exact moment it was said.
      </p>
    </section>
  );
}
