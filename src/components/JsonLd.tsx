import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site-url";
import { DEFAULT_GOOGLE_RATING, DEFAULT_GOOGLE_REVIEW_COUNT, GOOGLE_LISTING_URL } from "@/lib/constants";

interface JsonLdProps {
  locale: AppLocale;
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
  googleRating?: number;
  googleReviewCount?: number;
  phone?: string | null;
}

export async function JsonLd({
  locale,
  openTime = "12:00",
  closeTime = "01:00",
  isOpen24h = false,
  googleRating,
  googleReviewCount,
  phone,
}: JsonLdProps) {
  const meta = await getTranslations({ locale, namespace: "meta" });
  const t = await getTranslations({ locale, namespace: "faq" });

  const baseUrl = getSiteUrl();
  const rating = googleRating ?? DEFAULT_GOOGLE_RATING;
  const reviewCount = googleReviewCount ?? DEFAULT_GOOGLE_REVIEW_COUNT;

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": `${baseUrl}/#business`,
    name: "Labs Cannabis",
    description: meta("description"),
    url: `${baseUrl}/${locale}`,
    ...(phone ? { telephone: phone } : {}),
    image: `${baseUrl}/opengraph-image`,
    sameAs: [GOOGLE_LISTING_URL],
    address: {
      "@type": "PostalAddress",
      streetAddress: "32 Pattaya 13 Alley (Soi Hollywood)",
      addressLocality: "Pattaya",
      addressRegion: "Chon Buri",
      postalCode: "20150",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9236,
      longitude: 100.8825,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: isOpen24h ? "00:00" : openTime,
      closes: isOpen24h ? "23:59" : closeTime,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(rating),
      reviewCount: String(reviewCount),
      bestRating: "5",
    },
    priceRange: "฿฿",
    currenciesAccepted: "THB",
    paymentAccepted: "Cash, QR Bank Transfer",
  };

  const faqKeys = ["8", "1", "2", "3", "4", "5", "6", "7"] as const;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqKeys.map((key) => ({
      "@type": "Question",
      name: t(`q${key}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`a${key}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
