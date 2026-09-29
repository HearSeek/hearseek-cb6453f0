import { useRef, useState, type FormEvent } from "react";
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

// Fire the submit analytics only once per session, even across retries.
const eventsFiredMemory = new Set<string>();
const eventsKey = () => `hs_signup_events_fired_${SESSION_ID}`;
function submitEventsFired(): boolean {
  if (eventsFiredMemory.has(eventsKey())) return true;
  try {
    return window.sessionStorage.getItem(eventsKey()) === "1";
  } catch {
    return false;
  }
}
function markSubmitEventsFired() {
  eventsFiredMemory.add(eventsKey());
  try {
    window.sessionStorage.setItem(eventsKey(), "1");
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
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const urlSubmitFired = useRef<string | null>(null);

  // "Submitted / pasted" — classify the URL as soon as it's pasted in.
  const onUrlPaste = () => {
    const value = url.trim();
    if (!value) return;
    if (urlSubmitFired.current === value) return;
    urlSubmitFired.current = value;
    hs("hs_url_submit", { input_type: inferInputType(value) }, persona);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmedUrl = url.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUrl) {
      setError("Paste your YouTube, playlist, or video link to continue.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);

    const selected = PLANS.find((p) => p.id === plan);
    const p = persona ?? PERSONA;

    if (!submitEventsFired()) {
      markSubmitEventsFired();
      if (urlSubmitFired.current !== trimmedUrl) {
        urlSubmitFired.current = trimmedUrl;
        hs("hs_url_submit", { input_type: inferInputType(trimmedUrl) }, persona);
      }
      hs("hs_email_submit", {}, persona);
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
      email: trimmedEmail,
      pasted_url: trimmedUrl,
      input_type: inferInputType(trimmedUrl),
      persona: p,
      page_persona: p,
      plan: plan ?? "",
      price_point: selected?.pricePoint ?? "",
      usecases: usecases.join(" | "),
      size_band: sizeBand ?? "",
      session_id: SESSION_ID,
      variant: VARIANT,
      acq_source: ACQ_SOURCE,
      stage: "checkout_attempt",
      submitted_at: new Date().toISOString(),
      page_path: window.location.pathname,
      host: window.location.host,
      _subject: `HearSeek signup: ${p}, ${plan || "no plan"}`,
      _gotcha: "",
    });
    setSending(false);
    if (ok) setSubmitted(true);
    else setError("Something went wrong saving your details. Please try again.");
  };

  if (submitted) {
    return (
      <section id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Onboarding">
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
    <section id="sv-onboarding" className="mx-auto w-full max-w-2xl px-6 pb-24 md:pb-32 scroll-mt-8" aria-label="Create your searchable library">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        Make your archive searchable
      </h2>
      <p className="mt-3 text-center text-sm text-[hsl(var(--sv-muted))]">
        Paste a link. We'll take it from there.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-3xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-6 shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)] md:p-8"
      >
        <label htmlFor="sv-url" className="mb-2 block text-sm font-medium">
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
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[hsl(var(--sv-muted))]"
          />
        </div>

        <label htmlFor="sv-email" className="mb-2 mt-5 block text-sm font-medium">
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
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[hsl(var(--sv-muted))]"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[hsl(0_84%_68%)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="sv-grad-btn sv-glow mt-6 w-full rounded-full px-8 py-4 text-base font-semibold text-[hsl(228_49%_8%)] transition-all duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
        >
          {ctaLabel}
        </button>
        <p className="mt-3 text-center text-xs text-[hsl(var(--sv-muted))]">
          Try for free up to 3 hours of video.
        </p>
      </form>
    </section>
  );
}
