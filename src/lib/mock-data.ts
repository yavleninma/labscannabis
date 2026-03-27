export interface Strain {
  _id: string;
  name: string;
  slug: { current: string };
  image: { asset: { _ref: string } } | null;
  type: "indica" | "sativa" | "hybrid";
  effect: "relax" | "energy" | "creative" | "sleep" | "euphoria";
  thcPercent: number;
  cbdPercent: number | null;
  pricePerGram: number;
  shortDescription: string;
  shortDescriptionRu?: string | null;
  shortDescriptionTh?: string | null;
  fullDescription: { _type: string; _key?: string; [key: string]: unknown }[] | null;
  fullDescriptionRu?: { _type: string; _key?: string; [key: string]: unknown }[] | null;
  fullDescriptionTh?: { _type: string; _key?: string; [key: string]: unknown }[] | null;
  terpenes: string[] | null;
  isStaffPick: boolean;
  isSoldOut: boolean;
  sortOrder: number;
}

export interface ShopSettings {
  openTime: string;
  closeTime: string;
  lineUrl: string | null;
  whatsappUrl: string | null;
  telegramUrl: string | null;
  announcement: string | null;
}

export const mockStrains: Strain[] = [
  {
    _id: "1",
    name: "Blue Dream",
    slug: { current: "blue-dream" },
    image: null,
    type: "hybrid",
    effect: "creative",
    thcPercent: 21,
    cbdPercent: 0.2,
    pricePerGram: 450,
    shortDescription: "A balanced hybrid delivering gentle cerebral invigoration with full-body relaxation. Sweet berry aroma.",
    fullDescription: null,
    terpenes: ["Myrcene", "Caryophyllene", "Pinene"],
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
    thcPercent: 18,
    cbdPercent: 0.1,
    pricePerGram: 400,
    shortDescription: "Pure indica legend. Deep body relaxation with a dreamy euphoria. Earthy, pine-forward taste.",
    fullDescription: null,
    terpenes: ["Myrcene", "Limonene", "Caryophyllene"],
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
    thcPercent: 24,
    cbdPercent: null,
    pricePerGram: 500,
    shortDescription: "Sharp focus and energy without anxiety. Tangy mango flavor that keeps you coming back.",
    fullDescription: null,
    terpenes: ["Myrcene", "Caryophyllene", "Ocimene"],
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
    thcPercent: 20,
    cbdPercent: 0.3,
    pricePerGram: 450,
    shortDescription: "The ultimate nighttime strain. Grape and berry aroma with a heavy, sedating body high.",
    fullDescription: null,
    terpenes: ["Myrcene", "Pinene", "Caryophyllene"],
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
    thcPercent: 23,
    cbdPercent: null,
    pricePerGram: 500,
    shortDescription: "Award-winning sativa. Blissful, clear-headed creativity with a spicy pine aroma.",
    fullDescription: null,
    terpenes: ["Terpinolene", "Caryophyllene", "Pinene"],
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
    thcPercent: 22,
    cbdPercent: 0.1,
    pricePerGram: 480,
    shortDescription: "The classic. Stress melts away with its earthy, piney punch and mellow euphoria.",
    fullDescription: null,
    terpenes: ["Myrcene", "Limonene", "Caryophyllene"],
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
    thcPercent: 19,
    cbdPercent: null,
    pricePerGram: 420,
    shortDescription: "Pure African sativa. Uplifting and energizing with sweet, spicy flavors. Great for daytime.",
    fullDescription: null,
    terpenes: ["Terpinolene", "Myrcene", "Ocimene"],
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
    thcPercent: 20,
    cbdPercent: 0.1,
    pricePerGram: 460,
    shortDescription: "Dessert-like grape candy flavor. Sedating body effects perfect for winding down at night.",
    fullDescription: null,
    terpenes: ["Caryophyllene", "Limonene", "Pinene"],
    isStaffPick: false,
    isSoldOut: true,
    sortOrder: 8,
  },
];

export const mockShopSettings: ShopSettings = {
  openTime: "12:00",
  closeTime: "01:00",
  lineUrl: null, // TODO: Add LINE URL
  whatsappUrl: null, // TODO: Add WhatsApp URL
  telegramUrl: null, // TODO: Add Telegram URL
  announcement: null,
};
