#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";

const FFMPEG = ffmpegInstaller.path;
const STOCK = path.join(process.cwd(), "stock-photo");
const OUT = path.join(process.cwd(), "public", "media");

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

async function transcodeImage(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const normalized = path.join(OUT, `${base}.jpg`);
  const avifOut = path.join(OUT, `${base}.avif`);
  const webpOut = path.join(OUT, `${base}.webp`);

  if (isNewer(file, normalized)) {
    await sharp(file).jpeg({ quality: 88 }).toFile(normalized);
  }
  if (isNewer(file, avifOut)) {
    await sharp(file).avif({ quality: 60 }).toFile(avifOut);
  }
  if (isNewer(file, webpOut)) {
    await sharp(file).webp({ quality: 75 }).toFile(webpOut);
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
  console.log("Media pipeline done → public/media/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
