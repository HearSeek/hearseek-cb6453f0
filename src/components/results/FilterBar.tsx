import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Languages, Calendar as CalendarIcon, Check, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  type SearchFilters,
  type DatePreset,
  EMPTY_FILTERS,
  filtersAreEmpty,
  filtersEqual,
  datePresetRange,
  detectDatePreset,
} from "@/lib/hearseek";

// Catalog of languages we know how to label/dot. The actual options shown
// in the sidebar are filtered down to the languages present in the current
// search results (passed via `availableLanguages`).
const LANGUAGE_CATALOG: Record<string, { label: string; dot: string }> = {
  en: { label: "English", dot: "bg-sky-400" },
  ur: { label: "Urdu", dot: "bg-emerald-400" },
  ar: { label: "Arabic", dot: "bg-amber-400" },
  hi: { label: "Hindi", dot: "bg-rose-400" },
  fa: { label: "Persian", dot: "bg-violet-400" },
  he: { label: "Hebrew", dot: "bg-violet-400" },
  es: { label: "Spanish", dot: "bg-amber-400" },
  fr: { label: "French", dot: "bg-sky-400" },
  de: { label: "German", dot: "bg-amber-400" },
  pt: { label: "Portuguese", dot: "bg-emerald-400" },
  zh: { label: "Chinese", dot: "bg-rose-400" },
  ja: { label: "Japanese", dot: "bg-rose-400" },
};

const labelFor = (code: string) =>
  LANGUAGE_CATALOG[code]?.label ?? code.toUpperCase();
const dotFor = (code: string) =>
  LANGUAGE_CATALOG[code]?.dot ?? "bg-violet-400";

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "year", label: "This year" },
  { value: "lifetime", label: "Lifetime" },
  { value: "custom", label: "Custom range" },
];

const parseIsoDate = (s: string | null): Date | undefined => {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map((n) => Number.parseInt(n, 10));
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};

const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

type Props = {
  staged: SearchFilters;
  applied: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
  availableLanguages?: string[];
};

const SidebarBody = ({ staged, applied, onChange, onApply, onClear, availableLanguages }: Props) => {
  const hasUnapplied = !filtersEqual(staged, applied);
  const hasActive = !filtersAreEmpty(applied);
  const detected = detectDatePreset(staged);
  // Track explicit "custom" selection so the date pickers stay visible even
  // before the user picks any dates (when from/to are still null, detection
  // would otherwise resolve to "lifetime").
  const [customMode, setCustomMode] = useState(detected === "custom");
  useEffect(() => {
    if (detected === "custom") setCustomMode(true);
  }, [detected]);
  const activePreset = customMode ? "custom" : detected;

  // Languages shown in the sidebar are restricted to those present in the
  // current results. Selection is single — picking "All" clears the filter,
  // picking a language replaces the current selection.
  const visibleLanguages = (availableLanguages ?? []).filter(
    (c, i, arr) => arr.indexOf(c) === i,
  );
  const selectLanguage = (code: string | null) => {
    onChange({ ...staged, languages: code ? [code] : [] });
  };
  const isAllSelected = staged.languages.length === 0;

  const selectPreset = (preset: DatePreset) => {
    if (preset === "custom") {
      setCustomMode(true);
      return;
    }
    setCustomMode(false);
    const r = datePresetRange(preset);
    onChange({ ...staged, dateFrom: r.dateFrom, dateTo: r.dateTo });
  };

  const fromDate = parseIsoDate(staged.dateFrom);
  const toDate = parseIsoDate(staged.dateTo);

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
          <button
            key="__all"
            type="button"
            onClick={() => selectLanguage(null)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
              isAllSelected
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isAllSelected ? "bg-primary" : "bg-muted-foreground/40",
              )}
              aria-hidden
            />
            <span className="flex-1 truncate">All</span>
            {isAllSelected && <Check className="h-3 w-3 text-primary" />}
          </button>
          {visibleLanguages.map((code) => {
            const checked = staged.languages.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => selectLanguage(code)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
                  checked
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", dotFor(code))} aria-hidden />
                <span className="flex-1 truncate">{labelFor(code)}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  {code}
                </span>
                {checked && <Check className="h-3 w-3 text-primary" />}
              </button>
            );
          })}
          {visibleLanguages.length === 0 && (
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground/70">
              No language data in current results.
            </p>
          )}
        </div>
      </section>

      {/* Date */}
      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <CalendarIcon className="h-3 w-3 text-primary/80" />
          Upload date
        </div>
        <div className="flex flex-col gap-1">
          {PRESETS.map((p) => {
            const active = activePreset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => selectPreset(p.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                />
                <span className="flex-1">{p.label}</span>
              </button>
            );
          })}
        </div>

        {activePreset === "custom" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-between gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left text-xs transition hover:border-primary/40",
                    !fromDate && "text-muted-foreground",
                  )}
                >
                  <span className="truncate">
                    {fromDate ? format(fromDate, "MMM d, yyyy") : "From"}
                  </span>
                  <CalendarIcon className="h-3 w-3 text-primary/70" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(d) =>
                    onChange({ ...staged, dateFrom: d ? toIsoDate(d) : null })
                  }
                  disabled={(date) => date > new Date() || (!!toDate && date > toDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-between gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left text-xs transition hover:border-primary/40",
                    !toDate && "text-muted-foreground",
                  )}
                >
                  <span className="truncate">
                    {toDate ? format(toDate, "MMM d, yyyy") : "To"}
                  </span>
                  <CalendarIcon className="h-3 w-3 text-primary/70" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(d) =>
                    onChange({ ...staged, dateTo: d ? toIsoDate(d) : null })
                  }
                  disabled={(date) => date > new Date() || (!!fromDate && date < fromDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
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

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const filtersFromUrl = (params: URLSearchParams): SearchFilters => {
  const lang = params.get("lang");
  const from = params.get("from");
  const to = params.get("to");
  const languages = lang
    ? lang.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  return {
    languages,
    dateFrom: from && ISO_DATE_RE.test(from) ? from : null,
    dateTo: to && ISO_DATE_RE.test(to) ? to : null,
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
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  else params.delete("from");
  if (filters.dateTo) params.set("to", filters.dateTo);
  else params.delete("to");
  // Clean up legacy params
  params.delete("yearMin");
  params.delete("yearMax");
};

export { EMPTY_FILTERS };
