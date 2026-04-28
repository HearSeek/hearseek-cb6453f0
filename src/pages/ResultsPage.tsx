import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Newspaper,
  Mic,
  GraduationCap,
  Play,
  SlidersHorizontal,
  SearchX,
  Sparkles,
  ArrowLeft,
  Languages as LanguagesIcon,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark.png";

type SourceType = "news" | "podcasts" | "lectures";
type DateRange = "24h" | "7d" | "30d" | "all";
type Language = "english" | "urdu" | "arabic" | "hindi" | "multilingual";

type Result = {
  id: string;
  match: number; // 0-100
  source: SourceType;
  sourceLabel: string;
  channel: string;
  date: string;
  ageDays: number;
  language: Language;
  snippet: string;
  scriptLang: "en" | "ur";
  tStart: string;
  tEnd: string;
  duration: string;
  hue: number;
};

const MOCK: Result[] = [
  {
    id: "r1",
    match: 94,
    source: "news",
    sourceLabel: "News",
    channel: "Geo News — Capital Talk",
    date: "Apr 22, 2026",
    ageDays: 6,
    language: "english",
    snippet:
      "If we fail to strengthen the institutions that uphold democracy, no amount of economic reform will be sustainable in the long run. The speaker argues that judicial independence and electoral transparency are the two pillars that cannot be compromised under any political pressure.",
    scriptLang: "en",
    tStart: "35:21",
    tEnd: "35:35",
    duration: "58:12",
    hue: 258,
  },
  {
    id: "r2",
    match: 91,
    source: "podcasts",
    sourceLabel: "Podcast",
    channel: "The Pakistan Experience",
    date: "Apr 20, 2026",
    ageDays: 8,
    language: "urdu",
    snippet:
      "جمہوریت صرف انتخابات کا نام نہیں، یہ اداروں کی مضبوطی اور شہری آزادیوں کے تحفظ کا مسلسل عمل ہے۔ اس عمل میں میڈیا کی آزادی، عدلیہ کی خودمختاری اور عوام کا باشعور ہونا بنیادی کردار ادا کرتے ہیں۔",
    scriptLang: "ur",
    tStart: "17:25",
    tEnd: "17:41",
    duration: "1:42:08",
    hue: 290,
  },
  {
    id: "r3",
    match: 88,
    source: "news",
    sourceLabel: "News",
    channel: "Dawn News — Live",
    date: "Apr 27, 2026",
    ageDays: 1,
    language: "english",
    snippet:
      "The resilience of democracy in South Asia depends on a free press, independent courts, and citizens who refuse to be silent in the face of overreach. Recent reforms suggest a cautious but tangible shift toward accountability in state institutions.",
    scriptLang: "en",
    tStart: "12:04",
    tEnd: "12:19",
    duration: "42:55",
    hue: 190,
  },
  {
    id: "r4",
    match: 83,
    source: "lectures",
    sourceLabel: "Lecture",
    channel: "LUMS — Public Policy Series",
    date: "Apr 10, 2026",
    ageDays: 18,
    language: "multilingual",
    snippet:
      "Scholars often remind us that democracy is less about majority rule and more about the protections afforded to the minority. Across comparative cases — from Brazil to South Korea — the strength of civil society has repeatedly proven decisive during periods of institutional strain.",
    scriptLang: "en",
    tStart: "08:47",
    tEnd: "09:02",
    duration: "1:12:30",
    hue: 210,
  },
  {
    id: "r5",
    match: 79,
    source: "podcasts",
    sourceLabel: "Podcast",
    channel: "Junoon Podcast",
    date: "Apr 25, 2026",
    ageDays: 3,
    language: "urdu",
    snippet:
      "اگر جمہوریت کو صرف ایک نعرہ بنا دیا جائے تو عوام کا اعتماد کھو جاتا ہے، اور یہی خلا آمریت کو جگہ دیتا ہے۔ مقرر کا کہنا ہے کہ نوجوان نسل کو سیاسی عمل میں شامل کیے بغیر کوئی بھی اصلاحات پائیدار نہیں ہو سکتیں۔",
    scriptLang: "ur",
    tStart: "44:12",
    tEnd: "44:27",
    duration: "2:05:44",
    hue: 258,
  },
  {
    id: "r6",
    match: 72,
    source: "news",
    sourceLabel: "News",
    channel: "ARY News — Off The Record",
    date: "Apr 15, 2026",
    ageDays: 13,
    language: "english",
    snippet:
      "The election commission's transparency drive is a quiet but important victory for democracy and for every voter in the country. Analysts note that publishing polling-station-level data is a baseline reform that many older democracies still struggle to implement consistently.",
    scriptLang: "en",
    tStart: "21:40",
    tEnd: "21:55",
    duration: "48:20",
    hue: 190,
  },
];

const SOURCE_OPTS: { id: SourceType; label: string; icon: typeof Newspaper }[] = [
  { id: "news", label: "News", icon: Newspaper },
  { id: "podcasts", label: "Podcasts", icon: Mic },
  { id: "lectures", label: "Lectures", icon: GraduationCap },
];

const DATE_OPTS: { id: DateRange; label: string }[] = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

const LANGUAGE_OPTS: { id: Language; label: string; dot: string }[] = [
  { id: "english", label: "English", dot: "bg-sky-400" },
  { id: "urdu", label: "Urdu", dot: "bg-emerald-400" },
  { id: "arabic", label: "Arabic", dot: "bg-amber-400" },
  { id: "hindi", label: "Hindi", dot: "bg-rose-400" },
  { id: "multilingual", label: "Multilingual", dot: "bg-violet-400" },
];

const languageLabel = (l: Language) =>
  l === "english" ? "English" : l === "urdu" ? "Urdu" : l === "arabic" ? "Arabic" : l === "hindi" ? "Hindi" : "Multilingual";

// Relevance meter — circular ring with brand gradient
const RelevanceMeter = ({ value }: { value: number }) => {
  const size = 64;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="-rotate-90">
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
      <div className="absolute inset-0 flex items-center justify-center pt-0.5">
        <span className="font-display text-sm font-semibold text-foreground">{value}%</span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Match</span>
    </div>
  );
};

// Highlight query tokens with glow; supports English + Urdu (case/diacritic tolerant)
const Highlighted = ({ text, query, lang }: { text: string; query: string; lang: "en" | "ur" }) => {
  const tokens = query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
  if (tokens.length === 0) {
    return (
      <p className={cn("text-[15px] leading-relaxed text-foreground/90", lang === "ur" && "font-urdu text-right text-lg")}>
        {text}
      </p>
    );
  }
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <p
      className={cn(
        "text-[15px] leading-relaxed text-foreground/90",
        lang === "ur" && "font-urdu text-right text-lg",
      )}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      {parts.map((part, i) =>
        tokens.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-transparent font-semibold text-accent"
            style={{ textShadow: "0 0 10px hsl(190 95% 55% / 0.65)" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
};

const languageDot = (l: Language) =>
  l === "english"
    ? "bg-sky-400"
    : l === "urdu"
      ? "bg-emerald-400"
      : l === "arabic"
        ? "bg-amber-400"
        : l === "hindi"
          ? "bg-rose-400"
          : "bg-violet-400";

const SourcePill = ({ source, label }: { source: SourceType; label: string }) => {
  const Icon = source === "news" ? Newspaper : source === "podcasts" ? Mic : GraduationCap;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const ResultCard = ({ result, query, index }: { result: Result; query: string; index: number }) => {
  const bg = `linear-gradient(135deg, hsl(${result.hue} 70% 22%) 0%, hsl(${(result.hue + 40) % 360} 60% 10%) 100%)`;
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
        <RelevanceMeter value={result.match} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <SourcePill source={result.source} label={result.sourceLabel} />
          <span className="text-xs text-muted-foreground">{result.channel}</span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground">{result.date}</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
            <LanguagesIcon className="h-3 w-3 text-primary/80" />
            <span className={cn("h-1.5 w-1.5 rounded-full", languageDot(result.language))} />
            <span>{languageLabel(result.language)}</span>
          </span>
        </div>
        <Highlighted text={result.snippet} query={query} lang={result.scriptLang} />
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>AI-extracted insight · {result.tStart} – {result.tEnd}</span>
        </div>
      </div>

      {/* Video preview */}
      <div className="w-full md:w-[260px]">
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <AspectRatio ratio={16 / 9}>
            <div className="relative h-full w-full" style={{ backgroundImage: bg }}>
              <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
                <path d="M0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40" fill="none" stroke="white" strokeWidth="1" />
                <path d="M0 52 Q 25 24 50 52 T 100 52 T 150 52 T 200 52" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
              </svg>
              {/* Play on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-waveform shadow-elegant">
                  <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" />
                </div>
              </div>
              {/* Timestamp badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <span className="rounded-md border border-white/15 bg-background/80 px-2 py-1 font-mono text-[11px] font-medium tracking-tight text-foreground backdrop-blur">
                  {result.tStart} — {result.tEnd}
                </span>
              </div>
              {/* Duration corner */}
              <span className="absolute right-2 top-2 rounded bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80 backdrop-blur">
                {result.duration}
              </span>
            </div>
          </AspectRatio>
        </div>
      </div>
    </article>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
    <div className="flex flex-col gap-1.5">{children}</div>
  </div>
);

const CheckRow = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      "group/row flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition",
      checked ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
    )}
  >
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
        checked ? "border-primary bg-gradient-waveform" : "border-white/15 bg-white/5",
      )}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-white">
          <path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="flex flex-1 items-center gap-2">{children}</span>
  </button>
);

const RadioRow = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition",
      checked ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
    )}
  >
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
        checked ? "border-primary" : "border-white/15",
      )}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-gradient-waveform" />}
    </span>
    {children}
  </button>
);

const EmptyState = ({ query, onPick }: { query: string; onPick: (q: string) => void }) => {
  const suggestions = ["Climate policy", "AI regulation", "Elections 2026", "Inflation", "Energy crisis"];
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-card/40 p-10 text-center backdrop-blur-xl">
      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-waveform opacity-20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-background/60 backdrop-blur">
          <SearchX className="h-9 w-9 text-primary" strokeWidth={1.4} />
        </div>
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground">No insights found{query && ` for "${query}"`}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Try loosening your filters, or explore one of these trending topics.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialQ = params.get("q") ?? "Democracy";
  const [query, setQuery] = useState(initialQ);
  const [pendingQuery, setPendingQuery] = useState(initialQ);
  const [focused, setFocused] = useState(false);

  const [sources, setSources] = useState<Set<SourceType>>(new Set(["news", "podcasts", "lectures"]));
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [languages, setLanguages] = useState<Set<Language>>(
    new Set(["english", "urdu", "arabic", "hindi", "multilingual"]),
  );

  const toggleSource = (s: SourceType) => {
    const next = new Set(sources);
    next.has(s) ? next.delete(s) : next.add(s);
    setSources(next);
  };
  const toggleLanguage = (l: Language) => {
    const next = new Set(languages);
    next.has(l) ? next.delete(l) : next.add(l);
    setLanguages(next);
  };

  const dayLimit = dateRange === "24h" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : Infinity;

  const results = useMemo(() => {
    return MOCK.filter(
      (r) => sources.has(r.source) && languages.has(r.language) && r.ageDays <= dayLimit,
    );
  }, [sources, languages, dayLimit]);

  const scopeLabel =
    sources.size === 3
      ? "All Sources"
      : [...sources]
          .map((s) => (s === "news" ? "News Channels" : s === "podcasts" ? "Podcasts" : "Lectures"))
          .join(" & ");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(pendingQuery.trim());
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
              <kbd className="hidden items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                ⌘K
              </kbd>
            </div>
          </div>
        </form>

        {/* Results summary */}
        <div className="mt-5 text-center">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{results.length}</span> relevant insight{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-foreground">"{query}"</span> in{" "}
            <span className="text-foreground">{scopeLabel}</span>.
          </p>
        </div>

        {/* Main grid: sidebar + results */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-max rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl lg:sticky lg:top-6">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Refine Results</h2>
            </div>
            <div className="flex flex-col gap-5">
              <FilterSection title="Source Type">
                {SOURCE_OPTS.map((s) => (
                  <CheckRow key={s.id} checked={sources.has(s.id)} onChange={() => toggleSource(s.id)}>
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </CheckRow>
                ))}
              </FilterSection>
              <FilterSection title="Date Range">
                {DATE_OPTS.map((d) => (
                  <RadioRow key={d.id} checked={dateRange === d.id} onChange={() => setDateRange(d.id)}>
                    {d.label}
                  </RadioRow>
                ))}
              </FilterSection>
              <FilterSection title="Language">
                {LANGUAGE_OPTS.map((l) => (
                  <CheckRow key={l.id} checked={languages.has(l.id)} onChange={() => toggleLanguage(l.id)}>
                    <span className={cn("h-2 w-2 rounded-full", l.dot)} />
                    {l.label}
                  </CheckRow>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Results list */}
          <div className="min-w-0">
            {results.length === 0 ? (
              <EmptyState
                query={query}
                onPick={(q) => {
                  setPendingQuery(q);
                  setQuery(q);
                  setSources(new Set(["news", "podcasts", "lectures"]));
                  setLanguages(new Set(["english", "urdu", "arabic", "hindi", "multilingual"]));
                  setDateRange("all");
                }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((r, i) => (
                  <ResultCard key={r.id} result={r} query={query} index={i} />
                ))}
              </div>
            )}
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