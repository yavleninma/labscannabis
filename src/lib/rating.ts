import { RATING } from "@/data/site";
import { renderCopy } from "@/data/area-copy";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/ui";
import { formatDateLabel } from "@/lib/updated-date";

/**
 * Единственный способ вывести цифры карточки Google.
 *
 * Две причины, по которым строка собирается здесь, а не подстановкой на месте:
 *
 * 1. Дата сверки. `RATING.checkedOn` лежал в коде и нигде не рендерился, то
 *    есть страница утверждала «4.8★ · 104 отзыва на Google» как текущий факт,
 *    который устаревает молча. Теперь дата печатается рядом с цифрой везде, где
 *    цифра показана.
 * 2. Русская плюрализация. Шаблон «{count} отзывов» жёсткий и неверен для
 *    большинства значений: 101 → «отзыв», 102–104 → «отзыва» (наш случай —
 *    104), и только 105–120 → «отзывов». Ошибка стояла на самой коммерческой
 *    странице локали, ровно там, где решается доверие к рейтингу.
 *
 * В `meta description` и в og/twitter рейтинг НЕ уходит: там он работает как
 * рекламный текст в сниппете выдачи каннабис-бизнеса и не даёт ничего, кроме
 * риска — при том, что `aggregateRating` в JSON-LD намеренно запрещён как
 * self-serving.
 */

/** Русские формы: 1 отзыв / 2 отзыва / 5 отзывов. */
export function pluralizeRu(count: number, forms: readonly [string, string, string]): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

const RU_REVIEW_FORMS = ["отзыв", "отзыва", "отзывов"] as const;

function ratingVars(locale: Locale) {
  return {
    rating: RATING.value,
    count: RATING.count,
    reviews: locale === "ru" ? pluralizeRu(RATING.count, RU_REVIEW_FORMS) : "",
  };
}

/** «4.8★ · 104 отзыва на Google, сверено 27 августа 2026 года». */
export function formatRatingLine(locale: Locale): string {
  const ui = t(locale);
  const line = renderCopy(ui.reviews.subtitle, ratingVars(locale));
  const checked = renderCopy(ui.reviews.checkedOn, {
    date: formatDateLabel(locale, RATING.checkedOn),
  });
  return `${line} · ${checked}`;
}

/** «Все 104 отзыва в Google →» — без даты: это подпись ссылки, а не утверждение. */
export function formatReadAllLine(locale: Locale): string {
  return renderCopy(t(locale).reviews.readAll, ratingVars(locale));
}
