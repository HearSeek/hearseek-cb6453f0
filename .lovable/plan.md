## Goal

For every collection page (`/collections/:key`), generate a 1200×630 social-share thumbnail in the "HearSeek × [Collection Logo]" layout matching the uploaded reference, and expose it as `og:image` / `twitter:image` so links unfurl correctly on WhatsApp, X, LinkedIn, iMessage, Slack, etc.

## Approach

Pre-generate one PNG per collection at build/author time and commit them under `public/og/<slug>.png`. Static PNGs are the only reliable option because social crawlers don't execute JS and this project is a SPA.

## Steps

1. **Build a Node generator script** `scripts/generate-og-images.ts`:
   - Uses `sharp` (already lightweight, no headless browser needed) to composite:
     - The exact reference background (navy `#1C1C1C` / deep blue with the audio-icon pattern) from the uploaded image, saved once as `scripts/og-template/background.png`.
     - The HearSeek wordmark + logomark (reuse `src/assets/hearseek-logo-mark-white.png` + text rendered via SVG for crisp typography, or a pre-baked left half).
     - A centered `×` glyph.
     - The collection logo from `src/assets/collections/<slug>.png`, contained in a right-side square area with the same padding rules already used on the collection pages (respecting `logoNoBackground` — IIS keeps transparent, others sit on their own tile).
   - Iterates over the `COLLECTIONS` registry (imported from `src/lib/registry.ts`) and writes `public/og/<slug>.png` for each of the 11.
   - Output size: **1200×630** (standard `summary_large_image`).

2. **Wire into build**: add an `npm run og` script and call it from `prebuild` (alongside the existing sitemap generation) so previews stay in sync with the registry.

3. **Extend `SEO` component** (`src/components/site/SEO.tsx`) to accept an optional `image` prop that emits absolute `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` (+ set `twitter:card` to `summary_large_image`).

4. **Use it on collection routes**:
   - `CollectionPage.tsx` — pass `image={\`https://hearseek.com/og/${collection.key}.png\`}`.
   - `CollectionResultsPage.tsx` — same image (shared per collection).

5. **Assets**:
   - Save the uploaded reference as `scripts/og-template/background.png` (source of truth for the background pattern).
   - Reuse existing collection logos from `src/assets/collections/`.

## Out of scope

- No changes to homepage, /app, /demo, /creators, /enterprise OG images (can be a follow-up).
- No dynamic/runtime OG generation service.
- No changes to registry data or route structure.

## Notes for the user

Once deployed, social platforms cache previews aggressively. To force a refresh after publish, use each platform's link debugger (e.g. Facebook Sharing Debugger, LinkedIn Post Inspector, X Card Validator).
