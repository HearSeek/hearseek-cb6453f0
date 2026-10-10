import { useEffect, useState } from "react";
import { Search, Play } from "lucide-react";

export type HeroDemoCopy = {
  query: string;
  title: string;
  snippet: string;
  timestamp: string;
};

// Self-playing search demo: types a query, shows a result, highlights the
// timestamp, pauses, then loops. Pure CSS/JS, no video.
export function HeroDemo({ demo }: { demo: HeroDemoCopy }) {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"typing" | "result" | "jump">("typing");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(demo.query.length);
      setPhase("jump");
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));
    const run = async () => {
      while (!cancelled) {
        setPhase("typing");
        setTyped(0);
        await wait(500);
        for (let i = 1; i <= demo.query.length && !cancelled; i++) {
          setTyped(i);
          await wait(55);
        }
        await wait(350);
        if (cancelled) return;
        setPhase("result");
        await wait(1100);
        if (cancelled) return;
        setPhase("jump");
        await wait(2600);
      }
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [demo.query]);

  const showResult = phase !== "typing";
  const jumping = phase === "jump";

  return (
    <div
      data-section="hero_demo"
      aria-label="Example search"
      className="mx-auto w-full max-w-md rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-3 text-left"
    >
      <div className="flex items-center gap-2 rounded-xl bg-[hsl(var(--sv-surface-2))] px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-[hsl(var(--sv-muted))]" aria-hidden />
        <span className="truncate text-base">
          {demo.query.slice(0, typed)}
          {phase === "typing" && <span className="sv-caret">|</span>}
        </span>
      </div>
      <div
        className={`mt-2 rounded-xl border border-[hsl(var(--sv-border))] p-3 transition-all duration-300 ${
          showResult ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{demo.title}</p>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold transition-all duration-300 ${
              jumping
                ? "sv-grad-btn text-[hsl(228_49%_8%)] scale-105"
                : "bg-[hsl(var(--sv-surface-2))] text-[hsl(var(--sv-cyan))]"
            }`}
          >
            <Play className="h-3 w-3" aria-hidden />
            {demo.timestamp}
          </span>
        </div>
        <p className="mt-1.5 text-base leading-snug text-[hsl(var(--sv-muted))]">
          “{demo.snippet}”
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--sv-surface-2))]">
          <div
            className="sv-grad-btn h-full transition-all duration-700"
            style={{ width: jumping ? "62%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
