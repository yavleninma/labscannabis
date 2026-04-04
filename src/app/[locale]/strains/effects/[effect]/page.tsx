import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { getAllStrains, getShopSettings } from "@/lib/queries";
import { strainMatchesTag } from "@/lib/strain-tags";
import { getSiteUrl } from "@/lib/site-url";
import { StrainCard } from "@/components/StrainCard";
import { Footer } from "@/components/Footer";

const VALID_EFFECTS = [
  "relax",
  "energy",
  "creative",
  "sleep",
  "euphoria",
  "focus",
  "happy",
  "uplifted",
  "talkative",
  "hungry",
] as const;

export async function generateStaticParams() {
  const params: { locale: string; effect: string }[] = [];
  for (const locale of routing.locales) {
    for (const effect of VALID_EFFECTS) {
      params.push({ locale, effect });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; effect: string }>;
}): Promise<Metadata> {
  const { locale, effect } = await params;
  if (!VALID_EFFECTS.includes(effect as (typeof VALID_EFFECTS)[number])) return {};

  const t = await getTranslations({ locale, namespace: "effectPage" });
  const baseUrl = getSiteUrl();
  const effectLabel = t(`effect_${effect}`);

  return {
    title: t("title", { effect: effectLabel }),
    description: t("description", { effect: effectLabel }),
    alternates: {
      canonical: `${baseUrl}/${locale}/strains/effects/${effect}`,
      languages: buildLanguageAlternates(
        baseUrl,
        (alternateLocale) => `/${alternateLocale}/strains/effects/${effect}`,
      ),
    },
    openGraph: {
      title: t("ogTitle", { effect: effectLabel }),
      description: t("description", { effect: effectLabel }),
      url: `${baseUrl}/${locale}/strains/effects/${effect}`,
      siteName: "Labs Cannabis",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle", { effect: effectLabel }),
      description: t("description", { effect: effectLabel }),
    },
  };
}

export default async function EffectPage({
  params,
}: {
  params: Promise<{ locale: string; effect: string }>;
}) {
  const { locale, effect } = await params;
  if (!VALID_EFFECTS.includes(effect as (typeof VALID_EFFECTS)[number])) notFound();

  const [allStrains, shopSettings] = await Promise.all([
    getAllStrains(),
    getShopSettings(),
  ]);

  const filtered = allStrains.filter((s) => strainMatchesTag(s, "effect", effect));

  const t = await getTranslations({ locale, namespace: "effectPage" });
  const baseUrl = getSiteUrl();
  const effectLabel = t(`effect_${effect}`);

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
        name: effectLabel,
        item: `${baseUrl}/${locale}/strains/effects/${effect}`,
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
          <span className="text-text-primary">{effectLabel}</span>
        </nav>

        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("h1", { effect: effectLabel })}
        </h1>
        <p className="text-text-secondary mb-8 max-w-2xl">
          {t("intro", { effect: effectLabel })}
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
            {t("noResults", { effect: effectLabel })}
          </p>
        )}
      </div>
      <Footer shopSettings={shopSettings} />
    </>
  );
}
