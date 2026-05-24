# Ops #02 — Budget Allocation & Weekly Metrics Dashboard

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

Бюджет: **$300–800/мес**. План — начать с $300, поднять до $800 после 30 дней если метрики идут вверх. Метрики — **простые, в одном Google Sheet**, без сложной аналитики. Раз в неделю Dima тратит 30 минут на review.

## Месячная разбивка бюджета

### Conservative ($300/мес — стартовый)

| Категория | Сумма | Заметки |
|---|---|---|
| RU-копирайтер part-time | $200 | См. `ops/01-freelance-copywriter-brief.md` |
| Telegram Ads | $50 | Только Satellite A для cold growth |
| Print карточек | $30 | 500 шт/мес |
| Partner kickbacks | $20 | Реальный resource, ~10 conversions @ 200 ฿ |
| **Total** | **$300** | |

### Standard ($500/мес — после 30 дней если работает)

| Категория | Сумма | Заметки |
|---|---|---|
| RU-копирайтер | $300 | Бонус за метрики |
| Telegram Ads | $100 | Main + Satellite A |
| Reddit Promoted | $50 | 1 пост/мес «Pattaya Travel Tips» |
| Print + materials | $30 | 800 карточек/мес |
| Partner kickbacks | $20 | |
| **Total** | **$500** | |

### Aggressive ($800/мес — если 60-day метрики сильные)

| Категория | Сумма | Заметки |
|---|---|---|
| RU-копирайтер | $400 | Full bonus, possibly extra hours |
| Telegram Ads | $200 | All three channels + бот промо |
| Reddit Promoted | $100 | 2 posts/мес |
| Influencer barter+cash | $50 | 1–2 micro RU-блогера |
| Print + materials | $30 | |
| Partner kickbacks | $20 | |
| **Total** | **$800** | |

## Метрики (что мерим weekly)

### A. Acquisition (откуда трафик)

| Метрика | Источник | Цель 30 дней | Цель 60 дней | Цель 90 дней |
|---|---|---|---|---|
| Site organic traffic | Plausible | +30% MoM | +50% | +100% |
| GBP profile views | GBP Insights | 5,000/мес | 8,000 | 12,000 |
| GBP direction requests | GBP Insights | 200/мес | 400 | 700 |
| GBP website clicks | Plausible (utm=gbp) | 100/мес | 200 | 400 |
| TikTok aggregate views (RU + EN) | TikTok Analytics | 50,000/мес | 200,000 | 500,000 |
| TikTok bio-link clicks | linktree analytics | 100/мес | 400 | 1,000 |
| Telegram main subscribers | Telegram | 200 | 500 | 1,000 |
| Telegram Satellite A subs | Telegram | 150 | 350 | 700 |
| Telegram Satellite B subs | Telegram | 80 | 200 | 400 |
| Telegram bot users | Bot analytics | 100 | 300 | 700 |
| Reddit account karma | Reddit | 150 | 400 | 800 |
| Quora answer views (sum) | Quora analytics | 5,000 | 20,000 | 50,000 |

### B. Conversion (что превращается в деньги)

| Метрика | Источник | Цель 30 дней | Цель 60 дней | Цель 90 дней |
|---|---|---|---|---|
| WhatsApp inbound (total) | Manual count + tags | 150/мес | 300 | 500 |
| WhatsApp by source `[ref: tiktok]` | Manual count | 5 | 30 | 80 |
| WhatsApp by source `[ref: telegram*]` | Manual count | 10 | 40 | 100 |
| WhatsApp by source `[ref: reddit*]` | Manual count | 3 | 10 | 25 |
| WhatsApp by source `[ref: gbp*]` | Manual count | 30 | 60 | 100 |
| WhatsApp by source `[ref: partner-*]` | Manual count | 20 | 50 | 100 |
| WhatsApp by source `[ref: quora]` | Manual count | 2 | 8 | 20 |
| WhatsApp organic / no tag | Manual count | balance | balance | balance |
| Walk-in count | POS / manual tally | track | track | track |
| Delivery orders count | Manual tally | 50/мес | 150 | 300 |

### C. Quality / Economics

| Метрика | Источник | Цель |
|---|---|---|
| Average order size (g) | Manual avg | ≥ 3.5g (стабильно расти) |
| Average ticket (THB) | Manual avg | ≥ 1,500 THB |
| Repeat rate (within 30 days) | WhatsApp number tagging | ≥ 30% |
| Reviews count Google | GBP | +30/90 дней |
| Average Google rating | GBP | ≥ 4.8 (не падать) |
| Cost per conversion (CAC) | Spend / conversions | Compute monthly |
| LTV / CAC ratio | (avg ticket × repeat factor) / CAC | ≥ 4× target |

## Spreadsheet структура

**Sheet 1: «Weekly Snapshot»**

| Week start | Site visits | GBP views | TT views | TG subs main | TG subs A | TG subs B | WhatsApp total | WA tt | WA tg | WA reddit | WA gbp | WA partner | Walk-in | Delivery | Avg ticket |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-05-12 | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Sheet 2: «WhatsApp Inbound Log»**

Каждая строка = один inbound. Колонки:

| Date | Source tag | Customer phone | Strain interest | First-time / repeat | Converted? | Order ฿ | Notes |

**Sheet 3: «Partners»**

Из плана `platforms/05-offline-partner-kit.md` — таблица партнёров с лидами.

**Sheet 4: «Content calendar»**

Все posts с datetime, format, status, метрики после 7 дней.

## Weekly review (Dima, 30 минут, пятница)

1. Заполнить Sheet 1 (5 мин)
2. Просмотреть WhatsApp inbound с тегами (10 мин), залить в Sheet 2
3. Посмотреть TikTok analytics — какие видео в FYP, какие умерли (5 мин)
4. Глянуть Telegram engagement — какие посты open-rate высокий (5 мин)
5. Решить «что усиливаем / что режем» на следующую неделю (5 мин)

## Триггеры для re-allocation

- **Если канал X дал 0 conversions за 30 дней** → пауза, перевести бюджет в работающий канал
- **Если канал X имеет CAC < $5** → удвоить бюджет на следующий месяц
- **Если site organic traffic растёт > 50% MoM** → масштабировать programmatic SEO (больше hotels, больше strains, больше gauides)
- **Если TikTok видео даёт 100k+ views** → пересмотреть формат, делать больше похожего
- **Если Telegram Satellite A не растёт +50/нед** → переписать pinned, пересмотреть topic mix

## 90-дневная цель (definition of «working»)

- $1,500+ Add-on revenue/мес от non-walk-in каналов (delivery + new repeat customers from social)
- 1,000+ subscribers суммарно по всем Telegram-каналам
- 30+ новых Google reviews
- TikTok aggregate 500k views/мес
- WhatsApp inbound 500/мес total

Если **не достигаем 50% этих целей** через 60 дней — пауза, retrospective, redesign стратегии.

## Acceptance criteria

- [ ] Spreadsheet template создан и shared с Dima
- [ ] Plausible/Umami running (см. `site/06-utm-source-tracking.md`)
- [ ] Calendar reminder weekly review запланирован
- [ ] Бюджет распределён на месяц вперёд (одобрен Dima)

## Definition of Done

- 4 недели подряд weekly review занят и спредшит заполняется
- Через 30 дней — first re-allocation решение принято на основе данных
- Через 60 дней — второе re-allocation, бюджет повышен/опущен на основе метрик

## Out of scope

- Не делать сложную BI-инфраструктуру (Looker, etc.)
- Не нанимать аналитика — Dima + Sheet достаточно на этом этапе
- Не интегрировать CRM — WhatsApp + Sheet работает до 1000 customers
- Не делать marketing-mix-modelling — слишком рано, недостаточно данных
