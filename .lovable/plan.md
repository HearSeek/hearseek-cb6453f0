## Swap HearSeek demo key

Update `.env`:
```
VITE_HEARSEEK_DEMO_KEY=monarch_XO46O2Ymxu6ZXRUU5mTMCn3xciYWYkutSxur3Dg5SqA
```

## Also fix the real 401 cause: slug mismatch

Looking at the network log, the 401 is not actually the key — `/enterprise/search_configurations` returns 200 with that same key in the same session. The failing search sends:

```
x-search-config: news-channels   ← hyphen
```

But the API returned slug `news_channels` (underscore). The server rejects the unknown config with 401.

The bad slug is coming from a hardcoded/cached value in the app — likely `src/pages/DemoPage.tsx` or wherever the demo CTA builds the `?config=...` URL. Need to:

1. Grep for `news-channels` across the codebase and replace with `news_channels` (or, better, drive it from the live `getSearchConfigurations()` response so it can't drift again).
2. Bump `CONFIGS_CACHE_KEY` is not needed this time — configs already load fine.

## Steps

1. Update `.env` with the new key.
2. Grep `news-channels` / hardcoded slugs and fix them to match API slugs.
3. Republish so the new `.env` value is baked into the deployed bundle.

After republish, test a search on the live site and confirm 200.
