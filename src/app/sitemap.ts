import type { MetadataRoute } from "next";
import { getAllStrainsForSitemap } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

const locales = ["en", "ru", "th"] as const;

function buildHomepageLanguages(baseUrl: string) {
  return {
    en: `${baseUrl}/en`,
    ru: `${baseUrl}/ru`,
    th: `${baseUrl}/th`,
  };
}

function buildStrainLanguages(baseUrl: string, slug: string) {
  return {
    en: `${baseUrl}/en/strains/${slug}`,
    ru: `${baseUrl}/ru/strains/${slug}`,
    th: `${baseUrl}/th/strains/${slug}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const entries: MetadataRoute.Sitemap = [];

  const strains = await getAllStrainsForSitemap();
  const strainDates = strains
    .map((s) => (s.updatedAt ? new Date(s.updatedAt).getTime() : NaN))
    .filter((t) => Number.isFinite(t));
  const homepageLastModified = strainDates.length > 0
    ? new Date(Math.max(...strainDates))
    : new Date();

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: homepageLastModified,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
      alternates: { languages: buildHomepageLanguages(baseUrl) },
    });
  }

  for (const { slug, updatedAt } of strains) {
    const lastModified = updatedAt ? new Date(updatedAt) : homepageLastModified;
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/strains/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: buildStrainLanguages(baseUrl, slug) },
      });
    }
  }

  return entries;
}
