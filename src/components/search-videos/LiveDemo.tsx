import { useEffect, useRef } from "react";
import { hs } from "@/lib/persona-analytics";

const DEMO_EVENT_KEY = "hs_demo_interact_video_demo_fired";
const VIDEO_ID = "rNsLTRTzGuk";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => unknown;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YT.PlayerState.PLAYING === 1; declared locally so we don't depend on the
// global script being loaded at module-evaluation time.
const PLAYER_STATE_PLAYING = 1;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      existing?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

export function LiveDemo() {
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let player: { destroy?: () => void } | null = null;

    try {
      firedRef.current = sessionStorage.getItem(DEMO_EVENT_KEY) === "true";
    } catch {
      // The in-memory guard still prevents duplicate events during this mount.
    }

    const onFirstPlay = () => {
      if (firedRef.current) return;
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
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !playerHostRef.current) return;
      player = new window.YT!.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === PLAYER_STATE_PLAYING) onFirstPlay();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        // Player may already be gone on unmount.
      }
    };
  }, []);

  return (
    <section
      className="relative mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32"
      aria-label="HearSeek search demo"
    >
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-bg))] shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)]">
        <div ref={playerHostRef} className="h-full w-full" />
      </div>

      <p className="mt-8 text-center text-sm text-[hsl(var(--sv-muted))]">
        Search by meaning. Land on the exact moment it was said.
      </p>
    </section>
  );
}
