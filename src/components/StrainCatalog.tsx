"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { Strain } from "@/lib/mock-data";
import { normalizeTagValue, parseTagFromSearchParams, strainMatchesTag } from "@/lib/strain-tags";
import { StrainCard } from "./StrainCard";

const effects = ["all", "relax", "energy", "creative", "sleep"] as const;

const effectEmoji: Record<string, string> = {
  all: "🌿",
  relax: "😌",
  energy: "⚡",
  creative: "🎨",
  sleep: "😴",
};

interface StrainCatalogProps {
  strains: Strain[];
}

export function StrainCatalog({ strains }: StrainCatalogProps) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("strainCommon");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { tagType, tag } = parseTagFromSearchParams(searchParams);

  const filtered = useMemo(() => {
    if (!tagType || !tag) {
      return strains;
    }
    return strains.filter((strain) => strainMatchesTag(strain, tagType, tag));
  }, [strains, tagType, tag]);

  const available = strains.filter((s) => !s.isSoldOut).length;
  const activeEffectFilter = tagType === "effect" ? tag : null;

  const updateFilter = (effect: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (effect === "all") {
      params.delete("tagType");
      params.delete("tag");
    } else {
      params.set("tagType", "effect");
      params.set("tag", effect);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#catalog`, { scroll: false });
  };

  const activeTagLabel =
    tagType === "effect"
      ? effects.includes(tag as (typeof effects)[number])
        ? t(`filter_${tag}`)
        : (tag ?? "")
      : tagType === "type"
        ? tCommon(`type_${tag ?? ""}`)
        : (strains.find((strain) => strain.terpenes?.some((terpene) => normalizeTagValue(terpene) === tag))
            ?.terpenes?.find((terpene) => normalizeTagValue(terpene) === tag) ?? (tag ?? ""));

  return (
    <section id="catalog" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-5 sm:mb-6">
          <h2
            className="text-2xl sm:text-3xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
            <span className="block sm:inline sm:ml-2 text-text-muted text-sm sm:text-lg font-normal mt-1 sm:mt-0">
              {t("count", { count: available })}
            </span>
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {effects.map((e) => (
            <button
              key={e}
              onClick={() => updateFilter(e)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${
                (e === "all" && !activeEffectFilter) || activeEffectFilter === e
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-bg-card text-text-muted border border-border hover:text-text-secondary"
              }`}
            >
              <span>{effectEmoji[e]}</span>
              {t(`filter_${e}`)}
            </button>
          ))}
        </div>

        {tagType && tag && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-text-secondary">
              {t("activeFilter", {
                tagType: tCommon(`tagType_${tagType}`),
                tagLabel: activeTagLabel,
              })}
            </span>
            <button
              onClick={() => updateFilter("all")}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {t("clearFilter")}
            </button>
          </div>
        )}

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

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-12">
            {t("noResults")}
          </p>
        )}
      </div>
    </section>
  );
}
