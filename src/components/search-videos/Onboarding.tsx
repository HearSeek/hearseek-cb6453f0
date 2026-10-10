import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Link2, Mail } from "lucide-react";
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
  ctaLabel = "Create my searchable library",
  persona,
  usecases = [],
  sizeBand = null,
}: {
  plan: PlanId;
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
  const [sending, setSending] = useState(false);

  const urlSubmitFired = useRef<string | null>(null);

  const p = persona ?? PERSONA;
  const selected = PLANS.find((pl) => pl.id === plan);

  const fireUrlSubmit = (value: string) => {
    if (!value || urlSubmitFired.current === value) return;
    urlSubmitFired.current = value;
    hs("hs_url_submit", { input_type: inferInputType(value) }, persona);
  };

  // "Submitted / pasted" — classify the URL as soon as it's pasted in.
  const onUrlPaste = () => fireUrlSubmit(url.trim());

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
  // visitor leaves before the checkout step.
  const onEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmedEmail = email.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);

    if (!eventFired("hs_email_submit")) {
      markEventFired("hs_email_submit");
      hs("hs_email_submit", {}, persona);
    }

    // Honeypot filled: pretend success, send nothing.
    if (gotcha) {
      setStep(2);
      return;
    }

    setSending(true);
    // A failed send must not block the visitor: the checkout step sends
    // everything again under its own stage.
    await submitSignup({
      ...basePayload(),
      email: trimmedEmail,
      pasted_url: "",
      input_type: "",
      plan: "",
      price_point: "",
      stage: "email",
      _subject: `HearSeek signup: ${p}, no plan`,
    });
    setSending(false);
    setStep(2);
  };

  // Step 2: link + plan, the simulated checkout attempt.
  const onCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmedUrl = url.trim();
    setError(null);

    if (!eventFired("hs_checkout_attempt")) {
      markEventFired("hs_checkout_attempt");
      fireUrlSubmit(trimmedUrl);
      hs("hs_checkout_attempt", {
        plan: plan,
        price_point: selected?.pricePoint ?? "0",
      }, persona);
    }

    // Honeypot filled: pretend success, send nothing.
    if (gotcha) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    const ok = await submitSignup({
      ...basePayload(),
      email: email.trim(),
      pasted_url: trimmedUrl,
      input_type: inferInputType(trimmedUrl),
      plan: plan ?? "",
      price_point: selected?.pricePoint ?? "",
      stage: "checkout_attempt",
      _subject: `HearSeek signup: ${p}, ${plan || "no plan"}`,
    });
    setSending(false);
    if (ok) setSubmitted(true);
    else setError("Something went wrong saving your details. Please try again.");
  };

  if (submitted) {
    return (
      <section data-section="signup_form" id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Onboarding">
        <div className="animate-fade-in-up rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-10 text-center shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-14">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--sv-cyan)/0.15)]">
            <CheckCircle2 className="h-7 w-7 text-[hsl(var(--sv-cyan))]" aria-hidden />
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            You're early.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[hsl(var(--sv-muted))]">
            We're opening the next batch shortly. We'll email you and give you
            your first 3 searchable hours free.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section data-section="signup_form" id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Create your searchable library">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        Make your archive searchable
      </h2>
      <p className="mt-3 text-center text-base text-[hsl(var(--sv-muted))]">
        {step === 1 ? "Leave your email. We'll save you a spot." : "Paste a link. We'll take it from there."}
      </p>

      {step === 1 ? (
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
            Continue
          </button>
          <p className="mt-3 text-center text-xs text-[hsl(var(--sv-muted))]">
            Try for free up to 3 hours of video.
          </p>
        </form>
      ) : (
        <form
          onSubmit={onCheckoutSubmit}
          className="mt-8 rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-6 shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-8"
        >
          <label htmlFor="sv-url" className="mb-2 block text-base font-medium">
            YouTube channel, playlist, or video URL
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface-2))] px-4">
            <Link2 className="h-4 w-4 shrink-0 text-[hsl(var(--sv-muted))]" aria-hidden />
            <input
              id="sv-url"
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={onUrlPaste}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full bg-transparent py-3.5 text-base outline-none placeholder:text-[hsl(var(--sv-muted))]"
            />
          </div>

          {selected && (
            <p className="mt-4 text-base text-[hsl(var(--sv-muted))]">
              Plan: <span className="font-medium text-[hsl(var(--sv-fg))]">{selected.name}</span>
              {selected.pricePoint !== "0" && (
                <> · ${selected.pricePoint}/month</> 
              )}
            </p>
          )}

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
            {ctaLabel}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm text-[hsl(var(--sv-muted))] transition-colors hover:text-[hsl(var(--sv-fg))]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back
          </button>
        </form>
      )}
    </section>
  );
}
