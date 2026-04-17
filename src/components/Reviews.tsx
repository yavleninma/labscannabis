"use client";

import { useMessages, useTranslations } from "next-intl";
import { DEFAULT_GOOGLE_RATING, DEFAULT_GOOGLE_REVIEW_COUNT, GOOGLE_LISTING_URL } from "@/lib/constants";

type ReviewItem = {
  name: string;
  initial: string;
  stars: number;
  text: string;
};

function getReviewItems(messages: unknown): ReviewItem[] {
  if (!messages || typeof messages !== "object") {
    return [];
  }

  const reviews = (messages as { reviews?: { items?: Record<string, unknown> } }).reviews?.items;
  if (!reviews || typeof reviews !== "object") {
    return [];
  }

  return Object.values(reviews).flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Partial<ReviewItem>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.initial !== "string" ||
      typeof candidate.stars !== "number" ||
      typeof candidate.text !== "string"
    ) {
      return [];
    }

    return [
      {
        name: candidate.name,
        initial: candidate.initial,
        stars: candidate.stars,
        text: candidate.text,
      },
    ];
  });
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-400 text-sm" aria-hidden="true">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

interface ReviewsProps {
  rating?: number | null;
  reviewCount?: number | null;
}

export function Reviews({ rating, reviewCount }: ReviewsProps) {
  const t = useTranslations("reviews");
  const messages = useMessages();
  const reviewItems = getReviewItems(messages);
  const safeRating = rating ?? DEFAULT_GOOGLE_RATING;
  const safeReviewCount = reviewCount ?? DEFAULT_GOOGLE_REVIEW_COUNT;

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl sm:text-4xl font-bold mb-1" aria-label={`${safeRating} out of 5 stars`}>
            {safeRating}{" "}
            <span className="text-yellow-400" aria-hidden="true">
              {"★".repeat(Math.round(safeRating))}{"☆".repeat(5 - Math.round(safeRating))}
            </span>
          </div>
          <a
            href={GOOGLE_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-sm hover:text-emerald-400 transition-colors"
          >
            {t("subtitle", { count: safeReviewCount })} →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reviewItems.map((review) => (
            <div key={review.name} className="bg-bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{review.name}</p>
                  <Stars count={review.stars} />
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-text-muted text-xs">{t("sourceGoogle")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
