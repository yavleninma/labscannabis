import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface SpecialOfferBannerProps {
  locale: string;
}

const PRICING_TIERS = ["tier1", "tier2", "tier3"] as const;

export async function SpecialOfferBanner({ locale }: SpecialOfferBannerProps) {
  const t = await getTranslations({ locale, namespace: "specialOffer" });

  return (
    <aside
      className="relative mx-auto w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:max-w-[300px] lg:mx-0"
      aria-label={t("imageAlt")}
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src="/images/special-offer-joints.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 280px, 300px"
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/95 via-black/80 to-transparent px-3 pb-10 pt-3 sm:px-3.5 sm:pt-3.5">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:text-[11px]">
            {t("pricingTitle")}
          </p>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier}
                className="rounded-lg border border-white/15 bg-black/55 px-1.5 py-2 text-center backdrop-blur-sm sm:px-2"
              >
                <p className="text-[10px] font-semibold uppercase leading-tight text-white/90 sm:text-[11px]">
                  {t(`${tier}Amount`)}
                </p>
                <p
                  className="mt-0.5 text-sm font-extrabold leading-none text-amber-300 sm:text-base"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
                >
                  {t(`${tier}Price`)}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-2.5 text-center text-[11px] font-semibold leading-snug text-white sm:text-xs"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}
          >
            {t("strainsInStock")}
          </p>
        </div>
      </div>
    </aside>
  );
}
