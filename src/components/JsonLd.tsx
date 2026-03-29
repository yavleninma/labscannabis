import { getSiteUrl } from "@/lib/site-url";
import { DEFAULT_GOOGLE_RATING, DEFAULT_GOOGLE_REVIEW_COUNT } from "@/lib/constants";

type Locale = "en" | "ru" | "th";

interface JsonLdProps {
  locale: Locale;
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
  googleRating?: number;
  googleReviewCount?: number;
  phone?: string | null;
}

const descriptions: Record<Locale, string> = {
  en: "Licensed cannabis shop in Pattaya. On-site medical card in 2 minutes, walk-in friendly. 5 min from Walking Street. Russian- and English-speaking staff.",
  ru: "Лицензированный каннабис-шоп в Паттайе. Медкарта за 2 минуты на месте, без записи. 5 минут от Walking Street. Говорим по-русски.",
  th: "ร้านกัญชาที่ได้รับอนุญาตในพัทยา บัตรทางการแพทย์ภายใน 2 นาที เดินเข้ามาได้เลย 5 นาทีจาก Walking Street",
};

export function JsonLd({
  locale,
  openTime = "12:00",
  closeTime = "01:00",
  isOpen24h = false,
  googleRating,
  googleReviewCount,
  phone,
}: JsonLdProps) {
  const baseUrl = getSiteUrl();
  const rating = googleRating ?? DEFAULT_GOOGLE_RATING;
  const reviewCount = googleReviewCount ?? DEFAULT_GOOGLE_REVIEW_COUNT;

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    name: "LABS Cannabis",
    description: descriptions[locale],
    url: `${baseUrl}/${locale}`,
    ...(phone ? { telephone: phone } : {}),
    image: `${baseUrl}/og-image.svg`,
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
      latitude: 12.9233467,
      longitude: 100.8771557,
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
      closes: isOpen24h ? "00:00" : closeTime,
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd).replace(/</g, "\\u003c") }}
    />
  );
}
