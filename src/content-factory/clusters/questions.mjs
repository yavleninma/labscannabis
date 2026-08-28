/**
 * КЛАСТЕР «ВОПРОСЫ» — тематические страницы вопросов и ответов.
 *
 * Второй кластер контент-завода. Контракт тот же, что у `strains.mjs`, и
 * описан в `docs/growth/CONTENT-FACTORY.md`; здесь — только то, что отличается.
 *
 * ЧЕМ ОН ОТЛИЧАЕТСЯ ОТ КЛАСТЕРА СОРТОВ. У сорта данные — свойства объекта, и
 * страница локали получается переводом описания. Здесь данные — САМ СОСТАВ
 * ВОПРОСОВ: у каждого вопроса в `src/data/question-pages.ts` объявлены локали,
 * на которых он имеет смысл, и страница локали собирается только из них.
 * Поэтому английская страница про вывоз содержит вопрос «дома это законно —
 * меняет ли это что-нибудь», японская — «спросит ли с меня моя страна», а
 * тайская не содержит ни того ни другого. Это уникальность на данных, а не на
 * переформулировках, и ворота её видят.
 *
 * ЧЕГО ЗДЕСЬ НЕТ И НЕ ДОЛЖНО БЫТЬ. Локали без написанного текста страницы не
 * получают: `getQuestionPage()` возвращает `null`, если тема не набрала шести
 * вопросов с текстом на этой локали, и кандидат просто не создаётся. Машинный
 * перевод вопросной страницы — ровно та тонкая страница, из-за которой в
 * Search Console набрались 149 отказов «Обнаружена, не проиндексирована».
 */

import { QUESTION_PAGES, getQuestionPage, questionSuffix } from "../../data/question-pages.ts";

/**
 * ОТК ЧЕСТНОСТИ ЯРЛЫКА ОСНОВАНИЯ.
 *
 * Доктрина файла данных записана прямо на поле `sources`: «Пусто у practice и
 * unconfirmed: сноска на закон под опытом — подлог». Обратное правило нигде не
 * проверялось: ответ с ярлыком «практика, не юридический вывод» мог спокойно
 * разбирать содержание уведомлений — «в уведомлениях описано…», «за пределами
 * описанного в уведомлениях» — и читатель получал прочтение закона под
 * ярлыком, который говорит ему, что закона он сейчас не читает, да ещё и без
 * ссылки, по которой это прочтение можно проверить.
 *
 * Правило простое и симметричное прежнему: ссылаться на текст уведомления
 * имеет право только ответ с `basis: "official"` и непустым `sources`.
 * Остальным остаётся говорить от своего лица — «у прилавка смотрят…»,
 * «документ выписан на человека», — что и есть практика.
 *
 * Бросает при импорте: страница с подложным ярлыком не должна собраться.
 */
const NOTICE_MENTIONS = [
  /\bnotices?\b/i,
  /уведомлени/i,
  /ประกาศ/,
  /الإشعار|إشعارات/,
  /公告/,
  /고시|공고/,
  /告示/,
];

export function assertBasisLabelHonesty() {
  for (const page of QUESTION_PAGES) {
    for (const item of page.questions) {
      if (item.basis === "official" && item.sources.length > 0) continue;
      for (const [locale, copy] of Object.entries(item.copy)) {
        if (!copy) continue;
        const text = [copy.q, ...copy.a].join(" ");
        const hit = NOTICE_MENTIONS.find((pattern) => pattern.test(text));
        if (!hit) continue;
        throw new Error(
          `Questions: ${page.slug}/${item.id}/${locale} — ответ с basis "${item.basis}" и ` +
            `${item.sources.length === 0 ? "пустым sources" : "источниками"} разбирает содержание ` +
            "уведомления. Либо перенесите утверждение в ответ с basis \"official\" и ключом источника, " +
            "либо переформулируйте так, чтобы абзац говорил от своего лица, а не от лица уведомлений.",
        );
      }
    }
  }
}

assertBasisLabelHonesty();

/**
 * Собственный текст страницы в порядке вывода `QuestionArticle.astro`.
 *
 * Порядок и состав обязаны совпадать с шаблоном: ворота меряют это, а вторая
 * ступень ОТК меряет то же самое по отрисованному `dist/`. Подписи ссылок на
 * первоисточники сюда не входят намеренно — они приходят из `LEGAL_GUIDE_COPY`
 * и добавляют к тексту `dist/` десяток слов в ту же сторону, что и блок
 * соседних ссылок: страница по `dist/` чуть длиннее, чем по данным, и это
 * безопасная сторона расхождения.
 *
 * @param {import("../../data/question-pages.ts").ResolvedQuestionPage} page
 */
function ownText(page) {
  return [
    page.meta.kicker,
    page.meta.h1,
    page.meta.lead,
    ...page.items.flatMap((item) => [item.q, page.basisLabels[item.basis], ...item.a]),
    page.sourcesTitle,
    page.cautionTitle,
    page.meta.caution,
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
  "questions/rules-and-prescription": "questionsPrescription",
  "questions/buying-in-person": "questionsBuying",
  "questions/where-you-can-use": "questionsUse",
  "questions/taking-it-home": "questionsLeaving",
  "questions/checking-a-shop": "questionsShopCheck",
  "questions/common-myths": "questionsMyths",
  "questions/keeping-flower-in-the-tropics": "questionsStorage",
  "questions/arriving-with-cannabis": "questionsArriving",
};

/**
 * Смысловые соседи. Внутри кластера темы связаны по ходу поездки — правила,
 * покупка, употребление, отъезд, — наружу каждая уходит в тот гид, который
 * разбирает её предмет подробно. Список фильтруется политикой индексации,
 * поэтому ссылка на непрошедшую ворота тему исчезнет сама.
 */
const RELATED = {
  "questions/rules-and-prescription": [
    "questions/checking-a-shop",
    "questions/buying-in-person",
    "questions/arriving-with-cannabis",
    "guides/prescription-pattaya",
    "questions/common-myths",
  ],
  "questions/buying-in-person": [
    "questions/rules-and-prescription",
    "questions/where-you-can-use",
    "questions/keeping-flower-in-the-tropics",
    "guides/first-visit-pattaya",
    "questions/checking-a-shop",
  ],
  "questions/where-you-can-use": [
    "questions/taking-it-home",
    "questions/buying-in-person",
    "guides/legal-cannabis-tourists",
    "questions/common-myths",
  ],
  "questions/taking-it-home": [
    "questions/where-you-can-use",
    "questions/arriving-with-cannabis",
    "questions/common-myths",
    "guides/legal-cannabis-tourists",
    "questions/rules-and-prescription",
  ],
  "questions/checking-a-shop": [
    "questions/rules-and-prescription",
    "questions/common-myths",
    "guides/first-visit-pattaya",
    "questions/buying-in-person",
  ],
  "questions/common-myths": [
    "questions/rules-and-prescription",
    "questions/taking-it-home",
    "questions/where-you-can-use",
    "guides/legal-cannabis-tourists",
  ],
  // Хранение — единственная тема кластера без единой ссылки на норму: там
  // нормы нет. Поэтому наружу она уходит не в правовой гид, а в гид по выбору
  // и в кластер сортов: человек, который спрашивает, как это держать, уже
  // купил и выбирает следующее.
  "questions/keeping-flower-in-the-tropics": [
    "questions/where-you-can-use",
    "questions/taking-it-home",
    "guides/choosing-flower-pattaya",
    "strains",
  ],
  // Прилёт — зеркало отъезда, и первая же ссылка ведёт именно туда: половина
  // приезжающих задаёт оба вопроса подряд.
  "questions/arriving-with-cannabis": [
    "questions/taking-it-home",
    "questions/rules-and-prescription",
    "guides/prescription-pattaya",
    "questions/common-myths",
  ],
};

/** @type {import("../registry.mjs").FactoryCluster} */
export const QUESTIONS_CLUSTER = {
  id: "questions",
  // Хаб кластера — общий хаб знаниевого кластера: вопросные темы перечислены
  // в `GUIDES_INDEX_COPY` рядом с гайдами, потому что читатель не различает
  // «гид» и «вопросы», а второй хаб на четыре ссылки был бы тонкой страницей.
  hubSuffix: "guides",
  linkLabelKeys: LINK_LABEL_KEYS,
  related: RELATED,
  candidates() {
    const list = [];
    for (const page of [...QUESTION_PAGES].sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0))) {
      // Локали перебираются в отсортированном порядке: вердикт ворот не должен
      // зависеть от порядка ключей в объекте с копирайтом.
      for (const locale of Object.keys(page.meta).sort()) {
        const resolved = getQuestionPage(page.slug, locale);
        if (!resolved) continue;
        list.push({
          clusterId: "questions",
          locale,
          suffix: questionSuffix(page.slug),
          title: resolved.meta.title,
          h1: resolved.meta.h1,
          text: ownText(resolved),
        });
      }
    }
    return list;
  },
};
