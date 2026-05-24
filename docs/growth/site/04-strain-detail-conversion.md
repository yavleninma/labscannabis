# Site #04 — Strain Detail Page Conversion Boost

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

Страница сорта `/[locale]/strains/[slug]` сейчас показывает описание + терпены + CTA «Ask About This Strain». Под новую стратегию (24/7 delivery как hero) и под programmatic SEO нужно добавить:

1. **Conversion блок** «Get this strain to your hotel in 30 min» — duplicate-доставка-CTA, чтобы конверсия не упиралась в один CTA в верху страницы.
2. **«Where to buy in Pattaya»** SEO-блок — повышает шанс попасть в top по «buy [strain name] pattaya».
3. **Расширенный JSON-LD Product** schema с offers, availability, priceCurrency.
4. **Связанные сорта** (related strains) — internal linking + удержание пользователя.

## Текущее состояние

Файл: `src/app/[locale]/strains/[slug]/page.tsx` (если другой путь — найди по `Glob: **/strains/[slug]/page.tsx`).

Использует ключи namespace `strainPage` (см. `messages/en.json:161-173`):

- `strainPage.metaTitleSuffix`, `backToCatalog`, `reserve`, `reserveVia`, `call`, `soldOut`, `terpenes`, `about`, `metaDescriptionFallback`, `metaDescriptionFallbackNoThc`, `breadcrumbStrains`

## Что добавить

### 1. Sticky bottom-bar CTA (mobile only)

На mobile (≤640px) добавить fixed bottom bar:

```
┌──────────────────────────────────────┐
│ ฿{price}/g · THC {thc}%              │
│ [ 🛵 Order delivery 24/7  ]          │
└──────────────────────────────────────┘
```

CTA — WhatsApp с `kind: "delivery"` и `productName: strain.name`.

### 2. «Get this strain to your hotel» секция (после `about`)

```tsx
<section className="py-12 px-4">
  <div className="max-w-4xl mx-auto bg-emerald-50 border border-emerald-500/20 rounded-2xl p-6 sm:p-8">
    <h2>{t("deliveryBlock.title", { name: strain.name })}</h2>
    <p>{t("deliveryBlock.subtitle")}</p>
    <ul>
      <li>✓ {t("deliveryBlock.point1")}</li>
      <li>✓ {t("deliveryBlock.point2")}</li>
      <li>✓ {t("deliveryBlock.point3")}</li>
    </ul>
    <a href={whatsappDeliveryWithStrainName}>{t("deliveryBlock.cta")}</a>
  </div>
</section>
```

### 3. «Where to buy {strain} in Pattaya» SEO-блок (после deliveryBlock)

```tsx
<section className="py-12 px-4">
  <h2>{t("whereToBuy.title", { name: strain.name })}</h2>
  <p>{t("whereToBuy.body", { name: strain.name })}</p>
  <ul>
    <li><Link href="/{locale}/delivery/walking-street">{areaA.name}</Link> — {areaA.etaMinutes} min</li>
    <li><Link href="/{locale}/delivery/jomtien-beach">{areaB.name}</Link> — ...</li>
    {/* список 6 areas */}
  </ul>
</section>
```

Это создаёт internal links на area-страницы из плана [`03-programmatic-seo-areas-hotels.md`](03-programmatic-seo-areas-hotels.md).

### 4. Related strains (3 карточки)

Логика: 3 случайных не-sold-out сорта **того же type** или **с пересекающимися effects** (если same type < 3 — добивать по effects).

```tsx
<section className="py-12 px-4">
  <h2>{t("relatedStrains.title")}</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {related.map(s => <StrainCard strain={s} ... />)}
  </div>
</section>
```

### 5. Расширенный JSON-LD Product schema

В существующем JSON-LD сделать:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{strain.name}",
  "image": "{strainImageUrl}",
  "description": "{strain.shortDescription}",
  "brand": { "@type": "Brand", "name": "Labs Cannabis Pattaya" },
  "offers": {
    "@type": "Offer",
    "price": "{strain.pricePerGram}",
    "priceCurrency": "THB",
    "availability": "{strain.isSoldOut ? 'OutOfStock' : 'InStock'}",
    "url": "{canonical url}",
    "seller": { "@type": "LocalBusiness", "name": "Labs Cannabis" }
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "THC", "value": "{strain.thcPercent}%" },
    { "@type": "PropertyValue", "name": "CBD", "value": "{strain.cbdPercent}%" },
    { "@type": "PropertyValue", "name": "Type", "value": "{strain.type}" }
  ]
}
```

### 6. Изменения meta

- title: `{strain.name} — {type} Strain | Cannabis Delivery in Pattaya | Labs Cannabis`
- description: `Buy {strain.name} ({type}, THC {thc}%) at Labs Cannabis Pattaya. 24/7 delivery to your hotel in 30 min, or walk in 5 min from Walking Street.`

## Новые i18n ключи (добавить в namespace `strainPage`)

### EN

```json
"deliveryBlock": {
  "title": "Get {name} to your hotel — 24/7",
  "subtitle": "We'll bring it to Pattaya, Jomtien, or anywhere nearby. Average ~30 min, even at 4 AM.",
  "point1": "Open 24/7, no waiting for shop hours",
  "point2": "Cash or QR on arrival, no card needed",
  "point3": "Discreet packaging, your reception won't know",
  "cta": "Order {name} on WhatsApp"
},
"whereToBuy": {
  "title": "Where to buy {name} in Pattaya",
  "body": "We're the only honest 24/7 shop with {name} in stock. Walk in 5 min from Walking Street, pre-order pickup, or have us deliver to one of these areas:"
},
"relatedStrains": {
  "title": "Similar strains in stock",
  "viewAll": "Browse all strains"
},
"stickyCta": {
  "perGram": "/g",
  "thc": "THC",
  "delivery": "Order delivery 24/7"
}
```

### RU

```json
"deliveryBlock": {
  "title": "Привезём {name} в твой отель — 24/7",
  "subtitle": "Доставим по Паттайе, Джомтьену и ближайшим районам. В среднем 30 минут, даже в 4 утра.",
  "point1": "Работаем 24/7, не ждать открытия магазина",
  "point2": "Наличные или QR при получении, карта не нужна",
  "point3": "Аккуратная упаковка, ресепшн ничего не поймёт",
  "cta": "Заказать {name} в WhatsApp"
},
"whereToBuy": {
  "title": "Где купить {name} в Паттайе",
  "body": "Мы единственный честный магазин 24/7, где сейчас есть {name}. Заходи в 5 минутах от Walking Street, оформи самовывоз заранее или закажи доставку в один из районов:"
},
"relatedStrains": {
  "title": "Похожие сорта в наличии",
  "viewAll": "Смотреть все сорта"
},
"stickyCta": {
  "perGram": "/г",
  "thc": "THC",
  "delivery": "Заказать доставку 24/7"
}
```

### TH

```json
"deliveryBlock": {
  "title": "ส่ง {name} ถึงโรงแรมของคุณ 24/7",
  "subtitle": "ส่งทั่วพัทยา จอมเทียน และพื้นที่ใกล้เคียง โดยเฉลี่ย 30 นาที แม้ตี 4",
  "point1": "เปิด 24/7 ไม่ต้องรอเวลาเปิดร้าน",
  "point2": "เงินสดหรือ QR ตอนรับของ ไม่ต้องใช้บัตร",
  "point3": "บรรจุอย่างมิดชิด รีเซปชั่นไม่รู้",
  "cta": "สั่ง {name} ทาง WhatsApp"
},
"whereToBuy": {
  "title": "ซื้อ {name} ที่ไหนในพัทยา",
  "body": "เราเป็นร้าน 24/7 ที่ตรงไปตรงมาเดียวที่มี {name} ตอนนี้ แวะมาห่างจาก Walking Street 5 นาที สั่งล่วงหน้าแล้วมารับ หรือให้เราจัดส่งไปยังพื้นที่:"
},
"relatedStrains": {
  "title": "สายพันธุ์ที่คล้ายกันมีในร้าน",
  "viewAll": "ดูสายพันธุ์ทั้งหมด"
},
"stickyCta": {
  "perGram": "/กรัม",
  "thc": "THC",
  "delivery": "สั่งจัดส่ง 24/7"
}
```

## Acceptance criteria

- [ ] Sticky mobile bottom-bar появляется при scroll past hero, скрывается обратно вверху страницы.
- [ ] DeliveryBlock рендерится с локализованным текстом и интерполяцией `{name}`.
- [ ] WhereToBuy блок содержит ровно 6 internal links на area-страницы (если plan #03 уже выкачен; иначе — fallback на `/strains` каталог).
- [ ] Related strains: 3 карточки, не текущий strain, не sold-out.
- [ ] JSON-LD Product validates без ошибок в [Schema Validator](https://validator.schema.org/).
- [ ] Все три locale работают.
- [ ] Mobile + desktop screenshots в PR.

## Definition of Done

- Коммит `feat(strain): conversion boost & delivery CTA on detail page`.
- Demo URL для одного strain (например `blue-dream`) с before/after Lighthouse.

## Out of scope

- Не менять Sanity strain schema (existing fields достаточно).
- Не делать review секцию на странице сорта (out of scope этого плана).
- Не делать size-picker (1g / 3.5g / 7g) — клиент уточняет в WhatsApp.
- Не интегрировать Stripe / cart — у нас нет онлайн-оплаты, всё через WhatsApp.
