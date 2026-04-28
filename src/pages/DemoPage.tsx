import { useState } from "react";
import { Search, Sparkles, Newspaper, Mic, PlayCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark.png";

type Filter = "all" | "news" | "podcasts";

type Clip = {
  id: string;
  kind: "news" | "podcasts";
  title: string;
  insight: string;
  duration: string;
  hue: number;
};

const NEWS: Clip[] = [
  { id: "n1", kind: "news", title: "Fed Signals Rate Pause", insight: "Mentions inflation target at 01:12", duration: "3:48", hue: 258 },
  { id: "n2", kind: "news", title: "EU AI Act Enforcement Begins", insight: "Discusses compliance window at 04:05", duration: "5:12", hue: 210 },
  { id: "n3", kind: "news", title: "SpaceX Starship Test Flight", insight: "Covers booster catch at 02:18", duration: "2:45", hue: 290 },
  { id: "n4", kind: "news", title: "Climate Summit Closing Remarks", insight: "Highlights methane pledge at 06:40", duration: "7:02", hue: 190 },
];

const PODCASTS: Clip[] = [
  { id: "p1", kind: "podcasts", title: "Lex Fridman × Demis Hassabis", insight: "Debates AGI timelines at 14:22", duration: "1:58:10", hue: 258 },
  { id: "p2", kind: "podcasts", title: "Acquired: Nvidia Pt. 3", insight: "Discusses Apple M3 chip at 02:30", duration: "3:24:05", hue: 290 },
  { id: "p3", kind: "podcasts", title: "Huberman Lab: Sleep Science", insight: "Explains REM cycles at 22:11", duration: "1:42:30", hue: 190 },
  { id: "p4", kind: "podcasts", title: "All-In: Markets Recap", insight: "Recaps rate decision at 08:47", duration: "1:12:04", hue: 230 },
];

const SEGMENTS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news", label: "News Channels" },
  { id: "podcasts", label: "Podcasts" },
];

const VideoCard = ({ clip }: { clip: Clip }) => {
  const SourceIcon = clip.kind === "news" ? Newspaper : Mic;
  const bg = `linear-gradient(135deg, hsl(${clip.hue} 70% 22%) 0%, hsl(${(clip.hue + 40) % 360} 60% 10%) 100%)`;
  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/40 backdrop-blur-md transition hover:border-primary/40 hover:shadow-elegant">
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full" style={{ backgroundImage: bg }}>
          {/* subtle waveform overlay */}
          <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40" fill="none" stroke="white" strokeWidth="1" />
            <path d="M0 50 Q 25 20 50 50 T 100 50 T 150 50 T 200 50" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
          </svg>
          <PlayCircle className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/50 transition group-hover:text-white/80" strokeWidth={1.2} />
          {/* source chip */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background/70 backdrop-blur">
            <SourceIcon className="h-4 w-4 text-foreground/80" />
          </div>
        </div>
      </AspectRatio>
      {/* glass info bar */}
      <div className="border-t border-white/10 bg-background/60 p-3 backdrop-blur-xl">
        <h3 className="line-clamp-1 font-display text-sm font-semibold">{clip.title}</h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 shrink-0 text-primary" />
            <span className="line-clamp-1">{clip.insight}</span>
          </p>
          <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80">
            {clip.duration}
          </span>
        </div>
      </div>
    </article>
  );
};

const Row = ({ label, clips }: { label: string; clips: Clip[] }) => (
  <section className="mt-10">
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {clips.map((c) => <VideoCard key={c.id} clip={c} />)}
    </div>
  </section>
);

const DemoPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [focused, setFocused] = useState(false);

  const showNews = filter === "all" || filter === "news";
  const showPods = filter === "all" || filter === "podcasts";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient mesh gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[28%] h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-waveform opacity-[0.18] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-16 md:px-8">
        {/* Top bar */}
        <div className="relative flex items-center justify-between">
          <div className="hidden md:block md:w-[280px]" />
          <img
            src={logoMark}
            alt="HearSeek"
            className="h-12 w-12 object-contain drop-shadow-[0_0_24px_hsl(var(--primary)/0.55)] md:h-14 md:w-14"
          />
          {/* Segmented control with gradient border */}
          <div className="rounded-full bg-gradient-waveform p-[1px]">
            <div className="flex items-center gap-1 rounded-full bg-background/70 p-1 backdrop-blur-xl">
              {SEGMENTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFilter(s.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition sm:px-4 sm:text-xs",
                    filter === s.id
                      ? "bg-gradient-waveform text-primary-foreground shadow-elegant"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero search */}
        <div className="mx-auto mt-16 max-w-3xl md:mt-24">
          <div className="relative">
            <div
              aria-hidden
              className={cn(
                "absolute -inset-[2px] rounded-2xl bg-gradient-waveform blur-md transition-opacity duration-300",
                focused ? "opacity-70" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "relative flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-4 py-3.5 backdrop-blur-xl transition",
                focused && "ring-1 ring-primary/40",
              )}
            >
              <Search className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Ask anything..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                <span className="text-sm leading-none">⌘</span>
                <span>K</span>
              </kbd>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground/80">
            Search across hundreds of news broadcasts and podcast episodes — by meaning.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-10">
          {showNews && <Row label="Trending News Clips" clips={NEWS} />}
          {showPods && <Row label="Featured Podcast Insights" clips={PODCASTS} />}
        </div>

        {/* Footer disclaimer */}
        <p className="mt-20 text-center text-xs text-muted-foreground/70">
          HearSeek can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default DemoPage;