/**
 * КЛАСТЕР «СОРТА» — эталонный кластер контент-завода.
 *
 * Это первый и пока единственный кластер, переведённый на ворота качества. Он
 * же образец: новый кластер пишется по этому файлу, а не с нуля. Полное
 * описание контракта — `docs/growth/CONTENT-FACTORY.md`.
 *
 * Что обязан объявить кластер:
 *   id            — машинное имя, попадает в отчёты;
 *   hubSuffix     — страница-хаб кластера (она ведётся вручную, см. доку);
 *   linkLabelKeys — ключ подписи ссылки в `src/i18n/<locale>/ui.json` для
 *                   каждого слага: без него страница окажется сиротой и
 *                   `check-seo` уронит сборку;
 *   related       — смысловые соседи каждого слага; фильтруются политикой
 *                   индексации, поэтому перечислять можно и то, что сегодня
 *                   noindex;
 *   candidates()  — плоский список кандидатов «слаг × локаль» с СОБСТВЕННЫМ
 *                   текстом страницы. Именно этот текст читают ворота.
 *
 * Текст страниц лежит там же, где и раньше — в `src/data/strain-pages.ts`.
 * Завод не копирует копирайт к себе: он берёт ровно то, что отрисует шаблон,
 * иначе ворота будут мерить не ту страницу, которая уедет на прод.
 *
 * `strain-pages.ts` импортируется по полному имени файла с расширением: этот
 * модуль читают и Vite (сборка), и голый Node (`check-seo`, `check:factory`).
 * Отсюда требование ко всем данным завода — только стираемый TypeScript
 * (`import type`, `interface`, аннотации) и никаких алиасов `@/` в
 * значимых импортах.
 */

import { STRAIN_PAGES } from "../../data/strain-pages.ts";
import { STRAIN_SLUGS, getStrainNeighbourSuffixes, strainPathSuffix } from "../../data/strain-catalog.ts";

/**
 * Собственный текст страницы сорта в том порядке, в каком его отрисует
 * `src/components/StrainArticle.astro`.
 *
 * Порядок и состав важны: сюда входит всё, что попадает в `<article>`, и не
 * входит ничего из общего обвеса (шапка, контактная панель, футер, блок
 * соседних ссылок). Это ровно то, что `extractMainText()` вырежет из готового
 * HTML, — поэтому оценка ворот на данных и повторная проверка по `dist/`
 * меряют одно и то же.
 *
 * @param {import("../../data/strain-pages.ts").StrainPageCopy} copy
 */
function ownText(copy) {
  return [
    copy.kicker,
    copy.lead,
    copy.factsTitle,
    ...copy.facts.flatMap((fact) => [fact.label, fact.value]),
    ...copy.sections.flatMap((section) => [section.h2, ...section.body]),
    copy.disclaimerTitle,
    copy.disclaimer,
    copy.faqTitle,
    ...copy.faq.flatMap((item) => [item.q, item.a]),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Ключи подписей в `ui.json`. Слаг без ключа не получит ни одной входящей
 * контекстной ссылки, а `check-seo` считает indexable-страницу без входящих
 * ссылок сиротой и валит сборку. Поэтому ключ объявляется здесь, рядом с
 * кандидатом, а не в общем файле перелинковки.
 */
/**
 * Слаг → ключ подписи в `ui.json`, выведенный по одному правилу:
 * `gorilla-glue-4` → `gorillaGlue4Strain`, `ak-47` → `ak47Strain`.
 *
 * Правило, а не список: двадцать строк, написанных руками, разъедутся с
 * набором данных при первом же добавлении сорта, и разъедутся молча — ключ
 * просто не найдётся, страница останется без входящих ссылок, и `check-seo`
 * уронит сборку с сообщением про сироту, а не про опечатку. Ключи для всех
 * двадцати слагов уже лежат в `src/i18n/<locale>/ui.json` на всех семи
 * локалях, а `npm run check:strains` сверяет вывод этой функции со словарями
 * и падает, если хоть один ключ не найден хоть на одной локали.
 */
function linkLabelKey(slug) {
  const camel = slug
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
  return `${camel}Strain`;
}

const LINK_LABEL_KEYS = Object.fromEntries(
  STRAIN_SLUGS.map((slug) => [strainPathSuffix(slug), linkLabelKey(slug)]),
);

/**
 * Смысловые соседи. Внутри кластера сорта ссылаются друг на друга и на хаб,
 * наружу — на гид по выбору. Список фильтруется `getIndexPolicy`, поэтому
 * ссылка на не прошедший ворота сорт исчезнет сама, без правки этого файла.
 */
const RELATED = Object.fromEntries(
  STRAIN_SLUGS.map((slug) => [
    strainPathSuffix(slug),
    // Соседи ВЫЧИСЛЯЮТСЯ из `compareWith` в наборе данных — того же поля, из
    // которого строка «С чем сравнивать» печатается в блоке фактов. Значит,
    // перелинковка и текст страницы физически не могут разойтись: сравнение,
    // названное в таблице, всегда кликабельно, если сосед прошёл ворота.
    [...getStrainNeighbourSuffixes(slug), "guides/choosing-flower-pattaya", "strains"],
  ]),
);

/** @type {import("../registry.mjs").FactoryCluster} */
export const STRAINS_CLUSTER = {
  id: "strains",
  hubSuffix: "strains",
  linkLabelKeys: LINK_LABEL_KEYS,
  related: RELATED,
  candidates() {
    const list = [];
    // Слаги перебираются в отсортированном порядке: вердикт ворот не должен
    // зависеть от порядка ключей в объекте с копирайтом.
    for (const slug of Object.keys(STRAIN_PAGES).sort()) {
      const byLocale = STRAIN_PAGES[slug];
      for (const locale of Object.keys(byLocale).sort()) {
        const copy = byLocale[locale];
        if (!copy) continue;
        list.push({
          clusterId: "strains",
          locale,
          suffix: `strains/${slug}`,
          title: copy.title,
          h1: copy.h1,
          text: ownText(copy),
        });
      }
    }
    return list;
  },
};
