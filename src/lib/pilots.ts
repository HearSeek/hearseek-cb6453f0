// Pilot microsite registry. Add new pilots here to spin up a /pilots/:slug
// microsite and a scoped results page automatically.
//
// configSlug should match the HearSeek search-config slug for that pilot's
// indexed collection. featuredVideoIds are YouTube IDs shown on the pilot
// landing page. Update the placeholder values once the real ones are known.

export type Pilot = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  configSlug: string;
  configName: string;
  disclaimer: string;
  suggestions: string[];
  featuredVideoIds: string[];
};

export const PILOTS: Record<string, Pilot> = {
  iis: {
    slug: "iis",
    name: "International Iqbal Society",
    shortName: "IIS",
    tagline:
      "Search decades of philosophical lectures from the International Iqbal Society — by meaning, not just keywords.",
    configSlug: "iis",
    configName: "IIS Lectures",
    disclaimer:
      "This microsite searches the International Iqbal Society's lecture archive only. It does not search the wider web.",
    suggestions: [
      "Khudi and self-realization",
      "Iqbal on the concept of time",
      "Reconstruction of religious thought",
      "Rumi's influence on Iqbal",
      "Iqbal's vision for the Muslim world",
    ],
    featuredVideoIds: ["dQw4w9WgXcQ", "5qap5aO4i9A", "9bZkp7q19f0"],
  },
  "diary-of-the-ceo": {
    slug: "diary-of-the-ceo",
    name: "The Diary of the CEO by Steven Bartlett",
    shortName: "Diary of the CEO",
    tagline:
      "Search every episode of Steven Bartlett's Diary of the CEO — find the exact moment any guest said what you're looking for.",
    configSlug: "diary-of-the-ceo",
    configName: "Diary of the CEO",
    disclaimer:
      "This microsite searches a curated set of Diary of the CEO episodes. It does not search the wider web.",
    suggestions: [
      "what makes successful founders different",
      "habits that built billion-dollar companies",
      "guest admits a personal failure",
      "advice on hiring the first employees",
      "how to build resilience under pressure",
    ],
    featuredVideoIds: ["dQw4w9WgXcQ", "5qap5aO4i9A", "9bZkp7q19f0"],
  },
};

export const getPilot = (slug: string | undefined): Pilot | null => {
  if (!slug) return null;
  return PILOTS[slug] ?? null;
};

export const ALL_PILOTS: Pilot[] = Object.values(PILOTS);
