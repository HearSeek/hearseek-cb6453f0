# Wire the two waitlist endpoints into the live forms

Both forms currently only fire an analytics event and show a toast — nothing is stored. This connects them to the new HearSeek waitlist endpoints, with proper client-side validation and states.

## App waitlist (`/app`)

- On submit, `PUT /api/consumer/waitlist` with `{ email }`, no auth header (per your confirmation).
- Client-side validation before sending: email required, trimmed, must match a standard email pattern. Inline error under the field, submit blocked while invalid.
- Button shows a spinner and is disabled during the request; on success the field clears and the existing "You're on the list!" toast fires, plus the current `waitlist_signup` analytics event (kept as-is).
- Failures show an error toast asking the user to retry.

## Enterprise demo request (`/enterprise`)

- On submit, `PUT /api/enterprise/waitlist` with `{ email, name, enterprise_name, details }`.
- Field mapping: Name -> `name`, Work email -> `email`, Organization -> `enterprise_name`, "What would you like to search?" -> `details` (stays optional in the UI, sent as `""` when blank).
- Client-side validation: name and organization required and at least 2 non-whitespace characters; email required and pattern-valid. Inline errors per field, submit blocked while invalid.
- Loading state on the button, success toast on 200, error toast on failure. Adds a `demo_request` analytics event on success for parity with the app form.

## Duplicate / conflict handling

The backend will return an empty 200 for repeat emails, so no special 409 branch is needed. A defensive fallback treats a 409 as success ("You're already on the list.") in case an older server version is deployed.

## Technical notes

- Two new functions in `src/lib/hearseek.ts`: `joinConsumerWaitlist(email)` and `requestEnterpriseDemo(payload)`, both `PUT` against the existing `API_BASE`, with an 8s abort timeout and a helper that surfaces the server's `error` message from `ErrorResponse` bodies.
- A small shared validation helper (email regex + required-text check) lives in `src/lib/validation.ts` and is used by both forms.
- `src/pages/AppPage.tsx` and `src/pages/EnterprisePage.tsx` become async submit handlers with `submitting` and `errors` state; no visual redesign, only inline error text and disabled/loading button styling using existing tokens.
- `AnalyticsEvent` in `src/lib/analytics.ts` gains `"demo_request"`.
