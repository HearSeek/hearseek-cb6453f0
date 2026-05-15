# Server-Side Tracking via Stape — Implementation Plan

## What you set up (outside the code)
1. Create a **server-side GTM container** in tagmanager.google.com → note the `GTM-XXXXXXX` ID.
2. Sign up at **stape.io**, create a Power-Up container, paste the server container ID.
3. Add a **CNAME** in your DNS pointing `sgtm.hearseek.com` → the host Stape provides.
4. In your **web GTM container (`GTM-NB2NQXNV`)**, edit the GA4 Configuration tag → set `server_container_url = https://sgtm.hearseek.com`.
5. In the **server container**, add a GA4 Client + GA4 tag using measurement ID `G-WG0KZEVGYK`. Add Facebook CAPI / other server tags as needed.

No code change is required for the Stape URL — it lives inside GTM.

## What I'll build in the codebase

### 1. Analytics helper — `src/lib/analytics.ts`
- Typed `trackEvent(name, params)` that pushes to `window.dataLayer`.
- Typed event names: `waitlist_signup`, `demo_search`, `outbound_click`, `collection_view`, `collection_search`.
- SSR-safe (`typeof window` check).

### 2. Wire events into components
- `src/pages/AppPage.tsx` — fire `waitlist_signup` on form submit (with email domain, not full email).
- `src/pages/DemoPage.tsx` — fire `demo_search` on each search submit (query length + language).
- `src/pages/AppPage.tsx` — fire `outbound_click` on App Store / Play Store divs (also make them real `<a>` links so clicks are real).
- `src/pages/CollectionPage.tsx` — fire `collection_view` on mount with collection key.
- `src/pages/CollectionResultsPage.tsx` — fire `collection_search` on search.
- Also push a `page_view` on every route change via a small `useRouteTracking` hook in `Layout.tsx` (SPA route changes don't auto-fire in GTM).

### 3. Consent Mode v2 + cookie banner
- Add **default consent state** as the FIRST script in `index.html` `<head>`, BEFORE the existing GTM snippet:
  ```js
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  ```
- Build `src/components/site/ConsentBanner.tsx`:
  - Fixed bottom banner, themed with design tokens (no raw colors).
  - Buttons: **Accept all**, **Reject all**, **Customize** (opens dialog with toggles for analytics/ads).
  - On choice → `gtag('consent', 'update', {...})` + persist to `localStorage` (`hs_consent_v1`).
  - Skip rendering if a stored choice exists.
- Mount in `Layout.tsx` so it appears across the marketing pages.

### 4. Types
- Extend `src/vite-env.d.ts` with `interface Window { dataLayer: any[]; gtag: (...args:any[])=>void }`.

## Files touched
- **new** `src/lib/analytics.ts`
- **new** `src/components/site/ConsentBanner.tsx`
- **new** `src/hooks/use-route-tracking.ts`
- **edit** `index.html` (consent default snippet before GTM)
- **edit** `src/components/site/Layout.tsx` (mount banner + route tracking)
- **edit** `src/pages/AppPage.tsx` (waitlist + outbound)
- **edit** `src/pages/DemoPage.tsx` (search event)
- **edit** `src/pages/CollectionPage.tsx` + `CollectionResultsPage.tsx` (view + search)
- **edit** `src/vite-env.d.ts` (window types)

## What I will NOT do
- No GA4/Meta SDKs in the bundle — everything flows through GTM → Stape.
- No backend/edge function — Stape itself is the server side.
- No DNS/GTM config changes — those are in your Stape + GTM dashboards.

## After implementation, you'll need to
1. Finish Stape + server GTM setup (steps 1–5 above).
2. In web GTM, create a **Custom Event trigger** for each event name (`waitlist_signup`, etc.) and a GA4 Event tag pointing to your server URL.
3. Publish both web and server GTM containers.
4. Verify in GTM Preview + Stape's request log.
