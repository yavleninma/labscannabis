import { useTranslations } from "next-intl";
import { GOOGLE_LISTING_URL, DEFAULT_GOOGLE_RATING, DEFAULT_GOOGLE_REVIEW_COUNT } from "@/lib/constants";

interface SocialProofStripProps {
  rating?: number | null;
  reviewCount?: number | null;
}

export function SocialProofStrip({
  rating,
  reviewCount,
}: SocialProofStripProps) {
  const t = useTranslations("socialProof");
  const safeRating = rating ?? DEFAULT_GOOGLE_RATING;
  const safeReviewCount = reviewCount ?? DEFAULT_GOOGLE_REVIEW_COUNT;
  const fullStars = Math.round(safeRating);

  return (
    <section className="px-4 pb-3 sm:pb-2" aria-label={`${safeRating} out of 5 stars, ${safeReviewCount} reviews`}>
      <div className="max-w-6xl mx-auto">
        <a
          href={GOOGLE_LISTING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border bg-bg-card/40 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="font-semibold text-text-primary shrink-0">{safeRating}</span>
          <span className="text-yellow-400 shrink-0" aria-hidden="true">
            {"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}
          </span>
          <span className="basis-full sm:basis-auto text-sm leading-snug">
            {t("reviewCount", { count: safeReviewCount })}
          </span>
          <span className="text-emerald-400 text-sm sm:ml-auto group-hover:text-emerald-300 transition-colors">
            → {t("seeAll")}
          </span>
        </a>
      </div>
    </section>
  );
}
