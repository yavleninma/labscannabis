import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/metadata";
import { isValidLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { buildContactLinks, type ContactLocale } from "@/lib/contact-links";
import { GOOGLE_LISTING_URL } from "@/lib/constants";
import { getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { getStoredUtm } from "@/lib/utm-tracking";

const sectionKeys = ["status", "prescription", "tourists", "dont", "scams"] as const;
const sourceLinks = {
  official:
    "https://www.thailand.go.th/issue-focus-detail/cannabis-now-strictly-regulated-in-thailand--important-notice-for-tourists?hl=en",
  legal:
    "https://www.tilleke.com/wp-content/uploads/2024/02/Tilleke-Cannabis-and-Hemp-Business-Guide-Thailand-2025.pdf",
};

type GuideFaq = {
  q: string;
  a: string;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const t = await getTranslations({ locale, namespace: "legalGuide" });
  const baseUrl = getSiteUrl();

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${baseUrl}/${locale}/guides/legal-cannabis-tourists`,
      languages: buildLanguageAlternates(
        baseUrl,
        (alternateLocale) => `/${alternateLocale}/guides/legal-cannabis-tourists`,
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${baseUrl}/${locale}/guides/legal-cannabis-tourists`,
      siteName: "Labs Cannabis",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function LegalCannabisTouristsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const [shopSettings, utm] = await Promise.all([getShopSettings(), getStoredUtm()]);
  const t = await getTranslations({ locale, namespace: "legalGuide" });
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}/${locale}/guides/legal-cannabis-tourists`;
  const tldr = t.raw("tldr") as string[];
  const faq = t.raw("faq") as GuideFaq[];
  const deliveryLinks = buildContactLinks(shopSettings, locale as ContactLocale, {
    kind: "delivery",
    destinationName: "Pattaya hotel",
    source: utm.source,
    campaign: utm.campaign,
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("h1"),
    description: t("metaDescription"),
    author: {
      "@type": "Person",
      name: "Dima",
    },
    publisher: {
      "@type": "Organization",
      name: "Labs Cannabis",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.svg`,
      },
    },
    datePublished: "2026-05-14",
    dateModified: "2026-05-14",
    mainEntityOfPage: pageUrl,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="px-4 pb-12 pt-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-text-primary">{t("tocTitle")}</p>
              <nav className="space-y-2 text-sm text-text-secondary">
                <a className="block hover:text-emerald-600" href="#tldr">
                  {t("tldrTitle")}
                </a>
                {sectionKeys.map((key) => (
                  <a key={key} className="block hover:text-emerald-600" href={`#${key}`}>
                    {t(`sections.${key}.title`)}
                  </a>
                ))}
                <a className="block hover:text-emerald-600" href="#faq">
                  {t("faqTitle")}
                </a>
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="mb-8 max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2 text-sm text-text-muted">
                <span>{t("lastUpdated")}</span>
                <span>/</span>
                <span>{t("readingTime")}</span>
              </div>
              <h1
                className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("h1")}
              </h1>
              <p className="text-lg leading-relaxed text-text-secondary">{t("lead")}</p>
            </header>

            <section id="tldr" className="mb-8 rounded-2xl border border-emerald-500/25 bg-bg-card p-5">
              <h2
                className="mb-3 text-xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("tldrTitle")}
              </h2>
              <ul className="space-y-2 text-text-secondary">
                {tldr.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-8">
              {sectionKeys.map((key) => {
                const body = t.raw(`sections.${key}.body`) as string[];
                return (
                  <section key={key} id={key} className="scroll-mt-24">
                    <h2
                      className="mb-3 text-2xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t(`sections.${key}.title`)}
                    </h2>
                    <div className="space-y-3 text-text-secondary">
                      {body.map((paragraph) => (
                        <p key={paragraph} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <section id="faq" className="mt-10 scroll-mt-24">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("faqTitle")}
              </h2>
              <div className="space-y-3">
                {faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-border bg-bg-card p-4">
                    <h3 className="font-semibold text-text-primary">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-2xl border border-emerald-500/25 bg-bg-card p-5">
              <h2
                className="mb-2 text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("finalCtaTitle")}
              </h2>
              <p className="mb-4 text-text-secondary">{t("finalCtaText")}</p>
              <div className="flex flex-wrap gap-3">
                {deliveryLinks.reserve && (
                  <a
                    href={deliveryLinks.reserve}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    {t("deliveryCta")}
                  </a>
                )}
                <a
                  href={GOOGLE_LISTING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-primary hover:border-emerald-500/40"
                >
                  {t("mapsCta")}
                </a>
              </div>
            </section>

            <section className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href={`/${locale}#catalog`} className="rounded-xl border border-border bg-bg-card p-4 hover:border-emerald-500/40">
                <p className="font-semibold text-text-primary">{t("relatedStrains")}</p>
              </a>
              <a
                href={`/${locale}/delivery/walking-street`}
                className="rounded-xl border border-border bg-bg-card p-4 hover:border-emerald-500/40"
              >
                <p className="font-semibold text-text-primary">{t("relatedDelivery")}</p>
              </a>
            </section>

            <section className="mt-10 rounded-xl border border-border bg-bg-card p-4">
              <h2 className="mb-2 font-semibold text-text-primary">{t("sourcesTitle")}</h2>
              <div className="space-y-2 text-sm text-text-secondary">
                <a className="block hover:text-emerald-600" href={sourceLinks.official} target="_blank" rel="noopener noreferrer">
                  {t("sourceOfficial")}
                </a>
                <a className="block hover:text-emerald-600" href={sourceLinks.legal} target="_blank" rel="noopener noreferrer">
                  {t("sourceLegal")}
                </a>
              </div>
            </section>

            <p className="mt-6 rounded-xl bg-bg-secondary p-4 text-sm leading-relaxed text-text-secondary">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </article>

      <ContactSection
        shopSettings={shopSettings}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <Footer shopSettings={shopSettings} utmSource={utm.source} utmCampaign={utm.campaign} />
    </>
  );
}
