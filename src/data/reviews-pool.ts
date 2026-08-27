export interface Review {
  id: string;
  name: string;
  stars: 5;
  text: string;
  date: string;
  source: "google";
  /** Language the review was originally written in on Google */
  originalLang: "en" | "ru" | "th";
}

/**
 * Флаг подтверждения отзывов — тот же безопасный дефолт, что у `HOURS` и
 * `STAFF_LANGUAGES` в `src/data/site.ts`.
 *
 * Пул НЕ выверен по источнику: имена выглядят реконструкцией, а тексты —
 * машинным переводом (`scripts/gen-review-translations.mjs`). Публикация
 * свидетельства от имени названного человека, подлинность которого издатель сам
 * не подтверждает, — это потребительский фрод, а в тайской рамке ещё и внесение
 * недостоверных данных в компьютерную систему. Поэтому по умолчанию именные
 * цитаты не публикуются вообще: показывается только рейтинг карточки со ссылкой
 * на источник — это цифра Google, а не наше утверждение.
 *
 * Поднимать флаг можно ровно тогда, когда владелец подтвердит, что каждая
 * запись — дословный отзыв с карточки, вместе с именем и датой (O-01).
 */
export const REVIEWS_VERIFIED = false;

/**
 * Отзывы с карточки LABS DISPENSARY в Google.
 *
 * W1-09 вычистил отсюда десять записей: они называли ставки за грамм и весовые
 * тиры, обещали пробник в подарок, описывали оформление медкарты как дело двух
 * минут и указывали местом магазина соседний ориентир. Отзыв — не защита:
 * опубликованная цитата про цену остаётся публикацией цены. Записи именно
 * удалены, а не переписаны: править чужой отзыв — это фабрикация.
 *
 * По той же причине удалена запись `r11` («Open late», «работают допоздна»,
 * «เปิดถึงดึก»): часы работы не подтверждены владельцем и намеренно нигде не
 * публикуются, а отзыв протаскивал их мимо `getPublishableHours()` в обход всей
 * защиты, построенной для этого в W1-12.
 */
export const REVIEWS_POOL: Review[] = [
  {
    id: "r1",
    name: "Mike R.",
    stars: 5,
    text: "Best dispensary in Pattaya hands down. The staff really knows their strains and helped me pick the perfect one. Clean shop, great vibes.",
    date: "2025-11-12",
    source: "google",
    originalLang: "en",
  },
];

/**
 * Отзывы, которые разрешено публиковать. Пока `REVIEWS_VERIFIED === false` —
 * пустой массив: безопасный дефолт по образцу `getPublishableHours()`.
 * Механизм рендера при этом остаётся рабочим и включается одним флагом.
 */
export function getPublishableReviews(): Review[] {
  return REVIEWS_VERIFIED ? REVIEWS_POOL : [];
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  const rand = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickDailyReviews(pool: Review[], date: Date, n = 3): Review[] {
  const dayIdx = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return shuffleWithSeed(pool, dayIdx).slice(0, n);
}
