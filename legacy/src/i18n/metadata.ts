import { getLocaleHrefLang, localeCodes, type AppLocale } from "./config";

export function buildLanguageAlternates(
  baseUrl: string,
  getPathname: (locale: AppLocale) => string,
): Record<string, string> {
  return Object.fromEntries(
    localeCodes.map((locale) => [
      getLocaleHrefLang(locale),
      `${baseUrl}${getPathname(locale)}`,
    ]),
  );
}

export function getKeywordsFromMessages(messages: Record<string, unknown>): string[] {
  const metaValue = messages.meta;
  if (!metaValue || typeof metaValue !== "object") {
    return [];
  }

  const keywords = (metaValue as { keywords?: unknown }).keywords;
  if (!Array.isArray(keywords)) {
    return [];
  }

  return keywords.filter((keyword): keyword is string => typeof keyword === "string");
}
