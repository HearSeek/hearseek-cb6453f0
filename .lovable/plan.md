## Plan

The uploaded screenshot (`IMG_20260525_145303.jpg`) replaces the current mobile app mockup used on the App page hero.

### Where it's used
Only one place: `src/pages/AppPage.tsx` hero phone frame, imported from `@/assets/hearseek-app-single.jpeg`.

### Steps
1. Copy `user-uploads://IMG_20260525_145303.jpg` → `src/assets/hearseek-app-single-v2.jpg`.
2. Update `src/pages/AppPage.tsx` import to point at the new asset.
3. Leave the old file in place (unused) so nothing else breaks; can be deleted later if desired.

No other pages reference this asset, so no further changes are needed.