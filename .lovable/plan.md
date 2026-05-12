# Results card refinements

Three focused changes to `src/pages/ResultsPage.tsx`. No business-logic changes.

## 1. Replace inline ShareRow with a "Share this clip" popover button

Today `ShareRow` renders a label plus 4 inline icon buttons under the thumbnail. Replace with a single button that opens a popover containing all share options. Same component is used on desktop and mobile (it already renders below the thumbnail in both layouts).

- Use the existing shadcn `Popover` (`@/components/ui/popover`) — already in the project.
- Trigger button: full-width under the thumbnail, outline style, label "Share this clip", `Share2` icon on the left. Sized to match the thumbnail block (`w-full`).
- Popover content (~w-64, anchored to trigger):
  - Header: "Share this clip" (small, muted).
  - Vertical list of options, each a row with icon + label, hover state, full-width click target:
    - Copy link (`Link2`) — calls existing `copyLink` (clipboard + toast).
    - WhatsApp (`WhatsAppIcon`) — opens `https://wa.me/?text=…`.
    - Facebook (`Facebook`) — opens FB sharer.
    - X (`Twitter`) — opens tweet intent.
  - External links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`); after activation the popover closes (controlled `open` state).
- Keep all visuals on design tokens (`border-white/10`, `bg-card/...`, `text-muted-foreground`, `hover:text-foreground`, `hover:border-primary/40`).
- Mobile parity is automatic — same button, same popover. Popover already handles small-viewport positioning.

## 2. Update share metadata text

Currently `SHARE_TAGLINE = "Found this exact moment using HearSeek – The World's First AI Search Engine for Audio. 🔍🎧"` is reused for all platforms.

Replace with a per-hit composer that uses the current query (already available in `ResultsPage` as `query`, will be threaded into `ShareRow` via a new `query` prop):

```
I searched "<query>" on HearSeek and found this exact moment.
HearSeek - The World's First AI Search Engine for Audio
<link>
```

- WhatsApp: full 3-line text (newline-encoded).
- Copy link: still copies just the URL (matches user expectation when they pick "Copy link"). Toast unchanged.
- Facebook: `u=<link>&quote=<first two lines>` (FB ignores `quote` for most pages now but we keep parity).
- X: `text=<first two lines>&url=<link>` (X auto-appends URL, so we omit it from `text` to avoid duplication).
- If `query` is empty, fall back to: `Found this exact moment on HearSeek.\nHearSeek - The World's First AI Search Engine for Audio\n<link>`.

`SHARE_TAGLINE` constant is removed; replaced by an inline `buildShareText(query, link)` helper inside `ResultsPage.tsx`.

## 3. Show video title below the pills row

Currently the `ResultCard` header row (line ~275) puts ChannelPill, then the title as a small truncated inline text, then the language pill on the right. Refactor:

- Top row: ChannelPill (left) + Language pill (right, `ml-auto`). No title here.
- New second row: video title rendered as a single-line element below the pills and above the snippet.
  - Element: `<h3>` for semantics, `font-display text-sm font-medium text-foreground/90 truncate` (RTL-aware via `dir` when language is RTL).
  - Margin: `mt-1.5 mb-1` to sit between pills and snippet.
  - Only rendered when `hit.title` exists.

No other layout changes.

## Technical notes

- File touched: `src/pages/ResultsPage.tsx` only.
- New imports from `@/components/ui/popover`: `Popover`, `PopoverTrigger`, `PopoverContent`.
- `ShareRow` signature becomes `({ hit, query }: { hit: SearchHit; query: string })`; `ResultCard` gains a `query` prop forwarded from the parent map (`hits.map(...)`).
- No changes to `hearseek.ts`, filter logic, routing, or pilot config.
- Existing toast + clipboard behavior preserved.
