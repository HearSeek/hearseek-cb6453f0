## Changes for /creators

### 1. Hero heading (`src/pages/CreatorsPage.tsx`)
Replace the current `<h1>` with:

> **Make every word in your YouTube Channel Discoverable.**

`YouTube Channel Discoverable` will be wrapped in `<span className="text-gradient">` so it picks up the brand gradient. Layout, size, and surrounding eyebrow/subtitle stay as-is.

### 2. Mobile feature cards = accordion (`src/components/site/StickyFeatureShowcase.tsx`)
Today the right column renders 6 tall cards stacked full-screen on mobile — too much scroll.

On mobile (`<md`), replace the sticky two-column layout with a single-column accordion using the existing `@/components/ui/accordion` (Radix, already in the project):

- Hide the left sticky intro card on mobile (`hidden md:flex`); keep the section heading/eyebrow/CTA above the accordion instead.
- Render all 6 features as `AccordionItem`s, one expanded by default, single-open mode (`type="single" collapsible`).
- Trigger row shows: small icon chip + `shortLabel` + chevron.
- Expanded content shows: eyebrow, full title, description, bullets, and `visual`.
- Desktop (`md+`) keeps the current sticky-scroll showcase untouched.

### 3. Larger logo marquee on tablet/desktop (`src/components/site/CollectionMarquee.tsx`)
Goal: ~6 logos visible at once on tablet/laptop, rest scrolling.

- Bump `CollectionLogo` size from `md` to a responsive larger size on `md+` (use a wrapper class like `[&>*]:h-20 [&>*]:w-20 md:[&>*]:h-28 md:[&>*]:w-28 lg:[&>*]:h-32 lg:[&>*]:w-32`, or pass `size="lg"` and verify it gives the target ~160–180px slot including gap).
- Increase gap on `md+` from `gap-6` to `md:gap-10 lg:gap-12`.
- Mobile size stays as today.
- Tune so a 1280–1440px viewport shows ~6 logos in the visible band; the marquee animation already loops the doubled list.

### 4. Rename "IIS" → "International Iqbal Society" (`src/lib/registry.ts`)
Change `COLLECTIONS.iis.shortName` from `"IIS"` to `"International Iqbal Society"`. This is the label used wherever `shortName` is rendered (cards, marquee tooltips, etc.). `configName` ("IIS Lectures") and the internal `key: "iis"` stay — they're backend identifiers, not display strings.

### Out of scope
- No backend, registry key, or routing changes.
- Desktop showcase behavior on `/creators` stays exactly as it is now.
