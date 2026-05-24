export const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  th: "ไทย",
  ar: "العربية",
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
};

export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  th: "th",
  ar: "ar",
  zh: "zh-CN",
  ko: "ko",
  ja: "ja",
};

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getSiteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL || "https://labscannabis.boutique";
}

export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const lower = acceptLanguage.toLowerCase();
  if (lower.includes("ru")) return "ru";
  if (lower.includes("th")) return "th";
  if (lower.includes("ar")) return "ar";
  if (lower.includes("zh")) return "zh";
  if (lower.includes("ko")) return "ko";
  if (lower.includes("ja")) return "ja";
  return "en";
}
