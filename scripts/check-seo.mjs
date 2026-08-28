import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  EXPECTED_INDEXABLE_PAGE_COUNT,
  FACTORY_INDEXABLE_PAGE_COUNT,
  INDEX_LOCALES,
  INDEX_POLICY_RULES,
  MANUAL_INDEXABLE_PAGE_COUNT,
  MAX_FACTORY_ADMITTED,
  MAX_TOTAL_INDEXABLE,
  getIndexPolicy,
  getIndexPolicyForPathname,
  getXDefaultLocale,
  localePathname,
} from "../src/lib/index-policy.mjs";
import {
  FACTORY_CANDIDATES,
  FACTORY_VERDICTS,
  summarizeFactory,
} from "../src/content-factory/registry.mjs";
import { describeThresholds, evaluateCandidates, formatVerdict } from "./lib/quality-gate.mjs";
import { GATE_FIXTURES, runGateFixtures } from "./lib/quality-gate-fixtures.mjs";
import { findComplianceViolations } from "./lib/compliance-lexicon.mjs";
import {
  buildShingles,
  extractMainText,
  jaccard,
  measureMainText,
  stripBoilerplate,
  topSimilarPairs,
  usesCharNgrams,
} from "./lib/text-similarity.mjs";

const DIST_DIR = path.resolve("dist");
const VERCEL_CONFIG_PATH = path.resolve("vercel.json");
const I18N_DIR = path.resolve("src", "i18n");
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
 * Граф контекстных ссылок проверяется с обеих сторон (W1-16, T-07).
 *
 * Раньше здесь стоял ручной список слагов, у которых обязана быть входящая
 * ссылка, и он покрывал не весь набор: главная и `contact` были из него выведены
 * «потому что до них дойдут по шапке». Ручной список — это ещё и вторая копия
 * `INDEX_POLICY_RULES`, которая расходится с ней при любом добавлении слага.
 *
 * Теперь требование выведено из самой политики индексации и действует на весь
 * indexable-набор без исключений:
 *
 * • ВХОДЯЩИЕ: у каждой indexable-страницы есть хотя бы одна контекстная ссылка
 *   на её собственной локали. Ноль — это сирота: страница, до которой краулер
 *   доходит только по сквозному обвесу, не получает ни веса, ни темы.
 * • ИСХОДЯЩИЕ: у каждой indexable-страницы есть хотя бы одна контекстная ссылка
 *   наружу. До T-07 это не проверялось вовсе, и пять локалей упирались в тупик:
 *   `cannabis-near-me-pattaya` на th/ar/zh/ko/ja не отдавала ни одной.
 * • ХАБЫ: у страниц из `HUB_MIN_INLINKS` входящих должно быть заметно больше,
 *   чем у остальных, — иначе «явные веса» снова выродятся в плоский граф. Порог
 *   ограничен размером локали: на th/ar/zh/ko/ja indexable-страниц всего десять,
 *   и больше девяти источников там взять физически неоткуда.
 *
 * Проверка намеренно смотрит только на размеченные якоря `data-seo-context-link`:
 * сквозная навигация (шапка, служебный футер, хлебные крошки) их не ставит, и
 * это и есть смысл атрибута — считается тематическая связь, а не обвес.
 */
/**
 * Сколько источников обязано быть у хаба. Значение — верхняя планка; фактический
 * порог берётся как `min(порог, indexable-страниц на локали - 1)`, потому что
 * больше, чем «все остальные страницы локали», не бывает.
 */
const HUB_MIN_INLINKS = [
  { suffix: "labs-dispensary-pattaya", min: 10 },
  { suffix: "about", min: 10 },
  { suffix: "guides/legal-cannabis-tourists", min: 10 },
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

/**
 * Регулярка по шаблону источника редиректа Vercel.
 *
 * Поддерживается ровно то, что встречается в `vercel.json`: `:name`,
 * `:name(alt|alt)` и `:name*`. Ничего больше в этом файле нет, и добавлять сюда
 * поддержку неизвестного синтаксиса вслепую нельзя: молча не совпавший шаблон
 * означает молча пропущенную проверку.
 *
 * @param {string} source
 */
function redirectSourcePattern(source) {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = "";
  let index = 0;
  while (index < source.length) {
    const named = /^:([A-Za-z_][A-Za-z0-9_]*)/.exec(source.slice(index));
    if (!named) {
      pattern += escape(source[index]);
      index += 1;
      continue;
    }
    index += named[0].length;
    if (source[index] === "(") {
      let depth = 1;
      let end = index + 1;
      while (end < source.length && depth > 0) {
        if (source[end] === "(") depth += 1;
        else if (source[end] === ")") depth -= 1;
        end += 1;
      }
      const group = source.slice(index + 1, end - 1);
      pattern += `(?:${group.split("|").map(escape).join("|")})`;
      index = end;
    } else if (source[index] === "*") {
      pattern += "[^]*";
      index += 1;
    } else {
      pattern += "[^/]+";
    }
  }
  return new RegExp(`^${pattern}$`);
}

/**
 * НИ ОДИН РЕДИРЕКТ НЕ ИМЕЕТ ПРАВА ПЕРЕКРЫВАТЬ INDEXABLE-СТРАНИЦУ.
 *
 * Зачем это блокирует сборку. Редирект на границе сети срабатывает раньше, чем
 * отдаётся статический файл. Поэтому запись в `vercel.json`, совпавшая с
 * адресом страницы, которую политика индексации объявила indexable, даёт
 * худшее из возможных состояний: URL стоит в sitemap, на него ведут hreflang
 * соседних локалей и внутренние ссылки, canonical на нём указывает на самого
 * себя, а сервер отвечает 301 на посторонний раздел. Ни один из уже
 * существовавших чекеров этого не видел: `validateRedirectDestinations()`
 * проверяет, КУДА ведёт редирект, и ничего не знает о том, ОТКУДА.
 *
 * Дефект не гипотетический. На момент введения этой проверки `vercel.json`
 * закрывал 301-м семь слагов сортов на en и ru (`northern-lights`,
 * `jack-herer`, `amnesia-haze`, `gelato`, `sour-diesel`, `granddaddy-purple`,
 * `pineapple-express`) — четырнадцать URL, которые сборка отдавала в sitemap и
 * которые прод отдавать не мог. Список был написан тогда, когда этих страниц
 * ещё не существовало, и разъехался с набором данных молча.
 *
 * @param {ReadonlySet<string>} indexableUrls
 */
function validateRedirectShadowing(indexableUrls) {
  let redirects;
  try {
    redirects = JSON.parse(readFileSync(VERCEL_CONFIG_PATH, "utf8")).redirects;
  } catch {
    return;
  }
  if (!Array.isArray(redirects)) return;

  // Проверяются обе формы адреса. Каноническая — со слэшем на конце, и
  // редирект, совпавший с ней, просто уводит с проиндексированной страницы.
  // Форма без слэша тоже обязана вести на саму страницу: попав под редирект,
  // она отправит краулера в посторонний раздел вместо 301 на канонический вид.
  const pathnames = [
    ...new Set(
      [...indexableUrls].flatMap((url) => {
        const { pathname } = new URL(url);
        const withoutSlash = pathname.replace(/\/$/, "");
        return withoutSlash ? [pathname, withoutSlash] : [pathname];
      }),
    ),
  ].sort();
  for (const redirect of redirects) {
    if (typeof redirect?.source !== "string") continue;
    // Записи с `has` действуют только на другом хосте (склейка домена
    // labscannabis.com) и канонический хост не затрагивают.
    if (Array.isArray(redirect.has) && redirect.has.length > 0) continue;
    const pattern = redirectSourcePattern(redirect.source);
    for (const pathname of pathnames) {
      if (!pattern.test(pathname)) continue;
      fail(
        `Redirect ${redirect.source} shadows indexable page ${pathname} ` +
          `(sitemap and hreflang announce it, the edge would answer 301 to ${redirect.destination})`,
      );
    }
  }
}

/**
 * СЛАГ БЕЗ СТРАНИЦЫ НА ЛОКАЛИ ОБЯЗАН БЫТЬ ЗАКРЫТ РЕДИРЕКТОМ.
 *
 * Обратная задача к `validateRedirectShadowing()`. Та следит, чтобы редирект не
 * перекрыл существующую страницу; эта — чтобы удаление редиректа не оставило
 * 404 там, где раньше отвечал 301.
 *
 * Конкретный случай, ради которого проверка написана. В `vercel.json` стояло
 * широкое правило `/:lang(th|ar|zh|ko|ja)/strains/:slug → /:lang/locations/`.
 * Снять его пришлось: три сорта открылись на всех семи локалях и попали бы под
 * собственный редирект. Но сняли шире, чем требовалось, и семнадцать слагов ×
 * пять локалей = 85 адресов сменили 301 на 404 молча. Внутренних ссылок на них
 * нет и hreflang их не объявляет, поэтому ни одна проверка не сработала.
 *
 * Правило теперь узкое и перечислительное, а значит, обязано сверяться с
 * данными — иначе оно разъедется с ними ровно так же, только в другую сторону.
 *
 * @param {readonly {locale: string, suffix: string}[]} builtPages
 */
function validateStrainSlugRedirects(builtPages) {
  let redirects;
  try {
    redirects = JSON.parse(readFileSync(VERCEL_CONFIG_PATH, "utf8")).redirects;
  } catch {
    return;
  }
  if (!Array.isArray(redirects)) return;

  const builtBySlug = new Map();
  for (const page of builtPages) {
    const match = /^strains\/([^/]+)$/.exec(page.suffix);
    if (!match) continue;
    if (!builtBySlug.has(match[1])) builtBySlug.set(match[1], new Set());
    builtBySlug.get(match[1]).add(page.locale);
  }

  const patterns = redirects
    .filter((redirect) => typeof redirect?.source === "string")
    .filter((redirect) => !(Array.isArray(redirect.has) && redirect.has.length > 0))
    .map((redirect) => redirectSourcePattern(redirect.source));

  for (const [slug, locales] of [...builtBySlug].sort()) {
    for (const locale of INDEX_LOCALES) {
      if (locales.has(locale)) continue;
      for (const pathname of [`/${locale}/strains/${slug}/`, `/${locale}/strains/${slug}`]) {
        if (patterns.some((pattern) => pattern.test(pathname))) continue;
        fail(
          `${pathname}: страницы сорта на этой локали нет, и редиректа на неё в vercel.json тоже — ` +
            "адрес отдаёт 404. Слаг без страницы обязан быть перечислен в узком правиле редиректа",
        );
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
      const lastmod = block[0].match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim() ?? null;
      if (loc) entries.push({ loc, alternates, lastmod, file });
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
    /**
     * Строки интерфейса — слепой угол прошлой версии проверки: линтер смотрел
     * только `dist/` и `content-cache/`, поэтому ключ `ageGate` во всех семи
     * `src/i18n/<locale>/ui.json` спокойно приглашал «посмотреть меню каннабиса в
     * Паттайе или оптовые запросы по Таиланду» — меню плюс оптовое предложение
     * на семи языках, в одной строке кода от публикации. Ключ удалён, а
     * каталог теперь проверяется наравне с остальными, чтобы следующий фолбэк
     * не попал в тот же угол.
     */
    { dir: I18N_DIR, extension: ".json", severity: "block" },
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
/** Текст страницы, нарезанный по H2: заголовок + тело до следующего H2. */
function splitSectionsByH2(html) {
  // Тот же обвес, что снимает `extractMainText`: контактная панель и блок
  // отзывов стоят на каждой странице и сравнивать их друг с другом бессмысленно.
  const parts = stripBoilerplate(html).split(/<h2\b[^>]*>/i).slice(1);
  const sections = [];
  for (const part of parts) {
    const [rawHeading, ...rest] = part.split(/<\/h2>/i);
    const heading = decodeHtml(rawHeading.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const body = decodeHtml(rest.join(" ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (heading && body) sections.push({ heading, body });
  }
  return sections;
}

/** Лид страницы: видимый текст до первого H2, без обвеса. */
function extractLeadText(html) {
  const stripped = stripBoilerplate(html);
  const head = stripped.split(/<h2\b[^>]*>/i)[0] ?? "";
  return decodeHtml(head.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Пары вопрос-ответ из FAQPage JSON-LD. */
function extractFaqPairs(html) {
  const pairs = [];
  for (const match of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch {
      continue;
    }
    if (parsed?.["@type"] !== "FAQPage") continue;
    for (const entity of parsed.mainEntity ?? []) {
      const q = String(entity?.name ?? "").replace(/\s+/g, " ").trim();
      const a = String(entity?.acceptedAnswer?.text ?? "").replace(/\s+/g, " ").trim();
      if (q && a) pairs.push(`${q}\u0000${a}`);
    }
  }
  return pairs;
}

/**
 * Два замера, которых раньше не было, — поэтому и дубль, и пятикратный FAQPage
 * проехали молча.
 *
 * 1. Повтор ВНУТРИ страницы. `mergeSeoContent` дедуплицировал только заголовки,
 *    и перефразированный заголовок с тем же телом проходил: на
 *    `cheap-weed-pattaya` два раздела подряд говорили одно и то же (Жаккар 0.25
 *    en / 0.26 ru). Порог тот же, что и в самом слиянии — `SECTION_DEDUP_JACCARD`.
 * 2. Дублирующийся FAQPage. Три пары вопрос-ответ стояли дословно в разметке
 *    пяти коммерческих страниц одной локали; по документации Google это
 *    дублирующийся FAQ, из-за которого rich-результат не показывается.
 */
const INTRA_PAGE_DUPLICATE_SCORE = 0.2;
const MAX_SHARED_FAQ_PAGES = 2;

/**
 * ПЕРЕСКАЗ ВНУТРИ СТРАНИЦЫ.
 *
 * Зачем отдельная метрика. Жаккар по 5-словным шинглам (`INTRA_PAGE_DUPLICATE_SCORE`)
 * ловит дословный повтор и НЕ видит пересказ: FAQ, который другими словами
 * повторяет раздел выше, даёт по нему 0.00, и отчёт честно печатал «повторов
 * нет» на странице, треть которой — пересказ. При этом пересказанные слова
 * идут в зачёт порога объёма, то есть страница выглядит длиннее, чем она есть.
 *
 * Что считается. Доля ЗНАМЕНАТЕЛЬНЫХ слов (длиннее трёх букв, без стоп-слов)
 * лида и FAQ, которые уже встречаются в разделах по H2. Метрика словарная, а не
 * позиционная, поэтому перестановка слов её не сбивает.
 *
 * Порог 0.50 — это «половина слов блока уже сказана выше». Он отчётный, а не
 * блокирующий: решение «вопрос добавляет факт или пересказывает раздел»
 * остаётся за человеком, метрика лишь не даёт ему проехать незамеченным.
 *
 * Локали без пробелов между словами (th/zh/ja/ko) пропускаются: знаменательные
 * слова там не выделить, а посимвольная версия меряла бы алфавит.
 */
const MAX_RESTATEMENT_SHARE = 0.5;

/** Слова, которые есть в любом тексте и потому ничего не говорят о пересказе. */
const RESTATEMENT_STOPWORDS = new Set([
  // en
  "that", "this", "with", "from", "your", "they", "them", "then", "than", "what",
  "when", "where", "which", "will", "would", "there", "these", "those", "have",
  "here", "into", "just", "like", "more", "most", "much", "over", "same", "some",
  "such", "take", "takes", "very", "well", "were", "been", "being", "does", "doing",
  "about", "after", "again", "because", "before", "between", "both", "each", "even",
  "every", "only", "other", "should", "still", "thing", "things", "through", "under",
  "until", "while", "your",
  // ru
  "который", "которая", "которое", "которые", "которых", "которым", "чтобы",
  "потому", "поэтому", "этого", "этому", "этом", "этих", "тогда", "когда",
  "если", "хотя", "либо", "тоже", "также", "здесь", "туда", "сюда", "того",
  "тому", "тем", "уже", "ещё", "есть", "быть", "было", "были", "будет",
  "может", "можно", "нужно", "надо", "самый", "самая", "самое", "свой", "своя",
  "своё", "свои", "него", "неё", "них", "вами", "вами", "себя", "всё", "все",
]);

function significantWords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter((word) => word.length > 3 && !RESTATEMENT_STOPWORDS.has(word));
  return new Set(words);
}

/**
 * Доля знаменательных слов `part`, уже встречающихся в `whole`.
 *
 * @param {string} part
 * @param {string} whole
 */
function restatementShare(part, whole) {
  const partWords = significantWords(part);
  if (partWords.size === 0) return null;
  const wholeWords = significantWords(whole);
  let repeated = 0;
  for (const word of partWords) {
    if (wholeWords.has(word)) repeated += 1;
  }
  return repeated / partWords.size;
}

function reportDuplication() {
  const intra = [];
  for (const page of uniquenessPages) {
    if (!page.indexable || page.sections.length < 2) continue;
    const shingles = page.sections.map((section) => buildShingles(section.body, page.locale));
    let worst = null;
    for (let i = 0; i < shingles.length; i += 1) {
      for (let j = i + 1; j < shingles.length; j += 1) {
        const score = jaccard(shingles[i], shingles[j]);
        if (score > INTRA_PAGE_DUPLICATE_SCORE && (!worst || score > worst.score)) {
          worst = { score, a: page.sections[i].heading, b: page.sections[j].heading };
        }
      }
    }
    if (worst) intra.push({ id: `${page.locale}/${page.suffix || ""}`, ...worst });
  }

  const sharedFaq = [];
  for (const locale of INDEX_LOCALES) {
    const pages = uniquenessPages.filter((page) => page.locale === locale && page.indexable);
    const owners = new Map();
    for (const page of pages) {
      for (const pair of new Set(page.faqPairs)) {
        if (!owners.has(pair)) owners.set(pair, []);
        owners.get(pair).push(page.suffix || "/");
      }
    }
    for (const [pair, where] of owners) {
      if (where.length > MAX_SHARED_FAQ_PAGES) {
        sharedFaq.push({ locale, question: pair.split("\u0000")[0], where });
      }
    }
  }

  /**
   * Доля символов основного текста, встречающихся дословно ещё на трёх и более
   * indexable-страницах локали. Именно этот показатель раньше не измерялся,
   * поэтому общий абзац на 16–18 % текста пяти коммерческих страниц проехал.
   */
  const shared = [];
  for (const locale of INDEX_LOCALES) {
    const pages = uniquenessPages.filter((page) => page.locale === locale && page.indexable);
    if (pages.length < 4) continue;
    const owners = new Map();
    const bySentence = pages.map((page) => {
      const sentences = page.text
        .split(/(?<=[.!?。！？])\s+|(?<=[\u0E00-\u0E7F])\s{2,}/u)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length >= 40);
      for (const sentence of new Set(sentences)) {
        owners.set(sentence, (owners.get(sentence) ?? 0) + 1);
      }
      return { page, sentences };
    });
    let worst = null;
    for (const { page, sentences } of bySentence) {
      const total = sentences.reduce((sum, sentence) => sum + sentence.length, 0);
      if (total === 0) continue;
      const repeated = sentences
        .filter((sentence) => (owners.get(sentence) ?? 0) >= 4)
        .reduce((sum, sentence) => sum + sentence.length, 0);
      const share = repeated / total;
      if (!worst || share > worst.share) worst = { id: page.suffix || "/", share };
    }
    if (worst) shared.push({ locale, ...worst });
  }

  /**
   * Пересказ: сколько indexable-страниц повторяют в лиде или в FAQ больше
   * половины знаменательных слов из разделов выше.
   */
  const restated = [];
  for (const page of uniquenessPages) {
    if (!page.indexable || page.sections.length < 2) continue;
    if (usesCharNgrams(page.locale)) continue;
    // Сам блок FAQ стоит под своим H2, поэтому в «разделы» он попадать не
    // должен: иначе FAQ сравнивался бы сам с собой и всегда давал 100%.
    const questions = page.faqPairs.map((pair) => pair.split("\u0000")[0]).filter(Boolean);
    const body = page.sections
      .filter(
        (section) =>
          !questions.some(
            (question) => section.body.includes(question) || section.heading === question,
          ),
      )
      .map((section) => `${section.heading} ${section.body}`)
      .join(" ");
    if (!body.trim()) continue;
    const faqText = page.faqPairs.map((pair) => pair.split("\u0000").join(" ")).join(" ");
    const leadShare = restatementShare(page.lead, body);
    const faqShare = restatementShare(faqText, body);
    const worst = Math.max(leadShare ?? 0, faqShare ?? 0);
    if (worst > MAX_RESTATEMENT_SHARE) {
      restated.push({
        id: `${page.locale}/${page.suffix || "/"}`,
        lead: leadShare,
        faq: faqShare,
        worst,
      });
    }
  }
  restated.sort((a, b) => b.worst - a.worst);

  console.log(
    `Пересказ разделов в лиде или FAQ (знаменательные слова > ${Math.round(MAX_RESTATEMENT_SHARE * 100)}%): ` +
      `${restated.length} indexable-страниц; ` +
      `повтор внутри страницы (Жаккар > ${INTRA_PAGE_DUPLICATE_SCORE}): ${intra.length}; ` +
      `пары вопрос-ответ FAQPage более чем на ${MAX_SHARED_FAQ_PAGES} indexable-страницах локали: ${sharedFaq.length}; ` +
      "макс. доля текста, дословно повторённого ещё на ≥3 indexable-страницах локали: " +
      shared
        .map((item) => `${item.locale} ${(item.share * 100).toFixed(0)}% (${item.id})`)
        .join(", "),
  );
  for (const item of restated.slice(0, REPORT_MODE ? restated.length : SIMILARITY_REPORT_PAIRS)) {
    console.log(
      `      ${(item.worst * 100).toFixed(0)}%  ${item.id}` +
        ` (лид ${item.lead === null ? "—" : `${(item.lead * 100).toFixed(0)}%`},` +
        ` FAQ ${item.faq === null ? "—" : `${(item.faq * 100).toFixed(0)}%`})`,
    );
  }
  for (const item of intra.slice(0, SIMILARITY_REPORT_PAIRS)) {
    console.log(`      ${item.score.toFixed(2)}  ${item.id}: «${item.a}» ↔ «${item.b}»`);
  }
  for (const item of sharedFaq.slice(0, SIMILARITY_REPORT_PAIRS)) {
    console.log(`      ${item.locale}: «${item.question}» — ${item.where.join(", ")}`);
  }
}

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

  const xDefaultLocale = getXDefaultLocale(policy.locales);
  const expectedXDefault = xDefaultLocale ? localeUrl(xDefaultLocale, policy.suffix) : undefined;
  if (alternateByLang.get("x-default") !== expectedXDefault) {
    fail(`${label}: x-default points to ${alternateByLang.get("x-default")}, expected ${expectedXDefault}`);
  }

  for (const hreflang of alternateByLang.keys()) {
    if (!expectedLanguages.includes(hreflang)) {
      fail(`${label}: unexpected hreflang ${hreflang}`);
    }
  }

  /**
   * Каждый адрес в наборе альтернатив обязан вести на indexable-страницу.
   *
   * Раньше `x-default` брался безусловно из en, поэтому отказ ворот на
   * английском объявлял noindex-URL как x-default и в `<head>`, и в сайтмапе —
   * при том что `hreflang="en"` из набора при этом исчезал. Проверка блокирующая
   * и покрывает ОБА источника (HTML и `<xhtml:link>`), потому что расхождение
   * между ними как раз и было симптомом.
   */
  for (const [hreflang, href] of alternateByLang) {
    if (!href) continue;
    const target = getIndexPolicyForPathname(new URL(href).pathname);
    if (!target.indexable) {
      fail(`${label}: hreflang ${hreflang} ведёт на noindex-страницу ${href}`);
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
validateRedirectShadowing(expectedUrls);
const sitemapUrls = new Set(entries.map((entry) => entry.loc));
const entryByUrl = new Map(entries.map((entry) => [entry.loc, entry]));

/**
 * Сверка политики с самой собой тавтологична (обе стороны считаются из
 * `INDEX_POLICY_RULES`, а дубль `suffix+locale` ловит `throw` в
 * `index-policy.mjs`), поэтому содержательны здесь две другие проверки:
 * политика против сайтмапа — ниже, и потолок набора — вот он. Потолок
 * человеко-правимый и живёт рядом с вычисляемым значением, чтобы прирост
 * набора нельзя было не заметить.
 */
if (EXPECTED_INDEXABLE_PAGE_COUNT > MAX_TOTAL_INDEXABLE) {
  fail(
    `Индексируемый набор вырос до ${EXPECTED_INDEXABLE_PAGE_COUNT} при потолке ${MAX_TOTAL_INDEXABLE} ` +
      "— поднимать MAX_TOTAL_INDEXABLE в src/lib/index-policy.mjs руками",
  );
}
if (FACTORY_INDEXABLE_PAGE_COUNT > MAX_FACTORY_ADMITTED) {
  fail(
    `Ворота пропустили ${FACTORY_INDEXABLE_PAGE_COUNT} заводских URL при потолке ${MAX_FACTORY_ADMITTED}`,
  );
}
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
validateStrainSlugRedirects(builtPages);
const builtUrls = new Set(builtPages.map((page) => page.url));
const seenTitles = new Map();
const seenH1s = new Map();
const contextualInlinks = new Map();
/** Сколько разных indexable-целей страница линкует контекстно. Ноль — тупик. */
const contextualOutlinks = new Map();

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
  const pageRecord = {
    locale: page.locale,
    suffix: page.suffix,
    indexable: policy.indexable,
    text: extractMainText(html),
    /** Заполняются ниже, когда `<title>` и H1 уже разобраны. */
    title: "",
    h1: "",
    /** Разделы по H2 — для замера повтора ВНУТРИ страницы. */
    sections: splitSectionsByH2(html),
    /** Пары вопрос-ответ из FAQPage — для замера дублей FAQ между страницами. */
    faqPairs: extractFaqPairs(html),
    /** Лид — текст до первого H2. Нужен для замера пересказа (`reportRestatement`). */
    lead: extractLeadText(html),
  };
  uniquenessPages.push(pageRecord);

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
      if (!contextualOutlinks.has(page.url)) contextualOutlinks.set(page.url, new Set());
      contextualOutlinks.get(page.url).add(targetUrl);
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
  pageRecord.title = title;
  pageRecord.h1 = h1;
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

/**
 * Граф контекстных ссылок: сироты, тупики и веса хабов.
 *
 * Требование выводится из `INDEX_POLICY_RULES`, а не из второго списка рядом:
 * добавили слаг в политику — он немедленно обязан получить и входящую, и
 * исходящую контекстную ссылку на каждой локали, где он indexable.
 */
const indexableByLocale = new Map();
for (const locale of INDEX_LOCALES) indexableByLocale.set(locale, []);
for (const rule of INDEX_POLICY_RULES) {
  for (const locale of rule.locales) indexableByLocale.get(locale)?.push(rule.suffix);
}

const inlinkCounts = [];
for (const [locale, suffixes] of indexableByLocale) {
  for (const suffix of suffixes) {
    const url = localeUrl(locale, suffix);
    const inCount = contextualInlinks.get(url)?.size ?? 0;
    const outCount = contextualOutlinks.get(url)?.size ?? 0;
    inlinkCounts.push({ url, inCount });
    if (inCount === 0) {
      fail(`Indexable page has no same-locale contextual inlink (orphan): ${url}`);
    }
    if (outCount === 0) {
      fail(`Indexable page has no outgoing contextual link (dead end): ${url}`);
    }
  }
}

for (const hub of HUB_MIN_INLINKS) {
  for (const [locale, suffixes] of indexableByLocale) {
    if (!suffixes.includes(hub.suffix)) continue;
    const url = localeUrl(locale, hub.suffix);
    // Порог не может превысить размер локали: на th/ar/zh/ko/ja indexable-страниц
    // всего десять, и десяти источников там взять неоткуда. Берётся доля от
    // набора, а не «все остальные страницы»: требовать ссылку буквально с каждой
    // страницы локали значит валить сборку за первую же новую страницу, которая
    // хаб не линкует, — проверка должна ловить размытый вес, а не арифметику.
    const cap = Math.max(1, Math.ceil((suffixes.length - 1) * 0.6));
    const required = Math.min(hub.min, cap);
    const actual = contextualInlinks.get(url)?.size ?? 0;
    if (actual < required) {
      fail(`Hub page has ${actual} contextual inlinks, expected at least ${required}: ${url}`);
    }
  }
}

/**
 * Плоский граф ловится замером, а не на глаз: до T-07 число источников было
 * одной и той же константой для всех страниц локали, то есть сигнала о важности
 * не было вовсе. Если min и max снова сойдутся — сквозной блок опять помечен как
 * контекстный.
 */
const inlinkValues = inlinkCounts.map((entry) => entry.inCount);
const minInlinks = Math.min(...inlinkValues);
const maxInlinks = Math.max(...inlinkValues);
if (inlinkValues.length > 1 && minInlinks === maxInlinks) {
  fail(
    `Contextual inlink counts are flat (every indexable page has ${minInlinks} sources) — a sitewide block is marked as contextual`,
  );
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

/**
 * Карантин исходников медиа: они не публикуются вообще.
 *
 * Замер по всем 33 файлам каталога (93 МБ): это макро-снимки шишек, и часть из
 * них отснята на подложках с детскими мультперсонажами — Powerpuff Girls,
 * диснеевские принцессы, Rick and Morty, Пикачу. Изображение товара в
 * маркетинговом контексте само по себе реклама контролируемого вещества, а
 * товар на детской подложке — отдельный и куда более тяжёлый состав.
 *
 * Раньше файлы лежали в `public/media`, то есть копировались в `dist/media` и
 * отдавались с домена лицензиата по прямому URL (`/media/IMG_*.jpg`) — при том,
 * что ни одна страница на них не ссылалась. `X-Robots-Tag: noindex` закрывал
 * только индексацию, но не доступ и не цитирование, и прямо противоречил
 * собственному заявлению сайта «no product photographs anywhere on this domain».
 * Исходники перенесены в `media-source/` вне сборки.
 *
 * Проверка держит три инварианта: (1) каталога `media` нет в `public/`,
 * (2) его нет в `dist/`, (3) ни одна страница на `/media/` не ссылается. Когда
 * появятся снимки фасада, вывески и лицензии на стене (O-15), их место —
 * отдельный каталог (`public/photos/`), а не этот.
 */
function checkQuarantinedMedia() {
  const publicMedia = path.resolve("public", "media");
  if (existsSync(publicMedia)) {
    fail(
      "public/media/ снова существует — исходники макро-снимков товара публикуются по прямому URL; " +
        "каталог должен лежать в media-source/ вне сборки",
    );
  }

  const distMedia = path.join(DIST_DIR, "media");
  if (existsSync(distMedia)) {
    fail(
      "dist/media/ существует — бинарные исходники уезжают в деплой и доступны по прямой ссылке " +
        "на домене лицензиата",
    );
  }

  const hits = new Map();
  for (const file of walkFiles(DIST_DIR, ".html")) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/["'(](\/media\/[^"')\s]+)/g)) {
      if (!hits.has(match[1])) hits.set(match[1], repoRelative(file));
    }
  }
  for (const [reference, file] of hits) {
    fail(
      `${file}: страница ссылается на карантинный ${reference} — в media-source/ лежат только макро-снимки товара`,
    );
  }
}

/**
 * В `dist/` не должно быть неиспользуемых бинарных ассетов: файл, на который не
 * ссылается ни одна страница, всё равно отдаётся наружу по прямому URL. Иконки,
 * превью для соцсетей и служебные файлы верификации в разметке не встречаются по
 * определению, поэтому перечислены явно.
 */
const ALLOWED_UNREFERENCED_ASSETS = new Set([
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png",
  "logo-512.png",
  "og-image.png",
  "og-image.svg",
]);

const BINARY_ASSET_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".mp4",
  ".webm",
  ".mov",
]);

function checkUnreferencedBinaryAssets() {
  let markup = "";
  for (const file of walkFiles(DIST_DIR, ".html")) markup += readFileSync(file, "utf8");
  for (const file of walkFiles(DIST_DIR, ".xml")) markup += readFileSync(file, "utf8");

  for (const file of walkFiles(DIST_DIR, "")) {
    const extension = path.extname(file).toLowerCase();
    if (!BINARY_ASSET_EXTENSIONS.has(extension)) continue;
    const name = path.basename(file);
    if (ALLOWED_UNREFERENCED_ASSETS.has(name)) continue;
    if (markup.includes(name)) continue;
    fail(
      `${repoRelative(file)}: бинарный ассет не используется ни на одной странице, но публикуется ` +
        "по прямому URL — удалите его из сборки или сошлитесь на него",
    );
  }
}

/**
 * `lastmod` обязан быть ДЕТЕРМИНИРОВАННЫМ: две сборки одного коммита должны
 * давать побайтово одинаковый sitemap.
 *
 * Почему это блокирующая проверка, а не «и так же работает». `new Date()` в
 * `serialize()` объявлял поисковику, что изменились ВСЕ страницы, при каждой
 * пересборке того же кода — при ретрае деплоя, правке переменной окружения,
 * коммите в другую часть репозитория. Google документированно перестаёт
 * учитывать `lastmod`, который систематически не соответствует
 * действительности: сигнал срабатывает один раз, а дальше обесценивается
 * навсегда, и вернуть доверие к нему нельзя. Регрессия сюда возвращается одной
 * строкой и глазами не видна — в собранном XML дата выглядит правдоподобно
 * в обоих случаях.
 *
 * Проверяется ровно то, что делает `astro.config.mjs`: дата берётся из коммита
 * (`VERCEL_GIT_COMMIT_DATE`, иначе `git log -1 --format=%cs`), одна на всю
 * сборку. Если дату получить неоткуда — `lastmod` не должно быть вовсе:
 * отсутствующий сигнал честнее устаревшего.
 */
function resolveExpectedLastmod() {
  const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const fromEnv = (process.env.VERCEL_GIT_COMMIT_DATE || "").slice(0, 10);
  if (isIsoDate(fromEnv)) return fromEnv;
  try {
    const committed = execFileSync("git", ["log", "-1", "--format=%cs"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (isIsoDate(committed)) return committed;
  } catch {
    // Сборка вне git-дерева — тот же случай, что и в astro.config.mjs.
  }
  return null;
}

function checkSitemapLastmod(sitemapUrlEntries) {
  const expectedDate = resolveExpectedLastmod();
  const values = new Set(sitemapUrlEntries.map((entry) => entry.lastmod));

  if (expectedDate === null) {
    const withLastmod = sitemapUrlEntries.filter((entry) => entry.lastmod);
    if (withLastmod.length > 0) {
      fail(
        `sitemap: дату коммита получить неоткуда, но у ${withLastmod.length} URL стоит lastmod ` +
          `(${withLastmod[0].lastmod}) — значит, она взята из часов сборки и меняется при каждой пересборке`,
      );
    }
    return;
  }

  const missing = sitemapUrlEntries.filter((entry) => !entry.lastmod).length;
  if (missing > 0) {
    fail(`sitemap: у ${missing} URL нет lastmod, хотя дата коммита известна (${expectedDate})`);
  }
  if (values.size > 1) {
    fail(
      `sitemap: lastmod принимает ${values.size} разных значений (${[...values].slice(0, 3).join(", ")}…), ` +
        "а отметка одна на всю сборку — сайт статический и пересобирается целиком из одного коммита",
    );
  }
  for (const value of values) {
    if (!value) continue;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.valueOf())) {
      fail(`sitemap: lastmod "${value}" не разбирается как дата`);
      continue;
    }
    if (parsed.toISOString().slice(0, 10) !== expectedDate) {
      fail(
        `sitemap: lastmod "${value}" не совпадает с датой коммита ${expectedDate} — ` +
          "отметка взята не из коммита, и две сборки одного кода разойдутся",
      );
    }
    if (!parsed.toISOString().endsWith("T00:00:00.000Z")) {
      fail(
        `sitemap: lastmod "${value}" содержит время суток — при пересборке того же коммита оно ` +
          "изменится, и sitemap перестанет быть побайтово воспроизводимым",
      );
    }
  }
}

/**
 * Файл в `content-cache/`, который не рендерится ни одной страницей.
 *
 * ЭТО НЕ ГИГИЕНА, А ЗАЩИТА ОТ ПОВТОРА АВАРИИ. До этого раунда в кэше лежали
 * 126 таких файлов — 18 слагов × 7 локалей: страницы весов (`1g`, `10g`, `30g`,
 * `100g`, `1kg`), опт по Джомтьену, два слага «Soi Hollywood», районы без
 * авторского маршрута, `white-widow-pattaya` рядом с живым `strains/white-widow`.
 * Ни один из них не читала ни одна строка `src/`, поэтому ни ворота качества,
 * ни отчёт похожести их не видели — а лежали они в том же каталоге и в том же
 * формате, что и живой контент. Включались одной строкой в allowlist.
 *
 * Замер, ради которого проверка и стоит: у пары
 * `cannabis-delivery-pattaya` / `weed-delivery-jomtien` Жаккар по 4-словным
 * шинглам был 0.91 — одна и та же страница с подменённым названием района.
 * Ровно такие URL и набрали 149 отказов «Обнаружена, не проиндексирована».
 *
 * Правило простое: текст в кэше существует только для страницы, которая
 * собирается. Нужен текст под новый слаг — сначала маршрут и страница, потом
 * текст, и тогда его сразу видят и ворота, и линтер, и отчёт похожести.
 */
function checkOrphanContentCache() {
  const orphans = [];
  for (const file of walkFiles(CONTENT_CACHE_DIR, ".json")) {
    const locale = path.basename(path.dirname(file));
    const slug = path.basename(file, ".json");
    if (existsSync(path.join(DIST_DIR, locale, slug, "index.html"))) continue;
    orphans.push(`${locale}/${slug}`);
  }
  if (orphans.length === 0) return;
  const shown = orphans.slice(0, 8).join(", ");
  fail(
    `content-cache: ${orphans.length} файл(ов) не рендерятся ни одной страницей (${shown}` +
      `${orphans.length > 8 ? ", …" : ""}) — мёртвый текст в живом каталоге. ` +
      "Либо заведите для слага страницу, либо удалите файлы: включить их обратно " +
      "одной строкой в allowlist не должно быть возможно",
  );
}

/**
 * Картинка карточки ссылки обязана быть РАСТРОМ, лежать в сборке и совпадать
 * по размеру с тем, что объявлено в мете.
 *
 * До этого раунда в `og:image` стоял SVG. Facebook, WhatsApp, Telegram, LINE и
 * X не рисуют SVG в превью — ни один из них: пересланная ссылка приходила
 * получателю вообще без картинки. Отказ молчаливый, в браузере ничего не
 * видно, а весь этот раунд целится в обращения именно из мессенджеров, то есть
 * каждая пересылка теряла самый заметный элемент карточки.
 *
 * Заметить такую регрессию глазами нельзя, поэтому она проверяется машиной:
 * достаточно кому-то поправить одну строку в `PageLayout.astro` обратно на
 * `/og-image.svg` — и сайт снова полгода ходит по мессенджерам без картинки.
 * Размеры читаются из IHDR самого файла, а не из мета-тега: разъехавшиеся
 * ширина и высота Facebook кэширует надолго.
 */
const RASTER_SHARE_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
/** Верхняя граница у Facebook и Telegram — 8 МБ; берём с запасом. */
const MAX_SHARE_IMAGE_BYTES = 5 * 1024 * 1024;

/** Ширина и высота из IHDR — первого чанка PNG. Без зависимостей и без async. */
function readPngSize(file) {
  const head = readFileSync(file).subarray(0, 24);
  if (head.length < 24) return null;
  if (head.toString("latin1", 1, 4) !== "PNG") return null;
  if (head.toString("latin1", 12, 16) !== "IHDR") return null;
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

function checkShareImage() {
  const sample = path.join(DIST_DIR, "en", "index.html");
  if (!existsSync(sample)) return;
  const html = readFileSync(sample, "utf8");

  const pick = (property) =>
    html.match(new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"`))?.[1] ??
    html.match(new RegExp(`<meta\\s+name="${property}"\\s+content="([^"]+)"`))?.[1] ??
    null;

  const image = pick("og:image");
  if (!image) {
    fail("dist/en/index.html: нет og:image — пересланная ссылка придёт без картинки");
    return;
  }
  if (pick("twitter:image") !== image) {
    fail(`og:image и twitter:image разошлись: ${image} против ${pick("twitter:image")}`);
  }

  const pathname = new URL(image, `${SITE_URL}/`).pathname;
  const extension = path.extname(pathname).toLowerCase();
  if (!RASTER_SHARE_IMAGE_EXTENSIONS.has(extension)) {
    fail(
      `og:image = ${image}: формат "${extension}" не растровый. Facebook, WhatsApp, Telegram, ` +
        "LINE и X не рисуют SVG в карточке ссылки — превью просто не будет. " +
        "Растр собирается через node scripts/gen-og-image.mjs",
    );
    return;
  }

  const file = path.join(DIST_DIR, pathname.replace(/^\/+/, ""));
  if (!existsSync(file)) {
    fail(`og:image = ${image}: файла ${repoRelative(file)} нет в сборке — карточка отдаст 404`);
    return;
  }

  const bytes = statSync(file).size;
  if (bytes > MAX_SHARE_IMAGE_BYTES) {
    fail(`${repoRelative(file)}: ${bytes} Б — превью тяжелее лимита ${MAX_SHARE_IMAGE_BYTES} Б`);
  }

  const declaredWidth = Number(pick("og:image:width"));
  const declaredHeight = Number(pick("og:image:height"));
  const actual = extension === ".png" ? readPngSize(file) : null;
  if (actual && (actual.width !== declaredWidth || actual.height !== declaredHeight)) {
    fail(
      `${repoRelative(file)}: в мете объявлено ${declaredWidth}x${declaredHeight}, ` +
        `в файле ${actual.width}x${actual.height} — Facebook кэширует расхождение надолго`,
    );
  }
}

/**
 * Рукописные метры и минуты в копирайте.
 *
 * Все расстояния до ориентиров считаются гаверсинусом в `src/lib/geo.ts` и
 * подставляются плейсхолдером `{walkingStreet}`. Написанное руками число живёт
 * своей жизнью: на `buy-cannabis-pattaya` в лиде стояло «10–13 minute walk», а
 * в FAQ той же страницы — «10 to 15 minutes on foot», и вторая цифра уезжала в
 * `FAQPage` JSON-LD. Прошлая проверка была разовым грепом по трём файлам, и
 * `src/lib/content.ts` с `content-cache/**` в неё не попали.
 */
const DISTANCE_SCAN_TARGETS = [
  { dir: path.resolve("src", "data"), extension: ".ts" },
  { dir: path.resolve("src", "lib"), extension: ".ts" },
  { dir: path.resolve("content-cache"), extension: ".json" },
  /**
   * Каталог-источник гео-кластера и вся вёрстка. Раньше страж их не видел:
   * покрытие кончалось на `src/data` и `src/lib`, а раунд добавил 239 строк
   * кластера в `src/content-factory` и два новых шаблона в `src/components`,
   * то есть три места, откуда цифра могла попасть в прозу мимо проверки.
   */
  { dir: path.resolve("src", "content-factory"), extension: ".mjs" },
  { dir: path.resolve("src", "components"), extension: ".astro" },
  { dir: path.resolve("src", "pages"), extension: ".astro" },
];

/* Кусочки регекспа ниже собраны отдельно: одной строкой он нечитаем. */
const WALK_VERB = "walk|on foot|пешком|เดิน|步行|도보|徒歩";
const UNIT_METRES = "m\\b|metres|meters|м(?![а-яё])|метр\\p{L}*|เมตร|米|미터|メートル";
const UNIT_MINUTES = "min\\b|minute|минут\\p{L}*|นาที|分钟|분|分";
/**
 * Километры в регекспе не было вовсе — ни одной единицы ни на одном языке.
 * «it is 2.4 km away» и «около 2,4 км» проезжали мимо стража, при том что
 * километры в прозе этого сайта ВСЕГДА вычисляются: писать их руками нечем.
 */
const UNIT_KM = "km\\b|км(?![а-яё])|киломе\\p{L}*|กม\\.?|กิโลเมตร|公里|킬로미터|キロメートル";

/**
 * Число + единица расстояния или времени ходьбы. `{walkingStreet}` не число.
 *
 * Четыре ветви, а не одна: прежний регексп поддерживал единственный порядок
 * слов («глагол → число») и пропускал зеркальный («число → единица → глагол»),
 * то есть самые частые формулировки — «a 12 minute walk», «примерно 15 минут
 * пешком», «5 minute walk». Километровая ветвь срабатывает и без глагола:
 * расстояние в километрах в прозе не пишут вовсе, его печатает
 * `describeLandmarkWalk()`.
 */
const HAND_WRITTEN_DISTANCE = new RegExp(
  [
    // 1. километры — сами по себе
    `\\d[\\d\\s.,–-]*\\s*(?:${UNIT_KM})`,
    // 2. метры → глагол ходьбы
    `\\d[\\d\\s.,–-]*\\s*(?:${UNIT_METRES})[^.!?\\n]{0,60}(?:${WALK_VERB})`,
    // 3. минуты → глагол ходьбы (зеркальная ветвь, которой не было)
    `\\d[\\d\\s.,–-]*\\s*(?:${UNIT_MINUTES})[^.!?\\n]{0,60}(?:${WALK_VERB})`,
    // 4. глагол ходьбы → число с единицей
    `(?:${WALK_VERB})[^.!?\\n]{0,60}\\d[\\d\\s.,–-]*\\s*(?:${UNIT_MINUTES}|${UNIT_METRES})`,
  ].join("|"),
  "giu",
);

/**
 * Формулировки, которые страж ОБЯЗАН ловить, и те, которые он ловить не должен.
 *
 * Регексп — единственная блокирующая защита от выдуманного расстояния, и он
 * уже один раз молча пропускал половину частотных формулировок. Поэтому у него
 * есть собственный регресс-набор: прогоняется на каждом `check:seo`, до обхода
 * файлов, и валит сборку, если ветвь сломали.
 */
const DISTANCE_REGEX_FIXTURES = Object.freeze({
  caught: Object.freeze([
    "roughly 800 m walk",
    "the walk takes about 12 minutes",
    "пешком примерно 15 минут",
    "около 800 метров пешком",
    "about a 12 minute walk from the shop",
    "5 minute walk",
    "примерно 15 минут пешком",
    "it is 2.4 km away",
    "it is 7.1 km from Big Buddha to the shop",
    "около 2,4 км",
    "ห่างประมาณ 2.4 กม.",
  ]),
  ignored: Object.freeze([
    "{walkingStreet}",
    "the alley is a short way south of the junction",
    "class=\"mt-9 mb-3 p-4 text-3xl\"",
    "Pattaya 13 Alley, South Pattaya, Chon Buri 20150",
    "lat: 12.9233467, lng: 100.8771557",
  ]),
});

function checkDistanceRegexFixtures() {
  for (const phrase of DISTANCE_REGEX_FIXTURES.caught) {
    HAND_WRITTEN_DISTANCE.lastIndex = 0;
    if (!HAND_WRITTEN_DISTANCE.test(phrase)) {
      fail(`Страж расстояний: формулировка ${JSON.stringify(phrase)} больше не ловится — ветвь регекспа сломана`);
    }
  }
  for (const phrase of DISTANCE_REGEX_FIXTURES.ignored) {
    HAND_WRITTEN_DISTANCE.lastIndex = 0;
    if (HAND_WRITTEN_DISTANCE.test(phrase)) {
      fail(`Страж расстояний: ложное срабатывание на ${JSON.stringify(phrase)}`);
    }
  }
  HAND_WRITTEN_DISTANCE.lastIndex = 0;
}

/**
 * Комментарии из исходника вырезаются перед проверкой.
 *
 * Страж защищает ПРОЗУ, а не документацию: в трёх файлах комментарий словами
 * объясняет, почему обещание «5 минут пешком» писать нельзя, — и после
 * расширения покрытия страж начал валить сборку на собственных объяснениях.
 * Раньше это лечилось исключением для одного файла целиком, что снимало
 * защиту и с его строк тоже.
 *
 * Разбор простой: строковые литералы уважаются, всё остальное между
 * `//`…конца строки, `/*`…`*` + `/` и `<!--`…`-->` заменяется пробелами.
 *
 * @param {string} source
 * @param {string} extension
 */
function stripCodeComments(source, extension) {
  if (extension === ".json") return source;
  let out = "";
  let i = 0;
  let quote = null;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      out += ch;
      if (ch === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i += 1;
      i += 2;
      out += " ";
      continue;
    }
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i);
      i = end === -1 ? source.length : end + 3;
      out += " ";
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

function checkHandWrittenDistances() {
  for (const target of DISTANCE_SCAN_TARGETS) {
    for (const file of walkFiles(target.dir, target.extension)) {
      const relative = repoRelative(file);
      // `geo.ts` и есть источник этих чисел: в нём они вычисляются.
      if (relative.endsWith("src/lib/geo.ts")) continue;
      const text = stripCodeComments(readFileSync(file, "utf8"), target.extension);
      const match = HAND_WRITTEN_DISTANCE.exec(text);
      HAND_WRITTEN_DISTANCE.lastIndex = 0;
      if (!match) continue;
      fail(
        `${relative}: расстояние или время ходьбы написано руками — ${JSON.stringify(match[0].replace(/\s+/g, " ").trim())}; ` +
          "используйте плейсхолдер {walkingStreet} и describeLandmarkWalk()",
      );
    }
  }
}


/**
 * ВТОРАЯ СТУПЕНЬ ОТК: те же ворота, но по отрисованному `dist/` и против всего
 * indexable-корпуса локали.
 *
 * Первая ступень (`src/content-factory/registry.mjs`) работает во время
 * сборки и видит только текст кластеров: копирайт страниц-личностей лежит в
 * `.ts`-модулях вёрстки и в тот момент недоступен. Поэтому она может пропустить
 * заводскую страницу, дублирующую написанную руками, — и вот здесь это
 * ловится: корпус берётся из готового HTML всех indexable-страниц локали, а
 * текст кандидата — из той же самой страницы после `extractMainText()`.
 *
 * Функция `evaluateCandidates()` та же, что и на первой ступени: разъехаться
 * пороги не могут физически.
 *
 * Что здесь ошибка, а что нет:
 * • допущенная страница провалила ворота по `dist` — ОШИБКА, сборка падает.
 *   В индексе оказался бы дубль или тонкая страница;
 * • отклонённая страница по `dist` выглядит проходной — не ошибка, а строка
 *   отчёта: ворота на данных консервативнее, и это безопасная сторона;
 * • у кандидата нет собранной страницы — ОШИБКА: шаблон не собрал URL, на
 *   который уже могут стоять ссылки. Отклонённая ворота́ми страница обязана
 *   существовать под `noindex`, а не исчезать в 404.
 */
/**
 * Ворота обязаны отклонять заведомо плохое.
 *
 * Прогон синтетических фикстур на каждом `npm run check:seo`. Без него зелёный
 * отчёт «допущено 87 из 87» одинаково выглядит и когда ворота работают, и
 * когда они сломаны или порог ослаблен.
 */
function checkGateFixtures() {
  const problems = runGateFixtures();
  for (const problem of problems) {
    fail(`Ворота качества: ${problem}`);
  }
  if (problems.length === 0) {
    console.log(`Ворота качества: регресс-фикстуры (${GATE_FIXTURES.length}) отклонены по своим кодам.`);
  }
}

function auditContentFactory() {
  if (FACTORY_CANDIDATES.length === 0) return;

  const byId = new Map(uniquenessPages.map((page) => [`${page.locale}/${page.suffix}`, page]));
  const corpusByLocale = new Map();
  for (const page of uniquenessPages) {
    if (!page.indexable) continue;
    if (!corpusByLocale.has(page.locale)) corpusByLocale.set(page.locale, []);
    corpusByLocale.get(page.locale).push({
      locale: page.locale,
      suffix: page.suffix,
      title: page.title,
      h1: page.h1,
      text: page.text,
    });
  }

  const rechecked = [];
  for (const verdict of FACTORY_VERDICTS.values()) {
    const built = byId.get(verdict.id);
    if (!built) {
      fail(
        `Контент-завод: кандидат ${verdict.id} не собран в dist/ — ` +
          "страница обязана существовать даже когда ворота её не пропустили (noindex, не 404)",
      );
      continue;
    }
    if (!verdict.admitted) continue;

    const corpus = (corpusByLocale.get(verdict.locale) ?? []).filter(
      (entry) => `${entry.locale}/${entry.suffix}` !== verdict.id,
    );
    const audited = evaluateCandidates(
      [
        {
          clusterId: verdict.clusterId,
          locale: built.locale,
          suffix: built.suffix,
          title: built.title,
          h1: built.h1,
          text: built.text,
        },
      ],
      { corpus },
    ).get(verdict.id);
    rechecked.push(audited);

    if (audited && !audited.admitted) {
      for (const failure of audited.failures) {
        fail(
          `Контент-завод: ${verdict.id} допущена в индекс воротами по данным, ` +
            `но провалила проверку по dist/ — ${failure.code}: ${failure.hint}`,
        );
      }
    }
  }

  const summary = summarizeFactory();
  console.log(
    `Контент-завод: кластеров ${summary.clusters}, кандидатов ${summary.candidates}, ` +
      `допущено воротами ${summary.admitted}, оставлено noindex ${summary.candidates - summary.admitted}. ` +
      `Пороги: ${describeThresholds()}.`,
  );
  console.log(
    `  Индексируемых URL всего ${EXPECTED_INDEXABLE_PAGE_COUNT} при потолке ${MAX_TOTAL_INDEXABLE}: ` +
      `${MANUAL_INDEXABLE_PAGE_COUNT} страниц-личностей + ${summary.admitted} от завода ` +
      `(потолок завода ${MAX_FACTORY_ADMITTED}).`,
  );
  for (const verdict of summary.rejected) {
    console.log(`  ${formatVerdict(verdict)}`);
  }
  if (REPORT_MODE) {
    for (const verdict of rechecked) console.log(`  dist  ${formatVerdict(verdict)}`);
  }
}

runComplianceLint();
checkUnusedComponents();
checkDistanceRegexFixtures();
checkHandWrittenDistances();
checkQuarantinedMedia();
checkUnreferencedBinaryAssets();
checkOrphanContentCache();
checkShareImage();
checkSitemapLastmod(entries);
checkGateFixtures();
auditContentFactory();

if (REPORT_MODE) reportIndexMatrix();

if (warnings.length > 0) {
  const printed = REPORT_MODE ? warnings.length : Math.min(warnings.length, MAX_PRINTED_WARNINGS);
  console.warn(`Предупреждения compliance-линтера (сборку не блокируют): ${warnings.length}`);
  for (const warning of warnings.slice(0, printed)) console.warn(`- ${warning}`);
  if (printed < warnings.length) {
    console.warn(`- …и ещё ${warnings.length - printed} — полный список: npm run check:seo -- --report`);
  }
}

console.log(
  `Контекстная перелинковка: источников на indexable-страницу ${minInlinks}-${maxInlinks} (константа = плоский граф).`,
);

reportContentUniqueness();
reportDuplication();

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SEO check passed: ${entries.length} indexable sitemap URLs and ${builtPages.length - entries.length} noindex localized pages.`,
);
