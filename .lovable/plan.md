## Demo Landing Page — Insight Discovery Dashboard

Add a new standalone page at route `/demo` showcasing HearSeek's search experience over news and podcast videos. It reuses existing brand tokens (colors, fonts, logo mark) but is rendered without the site `Header`/`Footer` so the demo feels like a dedicated app surface.

### Route & layout

- Add route `/demo` in `src/App.tsx` **outside** the `<Layout />` wrapper so the global Header/Footer are hidden (this is a self-contained dashboard).
- Create `src/pages/DemoPage.tsx` — single-file page, client-only, no data fetching.

### Page structure (top → bottom)

1. **Ambient background**
   - Full-viewport dark canvas using `bg-background`.
   - Layered mesh gradient: two radial gradients (navy top-left, deep purple bottom-right) + a soft central radial glow blending brand purple (`hsl(258 90% 66%)`) and accent blue (`hsl(190 95% 55%)`) at ~15% opacity. Implemented with absolutely-positioned divs + `blur-3xl`.

2. **Top bar**
   - Left: empty spacer (keeps logo centered).
   - Center: `hearseek-logo-mark.png` at `h-12 md:h-14` with a soft purple drop-shadow glow.
   - Right: segmented pill control `[ All ] [ News Channels ] [ Podcasts ]`.
     - Glass effect: `bg-white/5 backdrop-blur-xl` inside a wrapper with `bg-gradient-waveform` padding (1px) to create a gradient border.
     - Active segment: `bg-gradient-waveform text-primary-foreground`; inactive: `text-muted-foreground`.
     - Controlled by local `useState<"all" | "news" | "podcasts">`.

3. **Hero search**
   - Centered below the logo with generous vertical spacing.
   - Wide (`max-w-3xl`) command-palette input:
     - Rounded-2xl card, `bg-card/60 backdrop-blur-xl`, border `border-white/10`.
     - Left: `Search` icon (lucide). Input placeholder: `Ask anything...`.
     - Right: `⌘ K` key-cap (`kbd`-style small pill, `bg-white/5 border-white/10`).
   - Focus state: wrapper gets a gradient-glow ring. Implemented via a sibling absolutely-positioned `div` with `bg-gradient-waveform`, `blur-md`, `opacity-0` → `opacity-70` when the input is focused (tracked with `onFocus`/`onBlur` state). A thin inner `ring-1 ring-primary/40` also appears on focus.

4. **Content grid**
   - Two labelled rows, each with a small eyebrow label (`Trending News Clips`, `Featured Podcast Insights`) in uppercase tracked muted text.
   - Row = responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`.
   - Filter behavior: the segmented control hides the non-matching row (`All` shows both).
   - Card data: 8 mock items total (4 news + 4 podcasts) defined as a local array with `{ id, title, insight, timestamp, duration, source, sourceLabel, thumbHue }`.

5. **HearSeek Video Card** (new component, inline in `DemoPage.tsx`)
   - Outer: `rounded-xl overflow-hidden border border-white/10 bg-card/40 backdrop-blur-md hover:border-primary/40 transition`.
   - Thumbnail area (16:9 via `AspectRatio`): since we don't have real thumbnails, use a procedurally generated gradient surface per card (`linear-gradient` derived from `thumbHue`) with a soft waveform SVG overlay and a center play icon (`PlayCircle`) at low opacity.
   - Top-right source chip: circular `h-8 w-8 rounded-full bg-background/70 backdrop-blur border border-white/10` containing a lucide icon — `Newspaper` for news, `Mic` for podcasts.
   - Bottom glass bar: absolutely positioned, `bg-background/60 backdrop-blur-xl border-t border-white/10 p-3`.
     - Line 1: title (`font-display text-sm font-semibold line-clamp-1`).
     - Line 2: key insight (`text-xs text-muted-foreground line-clamp-1`) prefixed with a small `Sparkles` icon.
     - Bottom-right: duration pill (`text-[10px] bg-white/10 rounded px-1.5 py-0.5`).

6. **Footer line**
   - Single centered line: `HearSeek can make mistakes. Check important info.` in `text-xs text-muted-foreground/70`, with comfortable bottom padding.

### Mock content (illustrative)

- News: "Fed Signals Rate Pause" · "EU AI Act Enforcement Begins" · "SpaceX Starship Test Flight" · "Climate Summit Closing Remarks".
  - Example insight: `Mentions inflation target at 01:12`.
- Podcasts: "Lex Fridman × Demis Hassabis" · "Acquired: Nvidia Pt. 3" · "Huberman Lab: Sleep Science" · "All-In: Markets Recap".
  - Example insight: `Discusses Apple M3 chip at 02:30`.

### Technical details

- Files:
  - **new** `src/pages/DemoPage.tsx`
  - **edit** `src/App.tsx` — add `<Route path="/demo" element={<DemoPage />} />` **outside** the `<Route element={<Layout />}>` group, above the catch-all.
- Imports: `lucide-react` (`Search`, `Sparkles`, `Newspaper`, `Mic`, `PlayCircle`), `@/components/ui/aspect-ratio`, `@/assets/hearseek-logo-mark.png`, `cn` from `@/lib/utils`.
- No new dependencies.
- All colors via existing CSS vars / tokens (`--primary`, `--accent`, `bg-gradient-waveform`, `bg-gradient-hero`). No hardcoded hex.
- Fonts inherit from `body` (Inter) with `font-display` (Space Grotesk) for headings — matches the rest of the site.
- Fully responsive down to ~360px; segmented control collapses to smaller text at `sm:` breakpoint.
- Pure presentational — search input is non-functional (no submit handler); segmented control only filters the visible rows client-side.

### Out of scope

- No real video playback, no backend, no routing from other pages to `/demo` (user can visit it directly). If desired later, a nav link can be added.
