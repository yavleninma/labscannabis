import type { Locale } from "@/lib/i18n";
import { LOCALE_HREFLANG, getSiteUrl, localePath } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function getHreflangs(locale: Locale, pathSuffix: string): HreflangLink[] {
  const base = getSiteUrl();
  return LOCALES.map((lang) => ({
    hreflang: LOCALE_HREFLANG[lang],
    href: `${base}${localePath(lang, pathSuffix)}`,
  }));
}

export function getCanonical(locale: Locale, pathSuffix: string): string {
  return `${getSiteUrl()}${localePath(locale, pathSuffix)}`;
}
