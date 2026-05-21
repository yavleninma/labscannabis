import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const messagesDir = path.join(rootDir, "messages");
const sourceLocale = "en";
const manualLocales = new Set(["en", "ru", "th"]);
const localeCodes = [
  "en",
  "ru",
  "th",
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
const protectedValues = [
  "Labs Cannabis",
  "Walking Street",
  "LINE",
  "WhatsApp",
  "Telegram",
  "Google",
  "THC",
  "CBD",
  "THB",
  "LABS",
  "Pattaya",
];
const skippableLeafNames = new Set(["guideName", "name", "initial"]);
const openAiModel = process.env.OPENAI_LOCALE_MODEL || "gpt-5.4-mini";
const chunkSize = 30;
const googleTimeoutMs = 8000;
const googleRetryCount = 5;
const googleRetryDelayMs = 1500;

function parseArgs() {
  const args = process.argv.slice(2);
  const localeArg = args.find((arg) => arg.startsWith("--locale="));
  const locales = localeArg
    ? localeArg
        .replace("--locale=", "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  return {
    locales,
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function collectLeafEntries(value, pathSegments = [], entries = []) {
  if (typeof value === "string") {
    entries.push({
      pathSegments,
      value,
      skip: skippableLeafNames.has(pathSegments[pathSegments.length - 1] || ""),
    });
    return entries;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectLeafEntries(item, [...pathSegments, String(index)], entries);
    });
    return entries;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, nestedValue]) => {
      collectLeafEntries(nestedValue, [...pathSegments, key], entries);
    });
  }

  return entries;
}

function setAtPath(target, pathSegments, nextValue) {
  let pointer = target;

  for (let index = 0; index < pathSegments.length - 1; index += 1) {
    pointer = pointer[pathSegments[index]];
  }

  pointer[pathSegments[pathSegments.length - 1]] = nextValue;
}

function protectText(text) {
  const replacements = [];
  let protectedText = text;

  protectedText = protectedText.replace(/\{[^}]+\}/g, (match) => {
    const token = `__PH_${replacements.length}__`;
    replacements.push([token, match]);
    return token;
  });

  protectedValues.forEach((value) => {
    if (!protectedText.includes(value)) {
      return;
    }

    const token = `__BRAND_${replacements.length}__`;
    replacements.push([token, value]);
    protectedText = protectedText.split(value).join(token);
  });

  return {
    protectedText,
    replacements,
  };
}

function restoreProtectedText(text, replacements) {
  return replacements.reduce(
    (result, [token, value]) => result.split(token).join(value),
    text,
  );
}

async function sleep(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function translateViaGoogle(text, targetLocale) {
  let lastError = null;

  for (let attempt = 1; attempt <= googleRetryCount; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), googleTimeoutMs);

    try {
      const params = new URLSearchParams({
        client: "gtx",
        sl: "en",
        tl: targetLocale,
        dt: "t",
        q: text,
      });

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
        {
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`Google translate failed with ${response.status}`);
      }

      const payload = await response.json();
      if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
        throw new Error("Unexpected translate payload");
      }

      return payload[0]
        .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
        .join("")
        .trim();
    } catch (error) {
      lastError = error;

      if (attempt < googleRetryCount) {
        await sleep(googleRetryDelayMs * attempt);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Google translate failed");
}

async function translateChunkWithOpenAI(client, chunk, locale) {
  const schemaProperties = Object.fromEntries(
    chunk.map((entry) => [entry.id, { type: "string" }]),
  );
  const response = await client.chat.completions.create({
    model: openAiModel,
    temperature: 0.2,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "locale_message_translation",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: schemaProperties,
          required: Object.keys(schemaProperties),
        },
      },
    },
    messages: [
      {
        role: "system",
        content: [
          "Translate UI and SEO copy from English into the requested locale.",
          "Preserve tokens like __PH_0__ and __BRAND_0__ exactly.",
          "Do not translate product and brand names protected by tokens.",
          "Return only JSON matching the requested schema.",
          "Keep strings concise and natural for landing-page SEO.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({
          locale,
          entries: Object.fromEntries(chunk.map((entry) => [entry.id, entry.protectedText])),
        }),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty translation response");
  }

  return JSON.parse(content);
}

async function translateEntries(entries, locale) {
  const protectedEntries = entries.map((entry, index) => {
    const { protectedText, replacements } = protectText(entry.value);
    return {
      ...entry,
      id: `entry_${index}`,
      protectedText,
      replacements,
    };
  });

  if (!process.env.OPENAI_API_KEY) {
    const translated = {};
    for (const entry of protectedEntries) {
      const translatedValue = await translateViaGoogle(entry.protectedText, locale);
      translated[entry.id] = restoreProtectedText(translatedValue || entry.value, entry.replacements);
    }
    return translated;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const translated = {};

  for (let index = 0; index < protectedEntries.length; index += chunkSize) {
    const chunk = protectedEntries.slice(index, index + chunkSize);
    const translatedChunk = await translateChunkWithOpenAI(client, chunk, locale);

    chunk.forEach((entry) => {
      const translatedValue = translatedChunk[entry.id];
      translated[entry.id] = restoreProtectedText(
        typeof translatedValue === "string" ? translatedValue : entry.value,
        entry.replacements,
      );
    });
  }

  return translated;
}

async function generateLocaleMessages(sourceMessages, locale) {
  const nextMessages = cloneJson(sourceMessages);
  const entries = collectLeafEntries(sourceMessages).filter((entry) => !entry.skip);
  const translatedById = await translateEntries(entries, locale);

  entries.forEach((entry, index) => {
    setAtPath(nextMessages, entry.pathSegments, translatedById[`entry_${index}`] || entry.value);
  });

  return nextMessages;
}

function assertKeyParity(sourceMessages, generatedMessages) {
  const sourceKeys = collectLeafEntries(sourceMessages).map((entry) => entry.pathSegments.join("."));
  const generatedKeys = collectLeafEntries(generatedMessages).map((entry) => entry.pathSegments.join("."));

  if (sourceKeys.length !== generatedKeys.length) {
    throw new Error("Generated locale messages do not match source key parity");
  }

  sourceKeys.forEach((key, index) => {
    if (generatedKeys[index] !== key) {
      throw new Error(`Key mismatch: expected ${key}, received ${generatedKeys[index]}`);
    }
  });
}

async function writeLocaleFile(locale, messages) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  await fs.writeFile(filePath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
}

async function main() {
  const { locales } = parseArgs();
  const sourcePath = path.join(messagesDir, `${sourceLocale}.json`);
  const sourceMessages = JSON.parse(await fs.readFile(sourcePath, "utf8"));
  const targetLocales =
    locales.length > 0
      ? locales
      : localeCodes.filter((locale) => !manualLocales.has(locale));

  for (const locale of targetLocales) {
    if (!localeCodes.includes(locale)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    if (manualLocales.has(locale)) {
      console.log(`Skipping manual locale ${locale}`);
      continue;
    }

    console.log(`Generating ${locale}...`);
    const generatedMessages = await generateLocaleMessages(sourceMessages, locale);
    assertKeyParity(sourceMessages, generatedMessages);
    await writeLocaleFile(locale, generatedMessages);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
