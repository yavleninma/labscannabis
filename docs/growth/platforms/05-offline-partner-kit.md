# Platforms #05 — Offline Partner Kit (Tuk-Tuk / Hostel / Tattoo / Bar / Spa)

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

Паттайя — город, где **most cannabis decisions делаются на улице, не в Google**. Турист спрашивает у tuk-tuk driver'а, у бармена, у tattoo артиста, у concierge отеля — «yo, where can I get weed?». Каждый из них **уже посылает куда-то** — обычно к другу. Мы — это «куда-то».

Стратегия — **дать каждому из этих people простую, понятную систему**:
1. карточку с QR
2. понятную mini-комиссию (200 baht/лида или 5%)
3. отдельный UTM tag для tracking

Цель: 15–25 активных партнёров через 60 дней.

## Партнёрские сегменты

### Сегмент A: Tuk-tuk / Bolt drivers (Walking Street area)

- **Кто:** 30–50 водителей tuk-tuk и Bolt вокруг Walking Street ночью
- **Боль:** хотят дополнительный income, ничего не делают для него
- **Оффер:** 200 baht за подтверждённую доставку клиента (walk-in или delivery)
- **Карточка:** A6, на одной стороне QR на WhatsApp с UTM `?utm_source=partner-tuktuk&utm_campaign=tuktuk-{driver-name}`, на другой — короткий pitch на EN/RU/TH «Real Pattaya cannabis. Free sample. 5 min from here.»
- **Распределение:** Dima идёт лично, объясняет 30 секунд, оставляет 20 карточек
- **Tracking:** уникальный UTM per driver или batch (5 драйверов в одной локации = одна batch)

### Сегмент B: Hostels (18–25 EN tourists)

- **Кто:** 15–20 backpacker-hostels в Pattaya/Jomtien
- **Боль:** receptionist часто получает «yo where weed» вопрос, отвечает наугад
- **Оффер:** 5% от чека первого визита через них (~50–200 baht/клиента)
- **Карточка:** A5 menu-style — фото shop, top 3 strains, prices range, QR на WhatsApp
- **Доп. кит:** A4 poster для board объявлений в lobby
- **Tracking:** UTM `?utm_source=partner-hostel&utm_campaign=hostel-{name}`

### Сегмент C: Tattoo studios (5–10 шт. рядом с Walking Street)

- **Кто:** локальные tattoo артисты — обычно сами курят, охотно рекомендуют
- **Боль:** клиенты часто просят weed для расслабления перед сеансом
- **Оффер:** 200 baht/лида + дружеская скидка артисту лично
- **Карточка:** thick A6 card в стиле «studio approved» — premium feel
- **Tracking:** UTM `?utm_source=partner-tattoo&utm_campaign=tattoo-{name}`

### Сегмент D: Bars / sky bars (Pratumnak / Jomtien)

- **Кто:** 10–15 bars где зависают expat и tourist crowd
- **Боль:** customers просят smoke recommendations, бармен не хочет светиться
- **Оффер:** 200 baht/лида (через QR карточку, не через слова)
- **Карточка:** sticker A6 в туалете (low-key) — «discreet 24/7 cannabis delivery, scan»
- **Tracking:** UTM `?utm_source=partner-bar&utm_campaign=bar-{name}`

### Сегмент E: Massage / spa (premium overlap)

- **Кто:** 5–10 massage shops с RU/EN clientele (не «happy ending» — premium spa)
- **Боль:** клиенты иногда спрашивают relaxation aids
- **Оффер:** 5% или fixed 300 baht/лида
- **Карточка:** elegant A5 с soft tone, без эмодзи
- **Tracking:** UTM `?utm_source=partner-spa&utm_campaign=spa-{name}`

### Сегмент F: Hotel concierge (mid-range)

- **Кто:** 5–10 mid-range hotels (не chains — chains не разрешат)
- **Боль:** concierge получает запрос, не хочет нести ответственность
- **Оффер:** 5% от чека или 500 baht на крупный заказ
- **Карточка:** A4 menu в info-folder в номере (если разрешат)
- **Tracking:** UTM `?utm_source=partner-hotel&utm_campaign=hotel-{name}`

## Дизайн карточек

**Бренд:** Labs Cannabis logo + emerald/cream palette (соответствует сайту).

**Layout (A6, обе стороны):**

Front:
```
[Labs Cannabis logo]
24/7 cannabis delivery
Pattaya & Jomtien
~30 min to your hotel

[QR code — large, центр]
WhatsApp us
```

Back:
```
3 reasons to come to Labs:

✓ Free sample at the shop
✓ Honest prices, fresh stock
✓ 5 min from Walking Street

EN · RU · TH
labscannabis.boutique
```

**Печать:**
- Местная типография в Паттайе (~3–5 baht/карточка at 500+ qty)
- Картон 350 g/m², matte coating
- Print run: 1000 на старт, 500 в месяц после

## Кит-сборник для партнёра

Каждый партнёр получает:

1. **Talking script** на одной стороне A4 (что говорить туристу) — на 3 языках
2. **20 карточек** для distribution
3. **Уникальный UTM** в коде на карточке (можно через QR — short link `https://lc.bz/{partner-id}` редиректит с UTM)
4. **WhatsApp Dima** — direct line для вопросов
5. **Monthly payout** — наличными или QR-transfer, на основе подтверждённых лидов

## Recruiting playbook

### Week 1–2 (Dima лично)

- Walking Street loop: 2 вечера × 3 часа = 30+ tuk-tuk drivers
- 5 ближайших hostels = personal pitch с manager
- 5 tattoo studios = personal pitch с owner

### Week 3–4 (continue)

- 5 mid-range hotels, начать с тех, где Dima уже знает кого-то
- 5 bars/sky bars в Jomtien/Pratumnak
- Follow-up по первым партнёрам — какие лиды пошли

### Week 5+ (scale)

- Если работает — масштабировать на 10–15 новых tuk-tuk drivers/нед.
- Если конкретный сегмент не даёт лидов 30 дней — паузим, переключаем на работающие.

## Tracking + payment

**Spreadsheet (Google Sheets):**

| Partner ID | Name | Type | UTM campaign | Cards given | Date pitched | Leads | Confirmed conv | Owed |
|---|---|---|---|---|---|---|---|---|
| TT001 | Khun Niran | tuk-tuk | tuktuk-niran | 20 | 2026-05-15 | 4 | 3 | 600฿ |
| HOS01 | Mad Monkey | hostel | hostel-mad-monkey | 50 | 2026-05-16 | 8 | 5 | 250฿ |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Confirmation:**
- Лид считается «confirmed» если:
  - WhatsApp message с tag `[ref: partner-tuktuk/tuktuk-niran]` (см. UTM tracking план `site/06`)
  - И превратился в actual purchase ≥ 500 baht

**Payment:**
- Раз в месяц, личная встреча (Dima возит наличку или QR transfer)
- Show partner spreadsheet с конкретными лидами (transparency = retention)

## Acceptance criteria

- [ ] 1000 карточек напечатаны (стартовый batch)
- [ ] 4 segment-specific варианта оформления готовы (tuk-tuk / hostel / tattoo / bar)
- [ ] 30+ партнёров pitched в первые 30 дней (any segment)
- [ ] 15+ партнёров активно distributing (cards в circulation)
- [ ] Spreadsheet tracking запущен
- [ ] First payouts сделаны в конце 30-го дня

## Definition of Done

- Через 60 дней:
  - 25+ активных партнёров
  - 50+ partner-attributed conversions (через UTM tags)
  - Repeat-rate из этих лидов ≥ 20% (мерим через WhatsApp number tagging)
  - Total partner payouts < 30% от revenue от этих лидов (unit economics OK)

## Out of scope

- Не делать formal MLM-style affiliate сайт.
- Не интегрировать payments через Stripe/PayPal — наличные / QR транзакции работают.
- Не идти к major hotel chains (Marriott, Hilton corporate) — они не разрешат.
- Не давать партнёрам прямой доступ к stock/inventory — все запросы идут через Dima.
- Не делать partner-app — spreadsheet + WhatsApp достаточно на этом этапе.
