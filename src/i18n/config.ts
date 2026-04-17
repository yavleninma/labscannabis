export const defaultLocale = "en" as const;

export const localeCodes = [
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
] as const;

export const manualLocaleCodes = ["en", "ru", "th"] as const;

export type AppLocale = (typeof localeCodes)[number];
export type ManualLocale = (typeof manualLocaleCodes)[number];
export type AutomatedLocale = Exclude<AppLocale, ManualLocale>;
export type ContactMessageLocale = "en" | "ru" | "th";
export type LocaleDirection = "ltr" | "rtl";
export type LocaleScript =
  | "latin"
  | "thai"
  | "cjk"
  | "arabic"
  | "hebrew"
  | "devanagari";

type LocaleDefinition = {
  englishLabel: string;
  nativeLabel: string;
  dir: LocaleDirection;
  script: LocaleScript;
  hreflang: string;
  ogLocale: string;
  primary: boolean;
  manual: boolean;
  fallbackLocale: AppLocale;
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
    primary: true,
    manual: true,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ru: {
    englishLabel: "Russian",
    nativeLabel: "Русский",
    dir: "ltr",
    script: "latin",
    hreflang: "ru",
    ogLocale: "ru_RU",
    primary: true,
    manual: true,
    fallbackLocale: "en",
    contactMessageLocale: "ru",
  },
  th: {
    englishLabel: "Thai",
    nativeLabel: "ไทย",
    dir: "ltr",
    script: "thai",
    hreflang: "th",
    ogLocale: "th_TH",
    primary: true,
    manual: true,
    fallbackLocale: "en",
    contactMessageLocale: "th",
  },
  "zh-CN": {
    englishLabel: "Chinese (Simplified)",
    nativeLabel: "简体中文",
    dir: "ltr",
    script: "cjk",
    hreflang: "zh-CN",
    ogLocale: "zh_CN",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  "zh-TW": {
    englishLabel: "Chinese (Traditional)",
    nativeLabel: "繁體中文",
    dir: "ltr",
    script: "cjk",
    hreflang: "zh-TW",
    ogLocale: "zh_TW",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ja: {
    englishLabel: "Japanese",
    nativeLabel: "日本語",
    dir: "ltr",
    script: "cjk",
    hreflang: "ja",
    ogLocale: "ja_JP",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ko: {
    englishLabel: "Korean",
    nativeLabel: "한국어",
    dir: "ltr",
    script: "cjk",
    hreflang: "ko",
    ogLocale: "ko_KR",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  hi: {
    englishLabel: "Hindi",
    nativeLabel: "हिन्दी",
    dir: "ltr",
    script: "devanagari",
    hreflang: "hi",
    ogLocale: "hi_IN",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ar: {
    englishLabel: "Arabic",
    nativeLabel: "العربية",
    dir: "rtl",
    script: "arabic",
    hreflang: "ar",
    ogLocale: "ar_AR",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  he: {
    englishLabel: "Hebrew",
    nativeLabel: "עברית",
    dir: "rtl",
    script: "hebrew",
    hreflang: "he",
    ogLocale: "he_IL",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  de: {
    englishLabel: "German",
    nativeLabel: "Deutsch",
    dir: "ltr",
    script: "latin",
    hreflang: "de",
    ogLocale: "de_DE",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  fr: {
    englishLabel: "French",
    nativeLabel: "Français",
    dir: "ltr",
    script: "latin",
    hreflang: "fr",
    ogLocale: "fr_FR",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  es: {
    englishLabel: "Spanish",
    nativeLabel: "Español",
    dir: "ltr",
    script: "latin",
    hreflang: "es",
    ogLocale: "es_ES",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  it: {
    englishLabel: "Italian",
    nativeLabel: "Italiano",
    dir: "ltr",
    script: "latin",
    hreflang: "it",
    ogLocale: "it_IT",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  "pt-BR": {
    englishLabel: "Portuguese (Brazil)",
    nativeLabel: "Português (Brasil)",
    dir: "ltr",
    script: "latin",
    hreflang: "pt-BR",
    ogLocale: "pt_BR",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  nl: {
    englishLabel: "Dutch",
    nativeLabel: "Nederlands",
    dir: "ltr",
    script: "latin",
    hreflang: "nl",
    ogLocale: "nl_NL",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  pl: {
    englishLabel: "Polish",
    nativeLabel: "Polski",
    dir: "ltr",
    script: "latin",
    hreflang: "pl",
    ogLocale: "pl_PL",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  tr: {
    englishLabel: "Turkish",
    nativeLabel: "Türkçe",
    dir: "ltr",
    script: "latin",
    hreflang: "tr",
    ogLocale: "tr_TR",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  vi: {
    englishLabel: "Vietnamese",
    nativeLabel: "Tiếng Việt",
    dir: "ltr",
    script: "latin",
    hreflang: "vi",
    ogLocale: "vi_VN",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  id: {
    englishLabel: "Indonesian",
    nativeLabel: "Bahasa Indonesia",
    dir: "ltr",
    script: "latin",
    hreflang: "id",
    ogLocale: "id_ID",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ms: {
    englishLabel: "Malay",
    nativeLabel: "Bahasa Melayu",
    dir: "ltr",
    script: "latin",
    hreflang: "ms",
    ogLocale: "ms_MY",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  tl: {
    englishLabel: "Filipino",
    nativeLabel: "Filipino",
    dir: "ltr",
    script: "latin",
    hreflang: "tl",
    ogLocale: "tl_PH",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  uk: {
    englishLabel: "Ukrainian",
    nativeLabel: "Українська",
    dir: "ltr",
    script: "latin",
    hreflang: "uk",
    ogLocale: "uk_UA",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  cs: {
    englishLabel: "Czech",
    nativeLabel: "Čeština",
    dir: "ltr",
    script: "latin",
    hreflang: "cs",
    ogLocale: "cs_CZ",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  ro: {
    englishLabel: "Romanian",
    nativeLabel: "Română",
    dir: "ltr",
    script: "latin",
    hreflang: "ro",
    ogLocale: "ro_RO",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  hu: {
    englishLabel: "Hungarian",
    nativeLabel: "Magyar",
    dir: "ltr",
    script: "latin",
    hreflang: "hu",
    ogLocale: "hu_HU",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  sv: {
    englishLabel: "Swedish",
    nativeLabel: "Svenska",
    dir: "ltr",
    script: "latin",
    hreflang: "sv",
    ogLocale: "sv_SE",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  no: {
    englishLabel: "Norwegian",
    nativeLabel: "Norsk",
    dir: "ltr",
    script: "latin",
    hreflang: "no",
    ogLocale: "no_NO",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  da: {
    englishLabel: "Danish",
    nativeLabel: "Dansk",
    dir: "ltr",
    script: "latin",
    hreflang: "da",
    ogLocale: "da_DK",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
  fi: {
    englishLabel: "Finnish",
    nativeLabel: "Suomi",
    dir: "ltr",
    script: "latin",
    hreflang: "fi",
    ogLocale: "fi_FI",
    primary: false,
    manual: false,
    fallbackLocale: "en",
    contactMessageLocale: "en",
  },
};

export const primaryLocaleCodes = localeCodes.filter(
  (locale) => localeDefinitions[locale].primary,
);

export const secondaryLocaleCodes = localeCodes.filter(
  (locale) => !localeDefinitions[locale].primary,
);

export const automatedLocaleCodes = localeCodes.filter(
  (locale) => !localeDefinitions[locale].manual,
) as AutomatedLocale[];

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

export function getMessageFallbackLocales(locale: AppLocale): AppLocale[] {
  const fallbacks = [locale, localeDefinitions[locale].fallbackLocale, defaultLocale];
  return fallbacks.filter((value, index) => fallbacks.indexOf(value) === index);
}

export const localeMatcher = localeCodes
  .map((locale) => locale.replace(/-/g, "\\-"))
  .join("|");
