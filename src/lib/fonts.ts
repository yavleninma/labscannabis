import type { Locale } from "@/lib/i18n";
import FONT_MANIFEST from "@/data/font-manifest.json";

/**
 * ШРИФТЫ ЛОКАЛИ: ЧТО ПРЕДЗАГРУЖАТЬ.
 *
 * ЧТО ЗДЕСЬ БЫЛО. Функция собирала URL к `fonts.googleapis.com` — по одному
 * семейству письменности на локаль. Это уже было лучше общего запроса на все
 * пять семейств, но оставляло главную беду нетронутой: кросс-доменную таблицу
 * стилей в `<head>`, которая блокирует первую отрисовку. Замер сжатого ответа
 * при одинаковом User-Agent: en/ru 742 B, th 1 261 B, ar 2 425 B — и zh 93 466 B,
 * ja 91 745 B, ko 70 158 B. Три локали ждали отрисовки файл в семь раз тяжелее
 * собственной страницы (12,8 КБ по проводу), потому что CJK-набор Google режет
 * на 303-372 среза по `unicode-range`, и манифест этих срезов и есть ответ.
 *
 * ЧТО СТАЛО. Шрифты лежат в `public/fonts/` и объявлены в `src/styles/fonts.css`,
 * который приезжает внутри собственной таблицы стилей сайта. Кросс-доменного
 * запроса за CSS нет вовсе, `preconnect` к двум чужим хостам — тоже. Для
 * zh/ko/ja веб-шрифта нет: текст рисуют системные наборы этих рынков, стек
 * задаётся в `fonts.css` по `html[lang]`.
 *
 * ЗАЧЕМ ТОГДА ЭТОТ ФАЙЛ. Затем, что `@font-face` внутри CSS браузер находит
 * ПОСЛЕ разбора таблицы стилей, а шрифт нужен на первую же отрисовку. `preload`
 * начинает качать его параллельно разбору HTML. Предзагружается только то, что
 * страница ГАРАНТИРОВАННО использует: лишний `preload` — это скачанный и
 * невостребованный файл, то есть ровно та трата, ради снятия которой всё
 * затевалось.
 */

interface FontManifestEntry {
  family: string;
  subset: string;
  file: string;
  bytes: number;
  source: string;
}

const manifest = FONT_MANIFEST as FontManifestEntry[];

function fileFor(subset: string): string {
  const entry = manifest.find((item) => item.subset === subset);
  if (!entry) {
    throw new Error(
      `Шрифты: среза "${subset}" нет в src/data/font-manifest.json. ` +
        "Манифест пишет `npm run gen:fonts`; список срезов задан в scripts/fetch-fonts.mjs.",
    );
  }
  return entry.file;
}

/**
 * Срезы, которые страница локали использует ТОЧНО.
 *
 * `latin` стоит у всех семи локалей, и это не небрежность: название заведения,
 * домен, адрес и подписи каналов остаются латиницей на любой странице, поэтому
 * латинский срез Inter скачивается всегда — включая zh/ko/ja, где всё остальное
 * рисует системный набор.
 *
 * Чего здесь СОЗНАТЕЛЬНО нет:
 * • `latin-ext` (85 КБ) — самый тяжёлый срез Inter, а его символы приезжают
 *   разве что в имени собственном. Объявление в `fonts.css` остаётся, поэтому
 *   символ из этого диапазона всё равно отрисуется правильно — просто чуть
 *   позже и без предзагрузки. Класть 85 КБ в критический путь ради этого нельзя;
 * • `cyrillic-ext` — украинские и балканские буквы, которых в русском тексте
 *   сайта нет;
 * • арабский срез на локалях, кроме `ar`, и тайский — кроме `th`.
 */
const PRELOAD_SUBSETS: Record<Locale, readonly string[]> = {
  en: ["latin"],
  ru: ["latin", "cyrillic"],
  th: ["latin", "thai"],
  ar: ["latin", "arabic"],
  zh: ["latin"],
  ko: ["latin"],
  ja: ["latin"],
};

export interface FontPreload {
  href: string;
  type: string;
}

/** Что положить в `<link rel="preload" as="font">` для этой локали. */
export function getFontPreloads(locale: Locale): FontPreload[] {
  return PRELOAD_SUBSETS[locale].map((subset) => ({
    href: fileFor(subset),
    type: "font/woff2",
  }));
}
