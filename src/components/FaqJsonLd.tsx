import { getTranslations } from "next-intl/server";

type Locale = "en" | "ru" | "th";

interface FaqJsonLdProps {
  locale: Locale;
}

export async function FaqJsonLd({ locale }: FaqJsonLdProps) {
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
    />
  );
}
