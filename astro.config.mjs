import { execFileSync } from "node:child_process";

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { getIndexPolicyForPathname, getXDefaultLocale, localePathname } from "./src/lib/index-policy.mjs";

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
   * Инлайн таблицы стилей. Условие, поставленное прошлым раундом, выполнено.
   *
   * ИСТОРИЯ РЕШЕНИЯ. Здесь уже был инлайн, и его откатили — с правильным
   * обоснованием: он снимал один блокирующий запрос из двух, а второй,
   * кросс-доменный `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`,
   * оставался и стоил дороже (DNS + TLS + fetch к чужому хосту). Промежуточное
   * состояние хуже обоих, и в комментарии было записано, при каком условии к
   * инлайну возвращаются: «только вместе с self-host шрифтов в `/fonts/`».
   *
   * Условие выполнено (`scripts/fetch-fonts.mjs`, `src/lib/fonts.ts`): запроса
   * к fonts.googleapis.com в `dist` больше нет ни одного, а `check-seo`
   * (`checkFontDelivery`) не даёт ему вернуться.
   *
   * ЗАМЕР, сжатый транспорт, страница `/en/`:
   *   внешняя CSS: 11 882 B HTML + 6 843 B CSS = 18 725 B в ДВА запроса;
   *   инлайн:      18 502 B в ОДИН запрос.
   * То есть инлайн теперь не только снимает round-trip, но и суммарно немного
   * легче, и прежняя арифметика («экономия round-trip ценой +0,6 КБ»)
   * перевернулась — потому что сама таблица похудела с 10,1 КБ gz до 6,8 КБ.
   *
   * ОГОВОРКА К ЧИСЛАМ. Они сняты на локальной сборке. На прод-сборщике
   * автоопределение источников Tailwind давало вдвое больший результат (64 092 B
   * стилей против 31 236 B при одном коммите), поэтому вместе с этой правкой
   * `src/styles/global.css` перечисляет источники явно, а `check-seo`
   * (`checkStylesheetCoverage()`) следит, чтобы явный список ничего не потерял.
   * Без этого «18 502 B» было бы верно только на машине разработчика.
   *
   * ЧТО ТЕРЯЕТСЯ. Кэш общей таблицы между страницами: второй просмотр внутри
   * сессии стоит +6,8 КБ. Это принято сознательно. Сюда приходят из поиска на
   * одну страницу, LCP-элемент — заголовок H1, и первая отрисовка первой
   * страницы важнее второго перехода. Блокирующих запросов в `<head>` теперь
   * ноль: разметка приезжает со стилями внутри, шрифт качается параллельно
   * разбору HTML по `preload` и подменяется по `font-display: swap`.
   */
  build: {
    inlineStylesheets: "always",
  },
  /**
   * Vercel Web Analytics включён.
   *
   * Счётчик не ставит cookie и не строит кросс-сайтовый профиль, поэтому
   * работает до появления страницы об обработке данных, а не после неё:
   * единственная альтернатива — не считать посетителей вообще, а сайт,
   * который делается ради замеримой конверсии, не может остаться без
   * единственного работающего счётчика просмотров.
   *
   * Цели по каналам связи (WhatsApp, LINE, Telegram, звонок, карта, маршрут)
   * считает Метрика — см. src/components/Analytics.astro. Она ждёт
   * PUBLIC_YM_ID и без него молча не рендерится.
   */
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
        // x-default — из допущенных локалей (см. `getXDefaultLocale`), а не
        // безусловно en: иначе отказ ворот на английском объявляет noindex-URL
        // как x-default в `<xhtml:link>` сайтмапа.
        const xDefaultLocale = getXDefaultLocale(policy.locales);
        if (xDefaultLocale) {
          links.push({
            lang: "x-default",
            url: new URL(localePathname(xDefaultLocale, policy.suffix), site).href,
          });
        }

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
