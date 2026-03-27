import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://labscannabis.com"; // TODO: Replace with actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
