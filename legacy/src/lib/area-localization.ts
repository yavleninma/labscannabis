import type { AppLocale } from "@/i18n/config";
import type { Area } from "@/lib/mock-data";

export function getLocalizedAreaName(area: Area, locale: string): string {
  if (locale === "ru" && area.nameRu) return area.nameRu;
  if (locale === "th" && area.nameTh) return area.nameTh;
  return area.name;
}

export function getLocalizedAreaDescription(area: Area, locale: string): string {
  if (locale === "ru" && area.shortDescriptionRu) return area.shortDescriptionRu;
  if (locale === "th" && area.shortDescriptionTh) return area.shortDescriptionTh;
  return area.shortDescription;
}

export function getLocalizedAreaPath(locale: AppLocale | string, area: Area): string {
  return `/${locale}/delivery/${area.slug.current}`;
}
