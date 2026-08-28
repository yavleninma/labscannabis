#!/usr/bin/env node
/**
 * ОТЧЁТ ПО НАБОРУ ДАННЫХ СОРТОВ: `npm run check:strains`.
 *
 * Набор данных (`src/data/strain-catalog.ts`) — это сырьё для страниц кластера,
 * и проверять его надо ДО того, как страницы написаны: ошибка в данных
 * размножится на семь локалей сразу. Скрипт делает три вещи.
 *
 * 1. Целостность. Импорт модуля сам роняет процесс, если данные не сходятся
 *    (`collectCatalogProblems()`), — здесь это просто повторяется явно.
 * 2. Compliance. Каждая строка, которую данные отдадут В СТРАНИЦУ на каждой из
 *    семи локалей, прогоняется через тот же `findComplianceViolations()`, что
 *    и отрисованный HTML в `check-seo`. Ловятся цена, промо, рекламный регистр,
 *    медицинские обещания и заявления о крепости — до сборки, а не после.
 *    Заметки для автора (`writerNotesEn`) проверяются тем же линтером.
 * 3. Полнота. Печатает, у каких сортов уже написан текст страницы
 *    (`STRAIN_PAGES`) и на каких локалях, а какие пока только данные.
 *
 * Ничего не пишет на диск. Ненулевой код возврата — только при реальной
 * проблеме: несходящиеся данные или нарушение линтера.
 */

import {
  CATALOG_LOCALES,
  STRAIN_CATALOG,
  STRAIN_SLUGS,
  buildStrainFacts,
  collectCatalogProblems,
  compareStrains,
  strainLinkLabel,
  strainPathSuffix,
} from "../src/data/strain-catalog.ts";
import { STRAIN_PAGES, STRAINS_INDEX_COPY } from "../src/data/strain-pages.ts";
import { STRAINS_CLUSTER } from "../src/content-factory/clusters/strains.mjs";
import { findComplianceViolations } from "./lib/compliance-lexicon.mjs";
import { readFileSync } from "node:fs";

const problems = collectCatalogProblems();
if (problems.length > 0) {
  console.error("Данные не сходятся:");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

/*
 * СВЯЗНОСТЬ КЛАСТЕРА. Три вещи, которые расходятся молча и обнаруживаются
 * только падением сборки с сообщением не о том:
 *   1. ключ подписи ссылки выводится из слага (`ak-47` → `ak47Strain`), и если
 *      в `ui.json` такого ключа нет, страница остаётся без входящих ссылок и
 *      `check-seo` объявляет её сиротой;
 *   2. хаб собирает группы по ароматическим семьям и подписывает каждый сорт
 *      однострочной фразой из `blurbs` — сорт без фразы просто исчезает из
 *      хаба, не сломав ничего заметного;
 *   3. группы хаба обязаны покрывать все семьи набора, иначе сорт не попадёт
 *      ни в одну группу.
 */
const UI_LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];
let wiring = 0;
for (const locale of UI_LOCALES) {
  const ui = JSON.parse(readFileSync(new URL(`../src/i18n/${locale}/ui.json`, import.meta.url), "utf8"));
  for (const [suffix, key] of Object.entries(STRAINS_CLUSTER.linkLabelKeys)) {
    if (typeof ui.footerSeo?.[key] !== "string") {
      wiring += 1;
      console.error(`  ${locale}: нет подписи ссылки footerSeo.${key} для ${suffix}`);
    }
  }
}
/*
 * Хаб сверяется НЕ со всем набором данных, а со списком страниц ЭТОЙ локали.
 *
 * Прошлая версия требовала подпись на каждый из 20 слагов во всех семи хабах и
 * поэтому печатала 130 «расхождений» на здоровом дереве: 17 сортов написаны
 * только на en+ru, и на японском хабе им взяться неоткуда. Проверка, которая
 * всегда красная, не проверяет ничего — её перестают читать, и она пропускает
 * настоящее расхождение вместе со своими ста тридцатью.
 *
 * Правильный инвариант двусторонний: у сорта СО СТРАНИЦЕЙ на этой локали
 * обязаны быть и группа по семье, и подпись в хабе (иначе страница исчезает из
 * хаба, не сломав ничего заметного); а подпись сорта БЕЗ страницы на этой
 * локали — висячая, она обещает читателю то, чего нет.
 */
for (const [locale, copy] of Object.entries(STRAINS_INDEX_COPY)) {
  const covered = new Set(copy.groups.flatMap((group) => group.families));
  const published = STRAIN_SLUGS.filter((slug) => Boolean(STRAIN_PAGES[slug]?.[locale]));
  for (const slug of published) {
    const profile = STRAIN_CATALOG[slug];
    if (!covered.has(profile.family)) {
      wiring += 1;
      console.error(`  ${locale}: хаб не покрывает ароматическую семью ${profile.family} (${slug})`);
    }
    if (typeof copy.blurbs[slug] !== "string" || copy.blurbs[slug].length === 0) {
      wiring += 1;
      console.error(`  ${locale}: в хабе нет подписи сорта ${slug}, а страница на этой локали есть`);
    }
  }
  for (const slug of Object.keys(copy.blurbs)) {
    if (published.includes(slug)) continue;
    wiring += 1;
    console.error(`  ${locale}: в хабе подпись сорта ${slug}, а страницы на этой локали нет — висячая подпись`);
  }
}
if (wiring > 0) {
  console.error(`Связность кластера: ${wiring} расхождени(й).`);
  process.exit(1);
}

let violations = 0;
for (const slug of STRAIN_SLUGS) {
  const suffix = strainPathSuffix(slug);
  // Заметки для автора линтуются тоже: они не попадают в HTML, но из них пишут
  // страницу, и запрещённый оборот в сырье — это ловушка, поставленная своими
  // руками на следующую стадию.
  const profile = STRAIN_CATALOG[slug];
  const notes = [
    ...profile.writerNotesEn,
    profile.lineage.noteEn ?? "",
    profile.origin.noteEn ?? "",
    profile.flowering?.noteEn ?? "",
  ];
  for (const text of notes) {
    for (const violation of findComplianceViolations(text, `dist/en/${suffix}/index.html`)) {
      violations += 1;
      console.error(`  ${suffix} (заметка автору): ${violation.ruleId} — ${violation.hint} («${violation.match}»)`);
    }
  }
  for (const locale of CATALOG_LOCALES) {
    const strings = [
      strainLinkLabel(slug, locale),
      ...buildStrainFacts(slug, locale).flatMap((fact) => [fact.label, fact.value]),
    ];
    for (const text of strings) {
      for (const violation of findComplianceViolations(text, `dist/${locale}/${suffix}/index.html`)) {
        violations += 1;
        console.error(`  ${locale}/${suffix}: ${violation.ruleId} — ${violation.hint} («${violation.match}»)`);
      }
    }
  }
}

console.log(`Сортов в наборе: ${STRAIN_SLUGS.length}. Локалей вывода: ${CATALOG_LOCALES.length}.`);
console.log("");

for (const slug of STRAIN_SLUGS) {
  const profile = STRAIN_CATALOG[slug];
  const written = CATALOG_LOCALES.filter((locale) => STRAIN_PAGES[slug]?.[locale]);
  const facts = buildStrainFacts(slug, "en").length;
  console.log(
    `${slug.padEnd(20)} ${profile.lean.padEnd(15)} ${profile.family.padEnd(16)} ` +
      `строк фактов ${facts}, соседи: ${profile.compareWith.join(", ")}`,
  );
  console.log(
    `${" ".repeat(20)} текст страницы: ${written.length > 0 ? written.join(", ") : "ещё не написан"}` +
      `, источников ${profile.sources.length}`,
  );
}

console.log("");
console.log("Проверка вычисляемого сравнения (сорт против первого соседа):");
for (const slug of STRAIN_SLUGS.slice(0, 5)) {
  const neighbour = STRAIN_CATALOG[slug].compareWith[0];
  const contrast = compareStrains(slug, neighbour);
  console.log(
    `  ${slug} ↔ ${neighbour}: общих терпенов ${contrast.sharedTerpenes.length}, ` +
      `общих нот ${contrast.sharedAroma.length}, семья ${contrast.sameFamily ? "та же" : "другая"}, ` +
      `разница цветения ${contrast.floweringGapWeeks ?? "?"} нед.`,
  );
}

console.log("");
console.log("Пример блока фактов (ja, gelato):");
for (const fact of buildStrainFacts("gelato", "ja")) {
  console.log(`  ${fact.label}: ${fact.value}`);
}

if (violations > 0) {
  console.error("");
  console.error(`Compliance-линтер: ${violations} нарушени(й) в данных набора.`);
  process.exit(1);
}
console.log("");
console.log("Compliance-линтер по всем семи локалям: нарушений нет.");
