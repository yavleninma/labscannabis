import { getTranslations } from "next-intl/server";
import { GOOGLE_LISTING_URL } from "@/lib/constants";
import type { ShopSettings } from "@/lib/mock-data";
import { buildContactLinks, type ContactLocale } from "@/lib/contact-links";
import { SpecialOfferBanner } from "@/components/SpecialOfferBanner";

interface HeroProps {
  shopSettings: ShopSettings;
  locale: string;
  utmSource?: string | null;
  utmCampaign?: string | null;
}

export async function Hero({ shopSettings, locale, utmSource, utmCampaign }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const { reserve } = buildContactLinks(shopSettings, locale as ContactLocale, {
    kind: "delivery",
    source: utmSource,
    campaign: utmCampaign,
  });
  const statusLabel = shopSettings.isOpen24h ? t("statusOpenNow") : t("statusClosed");
  const hoursLabel = shopSettings.isOpen24h
    ? t("status24_7")
    : `${shopSettings.openTime} - ${shopSettings.closeTime}`;

  return (
    <section className="px-4 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8 xl:gap-10">
        <div className="max-w-3xl">
        <h1
          className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h1>
        <p className="mb-6 max-w-2xl text-base text-text-secondary sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mb-6 flex flex-wrap gap-3">
          {reserve && (
            <a
              href={reserve}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4 4V3" />
              </svg>
              {t("deliveryCta")}
            </a>
          )}
          <a
            href={GOOGLE_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-emerald-500/40 hover:text-emerald-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("directionsCta")}
          </a>
        </div>

        <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-bg-card p-4 shadow-[0_16px_45px_rgba(5,150,105,0.08)]">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-text-primary">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              {statusLabel}
            </span>
            <span className="text-text-muted">{hoursLabel}</span>
          </div>
          <div className="grid gap-2 text-sm text-text-secondary sm:grid-cols-3">
            <p className="rounded-lg bg-bg-secondary px-3 py-2">{t("statusEta")}</p>
            <p className="rounded-lg bg-bg-secondary px-3 py-2">{t("statusPayment")}</p>
            <p className="rounded-lg bg-bg-secondary px-3 py-2">{t("statusDiscreet")}</p>
          </div>
        </div>

        <div className="mb-7 rounded-2xl border border-border bg-bg-card p-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-xl">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
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
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-bg-secondary px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-text-muted">
                  01
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("sampleFresh")}</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-text-muted">
                  02
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("samplePressure")}</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-text-muted">
                  03
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">{t("sampleTrust")}</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="mt-8 flex justify-center lg:mt-0 lg:justify-end">
          <SpecialOfferBanner locale={locale} />
        </div>
        </div>
      </div>
    </section>
  );
}
