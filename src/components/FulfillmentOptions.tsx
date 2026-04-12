import { getTranslations } from "next-intl/server";
import type { ShopSettings } from "@/lib/mock-data";
import { buildContactLinks, type ContactLocale } from "@/lib/contact-links";
import { GOOGLE_LISTING_URL } from "@/lib/constants";

interface FulfillmentOptionsProps {
  shopSettings: ShopSettings;
  locale: string;
}

type CardKey = "walkin" | "pickup" | "delivery";

interface CardConfig {
  key: CardKey;
  icon: string;
  href: string;
  external: boolean;
}

export async function FulfillmentOptions({
  shopSettings,
  locale,
}: FulfillmentOptionsProps) {
  const t = await getTranslations({ locale, namespace: "fulfillment" });

  const pickupLinks = buildContactLinks(shopSettings, locale as ContactLocale, {
    kind: "pickup",
  });
  const deliveryLinks = buildContactLinks(shopSettings, locale as ContactLocale, {
    kind: "delivery",
  });

  const pickupHref =
    pickupLinks.whatsapp || pickupLinks.telegram || pickupLinks.line || pickupLinks.phone;
  const deliveryHref =
    deliveryLinks.whatsapp ||
    deliveryLinks.telegram ||
    deliveryLinks.line ||
    deliveryLinks.phone;

  const pickupEnabled = shopSettings.pickupEnabled !== false && Boolean(pickupHref);
  const deliveryEnabled = shopSettings.deliveryEnabled !== false && Boolean(deliveryHref);

  const cards: CardConfig[] = [
    {
      key: "walkin",
      icon: "🏪",
      href: GOOGLE_LISTING_URL,
      external: true,
    },
  ];

  if (pickupEnabled && pickupHref) {
    cards.push({ key: "pickup", icon: "📦", href: pickupHref, external: true });
  }

  if (deliveryEnabled && deliveryHref) {
    cards.push({ key: "delivery", icon: "🛵", href: deliveryHref, external: true });
  }

  const gridColsClass =
    cards.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : cards.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1";

  const note = shopSettings.fulfillmentNote?.trim();

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 sm:p-10">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
          </h2>
          <p className="text-text-secondary mb-8 text-base sm:text-lg">
            {t("subtitle")}
          </p>

          {note && (
            <p className="mb-6 text-sm text-emerald-400">
              {note}
            </p>
          )}

          <div className={`grid ${gridColsClass} gap-4 sm:gap-5`}>
            {cards.map((card) => (
              <div
                key={card.key}
                className="flex flex-col bg-bg-card border border-border rounded-xl p-5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-xl"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {t(`${card.key}.title`)}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  {t(`${card.key}.desc`)}
                </p>
                <ul className="space-y-1.5 mb-5 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5" aria-hidden="true">✓</span>
                    <span>{t(`${card.key}.point1`)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5" aria-hidden="true">✓</span>
                    <span>{t(`${card.key}.point2`)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5" aria-hidden="true">✓</span>
                    <span>{t(`${card.key}.point3`)}</span>
                  </li>
                </ul>
                <a
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {t(`${card.key}.cta`)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
