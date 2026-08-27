import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  EXPECTED_INDEXABLE_PAGE_COUNT,
  INDEX_LOCALES,
  INDEX_POLICY_RULES,
  getIndexPolicy,
  localePathname,
} from "../src/lib/index-policy.mjs";
import { findComplianceViolations } from "./lib/compliance-lexicon.mjs";
import { buildShingles, extractMainText, measureMainText, topSimilarPairs } from "./lib/text-similarity.mjs";

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
const MIN_TITLE_LENGTH = 8;
const MAX_TITLE_LENGTH = 75;
const MIN_DESCRIPTION_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 200;
const MIN_H1_LENGTH = 2;
const MAX_H1_LENGTH = 140;
const MIN_BODY_TEXT_LENGTH = 400;
const MAX_BODY_TEXT_LENGTH = 50_000;
/**
 * Каждая возвращённая в индекс страница обязана иметь контекстную ссылку на
 * своей локали (`data-seo-context-link`) — иначе она сирота и её не обойдут.
 * Проверка намеренно смотрит только на размеченные якоря: считать обычные `<a>`
 * чекер не умеет, и требование «входящая ссылка на каждый indexable URL» уронит
 * сборку немедленно.
 *
 * Список покрывает весь indexable-набор, кроме главной и `contact`: до них
 * человек доходит по шапке и по служебной строке футера, и размечать их как
 * тематические ссылки было бы враньём о смысле атрибута. Источники ссылок —
 * `RelatedLinks.astro` и группы футера (W1-16); список слагов держится в
 * `src/data/footer-seo-links.ts` и фильтруется той же политикой индексации,
 * поэтому расхождение между этой таблицей и разметкой роняет сборку.
 */
const REQUIRED_CONTEXTUAL_INLINKS = [
  { suffix: "labs-dispensary-pattaya", locales: INDEX_LOCALES },
  { suffix: "cannabis-near-me-pattaya", locales: INDEX_LOCALES },
  { suffix: "locations", locales: INDEX_LOCALES },
  { suffix: "guides/legal-cannabis-tourists", locales: INDEX_LOCALES },
  { suffix: "buy-cannabis-pattaya", locales: ["en", "ru"] },
  { suffix: "best-cannabis-shop-pattaya", locales: ["en", "ru"] },
  { suffix: "cheap-weed-pattaya", locales: ["en", "ru"] },
  { suffix: "areas/walking-street", locales: ["en", "ru"] },
  { suffix: "delivery/pattaya", locales: ["en", "ru"] },
];

/**
 * Разметка, которую нельзя эмитить никогда (W1-13).
 *
 * Прежний `FORBIDDEN_JSON_LD_KEYS` снят в W1-01 целиком — вместе с ним ушёл и
 * запрет на `openingHoursSpecification`, а он законен ровно в тот день, когда
 * владелец подтвердит часы (O-01). Здесь остаётся то, что незаконно или
 * бесполезно в любой день:
 *
 * • `aggregateRating` — Google не выдаёт review snippet для self-serving
 *   отзывов на `LocalBusiness`/`Organization`: заявка есть, звёзд нет;
 * • `Offer`, `AggregateOffer`, `OfferCatalog`, `Product` и любое поле,
 *   начинающееся на `price` (включая `priceRange`) — публикация оферты и
 *   ценового ориентира через разметку эквивалентна публикации их на странице,
 *   а это реклама каннабиса по приказу 2568;
 * • `Review` — тексты отзывов у нас переводные, а имена не выверены по
 *   источнику; разметка отзыва — это утверждение об авторе.
 */
const FORBIDDEN_JSON_LD_KEYS = ["aggregateRating"];
const FORBIDDEN_JSON_LD_KEY_PREFIXES = ["price"];
const FORBIDDEN_JSON_LD_TYPES = ["Offer", "AggregateOffer", "OfferCatalog", "Product", "Review"];

/** Обходит распарсенный JSON-LD и возвращает список нарушений вида "ключ/тип". */
function findForbiddenJsonLd(value, hits = []) {
  if (Array.isArray(value)) {
    for (const item of value) findForbiddenJsonLd(item, hits);
    return hits;
  }
  if (!value || typeof value !== "object") return hits;

  for (const [key, child] of Object.entries(value)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_JSON_LD_KEYS.includes(key)) hits.push(`key ${key}`);
    if (FORBIDDEN_JSON_LD_KEY_PREFIXES.some((prefix) => lower.startsWith(prefix))) {
      hits.push(`key ${key}`);
    }
    if (key === "@type") {
      const types = Array.isArray(child) ? child : [child];
      for (const type of types) {
        if (FORBIDDEN_JSON_LD_TYPES.includes(type)) hits.push(`@type ${type}`);
      }
    }
    findForbiddenJsonLd(child, hits);
  }
  return hits;
}

const CONTENT_CACHE_DIR = path.resolve("content-cache");
/**
 * content-cache вычищен (W1-10, `npm run fix:content-cache`), поэтому кэш
 * охраняется наравне с `dist`: он подключается к сборке в W1-11, и любое
 * нарушение, вернувшееся в JSON, обязано валить сборку до публикации, а не
 * после. Обратно на "warn" не переключать — предупреждение здесь уже один раз
 * позволило 64 обещаниям пробника в подарок дожить до релиза.
 */
const CONTENT_CACHE_SEVERITY = "block";
const REPORT_MODE = process.argv.slice(2).includes("--report");
const SIMILARITY_REPORT_PAIRS = 10;
const MAX_PRINTED_WARNINGS = 5;

const errors = [];
const warnings = [];
const uniquenessPages = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
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

function walkFiles(directory, extension = ".html") {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(target, extension));
    if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) files.push(target);
  }
  return files;
}

function repoRelative(file) {
  return path.relative(process.cwd(), file).split(path.sep).join("/");
}

/**
 * Доля символов чужого письма в основном тексте indexable-страницы.
 *
 * Проверка появилась после `/th/labs-dispensary-pattaya/`: страница вышла в
 * индекс с телом наполовину по-английски — заголовки разделов и два абзаца
 * остались от англоязычного исходника генератора, в который скрипт вставил
 * отдельные тайские предложения. Чекер мерил длину и уникальность, но не язык,
 * поэтому дефект дожил до `dist`.
 *
 * Имена собственные (Pattaya 13 Alley, Labs Cannabis, WhatsApp, Google Maps)
 * латиницей законны в любой локали, отсюда порог, а не ноль. По той же причине
 * из замера исключается текст ссылок: страницы-хабы (`locations`, `contact`)
 * состоят из названий страниц и топонимов, и доля латиницы там ничего не
 * говорит о языке прозы.
 */
const NON_LATIN_SCRIPTS = {
  th: /\p{Script=Thai}/u,
  ar: /\p{Script=Arabic}/u,
  zh: /\p{Script=Han}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  ko: /\p{Script=Hangul}/u,
  ru: /\p{Script=Cyrillic}/u,
};
const LATIN_LETTER = /\p{Script=Latin}/u;
/**
 * Выше этой доли латиницы проза перестаёт быть текстом на языке локали.
 * Порог взят с запасом над фактическим распределением: сорвавшаяся
 * `/th/labs-dispensary-pattaya/` давала 42 %, ближайшая честная страница — вдвое
 * меньше.
 */
const MAX_FOREIGN_SCRIPT_SHARE = 0.35;
/** Латинская фраза от семи слов подряд — это уже непереведённый абзац, а не бренд. */
const LONG_LATIN_PHRASE = /(?:\b[A-Za-z][A-Za-z'’-]*\b[^\p{L}\n]{1,3}){6}\b[A-Za-z][A-Za-z'’-]*\b/u;

/**
 * @param {string} locale
 * @param {string} text основной текст страницы без общего обвеса
 * @returns {{ share: number, letters: number } | null} `null` для локалей на латинице
 */
function foreignScriptShare(locale, text) {
  const native = NON_LATIN_SCRIPTS[locale];
  if (!native) return null;
  let latin = 0;
  let letters = 0;
  for (const char of text) {
    if (!/\p{L}/u.test(char)) continue;
    letters++;
    if (LATIN_LETTER.test(char)) latin++;
  }
  if (letters === 0) return null;
  return { share: latin / letters, letters };
}

function builtLocalizedPages() {
  const pages = [];
  for (const locale of INDEX_LOCALES) {
    const localeDir = path.join(DIST_DIR, locale);
    for (const file of walkFiles(localeDir)) {
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

/**
 * Тексты страницы, попадающие к посетителю: их и проверяет compliance-линтер.
 *
 * `H1` отделён от тела: в заголовке эхо поискового запроса законно
 * («Best cannabis shop in Pattaya»), в прозе те же слова уже хвалят товар.
 * `alt` и `title` — такой же публичный текст: их читают и поисковик, и
 * скринридер, а раньше линтер не видел атрибутов вообще.
 */
function lintableHtmlTexts(html) {
  const headHtml = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const bodyHtml = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const texts = [];
  for (const title of elementTexts(headHtml, "title")) texts.push({ origin: "title", text: title });
  for (const meta of tags(headHtml, "meta")) {
    const key = (meta.attrs.name ?? meta.attrs.property ?? "").toLowerCase();
    if (!key.includes("description") && !key.includes("title")) continue;
    if (meta.attrs.content) texts.push({ origin: `meta[${key}]`, text: meta.attrs.content });
  }
  for (const h1 of elementTexts(bodyHtml, "h1")) texts.push({ origin: "h1", text: h1 });
  texts.push({ origin: "body", text: visibleBodyText(html.replace(/<h1\b[\s\S]*?<\/h1>/gi, " ")) });

  const attributeTexts = new Set();
  for (const tag of html.matchAll(/<(?:img|a|area|button|iframe|source)\b[^>]*>/gi)) {
    const attrs = getAttrs(tag[0]);
    for (const value of [attrs.alt, attrs.title, attrs["aria-label"]]) {
      if (value && value.trim()) attributeTexts.add(value.trim());
    }
  }
  for (const value of attributeTexts) texts.push({ origin: "alt", text: value });

  // Префилл мессенджера — такой же публичный текст, как и видимый на странице.
  const prefills = new Set();
  for (const match of html.matchAll(/[?&]text=([^"'&\s]+)/gi)) {
    try {
      prefills.add(decodeURIComponent(match[1]));
    } catch {
      prefills.add(match[1]);
    }
  }
  for (const prefill of prefills) texts.push({ origin: "prefill", text: prefill });
  return texts;
}

function collectJsonStrings(value, prefix, collected) {
  if (typeof value === "string") {
    collected.push({ origin: prefix, text: value });
    return collected;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectJsonStrings(item, `${prefix}[${index}]`, collected));
    return collected;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) collectJsonStrings(child, `${prefix}.${key}`, collected);
  }
  return collected;
}

/**
 * Compliance-линтер (W1-02). По `dist/` он блокирует сборку: это ровно тот текст,
 * который уезжает в прод и который тайский регулятор читает как рекламу. По
 * `content-cache/` охраняется наравне с ним — см. CONTENT_CACHE_SEVERITY.
 * Линтер ловит опечатки и регрессии; юридическую ответственность несёт вычитка
 * человеком.
 */
function runComplianceLint() {
  const roots = [
    { dir: DIST_DIR, extension: ".html", severity: "block" },
    { dir: CONTENT_CACHE_DIR, extension: ".json", severity: CONTENT_CACHE_SEVERITY },
  ];

  for (const root of roots) {
    const report = root.severity === "block" ? fail : warn;
    for (const file of walkFiles(root.dir, root.extension)) {
      const relative = repoRelative(file);
      const raw = readFileSync(file, "utf8");
      let texts;
      if (root.extension === ".json") {
        try {
          texts = collectJsonStrings(JSON.parse(raw), "$", []);
        } catch (error) {
          report(`${relative}: invalid JSON (${error.message})`);
          continue;
        }
      } else {
        texts = lintableHtmlTexts(raw);
      }

      const reported = new Set();
      for (const { origin, text } of texts) {
        for (const violation of findComplianceViolations(text, relative, origin)) {
          if (reported.has(violation.ruleId)) continue;
          reported.add(violation.ruleId);
          report(`${relative} (${origin}): ${violation.hint} — ${JSON.stringify(violation.match)} [${violation.ruleId}]`);
        }
      }
    }
  }
}

/**
 * Отчёт по уникальности (W1-02). В Волне 1 он ничего не блокирует: сначала
 * переписывается шаблон гео-страниц (Волна 2), и только потом порог берётся из
 * фактического распределения, а не назначается наугад.
 */
function reportContentUniqueness() {
  if (uniquenessPages.length === 0) return;

  console.log("Уникальность основного контента (отчёт, сборку не блокирует):");
  for (const locale of INDEX_LOCALES) {
    const entries = uniquenessPages
      .filter((page) => page.locale === locale)
      .map((page) => ({
        id: page.suffix || "/",
        indexable: page.indexable,
        measure: measureMainText(page.text, locale),
        shingles: buildShingles(page.text, locale),
      }));
    if (entries.length === 0) continue;

    const pairs = topSimilarPairs(entries, SIMILARITY_REPORT_PAIRS);
    const indexable = entries.filter((entry) => entry.indexable).sort((a, b) => a.measure.count - b.measure.count);
    const worstIndexable = topSimilarPairs(indexable, 1)[0];
    const worst = pairs[0];
    const thinnest = indexable[0];
    console.log(
      `  ${locale}: страниц ${entries.length}` +
        (worst
          ? `, max Жаккар ${worst.score.toFixed(2)} (${worst.a} ↔ ${worst.b}` +
            `${worst.identicalGroup > 2 ? `, группа из ${worst.identicalGroup}` : ""})`
          : ", пар для сравнения нет") +
        (worstIndexable ? `, среди indexable ${worstIndexable.score.toFixed(2)}` : "") +
        (thinnest ? `, тоньше всех indexable: ${thinnest.id} — ${thinnest.measure.count} ${thinnest.measure.unit}` : ""),
    );
    if (!REPORT_MODE) continue;

    for (const pair of pairs) {
      const group = pair.identicalGroup > 2 ? ` (группа из ${pair.identicalGroup} одинаковых страниц)` : "";
      console.log(`      ${pair.score.toFixed(2)}  ${pair.a} ↔ ${pair.b}${group}`);
    }
    for (const entry of indexable) {
      console.log(`      ${String(entry.measure.count).padStart(5)} ${entry.measure.unit}  ${entry.id}`);
    }
  }
}

/** Таблица «локаль × суффикс × indexable» (W1-01, флаг --report). */
function reportIndexMatrix() {
  const suffixes = [...new Set(uniquenessPages.map((page) => page.suffix || "/"))].sort();
  const width = Math.max(...suffixes.map((suffix) => suffix.length), 10);
  const state = new Map(uniquenessPages.map((page) => [`${page.locale}|${page.suffix || "/"}`, page.indexable]));

  console.log("Индексация (+ indexable, · noindex, пусто — страницы нет):");
  console.log(`  ${"суффикс".padEnd(width)}  ${INDEX_LOCALES.map((locale) => locale.padStart(2)).join(" ")}`);
  for (const suffix of suffixes) {
    const cells = INDEX_LOCALES.map((locale) => {
      const indexable = state.get(`${locale}|${suffix}`);
      return (indexable === undefined ? " " : indexable ? "+" : "·").padStart(2);
    });
    console.log(`  ${suffix.padEnd(width)}  ${cells.join(" ")}`);
  }
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
  uniquenessPages.push({
    locale: page.locale,
    suffix: page.suffix,
    indexable: policy.indexable,
    text: extractMainText(html),
  });

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
      const forbidden = [...new Set(findForbiddenJsonLd(parsed))];
      if (forbidden.length > 0) {
        fail(`${pageLabel}: JSON-LD must not contain ${forbidden.join(", ")}`);
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

  if (policy.indexable) {
    const mainText = extractMainText(html);
    const proseText = extractMainText(html.replace(/<a\b[\s\S]*?<\/a>/gi, " "));
    const foreign = foreignScriptShare(page.locale, proseText);
    // Ниже этого объёма прозы доля ничего не измеряет: страницы-хабы
    // (`locations`, `contact`) — это карточка адреса и список ссылок, где
    // латиница законна вся целиком. Порог совпадает с `MIN_BODY_TEXT_LENGTH`.
    if (foreign && foreign.letters >= MIN_BODY_TEXT_LENGTH && foreign.share > MAX_FOREIGN_SCRIPT_SHARE) {
      fail(
        `${pageLabel}: ${Math.round(foreign.share * 100)}% of main-text letters are Latin — ` +
          `the page is not written in "${page.locale}"`,
      );
    }
    if (foreign) {
      const phrase = mainText.match(LONG_LATIN_PHRASE);
      if (phrase) {
        fail(`${pageLabel}: untranslated Latin phrase in "${page.locale}" main text — ${JSON.stringify(phrase[0])}`);
      }
    }
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

/**
 * Компонент без единого импорта — заряженная мина, а не мёртвый код.
 *
 * `MedicalCardNote.astro` пролежал так целую волну: он не рендерился, поэтому
 * ни один грep по `dist` его не видел, а внутри на семи локалях лежало
 * приглашение договориться о доставке в мессенджере и формулировка «no
 * confirmed online sale». Одна строка `<MedicalCardNote />` в любом файле
 * вернула бы всё это на прод. Проверка дешёвая и ловит именно этот класс.
 */
function checkUnusedComponents() {
  const componentsDir = path.resolve("src/components");
  if (!existsSync(componentsDir)) return;

  const sources = [
    ...walkFiles(path.resolve("src"), ".astro"),
    ...walkFiles(path.resolve("src"), ".ts"),
    ...walkFiles(path.resolve("src"), ".tsx"),
  ];
  const allText = sources.map((file) => readFileSync(file, "utf8")).join("\n");

  for (const extension of [".astro", ".tsx"]) {
    for (const file of walkFiles(componentsDir, extension)) {
      const name = path.basename(file, extension);
      // Импорт компонента всегда идёт по имени файла: `@/components/<Name>`.
      const imported = new RegExp(`components/${name}(?:\\.astro|\\.tsx)?["'\`]`).test(allText);
      if (!imported) {
        fail(`${repoRelative(file)}: component is never imported — delete it or use it`);
      }
    }
  }
}

runComplianceLint();
checkUnusedComponents();

if (REPORT_MODE) reportIndexMatrix();

if (warnings.length > 0) {
  const printed = REPORT_MODE ? warnings.length : Math.min(warnings.length, MAX_PRINTED_WARNINGS);
  console.warn(`Предупреждения compliance-линтера (сборку не блокируют): ${warnings.length}`);
  for (const warning of warnings.slice(0, printed)) console.warn(`- ${warning}`);
  if (printed < warnings.length) {
    console.warn(`- …и ещё ${warnings.length - printed} — полный список: npm run check:seo -- --report`);
  }
}

reportContentUniqueness();

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SEO check passed: ${entries.length} indexable sitemap URLs and ${builtPages.length - entries.length} noindex localized pages.`,
);
