/**
 * РЕГРЕСС-ТЕСТ ВОРОТ КАЧЕСТВА.
 *
 * Зачем он есть
 * -------------
 * Ворота не отклонили ни одного кандидата за три кластера — 87 из 87 допущено.
 * Это ожидаемо (текст пишут люди, а не генератор), но означает, что зелёный
 * отчёт `check:factory` НИЧЕГО не доказывает: он одинаково выглядит и когда
 * ворота работают, и когда они сломаны. Доказательство работоспособности
 * существовало только как разовый ручной эксперимент прошлого раунда — в CI
 * оно не воспроизводилось и при первой же правке порогов сломалось бы молча.
 *
 * Здесь лежит набор заведомо ПЛОХИХ кандидатов. Каждый обязан быть отклонён
 * ровно по названному коду. Прогон стоит в `scripts/check-seo.mjs` и валит
 * сборку, если хоть один плохой кандидат прошёл или был отклонён не по той
 * причине. Пороги после этого нельзя ослабить незаметно: ослабление порога
 * ломает соответствующую фикстуру.
 *
 * Корпус фикстур синтетический и от содержимого сайта не зависит: он не должен
 * ломаться от того, что кто-то дописал абзац на реальной странице.
 */

import { GATE_FAILURES, MIN_OWN_WORDS, evaluateCandidates } from "./quality-gate.mjs";

/** Осмысленный английский «наполнитель» без промо-лексики. */
function lorem(seed, words) {
  const vocabulary = [
    "alley", "address", "arrival", "block", "corner", "counter", "direction",
    "distance", "document", "evening", "entrance", "junction", "landmark",
    "morning", "number", "pavement", "pin", "platform", "prescription", "road",
    "route", "shelf", "signage", "street", "traffic", "transfer", "vehicle",
    "walk", "water", "window",
  ];
  const out = [];
  let state = seed;
  for (let i = 0; i < words; i += 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    out.push(vocabulary[state % vocabulary.length]);
  }
  return out.join(" ");
}

/** Донор — уже опубликованная страница, с которой можно списать. */
function donor(id, seed) {
  return {
    locale: "en",
    suffix: `corpus/${id}`,
    title: `Corpus page ${id}`,
    h1: `Corpus page ${id}`,
    text: lorem(seed, 900),
  };
}

const DONORS = [donor("one", 11), donor("two", 22), donor("three", 33)];

/**
 * @typedef {object} GateFixture
 * @property {string} name        что проверяем
 * @property {string} expect      ожидаемый код отказа из `GATE_FAILURES`
 * @property {import("./quality-gate.mjs").GateCandidate} candidate
 */

/** @type {readonly GateFixture[]} */
export const GATE_FIXTURES = Object.freeze([
  {
    name: "тонкая страница",
    expect: GATE_FAILURES.THIN,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/thin",
      title: "A page that is too short to be worth an URL",
      h1: "Too short to be worth an URL",
      text: lorem(101, Math.max(1, MIN_OWN_WORDS - 60)),
    },
  },
  {
    name: "пустая страница",
    expect: GATE_FAILURES.EMPTY,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/empty",
      title: "A page with a title and nothing else at all",
      h1: "A title and nothing else",
      text: "",
    },
  },
  {
    name: "дословный дубль соседа",
    expect: GATE_FAILURES.DUPLICATE_TEXT,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/copy",
      title: "A page whose body is lifted wholesale from a neighbour",
      h1: "Body lifted wholesale from a neighbour",
      text: DONORS[0].text,
    },
  },
  {
    /**
     * Ровно та дыра, ради которой включение стало кумулятивным: страница
     * собрана из ТРЁХ доноров по трети от каждого, и ни с одним по отдельности
     * не пересекается настолько, чтобы сработала попарная метрика.
     */
    name: "сшивка из трёх чужих страниц",
    expect: GATE_FAILURES.BORROWED_TEXT,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/stitched",
      title: "A page stitched together out of three other pages here",
      h1: "Stitched together out of three other pages",
      text: DONORS.map((page) => page.text.split(" ").slice(0, 300).join(" ")).join(" "),
    },
  },
  {
    name: "дословно тот же title",
    expect: GATE_FAILURES.DUPLICATE_TITLE,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/same-title",
      title: DONORS[1].title,
      h1: "A heading that is not the same as the neighbour's heading",
      text: lorem(404, 900),
    },
  },
  {
    name: "рекламный регистр",
    expect: GATE_FAILURES.COMPLIANCE,
    candidate: {
      clusterId: "fixture",
      locale: "en",
      suffix: "fixture/promo",
      title: "A page that quietly slips into advertising register",
      h1: "Advertising register on a page that should not have it",
      text: `${lorem(505, 900)} We sell the best premium cannabis in Pattaya at the highest quality.`,
    },
  },
]);

/**
 * Прогоняет фикстуры через те же ворота, что и настоящие кандидаты.
 *
 * @returns {string[]} список расхождений; пустой список — ворота работают
 */
export function runGateFixtures() {
  const problems = [];
  for (const fixture of GATE_FIXTURES) {
    const verdict = evaluateCandidates([fixture.candidate], { corpus: DONORS }).get(
      `${fixture.candidate.locale}/${fixture.candidate.suffix}`,
    );
    if (!verdict) {
      problems.push(`фикстура «${fixture.name}» не получила вердикта вовсе`);
      continue;
    }
    if (verdict.admitted) {
      problems.push(
        `фикстура «${fixture.name}» ПРОШЛА ворота — ожидался отказ ${fixture.expect}. ` +
          "Порог ослаблен или проверка сломана",
      );
      continue;
    }
    const codes = verdict.failures.map((failure) => failure.code);
    if (!codes.includes(fixture.expect)) {
      problems.push(
        `фикстура «${fixture.name}» отклонена по ${codes.join(", ")}, а ожидался ${fixture.expect}`,
      );
    }
  }
  return problems;
}
