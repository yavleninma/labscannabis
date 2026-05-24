# Site #02 — Hero Rewrite: «Pattaya 24/7 Cannabis Delivery»

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context. И **сначала закрой** [`01-i18n-fulfillment-fix.md`](01-i18n-fulfillment-fix.md), чтобы не было конфликта по словарям.

## TL;DR

Текущий hero продаёт «free sample / try before you buy» — это walk-in оффер. Новая стратегия делает главным оффером **24/7 delivery to your hotel**. Hero нужно переписать так, чтобы в первые 3 секунды посетитель понял: «эти ребята привезут травы куда угодно в Паттайе, в любое время». При этом «free sample / try before you buy» остаётся как secondary trust-блок ниже (не убираем).

## Текущее состояние (для понимания)

Файл компонента: [`src/components/Hero.tsx`](../../../src/components/Hero.tsx)

Использует ключи из namespace `hero` (см. `messages/en.json:25-37`):

- `hero.title` — «Cannabis shop in Pattaya»
- `hero.subtitle` — «Fresh buds & pre-rolls — 5 min from Walking Street. Walk in, we'll help you pick.»
- `hero.sampleBadge`, `hero.sampleTitle`, `hero.sampleText`, `hero.sampleFresh`, `hero.samplePressure`, `hero.sampleTrust` — «free sample» блок
- `hero.getDirections`, `hero.messageUs` — кнопки

CTA сейчас: `Get Directions` (ведёт на Google Maps) + `Message Us` (через `buildContactLinks(..., kind: "general")`).

## Новый дизайн hero (что должно получиться)

```
┌────────────────────────────────────────────────────────┐
│  H1: Pattaya 24/7 cannabis delivery                    │
│  Sub: To your hotel in ~30 min. Fresh buds, honest     │
│       prices, walk-in welcome 5 min from Walking St.   │
│                                                        │
│  [ 🛵 Order delivery on WhatsApp ]  [ 🗺 Open in Maps ]│
│                                                        │
│  ┌─ 🟢 Open now · 24/7 · Pattaya & Jomtien ─────────┐ │
│  │  • Avg delivery time: ~30 min                     │ │
│  │  • Cash or QR on arrival                          │ │
│  │  • Discreet packaging                             │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─ "Try before you buy" trust card (secondary) ────┐ │
│  │  Free in-store sample · Medical card in 2 min     │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

Иерархия:

1. **H1 + sub** — про 24/7 delivery (главный оффер)
2. **Primary CTA** — `Order delivery on WhatsApp` (использовать `buildContactLinks(..., kind: "delivery")` из [`src/lib/contact-links.ts`](../../../src/lib/contact-links.ts) — он уже умеет prefilled message)
3. **Secondary CTA** — `Open in Maps`
4. **Live status strip** — «Open now / 24/7 / Pattaya & Jomtien», использует `shopSettings.isOpen24h` и `openTime/closeTime`
5. **Trust card «try before you buy»** — оставить, но **визуально менее доминирующий**, чем сейчас. Это уже не главное обещание, а trust-якорь.

## Структурные правки кода

В файле [`src/components/Hero.tsx`](../../../src/components/Hero.tsx):

1. **Заменить `kind: "general"` на `kind: "delivery"`** при вызове `buildContactLinks` — чтобы primary CTA сразу шёл с prefilled delivery-сообщением.

```ts
const { reserve } = buildContactLinks(shopSettings, locale as ContactLocale, {
  kind: "delivery",
});
```

2. **Поменять порядок и стилистику CTA**: первая кнопка — WhatsApp delivery (primary green), вторая — Maps (secondary outline).

3. **Добавить live status strip** между подзаголовком и trust card. Использовать `shopSettings.isOpen24h`, `openTime`, `closeTime`. Можно вынести в отдельный subcomponent `<HeroStatusStrip />` в этом же файле или в `src/components/HeroStatusStrip.tsx`.

4. **Trust card «free sample»** — сделать менее заметным: убрать gradient, оставить border, уменьшить padding на ~30%, убрать SVG-иконку справа. Текст тот же, ключи те же — это just visual demotion.

## Текстовые правки в словарях

**Не удаляй существующие ключи** `hero.sample*` — они нужны для secondary trust card.

### EN — обновить в [`messages/en.json`](../../../messages/en.json), namespace `hero`

```json
"hero": {
  "title": "Pattaya 24/7 cannabis delivery",
  "subtitle": "To your hotel in about 30 minutes. Fresh buds, honest prices — and you can still walk in, 5 minutes from Walking Street.",
  "deliveryCta": "Order delivery on WhatsApp",
  "directionsCta": "Open in Google Maps",
  "statusOpenNow": "Open now",
  "status24_7": "24/7 · Pattaya & Jomtien",
  "statusEta": "Average delivery: ~30 min",
  "statusPayment": "Cash or QR on arrival",
  "statusDiscreet": "Discreet packaging",
  "getDirections": "Get Directions",
  "messageUs": "Message Us",
  "seeMenu": "What's in Stock",
  "sampleBadge": "Free sample in store",
  "sampleTitle": "Try before you buy",
  "sampleText": "Walk in, check freshness and quality first. If you like it, then buy.",
  "sampleFresh": "Fresh shelf",
  "samplePressure": "Try first",
  "sampleTrust": "Quality first"
}
```

### RU — обновить в [`messages/ru.json`](../../../messages/ru.json), namespace `hero`

```json
"hero": {
  "title": "Доставка каннабиса 24/7 по Паттайе",
  "subtitle": "К отелю примерно за 30 минут. Свежие шишки, честные цены — и можно зайти лично, 5 минут от Walking Street.",
  "deliveryCta": "Заказать доставку в WhatsApp",
  "directionsCta": "Открыть в Google Maps",
  "statusOpenNow": "Сейчас открыто",
  "status24_7": "24/7 · Паттайя и Джомтьен",
  "statusEta": "Среднее время доставки: ~30 минут",
  "statusPayment": "Наличные или QR при получении",
  "statusDiscreet": "Аккуратная упаковка",
  "getDirections": "Как добраться",
  "messageUs": "Написать нам",
  "seeMenu": "Смотреть ассортимент",
  "sampleBadge": "Бесплатный пробник",
  "sampleTitle": "Сначала попробуйте, потом решайте",
  "sampleText": "Зайди, бесплатно оцени качество и свежесть. Если всё устраивает, тогда покупаешь.",
  "sampleFresh": "Свежий продукт",
  "samplePressure": "Можно попробовать",
  "sampleTrust": "Сначала проверьте качество"
}
```

### TH — обновить в [`messages/th.json`](../../../messages/th.json), namespace `hero`

```json
"hero": {
  "title": "ส่งกัญชาถึงโรงแรมในพัทยา 24/7",
  "subtitle": "ส่งถึงโรงแรมประมาณ 30 นาที ดอกสด ราคาตรงไปตรงมา และยังเดินเข้ามาที่ร้านได้ ห่างจาก Walking Street 5 นาที",
  "deliveryCta": "สั่งจัดส่งทาง WhatsApp",
  "directionsCta": "เปิดใน Google Maps",
  "statusOpenNow": "เปิดอยู่",
  "status24_7": "24/7 · พัทยาและจอมเทียน",
  "statusEta": "เวลาจัดส่งโดยเฉลี่ย ~30 นาที",
  "statusPayment": "เงินสดหรือ QR ตอนรับของ",
  "statusDiscreet": "บรรจุอย่างมิดชิด",
  "getDirections": "เส้นทาง",
  "messageUs": "ส่งข้อความ",
  "seeMenu": "มีอะไรบ้าง",
  "sampleBadge": "ลองฟรีที่ร้าน",
  "sampleTitle": "ลองก่อน แล้วค่อยตัดสินใจ",
  "sampleText": "แวะมาดูความสดและคุณภาพได้ฟรีก่อน ถ้าถูกใจค่อยเลือกซื้อ",
  "sampleFresh": "ของสดใหม่",
  "samplePressure": "ลองก่อนได้",
  "sampleTrust": "ดูคุณภาพก่อน"
}
```

## Обновление meta / OG

Файл [`messages/en.json`](../../../messages/en.json) namespace `meta`:

```json
"meta": {
  "title": "Labs Cannabis — 24/7 Cannabis Delivery in Pattaya | Walk In or Order to Hotel",
  "description": "24/7 cannabis delivery in Pattaya & Jomtien — to your hotel in ~30 min. Fresh buds, walk-in welcome 5 min from Walking Street. Free in-store sample, medical card in 2 min.",
  "ogTitle": "24/7 Cannabis Delivery in Pattaya — Labs Cannabis",
  "ogDescription": "To your hotel in about 30 minutes. Fresh buds, honest prices, open 24/7. Walk in or WhatsApp.",
  "keywords": [
    "cannabis delivery pattaya",
    "weed delivery pattaya",
    "24/7 cannabis pattaya",
    "weed delivery jomtien",
    "cannabis to hotel pattaya",
    "dispensary pattaya"
  ]
}
```

Сделай аналогичное обновление для `ru` и `th` (тексты — переведи в том же tone, дам пример для RU):

```json
"meta": {
  "title": "Labs Cannabis — Доставка каннабиса 24/7 в Паттайе | Walk-in и в отель",
  "description": "Доставка каннабиса 24/7 в Паттайе и Джомтьене — к отелю за 30 минут. Свежие шишки, можно зайти в магазин в 5 минутах от Walking Street. Бесплатный пробник, медкарта за 2 минуты.",
  "ogTitle": "Доставка каннабиса 24/7 в Паттайе — Labs Cannabis",
  "ogDescription": "К отелю примерно за 30 минут. Свежие шишки, честные цены, работаем 24/7. Заходи лично или пиши в WhatsApp.",
  "keywords": [
    "доставка каннабиса паттайя",
    "доставка травы паттайя",
    "каннабис паттайя 24/7",
    "доставка травы джомтьен",
    "каннабис в отель паттайя",
    "диспансери паттайя"
  ]
}
```

## Acceptance criteria

- [ ] H1 на главной — про 24/7 delivery, не про free sample.
- [ ] Primary CTA — WhatsApp delivery (открывает чат с prefilled delivery-сообщением).
- [ ] Secondary CTA — Google Maps.
- [ ] Live status strip отображает: «Open now / 24/7 / Pattaya & Jomtien» + 3 строки (ETA / payment / discreet).
- [ ] «Free sample» trust card остался, но визуально demoted (меньше padding, без gradient/SVG).
- [ ] Все три словаря обновлены, все ключи присутствуют.
- [ ] meta.title / meta.description / og.* обновлены под новый оффер.
- [ ] Структурированные данные (LocalBusiness JSON-LD, если есть) **продолжают валидироваться** — сверь через [Schema Markup Validator](https://validator.schema.org/).
- [ ] Mobile (375px wide) layout не ломается: CTA-кнопки переносятся, status strip читается.
- [ ] Lighthouse Performance не упал больше чем на 3 пункта.

## Definition of Done

- Коммит вида `feat(hero): rewrite for 24/7 delivery hero offer`.
- Скриншоты до/после на mobile + desktop в PR.
- Видео или GIF с кликом на primary CTA → открывается WhatsApp с prefilled.

## Out of scope

- Не трогать `StrainCatalog`, `StaffPick`, `NoPrescription`, `FAQ` — это отдельные секции.
- Не править структурную разметку JSON-LD сильно — только meta-теги.
- Не убирать `Get Directions` совсем — он становится secondary, но остаётся.
- Не добавлять delivery zone map / pricing — для simplicity клиент пишет в WhatsApp и узнаёт там.
