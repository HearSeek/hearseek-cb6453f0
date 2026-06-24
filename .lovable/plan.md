## Goal
Switch the deep-index channel filters from the human-readable `source_info.channel` slug to the immutable YouTube channel ID under `source_info.author`.

## Coverage check
You listed all 10 non-IIS collections currently in the registry — nothing missing:

| Collection | YouTube channel ID |
|---|---|
| Huberman Lab | UC2D2CMWXMOVWx7giW1n3LIg |
| Lex Fridman | UCSHZKyawb77ixDdsGog4iWA |
| Modern Wisdom (Chris Williamson) | UCIaH-gZIVC432YRjNVvnyCA |
| Impact Theory (Tom Bilyeu) | UCnYMOamNKLGVlJgRUbamveA |
| TED | UCAuUUnT6oDeKwE6v1NGQxug |
| BeerBiceps | UCPxMZIFE856tbTfdkdjzTSQ |
| Dhruv Rathee | UC-CSyyi47VX1lD9zyeABW3w |
| Think School | UCKZozRVHRYsYHGEyNKuhhdA |
| Raftar | UC6zIImBjDqtEsVZfQLPoQSw |
| Diary of A CEO | UCGq-a57w-aPwyi3pW7XLiHw |

IIS stays untouched (flagship, its own `iis` configSlug, no channel filter).

## Changes (single file)
**`src/lib/registry.ts`**
1. Update the `featuredDeepIndex(...)` helper signature: rename the `channelSlug` parameter to `channelId` and change its `baseFilter` to:
   ```ts
   baseFilter: [{ key: "source_info.author", match: { value: channelId } }]
   ```
2. Update the inline `diary-of-a-ceo` entry's `baseFilter` to the same shape with `UCGq-a57w-aPwyi3pW7XLiHw`.
3. Replace each call-site's slug arg with the YouTube ID from the table above.
4. Remove the stale `TODO confirm channel slug values…` comment above the helper.

No other files need to change — `hearseek.ts` already passes `baseFilter` straight through into the Qdrant `must` array, and nothing else in the app reads these values.

## Verification
- Type-check passes (no signature consumers outside `registry.ts`).
- Open one collection (e.g. Huberman) → run a search → confirm in the dev console that the logged `[hearseek] search filters payload` now contains `{ key: "source_info.author", match: { value: "UC2D2CMWXMOVWx7giW1n3LIg" } }` and that results come back.

## Open questions
None on my side — IDs are unambiguous and `source_info.author` is clearly specified. Ready to implement on your go-ahead.