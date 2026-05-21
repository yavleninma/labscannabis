#!/usr/bin/env node
/**
 * Deterministic SEO content for all slug × locale pairs (no API key needed).
 * Usage: npm run gen:seo-fallback
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, "content-cache");

const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];

const AREA_NAMES = {
  pattaya: { en: "Pattaya", ru: "Паттайя", th: "พัทยา", ar: "باتايا", zh: "芭提雅", ko: "파타야", ja: "パタヤ" },
  jomtien: { en: "Jomtien", ru: "Джомтьен", th: "จอมเทียน", ar: "جومتين", zh: "乔木提恩", ko: "좀티엔", ja: "ジョムティエン" },
  "walking-street": { en: "Walking Street", ru: "Walking Street", th: "Walking Street", ar: "Walking Street", zh: "Walking Street", ko: "Walking Street", ja: "Walking Street" },
  "soi-hollywood": { en: "Soi Hollywood", ru: "Soi Hollywood", th: "ซอยฮอลลีวูด", ar: "Soi Hollywood", zh: "Soi Hollywood", ko: "Soi Hollywood", ja: "Soi Hollywood" },
  naklua: { en: "Naklua", ru: "Накlua", th: "นาเกลือ", ar: "ناكلوا", zh: "那库阿", ko: "나클루아", ja: "ナクルア" },
  pratumnak: { en: "Pratumnak", ru: "Pratumnak", th: "ประตูน้ำ", ar: "Pratumnak", zh: "Pratumnak", ko: "Pratumnak", ja: "Pratumnak" },
  "central-pattaya": { en: "Central Pattaya", ru: "Центр Паттайи", th: "พัทยากลาง", ar: "وسط باتايا", zh: "芭提雅中心", ko: "파타야 중심", ja: "パタヤ中心" },
};

const COPY = {
  en: {
    intro: (h1, area, weight) =>
      `${h1}. Labs Cannabis (formerly Labs Dispensary) on Soi Hollywood serves ${area} and all of Pattaya with fresh indoor White Widow, weight pricing from 300฿/g to 1kg wholesale, walk-in samples, and delivery on request. WhatsApp +66 66 080 6784 — replies in ~5 minutes.${weight ? ` This page focuses on ${weight} tier pricing.` : ""}`,
    s1h: "Why guests choose Labs Cannabis",
    s1b: (area) =>
      `4.8★ on Google (91 reviews). Transparent tiers, no hidden fees, Russian- and English-speaking staff. Five minutes from Walking Street — easy pickup for guests in ${area}. Cash, QR, same-day pickup.`,
    s2h: "Walk-in on Soi Hollywood or message first",
    s2b: () =>
      "Address: 32 Pattaya 13 Alley (Soi Hollywood), Chon Buri 20150. Open daily 12:00–01:00. Free in-store sample. Medical card help on-site (~2 min). Delivery available in Pattaya — confirm on WhatsApp.",
    faq: [
      ["Do I need a medical card?", "Yes for adults 20+. We help you complete it free on-site in about two minutes."],
      ["Is delivery available?", "Yes — message WhatsApp with your area in Pattaya. We confirm timing and availability."],
      ["What is the best value tier?", "10g at 1,800฿ (180฿/g) is our most popular. 1kg wholesale is 40,000฿."],
    ],
    closing: "Tap a weight tier below to order on WhatsApp, or walk in today on Soi Hollywood.",
  },
  ru: {
    intro: (h1, area, weight) =>
      `${h1}. Labs Cannabis (ранее Labs Dispensary) на Soi Hollywood — свежий indoor White Widow, цены по весу от 300฿/г до опта 1кг, самовывоз и доставка по Паттайе. WhatsApp +66 66 080 6784, ответ ~5 минут.${weight ? ` Страница про тариф ${weight}.` : ""} Рядом с ${area}.`,
    s1h: "Почему выбирают Labs Cannabis",
    s1b: (area) =>
      `4.8★ в Google, 91 отзыв. Честные цены по весу, без навязчивых допродаж. Русскоязычный персонал. 5 минут от Walking Street — удобно для гостей из ${area}. Нал, QR, самовывоз в день заказа.`,
    s2h: "Приходите на Soi Hollywood или пишите в WhatsApp",
    s2b: () =>
      "Адрес: 32 Pattaya 13 Alley (Soi Hollywood). Ежедневно 12:00–01:00. Бесплатный семпл в магазине. Поможем с медкартой на месте (~2 мин). Доставка по Паттайе — уточняйте в WhatsApp.",
    faq: [
      ["Нужна медкарта?", "Да, с 20 лет. Оформим бесплатно на месте за пару минут."],
      ["Есть доставка?", "Да — напишите в WhatsApp район в Паттайе, подтвердим время."],
      ["Какой тариф выгоднее?", "10г за 1 800฿ — самый популярный. Опт 1кг — 40 000฿."],
    ],
    closing: "Выберите вес ниже и закажите в WhatsApp или заходите на Soi Hollywood.",
  },
  th: {
    intro: (h1, area, weight) =>
      `${h1} Labs Cannabis (เดิม Labs Dispensary) บนซอยฮอลลีวูด บริการ ${area} และพัทยา White Widow indoor ราคาตามน้ำหนัก 300฿/g–1kg ส่งได้ WhatsApp +66 66 080 6784${weight ? ` โฟกัส ${weight}` : ""}`,
    s1h: "ทำไมแขกถึงเลือก Labs Cannabis",
    s1b: (area) => `4.8★ Google 91 รีวิว ราคาชัดเจน พนักงานเป็นกันเอง ใกล้ Walking Street 5 นาที เหมาะกับแขกจาก ${area}`,
    s2h: "เดินเข้าร้านหรือทัก WhatsApp",
    s2b: () => "ที่อยู่ 32 Pattaya 13 Alley (Soi Hollywood) เปิด 12:00–01:00 ทุกวัน มีส่งใน พัทยา",
    faq: [
      ["ต้องมีบัตรแพทย์ไหม?", "ใช่ 20+ เราช่วยทำที่ร้านฟรี ~2 นาที"],
      ["มีส่งไหม?", "มี — ทัก WhatsApp บอกพื้นที่"],
      ["แพ็กไหนคุ้ม?", "10g 1,800฿ ยอดนิยม 1kg 40,000฿"],
    ],
    closing: "แตะเลือกน้ำหนักด้านล่างเพื่อสั่ง WhatsApp หรือเดินเข้าร้านวันนี้",
  },
  ar: {
    intro: (h1, area, weight) =>
      `${h1}. Labs Cannabis (formerly Labs Dispensary) في Soi Hollywood — White Widow داخلي، أسعار حسب الوزن، توصيل في ${area} وباتايا. WhatsApp +66 66 080 6784${weight ? ` — ${weight}` : ""}`,
    s1h: "لماذا Labs Cannabis",
    s1b: (area) => `4.8★ على Google — 91 مراجعة. أسعار واضحة. 5 دقائق من Walking Street. مناسب لزوار ${area}.`,
    s2h: "زُر المتجر أو راسلنا",
    s2b: () => "32 Pattaya 13 Alley (Soi Hollywood). يومياً 12:00–01:00. توصيل متاح في باتايا.",
    faq: [
      ["هل أحتاج بطاقة طبية؟", "نعم 20+. نساعدك مجاناً في المتجر."],
      ["هل يوجد توصيل؟", "نعم — راسلنا على WhatsApp."],
      ["أفضل قيمة؟", "10g بـ 1,800฿ — 1kg بـ 40,000฿."],
    ],
    closing: "اضغط على الوزن للطلب عبر WhatsApp أو زُر Soi Hollywood اليوم.",
  },
  zh: {
    intro: (h1, area, weight) =>
      `${h1}。Labs Cannabis（原 Labs Dispensary）位于 Soi Hollywood，服务${area}及芭提雅，White Widow 室内花，1g 300฿ 至 1kg 批发，可配送。WhatsApp +66 66 080 6784${weight ? `，本页侧重${weight}` : ""}`,
    s1h: "为何选择 Labs Cannabis",
    s1b: (area) => `Google 4.8★，91 条评价。价格透明。距 Walking Street 5 分钟，${area} 客人方便到店。`,
    s2h: "到店或 WhatsApp 咨询",
    s2b: () => "地址：32 Pattaya 13 Alley (Soi Hollywood)。每日 12:00–01:00。芭提雅可配送。",
    faq: [
      ["需要医疗卡吗？", "20 岁以上需要，店内约 2 分钟免费协助。"],
      ["可以配送吗？", "可以 — WhatsApp 告知区域。"],
      ["最划算规格？", "10g 1,800฿ 最受欢迎，1kg 40,000฿。"],
    ],
    closing: "点击下方重量档位 WhatsApp 下单，或今日到店 Soi Hollywood。",
  },
  ko: {
    intro: (h1, area, weight) =>
      `${h1}. Soi Hollywood Labs Cannabis(구 Labs Dispensary) — ${area} 및 파타야, White Widow indoor, 300฿/g~1kg 도매, 배달 가능. WhatsApp +66 66 080 6784${weight ? `, ${weight} 안내` : ""}`,
    s1h: "Labs Cannabis를 선택하는 이유",
    s1b: (area) => `Google 4.8★ 91리뷰. 투명한 가격. Walking Street에서 5분. ${area} 고객 방문 편리.`,
    s2h: "매장 방문 또는 WhatsApp",
    s2b: () => "32 Pattaya 13 Alley (Soi Hollywood). 매일 12:00–01:00. 파타야 배달 가능.",
    faq: [
      ["의료 카드 필요?", "20세 이상, 매장에서 무료 발급 지원."],
      ["배달 되나요?", "WhatsApp으로 지역 문의."],
      ["가성비?", "10g 1,800฿ 인기, 1kg 40,000฿."],
    ],
    closing: "아래 무게를 탭해 WhatsApp 주문 또는 Soi Hollywood 방문.",
  },
  ja: {
    intro: (h1, area, weight) =>
      `${h1}。Soi HollywoodのLabs Cannabis（旧Labs Dispensary）— ${area}・パタヤ対応、White Widow indoor、300฿/g〜1kg卸、配達可。WhatsApp +66 66 080 6784${weight ? `、${weight}ページ` : ""}`,
    s1h: "Labs Cannabisが選ばれる理由",
    s1b: (area) => `Google 4.8★ 91レビュー。明確な重量価格。Walking Streetから5分。${area}からも来店しやすい。`,
    s2h: "来店またはWhatsApp",
    s2b: () => "32 Pattaya 13 Alley (Soi Hollywood)。毎日12:00–01:00。パタヤ配達あり。",
    faq: [
      ["医療カード必要？", "20歳以上。店内約2分で無料サポート。"],
      ["配達ある？", "WhatsAppでエリア確認。"],
      ["お得な量？", "10g 1,800฿人気、1kg 40,000฿。"],
    ],
    closing: "下の重量からWhatsApp注文、またはSoi Hollywoodへ。",
  },
};

function loadSeoPages() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/seo-matrix.ts"), "utf8");
  const section = src.slice(src.indexOf("export const SEO_PAGES"));
  const blocks = section.split(/\r?\n  \{\r?\n    slug: "/).slice(1);

  return blocks.map((block) => {
    const slug = block.match(/^([^"]+)"/)?.[1];
    const intent = block.match(/intent: "([^"]+)"/)?.[1] ?? "buy";
    const area = block.match(/area: "([^"]+)"/)?.[1];
    const weight = block.match(/weight: "([^"]+)"/)?.[1];
    const h1Block = block.match(/h1Template: \{([\s\S]*?)\n    \},/)?.[1] ?? "";
    const h1Template = {};
    for (const loc of LOCALES) {
      const m = h1Block.match(new RegExp(`${loc}: "((?:[^"\\\\]|\\\\.)*)"`));
      if (m) h1Template[loc] = m[1];
    }
    return { slug, intent, area, weight, h1Template };
  });
}

function buildContent(locale, page) {
  const t = COPY[locale];
  const area = page.area ? (AREA_NAMES[page.area]?.[locale] ?? page.area) : AREA_NAMES.pattaya[locale];
  const h1 = page.h1Template[locale] ?? page.h1Template.en ?? page.slug;
  return {
    source: "fallback",
    h1,
    intro: t.intro(h1, area, page.weight),
    sections: [
      { h2: t.s1h, body: t.s1b(area) },
      { h2: t.s2h, body: t.s2b() },
    ],
    faq: t.faq.map(([q, a]) => ({ q, a })),
    closing: t.closing,
  };
}

function isValidGenerated(data) {
  return data?.source === "openai" && validateContent(data);
}

function validateContent(data) {
  return (
    data &&
    typeof data.h1 === "string" &&
    typeof data.intro === "string" &&
    Array.isArray(data.sections) &&
    data.sections.length >= 2 &&
    Array.isArray(data.faq) &&
    data.faq.length >= 3 &&
    typeof data.closing === "string"
  );
}

const pages = loadSeoPages();
let written = 0;

for (const locale of LOCALES) {
  for (const page of pages) {
    const outDir = path.join(CACHE, locale);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${page.slug}.json`);
    const existing = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : null;
    // Keep OpenAI / hand-crafted content; only fill missing or template files
    if (isValidGenerated(existing)) {
      console.log(`keep ${locale}/${page.slug}`);
      continue;
    }
    fs.writeFileSync(outFile, JSON.stringify(buildContent(locale, page), null, 2) + "\n", "utf8");
    written++;
  }
}

console.log(`Done. ${written} files written, ${pages.length} slugs × ${LOCALES.length} locales.`);
