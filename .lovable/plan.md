## Swap GTM loader to Stape Custom Loader

Replace the standard GTM snippets in `index.html` with the Stape Custom Loader versions you pasted. Consent Mode v2 default block stays exactly where it is (must run before the loader).

### Edit `index.html`

**In `<head>`** — replace the current Google Tag Manager `<script>` block (the `gtm.js` loader) with:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://load.sst.hearseek.com/dg297vwjeyvgk.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','79wcfetc=AgNLPjEnWjgpVTgoPSQhUB1aRFdUTBMYVg8TGBcZEhMASRUWCA%3D%3D');</script>
<!-- End Google Tag Manager -->
```

Keep the Consent Mode v2 `<script>` block above it untouched (order: consent default → custom loader).

**In `<body>`** — replace the current GTM `<noscript>` block with:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://load.sst.hearseek.com/ns.html?id=GTM-NB2NQXNV" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Nothing else changes

- `dataLayer` events, route tracking, consent banner, all event wiring — unchanged.
- No other files touched.

### After deploy — verify

1. Hard reload `hearseek.com`, open DevTools → Network, confirm a request to `load.sst.hearseek.com/dg297vwjeyvgk.js` (200) and **no** request to `googletagmanager.com/gtm.js`.
2. GTM Preview still connects (uses the same container ID under the hood).
3. GA4 Realtime + Meta Events Manager keep receiving events.
4. Test with uBlock/AdGuard enabled — events should now still fire (the whole point of the loader).
