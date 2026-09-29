# Store and email every persona-page signup (Formspree)

## Current flow (confirmed from code)
- The form is in one shared component, `Onboarding.tsx`, used by all four pages (/search-videos, /search-interviews, /search-raw, /search-lectures).
- The URL, email and plan are all collected in **one** form with **one** submit. On that submit it fires `hs_url_submit`, `hs_email_submit` and `hs_checkout_attempt` together, then shows "you're early".
- So email is only captured at the checkout step: **one submission per session, stage `"checkout_attempt"`**.
- Use-case chips and archive size live in the page, not the form. They will be passed into the form.
- The page-generation script only copies the page head (title, meta, consent block). It adds no form markup, so no generated files change.

## What changes
1. **New module `src/lib/signup-capture.ts`**
   - `submitSignup(payload)` POSTs JSON to `import.meta.env.VITE_SIGNUP_ENDPOINT` with `Content-Type` and `Accept: application/json`.
   - Retries once after about 1s. Fails if the endpoint is missing or the response isn't OK.
   - Stops sending after one per session_id, using an in-memory set plus sessionStorage (wrapped in try/catch). A second stage slot is kept so an email stage can be added later.
   - Includes the comment "Notification email set in Formspree dashboard: [UMER TO FILL IN]".
   - Never logs the payload.
2. **`.env.example`** (new) with `VITE_SIGNUP_ENDPOINT=https://formspree.io/f/XXXXXXX`. `.env` gets no value, so you need to add the real one.
3. **`Onboarding.tsx`**
   - New props: `usecases` and `sizeBand`.
   - Adds a visually hidden `_gotcha` honeypot input. If it's filled in, nothing is sent, but the success state still shows.
   - Submit keeps `preventDefault`, checks the email format, disables the button while sending, and shows "you're early" only after the save succeeds.
   - If both attempts fail, shows inline: "Something went wrong saving your details. Please try again."
   - Adds small text under the email field: "We'll only use your email to contact you about HearSeek access."
   - The existing hs_ events keep their exact current params and timing.
4. **`SearchVideosPage.tsx` and `PersonaLandingPage.tsx`** pass `usecases` and `sizeBand` into `Onboarding`.

## Privacy
Email and pasted URL go only into the Formspree request body. They never go into the dataLayer, gtag, hs_ params, the URL or the console. The consent block and all consent logic stay untouched.

## Payload example
```json
{
  "email": "jane@example.com",
  "pasted_url": "https://youtube.com/@janechannel",
  "input_type": "channel",
  "persona": "research",
  "page_persona": "research",
  "plan": "starter",
  "price_point": "9.99",
  "usecases": "podcast | interviews",
  "size_band": "3-50",
  "session_id": "3f2a...-uuid",
  "variant": "subscription",
  "acq_source": "google/cpc",
  "stage": "checkout_attempt",
  "submitted_at": "2026-09-29T10:00:00.000Z",
  "page_path": "/search-interviews",
  "host": "hearseek.com",
  "_subject": "HearSeek signup: research, starter",
  "_gotcha": ""
}
```
`persona`, `variant`, `acq_source`, `session_id` and `input_type` come from `persona-analytics.ts`, the same source GA4 uses. Unknown fields are sent as `""`.

## Blocker
Signups can't save until you add the Formspree form URL as `VITE_SIGNUP_ENDPOINT`.
