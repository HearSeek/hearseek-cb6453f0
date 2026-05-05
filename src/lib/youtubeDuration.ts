// Fetches true video durations from the YouTube Data API v3.
// Requires VITE_YOUTUBE_API_KEY in .env. Without it, returns {} silently
// so the UI can fall back to no badge.

const API_KEY = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined) ?? "";
const ENDPOINT = "https://www.googleapis.com/youtube/v3/videos";

const cache = new Map<string, number>();
const inflight = new Map<string, Promise<void>>();

// Parse ISO-8601 duration (e.g. "PT1H2M3S") into seconds.
const parseISO8601 = (iso: string): number => {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  const [, h, mi, s] = m;
  return (Number(h ?? 0) * 3600) + (Number(mi ?? 0) * 60) + Number(s ?? 0);
};

const chunk = <T,>(arr: T[], n: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

export const fetchVideoDurations = async (
  ids: string[],
): Promise<Record<string, number>> => {
  if (!API_KEY || ids.length === 0) {
    const out: Record<string, number> = {};
    for (const id of ids) {
      const v = cache.get(id);
      if (v !== undefined) out[id] = v;
    }
    return out;
  }

  const unique = Array.from(new Set(ids));
  const missing = unique.filter((id) => !cache.has(id) && !inflight.has(id));

  if (missing.length > 0) {
    const batches = chunk(missing, 50);
    for (const batch of batches) {
      const p = (async () => {
        try {
          const url = `${ENDPOINT}?part=contentDetails&id=${batch.join(",")}&key=${API_KEY}`;
          const res = await fetch(url);
          if (!res.ok) return;
          const json = await res.json();
          const items = Array.isArray(json?.items) ? json.items : [];
          for (const item of items) {
            const id = item?.id as string | undefined;
            const iso = item?.contentDetails?.duration as string | undefined;
            if (id && iso) cache.set(id, parseISO8601(iso));
          }
        } catch {
          // network/quota errors → silently skip; UI just hides badges
        }
      })();
      for (const id of batch) inflight.set(id, p);
      await p;
      for (const id of batch) inflight.delete(id);
    }
  } else {
    // Wait on any in-flight requests for these IDs
    await Promise.all(unique.map((id) => inflight.get(id)).filter(Boolean));
  }

  const out: Record<string, number> = {};
  for (const id of unique) {
    const v = cache.get(id);
    if (v !== undefined) out[id] = v;
  }
  return out;
};