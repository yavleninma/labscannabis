/**
 * Единый контракт событий аналитики (W1-08).
 *
 * До него одно и то же действие писалось под шестью именами
 * (`hero_whatsapp_click`, `location_whatsapp_click`, `contact_whatsapp_click`,
 * `contact_messenger_click`, `map_open_click`, `contact_call_click`), причём
 * ни одно из них никуда не долетало: `window.va` вызывался со строкой вместо
 * объекта, а `gtag`/`dataLayer` на сайте не подключены вообще.
 *
 * Теперь событий два, и различаются они не именем канала, а смыслом:
 * `contact_click` — человек ушёл в контакт (это и есть конверсия),
 * `nav_click` — человек перешёл внутри сайта (это ещё не конверсия).
 * Всё остальное описывают два атрибута — `data-channel` и `data-placement`.
 *
 * Разметка держит контракт буквальными `data-*` атрибутами, чтобы его можно
 * было проверить грепом; типы ниже — источник допустимых значений для этих
 * атрибутов и для нормализации в `TrackingScript.astro`.
 */

/** Целевое действие: человек ушёл в мессенджер, на телефон или в карты. */
export const CONTACT_EVENT = "contact_click";
/** Переход внутри сайта: меню, языки, тематические ссылки. */
export const NAV_EVENT = "nav_click";

/**
 * Канал контакта. `maps` и `directions` разделены сознательно: клик по карточке
 * (`?cid=`) — это «пошёл читать отзывы», а клик по `dir/?api=1` — «встал и
 * пошёл к двери». Смешивать их в одну цифру значит не знать, что именно
 * работает.
 */
export const CONTACT_CHANNELS = [
  "whatsapp",
  "line",
  "telegram",
  "phone",
  "maps",
  "directions",
] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

/** Место на странице, откуда нажали. Отчёт «страница → канал → место». */
export const TRACK_PLACEMENTS = [
  "header",
  "hero",
  "home",
  "sticky",
  "rail",
  "footer",
  "map_block",
  "legal_guide",
  "area",
  "delivery",
  "seo",
  "contact",
  "locations",
  "retired",
  "reviews",
  "language",
] as const;

export type TrackPlacement = (typeof TRACK_PLACEMENTS)[number];

/** Значение, которым `TrackingScript.astro` заменяет неизвестный канал/место. */
export const TRACK_FALLBACK = "other";

/**
 * ID счётчика Яндекс.Метрики. Вебмастер уже подтверждён метой в `PageLayout`,
 * а сам счётчик включается переменной окружения: без неё `Analytics.astro` не
 * рендерит ничего и сайт работает ровно как раньше.
 *
 * Метрика — второй счётчик не для красоты: кастомные события Vercel на тарифе
 * Hobby молча не пишутся (O-09), а русскоязычная аудитория Паттайи в Метрике
 * видна лучше, чем где-либо ещё.
 */
export function getYandexMetrikaId(): number | null {
  const raw = String(import.meta.env.PUBLIC_YM_ID ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const id = Number.parseInt(raw, 10);
  return id > 0 ? id : null;
}
