import {
  getFactoryIndexRules,
  getFactoryRouteLocales,
} from "../content-factory/registry.mjs";

/** @typedef {"en" | "ru" | "th" | "ar" | "zh" | "ko" | "ja"} IndexLocale */

/** @type {readonly IndexLocale[]} */
export const INDEX_LOCALES = Object.freeze(["en", "ru", "th", "ar", "zh", "ko", "ja"]);

/** @type {readonly IndexLocale[]} */
export const EN_RU_INDEX_LOCALES = Object.freeze(["en", "ru"]);

const allLocales = INDEX_LOCALES;
const enRuLocales = EN_RU_INDEX_LOCALES;

/**
 * РУЧНОЙ СПИСОК — только страницы-личности.
 *
 * Здесь остаётся то, у чего нет источника данных, по которому машина могла бы
 * посчитать вердикт, и чьё количество не растёт: главная, контакты, `about`,
 * правовой гид, хабы кластеров (`guides`, `strains`), брендовая страница,
 * коммерческая тройка и четыре гео-маршрута. Каждая из них написана отдельно,
 * прочитана человеком и попала сюда решением человека.
 *
 * Всё, что порождает КОНТЕНТ-ЗАВОД, сюда НЕ добавляется. Заводские страницы
 * попадают в allowlist по результату ворот качества
 * (`scripts/lib/quality-gate.mjs`), см. `INDEX_POLICY_RULES` ниже. Если новый
 * кластер приходится дописывать руками в этот массив — значит, он собран не по
 * контракту завода; контракт в `docs/growth/CONTENT-FACTORY.md`.
 *
 * Условие возврата слага (W1-14): у страницы есть собственный связный текст
 * после чистки `content-cache` (W1-10) и его подключения (W1-11), у неё
 * однозначный коммерческий интент, и она не дублирует соседнюю.
 *
 * Сознательно НЕ возвращены:
 * - `areas/*` сверх пяти маршрутных (`walking-street`, `soi-buakhao`,
 *   `central-pattaya`, `jomtien`, `south-pattaya`) — для остальных районов
 *   авторского маршрута нет, шаблон их больше не генерирует вовсе, а прежние
 *   URL закрыты 301 в `vercel.json`;
 * - `cannabis-wholesale-pattaya`, `cannathai-wholesale-cannabis-thailand` — до
 *   подтверждения класса лицензии на опт;
 * - `how-to-buy-cannabis-pattaya` — слаг удалён из `SEO_PAGES` целиком
 *   (контента под него так и не появилось), старые URL обслуживают 301 в
 *   `vercel.json`;
 * - страницы весов (`1g`, `10g`, `30g`, `100g`, `1kg`) — это прайс без цифр;
 *   текста под них в `content-cache` больше нет вовсе: он был удалён вместе с
 *   остальными 18 слагами-сиротами, за которыми не стояло ни одной собранной
 *   страницы (`docs/growth/ops/05-content-cache-orphans.md`). Дописать сюда
 *   строчку и получить готовую страницу теперь физически нечем, и это и есть
 *   цель: `checkOrphanContentCache()` в `scripts/check-seo.mjs` валит сборку на
 *   любом файле кэша без страницы;
 * - сорта: они больше не перечисляются здесь вообще. Список страниц сортов,
 *   допущенных в индекс, вычисляют ворота качества по тексту в
 *   `src/data/strain-pages.ts` — добавить сорт значит написать текст, а не
 *   дописать строчку в этот файл.
 *
 * @type {readonly Readonly<{ suffix: string, locales: readonly IndexLocale[] }>[]}
 */
const MANUAL_INDEX_POLICY_RULES = Object.freeze([
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
  // Гид по выбору и хаб кластера сортов — на всех семи локалях.
  //
  // До третьего раунда здесь стояло en+ru с формулировкой «машинный перевод
  // описания цветка — та самая тонкая страница, которая вредит». Она верна и
  // остаётся в силе: перевода здесь и нет. Пять локалей закрыты СВОИМ текстом
  // (`strain-pages-open-locales.ts`, `guide-choosing-flower-open-locales.ts`) —
  // у каждой свой набор разделов, потому что вопрос у японского и арабского
  // читателя разный, и это видно замером: похожесть внутри локали 0.00-0.05
  // при пороге 0.35, то есть один шаблон, прогнанный через переводчик, ворота
  // бы не прошёл.
  //
  // Хаб и гид написаны руками, поэтому решение об их индексации принимает
  // человек и оно стоит здесь. Сами страницы сортов сюда по-прежнему НЕ
  // вписаны: локали, на которых они indexable, вычисляют ворота качества.
  Object.freeze({ suffix: "guides/choosing-flower-pattaya", locales: allLocales }),
  // Вейп-перехватчик (W2-07): «мы не продаём вейпы — вот что легально». Только
  // en+ru: это ответ на англо- и русскоязычный smoke-интент из GSC; тайский
  // текст без вычитки носителем вредил бы больше, чем его отсутствие.
  Object.freeze({ suffix: "guides/vapes-and-cannabis-thailand", locales: enRuLocales }),
  Object.freeze({ suffix: "strains", locales: allLocales }),
  // Гео: индексируются ровно те районы, для которых написан авторский маршрут в
  // `AREA_ROUTES`. Район без маршрута шаблон вообще не генерирует — см.
  // `src/pages/[lang]/areas/[area].astro`.
  Object.freeze({ suffix: "areas/walking-street", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/soi-buakhao", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/central-pattaya", locales: enRuLocales }),
  Object.freeze({ suffix: "areas/jomtien", locales: enRuLocales }),
  // Фактический район адреса магазина. Страница не «маршрут в район», а
  // «вы уже на месте» — см. комментарий в `src/data/area-routes.ts`.
  Object.freeze({ suffix: "areas/south-pattaya", locales: enRuLocales }),
]);

/**
 * ЕДИНЫЙ allowlist = страницы-личности + то, что ПРОПУСТИЛИ ВОРОТА КАЧЕСТВА.
 *
 * Вторая половина списка не написана человеком: она вычисляется при каждом
 * импорте этого модуля из текста кластеров (`src/content-factory/`) прогоном
 * `evaluateCandidates()` из `scripts/lib/quality-gate.mjs`. Страница завода,
 * не прошедшая ворота, сюда не попадает — значит, `PageLayout` поставит ей
 * `noindex, follow`, фильтр в `astro.config.mjs` не пустит её в sitemap, а
 * `resolveLinks()` в `src/data/footer-seo-links.ts` перестанет на неё
 * ссылаться. Ни одной ручной правки для этого делать не нужно, и в этом весь
 * смысл: 149 отказов «Обнаружена, не проиндексирована» в Search Console
 * набрались ровно потому, что раньше решение принимал генератор, а не проверка.
 *
 * НИЧЕГО НЕ ЗАПИСЫВАЕТСЯ НА ДИСК. Сборке запрещено менять рабочее дерево
 * (CI делает `git diff --exit-code`), поэтому вердикт живёт только в памяти
 * процесса сборки — и потому не может разойтись с текстом страниц.
 *
 * @type {readonly Readonly<{ suffix: string, locales: readonly IndexLocale[] }>[]}
 */
export const INDEX_POLICY_RULES = Object.freeze([
  ...MANUAL_INDEX_POLICY_RULES,
  .../** @type {readonly Readonly<{ suffix: string, locales: readonly IndexLocale[] }>[]} */ (
    getFactoryIndexRules()
  ),
]);

/**
 * Сколько URL допущено вручную и сколько — воротами. Печатается в отчёте
 * `check-seo`: если заводская половина внезапно скакнула, это видно сразу.
 */
export const MANUAL_INDEXABLE_PAGE_COUNT = MANUAL_INDEX_POLICY_RULES.reduce(
  (total, rule) => total + rule.locales.length,
  0,
);

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
  // `strains` и `guides/choosing-flower-pattaya` записей здесь БОЛЬШЕ НЕТ: у них
  // есть настоящая страница на всех семи локалях, поэтому они попадают в ветку
  // «по умолчанию все семь». Вместе с этими двумя строками из `vercel.json`
  // убраны три 301, которые перекрывали эти же URL на th/ar/zh/ko/ja: редирект
  // на границе сети побеждает статический файл, и оставить их значило бы
  // объявить страницу в sitemap и hreflang, а отдавать по ней 301.
  ["areas/walking-street", enRuLocales],
  ["areas/soi-buakhao", enRuLocales],
  ["areas/central-pattaya", enRuLocales],
  ["areas/jomtien", enRuLocales],
  ["areas/south-pattaya", enRuLocales],
  ["guides/vapes-and-cannabis-thailand", enRuLocales],
]);

/**
 * Маршруты завода добавляются сюда автоматически: локаль, на которой у кластера
 * есть кандидат, — это локаль, на которой страница СОБИРАЕТСЯ, даже если ворота
 * её не пропустили. Ручная запись, если она есть, имеет приоритет: так можно
 * закрыть маршрут редиректом, не трогая кластер.
 */
for (const [suffix, locales] of getFactoryRouteLocales()) {
  if (ROUTE_LOCALES.has(suffix)) continue;
  ROUTE_LOCALES.set(suffix, /** @type {readonly IndexLocale[]} */ (locales));
}

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

export const FACTORY_INDEXABLE_PAGE_COUNT =
  EXPECTED_INDEXABLE_PAGE_COUNT - MANUAL_INDEXABLE_PAGE_COUNT;

/* ------------------------------------------------------------------------- *
 * ПОТОЛОК НАБОРА — РУЧНОЙ ЗАМОК
 *
 * Сверка `EXPECTED_INDEXABLE_PAGE_COUNT` с ожиданиями в `check-seo` была
 * тавтологичной: обе стороны считались из одних и тех же правил, поэтому
 * условие могло сработать только на дубле `suffix+locale`, а его и так ловит
 * `throw` выше. Содержательной оставалась одна сверка — политика против
 * сайтмапа. В результате набор indexable-URL вырос за раунд с 96 до 187
 * (+95%), и ни одна проверка этого не заметила и не должна была заметить:
 * кластер, случайно отдавший пятьсот кандидатов, прошёл бы молча, если бы их
 * пропустили ворота.
 *
 * Именно от этого риска строились ворота: 149 отказов «Обнаружена, не
 * проиндексирована» в Search Console набрались от массового прироста
 * шаблонных страниц. Поэтому рядом с вычисляемым значением стоит потолок,
 * который МЕНЯЕТСЯ РУКАМИ и попадает в ревью одной строкой.
 *
 * Как поднимать: осознанно, вместе с объяснением, почему прирост нужен.
 * Не «чтобы сборка позеленела».
 * ------------------------------------------------------------------------- */

/**
 * Потолок всего indexable-набора. Текущее значение — 200: набор упирается в
 * потолок вплотную, и это сознательно — следующее добавление страницы обязано
 * пройти через ручной подъём этой константы в ревью.
 */
export const MAX_TOTAL_INDEXABLE = 200;

/** Потолок того, что пропускают ворота завода. Текущее значение — 96. */
export const MAX_FACTORY_ADMITTED = 100;

if (EXPECTED_INDEXABLE_PAGE_COUNT > MAX_TOTAL_INDEXABLE) {
  throw new Error(
    `Индексируемый набор вырос до ${EXPECTED_INDEXABLE_PAGE_COUNT} при потолке ${MAX_TOTAL_INDEXABLE}. ` +
      "Либо это осознанный рост — и потолок MAX_TOTAL_INDEXABLE поднимают руками в " +
      "src/lib/index-policy.mjs, — либо кластер сорвался и отдал больше кандидатов, чем должен был.",
  );
}

if (FACTORY_INDEXABLE_PAGE_COUNT > MAX_FACTORY_ADMITTED) {
  throw new Error(
    `Ворота пропустили ${FACTORY_INDEXABLE_PAGE_COUNT} заводских URL при потолке ${MAX_FACTORY_ADMITTED}. ` +
      "Поднимать MAX_FACTORY_ADMITTED руками и только вместе с ответом на вопрос, " +
      "почему кластер вырос.",
  );
}

export function normalizePathSuffix(pathSuffix = "") {
  return pathSuffix.replace(/^\/+|\/+$/g, "");
}

/**
 * Локаль, на которую обязан указывать `x-default`.
 *
 * НЕ «всегда en». Раньше здесь безусловно стоял английский, и отказ ворот
 * качества ломал кластер альтернатив: страница, отклонённая на en, но
 * допущенная на ru, продолжала объявлять noindex-URL как `x-default` и в
 * `<head>`, и в `<xhtml:link>` сайтмапа, а `hreflang="en"` из набора при этом
 * исчезал. Google получал противоречивый сигнал ровно про ту страницу, которую
 * ворота защищали. Баг был латентным только потому, что в проде ворота ещё ни
 * разу никого не отклонили — то есть путь отказа был непроверен целиком.
 *
 * Правило: `x-default` берётся ИЗ ДОПУЩЕННЫХ локалей, в фиксированном порядке
 * `INDEX_LOCALES` (en первый, поэтому в обычном случае поведение не меняется).
 * Допущенных нет вовсе — тега нет: указывать `x-default` на noindex-URL хуже,
 * чем не указывать его совсем.
 *
 * @param {readonly IndexLocale[]} locales
 * @returns {IndexLocale | null}
 */
export function getXDefaultLocale(locales = EMPTY_LOCALES) {
  for (const locale of INDEX_LOCALES) {
    if (locales.includes(locale)) return locale;
  }
  return null;
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
