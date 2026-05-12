# Decouple pilot pages from backend config slugs

Pilot URLs (e.g. `/pilots/diary-of-a-ceo`) will keep their path identifier as a microsite-only key — it stops being called a "slug" in code/UI and stops being passed as the search-config to the backend. Each pilot instead declares which shared backend config to query and a baseline Qdrant filter that gets ANDed onto every search.

Scope: only the `diary-of-a-ceo` pilot. IIS is left untouched.

## Changes

### 1. `src/lib/pilots.ts`
- Rename the `slug` field to `key` on the `Pilot` type (microsite identifier only). Update `getPilot` and `ALL_PILOTS` accordingly.
- Add two new fields:
  - `searchConfig: { slug: string; name: string }` — the backend config to actually hit (e.g. `{ slug: "podcasts", name: "Podcasts" }` for Diary of A CEO).
  - `baseFilter?: Record<string, unknown>[]` — additional `must` clauses always merged into the Qdrant filter. For Diary of A CEO: `[{ key: "source_info.channel", match: { value: "diary_of_a_ceo" } }]`.
- For Diary of A CEO entry: set `searchConfig` to `podcasts` and add the channel `baseFilter`. Drop the old `configSlug`/`configName` from the entry (or keep them deprecated — see Technical notes).
- Leave the IIS entry on its existing fields for now.

### 2. `src/lib/hearseek.ts`
- Extend `buildQdrantFilter` to accept an optional `extraMust: Record<string, unknown>[]` argument and prepend/append those clauses to the `must` array. Returns a filter object whenever either user filters OR extra clauses are present.
- Extend `runSearch` with an optional `extraMust` parameter and pass it through to `buildQdrantFilter`.

### 3. `src/pages/PilotResultsPage.tsx` & `src/pages/ResultsPage.tsx`
- `ResultsPage` already accepts a `pilot` prop. Update it to:
  - Read `configSlug` / `configName` from `pilot.searchConfig` when in pilot mode.
  - Pass `pilot.baseFilter` through to `runSearch` as `extraMust`.
  - Use `pilot.key` everywhere it currently uses `pilot.slug` (back link, etc.).

### 4. `src/pages/PilotPage.tsx`
- Replace `pilot.slug` references with `pilot.key` for the navigation URL (`/pilots/${pilot.key}/results`).

### 5. `src/App.tsx`
- Routes stay as `/pilots/:slug` in the URL (React Router param name is just a variable). No route changes required — `useParams<{ slug: string }>()` simply feeds `getPilot(slug)` which now matches against `key`. Optionally rename the param to `:key` for consistency.

### 6. UI surfaces
- No user-visible changes. The microsite identifier is never displayed; only the pilot's `name` / `shortName` / `logo` show up.

## Technical notes

- Filter merge order in `buildQdrantFilter`: base (pilot) clauses first, then user-selected language/date clauses. Single flat `must` array — Qdrant ANDs them.
- `runSearch` signature becomes `runSearch(query, configSlug, signal?, filters?, extraMust?)`. Existing non-pilot callers pass nothing new.
- `Pilot.key` rename is mechanical — only `getPilot`, `PilotPage`, `PilotResultsPage`, and `ResultsPage` reference it. We'll grep to confirm no other consumers.
- The old per-pilot `configSlug` / `configName` fields on Diary of A CEO are removed since the new `searchConfig` field replaces them. IIS keeps its current shape so its behavior is unchanged.
- Hardcoding is intentional — once the backend evolves we can revisit declaring these dynamically.

## Open follow-ups (not in this change)

- Migrating IIS to the same pattern when the backend is ready.
- Surfacing pilot selection or category metadata in the UI.
