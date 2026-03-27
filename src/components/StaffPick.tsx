import { useTranslations } from "next-intl";
import type { Strain } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

const effectEmoji: Record<string, string> = {
  relax: "😌",
  energy: "⚡",
  creative: "🎨",
  sleep: "😴",
  euphoria: "✨",
};

interface StaffPickProps {
  strain: Strain;
  locale: string;
}

export function StaffPick({ strain, locale }: StaffPickProps) {
  const t = useTranslations("staffPick");
  const imageUrl = strain.image ? urlFor(strain.image)?.width(600).height(400).url() : null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-bg-card border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${strain.name} — Staff Pick at Labs Cannabis Pattaya`}
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
                <span className="capitalize">{strain.type}</span>
                <span>·</span>
                <span>THC {strain.thcPercent}%</span>
                {strain.cbdPercent ? (
                  <>
                    <span>·</span>
                    <span>CBD {strain.cbdPercent}%</span>
                  </>
                ) : null}
                <span>·</span>
                <span>{effectEmoji[strain.effect]} {strain.effect}</span>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                {strain.shortDescription}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-emerald-400">
                  ฿{strain.pricePerGram}/g
                </span>
                {/* TODO: Replace with actual messenger URL */}
                <a
                  href="#contact"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("reserve")}
                </a>
              </div>
              {strain.terpenes && strain.terpenes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {strain.terpenes.map((terpene) => (
                    <span
                      key={terpene}
                      className="text-xs bg-bg-secondary text-text-muted px-2 py-0.5 rounded-full"
                    >
                      {terpene}
                    </span>
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
