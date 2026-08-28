/**
 * Отчёт по уникальности основного контента (W1-02).
 *
 * Сравнивать страницы по всему <body> бессмысленно: шапка, футер, sticky-CTA и
 * ContactRail дают 60-70% объёма страницы и сами по себе поднимают похожесть до
 * 0.9+. Любой гейт, считающий по <body>, уронит сборку ровно в тот момент, когда
 * на страницы добавят общий контактный блок. Поэтому экстрактор вырезает весь
 * общий обвес (элементы с `data-boilerplate`, <header>, <footer>, <script>,
 * <style>, sticky-CTA) и считает только собственный текст страницы.
 *
 * Метрика — коэффициент Жаккара по 5-словным шинглам. Для th/zh/ja/ko пробельная
 * токенизация не работает (эти языки пишут без пробелов между словами), поэтому
 * там используются посимвольные n-граммы длиной 10.
 *
 * Опорные значения на 2026-08-27 (локаль en, основной контент):
 * areas/jomtien ↔ areas/naklua = 0.82, areas/walking-street ↔ areas/jomtien = 0.81,
 * labs-dispensary-pattaya ↔ cannabis-near-me-pattaya = 0.37, всё остальное < 0.30.
 */

/** Локали без пробельной токенизации — считаются посимвольными n-граммами. */
export const CHAR_NGRAM_LOCALES = Object.freeze(["th", "zh", "ja", "ko"]);

export const WORD_SHINGLE_SIZE = 5;
export const CHAR_NGRAM_SIZE = 10;

/** Теги, которые целиком не относятся к собственному контенту страницы. */
const BOILERPLATE_TAGS = Object.freeze([
  "script",
  "style",
  "template",
  "noscript",
  "svg",
  "header",
  "footer",
]);

/**
 * Элементы общего обвеса, помеченные явно. `data-boilerplate` проставляется на
 * корневые элементы SiteHeader/Footer/StickyCTA/ContactRail (W1-05…W1-07);
 * `id="sticky-…"` — переходный вариант для sticky-CTA, пока атрибут не проставлен.
 */
const BOILERPLATE_MARKERS = Object.freeze([
  /<([a-z][\w-]*)\b[^>]*\sdata-boilerplate(?:[=\s>]|$)/i,
  /<([a-z][\w-]*)\b[^>]*\sid=["']sticky-[^"']*["']/i,
]);

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

/**
 * Удаляет элемент целиком вместе с содержимым, считая вложенность одноимённых
 * тегов, чтобы `<footer>` внутри `<footer>` не оборвал вырезание раньше времени.
 *
 * @param {string} html
 * @param {number} startIndex индекс `<` открывающего тега
 * @param {string} tagName
 */
function removeElementAt(html, startIndex, tagName) {
  const openTagEnd = html.indexOf(">", startIndex);
  if (openTagEnd === -1) return `${html.slice(0, startIndex)} `;

  const openTag = html.slice(startIndex, openTagEnd + 1);
  if (VOID_TAGS.has(tagName) || openTag.endsWith("/>")) {
    return `${html.slice(0, startIndex)} ${html.slice(openTagEnd + 1)}`;
  }

  const scanner = new RegExp(`<(/?)${tagName}\\b`, "gi");
  scanner.lastIndex = openTagEnd + 1;
  let depth = 1;
  let match;
  while ((match = scanner.exec(html)) !== null) {
    depth += match[1] ? -1 : 1;
    if (depth > 0) continue;
    const closeEnd = html.indexOf(">", match.index);
    return `${html.slice(0, startIndex)} ${closeEnd === -1 ? "" : html.slice(closeEnd + 1)}`;
  }
  return `${html.slice(0, startIndex)} `;
}

/** @param {string} html @param {string} tagName */
function removeAllElements(html, tagName) {
  const finder = new RegExp(`<${tagName}\\b`, "i");
  let result = html;
  let guard = 0;
  let found = finder.exec(result);
  while (found !== null && guard < 500) {
    result = removeElementAt(result, found.index, tagName);
    found = finder.exec(result);
    guard += 1;
  }
  return result;
}

/** @param {string} html */
function removeMarkedElements(html) {
  let result = html;
  for (const marker of BOILERPLATE_MARKERS) {
    let guard = 0;
    let found = marker.exec(result);
    while (found !== null && guard < 500) {
      result = removeElementAt(result, found.index, found[1]);
      found = marker.exec(result);
      guard += 1;
    }
  }
  return result;
}

/**
 * <body> без общего обвеса: шапки, футера, контактной панели и блока отзывов.
 * Возвращает HTML, а не текст, — по нему ещё режут разделы по H2.
 *
 * @param {string} html
 */
export function stripBoilerplate(html) {
  let body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  for (const tagName of BOILERPLATE_TAGS) {
    body = removeAllElements(body, tagName);
  }
  return removeMarkedElements(body);
}

/**
 * Основной контент страницы: <body> без общего обвеса, тегов и сущностей.
 *
 * @param {string} html
 */
export function extractMainText(html) {
  return decodeHtml(stripBoilerplate(html).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/** @param {string} locale */
export function usesCharNgrams(locale) {
  return CHAR_NGRAM_LOCALES.includes(locale);
}

/** @param {string} text */
function words(text) {
  return text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/**
 * Множество шинглов для сравнения. Пустое множество означает «сравнивать нечего».
 *
 * @param {string} text
 * @param {string} locale
 */
export function buildShingles(text, locale) {
  const shingles = new Set();
  if (usesCharNgrams(locale)) {
    const chars = text.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
    for (let i = 0; i + CHAR_NGRAM_SIZE <= chars.length; i += 1) {
      shingles.add(chars.slice(i, i + CHAR_NGRAM_SIZE));
    }
    return shingles;
  }

  const tokens = words(text);
  for (let i = 0; i + WORD_SHINGLE_SIZE <= tokens.length; i += 1) {
    shingles.add(tokens.slice(i, i + WORD_SHINGLE_SIZE).join(" "));
  }
  return shingles;
}

/**
 * Объём собственного текста. Для th/zh/ja/ko слова не выделяются пробелами,
 * поэтому там считаются символы — единица возвращается вместе со значением.
 *
 * @param {string} text
 * @param {string} locale
 */
export function measureMainText(text, locale) {
  if (usesCharNgrams(locale)) {
    return { count: text.replace(/\s+/gu, "").length, unit: "симв." };
  }
  return { count: words(text).length, unit: "слов" };
}

/** @param {Set<string>} a @param {Set<string>} b */
export function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let intersection = 0;
  for (const shingle of small) {
    if (large.has(shingle)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Выше этого порога страницы считаются одной и той же страницей. */
export const NEAR_IDENTICAL_SCORE = 0.99;

/**
 * Попарная похожесть внутри одной локали, отсортированная по убыванию.
 *
 * Группы совпадающих страниц (например шесть одинаковых заглушек под 301)
 * схлопываются в одну строку: иначе они занимают весь топ и вытесняют из отчёта
 * настоящие дубли шаблонов, ради которых отчёт и заводится.
 *
 * @param {readonly { id: string, shingles: Set<string> }[]} entries
 * @param {number} limit
 * @returns {{ a: string, b: string, score: number, identicalGroup: number }[]}
 */
export function topSimilarPairs(entries, limit = 10) {
  const pairs = [];
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const score = jaccard(entries[i].shingles, entries[j].shingles);
      if (score > 0) pairs.push({ a: entries[i].id, b: entries[j].id, score });
    }
  }
  pairs.sort((left, right) => right.score - left.score);

  const parent = new Map(entries.map((entry) => [entry.id, entry.id]));
  const find = (id) => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(id) !== root) {
      const next = parent.get(id);
      parent.set(id, root);
      id = next;
    }
    return root;
  };
  for (const pair of pairs) {
    if (pair.score < NEAR_IDENTICAL_SCORE) break;
    parent.set(find(pair.a), find(pair.b));
  }
  const groupSizes = new Map();
  for (const entry of entries) {
    const root = find(entry.id);
    groupSizes.set(root, (groupSizes.get(root) ?? 0) + 1);
  }

  const seen = new Set();
  const collapsed = [];
  for (const pair of pairs) {
    const roots = [find(pair.a), find(pair.b)].sort();
    const key = roots.join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const identicalGroup = roots[0] === roots[1] ? (groupSizes.get(roots[0]) ?? 2) : 0;
    collapsed.push({ ...pair, identicalGroup });
    if (collapsed.length === limit) break;
  }
  return collapsed;
}
