import { useEffect } from "react";
import { hs, type Persona } from "@/lib/persona-analytics";

// Engagement events for the persona landing pages. Every event fires at most
// once per page load and carries only the shared hs() params plus one number
// or section name — never any user input.
const SCROLL_DEPTHS = [25, 50, 75, 90];
const ENGAGED_SECONDS = [5, 10, 30, 60, 120];

export function useEngagementTracking(persona?: Persona) {
  useEffect(() => {
    // Scroll depth
    const firedDepths = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight;
      if (total <= 0) return;
      const pct = ((window.scrollY + window.innerHeight) / total) * 100;
      for (const d of SCROLL_DEPTHS) {
        if (pct >= d && !firedDepths.has(d)) {
          firedDepths.add(d);
          hs("hs_scroll", { depth: d }, persona);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Visible engaged time (paused while the tab is hidden)
    let visibleMs = 0;
    let last = document.visibilityState === "visible" ? Date.now() : null;
    const firedSeconds = new Set<number>();
    const tick = () => {
      if (last !== null) {
        const now = Date.now();
        visibleMs += now - last;
        last = now;
      }
      for (const s of ENGAGED_SECONDS) {
        if (visibleMs >= s * 1000 && !firedSeconds.has(s)) {
          firedSeconds.add(s);
          hs("hs_engaged_time", { seconds: s }, persona);
        }
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        last = Date.now();
      } else {
        tick();
        last = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(tick, 1000);

    // Section views (and demo view) at >= 50% visibility
    const firedSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
          const section = (entry.target as HTMLElement).dataset.section;
          if (!section || firedSections.has(section)) continue;
          firedSections.add(section);
          hs("hs_section_view", { section }, persona);
          if (section === "demo") hs("hs_demo_view", {}, persona);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, [persona]);
}
