// Lightweight dataLayer wrapper for GTM → Stape sGTM.
// All app events flow through window.dataLayer; GTM forwards them to the
// server-side container, which then dispatches to GA4, Meta CAPI, etc.

type EventParams = Record<string, string | number | boolean | undefined>;

export type AnalyticsEvent =
  | "page_view"
  | "waitlist_signup"
  | "demo_search"
  | "outbound_click"
  | "collection_view"
  | "collection_search";

export const trackEvent = (event: AnalyticsEvent, params: EventParams = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

export const updateConsent = (granted: {
  analytics: boolean;
  ads: boolean;
}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: granted.analytics ? "granted" : "denied",
      ad_storage: granted.ads ? "granted" : "denied",
      ad_user_data: granted.ads ? "granted" : "denied",
      ad_personalization: granted.ads ? "granted" : "denied",
    },
  ]);
  // Also fire as gtag-style call if present (Consent Mode v2)
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      analytics_storage: granted.analytics ? "granted" : "denied",
      ad_storage: granted.ads ? "granted" : "denied",
      ad_user_data: granted.ads ? "granted" : "denied",
      ad_personalization: granted.ads ? "granted" : "denied",
    });
  }
};
