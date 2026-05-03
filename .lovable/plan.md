I reproduced what you’re describing: the sharp-edged highlighted rectangle is not Safari’s native focus outline anymore. It is the app’s own focus treatment — an absolutely-positioned gradient layer behind the search bar that turns visible when `focused === true`. Because it sits behind a rounded rectangle and uses blur, it reads like a glowing rectangular panel with visible edges.

Plan:

1. Remove the focus-triggered glow layer from the search bars
   - In `src/pages/DemoPage.tsx`, remove or permanently disable the `focused ? "opacity-70" : "opacity-0"` gradient halo behind the main search bar.
   - In `src/pages/ResultsPage.tsx`, do the same for the compact results-page search bar.
   - This will eliminate the rectangle that appears only when clicking into the input.

2. Remove now-unused focus state if it is only used for that glow
   - Delete the `focused` state and the `onFocus` / `onBlur` handlers from both search inputs if they no longer control anything.
   - Keep the actual input behavior unchanged.

3. Keep the search bar visually stable
   - Leave the normal static bar styling intact: rounded shape, subtle border, translucent background, backdrop blur.
   - No border-color switch, no ring, no outline, no focus glow.
   - The only focus indication will be the text caret inside the input, so clicking will feel clean and professional.

4. Optional hardening against browser-native focus artifacts
   - Add a small search-input-specific class or inline style to ensure Safari/Chrome do not add native focus UI:
     - `outline: none`
     - `box-shadow: none`
     - `-webkit-appearance: none`
     - `-webkit-tap-highlight-color: transparent`
   - This is already mostly present, but I’ll make it explicit enough that the browser should not reintroduce a focus rectangle.

Expected result:
- Clicking the search bar will no longer create any glowing or rectangular highlighted area behind it.
- The bar will remain visually identical before and after focus, except for the cursor/caret appearing where the user types.
- This should address the Safari concern as well, because the visible artifact is currently coming from our code rather than Safari.