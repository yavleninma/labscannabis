#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";

const FFMPEG = ffmpegInstaller.path;
// Каталоги переопределяются переменными окружения: иначе конвейер нельзя
// прогнать на одном файле, не трогая рабочий каталог.
//
// Выход — `media-source/`, а НЕ `public/`: файлы каталога не публикуются
// (см. `checkQuarantinedMedia()` в scripts/check-seo.mjs). Всё, что попадает
// в `public/`, отдаётся с домена по прямому URL, а это макро-снимки товара.
const STOCK = path.resolve(process.env.MEDIA_SOURCE_DIR || path.join(process.cwd(), "stock-photo"));
const OUT = path.resolve(process.env.MEDIA_OUTPUT_DIR || path.join(process.cwd(), "media-source"));

const IMAGE_EXT = /\.(jpe?g|png)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

function isNewer(src, dest) {
  if (!fs.existsSync(dest)) return true;
  return fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function transcodeVideo(file) {
  const base = path.basename(file, path.extname(file));
  const mp4Out = path.join(OUT, `${base}.mp4`);
  const webmOut = path.join(OUT, `${base}.webm`);
  const posterOut = path.join(OUT, `${base}-poster.jpg`);

  if (isNewer(file, mp4Out)) {
    run(
      `"${FFMPEG}" -y -i "${file}" -c:v libx264 -crf 22 -preset medium -movflags +faststart -c:a aac -b:a 128k -vf "scale='min(1920,iw)':-2" "${mp4Out}"`,
    );
  }
  if (isNewer(file, webmOut)) {
    run(
      `"${FFMPEG}" -y -i "${file}" -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus "${webmOut}"`,
    );
  }
  if (isNewer(file, posterOut)) {
    run(`"${FFMPEG}" -y -i "${file}" -vframes 1 -q:v 2 "${posterOut}"`);
  }
  console.log(`✓ video ${base}`);
}

/** Кодеки и их настройки. */
const ENCODERS = [
  { extension: "jpg", apply: (pipeline) => pipeline.jpeg({ quality: 88 }) },
  { extension: "avif", apply: (pipeline) => pipeline.avif({ quality: 60 }) },
  { extension: "webp", apply: (pipeline) => pipeline.webp({ quality: 75 }) },
];

async function transcodeImage(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  for (const { extension, apply } of ENCODERS) {
    const out = path.join(OUT, `${base}.${extension}`);
    if (isNewer(file, out)) await apply(sharp(file)).toFile(out);
  }

  console.log(`✓ image ${base}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(STOCK);
  for (const name of files) {
    const full = path.join(STOCK, name);
    if (!fs.statSync(full).isFile()) continue;
    if (VIDEO_EXT.test(name)) transcodeVideo(full);
    else if (IMAGE_EXT.test(name)) await transcodeImage(full);
  }
  console.log(`Media pipeline done → ${path.relative(process.cwd(), OUT)}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
