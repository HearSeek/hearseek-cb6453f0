# Switch all website forms to the new leads endpoint

## What the API docs say
`POST /api/marketing/leads` (JSON), no auth listed. 200 = saved, 409 = duplicate (treated as success).

```text
{ form_type: "consumer" | "enterprise" | "persona",
  email, acq_source, page_path, host, submitted_at, consent, _gotcha,
  consumer:   { records: [ "interviews" | "meetings" | "lectures" | "others" ] },
  enterprise: { name, company, message },     // all three required
  persona:    { pasted_url, input_type, persona, page_persona, plan, price_point,
                usecases, size_band, session_id, variant, stage } }
```
Extra fields are allowed at every level, so plan_chosen_by, hero_variant and the page extras are kept.

## Changes
1. One shared `submitLead()` helper: POST to `{API base}/marketing/leads`, treat 200 and 409 as success, retry like today, never log the payload. The endpoint stays a single config value.
2. **/app waitlist**: send `form_type: "consumer"` with records as a one-item list; map "other" to "others", "voice notes" sent as-is (allowed as free text). Old consumer waitlist call and Formspree copy removed.
3. **/enterprise demo**: send `form_type: "enterprise"`; old enterprise waitlist call removed. Existing validation, success toast (3 business days) unchanged.
4. **Four persona pages**: same two stages (email, checkout_attempt) and retries, now sent as `form_type: "persona"` with persona fields nested. Formspree retired; `_subject` dropped.
5. `consent` = the visitor's saved analytics choice (or the page default), read only, consent logic untouched.
6. All hs_ events, timing and params unchanged. Test one submission per form type, then report the test emails for removal.

## Deviations from the Oct 1 request
- **Not on a HearSeek domain**: still the Tailscale address (doc asked for e.g. api.hearseek.com). Biggest gap: it goes down with the tunnel and exposes the internal hostname.
- **form_type values** are `consumer / enterprise / persona`, not `consumer_waitlist / enterprise_demo / persona_signup`.
- **Fields are nested** under `consumer` / `enterprise` / `persona` instead of flat.
- **records** is a list, and its options differ: no "voice notes", and "others" instead of "other".
- **Enterprise name, company, message are required**; the doc did not say required.
- **Error format** defined only for 409 (`error`, `code`, `details`).
- Not checkable from the docs: CORS limits, honeypot handling, rate limits, notification emails, admin/CSV export, migration of old waitlist records, removal of lovable-test@example.com, deletion on request.

## Open items for the dev team
Move to a HearSeek domain (one-line change on our side), confirm "voice notes", and send back the checklist items from the doc.
