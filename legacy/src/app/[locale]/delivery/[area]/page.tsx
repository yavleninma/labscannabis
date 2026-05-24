import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/metadata";
import { isValidLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { ContactSection } from "@/components/ContactSection";
import { DeliveryAreasGrid } from "@/components/DeliveryAreasGrid";
import { Footer } from "@/components/Footer";
import { SocialProofStrip } from "@/components/SocialProofStrip";
import { StrainCatalog } from "@/components/StrainCatalog";
import {
  getLocalizedAreaDescription,
  getLocalizedAreaName,
  getLocalizedAreaPath,
} from "@/lib/area-localization";
import { buildContactLinks, type ContactLocale } from "@/lib/contact-links";
import { GOOGLE_LISTING_URL } from "@/lib/constants";
import { getAllAreas, getAllStrains, getAreaBySlug, getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { getStoredUtm } from "@/lib/utm-tracking";

export async function generateStaticParams() {
  const areas = await getAllAreas();

  return routing.locales.flatMap((locale) =>
    areas
      .filter((area) => !area.isHidden)
      .map((area) => ({ locale, area: area.slug.current })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale, area: areaSlug } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const area = await getAreaBySlug(areaSlug);

  if (!area || area.isHidden) return {};

  const t = await getTranslations({ locale, namespace: "areaPage" });
  const baseUrl = getSiteUrl();
  const areaName = getLocalizedAreaName(area, locale);
  const title = t("metaTitle", { area: areaName });
  const description = t("metaDescription", {
    area: areaName,
    eta: area.etaMinutes,
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${getLocalizedAreaPath(locale, area)}`,
      languages: buildLanguageAlternates(
        baseUrl,
        (alternateLocale) => `/${alternateLocale}/delivery/${area.slug.current}`,
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${getLocalizedAreaPath(locale, area)}`,
      siteName: "Labs Cannabis",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AreaDeliveryPage({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}) {
  const { locale: requestedLocale, area: areaSlug } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const [area, allAreas, strains, shopSettings, utm] = await Promise.all([
    getAreaBySlug(areaSlug),
    getAllAreas(),
    getAllStrains(),
    getShopSettings(),
    getStoredUtm(),
  ]);

  if (!area || area.isHidden) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "areaPage" });
  const baseUrl = getSiteUrl();
  const areaName = getLocalizedAreaName(area, locale);
  const areaDescription = getLocalizedAreaDescription(area, locale);
  const landmarks = area.landmarks || [];
  const links = buildContactLinks(shopSettings, locale as ContactLocale, {
    kind: "delivery",
    destinationName: areaName,
    source: utm.source,
    campaign: utm.campaign,
  });

  const pageUrl = `${baseUrl}${getLocalizedAreaPath(locale, area)}`;
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("metaTitle", { area: areaName }),
    serviceType: "Cannabis delivery",
    areaServed: {
      "@type": "Place",
      name: areaName,
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Labs Cannabis",
      url: `${baseUrl}/${locale}`,
      telephone: shopSettings.phone || undefined,
    },
    url: pageUrl,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Labs Cannabis",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: areaName,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="px-4 pb-10 pt-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
            <a href={`/${locale}`} className="hover:text-emerald-500">
              Labs Cannabis
            </a>
            <span className="mx-1">/</span>
            <span>{t("breadcrumbDelivery")}</span>
            <span className="mx-1">/</span>
            <span className="text-text-primary">{areaName}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="mb-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700">
              {t("badge")}
            </span>
            <h1
              className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("h1", { area: areaName })}
            </h1>
            <p className="mb-6 text-base text-text-secondary sm:text-lg">
              {t("intro", { description: areaDescription, eta: area.etaMinutes })}
            </p>

            <div className="flex flex-wrap gap-3">
              {links.reserve && (
                <a
                  href={links.reserve}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  {t("orderCta")}
                </a>
              )}
              <a
                href={GOOGLE_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-primary hover:border-emerald-500/40"
              >
                {t("mapsCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofStrip
        rating={shopSettings.googleRating}
        reviewCount={shopSettings.googleReviewCount}
      />

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[t("statusEta", { eta: area.etaMinutes }), t("statusPayment"), t("statusDiscreet")].map(
            (item) => (
              <div key={item} className="rounded-xl border border-border bg-bg-card p-4">
                <p className="text-sm font-semibold text-text-primary">{item}</p>
              </div>
            ),
          )}
        </div>
      </section>

      {landmarks.length > 0 && (
        <section className="px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-bg-card p-5">
            <h2
              className="mb-3 text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("landmarksTitle")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {landmarks.map((landmark) => (
                <span
                  key={landmark}
                  className="rounded-full bg-bg-secondary px-3 py-1 text-sm text-text-secondary"
                >
                  {landmark}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <StrainCatalog
        strains={strains}
        shopSettings={shopSettings}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />

      <DeliveryAreasGrid areas={allAreas} locale={locale} />

      <section className="px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
            {(["1", "2", "3"] as const).map((key) => (
              <div key={key} className="rounded-xl border border-border bg-bg-card p-4">
                <h3 className="font-semibold text-text-primary">{t(`faq${key}q`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t(`faq${key}a`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection
        shopSettings={shopSettings}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <Footer shopSettings={shopSettings} utmSource={utm.source} utmCampaign={utm.campaign} />
    </>
  );
}
