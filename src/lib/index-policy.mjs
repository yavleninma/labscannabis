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
 * @type {readonly Readonly<{ suffix: string, locales: readonly IndexLocale[] }>[]}
 */
export const INDEX_POLICY_RULES = Object.freeze([
  Object.freeze({ suffix: "", locales: allLocales }),
  Object.freeze({ suffix: "contact", locales: allLocales }),
  Object.freeze({ suffix: "locations", locales: allLocales }),
  Object.freeze({ suffix: "guides/legal-cannabis-tourists", locales: allLocales }),
  Object.freeze({ suffix: "labs-dispensary-pattaya", locales: allLocales }),
  Object.freeze({ suffix: "cannabis-near-me-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/walking-street", locales: enRuLocales }),
  Object.freeze({ suffix: "delivery/pattaya", locales: enRuLocales }),
]);

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
