"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Strain } from "@/lib/mock-data";
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
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? strains
      : strains.filter((s) => s.effect === filter);

  const available = strains.filter((s) => !s.isSoldOut).length;

  return (
    <section id="catalog" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}{" "}
            <span className="text-text-muted text-lg font-normal">
              · {t("count", { count: available })}
            </span>
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {effects.map((e) => (
            <button
              key={e}
              onClick={() => setFilter(e)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${
                filter === e
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-bg-card text-text-muted border border-border hover:text-text-secondary"
              }`}
            >
              <span>{effectEmoji[e]}</span>
              {t(`filter_${e}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
