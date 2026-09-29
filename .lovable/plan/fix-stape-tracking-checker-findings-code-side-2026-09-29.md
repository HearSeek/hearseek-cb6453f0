# Fix Stape tracking-checker findings (code-side)

Stape report (2026-09-23, score 67/100) flags 4 items. Two are dashboard-side (Stape Cookie Keeper for ITP/cookie lifetime +19; Meta web pixel in GTM +3) and need no code. This plan covers the two code-side items.

## 1. Consent configuration (+7)

Current state (confirmed): the Consent Mode default in `index.html` runs before GTM, and `ConsentBanner.tsx` pushes a consent update on load only when a saved choice exists. Gap: a returning visitor who rejected gets their stored choice re-applied only after React mounts — tags can fire in between.

Change, in `index.html` only:

- The inline consent default block reads the stored choice (`hs_consent_v1` in localStorage) **before** GTM loads:
  - Stored choice exists → default follows it (analytics → analytics_storage; ads → ad_storage, ad_user_data, ad_personalization).
  - No stored choice → current path-based default (granted on the four persona pages, denied elsewhere).
- The localStorage read is wrapped in try/catch; if storage is blocked, fall back to the current path-based default.
- A stored reject always wins, including on persona pages.

**No hand edits to the 22 static copies.** After the `index.html` change, re-run the page-generation script so every copy under `public/collections/**` is regenerated from `index.html`.

`ConsentBanner.tsx` and `src/lib/analytics.ts` stay as-is — they remain the source of truth for consent updates after visitor interaction.

## 2. Page speed (+4)

In `index.html` (propagates to copies via the generation script):

- Add `preconnect` + `dns-prefetch` for **both** `load.sst.hearseek.com` (GTM loader) and `sst.hearseek.com` (event endpoint).
- Load the Noto Nastaliq Urdu Google Font non-blockingly (async stylesheet swap).

## Explicitly not in scope

- Stape Cookie Keeper / custom loader (ITP bypass) — Stape dashboard.
- Meta web pixel — GTM web container.
- No changes to hs_ events, dataLayer pushes, the GTM snippet, or the consent banner UI.

## Verification

- Confirm regenerated static copies match the new `index.html` block.
- Playwright:
  - `/` with a stored **reject** → consent default is `denied` before GTM loads.
  - `/` with a stored **accept** → consent default is `granted`.
  - `/search-videos` as a fresh visitor (no stored choice) → default `granted`, and `hs_page_view` still fires and reaches `sst.hearseek.com`.
  - Banner still appears for fresh visitors and reject still works.
- Report the diff of the inline consent block.
