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

function loadSeoSlugs() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/seo-matrix.ts"), "utf8");
  const section = src.slice(src.indexOf("export const SEO_PAGES"));
  const blocks = section.split(/\r?\n  \{\r?\n    slug: "/).slice(1);
  return blocks.map((block) => block.match(/^([^"]+)"/)?.[1]).filter(Boolean);
}

const SEO_SLUGS = loadSeoSlugs();

const args = process.argv.slice(2);
const force = args.includes("--force");
const noBatch = args.includes("--no-batch");
const langFilter = args.find((a) => a.startsWith("--lang="))?.split("=")[1];
const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const MODEL = process.env.OPENAI_SEO_MODEL || "gpt-4o-mini";
const FALLBACK_MODEL = "gpt-4o-mini";

const SYSTEM = `You are a copywriter for Labs Cannabis (formerly Labs Dispensary) in Pattaya, Thailand.
Always use "Labs Cannabis" as the current shop name; mention "formerly Labs Dispensary" at most once.
Voice: friendly, direct, local, no cringe marketing.
Mention Soi Hollywood, Walking Street, free in-store sample, weight tiers (1g–1kg), WhatsApp +66 66 080 6784.
No medical claims. Write in the requested language only.
Return valid JSON only.`;

function validateContent(data) {
  return (
    data &&
    typeof data.h1 === "string" &&
    typeof data.intro === "string" &&
    Array.isArray(data.sections) &&
    data.sections.length >= 2 &&
    data.sections.every((s) => s?.h2 && s?.body) &&
    Array.isArray(data.faq) &&
    data.faq.length >= 3 &&
    data.faq.every((f) => f?.q && f?.a) &&
    typeof data.closing === "string"
  );
}

function buildUserPrompt(locale, slug) {
  return `Write SEO page content for slug "${slug}" in locale "${locale}".
Include keywords naturally: cannabis, weed, Pattaya, White Widow, Labs Dispensary (former name).
JSON schema:
{
  "h1": "string",
  "intro": "60-90 words",
  "sections": [{"h2": "string", "body": "90-120 words"}, {"h2": "string", "body": "90-120 words"}],
  "faq": [{"q": "string", "a": "string"}, {"q": "string", "a": "string"}, {"q": "string", "a": "string"}],
  "closing": "1-2 sentences, WhatsApp CTA"
}`;
}

async function generateOne(client, locale, slug) {
  const outDir = path.join(CACHE, locale);
  const outFile = path.join(outDir, `${slug}.json`);
  fs.mkdirSync(outDir, { recursive: true });

  if (!force && fs.existsSync(outFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
      if (validateContent(existing)) {
        console.log(`skip ${locale}/${slug}`);
        return;
      }
    } catch {
      /* regenerate corrupt cache */
    }
  }

  console.log(`gen ${locale}/${slug}...`);
  let model = MODEL;
  let lastErr;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: buildUserPrompt(locale, slug) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const text = res.choices[0]?.message?.content;
      if (!text) throw new Error("empty response");
      const parsed = JSON.parse(text);
      if (!validateContent(parsed)) throw new Error("invalid content schema");
      fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2) + "\n", "utf8");
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) {
        console.warn(`  retry ${attempt}/3 ${locale}/${slug}: ${err.message}`);
        if (model !== FALLBACK_MODEL) model = FALLBACK_MODEL;
      }
    }
  }

  throw new Error(`${locale}/${slug} failed after 3 attempts: ${lastErr?.message}`);
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

  const concurrency = noBatch ? 3 : 5;
  const failed = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(({ locale, slug }) => generateOne(client, locale, slug)),
    );
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "rejected") {
        const { locale, slug } = batch[j];
        failed.push(`${locale}/${slug}: ${results[j].reason?.message}`);
        console.error(`FAIL ${locale}/${slug}`);
      }
    }
  }

  console.log(`Done. ${tasks.length - failed.length}/${tasks.length} pages OK.`);
  if (failed.length) {
    console.error("Failed pages:\n" + failed.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
