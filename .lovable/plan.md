
# HearSeek Marketing Site — 3 Pages

## Structure
- **Homepage** (`/`) — overview of product, problem, two revenue streams (teasers), pilot, CTAs
- **Consumer App page** (`/app`) — mobile app for individuals ($15/mo)
- **Enterprise page** (`/enterprise`) — B2B Speech Intel for media houses & institutions

Shared **Header** (logo, nav: Home / App / Enterprise, "Book Demo" CTA) and **Footer** (links, contact, copyright).

## Visual direction
- **Bold dark + audio-tech** aesthetic: deep near-black background, electric cyan/violet accent, subtle animated waveform motifs, glowing search-bar hero element.
- Typography: large modern sans (Inter/Space Grotesk), generous spacing, premium SaaS feel.
- Reusable components: Section wrapper, StatCard, FeatureCard, CTAButton, WaveformVisual, VideoEmbedFrame (placeholder with play icon).

## Homepage sections
1. **Hero** — HearSeek logo + tagline "The World's First AI Search Engine for Audio." Sub-line about transforming silent spoken data. Mock interactive search bar with animated waveform. Primary CTA "Book a Demo" + secondary "Join App Waitlist."
2. **Problem statement** — Big stat "82.5% of internet traffic is audio/video — yet unsearchable." Short narrative on the blind spot. Visual: muted waveform vs. searchable transcript.
3. **What HearSeek does** — 3 capability cards: Multi-language (160+), Meaning-based discovery, Operational duality.
4. **Two revenue streams (teasers)** — Two large side-by-side cards:
   - *Consumer App* → links to `/app`
   - *Enterprise Speech Intel* → links to `/enterprise`
5. **Pilot project** — International Iqbal Society: 700+ videos indexed, 7.5M global community. Logo/quote area + stats.
6. **Vision & traction strip** — 1.5B → 3B users target, 3.3M users / $2.5M MRR Year 3, pre-seed cleared.
7. **Final CTA band** — "Make spoken knowledge searchable." Buttons: Book Demo / Join Waitlist.

## `/app` — Consumer App page
- Hero: "Search every word you've ever heard." $15/month. App store badges (placeholder).
- Use cases: voice notes, lectures, podcasts, WhatsApp companion.
- **Demo embed slot** (16:9 placeholder ready for video).
- Feature grid: cross-language search, paraphrase, transliteration ("Khudi" example), plugins (WhatsApp, Premiere Pro, YouTube).
- Pricing card: $15/mo with feature list.
- CTA: "Join the Waitlist" (email capture form, local state only for now).

## `/enterprise` — Speech Intel page
- Hero: "Unlock your private audio archives." For media houses, broadcasters, academia.
- **Demo embed slot** (16:9 placeholder).
- Value pillars: On-prem deployment & data sovereignty, semantic archive search, monetize back-catalogues, institutional licensing.
- Pilot proof: IIS case study highlight box.
- "How it works" 3-step: Ingest → Index → Search.
- Security & compliance strip.
- CTA: "Book an Enterprise Demo" (form: name, work email, organization, message — local submit + toast).

## Functionality notes
- All forms use local state + toast confirmation (no backend yet).
- Video embed areas are styled placeholders ready to swap in a YouTube/Vimeo URL.
- Fully responsive, mobile nav via Sheet.
- Design tokens added to `index.css` + `tailwind.config.ts` (dark theme, cyan/violet accents, waveform gradient).
