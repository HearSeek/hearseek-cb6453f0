// Persona-page analytics for the persona landing pages.
// Front-end only: pushes to window.dataLayer (picked up by the site-wide GTM
// container). No data is sent anywhere else from this module.

export type Persona = "creator" | "research" | "editor" | "educator";

export const PERSONA: Persona = "creator";
export const VARIANT = "subscription";

// Capture UTM + a session identifier once, at module load.
const params = new URLSearchParams(window.location.search);
export const ACQ_SOURCE =
  [params.get("utm_source"), params.get("utm_medium")]
    .filter(Boolean)
    .join("/") || "direct";
export const SESSION_ID =
  window.crypto?.randomUUID?.() || String(Date.now());

export function hs(
  event: string,
  extra: Record<string, unknown> = {},
  persona: Persona = PERSONA,
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    persona,
    variant: VARIANT,
    acq_source: ACQ_SOURCE,
    session_id: SESSION_ID,
    page_persona: persona,
    ...extra,
  });
}

// Classify a pasted YouTube / playlist / channel link.
export function inferInputType(
  raw: string,
): "url" | "playlist" | "channel" {
  const u = raw.toLowerCase();
  if (u.includes("list=") || u.includes("playlist")) return "playlist";
  if (
    u.includes("@") ||
    u.includes("/channel/") ||
    u.includes("/c/") ||
    u.includes("/user/")
  ) {
    return "channel";
  }
  return "url";
}
