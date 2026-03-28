"use client";

import Image from "next/image";
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
  const getThumbnailUrl = (strain: Strain) =>
    strain.image ? urlFor(strain.image)?.width(48).height(48).url() : null;

  return (
    <section className="px-4 pb-6 pt-1 sm:pt-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
          <div className="inline-flex items-center gap-2">
            <p className="text-sm text-text-muted">{t("title")}</p>
          </div>
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
            {availableStrains.map((strain) => {
              const thumbnailUrl = getThumbnailUrl(strain);
              return (
                <a
                  key={strain._id}
                  href={`/${locale}/strains/${strain.slug.current}`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                >
                  <span className="relative h-6 w-6 rounded-full overflow-hidden border border-emerald-500/20 bg-bg-card shrink-0">
                    {thumbnailUrl ? (
                      <Image src={thumbnailUrl} alt={strain.name} fill sizes="24px" className="object-cover" />
                    ) : (
                      <span className="h-full w-full flex items-center justify-center text-[10px]">🌿</span>
                    )}
                  </span>
                  <span>
                    {strain.name} · {tCommon("pricePerGram", { price: strain.pricePerGram })}
                  </span>
                </a>
              );
            })}

            {soldOutStrains.map((strain) => {
              const thumbnailUrl = getThumbnailUrl(strain);
              return (
                <a
                  key={strain._id}
                  href={`/${locale}/strains/${strain.slug.current}`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-2.5 py-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  <span className="h-6 w-6 rounded-full overflow-hidden border border-border bg-bg-card shrink-0">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt={strain.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="h-full w-full flex items-center justify-center text-[10px]">🌿</span>
                    )}
                  </span>
                  <span>
                    <span className="line-through">{strain.name}</span> · {t("soldOut")}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
