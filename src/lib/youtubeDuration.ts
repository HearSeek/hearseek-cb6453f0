// Fetches true video durations from the YouTube Data API v3.
// Requires VITE_YOUTUBE_API_KEY in .env. Without it, returns {} silently
// so the UI can fall back to no badge.

const API_KEY = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined) ?? "";
const ENDPOINT = "https://www.googleapis.com/youtube/v3/videos";

const cache = new Map<string, number>();
const inflight = new Map<string, Promise<void>>();

const titleCache = new Map<string, string>();
const titleInflight = new Map<string, Promise<void>>();

const fetchTitleFromOembed = async (id: string): Promise<string | null> => {
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json?.title === "string" ? json.title : null;
  } catch {
    return null;
  }
};

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

export const fetchVideoTitles = async (
  ids: string[],
): Promise<Record<string, string>> => {
  if (ids.length === 0) {
    const out: Record<string, string> = {};
    for (const id of ids) {
      const v = titleCache.get(id);
      if (v !== undefined) out[id] = v;
    }
    return out;
  }

  const unique = Array.from(new Set(ids));
  const missing = unique.filter((id) => !titleCache.has(id) && !titleInflight.has(id));

  if (missing.length > 0) {
    const batches = API_KEY ? chunk(missing, 50) : missing.map((id) => [id]);
    for (const batch of batches) {
      const p = (async () => {
        try {
          if (!API_KEY) {
            await Promise.all(
              batch.map(async (id) => {
                const title = await fetchTitleFromOembed(id);
                if (title) titleCache.set(id, title);
              }),
            );
            return;
          }
          const url = `${ENDPOINT}?part=snippet&id=${batch.join(",")}&key=${API_KEY}`;
          const res = await fetch(url);
          if (!res.ok) return;
          const json = await res.json();
          const items = Array.isArray(json?.items) ? json.items : [];
          for (const item of items) {
            const id = item?.id as string | undefined;
            const title = item?.snippet?.title as string | undefined;
            if (id && title) titleCache.set(id, title);
          }
        } catch {
          // silent
        }
      })();
      for (const id of batch) titleInflight.set(id, p);
      await p;
      for (const id of batch) titleInflight.delete(id);
    }
  } else {
    await Promise.all(unique.map((id) => titleInflight.get(id)).filter(Boolean));
  }

  const out: Record<string, string> = {};
  for (const id of unique) {
    const v = titleCache.get(id);
    if (v !== undefined) out[id] = v;
  }
  return out;
};