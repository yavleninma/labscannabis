#!/usr/bin/env node
/**
 * Растровая карточка превью для соцсетей и мессенджеров.
 *
 * ЗАЧЕМ. `og:image` был SVG (`public/og-image.svg`, 1857 байт). Facebook,
 * WhatsApp, Telegram, LINE и X не рендерят SVG в карточке ссылки — ни один из
 * них: пересланная ссылка приходила получателю без картинки вообще. Весь раунд
 * целится в обращения именно в мессенджерах, то есть каждая пересылка теряла
 * самый заметный элемент карточки.
 *
 * ЧТО НА КАРТИНКЕ. Нейтральная брендовая карточка: имя карточки Google, имя
 * сайта, город, домен и возрастной ценз. Сознательно НЕ попадает:
 *   - макро-снимки товара из `public/media` — превью контролируемой травы
 *     расходится дальше сайта в каждый пересланный линк;
 *   - цены, вес, промо — правило №1;
 *   - часы работы («Open 24/7» стояло в старом SVG) — HOURS.hoursVerified=false;
 *   - «Soi Hollywood» (тоже стояло в старом SVG) — это адрес чужого магазина,
 *     с которым Google уже склеил карточку; ровно та строка, которую весь
 *     раунд расшивают.
 *
 * ЗАПУСК. Вручную и только вручную:
 *     node scripts/gen-og-image.mjs
 * Результат (`public/og-image.png`, `public/logo-512.png`,
 * `public/apple-touch-icon.png` и переписанный `public/og-image.svg`)
 * коммитится. В `npm run build` скрипт НЕ входит: CI делает
 * `git diff --exit-code`, и сборка, пишущая в рабочее дерево, роняла бы его.
 *
 * ОГОВОРКА ПРО ШРИФТЫ. Текст растеризуется системным шрифтом через librsvg
 * внутри sharp, поэтому побайтовый результат зависит от машины. Артефактом
 * считается закоммиченный PNG, а не воспроизводимость байтов: скрипт нужен,
 * чтобы карточку можно было перевыпустить осмысленной правкой, а не рисовать
 * заново в редакторе.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

/** Стек подбирается по тому, что реально стоит в Linux-образах. */
const FONT_STACK = "DejaVu Sans, Liberation Sans, FreeSans, Arial, sans-serif";

const PALETTE = {
  bgFrom: "#07100b",
  bgTo: "#0f1c14",
  accent: "#10b981",
  text: "#ffffff",
  muted: "#9fb8a6",
  border: "#1f3a2a",
};

const COPY = {
  /** Имя карточки Google Business — то, по которому магазин ищут. */
  primary: "LABS DISPENSARY",
  /** Имя сайта: одна и та же дверь, второе написание. */
  secondary: "Labs Cannabis",
  tagline: "Licensed cannabis dispensary",
  place: "Pattaya, Thailand",
  domain: "labscannabis.boutique",
  age: "20+",
};

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}

function buildSvg() {
  const t = (value) => escapeXml(value);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${t(`${COPY.primary} — ${COPY.place}`)}">
  <title>${t(`${COPY.primary} — ${COPY.tagline}, ${COPY.place}`)}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PALETTE.bgFrom}"/>
      <stop offset="1" stop-color="${PALETTE.bgTo}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="${PALETTE.accent}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${PALETTE.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="36" y="36" width="${WIDTH - 72}" height="${HEIGHT - 72}" rx="26" fill="none" stroke="${PALETTE.border}" stroke-width="2"/>

  <text x="${WIDTH / 2}" y="152" text-anchor="middle" font-family="${FONT_STACK}" font-size="24" letter-spacing="6" fill="${PALETTE.muted}">${t(COPY.domain.toUpperCase())}</text>

  <text x="${WIDTH / 2}" y="300" text-anchor="middle" font-family="${FONT_STACK}" font-size="82" font-weight="bold" letter-spacing="2" fill="${PALETTE.text}">${t(COPY.primary)}</text>
  <text x="${WIDTH / 2}" y="352" text-anchor="middle" font-family="${FONT_STACK}" font-size="34" fill="${PALETTE.accent}">${t(COPY.secondary)}</text>

  <rect x="${WIDTH / 2 - 90}" y="396" width="180" height="3" rx="2" fill="${PALETTE.accent}" opacity="0.7"/>

  <text x="${WIDTH / 2}" y="460" text-anchor="middle" font-family="${FONT_STACK}" font-size="30" fill="${PALETTE.text}">${t(COPY.tagline)}</text>
  <text x="${WIDTH / 2}" y="504" text-anchor="middle" font-family="${FONT_STACK}" font-size="27" fill="${PALETTE.muted}">${t(COPY.place)}</text>

  <rect x="${WIDTH / 2 - 52}" y="540" width="104" height="46" rx="23" fill="none" stroke="${PALETTE.accent}" stroke-width="2" opacity="0.85"/>
  <text x="${WIDTH / 2}" y="571" text-anchor="middle" font-family="${FONT_STACK}" font-size="24" font-weight="bold" fill="${PALETTE.accent}">${t(COPY.age)}</text>
</svg>
`;
}

/**
 * Знак бренда в растре.
 *
 * `Organization.logo` в JSON-LD указывал на `favicon.svg`, а Google для logo
 * принимает только .jpg/.png/.gif и просит сторону не меньше 112px — то есть
 * узел был, а картинки для карточки знаний фактически не было. Тот же файл
 * закрывает `apple-touch-icon`: iOS не понимает SVG, а в разметке страницы
 * иконки для home screen не было вовсе.
 */
function buildLogoSvg(size) {
  const r = Math.round(size * 0.22);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${PALETTE.bgFrom}"/>
  <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="${r * 0.8}" fill="none" stroke="${PALETTE.accent}" stroke-width="${Math.max(2, size * 0.012)}" opacity="0.55"/>
  <text x="${size / 2}" y="${size * 0.62}" text-anchor="middle" font-family="${FONT_STACK}" font-size="${size * 0.38}" font-weight="bold" fill="${PALETTE.accent}">LC</text>
</svg>
`;
}

async function rasterize(svg, width, height) {
  return sharp(Buffer.from(svg, "utf8"), { density: 288 })
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();
}

async function emit(label, relativePath, buffer) {
  const target = path.resolve(relativePath);
  writeFileSync(target, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(
    `${label.padEnd(22)} ${String(buffer.length).padStart(7)} B  ${meta.width}x${meta.height}  ${meta.format}`,
  );
  return meta;
}

async function main() {
  const svg = buildSvg();

  // SVG остаётся в репозитории как исходник карточки, а не как то, что уходит
  // в `og:image`: в мете стоит PNG. Переписывается здесь же, чтобы в публичном
  // каталоге не лежал файл с «Open 24/7» и «Soi Hollywood».
  writeFileSync(path.resolve("public/og-image.svg"), svg, "utf8");
  console.log(`${"og-image.svg".padEnd(22)} ${String(Buffer.byteLength(svg)).padStart(7)} B  ${WIDTH}x${HEIGHT}  svg`);

  const ogMeta = await emit("og-image.png", "public/og-image.png", await rasterize(svg, WIDTH, HEIGHT));
  await emit("logo-512.png", "public/logo-512.png", await rasterize(buildLogoSvg(512), 512, 512));
  await emit(
    "apple-touch-icon.png",
    "public/apple-touch-icon.png",
    await rasterize(buildLogoSvg(180), 180, 180),
  );

  if (ogMeta.width !== WIDTH || ogMeta.height !== HEIGHT) {
    console.error(`Ожидались ${WIDTH}x${HEIGHT}, получено ${ogMeta.width}x${ogMeta.height}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
