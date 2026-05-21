import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique";

export default defineConfig({
  site,
  output: "static",
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          ru: "ru",
          th: "th",
          ar: "ar",
          zh: "zh-CN",
          ko: "ko",
          ja: "ja",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
