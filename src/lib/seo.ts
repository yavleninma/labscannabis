import type { Locale } from "@/lib/i18n";
import { LOCALE_HREFLANG, getSiteUrl, localePath } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";

export interface HreflangLink {
  hreflang: string;
  href: string;
}

function normalizePathSuffix(pathSuffix: string): string {
  return pathSuffix.replace(/^\/+|\/+$/g, "");
}

export function getHreflangs(_locale: Locale, pathSuffix: string): HreflangLink[] {
  const base = getSiteUrl();
  const suffix = normalizePathSuffix(pathSuffix);
  return LOCALES.map((lang) => ({
    hreflang: LOCALE_HREFLANG[lang],
    href: `${base}${localePath(lang, suffix)}`,
  }));
}

export function getCanonical(locale: Locale, pathSuffix: string): string {
  return `${getSiteUrl()}${localePath(locale, normalizePathSuffix(pathSuffix))}`;
}
