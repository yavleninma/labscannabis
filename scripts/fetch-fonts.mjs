/**
 * ЗАБОР ШРИФТОВ НА СВОЙ ХОСТ. Запуск руками: `npm run gen:fonts`.
 *
 * ЗАЧЕМ. До этого `<head>` каждой страницы содержал два `preconnect` и
 * `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">`.
 * Кросс-доменная таблица стилей блокирует первую отрисовку, а LCP-элемент здесь
 * — заголовок H1 (в `dist` ноль JS и ноль `<img>`), то есть LCP упирается ровно
 * в неё. Замер ответа css2 при одинаковом User-Agent, сжатый транспорт:
 *
 *   en/ru  742 B      — Inter
 *   th   1 261 B      — Inter + Noto Sans Thai
 *   ar   2 425 B      — Inter + Noto Sans Arabic
 *   zh  93 466 B      — Inter + Noto Sans SC   (303 объявления @font-face)
 *   ja  91 745 B      — Inter + Noto Sans JP   (372 объявления)
 *   ko  70 158 B      — Inter + Noto Sans KR   (372 объявления)
 *
 * Для сравнения: сама страница `/zh/` весит 12,8 КБ по проводу. То есть на трёх
 * локалях отрисовка ждала файл в семь раз тяжелее страницы — и это ещё до
 * первого байта самого шрифта. Причина не в жадности Google, а в устройстве
 * CJK: набор режется на сотни срезов по `unicode-range`, и манифест этих срезов
 * и есть тело ответа.
 *
 * ЧТО СДЕЛАНО ВМЕСТО ЭТОГО.
 *
 * 1. Латиница, кириллица, тайская и арабская письменность — свои файлы в
 *    `public/fonts/`. Все три семейства на Google Fonts сегодня ВАРИАТИВНЫЕ:
 *    запрос `wght@400;500;600;700` отдаёт для всех четырёх начертаний ОДИН и
 *    тот же URL (проверено сравнением ссылок: у Inter 28 объявлений и 7
 *    уникальных файлов). Значит один файл на срез закрывает весь диапазон
 *    100-900 — и заодно чинится `font-extrabold` (800) в трёх местах разметки,
 *    который до этого браузер рисовал синтетическим жирным, потому что 800 в
 *    запросе не было.
 *
 * 2. CJK на свой хост НЕ забирается и с Google больше не грузится. Триста
 *    срезов невозможно ни разумно закоммитить, ни разумно предзагрузить, а
 *    системные наборы на устройствах этих рынков (PingFang SC, Hiragino Sans,
 *    Apple SD Gothic Neo, Noto Sans CJK на Android, Yu Gothic, Malgun Gothic)
 *    и без нас рисуют текст лучше, чем веб-шрифт, приехавший вторым запросом.
 *    Стек задаётся в `src/styles/fonts.css` по `html[lang]`.
 *
 * ПОЧЕМУ ГЕНЕРАТОР, А НЕ РУЧНАЯ ПРАВКА CSS. `unicode-range` — это и есть
 * подписка на срез: ошибка в одном диапазоне тихо ломает отображение части
 * символов. Диапазоны переносятся из ответа Google дословно, а не
 * переписываются руками.
 *
 * ПОЧЕМУ ВРУЧНУЮ, А НЕ НА СБОРКЕ. Сборке запрещено писать в рабочее дерево
 * (CI делает `git diff --exit-code`), и сборка не имеет права ходить в сеть:
 * иначе деплой перестаёт быть воспроизводимым и падает вместе с чужим хостом.
 * Файлы лежат в репозитории; этот скрипт запускают, когда шрифт нужно обновить.
 *
 * ЛИЦЕНЗИЯ. Inter и Noto Sans — SIL Open Font License 1.1, которая прямо
 * разрешает размещение у себя. Текст уведомления кладётся рядом со шрифтами
 * (`public/fonts/LICENSE.txt`) вместе с происхождением каждого файла.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FONT_DIR = path.join(ROOT, "public", "fonts");
const CSS_PATH = path.join(ROOT, "src", "styles", "fonts.css");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "font-manifest.json");

/**
 * User-Agent решает, что отдаст css2: без современного браузера в заголовке
 * Google присылает ttf вместо woff2. Строка зафиксирована, чтобы повторный
 * запуск давал те же файлы.
 */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Что забираем. `subsets` — это ровно те срезы, символы которых встречаются на
 * сайте. Лишний срез стоит места в репозитории и ничего не стоит посетителю
 * (`unicode-range` не даст его скачать), поэтому список щедрый там, где файл
 * маленький, и скупой там, где большой.
 *
 * `greek` и `vietnamese` у Inter не берутся: ни одного символа этих письменностей
 * на сайте нет, а `latin-ext` уже покрывает диакритику европейских языков,
 * которая может приехать в имени собственном.
 */
const FAMILIES = [
  {
    id: "inter",
    family: "Inter",
    query: "Inter:wght@400;500;600;700",
    cssFamily: "Inter",
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  },
  {
    id: "noto-sans-thai",
    family: "Noto Sans Thai",
    query: "Noto+Sans+Thai:wght@400;600;700",
    cssFamily: "Noto Sans Thai",
    // Латиницу этой гарнитуры не берём: латинские символы на тайской странице
    // рисует Inter, которая уже загружена.
    subsets: ["thai"],
  },
  {
    id: "noto-sans-arabic",
    family: "Noto Sans Arabic",
    query: "Noto+Sans+Arabic:wght@400;600;700",
    cssFamily: "Noto Sans Arabic",
    subsets: ["arabic"],
  },
];

/** @param {string} url */
async function fetchText(url) {
  const response = await fetch(url, { headers: { "User-Agent": UA } });
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return response.text();
}

/**
 * Разбор ответа css2. Google печатает срез комментарием ПЕРЕД блоком, поэтому
 * пара «комментарий + @font-face» читается одним выражением.
 *
 * @param {string} css
 */
function parseFontFaces(css) {
  const blocks = [];
  const pattern = /\/\* ([a-z0-9-]+) \*\/\s*@font-face \{([\s\S]*?)\}/g;
  let match;
  while ((match = pattern.exec(css)) !== null) {
    const [, subset, body] = match;
    const url = body.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];
    const unicodeRange = body.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1];
    if (!url || !unicodeRange) continue;
    blocks.push({ subset, url, unicodeRange, weight });
  }
  return blocks;
}

async function main() {
  await mkdir(FONT_DIR, { recursive: true });

  const manifest = [];
  const cssBlocks = [];

  for (const family of FAMILIES) {
    const css = await fetchText(
      `https://fonts.googleapis.com/css2?family=${family.query}&display=swap`,
    );
    const faces = parseFontFaces(css);

    for (const subset of family.subsets) {
      const forSubset = faces.filter((face) => face.subset === subset);
      if (forSubset.length === 0) {
        throw new Error(`${family.family}: срез "${subset}" не найден в ответе css2`);
      }

      /*
       * Проверка вариативности, а не допущение о ней. Если Google когда-нибудь
       * вернётся к статическим начертаниям, разные веса приедут разными
       * ссылками — и один файл на срез станет молчаливой потерей начертаний.
       * Тогда скрипт обязан упасть, а не тихо взять первое.
       */
      const uniqueUrls = new Set(forSubset.map((face) => face.url));
      if (uniqueUrls.size !== 1) {
        throw new Error(
          `${family.family}/${subset}: ${uniqueUrls.size} разных файлов на ${forSubset.length} ` +
            "начертаний — семейство перестало быть вариативным, схема «один файл на срез» больше неверна",
        );
      }

      const [face] = forSubset;
      const response = await fetch(face.url, { headers: { "User-Agent": UA } });
      if (!response.ok) throw new Error(`${face.url} → HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());

      const file = `${family.id}-${subset}.woff2`;
      await writeFile(path.join(FONT_DIR, file), bytes);

      manifest.push({
        family: family.cssFamily,
        subset,
        file: `/fonts/${file}`,
        bytes: bytes.length,
        source: face.url,
      });

      cssBlocks.push(
        [
          "@font-face {",
          `  font-family: "${family.cssFamily}";`,
          "  font-style: normal;",
          /*
           * Диапазон вместо числа — это и есть объявление вариативного шрифта.
           * Ровно оно чинит `font-extrabold`: 800 попадает внутрь диапазона и
           * рисуется настоящим начертанием, а не синтетическим утолщением.
           */
          "  font-weight: 100 900;",
          "  font-display: swap;",
          `  src: url("/fonts/${file}") format("woff2");`,
          `  unicode-range: ${face.unicodeRange};`,
          "}",
        ].join("\n"),
      );

      process.stdout.write(`${family.family} / ${subset}: ${bytes.length} B → ${file}\n`);
    }
  }

  const header = `/*
 * СГЕНЕРИРОВАНО \`npm run gen:fonts\` (scripts/fetch-fonts.mjs). Не править руками:
 * \`unicode-range\` переносится из ответа Google Fonts дословно, и ручная правка
 * тихо ломает отображение части символов.
 *
 * Файлы лежат в \`public/fonts/\` и отдаются со своего домена. Кросс-доменного
 * запроса за таблицей стилей в \`<head>\` больше нет — см. шапку генератора,
 * там же замеры, ради которых это сделано.
 */

`;

  /*
   * Стек по локали задаётся здесь, а не инлайновым стилем в разметке: `<html
   * lang>` уже несёт локаль, и CSS умеет читать её сам. Для zh/ko/ja веб-шрифта
   * нет вовсе — текст рисуют системные наборы, которые на этих рынках стоят
   * на каждом устройстве.
   */
  const stacks = `
:root {
  --font-latin: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-sans: var(--font-latin);
}

html[lang="th"] {
  --font-sans: "Inter", "Noto Sans Thai", "Sarabun", system-ui, sans-serif;
}

html[lang="ar"] {
  --font-sans: "Inter", "Noto Sans Arabic", "Geeza Pro", "Segoe UI", system-ui, sans-serif;
}

/*
 * CJK: системные наборы вместо веб-шрифта. Причина в цене — манифест срезов
 * Noto Sans SC/JP/KR весит 70-93 КБ и блокирует первую отрисовку, — но результат
 * не компромисс: PingFang, Hiragino, Apple SD Gothic Neo и Noto Sans CJK,
 * предустановленные на этих рынках, отрисованы под свои письменности лучше, чем
 * веб-шрифт, приехавший вторым запросом. Inter стоит первой ради латиницы:
 * названия, домен и адрес на этих страницах остаются латинскими.
 */
html[lang="zh-CN"] {
  --font-sans: "Inter", "PingFang SC", "HarmonyOS Sans SC", "Source Han Sans SC",
    "Noto Sans CJK SC", "Microsoft YaHei", "Heiti SC", sans-serif;
}

html[lang="ja"] {
  --font-sans: "Inter", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP",
    "Yu Gothic", "Meiryo", sans-serif;
}

html[lang="ko"] {
  --font-sans: "Inter", "Apple SD Gothic Neo", "Pretendard", "Noto Sans CJK KR",
    "Malgun Gothic", "Nanum Gothic", sans-serif;
}
`;

  await writeFile(CSS_PATH, `${header}${cssBlocks.join("\n\n")}\n${stacks}`, "utf8");
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const license = `Fonts in this directory are redistributed under the SIL Open Font License 1.1.

Inter — Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter)
Noto Sans Thai, Noto Sans Arabic — Copyright (c) The Noto Project Authors (https://github.com/notofonts)

Full licence text: https://openfontlicense.org/open-font-license-official-text/

Each file was fetched from the Google Fonts CDN by scripts/fetch-fonts.mjs.
The originating URL of every file is recorded in src/data/font-manifest.json.
`;
  await writeFile(path.join(FONT_DIR, "LICENSE.txt"), license, "utf8");

  const total = manifest.reduce((sum, item) => sum + item.bytes, 0);
  process.stdout.write(
    `\n${manifest.length} файлов, ${(total / 1024).toFixed(0)} КБ в репозитории. ` +
      "Посетитель качает только те срезы, символы которых встретились на странице.\n",
  );
}

await main();
