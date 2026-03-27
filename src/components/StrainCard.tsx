import type { Strain } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

const effectColors: Record<string, string> = {
  relax: "bg-blue-500/20 text-blue-400",
  energy: "bg-yellow-500/20 text-yellow-400",
  creative: "bg-purple-500/20 text-purple-400",
  sleep: "bg-indigo-500/20 text-indigo-400",
  euphoria: "bg-pink-500/20 text-pink-400",
};

const effectEmoji: Record<string, string> = {
  relax: "😌",
  energy: "⚡",
  creative: "🎨",
  sleep: "😴",
  euphoria: "✨",
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
  const imageUrl = strain.image ? urlFor(strain.image)?.width(400).height(300).url() : null;
  const gradient = gradients[index % gradients.length];

  // TODO: Replace with actual messenger URL
  // TODO: Replace with actual messenger URL with pre-filled message
  const reserveUrl = `#contact`;

  return (
    <a
      href={`/${locale}/strains/${strain.slug.current}`}
      className="group block bg-bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${strain.name} cannabis strain — ${strain.effect} effect, available at Labs Cannabis Pattaya`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-4xl opacity-30">🌿</span>
          </div>
        )}

        <span
          className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${
            effectColors[strain.effect] || "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {effectEmoji[strain.effect]} {strain.effect}
        </span>

        {strain.isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-lg font-bold text-text-muted uppercase tracking-wider">
              {soldOutLabel}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-text-primary mb-1 group-hover:text-emerald-400 transition-colors">
          {strain.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <span className="capitalize">{strain.type}</span>
          <span>·</span>
          <span>THC {strain.thcPercent}%</span>
          {strain.cbdPercent ? (
            <>
              <span>·</span>
              <span>CBD {strain.cbdPercent}%</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 font-semibold">
            ฿{strain.pricePerGram}/g
          </span>
          {strain.isSoldOut ? (
            <span className="text-xs text-text-muted px-3 py-1.5 rounded-lg bg-bg-secondary cursor-not-allowed">
              {soldOutLabel}
            </span>
          ) : (
            <span
              onClick={(e) => {
                e.preventDefault();
                window.location.href = reserveUrl;
              }}
              className="text-xs text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              {reserveLabel}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
