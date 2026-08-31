/**
 * РАЗБИЕНИЕ САЙТМАПА ПО КЛАСТЕРАМ. Часть `npm run build`, идёт сразу за `astro build`.
 *
 * ЗАЧЕМ. `@astrojs/sitemap` кладёт все URL в один `sitemap-0.xml`. Search
 * Console показывает покрытие («Проиндексировано» / «Обнаружена, не
 * проиндексирована» / «Просканирована, не проиндексирована») в разрезе
 * ОТПРАВЛЕННОГО САЙТМАПА, и одна плоская карта на весь сайт даёт ровно одну
 * строку отчёта. Между тем весь смысл ворот качества
 * (`scripts/lib/quality-gate.mjs`) — решать, какие заводские страницы пускать в
 * индекс, а решение это принимается вслепую: 149 отказов «Обнаружена, не
 * проиндексирована», из-за которых ворота и появились, не разложены ни по
 * кластеру, ни по локали.
 *
 * Разбиение сделано ровно по границе «кто допустил этот URL»:
 *
 *   sitemap-pages.xml         — страницы-личности из `MANUAL_INDEX_POLICY_RULES`
 *   sitemap-strains.xml       — кластер сортов
 *   sitemap-questions.xml     — кластер вопросов
 *   sitemap-getting-here.xml  — кластер гео-маршрутов
 *
 * Тогда строка отчёта в Search Console отвечает на вопрос, который ворота и
 * задают: пускает ли Google в индекс то, что они допустили, и какой кластер
 * отстаёт. Это единственный способ получить обратную связь по вердикту ворот,
 * не выгружая отчёт по 196 URL руками.
 *
 * ЧТО ЭТО НЕ МЕНЯЕТ. Ни одного URL, ни одного `lastmod`, ни одной альтернативы
 * `xhtml:link`: блоки `<url>` переносятся из вывода Astro дословно и целиком.
 * Меняется только то, в каком файле блок лежит. `robots.txt` по-прежнему
 * указывает на `sitemap-index.xml`, а `scripts/ping-indexnow.mjs` уже читает
 * дочерние карты из индекса, а не хардкодит имя.
 *
 * ПОЧЕМУ ОТДЕЛЬНЫЙ ШАГ, А НЕ ИНТЕГРАЦИЯ. Адаптер Vercel копирует `dist/` в
 * `.vercel/output/static/` своим хуком `astro:build:done`, и порядок хуков
 * зависит от порядка регистрации интеграций — то есть интеграция, добавленная
 * «не туда», молча правила бы только одну из двух копий. Шаг после сборки
 * записывает обе и не зависит от порядка.
 *
 * ДЕТЕРМИНИЗМ. Порядок блоков внутри каждой карты сохраняется таким, каким его
 * дал Astro, имена файлов фиксированы, `lastmod` не трогается. Две сборки
 * одного коммита дают побайтово одинаковый результат — это проверяет
 * `checkSitemapLastmod()` в `scripts/check-seo.mjs`.
 */

import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");

/** Каталоги, в которых лежит одна и та же собранная копия сайта. */
const OUTPUT_DIRS = [path.join(ROOT, "dist"), path.join(ROOT, ".vercel", "output", "static")].filter(
  (dir) => existsSync(dir),
);

/**
 * Кластер по пути URL. Порядок значим: первое совпадение выигрывает.
 *
 * Классификация идёт по пути, а не по импорту реестра завода, и это осознанно:
 * скрипт работает с уже собранным XML и не должен уметь собирать сайт заново.
 * Расхождение между этой таблицей и реестром ловится ниже — URL, не попавший ни
 * в один кластер, кладётся в `pages`, а итоговая сумма сверяется с исходной.
 */
const PARTITIONS = [
  { name: "strains", test: (suffix) => suffix === "strains" || suffix.startsWith("strains/") },
  { name: "questions", test: (suffix) => suffix.startsWith("questions/") },
  { name: "getting-here", test: (suffix) => suffix.startsWith("getting-here/") },
  { name: "pages", test: () => true },
];

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

function suffixOf(loc) {
  const pathname = new URL(loc).pathname.replace(/^\/+|\/+$/g, "");
  const [, ...rest] = pathname.split("/");
  return rest.join("/");
}

function main() {
  if (OUTPUT_DIRS.length === 0) {
    throw new Error("Ни dist/, ни .vercel/output/static/ не существуют — сначала `astro build`");
  }

  const [primary] = OUTPUT_DIRS;
  const generated = readdirSync(primary).filter((file) => /^sitemap-\d+\.xml$/.test(file));
  if (generated.length === 0) {
    throw new Error(`В ${primary} нет ни одного sitemap-N.xml — @astrojs/sitemap ничего не собрал`);
  }

  let urlsetOpen = "";
  const blocks = [];
  for (const file of generated.sort()) {
    const xml = readFileSync(path.join(primary, file), "utf8");
    if (!urlsetOpen) urlsetOpen = xml.match(/<urlset\b[^>]*>/)?.[0] ?? "";
    for (const match of xml.matchAll(/<url>[\s\S]*?<\/url>/g)) blocks.push(match[0]);
  }
  if (!urlsetOpen) throw new Error("В собранном сайтмапе не найден открывающий <urlset>");

  const grouped = new Map(PARTITIONS.map((partition) => [partition.name, []]));
  for (const block of blocks) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!loc) throw new Error("Блок <url> без <loc> — разбирать нечего");
    const suffix = suffixOf(loc);
    const partition = PARTITIONS.find((candidate) => candidate.test(suffix));
    grouped.get(partition.name).push(block);
  }

  const children = [];
  let written = 0;
  for (const partition of PARTITIONS) {
    const group = grouped.get(partition.name);
    // Пустой кластер файла не получает: пустая карта в индексе — это строка
    // отчёта, за которой ничего нет, и повод для «Не удалось получить» в консоли.
    if (group.length === 0) continue;
    const file = `sitemap-${partition.name}.xml`;
    const xml = `${XML_HEADER}${urlsetOpen}${group.join("")}</urlset>`;
    for (const dir of OUTPUT_DIRS) writeFileSync(path.join(dir, file), xml, "utf8");
    children.push({ file, count: group.length });
    written += group.length;
  }

  if (written !== blocks.length) {
    throw new Error(`Разбиение потеряло URL: было ${blocks.length}, записано ${written}`);
  }

  const index =
    `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    children.map((child) => `<sitemap><loc>${SITE}/${child.file}</loc></sitemap>`).join("") +
    "</sitemapindex>";

  for (const dir of OUTPUT_DIRS) {
    writeFileSync(path.join(dir, "sitemap-index.xml"), index, "utf8");
    /*
     * Исходные `sitemap-N.xml` удаляются, а не остаются рядом. Оставленные, они
     * объявляли бы каждый URL дважды — и для поисковика, и для `check-seo`,
     * который читает ВСЕ файлы `sitemap*.xml` в корне сборки и сверяет их сумму
     * с политикой индексации.
     */
    for (const file of generated) rmSync(path.join(dir, file), { force: true });
  }

  const report = children.map((child) => `${child.file.slice(8, -4)} ${child.count}`).join(", ");
  process.stdout.write(`Сайтмап разбит по кластерам: ${report} (всего ${written}).\n`);
}

main();
