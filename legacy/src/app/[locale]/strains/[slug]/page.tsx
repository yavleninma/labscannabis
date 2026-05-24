import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import {
  getContactMessageLocale,
  getLocaleDirection,
  isValidLocale,
} from "@/i18n/config";
import { buildLanguageAlternates } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { Footer } from "@/components/Footer";
import { StrainJsonLd } from "@/components/StrainJsonLd";
import { StrainCard } from "@/components/StrainCard";
import { StrainStickyCta } from "@/components/StrainStickyCta";
import { buildContactLinks } from "@/lib/contact-links";
import { getLocalizedAreaDescription, getLocalizedAreaName, getLocalizedAreaPath } from "@/lib/area-localization";
import { getAllAreas, getAllStrainSlugs, getAllStrains, getShopSettings, getStrainBySlug } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import type { Strain } from "@/lib/mock-data";
import { getLocalizedFullDescription, getLocalizedShortDescription } from "@/lib/strain-localization";
import { createTagHref } from "@/lib/strain-tags";
import { getStoredUtm } from "@/lib/utm-tracking";
import { urlFor } from "@/sanity/image";

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

function getRelatedStrains(current: Strain, strains: Strain[]): Strain[] {
  const currentEffects = new Set((current.effects || []).map((effect) => effect.key));
  const candidates = strains.filter((strain) => strain._id !== current._id && !strain.isSoldOut);
  const sameType = candidates.filter((strain) => strain.type === current.type);
  const sameEffects = candidates.filter((strain) =>
    (strain.effects || []).some((effect) => currentEffects.has(effect.key)),
  );
  const seen = new Set<string>();

  return [...sameType, ...sameEffects, ...candidates].filter((strain) => {
    if (seen.has(strain._id)) return false;
    seen.add(strain._id);
    return true;
  }).slice(0, 3);
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
  const { locale: requestedLocale, slug } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const strain = await getStrainBySlug(slug);
  const t = await getTranslations({ locale, namespace: "strainPage" });
  const tCommon = await getTranslations({ locale, namespace: "strainCommon" });

  if (!strain) {
    return {};
  }

  const baseUrl = getSiteUrl();
  const typeLabel = tCommon(`type_${strain.type}`);
  const title = t("metaTitleDelivery", {
    name: strain.name,
    type: typeLabel,
  });
  const description =
    typeof strain.thcPercent === "number"
      ? t("metaDescriptionDelivery", {
          name: strain.name,
          type: typeLabel,
          thc: strain.thcPercent,
        })
      : t("metaDescriptionDeliveryNoThc", {
          name: strain.name,
          type: typeLabel,
        });

  const ogImageUrl = strain.image
    ? urlFor(strain.image)?.width(1200).height(630).url()
    : null;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/strains/${slug}`,
      languages: buildLanguageAlternates(
        baseUrl,
        (alternateLocale) => `/${alternateLocale}/strains/${slug}`,
      ),
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
  const { locale: requestedLocale, slug } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : "en";
  const [strain, allStrains, areas, shopSettings, utm] = await Promise.all([
    getStrainBySlug(slug),
    getAllStrains(),
    getAllAreas(),
    getShopSettings(),
    getStoredUtm(),
  ]);

  if (!strain) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "strainPage" });
  const tCommon = await getTranslations({ locale, namespace: "strainCommon" });
  const imageUrl = strain.image ? urlFor(strain.image)?.width(800).height(600).url() : null;
  const localizedShortDescription = getLocalizedShortDescription(strain, locale);
  const localizedFullDescription = getLocalizedFullDescription(strain, locale);
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
    getContactMessageLocale(locale),
    {
      kind: "delivery",
      productName: strain.name,
      source: utm.source,
      campaign: utm.campaign,
    },
  );
  const relatedStrains = getRelatedStrains(strain, allStrains);
  const visibleAreas = areas.filter((area) => !area.isHidden).slice(0, 6);
  const reserveChannels = [
    { id: "line", label: "LINE", href: contactLinks.line },
    { id: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp },
    { id: "telegram", label: "Telegram", href: contactLinks.telegram },
  ].filter(
    (channel) =>
      Boolean(channel.href) && !(channel.id === "line" && channel.href?.startsWith("tel:")),
  );
  const phoneDisplay = shopSettings.phone?.trim() || contactLinks.phone?.replace(/^tel:/, "") || null;
  const isRtl = getLocaleDirection(locale) === "rtl";
  const baseUrl = getSiteUrl();

  return (
    <>
      <StrainJsonLd
        strain={strain}
        locale={locale}
        baseUrl={baseUrl}
        breadcrumbStrainsLabel={t("breadcrumbStrains")}
        description={localizedShortDescription}
      />
      <article className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <a
          href={`/${locale}#catalog`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-emerald-400"
        >
          <svg
            className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToCatalog")}
        </a>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
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
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[0]}`}
              >
                <span className="text-6xl opacity-30">🌿</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {strain.isSoldOut && (
              <span className="mb-3 w-fit rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400">
                {t("soldOut")}
              </span>
            )}

            <h1
              className="mb-3 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {strain.name}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <a
                href={typeHref}
                className="rounded bg-bg-card px-2 py-0.5 capitalize transition-colors hover:text-emerald-300"
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
                    className="rounded-full border border-border bg-bg-card px-3 py-1 text-xs text-text-secondary transition-colors hover:text-emerald-300"
                  >
                    {effectEmoji[effect.key]} {tCommon(`effect_${effect.key}`)} {effect.amount}/5
                  </a>
                ))}
              </div>
            )}

            {localizedShortDescription && (
              <p className="mb-4 text-text-secondary">{localizedShortDescription}</p>
            )}

            <div className="mb-4 text-3xl font-bold text-emerald-400">
              {tCommon("pricePerGram", { price: strain.pricePerGram })}
            </div>

            {!strain.isSoldOut && (reserveChannels.length > 0 || contactLinks.phone) && (
              <div className="mb-2">
                <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">{t("reserveVia")}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {reserveChannels.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.href || "#"}
                      target={channel.href?.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                    >
                      {channel.label}
                    </a>
                  ))}
                  {contactLinks.phone && (
                    <a
                      href={contactLinks.phone}
                      className="inline-flex items-center rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-white"
                    >
                      {t("call")}{phoneDisplay ? `: ${phoneDisplay}` : ""}
                    </a>
                  )}
                </div>
              </div>
            )}

            {terpeneEntries.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm text-text-muted">{t("terpenes")}</p>
                <div className="flex flex-wrap gap-2">
                  {terpeneEntries.map((terpene) => (
                    <a
                      key={`${terpene.name}-${terpene.amount}`}
                      href={createTagHref(locale, "terpene", terpene.name)}
                      className="rounded-full border border-border bg-bg-card px-3 py-1 text-xs text-text-secondary transition-colors hover:text-emerald-300"
                    >
                      {terpene.name}{terpene.amount > 0 ? ` ${terpene.amount}%` : ""}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {localizedFullDescription && (
          <div className="prose prose-invert prose-emerald mt-10 max-w-none">
            <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {t("about")}
            </h2>
            <PortableText value={localizedFullDescription} />
          </div>
        )}

        {!strain.isSoldOut && contactLinks.reserve && (
          <section className="mt-10 rounded-2xl border border-emerald-500/25 bg-bg-card p-5 sm:p-6">
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("deliveryBlock.title", { name: strain.name })}
            </h2>
            <p className="mb-4 text-text-secondary">{t("deliveryBlock.subtitle")}</p>
            <ul className="mb-5 space-y-2 text-sm text-text-secondary">
              <li>✓ {t("deliveryBlock.point1")}</li>
              <li>✓ {t("deliveryBlock.point2")}</li>
              <li>✓ {t("deliveryBlock.point3")}</li>
            </ul>
            <a
              href={contactLinks.reserve}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              {t("deliveryBlock.cta", { name: strain.name })}
            </a>
          </section>
        )}

        {visibleAreas.length > 0 && (
          <section className="mt-10">
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("whereToBuy.title", { name: strain.name })}
            </h2>
            <p className="mb-4 text-text-secondary">
              {t("whereToBuy.body", { name: strain.name })}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleAreas.map((area) => {
                const areaName = getLocalizedAreaName(area, locale);
                return (
                  <a
                    key={area._id}
                    href={getLocalizedAreaPath(locale, area)}
                    className="rounded-xl border border-border bg-bg-card p-4 transition-colors hover:border-emerald-500/40"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="font-semibold text-text-primary">{areaName}</span>
                      <span className="shrink-0 text-sm text-emerald-600">
                        ~{area.etaMinutes} min
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {getLocalizedAreaDescription(area, locale)}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {relatedStrains.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("relatedStrains.title")}
              </h2>
              <a href={`/${locale}#catalog`} className="text-sm font-semibold text-emerald-600">
                {t("relatedStrains.viewAll")}
              </a>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
              {relatedStrains.map((related, index) => {
                const links = buildContactLinks(shopSettings, getContactMessageLocale(locale), {
                  kind: "delivery",
                  productName: related.name,
                  source: utm.source,
                  campaign: utm.campaign,
                });
                return (
                  <StrainCard
                    key={related._id}
                    strain={related}
                    index={index}
                    reserveLabel={t("reserve")}
                    soldOutLabel={t("soldOut")}
                    locale={locale}
                    reserveUrl={links.reserve}
                  />
                );
              })}
            </div>
          </section>
        )}
      </article>
      {!strain.isSoldOut && (
        <StrainStickyCta
          href={contactLinks.reserve}
          priceLabel={tCommon("pricePerGram", { price: strain.pricePerGram })}
          thcLabel={
            typeof strain.thcPercent === "number"
              ? `${t("stickyCta.thc")} ${strain.thcPercent}%`
              : null
          }
          buttonLabel={t("stickyCta.delivery")}
        />
      )}
      <Footer shopSettings={shopSettings} utmSource={utm.source} utmCampaign={utm.campaign} />
    </>
  );
}
