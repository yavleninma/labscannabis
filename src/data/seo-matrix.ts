import type { Locale } from "@/lib/i18n";

export interface Area {
  slug: string;
  name: Record<Locale, string>;
}

export interface SeoPage {
  slug: string;
  intent: string;
  brand?: "labs" | "cannathai";
  area?: string;
  weight?: string;
  titleTemplate: Record<Locale, string>;
  h1Template: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
}

export const AREAS: Area[] = [
  {
    slug: "pattaya",
    name: { en: "Pattaya", ru: "Паттайя", th: "พัทยา", ar: "باتايا", zh: "芭提雅", ko: "파타야", ja: "パタヤ" },
  },
  {
    slug: "jomtien",
    name: { en: "Jomtien", ru: "Джомтьен", th: "จอมเทียน", ar: "جومتين", zh: "乔木提恩", ko: "좀티엔", ja: "ジョムティエン" },
  },
  {
    slug: "walking-street",
    name: { en: "Walking Street", ru: "Walking Street", th: "Walking Street", ar: "Walking Street", zh: "Walking Street", ko: "Walking Street", ja: "Walking Street" },
  },
  {
    slug: "soi-hollywood",
    name: { en: "Soi Hollywood", ru: "Soi Hollywood", th: "ซอยฮอลลีวูด", ar: "Soi Hollywood", zh: "Soi Hollywood", ko: "Soi Hollywood", ja: "Soi Hollywood" },
  },
  {
    slug: "soi-buakhao",
    name: { en: "Soi Buakhao", ru: "Soi Buakhao", th: "ซอยบัวขาว", ar: "Soi Buakhao", zh: "Soi Buakhao", ko: "Soi Buakhao", ja: "Soi Buakhao" },
  },
  {
    slug: "naklua",
    name: { en: "Naklua", ru: "Наклуа", th: "นาเกลือ", ar: "ناكلوا", zh: "那库阿", ko: "나클루아", ja: "ナクルア" },
  },
  {
    slug: "pratumnak",
    name: { en: "Pratumnak", ru: "Пратамнак", th: "พระตำหนัก", ar: "Pratumnak", zh: "Pratumnak", ko: "Pratumnak", ja: "プラタムナック" },
  },
  {
    slug: "central-pattaya",
    name: { en: "Central Pattaya", ru: "Центр Паттайи", th: "พัทยากลาง", ar: "وسط باتايا", zh: "芭提雅中心", ko: "파타야 중심", ja: "パタヤ中心" },
  },
];

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "buy-cannabis-pattaya",
    intent: "buy",
    area: "pattaya",
    titleTemplate: {
      en: "Buy cannabis in Pattaya | Soi Hollywood shop | Labs Cannabis",
      ru: "Купить каннабис в Паттайе | магазин на Soi Hollywood",
      th: "ซื้อกัญชา พัทยา | ร้าน Soi Hollywood | Labs Cannabis",
      ar: "شراء القنب في باتايا | متجر Soi Hollywood",
      zh: "芭提雅购买大麻 | Soi Hollywood 门店",
      ko: "파타야 대마초 구매 | Soi Hollywood 매장",
      ja: "パタヤで大麻を買う | Soi Hollywood店舗",
    },
    h1Template: {
      en: "Buy cannabis in Pattaya from a walk-in shop on Soi Hollywood",
      ru: "Купить каннабис в Паттайе — магазин на Soi Hollywood",
      th: "ซื้อกัญชา พัทยา — ร้านบนซอยฮอลลีวูด",
      ar: "شراء القنب في باتايا — متجر Soi Hollywood",
      zh: "在芭提雅购买大麻 — Soi Hollywood 实体店",
      ko: "파타야에서 대마초 구매 — Soi Hollywood 매장",
      ja: "パタヤで大麻を購入 — Soi Hollywood店舗",
    },
    keywords: {
      en: ["buy cannabis pattaya", "weed shop pattaya", "cannabis dispensary pattaya"],
      ru: ["купить каннабис паттайя", "магазин каннабис паттайя", "weed shop pattaya"],
      th: ["ซื้อกัญชา พัทยา", "ร้านกัญชา พัทยา"],
      ar: ["شراء القنب باتايا", "متجر القنب باتايا"],
      zh: ["芭提雅买大麻", "芭提雅大麻店"],
      ko: ["파타야 대마초 구매", "파타야 dispensary"],
      ja: ["パタヤ 大麻 購入", "パタヤ 大麻 店"],
    },
  },
  {
    slug: "cannabis-near-me-pattaya",
    intent: "near-me",
    area: "pattaya",
    titleTemplate: {
      en: "Cannabis shop near me in Pattaya | Map and directions | Labs Cannabis",
      ru: "Каннабис рядом со мной в Паттайе | Карта и маршрут",
      th: "ร้านกัญชาใกล้ฉัน พัทยา | แผนที่และเส้นทาง",
      ar: "متجر قنب قريب مني في باتايا",
      zh: "芭提雅附近大麻店 | 地图与路线",
      ko: "파타야 근처 대마초 매장 | 지도와 길 안내",
      ja: "パタヤ近くの大麻店 | 地図と道順",
    },
    h1Template: {
      en: "Cannabis shop near you in Pattaya",
      ru: "Каннабис-шоп рядом с вами в Паттайе",
      th: "ร้านกัญชาใกล้คุณ พัทยา",
      ar: "متجر قنب قريب منك في باتايا",
      zh: "芭提雅附近的大麻店",
      ko: "파타야 근처 대마초 매장",
      ja: "パタヤ近くの大麻店",
    },
    keywords: {
      en: ["cannabis near me pattaya", "dispensary near me pattaya", "weed shop near me"],
      ru: ["каннабис рядом паттайя", "магазин каннабис рядом", "weed near me"],
      th: ["กัญชาใกล้ฉัน พัทยา", "ร้านกัญชาใกล้ฉัน"],
      ar: ["قنب قريب مني باتايا", "متجر قنب قريب"],
      zh: ["芭提雅附近大麻", "附近大麻店"],
      ko: ["파타야 근처 대마초", "내 근처 dispensary"],
      ja: ["パタヤ 近くの大麻", "近くのディスペンサリー"],
    },
  },
  {
    slug: "cheap-weed-pattaya",
    intent: "buy",
    area: "pattaya",
    titleTemplate: {
      en: "Affordable cannabis in Pattaya | Listed weight tiers | Labs Cannabis",
      ru: "Доступный каннабис в Паттайе | цены по весу",
      th: "กัญชาราคาดี พัทยา | ราคาตามน้ำหนัก",
      ar: "قنب بأسعار معقولة في باتايا",
      zh: "芭提雅实惠大麻 | 按重量标价",
      ko: "파타야 합리적인 대마초 | 중량 가격",
      ja: "パタヤの手頃な大麻 | 重量別価格",
    },
    h1Template: {
      en: "Affordable cannabis in Pattaya — listed tiers, not a hidden menu",
      ru: "Доступный каннабис в Паттайе — понятные веса, без скрытого меню",
      th: "กัญชาราคาดี พัทยา — ราคาตามน้ำหนักชัดเจน",
      ar: "قنب بأسعار معقولة في باتايا — أوزان معلنة",
      zh: "芭提雅实惠大麻 — 公开重量档位",
      ko: "파타야 합리적 대마초 — 공개 중량 가격",
      ja: "パタヤの手頃な大麻 — 公開されている重量価格",
    },
    keywords: {
      en: ["cheap weed pattaya", "affordable cannabis pattaya", "cannabis prices pattaya"],
      ru: ["дешёвый каннабис паттайя", "цены каннабис паттайя"],
      th: ["กัญชาราคาถูก พัทยา", "ราคากัญชา พัทยา"],
      ar: ["قنب رخيص باتايا", "أسعار القنب باتايا"],
      zh: ["芭提雅便宜大麻", "芭提雅大麻价格"],
      ko: ["파타야 저렴한 대마초", "파타야 대마초 가격"],
      ja: ["パタヤ 安い大麻", "パタヤ 大麻 価格"],
    },
  },
  {
    slug: "best-cannabis-shop-pattaya",
    intent: "best",
    area: "pattaya",
    titleTemplate: {
      en: "Cannabis shop information in Pattaya | Maps and directions",
      ru: "Информация о каннабис-шопе в Паттайе | Maps и маршрут",
      th: "ข้อมูลร้านกัญชาในพัทยา | Maps และเส้นทาง",
      ar: "معلومات متجر القنب في باتايا | Maps والاتجاهات",
      zh: "芭提雅大麻店信息 | 地图与路线",
      ko: "파타야 대마초 매장 정보 | 지도와 경로",
      ja: "パタヤの大麻店情報 | 地図と経路",
    },
    h1Template: {
      en: "Best cannabis shop in Pattaya — a real Soi Hollywood listing",
      ru: "Лучший каннабис-шоп в Паттайе — реальный listing на Soi Hollywood",
      th: "ร้านกัญชาดีที่สุด พัทยา — ร้านจริงบน Soi Hollywood",
      ar: "أفضل متجر قنب في باتايا — قائمة Google حقيقية",
      zh: "芭提雅最佳大麻店 — Soi Hollywood 真实店铺",
      ko: "파타야 최고 매장 — Soi Hollywood 실제 리스팅",
      ja: "パタヤ最高の店 — Soi Hollywoodの実在リスティング",
    },
    keywords: {
      en: ["best cannabis shop pattaya", "best dispensary pattaya", "top weed shop pattaya"],
      ru: ["лучший шоп каннабис паттайя", "лучший dispensary паттайя"],
      th: ["ร้านกัญชาดีที่สุด พัทยา"],
      ar: ["أفضل متجر قنب باتايا"],
      zh: ["芭提雅最佳大麻店"],
      ko: ["파타야 최고 대마초 매장"],
      ja: ["パタヤ 最高の大麻店"],
    },
  },
  {
    slug: "labs-dispensary-pattaya",
    intent: "best",
    area: "pattaya",
    titleTemplate: {
      en: "LABS DISPENSARY Pattaya | Google Maps and directions",
      ru: "LABS DISPENSARY Паттайя | Google Maps и маршрут",
      th: "LABS DISPENSARY พัทยา | Google Maps และเส้นทาง",
      ar: "LABS DISPENSARY باتايا | Google Maps والاتجاهات",
      zh: "LABS DISPENSARY 芭提雅 | Google Maps 与路线",
      ko: "LABS DISPENSARY 파타야 | Google Maps와 경로",
      ja: "LABS DISPENSARY パタヤ | Google Maps と経路",
    },
    h1Template: {
      en: "LABS DISPENSARY Pattaya — live listing and directions",
      ru: "LABS DISPENSARY Паттайя — карточка и маршрут",
      th: "LABS DISPENSARY พัทยา — รายการและเส้นทาง",
      ar: "LABS DISPENSARY باتايا — البطاقة والاتجاهات",
      zh: "LABS DISPENSARY 芭提雅 — 实时页面与路线",
      ko: "LABS DISPENSARY 파타야 — 실시간 정보와 경로",
      ja: "LABS DISPENSARY パタヤ — 最新情報と経路",
    },
    keywords: {
      en: ["labs dispensary pattaya", "labs cannabis pattaya", "labs dispensary soi hollywood"],
      ru: ["labs dispensary паттайя", "labs cannabis паттайя"],
      th: ["labs dispensary พัทยา"],
      ar: ["labs dispensary باتايا"],
      zh: ["labs dispensary 芭提雅"],
      ko: ["labs dispensary 파타야"],
      ja: ["labs dispensary パタヤ"],
    },
  },
  {
    slug: "how-to-buy-cannabis-pattaya",
    intent: "guide",
    area: "pattaya",
    titleTemplate: {
      en: "How to buy cannabis in Pattaya | visitor guide | Labs Cannabis",
      ru: "Как купить каннабис в Паттайе | гайд для гостей",
      th: "วิธีซื้อกัญชาในพัทยา | คู่มือนักท่องเที่ยว",
      ar: "كيفية شراء القنب في باتايا | دليل الزائر",
      zh: "如何在芭提雅购买大麻 | 访客指南",
      ko: "파타야에서 대마초 사는 법 | 방문 가이드",
      ja: "パタヤで大麻を買う方法 | 訪問ガイド",
    },
    h1Template: {
      en: "How to buy cannabis in Pattaya without guessing",
      ru: "Как купить каннабис в Паттайе без угадывания",
      th: "วิธีซื้อกัญชาในพัทยาโดยไม่ต้องเดา",
      ar: "كيفية شراء القنب في باتايا بدون تخمين",
      zh: "如何在芭提雅购买大麻，不靠猜",
      ko: "추측 없이 파타야에서 대마초 구매하는 법",
      ja: "迷わずパタヤで大麻を買う方法",
    },
    keywords: {
      en: ["how to buy cannabis pattaya", "pattaya cannabis guide", "cannabis shop pattaya tourists"],
      ru: ["как купить каннабис паттайя", "гайд каннабис паттайя"],
      th: ["วิธีซื้อกัญชา พัทยา", "คู่มือกัญชา พัทยา"],
      ar: ["كيفية شراء القنب باتايا"],
      zh: ["芭提雅如何购买大麻"],
      ko: ["파타야 대마초 구매 방법"],
      ja: ["パタヤ 大麻 買い方"],
    },
  },
  {
    slug: "cannabis-wholesale-pattaya",
    intent: "wholesale",
    area: "pattaya",
    titleTemplate: {
      en: "Cannabis wholesale Pattaya | bulk flower inquiry | Labs Cannabis",
      ru: "Опт каннабиса в Паттайе | запрос bulk flower",
      th: "กัญชาขายส่ง พัทยา | สอบถาม bulk flower",
      ar: "القنب بالجملة باتايا | استعلام bulk flower",
      zh: "芭提雅大麻批发 | bulk flower 咨询",
      ko: "파타야 대마초 도매 | bulk flower 문의",
      ja: "パタヤ大麻卸売 | bulk flower問い合わせ",
    },
    h1Template: {
      en: "Cannabis wholesale inquiry in Pattaya",
      ru: "Оптовый запрос каннабиса в Паттайе",
      th: "สอบถามกัญชาขายส่งในพัทยา",
      ar: "استعلام القنب بالجملة في باتايا",
      zh: "芭提雅大麻批发咨询",
      ko: "파타야 대마초 도매 문의",
      ja: "パタヤの大麻卸売問い合わせ",
    },
    keywords: {
      en: ["cannabis wholesale pattaya", "bulk weed pattaya", "wholesale cannabis shop pattaya"],
      ru: ["опт каннабис паттайя", "оптовый каннабис паттайя"],
      th: ["กัญชาขายส่ง พัทยา"],
      ar: ["القنب بالجملة باتايا"],
      zh: ["芭提雅大麻批发"],
      ko: ["파타야 대마초 도매"],
      ja: ["パタヤ 大麻 卸売"],
    },
  },
  {
    slug: "cannathai-wholesale-cannabis-thailand",
    intent: "wholesale",
    brand: "cannathai",
    titleTemplate: {
      en: "CannaThai wholesale cannabis Thailand | bulk flower inquiry",
      ru: "CannaThai опт каннабиса в Таиланде | запрос bulk flower",
      th: "CannaThai กัญชาขายส่งไทย | สอบถาม bulk flower",
      ar: "CannaThai قنب بالجملة في تايلاند",
      zh: "CannaThai 泰国大麻批发",
      ko: "CannaThai 태국 대마 도매",
      ja: "CannaThai タイ大麻卸売",
    },
    h1Template: {
      en: "CannaThai wholesale cannabis in Thailand",
      ru: "CannaThai: оптовый каннабис в Таиланде",
      th: "CannaThai กัญชาขายส่งในประเทศไทย",
      ar: "CannaThai للقنب بالجملة في تايلاند",
      zh: "CannaThai 泰国大麻批发",
      ko: "CannaThai 태국 대마 도매",
      ja: "CannaThai タイの大麻卸売",
    },
    keywords: {
      en: ["wholesale cannabis thailand", "cannathai", "bulk cannabis flower thailand"],
      ru: ["опт каннабиса таиланд", "cannathai", "wholesale cannabis thailand"],
      th: ["กัญชาขายส่งไทย", "cannathai"],
      ar: ["قنب بالجملة تايلاند", "cannathai"],
      zh: ["泰国大麻批发", "cannathai"],
      ko: ["태국 대마 도매", "cannathai"],
      ja: ["タイ 大麻 卸売", "cannathai"],
    },
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}
