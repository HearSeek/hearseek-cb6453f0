// Pre-renders a static index.html per collection route so social-media
// crawlers (WhatsApp, iMessage, LinkedIn, X, Slack, Facebook) — which do
// NOT execute JavaScript — see the correct <title>, <meta description>,
// og:image, and twitter:image for each collection link. Without this,
// Helmet's client-side tag injection is invisible to them and every link
// shares the same default preview.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const SITE = "https://www.hearseek.com";

type Meta = {
  key: string;
  title: string;
  description: string;
};

// Parse registry for shortName + tagline of every collection.
const REG = readFileSync(resolve("src/lib/registry.ts"), "utf8");

const collections: Meta[] = [];

// featuredDeepIndex(key, name, shortName, channelId, logo, tagline, ...)
const deepRe = /featuredDeepIndex\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",[^,]+,[^,]+,\s*"([^"]+)"/g;
let m: RegExpExecArray | null;
while ((m = deepRe.exec(REG))) {
  collections.push({ key: m[1], title: m[3], description: m[4] });
}

// Explicit entries (not created via featuredDeepIndex).
const EXPLICIT: Meta[] = [
  {
    key: "iis",
    title: "International Iqbal Society",
    description:
      "Search decades of philosophical lectures from the International Iqbal Society — by meaning, not just keywords, in any language.",
  },
  {
    key: "diary-of-a-ceo",
    title: "Diary of A CEO",
    description:
      "Search a 30-episode deep-index of Steven Bartlett's Diary of A CEO — find the exact moment any guest said what you're looking for.",
  },
];
for (const e of EXPLICIT) {
  if (!collections.some((c) => c.key === e.key)) collections.push(e);
}

if (collections.length < 11) {
  console.warn(`Only parsed ${collections.length} collections; expected 11.`);
}

const template = readFileSync(resolve("index.html"), "utf8");

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function renderHtml(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
}) {
  const { title, description, url, image } = opts;
  let html = template;
  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  // Replace meta description
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${esc(description)}">`,
  );
  // Replace og/twitter title/description/image + inject canonical + og:url
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${esc(title)}">`,
  );
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${esc(title)}">`,
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${esc(description)}">`,
  );
  html = html.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${esc(description)}">`,
  );
  html = html.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${esc(image)}">\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">\n    <meta property="og:url" content="${esc(url)}">\n    <link rel="canonical" href="${esc(url)}">`,
  );
  html = html.replace(
    /<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${esc(image)}">`,
  );
  // Strip the site-wide canonical + og:url that index.html carries, since we
  // just injected route-specific ones above.
  html = html.replace(/\n\s*<meta property="og:url"[^>]*>/g, "");
  html = html.replace(/\n\s*<link rel="canonical"[^>]*>/g, "");
  // Re-add the route-specific pair (removed by the strip above since it
  // matched them too).
  html = html.replace(
    /<meta property="og:image:height"[^>]*>/,
    `<meta property="og:image:height" content="630">\n    <meta property="og:url" content="${esc(url)}">\n    <link rel="canonical" href="${esc(url)}">`,
  );
  return html;
}

function writeAt(path: string, contents: string) {
  const abs = resolve(path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contents);
}

let count = 0;
for (const c of collections) {
  const image = `${SITE}/og/${c.key}.png`;
  const url = `${SITE}/collections/${c.key}`;
  const html = renderHtml({
    title: `${c.title} — Search the Archive on HearSeek`,
    description: c.description,
    url,
    image,
  });
  writeAt(`public/collections/${c.key}/index.html`, html);
  writeAt(
    `public/collections/${c.key}/results/index.html`,
    renderHtml({
      title: `${c.title} — Results on HearSeek`,
      description: c.description,
      url: `${SITE}/collections/${c.key}/results`,
      image,
    }),
  );
  count += 2;
}

console.log(`generated ${count} collection HTML files under public/collections/`);