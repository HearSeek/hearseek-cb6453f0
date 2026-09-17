# Replace the search-videos demo

## Changes

- Add the supplied self-contained HearSeek animation as a page asset, preserving its visuals and 15-second loop.
- Replace only the existing mock search inside the current demo section with a responsive, non-interactive 16:9 animation frame.
- Keep the existing caption beneath the animation unchanged.
- Remove the old search, result-card, and jump interaction handlers.
- Fire `hs_demo_interact` once when the demo first enters the viewport, with `demo_query_text: "video_demo"` and `demo_result_clicked: false`.
- Respect reduced-motion preferences by pausing the embedded animation on its final static state instead of looping.

## Technical details

- Isolate the standalone animation in an iframe so its bundled styles and scripts cannot affect the landing page.
- Disable pointer interaction and hide the animation bundle’s playback/editor controls so it remains display-only.
- Use a one-shot intersection observer in `LiveDemo` for analytics; preserve every other page event unchanged.
- Add a small reduced-motion bridge inside the animation document that seeks to and holds its final visible frame.

## Verification

- Confirm the animation autoplays and loops on desktop and mobile without overflow.
- Confirm no search field, Search button, result cards, or Jump controls remain outside the animation.
- Confirm the caption and surrounding section order are unchanged.
- Confirm `hs_demo_interact` fires once on first view with the exact requested payload.
- Confirm reduced-motion mode displays the final static state and does not loop.
