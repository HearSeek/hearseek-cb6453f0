## 1. Quick text fixes

`**src/pages/CreatorsPage.tsx` — Hero**

- Remove the secondary "Join the Waitlist" button from hero (keep only "Experience the Magic").
- Change H1: "Search every word in your **YouTube Content**." (replacing "back-catalogue").
- Closing CTA card: keep both buttons there (only the hero one is removed) — confirm if you'd rather strip it from the bottom CTA too.

**Rename "The Diary of the CEO" → "The Diary of a CEO" everywhere**

- `src/lib/pilots.ts`: `name`, `shortName`, `configName`, `tagline`, `disclaimer` strings (slug `diary-of-the-ceo` stays — changing the route would break links; flag if you want it renamed too).
- `src/pages/Index.tsx` line 193 label.
- Any other UI strings that reference the old name.

## 2. Vibrant CreatorsPage upgrade

Goal: make the page feel premium and alive, with the 6 features as the centerpiece.

### Hero polish

- Add a soft animated waveform / gradient orb backdrop behind the headline (reuse `bg-gradient-waveform` + a blurred radial glow, plus `animate-pulse-glow`).
- Larger H1, tighter tracking, gradient on "YouTube Content".
- Single primary CTA only.

### Use Cases (4 cards) — keep but lift

- Add subtle hover lift, gradient border on hover, and an animated icon (scale + color shift). No structural change.

### NEW: "Features" section — full-width scroll showcase

Replace the current 3-col `FeatureCard` grid with a **vertical scroll narrative**: each of the 6 features is its own full-width section, alternating image/illustration left-right, with fade + slide-in animation as it scrolls into view.

Layout per feature row:

```text
┌─────────────────────────────────────────────────────────┐
│  [icon badge]                                           │
│  FEATURE TITLE (display, 4xl)         [visual / mock]   │
│  long description paragraph                             │
│  • bullet point                                         │
│  • bullet point                                         │
└─────────────────────────────────────────────────────────┘
```

Behavior:

- Each row is a `min-h-[80vh]` section, content vertically centered.
- Sticky-ish reveal: use IntersectionObserver to toggle `opacity-0 translate-y-8` → `opacity-100 translate-y-0` (Tailwind transition, 700ms). Adjacent rows fade out as you scroll past (opacity tied to viewport position).
- Alternating sides on desktop (`md:grid-cols-2` with `md:[&:nth-child(even)>div:first-child]:order-2`), single column on mobile.
- Each row gets its own accent gradient (vary hue per feature) using existing `--gradient-*` tokens or new ones added to `index.css`.
- Right side: animated visual placeholder per feature (e.g. mini search-bar mock for Semantic Search, language chips for Cross-Language, waveform for Paraphrase, share card for Embed, timeline strip for Premiere plugin, $ chart for Monetize). All built with divs + Tailwind — no new images required.

The 6 features stay the same titles/descriptions you already have.

### Section dividers

- Add thin gradient `<Waveform />` (already in `src/components/site`) between major sections for cohesion.

### Closing CTA

- Keep, but upgrade visual: add animated gradient border, larger headline.

## 3. Technical notes

- New tiny hook `src/hooks/use-in-view.ts` wrapping IntersectionObserver (returns `{ ref, inView }`). Used by each feature row.
- New component `src/components/site/FeatureShowcaseRow.tsx` — props: `{ icon, title, description, bullets[], accent, visual: ReactNode, reverse }`. Handles the scroll animation + responsive flip.
- 6 small visual components (or one switch component) for the right-side mocks. Pure Tailwind, no new deps.
- Add 1–2 new gradient tokens to `index.css` if needed for variety (HSL only).
- No new packages, no business-logic changes.

## 4. Files

Edit:

- `src/pages/CreatorsPage.tsx` (rebuild features section, hero tweaks)
- `src/lib/pilots.ts` (rename Diary of a CEO)
- `src/pages/Index.tsx` (rename label line)
- `src/index.css` (optional: extra gradient tokens)

Create:

- `src/hooks/use-in-view.ts`
- `src/components/site/FeatureShowcaseRow.tsx`

## Open questions

- Bottom CTA "Join the Waitlist" button — remove too, or keep there? remove
- Pilot route slug `diary-of-the-ceo` — rename to `diary-of-a-ceo`? update it