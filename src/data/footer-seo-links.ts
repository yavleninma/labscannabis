export const FOOTER_SEO_SECTIONS = [
  {
    titleKey: "areasTitle" as const,
    links: [
      { slug: "areas/pattaya", labelKey: "pattaya" as const },
      { slug: "areas/walking-street", labelKey: "walkingStreet" as const },
      { slug: "areas/soi-hollywood", labelKey: "soiHollywood" as const },
      { slug: "areas/soi-buakhao", labelKey: "soiBuakhao" as const },
      { slug: "areas/jomtien", labelKey: "jomtien" as const },
      { slug: "areas/naklua", labelKey: "naklua" as const },
    ],
  },
  {
    titleKey: "buyTitle" as const,
    links: [
      { slug: "cannabis-near-me-pattaya", labelKey: "nearMe" as const },
      { slug: "buy-cannabis-pattaya", labelKey: "pattaya" as const },
      { slug: "how-to-buy-cannabis-pattaya", labelKey: "howToBuy" as const },
      { slug: "best-cannabis-shop-pattaya", labelKey: "bestShop" as const },
      { slug: "wholesale", labelKey: "wholesale" as const },
    ],
  },
  {
    titleKey: "moreTitle" as const,
    links: [
      { slug: "delivery/pattaya", labelKey: "pattayaDelivery" as const },
      { slug: "delivery/jomtien", labelKey: "jomtien" as const },
      { slug: "strains/white-widow", labelKey: "strainPage" as const },
      { slug: "guides/legal-cannabis-tourists", labelKey: "legalGuide" as const },
    ],
  },
] as const;
