# Platforms #03 — Telegram Stack: Main Channel + 2 Satellites + Concierge Bot

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

Telegram = **самый высокий LTV канал** для нас. RU-зимовщики Паттайи живут в Telegram. Они делают повторные заказы 5–10 г, читают каналы про Тай ежедневно, легко кликают на t.me-ссылки.

Стратегия — **3 канала + 1 бот**:

1. **Main:** «Labs Cannabis Pattaya» — главный, ежедневный stock + drops
2. **Satellite A:** «Cannabis в Тае: гайд туриста» — FAQ-формат, ловит холодную аудиторию
3. **Satellite B:** «Strain of the Week» — обзоры стрейнов, для нерегулярных но любопытных
4. **Bot:** @labscannabis_bot — показывает текущий stock, цену, redirect в Dima

Все три канала ссылаются на сайт и друг на друга. Бот — отдельный flow, link с сайта и из bio каналов.

## Main Channel: «Labs Cannabis Pattaya»

### Позиционирование

Не маркетинговый канал, а **«сосед, который держит шоп»**. Tone: тёплый, чуть личный, без агрессивных продажных постов. Дима — лицо канала.

### Контент-pillar'ы (ежедневный mix)

- **Stock update** (3–4 раза в неделю) — фото + список 5–10 свежих позиций + цены/г + emoji effect tags
- **Vibe / lifestyle** (1–2 в неделю) — закат, beach, Walking Street ночью → сабтекст «не забудь забрать на вечер»
- **Drop / restock alert** (1 в неделю когда applicable) — «привезли Wedding Cake, 1 кг, разлетится»
- **Educational micro-post** (1 в неделю) — terpenes, strain difference, legality answer
- **UGC re-post** (когда есть) — клиент написал review → пост с разрешения

### Шаблон stock update

```
🌿 Сегодня на полке (24/7 доставка по Паттайе и Джомтьену)

Hybrid:
🍰 Wedding Cake — 24% THC — 550 ฿/г (вечер, релакс)
🍇 GMO — 27% THC — 600 ฿/г (мощный, для опытных)

Sativa:
☀️ Sour Diesel — 22% THC — 500 ฿/г (день, фокус)
🍋 Lemon Haze — 21% THC — 480 ฿/г (creative)

Indica:
🌙 Northern Lights — 18% THC — 400 ฿/г (сон, тяжёлый body)

Пишите в WhatsApp — привезём за 30 минут (24/7).
👉 t.me/labscannabis_bot
```

### Posting rhythm

- 1 пост в день. Не больше, чтобы не отписывались.
- Best time для RU аудитории в Тае: 17:00–20:00 Bangkok time (вечерний скролл).
- Stories: ежедневные (короткие, vibe).

### Bio + pinned post

**Bio:**

```
Pattaya · доставка 24/7 · WhatsApp в шапке
```

**Pinned post:** короткий «о канале» + ссылка на сайт + бот + WhatsApp. UTM: `utm_source=telegram&utm_campaign=tg-main`.

## Satellite A: «Cannabis в Тае: гайд туриста»

### Цель

Ловить **холодный трафик** — людей, которые ещё не знают про Labs, но ищут «как купить траву в Таиланде». Канал — образовательный, не продажный. Ссылки на Labs — soft, как на «один из проверенных вариантов».

### Контент-pillar'ы

- **FAQ-посты** (2 раза в неделю) — один вопрос = один пост 200–400 слов
- **Лайфхаки** (1 в неделю) — «как не нарваться на туристическую разводку», «что делать если заказал и не привезли», «как перевозить между городами Тая»
- **News / law update** (раз в 2 недели) — новости по cannabis-законам Тая, пересказ простым языком
- **Soft mentions** Labs (раз в 1–2 недели в формате «один из вариантов в Паттайе с лицензией и доставкой 24/7»)

### Cross-promotion

- Pinned: «Если в Паттайе и нужен честный шоп — Labs Cannabis (24/7 доставка)»
- В каждом 5-м посте — soft link

## Satellite B: «Strain of the Week»

### Цель

Канал для **продуктовых nerds** — тех, кто разбирается в стрейнах и terpenes. Меньше аудитория, но высокий conversion.

### Контент-pillar'ы

- **1 strain в неделю** — глубокий разбор: происхождение, terpene profile, эффект, для чего, с чем сочетать
- **Sometimes — comparison** — «Wedding Cake vs Birthday Cake», «лучшие сативы для focus»
- **Reader Q&A** — раз в 2 недели

### Tone

Spotify Discover Weekly vibe — каноничный, экспертный, чуть geeky.

## Bot: @labscannabis_bot

### Функциональность (MVP)

- `/start` → приветствие + меню (выбрать язык EN/RU/TH)
- `/stock` → показывает текущий ассортимент (тянет с `https://labscannabis.boutique/api/...` или прямо из Sanity)
- `/contact` → кнопки WhatsApp / Telegram Dima / Maps
- `/delivery` → площадь доставки + ETA + кнопка WhatsApp
- `/about` → короткое info + ссылка на сайт

### Технология

Использовать существующий `/api/chat` pipeline (см. `src/app/api/chat/route.ts`) как **бэкенд** для бота. Сам Telegram-бот — отдельный node.js worker (например, на Vercel Edge Function или standalone), который:

1. Принимает Telegram update
2. Проксирует в `/api/chat` с current-stock context
3. Возвращает ответ + inline-кнопки с UTM-tagged ссылками

### Tracking

Каждая кнопка в боте — с UTM:

- WhatsApp: `?utm_source=telegram&utm_medium=messenger&utm_campaign=bot-stock`
- Сайт: `?utm_source=telegram&utm_medium=messenger&utm_campaign=bot-website`

## Вырастить аудиторию

### Channel growth (от 0 до 1000)

- **Cross-mention** между тремя каналами в pinned posts
- **Telegram Ads** — $100–200/мес на канал «Cannabis в Тае» (Satellite A) — это самый легко-conversion канал в Ads. Targeting: канал-конкуренты, чаты Паттайи, RU-турист каналы.
- **Manual seeding:** Dima вступает в 30–50 RU-чатов Паттайи (зимовщики, expat-чаты, Pattaya-info чаты) и **участвует не как реклама** — отвечает на вопросы про cannabis legality, упоминает свой канал когда уместно. Не спам, contribution-first.
- **Outreach к RU-блогерам про Тай** — 5 micro-influencers за месяц, бартер «трава за упоминание канала».
- **Сайт:** добавить footer-ссылки на каналы в `src/components/Footer.tsx`.

### Telegram Ads targeting (когда есть бюджет)

- Каналы для targeting (примеры — найди через TGStat):
  - «Паттайя ру», «Паттайя инсайдер», «Тай для своих»
  - «Зимовка в Тае», «Паттайя чат»
  - «Каннабис Тай», «Weed Thailand»
- Budget split: 50% Satellite A (cold), 30% Main (warm), 20% Bot direct.
- A/B test 2–3 креатива каждые 2 недели.

## Acceptance criteria

- [ ] Все три канала созданы, bio + pinned заполнен, UTM включён в ссылках.
- [ ] Бот @labscannabis_bot работает — `/stock` возвращает актуальный ассортимент.
- [ ] Cross-mention между каналами в pinned.
- [ ] Footer сайта содержит ссылки на каналы.
- [ ] Schedule контента на 30 дней утверждён (Notion / spreadsheet).
- [ ] Telegram Ads настроен (если бюджет одобрен).

## Definition of Done

- Через 30 дней:
  - Main: 200+ subscribers
  - Satellite A: 150+ subscribers
  - Satellite B: 80+ subscribers
  - Bot: 100+ users
- WhatsApp inbound с tag `[ref: telegram]` или `[ref: bot-*]` ≥ 15 в месяц.

## Out of scope

- Не делать платное Telegram членство (premium subscriber tiers) — рано.
- Не интегрировать payment in bot — продолжаем checkout через WhatsApp с человеком.
- Не делать Discord/Matrix аналог — фокус на одной messaging-платформе.
- Не делать Telegram channel на тайском — TH аудитория не наш фокус.
