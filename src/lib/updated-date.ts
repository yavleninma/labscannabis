import type { Locale } from "@/lib/i18n";

/**
 * Видимая дата обновления собирается из одной константы, а не хранится семью
 * готовыми строками на локаль.
 *
 * Так было раньше: `updatedLabel: "Updated 28 August 2026"` лежал отдельной
 * строкой в каждом из семи блоков четырёх файлов копирайта, а машинная дата в
 * `Article.dateModified` бралась из своей константы. Любая правка текста без
 * ручного обновления двух десятков строк превращала видимую дату в неверную —
 * а на правовой странице видимая дата и есть тот сигнал доверия, ради которого
 * её ставили. Один литерал плюс форматирование убирают расхождение
 * конструктивно.
 *
 * Формат тайской локали — буддийская эра (CE + 543): «28 สิงหาคม 2569». Именно
 * этот сдвиг и породил находку «уведомление от 17 июля 2026 года» — конвертация
 * 2568 BE в 2026 CE вместо 2025.
 */
const MONTHS: Record<Locale, readonly string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  th: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],
  ar: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  zh: [],
  ko: [],
  ja: [],
};

/** ISO `YYYY-MM-DD` → `{ year, month, day }`. Без `Date`: часовой пояс здесь не нужен. */
function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

/** Буддийская эра для тайской локали. */
const THAI_ERA_OFFSET = 543;

type DateParts = { year: number; month: number; day: number };

/** Только дата, без глагола: «28 August 2026», «28 สิงหาคม 2569», «2026年8月28日». */
const DATE_FORMATTERS: Record<Locale, (d: DateParts) => string> = {
  en: (d) => `${d.day} ${MONTHS.en[d.month - 1]} ${d.year}`,
  ru: (d) => `${d.day} ${MONTHS.ru[d.month - 1]} ${d.year} года`,
  th: (d) => `${d.day} ${MONTHS.th[d.month - 1]} ${d.year + THAI_ERA_OFFSET}`,
  ar: (d) => `${d.day} ${MONTHS.ar[d.month - 1]} ${d.year}`,
  zh: (d) => `${d.year} 年 ${d.month} 月 ${d.day} 日`,
  ko: (d) => `${d.year}년 ${d.month}월 ${d.day}일`,
  ja: (d) => `${d.year}年${d.month}月${d.day}日`,
};

/** Та же дата с глаголом «обновлено» в порядке, естественном для локали. */
const UPDATED_TEMPLATES: Record<Locale, (date: string) => string> = {
  en: (date) => `Updated ${date}`,
  ru: (date) => `Обновлено ${date}`,
  th: (date) => `ปรับปรุง ${date}`,
  ar: (date) => `حُدِّث في ${date}`,
  zh: (date) => `更新于 ${date}`,
  ko: (date) => `${date} 갱신`,
  ja: (date) => `${date}更新`,
};

/** Дата на локали без глагола — для подписей вида «сверено …». */
export function formatDateLabel(locale: Locale, iso: string): string {
  return DATE_FORMATTERS[locale](parseIsoDate(iso));
}

/**
 * Человекочитаемая подпись «обновлено …» на локали. `iso` — та же строка, что
 * уходит в `<time datetime>` и в `Article.dateModified`, поэтому видимая и
 * машинная даты не могут разойтись.
 */
export function formatUpdatedLabel(locale: Locale, iso: string): string {
  return UPDATED_TEMPLATES[locale](formatDateLabel(locale, iso));
}
