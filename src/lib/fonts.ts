import type { Locale } from "@/lib/i18n";

/**
 * Шрифтовой запрос по локали.
 *
 * До этой правки все семь локалей грузили один и тот же URL — байт в байт,
 * с совпадающим md5: Inter + Noto Sans Arabic + Noto Sans JP + Noto Sans KR +
 * Noto Sans SC. Английский посетитель платил render-blocking запросом, в ответе
 * которого лежали сотни `@font-face` с `unicode-range` под арабицу, кану и
 * ханьцзы — ни одна из них на его странице не встречается. Ответ CSS от
 * fonts.googleapis.com блокирует первую отрисовку, а LCP-элемент здесь —
 * заголовок H1 (картинок на страницах нет, JS в сборке ноль), то есть LCP
 * упирается ровно в этот запрос.
 *
 * Заодно чинится обратная ошибка: тайского семейства в общем запросе не было
 * вовсе, и /th/ рисовался системным шрифтом.
 */

/** Inter закрывает латиницу и кириллицу — она нужна всем локалям. */
const BASE_FAMILY = "Inter:wght@400;500;600;700";

/**
 * Второе семейство — только под письменность конкретной локали.
 * `null` означает «латиницы и кириллицы Inter достаточно».
 */
const SCRIPT_FAMILY: Record<Locale, string | null> = {
  en: null,
  ru: null,
  th: "Noto+Sans+Thai:wght@400;600;700",
  ar: "Noto+Sans+Arabic:wght@400;600;700",
  zh: "Noto+Sans+SC:wght@400;600;700",
  ko: "Noto+Sans+KR:wght@400;600;700",
  ja: "Noto+Sans+JP:wght@400;600;700",
};

export function getFontStylesheetHref(locale: Locale): string {
  const families = [BASE_FAMILY, SCRIPT_FAMILY[locale]].filter(
    (family): family is string => family !== null,
  );
  return `https://fonts.googleapis.com/css2?${families
    .map((family) => `family=${family}`)
    .join("&")}&display=swap`;
}
