# Site #01 — Fix Missing i18n Keys in Fulfillment Block

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

На проде `labscannabis.boutique` в блоке fulfillment видны сырые ключи (`fulfillment.title`, `fulfillment.walkin.title` и т.д.) вместо переводов. Причина: namespace `fulfillment` полностью отсутствует во всех трёх словарях `messages/*.json`. Нужно добавить полный набор ключей на трёх языках, не сломав существующих переводов и не меняя структуру компонента.

## Доказательство бага

[`src/components/FulfillmentOptions.tsx`](../../../src/components/FulfillmentOptions.tsx) использует:

```24:24:src/components/FulfillmentOptions.tsx
  const t = await getTranslations({ locale, namespace: "fulfillment" });
```

И обращается к ключам:

- `t("title")`
- `t("subtitle")`
- `t("walkin.title")`, `t("walkin.desc")`, `t("walkin.point1")`, `t("walkin.point2")`, `t("walkin.point3")`, `t("walkin.cta")`
- `t("pickup.title")`, `t("pickup.desc")`, `t("pickup.point1")`, `t("pickup.point2")`, `t("pickup.point3")`, `t("pickup.cta")`
- `t("delivery.title")`, `t("delivery.desc")`, `t("delivery.point1")`, `t("delivery.point2")`, `t("delivery.point3")`, `t("delivery.cta")`

В файлах `messages/en.json`, `messages/ru.json`, `messages/th.json` namespace `fulfillment` **отсутствует целиком** (`grep -n '"fulfillment"' messages/*.json` вернёт пусто). `next-intl` рендерит fallback в виде самого ключа.

## Цель

Все три словаря содержат полный namespace `fulfillment` с переводами, согласованными по тону и со стратегией **24/7 delivery как главного оффера**. На проде блок отображается без сырых ключей.

## Обновлённый бренд-tone для этого блока

Старый tone (если бы был): «we offer pickup and delivery».
**Новый tone (нужный):** delivery — главный оффер, walk-in — для премиум-trust, pickup — bridge между ними.

- **walk-in** = «приходи попробовать перед покупкой, Dima поможет выбрать»
- **pickup** = «напиши заранее, забери готовый заказ за 30 секунд»
- **delivery** = **«24/7 к твоему отелю в Паттайе и Джомтьене за 30 минут»** — самый длинный, самый сочный текст, sub-CTA «Order on WhatsApp»

## Что добавить (тексты)

Скопируй точно. Тон уже выверен.

### EN — добавить в [`messages/en.json`](../../../messages/en.json) после namespace `noPrescription` (или в любом месте — порядок не важен)

```json
"fulfillment": {
  "title": "How to get it",
  "subtitle": "Walk in, pre-order pickup, or 24/7 delivery to your hotel — whichever fits your night.",
  "walkin": {
    "title": "Walk in",
    "desc": "Come by, sample first, ask Dima anything. The whole shop is yours to browse.",
    "point1": "Free sample on the shelf",
    "point2": "Medical card sorted in 2 min",
    "point3": "5 min from Walking Street",
    "cta": "Open in Google Maps"
  },
  "pickup": {
    "title": "Pre-order pickup",
    "desc": "Message us first — we'll prep your order so you grab and go in under a minute.",
    "point1": "Skip the choosing time",
    "point2": "Pay on pickup, cash or QR",
    "point3": "Same Walking Street walking distance",
    "cta": "Pre-order on WhatsApp"
  },
  "delivery": {
    "title": "24/7 delivery to your hotel",
    "desc": "Pattaya and Jomtien — to your door in about 30 minutes, day or night. Discreet packaging, cash on delivery or QR.",
    "point1": "Open 24/7, even at 4 AM",
    "point2": "30 min to Pattaya, Jomtien, Pratumnak",
    "point3": "Cash or QR on arrival, no card needed",
    "cta": "Order on WhatsApp"
  }
}
```

### RU — добавить в [`messages/ru.json`](../../../messages/ru.json)

```json
"fulfillment": {
  "title": "Как забрать",
  "subtitle": "Зайти в магазин, оформить самовывоз заранее или заказать доставку 24/7 к отелю — выбирай по настроению.",
  "walkin": {
    "title": "Прийти в магазин",
    "desc": "Заходи, попробуй пробник, спроси Диму. Покажем всё, что есть на полке.",
    "point1": "Бесплатный пробник в магазине",
    "point2": "Медкарта оформляется за 2 минуты",
    "point3": "5 минут пешком от Walking Street",
    "cta": "Открыть в Google Maps"
  },
  "pickup": {
    "title": "Самовывоз с предзаказом",
    "desc": "Напиши заранее — соберём заказ, заберёшь за минуту.",
    "point1": "Не тратишь время на выбор",
    "point2": "Оплата при получении, наличные или QR",
    "point3": "Та же дистанция от Walking Street",
    "cta": "Оформить в WhatsApp"
  },
  "delivery": {
    "title": "Доставка 24/7 к отелю",
    "desc": "Паттайя и Джомтьен — к двери за 30 минут, в любое время дня и ночи. Аккуратная упаковка, оплата наличными или QR на месте.",
    "point1": "Работаем 24/7, даже в 4 утра",
    "point2": "30 минут до Паттайи, Джомтьена, Пратумнака",
    "point3": "Наличные или QR при доставке, без карты",
    "cta": "Заказать в WhatsApp"
  }
}
```

### TH — добавить в [`messages/th.json`](../../../messages/th.json)

```json
"fulfillment": {
  "title": "วิธีรับสินค้า",
  "subtitle": "เดินมาที่ร้าน สั่งล่วงหน้าแล้วแวะรับ หรือสั่งจัดส่ง 24/7 ถึงโรงแรม เลือกได้ตามสะดวก",
  "walkin": {
    "title": "เดินเข้ามาที่ร้าน",
    "desc": "แวะมาลองฟรีก่อน สอบถาม Dima ได้ทุกเรื่อง ดูสินค้าได้เต็มที่",
    "point1": "ลองฟรีที่ร้าน",
    "point2": "ทำบัตรทางการแพทย์ใน 2 นาที",
    "point3": "เดิน 5 นาทีจาก Walking Street",
    "cta": "เปิดใน Google Maps"
  },
  "pickup": {
    "title": "สั่งล่วงหน้า แวะรับ",
    "desc": "ทักมาก่อน เราจะเตรียมไว้ให้ มาถึงรับได้ใน 1 นาที",
    "point1": "ไม่ต้องเสียเวลาเลือก",
    "point2": "จ่ายตอนรับ เงินสดหรือ QR",
    "point3": "ระยะทางเท่าเดิมจาก Walking Street",
    "cta": "สั่งล่วงหน้าทาง WhatsApp"
  },
  "delivery": {
    "title": "จัดส่ง 24/7 ถึงโรงแรม",
    "desc": "พัทยาและจอมเทียน ส่งถึงประตูภายใน 30 นาที ตลอด 24 ชั่วโมง บรรจุอย่างมิดชิด จ่ายเงินสดหรือ QR ตอนรับ",
    "point1": "เปิด 24/7 แม้ตี 4",
    "point2": "30 นาทีถึงพัทยา จอมเทียน พระตำหนัก",
    "point3": "จ่ายเงินสดหรือ QR ตอนรับ ไม่ต้องใช้บัตร",
    "cta": "สั่งซื้อทาง WhatsApp"
  }
}
```

## Acceptance criteria

- [ ] В каждом из трёх JSON-файлов появился namespace `fulfillment` со всеми указанными ключами.
- [ ] JSON остаётся валидным (никаких висячих запятых, незакрытых скобок).
- [ ] Локально `pnpm dev` (или эквивалент) собирается без warnings от next-intl про missing keys.
- [ ] При смене локали в шапке блок fulfillment рендерит корректные переводы на всех трёх языках.
- [ ] Никакие другие namespace'ы и ключи **не изменены** — diff должен быть чисто аддитивным.

## Definition of Done

- Коммит с сообщением вида `fix(i18n): add missing fulfillment namespace for en/ru/th`.
- Скриншоты блока fulfillment на трёх языках в PR-описании.
- Линтер и тип-чек проходят.

## Out of scope

- Не менять `FulfillmentOptions.tsx` — компонент уже корректный.
- Не менять `shopSettings` схему.
- Не трогать другие namespace'ы (даже если найдёшь там опечатки — это отдельная задача).
- Не менять hero — это план [`02-hero-24-7-rewrite.md`](02-hero-24-7-rewrite.md).
