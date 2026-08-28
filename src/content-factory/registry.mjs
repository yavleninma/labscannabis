/**
 * РЕЕСТР КОНТЕНТ-ЗАВОДА.
 *
 * Единственное место, где кластеры собираются вместе и где по ним прогоняются
 * ворота качества (`scripts/lib/quality-gate.mjs`). Всё, что ниже, —
 * производные от одного вычисления: политика индексации, локали маршрута,
 * подписи ссылок и соседи.
 *
 * ПОЧЕМУ ЭТО ВЫЧИСЛЕНИЕ, А НЕ ФАЙЛ. Вердикт ворот нигде не хранится: он
 * считается заново при каждом импорте этого модуля — и в `astro.config.mjs`
 * (фильтр sitemap), и в `PageLayout.astro` (`<meta name="robots">`), и в
 * `check-seo.mjs`. Сборке запрещено писать в рабочее дерево (CI делает
 * `git diff --exit-code`), поэтому «сгенерировать allowlist и закоммитить» —
 * не вариант; а если бы он и был, закоммиченный allowlist разошёлся бы с
 * текстом при первой же правке копирайта.
 *
 * ЧТО ЗАВОД НЕ РЕШАЕТ. Страницы-личности — главная, контакты, `about`, хабы
 * кластеров — остаются в ручном списке `MANUAL_INDEX_POLICY_RULES` в
 * `src/lib/index-policy.mjs`. У них нет источника данных, по которому можно
 * посчитать вердикт, и их количество не растёт.
 *
 * КАК ДОБАВИТЬ КЛАСТЕР: `docs/growth/CONTENT-FACTORY.md`.
 */

import { evaluateCandidates } from "../../scripts/lib/quality-gate.mjs";
import { GEO_ROUTES_CLUSTER } from "./clusters/geo-routes.mjs";
import { QUESTIONS_CLUSTER } from "./clusters/questions.mjs";
import { STRAINS_CLUSTER } from "./clusters/strains.mjs";

/**
 * @typedef {object} FactoryCluster
 * @property {string} id
 * @property {string} [hubSuffix] хаб кластера — ведётся вручную, воротами не проверяется
 * @property {Record<string, string>} [linkLabelKeys] слаг → ключ подписи в `ui.json`
 * @property {Record<string, readonly string[]>} [related] слаг → смысловые соседи
 * @property {() => import("../../scripts/lib/quality-gate.mjs").GateCandidate[]} candidates
 */

/**
 * Все кластеры завода. Порядок здесь на результат не влияет: ворота сортируют
 * кандидатов по `<locale>/<suffix>` сами.
 *
 * @type {readonly FactoryCluster[]}
 */
export const FACTORY_CLUSTERS = Object.freeze([STRAINS_CLUSTER, QUESTIONS_CLUSTER, GEO_ROUTES_CLUSTER]);

/** @type {readonly import("../../scripts/lib/quality-gate.mjs").GateCandidate[]} */
export const FACTORY_CANDIDATES = Object.freeze(
  FACTORY_CLUSTERS.flatMap((cluster) => cluster.candidates()),
);

const duplicateGuard = new Set();
for (const candidate of FACTORY_CANDIDATES) {
  const key = `${candidate.locale}/${candidate.suffix}`;
  if (duplicateGuard.has(key)) {
    throw new Error(`Content factory: two clusters claim the same page ${key}`);
  }
  duplicateGuard.add(key);
}

/**
 * Вердикты ворот. Считаются один раз на процесс — модуль ES кэшируется.
 *
 * Корпус для сравнения здесь — только другие кандидаты завода. Текст страниц,
 * написанных руками, лежит в `.ts`-модулях вёрстки и на этом этапе недоступен;
 * сравнение с ним делает вторая ступень ОТК в `scripts/check-seo.mjs` уже по
 * отрисованному `dist/`.
 *
 * @type {ReadonlyMap<string, import("../../scripts/lib/quality-gate.mjs").GateVerdict>}
 */
export const FACTORY_VERDICTS = evaluateCandidates(FACTORY_CANDIDATES);

/**
 * @param {string} locale
 * @param {string} suffix
 */
export function getFactoryVerdict(locale, suffix) {
  return FACTORY_VERDICTS.get(`${locale}/${suffix.replace(/^\/+|\/+$/g, "")}`) ?? null;
}

/**
 * Правила индексации, порождённые заводом: слаг → локали, ПРОШЕДШИЕ ворота.
 * Формат совпадает с `MANUAL_INDEX_POLICY_RULES`, чтобы оба списка можно было
 * просто склеить.
 *
 * @returns {readonly Readonly<{ suffix: string, locales: readonly string[] }>[]}
 */
export function getFactoryIndexRules() {
  /** @type {Map<string, string[]>} */
  const bySuffix = new Map();
  for (const verdict of FACTORY_VERDICTS.values()) {
    if (!verdict.admitted) continue;
    if (!bySuffix.has(verdict.suffix)) bySuffix.set(verdict.suffix, []);
    bySuffix.get(verdict.suffix).push(verdict.locale);
  }
  return Object.freeze(
    [...bySuffix.entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([suffix, locales]) => Object.freeze({ suffix, locales: Object.freeze(locales.sort()) })),
  );
}

/**
 * Локали, на которых заводская страница ВООБЩЕ СОБИРАЕТСЯ, — независимо от
 * вердикта ворот.
 *
 * Это не то же, что `getFactoryIndexRules()`. Не прошедшая ворота страница
 * остаётся доступной посетителю и краулеру, просто под `noindex` и вне
 * sitemap. `getStaticPaths()` в шаблоне обязан брать локали отсюда: если брать
 * их из политики индексации, отклонённая страница исчезнет вместе с URL, и
 * вместо честного noindex получится 404 на живой ссылке.
 *
 * @returns {ReadonlyMap<string, readonly string[]>}
 */
export function getFactoryRouteLocales() {
  /** @type {Map<string, string[]>} */
  const bySuffix = new Map();
  for (const candidate of FACTORY_CANDIDATES) {
    if (!bySuffix.has(candidate.suffix)) bySuffix.set(candidate.suffix, []);
    bySuffix.get(candidate.suffix).push(candidate.locale);
  }
  return new Map([...bySuffix].map(([suffix, locales]) => [suffix, Object.freeze(locales.sort())]));
}

/** Слаг → ключ подписи ссылки в `ui.json`, со всех кластеров сразу. */
export function getFactoryLinkLabelKeys() {
  return Object.assign({}, ...FACTORY_CLUSTERS.map((cluster) => cluster.linkLabelKeys ?? {}));
}

/** Слаг → смысловые соседи, со всех кластеров сразу. */
export function getFactoryRelatedSuffixes() {
  return Object.assign({}, ...FACTORY_CLUSTERS.map((cluster) => cluster.related ?? {}));
}

/** Сводка для отчётов: сколько кандидатов, сколько допущено. */
export function summarizeFactory() {
  const verdicts = [...FACTORY_VERDICTS.values()];
  return {
    clusters: FACTORY_CLUSTERS.length,
    candidates: verdicts.length,
    admitted: verdicts.filter((verdict) => verdict.admitted).length,
    rejected: verdicts.filter((verdict) => !verdict.admitted),
  };
}
