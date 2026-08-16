import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  EXPECTED_INDEXABLE_PAGE_COUNT,
  INDEX_LOCALES,
  INDEX_POLICY_RULES,
  getIndexPolicy,
  localePathname,
} from "../src/lib/index-policy.mjs";

const DIST_DIR = path.resolve("dist");
const VERCEL_CONFIG_PATH = path.resolve("vercel.json");
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");
const HREFLANGS = {
  en: "en",
  ru: "ru",
  th: "th",
  ar: "ar",
  zh: "zh-CN",
  ko: "ko",
  ja: "ja",
};
const FORBIDDEN_JSON_LD_KEYS = new Set(["aggregateRating", "openingHoursSpecification", "priceRange"]);
const MIN_TITLE_LENGTH = 8;
const MAX_TITLE_LENGTH = 75;
const MIN_DESCRIPTION_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 200;
const MIN_H1_LENGTH = 2;
const MAX_H1_LENGTH = 140;
const MIN_BODY_TEXT_LENGTH = 400;
const MAX_BODY_TEXT_LENGTH = 50_000;
const REQUIRED_CONTEXTUAL_INLINKS = [
  { suffix: "labs-dispensary-pattaya", locales: INDEX_LOCALES },
  { suffix: "cannabis-near-me-pattaya", locales: ["en", "ru"] },
  { suffix: "delivery/pattaya", locales: ["en", "ru"] },
];

const errors = [];

function fail(message) {
  errors.push(message);
}

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function normalizeText(value = "") {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
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

function elementTexts(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, "gi"))].map(
    (match) => normalizeText(match[1]),
  );
}

function visibleBodyText(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  return normalizeText(
    body
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " "),
  );
}

function htmlFileForUrl(url) {
  const { pathname } = new URL(url);
  const clean = decodeURIComponent(pathname.replace(/^\/+/, ""));
  if (pathname.endsWith("/")) return path.join(DIST_DIR, clean, "index.html");

  const htmlPath = path.join(DIST_DIR, `${clean}.html`);
  if (existsSync(htmlPath)) return htmlPath;
  return path.join(DIST_DIR, clean, "index.html");
}

function localeUrl(locale, suffix) {
  return new URL(localePathname(locale, suffix), `${SITE_URL}/`).href;
}

function policyForPathname(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const [locale = "", ...suffixParts] = clean ? clean.split("/") : [];
  if (!INDEX_LOCALES.includes(locale)) return null;
  return getIndexPolicy(locale, suffixParts.join("/"));
}

function redirectSourceLocales(source) {
  const langParam = source.match(/\/:lang(?:\(([^)]+)\))?(?:\/|$)/);
  if (!langParam) return [];
  if (!langParam[1]) return [...INDEX_LOCALES];
  return langParam[1].split("|").filter((locale) => INDEX_LOCALES.includes(locale));
}

function validateRedirectDestinations() {
  if (!existsSync(VERCEL_CONFIG_PATH)) {
    fail("vercel.json does not exist");
    return;
  }

  let redirects;
  try {
    redirects = JSON.parse(readFileSync(VERCEL_CONFIG_PATH, "utf8")).redirects;
  } catch (error) {
    fail(`vercel.json is invalid JSON (${error.message})`);
    return;
  }
  if (!Array.isArray(redirects)) {
    fail("vercel.json redirects must be an array");
    return;
  }

  for (const redirect of redirects) {
    if (typeof redirect?.source !== "string" || typeof redirect?.destination !== "string") {
      fail("vercel.json contains a redirect without a string source and destination");
      continue;
    }

    const candidates = redirect.destination.includes(":lang")
      ? redirectSourceLocales(redirect.source).map((locale) => redirect.destination.replace(":lang", locale))
      : [redirect.destination];
    if (redirect.destination.includes(":lang") && candidates.length === 0) {
      fail(`Redirect ${redirect.source} uses :lang in its destination without a supported source locale`);
      continue;
    }

    for (const candidate of candidates) {
      let target;
      try {
        target = new URL(candidate, `${SITE_URL}/`);
      } catch {
        fail(`Redirect ${redirect.source} has an invalid destination: ${candidate}`);
        continue;
      }
      if (target.origin !== new URL(SITE_URL).origin) continue;
      const policy = policyForPathname(target.pathname);
      if (!policy) continue;
      if (target.pathname.includes(":")) {
        fail(`Redirect ${redirect.source} has an unverifiable localized destination: ${candidate}`);
      } else if (!policy.indexable) {
        fail(`Redirect ${redirect.source} points to noindex destination ${target.pathname}`);
      }
    }
  }
}

function expectedSitemapUrls() {
  const urls = new Set();
  for (const rule of INDEX_POLICY_RULES) {
    for (const locale of rule.locales) {
      urls.add(localeUrl(locale, rule.suffix));
    }
  }
  return urls;
}

function sitemapEntries() {
  if (!existsSync(DIST_DIR)) {
    fail("dist directory does not exist. Run npm run build first.");
    return [];
  }

  const sitemapFiles = readdirSync(DIST_DIR)
    .filter((file) => /^sitemap.*\.xml$/i.test(file))
    .map((file) => path.join(DIST_DIR, file));

  const entries = [];
  for (const file of sitemapFiles) {
    const xml = readFileSync(file, "utf8");
    if (/<lastmod>[^<]*<\/lastmod>/i.test(xml)) {
      fail(`${path.relative(DIST_DIR, file)}: sitemap must not contain build-time lastmod values`);
    }
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

function walkHtmlFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkHtmlFiles(target));
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) files.push(target);
  }
  return files;
}

function builtLocalizedPages() {
  const pages = [];
  for (const locale of INDEX_LOCALES) {
    const localeDir = path.join(DIST_DIR, locale);
    for (const file of walkHtmlFiles(localeDir)) {
      const relative = path.relative(localeDir, file).split(path.sep);
      const fileName = relative.at(-1) ?? "";
      const suffixParts = fileName.toLowerCase() === "index.html"
        ? relative.slice(0, -1)
        : [...relative.slice(0, -1), fileName.replace(/\.html$/i, "")];
      const suffix = suffixParts.join("/");
      pages.push({ locale, suffix, url: localeUrl(locale, suffix), file });
    }
  }
  return pages;
}

function forbiddenJsonLdPaths(value, prefix = "$") {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => forbiddenJsonLdPaths(item, `${prefix}[${index}]`));
  }
  if (!value || typeof value !== "object") return [];

  const matches = [];
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${prefix}.${key}`;
    if (FORBIDDEN_JSON_LD_KEYS.has(key)) matches.push(childPath);
    matches.push(...forbiddenJsonLdPaths(child, childPath));
  }
  return matches;
}

function validateAlternateSet(label, alternates, policy, sitemapUrls) {
  const alternateByLang = new Map(alternates.map((alternate) => [alternate.hreflang, alternate.href]));
  const expectedLanguages = [...policy.locales.map((locale) => HREFLANGS[locale]), "x-default"];

  if (alternateByLang.size !== alternates.length) {
    fail(`${label}: duplicate hreflang alternates`);
  }
  if (alternates.length !== expectedLanguages.length) {
    fail(`${label}: expected ${expectedLanguages.length} hreflang alternates, found ${alternates.length}`);
  }

  for (const locale of policy.locales) {
    const hreflang = HREFLANGS[locale];
    const expectedUrl = localeUrl(locale, policy.suffix);
    const actualUrl = alternateByLang.get(hreflang);
    if (actualUrl !== expectedUrl) {
      fail(`${label}: hreflang ${hreflang} points to ${actualUrl}, expected ${expectedUrl}`);
    }
    if (!sitemapUrls.has(expectedUrl)) {
      fail(`${label}: hreflang target missing from sitemap: ${expectedUrl}`);
    }
  }

  const expectedXDefault = localeUrl("en", policy.suffix);
  if (alternateByLang.get("x-default") !== expectedXDefault) {
    fail(`${label}: x-default points to ${alternateByLang.get("x-default")}, expected ${expectedXDefault}`);
  }

  for (const hreflang of alternateByLang.keys()) {
    if (!expectedLanguages.includes(hreflang)) {
      fail(`${label}: unexpected hreflang ${hreflang}`);
    }
  }
}

function recordUnique(values, kind, value, url) {
  const firstUrl = values.get(value);
  if (firstUrl) {
    fail(`Duplicate exact ${kind} on indexable pages: ${firstUrl} and ${url} (${JSON.stringify(value)})`);
    return;
  }
  values.set(value, url);
}

if (EXPECTED_INDEXABLE_PAGE_COUNT !== 41) {
  fail(`Index policy must contain exactly 41 pages, found ${EXPECTED_INDEXABLE_PAGE_COUNT}`);
}
validateRedirectDestinations();

const entries = sitemapEntries();
const expectedUrls = expectedSitemapUrls();
const sitemapUrls = new Set(entries.map((entry) => entry.loc));
const entryByUrl = new Map(entries.map((entry) => [entry.loc, entry]));

if (expectedUrls.size !== EXPECTED_INDEXABLE_PAGE_COUNT) {
  fail(`Index policy resolves to ${expectedUrls.size} unique URLs, expected ${EXPECTED_INDEXABLE_PAGE_COUNT}`);
}
if (entries.length !== EXPECTED_INDEXABLE_PAGE_COUNT) {
  fail(`Expected exactly ${EXPECTED_INDEXABLE_PAGE_COUNT} sitemap URLs, found ${entries.length}`);
}
if (sitemapUrls.size !== entries.length) {
  fail(`Sitemap contains ${entries.length - sitemapUrls.size} duplicate URL entr${entries.length - sitemapUrls.size === 1 ? "y" : "ies"}`);
}
for (const expectedUrl of expectedUrls) {
  if (!sitemapUrls.has(expectedUrl)) fail(`Expected indexable URL missing from sitemap: ${expectedUrl}`);
}
for (const sitemapUrl of sitemapUrls) {
  if (!expectedUrls.has(sitemapUrl)) fail(`Unexpected URL in sitemap: ${sitemapUrl}`);
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
  if (!url.pathname.endsWith("/")) {
    fail(`Sitemap URL is missing trailing slash: ${entry.loc}`);
  }
  if (!existsSync(htmlFileForUrl(entry.loc))) {
    fail(`Sitemap URL does not map to a built HTML page: ${entry.loc}`);
  }
}

const builtPages = builtLocalizedPages();
const builtUrls = new Set(builtPages.map((page) => page.url));
const seenTitles = new Map();
const seenH1s = new Map();
const contextualInlinks = new Map();

if (builtUrls.size !== builtPages.length) {
  fail(`Localized build contains ${builtPages.length - builtUrls.size} duplicate URL output file(s)`);
}

for (const expectedUrl of expectedUrls) {
  if (!builtUrls.has(expectedUrl)) fail(`Expected indexable URL has no localized built HTML: ${expectedUrl}`);
}

for (const page of builtPages) {
  const policy = getIndexPolicy(page.locale, page.suffix);
  const inSitemap = sitemapUrls.has(page.url);
  const pageLabel = path.relative(DIST_DIR, page.file);
  const html = readFileSync(page.file, "utf8");
  const headHtml = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";

  if (policy.indexable) {
    for (const anchor of tags(html, "a")) {
      if (!Object.hasOwn(anchor.attrs, "data-seo-context-link")) continue;
      const href = anchor.attrs.href;
      if (!href) {
        fail(`${pageLabel}: contextual SEO link has no href`);
        continue;
      }
      let target;
      try {
        target = new URL(href, page.url);
      } catch {
        fail(`${pageLabel}: contextual SEO link has invalid href ${href}`);
        continue;
      }
      if (target.origin !== new URL(SITE_URL).origin) {
        fail(`${pageLabel}: contextual SEO link must be internal: ${href}`);
        continue;
      }
      const targetPolicy = policyForPathname(target.pathname);
      if (!targetPolicy?.indexable) {
        fail(`${pageLabel}: contextual SEO link points to noindex target ${target.pathname}`);
        continue;
      }
      if (targetPolicy.locale !== page.locale) {
        fail(`${pageLabel}: contextual SEO link crosses locale to ${target.pathname}`);
        continue;
      }
      const targetUrl = localeUrl(targetPolicy.locale, targetPolicy.suffix);
      if (targetUrl === page.url) {
        fail(`${pageLabel}: contextual SEO link points to itself`);
        continue;
      }
      if (!contextualInlinks.has(targetUrl)) contextualInlinks.set(targetUrl, new Set());
      contextualInlinks.get(targetUrl).add(page.url);
    }
  }

  if (inSitemap !== policy.indexable) {
    fail(`${pageLabel}: sitemap/index policy mismatch (policy=${policy.indexable}, sitemap=${inSitemap})`);
  }

  const robots = tags(headHtml, "meta").filter((tag) => tag.attrs.name?.toLowerCase() === "robots");
  if (robots.length !== 1) {
    fail(`${pageLabel}: expected exactly one robots meta tag, found ${robots.length}`);
  } else {
    const directives = new Set(
      (robots[0].attrs.content ?? "")
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean),
    );
    if (policy.indexable && (!directives.has("index") || !directives.has("follow") || directives.has("noindex"))) {
      fail(`${pageLabel}: indexable page has invalid robots directives: ${robots[0].attrs.content}`);
    }
    if (!policy.indexable && (!directives.has("noindex") || !directives.has("follow") || directives.has("index"))) {
      fail(`${pageLabel}: excluded page must use noindex,follow: ${robots[0].attrs.content}`);
    }
  }

  const canonicalTags = tags(headHtml, "link").filter((tag) => tag.attrs.rel?.toLowerCase() === "canonical");
  if (canonicalTags.length !== 1) {
    fail(`${pageLabel}: expected exactly one canonical, found ${canonicalTags.length}`);
  } else if (canonicalTags[0].attrs.href !== page.url) {
    fail(`${pageLabel}: canonical ${canonicalTags[0].attrs.href} does not equal page URL ${page.url}`);
  }

  const descriptions = tags(headHtml, "meta").filter((tag) => tag.attrs.name?.toLowerCase() === "description");
  const description = descriptions[0]?.attrs.content?.trim() ?? "";
  if (descriptions.length !== 1 || !description) {
    fail(`${pageLabel}: expected exactly one non-empty meta description`);
  }

  const titles = elementTexts(headHtml, "title");
  const h1s = elementTexts(html, "h1");
  const title = titles[0] ?? "";
  const h1 = h1s[0] ?? "";
  if (titles.length !== 1 || !title) {
    fail(`${pageLabel}: expected exactly one non-empty title, found ${titles.length}`);
  }
  if (h1s.length !== 1 || !h1) {
    fail(`${pageLabel}: expected exactly one non-empty H1, found ${h1s.length}`);
  }

  if (decodeHtml(html).includes("{area}")) {
    fail(`${pageLabel}: unresolved {area} placeholder is visible in built HTML`);
  }

  if (/body:not\(\[data-age-ok=["']?true["']?\]\)\s*>\s*:not\(#age-gate\)[\s\S]{0,120}display:\s*none/i.test(html)) {
    fail(`${pageLabel}: age gate hides main content from crawlers with display:none`);
  }

  const htmlAlternates = tags(headHtml, "link")
    .filter((tag) => tag.attrs.rel?.toLowerCase() === "alternate")
    .map((tag) => ({ hreflang: tag.attrs.hreflang, href: tag.attrs.href }));
  const bodyHreflangLinks = tags(html.replace(headHtml, ""), "a")
    .filter((tag) => tag.attrs.hreflang);
  const jsonLdScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  if (!policy.indexable) {
    if (htmlAlternates.length > 0) {
      fail(`${pageLabel}: noindex page must not emit hreflang alternates`);
    }
    if (jsonLdScripts.length > 0) {
      fail(`${pageLabel}: noindex page must not emit JSON-LD`);
    }
    if (bodyHreflangLinks.length > 0) {
      fail(`${pageLabel}: noindex page must not emit body hreflang links`);
    }
    continue;
  }

  const entry = entryByUrl.get(page.url);
  if (!entry) {
    fail(`${pageLabel}: indexable page has no sitemap entry`);
    continue;
  }

  validateAlternateSet(`${pageLabel} HTML`, htmlAlternates, policy, sitemapUrls);
  validateAlternateSet(
    `${pageLabel} sitemap`,
    entry.alternates.map((alternate) => ({ hreflang: alternate.hreflang, href: alternate.href })),
    policy,
    sitemapUrls,
  );

  if (jsonLdScripts.length === 0) {
    fail(`${pageLabel}: indexable page has no JSON-LD`);
  }
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(decodeHtml(script[1].trim()));
      for (const forbiddenPath of forbiddenJsonLdPaths(parsed)) {
        fail(`${pageLabel}: forbidden volatile JSON-LD property at ${forbiddenPath}`);
      }
    } catch (error) {
      fail(`${pageLabel}: invalid JSON-LD (${error.message})`);
    }
  }

  if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
    fail(`${pageLabel}: title length ${title.length} is outside ${MIN_TITLE_LENGTH}-${MAX_TITLE_LENGTH}`);
  }
  if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    fail(
      `${pageLabel}: meta description length ${description.length} is outside ${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH}`,
    );
  }
  if (h1.length < MIN_H1_LENGTH || h1.length > MAX_H1_LENGTH) {
    fail(`${pageLabel}: H1 length ${h1.length} is outside ${MIN_H1_LENGTH}-${MAX_H1_LENGTH}`);
  }

  const bodyTextLength = visibleBodyText(html).replace(/\s/g, "").length;
  if (bodyTextLength < MIN_BODY_TEXT_LENGTH || bodyTextLength > MAX_BODY_TEXT_LENGTH) {
    fail(
      `${pageLabel}: visible body text length ${bodyTextLength} is outside ${MIN_BODY_TEXT_LENGTH}-${MAX_BODY_TEXT_LENGTH}`,
    );
  }

  recordUnique(seenTitles, "title", title, page.url);
  recordUnique(seenH1s, "H1", h1, page.url);
}

if (builtPages.length === 0) {
  fail("No localized built HTML pages found.");
}

for (const requirement of REQUIRED_CONTEXTUAL_INLINKS) {
  for (const locale of requirement.locales) {
    const targetUrl = localeUrl(locale, requirement.suffix);
    if ((contextualInlinks.get(targetUrl)?.size ?? 0) === 0) {
      fail(`Indexable intent owner has no same-locale contextual inlink: ${targetUrl}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SEO check passed: ${entries.length} indexable sitemap URLs and ${builtPages.length - entries.length} noindex localized pages.`,
);
