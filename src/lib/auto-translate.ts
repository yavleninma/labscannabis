import type { Strain } from "./mock-data";

type Locale = "en" | "ru" | "th";

const translationCache = new Map<string, string>();
const inflightTranslations = new Map<string, Promise<string>>();
const MAX_CACHE_ENTRIES = 1000;
const TRANSLATION_TIMEOUT_MS = 6000;

function setTranslationCache(cacheKey: string, value: string) {
  if (translationCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = translationCache.keys().next().value;
    if (oldestKey) {
      translationCache.delete(oldestKey);
    }
  }

  translationCache.set(cacheKey, value);
}

function parseGoogleTranslateResponse(payload: unknown): string | null {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return null;
  }

  const segments = payload[0] as unknown[];
  const translated = segments
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
    .join("")
    .trim();

  return translated || null;
}

export async function translateText(text: string, targetLocale: Locale): Promise<string> {
  const normalized = text.trim();
  if (!normalized || targetLocale === "en") {
    return text;
  }

  const cacheKey = `${targetLocale}:${normalized}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inflight = inflightTranslations.get(cacheKey);
  if (inflight) {
    return inflight;
  }

  const translatePromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT_MS);

    try {
      const params = new URLSearchParams({
        client: "gtx",
        sl: "auto",
        tl: targetLocale,
        dt: "t",
        q: normalized,
      });

      const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
        next: { revalidate: 60 * 60 * 24 },
        signal: controller.signal,
      });

      if (!response.ok) {
        return text;
      }

      const payload = (await response.json()) as unknown;
      const translated = parseGoogleTranslateResponse(payload);
      if (!translated) {
        return text;
      }

      setTranslationCache(cacheKey, translated);
      return translated;
    } catch {
      return text;
    } finally {
      clearTimeout(timeoutId);
      inflightTranslations.delete(cacheKey);
    }
  })();

  inflightTranslations.set(cacheKey, translatePromise);
  return translatePromise;
}

export async function translatePortableTextBlocks(
  blocks: Strain["fullDescription"],
  targetLocale: Locale
): Promise<Strain["fullDescription"]> {
  if (!blocks || targetLocale === "en") {
    return blocks;
  }

  const translatedBlocks = await Promise.all(
    blocks.map(async (block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) {
        return block;
      }

      const combinedText = block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("")
        .trim();

      if (!combinedText) {
        return block;
      }

      const translated = await translateText(combinedText, targetLocale);
      return {
        ...block,
        children: [
          {
            _type: "span",
            _key: block._key ? `${block._key}-translated` : undefined,
            marks: [],
            text: translated,
          },
        ],
      };
    })
  );

  return translatedBlocks;
}
