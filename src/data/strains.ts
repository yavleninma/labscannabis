export interface Strain {
  slug: string;
  name: string;
  type: "indica" | "sativa" | "hybrid";
  thcPercent: number | null;
  shortDescription: Record<string, string>;
  isFlagship?: boolean;
}

export const WHITE_WIDOW: Strain = {
  slug: "white-widow",
  name: "White Widow",
  type: "hybrid",
  thcPercent: 22,
  isFlagship: true,
  shortDescription: {
    en: "Classic balanced hybrid with frosty white trichomes. Uplifting yet relaxing — our main indoor flower, always fresh.",
    ru: "Классический сбалансированный гибрид с белоснежными трихомами. Бодрит и расслабляет — наш основной indoor, всегда свежий.",
    th: "สายพันธุ์ไฮบริดคลาสสิก ครอบด้วยไตรโคมสีขาว สดชื่นและผ่อนคลาย — ดอกหลักของเรา สดใหม่เสมอ",
    ar: "هجين متوازن كلاسيكي مغطى بالترايكومات البيضاء. منشط وم relaks — زهرةنا الداخلية الرئيسية، دائماً طازجة.",
    zh: "经典平衡杂交品种，覆盖白色毛状体。提神又放松——我们的主打室内花，始终新鲜。",
    ko: "흰색 트리콤으로 덮인 클래식 균형 하이브리드. 기분 좋고 편안함 — 우리의 메인 실내 꽃, 항상 신선.",
    ja: "白いトリコームに覆われたクラシックなバランスハイブリッド。気分を高めつつリラックス——メインのインドアフラワー、常に新鮮。",
  },
};

export const SECONDARY_STRAINS: Strain[] = [
  {
    slug: "blue-dream",
    name: "Blue Dream",
    type: "hybrid",
    thcPercent: 21,
    shortDescription: {
      en: "Balanced hybrid with sweet berry aroma.",
      ru: "Сбалансированный гибрид со сладким ягодным ароматом.",
      th: "ไฮบริดสมดุล กลิ่นเบอร์รี่หวาน",
      ar: "هجين متوازن برائحة التوت الحلو.",
      zh: "平衡杂交，甜浆果香气。",
      ko: "달콤한 베리 향의 균형 하이브리드.",
      ja: "甘いベリー香のバランスハイブリッド。",
    },
  },
  {
    slug: "og-kush",
    name: "OG Kush",
    type: "hybrid",
    thcPercent: 22,
    shortDescription: {
      en: "Classic earthy pine punch with mellow euphoria.",
      ru: "Классика: землистый сосновый вкус и мягкая эйфория.",
      th: "คลาสสิก กลิ่นดินและสน อารมณ์ดีนุ่มนวล",
      ar: "كلاسيكي بنكهة الصنوبر الترابية ونشوة هادئة.",
      zh: "经典土味松木，柔和愉悦。",
      ko: "클래식한 흙과 소나무 향, 부드러운 기분.",
      ja: "クラシックな土と松の香り、穏やかな高揚感。",
    },
  },
  {
    slug: "northern-lights",
    name: "Northern Lights",
    type: "indica",
    thcPercent: 18,
    shortDescription: {
      en: "Pure indica legend for deep relaxation.",
      ru: "Легендарная чистая индика для глубокого релакса.",
      th: "อินดิก้าเพียวตำนาน ผ่อนคลายลึก",
      ar: "إنديكا نقية أسطورية للاسترخاء العميق.",
      zh: "纯印度大麻传奇，深度放松。",
      ko: "깊은 이완을 위한 순수 인디카 전설.",
      ja: "深いリラックスのためのピュアインディカ伝説。",
    },
  },
  {
    slug: "green-crack",
    name: "Green Crack",
    type: "sativa",
    thcPercent: 24,
    shortDescription: {
      en: "Sharp focus and energy without anxiety.",
      ru: "Острая концентрация и энергия без тревоги.",
      th: "โฟกัสคม กระตือรือร้น ไม่วิตก",
      ar: "تركيز حاد وطاقة بدون قلق.",
      zh: "清晰专注与能量，无焦虑。",
      ko: "불안 없는 날카로운 집중과 에너지.",
      ja: "不安なくシャープな集中とエネルギー。",
    },
  },
  {
    slug: "jack-herer",
    name: "Jack Herer",
    type: "sativa",
    thcPercent: 23,
    shortDescription: {
      en: "Award-winning sativa for clear-headed creativity.",
      ru: "Награждённая сатива для ясной креативности.",
      th: "ซาติว่ารางวัล สร้างสรรค์สดใส",
      ar: "سativا حائزة على جوائز للإبداع الواضح.",
      zh: "获奖 sativa，头脑清晰创意。",
      ko: "명료한 창의력을 위한 수상 sativa.",
      ja: "クリアな創造性のための受賞サティバ。",
    },
  },
];

export const ALL_STRAINS = [WHITE_WIDOW, ...SECONDARY_STRAINS];
