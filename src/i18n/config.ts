export const defaultLocale = "en" as const;

export const localeCodes = ["en", "ru", "th"] as const;

export type AppLocale = (typeof localeCodes)[number];
export type ContactMessageLocale = AppLocale;
export type LocaleDirection = "ltr" | "rtl";
export type LocaleScript = "latin" | "thai";

type LocaleDefinition = {
  englishLabel: string;
  nativeLabel: string;
  dir: LocaleDirection;
  script: LocaleScript;
  hreflang: string;
  ogLocale: string;
  contactMessageLocale: ContactMessageLocale;
};

export const localeDefinitions: Record<AppLocale, LocaleDefinition> = {
  en: {
    englishLabel: "English",
    nativeLabel: "English",
    dir: "ltr",
    script: "latin",
    hreflang: "en",
    ogLocale: "en_US",
    contactMessageLocale: "en",
  },
  ru: {
    englishLabel: "Russian",
    nativeLabel: "Русский",
    dir: "ltr",
    script: "latin",
    hreflang: "ru",
    ogLocale: "ru_RU",
    contactMessageLocale: "ru",
  },
  th: {
    englishLabel: "Thai",
    nativeLabel: "ไทย",
    dir: "ltr",
    script: "thai",
    hreflang: "th",
    ogLocale: "th_TH",
    contactMessageLocale: "th",
  },
};

export const removedLocaleCodes = [
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
] as const;

export function isValidLocale(value: string): value is AppLocale {
  return value in localeDefinitions;
}

export function getLocaleDefinition(locale: string): LocaleDefinition {
  return localeDefinitions[isValidLocale(locale) ? locale : defaultLocale];
}

export function getLocaleDirection(locale: string): LocaleDirection {
  return getLocaleDefinition(locale).dir;
}

export function getLocaleScript(locale: string): LocaleScript {
  return getLocaleDefinition(locale).script;
}

export function getLocaleHrefLang(locale: string): string {
  return getLocaleDefinition(locale).hreflang;
}

export function getLocaleOgLocale(locale: string): string {
  return getLocaleDefinition(locale).ogLocale;
}

export function getContactMessageLocale(locale: string): ContactMessageLocale {
  return getLocaleDefinition(locale).contactMessageLocale;
}

export const localeMatcher = localeCodes
  .map((locale) => locale.replace(/-/g, "\\-"))
  .join("|");

export const removedLocaleMatcher = removedLocaleCodes
  .map((locale) => locale.replace(/-/g, "\\-"))
  .join("|");
