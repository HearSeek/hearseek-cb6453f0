import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Play,
  SearchX,
  ArrowLeft,
  Languages as LanguagesIcon,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
  Newspaper,
  Mic,
  PlayCircle,
  Video,
  Users,
  Library,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark.png";
import {
  runSearch,
  buildJumpLink,
  youtubeThumbnail,
  formatTimestamp,
  prettifyChannel,
  getSearchConfigurations,
  type SearchHit,
  type SearchConfig,
} from "@/lib/hearseek";

const isRtl = (lang: string | null) => lang === "ur" || lang === "ar" || lang === "fa" || lang === "he";

const languageLabel = (lang: string | null): string => {
  if (!lang) return "—";
  const map: Record<string, string> = {
    en: "English",
    ur: "Urdu",
    ar: "Arabic",
    hi: "Hindi",
    fa: "Persian",
    he: "Hebrew",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    zh: "Chinese",
    ja: "Japanese",
  };
  return map[lang] ?? lang.toUpperCase();
};

const languageDot = (lang: string | null): string => {
  switch (lang) {
    case "en": return "bg-sky-400";
    case "ur": return "bg-emerald-400";
    case "ar": return "bg-amber-400";
    case "hi": return "bg-rose-400";
    default: return "bg-violet-400";
  }
};

// Relevance meter — circular ring with brand gradient. value: 0..1 score from API.
const RelevanceMeter = ({ value }: { value: number }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  const size = 64;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 block">
          <defs>
          <linearGradient id="relGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(190 95% 55%)" />
            <stop offset="60%" stopColor="hsl(258 90% 66%)" />
            <stop offset="100%" stopColor="hsl(290 80% 60%)" />
          </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none" />
          <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#relGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 6px hsl(258 90% 66% / 0.55))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm font-semibold leading-none text-foreground">{pct}%</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Match</span>
    </div>
  );
};

type IconType = typeof Newspaper;
const iconForCollection = (name: string): IconType => {
  const n = name.toLowerCase();
  if (n.includes("news")) return Newspaper;
  if (n.includes("podcast")) return Mic;
  if (n.includes("demo")) return PlayCircle;
  if (n.includes("video")) return Video;
  if (n.includes("interview")) return Users;
  return Library;
};

// Snippet renderer: pre (muted) + bold/highlighted main + post (muted)
const Snippet = ({ hit }: { hit: SearchHit }) => {
  const rtl = isRtl(hit.language);
  return (
    <p
      className={cn(
        "text-[13.5px] leading-relaxed text-muted-foreground/90",
        rtl && "text-right",
      )}
      dir={rtl ? "rtl" : "ltr"}
    >
      {hit.pre && <span>{hit.pre} </span>}
      <span>{hit.main}</span>
      {hit.post && <span> {hit.post}</span>}
    </p>
  );
};

const ChannelPill = ({ channel }: { channel: string | null }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
    {prettifyChannel(channel)}
  </span>
);

const ResultCard = ({ hit, index }: { hit: SearchHit; index: number }) => {
  const jumpLink = buildJumpLink(hit);
  const thumb = hit.videoId ? youtubeThumbnail(hit.videoId) : null;
  const tStart = formatTimestamp(hit.start);
  const tEnd = formatTimestamp(hit.end);
  return (
    <article
      className="group relative grid animate-fade-in-up grid-cols-1 gap-5 overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant md:grid-cols-[92px_1fr_260px] md:gap-6 md:p-6"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ambient hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(258 90% 50% / 0.18), transparent 60%), radial-gradient(ellipse at 100% 100%, hsl(190 95% 55% / 0.12), transparent 60%)",
        }}
      />

      {/* Relevance */}
      <div className="flex items-center md:justify-center">
        <RelevanceMeter value={hit.score} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <ChannelPill channel={hit.channel} />
          {hit.title && <span className="truncate text-xs text-muted-foreground">{hit.title}</span>}
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
            <LanguagesIcon className="h-3 w-3 text-primary/80" />
            <span className={cn("h-1.5 w-1.5 rounded-full", languageDot(hit.language))} />
            <span>{languageLabel(hit.language)}</span>
          </span>
        </div>
        <Snippet hit={hit} />
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{tStart} – {tEnd}</span>
          {jumpLink && (
            <a
              href={jumpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-primary transition hover:text-accent"
            >
              Jump to {tStart} →
            </a>
          )}
        </div>
      </div>

      {/* Video preview */}
      <div className="w-full md:w-[260px]">
        <a
          href={jumpLink ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`Open YouTube at ${tStart}`}
        >
          <div className="relative overflow-hidden rounded-lg border border-white/10">
            <AspectRatio ratio={16 / 9}>
              <div className="relative h-full w-full bg-gradient-to-br from-muted/40 to-background">
                {thumb ? (
                  <img
                    src={thumb}
                    alt="Video thumbnail"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      // hqdefault sometimes 404s; hide image so gradient shows
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-background/10 transition group-hover:bg-background/20" />
                {/* Play on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-waveform shadow-elegant">
                    <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" />
                  </div>
                </div>
                {/* Timestamp badge */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <span className="rounded-md border border-white/15 bg-background/80 px-2 py-1 font-mono text-[11px] font-medium tracking-tight text-foreground backdrop-blur">
                    {tStart} — {tEnd}
                  </span>
                </div>
                {/* Score corner */}
                <span className="absolute right-2 top-2 rounded bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80 backdrop-blur">
                  {hit.score.toFixed(2)}
                </span>
              </div>
            </AspectRatio>
          </div>
        </a>
      </div>
    </article>
  );
};

const EmptyState = ({ query }: { query: string }) => {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-card/40 p-10 text-center backdrop-blur-xl">
      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-waveform opacity-20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-background/60 backdrop-blur">
          <SearchX className="h-9 w-9 text-primary" strokeWidth={1.4} />
        </div>
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground">
        No insights found{query && ` for "${query}"`}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Try a different phrasing, or pick a different collection.
      </p>
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const configSlug = params.get("config") ?? "";
  const configName = params.get("configName") ?? configSlug;

  const [pendingQuery, setPendingQuery] = useState(query);
  const [focused, setFocused] = useState(false);

  const [hits, setHits] = useState<SearchHit[]>([]);
  const [numHits, setNumHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collection dropdown — re-selectable from results page
  const [collections, setCollections] = useState<SearchConfig[]>([
    { name: configName, slug: configSlug },
  ]);
  const [scopeOpen, setScopeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSearchConfigurations();
        if (!cancelled && data.length > 0) setCollections(data);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setScopeOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeConfig =
    collections.find((c) => c.slug === configSlug) ??
    { name: configName, slug: configSlug };
  const ActiveIcon = iconForCollection(activeConfig.name);

  const selectConfig = (cfg: SearchConfig) => {
    setScopeOpen(false);
    if (cfg.slug === configSlug) return;
    const next = new URLSearchParams(params);
    next.set("config", cfg.slug);
    next.set("configName", cfg.name);
    setParams(next);
  };

  useEffect(() => {
    setPendingQuery(query);
  }, [query]);

  useEffect(() => {
    if (!query || !configSlug) {
      setHits([]);
      setNumHits(0);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    runSearch(query, configSlug, controller.signal)
      .then((res) => {
        setHits(res.hits);
        setNumHits(res.numHits);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Search failed";
        console.error("[ResultsPage] search error:", err);
        setError(msg);
        setHits([]);
        setNumHits(0);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query, configSlug]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = pendingQuery.trim();
    if (!q) return;
    const next = new URLSearchParams(params);
    next.set("q", q);
    setParams(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient mesh gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[10%] h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-waveform opacity-[0.12] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-6 pb-16 md:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/demo")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <Link to="/demo" className="flex items-center gap-2">
            <img
              src={logoMark}
              alt="HearSeek"
              className="h-9 w-9 object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.55)]"
            />
            <span className="font-display text-sm font-semibold tracking-tight">HearSeek</span>
          </Link>
          <div className="w-[72px]" />
        </div>

        {/* Compact search */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <div
              aria-hidden
              className={cn(
                "absolute -inset-[2px] rounded-xl bg-gradient-waveform blur-md transition-opacity duration-300",
                focused ? "opacity-60" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "relative flex items-center gap-2.5 rounded-xl border border-white/10 bg-card/60 px-3.5 py-2.5 backdrop-blur-xl transition",
                focused && "ring-1 ring-primary/40",
              )}
            >
              <Search className="h-4 w-4 text-primary" />
              <input
                type="text"
                value={pendingQuery}
                onChange={(e) => setPendingQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {/* Scope dropdown — switch collection without leaving results */}
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setScopeOpen((o) => !o)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition hover:border-primary/40 hover:bg-white/10",
                    scopeOpen && "border-primary/40 bg-white/10",
                  )}
                >
                  <ActiveIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden max-w-[140px] truncate sm:inline">
                    {activeConfig.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition",
                      scopeOpen && "rotate-180",
                    )}
                  />
                </button>
                {scopeOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-20 max-h-72 w-56 overflow-y-auto rounded-xl border border-white/10 bg-popover/95 p-1 shadow-elegant backdrop-blur-xl animate-fade-in">
                    {collections.map((cfg) => {
                      const Icon = iconForCollection(cfg.name);
                      const active = cfg.slug === configSlug;
                      return (
                        <button
                          key={cfg.slug}
                          type="button"
                          onClick={() => selectConfig(cfg)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                            active
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-primary" />
                          <span className="flex-1 truncate">{cfg.name}</span>
                          {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Results summary */}
        <div className="mt-5 text-center">
          {loading ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              Searching {configName}…
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{numHits}</span> relevant insight
              {numHits === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-foreground">"{query}"</span> in{" "}
              <span className="text-foreground">{configName}</span>.
            </p>
          )}
        </div>

        {/* Results list (filters sidebar deferred to next iteration) */}
        <div className="mt-8">
          {error ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center">
              <AlertCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
              <h2 className="font-display text-base font-semibold text-foreground">Search failed</h2>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <button
                type="button"
                onClick={() => {
                  // Re-trigger by toggling params
                  const next = new URLSearchParams(params);
                  next.set("_r", String(Date.now()));
                  setParams(next);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground transition hover:border-primary/40"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : hits.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            <div className="flex flex-col gap-4">
              {hits.map((h, i) => (
                <ResultCard key={h.id} hit={h} index={i} />
              ))}
            </div>
          )}
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground/70">
          HearSeek can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;