import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ShopSettings } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

interface AboutTeamProps {
  shopSettings?: ShopSettings;
}

export function AboutTeam({ shopSettings }: AboutTeamProps) {
  const t = useTranslations("about");

  const guideImageUrl = shopSettings?.guidePhoto
    ? urlFor(shopSettings.guidePhoto)?.width(600).height(400).url()
    : null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative w-full rounded-xl bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 flex items-center justify-center mb-4 border border-emerald-500/30 overflow-hidden aspect-[3/2]">
              {guideImageUrl ? (
                <Image
                  src={guideImageUrl}
                  alt={t("guidePhotoAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              ) : (
                <span className="text-5xl opacity-50" aria-hidden="true">👤</span>
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
        </div>
      </div>
    </section>
  );
}
