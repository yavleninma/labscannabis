import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");
const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];
const HREFLANGS = {
  en: "en",
  ru: "ru",
  th: "th",
  ar: "ar",
  zh: "zh-CN",
  ko: "ko",
  ja: "ja",
};

const errors = [];

function fail(message) {
  errors.push(message);
}

function decodeHtml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getAttrs(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/\s([:\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attrs[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attrs;
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => ({
    raw: match[0],
    attrs: getAttrs(match[0]),
  }));
}

function htmlFileForUrl(url) {
  const { pathname } = new URL(url);
  if (pathname === "/") return path.join(DIST_DIR, "index.html");

  const clean = decodeURIComponent(pathname.replace(/^\/+/, ""));
  if (pathname.endsWith("/")) return path.join(DIST_DIR, clean, "index.html");

  const htmlPath = path.join(DIST_DIR, `${clean}.html`);
  if (existsSync(htmlPath)) return htmlPath;
  return path.join(DIST_DIR, clean, "index.html");
}

function pathSuffixFromUrl(url) {
  const { pathname } = new URL(url);
  const match = pathname.match(/^\/([a-z]{2})(?:\/(.*))?$/);
  if (!match || !LOCALES.includes(match[1])) {
    return null;
  }
  return (match[2] ?? "").replace(/\/+$/, "");
}

function localeUrl(locale, suffix) {
  return suffix ? `${SITE_URL}/${locale}/${suffix}/` : `${SITE_URL}/${locale}/`;
}

function sitemapEntries() {
  if (!existsSync(DIST_DIR)) {
    fail("dist directory does not exist. Run npm.cmd run build first.");
    return [];
  }

  const sitemapFiles = readdirSync(DIST_DIR)
    .filter((file) => /^sitemap.*\.xml$/i.test(file))
    .map((file) => path.join(DIST_DIR, file));

  const entries = [];
  for (const file of sitemapFiles) {
    const xml = readFileSync(file, "utf8");
    for (const block of xml.matchAll(/<url>[\s\S]*?<\/url>/gi)) {
      const loc = decodeHtml(block[0].match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim() ?? "");
      const alternates = [];
      for (const link of block[0].matchAll(/<xhtml:link\b[^>]*>/gi)) {
        alternates.push(getAttrs(link[0]));
      }
      if (loc) entries.push({ loc, alternates, file });
    }
  }
  return entries;
}

const entries = sitemapEntries();
const sitemapUrls = new Set(entries.map((entry) => entry.loc));

if (entries.length === 0) {
  fail("No page URLs found in dist sitemap files.");
}

for (const entry of entries) {
  let url;
  try {
    url = new URL(entry.loc);
  } catch {
    fail(`Invalid sitemap URL: ${entry.loc}`);
    continue;
  }

  if (`${url.protocol}//${url.host}` !== SITE_URL) {
    fail(`Sitemap URL uses unexpected host: ${entry.loc}`);
  }
  if (url.pathname === "/") {
    fail("Root / is present in sitemap even though it redirects/noindexes.");
  }
  if (!url.pathname.endsWith("/")) {
    fail(`Sitemap URL is missing trailing slash: ${entry.loc}`);
  }

  const file = htmlFileForUrl(entry.loc);
  if (!existsSync(file)) {
    fail(`Sitemap URL does not map to a built HTML page: ${entry.loc}`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const pageLabel = path.relative(DIST_DIR, file);

  const robots = tags(html, "meta").filter((tag) => tag.attrs.name?.toLowerCase() === "robots");
  if (robots.some((tag) => tag.attrs.content?.toLowerCase().includes("noindex"))) {
    fail(`Noindex page appears in sitemap: ${entry.loc}`);
  }

  const canonicalTags = tags(html, "link").filter((tag) => tag.attrs.rel?.toLowerCase() === "canonical");
  if (canonicalTags.length !== 1) {
    fail(`${pageLabel}: expected exactly one canonical, found ${canonicalTags.length}`);
  } else if (canonicalTags[0].attrs.href !== entry.loc) {
    fail(`${pageLabel}: canonical ${canonicalTags[0].attrs.href} does not equal sitemap URL ${entry.loc}`);
  }

  const descriptions = tags(html, "meta").filter((tag) => tag.attrs.name?.toLowerCase() === "description");
  if (descriptions.length !== 1 || !descriptions[0].attrs.content?.trim()) {
    fail(`${pageLabel}: expected exactly one non-empty meta description`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) {
    fail(`${pageLabel}: expected exactly one H1, found ${h1Count}`);
  }

  const jsonLdScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLdScripts.length === 0) {
    fail(`${pageLabel}: no JSON-LD found`);
  }
  for (const script of jsonLdScripts) {
    try {
      JSON.parse(decodeHtml(script[1].trim()));
    } catch (error) {
      fail(`${pageLabel}: invalid JSON-LD (${error.message})`);
    }
  }

  const suffix = pathSuffixFromUrl(entry.loc);
  if (suffix === null) {
    fail(`${pageLabel}: URL is not under a supported locale prefix`);
    continue;
  }

  const htmlAlternates = tags(html, "link").filter((tag) => tag.attrs.rel?.toLowerCase() === "alternate");
  const alternateByLang = new Map(htmlAlternates.map((tag) => [tag.attrs.hreflang, tag.attrs.href]));
  const expectedLanguages = [...Object.values(HREFLANGS), "x-default"];

  if (alternateByLang.size !== htmlAlternates.length) {
    fail(`${pageLabel}: duplicate hreflang alternate tags`);
  }

  for (const hreflang of expectedLanguages) {
    if (!alternateByLang.has(hreflang)) {
      fail(`${pageLabel}: missing hreflang ${hreflang}`);
    }
  }

  for (const locale of LOCALES) {
    const expectedUrl = localeUrl(locale, suffix);
    const actualUrl = alternateByLang.get(HREFLANGS[locale]);
    if (actualUrl !== expectedUrl) {
      fail(`${pageLabel}: hreflang ${HREFLANGS[locale]} points to ${actualUrl}, expected ${expectedUrl}`);
    }
    if (!sitemapUrls.has(expectedUrl)) {
      fail(`${pageLabel}: hreflang target missing from sitemap: ${expectedUrl}`);
    }
  }

  const xDefault = alternateByLang.get("x-default");
  const expectedXDefault = localeUrl("en", suffix);
  if (xDefault !== expectedXDefault) {
    fail(`${pageLabel}: x-default points to ${xDefault}, expected ${expectedXDefault}`);
  }

  const sitemapAlternateByLang = new Map(entry.alternates.map((alternate) => [alternate.hreflang, alternate.href]));
  if (sitemapAlternateByLang.size !== entry.alternates.length) {
    fail(`${pageLabel}: duplicate hreflang alternates in sitemap entry`);
  }
  for (const hreflang of expectedLanguages) {
    if (!sitemapAlternateByLang.has(hreflang)) {
      fail(`${pageLabel}: sitemap entry missing hreflang ${hreflang}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO check passed for ${entries.length} sitemap URLs.`);
