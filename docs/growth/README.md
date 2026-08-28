# Labs Cannabis Growth Plans

Этот каталог — набор тактических планов роста для **Labs Cannabis (Pattaya)**, разбитых так, чтобы каждый файл можно было подать в отдельную сессию LLM как самостоятельную задачу. Не читай отсюда сюжет последовательно — это библиотека, а не книга.

> **ВНИМАНИЕ: файл ниже устарел и оставлен как история замысла, а не как описание сайта.**
>
> Расходится с действительностью как минимум в этом:
> - **Стек.** Здесь написано «Next.js 16 + React 19 + Sanity». Сайт — **Astro 5,
>   статика, Tailwind v4, Vercel**. Ни Sanity, ни `next-intl`, ни `src/app/` в
>   репозитории нет.
> - **JavaScript.** Формулировку «ноль JavaScript в сборке» использовать нельзя:
>   она неверна и не была верна раньше. Проверяемая версия: **0 бандлов
>   (`.js`/`.mjs` файлов в `dist/` — ноль), 2891 Б инлайн-скриптов на страницу в
>   четырёх блоках и один внешний запрос на аналитику**. Инлайн-блоки: загрузчик
>   Vercel Web Analytics (он же в рантайме создаёт
>   `<script src="/_vercel/insights/script.js">`), обработчик выпадашки языка,
>   `IntersectionObserver` для липкого CTA и отправка событий
>   `contact_click`/`nav_click`. Если целью действительно является ноль —
>   выключается `webAnalytics` в `astro.config.mjs`, и тогда исчезает и внешний
>   запрос; пока он включён, «ноль JS» — ложная посылка, на которой нельзя
>   строить решения о скорости.
> - **Вес сборки.** `dist/` весит **15 МБ** (не 9,4 МБ, как в описаниях
>   прошлых раундов): 288 HTML, медиана 46 КБ, один внешний кэшируемый CSS
>   60 902 Б, три растровых файла, ноль `.js`. Рост объясняется числом страниц,
>   а не утяжелением каждой. Осмысленная метрика скорости — не общий вес
>   `dist/`, а медиана gzip одной страницы: сейчас около 10 КБ
>   (`runtz` 10 113 Б, `big-buddha` 10 229 Б, главная 9 718 Б).
> - **Локали.** Здесь три (en/ru/th). В сайте **семь**: en, ru, th, ar, zh, ko, ja.
> - **Адрес.** Здесь «Pattaya 13 Alley (Soi Hollywood)». Soi Hollywood — **адрес
>   чужого магазина**, с которым Google склеил карточку; расшивание этой склейки
>   было отдельной задачей. Правильный адрес: **32 Pattaya 13 Alley, South
>   Pattaya, Chon Buri 20150**.
> - **Оффер.** Здесь «24/7 weed delivery, 30 минут к отелю». Часы работы **не
>   подтверждены** (`hoursVerified=false`), и утверждать 24/7 нельзя.
> - **Регистр.** Здесь «premium». Рекламный регистр **блокируется линтером** на
>   семи языках.
> - **Названия.** Действующих имени два: **LABS DISPENSARY** (вывеска и карточка
>   Google) и **Labs Cannabis** (сайт). Ни одно не называть бывшим — линтер
>   уронит сборку.
>
> Актуальные и проверяемые документы: `docs/growth/CONTENT-FACTORY.md` (контракт
> контент-завода) и `docs/growth/ops/03…05` (автоматизация публикации). Источник
> правды по индексации — `src/lib/index-policy.mjs` и `npm run check:seo`, а не
> этот файл.

## Контекст бизнеса (shared, читать всем агентам)

- **Бизнес:** локальный trust-first cannabis shop в Паттайе, не маркетплейс.
- **Локация:** Pattaya 13 Alley (Soi Hollywood), 5 минут от Walking Street.
- **Прод:** [labscannabis.boutique](https://labscannabis.boutique/)
- **Социальный доказ:** Google 4.8 / 91 review (см. `shopSettings.googleRating` / `googleReviewCount`).
- **Команда контента:** только Dima (founder/budtender) + 1 фрилансер на $200–400/мес. Низкая контент-ёмкость — приоритет на leverage-задачи.
- **Бюджет маркетинга:** $300–800/мес. Cannabis-реклама в Meta/Google заблокирована — играем в organic SEO + Telegram Ads + Reddit + offline partnerships.
- **Hero-оффер новой стратегии:** **24/7 weed delivery в Паттайе, 30 минут к отелю**. Это главный USP, под который перестраивается весь сайт и весь маркетинг.

## Стратегическая ставка

Стать дефолтным ответом на запрос **"I want weed in Pattaya right now"** в Google Maps, TikTok, Telegram, Reddit. Hero — 24/7 delivery, всё остальное обслуживает этот оффер.

## Целевая аудитория (priority order)

1. **EN-туристы** — импульс, 1–3 г/сессию, ищут в Google Maps + Reddit + TikTok.
2. **RU-зимовщики/экспаты в Pattaya/Jomtien** — повторные, 5–10 г+, Telegram + RU-чаты.
3. **RU-туристы на 1–2 недели** — средний чек, повторят 2–3 раза за поездку.
- TH-локалы и EN-nomads — НЕ в фокусе на 90 дней.

## Бренд double-voice

- **Сайт labscannabis.boutique** = trust-якорь. Premium, Google reviews, Dima, FAQ, легальность. Конвертит тёплый трафик. **Цеки/«plug»-tone сюда не переносим.**
- **Соц-каналы (TikTok / Reels / Telegram-мемы)** = cheeky/fast/«the plug». Привлекают холодный трафик.
- Связка через **Dima как персонажа**: эксперт на сайте, character в соц.

## Тех-стек (для агентов, которые трогают код)

- **Framework:** Next.js 16 App Router + React 19 + TypeScript
- **Styling:** Tailwind v4
- **i18n:** `next-intl`, локали `en` / `ru` / `th`, без `localeDetection`. Канонические URL `/en` `/ru` `/th`.
- **CMS:** Sanity (`src/sanity/schemas/`), CMS-first с **mock fallback** (`src/lib/mock-data.ts`) — если Sanity недоступен, сайт не падает.
- **Ключевые узлы:**
  - `src/app/[locale]/page.tsx` — главная
  - `src/app/[locale]/strains/[slug]/page.tsx` — карточка сорта
  - `src/app/strains/effects/[effect]/page.tsx`, `src/app/strains/types/[type]/page.tsx` — SEO landing'и
  - `src/lib/queries.ts` — Sanity GROQ-запросы с fallback
  - `src/lib/mock-data.ts` — типы `Strain`, `ShopSettings` + mock seed
  - `src/lib/contact-links.ts` — builder WhatsApp/Telegram/LINE/phone с локализованным prefilled message и appendQueryParam (поддерживает добавление UTM)
  - `src/components/FulfillmentOptions.tsx` — блок walk-in/pickup/delivery
  - `src/components/Hero.tsx` — hero
  - `src/app/api/chat/route.ts` — мини-консьерж
  - `src/app/api/strain/generate/route.ts` — AI strain draft generator
  - `messages/en.json`, `messages/ru.json`, `messages/th.json` — i18n словари

## Ограничения для всех агентов

**Не ломать:**
- Локализацию EN/RU/TH (любой новый текст должен быть в трёх словарях)
- Sanity fallback (любой запрос должен иметь mock fallback в `src/lib/queries.ts` или `mock-data.ts`)
- Stock-first каталог (`StrainCatalog`, `StrainCard`)
- WhatsApp / Maps / Telegram conversion paths (`buildContactLinks`)
- Tourist/legal reassurance (FAQ, NoPrescription)
- SEO структуру: sitemap, robots, hreflang, OG, LocalBusiness/Product/FAQ JSON-LD

**Не делать:**
- Не трогать тайский маркетинг (вне фокуса на 90 дней — но i18n не ломать)
- Не покупать Meta/Google/Insta Ads (cannabis = бан)
- Не делать 10 отдельных доменов (PBN penalty)
- Не переносить «plug»-tone на сам сайт (сайт = trust)
- Не публиковать prices/inventory в местах, где это может стать grounds для бана (TikTok, Insta) — там только vibe и направить в WhatsApp

## Структура планов

### Site track — улучшения самого labscannabis.boutique

Каждый файл соответствует одной фокус-задаче, выполняется агентом в кодовой базе.

- [`site/01-i18n-fulfillment-fix.md`](site/01-i18n-fulfillment-fix.md) — фикс missing i18n keys в блоке fulfillment (видны на проде сейчас)
- [`site/02-hero-24-7-rewrite.md`](site/02-hero-24-7-rewrite.md) — переписать hero под «Pattaya 24/7 cannabis delivery»
- [`site/03-programmatic-seo-areas-hotels.md`](site/03-programmatic-seo-areas-hotels.md) — добавить маршруты `/[locale]/delivery/[area]` и `/[locale]/guides/cannabis-near/[hotel]` + Sanity схемы
- [`site/04-strain-detail-conversion.md`](site/04-strain-detail-conversion.md) — расширить страницу сорта блоком конверсии и схемой Product
- [`site/05-legal-tourist-guide.md`](site/05-legal-tourist-guide.md) — большая trust-страница «Cannabis legal for tourists in Thailand»
- [`site/06-utm-source-tracking.md`](site/06-utm-source-tracking.md) — пробросить UTM-source через `buildContactLinks` для замера каналов
- [`site/07-admin-studio-lockdown.md`](site/07-admin-studio-lockdown.md) — спрятать `/studio` за env-флаг и убрать индексирование

### Platforms track — внешние каналы

Эти планы — для контент/SMM-агента или человека-исполнителя. Кода не требуют (или почти не требуют).

- [`platforms/01-google-business-profile.md`](platforms/01-google-business-profile.md) — оптимизация GBP под 24/7 delivery
- [`platforms/02-tiktok-reels-content.md`](platforms/02-tiktok-reels-content.md) — 14-дневный контент-календарь TikTok/Reels
- [`platforms/03-telegram-stack.md`](platforms/03-telegram-stack.md) — main канал + 2 контент-сателлита + бот-консьерж
- [`platforms/04-reddit-quora-blogs.md`](platforms/04-reddit-quora-blogs.md) — Reddit/Quora playbook + Medium/Substack/Telegraph посты
- [`platforms/05-offline-partner-kit.md`](platforms/05-offline-partner-kit.md) — partner-кит для tuk-tuk/hostels/tattoo/bars/spa

### Ops track — инфраструктура процесса

- [`ops/01-freelance-copywriter-brief.md`](ops/01-freelance-copywriter-brief.md) — описание роли и тестовое для RU-копирайтера
- [`ops/02-budget-and-metrics.md`](ops/02-budget-and-metrics.md) — распределение бюджета и weekly dashboard метрик
- [`ops/03-indexnow-vercel.md`](ops/03-indexnow-vercel.md) — пинг IndexNow после деплоя: Bing, Яндекс, Naver, Seznam, Yep. **Google в IndexNow не участвует**
- [`ops/04-search-console-api.md`](ops/04-search-console-api.md) — Google Search Console API: пошагово для владельца, что нажать, чтобы включить (сервисный аккаунт, доступ, переменные Vercel)
- [`ops/05-content-cache-orphans.md`](ops/05-content-cache-orphans.md) — почему 126 файлов машинного текста удалены, а не доведены, и какая проверка не даёт им вернуться

## Как пользоваться этими планами в LLM-сессии

1. **Подавай один план за раз.** Каждый файл self-contained, но сначала прочитай `README.md` (этот файл) для shared context.
2. **Site track агентам:** в системном промпте указывай «работай только в указанных файлах, не трогай локализацию других языков, всегда сохраняй mock fallback».
3. **Platforms track агентам:** не нужен доступ к репо — это копирайт-/SMM-задачи, можно подавать как чистый brief.
4. **Параллельность:** site-планы 01–07 можно делать параллельно (разные файлы), но 02 (hero) и 06 (UTM) лучше после 01 (i18n fix), иначе можно случайно затереть только что добавленные ключи.

## Глоссарий

- **Hero offer** — главный оффер, который видит пользователь в первые 5 секунд на сайте/в рекламе.
- **Programmatic SEO** — генерация десятков лендингов по шаблону (район, отель, стрейн) для покрытия long-tail.
- **GBP** — Google Business Profile (бывший Google My Business).
- **UGC** — user-generated content.
- **PBN** — private blog network (запрещённая Google практика).
- **FYP** — TikTok For You Page.
