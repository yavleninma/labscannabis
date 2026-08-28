#!/usr/bin/env node
/**
 * Search Console API: отправка sitemap и инспекция URL.
 *
 * ЗАЧЕМ ИМЕННО ЭТОТ СКРИПТ. IndexNow (`scripts/ping-indexnow.mjs`) закрывает
 * Bing, Яндекс, Naver, Seznam и Yep. GOOGLE В INDEXNOW НЕ УЧАСТВУЕТ — там
 * единственный программный канал это Search Console API, и он делает ровно две
 * полезные вещи:
 *   1) `sitemaps.submit` — сообщает, что карта обновилась;
 *   2) `urlInspection.index.inspect` — ЧИТАЕТ вердикт Google по конкретному
 *      URL: проиндексирован, «Обнаружена, не проиндексирована», исключён
 *      каноникалом и так далее.
 *
 * Вторая важнее первой и ради неё всё и написано. По этому домену в выгрузке
 * Search Console 149 URL в статусе «Обнаружена, не проиндексирована» — Google
 * уже посмотрел на массовые шаблонные страницы и отказался их индексировать.
 * Инспекция превращает ворота качества из веры в замер: страницу, допущенную
 * воротами, можно спросить у Google и увидеть, согласился он или нет.
 *
 * ЧЕГО ЭТОТ СКРИПТ НЕ ДЕЛАЕТ И НЕ МОЖЕТ.
 *   - Не «отправляет страницу в индекс». Такого API у Google нет: Indexing API
 *     официально принимает только JobPosting и BroadcastEvent, для остального
 *     он не предназначен, и обещать им ускорение индексации магазина — враньё.
 *   - Не ускоряет индексацию сам по себе. `sitemaps.submit` эквивалентен
 *     кнопке в интерфейсе; инспекция вообще только читает.
 *   - Не пишет ни байта в рабочее дерево (в CI стоит `git diff --exit-code`).
 *   - Не входит в `npm run build`.
 *
 * БЕЗ КЛЮЧА НИЧЕГО НЕ ЛОМАЕТСЯ. Если `GSC_SERVICE_ACCOUNT_JSON` не задана,
 * скрипт печатает, что не настроен, показывает, куда смотреть, и выходит с
 * кодом 0. Это штатное состояние до тех пор, пока владелец не заведёт
 * сервисный аккаунт: инструкция для не-программиста —
 * `docs/growth/ops/04-search-console-api.md`.
 *
 * ЗАПУСК.
 *     node scripts/gsc-submit.mjs                    # отправить sitemap
 *     node scripts/gsc-submit.mjs --list             # что Google уже принял
 *     node scripts/gsc-submit.mjs --inspect <url>    # вердикт по одному URL
 *     node scripts/gsc-submit.mjs --inspect-sample 20
 *     node scripts/gsc-submit.mjs --dry-run          # ни одного запроса в сеть
 *     node scripts/gsc-submit.mjs --soft             # не падать на ошибке API
 *
 * КОДЫ ВЫХОДА. Переменная не задана — 0 всегда, это штатное «ещё не настроено».
 * Переменная задана, но не разбирается как ключ сервисного аккаунта — 1: это
 * авария конфигурации (секрет обрезали при копировании, подсунули не тот
 * файл), и молча зеленеть на ней нельзя. API ответил ошибкой — тоже 1, чтобы
 * сломанный ключ было видно, а не «скрипт отработал, ничего не произошло».
 * Для деплой-хука, который не должен краснеть, есть `--soft`: он приглушает
 * код выхода, но не текст.
 */
import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");

/**
 * Ресурс в Search Console. Два несовместимых написания, и перепутать их —
 * самая частая причина 403:
 *   - URL-prefix: `https://labscannabis.boutique/` (со слэшем на конце);
 *   - Domain:     `sc-domain:labscannabis.boutique`.
 * У этого домена в `public/` лежит `google43fb883ce12292c7.html` — файл
 * подтверждения URL-prefix, поэтому значение по умолчанию такое.
 */
const PROPERTY = process.env.GSC_PROPERTY || `${SITE_URL}/`;

const TOKEN_ENDPOINT_FALLBACK = "https://oauth2.googleapis.com/token";
/**
 * Хост API. Взят из discovery-документа
 * (`https://searchconsole.googleapis.com/$discovery/rest?version=v1`,
 * `rootUrl`), а не из статьи в блоге: на этом же хосте живёт и старый путь
 * `webmasters/v3`, и новый `v1/urlInspection`.
 */
const API_ROOT = process.env.GSC_API_ROOT || "https://searchconsole.googleapis.com";

/** `webmasters` нужен для записи (submit); чтения им тоже покрыты. */
const SCOPE = "https://www.googleapis.com/auth/webmasters";

const REQUEST_TIMEOUT_MS = 30_000;
/**
 * Квота URL Inspection — 2000 запросов в сутки и 600 в минуту на ресурс.
 * Пауза между вызовами держит нас далеко от минутного лимита, а потолок
 * выборки не даёт случайно съесть суточный одной командой.
 */
const INSPECT_DELAY_MS = 250;
const INSPECT_SAMPLE_CAP = 200;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const soft = args.includes("--soft");
const listOnly = args.includes("--list");

function flagValues(name) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name && args[i + 1] && !args[i + 1].startsWith("--")) values.push(args[i + 1]);
  }
  return values;
}

function flagNumber(name, fallback) {
  const raw = flagValues(name)[0];
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const inspectUrls = flagValues("--inspect");
const inspectSample = args.includes("--inspect-sample") ? flagNumber("--inspect-sample", 10) : 0;
const submitSitemap = args.includes("--sitemap") || (!listOnly && inspectUrls.length === 0 && inspectSample === 0);

let failed = false;

function log(message) {
  console.log(`[gsc] ${message}`);
}

function problem(message) {
  if (soft) {
    console.warn(`[gsc] ${message}`);
    return;
  }
  console.error(`[gsc] ${message}`);
  failed = true;
}

/**
 * ДВА РАЗНЫХ СОСТОЯНИЯ, А НЕ ОДНО.
 *
 * «Переменной нет» — штатное состояние до того, как владелец заведёт сервисный
 * аккаунт: спокойный текст и код 0.
 *
 * «Переменная задана, но не разбирается как ключ» — АВАРИЯ КОНФИГУРАЦИИ:
 * секрет обрезали при копировании в панель, подсунули не тот файл, прилип
 * лишний перенос строки. Раньше оба случая печатались одинаково и оба
 * выходили нулём, поэтому битый секрет навсегда оставался зелёным, а владелец
 * считал, что канал к Google работает. Теперь второй случай красный (или, с
 * `--soft`, помечен как сломанный, а не как выключенный).
 *
 * @param {string} reason
 * @param {{ broken?: boolean }} [options]
 */
function notConfigured(reason, options = {}) {
  const broken = options.broken === true;
  if (broken) {
    console.error("[gsc] ОШИБКА КОНФИГУРАЦИИ: GSC_SERVICE_ACCOUNT_JSON задана, но ключом не является.");
    console.error("[gsc] Канал к Google СЛОМАН, а не выключен — это не то же самое, что «ещё не настроено».");
    console.error(`[gsc] причина: ${reason}`);
  } else {
    console.log("[gsc] Search Console API не настроен — ничего не отправлено.");
    console.log(`[gsc] причина: ${reason}`);
  }
  console.log("[gsc] что нужно от владельца (по шагам, без кода):");
  console.log("[gsc]   docs/growth/ops/04-search-console-api.md");
  console.log("[gsc] коротко: сервисный аккаунт в Google Cloud → включить Search Console API →");
  console.log("[gsc]          скачать JSON-ключ → добавить e-mail аккаунта владельцем ресурса в");
  console.log("[gsc]          Search Console → положить содержимое ключа в переменную окружения");
  console.log("[gsc]          GSC_SERVICE_ACCOUNT_JSON в Vercel.");
  // `--soft` существует для деплой-хука, который не должен краснеть; он
  // приглушает код выхода, но не текст: строка про сломанный ключ остаётся.
  process.exit(broken && !soft ? 1 : 0);
}

/**
 * Ключ читается из переменной окружения, а не из файла в репозитории.
 * Приватный ключ сервисного аккаунта в git — это утечка, которую нельзя
 * отозвать переписыванием истории.
 *
 * Принимается два написания: сырой JSON и он же в base64. Второе нужно
 * потому, что многослойные переносы строк в `private_key` при копировании
 * через веб-формы регулярно ломаются, а base64 — одна строка без спецсимволов.
 */
function readServiceAccount() {
  const raw = (process.env.GSC_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) notConfigured("переменная GSC_SERVICE_ACCOUNT_JSON пуста или отсутствует");

  let text = raw;
  if (!text.startsWith("{")) {
    text = Buffer.from(raw, "base64").toString("utf8").trim();
    if (!text.startsWith("{")) {
      // Base64 в Node декодирует что угодно, молча выбрасывая мусорные байты,
      // поэтому проверяем результат, а не ловим исключение: иначе владелец
      // получит «Unexpected token �» вместо понятного объяснения.
      notConfigured(
        "GSC_SERVICE_ACCOUNT_JSON не похожа ни на JSON, ни на base64 от JSON — " +
          "в переменную должно попасть содержимое скачанного файла ключа целиком, начиная с {",
        { broken: true },
      );
    }
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    notConfigured(`GSC_SERVICE_ACCOUNT_JSON не разбирается как JSON (${error.message})`, { broken: true });
  }

  if (parsed.type !== "service_account") {
    notConfigured(`в ключе type="${parsed.type}", а нужен "service_account" (скачан не тот файл)`, { broken: true });
  }
  if (!parsed.client_email || !parsed.private_key) {
    notConfigured("в ключе нет client_email или private_key — файл обрезан при копировании", { broken: true });
  }

  return {
    clientEmail: parsed.client_email,
    // Переменные окружения в некоторых панелях хранят перевод строки как \n.
    privateKey: String(parsed.private_key).replace(/\\n/g, "\n"),
    tokenUri: parsed.token_uri || TOKEN_ENDPOINT_FALLBACK,
  };
}

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Подписанный JWT в обмен на access token — стандартный поток для сервисного
 * аккаунта без участия человека. Библиотеки не подключаются намеренно: подпись
 * это двадцать строк на `node:crypto`, а лишняя зависимость в сборке магазина
 * без единого байта клиентского JS стоит дороже.
 */
async function fetchAccessToken({ clientEmail, privateKey, tokenUri }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: tokenUri,
      iat: now,
      // Максимум, который принимает Google, — час.
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`обмен JWT на токен вернул ${response.status}: ${body.slice(0, 300)}`);
  }
  const token = JSON.parse(body).access_token;
  if (!token) throw new Error("в ответе на обмен JWT нет access_token");
  return token;
}

async function api(token, method, pathname, body) {
  const response = await fetch(`${API_ROOT}/${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const text = await response.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: response.status, ok: response.ok, text, json };
}

/**
 * 403 по этому API почти всегда означает не «сломался код», а «сервисный
 * аккаунт не добавлен в ресурс» либо «ресурс написан не в том формате».
 * Печатаем это прямым текстом, иначе владелец получит стектрейс.
 */
function explain(status, text) {
  if (status === 403) {
    return (
      "403 — у сервисного аккаунта нет доступа к ресурсу. Проверьте два места: " +
      "(1) e-mail аккаунта добавлен в Search Console → Настройки → Пользователи и разрешения " +
      "как ВЛАДЕЛЕЦ; (2) GSC_PROPERTY написан ровно так же, как ресурс в консоли " +
      `(сейчас "${PROPERTY}"): URL-prefix со слэшем на конце либо sc-domain:домен`
    );
  }
  if (status === 404) {
    return `404 — ресурс "${PROPERTY}" в Search Console не найден под этим аккаунтом`;
  }
  if (status === 429) return "429 — исчерпана квота API, попробуйте позже";
  return `${status}${text ? ` — ${text.slice(0, 300)}` : ""}`;
}

function readLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}

/** Тот же источник URL, что у пинга IndexNow: собранный sitemap, а не массив. */
function collectBuiltUrls() {
  const indexPath = path.join(DIST_DIR, "sitemap-index.xml");
  if (!existsSync(indexPath)) return [];
  const urls = new Set();
  for (const childUrl of readLocs(readFileSync(indexPath, "utf8"))) {
    const file = path.join(DIST_DIR, path.basename(new URL(childUrl).pathname));
    if (!existsSync(file)) continue;
    for (const loc of readLocs(readFileSync(file, "utf8"))) urls.add(loc);
  }
  return [...urls].sort();
}

function sitemapFeedUrl() {
  return process.env.GSC_SITEMAP_URL || `${SITE_URL}/sitemap-index.xml`;
}

async function doSubmitSitemap(token) {
  const feed = sitemapFeedUrl();
  log(`отправляю sitemap  ${feed}`);
  if (dryRun) return;
  const encoded = `webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps/${encodeURIComponent(feed)}`;
  const { status, ok, text } = await api(token, "PUT", encoded);
  // Успех — пустое тело и 200/204.
  if (ok) {
    log(`sitemap принят (${status})`);
    return;
  }
  problem(`sitemap не принят: ${explain(status, text)}`);
}

async function doListSitemaps(token) {
  log("запрашиваю список известных Google карт");
  if (dryRun) return;
  const { ok, status, text, json } = await api(
    token,
    "GET",
    `webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps`,
  );
  if (!ok) {
    problem(`список карт не получен: ${explain(status, text)}`);
    return;
  }
  const sitemaps = json?.sitemap || [];
  if (sitemaps.length === 0) {
    log("Google не знает ни одной карты по этому ресурсу");
    return;
  }
  for (const entry of sitemaps) {
    const submitted = (entry.contents || []).reduce((sum, c) => sum + Number(c.submitted || 0), 0);
    const indexed = (entry.contents || []).reduce((sum, c) => sum + Number(c.indexed || 0), 0);
    log(
      `  ${entry.path}  скачана ${entry.lastDownloaded || "никогда"}  ` +
        `заявлено ${submitted}  проиндексировано ${indexed}  ошибок ${entry.errors || 0}  ` +
        `предупреждений ${entry.warnings || 0}`,
    );
  }
  log("«проиндексировано» здесь — оценка Google, а не наш счётчик; расхождение с заявленным нормально");
}

const VERDICT_HINTS = {
  PASS: "в индексе",
  NEUTRAL: "не в индексе, явной проблемы Google не называет",
  FAIL: "в индекс не взят",
  VERDICT_UNSPECIFIED: "вердикт не определён",
};

async function doInspect(token, urls) {
  log(`инспекция URL: ${urls.length}`);
  const counters = new Map();
  for (const url of urls) {
    if (dryRun) {
      log(`  ${url}`);
      continue;
    }
    const { ok, status, text, json } = await api(token, "POST", "v1/urlInspection/index:inspect", {
      inspectionUrl: url,
      siteUrl: PROPERTY,
      languageCode: "en-US",
    });
    if (!ok) {
      problem(`инспекция ${url}: ${explain(status, text)}`);
      // 403 и 404 не пройдут и для следующих URL — не выжигаем квоту впустую.
      if (status === 403 || status === 404) return;
      continue;
    }
    const result = json?.inspectionResult?.indexStatusResult || {};
    const verdict = result.verdict || "VERDICT_UNSPECIFIED";
    const coverage = result.coverageState || "—";
    counters.set(coverage, (counters.get(coverage) || 0) + 1);
    log(`  ${verdict.padEnd(8)} ${coverage.padEnd(42)} ${url}`);
    await new Promise((resolve) => setTimeout(resolve, INSPECT_DELAY_MS));
  }
  if (counters.size > 0) {
    log("сводка по состояниям:");
    for (const [state, count] of [...counters].sort((a, b) => b[1] - a[1])) {
      log(`  ${String(count).padStart(4)}  ${state}`);
    }
    log(`расшифровка вердиктов: ${Object.entries(VERDICT_HINTS).map(([k, v]) => `${k} — ${v}`).join("; ")}`);
    log("«Discovered - currently not indexed» здесь — это отказ индексировать, а не очередь");
  }
}

async function main() {
  const account = readServiceAccount();

  log(`ресурс         ${PROPERTY}`);
  log(`сервисный аккаунт ${account.clientEmail}`);
  log("Google в IndexNow не участвует — этот скрипт единственный программный канал к нему");

  let urlsToInspect = inspectUrls;
  if (inspectSample > 0) {
    const built = collectBuiltUrls();
    if (built.length === 0) {
      problem("нет dist/sitemap-index.xml — для --inspect-sample сначала нужен npm run build");
    } else {
      const step = Math.max(1, Math.floor(built.length / Math.min(inspectSample, INSPECT_SAMPLE_CAP)));
      // Выборка с равномерным шагом, а не первые N: иначе всегда инспектируется
      // один и тот же префикс алфавита (/ar/…) и локали не видны.
      const sampled = built.filter((_, i) => i % step === 0).slice(0, Math.min(inspectSample, INSPECT_SAMPLE_CAP));
      urlsToInspect = [...urlsToInspect, ...sampled];
      log(`выборка ${sampled.length} URL из ${built.length} собранных, шаг ${step}`);
    }
  }

  if (dryRun) log("--dry-run: ни одного запроса в сеть не уйдёт");

  let token = null;
  if (!dryRun) {
    try {
      token = await fetchAccessToken(account);
    } catch (error) {
      problem(`аутентификация не удалась: ${error?.message || error}`);
      return;
    }
    log("токен получен");
  }

  if (submitSitemap) await doSubmitSitemap(token);
  if (listOnly) await doListSitemaps(token);
  if (urlsToInspect.length > 0) await doInspect(token, urlsToInspect);
}

main()
  .catch((error) => {
    problem(`непредвиденная ошибка: ${error?.message || error}`);
  })
  .finally(() => {
    if (failed) process.exitCode = 1;
  });
