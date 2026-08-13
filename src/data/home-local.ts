import type { Locale } from "@/lib/i18n";

export const HOME_LOCAL: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    shop: string;
    delivery: string;
    nearMe: string;
    howToBuy: string;
    legal: string;
    more: string;
    faq: { q: string; a: string }[];
  }
> = {
  en: {
    eyebrow: "Pattaya areas",
    title: "Near Walking Street, Jomtien, Naklua, or Soi Buakhao?",
    lead: "Open the area page for walk-in directions, or the delivery page to ask whether pickup or delivery possibility can be discussed. Hours on the site are 12:00-01:00; Maps is the live listing.",
    shop: "Shop near {area}",
    delivery: "Ask delivery for {area}",
    nearMe: "Cannabis near me in Pattaya",
    howToBuy: "How to buy in Pattaya",
    legal: "Tourist cannabis rules",
    more: "All area pages",
    faq: [
      {
        q: "How far are you from Walking Street?",
        a: "The shop is on Soi Hollywood (Pattaya 13 Alley), a short walk from Walking Street. Open Google Maps for the live route from your hotel.",
      },
      {
        q: "Do you speak Russian?",
        a: "WhatsApp and the shop can handle English and Russian. Write in the language you prefer.",
      },
    ],
  },
  ru: {
    eyebrow: "Районы Паттайи",
    title: "Рядом Walking Street, Джомтьен, Наклуа или Soi Buakhao?",
    lead: "Откройте страницу района для маршрута пешком или страницу доставки, чтобы спросить про самовывоз. На сайте 12:00-01:00; живой listing — в Maps.",
    shop: "Магазин рядом с {area}",
    delivery: "Спросить доставку в {area}",
    nearMe: "Каннабис рядом в Паттайе",
    howToBuy: "Как купить в Паттайе",
    legal: "Правила для туристов",
    more: "Все страницы районов",
    faq: [
      {
        q: "Как далеко от Walking Street?",
        a: "Магазин на Soi Hollywood (Pattaya 13 Alley), короткая прогулка от Walking Street. Маршрут от отеля — в Google Maps.",
      },
      {
        q: "Говорите по-русски?",
        a: "WhatsApp и магазин работают на английском и русском. Пишите на удобном языке.",
      },
    ],
  },
  th: {
    eyebrow: "พื้นที่พัทยา",
    title: "ใกล้ Walking Street, จอมเทียน, นาเกลือ หรือ Soi Buakhao?",
    lead: "เปิดหน้าพื้นที่สำหรับเดินทาง หรือหน้า delivery เพื่อถาม pickup เวลาบนเว็บ 12:00-01:00 listing สดอยู่ที่ Maps",
    shop: "ร้านใกล้ {area}",
    delivery: "ถาม delivery สำหรับ {area}",
    nearMe: "กัญชาใกล้ฉัน พัทยา",
    howToBuy: "วิธีซื้อในพัทยา",
    legal: "กฎสำหรับนักท่องเที่ยว",
    more: "หน้าพื้นที่ทั้งหมด",
    faq: [],
  },
  ar: {
    eyebrow: "مناطق باتايا",
    title: "قرب Walking Street أو Jomtien أو Naklua أو Soi Buakhao؟",
    lead: "افتح صفحة المنطقة للاتجاهات أو صفحة التوصيل للسؤال عن الاستلام. ساعات الموقع 12:00-01:00.",
    shop: "متجر قرب {area}",
    delivery: "اسأل عن التوصيل إلى {area}",
    nearMe: "قنب قريب في باتايا",
    howToBuy: "كيفية الشراء في باتايا",
    legal: "قواعد السياح",
    more: "كل صفحات المناطق",
    faq: [],
  },
  zh: {
    eyebrow: "芭提雅区域",
    title: "靠近 Walking Street、Jomtien、Naklua 或 Soi Buakhao？",
    lead: "打开区域页查看步行路线，或打开配送页询问取货。网站时间为 12:00-01:00，实时列表以 Maps 为准。",
    shop: "{area} 附近门店",
    delivery: "询问 {area} 配送",
    nearMe: "芭提雅附近大麻",
    howToBuy: "如何在芭提雅购买",
    legal: "游客规则",
    more: "全部区域页",
    faq: [],
  },
  ko: {
    eyebrow: "파타야 지역",
    title: "Walking Street, Jomtien, Naklua, Soi Buakhao 근처인가요?",
    lead: "도보 안내는 지역 페이지, 픽업/배달 문의는 배달 페이지를 여세요. 사이트 시간은 12:00-01:00이며 실시간 리스팅은 Maps입니다.",
    shop: "{area} 근처 매장",
    delivery: "{area} 배달 문의",
    nearMe: "파타야 근처 대마초",
    howToBuy: "파타야에서 구매하는 법",
    legal: "관광객 규정",
    more: "모든 지역 페이지",
    faq: [],
  },
  ja: {
    eyebrow: "パタヤのエリア",
    title: "Walking Street、Jomtien、Naklua、Soi Buakhao の近くですか？",
    lead: "徒歩ルートはエリアページ、受け取り相談は配達ページへ。サイト上の時間は12:00-01:00、最新掲載はMapsです。",
    shop: "{area}近くの店",
    delivery: "{area}の配達を確認",
    nearMe: "パタヤ近くの大麻",
    howToBuy: "パタヤでの買い方",
    legal: "旅行者向けルール",
    more: "全エリアページ",
    faq: [],
  },
};
