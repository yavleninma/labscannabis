"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Strain } from "@/lib/mock-data";

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

  return (
    <section className="px-4 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm text-text-muted">{t("title")}</p>
          <a href="#catalog" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            {t("seeAll")} →
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
