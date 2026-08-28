#!/usr/bin/env node
/**
 * Пинг IndexNow после деплоя.
 *
 * КТО ЭТО ЧИТАЕТ. IndexNow поддерживают Bing, Яндекс, Naver, Seznam и Yep —
 * протокол общий, отправка в один эндпоинт расходится по всем участникам.
 * GOOGLE В INDEXNOW НЕ УЧАСТВУЕТ. Это надо держать в голове буквально: пинг
 * НЕ ускоряет индексацию в Google и не заменяет Search Console. Для Google
 * работают только sitemap, внутренние ссылки и «Проверка URL» в консоли.
 * Ценность здесь ровно в двух системах — Яндекс и Bing, — и обе для русского
 * и англоязычного запроса по Паттайе стоят денег.
 *
 * ЧТО ДЕЛАЕТ. Читает список URL из СОБРАННОГО sitemap-index (`dist/`), а не из
 * захардкоженного массива: тогда новые страницы попадают в пинг автоматически,
 * и рассинхронизация «страница есть, а в пинге её нет» невозможна по
 * построению. Отправляет батчем на api.indexnow.org, печатает код ответа.
 *
 * ЧЕГО НЕ ДЕЛАЕТ.
 *   - Не пишет в рабочее дерево ни одного байта: в CI стоит
 *     `git diff --exit-code`, и скрипт, оставляющий файл, ронял бы проверку.
 *   - Не роняет деплой. Недоступный эндпоинт, 4xx, таймаут, отсутствующий
 *     `dist/` — всё это предупреждение и выход с кодом 0. Сайт уже выложен;
 *     непринятый пинг means лишь то, что переобход придёт своим чередом.
 *   - Не входит в `npm run build`. Запускается отдельным workflow после
 *     успешного деплоя (`.github/workflows/indexnow.yml`) или руками.
 *
 * ЗАПУСК.
 *     node scripts/ping-indexnow.mjs --dry-run     # печатает и не отправляет
 *     node scripts/ping-indexnow.mjs               # отправляет
 *
 * КЛЮЧ. Лежит в `public/<key>.txt` и после сборки — в `dist/<key>.txt`.
 * Содержимое файла обязано совпадать с его именем: это и есть доказательство
 * владения доменом. Скрипт проверяет совпадение до отправки, потому что 403 от
 * эндпоинта из-за расхождения выглядит в логе как «непонятная ошибка сети».
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const PUBLIC_DIR = path.resolve("public");
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");
/** Ограничение протокола — 10 000 URL на запрос. Нам до него далеко. */
const MAX_URLS_PER_REQUEST = 10_000;
const REQUEST_TIMEOUT_MS = 20_000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

/** Предупреждение вместо падения: пинг не имеет права ронять пайплайн деплоя. */
function bail(message) {
  console.warn(`[indexnow] ${message}`);
  console.warn("[indexnow] пропускаю отправку, выхожу с кодом 0");
  process.exit(0);
}

/**
 * Ключ проверяемого владения. Имя файла и его содержимое обязаны совпадать —
 * так участники протокола убеждаются, что пинг шлёт владелец домена.
 */
function resolveKey() {
  const sourceDir = existsSync(DIST_DIR) ? DIST_DIR : PUBLIC_DIR;
  const candidates = readdirSync(sourceDir).filter((file) => /^[0-9a-f]{8,128}\.txt$/i.test(file));
  if (candidates.length === 0) {
    bail(`ключевой файл IndexNow не найден в ${path.relative(process.cwd(), sourceDir)}/`);
  }
  if (candidates.length > 1) {
    bail(`ключевых файлов несколько (${candidates.join(", ")}) — непонятно, какой считать своим`);
  }
  const file = candidates[0];
  const key = path.basename(file, ".txt");
  const content = readFileSync(path.join(sourceDir, file), "utf8").trim();
  if (content !== key) {
    bail(`содержимое ${file} не совпадает с именем файла — эндпоинт ответит 403`);
  }
  return { key, keyLocation: `${SITE_URL}/${file}` };
}

function readLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}

/**
 * Список URL берётся из sitemap-index: сначала дочерние карты, из них — `loc`.
 * Единственный источник правды тот же, что у поисковика.
 */
function collectUrls() {
  const indexPath = path.join(DIST_DIR, "sitemap-index.xml");
  if (!existsSync(indexPath)) {
    bail(`нет ${path.relative(process.cwd(), indexPath)} — сначала нужен npm run build`);
  }

  const childUrls = readLocs(readFileSync(indexPath, "utf8"));
  const urls = new Set();

  for (const childUrl of childUrls) {
    const file = path.join(DIST_DIR, path.basename(new URL(childUrl).pathname));
    if (!existsSync(file)) {
      console.warn(`[indexnow] дочерний sitemap не найден локально, пропускаю: ${childUrl}`);
      continue;
    }
    for (const loc of readLocs(readFileSync(file, "utf8"))) urls.add(loc);
  }

  return [...urls].sort();
}

async function send(payload) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Отдельный User-Agent: в логах эндпоинта видно, кто именно постучался.
      "User-Agent": "labscannabis-indexnow/1.0 (+https://labscannabis.boutique/)",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = await response.text().catch(() => "");
  return { status: response.status, ok: response.ok, body: body.slice(0, 400) };
}

async function main() {
  const { key, keyLocation } = resolveKey();
  const urls = collectUrls();

  if (urls.length === 0) bail("в sitemap не нашлось ни одного URL");
  if (urls.length > MAX_URLS_PER_REQUEST) {
    bail(`URL ${urls.length}, лимит протокола ${MAX_URLS_PER_REQUEST} на запрос`);
  }

  const host = new URL(SITE_URL).host;
  const payload = { host, key, keyLocation, urlList: urls };

  console.log(`[indexnow] эндпоинт     ${ENDPOINT}`);
  console.log("[indexnow] участники    Bing, Yandex, Naver, Seznam, Yep");
  console.log("[indexnow] НЕ участник  Google — протокол им не поддерживается");
  console.log(`[indexnow] host         ${host}`);
  console.log(`[indexnow] keyLocation  ${keyLocation}`);
  console.log(`[indexnow] URL в пинге  ${urls.length}`);
  for (const url of urls) console.log(`  ${url}`);

  if (dryRun) {
    console.log("[indexnow] --dry-run: ничего не отправлено");
    return;
  }

  try {
    const { status, ok, body } = await send(payload);
    // 200 — принято, 202 — принято, ключ ещё проверяется. Оба нормальны.
    if (ok) {
      console.log(`[indexnow] ответ ${status} — принято`);
      return;
    }
    console.warn(`[indexnow] ответ ${status}${body ? ` — ${body}` : ""}`);
    console.warn("[indexnow] пинг не принят; деплой это не отменяет");
  } catch (error) {
    console.warn(`[indexnow] запрос не удался: ${error?.message || error}`);
    console.warn("[indexnow] пинг не отправлен; деплой это не отменяет");
  }
}

main().catch((error) => {
  // Последний рубеж: даже неожиданная ошибка не должна красить деплой в красный.
  console.warn(`[indexnow] непредвиденная ошибка: ${error?.message || error}`);
});
