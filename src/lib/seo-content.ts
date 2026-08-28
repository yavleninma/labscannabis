import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

/**
 * Форма контента SEO-страницы. Одна и та же и у ручной копии из `PAGE_COPY`
 * (`src/lib/content.ts`), и у готовых JSON в `content-cache/<locale>/<slug>.json`.
 */
export interface SeoContent {
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  closing: string;
  source?: "openai" | "fallback";
}

/**
 * `content-cache` — 168 готовых файлов (24 слага × 7 локалей), которые до W1-11
 * не читала ни одна строка `src/`: их открывали только генераторы. Страницы
 * отдавали ручную копию на 60-240 слов, а оплаченный текст на 250-550 слов в
 * сборку не попадал.
 *
 * Читаем ровно как `src/lib/reviews.ts`: `node:fs` на этапе SSG. Ни
 * `import.meta.glob`, ни `fetch` — иначе 168 JSON уедут в клиентский бандл.
 */
const CACHE_DIR = path.join(process.cwd(), "content-cache");

/** Один файл читается один раз за сборку: 210 страниц ходят за теми же слагами. */
const memo = new Map<string, SeoContent | null>();

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSection(value: unknown): value is SeoContent["sections"][number] {
  const section = value as Record<string, unknown> | null;
  return Boolean(section) && isFilledString(section!.h2) && isFilledString(section!.body);
}

function isFaqItem(value: unknown): value is SeoContent["faq"][number] {
  const item = value as Record<string, unknown> | null;
  return Boolean(item) && isFilledString(item!.q) && isFilledString(item!.a);
}

/**
 * Валидация формы. Битый или наполовину заполненный файл лучше считать
 * отсутствующим: `loadSeoContent` тогда упадёт с явным списком слагов, а не
 * отрендерит страницу без h1.
 */
function isSeoContent(value: unknown): value is SeoContent {
  const content = value as Record<string, unknown> | null;
  if (!content) return false;
  if (!isFilledString(content.h1) || !isFilledString(content.intro) || !isFilledString(content.closing)) {
    return false;
  }
  if (!Array.isArray(content.sections) || content.sections.length === 0) return false;
  if (!content.sections.every(isSection)) return false;
  if (!Array.isArray(content.faq) || !content.faq.every(isFaqItem)) return false;
  return true;
}

/**
 * Контент из `content-cache` для пары локаль+слаг или `null`, если файла нет
 * либо он не проходит валидацию формы.
 */
export function loadCachedSeoContent(locale: Locale, slug: string): SeoContent | null {
  const key = `${locale}/${slug}`;
  const cached = memo.get(key);
  if (cached !== undefined) return cached;

  const file = path.join(CACHE_DIR, locale, `${slug}.json`);
  let content: SeoContent | null = null;
  if (fs.existsSync(file)) {
    try {
      const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
      if (isSeoContent(parsed)) {
        content = {
          h1: parsed.h1,
          intro: parsed.intro,
          sections: parsed.sections,
          faq: parsed.faq,
          closing: parsed.closing,
          source: "openai",
        };
      }
    } catch {
      content = null;
    }
  }

  memo.set(key, content);
  return content;
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Порог внутристраничного повтора: раздел, у которого пересечение по
 * 4-словным шинглам с любым уже добавленным выше 0.20, не отрисовывается.
 *
 * Дедупликация по одному заголовку пропускала перефразированный заголовок с тем
 * же телом. На `/en|ru/cheap-weed-pattaya/` так и вышло: «Why there is no number
 * on this page» из `content.ts` и «Why the shop will not put a figure on this
 * page» из `content-cache` стояли подряд, оба говорили одно и то же, а
 * предложение «So there is no list here, no basket and no payment.» встречалось
 * на странице дважды дословно. Замер: intra-page Жаккар 0.25 (en) и 0.26 (ru) —
 * единственные такие пары на всём сайте, поэтому порог 0.20 отсекает их, не
 * задевая ничего живого.
 */
export const SECTION_DEDUP_JACCARD = 0.2;

const WORD_SHINGLE_SIZE = 4;
const CHAR_NGRAM_SIZE = 8;
/** th/zh/ja/ko не разделяют слова пробелами — там сравниваются символьные n-граммы. */
const NO_WORD_BOUNDARY = /[\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/;

function shingleSet(text: string): Set<string> {
  const shingles = new Set<string>();
  if (NO_WORD_BOUNDARY.test(text)) {
    const chars = text.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
    for (let i = 0; i + CHAR_NGRAM_SIZE <= chars.length; i += 1) {
      shingles.add(chars.slice(i, i + CHAR_NGRAM_SIZE));
    }
    return shingles;
  }
  const tokens = text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  for (let i = 0; i + WORD_SHINGLE_SIZE <= tokens.length; i += 1) {
    shingles.add(tokens.slice(i, i + WORD_SHINGLE_SIZE).join(" "));
  }
  return shingles;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let intersection = 0;
  for (const shingle of small) if (large.has(shingle)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Ручная копия задаёт «лицо» страницы, кэш добавляет объём.
 *
 * `h1`, `intro` и `closing` берутся из ручной копии: `h1` обязан совпадать с
 * `h1Template` в `src/data/seo-matrix.ts`, а `intro` уходит в meta description,
 * и обе строки уже вычитаны на соответствие §1.6 плана. Разделы и FAQ из кэша
 * дописываются следом с дедупликацией по заголовку И по телу — именно они
 * поднимают страницу с 60-240 слов до 250+ собственных слов.
 */
export function mergeSeoContent(base: SeoContent, extra: SeoContent): SeoContent {
  const seenSections = new Set(base.sections.map((section) => normalizeKey(section.h2)));
  const seenQuestions = new Set(base.faq.map((item) => normalizeKey(item.q)));
  const seenBodies = base.sections.map((section) => shingleSet(section.body));

  return {
    h1: base.h1,
    intro: base.intro,
    sections: [
      ...base.sections,
      ...extra.sections.filter((section) => {
        const key = normalizeKey(section.h2);
        if (seenSections.has(key)) return false;
        const body = shingleSet(section.body);
        if (seenBodies.some((seen) => jaccard(seen, body) > SECTION_DEDUP_JACCARD)) return false;
        seenSections.add(key);
        seenBodies.push(body);
        return true;
      }),
    ],
    faq: [
      ...base.faq,
      ...extra.faq.filter((item) => {
        const key = normalizeKey(item.q);
        if (seenQuestions.has(key)) return false;
        seenQuestions.add(key);
        return true;
      }),
    ],
    closing: base.closing,
    source: extra.source ?? base.source,
  };
}
