# Site #06 — UTM Source Tracking Across All Conversion Paths

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

Сейчас [`src/lib/contact-links.ts`](../../../src/lib/contact-links.ts) умеет добавлять локализованный prefilled-message в WhatsApp/Telegram URL и поддерживает `appendQueryParam`, но **не знает про utm_source / utm_medium / utm_campaign**. Из-за этого мы не можем отличить «человек пришёл с TikTok bio link» от «человек пришёл из Telegram-канала» от «человек пришёл с Reddit-поста».

Без этого вся стратегия Platforms track слепа — мы не сможем отрезать неработающие каналы и удвоить ставки на работающие.

План — добавить лёгкую UTM-инфраструктуру: **UTM передаётся через query string на сайте, сохраняется в session, и пробрасывается в prefilled message + контактные ссылки**.

## Что построим

### 1. Расширить `buildContactLinks` поддержкой UTM

Изменить сигнатуру:

```ts
export function buildContactLinks(
  settings: ShopSettings,
  locale: ContactLocale,
  options?: {
    kind?: MessageKind;
    productName?: string;
    source?: string; // UTM source (tiktok, telegram, reddit, gbp, partner-tuk-tuk-1, ...)
    campaign?: string; // optional campaign name
  }
): ContactLinks
```

Внутри `createContactMessage` — добавить **invisible UTM tag** в конец сообщения:

```
Hello! We would like to buy "Blue Dream". Could you please confirm availability?

[ref: tiktok]
```

Tag нужен потому что WhatsApp / Telegram не сохраняют URL params после открытия чата — а текст сообщения сохраняется. Менеджер видит `[ref: tiktok]` в первом сообщении клиента и тегает в CRM/spreadsheet.

Format: `[ref: {source}]` или `[ref: {source}/{campaign}]`. Локализовано не нужно — это технический tag.

### 2. Source persistence через cookie

Создать `src/lib/utm-tracking.ts`:

```ts
import { cookies } from "next/headers";

export async function captureUtmFromUrl(searchParams: URLSearchParams) {
  const source = searchParams.get("utm_source");
  const campaign = searchParams.get("utm_campaign");
  if (!source) return;

  const cookieStore = await cookies();
  cookieStore.set("labs_source", source, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  if (campaign) {
    cookieStore.set("labs_campaign", campaign, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  }
}

export async function getStoredUtm(): Promise<{ source: string | null; campaign: string | null }> {
  const cookieStore = await cookies();
  return {
    source: cookieStore.get("labs_source")?.value ?? null,
    campaign: cookieStore.get("labs_campaign")?.value ?? null,
  };
}
```

В `src/app/[locale]/page.tsx` (и других страницах с CTA) — вызвать `captureUtmFromUrl` при рендере + использовать `getStoredUtm` при построении контактных ссылок:

```tsx
const utm = await getStoredUtm();
const links = buildContactLinks(shopSettings, locale, {
  kind: "delivery",
  source: utm.source ?? undefined,
  campaign: utm.campaign ?? undefined,
});
```

### 3. UTM пресет-список (для согласованности на всех каналах)

Документировать в этом файле канонический список `utm_source` значений, чтобы Platforms track использовал одинаковые:

| Канал | utm_source | utm_medium | utm_campaign (примеры) |
|---|---|---|---|
| Google Business Profile | `gbp` | `organic-local` | `gbp-website-button`, `gbp-post-2026-05` |
| TikTok bio link | `tiktok` | `social` | `tiktok-bio` |
| TikTok specific video | `tiktok` | `social` | `tiktok-{video-slug}` |
| Instagram bio | `instagram` | `social` | `ig-bio` |
| Telegram main channel | `telegram` | `messenger` | `tg-main` |
| Telegram satellite "Cannabis в Тае" | `telegram` | `messenger` | `tg-guide` |
| Telegram satellite "Strain of week" | `telegram` | `messenger` | `tg-strain` |
| Telegram Ads | `telegram-ads` | `paid-social` | `tg-ads-{campaign}` |
| Reddit organic post | `reddit` | `forum` | `reddit-{subreddit}` |
| Reddit promoted | `reddit-ads` | `paid-social` | `reddit-ads-{campaign}` |
| Quora answer | `quora` | `forum` | `quora-{topic}` |
| Medium article | `medium` | `blog` | `medium-{post-slug}` |
| Substack article | `substack` | `blog` | `substack-{post-slug}` |
| Telegraph article | `telegraph` | `blog` | `telegraph-{post-slug}` |
| Дзен article | `dzen` | `blog` | `dzen-{post-slug}` |
| Tuk-tuk partner #1 | `partner-tuktuk` | `offline` | `tuktuk-walking-street-1` |
| Hostel partner | `partner-hostel` | `offline` | `hostel-{name}` |
| Tattoo partner | `partner-tattoo` | `offline` | `tattoo-{name}` |
| Bar partner | `partner-bar` | `offline` | `bar-{name}` |
| Hotel concierge | `partner-hotel` | `offline` | `hotel-{name}` |
| Reviews QR | `qr-review` | `offline` | `qr-thank-you` |
| Direct link / unknown | (none) | (none) | (none) |

### 4. Простой dashboard

Не строим внешнюю аналитику. Достаточно:

- **Google Search Console** для organic
- **Plausible / Umami** (self-hosted, privacy-first, cannabis-friendly) для site analytics с UTM dimensions. Включить через `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var и script tag в `app/layout.tsx`.
- **Spreadsheet** где Dima/менеджер тегает каждый WhatsApp inbound по `[ref: ...]` тегу из первого сообщения клиента. Один раз в неделю — manual count.

### 5. Migration plan

- Существующие компоненты, которые зовут `buildContactLinks` (см. список ниже): пропатчить, чтобы передавали `source` из cookie.
- Файлы для проверки (через Grep `buildContactLinks`):
  - `src/components/Hero.tsx`
  - `src/components/FulfillmentOptions.tsx`
  - `src/components/StaffPick.tsx` (если использует)
  - `src/components/StrainCard.tsx`
  - `src/components/ContactSection.tsx`
  - `src/app/[locale]/strains/[slug]/page.tsx`

## Acceptance criteria

- [ ] `buildContactLinks(..., { source: "tiktok" })` возвращает WhatsApp URL, который при клике открывает чат с сообщением, заканчивающимся `\n\n[ref: tiktok]`.
- [ ] Заход на `/?utm_source=tiktok&utm_campaign=tiktok-bio` устанавливает `labs_source=tiktok` cookie на 30 дней.
- [ ] Все 6 компонентов из migration list используют `getStoredUtm()` и передают source/campaign в `buildContactLinks`.
- [ ] Документация UTM-таблицы выше — синхронизирована с реальной кодовой базой (если что-то изменилось — обновить README или этот файл).
- [ ] Plausible или Umami интегрирован, отображает UTM dimensions.
- [ ] Чек-лист «как добавить новый канал» в README плана `02-budget-and-metrics.md`.

## Definition of Done

- PR `feat(tracking): UTM source persistence and prefilled tag`.
- Видео-демо: посетитель открывает `/en?utm_source=tiktok` → кликает delivery CTA → открывается WhatsApp с сообщением, в конце которого `[ref: tiktok]`.
- Plausible dashboard accessible by Dima.

## Out of scope

- Не делать tracking на client side с Google Analytics (cannabis = tracking-issues, и Google может блокировать accounts).
- Не делать сложный funnel/attribution. Last-click cookie достаточно.
- Не передавать UTM в Telegram бота — это отдельный план (`platforms/03-telegram-stack.md`).
- Не менять формат `[ref: ...]` после релиза без миграции — менеджеры обучатся парсить именно его.
