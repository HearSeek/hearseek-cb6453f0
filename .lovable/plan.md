# Fix: Demo search bar feels laggy in Safari

## Root cause

`src/pages/DemoPage.tsx` uses a `useTypingPlaceholder` hook that calls `setText(...)` inside a `requestAnimationFrame` loop (~30–60 times/sec). That state lives on `DemoPage`, so the **entire page re-renders every frame**, including:

- the controlled `<input>`,
- the scope dropdown,
- and three large `blur-3xl` ambient gradients plus a `backdrop-blur-xl` search container.

Safari's backdrop-filter is significantly more expensive than Chrome's. Combining a constantly re-rendering parent with `backdrop-blur-xl` + multiple `blur-3xl` layers makes every keystroke land in the middle of an expensive paint, which is why typing feels sluggish — even though the input itself is fine.

A second smaller factor: the typing loop only pauses when `value.length === 0`. The moment you delete back to empty it resumes thrashing.

## Fix

Decouple the animated placeholder from React's render cycle so typing in the input never triggers a re-render of the page.

### 1. Rewrite `useTypingPlaceholder` to bypass React state

Instead of `setText` each frame, the hook returns a `ref` callback that attaches to the `<input>` and mutates `input.placeholder` directly via `requestAnimationFrame`. No component state, no re-renders.

```ts
// returns a ref to attach: <input ref={placeholderRef} ... />
const placeholderRef = useTypingPlaceholder(PLACEHOLDERS, value.length === 0);
```

Internally the hook:
- stores the input element in a `useRef`,
- runs the same RAF loop, but writes `el.placeholder = current.slice(0, charIdx)`,
- still pauses while the user has typed something,
- cleans up on unmount.

### 2. Remove the now-unused `placeholder={placeholder}` binding

Replace with `ref={placeholderRef}` on the `<input>` in `DemoPage.tsx`. Keep everything else (scope dropdown, submit, styles) as-is.

### 3. Lighten Safari paint cost on the search container (small additional win)

On the search wrapper that has `backdrop-blur-xl`, add `will-change: transform` + `transform: translateZ(0)` so Safari promotes it to its own layer once, instead of re-compositing on every parent update. This is a one-line className/style change, not a visual change.

### Out of scope

- No change to the actual search behavior, results page, filters, or styling.
- Not touching the ambient blur gradients themselves — once the per-frame re-render is gone they're paint-once and fine.

## Files touched

- `src/pages/DemoPage.tsx` — swap the hook's API from returned string to ref; attach to input; tiny layer-promotion hint on the search container.

## Why this will fix it

After the change, typing into the input will only trigger React updates for the `value` state (cheap, local), and the placeholder animation will mutate a single DOM attribute outside React. Safari no longer has to re-render + re-composite the blurred surfaces on every keystroke.
