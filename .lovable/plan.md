## Filters on the Results page

Add a filter strip directly under the search bar on `/results`. Two filters to start: **Language** (multi-select chips) and **Upload Year** (range slider). Filters are staged locally and only sent when the user clicks **Apply** — matching the existing "search bar = explicit submit" pattern.

### Visual layout

A single horizontal pill bar, sitting in the same column as the compact search, with the same glassy `border-white/10 bg-card/40 backdrop-blur` treatment used on result cards. Each filter is a pill that opens a popover. An "Apply" button appears on the right when there are unsaved changes; "Clear" appears when any filter is active.

```text
┌─────────────────────────────────────────────────────────────┐
│  🔎  [search input ........................]  [Podcasts ▾] │
└─────────────────────────────────────────────────────────────┘
   ┌──────────────┐ ┌────────────────────┐         ┌───────┐
   │ 🌐 Language ▾│ │ 📅 2015 — 2024   ▾ │  Clear  │ Apply │
   └──────────────┘ └────────────────────┘         └───────┘
```

Inactive pills show just the icon + label in muted tone. Active pills get the brand gradient border (matching the focused search halo's violet/cyan), bold label, and a small count badge for Language ("EN +1"). Popovers open below with the same `rounded-xl border border-white/10 bg-popover/95 backdrop-blur-xl` styling as the existing collection dropdown.

### Filter UX

- **Language pill** — popover lists `English (en)` and `Urdu (ur)` for now (matches your two seeded languages), each with the existing colored dot indicator from `languageDot()`. Multi-select via checkboxes; empty selection = no language filter. A `// TODO: replace with /api/languages` comment marks where the dynamic list will plug in later.
- **Upload Year pill** — popover contains a dual-thumb range slider (shadcn `Slider`) covering **2005 → 2026** (current year, computed at runtime so it auto-advances). Default thumbs sit at the extremes (no filter). Live numeric labels update above the thumbs. Snap to integer years.
- **Apply button** — only enabled when the staged filters differ from the applied ones. Triggers a new search and writes the filters into the URL.
- **Clear button** — shows only when any filter is applied; resets staged + applied state and re-runs the search.
- Active filters survive page reload via URL params (`lang=en,ur`, `yearMin=2018`, `yearMax=2024`).
- The existing search submit also sends the currently-applied filters — no behavior change there.

### API integration

The search POST body gains a `filters` field shaped as a Qdrant filter. Since `source_info.creation_date` is stored as an ISO datetime string (`"2019-06-21T00:00:00Z"`), the year range becomes a `gte`/`lt` string range on the boundary days:

```json
{
  "texts": "...",
  "filters": {
    "must": [
      { "key": "source_info.language",      "match": { "any": ["en", "ur"] } },
      { "key": "source_info.creation_date", "range": { "gte": "2018-01-01T00:00:00Z",
                                                       "lt":  "2025-01-01T00:00:00Z" } }
    ]
  }
}
```

Clauses are only included when the filter is active (language array non-empty; year range narrower than the full 2005→current span). If neither filter is active, `filters` is omitted from the body entirely so today's behavior is unchanged.

> **One open assumption** I'll verify against the API once implemented: the request field is named `filters` and the keys use dotted paths like `source_info.language`. If the server expects `filter` (singular) or different key names, it's a one-line fix in `runSearch`. I'll log the request body to console on the first call so we can spot-check.

### Technical changes

**`src/lib/hearseek.ts`**
- Export a `SearchFilters` type: `{ languages: string[]; yearMin: number | null; yearMax: number | null }`.
- Add `buildQdrantFilter(filters)` → returns a `{ must: [...] }` object or `null`. Keeps Qdrant shape isolated from UI code.
- Update `runSearch(query, configSlug, signal, filters?)` to accept optional filters and include `filters: buildQdrantFilter(...)` in the POST body when non-null.

**`src/pages/ResultsPage.tsx`**
- New URL params: `lang` (comma-separated), `yearMin`, `yearMax`. Parsed into `appliedFilters` alongside existing `query` / `configSlug`.
- New state: `stagedFilters` (what the popovers mutate), `appliedFilters` (what was last submitted / drives the search effect). Apply button copies staged → applied + writes URL params; the existing search effect's dep array gains `appliedFilters` (serialized) so it refetches.
- The search effect passes `appliedFilters` into `runSearch`.
- Derive `hasUnappliedChanges` and `hasActiveFilters` from comparing staged vs applied vs defaults to drive Apply/Clear button visibility.

**New component `src/components/results/FilterBar.tsx`**
- Renders the pill row. Props: `staged`, `applied`, `onChange(staged)`, `onApply()`, `onClear()`, plus `availableLanguages` (defaults to `["en", "ur"]`).
- Two internal subcomponents: `LanguagePopover` (checkbox list) and `YearRangePopover` (shadcn `Slider` with `min={2005}` `max={new Date().getFullYear()}` `step={1}`).
- Click-outside handling reuses the same pattern as the existing collection dropdown (`useRef` + `mousedown` listener).
- All styling uses existing tokens — no new colors or CSS variables.

**`src/pages/DemoPage.tsx`**
- Initial filters live only on the results page. The home demo search stays clean and uncluttered (we can revisit later if you want filters available pre-search).

### Out of scope (intentional)

- Channel filter — deferred until you have a channels endpoint.
- Facet counts — deferred until backend supports aggregations.
- Filtering on the home `/demo` page.
- Persisting filters across collections (filters reset when the user switches collection, since language/date availability differs per corpus).
