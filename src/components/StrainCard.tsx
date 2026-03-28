"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Strain } from "@/lib/mock-data";
import { createTagHref } from "@/lib/strain-tags";
import { urlFor } from "@/sanity/image";

const effectColors: Record<string, string> = {
  relax: "bg-blue-500/15 text-blue-600",
  energy: "bg-yellow-500/15 text-yellow-700",
  creative: "bg-purple-500/15 text-purple-600",
  sleep: "bg-indigo-500/15 text-indigo-600",
  euphoria: "bg-pink-500/15 text-pink-600",
  focus: "bg-cyan-500/15 text-cyan-700",
  happy: "bg-amber-500/15 text-amber-700",
  uplifted: "bg-emerald-500/15 text-emerald-600",
  talkative: "bg-orange-500/15 text-orange-600",
  hungry: "bg-rose-500/15 text-rose-600",
};

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
  "from-amber-900/40 to-amber-700/20",
  "from-rose-900/40 to-rose-700/20",
  "from-cyan-900/40 to-cyan-700/20",
  "from-indigo-900/40 to-indigo-700/20",
  "from-teal-900/40 to-teal-700/20",
];

interface StrainCardProps {
  strain: Strain;
  index: number;
  reserveLabel: string;
  soldOutLabel: string;
  locale: string;
}

export function StrainCard({ strain, index, reserveLabel, soldOutLabel, locale }: StrainCardProps) {
  const tCommon = useTranslations("strainCommon");
  const imageUrl = strain.image ? urlFor(strain.image)?.width(400).height(300).url() : null;
  const gradient = gradients[index % gradients.length];
  const detailsHref = `/${locale}/strains/${strain.slug.current}`;
  const typeHref = createTagHref(locale, "type", strain.type);
  const effectEntries = strain.effects?.length
    ? [...strain.effects].sort((a, b) => b.amount - a.amount)
    : strain.effect
      ? [{ key: strain.effect, amount: 1 }]
      : [];
  const primaryEffect = effectEntries[0] || null;
  const effectHref = primaryEffect ? createTagHref(locale, "effect", primaryEffect.key) : null;
  const extraEffectsCount = Math.max(0, effectEntries.length - 1);
  const hasThc = typeof strain.thcPercent === "number";
  const hasCbd = typeof strain.cbdPercent === "number";

  // TODO: Replace with actual messenger URL
  // TODO: Replace with actual messenger URL with pre-filled message
  const reserveUrl = `#contact`;

  const openTagFilter = (href: string) => {
    window.location.assign(href);
  };

  return (
    <a
      href={detailsHref}
      className="group block bg-bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={tCommon("cardAltText", { name: strain.name })}
            fill
            sizes="(max-width: 420px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-4xl opacity-30">🌿</span>
          </div>
        )}

        {primaryEffect && effectHref && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openTagFilter(effectHref);
            }}
            className={`absolute top-2 right-2 max-w-[78%] whitespace-nowrap overflow-hidden text-ellipsis text-[11px] sm:text-xs px-2 py-0.5 rounded-full ${
              effectColors[primaryEffect.key] || "bg-emerald-500/20 text-emerald-400"
            }`}
            title={`${tCommon(`effect_${primaryEffect.key}`)} (${primaryEffect.amount}/5)`}
          >
            {effectEmoji[primaryEffect.key]} {tCommon(`effect_${primaryEffect.key}`)} {primaryEffect.amount}/5
            {extraEffectsCount > 0 ? ` +${extraEffectsCount}` : ""}
          </button>
        )}

        {strain.isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-lg font-bold text-text-muted uppercase tracking-wider">
              {soldOutLabel}
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3">
        <h3 className="font-semibold text-sm sm:text-base text-text-primary mb-1 group-hover:text-emerald-400 transition-colors">
          {strain.name}
        </h3>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-muted mb-2">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openTagFilter(typeHref);
            }}
            className="capitalize hover:text-emerald-300 transition-colors"
          >
            {tCommon(`type_${strain.type}`)}
          </button>
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
        <div className="flex items-center justify-between gap-2">
          <span className="text-emerald-400 font-semibold text-sm sm:text-base">
            {tCommon("pricePerGram", { price: strain.pricePerGram })}
          </span>
          {strain.isSoldOut ? (
            <span className="text-[11px] sm:text-xs text-text-muted px-2.5 sm:px-3 py-1.5 rounded-lg bg-bg-secondary cursor-not-allowed whitespace-nowrap">
              {soldOutLabel}
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = reserveUrl;
              }}
              className="text-[11px] sm:text-xs text-emerald-400 border border-emerald-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              {reserveLabel}
            </button>
          )}
        </div>
      </div>
    </a>
  );
}
