import { execFileSync } from "node:child_process";

import { defineConfig } from "astro/config";
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

/**
 * Сигнал свежести для сайтмапа (W1-18). Запрет `lastmod` снят в W1-01: без него
 * переобход возвращённых в индекс страниц растягивается на недели.
 *
 * Дата берётся из коммита, а не из часов сборки. `new Date()` объявлял поисковику,
 * что изменились все 52 страницы, при каждой пересборке того же кода — при
 * ретрае деплоя, правке переменной окружения, коммите в другой части
 * репозитория. Google документированно перестаёт учитывать `lastmod`, который
 * систематически не соответствует действительности, то есть такой сигнал
 * работает ровно один раз, а дальше обесценивается.
 *
 * Отметка одна на всю сборку: сайт статический и пересобирается целиком из
 * одного коммита. Ключевое свойство — она НЕ меняется от пересборки того же
 * коммита. Даты (без времени) достаточно, и она стабильна между окружениями.
 */
const CONTENT_REVISION_FALLBACK = "2026-08-27";

function resolveContentRevisionDate() {
  try {
    // %cs — дата коммита в формате YYYY-MM-DD, без времени и часового пояса.
    const committed = execFileSync("git", ["log", "-1", "--format=%cs"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(committed)) return committed;
  } catch {
    // Сборка вне git-дерева (архив исходников, некоторые CI-раннеры): дата
    // константой лучше, чем часы сборки — она хотя бы не врёт при каждом билде.
  }
  return CONTENT_REVISION_FALLBACK;
}

const buildLastmod = resolveContentRevisionDate();

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

        const { links: _links, ...withoutLinks } = item;
        const isHome = policy.suffix === "";
        return {
          ...withoutLinks,
          links,
          lastmod: item.lastmod ?? buildLastmod,
          changefreq: isHome ? "daily" : "weekly",
          priority: isHome ? 1 : withoutLinks.priority,
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
