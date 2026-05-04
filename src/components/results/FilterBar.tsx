import { useEffect, useRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Languages, Calendar, ChevronDown, Check, X } from "lucide-react";
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

type PillProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
};

const FilterPill = ({ icon, label, active, open, onToggle }: PillProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition md:text-sm",
      "border-white/10 bg-white/5 text-foreground/90 hover:border-primary/40 hover:bg-white/10",
      open && "border-primary/40 bg-white/10",
      active &&
        "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_18px_-6px_hsl(258_90%_66%/0.55)]",
    )}
  >
    {icon}
    <span>{label}</span>
    <ChevronDown
      className={cn(
        "h-3.5 w-3.5 text-muted-foreground transition",
        open && "rotate-180",
      )}
    />
  </button>
);

type Props = {
  staged: SearchFilters;
  applied: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

export const FilterBar = ({
  staged,
  applied,
  onChange,
  onApply,
  onClear,
}: Props) => {
  const [openPopover, setOpenPopover] = useState<"lang" | "year" | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const langActive = applied.languages.length > 0;
  const yearActive = !isFullYearRange(applied);
  const hasUnapplied = !filtersEqual(staged, applied);
  const hasActive = !filtersAreEmpty(applied);

  const langLabel =
    staged.languages.length === 0
      ? "Language"
      : staged.languages.length === 1
        ? AVAILABLE_LANGUAGES.find((l) => l.code === staged.languages[0])?.label ??
          staged.languages[0].toUpperCase()
        : `${staged.languages[0].toUpperCase()} +${staged.languages.length - 1}`;

  const yearLabel = isFullYearRange(staged)
    ? "Upload year"
    : `${yearLo(staged)} — ${yearHi(staged)}`;

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
    <div
      ref={wrapperRef}
      className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center gap-2 px-1"
    >
      {/* Language */}
      <div className="relative">
        <FilterPill
          icon={<Languages className="h-3.5 w-3.5 text-primary" />}
          label={langLabel}
          active={langActive}
          open={openPopover === "lang"}
          onToggle={() =>
            setOpenPopover((p) => (p === "lang" ? null : "lang"))
          }
        />
        {openPopover === "lang" && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-56 overflow-hidden rounded-xl border border-white/10 bg-popover/95 p-1 shadow-elegant backdrop-blur-xl animate-fade-in">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const checked = staged.languages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
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
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", lang.dot)}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{lang.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {lang.code}
                  </span>
                </button>
              );
            })}
            {/* TODO: replace with /api/languages */}
          </div>
        )}
      </div>

      {/* Year range */}
      <div className="relative">
        <FilterPill
          icon={<Calendar className="h-3.5 w-3.5 text-primary" />}
          label={yearLabel}
          active={yearActive}
          open={openPopover === "year"}
          onToggle={() =>
            setOpenPopover((p) => (p === "year" ? null : "year"))
          }
        />
        {openPopover === "year" && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-72 rounded-xl border border-white/10 bg-popover/95 p-4 shadow-elegant backdrop-blur-xl animate-fade-in">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Upload year</span>
              <span className="font-mono text-foreground">
                {yearLo(staged)} — {yearHi(staged)}
              </span>
            </div>
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
            {!isFullYearRange(staged) && (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...staged,
                    yearMin: null,
                    yearMax: null,
                  })
                }
                className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-3 w-3" /> Reset range
              </button>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setOpenPopover(null);
            onApply();
          }}
          disabled={!hasUnapplied}
          className={cn(
            "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition md:text-sm",
            hasUnapplied
              ? "border-primary/50 bg-primary/15 text-foreground hover:bg-primary/25"
              : "cursor-not-allowed border-white/10 bg-white/5 text-muted-foreground/60",
          )}
        >
          Apply
        </button>
      </div>
    </div>
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