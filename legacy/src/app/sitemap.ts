import type { MetadataRoute } from "next";
import { localeCodes } from "@/i18n/config";
import { buildLanguageAlternates } from "@/i18n/metadata";
import { getAllAreas, getAllStrains } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

const EFFECTS = [
  "relax",
  "energy",
  "creative",
  "sleep",
  "euphoria",
  "focus",
  "happy",
  "uplifted",
  "talkative",
  "hungry",
] as const;

const TYPES = ["indica", "sativa", "hybrid"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage entries
  for (const locale of localeCodes) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
      alternates: {
        languages: buildLanguageAlternates(baseUrl, (alternateLocale) => `/${alternateLocale}`),
      },
    });
  }

  // Effect landing pages
  for (const effect of EFFECTS) {
    for (const locale of localeCodes) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/effects/${effect}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: buildLanguageAlternates(
            baseUrl,
            (alternateLocale) => `/${alternateLocale}/strains/effects/${effect}`,
          ),
        },
      });
    }
  }

  // Type landing pages
  for (const type of TYPES) {
    for (const locale of localeCodes) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/types/${type}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: {
          languages: buildLanguageAlternates(
            baseUrl,
            (alternateLocale) => `/${alternateLocale}/strains/types/${type}`,
          ),
        },
      });
    }
  }

  // Delivery area pages
  const areas = await getAllAreas();
  for (const area of areas.filter((item) => !item.isHidden)) {
    const slug = area.slug.current;
    const lastModified = area._updatedAt ? new Date(area._updatedAt) : new Date();

    for (const locale of localeCodes) {
      entries.push({
        url: `${baseUrl}/${locale}/delivery/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: buildLanguageAlternates(
            baseUrl,
            (alternateLocale) => `/${alternateLocale}/delivery/${slug}`,
          ),
        },
      });
    }
  }

  // Legal tourist guide
  for (const locale of localeCodes) {
    entries.push({
      url: `${baseUrl}/${locale}/guides/legal-cannabis-tourists`,
      lastModified: new Date("2026-05-14"),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: buildLanguageAlternates(
          baseUrl,
          (alternateLocale) => `/${alternateLocale}/guides/legal-cannabis-tourists`,
        ),
      },
    });
  }

  // Strain detail pages
  const strains = await getAllStrains();
  for (const strain of strains) {
    const slug = strain.slug.current;
    const lastModified = strain._updatedAt ? new Date(strain._updatedAt) : new Date();

    for (const locale of localeCodes) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: buildLanguageAlternates(
            baseUrl,
            (alternateLocale) => `/${alternateLocale}/strains/${slug}`,
          ),
        },
      });
    }
  }

  return entries;
}
