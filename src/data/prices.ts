export type PriceHighlight = "popular" | "wholesale";

export interface PriceTier {
  weight: string;
  grams: number;
  total: number;
  perGram: number;
  savingsPct: number;
  label: string;
  waSlug: string;
  highlight?: PriceHighlight;
}

export const PRICE_LADDER: readonly PriceTier[] = [
  { weight: "1g", grams: 1, total: 300, perGram: 300, savingsPct: 0, label: "tryout", waSlug: "1g" },
  { weight: "3g", grams: 3, total: 600, perGram: 200, savingsPct: 33, label: "evening", waSlug: "3g" },
  { weight: "10g", grams: 10, total: 1800, perGram: 180, savingsPct: 40, label: "popular", waSlug: "10g", highlight: "popular" },
  { weight: "30g", grams: 30, total: 4500, perGram: 150, savingsPct: 50, label: "monthly", waSlug: "30g" },
  { weight: "100g", grams: 100, total: 10000, perGram: 100, savingsPct: 67, label: "bulk", waSlug: "100g" },
  { weight: "1kg", grams: 1000, total: 40000, perGram: 40, savingsPct: 87, label: "wholesale", waSlug: "1kg", highlight: "wholesale" },
] as const;

export const MAX_PER_GRAM = PRICE_LADDER[0].perGram;
