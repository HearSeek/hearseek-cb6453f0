## Goal

Replace the hardcoded `News Channels` / `Podcasts` scope list on `/demo` with a dynamic list fetched from:

```
GET https://server.hearseek.com/api/enterprise
→ ["News Channels", "Podcasts", "Demo", ...]
```

The list length is variable — the UI must adapt to whatever the API returns.

## Changes (single file: `src/pages/DemoPage.tsx`)

### 1. Fetch collections on mount

- Add a `useEffect` that calls `https://server.hearseek.com/api/enterprise` directly from the browser (it's a public GET, no auth, no secrets needed → no edge function required).
- Local state:
  - `collections: string[]` — list from API
  - `loading: boolean`
  - `error: string | null`
- On success: store the array. On failure: fall back to a safe default `["News Channels", "Podcasts"]` so the page never breaks, and show a small inline notice.

### 2. Replace the static `SCOPES` constant

- Remove the hardcoded `SCOPES` array and the `Scope = "news" | "podcasts"` union type.
- `scope` state becomes `string` (the collection name itself, e.g. `"News Channels"`).
- Default `scope` = first item from API once loaded.
- Icon mapping by name (case-insensitive keyword match), with a sensible fallback:
  - contains `news` → `Newspaper`
  - contains `podcast` → `Mic`
  - contains `demo` → `PlayCircle`
  - contains `video` → `Video`
  - contains `interview` → `Users`
  - else → `Library` (default)

### 3. Dropdown rendering

- The dropdown maps over `collections` (dynamic length, scrollable if long via `max-h-72 overflow-y-auto`).
- While loading: show a small skeleton row inside the dropdown trigger (`Loading…` + spinner) and disable the button.
- The trigger label shows the active collection name (truncated on small screens; full name in the dropdown).
- The helper line under the search input becomes:
  `Search across hundreds of {activeCollection.toLowerCase()} — by meaning, not just keywords.`

### 4. Resilience

- 8s fetch timeout via `AbortController`.
- If API returns an empty array → fall back to defaults.
- If API is unreachable → fall back to defaults + console warn (no scary UI error, just a subtle muted-text note under the dropdown: `Using default collections`).

## Out of scope

- No backend / edge function (endpoint is public, CORS-permitted GET).
- No changes to `/results`, search submission, or card grid.
- No new dependencies.

## Files touched

- `src/pages/DemoPage.tsx` (edit only)
