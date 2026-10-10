import { pageExtras } from "@/lib/persona-analytics";
// Signup capture for the persona landing pages.
// Kept in one module so the destination can later move to the HearSeek API
// (VITE_HEARSEEK_API_BASE) or Basin without touching components.
// Never log payloads: they contain the visitor's email and pasted URL.

export type SignupStage = "email" | "checkout_attempt" | "app_waitlist";

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
  _subject: string;
  _gotcha: string;
  records?: string;
  hero_variant?: string;
};

const sentMemory = new Set<string>();
const key = (sessionId: string, stage: SignupStage) =>
  `hs_signup_sent_${stage}_${sessionId}`;

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

async function postOnce(endpoint: string, payload: SignupPayload) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload.stage === "app_waitlist" ? payload : { ...payload, ...pageExtras }),
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
}

// Notification email set in Formspree dashboard: inquiries@hearseek.com
export async function submitSignup(
  payload: SignupPayload,
  endpointOverride?: string,
  opts: { attempts?: number; delayMs?: number } = {},
): Promise<boolean> {
  if (alreadySent(payload.session_id, payload.stage)) return true;
  const endpoint =
    endpointOverride ?? (import.meta.env.VITE_SIGNUP_ENDPOINT as string | undefined);
  if (!endpoint) return false;
  const attempts = opts.attempts ?? 2;
  const delayMs = opts.delayMs ?? 1000;
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, delayMs));
    try {
      await postOnce(endpoint, payload);
      markSent(payload.session_id, payload.stage);
      return true;
    } catch {
      /* try again */
    }
  }
  return false; // not marked sent, so the visitor can retry
}
