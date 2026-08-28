/** @typedef {"en" | "ru" | "th" | "ar" | "zh" | "ko" | "ja"} IndexLocale */

/** @type {readonly IndexLocale[]} */
export const INDEX_LOCALES = Object.freeze(["en", "ru", "th", "ar", "zh", "ko", "ja"]);

/** @type {readonly IndexLocale[]} */
export const EN_RU_INDEX_LOCALES = Object.freeze(["en", "ru"]);

const allLocales = INDEX_LOCALES;
const enRuLocales = EN_RU_INDEX_LOCALES;

/**
 * This is the single allowlist for pages that may be indexed. Every generated
 * route not listed here remains available to visitors but must be noindex.
 *
 * Условие возврата слага (W1-14): у страницы есть собственный связный текст
 * после чистки `content-cache` (W1-10) и его подключения (W1-11), у неё
 * однозначный коммерческий интент, и она не дублирует соседнюю.
 *
 * Сознательно НЕ возвращены:
 * - `areas/*` сверх четырёх маршрутных (`walking-street`, `soi-buakhao`,
 *   `central-pattaya`, `jomtien`) — для остальных районов авторского маршрута
 *   нет, шаблон их больше не генерирует вовсе, а прежние URL закрыты 301 в
 *   `vercel.json`;
 * - `cannabis-wholesale-pattaya`, `cannathai-wholesale-cannabis-thailand` — до
 *   подтверждения класса лицензии на опт;
 * - `how-to-buy-cannabis-pattaya` — контента нет ни в `PAGE_COPY`, ни в
 *   `content-cache`; `loadSeoContent` на нём упадёт, и это правильно;
 * - страницы весов (`1g`, `10g`, `30g`, `100g`, `1kg`) — это прайс без цифр;
 * - сорта сверх трёх описанных (`white-widow`, `blue-dream`, `og-kush`) — на
 *   остальные названия нет материала на 600 слов собственного текста, а карточка
 *   на 150 слов с Leafly это второй заход на грабли раунда 1.
 *
 * @type {readonly Readonly<{ suffix: string, locales: readonly IndexLocale[] }>[]}
 */
export const INDEX_POLICY_RULES = Object.freeze([
  Object.freeze({ suffix: "", locales: allLocales }),
  Object.freeze({ suffix: "contact", locales: allLocales }),
  Object.freeze({ suffix: "locations", locales: allLocales }),
  Object.freeze({ suffix: "guides/legal-cannabis-tourists", locales: allLocales }),
  Object.freeze({ suffix: "labs-dispensary-pattaya", locales: allLocales }),
  // Контент есть на всех 7 локалях и в `PAGE_COPY`, и в `content-cache`.
  Object.freeze({ suffix: "cannabis-near-me-pattaya", locales: allLocales }),
  // Транзакционный интент. Пока только en+ru: на остальных локалях страницы не
  // прошли вычитку носителем после машинной чистки кэша.
  Object.freeze({ suffix: "buy-cannabis-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "best-cannabis-shop-pattaya", locales: enRuLocales }),
  // Запрос про «дёшево» допустим, страница про него — нет: на ней нет ни цены,
  // ни скидки, ни «самого дешёвого», только от чего цена зависит.
  Object.freeze({ suffix: "cheap-weed-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "delivery/pattaya", locales: enRuLocales }),

  // --- Волна 2: новые сильные страницы -------------------------------------
  // Сущность бизнеса и знаниевый кластер — на всех семи локалях: текст написан
  // отдельно под каждую, а не переведён машинно.
  Object.freeze({ suffix: "about", locales: allLocales }),
  Object.freeze({ suffix: "guides", locales: allLocales }),
  Object.freeze({ suffix: "guides/prescription-pattaya", locales: allLocales }),
  Object.freeze({ suffix: "guides/first-visit-pattaya", locales: allLocales }),
  // Гид по выбору и кластер сортов — пока en+ru: на остальных локалях эти
  // страницы отдают заглушку и остаются noindex, потому что вычитанного
  // носителем текста нет, а машинный перевод описания сорта — та самая тонкая
  // страница, которая вредит.
  Object.freeze({ suffix: "guides/choosing-flower-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "strains", locales: enRuLocales }),
  Object.freeze({ suffix: "strains/white-widow", locales: enRuLocales }),
  Object.freeze({ suffix: "strains/blue-dream", locales: enRuLocales }),
  Object.freeze({ suffix: "strains/og-kush", locales: enRuLocales }),
  // Гео: индексируются ровно те районы, для которых написан авторский маршрут в
  // `AREA_ROUTES`. Район без маршрута шаблон вообще не генерирует — см.
  // `src/pages/[lang]/areas/[area].astro`.
  Object.freeze({ suffix: "areas/walking-street", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/soi-buakhao", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/central-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/jomtien", locales: enRuLocales }),
]);

/**
 * Локали, на которых у маршрута есть НАСТОЯЩАЯ страница.
 *
 * Это не то же самое, что `INDEX_POLICY_RULES`: `delivery/pattaya` индексируется
 * на en+ru, но собран как полноценная страница на всех семи локалях, и вести
 * тайского читателя с неё на `/th/` было бы потерей. А вот `strains/*`,
 * `guides/choosing-flower-pattaya` и коммерческая тройка `buy-/best-/cheap-` на
 * остальных пяти локалях — это либо страница-надгробие «страница снята с
 * публикации», либо 301 из `vercel.json` на `/:lang/locations/`.
 *
 * Переключатель языка обязан строиться отсюда: раньше он рендерил ссылки на все
 * семь локалей независимо от того, есть ли перевод, и с самых коммерческих
 * страниц отправлял тайского, китайского, корейского и японского посетителя
 * либо в редирект на посторонний раздел, либо на заглушку в 160–431 символ.
 *
 * @type {ReadonlyMap<string, readonly IndexLocale[]>}
 */
const ROUTE_LOCALES = new Map([
  ["buy-cannabis-pattaya", enRuLocales],
  ["best-cannabis-shop-pattaya", enRuLocales],
  ["cheap-weed-pattaya", enRuLocales],
  ["strains", enRuLocales],
  ["strains/white-widow", enRuLocales],
  ["strains/blue-dream", enRuLocales],
  ["strains/og-kush", enRuLocales],
  ["guides/choosing-flower-pattaya", enRuLocales],
  ["areas/walking-street", enRuLocales],
  ["areas/soi-buakhao", enRuLocales],
  ["areas/central-pattaya", enRuLocales],
  ["areas/jomtien", enRuLocales],
]);

/**
 * Локали, для которых страница по этому суффиксу действительно существует.
 * Для маршрутов вне `ROUTE_LOCALES` — все семь.
 *
 * @param {string} pathSuffix
 * @returns {readonly IndexLocale[]}
 */
export function getAvailableLocales(pathSuffix = "") {
  return ROUTE_LOCALES.get(normalizePathSuffix(pathSuffix)) ?? INDEX_LOCALES;
}

const EMPTY_LOCALES = Object.freeze([]);
const localesBySuffix = new Map();

for (const rule of INDEX_POLICY_RULES) {
  if (localesBySuffix.has(rule.suffix)) {
    throw new Error(`Duplicate index policy suffix: ${rule.suffix || "<home>"}`);
  }
  localesBySuffix.set(rule.suffix, rule.locales);
}

export const EXPECTED_INDEXABLE_PAGE_COUNT = INDEX_POLICY_RULES.reduce(
  (total, rule) => total + rule.locales.length,
  0,
);

export function normalizePathSuffix(pathSuffix = "") {
  return pathSuffix.replace(/^\/+|\/+$/g, "");
}

/**
 * @param {string} locale
 * @param {string} pathSuffix
 */
export function getIndexPolicy(locale, pathSuffix = "") {
  const suffix = normalizePathSuffix(pathSuffix);
  const locales = localesBySuffix.get(suffix) ?? EMPTY_LOCALES;
  return Object.freeze({
    locale,
    suffix,
    locales,
    indexable: locales.includes(/** @type {IndexLocale} */ (locale)),
  });
}

/**
 * @param {string} pathname
 */
export function getIndexPolicyForPathname(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const [locale = "", ...suffixParts] = clean ? clean.split("/") : [];
  if (!INDEX_LOCALES.includes(/** @type {IndexLocale} */ (locale))) {
    return Object.freeze({ locale, suffix: suffixParts.join("/"), locales: EMPTY_LOCALES, indexable: false });
  }
  return getIndexPolicy(locale, suffixParts.join("/"));
}

/**
 * @param {IndexLocale} locale
 * @param {string} pathSuffix
 */
export function localePathname(locale, pathSuffix = "") {
  const suffix = normalizePathSuffix(pathSuffix);
  return suffix ? `/${locale}/${suffix}/` : `/${locale}/`;
}
