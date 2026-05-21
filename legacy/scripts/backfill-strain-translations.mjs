import { createHash } from "node:crypto";
import { createClient } from "@sanity/client";
import OpenAI from "openai";

const automatedLocaleCodes = [
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "hi",
  "ar",
  "he",
  "de",
  "fr",
  "es",
  "it",
  "pt-BR",
  "nl",
  "pl",
  "tr",
  "vi",
  "id",
  "ms",
  "tl",
  "uk",
  "cs",
  "ro",
  "hu",
  "sv",
  "no",
  "da",
  "fi",
];

const translationModel = process.env.OPENAI_STRAIN_TRANSLATION_MODEL || "gpt-5.4-mini";
const apiVersion = "2024-01-01";

function parseArgs() {
  const args = process.argv.slice(2);
  const localeArg = args.find((arg) => arg.startsWith("--locale="));
  const limitArg = args.find((arg) => arg.startsWith("--limit="));

  return {
    dryRun: args.includes("--dry-run"),
    locales: localeArg
      ? localeArg
          .replace("--locale=", "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [],
    limit: limitArg ? Number.parseInt(limitArg.replace("--limit=", ""), 10) : null,
  };
}

function trimText(input, maxLength) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 3).trimEnd()}...`;
}

function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child) => (typeof child?.text === "string" ? child.text : ""))
        .join("")
        .trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

function plainTextToPortableText(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: "block",
      _key: `block-${index}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span-${index}`,
          marks: [],
          text: paragraph,
        },
      ],
    }));
}

function buildSourceHash(shortDescription, fullDescription) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        shortDescription: trimText(shortDescription, 150),
        fullDescription: portableTextToPlainText(fullDescription),
      }),
    )
    .digest("hex");
}

function normalizeRequestedLocales(locales) {
  if (!locales.length) {
    return automatedLocaleCodes;
  }

  return locales.filter(
    (locale, index) =>
      automatedLocaleCodes.includes(locale) && locales.indexOf(locale) === index,
  );
}

function normalizeExistingTranslations(translations) {
  const deduped = new Map();

  for (const translation of translations || []) {
    if (!translation || !automatedLocaleCodes.includes(translation.locale)) {
      continue;
    }

    deduped.set(translation.locale, {
      locale: translation.locale,
      shortDescription: translation.shortDescription || null,
      fullDescription: translation.fullDescription || null,
      sourceHash: translation.sourceHash || null,
      translatedAt: translation.translatedAt || null,
      model: translation.model || null,
    });
  }

  return deduped;
}

function getStaleLocales(strain, requestedLocales) {
  const sourceHash = buildSourceHash(strain.shortDescription, strain.fullDescription);
  const existingTranslations = normalizeExistingTranslations(strain.translations);

  return normalizeRequestedLocales(requestedLocales).filter((locale) => {
    const translation = existingTranslations.get(locale);

    if (!translation) {
      return true;
    }

    if (translation.sourceHash !== sourceHash) {
      return true;
    }

    if (!translation.shortDescription?.trim()) {
      return true;
    }

    if (!portableTextToPlainText(translation.fullDescription).trim()) {
      return true;
    }

    return false;
  });
}

function buildTranslationSchema(locales) {
  return {
    name: "strain_translation_batch",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: Object.fromEntries(
        locales.map((locale) => [
          locale,
          {
            type: "object",
            additionalProperties: false,
            properties: {
              shortDescription: { type: "string" },
              fullDescription: { type: "string" },
            },
            required: ["shortDescription", "fullDescription"],
          },
        ]),
      ),
      required: locales,
    },
  };
}

async function translateBatch(client, strain, locales) {
  const completion = await client.chat.completions.create({
    model: translationModel,
    temperature: 0.2,
    response_format: {
      type: "json_schema",
      json_schema: buildTranslationSchema(locales),
    },
    messages: [
      {
        role: "system",
        content: [
          "Translate cannabis product descriptions from English into the requested locales.",
          "Keep strain names, brand names, terpene names, Walking Street, Pattaya, THC, CBD, THB, LINE, WhatsApp, Telegram, and Labs Cannabis unchanged unless the source sentence already localizes them.",
          "shortDescription must stay concise, natural, and under 150 characters.",
          "fullDescription must be clean plain text with paragraph breaks preserved where useful.",
          "Return JSON only.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({
          strainName: strain.name || null,
          locales,
          source: {
            shortDescription: strain.shortDescription,
            fullDescription: portableTextToPlainText(strain.fullDescription),
          },
        }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`OpenAI returned an empty translation response for ${strain._id}`);
  }

  return JSON.parse(content);
}

function getSanityWriteToken() {
  return (
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_TOKEN ||
    ""
  );
}

async function main() {
  const { dryRun, locales, limit } = parseArgs();
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const writeToken = getSanityWriteToken();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77odgngy";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  if (!writeToken && !dryRun) {
    throw new Error("SANITY_API_WRITE_TOKEN (or SANITY_WRITE_TOKEN / SANITY_TOKEN) is required");
  }

  const requestedLocales = normalizeRequestedLocales(locales);
  if (!requestedLocales.length) {
    throw new Error("No valid locales requested");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken || undefined,
  });
  const openai = new OpenAI({ apiKey: openAiApiKey });

  const strains = await client.fetch(
    `*[_type == "strain"] | order(_updatedAt desc){
      _id,
      name,
      shortDescription,
      fullDescription,
      translations[]{
        locale,
        shortDescription,
        fullDescription,
        sourceHash,
        translatedAt,
        model
      }
    }`,
  );

  const selectedStrains = Number.isInteger(limit) && limit > 0 ? strains.slice(0, limit) : strains;
  let translatedDocuments = 0;
  let skippedDocuments = 0;

  for (const strain of selectedStrains) {
    if (typeof strain.shortDescription !== "string" || !strain.shortDescription.trim()) {
      skippedDocuments += 1;
      console.log(`Skipping ${strain._id}: missing English shortDescription`);
      continue;
    }

    const staleLocales = getStaleLocales(strain, requestedLocales);
    if (!staleLocales.length) {
      skippedDocuments += 1;
      console.log(`Skipping ${strain._id}: translations are already fresh`);
      continue;
    }

    console.log(`Translating ${strain._id} for ${staleLocales.join(", ")}`);

    const translatedBatch = await translateBatch(openai, strain, staleLocales);
    const translatedAt = new Date().toISOString();
    const sourceHash = buildSourceHash(strain.shortDescription, strain.fullDescription);
    const mergedTranslations = normalizeExistingTranslations(strain.translations);

    staleLocales.forEach((locale) => {
      const translation = translatedBatch[locale];
      mergedTranslations.set(locale, {
        locale,
        shortDescription: trimText(
          translation?.shortDescription || strain.shortDescription,
          150,
        ),
        fullDescription: plainTextToPortableText(
          translation?.fullDescription || portableTextToPlainText(strain.fullDescription),
        ),
        sourceHash,
        translatedAt,
        model: translationModel,
      });
    });

    const nextTranslations = requestedLocales
      .map((locale) => mergedTranslations.get(locale))
      .filter(Boolean);

    if (dryRun) {
      console.log(`Dry run: would patch ${strain._id} with ${nextTranslations.length} translations`);
      translatedDocuments += 1;
      continue;
    }

    await client
      .patch(strain._id)
      .set({ translations: nextTranslations })
      .commit({ autoGenerateArrayKeys: true });

    translatedDocuments += 1;
  }

  console.log(
    `Done. Updated ${translatedDocuments} document(s), skipped ${skippedDocuments} document(s).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
