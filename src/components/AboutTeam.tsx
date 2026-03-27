import { useTranslations } from "next-intl";
import type { ShopSettings } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

interface AboutTeamProps {
  shopSettings?: ShopSettings;
}

export function AboutTeam({ shopSettings }: AboutTeamProps) {
  const t = useTranslations("about");

  const guideImageUrl = shopSettings?.guidePhoto
    ? urlFor(shopSettings.guidePhoto)?.width(200).height(200).url()
    : null;

  const teamImageUrl = shopSettings?.teamPhoto
    ? urlFor(shopSettings.teamPhoto)?.width(200).height(200).url()
    : null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 flex items-center justify-center mb-4 border-2 border-emerald-500/30 overflow-hidden">
              {guideImageUrl ? (
                <img
                  src={guideImageUrl}
                  alt={t("guidePhotoAlt")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl opacity-50" aria-hidden="true">👤</span>
              )}
            </div>
            <h3 className="font-semibold text-text-primary text-lg mb-0.5">
              {t("guideName")}
            </h3>
            <p className="text-emerald-400 text-sm mb-3">{t("guideRole")}</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t("guideDescription")}
            </p>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 flex items-center justify-center mb-4 border-2 border-emerald-500/30 overflow-hidden">
              {teamImageUrl ? (
                <img
                  src={teamImageUrl}
                  alt={t("teamPhotoAlt")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl opacity-50" aria-hidden="true">👥</span>
              )}
            </div>
            <h3 className="font-semibold text-text-primary text-lg mb-3">
              {t("teamTitle")}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t("teamDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
