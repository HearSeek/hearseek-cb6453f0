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
  Share2,
  Link2,
  Facebook,
  Twitter,
  Code2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  type SearchFilters,
  EMPTY_FILTERS,
  filtersEqual,
} from "@/lib/hearseek";
import {
  FilterSidebar,
  filtersFromUrl,
  writeFiltersToParams,
} from "@/components/results/FilterBar";
import { fetchVideoDurations, fetchVideoTitles } from "@/lib/youtubeDuration";
import { type Collection } from "@/lib/registry";

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

// Convert ASCII letters to Unicode sans-serif bold (𝗛𝗲𝗮𝗿𝗦𝗲𝗲𝗸).
const toUnicodeBold = (s: string): string => {
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) out += String.fromCodePoint(0x1d5d4 + (c - 65));
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(0x1d5ee + (c - 97));
    else out += ch;
  }
  return out;
};
// Convert ASCII letters to Unicode sans-serif italic.
const toUnicodeItalic = (s: string): string => {
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) out += String.fromCodePoint(0x1d608 + (c - 65));
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(0x1d622 + (c - 97));
    else out += ch;
  }
  return out;
};

const BRAND_BOLD = toUnicodeBold("HearSeek");
const TAGLINE_ITALIC = toUnicodeItalic("The World's First AI Search Engine for Audio");

const buildShareCaption = (): string =>
  `I found this exact moment on ${BRAND_BOLD} - ${TAGLINE_ITALIC}`;

const buildShareText = (link: string): string =>
  `${buildShareCaption()}\n${link}`;

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M19.05 4.91A10 10 0 0 0 4.1 18.27L3 22l3.83-1.07a10 10 0 0 0 4.79 1.22h.01a10 10 0 0 0 7.42-17.24Zm-7.42 15.39a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-2.27.63.61-2.21-.2-.32A8.3 8.3 0 1 1 11.63 20.3Zm4.55-6.22c-.25-.13-1.47-.73-1.7-.81s-.4-.13-.56.13-.64.81-.79.97-.29.2-.54.07a6.8 6.8 0 0 1-2-1.24 7.5 7.5 0 0 1-1.39-1.73c-.14-.25 0-.38.11-.51l.38-.44c.13-.15.17-.25.25-.42a.46.46 0 0 0 0-.44c-.07-.13-.56-1.34-.76-1.84s-.4-.42-.56-.43h-.48a.93.93 0 0 0-.67.31 2.83 2.83 0 0 0-.88 2.1c0 1.24.9 2.43 1 2.6s1.77 2.7 4.29 3.78a14 14 0 0 0 1.43.53 3.42 3.42 0 0 0 1.58.1 2.58 2.58 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .14-1.2c-.06-.1-.23-.16-.48-.29Z"/>
  </svg>
);

const ShareRow = ({ hit }: { hit: SearchHit }) => {
  const [open, setOpen] = useState(false);
  const link = buildJumpLink(hit) ?? (typeof window !== "undefined" ? window.location.href : "");
  const fullText = buildShareText(link);
  const caption = buildShareCaption();
  const encodedText = encodeURIComponent(fullText);
  const encodedCaption = encodeURIComponent(caption);
  const encodedUrl = encodeURIComponent(link);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copied", description: "Jump link copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Could not access clipboard.", variant: "destructive" });
    }
    setOpen(false);
  };

  const copyEmbed = async () => {
    const embed = hit.videoId
      ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${hit.videoId}?start=${hit.start}" title="HearSeek clip" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
      : link;
    try {
      await navigator.clipboard.writeText(embed);
      toast({ title: "Embed code copied", description: "Paste it into your site's HTML." });
    } catch {
      toast({ title: "Copy failed", description: "Could not access clipboard.", variant: "destructive" });
    }
    setOpen(false);
  };

  const items: Array<{
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    href?: string;
  }> = [
    {
      label: "Copy link",
      icon: <Link2 className="h-4 w-4" />,
      onClick: copyLink,
    },
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-4 w-4" />,
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedCaption}`,
    },
    {
      label: "X",
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}`,
    },
    {
      label: "Embed",
      icon: <Code2 className="h-4 w-4" />,
      onClick: copyEmbed,
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground/90 transition hover:border-primary/40 hover:bg-white/10 hover:text-foreground"
        >
          <Share2 className="h-3.5 w-3.5 text-primary" />
          Share this clip
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 border border-white/10 bg-popover/95 p-1.5 shadow-elegant backdrop-blur-xl"
      >
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Share this clip
        </div>
        <div className="flex flex-col gap-0.5">
          {items.map((it) =>
            it.href ? (
              <a
                key={it.label}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-primary">
                  {it.icon}
                </span>
                <span>{it.label}</span>
              </a>
            ) : (
              <button
                key={it.label}
                type="button"
                onClick={it.onClick}
                className="flex items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-primary">
                  {it.icon}
                </span>
                <span>{it.label}</span>
              </button>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ResultCard = ({
  hit,
  index,
  duration,
  titleOverride,
}: {
  hit: SearchHit;
  index: number;
  duration?: number;
  titleOverride?: string;
}) => {
  const jumpLink = buildJumpLink(hit);
  const thumb = hit.videoId ? youtubeThumbnail(hit.videoId) : null;
  const tStart = formatTimestamp(hit.start);
  const tEnd = formatTimestamp(hit.end);
  const rtl = isRtl(hit.language);
  const displayTitle = titleOverride || hit.title || null;
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
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
            <LanguagesIcon className="h-3 w-3 text-primary/80" />
            <span className={cn("h-1.5 w-1.5 rounded-full", languageDot(hit.language))} />
            <span>{languageLabel(hit.language)}</span>
          </span>
        </div>
        {displayTitle && (
          <h3
            dir={rtl ? "rtl" : "ltr"}
            className={cn(
              "mt-1.5 mb-1 truncate font-display text-sm font-medium text-foreground/90",
              rtl && "text-right",
            )}
          >
            {displayTitle}
          </h3>
        )}
        <Snippet hit={hit} />
        {jumpLink && (
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <a
              href={jumpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-primary transition hover:text-accent"
            >
              Jump to {tStart} →
            </a>
          </div>
        )}
      </div>

      {/* Video preview */}
      <div className="flex h-full w-full flex-col justify-center self-stretch md:w-[260px]">
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
                {/* Video duration corner */}
                {duration !== undefined && duration > 0 && (
                  <span className="absolute right-2 top-2 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground/90 backdrop-blur">
                    {formatTimestamp(duration)}
                  </span>
                )}
              </div>
            </AspectRatio>
          </div>
        </a>
        <div className="flex justify-center">
          <ShareRow hit={hit} />
        </div>
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

type ResultsPageProps = {
  collection?: Collection;
};

const ResultsPage = ({ collection }: ResultsPageProps = {}) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const configSlug = collection?.configSlug ?? params.get("config") ?? "";
  const configName = collection?.configName ?? params.get("configName") ?? configSlug;
  const backTo = collection ? `/collections/${collection.key}` : "/demo";

  const [pendingQuery, setPendingQuery] = useState(query);
  const [pendingConfig, setPendingConfig] = useState<SearchConfig>({
    name: configName,
    slug: configSlug,
  });
  const [focused, setFocused] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [numHits, setNumHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [videoTitles, setVideoTitles] = useState<Record<string, string>>({});

  // Applied filters mirror what's in the URL and drive the search effect.
  // Staged filters live only in local state until the user hits Apply.
  const appliedFilters = filtersFromUrl(params);
  const appliedFiltersKey = JSON.stringify(appliedFilters);
  const [stagedFilters, setStagedFilters] = useState<SearchFilters>(appliedFilters);

  // Re-sync staged filters when the URL changes (back/forward, clear, etc.)
  // unless the user already has unapplied edits matching the new applied set.
  useEffect(() => {
    setStagedFilters((prev) =>
      filtersEqual(prev, appliedFilters) ? prev : appliedFilters,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFiltersKey]);

  // Collection dropdown — re-selectable from results page
  const [collections, setCollections] = useState<SearchConfig[]>([
    { name: configName, slug: configSlug },
  ]);
  const [scopeOpen, setScopeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (collection) return; // collection mode locks the collection — no need to fetch
    (async () => {
      try {
        const data = await getSearchConfigurations();
        if (!cancelled && data.length > 0) {
          setCollections(data);
          // Hydrate pending config name from server if we only had the slug.
          const match = data.find((c) => c.slug === configSlug);
          if (match) setPendingConfig(match);
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configSlug, collection]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setScopeOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ActiveIcon = iconForCollection(pendingConfig.name);

  // Selecting a collection only updates pending state — no auto search.
  // The search runs when the user submits the form (Enter / click).
  const selectConfig = (cfg: SearchConfig) => {
    setScopeOpen(false);
    setPendingConfig(cfg);
  };

  useEffect(() => {
    setPendingQuery(query);
  }, [query]);

  // Keep pending config in sync when URL config changes (e.g. back/forward nav).
  useEffect(() => {
    setPendingConfig((prev) =>
      prev.slug === configSlug ? prev : { name: configName, slug: configSlug },
    );
  }, [configSlug, configName]);

  useEffect(() => {
    if (!query || !configSlug) {
      setHits([]);
      setNumHits(0);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    runSearch(query, configSlug, controller.signal, appliedFilters, collection?.baseFilter)
      .then((res) => {
        setHits(res.hits);
        setNumHits(res.numHits);
        const ids = Array.from(
          new Set(res.hits.map((h) => h.videoId).filter((v): v is string => !!v)),
        );
        if (ids.length > 0) {
          fetchVideoDurations(ids).then((map) => {
            setDurations((prev) => ({ ...prev, ...map }));
          });
          fetchVideoTitles(ids).then((map) => {
            setVideoTitles((prev) => ({ ...prev, ...map }));
          });
        }
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
    // appliedFiltersKey captures the filter state cheaply for the dep array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, configSlug, appliedFiltersKey]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = pendingQuery.trim();
    if (!q) return;
    const next = new URLSearchParams(params);
    next.set("q", q);
    if (!collection) {
      next.set("config", pendingConfig.slug);
      next.set("configName", pendingConfig.name);
    }
    setParams(next);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    writeFiltersToParams(next, stagedFilters);
    setParams(next);
  };

  const clearFilters = () => {
    setStagedFilters(EMPTY_FILTERS);
    const next = new URLSearchParams(params);
    writeFiltersToParams(next, EMPTY_FILTERS);
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
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <Link to={backTo} className="flex items-center gap-2">
            <img
              src={logoMark}
              alt="HearSeek"
              className="h-9 w-9 object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.55)]"
            />
            {collection?.logo ? (
              <>
                <span className="text-base font-light text-muted-foreground/70" aria-hidden>
                  ×
                </span>
                <img
                  src={collection.logo}
                  alt={`${collection.name} logo`}
                  className="h-9 w-auto object-contain"
                />
              </>
            ) : (
              <span className="font-display text-sm font-semibold tracking-tight">
                HearSeek
              </span>
            )}
          </Link>
          <div className="w-[72px]" />
        </div>

        {/* Compact search */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-2xl">
          <h1 className="sr-only">
            {query ? `Search results for "${query}"` : "Search Results"}
          </h1>
          <div className="relative">
            <div
              className={cn(
                "relative flex items-center gap-2.5 rounded-xl border bg-card/60 px-3.5 py-2.5 backdrop-blur-xl transition-colors duration-300",
                "border-white/10",
                "search-halo",
                focused && "search-halo-active",
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
                className="flex-1 appearance-none border-0 bg-transparent text-sm text-foreground outline-none ring-0 shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
                style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent", boxShadow: "none", outline: "none" }}
              />
              {/* Scope dropdown — hidden in collection mode (collection is locked) */}
              {!collection && (
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
                    {pendingConfig.name}
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
                      const active = cfg.slug === pendingConfig.slug;
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
              )}
            </div>
          </div>
        </form>

        {/* Sidebar + results */}
        <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
          <FilterSidebar
            staged={stagedFilters}
            applied={appliedFilters}
            onChange={setStagedFilters}
            onApply={applyFilters}
            onClear={clearFilters}
            availableLanguages={Array.from(
              new Set(hits.map((h) => h.language).filter((l): l is string => !!l)),
            )}
          />

          <div>
            <div className="text-center md:text-left">
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

            <div className="mt-6">
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
                <ResultCard
                  key={h.id}
                  hit={h}
                  index={i}
                  duration={h.videoId ? durations[h.videoId] : undefined}
                  titleOverride={h.videoId ? videoTitles[h.videoId] : undefined}
                />
              ))}
            </div>
          )}
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground/70">
          HearSeek can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;