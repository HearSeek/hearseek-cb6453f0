# Sticky Feature Showcase — Creators Page

Replace the current stacked `FeatureShowcaseRow` section on `/creators` with a "Built to be Found"–style layout: a left column that stays pinned while the user scrolls through the 6 features on the right.

## Layout

```text
┌──────────────────────────────────────────────────────────┐
│  FEATURES (eyebrow)                │   ┌──────────────┐  │
│                                    │   │  01 Search   │  │
│  Built for how creators            │   │   visual     │  │
│  actually search.                  │   └──────────────┘  │
│                                    │   ┌──────────────┐  │
│  One short supporting paragraph.   │   │  02 Cross-   │  │
│                                    │   │  language    │  │
│  • Semantic search                 │   └──────────────┘  │
│  • Cross-language               →  │   ┌──────────────┐  │
│  • Paraphrase matching             │   │  03 Para-    │  │
│  • Embed & share                   │   │  phrase      │  │
│  • Premiere plugin                 │   └──────────────┘  │
│  • Monetize archive                │   …4, 5, 6           │
│                                    │                      │
│  [ Experience the magic → ]        │                      │
└──────────────────────────────────────────────────────────┘
   ^ position: sticky                  ^ normal flow
```

- Two-column grid on `md+`. Left column uses `position: sticky; top: ~6rem` and fills the viewport height so it stays pinned for the entire scroll of the right column.
- Right column is a normal vertical stack of 6 feature cards, each ~min-h-[70vh] so the user gets a clear "next feature" beat while scrolling.
- Active-feature tracking: the bullet list on the left highlights the feature currently in view (IntersectionObserver). The active item gets the gradient accent (`bg-gradient-waveform` / `text-gradient`); inactive items stay muted.
- On mobile (`<md`), drop the sticky behavior — render as a single column: intro block, then the 6 feature cards stacked normally. No layout regression on small screens.

## Visual / branding

- Reuse existing tokens only: `bg-gradient-card`, `bg-gradient-waveform`, `border-border/60`, `shadow-elegant`, `text-gradient`, `font-display`. No new colors.
- Each right-side card keeps the same icon + eyebrow + title + description + bullets + visual content currently in `FeatureShowcaseRow`, but rendered in a more compact "panel" form (rounded-3xl card, gradient halo, icon badge top-left).
- Subtle fade/slide-in on each card as it enters the viewport (reuse `useInView` + existing `animate-fade-in`).
- Left column gets a soft gradient backdrop (`bg-gradient-hero` at low opacity) so the pinned area reads as its own surface.

## Files

- `src/pages/CreatorsPage.tsx` — remove the current `FeatureShowcaseRow` stack; render the new section instead. Keep hero, use-cases, demo, and CTA sections untouched.
- `src/components/site/StickyFeatureShowcase.tsx` (new) — the two-column sticky layout. Accepts `features: { icon, eyebrow, title, description, bullets, visual }[]` and an intro block (`eyebrow`, `title`, `description`, `ctaHref`, `ctaLabel`). Encapsulates the IntersectionObserver active-index logic and the mobile fallback.
- `FeatureShowcaseRow.tsx` stays in the repo (used nowhere else after this change, but harmless to keep; can be deleted later if you'd like — say the word and I'll remove it).

## Out of scope

- No changes to results page, share row, video titles, or other pages.
- No new dependencies.
