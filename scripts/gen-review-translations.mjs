#!/usr/bin/env node
/**
 * Translate Google reviews into all site locales via OpenAI.
 * Usage: npm run gen:reviews [-- --force] [-- --lang=ru]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, "reviews-cache");

const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];

function loadReviews() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/reviews-pool.ts"), "utf8");
  const block = src.match(/export const REVIEWS_POOL[^=]*=\s*(\[[\s\S]*?\n\]);/)?.[1];
  if (!block) throw new Error("Could not parse REVIEWS_POOL");
  // eslint-disable-next-line no-new-func
  return new Function(`return ${block}`)();
}

const reviews = loadReviews();

const args = process.argv.slice(2);
const force = args.includes("--force");
const langFilter = args.find((a) => a.startsWith("--lang="))?.split("=")[1];

const MODEL = process.env.OPENAI_REVIEW_MODEL || "gpt-4o-mini";

const LOCALE_NAMES = {
  en: "English",
  ru: "Russian",
  th: "Thai",
  ar: "Arabic",
  zh: "Simplified Chinese",
  ko: "Korean",
  ja: "Japanese",
};

async function translateLocale(client, locale) {
  const outFile = path.join(CACHE, `${locale}.json`);
  fs.mkdirSync(CACHE, { recursive: true });

  const result = {};
  const toTranslate = [];

  for (const review of reviews) {
    if (review.originalLang === locale) {
      result[review.id] = review.text;
    } else {
      toTranslate.push({
        id: review.id,
        originalLang: review.originalLang,
        text: review.text,
      });
    }
  }

  if (toTranslate.length === 0) {
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n", "utf8");
    console.log(`skip ${locale} (all native)`);
    return;
  }

  if (!force && fs.existsSync(outFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
      if (Object.keys(existing).length === reviews.length) {
        console.log(`skip ${locale}`);
        return;
      }
    } catch {
      /* regenerate */
    }
  }

  console.log(`gen ${locale} (${toTranslate.length} reviews)...`);

  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You translate real Google Maps reviews for a cannabis shop in Pattaya, Thailand.
Translate naturally into ${LOCALE_NAMES[locale]}. Keep reviewer names unchanged. Do not add marketing fluff.
Return valid JSON only: an object keyed by review id.`,
      },
      {
        role: "user",
        content: JSON.stringify(toTranslate, null, 2),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  });

  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error(`Empty response for ${locale}`);
  const parsed = JSON.parse(text);

  for (const item of toTranslate) {
    const translated = parsed[item.id];
    if (typeof translated !== "string" || !translated.trim()) {
      throw new Error(`Missing translation for ${item.id} in ${locale}`);
    }
    result[item.id] = translated.trim();
  }

  fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n", "utf8");
}

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn("OPENAI_API_KEY not set — run with key or commit reviews-cache manually.");
    process.exit(1);
  }

  const client = new OpenAI({ apiKey: key });
  const locales = langFilter ? [langFilter] : LOCALES;

  for (const locale of locales) {
    await translateLocale(client, locale);
  }

  console.log(`Done. ${locales.length} locale files in reviews-cache/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
