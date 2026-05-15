import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Newspaper,
  Mic,
  ChevronDown,
  Check,
  PlayCircle,
  Video,
  Users,
  Library,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark.png";
import { getSearchConfigurations, type SearchConfig } from "@/lib/hearseek";
import { SEO } from "@/components/site/SEO";
import { trackEvent } from "@/lib/analytics";

const FALLBACK_CONFIGS: SearchConfig[] = [
  { name: "News Channels", slug: "news-channels" },
  { name: "Podcasts", slug: "podcasts" },
];

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

const PLACEHOLDERS = [
  "Ask HearSeek to search across hundreds of broadcasts...",
  "Ask HearSeek to find specific insights in podcasts...",
  "Ask HearSeek to analyze news coverage on any topic...",
];

// Suggested searches per collection. We match by substring on the slug so this
// keeps working regardless of the exact slug naming returned by the API.
const PODCAST_SUGGESTIONS = [
  "what CIA missed about the global geopolitics",
  "how are narratives built?",
  "what opportunity gap results in",
  "Can we achieve equality as humans",
  "part where the guest admits uncertainty",
];
const NEWS_SUGGESTIONS = [
  "how global alliances are shifting",
  "Does Putin want negotiations?",
  "Imran khan about Israel",
  "AI increasing jobs",
  "Different interpretations of Zionism",
];
const suggestionsForScope = (scopeSlug: string): string[] => {
  const s = scopeSlug.toLowerCase();
  if (s.includes("podcast")) return PODCAST_SUGGESTIONS;
  if (s.includes("news")) return NEWS_SUGGESTIONS;
  return [];
};

// Typing-animation placeholder — mutates the input's `placeholder` attribute
// directly via RAF, so it never triggers React re-renders (critical for
// Safari, where re-rendering a backdrop-blur surface every frame stutters).
const useTypingPlaceholder = (phrases: string[], active: boolean) => {
  const elRef = useRef<HTMLInputElement | null>(null);

  const setRef = useCallback((el: HTMLInputElement | null) => {
    elRef.current = el;
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (!active) {
      el.placeholder = "";
      return;
    }
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let cancelled = false;
    let raf = 0;
    let nextAt = performance.now() + 250;

    const TYPE_MS = 55;
    const DELETE_MS = 30;
    const HOLD_FULL_MS = 1600;
    const HOLD_EMPTY_MS = 350;
    const JITTER = 18;

    const loop = (now: number) => {
      if (cancelled) return;
      if (now >= nextAt) {
        const current = phrases[phraseIdx];
        if (!deleting) {
          charIdx++;
          if (elRef.current) elRef.current.placeholder = current.slice(0, charIdx);
          if (charIdx === current.length) {
            deleting = true;
            nextAt = now + HOLD_FULL_MS;
          } else {
            nextAt = now + TYPE_MS + Math.random() * JITTER;
          }
        } else {
          charIdx--;
          if (elRef.current) elRef.current.placeholder = current.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            nextAt = now + HOLD_EMPTY_MS;
          } else {
            nextAt = now + DELETE_MS + Math.random() * (JITTER / 2);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [phrases, active]);

  return setRef;
};

const DemoPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<SearchConfig[]>(FALLBACK_CONFIGS);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [scope, setScope] = useState<SearchConfig>(FALLBACK_CONFIGS[0]);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placeholderRef = useTypingPlaceholder(PLACEHOLDERS, value.length === 0);

  // Fetch dynamic search configurations (cached 5 min in lib/hearseek.ts)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSearchConfigurations();
        if (cancelled) return;
        if (data.length > 0) {
          setCollections(data);
          setScope(data[0]);
          setUsedFallback(false);
        } else {
          setUsedFallback(true);
        }
      } catch (err) {
        console.warn("[DemoPage] Failed to load search configurations:", err);
        if (!cancelled) setUsedFallback(true);
      } finally {
        if (!cancelled) setCollectionsLoading(false);
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

  const ActiveIcon = iconForCollection(scope.name);
  const activeLabel = scope.name;
  const suggestions = suggestionsForScope(scope.slug);

  const submitQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    trackEvent("demo_search", {
      query_length: trimmed.length,
      collection_slug: scope.slug,
      collection_name: scope.name,
    });
    const params = new URLSearchParams({
      q: trimmed,
      config: scope.slug,
      configName: scope.name,
    });
    navigate(`/results?${params.toString()}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(value);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <SEO
        title="Try HearSeek — Live Audio Search Demo"
        description="Search a curated collection of podcasts and news clips with HearSeek's semantic, multilingual audio search engine. Try it live."
        path="/demo"
      />
      {/* Ambient mesh gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-waveform opacity-[0.18] blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 md:px-8">
        {/* Logo */}
        <img
          src={logoMark}
          alt="HearSeek logo"
          className="mb-3 h-[77px] w-[77px] object-contain drop-shadow-[0_0_28px_hsl(var(--primary)/0.6)] md:h-[97px] md:w-[97px]"
        />
        <p className="mb-8 text-center text-xs text-muted-foreground md:text-sm">
          The World's First AI Search Engine for Audio
        </p>
        <h1 className="mb-10 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
          What would you like to find today?
        </h1>

        {/* Hero search */}
        <form onSubmit={onSubmit} className="w-full">
          <div className="relative">
            <div
              className={cn(
                "relative flex items-center gap-2 rounded-2xl border bg-card/60 px-3 py-3 backdrop-blur-xl transition-colors duration-300 md:gap-3 md:px-4 md:py-3.5",
                "border-white/10",
                "search-halo",
                focused && "search-halo-active",
              )}
              style={{ transform: "translateZ(0)", willChange: "transform" }}
            >
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                type="text"
                ref={placeholderRef}
                aria-label="Search HearSeek"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm text-foreground outline-none ring-0 shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none md:text-base"
                style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent", boxShadow: "none", outline: "none" }}
              />

              {/* Integrated scope dropdown — dynamic from API */}
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => !collectionsLoading && setScopeOpen((o) => !o)}
                  disabled={collectionsLoading}
                  aria-label={`Collection scope: ${activeLabel}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition hover:border-primary/40 hover:bg-white/10 md:text-sm",
                    scopeOpen && "border-primary/40 bg-white/10",
                    collectionsLoading && "cursor-wait opacity-70",
                  )}
                >
                  {collectionsLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span className="hidden sm:inline">Loading…</span>
                    </>
                  ) : (
                    <>
                      <ActiveIcon className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden max-w-[140px] truncate sm:inline">{activeLabel}</span>
                    </>
                  )}
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition", scopeOpen && "rotate-180")} />
                </button>
                {scopeOpen && !collectionsLoading && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-20 max-h-72 w-56 overflow-y-auto rounded-xl border border-white/10 bg-popover/95 p-1 shadow-elegant backdrop-blur-xl animate-fade-in">
                    {collections.map((cfg) => {
                      const Icon = iconForCollection(cfg.name);
                      const active = cfg.slug === scope.slug;
                      return (
                        <button
                          key={cfg.slug}
                          type="button"
                          onClick={() => {
                            setScope(cfg);
                            setScopeOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                            active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
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
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-normal text-white/70">
            This demo searches a limited, hand-picked collection of podcasts and news clips
            to showcase HearSeek's capabilities. It does not yet search the entire web.
            {usedFallback && (
              <span className="ml-1 text-white/50">(using default collections)</span>
            )}
          </p>

          {suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setValue(s);
                    submitQuery(s);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-white/10 hover:text-foreground md:text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </form>
      </main>

      <p className="relative mb-6 text-center text-xs text-muted-foreground/70">
        HearSeek can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default DemoPage;
