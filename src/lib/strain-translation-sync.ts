import { createHash } from "node:crypto";
import OpenAI from "openai";
import { automatedLocaleCodes, type AutomatedLocale } from "@/i18n/config";
import type { StrainTranslation } from "@/lib/mock-data";
import {
  plainTextToPortableText,
  portableTextToPlainText,
  type PortableTextBlock,
} from "@/lib/portable-text";

const defaultTranslationModel = process.env.OPENAI_STRAIN_TRANSLATION_MODEL || "gpt-5.4-mini";

export interface StrainTranslationSource {
  name?: string;
  shortDescription: string;
  fullDescription: PortableTextBlock[] | null;
  translations?: StrainTranslation[] | null;
}

export interface SyncedStrainTranslations {
  sourceHash: string;
  translations: StrainTranslation[];
  translatedLocales: AutomatedLocale[];
  skippedLocales: AutomatedLocale[];
  model: string;
}

function trimText(input: string, maxLength: number): string {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeRequestedLocales(locales?: AutomatedLocale[]): AutomatedLocale[] {
  if (!locales?.length) {
    return automatedLocaleCodes;
  }

  return locales.filter((locale, index) => automatedLocaleCodes.includes(locale) && locales.indexOf(locale) === index);
}

function normalizeExistingTranslations(translations?: StrainTranslation[] | null) {
  const deduped = new Map<AutomatedLocale, StrainTranslation>();

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

export function buildStrainSourceHash(
  shortDescription: string,
  fullDescription: PortableTextBlock[] | null,
): string {
  const fullDescriptionText = portableTextToPlainText(fullDescription);
  return createHash("sha256")
    .update(JSON.stringify({ shortDescription: trimText(shortDescription, 150), fullDescriptionText }))
    .digest("hex");
}

export function getStaleStrainLocales(
  source: StrainTranslationSource,
  requestedLocales?: AutomatedLocale[],
): AutomatedLocale[] {
  const sourceHash = buildStrainSourceHash(source.shortDescription, source.fullDescription);
  const normalizedExistingTranslations = normalizeExistingTranslations(source.translations);

  return normalizeRequestedLocales(requestedLocales).filter((locale) => {
    const translation = normalizedExistingTranslations.get(locale);

    if (!translation) {
      return true;
    }

    if (translation.sourceHash !== sourceHash) {
      return true;
    }

    if (!translation.shortDescription?.trim()) {
      return true;
    }

    if (!portableTextToPlainText(translation.fullDescription || []).trim()) {
      return true;
    }

    return false;
  });
}

function buildTranslationSchema(locales: AutomatedLocale[]) {
  const localeProperties = Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        type: "object",
        additionalProperties: false,
        properties: {
          shortDescription: {
            type: "string",
          },
          fullDescription: {
            type: "string",
          },
        },
        required: ["shortDescription", "fullDescription"],
      },
    ]),
  );

  return {
    name: "strain_translation_batch",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: localeProperties,
      required: locales,
    },
  } as const;
}

async function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey });
}

async function translateStrainBatch(
  source: StrainTranslationSource,
  locales: AutomatedLocale[],
  model: string,
) {
  const client = await createClient();
  const fullDescriptionText = portableTextToPlainText(source.fullDescription);
  const schema = buildTranslationSchema(locales);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: {
      type: "json_schema",
      json_schema: schema,
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
          strainName: source.name || null,
          locales,
          source: {
            shortDescription: source.shortDescription,
            fullDescription: fullDescriptionText,
          },
        }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty strain translation response");
  }

  return JSON.parse(content) as Record<
    AutomatedLocale,
    {
      shortDescription: string;
      fullDescription: string;
    }
  >;
}

export async function syncStrainTranslations(
  source: StrainTranslationSource,
  requestedLocales?: AutomatedLocale[],
): Promise<SyncedStrainTranslations> {
  const sourceHash = buildStrainSourceHash(source.shortDescription, source.fullDescription);
  const normalizedExistingTranslations = normalizeExistingTranslations(source.translations);
  const staleLocales = getStaleStrainLocales(source, requestedLocales);
  const model = defaultTranslationModel;

  if (staleLocales.length > 0) {
    const translatedBatch = await translateStrainBatch(source, staleLocales, model);
    const translatedAt = new Date().toISOString();

    staleLocales.forEach((locale) => {
      const translation = translatedBatch[locale];
      normalizedExistingTranslations.set(locale, {
        locale,
        shortDescription: trimText(translation?.shortDescription || source.shortDescription, 150),
        fullDescription: plainTextToPortableText(
          translation?.fullDescription || portableTextToPlainText(source.fullDescription),
        ),
        sourceHash,
        translatedAt,
        model,
      });
    });
  }

  const normalizedLocales = normalizeRequestedLocales(requestedLocales);
  const translations = normalizedLocales
    .map((locale) => normalizedExistingTranslations.get(locale))
    .filter((translation): translation is StrainTranslation => Boolean(translation));

  return {
    sourceHash,
    translations,
    translatedLocales: staleLocales,
    skippedLocales: normalizedLocales.filter((locale) => !staleLocales.includes(locale)),
    model,
  };
}
