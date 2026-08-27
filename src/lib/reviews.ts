import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/data/reviews-pool";
import { getPublishableReviews, pickDailyReviews } from "@/data/reviews-pool";

export type ReviewSourceLang = Review["originalLang"];

export interface LocalizedReview extends Review {
  displayText: string;
  isTranslation: boolean;
}

type ReviewCache = Record<string, string>;

const CACHE_DIR = path.join(process.cwd(), "reviews-cache");

function loadCache(locale: Locale): ReviewCache | null {
  const file = path.join(CACHE_DIR, `${locale}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ReviewCache;
  } catch {
    return null;
  }
}

function localeMatchesOriginal(locale: Locale, originalLang: ReviewSourceLang): boolean {
  return locale === originalLang;
}

export function localizeReview(review: Review, locale: Locale): LocalizedReview {
  const isNative = localeMatchesOriginal(locale, review.originalLang);
  if (isNative) {
    return { ...review, displayText: review.text, isTranslation: false };
  }

  const cache = loadCache(locale);
  const cached = cache?.[review.id];
  if (cached) {
    return { ...review, displayText: cached, isTranslation: true };
  }

  // Fallback: English reviews stay in English on missing cache; others show original with translation flag
  const fallbackText = review.originalLang === "en" ? review.text : review.text;
  return { ...review, displayText: fallbackText, isTranslation: !isNative };
}

/**
 * Публикуемые отзывы на языке локали. Источник — `getPublishableReviews()`, а
 * не сам пул: пока `REVIEWS_VERIFIED === false`, именных цитат не существует ни
 * на одной странице, и рендер это переживает — `ReviewStrip` показывает только
 * рейтинг карточки со ссылкой на источник.
 */
export function pickDailyLocalizedReviews(
  locale: Locale,
  date: Date = new Date(),
  n = 3,
): LocalizedReview[] {
  return pickDailyReviews(getPublishableReviews(), date, n).map((r) => localizeReview(r, locale));
}
