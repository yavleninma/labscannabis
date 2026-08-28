# Labs Cannabis / LABS DISPENSARY Pattaya — план роста конверсии

**Дата:** 2026-08-27
**Репозиторий:** `/home/user/labscannabis` (Astro 5 static, Tailwind v4, Vercel, 7 локалей: en/ru/th/ar/zh/ko/ja)
**Единственная метрика владельца:** конверсия — переход в WhatsApp / LINE / Telegram / маршрут в Google Maps.
**Документ самодостаточен.** Исполнитель Волны 1 не нуждается ни в каком другом контексте, кроме этого файла и репозитория.

---

## 0. TL;DR для исполнителя

Волна 1 — это НЕ «вернуть 200 страниц в индекс». Волна 1 — это:

1. снять CI-замок, который физически не даёт задеплоить ни одну правку;
2. починить воронку на **уже существующем** трафике (CTA, каналы, шапка, sticky, аналитика, часы, отзывы);
3. вычистить из репозитория юридические мины (цены в ฿, «free in-store sample», промо), которые сейчас лежат в коде и всплывут при первом же включении любой страницы;
4. вернуть в индекс **только те** страницы, у которых уже есть собственный уникальный текст и которые безопасны юридически;
5. переработать главную из «вот наш пин» в продающую.

Волна 1 сознательно НЕ трогает: гео-сетку районов целиком (там реальные дубли — см. §2.2), оптовый раздел (нужна проверка лицензии), ценовые страницы (нужно заключение юриста), `outputDirectory`/`trailingSlash` в `vercel.json` (нужны реальные коды ответа с прода).

---

## 1. Что установлено фактами (проверено в этом репозитории)

Все числа ниже перепроверены командами по коду и по собранному `dist/` на 2026-08-27. Где предыдущие аудиты ошибались — указано явно.

### 1.1 Индексация

| Факт | Доказательство |
|---|---|
| Индексируется ровно 41 URL из 210 собранных | `src/lib/index-policy.mjs` — 8 правил allowlist; `EXPECTED_INDEXABLE_PAGE_COUNT` вычисляется reduce'ом |
| CI жёстко требует ровно 41 | `scripts/check-seo.mjs:297`: `if (EXPECTED_INDEXABLE_PAGE_COUNT !== 41) fail(...)` |
| CI запрещает `aggregateRating`, `openingHoursSpecification`, `priceRange` в JSON-LD | `scripts/check-seo.mjs:23` — `FORBIDDEN_JSON_LD_KEYS` |
| CI запрещает `lastmod` в сайтмапе | `scripts/check-seo.mjs` ~195: `sitemap must not contain build-time lastmod values` |
| `astro.config.mjs` принудительно вырезает `lastmod` | деструктуризация `const { lastmod: _lastmod, links: _links, ...withoutFreshness } = item;` |
| 213 HTML в `dist`, 75 правил редиректов в `vercel.json` | `find dist -name '*.html' \| wc -l` → 213; `grep -c '"source"' vercel.json` → 75 |
| 52 из 75 правил ведут в `/locations/` (28) и `/guides/legal-cannabis-tourists/` (24) | разбор `"destination"` в `vercel.json` |
| `/:lang/wholesale/` и `/:lang/strains/:slug/` перекрыты 301 при существующих файлах | `vercel.json` + `src/pages/[lang]/wholesale.astro`, `src/pages/[lang]/strains/white-widow.astro` |
| Для `buy-cannabis-pattaya`, `cheap-weed-pattaya`, `best-cannabis-shop-pattaya`, `cannabis-wholesale-pattaya`, `how-to-buy-cannabis-pattaya`, `cannathai-wholesale-cannabis-thailand` редиректы существуют ТОЛЬКО на корневом уровне | `vercel.json:87-90` — нет `:lang`-вариантов |
| CI-шаг `git diff --exit-code` («Verify clean worktree») | `.github/workflows/main.yml` |
| `npm run build` = только `astro build`; генераторы в сборку НЕ входят | `package.json` |

### 1.2 Дублирование — ГЛАВНАЯ ПОПРАВКА К ПРЕДЫДУЩИМ АУДИТАМ

Утверждение «все 41 страница совпадают на 98–99%» **неверно**. Оно получено измерением по всему `<body>` (то есть вместе с шапкой, футером и sticky-CTA) и по множеству уникальных слов.

Замер по **основному контенту** (тело без `<header>`, `<footer>`, `<script>`, sticky-CTA), коэффициент Жаккара по 5-словным шинглам, локаль en:

```
index    313 слов    jomtien vs naklua        0.82   ← настоящие дубли
locations 92         walking-street vs naklua 0.81   ← настоящие дубли
contact   57         walking-street vs jomtien 0.81  ← настоящие дубли
labs     242         labs vs near-me          0.37   ← норма
near-me  263         delivery vs legal-guide  0.28   ← норма
walking  141         всё остальное           <0.20   ← норма
delivery 368
jomtien  138
naklua   138
legal    247
```

Выводы, на которых строится план:

1. **Дубли есть только в шаблоне `src/pages/[lang]/areas/[area].astro`** (0.81–0.82). Именно поэтому массовый возврат 84 гео-страниц в Волне 1 запрещён — сначала переписывается шаблон (Волна 2).
2. **Настоящая болезнь остальных страниц — не дубли, а тонкость**: 57–368 слов собственного текста при 60–70% объёма страницы из общего обвеса. Метрика качества должна быть «объём собственного смысла», а не только «непохожесть».
3. **Любой гейт похожести обязан считать только основной контент.** Иначе добавление общего `ContactRail` (часы, рейтинг, 5 каналов, подпись «отвечаем за 5 минут») на каждую страницу само поднимет похожесть и уронит сборку.
4. Гейт похожести в Волне 1 работает **в режиме отчёта, не блокирующем**. Блокирующим он становится в Волне 2, после переписывания area-шаблона, и порог берётся из фактического распределения (p95 + запас), а не назначается наугад.

### 1.3 Конверсия

| Факт | Доказательство | Поправка |
|---|---|---|
| Фраза-самоубийца в префилле WhatsApp | `src/components/StickyCTA.astro:24`, `src/components/TrackingScript.astro:183` («I am not sending an order or payment.»), `src/pages/[lang]/delivery/[area].astro:58` («I am not requesting an online order or delivery.») | подтверждено |
| Техтег `[source: …; page: …; utm: …]` дописывается в **тело сообщения**, пользователь видит его в WhatsApp до отправки | `src/components/TrackingScript.astro` — `buildWhatsAppTag` / `appendWhatsAppSource` | подтверждено |
| Telegram и LINE есть только на 7 HTML из 213 | `grep -rl 't\.me/' dist --include=*.html \| wc -l` → 7; то же для `line.me` | подтверждено |
| **WhatsApp есть на 210 из 213 страниц**, а не «на 18 из 41» | `grep -rl 'wa\.me/' dist --include=*.html \| wc -l` → 210 | **предыдущая метрика «18 из 41» неверна** — sticky-CTA стоит в `PageLayout` и попадает всюду. Дыра не в отсутствии WhatsApp, а в тексте кнопки, её позиции и в отсутствии Telegram/LINE |
| Ссылка LINE нерабочая | `src/data/site.ts:8` = `https://line.me/R/ti/p/660806784` — обрезанный телефон (в whatsapp номер `66660806784`), а после `/ti/p/` ожидается LINE ID | подтверждено |
| Telegram по номеру | `src/data/site.ts:7` = `https://t.me/+66660806784` — работает только при приватности «Все» | подтверждено |
| На мобильном в шапке нет ни одной кнопки действия | `src/components/SiteHeader.astro` — WhatsApp `hidden … sm:inline-flex`, nav `hidden … md:flex` | подтверждено |
| `env(safe-area-inset-bottom)` не используется при `viewport-fit=cover` | `grep -c 'env(' src/styles/global.css` → 0; `src/layouts/PageLayout.astro` — `viewport-fit=cover` | подтверждено |
| `id="home-hero"` отсутствует, sticky показывается по грубому fallback `scrollY > 80` | `src/pages/[lang]/index.astro` — первая секция без id; `src/components/StickyCTA.astro` ищет `#home-hero` | подтверждено |
| События аналитики не долетают | `src/components/TrackingScript.astro`: `window.va?.("event", name, payload)` — Vercel ожидает `window.va('event', { name, data })`; `window.gtag`/`window.dataLayer` нигде не подключены; `@vercel/analytics` нет в `package.json` | подтверждено |
| Четыре разных имени события для одного действия | `hero_whatsapp_click`, `location_whatsapp_click`, `contact_whatsapp_click`, `contact_messenger_click` | подтверждено |
| Часов работы нет нигде | `src/components/Footer.astro` — `hours: "Check Google Maps before visiting."`; в `src/data/site.ts` константы `HOURS` нет | подтверждено |
| Рейтинг 4.8 / ~104 не показан нигде; `src/lib/reviews.ts` и `src/data/reviews-pool.ts` не импортируются ни одной страницей | grep по `src/` | подтверждено |
| Готовая переведённая микрокопия не выводится: `contact.subtitle`, `location.landmark`, `location.step1..3`, `location.hours`, `reviews.*` | `src/i18n/*/ui.json`, 0 использований | подтверждено |

### 1.4 Юридические мины, лежащие в коде ПРЯМО СЕЙЧАС

Это самое опасное из найденного, и ни один из трёх исходных планов не поставил это в приоритет:

| Мина | Где | Почему опасно |
|---|---|---|
| `meta.title` = `"Labs Cannabis — Pattaya Reels Shop \| From 300฿/g to 1kg"` и `meta.description` с «weight tiers 1g–1kg» | `src/i18n/*/ui.json` | `src/layouts/PageLayout.astro`: `const pageTitle = title ?? ui.meta.title;` — это **действующий fallback**. Любая новая страница, забывшая передать `title`, опубликует ценовую рекламу цветка в `<title>`. Сейчас в `dist` символа `฿` нет только потому, что все страницы передают title явно |
| `prices.*`, `whatsappPrefill.*` («I'd like 10g … When can I pick up?»), `reels.jointsOfferPromo` = «Special: 3 joints for ฿200» | `src/i18n/*/ui.json`, `src/data/prices.ts`, `src/data/media.ts` | прямые ценовые офферы и промо; при включении витрины/прайса всплывут мгновенно |
| Генератор пишет `300฿/g`, `10g at 1,800฿`, `1kg wholesale 40,000฿`, `Free in-store sample`, `4.8★ (91 reviews)`, адрес `Soi Hollywood` | `scripts/gen-seo-fallback.mjs` (объект `COPY`, ~строки 25-45) | любой запуск `npm run gen:seo-fallback` после расширения `SEO_PAGES` **создаст** новые файлы с этим текстом |
| 64 вхождения `free in-store samples`, `unbeatable prices`, весовые тиры 1g–1kg, отсутствие упоминания рецепта | `content-cache/**/*.json` | это ровно то, что приказ 2568 квалифицирует как коммерческую рекламу цветка (санкция — приостановка лицензии 30–90 дней) |
| `Soi Hollywood` как адрес магазина в 108 из 168 файлов кэша и в `ui.json` (`location.address` = `32 Pattaya 13 Alley (Soi Hollywood)…`) | `content-cache/`, `src/i18n/*/ui.json` | реальный адрес — `32 Pattaya 13 Alley, South Pattaya`. Этот NAP-конфликт с высокой вероятностью и научил Google склейке «LABS DISPENSARY = Ganja Labs на Soi Hollywood» |

### 1.5 Вейп-трафик

В репозитории **нет вейп-контента**: единственное вхождение — `content-cache/ru/10g-cannabis-pattaya.json` («вейпинг»), и этот файл сборкой не читается. По вейп-запросам в web-выдаче сайт не ранжируется. Практически наверняка владелец смотрит **discovery-запросы карточки Google Business Profile**, где при нулевой органике любой смежный smoke-запрос даёт 100% отчёта.

Вывод: «вейп-проблема» лечится не фильтрацией слова, а (а) появлением настоящего каннабис-трафика, (б) ревизией вторичных категорий и атрибутов в GBP и каталогах, (в) явной строкой на сайте «вейпы не продаём» — это ещё и снижает enforcement-риск (в Паттайе рейд CCIB на каннабис-магазин был именно за вейпы).

### 1.6 Юридическая рамка (действует на все волны)

**КРАСНОЕ — никогда:**
- корзина, чекаут, форма заказа, ссылка на оплату, «заказать онлайн» в любом виде (повторное нарушение — отзыв лицензии по регламенту DTAM 06.2026);
- опубликованные цены, ставки за грамм, скидки, акции, «дёшево/самое дешёвое», бесплатные образцы;
- медицинские и терапевтические обещания; «рецепт — формальность», «без рецепта»;
- реклама продажи вейпов, электронных сигарет, табака;
- платная реклама каннабиса в Google/Meta/TikTok/LINE Ads.

**ЖЁЛТОЕ — только с решением владельца/юриста:** публичный список сортов без цен; THC% как характеристика сорта; оптовый раздел; страница ценовых диапазонов; страница про рецепт ภ.ท.33 (описательно, без «за 2 минуты» и без «поможем оформить»).

**ЗЕЛЁНОЕ:** география и маршруты, часы, языки персонала, правила и регуляторика со ссылками на первоисточники, отзывы с ссылкой на карточку, разметка бизнеса, каналы связи.

**Важная поправка:** `noindex` **не является** юридической защитой — страница остаётся публично доступной. Предыдущий релиз снял 100% трафика и 0% риска.

---

## 2. Стратегия

**Порядок: снизу вверх по воронке.** Сначала то, через что человек выходит в контакт (действует на весь текущий трафик за один деплой), потом повод выйти, потом охват.

Пять принципов:

1. **Осторожность переносится с количества URL на формулировки.** Потолок «41 страница» заменяется на compliance-линтер (deny-list коротких однозначных строк) + отчёт по уникальности. Тайский запрет — про рекламу и оферту, а не про число страниц.
2. **Никакого массового возврата.** В Волне 1 в индекс возвращаются только страницы с уже написанным собственным текстом (после чистки). Гео-сетка и сорта — Волна 2, после переписывания шаблонов. Doorway-риск (много гео-страниц на одну физическую точку) реален и лечится не уникальностью текста, а содержательной причиной существования страницы: вычисленный маршрут, ориентиры, транспорт, время.
3. **Ничего не обещаем, чего не будет.** `aggregateRating` для `LocalBusiness` **не даёт звёзд в сниппете** (self-serving reviews). Рейтинг показываем визуально со ссылкой на карточку. IndexNow не ускоряет Google (его поддерживают Bing/Yandex/Seznam/Naver) — это не рычаг, а гигиена.
4. **Ничего не декларируем, что можно вычислить.** До Walking Street ~800 м по прямой (координаты `12.9233467, 100.8771557`), то есть 12–16 минут пешком, а `ui.location.landmark` обещает «5 минут». Расстояния считаются гаверсинусом, а не пишутся руками.
5. **Ни одной правки вслепую.** `vercel.json` в части `outputDirectory`/`trailingSlash` не трогаем, пока владелец не пришлёт реальные коды ответа (`curl -sI`). Это единственная правка во всём плане, способная уронить сайт целиком.

**Что даёт результат за 2–4 недели:** тексты CTA, рабочие LINE/Telegram, кнопки в мобильной шапке, sticky-панель, прямой deep link маршрута, часы, отзывы, ContactRail, GBP и карточки на агрегаторах.
**Что даёт результат за 6–12 недель:** возврат страниц в индекс, гео-сетка, кластер правил/рецепта.
Это надо сказать владельцу **до старта**, а не в разделе «Риски».

---

## 3. Волна 1 — делаем сейчас, выкатываем в прод

**Цель волны:** поднять число целевых действий на существующем трафике, сделать конверсию измеримой, убрать юридические мины из кода, вернуть в индекс безопасные коммерческие страницы, переработать главную.

### 3.1 Порядок исполнения (жёсткий)

```
W1-01 → W1-02 (CI и модули проверок)
      → W1-03 (данные сайта)
      → W1-04, W1-05, W1-06, W1-07 (CTA, sticky, шапка, ContactRail, каналы)  [можно параллельно]
      → W1-08 (аналитика)
      → W1-09 (мины в ui.json/media/prices/генератор)
      → W1-10 (чистка content-cache)  → W1-11 (подключение кэша)  → W1-14 (возврат слагов)
      → W1-12 (часы+отзывы), W1-13 (JSON-LD)
      → W1-15 (главная), W1-16 (перелинковка)
      → W1-17 (редиректы), W1-18 (robots+lastmod)
```

`W1-14` **обязан** идти после `W1-10` и `W1-11`. `W1-16` (перелинковка) обязан идти до включения проверки входящих ссылок в `W1-01`.

### 3.2 Таблица задач Волны 1

| ID | Задача | Файлы | Риск |
|---|---|---|---|
| W1-01 | Снять CI-замок, сохранить полезные гарды | `scripts/check-seo.mjs` | 🟢 |
| W1-02 | Модули: отчёт по уникальности (не блокирует) + compliance-линтер (блокирует) | `scripts/lib/text-similarity.mjs`, `scripts/lib/compliance-lexicon.mjs`, `scripts/check-seo.mjs` | 🟢 |
| W1-03 | Данные сайта: часы, рейтинг, deep link маршрута, флаги каналов, гаверсинус | `src/data/site.ts`, `src/lib/geo.ts` | 🟡 |
| W1-04 | Убрать CTA-самоубийцу и техтег, локализовать префиллы на 7 языков | `src/data/cta-copy.ts`, `src/components/StickyCTA.astro`, `src/components/SiteHeader.astro`, `src/components/TrackingScript.astro`, `src/pages/[lang]/areas/[area].astro`, `src/pages/[lang]/delivery/[area].astro`, `src/pages/[lang]/contact.astro` | 🟢 |
| W1-05 | Sticky-панель на 3 канала, safe-area, `id="home-hero"` | `src/components/StickyCTA.astro`, `src/styles/global.css`, `src/pages/[lang]/index.astro` | 🟢 |
| W1-06 | Кнопки действий в мобильной шапке | `src/components/SiteHeader.astro`, `src/components/LanguageSwitcher.astro` | 🟢 |
| W1-07 | `ContactRail` на каждой странице + починка/скрытие LINE и Telegram | `src/components/ContactRail.astro` + 8 страниц | 🟢 |
| W1-08 | Аналитика: правильный контракт, единое событие, второй счётчик | `src/components/TrackingScript.astro`, `src/components/Analytics.astro`, `src/layouts/PageLayout.astro` + места с `data-track` | 🟢 |
| W1-09 | Обезвредить мины в `ui.json`, `media.ts`, `prices.ts`, генераторе | `src/i18n/*/ui.json`, `src/data/media.ts`, `src/data/prices.ts`, `src/components/PriceLadder.astro`, `src/components/SpecialOfferBanner.tsx`, `scripts/gen-seo-fallback.mjs` | 🟢 |
| W1-10 | Чистка `content-cache`: адрес, промо, цены, вейп, блок про рецепт | `scripts/fix-content-cache.mjs`, `content-cache/**` | 🟡 |
| W1-11 | Подключить `content-cache` к сборке | `src/lib/seo-content.ts`, `src/lib/content.ts` | 🟢 |
| W1-12 | Часы работы, статус «открыто сейчас», рейтинг и живые отзывы | `src/components/ReviewStrip.astro`, `src/components/Footer.astro`, `src/components/SiteHeader.astro`, `src/lib/reviews.ts` | 🟡 |
| W1-13 | Полноценный JSON-LD: часы, контакты, areaServed, Organization, WebSite | `src/components/JsonLd.astro`, `src/data/citations.ts` | 🟢 |
| W1-14 | Вернуть в индекс безопасные коммерческие слаги | `src/lib/index-policy.mjs`, `src/data/seo-matrix.ts`, `src/pages/[lang]/[seoSlug].astro` | 🟡 |
| W1-15 | Переработать главную в продающую | `src/pages/[lang]/index.astro` | 🟡 |
| W1-16 | Восстановить внутреннюю перелинковку | `src/components/Footer.astro`, `src/data/footer-seo-links.ts`, `src/components/RelatedLinks.astro` | 🟢 |
| W1-17 | Перецелить редиректы точечно (без правки вывода сборки) | `vercel.json` | 🟡 |
| W1-18 | `robots.txt` + вернуть `lastmod` в сайтмап | `public/robots.txt`, `astro.config.mjs` | 🟢 |

Легенда риска: 🟢 зелёный — делаем без вопросов; 🟡 жёлтый — есть спорный момент, он объяснён в задаче; 🔴 красный — в Волну 1 не входит.

---

### W1-01. Снять CI-замок, сохранить полезные гарды 🟢

**Файл:** `scripts/check-seo.mjs`

**Удалить:**
- строку ~297: `if (EXPECTED_INDEXABLE_PAGE_COUNT !== 41) fail("Index policy must contain exactly 41 pages, …")` — главный блокирующий замок;
- константу `FORBIDDEN_JSON_LD_KEYS` (строка 23: `aggregateRating`, `openingHoursSpecification`, `priceRange`), обход JSON-LD, который её использует, и связанный `fail`;
- проверку запрета `lastmod` в `sitemapEntries()` (~строка 195: `sitemap must not contain build-time lastmod values`).

**Изменить:**
- `REQUIRED_CONTEXTUAL_INLINKS` (строки 32-36) — расширить списком слагов, возвращаемых в W1-14. Механизм оставить прежним: проверка срабатывает **только** для якорей с атрибутом `data-seo-context-link` (их сейчас 8 — 4 в `index.astro`, 4 в `locations.astro`). Не превращать в «каждый indexable URL обязан иметь входящую ссылку» — чекер не умеет считать обычные `<a>`, и такая проверка уронит сборку немедленно.
- `validateRedirectDestinations()` (строки ~120-170) **оставить как есть**, но помнить его семантику: `:lang(en|ru|th|ar|zh|ko|ja)` раскрывается во **все** перечисленные локали, и назначение обязано быть indexable **в каждой**. Отсюда правило для W1-17: если цель индексируется не во всех локалях — сужать группу `:lang(...)` до этих локалей.
- добавить флаг `--report`, печатающий таблицу «локаль × суффикс × indexable» и сводку по уникальности из W1-02.

**ОСТАВИТЬ НЕТРОНУТЫМИ (это работающая защита от повторения истории):**
- ровно один `robots`-мета с корректными директивами;
- ровно один `canonical`, равный URL страницы;
- симметрия `hreflang` с сайтмапом;
- уникальность `title` / `H1` / `description` среди indexable (`recordUnique`);
- запрет JSON-LD и `hreflang` на noindex-страницах;
- проверку неразрешённого плейсхолдера `{area}` в HTML;
- анти-клоакинг-проверку по age gate;
- лимиты длин: `MAX_TITLE_LENGTH = 75`, `MIN_DESCRIPTION_LENGTH = 40`, `MAX_DESCRIPTION_LENGTH = 200`, `MIN_BODY_TEXT_LENGTH = 400`.

**Внимание по длине title:** максимум по текущему `dist` — 72 символа (`dist/th/delivery/walking-street/index.html`), запас 3 символа. Любое добавление «LABS DISPENSARY Pattaya» в title требует сначала **укоротить** шаблоны (убрать хвост `| Labs Cannabis`), а не дописать.

**Приёмка:**
- `npm run check` (= `astro build && node scripts/check-seo.mjs`) проходит при `EXPECTED_INDEXABLE_PAGE_COUNT != 41`;
- сборка по-прежнему падает при: дублирующемся title, двух `canonical`, hreflang на noindex-странице, title длиннее 75 символов;
- `npm run check:seo -- --report` печатает таблицу по локалям;
- `git diff --exit-code` после `npm run build` чистый (шаг CI «Verify clean worktree»).

---

### W1-02. Отчёт по уникальности + compliance-линтер 🟢

**Файлы:** `scripts/lib/text-similarity.mjs`, `scripts/lib/compliance-lexicon.mjs`, `scripts/check-seo.mjs`

**(а) Извлечение основного контента — обязательное требование.**
Существующая функция `visibleBodyText` берёт весь `<body>` вместе с шапкой, футером и sticky-CTA. Для сравнения страниц нужен отдельный экстрактор, который вырезает всё общее. Реализация: добавить атрибут `data-boilerplate` на корневые элементы `SiteHeader.astro`, `Footer.astro`, `StickyCTA.astro`, `ContactRail.astro` (W1-07), и в экстракторе удалять любой элемент с этим атрибутом, а также `<script>`/`<style>`.

**(б) `scripts/lib/text-similarity.mjs`:** коэффициент Жаккара по 5-словным шинглам для латиницы и кириллицы; для `th`, `zh`, `ja`, `ko` — посимвольные n-граммы (n=10), потому что пробельная токенизация на этих языках не работает.

**(в) Режим отчёта (НЕ блокирует в Волне 1):** печатать по каждой локали максимум попарной похожести и топ-10 пар, а также число слов основного контента на каждой indexable-странице. Блокирующим гейт становится в Волне 2 с порогом, взятым из фактического распределения.

Опорные значения на 2026-08-27 (локаль en, основной контент): `areas/jomtien` vs `areas/naklua` = 0.82, `areas/walking-street` vs `areas/jomtien` = 0.81, `labs-dispensary-pattaya` vs `cannabis-near-me-pattaya` = 0.37, всё остальное < 0.30.

**(г) `scripts/lib/compliance-lexicon.mjs` — блокирующий, но узкий.** Только deny-list коротких однозначных строк, без попыток контекстного анализа:

```
free in-store sample, free sample, бесплатный образец, бесплатные образцы,
unbeatable, cheapest price, add to cart, checkout, заказать онлайн, оформить заказ,
no prescription needed, без рецепта,
฿-суммы вида /\d[\d,\. ]*\s?฿|฿\s?\d/ и /\bTHB\s?\d/
```

Обязательный allowlist исключений по файлам: `dist/*/guides/**` (легальный гайд обязан упоминать суммы штрафов — «до 500 000 THB»). Линтер работает и по `dist/`, и по `content-cache/` — иначе нарушение проживёт в репозитории до момента публикации.

**Явно зафиксировать в комментарии модуля:** линтер ловит опечатки и регрессии; юридическую ответственность несёт вычитка человеком.

**Приёмка:**
- сборка падает при добавлении в indexable-страницу строки `300฿/g` или `free in-store sample`;
- сборка НЕ падает на легальном гайде с «до 500 000 THB»;
- отчёт печатает max pairwise similarity по 7 локалям и число слов основного контента;
- отчёт по `th`/`zh`/`ja` считается посимвольными n-граммами (проверить на `dist/th/areas/jomtien` vs `dist/th/areas/naklua` — значение должно быть высоким, а не шумом).

---

### W1-03. Данные сайта: часы, рейтинг, маршрут, флаги каналов 🟡

**Файлы:** `src/data/site.ts`, `src/lib/geo.ts` (новый)

В `src/data/site.ts` добавить:

```ts
export const HOURS = {
  opens: "12:00", closes: "01:00", spansMidnight: true, tz: "Asia/Bangkok",
} as const;              // ⚠️ ЖЁЛТОЕ: значения взяты из коммита e68f2cf и НЕ подтверждены.
                         // До подтверждения владельцем (см. O-01) НЕ выводить их на сайт
                         // и НЕ добавлять openingHoursSpecification — ложное «Открыто сейчас»
                         // хуже отсутствия часов: человек приедет в закрытый магазин.

export const RATING = { value: 4.8, count: 104, source: GOOGLE.listingUrl } as const;

export const ADDRESS_ALIAS = { nearbyLandmark: "Soi Hollywood" } as const;
// алиас — только как ориентир («рядом с Soi Hollywood»), НИКОГДА как streetAddress

export function getMapsDirectionsUrl(travelmode: "walking" | "driving" = "walking"): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS.lat}%2C${ADDRESS.lng}` +
         `&destination_place_id=${GOOGLE.placeId}&travelmode=${travelmode}`;
}
```

В `CONTACT` добавить флаги `lineEnabled: false`, `telegramEnabled: false` (см. W1-07 и O-02) и **не менять** сами ссылки до получения валидных значений от владельца.

`getMapsSearchUrl()` (возвращает cid-карточку) **оставить** — она нужна там, где нужна именно карточка с отзывами.

`src/lib/geo.ts` (новый): функция `haversineMeters(lat1,lng1,lat2,lng2)` и `walkMinutes(meters, speed = 80)` (м/мин). Понадобится в Волне 2 для гео-страниц; в Волне 1 используется в W1-12 для честной замены «5 min walk from Walking Street».

**Приёмка:**
- `HOURS`, `RATING`, `getMapsDirectionsUrl` импортируются без ошибок `tsc`;
- `getMapsDirectionsUrl()` на мобильном открывает Google Maps сразу в режиме навигации;
- `haversineMeters` для координат магазина и Walking Street (≈`12.9257, 100.8700`) даёт ~800 м, `walkMinutes` — 10–13 минут (то есть НЕ 5).

---

### W1-04. Убрать CTA-самоубийцу и техтег, локализовать префиллы 🟢

**Это самая дешёвая правка во всём плане и единственная, которая действует на 100% текущего трафика немедленно.**

**Создать `src/data/cta-copy.ts`:**

```ts
export type PrefillIntent = "visit" | "menu" | "area" | "hours" | "prescription";
export const CTA_PREFILL: Record<Locale, Record<PrefillIntent, (v?: {area?: string}) => string>>
```

Требования к текстам: на языке локали, ≤160 символов, без слова «заказать», без цен, без обещаний. Это вопрос о часах и витрине — не электронная продажа. Примеры:

- ru / `menu`: «Здравствуйте! Я в Паттайе, 20+. Что сегодня есть на витрине и до скольки вы работаете?»
- en / `menu`: «Hi! I am in Pattaya, 20+. What is on the shelf today and how late are you open?»
- ru / `area`: «Здравствуйте! Я сейчас в районе {area}. Вы открыты? Как удобнее дойти?»
- en / `prescription`: «Hi — I am a visitor and I have a question about the prescription requirement. When can I come in?»

Все 7 локалей (`en`, `ru`, `th`, `ar`, `zh`, `ko`, `ja`) — ни одного английского текста в неанглийской локали.

**Удалить:**
- `src/components/StickyCTA.astro:24` — строку `"Hi Labs Cannabis. Please help me find the Google Maps location at 32 Pattaya 13 Alley. I am not sending an order or payment."` → `CTA_PREFILL[locale].menu()`;
- `src/components/SiteHeader.astro:17` — английский префилл на всех локалях → `CTA_PREFILL[locale].visit()`;
- `src/components/TrackingScript.astro:183` — тот же текст как **дефолт для любой** `wa.me`-ссылки без `text`. Если параметра `text` нет — ничего не дописывать;
- `src/components/TrackingScript.astro` — вызовы `appendWhatsAppSource` из цикла `document.querySelectorAll("a[href]")` и из обработчика `click`: функции `buildWhatsAppTag`/`appendWhatsAppSource` дописывают в тело сообщения `[source: …; ref: …; page: …; utm: …]`, и пользователь видит это в своём WhatsApp до отправки;
- `src/pages/[lang]/delivery/[area].astro:58` — `"I am not requesting an online order or delivery."`;
- в `src/pages/[lang]/areas/[area].astro` — английские `whatsappPrefill` для `th`, `ar`, `zh`, `ko`, `ja`;
- параметр `&source=` из всех `wa.me`-ссылок (`wa.me` поддерживает только `text`): `src/pages/[lang]/index.astro`, `StickyCTA.astro`, `SiteHeader.astro`, `contact.astro`, `PriceLadder.astro`, `Reels.astro`, `areas/[area].astro`, `delivery/[area].astro`.

Если владельцу нужна ручная атрибуция по первому сообщению — вместо техтега невидимый суффикс из 2-4 символов (` #h1`), расшифровку держать в `docs/growth/cta-codes.md`.

**Приёмка:**
- `grep -rn "not sending an order\|not requesting an online order" src/` → 0;
- `grep -rn '&source=' src/` → 0;
- в `dist/<lang>/index.html` для каждой из 7 локалей параметр `text` в `wa.me`-ссылке — на языке этой локали;
- в декодированном `text` нет подстрок `source`, `page`, `utm`, `ref`; длина < 160 символов.

---

### W1-05. Sticky-панель на три канала, safe-area, корректный триггер 🟢

**Файлы:** `src/components/StickyCTA.astro`, `src/styles/global.css`, `src/pages/[lang]/index.astro`

1. Одиночный якорь превратить в панель из трёх кнопок: **WhatsApp** (основная, `bg-emerald`, `CTA_PREFILL[locale].menu()`), **«Проложить маршрут»** (`getMapsDirectionsUrl()`), третья по локали — LINE для `th`/`zh`/`ko`/`ja` (только если `CONTACT.lineEnabled`), Telegram для `ru` (только если `telegramEnabled`), иначе «Позвонить» (`CONTACT.tel`).
2. Подписи: сейчас `labels` (строки 12-19) = «Ask for directions» / «Спросить маршрут» — кнопка продаёт то, что Google Maps даёт бесплатно, и конкурирует с соседней кнопкой карты. Новый текст продуктовый: en «See what is on the shelf today», ru «Узнать, что есть сегодня», и аналогично на 5 остальных языках.
3. В `src/styles/global.css` добавить `.safe-bottom { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }` и применить к контейнеру панели (сейчас `grep -c 'env(' src/styles/global.css` → 0 при `viewport-fit=cover`).
4. В `src/pages/[lang]/index.astro` первой секции (`<section class="px-4 pb-12 pt-10 sm:pt-16">`) добавить `id="home-hero"` — скрипт `StickyCTA.astro` ищет этот id и, не находя, скатывается на грубый fallback `window.scrollY > 80`.
5. Корневому элементу панели добавить `data-boilerplate` (для W1-02).

**Приёмка:** на 320–390 px видны все три кнопки, тач-таргет каждой ≥44 px; на iPhone с home indicator панель не перекрыта; `document.getElementById('home-hero') !== null` на всех 7 главных; на `/th/` третья кнопка — LINE (или «Позвонить» при `lineEnabled=false`), на `/ru/` — Telegram или «Позвонить».

---

### W1-06. Кнопки действий в мобильной шапке 🟢

**Файлы:** `src/components/SiteHeader.astro`, `src/components/LanguageSwitcher.astro`

- снять `hidden` с WhatsApp-кнопки (сейчас `hidden rounded-lg … sm:inline-flex`), оставив `inline-flex`;
- заменить текстовую кнопку на компактную иконочную группу из трёх: WhatsApp, «Позвонить» (`CONTACT.tel`), «Маршрут» (`getMapsDirectionsUrl()`), видимую от 320 px;
- в `navItems` добавить ссылку на `/contact/` (сейчас `nav` скрыт `hidden … md:flex`, и страница с Telegram/LINE достижима только из футера);
- `LanguageSwitcher` на <640 px свернуть до иконки глобуса без подписи и рамки — сейчас он занимает правый верхний угол, а кнопка, приносящая деньги, оттуда убрана;
- корневому `<header>` добавить `data-boilerplate`.

**Приёмка:** в DevTools на 320 px и 390 px в шапке видны 3 иконки действия и глобус; тач-таргет каждой ≥44×44 px; шапка остаётся `sticky`.

---

### W1-07. ContactRail на каждой странице + починка каналов 🟢

**Файлы:** `src/components/ContactRail.astro` (новый); вставка в `src/pages/[lang]/index.astro`, `locations.astro`, `contact.astro`, `guides/legal-cannabis-tourists.astro`, `[seoSlug].astro` (обе ветки), `areas/[area].astro`, `delivery/[area].astro`, `wholesale.astro`

**Компонент** `ContactRail.astro`, props `{ locale, intent: PrefillIntent, placement: string, area?: string }`:
- строка «4.8★ · 104 отзыва в Google» со ссылкой на `getMapsSearchUrl()` (визуально, без разметки рейтинга — см. §5);
- строка часов и статус «Открыто сейчас · до 01:00» (только после подтверждения часов, O-01);
- подпись `ui.contact.subtitle` («One number for everything — we usually reply within 5 minutes» / «отвечаем обычно за 5 минут») — уже переведена на 7 языков, 0 использований в коде;
- ориентир `ui.location.landmark` — **с вычисленным** значением из `src/lib/geo.ts`, а не «5 минут» (см. W1-12);
- кнопки: WhatsApp (основная) / LINE / Telegram / Позвонить / Проложить маршрут, с `data-track` из W1-08;
- корневой элемент — с атрибутом `data-boilerplate`.

**Каналы.** LINE и Telegram рендерятся **только** при `CONTACT.lineEnabled` / `CONTACT.telegramEnabled` = `true`. До получения LINE Official Account (`https://lin.ee/XXXX` или `https://line.me/R/ti/p/@id`) и Telegram `@username` (см. O-02) кнопки не рендерятся вообще: клик в ошибку хуже отсутствия канала, а Таиланд — рынок №1 для LINE.

**Особый случай — legal guide.** `src/pages/[lang]/guides/legal-cannabis-tourists.astro` сейчас содержит ровно два внешних href, и `LEGAL_GUIDE_SOURCES.thaiGovernment` оформлен основной зелёной кнопкой `bg-emerald … font-bold`, то есть самая заметная кнопка на самой горячей странице отправляет посетителя на тайскоязычный правительственный сайт без возврата. Обе внешние ссылки превратить в текстовые сноски (`text-sm underline`, `rel="nofollow noopener"`), основной кнопкой поставить WhatsApp + `ContactRail` с `intent="prescription"`.

**ВАЖНОЕ ПРАВИЛО:** `ContactRail` **не должен эмитить JSON-LD** — `scripts/check-seo.mjs` валит сборку, если noindex-страница отдаёт JSON-LD, а компонент попадает и на 169 noindex-страниц.

**Приёмка:**
- `grep -rl 't\.me/' dist --include=*.html | wc -l` ≥ 190 (сейчас 7) — при `telegramEnabled=true`; при `false` — ровно 0 и кнопка не рендерится нигде;
- на каждой indexable-странице ≥1 контактный CTA **внутри** `<article>`/`<main>` (а не только в общем обвесе);
- `npm run check:seo` зелёный, в том числе проверка «noindex-страница не эмитит JSON-LD».

---

### W1-08. Аналитика: правильный контракт, единое событие, второй счётчик 🟢

**Файлы:** `src/components/TrackingScript.astro`, `src/components/Analytics.astro` (новый), `src/layouts/PageLayout.astro`, все места с `data-track`

1. **Контракт.** `window.va?.("event", name, payload)` → `window.va?.('event', { name, data: { channel, placement } })`. Vercel Analytics хранит максимум 2 ключа данных на событие; текущий `payload` содержит 8–14 ключей — урезать до двух.
2. **Мёртвые вызовы.** `window.dataLayer.push` и `window.gtag?.(…)` сейчас бессмысленны: ни `dataLayer`, ни `gtag` нигде не подключены. Либо подключить GA4, либо убрать эти строки.
3. **Единая схема.** Свести шесть имён (`hero_whatsapp_click`, `location_whatsapp_click`, `contact_whatsapp_click`, `contact_messenger_click`, `map_open_click`, `contact_call_click`) к одному `data-track="contact_click"` с атрибутами `data-channel` ∈ {`whatsapp`,`line`,`telegram`,`phone`,`maps`} и `data-placement` ∈ {`sticky`,`header`,`hero`,`rail`,`footer`,`map_block`,`legal_guide`,`area`,`delivery`,`seo`,`contact`}. Переписать `whatsappTrackingAttrs()` в `src/lib/whatsapp.ts` (сейчас возвращает 8–10 дублирующих data-атрибутов) и упростить эвристику `getWhatsAppSource`/`readCtaUtm` в `TrackingScript.astro` — она не нужна, когда атрибут проставлен явно.
4. **Второй счётчик.** Создать `src/components/Analytics.astro` с Яндекс.Метрикой (верификация Вебмастера уже стоит в `PageLayout.astro` — мета `yandex-verification`), ID берётся из переменной окружения; при отсутствии ID компонент ничего не рендерит. В обработчике клика дополнительно `ym(ID, 'reachGoal', 'contact_' + channel)`.
   **⚠️ Вебвизор и запись сессий НЕ включать** — в Таиланде действует PDPA, а посетители из 7 стран; ограничиться целями на исходящие клики. Решение про cookie-баннер — за владельцем (O-11).
5. **Предусловие:** до правки проверить тариф Vercel — кастомные события требуют платного плана, на Hobby молча не пишутся (O-09). Основным счётчиком целей считать Метрику/GA4, Vercel — для просмотров.

**Приёмка:** после клика в консоли ровно один вызов `va('event', {name:'contact_click', data:{channel, placement}})`; `grep -rhoP 'data-track="\K[^"]+' src/ | sort -u` даёт ≤3 значения; в Метрике за сутки фиксируются цели по 5 каналам; отчёт «страница → contact_click» строится без ручной склейки имён.

---

### W1-09. Обезвредить юридические мины в коде 🟢

**Файлы:** `src/i18n/{en,ru,th,ar,zh,ko,ja}/ui.json`, `src/data/media.ts`, `src/data/prices.ts`, `src/components/PriceLadder.astro`, `src/components/SpecialOfferBanner.tsx`, `scripts/gen-seo-fallback.mjs`

1. **`ui.json` — критично.** `meta.title` = `"Labs Cannabis — Pattaya Reels Shop | From 300฿/g to 1kg"` и `meta.description` («weight tiers 1g–1kg») являются **действующим fallback** в `src/layouts/PageLayout.astro` (`title ?? ui.meta.title`). Заменить на нейтральные: en `"LABS DISPENSARY Pattaya — licensed cannabis dispensary"` (≤75 символов), ru аналогично, и по всем 7 локалям. Удалить ключи `prices.*`, `whatsappPrefill.*` («I'd like 10g … When can I pick up?»), `reels.jointsOfferPromo` («Special: 3 joints for ฿200»), `prices.streetAnchor` («street price 500–700฿/g · ours 300฿»).
2. **`ui.location.address`** = `"32 Pattaya 13 Alley (Soi Hollywood), Pattaya, Chon Buri 20150"` — убрать скобку с Soi Hollywood из адреса (см. §1.4).
3. **`src/data/media.ts`** — удалить слайд `offer-joints` (`/images/special-offer-joints.jpg`). (Примечание: `Reels.astro` уже фильтрует его через `safeSlides`, но `ReelsIsland.tsx` нужно проверить отдельно — источник данных всё равно надо вычистить.)
4. **Удалить мёртвый и опасный код:** `src/components/SpecialOfferBanner.tsx` (написан под Next.js — `next/image`, `next-intl/server`, в Astro нерабочий в принципе); `src/data/prices.ts` и `src/components/PriceLadder.astro` (оперируют суммами 1g=300฿, 10g=1800฿, 1kg=40000฿ и не импортируются ни одной страницей).
5. **`scripts/gen-seo-fallback.mjs`, объект `COPY`** — переписать: удалить `weight pricing from 300฿/g to 1kg wholesale`, `10g at 1,800฿ (180฿/g)`, `1kg wholesale is 40,000฿`, `Free in-store sample`, `4.8★ on Google (91 reviews)` (устарело — 104), адрес `Soi Hollywood` → `32 Pattaya 13 Alley, South Pattaya`. Строку `Medical card help on-site (~2 min)` **удалить целиком**: «за 2 минуты» читается как «рецепт — формальность» и прямо цитируема проверяющим. Заменить нейтральным: «в магазине работает лицензированный специалист согласно требованиям с января 2026» — и только после подтверждения владельцем (O-05).
   Это обязательное предусловие любого расширения `SEO_PAGES`: скрипт берёт список слагов из `src/data/seo-matrix.ts` и создаст новые файлы из шаблона `COPY`.
6. **Генераторы не подключать к `build`.** `npm run build` = только `astro build`; CI выполняет `git diff --exit-code`. Любой скрипт, пишущий в отслеживаемые файлы во время сборки, уронит CI по постороннему поводу. Результат генераторов коммитится вручную.

**Приёмка:** `grep -riE 'free (in-store )?sample|300฿|1,?800|40,?000|91 reviews|3 joints' src/ scripts/ | wc -l` → 0; `grep -rn '฿' src/i18n/` → 0; `grep -rn 'SpecialOfferBanner\|PriceLadder\|data/prices' src/` → 0; `npm run build` проходит; `git diff --exit-code` после сборки чистый.

---

### W1-10. Чистка `content-cache` 🟡

**Файлы:** `scripts/fix-content-cache.mjs` (новый, одноразовый ручной), `content-cache/**/*.json` (168 файлов: 24 слага × 7 локалей)

**Почему жёлтое:** массовая правка скриптом может испортить переводы на `th`/`ar`/`zh`/`ko`/`ja`. После прогона обязательна выборочная вычитка (носителем или отдельным LLM-ревью) по каждой неевропейской локали — уникальный, но нечитаемый текст для оценки качества не лучше дубля.

Что делает скрипт:
1. `Soi Hollywood` как **адрес** (108 из 168 файлов, например `content-cache/en/buy-cannabis-pattaya.json`: «Located conveniently on Soi Hollywood…») → `32 Pattaya 13 Alley, South Pattaya`. Оставить `Soi Hollywood` допустимо только в формулировке-ориентире «near Soi Hollywood».
2. Удалить 64 вхождения `free in-store samples` и варианты, `unbeatable prices`, `weight tiers ranging from 1g to 1kg`, все конкретные суммы в ฿.
3. Удалить «вейпинг» из `content-cache/ru/10g-cannabis-pattaya.json` — единственное упоминание вейпа во всём репозитории.
4. В каждый файл добавить абзац про рецепт ภ.ท.33 (цветок — контролируемая трава; нужен рецепт, выданный в Таиланде; лимит 30 дней; зарубежный рецепт не принимается). Без него текст описывает розничную сделку, которая с 26.06.2025 незаконна. **Формулировки строго описательные**, без «поможем оформить», без сроков, без «формальность».

**Приёмка:** `grep -ril 'free in-store sample' content-cache` → 0; ни одного вхождения суммы с ฿ (`grep -rn '฿' content-cache` → 0); `Soi Hollywood` встречается только как ориентир; во всех 168 файлах есть блок про рецепт; число файлов не изменилось; результат закоммичен, `git diff --exit-code` чистый.

---

### W1-11. Подключить `content-cache` к сборке 🟢

**Файлы:** `src/lib/seo-content.ts` (новый), `src/lib/content.ts`

Каталог `content-cache` содержит 168 готовых JSON (`{h1, intro, sections, faq, closing, source}`), но `grep 'content-cache' src/ astro.config.mjs` → 0: его читают только генераторы. Реальный загрузчик `loadSeoContent` (`src/lib/content.ts`) берёт данные из `PAGE_COPY`, где всего 6 слагов: `buy-cannabis-pattaya`, `cannabis-near-me-pattaya`, `cheap-weed-pattaya`, `best-cannabis-shop-pattaya`, `labs-dispensary-pattaya`, `cannabis-wholesale-pattaya`.

**Реализация — строго по образцу `src/lib/reviews.ts`:** `node:fs` + `path.join(process.cwd(), "content-cache")`, чтение на этапе SSG, валидация формы. **Не** использовать `import`-glob и `fetch` — файлы не должны попасть в клиентский бандл.

Переписать `loadSeoContent`: приоритет `PAGE_COPY` (ручные исключения) → `content-cache` → **ошибка сборки** со списком слагов без контента. Сейчас generic-fallback тихо отдаёт одинаковый текст `"Labs Cannabis Pattaya menu inquiry"` — именно так `how-to-buy-cannabis-pattaya` и `cannathai-wholesale-cannabis-thailand` превратились бы в тонкие дубли.

**Осторожно с порядком:** пока в `SEO_PAGES` есть слаги без контента (`how-to-buy-cannabis-pattaya`, `cannathai-wholesale-cannabis-thailand` — их нет ни в `PAGE_COPY`, ни в `content-cache`), режим «падать» нужно ввести с временным allowlist исключений, который сокращается по мере наполнения. Иначе сборка упадёт на 14 страницах.

**Приёмка:** `grep -rn 'content-cache' src/` ≥ 1; `loadSeoContent` возвращает уникальный контент для всех 24 слагов × 7 локалей; сборка падает с явным перечислением слагов вне allowlist исключений.

---

### W1-12. Часы работы, статус «открыто сейчас», рейтинг и отзывы 🟡

**Файлы:** `src/components/ReviewStrip.astro`, `src/components/Footer.astro`, `src/components/SiteHeader.astro`, `src/components/ContactRail.astro`, `src/lib/reviews.ts`

**Часы (жёлтое — только после O-01).** `src/components/Footer.astro` сейчас в `footerCopy.hours` пишет «Check Google Maps before visiting.» / «Перед визитом проверьте Google Maps.» — сайт отправляет человека проверять главный вопрос в другое место. Заменить на строку из `HOURS` через уже переведённый и неиспользуемый ключ `ui.location.hours` («Daily {open} – {close}»). Добавить бейдж статуса, вычисляемый клиентским скриптом через `Intl.DateTimeFormat` с `timeZone: 'Asia/Bangkok'` (**не** по локальному времени устройства — турист в другом поясе увидит неверный статус), с учётом перехода через полночь.

**Отзывы (зелёное).** `ReviewStrip.astro` сейчас — блок «Проверьте актуальную карточку Google Maps» без единой цифры. Переписать на: заголовок `ui.reviews.title`, подзаголовок `ui.reviews.subtitle` («{rating}★ · {count} reviews on Google»), 3 карточки через `pickDailyLocalizedReviews(locale, new Date(), 3)` из `src/lib/reviews.ts` (функция написана, нигде не вызывается; переводы лежат в `reviews-cache/{en,ru,th,ar,zh,ko,ja}.json` по 10 отзывов), пометку `ui.reviews.translatedNote`, ссылку `ui.reviews.readAll` на `getMapsSearchUrl()`.
Подключить `<ReviewStrip>` на `index.astro` и `locations.astro` (сейчас он рендерится только в `[seoSlug].astro` и `areas/[area].astro`).

**Ограничение:** тексты в `reviews-cache` — машинные переводы (`scripts/gen-review-translations.mjs`), а имена в `src/data/reviews-pool.ts` выглядят как реконструкция. Поэтому: показывать **визуально** со ссылкой на источник и пометкой о переводе; **разметку `Review` с именами не эмитить** (см. §5).

**Ориентир.** `ui.location.landmark` = «5 min walk from Walking Street» — неправда: по координатам ~800 м, то есть 10–13 минут. Заменить на вычисленное значение из `src/lib/geo.ts`. Завышенное обещание дистанции возвращается отрицательным отзывом.

**Приёмка:** на каждой главной видны `4.8` и число отзывов и 3 отзыва на языке локали; в футере нет фразы «проверьте Google Maps»; бейдж статуса корректно переключается в 11:59 / 12:01 / 00:59 / 01:01 по Бангкоку и не зависит от часового пояса устройства; в тексте нет обещания «5 минут».

---

### W1-13. Полноценный JSON-LD 🟢

**Файлы:** `src/components/JsonLd.astro`, `src/data/citations.ts` (новый)

Объект `localBusiness` сейчас содержит только `name`, `alternateName`, `url`, `telephone`, одну `image`, `sameAs` с единственной ссылкой на Maps, `hasMap`, `address`, `geo`.

**Добавить:** `openingHoursSpecification` (из `HOURS`, только после O-01; schema.org допускает `closes < opens` для перехода через полночь), `priceRange: "฿฿"` (символьный диапазон, **не цифры**), `currenciesAccepted: "THB"`, `paymentAccepted`, `areaServed` (массив `Place` по всем элементам `AREAS`), `knowsLanguage` (только фактически поддерживаемые языки персонала, O-01), `logo`, `image[]` (3–5 файлов из `public/media`), `contactPoint` (`@type: ContactPoint`, `telephone`, `contactType: "customer service"`, `availableLanguage`). Добавить узлы `Organization` (`@id` `…/#org`) и `WebSite` (`@id` `…/#website`).

**`src/data/citations.ts`** — реестр площадок `{ name, directoryUrl, listingUrl, status: 'claimed'|'pending'|'absent', napVerified: boolean }`. `sameAs` собирается **только** из записей `status === 'claimed' && napVerified` — ссылка на невыверенную карточку с чужим адресом усилит путаницу с GANJ LABS, а не исправит её. Первая запись: уже существующая и индексируемая карточка `weed.th/shop/a0832af2-218a-4b55-815c-a19f39c2197d/pattaya-chon-buri/labs-dispensary` (после проверки владельцем, O-04).

**НЕ добавлять:**
- `aggregateRating` — Google не выдаёт review snippet для `LocalBusiness`/`Organization`, когда отзывы контролирует сам объект отзыва. Звёзд в выдаче не будет. Если владелец всё же хочет — только ради понимания сущности и AI-сводок, с честным ожиданием нулевого эффекта на CTR;
- `Product`, `Offer`, `OfferCatalog` и любое поле `price` — публикация оферты через разметку эквивалентна публикации оферты на странице. Для страниц сортов (Волна 2) эмитить `Article` + `about: {"@type":"Thing", name}`.

**Приёмка:** валидатор schema.org и Rich Results Test без ошибок; `grep -r '"@type": *"Offer"\|"price"' dist` → 0; `sameAs` не содержит захардкоженных URL и не содержит записей со `status !== 'claimed'`; `npm run check:seo` зелёный.

---

### W1-14. Вернуть в индекс безопасные коммерческие слаги 🟡

**Файлы:** `src/lib/index-policy.mjs`, `src/data/seo-matrix.ts`, `src/pages/[lang]/[seoSlug].astro`

**Предусловия:** W1-10 (чистка кэша) и W1-11 (подключение кэша) выполнены и смержены.

**Возвращаем в Волне 1:**

| Слаг | Локали | Обоснование |
|---|---|---|
| `labs-dispensary-pattaya` | уже все 7 | без изменений |
| `cannabis-near-me-pattaya` | en, ru → **все 7** | контент есть в `PAGE_COPY` на 7 языках |
| `buy-cannabis-pattaya` | **en, ru** | контент в `PAGE_COPY`, самый горячий транзакционный интент |
| `best-cannabis-shop-pattaya` | **en, ru** | контент в `PAGE_COPY` |
| `cheap-weed-pattaya` | **en, ru** 🟡 | контент в `PAGE_COPY`. **Жёлтое:** слово «дёшево» в запросе допустимо, но на странице не должно быть ни цены, ни «самое дешёвое», ни скидок — только «от чего зависит цена» и «актуальное спросите в WhatsApp». Compliance-линтер (W1-02) обязан быть зелёным на этой странице |

**НЕ возвращаем в Волне 1:**
- `cannabis-wholesale-pattaya`, `cannathai-wholesale-cannabis-thailand` — 🔴 до подтверждения класса лицензии по ст. 46 (O-03). Реклама оптовой услуги без соответствующей лицензии — худшая из комбинаций;
- `how-to-buy-cannabis-pattaya`, `cannathai-wholesale-cannabis-thailand` — контента нет ни в `PAGE_COPY`, ни в `content-cache`; включение даст два тонких дубля generic-fallback;
- `areas/*` сверх текущих двух — там измеренные дубли 0.81–0.82, шаблон переписывается в Волне 2;
- сорта, ценовой хаб, микрогео — Волны 2 и 3.

**Убрать из `titleTemplate` / `h1Template` / `keywords` в `src/data/seo-matrix.ts` упоминания `Soi Hollywood` как адреса** (сейчас есть в `buy-cannabis-pattaya`: «Buy cannabis in Pattaya | Soi Hollywood shop», в `best-cannabis-shop-pattaya`, `labs-dispensary-pattaya`) → `South Pattaya` / `Pattaya 13`. Именно эта формулировка кормит склейку с конкурентом GANJ LABS.
**Проверить длину title:** лимит `MAX_TITLE_LENGTH = 75`, текущий максимум по `dist` — 72. Правки шаблонов делать в минус, а не в плюс.

**Итог по числу URL:** 41 → 41 + 5 (near-me на 5 новых локалей) + 6 (buy/best/cheap × en,ru) = **52**.

**Приёмка:** `EXPECTED_INDEXABLE_PAGE_COUNT` == 52; ни одного слага без собственного контента; `npm run check:seo` зелёный, включая compliance-линтер и уникальность title/H1; `grep -rn 'Soi Hollywood' src/data/seo-matrix.ts` → 0; в сайтмапе присутствуют все 52 URL с `lastmod`.

---

### W1-15. Переработать главную в продающую 🟡

**Файл:** `src/pages/[lang]/index.astro` (объект `HOME_COPY`, все 7 локалей)

Сейчас тема главной — «под каким именем нас искать в Google Maps» (`h1`: «Find Labs Cannabis in Pattaya.», блок «One shop, two names to recognise», FAQ «What name should I look for on Google Maps?»). Это вопрос, которого посетитель не задаёт, и он публично закрепляет путаницу имён.

**Изменить:**
1. `h1`: en → «LABS DISPENSARY Pattaya — licensed cannabis dispensary on Pattaya 13 Alley», ru → «LABS DISPENSARY Паттайя — лицензированный каннабис-диспенсери на Pattaya 13 Alley».
2. `title`: убрать «Map and directions», уложиться в 75 символов.
3. `primaryCta`: «Ask for directions» / «Спросить маршрут» → «Узнать, что есть сегодня» / «See what is on the shelf today»; `mapCta`: «Open Google Maps» → «Проложить маршрут» с `href = getMapsDirectionsUrl()`. Развести намерения: «что есть» → WhatsApp, «как доехать» → Maps.
4. Массив `proof` («Exact map pin», «Public listing link», «Pattaya 13 Alley») → конверсионные чипы: «4.8★ · 104 отзыва», «~12 минут пешком от Walking Street» (вычисленное значение), «Открыто до 01:00» (после O-01), «Лицензированный диспенсери».
5. Блок `identityTitle` / «One shop, two names to recognise» убрать со второго экрана, перенести одним пунктом в FAQ.
6. Добавить: `<ReviewStrip>`, `<ContactRail intent="menu" placement="hero">` вторым экраном, `<MapBlock>`, блоки-анонсы возвращённых страниц с атрибутом `data-seo-context-link` (нужны для `REQUIRED_CONTEXTUAL_INLINKS`).
7. Добавить в `HOME_COPY.faq` (все 7 локалей) вопрос про вейпы: en «Do you sell vapes, carts or hookah?» → «No. Vapes and e-cigarettes are illegal to sell in Thailand and we do not stock them. Labs is a licensed cannabis dispensary; flower is sold in-store to adults 20+ with a Thai prescription.» FAQ главной попадает в `FAQPage`-разметку через props `faq` → `JsonLd`, то есть ответ может показаться прямо в выдаче и отсечь нецелевой клик ещё до захода.

**Чего на странице быть не должно:** цен, скидок, наличия, весовых тиров, «бесплатных образцов», медицинских обещаний.

**Приёмка:** первый экран содержит рейтинг, вычисленную пешую дистанцию, часы (после O-01) и кнопку в WhatsApp; в `h1` и `primaryCta` нет слов directions/маршрут; `grep -n '฿\|скидк' dist/*/index.html` → 0; вопрос про вейпы присутствует на всех 7 локалях и в `FAQPage` JSON-LD; title ≤75 символов на всех локалях.

---

### W1-16. Восстановить внутреннюю перелинковку 🟢

**Файлы:** `src/components/Footer.astro`, `src/data/footer-seo-links.ts`, `src/components/RelatedLinks.astro` (новый)

`src/data/footer-seo-links.ts` экспортирует `FOOTER_SEO_SECTIONS`, но `grep` по `src/` показывает **0 использований** — `Footer.astro` его больше не импортирует и линкует только home, `#visit`, locations, legal guide, contact. Даже после снятия noindex страницы останутся сиротами.

- импортировать `FOOTER_SEO_SECTIONS` обратно, фильтруя каждую ссылку через `getIndexPolicy(locale, suffix).indexable` (не линковать URL, не индексируемый на текущей локали);
- ключи подписей `ui.footerSeo.*` уже переведены на 7 языков;
- создать `RelatedLinks.astro` — контекстный блок смежных страниц (на seo-странице: 2-3 смежных интента + гайд), с атрибутом `data-seo-context-link` на якорях, чтобы `REQUIRED_CONTEXTUAL_INLINKS` из W1-01 проходил;
- **эта задача обязана быть смержена до** включения расширенного списка `REQUIRED_CONTEXTUAL_INLINKS`.

**Приёмка:** футер содержит группы ссылок, все цели indexable в текущей локали; `npm run check:seo` не находит `contextual SEO link points to noindex target`; из главной каждый возвращённый URL достижим максимум в 2 клика.

---

### W1-17. Перецелить редиректы точечно 🟡

**Файл:** `vercel.json`

**НЕ ТРОГАТЬ в Волне 1:** `"outputDirectory": "dist"` и отсутствие `"trailingSlash"`. Адаптер `@astrojs/vercel` пишет Build Output API в `.vercel/output`, и при его наличии Vercel обслуживает именно его. Реальное поведение прода не проверено (egress из среды аудита заблокирован). Это единственная правка, способная уронить сайт целиком одним деплоем — только отдельным PR, только на preview, только после O-08.

**Что делаем:**
1. Удалить корневые правила `/:legacy(buy-cannabis-pattaya|cheap-weed-pattaya|best-cannabis-shop-pattaya)` → `/en/locations/` (строки 87-88) и заменить на редирект на сами страницы: `/:legacy(...)` → `/en/:legacy/`. Эти URL становятся indexable в W1-14, значит проверка `validateRedirectDestinations` пройдёт.
2. Корневые гео-правила (`/:legacy(cannabis-jomtien|cannabis-naklua|cannabis-pratumnak|cannabis-central-pattaya|cannabis-soi-hollywood|weed-shop-soi-hollywood)`) — **пока оставить** на `/en/locations/`: `areas/*` индексируются только для en+ru, и перецеливание на `/:lang/areas/<x>/` уронит проверку по локалям `th/ar/zh/ko/ja`. Полное перецеливание — Волна 2, вместе с расширением `areas`.
3. `cannabis-near-walking-street` и `best-dispensary-walking-street` → `/:lang/areas/walking-street/` **только для группы `:lang(en|ru)`** (в других локалях цель noindex — сборка упадёт).
4. `/:lang/wholesale/` и `/:lang/strains/:slug/` — **редиректы оставить**. Они действительно перекрывают существующие файлы (14 собранных страниц недостижимы), но эти файлы сейчас рендерят `RetiredCommercialPage`, то есть снятие редиректа даст 14 страниц-заглушек. Снимаем в Волне 2 вместе с переписыванием этих страниц.
5. Двухшаговую цепочку с `labscannabis.com` сократить до одного хопа: добавить отдельное правило для пустого пути сразу на `/en/`.

**Правило, которое нельзя нарушать:** `validateRedirectDestinations()` раскрывает `:lang(en|ru|th|ar|zh|ko|ja)` во **все** перечисленные локали и требует, чтобы назначение было indexable в **каждой**. Если цель индексируется не везде — сужать группу.

**Приёмка:** `npm run check:seo` не сообщает `points to noindex destination`; после деплоя `curl -sI https://labscannabis.boutique/buy-cannabis-pattaya` → 301 на `/en/buy-cannabis-pattaya/`, а `/en/buy-cannabis-pattaya/` → 200 с реальным контентом (не заглушкой); цепочка не длиннее одного хопа.

---

### W1-18. `robots.txt` и `lastmod` 🟢

**Файлы:** `public/robots.txt`, `astro.config.mjs`

1. **`robots.txt`:** удалить мёртвые `Disallow: /api/` и `Disallow: /studio/` (маршруты удалённого Next.js-приложения, в Astro-сборке их нет). Добавить секцию для Яндекса с `Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&gclid&fbclid` — ссылка из GBP несёт `utm_source=gbp&utm_medium=organic-local&utm_campaign=gbp-website-button`. **Директиву `Host` не добавлять** — Яндекс от неё отказался. `Sitemap:` оставить.
2. **`astro.config.mjs`:** в `serialize` перестать вырезать `lastmod` (парная проверка в чекере снята в W1-01). Без сигнала свежести переобход растянется на недели.
3. **IndexNow:** ключ `public/7c4e9b2a1f8d46e3b0c5a7d9e1f24368.txt` уже размещён, вызовов нет. **Это не приоритет:** IndexNow поддерживают Bing, Yandex, Seznam, Naver — Google в нём не участвует. Скрипт пинга — Волна 2, и там же надо честно указать, что вставлять его «шагом после деплоя» в `.github/workflows/main.yml` **некуда**: этот workflow ничего не деплоит (checkout → npm ci → build → check:seo → git diff), деплоит Vercel через Git-интеграцию. Нужен отдельный workflow на `deployment_status` или `workflow_dispatch`. **Сделано в Волне 2 — см. §11.2.**

**Приёмка:** в `robots.txt` нет `/api/` и `/studio/`, есть `Clean-param`, нет `Host`; `dist/sitemap-0.xml` содержит `<lastmod>`; `npm run check:seo` зелёный.

---

## 4. Волна 2 — через 2–4 недели

**Условие старта:** Волна 1 в проде ≥10 дней, аналитика даёт цифры, базовая линия снята (O-06), нет роста soft-404 в GSC.

**Гейт перехода — по спросу, а не по индексации.** Не использовать критерий «60% страниц проиндексировано»: для нового набора URL на молодом домене доля в статусе «Проиндексировано» в первые 3–4 недели закономерно ниже, и такой гейт превратится в стоп-кран. Критерий: по кластеру Волны 1 в GSC появились **ненулевые показы по каннабис-запросам** и хотя бы несколько кликов за 3 недели, и нет роста soft-404.

| ID | Задача | Суть |
|---|---|---|
| W2-01 | Переписать `src/pages/[lang]/areas/[area].astro` | `h1` с «Directions from {area} to LABS DISPENSARY» на интент-совпадающий; тело собирается из типизированных фактов: **вычисленное** расстояние и время из этого района, транспорт и ориентировочная стоимость проезда, 4-6 собственных ориентиров, финальный ориентир у входа, часы, языки персонала. Цель — снять измеренную похожесть 0.81 до <0.45 |
| W2-02 | Гео-сетка: 4–6 районов, не 12 | Оставить `pattaya`, `south-pattaya` (фактический район адреса, страницы нет вообще), `walking-street`, `soi-buakhao`, `jomtien`. LK Metro, Beach Road, Thappraya, Naklua, Pratumnak — **не** отдельными страницами, а якорями в разделе «как добраться из районов». Причина: 12 районов × 7 локалей на один физический магазин — это doorway-паттерн, от которого уникальность текста не защищает. Локали: en/ru/th |
| W2-03 | Включить блокирующий гейт уникальности | Порог из фактического распределения (p95 + запас), только по основному контенту, только после W2-01 |
| W2-04 | Матрица `кластер × локаль` в `index-policy.mjs` | Вместо плоского allowlist. en/ru — полный набор; th/zh — гео по соям, правила; ko/ja/ar — только бренд, карта, часы, правовой минимум (экстерриториальная уголовная ответственность в Корее и Японии делает коммерческий трафик неконвертируемым). `EXPECTED_INDEXABLE_PAGE_COUNT` — только вычисляемый. Номер волны — **константа в файле**, не `process.env`: в CI `build` и `check:seo` — два независимых шага плюс отдельная сборка на Vercel, env-переменная даст рассинхрон |
| W2-05 | Переписать `delivery/[area].astro` | `h1` «Cannabis delivery in {area}: online-sale rules» и intro «this page does not offer online ordering or delivery» → «Каннабис в {area}: как забрать и как доехать». Правовой блок сохранить дословно, но перенести ниже первого экрана. Легальность доставки цветка **не подтверждена** — страница описывает самовывоз и маршрут, не доставку |
| W2-06 | Кластер правил и рецепта ภ.ท.33 | `guides/cannabis-prescription-pattaya`, `guides/cannabis-rules-thailand-2026`, обновление `legal-cannabis-tourists`. Формат — справочник со ссылками на первоисточники (`dtam.moph.go.th`, `thaigov.go.th`, `tatnews.org`), а не карточка услуги. 🟡 **Строго без** «~2 минуты», «поможем оформить», «медкарта» как продукт: реклама медуслуги в Таиланде регулируется отдельно. Факт наличия специалиста — только после O-05 |
| W2-07 | Страница-перехватчик вейп-трафика | `guides/vapes-and-cannabis-thailand`: «мы не продаём вейпы и электронные сигареты — в Таиланде их продажа запрещена; вот что легально». Запускать **после** диагностики O-07 (GBP Performance + GSC), чтобы знать, где трафик живёт. Никаких упоминаний THC-вейпов, картриджей, 510 |
| W2-08 | Сорта как энциклопедия | Разблокировать `strains/white-widow`, хаб `/strains/`, сорта из `src/data/strains.ts`. Формат: генетика, терпены, аромат, THC как характеристика **сорта вообще**, никогда как спецификация партии, никогда рядом с ценой или «в наличии». Это прямое лекарство от тематической ошибки классификации домена |
| W2-09 | Полное перецеливание карты редиректов | Только **после** O-06: выгрузить GSC → Ссылки и убедиться, что у легаси-URL вообще есть внешние ссылки. Если таких URL <10 — понизить задачу до P3 и ограничиться снятием 301, перекрывающих существующие файлы |
| W2-10 | `vercel.json`: `outputDirectory` и `trailingSlash` | Отдельным PR, только на preview, полный URL-свип (все indexable URL со слэшем и без, 10 легаси-редиректов, корень, хост `labscannabis.com`), только после O-08 |
| W2-11 | Производительность | `public/media` = 93 МБ, JPEG по 1.9–3.5 МБ; `og:image` на всех 213 страницах — файл 3.5 МБ; `PageLayout` грузит пять семейств Google Fonts (Inter + Noto Arabic/JP/KR/SC) на каждой локали. Перевести изображения на `astro:assets` со `srcset` и явными `width`/`height`, отдельный лёгкий `og:image` (~200 КБ), шрифты по локали. **Обязательно до** любого возврата галереи |
| W2-12 | `LocaleHint` вместо жёсткого `/` → `/en/` | Клиентский ненавязчивый баннер «Читать по-русски →» по `navigator.languages`, с запоминанием отказа. Правку самого редиректа не делать |
| W2-13 | Внешние карточки: Bing, Яндекс.Бизнес, Apple Business Connect, 2ГИС | В `public/` есть верификация Google и Яндекса, но нет `BingSiteAuth.xml`. Apple Maps — карта по умолчанию для всех iPhone-туристов. Единый NAP из `public/nap.json` (генератор `gen:nap`, запускается вручную, результат коммитится) |
| W2-14 | Приток новых отзывов как процесс | Ссылка `search.google.com/local/writereview?placeid=ChIJLTR5b56XAjERT7wBoWEw20M` (в репозитории её нет вообще), QR у кассы, follow-up в WhatsApp, ответы владельца на 100% отзывов. Без стимулов и без фильтрации по оценке — это нарушение правил Google |
| W2-15 | Telegram как канал, а не только кнопка | Собственный канал как **второе** целевое действие (подписка) — юридически более безопасное место для наличия, чем публичная страница; посев в существующих каналах и чатах Паттайи с отдельным `placement`. Опереться на уже написанный `docs/growth/platforms/03-telegram-stack.md` |
| W2-16 | Ревизия `docs/growth` | В репозитории лежит готовая off-site библиотека (`platforms/01..05`, `ops/01..02`, `site/01..07`), которую не заметил ни один аудит. Явно решить по каждому документу: берём / переписываем под нормы 2568 / помечаем DEPRECATED. Точно DEPRECATED: hero «24/7 delivery», free sample |

---

## 5. Волна 3 — долгий горизонт

| ID | Задача | Условие |
|---|---|---|
| W3-01 | Ценовой интент **без единой цифры** | 🔴 Страницу диапазонов в ฿ **не публиковать** до письменного заключения тайского юриста. Оговорка «типичный рыночный диапазон» на домене лицензированного продавца рядом с кнопкой в WhatsApp — не правовая конструкция. Интент закрывать страницей «от чего зависит цена каннабиса в Паттайе» (класс качества, indoor/greenhouse, импорт, объём) + «актуальные цены не публикуем, потому что закон запрещает — спросите в LINE/WhatsApp» |
| W3-02 | B2B / опт | Публикация страниц — только после O-03. До этого — то, что не требует лицензионной проверки: отдельный контакт (общий WhatsApp с розницей при 100+ розничных диалогах в день не годится), материалы GACP/COA/прослеживаемость, исходящий outreach к шопам Паттайи и тайским фермам. **Механизм формы заявки выбрать явно**: сайт собран как `output: "static"` без единого API-роута, «форма с полем номера лицензии» сейчас физически некуда отправлять |
| W3-03 | Программатика по отелям и ориентирам | Третья ось после районов и сортов: `cannabis near <hotel>` (Terminal 21, Central Festival, Hard Rock, Jomtien Beach). Турист знает название отеля, а не то, что он в Пратамнаке. Расстояния — вычисленные. В репозитории уже лежит `docs/growth/site/03-programmatic-seo-areas-hotels.md`. Осторожно с doorway: страница нужна, только если у неё есть содержательная причина |
| W3-04 | ИИ-поиск и цитируемость | Правила для `GPTBot`/`OAI-SearchBot`/`PerplexityBot`/`ClaudeBot` в `robots.txt` (сейчас их нет нигде), `llms.txt`, формат страниц под цитирование (фактический ответ в первом абзаце, дата обновления, ссылки на первоисточники). Замер: раз в две недели 10 контрольных вопросов в ChatGPT/Perplexity |
| W3-05 | Изображения и видео как канал | Осмысленные имена файлов (сейчас `IMG_20260517_175646.jpg`), локализованные `alt`, image-расширение сайтмапа, `VideoObject` + video-sitemap, дистрибуция роликов в YouTube Shorts / TikTok по уже написанному календарю `docs/growth/platforms/02-tiktok-reels-content.md` |
| W3-06 | A/B-инфраструктура для CTA | Сайт статический, инфраструктуры сплита нет. Минимально: клиентский выбор варианта с записью в `localStorage` и передачей `variant` в Метрику. Первые тесты: текст основной кнопки, порядок каналов в `ContactRail`, блок отзывов над кнопкой |
| W3-07 | Внешний авторитет | Домен `.boutique` без истории против `weed.th` (11 271 карточка). Каталоги (Волна 2) + форумы (aseannow, Винский), Reddit/Quora по `docs/growth/platforms/04-reddit-quora-blogs.md`, офлайн partner kit с QR и UTM (`05-offline-partner-kit.md`) |
| W3-08 | Сезонность | Сейчас низкий сезон; высокий — ноябрь–февраль, плюс Сонгкран и китайский НГ. Отчётность вести с поправкой на сезон и YoY, иначе базовая линия сентября и цель «×2 за 8 недель» будут наполовину объяснены сезоном. Таймлайн привязать к ноябрю |
| W3-09 | Мониторинг прода с алертами | Еженедельный автопрогон живой проверки: коды ответа, `canonical`, `robots`-мета, число URL в индексе, доступность ключевых страниц. История проекта — релиз, который тихо выбросил 169 URL и прошёл CI |
| W3-10 | Легальные сопутствующие товары | Бонги, гриндеры, бумага легальны в Таиланде, на сайте отсутствуют полностью (`grep` по `dist` на `bong\|grinder\|rolling paper` → 0). Мост из вейп/кальян-интента в визит. 🟡 согласовать с владельцем ассортимент |
| W3-11 | Удержание | Рецепт действует 30 дней — естественный цикл повтора. Сейчас ни одного механизма возврата клиента нет |

---

## 6. ownerTasks — то, что физически нельзя сделать из репозитория

| ID | Задача | Блокирует | Срочность |
|---|---|---|---|
| O-01 | Подтвердить **реальные часы работы** (включая праздничные) и **фактический список языков персонала**. Значения `12:00–01:00` взяты из удалённого коммита `e68f2cf` и не проверены | W1-12, W1-13, W1-15 | до старта |
| O-02 | Завести **LINE Official Account** (`https://lin.ee/XXXX` или `@id`) и **Telegram `@username`**. Текущая LINE-ссылка содержит обрезанный телефон и гарантированно ведёт в ошибку; Telegram по номеру работает только при приватности «Все» | W1-07 (иначе кнопки скрыты) | до старта |
| O-03 | Показать лицензию и **письменно подтвердить**, покрывает ли она продажу для перепродажи (ст. 46) | оптовый раздел (W3-02) | до Волны 2 |
| O-04 | **Google Business Profile: аудит и наведение порядка.** Проверить основную категорию `Cannabis store`, **удалить вторичные категории и атрибуты, связанные с tobacco / smoke shop / vape** (именно они кормят discovery по smoke-запросам), загрузить свежие фото (с мая 2026 GBP требует обновления фото каждые 30 дней), **ответить на все ~104 отзыва**. Сегодня это единственный работающий канал бизнеса | эффект Волны 1 | **приоритет №1** |
| O-05 | Подтвердить статус специалиста на месте: есть ли врач/фармацевт, имеющий право выписывать рецепт. Без подтверждения соответствующие формулировки не публикуются | W2-06 | до Волны 2 |
| O-06 | Выгрузить из GSC: (а) **отчёт «Ссылки»** — есть ли вообще внешние ссылки на легаси-URL (вся история про «испарившийся вес» на этом держится и никем не проверена); (б) текущее покрытие (сколько Indexed, сколько Excluded by noindex / Crawled — currently not indexed) как базовую линию | W2-09, оценка эффекта | до старта |
| O-07 | Выгрузить **GBP → Performance → Searches breakdown** за 6 месяцев и **GSC → Queries** с фильтром `vape\|hookah\|shisha\|tobacco\|вейп\|кальян\|табак`. Гипотеза: сайт по этим запросам не ранжируется вообще, а владелец смотрит discovery-запросы карточки | W2-07 | до Волны 2 |
| O-08 | Прислать вывод `curl -sI` для: `/en/locations`, `/en/locations/`, `/en/buy-cannabis-pattaya/`, `/en/wholesale/`, `/en/strains/white-widow/`, `/`, и с хоста `labscannabis.com`. Из среды разработки egress к внешним хостам заблокирован | W1-17 (частично), W2-10 | до Волны 2 |
| O-09 | Проверить **тариф Vercel**: кастомные события Web Analytics требуют платного плана, на Hobby молча не пишутся. Создать счётчик **Яндекс.Метрики** и передать ID | W1-08 | до старта |
| O-10 | Заявить и выровнять карточки: `weed.th` (карточка уже существует и индексируется — взять под контроль), `cannabox.co.th`, `thaiweedguide.com`, `dispensarythailand.com`, `highthailand.com`, `maps.ganja.com`, Tripadvisor. Везде один NAP: `LABS DISPENSARY, 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150, +66 66 080 6784, labscannabis.boutique`, категория cannabis dispensary, **без цен и промо, без упоминаний vape/tobacco** | W1-13 (`sameAs`) | Волна 1–2 |
| O-11 | Решение по **PDPA / cookie-баннеру** при подключении Метрики (вебвизор в плане отключён) | W1-08 | до старта |
| O-12 | **Операционка мессенджера:** WhatsApp Business, автоприветствие, быстрые ответы, дежурство, языки, SLA. Подпись «отвечаем за 5 минут» без реального дежурства превратится в отрицательный отзыв — а она стоит во всех новых CTA | эффект всей Волны 1 | до старта |
| O-13 | **Ручная базовая линия делового результата в день ноль**, без кода: сколько диалогов в WhatsApp/LINE/Telegram в неделю сейчас, сколько заканчиваются визитом, сколько звонков и «Маршруты» в GBP Insights | измерение эффекта | до старта |
| O-14 | **Заключение тайского юриста** по конкретным формулировкам: публикация названий сортов без цен, THC% как характеристика сорта, страница ценовых диапазонов, формулировки про рецепт. С датой и бюджетом | W2-08, W3-01 | до Волны 2 |
| O-15 | Снять **фото фасада и вывески LABS DISPENSARY** и короткое видео дороги от Walking Street до двери. В `public/media` 9 уникальных фото и 2 видео (33 файла — это jpg/webp/avif одного и того же), гарантии, что среди них фасад с вывеской, нет | W1-12, W2-01 | Волна 1–2 |
| O-16 | Отправить обновлённый сайтмап в GSC и Яндекс.Вебмастер и запросить переобход 10–20 ключевых URL после деплоя Волны 1. Верификация обеих панелей в `public/` уже есть | эффект Волны 1 | после деплоя |

---

## 7. Метрики

**Правило:** никаких абсолютных процентов конверсии как обязательств. Ориентиры вида «12–25% для near-me» не измерены на этом сайте и не могут быть измерены, пока аналитика не работает. Базовая линия снимается в первую полную неделю после W1-08, цель формулируется как рост относительно базовой линии.

**Главные (деловые):**
1. `contact_click` / сессия — абсолютное число и на сессию, в разрезе `channel` (whatsapp / line / telegram / phone / maps). Сегодня не существует как число.
2. Клики «Проложить маршрут» (`dir/?api=1`) **отдельно** от кликов по карточке — это метрика «дошёл сам».
3. GBP Insights: «Маршруты» и «Звонки» в неделю.
4. Число реально начатых диалогов и доля закончившихся визитом — сверка владельцем вручную по 20 диалогам в неделю (O-13, O-12).
5. Медианное время первого ответа в мессенджере — подпись «5 минут» должна быть правдой.

**Технические:**
6. Число страниц, где доступны **все три** мессенджера: сейчас 7 из 213 (это настоящая дыра). Метрику «страниц с WhatsApp» **не использовать** — их уже 210 из 213.
7. Число тапов от посадочной до открытого LINE/Telegram на мобильном: сейчас 3, цель 1.
8. Число indexable URL и подтверждённых в GSC: 41 → 52 (Волна 1) → далее по матрице. Число URL в состоянии 200+noindex без входящих ссылок: цель 0 (сейчас 155).
9. Максимум попарной похожести основного контента внутри локали: сейчас 0.82 (`areas/*`), цель после Волны 2 < 0.45. Печатается самим CI.
10. Медианное число слов основного контента на indexable-странице: сейчас 57–368, цель ≥250.
11. Число срабатываний compliance-линтера на production-ветке: 0. Число вхождений `฿` и промо в `dist` и `content-cache`: 0. Число упоминаний `Soi Hollywood` как адреса: 0.

**Поисковые:**
12. Показы и клики в GSC по кластерам: бренд, гео, розница/near-me, правила/рецепт. Главное — **появление ненулевых показов по каннабис-запросам**, которых сейчас нет вообще.
13. Число запросов со словами cannabis / weed / dispensary / กัญชา / каннабис / 大麻 в топ-20 GSC: с 0 до ≥30.
14. GBP: доля каннабис-запросов против vape/tobacco/hookah в discovery-отчёте карточки — именно этот сдвиг закрывает вопрос владельца о мусорном трафике.
15. Брендовая выдача: присутствует ли `labscannabis.boutique` в топ-3 по «labs dispensary pattaya» и «лабс каннабис паттайя» (сейчас там карточка weed.th и конкуренты GANJ LABS / White Labs / Green Lab).
16. Новых отзывов в Google в неделю (Волна 2).

**Чего НЕ обещаем:** звёзд рейтинга в сниппете от `aggregateRating` (Google не выдаёт review snippet для self-serving отзывов на `LocalBusiness`); ускорения индексации в Google от IndexNow.

---

## 8. Риски и откат

**Kill-switch.** Номер волны индексации хранится **константой в `src/lib/index-policy.mjs`**, а не в `process.env` (в CI `build` и `check:seo` — независимые шаги плюс отдельная сборка на Vercel; env-переменная даст рассинхрон и падение по ложной причине). Откат волны = один PR со сменой константы + деплой + повторная отправка сайтмапа.

**Триггеры отката:** падение брендовых показов более чем на 25% две недели подряд; рост «Обнаружена — не проиндексирована» более чем на 40% от объёма волны; появление ручных мер в GSC. Контрольная точка — 14-й день после каждого деплоя волны.

**Правило:** не менять карту редиректов и политику индексации в одном деплое — иначе откат невозможно атрибутировать.

**Основные риски:**

1. **Юридический.** Возврат страниц без чистки `content-cache` подставляет лицензию (64 вхождения `free in-store samples`, весовые тиры, ноль упоминаний рецепта). W1-10 — жёсткое предусловие W1-14. Compliance-линтер ловит опечатки и регрессии; ответственность несёт вычитка человеком.
2. **Doorway.** Массовая гео-сетка на один физический магазин квалифицируется по политике Google про doorway pages, и уникальность текста от этого не защищает. Отсюда срез с 12 районов до 4–6 в W2-02.
3. **Scaled content abuse.** 168 файлов `content-cache` уникальны между собой (медианное пересечение 0.04), но это LLM-вода. Гейт уникальности их пропустит — политика «scaled content abuse» нет. Отсюда возврат по 5–10 слагов вручную, а не массово.
4. **Переводы.** Массовая правка `content-cache` скриптом может испортить `th`/`ar`/`zh`/`ko`/`ja`. Обязательна выборочная вычитка.
5. **Ложные часы.** Неподтверждённый `openingHoursSpecification` даст «Открыто сейчас» — человек приедет в закрытый магазин. Хуже отсутствия часов. Блокируется O-01.
6. **`vercel.json`.** Правка `outputDirectory`/`trailingSlash` меняет источник раздачи для всего сайта одним деплоем и способна дать редирект-петли на всех URL. Только preview + полный свип + O-08.
7. **Скорость восстановления.** 155 URL месяцами стоят в 200+noindex. Возврат позиций — 6–12 недель после Волны 1, не дни. Зафиксировать ожидания владельца **до** старта.
8. **Ёмкость.** В репозитории зафиксирована реальная ёмкость команды: основатель + фрилансер 3–5 ч/нед при бюджете $300–800 (`docs/growth/ops/02-budget-and-metrics.md`). Волна 1 — 18 задач, и это уже верхняя граница. Если ёмкости не хватает, режем в таком порядке: W1-15 (главная) → W1-13 (JSON-LD) → W1-16 (перелинковка). **Никогда не режем:** W1-04, W1-05, W1-06, W1-07, W1-08 — это и есть быстрый эффект.
9. **CI-регрессии.** Тестов в репозитории нет вообще (только `check:seo`). Волна 2 переписывает `index-policy.mjs` на генерируемую матрицу — под это нужен минимум `node:test` на `getIndexPolicy` (включая `ko`/`ja`/`ar`), на защиту от дублей суффикса (`throw new Error('Duplicate index policy suffix')` бросается **при импорте модуля**, то есть до начала билда) и на `text-similarity`.
10. **Брендовая коллизия.** Токен «Labs» занят GANJ LABS, White Labs, Green Lab, а в англоязычной выдаче — канадским LABS Cannabis (MediPharm Labs). Требует внешних сигналов и месяцев, а не спринта.

---

## 9. Что сознательно отброшено из предыдущих вариантов

| Отброшено | Почему |
|---|---|
| Блокирующий гейт уникальности с порогом 0.45/0.60 в первой же задаче | Текущие `areas/*` дают 0.81–0.82 → CI краснеет в момент мержа, и вся быстрая конверсионка не уезжает. Плюс порог по всему `<body>` конфликтует с `ContactRail` из того же плана |
| «Все 41 страница — клоны, совпадение 98-99%» | Артефакт метрики. Замер по основному контенту: дубли только в `areas/*` |
| «WhatsApp-CTA на 18 из 41 страниц» как метрика | Уже 210 из 213. Метрику можно закрыть, не изменив ничего |
| Возврат 42 денежных слагов + 84 гео-страницы в первой волне; фонд 240–280 URL | Doorway + scaled content + объём ручного текста на 7 языках, не оценённый ни в одном варианте |
| Ценовой хаб с диапазонами в ฿ и оптовый `kg-price` в P1 | Регулятор читает публикацию ценовых диапазонов на домене продавца как ценовую рекламу; санкция — приостановка лицензии 30–90 дней. Соотношение риск/эффект худшее в наборе |
| «Кластер рецепта на 100% безопасен», «medical card help ~2 min» | Реклама медуслуги регулируется отдельно; «за 2 минуты» цитируема проверяющим как признак обхода рецептурного режима |
| `aggregateRating` → звёзды в сниппете → рост CTR | Google не выдаёт review snippet для self-serving отзывов на `LocalBusiness` |
| IndexNow как средство быстрой переиндексации; директива `Host` | Google в IndexNow не участвует; `Host` Яндексом не поддерживается. Плюс «шаг после деплоя» вставлять некуда — workflow ничего не деплоит |
| Гейт «следующая волна при 60% проиндексированных» | Для нового набора URL на молодом домене это закономерно недостижимо в первые 3–4 недели → стоп-кран. Заменён на гейт по спросу |
| Генераторы (`gen:seo-fallback`, `gen:nap`, `gen-qr`) в составе `build` | CI выполняет `git diff --exit-code` — любой пишущий в репозиторий шаг уронит сборку по постороннему поводу |
| `SEO_WAVE` через `process.env` | Рассинхрон между `build`, `check:seo` и сборкой Vercel |
| Правка `outputDirectory`/`trailingSlash` заодно с редиректами | Единственная правка, способная уронить сайт целиком; заявленный конфликт скорее всего фантомный (при наличии Build Output API Vercel обслуживает `.vercel/output`) |
| «Каждый indexable URL обязан иметь входящую ссылку» как проверка в CI | Чекер считает только якоря с `data-seo-context-link` (их 8). Такая проверка уронит сборку немедленно |
| Вебвизор Яндекс.Метрики | PDPA Таиланда, посетители из 7 стран, без баннера согласия — в плане, весь пафос которого юридическая аккуратность |
| Возврат `AgeGate.astro` в текущем виде | UA-детект краулеров = клоакинг-паттерн; кнопка выхода на `google.com` отправляет колеблющегося посетителя к конкурентам. Не возвращать, пока не потребует юрист, и только переписанным |

---

## 10. Definition of Done для Волны 1

```
[ ] npm run check зелёный (build + check:seo), git diff --exit-code чистый
[ ] EXPECTED_INDEXABLE_PAGE_COUNT == 52, все 52 URL в сайтмапе с lastmod
[ ] grep -rn "not sending an order\|not requesting an online order" src/ → 0
[ ] grep -rn '&source=' src/ → 0
[ ] grep -rn '฿' src/i18n/ src/data/ content-cache/ → 0
[ ] grep -riE 'free (in-store )?sample|unbeatable|3 joints' src/ scripts/ content-cache/ → 0
[ ] grep -rn 'Soi Hollywood' src/data/seo-matrix.ts src/i18n/ → 0 (как адрес)
[ ] префилл WhatsApp на языке локали на всех 7 локалях, ≤160 символов, без [source:
[ ] в шапке на 320px — 3 кнопки действия; sticky-панель — 3 канала + safe-area
[ ] на каждой indexable-странице ≥1 контактный CTA внутри <article>/<main>
[ ] LINE/Telegram: либо рабочие ссылки, либо кнопки не рендерятся (grep line.me dist → 0)
[ ] в консоли ровно один va('event', {name:'contact_click', data:{channel, placement}})
[ ] в Метрике за сутки фиксируются цели по 5 каналам
[ ] на главной: рейтинг, вычисленная дистанция, кнопка «что есть сегодня», FAQ про вейпы
[ ] JSON-LD: без Offer/Product/price, без aggregateRating; Organization + WebSite есть
[ ] robots.txt без /api/ и /studio/, с Clean-param, без Host
[ ] отчёт по уникальности печатается, compliance-линтер зелёный на production-ветке
[ ] docs/growth/CONVERSION-BASELINE.md создан и заполнен через неделю после деплоя
```

---

## 11. Волна 2 — исполнено: Яндекс, индексация, скорость

Все числа ниже — замеры на дереве этой стадии, а не оценки.

### 11.1 Яндекс: `public/robots.txt`

`Clean-param` расширен с 7 параметров до 20, разбит на три директивы (лимит
Яндекса — 500 символов на директиву, самая длинная сейчас 76). Добавлены метки,
которых не было и которые дописываются к нашей ссылке снаружи:

| Что добавлено | Кто дописывает |
|---|---|
| `ysclid`, `yclid`, `etext`, `_openstat`, `lr`, `from` | сам Яндекс — выдача, колдунщики, Директ |
| `utm_id` | GA4-разметка |
| `gbraid`, `wbraid`, `gad_source`, `srsltid` | Google Ads и Merchant |
| `msclkid`, `igshid` | Microsoft, Instagram |

`ysclid` — важнейший из них: Яндекс дописывает его к ссылке из собственной
выдачи, и без `Clean-param` каждая такая ссылка попадала в индекс отдельным URL.
Директива `Host` по-прежнему не добавляется — Яндекс от неё отказался.

Отдельно прописано явное разрешение для `OAI-SearchBot`, `PerplexityBot`,
`ClaudeBot`: правовой гид и гайды писались в формате «вопрос — проверяемый ответ
со ссылкой на первоисточник» под цитирование в ответах, и терять этот канал из-за
чужой правки в секции `*` не хочется.

**Региональность**: на стороне репозитория закрыто всё, что вообще можно закрыть
кодом — `geo.region=TH-20`, `geo.placename`, `geo.position`, `ICBM`, `PostalAddress`
в JSON-LD, подтверждение `yandex-verification` и метой, и файлом. Регион в
Яндекс.Вебмастере и карточка в Яндекс.Бизнесе кодом не задаются — это ownerTask.

### 11.2 IndexNow

`scripts/ping-indexnow.mjs` + `.github/workflows/indexnow.yml`.
**Google IndexNow не поддерживает** — это написано и в шапке скрипта, и в шапке
workflow, и печатается при каждом запуске. Ускорения индексации в Google от этого
не будет; работают Bing, Яндекс, Naver, Seznam, Yep.

- список URL читается из собранного `dist/sitemap-index.xml`, не хардкодится —
  замер: `--dry-run` печатает 96 URL, ровно столько же в сайтмапе;
- любая ошибка (недоступный эндпоинт, 4xx, таймаут, отсутствующий `dist/`) —
  предупреждение и **код возврата 0**: пинг не имеет права ронять деплой;
- в рабочее дерево не пишет ничего (`git status` после прогона чистый);
- в `npm run build` не входит; `main.yml` не тронут;
- workflow срабатывает на `deployment_status` **только** при
  `state == success` и `environment == Production`, плюс `workflow_dispatch`
  с опцией `dry_run`.

### 11.3 Сайтмап

- 96 indexable URL — совпадает с `EXPECTED_INDEXABLE_PAGE_COUNT`, чекер валит
  сборку при любом расхождении в обе стороны, так что «новая страница не попала
  в сайтмап» невозможно по построению;
- `lastmod` берётся из даты коммита (`git log -1 --format=%cs`), не из часов
  сборки;
- **детерминизм проверен**: две сборки подряд дают побайтово идентичный `dist`
  целиком, не только сайтмап (`diff -r` без единого расхождения; md5
  `sitemap-0.xml` совпадает).

### 11.4 Скорость

LCP-элемент на всех страницах — заголовок H1: в `dist` ноль JS и ноль `<img>`
(единственный `img` — пиксель Метрики). Значит LCP ≈ FCP и упирается в
render-blocking запросы. Их было два, стало один.

1. **Таблица стилей инлайнится** (`build.inlineStylesheets: "always"`).
   Замер `/en/`: было 9 698 B gzip HTML + 10 228 B gzip CSS двумя запросами,
   стало 19 874 B gzip одним. Байт столько же (−52 B), запросов на один меньше,
   и он не идёт вторым round-trip'ом после парсинга HTML. `dist/_astro/` пуст.
2. **Шрифтовой запрос разбит по локалям** (`src/lib/fonts.ts`). Был один и тот
   же URL на все 7 локалей, байт в байт, с 5 семействами. Замер при одинаковом
   User-Agent: общий запрос объявляет 15 `@font-face`, запрос для `en`/`ru` —
   4. Заодно починена обратная ошибка: тайского семейства в общем запросе не
   было вовсе, и `/th/` рисовался системным шрифтом. `Noto Sans Thai` добавлен
   и в запрос, и в `--font-sans`.
3. **Заголовки ответа** — в `vercel.json` появился ключ `headers`
   (`outputDirectory` и `trailingSlash` не тронуты): `immutable` на `/_astro/`
   и `/media/`, неделя на иконки и карточку превью, час на `robots.txt` и
   сайтмапы, плюс `X-Content-Type-Options`, `Referrer-Policy`,
   `X-Frame-Options`, `Permissions-Policy`, HSTS. CSP сознательно не добавлен:
   на страницах живут Google Maps в iframe, шрифты Google, Метрика и Vercel
   Analytics, и политику под них нельзя написать вслепую, не проверив на проде.

### 11.5 `og:image` в растре

`scripts/gen-og-image.mjs` (sharp, запуск только вручную, в `npm run build` не
входит) собирает `public/og-image.png` 1200×630 (54,7 КБ),
`public/logo-512.png` и `public/apple-touch-icon.png`.

- `og:image`/`twitter:image` на всех 218 страницах указывают на `.png`;
  вхождений `og-image.svg` в `dist` — 0. Добавлены `og:image:type`,
  `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image:alt`;
- `ImageObject#primaryimage` в JSON-LD переведён на тот же PNG;
- `Organization.logo` был `favicon.svg` — Google для `logo` принимает только
  .jpg/.png/.gif и просит сторону ≥112px, то есть узел был, а картинки для
  карточки знаний фактически не было. Теперь `logo-512.png`;
- `apple-touch-icon.svg` лежал в `public/` вообще без ссылки из разметки, и iOS
  всё равно не понимает SVG. Заменён на PNG 180×180 и подключён в `<head>`.

**Что на карточке**: имя карточки Google, имя сайта, город, домен, ценз 20+.
Чего на ней сознательно нет: снимков товара, цен, часов работы (`hoursVerified=false`)
и строки «Soi Hollywood» — обе последние стояли в старом SVG, то есть в каждую
пересланную ссылку уезжали неподтверждённые часы и адрес чужого магазина.

### 11.6 `public/media` — карантин, требует решения владельца

**Замер по всем 33 файлам (93 МБ):** это макро-снимки шишек, и часть отснята на
подложках с детскими мультперсонажами — Powerpuff Girls, диснеевские принцессы,
Rick and Morty, Пикачу. Реклама контролируемого вещества сама по себе, а товар на
детской подложке — отдельный и куда более тяжёлый состав. Ни одна страница на них
не ссылается (0 вхождений в `dist`), но файлы **деплоятся и доступны по прямым
URL** `/media/IMG_*.jpg`.

Сделано в репозитории, обратимо:

- `X-Robots-Tag: noindex` на `/media/(.*)` в `vercel.json` — именно заголовок, а
  не `Disallow` в `robots.txt`: закрытый от обхода файл не даёт прочитать
  `noindex` и всё равно может попасть в выдачу;
- новая проверка `checkQuarantinedMedia()` в `scripts/check-seo.mjs` роняет
  сборку, если хоть одна страница сошлётся на `/media/` (проверено: подсунутый
  `<img src="/media/IMG_0465.jpg">` валит чекер). Ни один другой линтер этого не
  ловит — в HTML не появляется ни цены, ни запрещённого слова.

**ownerTask (блокирующий):** решить судьбу каталога. Рекомендация — удалить из
`public/` целиком. Файлы останутся в истории git; исходного каталога
`stock-photo/`, из которого их собирали, в репозитории уже нет, поэтому это
единственная копия — удалять без ведома владельца нельзя.

Компонент `Figure.astro` из T-12.4 сознательно **не** добавлен. Линтер репозитория
запрещает компоненты без единого импорта, и запрещает по делу: заготовленный
рендерер картинок в репозитории, где все картинки — товар на детских подложках,
это не разряженная мина, а заряженная. Вместо него сделано то, что не создаёт
риска и переживёт стадию:

- `scripts/transcode-media.mjs` теперь делает варианты по ширинам
  480/800/1200/1600 рядом с оригиналом (`<base>-800.avif` и т.д.), не трогая
  существующие файлы. Проверено на копии `IMG_0465.jpg`: 800px AVIF — 118 КБ
  против 775 КБ у оригинала. Каталоги переопределяются через
  `MEDIA_SOURCE_DIR`/`MEDIA_OUTPUT_DIR`, поэтому конвейер можно прогнать, не
  трогая рабочий `public/media`;
- когда появятся снимки фасада, вывески и лицензии (O-15), их место —
  **новый** каталог `public/photos/`, а не карантинный `public/media`.
