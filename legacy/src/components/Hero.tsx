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
        <div className="relative mb-7 overflow-hidden rounded-[28px] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/14 via-bg-card to-bg-card p-5 sm:p-6 shadow-[0_24px_70px_rgba(5,150,105,0.10)]">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/18 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-amber-200/30 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-xl">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  {t("sampleBadge")}
                </span>
                <p className="text-lg font-semibold text-text-primary sm:text-[1.35rem]">
                  {t("sampleTitle")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {t("sampleText")}
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/15 bg-white/70 text-emerald-700 shadow-[0_10px_30px_rgba(5,150,105,0.10)] sm:inline-flex">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M7.75 11.75L10.5 14.5l5.75-6.25M6.25 4.75h11.5A2.25 2.25 0 0120 7v10a2.25 2.25 0 01-2.25 2.25H6.25A2.25 2.25 0 014 17V7a2.25 2.25 0 012.25-2.25z"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/72 px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  01
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("sampleFresh")}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/72 px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  02
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("samplePressure")}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/72 px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  03
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("sampleTrust")}</p>
              </div>
            </div>
          </div>
        </div>
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
        </div>
      </div>
    </section>
  );
}
