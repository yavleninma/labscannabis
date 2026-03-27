import type { Strain } from "./mock-data";

type Locale = "en" | "ru" | "th";

export function getLocalizedShortDescription(strain: Strain, locale: Locale): string {
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
  locale: Locale
): Strain["fullDescription"] {
  if (locale === "ru" && strain.fullDescriptionRu) {
    return strain.fullDescriptionRu;
  }
  if (locale === "th" && strain.fullDescriptionTh) {
    return strain.fullDescriptionTh;
  }
  return strain.fullDescription;
}
