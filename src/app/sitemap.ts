import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: Replace with actual domain when purchased
  const baseUrl = "https://labscannabis.com";

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ru: `${baseUrl}/ru`,
          th: `${baseUrl}/th`,
        },
      },
    },
    {
      url: `${baseUrl}/ru`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/th`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
