import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { routing } from "@/i18n/routing";
import { translatePortableTextBlocks, translateText } from "@/lib/auto-translate";
import { buildContactLinks, type ContactLocale } from "@/lib/contact-links";
import { getLocalizedFullDescription, getLocalizedShortDescription } from "@/lib/strain-localization";
import { createTagHref } from "@/lib/strain-tags";
import { getStrainBySlug, getAllStrainSlugs, getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { urlFor } from "@/sanity/image";
import { Footer } from "@/components/Footer";

type Locale = "en" | "ru" | "th";

const effectEmoji: Record<string, string> = {
  relax: "😌",
  energy: "⚡",
  creative: "🎨",
  sleep: "😴",
  euphoria: "✨",
};

const gradients = [
  "from-emerald-900/40 to-emerald-700/20",
  "from-purple-900/40 to-purple-700/20",
  "from-blue-900/40 to-blue-700/20",
];

function toContactLocale(value: string): ContactLocale {
  if (value === "ru" || value === "th") return value;
  return "en";
}

export async function generateStaticParams() {
  const slugs = await getAllStrainSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const strain = await getStrainBySlug(slug);
  const t = await getTranslations({ locale, namespace: "strainPage" });
  const tCommon = await getTranslations({ locale, namespace: "strainCommon" });

  if (!strain) return {};

  const baseUrl = getSiteUrl();
  const title = `${strain.name} — ${t("metaTitleSuffix")}`;
  const localizedShortDescription = getLocalizedShortDescription(strain, locale as Locale);
  const translatedShortDescription = localizedShortDescription
    ? await translateText(localizedShortDescription, locale as Locale)
    : "";
  const description =
    translatedShortDescription ||
    t("metaDescriptionFallback", {
      name: strain.name,
      type: tCommon(`type_${strain.type}`),
      thc: strain.thcPercent,
    });

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/strains/${slug}`,
      languages: {
        en: `${baseUrl}/en/strains/${slug}`,
        ru: `${baseUrl}/ru/strains/${slug}`,
        th: `${baseUrl}/th/strains/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/strains/${slug}`,
      siteName: "Labs Cannabis",
      type: "article",
    },
  };
}

export default async function StrainPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [strain, shopSettings] = await Promise.all([getStrainBySlug(slug), getShopSettings()]);

  if (!strain) notFound();

  const t = await getTranslations({ locale: locale, namespace: "strainPage" });
  const tCommon = await getTranslations({ locale: locale, namespace: "strainCommon" });
  const imageUrl = strain.image ? urlFor(strain.image)?.width(800).height(600).url() : null;
  const localizedShortDescription = getLocalizedShortDescription(strain, locale as Locale);
  const translatedShortDescription = localizedShortDescription
    ? await translateText(localizedShortDescription, locale as Locale)
    : "";
  const localizedFullDescription = getLocalizedFullDescription(strain, locale as Locale);
  const translatedFullDescription = await translatePortableTextBlocks(
    localizedFullDescription,
    locale as Locale
  );
  const typeHref = createTagHref(locale, "type", strain.type);
  const effectHref = createTagHref(locale, "effect", strain.effect);
  const reserveUrl = buildContactLinks(
    shopSettings,
    toContactLocale(locale),
    { kind: "purchase", productName: strain.name }
  ).reserve;

  return (
    <>
      <article className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <a
          href={`/${locale}#catalog`}
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-emerald-400 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToCatalog")}
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden border border-border aspect-[4/3]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={tCommon("strainAltText", { name: strain.name })}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradients[0]} flex items-center justify-center`}>
                <span className="text-6xl opacity-30">🌿</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {strain.isSoldOut && (
              <span className="text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded-full w-fit mb-3">
                {t("soldOut")}
              </span>
            )}

            <h1
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {strain.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted mb-4">
              <a
                href={typeHref}
                className="capitalize bg-bg-card px-2 py-0.5 rounded hover:text-emerald-300 transition-colors"
              >
                {tCommon(`type_${strain.type}`)}
              </a>
              <span>{tCommon("thc")} {strain.thcPercent}%</span>
              {strain.cbdPercent ? <span>{tCommon("cbd")} {strain.cbdPercent}%</span> : null}
              <a href={effectHref} className="hover:text-emerald-300 transition-colors">
                {effectEmoji[strain.effect]} {tCommon(`effect_${strain.effect}`)}
              </a>
            </div>

            {translatedShortDescription && (
              <p className="text-text-secondary mb-4">{translatedShortDescription}</p>
            )}

            <div className="text-3xl font-bold text-emerald-400 mb-4">
              {tCommon("pricePerGram", { price: strain.pricePerGram })}
            </div>

            {!strain.isSoldOut && (
              <a
                href={reserveUrl || "#"}
                target={reserveUrl?.startsWith("http") ? "_blank" : undefined}
                rel={reserveUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit"
              >
                {t("reserve")}
              </a>
            )}

            {strain.terpenes && strain.terpenes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-text-muted mb-2">{t("terpenes")}</p>
                <div className="flex flex-wrap gap-2">
                  {strain.terpenes.map((terpene) => (
                    <a
                      key={terpene}
                      href={createTagHref(locale, "terpene", terpene)}
                      className="text-xs bg-bg-card text-text-secondary px-3 py-1 rounded-full border border-border hover:text-emerald-300 transition-colors"
                    >
                      {terpene}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {translatedFullDescription && (
          <div className="mt-10 prose prose-invert prose-emerald max-w-none">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {t("about")}
            </h2>
            <PortableText value={translatedFullDescription} />
          </div>
        )}
      </article>
      <Footer shopSettings={shopSettings} />
    </>
  );
}
