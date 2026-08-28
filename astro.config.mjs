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
function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function resolveContentRevisionDate() {
  // Дата деплоя из окружения Vercel — она есть там, где нет .git-дерева.
  const fromEnv = (process.env.VERCEL_GIT_COMMIT_DATE || "").slice(0, 10);
  if (isIsoDate(fromEnv)) return fromEnv;

  try {
    // %cs — дата коммита в формате YYYY-MM-DD, без времени и часового пояса.
    const committed = execFileSync("git", ["log", "-1", "--format=%cs"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (isIsoDate(committed)) return committed;
  } catch {
    // Сборка вне git-дерева (архив исходников, часть self-hosted раннеров).
  }

  // Константы здесь больше нет. Захардкоженная дата в таком окружении
  // объявляла бы всем 96 URL одну и ту же вечную дату — ровно тот
  // систематически неверный `lastmod`, из-за которого Google перестаёт
  // учитывать сигнал вообще. Отсутствующий сигнал честнее устаревшего:
  // `undefined` убирает `lastmod` из записи, ничего не ломая.
  return undefined;
}

const buildLastmod = resolveContentRevisionDate();

export default defineConfig({
  site,
  trailingSlash: "always",
  output: "static",
  /**
   * Общая кэшируемая таблица стилей, а не инлайн в каждую страницу.
   *
   * `inlineStylesheets: "always"` вклеивал одну и ту же таблицу Tailwind на
   * 60 КБ в каждую из 221 страниц: медиана HTML 34 КБ → 97 КБ, суммарно
   * 7 МБ → 21 МБ, gzip на страницу 9,1 → 19,8 КБ. Замер первой отрисовки: было
   * 9,1 КБ gz HTML + 10,1 КБ gz общей CSS = 19,2 КБ, стало 19,8 КБ одним
   * запросом — то есть один round-trip экономился ценой +0,6 КБ, а каждая
   * следующая страница стоила +10,7 КБ gz, потому что попаданий в кэш CSS
   * больше не бывало.
   *
   * Главное же: обоснование обещало снять оба блокирующих запроса, а сняло
   * один. `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` в
   * `<head>` остался, и это как раз более дорогой кросс-доменный запрос
   * (DNS + TLS + fetch) — отрисовка блокировалась по-прежнему. Промежуточное
   * состояние хуже обоих, поэтому здесь значение по умолчанию ("auto":
   * инлайнятся только файлы меньше 4 КБ), а правило `Cache-Control` для
   * `/_astro/(.*)` в `vercel.json` снова имеет смысл.
   *
   * Вернуться к инлайну имеет смысл только вместе с self-host шрифтов в
   * `/fonts/` (preload + font-display: swap) — тогда блокирующих запросов не
   * останется вовсе.
   */
  build: {
    inlineStylesheets: "auto",
  },
  /**
   * Vercel Web Analytics выключен.
   *
   * Загрузчик дотягивал `/_vercel/insights/script.js` на каждой странице, при
   * том что на сайте нет ни страницы о данных и cookie, ни упоминания
   * аналитики ни на одной из семи локалей. Сайт, который на семи языках
   * объясняет, чего он про себя не утверждает без подтверждения, не может
   * молча собирать статистику посетителей. Слушатель кликов вызывает
   * `window.va?.(...)` через optional chaining, поэтому включается это обратно
   * одним флагом — после того как владелец решит вопрос с уведомлением о
   * данных (O-11).
   */
  // Web Analytics считает просмотры без cookie и без кросс-сайтового профиля, поэтому
  // остаётся включённым до появления страницы об обработке данных. Цели по каналам
  // связи считает Метрика (src/components/Analytics.astro), она ждёт PUBLIC_YM_ID.
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
