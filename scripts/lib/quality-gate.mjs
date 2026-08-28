/**
 * ВОРОТА КАЧЕСТВА КОНТЕНТ-ЗАВОДА (ОТК).
 *
 * Зачем этот файл вообще существует
 * ---------------------------------
 * Выгрузка Google Search Console по этому домену: 149 URL в статусе
 * «Обнаружена, не проиндексирована». Это не «Google не успел» — это Google
 * посмотрел на массовые шаблонные страницы этого сайта и отказался их
 * индексировать. Любой генератор, который решает судьбу страницы по факту
 * «я её сгенерировал», добавляет к этим 149 ещё столько, сколько запустят.
 *
 * Поэтому решение «пускать ли страницу в индекс» здесь отделено от решения
 * «собирать ли страницу». Страница собирается ВСЕГДА: у неё есть URL, её видит
 * посетитель, по ней ходит краулер. Но в `<meta name="robots">` она получает
 * `index` только если прошла все проверки ниже, и только в этом случае она
 * попадает в sitemap и получает hreflang с JSON-LD.
 *
 * Модуль ЧИСТЫЙ: не читает файлы, не пишет файлы, не знает про `dist`.
 * Вход — данные страницы, выход — вердикт. Это принципиально: вердикт
 * вычисляется во время сборки из исходных данных, а не хранится в
 * репозитории. Сборка не имеет права писать в рабочее дерево (CI делает
 * `git diff --exit-code`), поэтому «сгенерировали allowlist и закоммитили» —
 * не вариант.
 *
 * Двухступенчатое ОТК
 * -------------------
 * 1. ВО ВРЕМЯ СБОРКИ (`src/content-factory/registry.mjs`) ворота получают текст
 *    из данных кластера и сравнивают кандидата с другими кандидатами завода.
 *    Этого достаточно, чтобы решить `indexable` до того, как отрисуется HTML.
 * 2. ПОСЛЕ СБОРКИ (`scripts/check-seo.mjs`) те же самые функции запускаются
 *    ещё раз, но уже по ОТРИСОВАННОМУ `dist/` и против ВСЕГО indexable-корпуса
 *    локали, включая страницы, написанные руками. Первая ступень не видит
 *    ручные страницы (их текст лежит в `.ts`-модулях вёрстки), вторая видит
 *    всё. Если страница прошла первую ступень, но провалила вторую — сборка
 *    падает: это ровно тот случай, когда заводская страница дублирует
 *    написанную руками.
 *
 * Обе ступени зовут одну и ту же `evaluateCandidates()`, поэтому разъехаться
 * они не могут.
 */

import { findComplianceViolations } from "./compliance-lexicon.mjs";
import { buildShingles, jaccard, measureMainText, usesCharNgrams } from "./text-similarity.mjs";

/* ------------------------------------------------------------------------- *
 * ПОРОГИ
 *
 * Каждое число ниже взято из замера по этому сайту, а не из статьи в блоге.
 * Команда, которой они получены, приведена рядом — её можно повторить.
 * ------------------------------------------------------------------------- */

/**
 * Минимум собственного текста для локалей со словами, разделёнными пробелами
 * (en, ru, ar).
 *
 * ПОРОГ БЕРЁТСЯ ИЗ ФАКТИЧЕСКОГО РАСПРЕДЕЛЕНИЯ, А НЕ НАЗНАЧАЕТСЯ.
 * Правило одно и записано здесь, чтобы следующая правка не назначила число
 * «на глаз»: порог = p05 объёма собственного текста по ВСЕМУ indexable-набору
 * `dist/`, округлённый вниз до десятков.
 *
 * Замер на 2026-08-28 после чистки пересказа (`scripts/check-seo.mjs`,
 * `reportRestatement`): n=127 страниц словных локалей, min 518, p05 644,
 * медиана 873. Отсюда 640.
 *
 * Прежнее значение 400 пришло из требования владельца и к сайту отношения не
 * имело: самый тонкий кандидат завода нёс 646 слов, то есть порог был вдвое
 * ниже фактического пола и не мог сработать ни на ком. 640 — это пол
 * популяции: страница тоньше любой уже опубликованной в индекс не проходит.
 *
 * Замер повторяется так:
 *   node --input-type=module -e '<extractMainText+measureMainText по dist,
 *   отфильтровав getIndexPolicyForPathname(...).indexable>'
 *
 * Не путать с `MIN_BODY_TEXT_LENGTH = 400` в `check-seo.mjs`: там 400 СИМВОЛОВ
 * всего видимого текста включая шапку и футер — это защита от пустой страницы,
 * а не мера содержательности.
 */
export const MIN_OWN_WORDS = 640;

/**
 * То же правило для локалей без пробелов между словами (th, zh, ja, ko):
 * p05 объёма по всему indexable-набору `dist/` в СИМВОЛАХ, округлённый вниз до
 * полусотни.
 *
 * Замер на 2026-08-28, n=15 indexable-страниц на локаль:
 *
 *   th  min 2168  p05 2505  → 2500
 *   zh  min 1042  p05 1059  → 1050
 *   ko  min 1237  p05 1307  → 1300
 *   ja  min 1381  p05 1460  → 1450
 *
 * Прежние значения (1100 / 480 / 600 / 670) считались через переводной
 * коэффициент от 400 английских слов. Коэффициенты были посчитаны по сайту
 * честно, но исходные 400 к сайту отношения не имели, поэтому и результат
 * оказался втрое-вчетверо ниже фактического пола: самая тонкая заводская
 * страница на ja несла 2107 символов при пороге 670.
 *
 * ru и ar считаются словами и живут по `MIN_OWN_WORDS`.
 */
export const MIN_OWN_CHARS = Object.freeze({
  th: 2500,
  zh: 1050,
  ko: 1300,
  ja: 1450,
});

/**
 * Максимальная похожесть с уже допущенной страницей той же локали.
 *
 * Метрика — Жаккар по 5-словным шинглам (посимвольные 10-граммы для th/zh/ja/ko),
 * `scripts/lib/text-similarity.mjs`, по основному тексту без шапки и футера.
 *
 * ОТКУДА 0.20 — И ПОЧЕМУ БОЛЬШЕ НЕ 0.35. Прежние 0.35 были откалиброваны
 * 2026-08-27 по дорвейной гео-сетке, которая в том же раунде и была удалена:
 * шаблонные пары давали тогда 0.81–0.82. Число, снятое с популяции, которой на
 * сайте больше нет, к нынешнему сайту не относится — это ровно та «калибровка
 * наугад», от которой каркас (`docs/growth/PLAN-CONVERSION-2026-08.md`)
 * предостерегал.
 *
 * Замер по нынешнему корпусу: максимум попарной похожести среди indexable —
 * 0.16 (th, пара написанных руками страниц), у заводских кандидатов против
 * всего корпуса локали — 0.06. Порог 0.20 стоит выше наблюдённого максимума
 * популяции и вчетверо ниже прежнего: он способен сработать, оставаясь выше
 * любой честной пары, которая на сайте есть.
 */
export const MAX_SIMILARITY = 0.20;

/**
 * Максимальная доля собственных шинглов страницы, которые уже встречаются на
 * indexable-страницах той же локали — по ОБЪЕДИНЕНИЮ, а не по худшей паре.
 *
 * Зачем отдельная метрика, если есть Жаккар. Жаккар делит пересечение на
 * объединение, поэтому его легко развести объёмом: страница, наполовину
 * скопированная с соседней и наполовину дописанная своим текстом, даёт около
 * 0.33. Включение делится на объём кандидата и меряет именно заимствование.
 *
 * ПОЧЕМУ КУМУЛЯТИВНО. Попарная версия обходилась в один приём: страница,
 * собранная из трёх indexable-страниц по трети от каждой (ни одного своего
 * слова), давала Жаккар 0.23 и попарное включение 38% — оба под порогом, и
 * ворота её пропускали. Дыра была именно в числе доноров: контрольная сшивка
 * 50/50 из двух источников ловилась. Считается объединение (см.
 * `cumulativeContainment()`), поэтому трёхисточниковая сшивка даёт ~100%.
 *
 * Откуда 0.55. Замер по `dist/` на 2026-08-28: максимум КУМУЛЯТИВНОГО
 * включения у честных заводских страниц против всего indexable-корпуса локали
 * — 27% (th), затем en 24%, ru 18%, ja/ko/zh 9%, ar 5%. Порог примерно вдвое
 * выше наблюдённого максимума и вдвое ниже уровня сшивки из чужих абзацев.
 */
export const MAX_BORROWED_SHARE = 0.55;

/**
 * Максимальное пересечение заголовков (title и H1) с уже допущенной страницей.
 *
 * Проверка на «уникальный интент»: два разных URL, обещающих в заголовке одно и
 * то же, конкурируют между собой, и Google выбирает не индексировать оба.
 * Считается Жаккар по множеству слов заголовка (для th/zh/ja/ko — по символьным
 * биграммам, потому что слов там не выделить).
 *
 * Откуда 0.80. Замер по текущему indexable-набору: максимум ЗАКОННОГО
 * пересечения H1 — 0.71, это гео-пара «From Central Pattaya to Pattaya 13 Alley»
 * ↔ «From Jomtien to Pattaya 13 Alley». Интент у них разный (разная точка
 * старта), заголовки обязаны быть похожи. Порог поставлен выше этой отметки,
 * но ниже уровня, на котором заголовки отличаются одним словом-синонимом.
 *
 * Полное совпадение заголовка после нормализации — отдельная, более строгая
 * проверка, у неё порога нет вовсе.
 */
export const MAX_HEADING_OVERLAP = 0.80;

/** Размер символьной n-граммы для сравнения заголовков в th/zh/ja/ko. */
const HEADING_NGRAM_SIZE = 2;

/* ------------------------------------------------------------------------- *
 * КОДЫ ОТКАЗА
 * ------------------------------------------------------------------------- */

/**
 * Причины, по которым страница остаётся noindex. Код — машинный, `hint` —
 * то, что человек прочитает в выводе CI и по чему поймёт, что чинить.
 */
export const GATE_FAILURES = Object.freeze({
  EMPTY: "empty",
  THIN: "thin",
  DUPLICATE_TEXT: "duplicate-text",
  BORROWED_TEXT: "borrowed-text",
  DUPLICATE_TITLE: "duplicate-title",
  DUPLICATE_H1: "duplicate-h1",
  HEADING_OVERLAP: "heading-overlap",
  COMPLIANCE: "compliance",
});

/** @param {string} locale */
export function minOwnText(locale) {
  return usesCharNgrams(locale)
    ? { count: MIN_OWN_CHARS[locale], unit: "симв." }
    : { count: MIN_OWN_WORDS, unit: "слов" };
}

/**
 * Нормализация заголовка для сравнения: регистр, пунктуация и разрядка не
 * делают интент другим.
 *
 * @param {string} value
 */
export function normalizeHeading(value = "") {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Множество токенов заголовка для Жаккара.
 *
 * @param {string} value
 * @param {string} locale
 */
function headingTokens(value, locale) {
  const normalized = normalizeHeading(value);
  if (!normalized) return new Set();
  if (usesCharNgrams(locale)) {
    const chars = normalized.replace(/\s+/gu, "");
    const grams = new Set();
    for (let i = 0; i + HEADING_NGRAM_SIZE <= chars.length; i += 1) {
      grams.add(chars.slice(i, i + HEADING_NGRAM_SIZE));
    }
    // Заголовок короче n-граммы всё равно должен с чем-то сравниваться.
    return grams.size > 0 ? grams : new Set([chars]);
  }
  return new Set(normalized.split(" ").filter(Boolean));
}

/**
 * Коэффициент включения: какая доля шинглов `a` встречается в `b`.
 * Делится на объём `a`, поэтому от того, насколько `b` длиннее, не зависит —
 * но от разбавления САМОГО `a` своим текстом зависит ровно так же, как Жаккар.
 * Используется только для отчёта «главный донор», решение принимает
 * `cumulativeContainment()`.
 *
 * @param {Set<string>} a
 * @param {Set<string>} b
 */
function containment(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const shingle of a) {
    if (b.has(shingle)) intersection += 1;
  }
  return intersection / a.size;
}

/**
 * КУМУЛЯТИВНОЕ ВКЛЮЧЕНИЕ: доля шинглов кандидата, встречающихся хоть на одной
 * уже допущенной странице локали.
 *
 * Почему не попарный максимум. Попарная метрика обходится в один приём:
 * страница, сшитая из трёх indexable-страниц по трети от каждой, ни с одной из
 * них по отдельности не пересекается больше чем на треть — и проходит, хотя
 * своего текста в ней нет вообще. Это проверено на живом корпусе: такая сшивка
 * давала Жаккар 0.23 и попарное включение 38%, оба под порогом. Объединение
 * даёт по ней ~100% и отклоняет её.
 *
 * @param {Set<string>} shingles
 * @param {{ shingles: Set<string> }[]} peers
 */
function cumulativeContainment(shingles, peers) {
  if (shingles.size === 0 || peers.length === 0) return 0;
  let covered = 0;
  for (const shingle of shingles) {
    for (const peer of peers) {
      if (peer.shingles.has(shingle)) {
        covered += 1;
        break;
      }
    }
  }
  return covered / shingles.size;
}

/**
 * @typedef {object} GateCandidate
 * @property {string} locale
 * @property {string} suffix путь без локали и без слэшей по краям
 * @property {string} title  содержимое `<title>`
 * @property {string} h1
 * @property {string} text   СОБСТВЕННЫЙ текст страницы — без шапки, футера,
 *   контактной панели и CTA. Для данных кластера это лид + разделы + FAQ;
 *   для отрисованной страницы — результат `extractMainText()`.
 * @property {string} [clusterId] чей это кандидат — только для отчёта
 */

/**
 * @typedef {object} GateVerdict
 * @property {string} id `<locale>/<suffix>`
 * @property {string} locale
 * @property {string} suffix
 * @property {string} clusterId
 * @property {boolean} admitted пускать ли в индекс
 * @property {{ code: string, hint: string }[]} failures
 * @property {object} metrics
 */

/** @param {GateCandidate} candidate */
function toEntry(candidate) {
  const locale = candidate.locale;
  const text = (candidate.text ?? "").replace(/\s+/g, " ").trim();
  return {
    id: `${locale}/${candidate.suffix || ""}`,
    clusterId: candidate.clusterId ?? "",
    locale,
    suffix: candidate.suffix ?? "",
    title: (candidate.title ?? "").trim(),
    h1: (candidate.h1 ?? "").trim(),
    text,
    measure: measureMainText(text, locale),
    shingles: buildShingles(text, locale),
    normTitle: normalizeHeading(candidate.title ?? ""),
    normH1: normalizeHeading(candidate.h1 ?? ""),
    titleTokens: headingTokens(candidate.title ?? "", locale),
    h1Tokens: headingTokens(candidate.h1 ?? "", locale),
  };
}

/**
 * Путь, который compliance-линтер видит как «файл». Нужен ровно для одного:
 * на правовом гиде разрешены суммы и упоминание денег (`isMoneyAllowlisted`),
 * и заводская страница с тем же слагом обязана получить ту же поблажку.
 *
 * @param {{ locale: string, suffix: string }} entry
 */
function lintPathFor(entry) {
  return `factory/${entry.locale}/${entry.suffix}/index.html`;
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ ВОРОТ.
 *
 * Кандидаты рассматриваются по одному, в порядке сортировки по `id`. Пул, с
 * которым сравнивается очередной кандидат, состоит из `corpus` (уже
 * опубликованное) плюс тех кандидатов, что УЖЕ прошли ворота на этом же
 * прогоне. Отклонённый кандидат в пул не попадает: если две заводские страницы
 * дублируют друг друга, отклонить надо одну, а не обе.
 *
 * Порядок детерминирован сортировкой по `id` — при прочих равных в индекс
 * проходит лексикографически первая. Это не эстетика: без явного порядка
 * результат сборки зависел бы от порядка перечисления кластеров, и один и тот
 * же коммит давал бы разные sitemap.
 *
 * @param {readonly GateCandidate[]} candidates
 * @param {{ corpus?: readonly GateCandidate[] }} [options]
 *   `corpus` — уже опубликованные страницы, с которыми надо сравниться.
 *   Они через ворота не проходят и вердикта не получают.
 * @returns {Map<string, GateVerdict>} ключ — `<locale>/<suffix>`
 */
export function evaluateCandidates(candidates, options = {}) {
  const corpus = (options.corpus ?? []).map(toEntry);
  const entries = [...candidates].map(toEntry).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  /** @type {Map<string, ReturnType<typeof toEntry>[]>} пул допущенных по локалям */
  const pool = new Map();
  for (const entry of corpus) {
    if (!pool.has(entry.locale)) pool.set(entry.locale, []);
    pool.get(entry.locale).push(entry);
  }

  /** @type {Map<string, GateVerdict>} */
  const verdicts = new Map();

  for (const entry of entries) {
    const peers = (pool.get(entry.locale) ?? []).filter((peer) => peer.id !== entry.id);
    const failures = [];
    const required = minOwnText(entry.locale);

    // 1. Есть ли вообще из чего делать страницу.
    if (!entry.title || !entry.h1 || !entry.text) {
      failures.push({
        code: GATE_FAILURES.EMPTY,
        hint: "нет title, H1 или собственного текста — страница пустая",
      });
    }

    // 2. Объём собственного текста.
    if (entry.measure.count < required.count) {
      failures.push({
        code: GATE_FAILURES.THIN,
        hint:
          `собственного текста ${entry.measure.count} ${entry.measure.unit}, ` +
          `нужно ${required.count} ${required.unit}`,
      });
    }

    // 3. Compliance-линтер по тому же лексикону, что и `check-seo`.
    const lintPath = lintPathFor(entry);
    const violations = [
      ...findComplianceViolations(entry.title, lintPath, "title"),
      ...findComplianceViolations(entry.h1, lintPath, "h1"),
      ...findComplianceViolations(entry.text, lintPath, "body"),
    ];
    const seenRules = new Set();
    for (const violation of violations) {
      if (seenRules.has(violation.ruleId)) continue;
      seenRules.add(violation.ruleId);
      failures.push({
        code: GATE_FAILURES.COMPLIANCE,
        hint: `${violation.hint} — ${JSON.stringify(violation.match)} [${violation.ruleId}]`,
      });
    }

    // 4. Уникальный интент: точное совпадение заголовка недопустимо.
    const sameTitle = peers.find((peer) => peer.normTitle && peer.normTitle === entry.normTitle);
    if (sameTitle) {
      failures.push({
        code: GATE_FAILURES.DUPLICATE_TITLE,
        hint: `title дословно повторяет ${sameTitle.id}`,
      });
    }
    const sameH1 = peers.find((peer) => peer.normH1 && peer.normH1 === entry.normH1);
    if (sameH1) {
      failures.push({
        code: GATE_FAILURES.DUPLICATE_H1,
        hint: `H1 дословно повторяет ${sameH1.id}`,
      });
    }

    // 5. Уникальный интент: заголовки не должны почти совпадать.
    let worstHeading = { score: 0, against: "", kind: "" };
    for (const peer of peers) {
      const titleScore = jaccard(entry.titleTokens, peer.titleTokens);
      if (titleScore > worstHeading.score) worstHeading = { score: titleScore, against: peer.id, kind: "title" };
      const h1Score = jaccard(entry.h1Tokens, peer.h1Tokens);
      if (h1Score > worstHeading.score) worstHeading = { score: h1Score, against: peer.id, kind: "H1" };
    }
    if (worstHeading.score > MAX_HEADING_OVERLAP) {
      failures.push({
        code: GATE_FAILURES.HEADING_OVERLAP,
        hint:
          `${worstHeading.kind} пересекается с ${worstHeading.against} на ` +
          `${worstHeading.score.toFixed(2)} при пороге ${MAX_HEADING_OVERLAP}`,
      });
    }

    // 6. Похожесть основного текста с уже допущенными страницами локали —
    //    двумя метриками сразу: Жаккар ловит дубль целиком, коэффициент
    //    включения — страницу, наполовину собранную из чужих абзацев.
    let worstText = { score: 0, against: "" };
    let topDonor = { score: 0, against: "" };
    for (const peer of peers) {
      const score = jaccard(entry.shingles, peer.shingles);
      if (score > worstText.score) worstText = { score, against: peer.id };
      const donated = containment(entry.shingles, peer.shingles);
      if (donated > topDonor.score) topDonor = { score: donated, against: peer.id };
    }
    // Заимствование считается по ОБЪЕДИНЕНИЮ допущенных страниц локали, а не
    // максимумом по парам: см. `cumulativeContainment()`.
    const worstBorrowed = {
      score: cumulativeContainment(entry.shingles, peers),
      against: topDonor.against,
    };
    if (worstText.score > MAX_SIMILARITY) {
      failures.push({
        code: GATE_FAILURES.DUPLICATE_TEXT,
        hint:
          `похожесть ${worstText.score.toFixed(2)} с ${worstText.against} ` +
          `при пороге ${MAX_SIMILARITY}`,
      });
    }
    if (worstBorrowed.score > MAX_BORROWED_SHARE) {
      failures.push({
        code: GATE_FAILURES.BORROWED_TEXT,
          hint:
          `${Math.round(worstBorrowed.score * 100)}% собственного текста уже стоит на ` +
          `indexable-страницах локали (главный донор ${worstBorrowed.against}) ` +
          `при пороге ${Math.round(MAX_BORROWED_SHARE * 100)}%`,
      });
    }

    const admitted = failures.length === 0;
    verdicts.set(entry.id, {
      id: entry.id,
      locale: entry.locale,
      suffix: entry.suffix,
      clusterId: entry.clusterId,
      admitted,
      failures,
      metrics: {
        ownText: entry.measure,
        required,
        similarity: worstText,
        borrowed: worstBorrowed,
        heading: worstHeading,
      },
    });

    if (admitted) {
      if (!pool.has(entry.locale)) pool.set(entry.locale, []);
      pool.get(entry.locale).push(entry);
    }
  }

  return verdicts;
}

/**
 * Одна строка про вердикт — для вывода в CI и в `npm run check:factory`.
 *
 * @param {GateVerdict} verdict
 */
export function formatVerdict(verdict) {
  const { ownText, required, similarity, borrowed } = verdict.metrics;
  /**
   * Запас до порога печатается рядом со значением. Без него отчёт выглядит
   * зелёным и тогда, когда порог не является связывающим ни для кого: за три
   * кластера ворота не отклонили ни одного кандидата, и по одним значениям
   * этого было не видно.
   */
  const slack = [
    `объём ×${(ownText.count / required.count).toFixed(2)}`,
    `похожесть ${(MAX_SIMILARITY - similarity.score).toFixed(2)} до порога`,
    `заимствование ${Math.round((MAX_BORROWED_SHARE - borrowed.score) * 100)} п.п. до порога`,
  ].join(", ");
  const head =
    `${verdict.admitted ? "index  " : "noindex"} ${verdict.id.padEnd(28)} ` +
    `${String(ownText.count).padStart(5)} ${ownText.unit} (нужно ${required.count}), ` +
    `похожесть ${similarity.score.toFixed(2)}` +
    (similarity.against ? ` с ${similarity.against}` : "") +
    `, заимствовано ${Math.round(borrowed.score * 100)}%` +
    ` | запас: ${slack}`;
  if (verdict.admitted) return head;
  return `${head}\n${verdict.failures.map((failure) => `          ↳ ${failure.code}: ${failure.hint}`).join("\n")}`;
}

/** Пороги одной строкой — печатается в отчёте, чтобы не искать их в коде. */
export function describeThresholds() {
  return (
    `объём ≥ ${MIN_OWN_WORDS} слов (th ${MIN_OWN_CHARS.th} / zh ${MIN_OWN_CHARS.zh} / ` +
    `ko ${MIN_OWN_CHARS.ko} / ja ${MIN_OWN_CHARS.ja} симв.), ` +
    `похожесть ≤ ${MAX_SIMILARITY}, заимствование ≤ ${Math.round(MAX_BORROWED_SHARE * 100)}%, ` +
    `пересечение заголовков ≤ ${MAX_HEADING_OVERLAP}, ` +
    "compliance-линтер без нарушений"
  );
}
