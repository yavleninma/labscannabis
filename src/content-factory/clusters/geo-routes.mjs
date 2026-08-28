/**
 * КЛАСТЕР «КАК ДОБРАТЬСЯ ОТ ОРИЕНТИРА» (`getting-here/<слаг>`).
 *
 * Третий кластер контент-завода. Контракт общий и описан в
 * `docs/growth/CONTENT-FACTORY.md`; здесь — только то, что отличается.
 *
 * ЧЕМ ОН ОТЛИЧАЕТСЯ ОТ ДВУХ ПРЕДЫДУЩИХ. У сорта уникальность в свойствах
 * объекта, у вопросной страницы — в составе вопросов. Здесь уникальность
 * начинается с ЧИСЛА, которого в тексте нет: расстояние и время печатает
 * `describeLandmarkWalk()` из `src/lib/geo.ts`, считая гаверсинус между пином
 * магазина и координатой ориентира. Ни одной цифры метров или минут в данных
 * этого кластера нет — за этим следит блокирующая `checkHandWrittenDistances()`
 * в `scripts/check-seo.mjs`.
 *
 * ОТКУДА БЕРЁТСЯ ТЕКСТ. Из двух файлов сразу, и это существенно:
 *   • `src/data/landmarks.ts` — фактура маршрута (чем едут, где пересадка,
 *     что видно по пути, где ошибаются поворотом, чем день отличается от
 *     вечера). Её собрала стадия данных вместе с координатами и источниками;
 *   • `src/data/geo-routes.ts` — авторские разделы, лид, происхождение
 *     координаты и вопросы, написанные отдельно для каждого ориентира.
 * Кластер их не копирует и не переписывает: он склеивает ровно то, что
 * отрисует `src/components/GeoRouteArticle.astro`, и в том же порядке.
 *
 * ЧЕГО ЗДЕСЬ НЕТ И НЕ ДОЛЖНО БЫТЬ. Ориентира, про который нечего сказать сверх
 * расстояния. Такая страница отличалась бы от соседней только заголовком, её
 * отклонили бы ворота — и правильно бы сделали. Отказы перечислены явно в
 * `GEO_ROUTE_EXCLUSIONS` вместе с причиной, а `assertGeoRouteCoverage()` ниже
 * не даёт ориентиру потеряться молча: каждый слаг из `LANDMARKS` обязан быть
 * либо страницей, либо записанным отказом.
 */

import { LANDMARKS } from "../../data/landmarks.ts";
import {
  GEO_ROUTES,
  GEO_ROUTE_EXCLUSIONS,
  GEO_ROUTE_LABELS,
  geoRouteSuffix,
} from "../../data/geo-routes.ts";

/**
 * ОТК покрытия набора ориентиров.
 *
 * Ловит ровно один класс ошибок: ориентир добавили в `LANDMARKS` и забыли
 * решить его судьбу. Молчаливое «нет страницы» неотличимо от «страницу забыли»,
 * поэтому отказ обязан быть записан словами.
 */
export function assertGeoRouteCoverage() {
  const excluded = new Set(GEO_ROUTE_EXCLUSIONS.map((item) => item.slug));
  const known = new Set(Object.keys(GEO_ROUTES));
  for (const item of GEO_ROUTE_EXCLUSIONS) {
    if (known.has(item.slug)) {
      throw new Error(`Geo routes: ${item.slug} одновременно в GEO_ROUTES и в GEO_ROUTE_EXCLUSIONS`);
    }
    if (!item.reason?.trim()) {
      throw new Error(`Geo routes: отказ по ${item.slug} записан без причины`);
    }
  }
  for (const slug of known) {
    if (!LANDMARKS.some((landmark) => landmark.slug === slug)) {
      throw new Error(`Geo routes: маршрут ${slug} не имеет ориентира в LANDMARKS — расстояние считать не из чего`);
    }
  }
  for (const landmark of LANDMARKS) {
    if (known.has(landmark.slug) || excluded.has(landmark.slug)) continue;
    throw new Error(
      `Geo routes: ориентир ${landmark.slug} не получил ни страницы, ни записанного отказа — ` +
        "добавьте его в GEO_ROUTES или в GEO_ROUTE_EXCLUSIONS с причиной",
    );
  }
}

assertGeoRouteCoverage();

/**
 * Ориентир без фактуры маршрута на этой локали страницы не получает.
 *
 * Это второе условие сверх написанного копирайта: авторские разделы без
 * `travel` дали бы страницу «как добраться», в которой не сказано, как
 * добраться. Оба набора данных обязаны быть на одной локали.
 *
 * @param {string} slug
 * @param {string} locale
 */
export function getGeoRouteTravel(slug, locale) {
  const landmark = LANDMARKS.find((item) => item.slug === slug);
  return landmark?.travel?.[locale] ?? null;
}

/**
 * СОБСТВЕННЫЙ ТЕКСТ СТРАНИЦЫ в порядке вывода `GeoRouteArticle.astro`.
 *
 * Порядок и состав обязаны совпадать с шаблоном: ворота меряют это, а вторая
 * ступень ОТК меряет то же самое по отрисованному `dist/`.
 *
 * Чего здесь СОЗНАТЕЛЬНО нет: вычисленной строки расстояния
 * (`describeLandmarkWalk`). Она печатается шаблоном, но берётся из `geo.ts`,
 * который тянет алиасы `@/` и голым Node не читается. Расхождение от этого
 * идёт в безопасную сторону — страница по `dist/` чуть длиннее и чуть более
 * уникальна, чем по данным, — и оно то же самое, что у кластера вопросов.
 *
 * @param {import("../../data/geo-routes.ts").GeoRouteCopy} copy
 * @param {import("../../data/landmarks.ts").LandmarkTravel} travel
 * @param {import("../../data/geo-routes.ts").GeoRouteLabels} labels
 */
function ownText(copy, travel, labels) {
  return [
    copy.kicker,
    copy.h1,
    copy.lead,
    labels.arrivalTitle,
    ...travel.legs.flatMap((leg) => [labels.modes[leg.mode], leg.body]),
    labels.waypointsTitle,
    ...travel.waypoints,
    labels.wrongTurnTitle,
    travel.wrongTurn,
    labels.dayEveningTitle,
    travel.dayAndEvening,
    ...copy.sections.flatMap((section) => [section.h2, ...section.body]),
    labels.provenanceTitle,
    ...copy.provenance,
    travel.basis,
    labels.faqTitle,
    ...copy.faq.flatMap((item) => [item.q, item.a]),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Ключи подписей в `src/i18n/<locale>/ui.json`. Слаг без ключа не получит ни
 * одной входящей контекстной ссылки, а `check-seo` считает такую
 * indexable-страницу сиротой и валит сборку.
 */
const LINK_LABEL_KEYS = {
  "getting-here/terminal-21": "routeTerminal21",
  "getting-here/central-marina": "routeCentralMarina",
  "getting-here/north-pattaya-bus-terminal": "routeBusTerminal",
  "getting-here/pattaya-railway-station": "routeRailwayStation",
  "getting-here/u-tapao-airport": "routeUTapao",
  "getting-here/sanctuary-of-truth": "routeSanctuary",
  "getting-here/wong-amat-beach": "routeWongAmat",
  "getting-here/big-buddha": "routeBigBuddha",
};

/**
 * Смысловые соседи.
 *
 * Связи проведены по СОДЕРЖАНИЮ, а не по алфавиту: маршруты, у которых общая
 * механика (пересадка на кругу, прибытие извне города, односторонняя пара
 * улиц), ссылаются друг на друга, потому что человек, стоящий в одной из этих
 * точек, реально выбирает между ними. Наружу каждый уходит в написанный руками
 * гео-маршрут и в хаб `locations`. Список фильтруется политикой индексации,
 * поэтому ссылка на не прошедшую ворота страницу исчезает сама.
 */
const RELATED = {
  "getting-here/terminal-21": [
    "getting-here/central-marina",
    "getting-here/north-pattaya-bus-terminal",
    "areas/central-pattaya",
    "locations",
  ],
  "getting-here/central-marina": [
    "getting-here/terminal-21",
    "getting-here/wong-amat-beach",
    "areas/central-pattaya",
    "locations",
  ],
  "getting-here/north-pattaya-bus-terminal": [
    "getting-here/pattaya-railway-station",
    "getting-here/terminal-21",
    "guides/first-visit-pattaya",
    "locations",
  ],
  "getting-here/pattaya-railway-station": [
    "getting-here/north-pattaya-bus-terminal",
    "getting-here/u-tapao-airport",
    "guides/first-visit-pattaya",
    "locations",
  ],
  "getting-here/u-tapao-airport": [
    "getting-here/pattaya-railway-station",
    "getting-here/north-pattaya-bus-terminal",
    "guides/legal-cannabis-tourists",
    "locations",
  ],
  "getting-here/sanctuary-of-truth": [
    "getting-here/wong-amat-beach",
    "getting-here/central-marina",
    "areas/walking-street",
    "locations",
  ],
  "getting-here/wong-amat-beach": [
    "getting-here/sanctuary-of-truth",
    "getting-here/central-marina",
    "areas/jomtien",
    "locations",
  ],
  "getting-here/big-buddha": [
    "areas/walking-street",
    "getting-here/u-tapao-airport",
    "areas/jomtien",
    "locations",
  ],
};

/** @type {import("../registry.mjs").FactoryCluster} */
export const GEO_ROUTES_CLUSTER = {
  id: "geo-routes",
  // Хаб кластера — `locations`: страница-личность, написанная руками, на всех
  // семи локалях. Второго хаба «все маршруты» здесь нет намеренно — он был бы
  // страницей из одних ссылок.
  hubSuffix: "locations",
  linkLabelKeys: LINK_LABEL_KEYS,
  related: RELATED,
  candidates() {
    const list = [];
    // Слаги и локали перебираются в отсортированном порядке: вердикт ворот не
    // должен зависеть от порядка ключей в объекте с копирайтом.
    for (const slug of Object.keys(GEO_ROUTES).sort()) {
      const byLocale = GEO_ROUTES[slug];
      for (const locale of Object.keys(byLocale).sort()) {
        const copy = byLocale[locale];
        const travel = getGeoRouteTravel(slug, locale);
        const labels = GEO_ROUTE_LABELS[locale];
        // Нет фактуры маршрута или структурных подписей на этой локали —
        // кандидата нет вовсе, а не есть кандидат с дырой в середине.
        if (!copy || !travel || !labels) continue;
        list.push({
          clusterId: "geo-routes",
          locale,
          suffix: geoRouteSuffix(slug),
          title: copy.title,
          h1: copy.h1,
          text: ownText(copy, travel, labels),
        });
      }
    }
    return list;
  },
};
