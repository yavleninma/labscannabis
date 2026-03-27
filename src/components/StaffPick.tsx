import { getTranslations } from "next-intl/server";
import { translateText } from "@/lib/auto-translate";
import type { Strain } from "@/lib/mock-data";
import { getLocalizedShortDescription } from "@/lib/strain-localization";
import { createTagHref } from "@/lib/strain-tags";
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

interface StaffPickProps {
  strain: Strain;
  locale: string;
}

export async function StaffPick({ strain, locale }: StaffPickProps) {
  const t = await getTranslations({ locale, namespace: "staffPick" });
  const tCommon = await getTranslations({ locale, namespace: "strainCommon" });
  const imageUrl = strain.image ? urlFor(strain.image)?.width(600).height(400).url() : null;
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
  const localizedShortDescription = getLocalizedShortDescription(strain, locale as "en" | "ru" | "th");
  const translatedShortDescription =
    locale === "en" || !localizedShortDescription
      ? localizedShortDescription
      : await translateText(localizedShortDescription, locale as "ru" | "th");

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-bg-card border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={tCommon("staffPickAltText", { name: strain.name })}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🌿</span>
                </div>
              )}
              <span className="absolute top-3 left-3 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                ☆ {t("badge")}
              </span>
            </div>

            <div className="p-6 flex flex-col justify-center">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {strain.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                <a href={typeHref} className="capitalize hover:text-emerald-300 transition-colors">
                  {tCommon(`type_${strain.type}`)}
                </a>
                {hasThc && (
                  <>
                    <span>·</span>
                    <span>{tCommon("thc")} {strain.thcPercent}%</span>
                  </>
                )}
                {hasCbd && (
                  <>
                    <span>·</span>
                    <span>{tCommon("cbd")} {strain.cbdPercent}%</span>
                  </>
                )}
              </div>
              {effectEntries.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {effectEntries.map((effect) => (
                    <a
                      key={`${effect.key}-${effect.amount}`}
                      href={createTagHref(locale, "effect", effect.key)}
                      className="text-xs bg-bg-secondary text-text-muted px-2 py-0.5 rounded-full hover:text-emerald-300 transition-colors"
                    >
                      {effectEmoji[effect.key]} {tCommon(`effect_${effect.key}`)} {effect.amount}/5
                    </a>
                  ))}
                </div>
              )}
              <p className="text-text-secondary text-sm mb-4">
                {translatedShortDescription}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-emerald-400">
                  {tCommon("pricePerGram", { price: strain.pricePerGram })}
                </span>
                {/* TODO: Replace with actual messenger URL */}
                <a
                  href="#contact"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("reserve")}
                </a>
              </div>
              {terpeneEntries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {terpeneEntries.map((terpene) => (
                    <a
                      key={`${terpene.name}-${terpene.amount}`}
                      href={createTagHref(locale, "terpene", terpene.name)}
                      className="text-xs bg-bg-secondary text-text-muted px-2 py-0.5 rounded-full"
                    >
                      {terpene.name}{terpene.amount > 0 ? ` ${terpene.amount}%` : ""}
                    </a>
                  ))}
                </div>
              )}
              <a
                href={`/${locale}/strains/${strain.slug.current}`}
                className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {t("viewDetails")} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
