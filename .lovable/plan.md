## Problem

`https://hearseek.com/collections/IIS` redirects to the homepage because the route's `:slug` param is matched case-sensitively against the `COLLECTIONS` registry, whose keys are all lowercase (`iis`, `huberman-lab`, etc.). When `slug = "IIS"`, `getCollection("IIS")` returns `null`, and both `CollectionPage` and `CollectionResultsPage` do `<Navigate to="/" replace />` — hence the redirect.

Verified in `src/lib/registry.ts` (key `"iis"`) and `src/pages/CollectionPage.tsx` / `src/pages/CollectionResultsPage.tsx` (redirect on null).

## Fix

Make slug lookup case-insensitive, and normalize the URL so the canonical lowercase form is used (better for SEO/analytics/sharing).

### Changes

1. **`src/lib/registry.ts`** — update `getCollection` to lowercase the incoming slug before lookup:
   ```ts
   return COLLECTIONS[slug.toLowerCase()] ?? null;
   ```

2. **`src/pages/CollectionPage.tsx`** — if the URL slug differs from the canonical `collection.key` (e.g. `IIS` vs `iis`), `<Navigate to={`/collections/${collection.key}`} replace />` so the address bar cleans up. Otherwise render as normal.

3. **`src/pages/CollectionResultsPage.tsx`** — same canonicalization, preserving the existing query string (`?q=...`).

### Why not just a route-level rewrite

React Router matches params as-is; there's no built-in case-insensitive param option. Normalizing in the loader + redirecting to the canonical URL is the standard React Router pattern and keeps one canonical URL per collection for SEO.

### Out of scope

No changes to routing config, registry keys, or any other pages. This is a pure lookup/normalization fix.
