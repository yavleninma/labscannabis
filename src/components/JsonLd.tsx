import { getSiteUrl } from "@/lib/site-url";

type Locale = "en" | "ru" | "th";

interface JsonLdProps {
  locale: Locale;
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
}

export function JsonLd({
  locale,
  openTime = "12:00",
  closeTime = "01:00",
  isOpen24h = false,
}: JsonLdProps) {
  const baseUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/${locale}`,
    name: "Labs Cannabis",
    description:
      locale === "ru"
        ? "Лицензированный медицинский каннабис-диспансер в Южной Паттайе. Кураторский выбор сортов, помощь с оформлением на месте."
        : locale === "th"
          ? "ร้านกัญชาทางการแพทย์ที่ได้รับอนุญาตในพัทยาใต้ สายพันธุ์คัดสรร บริการช่วยเหลือจัดทำเอกสารทันที"
          : "Licensed medical cannabis dispensary in South Pattaya. Curated strain selection, on-site medical card assistance.",
    url: `${baseUrl}/${locale}`,
    telephone: "", // TODO: Add phone number
    image: `${baseUrl}/og-image.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "32 Pattaya 13 Alley (Soi Hollywood)",
      addressLocality: "South Pattaya",
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
      ratingValue: "4.8",
      reviewCount: "91",
      bestRating: "5",
    },
    priceRange: "฿฿",
    currenciesAccepted: "THB",
    paymentAccepted: "Cash, Credit Card",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
