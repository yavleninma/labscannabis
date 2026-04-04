import type { AutomatedLocale } from "@/i18n/config";
import type { PortableTextBlock } from "./portable-text";

export interface StrainTranslation {
  locale: AutomatedLocale;
  shortDescription?: string | null;
  fullDescription?: PortableTextBlock[] | null;
  sourceHash?: string | null;
  translatedAt?: string | null;
  model?: string | null;
}

export interface Strain {
  _id: string;
  _updatedAt?: string;
  name: string;
  slug: { current: string };
  image: { asset: { _ref: string } } | null;
  type: "indica" | "sativa" | "hybrid";
  effect:
    | "relax"
    | "energy"
    | "creative"
    | "sleep"
    | "euphoria"
    | "focus"
    | "happy"
    | "uplifted"
    | "talkative"
    | "hungry"
    | null;
  effects?: {
    key:
      | "relax"
      | "energy"
      | "creative"
      | "sleep"
      | "euphoria"
      | "focus"
      | "happy"
      | "uplifted"
      | "talkative"
      | "hungry";
    amount: number;
  }[] | null;
  thcPercent: number | null;
  cbdPercent: number | null;
  pricePerGram: number;
  shortDescription: string;
  shortDescriptionRu?: string | null;
  shortDescriptionTh?: string | null;
  fullDescription: PortableTextBlock[] | null;
  fullDescriptionRu?: PortableTextBlock[] | null;
  fullDescriptionTh?: PortableTextBlock[] | null;
  translations?: StrainTranslation[] | null;
  terpenes: string[] | null;
  terpeneProfile?: { name: string; amount: number }[] | null;
  isStaffPick: boolean;
  isSoldOut: boolean;
  isHidden?: boolean;
  sortOrder: number;
}

export interface ShopSettings {
  openTime: string;
  closeTime: string;
  isOpen24h?: boolean;
  lineUrl: string | null;
  lineId?: string | null;
  whatsappUrl: string | null;
  whatsappNumber?: string | null;
  telegramUrl: string | null;
  telegramId?: string | null;
  phone?: string | null;
  announcement: string | null;
  googleRating?: number;
  googleReviewCount?: number;
  guidePhoto?: { asset: { _ref: string } } | null;
  teamPhoto?: { asset: { _ref: string } } | null;
}

export const mockStrains: Strain[] = [
  {
    _id: "1",
    name: "Blue Dream",
    slug: { current: "blue-dream" },
    image: null,
    type: "hybrid",
    effect: "creative",
    effects: [
      { key: "creative", amount: 5 },
      { key: "uplifted", amount: 4 },
      { key: "happy", amount: 3 },
    ],
    thcPercent: 21,
    cbdPercent: 0.2,
    pricePerGram: 450,
    shortDescription: "A balanced hybrid delivering gentle cerebral invigoration with full-body relaxation. Sweet berry aroma.",
    fullDescription: null,
    terpenes: ["Myrcene", "Caryophyllene", "Pinene"],
    terpeneProfile: [
      { name: "Myrcene", amount: 42 },
      { name: "Caryophyllene", amount: 31 },
      { name: "Pinene", amount: 27 },
    ],
    isStaffPick: true,
    isSoldOut: false,
    sortOrder: 1,
  },
  {
    _id: "2",
    name: "Northern Lights",
    slug: { current: "northern-lights" },
    image: null,
    type: "indica",
    effect: "relax",
    effects: [
      { key: "relax", amount: 5 },
      { key: "sleep", amount: 3 },
      { key: "euphoria", amount: 2 },
    ],
    thcPercent: 18,
    cbdPercent: 0.1,
    pricePerGram: 400,
    shortDescription: "Pure indica legend. Deep body relaxation with a dreamy euphoria. Earthy, pine-forward taste.",
    fullDescription: null,
    terpenes: ["Myrcene", "Limonene", "Caryophyllene"],
    terpeneProfile: [
      { name: "Myrcene", amount: 38 },
      { name: "Limonene", amount: 34 },
      { name: "Caryophyllene", amount: 28 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 2,
  },
  {
    _id: "3",
    name: "Green Crack",
    slug: { current: "green-crack" },
    image: null,
    type: "sativa",
    effect: "energy",
    effects: [
      { key: "energy", amount: 5 },
      { key: "focus", amount: 4 },
      { key: "happy", amount: 3 },
    ],
    thcPercent: 24,
    cbdPercent: null,
    pricePerGram: 500,
    shortDescription: "Sharp focus and energy without anxiety. Tangy mango flavor that keeps you coming back.",
    fullDescription: null,
    terpenes: ["Myrcene", "Caryophyllene", "Ocimene"],
    terpeneProfile: [
      { name: "Ocimene", amount: 41 },
      { name: "Myrcene", amount: 33 },
      { name: "Caryophyllene", amount: 26 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 3,
  },
  {
    _id: "4",
    name: "Granddaddy Purple",
    slug: { current: "granddaddy-purple" },
    image: null,
    type: "indica",
    effect: "sleep",
    effects: [
      { key: "sleep", amount: 5 },
      { key: "relax", amount: 4 },
      { key: "hungry", amount: 2 },
    ],
    thcPercent: 20,
    cbdPercent: 0.3,
    pricePerGram: 450,
    shortDescription: "The ultimate nighttime strain. Grape and berry aroma with a heavy, sedating body high.",
    fullDescription: null,
    terpenes: ["Myrcene", "Pinene", "Caryophyllene"],
    terpeneProfile: [
      { name: "Myrcene", amount: 46 },
      { name: "Pinene", amount: 28 },
      { name: "Caryophyllene", amount: 26 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 4,
  },
  {
    _id: "5",
    name: "Jack Herer",
    slug: { current: "jack-herer" },
    image: null,
    type: "sativa",
    effect: "creative",
    effects: [
      { key: "creative", amount: 4 },
      { key: "talkative", amount: 4 },
      { key: "energy", amount: 3 },
    ],
    thcPercent: 23,
    cbdPercent: null,
    pricePerGram: 500,
    shortDescription: "Award-winning sativa. Blissful, clear-headed creativity with a spicy pine aroma.",
    fullDescription: null,
    terpenes: ["Terpinolene", "Caryophyllene", "Pinene"],
    terpeneProfile: [
      { name: "Terpinolene", amount: 45 },
      { name: "Caryophyllene", amount: 29 },
      { name: "Pinene", amount: 26 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 5,
  },
  {
    _id: "6",
    name: "OG Kush",
    slug: { current: "og-kush" },
    image: null,
    type: "hybrid",
    effect: "relax",
    effects: [
      { key: "relax", amount: 4 },
      { key: "happy", amount: 3 },
      { key: "hungry", amount: 2 },
    ],
    thcPercent: 22,
    cbdPercent: 0.1,
    pricePerGram: 480,
    shortDescription: "The classic. Stress melts away with its earthy, piney punch and mellow euphoria.",
    fullDescription: null,
    terpenes: ["Myrcene", "Limonene", "Caryophyllene"],
    terpeneProfile: [
      { name: "Myrcene", amount: 37 },
      { name: "Limonene", amount: 35 },
      { name: "Caryophyllene", amount: 28 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 6,
  },
  {
    _id: "7",
    name: "Durban Poison",
    slug: { current: "durban-poison" },
    image: null,
    type: "sativa",
    effect: "energy",
    effects: [
      { key: "energy", amount: 5 },
      { key: "focus", amount: 4 },
      { key: "uplifted", amount: 3 },
    ],
    thcPercent: 19,
    cbdPercent: null,
    pricePerGram: 420,
    shortDescription: "Pure African sativa. Uplifting and energizing with sweet, spicy flavors. Great for daytime.",
    fullDescription: null,
    terpenes: ["Terpinolene", "Myrcene", "Ocimene"],
    terpeneProfile: [
      { name: "Terpinolene", amount: 44 },
      { name: "Ocimene", amount: 32 },
      { name: "Myrcene", amount: 24 },
    ],
    isStaffPick: false,
    isSoldOut: false,
    sortOrder: 7,
  },
  {
    _id: "8",
    name: "Purple Punch",
    slug: { current: "purple-punch" },
    image: null,
    type: "indica",
    effect: "sleep",
    effects: [
      { key: "sleep", amount: 5 },
      { key: "relax", amount: 4 },
      { key: "euphoria", amount: 2 },
    ],
    thcPercent: 20,
    cbdPercent: 0.1,
    pricePerGram: 460,
    shortDescription: "Dessert-like grape candy flavor. Sedating body effects perfect for winding down at night.",
    fullDescription: null,
    terpenes: ["Caryophyllene", "Limonene", "Pinene"],
    terpeneProfile: [
      { name: "Caryophyllene", amount: 36 },
      { name: "Limonene", amount: 33 },
      { name: "Pinene", amount: 31 },
    ],
    isStaffPick: false,
    isSoldOut: true,
    sortOrder: 8,
  },
];

export const mockShopSettings: ShopSettings = {
  openTime: "12:00",
  closeTime: "01:00",
  isOpen24h: false,
  lineUrl: null, // TODO: Add LINE URL
  lineId: null,
  whatsappUrl: null, // TODO: Add WhatsApp URL
  whatsappNumber: null,
  telegramUrl: null, // TODO: Add Telegram URL
  telegramId: null,
  phone: "+66 66 080 6784",
  announcement: null,
  googleRating: 4.8,
  googleReviewCount: 91,
  guidePhoto: null,
  teamPhoto: null,
};
