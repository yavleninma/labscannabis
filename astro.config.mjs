import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { getIndexPolicyForPathname, localePathname } from "./src/lib/index-policy.mjs";

const site = (process.env.PUBLIC_SITE_URL || "https://labscannabis.boutique").replace(/\/+$/, "");
const sitemapHreflangs = {
  en: "en",
  ru: "ru",
  th: "th",
  ar: "ar",
  zh: "zh-CN",
  ko: "ko",
  ja: "ja",
};

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
      filter: (page) => getIndexPolicyForPathname(new URL(page).pathname).indexable,
      serialize: (item) => {
        const policy = getIndexPolicyForPathname(new URL(item.url).pathname);
        if (!policy.indexable) return undefined;

        const links = policy.locales.map((locale) => ({
          lang: sitemapHreflangs[locale],
          url: new URL(localePathname(locale, policy.suffix), site).href,
        }));
        links.push({
          lang: "x-default",
          url: new URL(localePathname("en", policy.suffix), site).href,
        });

        const { lastmod: _lastmod, links: _links, ...withoutFreshness } = item;
        const isHome = policy.suffix === "";
        return {
          ...withoutFreshness,
          links,
          changefreq: isHome ? "daily" : "weekly",
          priority: isHome ? 1 : withoutFreshness.priority,
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
