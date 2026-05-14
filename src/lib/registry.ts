// Collection registry. Add new collections here to spin up a /collections/:slug
// page and a scoped results page automatically.
//
// configSlug should match the HearSeek search-config slug for that collection's
// indexed payload. featuredVideoIds are YouTube IDs shown on the collection
// landing page. tier drives the badge & label across the UI.

export type CollectionTier = "flagship" | "featured-deep-index";

export type Collection = {
  key: string;
  name: string;
  shortName: string;
  tagline: string;
  configSlug: string;
  configName: string;
  tier: CollectionTier;
  /** Display string for the badge — e.g. "30+ Episodes Indexed" or "Full Archive" */
  episodeCount: string;
  /** Optional baseline Qdrant `must` clauses ANDed onto every search request. */
  baseFilter?: Record<string, unknown>[];
  disclaimer: string;
  suggestions: string[];
  featuredVideoIds: string[];
  logo?: string;
  /** Per-side inset % to inset the logo within its frame (e.g. 5 = 10% total padding). */
  logoPadding?: number;
};

import iisLogo from "@/assets/collections/iis.png";
import doacLogo from "@/assets/collections/diary-of-a-ceo.png";
import hubermanLogo from "@/assets/collections/huberman-lab.png";
import lexLogo from "@/assets/collections/lex-fridman.png";
import chrisLogo from "@/assets/collections/chris-williamson.png";
import tomBilyeuLogo from "@/assets/collections/tom-bilyeu.png";
import tedLogo from "@/assets/collections/ted.png";
import dhruvLogo from "@/assets/collections/dhruv-rathee.png";
import thinkSchoolLogo from "@/assets/collections/think-school.png";
import beerBicepsLogo from "@/assets/collections/beer-biceps.png";
import raftarLogo from "@/assets/collections/raftar.png";

const TIER_LABEL: Record<CollectionTier, string> = {
  flagship: "Flagship Philosophical Archive",
  "featured-deep-index": "Featured Deep-Index",
};

export const tierLabel = (tier: CollectionTier) => TIER_LABEL[tier];

const sharedDeepIndexDisclaimer =
  "This collection searches a curated 30-video sample from the channel. It does not search the wider web.";

const sharedDeepIndexSuggestions = [
  "The most surprising insight from a recent episode",
  "Advice for someone in their twenties",
  "Discussion on focus and discipline",
];

// TODO confirm channel slug values against the actual `source_info.channel`
// payload field once the deep-index ingest lands.
const featuredDeepIndex = (
  key: string,
  name: string,
  shortName: string,
  channelSlug: string,
  logo: string,
  tagline: string,
): Collection => ({
  key,
  name,
  shortName,
  tagline,
  configSlug: "podcasts",
  configName: name,
  tier: "featured-deep-index",
  episodeCount: "30+ Episodes Indexed",
  baseFilter: [{ key: "source_info.channel", match: { value: channelSlug } }],
  disclaimer: sharedDeepIndexDisclaimer,
  suggestions: sharedDeepIndexSuggestions,
  featuredVideoIds: [],
  logo,
});

export const COLLECTIONS: Record<string, Collection> = {
  iis: {
    key: "iis",
    name: "International Iqbal Society",
    shortName: "IIS",
    tagline:
      "Search decades of philosophical lectures from the International Iqbal Society — by meaning, not just keywords.",
    configSlug: "iis",
    configName: "IIS Lectures",
    tier: "flagship",
    episodeCount: "Full Archive",
    disclaimer:
      "This collection searches the International Iqbal Society's full lecture archive. It does not search the wider web.",
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
    logoPadding: 5,
  },
  "diary-of-a-ceo": {
    key: "diary-of-a-ceo",
    name: "The Diary of A CEO by Steven Bartlett",
    shortName: "Diary of A CEO",
    tagline:
      "Search a 30-episode deep-index of Steven Bartlett's Diary of A CEO — find the exact moment any guest said what you're looking for.",
    configSlug: "podcasts",
    configName: "Diary of A CEO",
    tier: "featured-deep-index",
    episodeCount: "30+ Episodes Indexed",
    baseFilter: [
      { key: "source_info.channel", match: { value: "diary_of_a_ceo" } },
    ],
    disclaimer:
      "This collection searches a curated 30-episode sample of Diary of A CEO. It does not search the wider web.",
    suggestions: [
      "Why does Andrew Bustamante suggest leaving the USA by 2030?",
      "What is the missing vitamin that is compared to smoking?",
      "The specific moment the 'Godfather of AI' warns about human extinction.",
      "How does stress leak through the skin and cause belly fat?",
      "The step-by-step playbook to quit a 9-to-5 in 9 months.",
      "How does AI create 'hell' before it creates 'heaven'?",
    ],
    featuredVideoIds: [
      "JCTb3QSrGMQ",
      "QVVe2rCHtN0",
      "S9a1nLw70p0",
      "giT0ytynSqg",
      "hCW2NHbWNwA",
      "qgeQ5kMVwRA",
    ],
    logo: doacLogo,
  },
  "huberman-lab": featuredDeepIndex(
    "huberman-lab",
    "Huberman Lab",
    "Huberman Lab",
    "huberman_lab",
    hubermanLogo,
    "Search a 30-episode deep-index of Huberman Lab — find the exact protocol, study, or insight you remember.",
  ),
  "lex-fridman": featuredDeepIndex(
    "lex-fridman",
    "Lex Fridman Podcast",
    "Lex Fridman",
    "lex_fridman",
    lexLogo,
    "Search a 30-episode deep-index of the Lex Fridman Podcast — surface any conversation by meaning.",
  ),
  "chris-williamson": featuredDeepIndex(
    "chris-williamson",
    "Chris Williamson · Modern Wisdom",
    "Modern Wisdom",
    "chris_williamson",
    chrisLogo,
    "Search a 30-episode deep-index of Modern Wisdom with Chris Williamson — find the exact idea you're chasing.",
  ),
  "tom-bilyeu": featuredDeepIndex(
    "tom-bilyeu",
    "Tom Bilyeu · Impact Theory",
    "Tom Bilyeu",
    "tom_bilyeu",
    tomBilyeuLogo,
    "Search a 30-episode deep-index of Tom Bilyeu's Impact Theory — find the mindset shift in seconds.",
  ),
  ted: featuredDeepIndex(
    "ted",
    "TED",
    "TED",
    "ted",
    tedLogo,
    "Search a 30-talk deep-index from TED — jump to the exact moment an idea worth spreading lands.",
  ),
  "dhruv-rathee": featuredDeepIndex(
    "dhruv-rathee",
    "Dhruv Rathee",
    "Dhruv Rathee",
    "dhruv_rathee",
    dhruvLogo,
    "Search a 30-video deep-index of Dhruv Rathee — find any explainer moment by meaning, in any language.",
  ),
  "think-school": featuredDeepIndex(
    "think-school",
    "Think School",
    "Think School",
    "think_school",
    thinkSchoolLogo,
    "Search a 30-video deep-index of Think School — find the exact business case study or framework.",
  ),
  "beer-biceps": featuredDeepIndex(
    "beer-biceps",
    "BeerBiceps · Ranveer Allahbadia",
    "BeerBiceps",
    "beer_biceps",
    beerBicepsLogo,
    "Search a 30-episode deep-index of BeerBiceps — find any conversation by meaning.",
  ),
  raftar: featuredDeepIndex(
    "raftar",
    "Raftar",
    "Raftar",
    "raftar",
    raftarLogo,
    "Search a 30-video deep-index of Raftar — surface the exact moment by meaning.",
  ),
};

export const getCollection = (slug: string | undefined): Collection | null => {
  if (!slug) return null;
  return COLLECTIONS[slug] ?? null;
};

export const ALL_COLLECTIONS: Collection[] = Object.values(COLLECTIONS);