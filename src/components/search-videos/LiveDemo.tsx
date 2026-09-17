import { useEffect, useRef } from "react";
import { hs } from "@/lib/persona-analytics";

const DEMO_EVENT_KEY = "hs_demo_interact_video_demo_fired";

export function LiveDemo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    try {
      firedRef.current = sessionStorage.getItem(DEMO_EVENT_KEY) === "true";
    } catch {
      // The in-memory guard still prevents duplicate events during this mount.
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || firedRef.current) return;
        firedRef.current = true;
        try {
          sessionStorage.setItem(DEMO_EVENT_KEY, "true");
        } catch {
          // Tracking still works when session storage is unavailable.
        }
        hs("hs_demo_interact", {
          demo_query_text: "video_demo",
          demo_result_clicked: false,
        });
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32"
      aria-label="HearSeek search demo"
    >
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-bg))] shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)]">
        <iframe
          src="/demos/hearseek-search-animation.html"
          title="HearSeek animated search demo"
          className="pointer-events-none block h-full w-full border-0"
          loading="lazy"
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <p className="mt-8 text-center text-sm text-[hsl(var(--sv-muted))]">
        Search by meaning. Land on the exact moment it was said.
      </p>
    </section>
  );
}
