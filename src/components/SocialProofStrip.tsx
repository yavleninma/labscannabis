import { useTranslations } from "next-intl";

const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/T67UqNDGdALMC1VZ8";

export function SocialProofStrip() {
  const t = useTranslations("socialProof");

  return (
    <section className="px-4 pb-2">
      <div className="max-w-6xl mx-auto">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="font-semibold text-text-primary">{t("rating")}</span>
          <span className="text-yellow-400">★★★★★</span>
          <span>{t("reviewCount")}</span>
          <span className="text-emerald-400 text-xs">→ {t("seeAll")}</span>
        </a>
      </div>
    </section>
  );
}
