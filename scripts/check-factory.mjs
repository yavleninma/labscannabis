#!/usr/bin/env node
/**
 * Отчёт ворот качества БЕЗ сборки: `npm run check:factory`.
 *
 * Первая ступень ОТК в чистом виде — читает данные кластеров
 * (`src/content-factory/`), прогоняет `evaluateCandidates()` и печатает по
 * строке на каждого кандидата: пустил его завод в индекс или нет и, если нет,
 * почему именно. Это тот инструмент, к которому идут с вопросом «я написал
 * страницу, почему она noindex».
 *
 * Ничего не пишет на диск и ничего не роняет по умолчанию: не пройти ворота —
 * не ошибка, а штатный исход, страница просто остаётся вне индекса. С флагом
 * `--strict` возвращает ненулевой код, если хоть один кандидат отклонён; так
 * его можно повесить на отдельный шаг CI для кластера, от которого ждут 100 %
 * прохождения.
 *
 * Полная картина по отрисованным страницам — `npm run check:seo` (вторая
 * ступень: тот же расчёт по `dist/` и против всего корпуса локали).
 */

import {
  FACTORY_CLUSTERS,
  FACTORY_VERDICTS,
  getFactoryIndexRules,
  summarizeFactory,
} from "../src/content-factory/registry.mjs";
import { describeThresholds, formatVerdict } from "./lib/quality-gate.mjs";
import { EXPECTED_INDEXABLE_PAGE_COUNT, MANUAL_INDEXABLE_PAGE_COUNT } from "../src/lib/index-policy.mjs";

const strict = process.argv.slice(2).includes("--strict");
const summary = summarizeFactory();

console.log(`Ворота качества: ${describeThresholds()}.`);
console.log(
  `Кластеров ${summary.clusters} (${FACTORY_CLUSTERS.map((cluster) => cluster.id).join(", ")}), ` +
    `кандидатов ${summary.candidates}, допущено ${summary.admitted}, ` +
    `оставлено noindex ${summary.candidates - summary.admitted}.`,
);
console.log("");

for (const verdict of FACTORY_VERDICTS.values()) {
  console.log(formatVerdict(verdict));
}

console.log("");
console.log("Слаги, допущенные заводом в allowlist:");
for (const rule of getFactoryIndexRules()) {
  console.log(`  ${rule.suffix} — ${rule.locales.join(", ")}`);
}
console.log(
  `Итого индексируемых URL ${EXPECTED_INDEXABLE_PAGE_COUNT} = ` +
    `${MANUAL_INDEXABLE_PAGE_COUNT} вручную + ${summary.admitted} от завода.`,
);

if (strict && summary.rejected.length > 0) {
  console.error(`--strict: ворота не пропустили ${summary.rejected.length} кандидат(ов).`);
  process.exit(1);
}
