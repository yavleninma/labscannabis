export const FOOTER_SEO_SECTIONS = [
  {
    titleKey: "areasTitle" as const,
    links: [
      { slug: "buy-cannabis-pattaya", labelKey: "pattaya" as const },
      { slug: "cannabis-jomtien", labelKey: "jomtien" as const },
      { slug: "cannabis-near-walking-street", labelKey: "walkingStreet" as const },
      { slug: "cannabis-soi-hollywood", labelKey: "soiHollywood" as const },
      { slug: "cannabis-naklua", labelKey: "naklua" as const },
    ],
  },
  {
    titleKey: "buyTitle" as const,
    links: [
      { slug: "1g-cannabis-pattaya", labelKey: "w1g" as const },
      { slug: "10g-cannabis-pattaya", labelKey: "w10g" as const },
      { slug: "30g-cannabis-pattaya", labelKey: "w30g" as const },
      { slug: "100g-cannabis-pattaya", labelKey: "w100g" as const },
      { slug: "1kg-cannabis-pattaya", labelKey: "w1kg" as const },
      { slug: "cannabis-wholesale-pattaya", labelKey: "wholesale" as const },
    ],
  },
  {
    titleKey: "moreTitle" as const,
    links: [
      { slug: "cannabis-delivery-pattaya", labelKey: "delivery" as const },
      { slug: "delivery/pattaya", labelKey: "pattayaDelivery" as const },
      { slug: "best-cannabis-shop-pattaya", labelKey: "bestShop" as const },
      { slug: "white-widow-pattaya", labelKey: "whiteWidow" as const },
      { slug: "strains/white-widow", labelKey: "strainPage" as const },
      { slug: "guides/legal-cannabis-tourists", labelKey: "legalGuide" as const },
    ],
  },
] as const;
