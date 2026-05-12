// Pilot microsite registry. Add new pilots here to spin up a /pilots/:slug
// microsite and a scoped results page automatically.
//
// configSlug should match the HearSeek search-config slug for that pilot's
// indexed collection. featuredVideoIds are YouTube IDs shown on the pilot
// landing page. Update the placeholder values once the real ones are known.

export type Pilot = {
  key: string;
  name: string;
  shortName: string;
  tagline: string;
  configSlug: string;
  configName: string;
  // Optional baseline Qdrant `must` clauses ANDed onto every search request
  // for this pilot (e.g. lock to a specific source_info.channel value).
  baseFilter?: Record<string, unknown>[];
  disclaimer: string;
  suggestions: string[];
  featuredVideoIds: string[];
  logo?: string;
};

import iisLogo from "@/assets/pilot-iis-logo.png";
import doacLogo from "@/assets/pilot-doac-logo.png";

export const PILOTS: Record<string, Pilot> = {
  iis: {
    key: "iis",
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
    featuredVideoIds: [
      "7og2nxCw6nA",
      "B03pmu5NRas",
      "GvCEKOpeAS8",
      "OURC5LsW-Y0",
      "5QI3WUbm5Fw",
      "JvXlzN3k9YQ",
    ],
    logo: iisLogo,
  },
  "diary-of-a-ceo": {
    key: "diary-of-a-ceo",
    name: "The Diary of A CEO by Steven Bartlett",
    shortName: "Diary of A CEO",
    tagline:
      "Search every episode of Steven Bartlett's Diary of A CEO — find the exact moment any guest said what you're looking for.",
    configSlug: "podcasts",
    configName: "Podcasts",
    baseFilter: [
      { key: "source_info.channel", match: { value: "diary_of_a_ceo" } },
    ],
    disclaimer:
      "This microsite searches a curated set of Diary of A CEO episodes. It does not search the wider web.",
    suggestions: [
      "what makes successful founders different",
      "habits that built billion-dollar companies",
      "guest admits a personal failure",
      "advice on hiring the first employees",
      "how to build resilience under pressure",
    ],
    featuredVideoIds: ["dQw4w9WgXcQ", "5qap5aO4i9A", "9bZkp7q19f0"],
    logo: doacLogo,
  },
};

export const getPilot = (slug: string | undefined): Pilot | null => {
  if (!slug) return null;
  return PILOTS[slug] ?? null;
};

export const ALL_PILOTS: Pilot[] = Object.values(PILOTS);
