import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

const site = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");

export default defineConfig({
  site,
  trailingSlash: "always",
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => new URL(page).pathname !== "/",
      serialize: (item) => {
        const links = item.links ?? [];
        const enLink = links.find((link) => link.lang === "en");
        const pathname = new URL(item.url).pathname;
        const isHome = /^\/[a-z]{2}\/$/.test(pathname);
        const next = {
          ...item,
          lastmod: new Date().toISOString(),
          changefreq: isHome ? "daily" : "weekly",
          priority: isHome ? 1 : item.priority,
        };
        if (!enLink || links.some((link) => link.lang === "x-default")) {
          return next;
        }
        return {
          ...next,
          links: [...links, { lang: "x-default", url: enLink.url }],
        };
      },
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
