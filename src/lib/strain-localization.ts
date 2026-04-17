import type { AppLocale } from "@/i18n/config";
import type { Strain } from "./mock-data";

function getSavedTranslation(strain: Strain, locale: AppLocale) {
  return strain.translations?.find((translation) => translation.locale === locale) || null;
}

export function getLocalizedShortDescription(strain: Strain, locale: AppLocale): string {
  if (locale === "ru" && strain.shortDescriptionRu) {
    return strain.shortDescriptionRu;
  }
  if (locale === "th" && strain.shortDescriptionTh) {
    return strain.shortDescriptionTh;
  }

  const savedTranslation = getSavedTranslation(strain, locale);
  if (savedTranslation?.shortDescription) {
    return savedTranslation.shortDescription;
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

  const savedTranslation = getSavedTranslation(strain, locale);
  if (savedTranslation?.fullDescription?.length) {
    return savedTranslation.fullDescription;
  }

  return strain.fullDescription;
}
