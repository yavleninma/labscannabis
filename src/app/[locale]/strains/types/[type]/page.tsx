import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllStrains, getShopSettings } from "@/lib/queries";
import { strainMatchesTag } from "@/lib/strain-tags";
import { getSiteUrl } from "@/lib/site-url";
import { StrainCard } from "@/components/StrainCard";
import { Footer } from "@/components/Footer";

export const revalidate = 60;

const VALID_TYPES = ["indica", "sativa", "hybrid"] as const;

export async function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of routing.locales) {
    for (const type of VALID_TYPES) {
      params.push({ locale, type });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) return {};

  const t = await getTranslations({ locale, namespace: "typePage" });
  const baseUrl = getSiteUrl();
  const typeLabel = t(`type_${type}`);

  return {
    title: t("title", { type: typeLabel }),
    description: t("description", { type: typeLabel }),
    alternates: {
      canonical: `${baseUrl}/${locale}/strains/types/${type}`,
      languages: {
        "x-default": `${baseUrl}/en/strains/types/${type}`,
        "en-US": `${baseUrl}/en/strains/types/${type}`,
        "ru-RU": `${baseUrl}/ru/strains/types/${type}`,
        "th-TH": `${baseUrl}/th/strains/types/${type}`,
      },
    },
    openGraph: {
      title: t("ogTitle", { type: typeLabel }),
      description: t("description", { type: typeLabel }),
      url: `${baseUrl}/${locale}/strains/types/${type}`,
      siteName: "Labs Cannabis",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle", { type: typeLabel }),
      description: t("description", { type: typeLabel }),
    },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) notFound();

  const [allStrains, shopSettings] = await Promise.all([
    getAllStrains(),
    getShopSettings(),
  ]);

  const filtered = allStrains.filter((s) => strainMatchesTag(s, "type", type));

  const t = await getTranslations({ locale, namespace: "typePage" });
  const baseUrl = getSiteUrl();
  const typeLabel = t(`type_${type}`);

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
        name: t("breadcrumbStrains"),
        item: `${baseUrl}/${locale}#catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: typeLabel,
        item: `${baseUrl}/${locale}/strains/types/${type}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
          <a href={`/${locale}`} className="hover:text-emerald-400 transition-colors">
            Labs Cannabis
          </a>
          <span className="mx-1">›</span>
          <a href={`/${locale}#catalog`} className="hover:text-emerald-400 transition-colors">
            {t("breadcrumbStrains")}
          </a>
          <span className="mx-1">›</span>
          <span className="text-text-primary">{typeLabel}</span>
        </nav>

        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("h1", { type: typeLabel })}
        </h1>
        <p className="text-text-secondary mb-8 max-w-2xl">
          {t("intro", { type: typeLabel })}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((strain, i) => (
              <StrainCard
                key={strain._id}
                strain={strain}
                index={i}
                reserveLabel={t("reserve")}
                soldOutLabel={t("soldOut")}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-muted py-12">
            {t("noResults", { type: typeLabel })}
          </p>
        )}
      </div>
      <Footer shopSettings={shopSettings} />
    </>
  );
}
