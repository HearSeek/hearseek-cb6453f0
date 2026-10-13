# Switch all website forms to the new leads endpoint

## What the API docs say
`POST /api/marketing/leads` (JSON), no auth listed. 200 = saved, 409 = duplicate (treated as success).

```text
{ form_type: "consumer" | "enterprise" | "persona",
  email, acq_source, page_path, host, submitted_at, consent, _gotcha,
  consumer:   { records: [ "interviews" | "meetings" | "lectures" | "voice notes" | "other" ] },
  enterprise: { name, company, message },     // all optional
  persona:    { pasted_url, input_type, persona, page_persona, plan, price_point,
                usecases, size_band, session_id, variant, stage } }
```
Extra fields are allowed at every level, so plan_chosen_by, hero_variant and the page extras are kept.

## Changes
1. One shared `submitLead()` helper: POST to `{API base}/marketing/leads`, treat 200 and 409 as success, retry like today, never log the payload. The endpoint stays a single config value.
2. **/app waitlist**: send `form_type: "consumer"` with records as a one-item list (values already match the spec). Old consumer waitlist call and Formspree copy removed.
3. **/enterprise demo**: send `form_type: "enterprise"`; old enterprise waitlist call removed. Existing validation, success toast (3 business days) unchanged.
4. **Four persona pages**: same two stages (email, checkout_attempt) and retries, now sent as `form_type: "persona"` with persona fields nested. Formspree retired; `_subject` dropped.
5. `consent` = the visitor's saved analytics choice (or the page default), read only, consent logic untouched.
6. All hs_ events, timing and params unchanged. Test one submission per form type, then report the test emails for removal.

## Deviations from the Oct 1 request
- **API host**: the website is on www.hearseek.com, but the API it calls is still the Tailscale address. The doc asked for the API itself on a HearSeek domain (e.g. api.hearseek.com) so form saves don't fail if the tunnel drops and the internal hostname isn't visible in the browser. Switching later is a one-line change here.
- **form_type values** are `consumer / enterprise / persona`, not `consumer_waitlist / enterprise_demo / persona_signup`.
- **Fields are nested** under `consumer` / `enterprise` / `persona` instead of flat. Agreed, cleaner for routing on the backend; the site will send it this way.
- **records** is now a list; options match the site (`interviews, meetings, lectures, voice notes, other`), so no mapping needed.
- **Enterprise name, company, message** are now optional (nullable) in the updated spec; the site still validates name and company before sending.
- **Error format** defined only for 409 (`error`, `code`, `details`).
- **Confirmed by the dev team**: filled `_gotcha` is rejected; rate limit 5/s per IP; notifications being set up.
- **CORS** means the API only accepts browser requests coming from hearseek.com and www.hearseek.com, so other websites can't post into the leads table. Worth enabling (plus the preview domain while testing).
- Still to confirm: admin/CSV export, migration of old waitlist records, removal of lovable-test@example.com, deletion on request.

## Open items for the dev team
Move the API to a HearSeek domain, enable CORS for hearseek.com, and send back the remaining checklist items from the doc.
