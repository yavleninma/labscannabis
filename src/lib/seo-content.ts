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
 * Ручная копия задаёт «лицо» страницы, кэш добавляет объём.
 *
 * `h1`, `intro` и `closing` берутся из ручной копии: `h1` обязан совпадать с
 * `h1Template` в `src/data/seo-matrix.ts`, а `intro` уходит в meta description,
 * и обе строки уже вычитаны на соответствие §1.6 плана. Разделы и FAQ из кэша
 * дописываются следом с дедупликацией по заголовку — именно они поднимают
 * страницу с 60-240 слов до 250+ собственных слов.
 */
export function mergeSeoContent(base: SeoContent, extra: SeoContent): SeoContent {
  const seenSections = new Set(base.sections.map((section) => normalizeKey(section.h2)));
  const seenQuestions = new Set(base.faq.map((item) => normalizeKey(item.q)));

  return {
    h1: base.h1,
    intro: base.intro,
    sections: [
      ...base.sections,
      ...extra.sections.filter((section) => {
        const key = normalizeKey(section.h2);
        if (seenSections.has(key)) return false;
        seenSections.add(key);
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
