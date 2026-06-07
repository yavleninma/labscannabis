import type { Locale } from "@/lib/i18n";

export interface SeoContent {
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  closing: string;
  source?: "openai" | "fallback";
}

const COMPLIANCE_FAQ = [
  {
    q: "Can I buy through this website?",
    a: "No. This website is for general information and compliance inquiries only. No online sale, reservation, delivery, or payment is completed here.",
  },
  {
    q: "What should I ask on WhatsApp?",
    a: "Ask what Thai medical documentation is required, whether you are eligible to visit, and how to find the shop on Soi Hollywood.",
  },
  {
    q: "Is this medical advice?",
    a: "No. Only a licensed Thai medical professional can assess medical eligibility or issue valid documentation.",
  },
];

const FALLBACK: SeoContent = {
  h1: "Labs Cannabis Pattaya inquiry",
  intro:
    "General information for adults in Pattaya who want to understand lawful medical cannabis access before visiting a licensed local shop.",
  sections: [
    {
      h2: "Check requirements before visiting",
      body:
        "Cannabis flower in Thailand is restricted to lawful medical and licensed channels. Use WhatsApp to ask what documentation is needed before you travel to Soi Hollywood.",
    },
    {
      h2: "Plan the visit",
      body:
        "The public site does not sell, reserve, deliver, or accept payment for cannabis flower. Contact is for eligibility questions, directions, and visit coordination only.",
    },
  ],
  faq: COMPLIANCE_FAQ,
  closing: "Message Labs Cannabis to ask compliance questions before visiting.",
  source: "fallback",
};

export function seoDescription(content: SeoContent, max = 160): string {
  const text = content.intro.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

function areaFromSlug(slug: string): string {
  if (slug.includes("jomtien")) return "Jomtien";
  if (slug.includes("walking-street")) return "Walking Street";
  if (slug.includes("soi-hollywood")) return "Soi Hollywood";
  if (slug.includes("naklua")) return "Naklua";
  if (slug.includes("pratumnak")) return "Pratumnak";
  if (slug.includes("central-pattaya")) return "Central Pattaya";
  return "Pattaya";
}

export function safeSeoTitle(slug: string, _fallbackTitle: string): string {
  const area = areaFromSlug(slug);
  if (slug.includes("wholesale") || slug.includes("100g") || slug.includes("1kg")) {
    return "Licensed cannabis business inquiry in Pattaya | Labs Cannabis";
  }
  if (slug.includes("delivery")) {
    return `Cannabis visit guidance for ${area} | Labs Cannabis`;
  }
  if (slug.includes("white-widow")) {
    return "White Widow information in Pattaya | Labs Cannabis";
  }
  if (slug.includes("cheap")) {
    return "Cannabis eligibility information in Pattaya | Labs Cannabis";
  }
  if (slug.includes("best")) {
    return "Labs Cannabis Pattaya | Visit information";
  }
  if (slug.includes("labs-dispensary")) {
    return "Labs Cannabis formerly Labs Dispensary | Visit information";
  }
  if (slug.includes("weed-shop") || slug.includes("marijuana-shop") || slug.includes("buy-cannabis")) {
    return `Medical cannabis eligibility information near ${area} | Labs Cannabis`;
  }
  return `Cannabis eligibility information near ${area} | Labs Cannabis`;
}

export function loadSeoContent(locale: Locale, slug: string): SeoContent {
  const area = areaFromSlug(slug);
  const isWholesale = slug.includes("wholesale") || slug.includes("100g") || slug.includes("1kg");
  const isDelivery = slug.includes("delivery");
  const isStrain = slug.includes("white-widow");

  if (isWholesale) {
    return {
      h1: "Licensed cannabis business inquiry in Pattaya",
      intro:
        "For business or bulk-related questions, Labs Cannabis can only discuss next steps after licence, lawful-use, and documentation checks.",
      sections: [
        {
          h2: "Verification comes first",
          body:
            "The public site does not publish a wholesale menu, quantities, prices, shipment terms, or payment options. Any discussion is subject to Thai licence and compliance review.",
        },
        {
          h2: "Documents before details",
          body:
            "Verified counterparties may ask what source, batch, and traceability documents can be reviewed where legally permitted. No transaction is confirmed online.",
        },
      ],
      faq: [
        {
          q: "Can I request a public wholesale price list?",
          a: "No. Public price lists and quantity offers are not published here. Business inquiries start with licence and lawful-use verification.",
        },
        {
          q: "Can this website confirm stock or reserve flower?",
          a: "No. This website does not confirm stock, reserve products, arrange delivery, or accept payment.",
        },
      ],
      closing: "Use WhatsApp for a compliance-first business inquiry.",
      source: "fallback",
    };
  }

  if (isDelivery) {
    return {
      h1: `Cannabis visit guidance for ${area}`,
      intro:
        "If you are in Pattaya, ask Labs Cannabis what documentation is required before travelling to the shop. Online sale or delivery is not completed through this website.",
      sections: [
        {
          h2: "No online sale",
          body:
            "WhatsApp is only for general questions, eligibility guidance, and directions. Cannabis flower access must follow Thai medical and licensed-channel requirements.",
        },
        {
          h2: "Directions and timing",
          body:
            "The shop is on Pattaya 13 Alley, also known as Soi Hollywood, near Walking Street. Ask before visiting if you are unsure what to bring.",
        },
      ],
      faq: [
        {
          q: "Can I arrange delivery here?",
          a: "No delivery, reservation, payment, or online sale is completed through this website.",
        },
        {
          q: "Can I ask questions before travelling?",
          a: "Yes. Ask what documentation is needed and how to find the shop.",
        },
      ],
      closing: "Ask compliance questions before visiting from your area.",
      source: "fallback",
    };
  }

  if (isStrain) {
    return {
      h1: "White Widow information in Pattaya",
      intro:
        "A general information page for adults asking about lawful medical cannabis access in Pattaya. Availability and suitability cannot be confirmed online.",
      sections: [
        {
          h2: "Ask before visiting",
          body:
            "Use WhatsApp for documentation and visit questions only. The public page is not a product menu, offer, reservation, or medical recommendation.",
        },
        {
          h2: "Compliance first",
          body:
            "Only a licensed Thai medical professional can assess eligibility. Any product discussion must follow current Thai rules.",
        },
      ],
      faq: COMPLIANCE_FAQ,
      closing: "Message Labs Cannabis for compliance information before visiting.",
      source: "fallback",
    };
  }

  return {
    ...FALLBACK,
    h1: `Cannabis information near ${area}`,
    intro: `General information for adults near ${area} who want to ask about lawful medical cannabis access and directions before visiting Labs Cannabis in Pattaya.`,
  };
}

export const HOME_FAQ = COMPLIANCE_FAQ;
