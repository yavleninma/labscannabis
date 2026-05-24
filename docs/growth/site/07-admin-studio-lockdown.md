# Site #07 — Lock Down `/studio` Admin Surface

> **Перед стартом:** прочитай [`docs/growth/README.md`](../README.md) для shared context.

## TL;DR

`src/app/studio/[[...tool]]/page.tsx` сейчас — публично доступный Sanity Studio по адресу `https://labscannabis.boutique/studio`. Sanity сам по себе требует Google-логин, но:

1. **Сам факт public route раскрывает CMS-стек** — лишняя мета для атакующих.
2. **Studio индексируется** Google (нет `noindex`).
3. **Туристы случайно попадают в студию** — не знают что там.
4. **Пользователь решил, что админка ему почти не нужна** — основной workflow идёт через AI strain generator (`/api/strain/generate`) и edit JSON в репо/Sanity desktop client.

План — **затереть, не удаляя**. Studio остаётся доступной через env-флаг и/или basic auth для редких ручных правок, но снимается с публичного surface.

## Стратегия

Используем **трёхслойную защиту**:

1. **Env flag** `STUDIO_ENABLED=true` (default `false`). Если выключен — `/studio` возвращает 404 (через `notFound()` в page.tsx).
2. **`X-Robots-Tag: noindex`** на /studio — даже если случайно открыт, Google не индексирует.
3. **Robots.txt** — disallow `/studio` явно.

Опционально (если хочется ещё параноить):

4. **Basic Auth через middleware** — даже когда `STUDIO_ENABLED=true`, требует `STUDIO_BASIC_AUTH_USER` / `STUDIO_BASIC_AUTH_PASSWORD`.

## Реализация

### 1. Env-флаг в page.tsx

[`src/app/studio/[[...tool]]/page.tsx`](../../../src/app/studio/[[...tool]]/page.tsx) — добавить guard в самом верху default export'а:

```tsx
import { notFound } from "next/navigation";

// existing imports...

export default function StudioPage(props) {
  if (process.env.STUDIO_ENABLED !== "true") {
    notFound();
  }
  return (
    // existing studio render
  );
}

export const metadata = {
  robots: { index: false, follow: false },
};
```

### 2. Robots.txt

В [`src/app/robots.ts`](../../../src/app/robots.ts) — добавить disallow:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

### 3. Sitemap exclusion

В [`src/app/sitemap.ts`](../../../src/app/sitemap.ts) — убедиться, что `/studio` не попадает (проверь, что не генерируется случайно).

### 4. Optional: Basic Auth middleware

Создать [`middleware.ts`](../../../middleware.ts) (в корне репо, рядом с next.config) если ещё нет:

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/studio")) {
    const user = process.env.STUDIO_BASIC_AUTH_USER;
    const pass = process.env.STUDIO_BASIC_AUTH_PASSWORD;
    if (!user || !pass) return NextResponse.next();

    const auth = req.headers.get("authorization");
    if (!auth) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Labs Studio"' },
      });
    }

    const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
    if (auth !== expected) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
```

> **Важно:** Если уже есть `middleware.ts` (например для next-intl), не перезаписывай — добавь логику в существующий matcher или используй `chain`-pattern. Сначала проверь Glob `middleware.ts` и `src/middleware.ts`.

### 5. Env documentation

Обновить `.env.example` (или создать, если нет):

```dotenv
# Sanity Studio access
# Set to "true" to enable /studio admin route. Leave unset for production unless actively editing.
STUDIO_ENABLED=false

# Optional: Basic Auth on top of Sanity's own login (defense in depth)
# STUDIO_BASIC_AUTH_USER=
# STUDIO_BASIC_AUTH_PASSWORD=
```

### 6. Прод environment

В Vercel project settings:

- **Production:** не устанавливать `STUDIO_ENABLED` (или `STUDIO_ENABLED=false`). Когда нужно отредачить — поставить `=true` через Vercel UI на 1 час, отредачить, выключить.
- **Preview / Development:** `STUDIO_ENABLED=true` для удобства разработки.

## Альтернативный подход (если хочется проще)

Если basic auth и env flag — это перебор, минимально достаточный вариант:

1. Только `metadata.robots = { index: false, follow: false }` в page.tsx
2. Disallow в robots.ts

Это **не блокирует доступ**, но:
- убирает из индексации
- ограничивает случайных посетителей через robots
- Sanity сам требует логин при попытке редактирования

**Рекомендую полный вариант (все 6 шагов)** — это 30 минут работы, потом надёжно.

## Что делать с self-hostable Sanity desktop client

Альтернатива веб-Studio — **Sanity Desktop / Sanity CLI**. Можно полностью убрать `/studio` route и редактировать через `npx sanity dataset import`, `sanity start` локально, или через [Sanity's own studio host](https://www.sanity.io/manage). Это самый параноидный вариант, и он **не противоречит** этому плану — env-flag можно держать выключенным навсегда, а локально поднимать `sanity start` в моменты редактирования.

## Acceptance criteria

- [ ] `https://labscannabis.boutique/studio` в production возвращает 404 (если `STUDIO_ENABLED` не выставлен).
- [ ] При `STUDIO_ENABLED=true` (например, в preview) studio открывается нормально.
- [ ] `meta robots` на /studio = `noindex,nofollow`.
- [ ] `robots.txt` содержит `Disallow: /studio`.
- [ ] Sitemap не включает `/studio`.
- [ ] (Если внедрён basic auth) При попытке открыть /studio без auth — 401 с prompt.
- [ ] `.env.example` обновлён.
- [ ] README репо упоминает «How to access /studio for admin edits» с инструкцией.

## Definition of Done

- PR `chore(security): lock down sanity studio route behind env flag`.
- Снимки ответов: 404 без флага, 200 с флагом, 401 с basic auth.
- Запись в репо `docs/admin-access.md` с инструкцией для Dima.

## Out of scope

- Не удалять Studio код (он нужен для редких ручных правок).
- Не мигрировать на Sanity hosted studio (это отдельный решение).
- Не менять Sanity API token settings — read-only token уже работает корректно.
- Не трогать `/api/*` routes (отдельная политика безопасности).
