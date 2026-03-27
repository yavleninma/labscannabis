import { useTranslations } from "next-intl";
import { GOOGLE_PLACE_QUERY } from "@/lib/constants";

const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_PLACE_QUERY)}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(GOOGLE_PLACE_QUERY)}&output=embed`;

interface LocationSectionProps {
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
}

function getHoursLabel(
  t: ReturnType<typeof useTranslations>,
  openTime: string,
  closeTime: string,
  isOpen24h: boolean
): string {
  if (isOpen24h || openTime === closeTime) {
    return t("hoursValue24_7");
  }
  return t("hoursValueDynamic", { open: openTime, close: closeTime });
}

export function LocationSection({
  openTime = "12:00",
  closeTime = "01:00",
  isOpen24h = false,
}: LocationSectionProps) {
  const t = useTranslations("location");
  const hoursLabel = getHoursLabel(t, openTime, closeTime, isOpen24h);
  const directionSteps = [t("directions.step1"), t("directions.step2"), t("directions.step3")];
  const routePhotoCards = [
    { title: t("photoGuide.photo1Title"), description: t("photoGuide.photo1Desc") },
    { title: t("photoGuide.photo2Title"), description: t("photoGuide.photo2Desc") },
    { title: t("photoGuide.photo3Title"), description: t("photoGuide.photo3Desc") },
  ];

  return (
    <section id="location" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border border-border aspect-[4/3]">
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Labs Cannabis location on Google Maps"
            />
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div>
              <p className="text-text-primary font-medium mb-1">
                {t("address")}
              </p>
              <p className="text-text-secondary text-sm">
                32 Pattaya 13 Alley (Soi Hollywood)
                <br />
                South Pattaya, Chon Buri 20150
              </p>
            </div>

            <div>
              <p className="text-text-primary font-medium mb-1">
                {t("landmark")}
              </p>
              <p className="text-text-secondary text-sm">
                {t("landmarkDesc")}
              </p>
            </div>

            <div>
              <p className="text-text-primary font-medium mb-2">{t("directions.title")}</p>
              <ul className="space-y-2">
                {directionSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2 text-text-secondary text-sm">
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-text-primary font-medium mb-1">
                {t("hours")}
              </p>
              <p className="text-text-secondary text-sm">
                {hoursLabel}
              </p>
            </div>

            <div>
              <p className="text-text-primary font-medium mb-2">{t("photoGuide.title")}</p>
              <p className="text-text-secondary text-sm mb-3">{t("photoGuide.subtitle")}</p>
              <div className="grid grid-cols-1 gap-2">
                {routePhotoCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-lg border border-dashed border-border px-3 py-2 bg-bg-card/40"
                  >
                    <p className="text-text-primary text-sm font-medium">{card.title}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-card border border-border hover:border-emerald-500/30 text-text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("openInMaps")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
