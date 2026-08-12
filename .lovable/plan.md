# Fix the 1% "Match" scores on search results

## What actually happened

Nothing changed in the frontend scoring code. The search API changed what it returns.

A live call to `/api/search` (config `iis`) now comes back with hits marked `source: "vector"` and scores like `0.01`, `0.00990099`, `0.009803922`, `0.009708738`. Those are reciprocal-rank-fusion values (roughly `1 / (k + rank)`), not cosine similarity in a 0-1 range. The results card renders `round(score * 100)` as "Match", so every hit rounds down to 1%.

## The fix

Stop treating the raw API score as a percentage. Derive the displayed match from the score's position within the returned result set:

- Compute a normalized match value per result set: the top hit anchors the high end, the weakest hit the low end, and the rest are spaced between them by their score. Values are clamped to a sensible floor (around 35%) so a legitimate mid-list hit never reads as near-zero.
- Single-result sets, or sets where every score is identical, show a fixed high value instead of dividing by zero.
- The ring, gradient, glow and layout stay exactly as they are — only the number and the ring fill change.
- Relabel the caption from "Match" to "Relevance", since the figure is now relative ranking strength rather than absolute similarity.

This is display-only and works whether the backend returns fusion scores or true similarity, so it won't break again if the scoring changes once more.

## Note on the deeper cause

The clean long-term fix is for the API to expose a real 0-1 similarity value alongside the fusion score. If that field gets added later, the meter can read it directly and the normalization can be dropped. Worth flagging to whoever owns the search service.

## Technical detail

- `src/pages/ResultsPage.tsx` only. `RelevanceMeter` takes a precomputed `value` (0-1) instead of the raw `hit.score`.
- A small helper maps the hits array to normalized values once per result set (memoized alongside the existing hits state), so all cards share a consistent scale.
- The "All" scope on the demo page merges hits across configs before rendering, so normalization runs after the merge and stays consistent there too.
- No changes to `src/lib/hearseek.ts`, the request payload, or filters.
