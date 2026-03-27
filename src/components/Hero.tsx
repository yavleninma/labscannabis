import { useTranslations } from "next-intl";
import { GOOGLE_LISTING_URL } from "@/lib/constants";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="pt-20 pb-10 px-4 max-w-6xl mx-auto">
      <div className="max-w-2xl">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg mb-6">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={GOOGLE_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("getDirections")}
          </a>
          {/* TODO: Replace with actual LINE/WhatsApp URL */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-border hover:border-text-muted text-text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t("messageUs")}
          </a>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {t("seeMenu")}
          </a>
        </div>
      </div>
    </section>
  );
}
