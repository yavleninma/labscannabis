import type { AppLocale } from "@/i18n/config";
import type { Strain } from "./mock-data";

export function getLocalizedShortDescription(strain: Strain, locale: AppLocale): string {
  if (locale === "ru" && strain.shortDescriptionRu) {
    return strain.shortDescriptionRu;
  }
  if (locale === "th" && strain.shortDescriptionTh) {
    return strain.shortDescriptionTh;
  }

  return strain.shortDescription;
}

export function getLocalizedFullDescription(
  strain: Strain,
  locale: AppLocale,
): Strain["fullDescription"] {
  if (locale === "ru" && strain.fullDescriptionRu) {
    return strain.fullDescriptionRu;
  }
  if (locale === "th" && strain.fullDescriptionTh) {
    return strain.fullDescriptionTh;
  }

  return strain.fullDescription;
}
