# Restore Sidebar Filters + Show True Video Duration

Two fixes for the results page.

## 1. Move filters back to a left sidebar

**`src/components/results/FilterBar.tsx`** — Refactor (or rename to `FilterSidebar.tsx`) into a vertical panel:
- Section header "Filters" with a Clear-all link when active.
- **Language** section: stacked checkbox rows (English, Urdu) instead of inline pills, using `@/components/ui/checkbox`.
- **Year range** section: the same dual-thumb slider rendered inline (no popover wrapper), with Min/Max year readouts beside it.
- **Apply** button pinned at the bottom of the panel, full-width, disabled until staged ≠ applied.
- Keep `filtersFromUrl` / `writeFiltersToParams` exports unchanged so `ResultsPage` wiring stays the same.

**`src/pages/ResultsPage.tsx`** — Switch to a 2-column layout below the search bar:

```text
┌─────────────────────────────────────────────────────┐
│   Top bar (Back · Logo)                             │
│   Compact search                                    │
├──────────────┬──────────────────────────────────────┤
│  Filters     │  Results summary                     │
│  ──────────  │  ──────────                          │
│  Language    │  [ Result card ]                     │
│  ☐ English   │  [ Result card ]                     │
│  ☐ Urdu      │  [ Result card ]                     │
│              │                                       │
│  Year range  │                                       │
│  [====●==●=] │                                       │
│  2005  2026  │                                       │
│              │                                       │
│  [ Apply  ]  │                                       │
└──────────────┴──────────────────────────────────────┘
```

- Container becomes `grid md:grid-cols-[260px_1fr] gap-6` below the search row.
- On mobile (`< md`), filters collapse into a single "Filters" toggle button that expands the panel above results (no shadcn Sidebar / SidebarProvider needed — this is a local layout panel, not app-level navigation).
- The top-bar layout, search form, dropdown, results list, and empty/error states all stay as-is.

## 2. Thumbnail badge: full video duration

The search API's `source_info` doesn't expose a duration field, so we fetch it from YouTube's public **oEmbed**… actually, oEmbed doesn't return duration either. The reliable no-key option is to **scrape the duration from `noembed.com`** — but to avoid third-party dependencies we'll instead use the YouTube **Data API v3 `videos?part=contentDetails`** endpoint, which returns ISO-8601 duration (e.g. `PT12M34S`).

**New file `src/lib/youtubeDuration.ts`**:
- `fetchVideoDurations(ids: string[]): Promise<Record<string, number>>` — batches up to 50 IDs per request, parses ISO-8601 to seconds, returns a map.
- In-memory `Map<string, number>` cache (durations never change), so each ID is fetched at most once per session.
- Reads `VITE_YOUTUBE_API_KEY` from env. If missing, returns `{}` and we silently fall back to no badge.

**`src/pages/ResultsPage.tsx`**:
- After `setHits`, collect unique `videoId`s, call `fetchVideoDurations`, store result in a `durations` state map.
- `ResultCard` gets a `duration?: number` prop. The top-right badge becomes `formatTimestamp(duration)` (e.g. `12:34`) when known, otherwise hidden. The decimal score badge is removed (the circular Match meter on the left already conveys score).

**Required user action**: add `VITE_YOUTUBE_API_KEY` to `.env`. I'll prompt you to create one (Google Cloud Console → YouTube Data API v3 → API key, restrict to your domain). Without the key, badges simply don't render — nothing else breaks.

## Files touched
- `src/components/results/FilterBar.tsx` — refactor to vertical sidebar layout
- `src/pages/ResultsPage.tsx` — 2-col grid, duration fetch + state, badge swap
- `src/lib/youtubeDuration.ts` — new

## Out of scope
- Persistent collapse state for the sidebar (always visible on desktop, toggleable on mobile)
- Caching durations across sessions (in-memory only)
