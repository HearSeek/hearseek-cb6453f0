I found the issue: the glow is still being rendered as a big rectangular gradient element behind the search bar. Even with blur and rounded corners, Safari can expose the element’s rectangular bounds, which is the sharp-corner box you’re seeing.

Plan:

1. Replace the current gradient rectangle glow
   - Remove the `absolute -inset-* bg-gradient-waveform blur-2xl` focus layer from both search bars.
   - This is the element creating the “bigger rectangle.”

2. Rebuild the focus glow as non-rectangular radial light
   - Use CSS `radial-gradient(...)` layers instead of the existing linear `bg-gradient-waveform` block.
   - Anchor the glow around the search bar with transparent edges, so there is no visible rectangular fill area for Safari to reveal.
   - Keep it subtle: cyan/violet/pink haze, low opacity, soft blur.

3. Keep the glow behavior the user liked
   - Glow appears only while the input is focused.
   - It fades in/out smoothly.
   - The search bar itself stays stable: no layout shift, no border jump, no native Safari focus ring.

4. Apply consistently in both places
   - `src/pages/DemoPage.tsx` hero search bar.
   - `src/pages/ResultsPage.tsx` compact search bar.

Technical detail:

The current implementation is effectively:

```text
[ large rectangular div ]
  background: linear-gradient(...)
  blur: large
  opacity: focus-controlled
```

I’ll change it to a true halo-style background, roughly:

```text
[ transparent radial glow layer ]
  background:
    radial-gradient(ellipse at 20% 50%, cyan transparent),
    radial-gradient(ellipse at 50% 50%, violet transparent),
    radial-gradient(ellipse at 80% 50%, pink transparent)
  mask/fade edges if needed
```

This preserves the attractive focus glow while eliminating the sharp-corner rectangle behind it.