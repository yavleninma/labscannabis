#!/usr/bin/env node
/**
 * Generate SEO content via OpenAI GPT-5.5 (or fallback model).
 * Usage: npm run gen:seo [-- --force] [-- --lang=ru] [-- --slug=buy-cannabis-pattaya] [-- --no-batch]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, "content-cache");

const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];

// Import SEO pages from compiled data — inline minimal list loader
const seoMatrixPath = path.join(ROOT, "src", "data", "seo-matrix.ts");
const seoSource = fs.readFileSync(seoMatrixPath, "utf8");
const slugMatches = [...seoSource.matchAll(/slug: "([^"]+)"/g)];
const SEO_SLUGS = [...new Set(slugMatches.map((m) => m[1]))];

const args = process.argv.slice(2);
const force = args.includes("--force");
const noBatch = args.includes("--no-batch");
const langFilter = args.find((a) => a.startsWith("--lang="))?.split("=")[1];
const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const MODEL = process.env.OPENAI_SEO_MODEL || "gpt-5.5";
const FALLBACK_MODEL = "gpt-4o-mini";

const SYSTEM = `You are a copywriter for Labs Cannabis (formerly Labs Dispensary) in Pattaya, Thailand.
Voice: friendly, direct, local, no cringe marketing.
Mention Soi Hollywood, Walking Street, free in-store sample, weight tiers (1g–1kg), WhatsApp-first channel.
No medical claims. Write in the requested language only.
Return valid JSON only.`;

function buildUserPrompt(locale, slug) {
  return `Write SEO page content for slug "${slug}" in locale "${locale}".
Include keywords naturally: cannabis, weed, Pattaya, White Widow, Labs Dispensary (former name).
JSON schema:
{
  "h1": "string",
  "intro": "80-120 words",
  "sections": [{"h2": "string", "body": "150-200 words"}, {"h2": "string", "body": "150-200 words"}],
  "faq": [{"q": "string", "a": "string"}, {"q": "string", "a": "string"}, {"q": "string", "a": "string"}],
  "closing": "CTA paragraph with WhatsApp mention"
}`;
}

async function generateOne(client, locale, slug) {
  const outDir = path.join(CACHE, locale);
  const outFile = path.join(outDir, `${slug}.json`);
  fs.mkdirSync(outDir, { recursive: true });

  if (!force && fs.existsSync(outFile)) {
    console.log(`skip ${locale}/${slug}`);
    return;
  }

  console.log(`gen ${locale}/${slug}...`);
  let model = MODEL;
  let res;
  try {
    res = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserPrompt(locale, slug) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1200,
    });
  } catch (err) {
    if (model === FALLBACK_MODEL) throw err;
    console.warn(`  ${model} failed, retrying with ${FALLBACK_MODEL}`);
    model = FALLBACK_MODEL;
    res = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserPrompt(locale, slug) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1200,
    });
  }

  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error(`Empty response for ${locale}/${slug}`);
  JSON.parse(text);
  fs.writeFileSync(outFile, text, "utf8");
}

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn("OPENAI_API_KEY not set — using fallback content only at build time.");
    return;
  }

  const client = new OpenAI({ apiKey: key });
  const locales = langFilter ? [langFilter] : LOCALES;
  const slugs = slugFilter ? [slugFilter] : SEO_SLUGS;

  const tasks = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      tasks.push({ locale, slug });
    }
  }

  const concurrency = noBatch ? 5 : 8;
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    await Promise.all(batch.map(({ locale, slug }) => generateOne(client, locale, slug)));
  }

  console.log(`Done. ${tasks.length} pages processed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
