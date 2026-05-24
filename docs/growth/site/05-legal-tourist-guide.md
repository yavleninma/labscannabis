# Site #05 — «Legal Cannabis for Tourists in Thailand» Trust Page

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

90% всех туристических запросов в Google перед поиском конкретного шопа выглядят как «is weed legal in Thailand for tourists 2026», «can I buy cannabis in Pattaya as a tourist», «do I need medical card for weed thailand». Сейчас на эти запросы отвечают Reddit-нити трёхлетней давности и устаревшие блоги. Создаём **большую trust-страницу**, которая ловит этот intent и переводит в Labs.

Это **не катаногая FAQ**, а полноценный SEO-pillar в 2000–3000 слов, локализованный EN/RU/TH, с TOC, structured data и многоступенчатым CTA-ом.

## Маршрут

`/[locale]/guides/legal-cannabis-tourists` — для всех трёх локалей.

## Структура страницы

```
1. Hero
   H1: Is cannabis legal for tourists in Thailand? (2026 guide)
   Sub: Yes — with a medical card, which we sort out for you in 2 minutes at the shop.
   Last updated badge (auto-updated на дату build)
   Reading time ~6 min
   TOC (sticky on desktop)

2. TL;DR box (3 короткие строки + CTA)

3. The current legal status (объясняет 2024 reform → 2026 status)

4. What "medical card" actually means (5 параграфов)
   - What it is
   - How to get it (we do it on the spot)
   - How long it lasts
   - What it lets you buy
   - Cost (free with us)

5. Who can buy: tourists vs residents

6. What you can NOT do (smoking in public, driving, taking it home)

7. Where in Pattaya you can buy (link to Labs delivery + walk-in)

8. Common scams to avoid (Walking Street touts, fake delivery, no-card sketchy shops)

9. FAQ (10 questions, separate JSON-LD FAQPage)

10. CTA: "Visit us or order delivery 24/7"

11. Related guides (link to /strains, /delivery/walking-street, etc.)
```

## Контент-брифинг для копирайтера

**Tone:** confident, factual, slightly reassuring. НЕ legal advice (есть disclaimer внизу), но достаточно конкретно, чтобы человек принял решение.

**Что обязательно сказать:**

- Cannabis legal status в 2026: medical use разрешён, recreational в серой зоне, реформы 2024-2025 ужесточили требования к рецепту, но **medical card-based purchases остаются легальными**.
- Все licensed dispensaries (включая Labs) работают по medical framework.
- Туристы могут получить medical card на месте — это **digital form на телефоне**, занимает 2 минуты.
- Cost: бесплатно при покупке.
- Аэропорт: **запрещено вывозить из страны**, даже если ты купил легально.
- Курить в общественных местах: **запрещено**, штрафы до 25,000 THB.

**Антимаркетинговый блок «Common scams»:**

- Walking Street touts с пакетиками — почти всегда низкое качество, нет medical card.
- «Delivery без вопросов» в Telegram без юр. лица — рискованно для всех.
- Шопы без видимой лицензии и Google Reviews — избегать.
- Конкуренция мягко: «мы не единственные хорошие в Паттайе, но мы один из honest. Вот как проверить любой шоп: lic, reviews, sample policy.»

**CTA (умеренно частые, не агрессивные):**

- В TL;DR: «Walk in 5 min from Walking Street or order delivery 24/7 to your hotel» → ссылка на главную + WhatsApp
- В разделе «Где купить»: ссылка на `/{locale}/delivery/walking-street` и т.д.
- В конце: финальный CTA-block

## Технические требования к странице

### React структура

`src/app/[locale]/guides/legal-cannabis-tourists/page.tsx`:

```tsx
export default async function LegalGuidePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalGuide" });
  const shopSettings = await getShopSettings();

  return (
    <>
      <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12">
        {/* TOC sidebar on desktop, dropdown on mobile */}
        <h1>{t("h1")}</h1>
        <p className="lead">{t("lead")}</p>
        <LastUpdatedBadge />
        <TLDRBox />
        <Section id="status" title={t("sections.status.title")}>...</Section>
        <Section id="medical-card" title={t("sections.medicalCard.title")}>...</Section>
        {/* etc */}
        <FAQAccordion />
        <FinalCTA shopSettings={shopSettings} locale={locale} />
        <RelatedGuides locale={locale} />
        <Disclaimer />
      </article>

      <Script type="application/ld+json">
        {/* Article schema + FAQPage schema */}
      </Script>
    </>
  );
}

export async function generateMetadata({ params }) { ... }
```

### Контент-хранение

**Вариант A (рекомендуемый):** Хранить контент в `messages/{locale}.json` namespace `legalGuide` как структурированные строки.

**Вариант B:** Хранить как Sanity-документ типа `guide` с PortableText. Больше гибкости для редактуры без релиза, но требует новой схемы.

Решай по усилию: если этот гид планируется один — Вариант A. Если будут другие гиды (ожидаемо) — Вариант B + создать общий компонент `<GuidePage guide={guide} />`.

**Recommended на старт: Вариант A** для скорости, потом мигрировать.

### JSON-LD

Два блока:

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Is Cannabis Legal for Tourists in Thailand? (2026 Guide)",
    "description": "...",
    "author": { "@type": "Person", "name": "Dima" },
    "publisher": { "@type": "Organization", "name": "Labs Cannabis", "logo": {...} },
    "datePublished": "2026-05-14",
    "dateModified": "{build date}",
    "mainEntityOfPage": "{canonical url}"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [ /* 10 Q&A */ ]
  }
]
```

### Sitemap + hreflang

Добавить в [`src/app/sitemap.ts`](../../../src/app/sitemap.ts) три URL для трёх локалей.

### Internal linking

В FAQ главной страницы — добавить «Read full legal guide →» ссылку.

## Acceptance criteria

- [ ] Страница рендерится по всем трём locale URL'ам, возвращает 200.
- [ ] Минимум 1500 слов реального контента на каждой локали (не одинаковый текст в трёх языках — переведённый, но по смыслу).
- [ ] TOC работает (smooth scroll), sticky на desktop, dropdown/anchor на mobile.
- [ ] FAQ accordion, JSON-LD FAQPage validates.
- [ ] Article JSON-LD validates.
- [ ] Disclaimer внизу: «This is general information, not legal advice.»
- [ ] Final CTA включает оба варианта: WhatsApp delivery + Maps walk-in.
- [ ] Mobile reading experience — без horizontal scroll, font 16px+.
- [ ] Lighthouse SEO ≥ 95.

## Definition of Done

- PR `feat(seo): legal cannabis for tourists trust guide`.
- Submit URL в Google Search Console для индексации.
- Скриншот mobile + desktop в PR.

## Out of scope

- Не делать другие гиды (например «Strain guide for first-timers») в этом плане — отдельная задача.
- Не менять FAQ компонент главной страницы кроме добавления ссылки.
- Не нанимать lawyer для review — disclaimer закрывает.
- Не делать видеоверсию гида — отдельная задача (TikTok-серия).
