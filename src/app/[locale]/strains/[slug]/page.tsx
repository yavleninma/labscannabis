import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
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
import { StrainJsonLd } from "@/components/StrainJsonLd";

type Locale = "en" | "ru" | "th";

const effectEmoji: Record<string, string> = {
  relax: "😌",
  energy: "⚡",
  creative: "🎨",
  sleep: "😴",
  euphoria: "✨",
  focus: "🎯",
  happy: "😊",
  uplifted: "🚀",
  talkative: "🗣️",
  hungry: "🍽️",
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
    (typeof strain.thcPercent === "number"
      ? t("metaDescriptionFallback", {
          name: strain.name,
          type: tCommon(`type_${strain.type}`),
          thc: strain.thcPercent,
        })
      : t("metaDescriptionFallbackNoThc", {
          name: strain.name,
          type: tCommon(`type_${strain.type}`),
        }));

  const ogImageUrl = strain.image
    ? urlFor(strain.image)?.width(1200).height(630).url()
    : null;

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
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: strain.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
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
  const localizedFullDescription = getLocalizedFullDescription(strain, locale as Locale);
  const localeValue = locale as Locale;
  const [translatedShortDescription, translatedFullDescription] = await Promise.all([
    localizedShortDescription ? translateText(localizedShortDescription, localeValue) : Promise.resolve(""),
    localizedFullDescription
      ? translatePortableTextBlocks(localizedFullDescription, localeValue)
      : Promise.resolve(localizedFullDescription),
  ]);
  const typeHref = createTagHref(locale, "type", strain.type);
  const effectEntries = strain.effects?.length
    ? [...strain.effects].sort((a, b) => b.amount - a.amount)
    : strain.effect
      ? [{ key: strain.effect, amount: 1 }]
      : [];
  const terpeneEntries = strain.terpeneProfile?.length
    ? [...strain.terpeneProfile].sort((a, b) => b.amount - a.amount)
    : (strain.terpenes || []).map((name) => ({ name, amount: 0 }));
  const hasThc = typeof strain.thcPercent === "number";
  const hasCbd = typeof strain.cbdPercent === "number";
  const contactLinks = buildContactLinks(
    shopSettings,
    toContactLocale(locale),
    { kind: "purchase", productName: strain.name }
  );
  const reserveChannels = [
    { id: "line", label: "LINE", href: contactLinks.line },
    { id: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp },
    { id: "telegram", label: "Telegram", href: contactLinks.telegram },
  ].filter((channel) => Boolean(channel.href) && !(channel.id === "line" && channel.href?.startsWith("tel:")));
  const phoneDisplay = shopSettings.phone?.trim() || contactLinks.phone?.replace(/^tel:/, "") || null;

  const baseUrl = getSiteUrl();

  return (
    <>
      <StrainJsonLd
        strain={strain}
        locale={locale}
        baseUrl={baseUrl}
        breadcrumbStrainsLabel={t("breadcrumbStrains")}
      />
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
          <div className="rounded-xl overflow-hidden border border-border aspect-[4/3] relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={tCommon("strainAltText", { name: strain.name })}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                priority
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
              {hasThc ? <span>{tCommon("thc")} {strain.thcPercent}%</span> : null}
              {hasCbd ? <span>{tCommon("cbd")} {strain.cbdPercent}%</span> : null}
            </div>
            {effectEntries.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {effectEntries.map((effect) => (
                  <a
                    key={`${effect.key}-${effect.amount}`}
                    href={createTagHref(locale, "effect", effect.key)}
                    className="text-xs bg-bg-card text-text-secondary px-3 py-1 rounded-full border border-border hover:text-emerald-300 transition-colors"
                  >
                    {effectEmoji[effect.key]} {tCommon(`effect_${effect.key}`)} {effect.amount}/5
                  </a>
                ))}
              </div>
            )}

            {translatedShortDescription && (
              <p className="text-text-secondary mb-4">{translatedShortDescription}</p>
            )}

            <div className="text-3xl font-bold text-emerald-400 mb-4">
              {tCommon("pricePerGram", { price: strain.pricePerGram })}
            </div>

            {!strain.isSoldOut && (reserveChannels.length > 0 || contactLinks.phone) && (
              <div className="mb-2">
                <p className="text-xs uppercase tracking-wide text-text-muted mb-2">{t("reserveVia")}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {reserveChannels.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.href || "#"}
                      target={channel.href?.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                    >
                      {channel.label}
                    </a>
                  ))}
                  {contactLinks.phone && (
                    <a
                      href={contactLinks.phone}
                      className="inline-flex items-center rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary hover:text-white transition-colors"
                    >
                      {t("call")}{phoneDisplay ? `: ${phoneDisplay}` : ""}
                    </a>
                  )}
                </div>
              </div>
            )}

            {terpeneEntries.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-text-muted mb-2">{t("terpenes")}</p>
                <div className="flex flex-wrap gap-2">
                  {terpeneEntries.map((terpene) => (
                    <a
                      key={`${terpene.name}-${terpene.amount}`}
                      href={createTagHref(locale, "terpene", terpene.name)}
                      className="text-xs bg-bg-card text-text-secondary px-3 py-1 rounded-full border border-border hover:text-emerald-300 transition-colors"
                    >
                      {terpene.name}{terpene.amount > 0 ? ` ${terpene.amount}%` : ""}
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
