# Plan: Connect HearSeek `/api/search` (Enterprise)

## Decisions locked in (from Q&A)
- **API key**: stored as a public demo key in frontend (`VITE_HEARSEEK_DEMO_KEY` in `.env`). Calls go directly browser → `server.hearseek.com`. CORS must be open on your server for both `/api/enterprise/search_configurations` and `/api/search/`.
- **Dropdown**: switches fully to `GET /api/enterprise/search_configurations`. Old `/api/enterprise` call is removed. Slug becomes the value sent in `X-Search-Config`; name is the label shown.
- **Snippet rendering**: pre-context (muted) + bold/highlighted main + post-context (muted), all inline.
- **Channel display**: prettified names as a colored badge (CNN, Fox News, BBC, Sky News, Samaa TV, …). No logos.

---

## Step 1 — API key setup

You'll give me the key in chat. I'll add it to a project `.env` as:

```
VITE_HEARSEEK_DEMO_KEY=<key>
```

Accessed in code as `import.meta.env.VITE_HEARSEEK_DEMO_KEY`. **Note**: this is visible in the shipped JS bundle — only safe because you've explicitly classified it as a low-risk demo key.

---

## Step 2 — Search configurations: fetch, cache, dropdown

New file: `src/lib/hearseek.ts` — a thin client module shared by demo + results pages.

Exports:
- `type SearchConfig = { name: string; slug: string }`
- `getSearchConfigurations(): Promise<SearchConfig[]>` — calls `GET https://server.hearseek.com/api/enterprise/search_configurations`, caches the result in-memory + `sessionStorage` for **5 minutes** (timestamp keyed). Returns fallback `[]` on error and logs a warning.
- `runSearch(query: string, slug: string): Promise<SearchHit[]>` — POSTs to `/api/search/` with `X-Company-Key` + `X-Search-Config` headers and `{texts: query}` body. Returns the normalized hits array.
- `type SearchHit` — flattened shape (id, score, text, pre, main, post, start, end, youtubeUrl, videoId, timestampedUrl, channel, language).
- Helper: `normalizeHit(raw)` to flatten the deeply-nested API payload into something the UI can use without diving 4 levels deep.

**`DemoPage.tsx`** changes:
- Remove the existing `/api/enterprise` fetch.
- Call `getSearchConfigurations()` instead. Store `SearchConfig[]` in state. The active `scope` becomes the **slug**; the dropdown label uses the **name**.
- Loading state and fallback behavior stay the same as today.
- On submit (Enter or click Search): navigate to `/results?q=<query>&config=<slug>&configName=<name>`.

---

## Step 3 — Results page rewrite (`src/pages/ResultsPage.tsx`)

Already exists as a stub — replace its body to:

1. Read `q`, `config`, `configName` from URL search params.
2. On mount (and whenever `q`/`config` change), call `runSearch(q, config)`.
3. Render:
   - **Header strip**: HearSeek logo, the search input pre-filled with `q` (editable, re-submits on Enter), the active config name as a badge, a "Back to demo" link.
   - **Results count**: `"123 results for 'hello world' in News Channels"`.
   - **Result cards** (mapped from hits, vertical stack on mobile, 2-col grid on `md+`):
     - **Thumbnail** (left/top): `https://i.ytimg.com/vi/<videoId>/hqdefault.jpg` with a small Play overlay and the formatted timestamp pinned bottom-right (e.g. `18:24`). Whole thumbnail is a link to `https://www.youtube.com/watch?v=<videoId>&t=<start>` (target=`_blank`, rel=`noopener noreferrer`).
     - **Body**: channel badge (pretty name) + relevance score pill (e.g. `0.60`), then the snippet: `<span className="text-muted-foreground">{pre}</span> <mark className="bg-primary/20 text-foreground font-medium">{main}</mark> <span className="text-muted-foreground">{post}</span>`.
     - **Footer**: small muted line `Jump to 18:24 →` reinforcing the click target.
   - **States**: skeleton cards while loading; empty-state illustration + "No results" message when zero hits; inline error card with retry button on failure.

4. Helpers (in `src/lib/hearseek.ts` or co-located):
   - `extractYoutubeId(url)` → grabs `v` param. If a `timestamped_url` is present, prefer that for the click link directly.
   - `formatTimestamp(seconds)` → `mm:ss` or `h:mm:ss`.
   - `prettifyChannel(code)` → lookup map:
     ```
     cnn → CNN, fox → Fox News, bbc → BBC, sky → Sky News,
     samaa → Samaa TV, msnbc → MSNBC, nbc → NBC, abc → ABC,
     cbs → CBS, aljazeera → Al Jazeera, … (extensible)
     ```
     Unknown codes → uppercased fallback.

---

## Step 4 — Small polish
- Right-to-left awareness: when `language === "ur"` or `"ar"`, set `dir="rtl"` on that card's snippet block so Urdu/Arabic renders correctly (the sample has a Samaa TV Urdu hit).
- Score formatted to 2 decimals.
- Cards use existing `bg-card/60`, `border-white/10`, `backdrop-blur-xl` styling so it matches the demo page's glass aesthetic.

---

## Files touched
- `src/lib/hearseek.ts` — **new**, API client + helpers + 5-min cache
- `src/pages/DemoPage.tsx` — swap endpoint, send `slug` in URL on submit
- `src/pages/ResultsPage.tsx` — full rewrite to render real results
- `.env` — add `VITE_HEARSEEK_DEMO_KEY` (after you share the key)

## Out of scope (next round)
- Filters (channel, date, language)
- Pagination / infinite scroll
- Authenticated/per-user enterprise auth (we'd swap to an edge function then)

---

## What I need from you to start
1. The **API key** itself (paste in chat — I'll move it to `.env`).
2. Confirmation that **CORS is enabled** on `server.hearseek.com` for both `/api/enterprise/search_configurations` (GET) and `/api/search/` (POST, plus OPTIONS preflight allowing the `X-Company-Key` and `X-Search-Config` headers). Without this, the browser will block the calls.
3. **Approve this plan** and I'll implement.
