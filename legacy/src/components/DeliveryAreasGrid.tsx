import { getTranslations } from "next-intl/server";
import type { Area } from "@/lib/mock-data";
import {
  getLocalizedAreaDescription,
  getLocalizedAreaName,
  getLocalizedAreaPath,
} from "@/lib/area-localization";

interface DeliveryAreasGridProps {
  areas: Area[];
  locale: string;
}

export async function DeliveryAreasGrid({ areas, locale }: DeliveryAreasGridProps) {
  const t = await getTranslations({ locale, namespace: "areaPage" });
  const visibleAreas = areas.filter((area) => !area.isHidden).slice(0, 6);

  if (visibleAreas.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2
            className="text-2xl font-bold sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("areasTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-text-secondary">{t("areasSubtitle")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAreas.map((area) => {
            const name = getLocalizedAreaName(area, locale);
            return (
              <a
                key={area._id}
                href={getLocalizedAreaPath(locale, area)}
                className="group rounded-xl border border-border bg-bg-card p-4 transition-colors hover:border-emerald-500/40"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-text-primary group-hover:text-emerald-600">
                    {name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {t("eta", { eta: area.etaMinutes })}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {getLocalizedAreaDescription(area, locale)}
                </p>
                <span className="text-sm font-semibold text-emerald-600">{t("viewArea")}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
