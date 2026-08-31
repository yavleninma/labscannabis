import { getIndexPolicy, normalizePathSuffix } from "@/lib/index-policy.mjs";
import { getFactoryLinkLabelKeys, getFactoryRelatedSuffixes } from "@/content-factory/registry.mjs";
import { localePath, type Locale } from "@/lib/i18n";
import type { UiStrings } from "@/lib/ui";

/**
 * Внутренняя перелинковка: хабы вместо плоского графа (W1-16, T-07).
 *
 * Замер до этой правки: у каждой indexable-страницы было РОВНО одно и то же
 * число страниц-источников, потому что футер линковал всё отовсюду одинаково.
 * Одинаковый набор ссылок на каждой странице — это не «много ссылок», это ноль
 * сигнала о том, какая страница важнее: вес размазывается ровным слоем, и
 * краулер не получает ни одной подсказки о структуре.
 *
 * Поэтому файл строится на трёх слоях, и только второй и третий дают
 * `data-seo-context-link`:
 *
 * 1. СЛУЖЕБНЫЙ ФУТЕР (`getFooterServiceLinks`) — главная, контакты, локация,
 *    о компании, правовой гид. Это навигация, одинаковая на всех страницах, и
 *    именно поэтому она НЕ размечается как контекстная ссылка: помечать
 *    boilerplate тематической связью — способ снова получить плоский граф.
 * 2. СМЫСЛОВЫЕ СОСЕДИ (`RELATED_SUFFIXES`) — свой список у каждого слага. С
 *    «купить» человек идёт в «от чего зависит цена» и в рецепт, с района — в
 *    соседний район и в маршрут, с гайда — в следующий гайд.
 * 3. ХАБЫ (`HUB_SUFFIXES`) и добор (`SPILLOVER_SUFFIXES`) — когда соседей у
 *    страницы меньше лимита, добор идёт в страницы, которым вес нужен больше
 *    всего: сущность бизнеса, правовой гид, страница о компании. Это и есть
 *    явные веса: разброс числа источников по набору перестаёт быть константой.
 *
 * Два инварианта, которые держат весь файл:
 *
 * • Слаги перечисляются один раз и фильтруются через `getIndexPolicy`, а не
 *   хардкодом `locale === "en" || locale === "ru"`. Добавили слаг в
 *   `INDEX_POLICY_RULES` — ссылка сама появилась ровно на тех локалях, где цель
 *   indexable; убрали — исчезла. Ссылку на noindex-цель чекер не пропустит.
 * • Ссылка на саму себя исключается: `check-seo` считает такой якорь ошибкой,
 *   а человеку он бесполезен.
 *
 * `scripts/check-seo.mjs` проверяет результат с обеих сторон: у каждой
 * indexable-страницы должна быть и входящая, и исходящая контекстная ссылка на
 * её собственной локали. Первое ловит сироту, второе — тупик; до T-07 второе не
 * проверялось вовсе, и пять локалей действительно упирались в тупик.
 */

type SeoLinkLabelKey = keyof UiStrings["footerSeo"];

/**
 * Подпись для слага — один источник и для футера, и для `RelatedLinks`.
 * Якорь обязан называть интент («От чего зависит цена»), а не место
 * («Паттайя»): иначе он не несёт смысла ни человеку, ни краулеру.
 */
const HAND_WRITTEN_LABEL_KEYS: Readonly<Record<string, SeoLinkLabelKey>> = {
  "": "homePage",
  contact: "contactPage",
  "cannabis-near-me-pattaya": "nearMe",
  "buy-cannabis-pattaya": "buyPattaya",
  "best-cannabis-shop-pattaya": "bestShop",
  "cheap-weed-pattaya": "priceFactors",
  "labs-dispensary-pattaya": "labsDispensary",
  "areas/walking-street": "walkingStreetRoute",
  "areas/soi-buakhao": "soiBuakhaoRoute",
  "areas/central-pattaya": "centralPattayaRoute",
  "areas/jomtien": "jomtienRoute",
  "delivery/pattaya": "pattayaDelivery",
  "guides/legal-cannabis-tourists": "legalGuide",
  guides: "guidesHub",
  "guides/prescription-pattaya": "prescriptionGuide",
  "guides/first-visit-pattaya": "firstVisitGuide",
  "guides/choosing-flower-pattaya": "choosingGuide",
  strains: "strainsHub",
  // Подписи страниц сортов приходят из кластера завода — см. слияние ниже.
  about: "aboutUs",
  locations: "allPages",
};

/**
 * Подписи ссылок: ручные плюс объявленные кластерами контент-завода.
 *
 * Ключ, объявленный руками, побеждает: так можно переопределить подпись
 * заводской страницы, не трогая кластер. Слаг без ключа не получит ни одной
 * входящей контекстной ссылки, а `check-seo` считает indexable-страницу без
 * входящих ссылок сиротой и валит сборку, — поэтому у кластера объявление
 * подписи входит в контракт (`docs/growth/CONTENT-FACTORY.md`).
 */
export const SEO_LINK_LABEL_KEYS: Readonly<Record<string, SeoLinkLabelKey>> = {
  ...(getFactoryLinkLabelKeys() as Record<string, SeoLinkLabelKey>),
  ...HAND_WRITTEN_LABEL_KEYS,
};

export interface SeoLink {
  /** `pathSuffix` в терминах `INDEX_POLICY_RULES`. */
  suffix: string;
  labelKey: SeoLinkLabelKey;
  href: string;
}

/**
 * Служебный минимум футера (T-07).
 *
 * Здесь стояли три тематические группы на 15 слагов, и они уходили в футер
 * каждой страницы. Из boilerplate убрано всё, кроме того, что человек ищет в
 * футере любого сайта: где мы, кто мы и что говорит закон. Главная и контакты
 * уже стоят отдельной строкой выше в `Footer.astro`, поэтому здесь их нет.
 *
 * Эти ссылки сознательно НЕ размечаются `data-seo-context-link`.
 */
const FOOTER_SERVICE_SUFFIXES: readonly string[] = [
  "locations",
  "about",
  "guides/legal-cannabis-tourists",
  /*
   * Два хаба кластеров добавлены сюда после замера глубины клика от главной:
   * {1 клик: 19 страниц, 2: 90, 3: 57, 4: 20} — то есть 77 из 187
   * indexable-URL лежали в трёх и более кликах от главной на сайте, где ничему
   * не нужно быть глубже двух. Причина была прямая: сквозной навигации к
   * кластерам не существовало вовсе. Шапка даёт две настоящие ссылки (две
   * оставшиеся — якоря на той же странице), футер добавлял три, итого пять
   * постоянных адресов на весь сайт — а хаб сортов, под которым лежит
   * двадцать страниц, и хаб гайдов не входили ни в одну из пятёрок.
   *
   * Почему именно футер, а не шапка: навигация в шапке скрыта до 768px
   * (`hidden … md:flex`), а Google индексирует мобильной версией. Ссылка,
   * которой нет в мобильной разметке, чинит меню на десктопе и не чинит обход.
   *
   * Как и остальные три, эти НЕ размечаются `data-seo-context-link`: сквозной
   * блок не должен считаться тематической связью — иначе граф снова станет
   * плоским, а `check-seo` именно это и ловит замером min/max источников.
   */
  "strains",
  "guides",
];

/**
 * Хабы: страницы, которым вес нужен больше всего.
 *
 * `labs-dispensary-pattaya` — брендовая страница, на которой сайт заявляет,
 * что LABS DISPENSARY и есть этот магазин; `guides/legal-cannabis-tourists` —
 * единственный кластер, где первое место берётся честной работой;
 * `about` — сущность бизнеса, единственный канал, которым сайт расшивает
 * склейку с чужим магазином. Порядок значим: он же порядок добора.
 */
const HUB_SUFFIXES: readonly string[] = [
  "about",
  "labs-dispensary-pattaya",
  "guides/legal-cannabis-tourists",
];

/**
 * Добор после хабов — чтобы блок не оставался полупустым на локалях, где
 * indexable-набор меньше, и чтобы тупиковые локали (th/ar/zh/ko/ja) получали
 * исходящие ссылки в знаниевый кластер, а не в один только футер.
 */
const SPILLOVER_SUFFIXES: readonly string[] = [
  "guides",
  "guides/prescription-pattaya",
  "guides/first-visit-pattaya",
  "cannabis-near-me-pattaya",
  "locations",
  "guides/choosing-flower-pattaya",
  "strains",
  "best-cannabis-shop-pattaya",
  "buy-cannabis-pattaya",
  "areas/walking-street",
];

/**
 * Смысловые соседи страницы. Ключ — `pathSuffix`, значение — куда человеку
 * логично пойти дальше, в порядке убывания близости интента.
 *
 * Каждая indexable-страница обязана встречаться в этой таблице как цель хотя бы
 * один раз — иначе она сирота, и `check-seo` роняет сборку. Списки написаны так,
 * чтобы у коммерческой страницы источники были разного типа: соседняя
 * коммерческая, гео-маршрут и гайд, а не три одинаковых.
 */
const HAND_WRITTEN_RELATED: Readonly<Record<string, readonly string[]>> = {
  // Главная — хаб первого уровня: с неё в один клик достижим весь горячий набор.
  "": [
    "cannabis-near-me-pattaya",
    "labs-dispensary-pattaya",
    "best-cannabis-shop-pattaya",
    "buy-cannabis-pattaya",
    "locations",
    "about",
    "guides",
    "guides/legal-cannabis-tourists",
    "guides/prescription-pattaya",
    "areas/walking-street",
    "cheap-weed-pattaya",
    "delivery/pattaya",
    "guides/first-visit-pattaya",
    "strains",
    "areas/soi-buakhao",
  ],
  "labs-dispensary-pattaya": [
    "locations",
    "about",
    "cannabis-near-me-pattaya",
    "best-cannabis-shop-pattaya",
    "areas/walking-street",
    "",
  ],
  "cannabis-near-me-pattaya": [
    "areas/walking-street",
    "areas/soi-buakhao",
    "areas/jomtien",
    "buy-cannabis-pattaya",
    "locations",
    "labs-dispensary-pattaya",
    "delivery/pattaya",
  ],
  "buy-cannabis-pattaya": [
    "cannabis-near-me-pattaya",
    "cheap-weed-pattaya",
    "guides/prescription-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "best-cannabis-shop-pattaya": [
    "labs-dispensary-pattaya",
    "guides/choosing-flower-pattaya",
    // Хаб сортов: замер входящих показал, что двадцать страниц кластера кормят
    // свой же хаб (20 из 24 источников — его собственные дети), а снаружи в него
    // ведут четыре ссылки. Хаб, который питается детьми, перекладывает вес
    // внутри кластера вместо того, чтобы вносить его извне. «Лучший магазин» —
    // это ровно вопрос «что у вас есть», и дверь отсюда в кластер уместна.
    "strains",
    "cannabis-near-me-pattaya",
    "cheap-weed-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "cheap-weed-pattaya": [
    "buy-cannabis-pattaya",
    "best-cannabis-shop-pattaya",
    "guides/choosing-flower-pattaya",
    "cannabis-near-me-pattaya",
    "contact",
  ],
  "delivery/pattaya": [
    "locations",
    "areas/walking-street",
    "areas/jomtien",
    "guides/legal-cannabis-tourists",
    "cannabis-near-me-pattaya",
    "guides/first-visit-pattaya",
  ],
  locations: [
    "labs-dispensary-pattaya",
    "areas/walking-street",
    "areas/soi-buakhao",
    "areas/central-pattaya",
    "areas/jomtien",
    "contact",
  ],
  contact: [
    "locations",
    "labs-dispensary-pattaya",
    "guides/first-visit-pattaya",
    "guides/legal-cannabis-tourists",
    "",
  ],
  about: [
    "labs-dispensary-pattaya",
    "locations",
    "guides/legal-cannabis-tourists",
    "contact",
    "",
    "best-cannabis-shop-pattaya",
  ],
  guides: [
    "guides/legal-cannabis-tourists",
    "guides/prescription-pattaya",
    // Дверь в вопросный кластер с хаба знаний. Она нужна не только людям: на
    // th/ar/zh/ko/ja соседи вопросных страниц объявлены внутри кластера и почти
    // все указывают на темы, которых на этих локалях нет, — то есть новая
    // страница осталась бы сиротой, и `check-seo` валит сборку именно за это.
    // Хаб гайдов indexable на всех семи локалях, поэтому ссылка появляется
    // ровно там, где цель существует.
    "questions/rules-and-prescription",
    "guides/first-visit-pattaya",
    "guides/choosing-flower-pattaya",
    "strains",
    "",
  ],
  "guides/legal-cannabis-tourists": [
    "guides/prescription-pattaya",
    // Вопрос «накажут ли меня дома» — прямое продолжение правового гида, и на
    // ar/zh/ko/ja это самый тревожный запрос рынка. На th такой страницы нет
    // (вопрос для тайского читателя не стоит), и ссылка там просто не
    // отрисуется: `resolveLinks` фильтрует цели политикой индексации.
    "questions/taking-it-home",
    "guides/first-visit-pattaya",
    "guides",
    "about",
    "buy-cannabis-pattaya",
  ],
  "guides/prescription-pattaya": [
    "guides/legal-cannabis-tourists",
    "guides/first-visit-pattaya",
    "guides",
    "buy-cannabis-pattaya",
  ],
  "guides/first-visit-pattaya": [
    "guides/prescription-pattaya",
    "guides/choosing-flower-pattaya",
    "guides/legal-cannabis-tourists",
    "strains",
    "areas/walking-street",
  ],
  "guides/choosing-flower-pattaya": [
    "strains",
    "strains/white-widow",
    "guides/first-visit-pattaya",
    "best-cannabis-shop-pattaya",
  ],
  // Хаб кластера ссылается по ОДНОМУ представителю от каждой ароматической
  // группы, а не на все двадцать сортов: полный список уже стоит в теле
  // страницы, сгруппированный по запаху, и дублировать его в блоке соседних
  // ссылок значит показать те же двадцать имён второй раз без порядка.
  strains: [
    "strains/white-widow",
    "strains/og-kush",
    "strains/blue-dream",
    "strains/girl-scout-cookies",
    "strains/zkittlez",
    "guides/choosing-flower-pattaya",
  ],
  // Соседи страниц сортов объявлены в кластере завода
  // (`src/content-factory/clusters/strains.mjs`) и подмешиваются ниже.
  "areas/walking-street": [
    "areas/soi-buakhao",
    "areas/central-pattaya",
    "locations",
    "cannabis-near-me-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "areas/soi-buakhao": [
    "areas/walking-street",
    "areas/central-pattaya",
    "locations",
    "cannabis-near-me-pattaya",
    "guides/legal-cannabis-tourists",
  ],
  "areas/central-pattaya": [
    "areas/walking-street",
    "areas/jomtien",
    "areas/soi-buakhao",
    "locations",
  ],
  "areas/jomtien": [
    "areas/central-pattaya",
    "areas/walking-street",
    "delivery/pattaya",
    "locations",
    // Страница сама предлагает написать до выезда — ссылка на контакты должна
    // приходить из текста, а не только из сквозного футера.
    "contact",
  ],
};

/**
 * Соседи: объявленные кластерами контент-завода плюс ручные. Ручной список
 * побеждает — им можно перекрыть заводской, не трогая кластер.
 */
const RELATED_SUFFIXES: Readonly<Record<string, readonly string[]>> = {
  ...(getFactoryRelatedSuffixes() as Record<string, readonly string[]>),
  ...HAND_WRITTEN_RELATED,
};

/**
 * Для страниц, у которых собственного списка соседей нет — гео-сетка, вес, опт.
 * Все они noindex, но человек на них попадает, и уводить его надо в то, что
 * живо.
 */
const DEFAULT_RELATED: readonly string[] = [
  "cannabis-near-me-pattaya",
  "labs-dispensary-pattaya",
  "locations",
  "guides/legal-cannabis-tourists",
];

function resolveLinks(
  locale: Locale,
  suffixes: readonly string[],
  currentSuffix: string,
  seen = new Set<string>(),
): SeoLink[] {
  const current = normalizePathSuffix(currentSuffix);
  const links: SeoLink[] = [];
  for (const raw of suffixes) {
    const suffix = normalizePathSuffix(raw);
    if (suffix === current) continue;
    if (seen.has(suffix)) continue;
    if (!getIndexPolicy(locale, suffix).indexable) continue;
    const labelKey = SEO_LINK_LABEL_KEYS[suffix];
    if (!labelKey) continue;
    seen.add(suffix);
    links.push({ suffix, labelKey, href: localePath(locale, suffix) });
  }
  return links;
}

/**
 * Служебный набор футера — без `data-seo-context-link`, см. комментарий к
 * `FOOTER_SERVICE_SUFFIXES`. Пустой массив означает, что на этой локали ни одна
 * служебная цель не indexable; блок тогда не рендерится.
 */
export function getFooterServiceLinks(locale: Locale, currentSuffix = ""): SeoLink[] {
  return resolveLinks(locale, FOOTER_SERVICE_SUFFIXES, currentSuffix);
}

/**
 * Соседи страницы: сначала собственный список, потом хабы, потом добор.
 * Пустой массив — блок не рендерится.
 *
 * Добор — это и есть механизм весов. Страница с четырьмя соседями отдаёт два
 * слота хабам, страница с шестью — ни одного, поэтому число источников у разных
 * целей получается разным, а не константой на весь набор.
 *
 * `limit` — ПОТОЛОК ДОБОРА, А НЕ ПОТОЛОК СПИСКА.
 *
 * Здесь стояло `slice(0, limit)` по всему набору, и это молча резало то, что
 * человек написал руками. Замер: главная объявляет пятнадцать соседей при
 * `limit={12}` — три последних не рисовались вообще, и среди них `strains`,
 * хаб кластера, под которым лежит 29% индексируемого набора. То есть хаб
 * двадцати страниц не получал ссылки с самой сильной страницы сайта, а увидеть
 * это можно было только пересчитав отрисованные карточки: список в данных
 * выглядел полным. Тот же обрез, на одну ссылку, стоял на
 * `cannabis-near-me-pattaya` (семь соседей при потолке шесть).
 *
 * Своё — важнее добора: курируемый список выводится целиком, а `limit`
 * ограничивает только то, чем добирают хабы и добор. Иначе автоматический
 * механизм весов вытесняет ручное решение о смысловых связях, хотя задуман был
 * ровно наоборот.
 */
export function getRelatedLinks(locale: Locale, currentSuffix = "", limit = 6): SeoLink[] {
  const current = normalizePathSuffix(currentSuffix);
  const seen = new Set<string>();
  const curated = RELATED_SUFFIXES[current] ?? DEFAULT_RELATED;
  const links = resolveLinks(locale, curated, current, seen);
  const curatedCount = links.length;
  if (links.length < limit) {
    links.push(...resolveLinks(locale, HUB_SUFFIXES, current, seen));
  }
  if (links.length < limit) {
    links.push(...resolveLinks(locale, SPILLOVER_SUFFIXES, current, seen));
  }
  return links.slice(0, Math.max(limit, curatedCount));
}
