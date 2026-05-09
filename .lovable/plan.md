## 1. Header & Homepage (`src/components/site/Header.tsx`, `src/pages/Index.tsx`)

**Header**
- Remove the desktop "Book a Demo" button and the mobile sheet equivalent.
- Add `Content Creators` (`/creators`) to the `nav` array so it appears in both desktop and mobile menus.

**Homepage Hero**
- Delete the mock search-bar block (lines 33–44).
- Replace the primary CTA: text → **"Experience the Magic"**, link → `/demo`. Keep the `bg-gradient-waveform` styling and trailing arrow icon. Keep the secondary "Join App Waitlist" button.

**Homepage Enterprise section CTA**
- The button currently links to `/enterprise#demo` — that already anchors to the form (form lives in a `Section id="demo"`). Verify on click and add `scroll-margin-top` if needed so the sticky header doesn't overlap.

**Live Pilot section** (rewrite the single-pilot block into a 2-up grid)
- Section heading becomes generic: eyebrow "Live Pilots", title "Real archives, already searchable."
- Two equal cards in a `grid md:grid-cols-2 gap-6` layout (50/50 desktop, stacked mobile):
  - **International Iqbal Society (IIS)** — existing copy/stats/quote, condensed, with CTA "Open IIS Search" → `/pilots/iis`.
  - **The Diary of the CEO by Steven Bartlett** — new card with placeholder stats (e.g. "Episodes indexed", "Global listeners", "Languages"), short blurb, CTA "Open Diary Search" → `/pilots/diary-of-the-ceo`.
- Final CTA section at the bottom of the page keeps "Book a Demo" → `/enterprise#demo` (still valid; the request only removed the header button).

## 2. Demo Page (`src/pages/DemoPage.tsx`)

**Disclaimer below the search bar**
- Replace the existing tiny tagline with the requested copy: *"This demo searches a limited, hand-picked collection of podcasts and news clips to showcase HearSeek's capabilities. It does not yet search the entire web."*
- Style: `text-sm font-normal text-white/70 text-center` (= 14px Inter Regular, 70% white, centered). Inter is already the body font.

**Search suggestions**
- Add a `SUGGESTIONS_BY_SLUG` map keyed by slug containing the two lists provided. Heuristic: match by `slug.includes("podcast")` and `slug.includes("news")` so it works regardless of exact slug naming returned by the API.
- Render up to 5 suggestion chips below the disclaimer when the input is empty; clicking a chip fills the input and submits the search. Keep them visually light (rounded pills, `border-white/10 bg-white/5`, hover lifts to primary).
- Suggestions are recomputed when `scope` changes.

## 3. New page: Content Creators (`src/pages/CreatorsPage.tsx`)

Mirror the structure of `AppPage` / `EnterprisePage`:
- Hero (badge "Creators · Find every moment", H1 "Search every word in your back-catalogue", short subtitle, primary CTA → `/demo`, secondary → waitlist anchor).
- Use Cases grid (4 `FeatureCard`s: YouTube archive, Podcast back-catalogue, Long-form interviews, Shorts/clip mining).
- Demo `VideoEmbed` placeholder.
- Features grid (semantic search, cross-language, paraphrase, clip-export, Premiere/YouTube plugins, monetisation).
- Closing CTA card.
- Wire it in `src/App.tsx` under `/creators` inside the `<Layout>` route group.
- Add to `Header.tsx` nav (see §1) and to `Footer.tsx` link list.

## 4. Pilot Microsite framework

Two new pages today, designed so future pilots are a 5-minute add.

**`src/lib/pilots.ts` — pilot registry**
```ts
export type Pilot = {
  slug: string;            // route segment, e.g. "iis"
  name: string;            // "International Iqbal Society"
  shortName: string;       // "IIS"
  tagline: string;
  configSlug: string;      // hard-coded HearSeek search-config slug
  configName: string;      // human label passed to /results
  disclaimer: string;      // tailored per pilot
  suggestions: string[];   // chips under search bar
  featuredVideoIds: string[]; // YouTube IDs for "Featured videos" grid
  accent?: string;         // optional brand accent (defaults to primary)
};
export const PILOTS: Record<string, Pilot> = { iis: {...}, "diary-of-the-ceo": {...} };
```
I'll seed each entry with placeholder values for `configSlug`, `featuredVideoIds`, and disclaimer copy — easy to swap once you give me the real slugs/IDs.

**`src/pages/PilotPage.tsx`** — single dynamic route `/pilots/:slug`
- Looks up the pilot in `PILOTS`; 404 if missing.
- Layout: logo + pilot name → search bar (reuse the styling from `DemoPage` so no drift) → tailored disclaimer → "Featured" grid (3-col on desktop, 1-col mobile) of YouTube thumbnails linking to the videos.
- Submitting the search routes to `/pilots/:slug/results?q=…` (mirrors current results page but scoped to the pilot's `configSlug`).

**`src/pages/PilotResultsPage.tsx`** — pilot-scoped results page
- Reuses 95% of `ResultsPage`. Refactor the heavy result rendering (cards, empty state, filter sidebar wiring) into a shared `ResultsView` component used by both `ResultsPage` and `PilotResultsPage`. The pilot variant:
  - Force-locks `configSlug` to the pilot's slug (no collection dropdown).
  - "Back" button returns to `/pilots/:slug` instead of `/demo`.
  - Header swaps the HearSeek logo + pilot name.
- Same filter behaviour, same network calls (`runSearch` already takes any slug).

**Routes in `src/App.tsx`**
- `/creators` → `CreatorsPage` (inside `Layout`).
- `/pilots/:slug` → `PilotPage` (no Layout, full-bleed like `/demo`).
- `/pilots/:slug/results` → `PilotResultsPage` (no Layout).

## 5. Files touched / created

Edit:
- `src/components/site/Header.tsx`
- `src/components/site/Footer.tsx`
- `src/pages/Index.tsx`
- `src/pages/DemoPage.tsx`
- `src/pages/ResultsPage.tsx` (extract shared view)
- `src/App.tsx`

Create:
- `src/pages/CreatorsPage.tsx`
- `src/pages/PilotPage.tsx`
- `src/pages/PilotResultsPage.tsx`
- `src/lib/pilots.ts`
- `src/components/results/ResultsView.tsx` (shared)

## Open items I'll seed with placeholders (easy to update later)

- IIS pilot: `configSlug` placeholder = `"iis"`. Diary pilot: `"diary-of-the-ceo"`. Tell me the real slugs and I'll swap.
- 4–6 placeholder YouTube IDs per pilot for "Featured videos".
- Diary pilot stat numbers on the homepage card (used reasonable public-domain figures; flag any to change).
