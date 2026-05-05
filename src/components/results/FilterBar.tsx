import { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Languages, Calendar, Check, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type SearchFilters,
  EMPTY_FILTERS,
  FILTER_YEAR_MIN,
  FILTER_YEAR_MAX,
  filtersAreEmpty,
  filtersEqual,
} from "@/lib/hearseek";

// TODO: replace with /api/languages once the backend exposes it.
const AVAILABLE_LANGUAGES: { code: string; label: string; dot: string }[] = [
  { code: "en", label: "English", dot: "bg-sky-400" },
  { code: "ur", label: "Urdu", dot: "bg-emerald-400" },
];

const yearLo = (f: SearchFilters) => f.yearMin ?? FILTER_YEAR_MIN;
const yearHi = (f: SearchFilters) => f.yearMax ?? FILTER_YEAR_MAX;
const isFullYearRange = (f: SearchFilters) =>
  yearLo(f) <= FILTER_YEAR_MIN && yearHi(f) >= FILTER_YEAR_MAX;

type Props = {
  staged: SearchFilters;
  applied: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

const SidebarBody = ({ staged, applied, onChange, onApply, onClear }: Props) => {
  const hasUnapplied = !filtersEqual(staged, applied);
  const hasActive = !filtersAreEmpty(applied);

  const toggleLanguage = (code: string) => {
    const set = new Set(staged.languages);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    onChange({ ...staged, languages: Array.from(set) });
  };

  const setYearRange = (lo: number, hi: number) => {
    onChange({ ...staged, yearMin: lo, yearMax: hi });
  };

  return (
    <aside className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
            Filters
          </h2>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Language */}
      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Languages className="h-3 w-3 text-primary/80" />
          Language
        </div>
        <div className="flex flex-col gap-1">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const checked = staged.languages.includes(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
                  checked
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/20 bg-transparent",
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className={cn("h-1.5 w-1.5 rounded-full", lang.dot)} aria-hidden />
                <span className="flex-1 truncate">{lang.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  {lang.code}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Year */}
      <section className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Calendar className="h-3 w-3 text-primary/80" />
            Upload year
          </div>
          <span className="font-mono text-xs text-foreground">
            {yearLo(staged)} — {yearHi(staged)}
          </span>
        </div>
        <div className="px-1 pt-2 pb-1">
          <SliderPrimitive.Root
            min={FILTER_YEAR_MIN}
            max={FILTER_YEAR_MAX}
            step={1}
            minStepsBetweenThumbs={0}
            value={[yearLo(staged), yearHi(staged)]}
            onValueChange={(vals) => {
              if (vals.length === 2) setYearRange(vals[0], vals[1]);
            }}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
              <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[hsl(190_95%_55%)] via-[hsl(258_90%_66%)] to-[hsl(290_80%_60%)]" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              aria-label="Minimum year"
              className="block h-4 w-4 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_hsl(258_90%_66%/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <SliderPrimitive.Thumb
              aria-label="Maximum year"
              className="block h-4 w-4 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_hsl(258_90%_66%/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </SliderPrimitive.Root>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/60">
            <span>{FILTER_YEAR_MIN}</span>
            <span>{FILTER_YEAR_MAX}</span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onApply}
        disabled={!hasUnapplied}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm font-medium transition",
          hasUnapplied
            ? "border-primary/50 bg-primary/15 text-foreground hover:bg-primary/25"
            : "cursor-not-allowed border-white/10 bg-white/5 text-muted-foreground/60",
        )}
      >
        Apply filters
      </button>
    </aside>
  );
};

export const FilterSidebar = (props: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasActive = !filtersAreEmpty(props.applied);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground/90 transition hover:border-primary/40"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
            {hasActive && (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                active
              </span>
            )}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && (
          <div className="mt-3">
            <SidebarBody {...props} />
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <SidebarBody {...props} />
      </div>
    </>
  );
};

export const filtersFromUrl = (params: URLSearchParams): SearchFilters => {
  const lang = params.get("lang");
  const yMin = params.get("yearMin");
  const yMax = params.get("yearMax");
  const languages = lang
    ? lang.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const yearMin = yMin ? Number.parseInt(yMin, 10) : null;
  const yearMax = yMax ? Number.parseInt(yMax, 10) : null;
  return {
    languages,
    yearMin: Number.isFinite(yearMin as number) ? yearMin : null,
    yearMax: Number.isFinite(yearMax as number) ? yearMax : null,
  };
};

export const writeFiltersToParams = (
  params: URLSearchParams,
  filters: SearchFilters,
) => {
  if (filters.languages.length > 0) {
    params.set("lang", filters.languages.join(","));
  } else {
    params.delete("lang");
  }
  if (filters.yearMin !== null && filters.yearMin > FILTER_YEAR_MIN) {
    params.set("yearMin", String(filters.yearMin));
  } else {
    params.delete("yearMin");
  }
  if (filters.yearMax !== null && filters.yearMax < FILTER_YEAR_MAX) {
    params.set("yearMax", String(filters.yearMax));
  } else {
    params.delete("yearMax");
  }
};

export { EMPTY_FILTERS };