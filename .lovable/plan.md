# Fix Stape tracking-checker findings (code-side)

Stape report (2026-09-23, score 67/100) flags 4 items. Two are dashboard-side (Stape Cookie Keeper for ITP/cookie lifetime +19; Meta web pixel in GTM +3) and need no code. This plan covers the two code-side items.

## 1. Consent configuration (+7)

Current state (confirmed): the Consent Mode default in `index.html` runs before GTM, and `ConsentBanner.tsx` pushes a consent update on load only when a saved choice exists. Gaps:

- **Returning visitors who rejected:** on non-persona pages the default is `denied`, but the banner's stored "reject" choice is only re-applied via `updateConsent` after React mounts — a gap where GTM tags can fire. Fix: read the stored choice (`hs_consent_v1` in localStorage) inside the inline default block in `index.html` itself, and set the default to granted/denied accordingly, before GTM loads. Persona pages keep their granted default only when no stored choice exists; a stored reject always wins.
- **Persona pages default granted:** this is intentional (approved earlier) and stays. The checker counts it as "cookies set without consent"; with the stored-choice fix above, an explicit reject is still honored everywhere.
- Apply the same inline-block change to all 22 static copies under `public/collections/**` (same sed approach as before) so they stay identical.
- `ConsentBanner.tsx` and `src/lib/analytics.ts` stay as-is — they remain the source of truth for updates after the visitor interacts.

## 2. Page speed (+4)

Small, safe wins in `index.html` (and the 22 static copies where applicable):

- Add `dns-prefetch`/`preconnect` for `load.sst.hearseek.com` so the GTM/sGTM script resolves faster.
- Load the Noto Nastaliq Urdu Google Font non-blockingly (`media="print" onload` swap or `font-display` is already `swap`; make the stylesheet async).
- No changes to images, components, or tracking logic.

## Explicitly not in scope

- Stape Cookie Keeper / custom loader (ITP bypass) — enable in the Stape dashboard.
- Meta web pixel to complement CAPI — add in the GTM web container.
- No changes to hs_ events, dataLayer pushes, GTM snippet, or the consent banner UI.

## Verification

- Re-read the updated inline block in `index.html` and one static copy to confirm they match.
- Playwright: on `/` with a stored reject choice, confirm the dataLayer consent default is `denied` before GTM loads; on `/search-videos` with no stored choice, confirm default is `granted`; confirm the banner still appears and reject still works.
