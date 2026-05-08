# Update search endpoint URL

Change the search API call in `src/lib/hearseek.ts` from `${API_BASE}/search/` to `${API_BASE}/search` (drop the trailing slash).

## Files touched

- `src/lib/hearseek.ts` — single string change inside `runSearch`.

## Out of scope

- No other endpoints change (`/enterprise/search_configurations` stays as-is).
- No behavior changes beyond the URL.
