import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://hearseek.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/app", changefreq: "weekly", priority: "0.8" },
  { path: "/enterprise", changefreq: "weekly", priority: "0.8" },
  { path: "/creators", changefreq: "weekly", priority: "0.8" },
  { path: "/demo", changefreq: "weekly", priority: "0.8" },
  { path: "/results", changefreq: "weekly", priority: "0.6" },
];

const COLLECTION_KEYS = [
  "iis",
  "diary-of-a-ceo",
  "huberman-lab",
  "lex-fridman",
  "chris-williamson",
  "tom-bilyeu",
  "ted",
  "dhruv-rathee",
  "think-school",
  "beer-biceps",
  "raftar",
];

const COLLECTION_ENTRIES: SitemapEntry[] = COLLECTION_KEYS.flatMap((key) => [
  { path: `/collections/${key}`, changefreq: "weekly", priority: "0.7" },
  { path: `/collections/${key}/results`, changefreq: "weekly", priority: "0.6" },
]);

const entries: SitemapEntry[] = [...STATIC_ROUTES, ...COLLECTION_ENTRIES];

function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
