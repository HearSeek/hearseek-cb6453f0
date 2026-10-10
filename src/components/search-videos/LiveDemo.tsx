import { useEffect, useRef, useState } from "react";
import { hs, type Persona } from "@/lib/persona-analytics";

const DEMO_EVENT_KEY = "hs_demo_interact_video_demo_fired";
const DEFAULT_VIDEO_ID = "rNsLTRTzGuk";

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
const PLAYER_STATE_ENDED = 0;

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

export function LiveDemo({
  persona,
  videoId = DEFAULT_VIDEO_ID,
  facade = false,
}: {
  persona?: Persona;
  videoId?: string;
  facade?: boolean;
}) {
  const [active, setActive] = useState(!facade);
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let player: { destroy?: () => void } | null = null;
    let completeFired = false;
    const eventKey = persona ? `${DEMO_EVENT_KEY}_${persona}` : DEMO_EVENT_KEY;

    try {
      firedRef.current = sessionStorage.getItem(eventKey) === "true";
    } catch {
      // The in-memory guard still prevents duplicate events during this mount.
    }

    const onFirstPlay = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try {
        sessionStorage.setItem(eventKey, "true");
      } catch {
        // Tracking still works when session storage is unavailable.
      }
      hs("hs_demo_interact", {
        demo_query_text: "video_demo",
        demo_result_clicked: false,
      }, persona);
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !playerHostRef.current) return;
      const Player = window.YT?.Player;
      if (!Player) return;
      player = new Player(playerHostRef.current, {
        videoId,
        playerVars: {
          host: "https://www.youtube-nocookie.com",
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          ...(facade ? { autoplay: 1 } : {}),
        },
        events: {
          onStateChange: (event) => {
            if (event.data === PLAYER_STATE_PLAYING) onFirstPlay();
            if (event.data === PLAYER_STATE_ENDED && !completeFired) {
              completeFired = true;
              hs("hs_demo_complete", {}, persona);
            }
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
  }, [persona, videoId, active, facade]);

  return (
    <section
      data-section="demo"
      className="relative mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32"
      aria-label="HearSeek search demo"
    >
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-bg))] shadow-[0_24px_60px_-24px_hsl(228_49%_4%/0.8)]">
        {active ? (
          <div ref={playerHostRef} className="h-full w-full" />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label="Play demo video"
            className="group relative h-full w-full"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-80"
            />
            <span className="sv-grad-btn absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[hsl(228_49%_8%)]" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-base text-[hsl(var(--sv-muted))]">
        Search by meaning. Land on the exact moment it was said.
      </p>
    </section>
  );
}
