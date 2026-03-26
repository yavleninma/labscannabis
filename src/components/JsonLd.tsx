type Locale = "en" | "ru" | "th";

const descriptions: Record<Locale, string> = {
  en: "Licensed medical cannabis dispensary on Soi Hollywood, South Pattaya. Premium flower, free consultations with licensed practitioner. Best weed shop in Pattaya.",
  ru: "Лицензированный медицинский каннабис-диспансер на Сои Голливуд, Южная Паттайя. Премиальные сорта, бесплатные консультации лицензированного специалиста.",
  th: "ร้านกัญชาทางการแพทย์ที่ได้รับใบอนุญาต ซอยฮอลลีวูด พัทยาใต้ ดอกกัญชาพรีเมียม ปรึกษาแพทย์แผนไทยฟรี",
};

export function JsonLd({ locale }: { locale: Locale }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Labs Cannabis",
    description: descriptions[locale],
    // TODO: Replace with actual domain
    url: `https://labscannabis.com/${locale}`,
    telephone: "+66660806784",
    address: {
      "@type": "PostalAddress",
      streetAddress: "32 Pattaya 13 Alley (Soi Hollywood)",
      addressLocality: "Pattaya City",
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
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    // TODO: Add actual image URL
    image: "https://labscannabis.com/og-image.jpg",
    sameAs: [
      // TODO: Add social media links
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "50",
      bestRating: "5",
    },
    medicalSpecialty: "Thai Traditional Medicine",
    currenciesAccepted: "THB",
    paymentAccepted: "Cash, Credit Card",
    areaServed: {
      "@type": "City",
      name: "Pattaya",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
