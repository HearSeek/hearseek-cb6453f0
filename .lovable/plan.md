
## Homepage updates

### 1. Hero section
- **Remove** the pill badge "Live pilot · 700+ videos indexed for 7.5M users".
- **Add** the HearSeek logo (`src/assets/hearseek-logo.png`) at the top of the hero, centered, sized around `h-20 md:h-24` with a subtle drop-shadow / glow.
- **Reduce tagline (`<h1>`) font size by ~20%**: change from `text-5xl md:text-7xl lg:text-8xl` → `text-4xl md:text-5xl lg:text-6xl` (≈20% smaller at each breakpoint).
- Keep the subtitle, mock search bar, and CTA buttons unchanged.

### 2. Replace the combined "Two Products. One Engine." teaser block with two dedicated sections

Remove the existing side-by-side teaser (Consumer App + Enterprise cards) and replace with two full-width sections, each with its own video embed slot:

#### Section A — Consumer App
- Eyebrow: "Consumer App · app.hearseek.com"
- Title: "Search every word you've ever heard."
- Two-column layout (stacks on mobile):
  - Left: copy + bullet highlights (voice notes, lectures, podcasts, WhatsApp clips), $15/month note, CTA buttons "Explore the App" → `/app` and "Join Waitlist" → `/app#waitlist`.
  - Right: `<VideoEmbed />` placeholder (16:9) — ready to swap in a YouTube/Vimeo URL via the `src` prop, with label "App demo coming soon".

#### Section B — Enterprise · Speech Intel
- Eyebrow: "Enterprise · media.hearseek.com"
- Title: "Unlock your private audio archives."
- Two-column layout, **reversed** (video left, copy right on desktop) for visual rhythm:
  - Left: `<VideoEmbed />` placeholder (16:9), label "Enterprise demo coming soon".
  - Right: copy + bullets (on-prem deployment, semantic archive search, institutional licensing, data sovereignty), CTAs "See Enterprise" → `/enterprise` and "Book a Demo" → `/enterprise#demo`.

Both sections use the existing `Section` wrapper and reuse the `VideoEmbed` component already in the codebase. No other homepage sections (Problem, Capabilities, Pilot, Vision, Final CTA) change.

### Files to edit
- `src/pages/Index.tsx` — hero changes + replace the teaser block with the two new sections (import `VideoEmbed` and the logo asset; drop unused `Sparkles`, `Smartphone`, `Building2` imports if no longer used).
