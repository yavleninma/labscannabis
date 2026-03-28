import type { MetadataRoute } from "next";
import { getAllStrainSlugs } from "@/lib/queries";
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
  const locales = ["en", "ru", "th"];

  const entries: MetadataRoute.Sitemap = [];

  // Homepage entries
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ru: `${baseUrl}/ru`,
          th: `${baseUrl}/th`,
        },
      },
    });
  }

  // Effect landing pages
  for (const effect of EFFECTS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/effects/${effect}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/strains/effects/${effect}`,
            ru: `${baseUrl}/ru/strains/effects/${effect}`,
            th: `${baseUrl}/th/strains/effects/${effect}`,
          },
        },
      });
    }
  }

  // Type landing pages
  for (const type of TYPES) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/types/${type}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: {
          languages: {
            en: `${baseUrl}/en/strains/types/${type}`,
            ru: `${baseUrl}/ru/strains/types/${type}`,
            th: `${baseUrl}/th/strains/types/${type}`,
          },
        },
      });
    }
  }

  // Strain detail pages
  const slugs = await getAllStrainSlugs();
  for (const slug of slugs) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/strains/${slug}`,
            ru: `${baseUrl}/ru/strains/${slug}`,
            th: `${baseUrl}/th/strains/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
