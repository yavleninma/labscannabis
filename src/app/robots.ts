import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // TODO: Replace with actual domain when purchased
  const baseUrl = "https://labscannabis.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
