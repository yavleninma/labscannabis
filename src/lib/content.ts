import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export interface SeoContent {
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  closing: string;
}

const FALLBACK: SeoContent = {
  h1: "Labs Cannabis Pattaya",
  intro:
    "Premium indoor cannabis on Soi Hollywood, 5 minutes from Walking Street. White Widow flagship, weight tiers from 1g to 1kg. Message us on WhatsApp for same-day pickup.",
  sections: [
    {
      h2: "Walk-in shop on Soi Hollywood",
      body:
        "Labs Cannabis (formerly Labs Dispensary) is a licensed retailer at 32 Pattaya 13 Alley. Fresh buds, transparent weight pricing, and friendly staff — including Russian-speaking host Dima.",
    },
    {
      h2: "Weight tiers — save more when you buy more",
      body:
        "Start with 1g at 300฿ or grab our most popular 10g at 1,800฿. Wholesale up to 1kg at 40,000฿. Tap any tier on our price list to open WhatsApp with a pre-filled order.",
    },
  ],
  faq: [
    {
      q: "Do I need a medical card?",
      a: "Yes, Thailand requires a medical card for adults 20+. We help you complete it on-site in about 2 minutes.",
    },
    {
      q: "How do I order?",
      a: "WhatsApp +66 66 080 6784 — we usually reply within 5 minutes during shop hours.",
    },
    {
      q: "Is wholesale available?",
      a: "100g to 1kg tiers are listed. Message us first to confirm stock for large orders.",
    },
  ],
  closing: "Ready? Message us on WhatsApp or walk in today on Soi Hollywood.",
};

export function loadSeoContent(locale: Locale, slug: string): SeoContent {
  const cachePath = path.join(process.cwd(), "content-cache", locale, `${slug}.json`);
  if (fs.existsSync(cachePath)) {
    try {
      return JSON.parse(fs.readFileSync(cachePath, "utf8")) as SeoContent;
    } catch {
      return FALLBACK;
    }
  }
  return FALLBACK;
}
