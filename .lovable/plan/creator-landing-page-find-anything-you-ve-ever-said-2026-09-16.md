# Creator landing page: "Find Anything You've Ever Said"

A single, standalone marketing page at `/search-videos` (matching services.hearseek.com/search-videos). No site header/footer chrome, no sign-in, no backend — every interaction is front-end only.

## Look and feel

- Background very dark navy `#0B1020`, near-white text `#E7EAF6`, secondary grey `#99A0BE`.
- Violet-to-cyan gradient (`#7C4DFF` to `#22D3EE`) on the main button and key highlights only.
- Clean sans-serif, generous spacing, rounded cards with soft shadows. No photos of people, no emojis.
- Mobile-first: single column on phones, two/three column grids from tablet up.

## Sections, top to bottom

1. **Hero** — "HearSeek" wordmark top-left. Headline "Find Anything You've Ever Said", subhead about searching years of videos and podcasts and jumping to the exact moment. Gradient button "Create my searchable library" with "Free on up to 3 hours of video" beneath it; clicking it smooth-scrolls to the onboarding section.
2. **Live demo (mock)** — Search field pre-filled with "where did I talk about quitting my first company?" plus a Search button. Three result cards appear on load and on every Search click, each with a plausible creator-style video title, a timestamp (e.g. 42:17), a one-line transcript excerpt, and a "Jump to moment" link (no navigation). Caption: "Search by meaning. Land on the exact moment it was said."
3. **How it works** — Three cards: Paste your channel or playlist · We make it searchable · Search and jump to any moment.
4. **Selectors** — "What do you want to search?" chips (My YouTube channel, Podcast, Research interviews, Course / lectures, Work recordings, Other) and "How much content?" bands (Under 5 hours, 5–50, 51–100, 101–500, 501+). Single-select each, chosen option highlighted with the accent gradient.
5. **Pricing (subscription)** — Three clickable cards: Free 3 hours ($0), Starter $9.99/mo 50 hours, Pro $29.99/mo 200 hours. Selected plan is highlighted and carried into onboarding.
6. **Onboarding** — URL field (YouTube / playlist / video), email field, and a "Create my searchable library" button. Nothing is sent anywhere; on submit the block is replaced by a confirmation panel: "You're early. We're opening the next batch shortly. We'll email you and give you your first 3 searchable hours free."
7. **Footer** — "HearSeek" wordmark, "Making the spoken word searchable.", contact email placeholder, and a footer CTA link.

## Tracking

A small helper module reads `utm_source`/`utm_medium` from the URL into `acq_source` (falling back to `direct`), generates a `session_id`, and pushes to `window.dataLayer` with fixed `persona: 'creator'`, `variant: 'subscription'`, and `page_persona`. Events fire exactly as specified, with no data sent to third parties from the page:

- `hs_page_view` on load
- `hs_demo_interact` on Search (`demo_result_clicked: false`) and on "Jump to moment" (`true`), both with `demo_query_text`
- `hs_try_free_click` with `cta_location` of `hero` / `mid` / `footer`
- `hs_usecase_select` with short values `youtube_channel | podcast | interviews | lectures | work_recordings | other`
- `hs_archive_size` with `<5 | 5-50 | 51-100 | 101-500 | 501+`
- `hs_plan_select` with `plan` (`free|starter|pro`) and `price_point` (`0`, `9.99`, `29.99`)
- `hs_url_submit` with `input_type` inferred as `channel`, `playlist`, or `url`
- `hs_email_submit`
- `hs_checkout_attempt` with selected plan and price (defaulting to `free` / `0`) immediately before the confirmation appears

## Metadata

Per-route head tags: title "HearSeek: Find Anything Inside Your Videos", description "Search your videos and podcasts by meaning and jump to the exact moment. Try it free.", author HearSeek, canonical and og:url pointing at this page, and a HearSeek OG image (existing HearSeek social image, no builder default). Because the live site serves the last published build, this page reaches the public URL on the next publish.

## Domain: services.hearseek.com

`services.hearseek.com` is **not connected** to this project yet (no custom domains are connected at all — the published URL is still the Lovable URL). The root `hearseek.com` is hosted elsewhere (Siteground nameservers), so connecting the subdomain here won't affect the main site. To make the page resolve at `services.hearseek.com/search-videos`:

1. In Lovable: Project Settings → Domains → Connect Domain, enter `services.hearseek.com` (the full subdomain, typed directly).
2. At Siteground DNS: add an A record for `services` pointing to `185.158.133.1` and the TXT record `_lovable` shown by the connect dialog.
3. Publish after the domain turns Active — a connected domain serves nothing until the project is published.

Note: a connected domain serves this whole project, so the entire app (home, /app, /demo, collections...) becomes reachable at `services.hearseek.com` — not just this page. If only the landing page should live there, the alternative is a separate Lovable project for service pages with the domain connected to that. Worth deciding before connecting.

## Technical notes

- New `src/pages/SearchVideosPage.tsx` rendered by a `/search-videos` route registered outside the shared `Layout` wrapper in `App.tsx`, so the page carries none of the site nav/footer.
- New `src/lib/persona-analytics.ts` holding the `hs()` helper and UTM/session capture, used only by this page; the existing site analytics and consent setup stay untouched.
- Page-scoped palette via CSS custom properties on the page wrapper (mapped to Tailwind through arbitrary-value classes off those variables) so the new colours don't alter the existing site theme.
- Section components live in `src/components/search-videos/` (hero, demo, how-it-works, selectors, pricing, onboarding, footer) for readability; state (query, selected chip, band, plan, submitted flag) is held in the page component.
- Head tags via the existing `SEO` component / `react-helmet-async` setup, plus a static route entry so the page's metadata is crawlable in the build output like the collection routes.  
  
  
leave domain/custom-domain settings alone (dev handles routing) and treat the canonical/og:url as a placeholder pending the final domain.