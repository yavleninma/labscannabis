import type { Strain } from "@/lib/mock-data";
import { urlFor } from "@/sanity/image";

interface StrainJsonLdProps {
  strain: Strain;
  locale: string;
  baseUrl: string;
  breadcrumbStrainsLabel: string;
}

export function StrainJsonLd({
  strain,
  locale,
  baseUrl,
  breadcrumbStrainsLabel,
}: StrainJsonLdProps) {
  const imageUrl = strain.image ? urlFor(strain.image)?.width(800).height(600).url() : null;
  const strainUrl = `${baseUrl}/${locale}/strains/${strain.slug.current}`;

  const additionalProperty = [];
  if (typeof strain.thcPercent === "number") {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "THC",
      value: `${strain.thcPercent}%`,
    });
  }
  if (typeof strain.cbdPercent === "number") {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "CBD",
      value: `${strain.cbdPercent}%`,
    });
  }
  if (strain.type) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Type",
      value: strain.type,
    });
  }

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: strain.name,
    ...(strain.shortDescription ? { description: strain.shortDescription } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: strainUrl,
    brand: {
      "@type": "Brand",
      name: "Labs Cannabis",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      price: String(strain.pricePerGram),
      availability: strain.isSoldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: "Labs Cannabis",
        "@id": `${baseUrl}/${locale}`,
      },
    },
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Labs Cannabis",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbStrainsLabel,
        item: `${baseUrl}/${locale}#catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: strain.name,
        item: strainUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
