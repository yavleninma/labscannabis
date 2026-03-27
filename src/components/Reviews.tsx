"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GOOGLE_LISTING_URL, DEFAULT_GOOGLE_RATING, DEFAULT_GOOGLE_REVIEW_COUNT } from "@/lib/constants";

const reviews = [
  {
    name: "Mike R.",
    initial: "M",
    stars: 5,
    originalText:
      "Best dispensary in Pattaya hands down. The staff really knows their strains and helped me pick the perfect one. Clean shop, great vibes.",
    originalLang: "en",
  },
  {
    name: "Алексей К.",
    initial: "А",
    stars: 5,
    originalText:
      "Отличный магазин! Ребята помогли с оформлением карты прямо на месте за пару минут. Выбор сортов хороший, цены адекватные. Рекомендую.",
    originalLang: "ru",
  },
  {
    name: "Sarah T.",
    initial: "S",
    stars: 5,
    originalText:
      "So easy! I was nervous about the medical card thing but they walked me through everything. Great selection and very knowledgeable staff.",
    originalLang: "en",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

interface ReviewsProps {
  rating?: number;
  reviewCount?: number;
}

export function Reviews({
  rating = DEFAULT_GOOGLE_RATING,
  reviewCount = DEFAULT_GOOGLE_REVIEW_COUNT,
}: ReviewsProps) {
  const t = useTranslations("reviews");
  const locale = useLocale() as "en" | "ru" | "th";
  const [translatedByName, setTranslatedByName] = useState<Record<string, string>>({});
  const [showOriginalByName, setShowOriginalByName] = useState<Record<string, boolean>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const needsTranslation = locale !== "en";

  useEffect(() => {
    let isActive = true;

    async function loadTranslations() {
      if (!needsTranslation) {
        setTranslatedByName({});
        return;
      }

      setIsTranslating(true);
      const entries = await Promise.all(
        reviews.map(async (review) => {
          if (review.originalLang === locale) {
            return [review.name, review.originalText] as const;
          }

          try {
            const response = await fetch("/api/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: review.originalText,
                targetLocale: locale,
              }),
            });

            if (!response.ok) {
              return [review.name, review.originalText] as const;
            }

            const payload = (await response.json()) as { translatedText?: string };
            return [review.name, payload.translatedText || review.originalText] as const;
          } catch {
            return [review.name, review.originalText] as const;
          }
        })
      );

      if (!isActive) {
        return;
      }

      setTranslatedByName(Object.fromEntries(entries));
      setIsTranslating(false);
    }

    void loadTranslations();
    return () => {
      isActive = false;
    };
  }, [locale, needsTranslation]);

  const cards = useMemo(
    () =>
      reviews.map((review) => {
        const translated = translatedByName[review.name];
        const shouldShowOriginal = showOriginalByName[review.name] || false;
        const renderedText =
          needsTranslation && translated && !shouldShowOriginal ? translated : review.originalText;

        return {
          ...review,
          renderedText,
          canToggle: needsTranslation && translated && translated !== review.originalText,
          shouldShowOriginal,
        };
      }),
    [needsTranslation, showOriginalByName, translatedByName]
  );

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl sm:text-4xl font-bold mb-1" aria-label={`${rating} out of 5 stars`}>
            {rating}{" "}
            <span className="text-yellow-400" aria-hidden="true">
              {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
            </span>
          </div>
          <a
            href={GOOGLE_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-sm hover:text-emerald-400 transition-colors"
          >
            {t("subtitle", { count: reviewCount })} →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((review) => (
            <div
              key={review.name}
              className="bg-bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {review.name}
                  </p>
                  <Stars count={review.stars} />
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                &ldquo;{isTranslating && needsTranslation && !translatedByName[review.name] ? t("translating") : review.renderedText}&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-text-muted text-xs">{t("sourceGoogle")}</p>
                {review.canToggle && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowOriginalByName((prev) => ({
                        ...prev,
                        [review.name]: !review.shouldShowOriginal,
                      }))
                    }
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {review.shouldShowOriginal ? t("showTranslation") : t("showOriginal")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
