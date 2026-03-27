"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Strain } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

interface QuickMenuProps {
  strains: Strain[];
}

export function QuickMenu({ strains }: QuickMenuProps) {
  const locale = useLocale();
  const t = useTranslations("quickMenu");
  const tCommon = useTranslations("strainCommon");

  const [availableStrains, soldOutStrains] = useMemo(
    () => [strains.filter((strain) => !strain.isSoldOut), strains.filter((strain) => strain.isSoldOut)],
    [strains],
  );
  const featuredStrain = availableStrains[0];
  const featuredImageUrl = featuredStrain?.image
    ? urlFor(featuredStrain.image)?.width(80).height(80).url()
    : null;

  return (
    <section className="px-4 pb-6 pt-1 sm:pt-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
          <a
            href={featuredStrain ? `/${locale}/strains/${featuredStrain.slug.current}` : "#catalog"}
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card/60 px-2.5 py-2 min-w-0 hover:border-emerald-500/30 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg overflow-hidden border border-border bg-bg-card shrink-0">
              {featuredImageUrl ? (
                <img
                  src={featuredImageUrl}
                  alt={featuredStrain?.name ?? t("title")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm">🌿</div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted leading-none">{t("title")}</p>
              <p className="text-sm text-text-primary truncate">{featuredStrain?.name ?? "LABS"}</p>
            </div>
            {featuredStrain ? (
              <span className="ml-auto text-xs text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5 shrink-0">
                {tCommon("pricePerGram", { price: featuredStrain.pricePerGram })}
              </span>
            ) : null}
          </a>
          <a
            href="#catalog"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full px-3 py-1.5 transition-colors self-start sm:self-auto"
          >
            {t("seeAll")}
            <span className="text-[11px] group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-bg-primary to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-bg-primary to-transparent z-10" />

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {availableStrains.map((strain) => (
              <a
                key={strain._id}
                href={`/${locale}/strains/${strain.slug.current}`}
                className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                {strain.name} · {tCommon("pricePerGram", { price: strain.pricePerGram })}
              </a>
            ))}

            {soldOutStrains.map((strain) => (
              <a
                key={strain._id}
                href={`/${locale}/strains/${strain.slug.current}`}
                className="shrink-0 rounded-full border border-border bg-bg-card px-3 py-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <span className="line-through">{strain.name}</span> · {t("soldOut")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
