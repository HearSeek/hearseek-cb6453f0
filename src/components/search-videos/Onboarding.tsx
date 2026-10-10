import { useState, type FormEvent } from "react";
import { CheckCircle2, Link2, Mail } from "lucide-react";
import {
  hs,
  inferInputType,
  PERSONA,
  VARIANT,
  ACQ_SOURCE,
  SESSION_ID,
  type Persona,
} from "@/lib/persona-analytics";
import { submitSignup } from "@/lib/signup-capture";
import type { PlanId } from "./Pricing";
import { PLANS } from "./Pricing";
import type { SizeBand, Usecase } from "./Selectors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Fire each analytics event only once per session, even across retries.
const eventsFiredMemory = new Set<string>();
const eventsKey = (name: string) => `hs_signup_event_${name}_${SESSION_ID}`;
function eventFired(name: string): boolean {
  if (eventsFiredMemory.has(eventsKey(name))) return true;
  try {
    return window.sessionStorage.getItem(eventsKey(name)) === "1";
  } catch {
    return false;
  }
}
function markEventFired(name: string) {
  eventsFiredMemory.add(eventsKey(name));
  try {
    window.sessionStorage.setItem(eventsKey(name), "1");
  } catch {
    /* ignore */
  }
}

export function Onboarding({
  plan,
  planChosen = false,
  ctaLabel = "Create my searchable library",
  persona,
  usecases = [],
  sizeBand = null,
}: {
  plan: PlanId;
  // True once the visitor picked a plan (pricing section or step 2 picker).
  // False means the plan is still the pre-selected Free default.
  planChosen?: boolean;
  ctaLabel?: string;
  persona?: Persona;
  usecases?: Usecase[];
  sizeBand?: SizeBand | null;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [sending, setSending] = useState(false);
  // True once Formspree accepted the stage "email" submission.
  const [emailSaved, setEmailSaved] = useState(false);
  // Plan chosen in step 2; starts from the pricing-section plan (carried
  // silently, no hs_plan_select) and only fires the event on an explicit change.
  const [stepPlan, setStepPlan] = useState<PlanId>(plan);
  // True once the visitor changed the plan in the step 2 picker.
  const [stepPlanChanged, setStepPlanChanged] = useState(false);
  // "visitor" once the plan was actively picked; "default" while it is still
  // the pre-selected Free.
  const planChosenBy = planChosen || stepPlanChanged ? "visitor" : "default";

  const p = persona ?? PERSONA;
  const planFor = (id: PlanId) => PLANS.find((pl) => pl.id === id);

  const basePayload = () => ({
    persona: p,
    page_persona: p,
    usecases: usecases.join(" | "),
    size_band: sizeBand ?? "",
    session_id: SESSION_ID,
    variant: VARIANT,
    acq_source: ACQ_SOURCE,
    submitted_at: new Date().toISOString(),
    page_path: window.location.pathname,
    host: window.location.host,
    _gotcha: "",
  });

  // Step 1: capture the email on its own so the lead is kept even if the
  // visitor leaves before step 2. Up to 3 attempts, a few seconds apart.
  const onEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmedEmail = email.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setStepPlan(plan);

    // Honeypot filled: pretend success, send nothing, fire nothing.
    if (gotcha) {
      setEmailSaved(true);
      setStep(2);
      return;
    }

    const sel = planFor(plan);
    setSending(true);
    const ok = await submitSignup(
      {
        ...basePayload(),
        email: trimmedEmail,
        pasted_url: "",
        input_type: "",
        plan: plan ?? "",
        price_point: sel?.pricePoint ?? "",
        stage: "email",
        _subject: `HearSeek signup: ${p}, ${plan || "no plan"}`,
      },
      undefined,
      { attempts: 3, delayMs: 2500 },
    );
    setSending(false);
    if (ok && !eventFired("hs_email_submit")) {
      markEventFired("hs_email_submit");
      hs("hs_email_submit", {}, persona);
    }
    // On failure the email stays in memory and step 2's Send resends it.
    setEmailSaved(ok);
    setStep(2);
  };

  // Step 2 (optional): link + plan.
  const onCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmedUrl = url.trim();
    const sel = planFor(stepPlan);
    setError(null);

    if (!eventFired("hs_checkout_attempt")) {
      markEventFired("hs_checkout_attempt");
      if (trimmedUrl) hs("hs_url_submit", { input_type: inferInputType(trimmedUrl) }, persona);
      hs("hs_checkout_attempt", {
        plan: stepPlan,
        price_point: sel?.pricePoint ?? "0",
      }, persona);
    }

    if (gotcha) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    const ok = await submitSignup({
      ...basePayload(),
      email: email.trim(),
      pasted_url: trimmedUrl,
      input_type: trimmedUrl ? inferInputType(trimmedUrl) : "",
      plan: stepPlan ?? "",
      price_point: sel?.pricePoint ?? "",
      stage: "checkout_attempt",
      _subject: `HearSeek signup: ${p}, ${stepPlan || "no plan"}`,
    });
    setSending(false);
    if (ok) setSubmitted(true);
    else setError("Something went wrong saving your details. Please try again.");
  };

  const shell = (children: React.ReactNode) => (
    <section data-section="signup_form" id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Onboarding">
      {children}
    </section>
  );

  if (submitted || skipped) {
    return shell(
      <div className="animate-fade-in-up rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-10 text-center shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-14">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--sv-cyan)/0.15)]">
          <CheckCircle2 className="h-7 w-7 text-[hsl(var(--sv-cyan))]" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">You're on the list.</h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[hsl(var(--sv-muted))]">
          We'll email you when your free 3 hours are ready.
        </p>
      </div>,
    );
  }

  if (step === 2) {
    return shell(
      <>
        {emailSaved ? (
          <div className="animate-fade-in-up text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--sv-cyan)/0.15)]">
              <CheckCircle2 className="h-6 w-6 text-[hsl(var(--sv-cyan))]" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">You're on the list.</h2>
            <p className="mt-3 text-base text-[hsl(var(--sv-muted))]">
              We'll email you when your free 3 hours are ready.
            </p>
          </div>
        ) : (
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">Almost there</h2>
        )}
        <form
          onSubmit={onCheckoutSubmit}
          className="mt-8 rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-6 shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-8"
        >
          <p className="mb-4 text-base text-[hsl(var(--sv-muted))]">Optional: tell us a bit more.</p>
          <label htmlFor="sv-url" className="mb-2 block text-base font-medium">
            Link to your content (optional)
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface-2))] px-4">
            <Link2 className="h-4 w-4 shrink-0 text-[hsl(var(--sv-muted))]" aria-hidden />
            <input
              id="sv-url"
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full bg-transparent py-3.5 text-base outline-none placeholder:text-[hsl(var(--sv-muted))]"
            />
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 block text-base font-medium">Plan</legend>
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map((pl) => {
                const active = pl.id === stepPlan;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      if (pl.id === stepPlan) return;
                      setStepPlan(pl.id);
                      hs("hs_plan_select", { plan: pl.id, price_point: pl.pricePoint }, persona);
                    }}
                    className={`rounded-xl border px-3 py-3 text-base transition-colors ${
                      active
                        ? "border-[hsl(var(--sv-cyan))] bg-[hsl(var(--sv-cyan)/0.12)] text-[hsl(var(--sv-fg))]"
                        : "border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface-2))] text-[hsl(var(--sv-muted))]"
                    }`}
                  >
                    <span className="block font-medium">{pl.name}</span>
                    <span className="block text-sm">${pl.pricePoint}{pl.pricePoint !== "0" && "/mo"}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="mt-4 text-base text-[hsl(0_84%_68%)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="sv-grad-btn sv-glow mt-6 w-full rounded-full px-8 py-4 text-base font-semibold text-[hsl(228_49%_8%)] transition-all duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {sending ? "Sending…" : "Send"}
          </button>
          {emailSaved && (
            <button
              type="button"
              onClick={() => setSkipped(true)}
              className="mt-3 w-full text-center text-base text-[hsl(var(--sv-muted))] underline-offset-4 hover:text-[hsl(var(--sv-fg))] hover:underline"
            >
              Skip
            </button>
          )}
        </form>
      </>,
    );
  }

  return (
    <section data-section="signup_form" id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Create your searchable library">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        Make your archive searchable
      </h2>
      <p className="mt-3 text-center text-base text-[hsl(var(--sv-muted))]">
        Leave your email. We'll save you a spot.
      </p>

        <form
          onSubmit={onEmailSubmit}
          className="mt-8 rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-6 shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-8"
        >
          <label htmlFor="sv-email" className="mb-2 block text-base font-medium">
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface-2))] px-4">
            <Mail className="h-4 w-4 shrink-0 text-[hsl(var(--sv-muted))]" aria-hidden />
            <input
              id="sv-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent py-3.5 text-base outline-none placeholder:text-[hsl(var(--sv-muted))]"
            />
          </div>
          <p className="mt-2 text-base text-[hsl(var(--sv-muted))]">
            We'll only use your email to contact you about HearSeek access.
          </p>

          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="sv-gotcha">Leave this field empty</label>
            <input
              id="sv-gotcha"
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={gotcha}
              onChange={(e) => setGotcha(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 text-base text-[hsl(0_84%_68%)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="sv-grad-btn sv-glow mt-6 w-full rounded-full px-8 py-4 text-base font-semibold text-[hsl(228_49%_8%)] transition-all duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {sending ? "Saving…" : "Continue"}
          </button>
          <p className="mt-3 text-center text-xs text-[hsl(var(--sv-muted))]">
            Try for free up to 3 hours of video.
          </p>
        </form>
    </section>
  );
}
