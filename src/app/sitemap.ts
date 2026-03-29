import type { MetadataRoute } from "next";
import { getAllStrainSlugs } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

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

  // Strain detail pages
  const slugs = await getAllStrainSlugs();
  for (const slug of slugs) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
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
