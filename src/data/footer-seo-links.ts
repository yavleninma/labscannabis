import { getIndexPolicy, normalizePathSuffix } from "@/lib/index-policy.mjs";
import { localePath, type Locale } from "@/lib/i18n";
import type { UiStrings } from "@/lib/ui";

/**
 * Внутренняя перелинковка: футер и контекстные блоки (W1-16).
 *
 * Прежний файл экспортировал `FOOTER_SEO_SECTIONS` и не импортировался ни
 * одной страницей, а половина его слагов вела в никуда: `areas/pattaya`,
 * `areas/soi-buakhao`, `delivery/jomtien`, `strains/white-widow`, `wholesale` —
 * страницы, которые либо не индексируются, либо перекрыты 301. Возвращённая в
 * индекс страница без входящей ссылки на своей локали остаётся сиротой, и
 * `scripts/check-seo.mjs` валит сборку именно за это.
 *
 * Отсюда два правила, которым подчиняется весь файл:
 *
 * 1. Слаги перечисляются один раз и фильтруются через `getIndexPolicy`, а не
 *    хардкодом `locale === "en" || locale === "ru"`. Добавили слаг в
 *    `INDEX_POLICY_RULES` — ссылка сама появилась ровно на тех локалях, где цель
 *    indexable; убрали — исчезла. Ссылку на noindex-цель чекер не пропустит.
 * 2. Ссылка на саму себя исключается. Футер и контекстный блок стоят на той же
 *    странице, куда ведут, и `check-seo` считает такой якорь ошибкой
 *    («contextual SEO link points to itself»), а человеку он бесполезен.
 */

type FooterSeoTitleKey = "areasTitle" | "buyTitle" | "moreTitle";
type SeoLinkLabelKey = keyof UiStrings["footerSeo"];

/**
 * Подпись для слага — один источник и для футера, и для `RelatedLinks`.
 * Якорь обязан называть интент («От чего зависит цена»), а не место
 * («Паттайя»): иначе он не несёт смысла ни человеку, ни краулеру.
 */
export const SEO_LINK_LABEL_KEYS: Readonly<Record<string, SeoLinkLabelKey>> = {
  "cannabis-near-me-pattaya": "nearMe",
  "buy-cannabis-pattaya": "buyPattaya",
  "best-cannabis-shop-pattaya": "bestShop",
  "cheap-weed-pattaya": "priceFactors",
  "labs-dispensary-pattaya": "labsDispensary",
  "areas/walking-street": "walkingStreetRoute",
  "delivery/pattaya": "pattayaDelivery",
  "guides/legal-cannabis-tourists": "legalGuide",
  locations: "allPages",
};

export interface SeoLink {
  /** `pathSuffix` в терминах `INDEX_POLICY_RULES`. */
  suffix: string;
  labelKey: SeoLinkLabelKey;
  href: string;
}

export interface FooterSeoSection {
  titleKey: FooterSeoTitleKey;
  links: SeoLink[];
}

/**
 * Группы футера. Порядок внутри группы — от самого горячего интента к самому
 * холодному: футер читают сверху вниз и до конца доходят не все.
 */
const FOOTER_SEO_SECTIONS: readonly Readonly<{
  titleKey: FooterSeoTitleKey;
  suffixes: readonly string[];
}>[] = [
  {
    titleKey: "buyTitle",
    suffixes: [
      "cannabis-near-me-pattaya",
      "buy-cannabis-pattaya",
      "best-cannabis-shop-pattaya",
      "cheap-weed-pattaya",
    ],
  },
  {
    titleKey: "areasTitle",
    suffixes: ["areas/walking-street", "delivery/pattaya", "locations"],
  },
  {
    titleKey: "moreTitle",
    suffixes: ["labs-dispensary-pattaya", "guides/legal-cannabis-tourists"],
  },
];

/**
 * Смысловые соседи страницы. Ключ — `pathSuffix`, значение — куда человеку
 * логично пойти дальше, в порядке убывания близости интента.
 *
 * Главная перечисляет весь возвращённый набор целиком: тогда любая
 * indexable-страница достижима из неё в один клик, а не в два.
 */
const RELATED_SUFFIXES: Readonly<Record<string, readonly string[]>> = {
  "": [
    "cannabis-near-me-pattaya",
    "buy-cannabis-pattaya",
    "best-cannabis-shop-pattaya",
    "cheap-weed-pattaya",
    "areas/walking-street",
    "delivery/pattaya",
    "labs-dispensary-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "labs-dispensary-pattaya": ["cannabis-near-me-pattaya", "areas/walking-street", "locations"],
  "cannabis-near-me-pattaya": ["areas/walking-street", "buy-cannabis-pattaya", "delivery/pattaya"],
  "buy-cannabis-pattaya": [
    "cannabis-near-me-pattaya",
    "cheap-weed-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "best-cannabis-shop-pattaya": [
    "labs-dispensary-pattaya",
    "cannabis-near-me-pattaya",
    "cheap-weed-pattaya",
  ],
  "cheap-weed-pattaya": [
    "buy-cannabis-pattaya",
    "best-cannabis-shop-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "areas/walking-street": ["cannabis-near-me-pattaya", "delivery/pattaya", "locations"],
  "delivery/pattaya": [
    "areas/walking-street",
    "cannabis-near-me-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "guides/legal-cannabis-tourists": [
    "labs-dispensary-pattaya",
    "cannabis-near-me-pattaya",
    "locations",
  ],
  contact: ["labs-dispensary-pattaya", "locations", "guides/legal-cannabis-tourists"],
};

/**
 * Для страниц, у которых собственного списка соседей нет — гео-сетка, сорта,
 * вес, опт. Все они noindex, но человек на них попадает, и уводить его надо в
 * то, что живо.
 */
const DEFAULT_RELATED: readonly string[] = [
  "cannabis-near-me-pattaya",
  "labs-dispensary-pattaya",
  "areas/walking-street",
  "guides/legal-cannabis-tourists",
];

function resolveLinks(
  locale: Locale,
  suffixes: readonly string[],
  currentSuffix: string,
): SeoLink[] {
  const current = normalizePathSuffix(currentSuffix);
  const links: SeoLink[] = [];
  for (const raw of suffixes) {
    const suffix = normalizePathSuffix(raw);
    if (suffix === current) continue;
    if (!getIndexPolicy(locale, suffix).indexable) continue;
    const labelKey = SEO_LINK_LABEL_KEYS[suffix];
    if (!labelKey) continue;
    links.push({ suffix, labelKey, href: localePath(locale, suffix) });
  }
  return links;
}

/** Группы футера без пустых: группа из нуля ссылок — это заголовок ни над чем. */
export function getFooterSeoSections(locale: Locale, currentSuffix = ""): FooterSeoSection[] {
  return FOOTER_SEO_SECTIONS.map((section) => ({
    titleKey: section.titleKey,
    links: resolveLinks(locale, section.suffixes, currentSuffix),
  })).filter((section) => section.links.length > 0);
}

/** Соседи страницы, максимум `limit` штук; пустой массив — блок не рендерится. */
export function getRelatedLinks(locale: Locale, currentSuffix = "", limit = 3): SeoLink[] {
  const current = normalizePathSuffix(currentSuffix);
  const suffixes = RELATED_SUFFIXES[current] ?? DEFAULT_RELATED;
  return resolveLinks(locale, suffixes, current).slice(0, limit);
}
