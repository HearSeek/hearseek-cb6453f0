# Pilots → Collections: Rename, Expand, Redesign Homepage

## 1. Nomenclature & Routing Purge

Rename across the codebase, keeping behavior identical:

- `src/lib/pilots.ts` → `src/lib/registry.ts`. Exported types `Pilot` → `Collection`, `PILOTS` → `COLLECTIONS`, `getPilot` → `getCollection`, `ALL_PILOTS` → `ALL_COLLECTIONS`. Add `tier: "flagship" | "featured-deep-index"` and `episodeCount` (e.g. `"30+"`, `"Full archive"`).
- `src/pages/PilotPage.tsx` → `src/pages/CollectionPage.tsx`. Replace "Pilot Microsite" eyebrow with the tier label ("Flagship Philosophical Archive" for IIS, "Featured Deep-Index" for everyone else). Internal `navigate(\`/pilots/...\`)` → `/collections/...`.
- `src/pages/PilotResultsPage.tsx` → `src/pages/CollectionResultsPage.tsx`. Imports updated.
- `src/App.tsx`: routes `/pilots/:slug` → `/collections/:slug`, `/pilots/:slug/results` → `/collections/:slug/results`.
- `src/pages/Index.tsx`: all `/pilots/...` links → `/collections/...`. Section eyebrow "Live Pilots" → "Live Collections".
- Sweep the rest of the codebase for `pilot`/`Pilot`/`/pilots/` and update copy (e.g. registry disclaimers: "This microsite searches…" → "This collection searches…").

## 2. Tiering — One Flagship, Ten Featured Deep-Index

Only **IIS** is the Flagship Philosophical Archive (full archive indexed). All ten others — including **The Diary of A CEO** — are **Featured Deep-Index** with **30 videos indexed**.

Update existing `diary-of-a-ceo` entry: `tier: "featured-deep-index"`, `episodeCount: "30+"`. Update the homepage IIS/DOAC card and any stats that currently claim "400+ Episodes indexed" for DOAC — change to "30+ Episodes indexed".

Add 9 new entries in `registry.ts` with `tier: "featured-deep-index"`, `episodeCount: "30+"`, `configSlug: "podcasts"` (placeholder — flag with TODO), and a `baseFilter` keyed on each channel's `source_info.channel`:

| Slug | Name | Channel filter value |
|---|---|---|
| `huberman-lab` | Huberman Lab | `huberman_lab` |
| `lex-fridman` | Lex Fridman | `lex_fridman` |
| `chris-williamson` | Chris Williamson | `chris_williamson` |
| `tom-bilyeu` | Tom Bilyeu | `tom_bilyeu` |
| `ted` | TED | `ted` |
| `dhruv-rathee` | Dhruv Rathee | `dhruv_rathee` |
| `think-school` | Think School | `think_school` |
| `beer-biceps` | Beer Biceps | `beer_biceps` |
| `raftar` | Raftar | `raftar` |

User will provide logo/headshot files. Drop into `src/assets/collections/{slug}.png` and reference via `logo:` field. Scaffold entries with the expected paths.

## 3. The 20% Padding Frame Component

New `src/components/site/CollectionLogo.tsx`:

```tsx
<div className="relative aspect-square rounded-2xl bg-[#1C1C1C] overflow-hidden">
  <div className="absolute inset-[10%] flex items-center justify-center">
    <img src={logo} className="max-h-full max-w-full object-contain" />
  </div>
</div>
```

`inset-[10%]` on each side = 20% total horizontal/vertical padding. Same frame for headshots and corporate marks for consistent rhythm.

## 4. Homepage Redesign — Tiered Hierarchy

Replace the current "Live Pilots" two-card section in `src/pages/Index.tsx` with two new sections:

### 4a. Searchable Web Marquee (below Hero, above Problem)

New `src/components/site/CollectionMarquee.tsx`:

- Horizontal CSS marquee (duplicated list, `animate-[marquee_40s_linear_infinite]` keyframe added to `tailwind.config.ts` + `index.css`). Pauses on hover.
- Each item: `CollectionLogo` ~96px, wrapped in `Link` to `/collections/:slug`.
- Default: `grayscale opacity-40 transition-all duration-300`.
- Hover: `grayscale-0 opacity-100` with `shadow-[0_0_24px_2px_hsl(var(--sonar))]` glow.
- Eyebrow above: "The Searchable Web" + one-line subtitle.

### 4b. Featured Collections Grid

Replaces existing IIS/DOAC dual card. Renders **4 primary cards** in a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`). Tentative pick: **IIS, The Diary of A CEO, Huberman Lab, TED** (confirm once logos are dropped). Each card:

- Glass-morphism: `bg-[#1C1C1C]/80 backdrop-blur-[10px] border border-[#262626] rounded-2xl p-5`.
- `CollectionLogo` at top.
- Channel name: Inter Bold white, `text-base mt-4`.
- Neon-bordered pill badge: `border border-[hsl(var(--sonar))]/60 text-[hsl(var(--sonar))] text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5`. Reads **"FULL ARCHIVE"** for IIS, **"30+ EPISODES INDEXED"** for the others (driven by `episodeCount`).
- Whole card is a `Link` to `/collections/:slug`. Hover: subtle scale + sonar glow.

## 5. Typography & Theme

- Confirm `Inter` is wired as `font-sans` and applied as the body default. Keep current `font-display` for headings unless you want a hard switch (flag in a TODO).
- Add `--sonar: 183 100% 66%;` (HSL of #54F9FF) to `src/index.css` `:root`; expose as `colors.sonar` in `tailwind.config.ts`. All neon usage references `hsl(var(--sonar))`.
- `#1C1C1C` background already aligns with current dark theme.

## 6. Files Touched

- Renamed: `src/lib/pilots.ts` → `src/lib/registry.ts`; `src/pages/PilotPage.tsx` → `src/pages/CollectionPage.tsx`; `src/pages/PilotResultsPage.tsx` → `src/pages/CollectionResultsPage.tsx`.
- New: `src/components/site/CollectionLogo.tsx`, `CollectionMarquee.tsx`, `CollectionCard.tsx`, `src/assets/collections/`.
- Edited: `src/App.tsx`, `src/pages/Index.tsx`, `src/index.css`, `tailwind.config.ts`, plus any importers of the renamed modules.

## 7. Out of Scope

- Backend Qdrant slug values are guessed; flagged with `// TODO confirm channel slug`.
- No standalone `/collections` index page yet (homepage marquee + grid only).
- No changes to results page, share row, Creators page, or any other previously-touched area.

## 8. Asset Handoff

Drop logos into `src/assets/collections/{slug}.png`. `CollectionLogo` handles centering and the 20% frame automatically — no per-image editing needed. Transparent PNGs render best on the `#1C1C1C` frame.
