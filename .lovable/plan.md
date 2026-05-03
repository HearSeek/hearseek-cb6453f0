# Strip `�` from displayed snippets

Fix the visible `�` characters in Urdu (and any other) results by pruning the Unicode replacement character (`U+FFFD`) from snippet text at normalization time. Pure client-side cleanup — leaves the underlying transcription / API alone for later investigation.

## Change

One file: `src/lib/hearseek.ts`.

1. Add a small helper just above `normalizeHit`:

```ts
// Strip Unicode replacement chars (U+FFFD) introduced upstream by bad
// transcoding. Also collapses any double-spaces they leave behind.
const stripReplacementChars = (s: string): string =>
  s.replace(/\uFFFD+/g, "").replace(/[ \t]{2,}/g, " ").trim();
```

2. In `normalizeHit`, run the three snippet fields through it:

```ts
pre:  typeof segment.pre  === "string" ? stripReplacementChars(segment.pre)  : "",
main: typeof segment.main === "string" ? stripReplacementChars(segment.main) : "",
post: typeof segment.post === "string" ? stripReplacementChars(segment.post) : "",
```

## Why this scope

- `\uFFFD` is always the marker for a decode failure, never legitimate content — safe to strip blindly.
- Done once at normalization, so every consumer (`ResultsPage`, future filters, future PDF/share) gets clean text automatically.
- Whitespace cleanup avoids leaving awkward `"word  word"` gaps where a character used to be.
- We deliberately do **not** touch `title` or `channel`; if those ever show `�` it's a different bug worth surfacing.

## Out of scope

- Server-side / transcription pipeline fix (you'll investigate later).
- Any font or RTL changes — the replacement char isn't a font issue.
