import { pageExtras } from "@/lib/persona-analytics";
// All website lead capture goes through POST {API base}/marketing/leads.
// The endpoint is one config value (VITE_HEARSEEK_API_BASE) so moving hosts
// is a one-line change. Never log payloads: they contain emails and URLs.

const API_BASE =
  (import.meta.env.VITE_HEARSEEK_API_BASE as string | undefined) ??
  "https://django-public.taile5bf31.ts.net/api";
export const LEADS_ENDPOINT = `${API_BASE}/marketing/leads`;

const TIMEOUT_MS = 8000;
const PERSONA_PATHS = ["/search-videos", "/search-interviews", "/search-raw", "/search-lectures"];

// Read-only view of the visitor's analytics consent (saved choice wins,
// otherwise the page default). Does not change consent.
export function currentConsent(): boolean {
  try {
    const raw = window.localStorage.getItem("hs_consent_v1");
    if (raw) return !!JSON.parse(raw)?.analytics;
  } catch {
    /* ignore */
  }
  return PERSONA_PATHS.includes(window.location.pathname);
}

export type LeadType = "consumer" | "enterprise" | "persona";

export type LeadBody = {
  form_type: LeadType;
  email: string;
  consumer?: { records: string[] } & Record<string, unknown>;
  enterprise?: { name?: string | null; company?: string | null; message?: string | null };
  persona?: Record<string, unknown>;
  [k: string]: unknown;
};

async function postOnce(body: unknown) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // 409 = duplicate email for this form type; treated as success.
    if (res.status !== 200 && res.status !== 409) throw new Error(`status ${res.status}`);
  } finally {
    clearTimeout(t);
  }
}

/** Sends one lead. Retries anything other than 200/409 with backoff. */
export async function submitLead(
  lead: LeadBody,
  opts: { delays?: number[] } = {},
): Promise<boolean> {
  const body = {
    acq_source: null,
    page_path: window.location.pathname,
    host: window.location.host,
    submitted_at: new Date().toISOString(),
    consent: currentConsent(),
    _gotcha: "",
    ...lead,
  };
  const delays = opts.delays ?? [1000, 3000];
  for (let i = 0; i <= delays.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, delays[i - 1]));
    try {
      await postOnce(body);
      return true;
    } catch {
      /* try again */
    }
  }
  return false;
}

// ---- Persona pages (two stages per session) ---------------------------------

export type SignupStage = "email" | "checkout_attempt";

export type SignupPayload = {
  email: string;
  pasted_url: string;
  input_type: string;
  persona: string;
  page_persona: string;
  plan: string;
  price_point: string;
  plan_chosen_by?: string;
  usecases: string;
  size_band: string;
  session_id: string;
  variant: string;
  acq_source: string;
  stage: SignupStage;
  submitted_at: string;
  page_path: string;
  host: string;
  _gotcha: string;
  hero_variant?: string;
};

const sentMemory = new Set<string>();
const key = (sessionId: string, stage: SignupStage) => `hs_signup_sent_${stage}_${sessionId}`;

export function alreadySent(sessionId: string, stage: SignupStage): boolean {
  if (sentMemory.has(key(sessionId, stage))) return true;
  try {
    return window.sessionStorage.getItem(key(sessionId, stage)) === "1";
  } catch {
    return false;
  }
}

function markSent(sessionId: string, stage: SignupStage) {
  sentMemory.add(key(sessionId, stage));
  try {
    window.sessionStorage.setItem(key(sessionId, stage), "1");
  } catch {
    /* ignore */
  }
}

export async function submitSignup(
  payload: SignupPayload,
  opts: { delays?: number[] } = {},
): Promise<boolean> {
  if (alreadySent(payload.session_id, payload.stage)) return true;
  const { email, acq_source, page_path, host, submitted_at, _gotcha, ...persona } = payload;
  const ok = await submitLead(
    {
      form_type: "persona",
      email,
      acq_source,
      page_path,
      host,
      submitted_at,
      _gotcha,
      persona: { ...persona, ...pageExtras },
    },
    opts,
  );
  if (ok) markSent(payload.session_id, payload.stage);
  return ok;
}
