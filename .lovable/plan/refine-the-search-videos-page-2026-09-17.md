# Refine the search-videos page

## Changes

- Update Step 2 to: “We index every spoken word, in any language.”
- Replace the free-trial subnote with: “Try for free up to 3 hours of video.” in the hero and beneath the onboarding button.
- Convert “What do you want to search?” into a multi-select control:
  - Visitors can toggle any number of use-case chips.
  - Every selected chip keeps the existing highlighted gradient state.
  - Each toggle fires `hs_usecase_select` with `usecases`, containing the complete updated array of selected short values.
  - “How much content?” remains single-select and unchanged.
- Expand the existing Free, Starter, and Pro cards with the specified tier perks while preserving prices, click behavior, the selected Free state, the Starter “MOST POPULAR” flag, and `hs_plan_select` tracking.
- Remove the “Ready to search your own archive?” section so onboarding follows pricing directly.

## Demo video

Leave the current mock search demo and its existing tracking unchanged for now. Once the replacement video is supplied, replace the demo and fire `hs_demo_interact` only on its first play with `demo_query_text: "video_demo"` and `demo_result_clicked: false`.

## Verification

- Confirm use-case chips toggle independently and emit the complete selected array.
- Confirm archive size remains single-select.
- Confirm all three pricing cards remain selectable and emit their existing plan/price values.
- Confirm the revised copy and tier perks render correctly on desktop and mobile.
- Confirm pricing flows directly into onboarding and the hero/onboarding CTAs remain available.
