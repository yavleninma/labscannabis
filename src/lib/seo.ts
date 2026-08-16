import type { Locale } from "@/lib/i18n";
import { LOCALE_HREFLANG, getSiteUrl, localePath } from "@/lib/i18n";
import { normalizePathSuffix } from "@/lib/index-policy.mjs";

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function getHreflangs(pathSuffix: string, locales: readonly Locale[]): HreflangLink[] {
  const base = getSiteUrl();
  const suffix = normalizePathSuffix(pathSuffix);
  return locales.map((lang) => ({
    hreflang: LOCALE_HREFLANG[lang],
    href: `${base}${localePath(lang, suffix)}`,
  }));
}

export function getCanonical(locale: Locale, pathSuffix: string): string {
  return `${getSiteUrl()}${localePath(locale, normalizePathSuffix(pathSuffix))}`;
}
