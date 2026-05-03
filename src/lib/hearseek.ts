// HearSeek API client — enterprise mode
// NOTE: VITE_HEARSEEK_DEMO_KEY is a public demo key, intentionally exposed in
// the frontend bundle. Do not put a production-grade enterprise key here.

const API_BASE = "https://server.hearseek.com/api";
const DEMO_KEY = (import.meta.env.VITE_HEARSEEK_DEMO_KEY as string | undefined) ?? "";

const CONFIGS_CACHE_KEY = "hearseek:search_configs:v2";
const CONFIGS_TTL_MS = 5 * 60 * 1000; // 5 minutes

export type SearchConfig = { name: string; slug: string };

export type SearchHit = {
  id: string;
  score: number;
  rank: number | null;
  source: string | null;
  pre: string;
  main: string;
  post: string;
  start: number;
  end: number;
  videoId: string | null;
  youtubeUrl: string | null;
  timestampedUrl: string | null;
  channel: string | null;
  language: string | null;
  title: string | null;
};

let configsMemoryCache: { at: number; data: SearchConfig[] } | null = null;

const readSessionCache = (): { at: number; data: SearchConfig[] } | null => {
  try {
    const raw = sessionStorage.getItem(CONFIGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.at === "number" && Array.isArray(parsed?.data)) return parsed;
    return null;
  } catch {
    return null;
  }
};

const writeSessionCache = (entry: { at: number; data: SearchConfig[] }) => {
  try {
    sessionStorage.setItem(CONFIGS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // ignore quota / privacy errors
  }
};

const normalizeConfigs = (raw: unknown): SearchConfig[] => {
  if (!Array.isArray(raw)) return [];
  const out: SearchConfig[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : null;
    const slug = typeof obj.slug === "string" ? obj.slug : null;
    if (name && slug) out.push({ name, slug });
  }
  return out;
};

export const getSearchConfigurations = async (force = false): Promise<SearchConfig[]> => {
  const now = Date.now();
  if (!force) {
    if (configsMemoryCache && now - configsMemoryCache.at < CONFIGS_TTL_MS) {
      return configsMemoryCache.data;
    }
    const session = readSessionCache();
    if (session && now - session.at < CONFIGS_TTL_MS) {
      configsMemoryCache = session;
      return session.data;
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    if (!DEMO_KEY) {
      throw new Error("Missing VITE_HEARSEEK_DEMO_KEY");
    }
    const res = await fetch(`${API_BASE}/enterprise/search_configurations`, {
      headers: { "X-Company-Key": DEMO_KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = normalizeConfigs(json);
    if (data.length === 0) throw new Error("Empty configurations");
    const entry = { at: now, data };
    configsMemoryCache = entry;
    writeSessionCache(entry);
    return data;
  } finally {
    clearTimeout(timeout);
  }
};

export const extractYoutubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    return null;
  } catch {
    return null;
  }
};

export const youtubeThumbnail = (videoId: string): string =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export const formatTimestamp = (totalSeconds: number): string => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};

const CHANNEL_NAMES: Record<string, string> = {
  cnn: "CNN",
  fox: "Fox News",
  foxnews: "Fox News",
  msnbc: "MSNBC",
  bbc: "BBC",
  sky: "Sky News",
  skynews: "Sky News",
  nbc: "NBC News",
  abc: "ABC News",
  cbs: "CBS News",
  aljazeera: "Al Jazeera",
  samaa: "Samaa TV",
  geo: "Geo News",
  ary: "ARY News",
  dawn: "Dawn News",
  reuters: "Reuters",
  ap: "Associated Press",
  npr: "NPR",
  pbs: "PBS NewsHour",
  c4: "Channel 4 News",
  itv: "ITV News",
};

export const prettifyChannel = (code: string | null | undefined): string => {
  if (!code) return "Unknown";
  const key = code.toLowerCase().trim();
  if (CHANNEL_NAMES[key]) return CHANNEL_NAMES[key];
  // Generic fallback: replace underscores/hyphens/dots with spaces, collapse
  // whitespace, then title-case each word. Handles things like
  // "DIARY_OF_A_CEO" → "Diary Of A Ceo", "the-daily" → "The Daily".
  const cleaned = code
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Unknown";
  return cleaned
    .split(" ")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
};

const normalizeHit = (raw: unknown): SearchHit | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const payload = (r.payload as Record<string, unknown>) ?? {};
  const segment = (payload.segment as Record<string, unknown>) ?? {};
  const sourceInfo = (payload.source_info as Record<string, unknown>) ?? {};

  const youtubeUrl = typeof sourceInfo.url === "string" ? sourceInfo.url : null;
  const timestampedUrl =
    typeof segment.timestamped_url === "string" ? segment.timestamped_url : null;
  const videoId = extractYoutubeId(youtubeUrl ?? timestampedUrl);

  return {
    id: typeof r.id === "string" ? r.id : crypto.randomUUID(),
    score: typeof r.score === "number" ? r.score : 0,
    rank: typeof r.rank === "number" ? r.rank : null,
    source: typeof r.source === "string" ? r.source : null,
    pre: typeof segment.pre === "string" ? segment.pre : "",
    main: typeof segment.main === "string" ? segment.main : "",
    post: typeof segment.post === "string" ? segment.post : "",
    start: typeof segment.start === "number" ? segment.start : 0,
    end: typeof segment.end === "number" ? segment.end : 0,
    videoId,
    youtubeUrl,
    timestampedUrl,
    channel: typeof sourceInfo.channel === "string" ? sourceInfo.channel : null,
    language: typeof sourceInfo.language === "string" ? sourceInfo.language : null,
    title: typeof sourceInfo.title === "string" ? sourceInfo.title : null,
  };
};

export type SearchResponse = {
  query: string;
  numHits: number;
  hits: SearchHit[];
};

export const runSearch = async (
  query: string,
  configSlug: string,
  signal?: AbortSignal,
): Promise<SearchResponse> => {
  if (!DEMO_KEY) {
    throw new Error(
      "Missing VITE_HEARSEEK_DEMO_KEY. Add it to .env (see plan).",
    );
  }
  const res = await fetch(`${API_BASE}/search/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Company-Key": DEMO_KEY,
      "X-Search-Config": configSlug,
    },
    body: JSON.stringify({ texts: query }),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Search failed [${res.status}]: ${text || res.statusText}`);
  }
  const json = await res.json();
  const results = (json?.results ?? {}) as Record<string, unknown>;
  const rawHits = Array.isArray(results.hits) ? results.hits : [];
  const hits = rawHits.map(normalizeHit).filter((h): h is SearchHit => h !== null);
  return {
    query: typeof results.query === "string" ? results.query : query,
    numHits: typeof results.num_hits === "number" ? results.num_hits : hits.length,
    hits,
  };
};

// Build a YouTube link that jumps to the exact second the hit starts.
export const buildJumpLink = (hit: SearchHit): string | null => {
  if (hit.timestampedUrl) return hit.timestampedUrl;
  if (hit.videoId) return `https://www.youtube.com/watch?v=${hit.videoId}&t=${hit.start}`;
  return hit.youtubeUrl;
};