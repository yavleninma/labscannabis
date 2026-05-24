import type { PortableTextBlock } from "./portable-text";

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
  deliveryEnabled?: boolean;
  pickupEnabled?: boolean;
  fulfillmentNote?: string | null;
  googleRating?: number;
  googleReviewCount?: number;
  guidePhoto?: { asset: { _ref: string } } | null;
  teamPhoto?: { asset: { _ref: string } } | null;
}

export interface Area {
  _id: string;
  _updatedAt?: string;
  name: string;
  nameRu?: string | null;
  nameTh?: string | null;
  slug: { current: string };
  etaMinutes: number;
  shortDescription: string;
  shortDescriptionRu?: string | null;
  shortDescriptionTh?: string | null;
  landmarks: string[];
  isHidden?: boolean;
  sortOrder: number;
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
  openTime: "00:00",
  closeTime: "23:59",
  isOpen24h: true,
  lineUrl: null, // TODO: Add LINE URL
  lineId: null,
  whatsappUrl: null, // TODO: Add WhatsApp URL
  whatsappNumber: null,
  telegramUrl: null, // TODO: Add Telegram URL
  telegramId: null,
  phone: "+66 66 080 6784",
  announcement: null,
  deliveryEnabled: true,
  pickupEnabled: true,
  fulfillmentNote: null,
  googleRating: 4.8,
  googleReviewCount: 91,
  guidePhoto: null,
  teamPhoto: null,
};

export const mockAreas: Area[] = [
  {
    _id: "area-walking-street",
    name: "Walking Street",
    nameRu: "Walking Street",
    nameTh: "Walking Street",
    slug: { current: "walking-street" },
    etaMinutes: 15,
    shortDescription:
      "Pattaya's main nightlife strip. We're a 5-minute walk into Soi Hollywood, with quick 24/7 delivery nearby.",
    shortDescriptionRu:
      "Главная ночная улица Паттайи. Мы в 5 минутах пешком в Soi Hollywood, рядом быстрая доставка 24/7.",
    shortDescriptionTh:
      "ย่านไนท์ไลฟ์หลักของพัทยา ร้านอยู่ในซอยฮอลลีวูด เดินประมาณ 5 นาที และจัดส่งใกล้ๆ ได้ตลอด 24 ชั่วโมง",
    landmarks: ["Walking Street", "Pattaya 13 Alley", "Bali Hai Pier"],
    sortOrder: 1,
  },
  {
    _id: "area-soi-buakhao",
    name: "Soi Buakhao",
    nameRu: "Soi Buakhao",
    nameTh: "ซอยบัวขาว",
    slug: { current: "soi-buakhao" },
    etaMinutes: 20,
    shortDescription:
      "Bars, guesthouses, condos, and long-stay rooms. We deliver from Labs Cannabis around the clock.",
    shortDescriptionRu:
      "Бары, гестхаусы, кондо и жильё для зимовщиков. Доставляем из Labs Cannabis круглосуточно.",
    shortDescriptionTh:
      "โซนบาร์ เกสต์เฮาส์ คอนโด และที่พักระยะยาว จัดส่งจาก Labs Cannabis ได้ตลอดวัน",
    landmarks: ["LK Metro", "Soi Diana", "Tree Town"],
    sortOrder: 2,
  },
  {
    _id: "area-jomtien-beach",
    name: "Jomtien Beach",
    nameRu: "Джомтьен",
    nameTh: "หาดจอมเทียน",
    slug: { current: "jomtien-beach" },
    etaMinutes: 30,
    shortDescription:
      "Quieter beach south of Pattaya. We deliver 24/7 to Jomtien hotels, condos, and villas.",
    shortDescriptionRu:
      "Более спокойный пляж к югу от Паттайи. Доставляем 24/7 в отели, кондо и виллы Джомтьена.",
    shortDescriptionTh:
      "ชายหาดที่เงียบกว่าทางใต้ของพัทยา จัดส่ง 24/7 ถึงโรงแรม คอนโด และวิลล่าในจอมเทียน",
    landmarks: ["Jomtien Beach Road", "Jomtien Night Market", "View Talay"],
    sortOrder: 3,
  },
  {
    _id: "area-pratumnak-hill",
    name: "Pratumnak Hill",
    nameRu: "Пратумнак",
    nameTh: "เขาพระตำหนัก",
    slug: { current: "pratumnak-hill" },
    etaMinutes: 25,
    shortDescription:
      "Premium hill between Pattaya and Jomtien. Discreet hotel and condo delivery, day or night.",
    shortDescriptionRu:
      "Премиальный район между Паттайей и Джомтьеном. Аккуратная доставка в отели и кондо днём и ночью.",
    shortDescriptionTh:
      "ย่านพรีเมียมระหว่างพัทยาและจอมเทียน จัดส่งถึงโรงแรมและคอนโดอย่างมิดชิดทั้งกลางวันและกลางคืน",
    landmarks: ["Big Buddha", "Cosy Beach", "Royal Cliff"],
    sortOrder: 4,
  },
  {
    _id: "area-naklua",
    name: "Naklua",
    nameRu: "Наклуа",
    nameTh: "นาเกลือ",
    slug: { current: "naklua" },
    etaMinutes: 30,
    shortDescription:
      "North Pattaya and Wong Amat side. Message us and we will arrange delivery to your hotel or condo.",
    shortDescriptionRu:
      "Северная Паттайя и район Wong Amat. Напиши нам — организуем доставку в отель или кондо.",
    shortDescriptionTh:
      "โซนพัทยาเหนือและวงศ์อมาตย์ ทักมาแล้วเราจะจัดส่งถึงโรงแรมหรือคอนโดของคุณ",
    landmarks: ["Wong Amat", "Terminal 21 Pattaya", "Sanctuary of Truth"],
    sortOrder: 5,
  },
  {
    _id: "area-pattaya-klang",
    name: "Pattaya Klang",
    nameRu: "Центральная Паттайя",
    nameTh: "พัทยากลาง",
    slug: { current: "pattaya-klang" },
    etaMinutes: 15,
    shortDescription:
      "Central Pattaya is close to the shop, so delivery is usually fast and easy to coordinate.",
    shortDescriptionRu:
      "Центральная Паттайя близко к магазину, поэтому доставка обычно быстрая и простая.",
    shortDescriptionTh:
      "พัทยากลางอยู่ใกล้ร้าน จึงจัดส่งได้รวดเร็วและประสานงานง่าย",
    landmarks: ["Central Pattaya", "Beach Road", "Royal Garden Plaza"],
    sortOrder: 6,
  },
];
