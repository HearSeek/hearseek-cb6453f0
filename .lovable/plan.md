I understand the issue now: the nice rounded halo appears first, then the browser finishes compositing the blurred `div` and you see the layer’s rectangular bounds. So the fix should not be “make the rectangle bigger/blurrier”; it should remove the rectangular glow layer entirely.

Plan:

1. Replace the current focus glow implementation on both search bars
   - Update `src/pages/DemoPage.tsx` and `src/pages/ResultsPage.tsx`.
   - Remove the separate absolutely-positioned blurred `div` currently sitting behind the input.
   - This is the element whose bounding box is becoming visible as the ugly sharp-corner rectangle.

2. Move the glow to the search bar itself using shadow/filter effects
   - Keep the subtle cyan/violet/pink halo.
   - Use layered `box-shadow` / `drop-shadow` on the rounded search container instead of a blurred background rectangle.
   - Because shadows are painted from the rounded container rather than from a rectangular gradient layer, there should be no rectangular box to reveal.

3. Preserve the look you liked
   - Keep the rounded, ephemeral glow on focus.
   - Keep the normal border, dark translucent input surface, and no layout shift.
   - Keep native input outlines/rings disabled so Safari/Chrome do not add their own focus rectangle.

4. Add a reusable focus-glow class in `src/index.css`
   - Define a class like `.search-focus-halo` with a transition and multi-layer shadows.
   - Define a focused state class like `.search-focus-halo-active`.
   - Use this in both pages so Demo and Results behave consistently.

Technical details:

- Current problem pattern:

```text
absolute div behind input
+ radial-gradient background
+ CSS blur filter
= browser may expose the rectangular compositing bounds
```

- New pattern:

```text
rounded search container
+ layered box-shadow/drop-shadow on focus
= glow follows rounded pill/rectangle, no independent rectangular layer
```

- I will not remove the glow. I’ll remove only the separate blurred gradient layer that is causing the sharp rectangle.