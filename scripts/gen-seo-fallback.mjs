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
  naklua: { en: "Naklua", ru: "Наклуа", th: "นาเกลือ", ar: "ناكلوا", zh: "那库阿", ko: "나클루아", ja: "ナクルア" },
  pratumnak: { en: "Pratumnak", ru: "Пратамнак", th: "พระตำหนัก", ar: "Pratumnak", zh: "Pratumnak", ko: "Pratumnak", ja: "Pratumnak" },
  "central-pattaya": { en: "Central Pattaya", ru: "Центр Паттайи", th: "พัทยากลาง", ar: "وسط باتايا", zh: "芭提雅中心", ko: "파타야 중심", ja: "パタヤ中心" },
};

/**
 * Шаблон, из которого создаётся контент для новых слагов.
 *
 * До W1-09 шаблон содержал ставки за грамм и оптовые суммы в батах, обещание
 * пробника в подарок, устаревший рейтинг с числом отзывов,
 * неподтверждённые часы, адрес по соседнему ориентиру вместо настоящего и
 * строку про помощь с медкартой «за пару минут». Любой запуск генератора после
 * расширения SEO_PAGES создавал всё это заново — то есть публиковал рекламу
 * цены каннабиса и рекламу медуслуги на новых страницах.
 *
 * Правила для любой правки этого объекта:
 * - ни цен, ни ฿, ни весовых тиров, ни скидок, ни бесплатных образцов;
 * - ни одного факта, не подтверждённого владельцем: часы, рейтинг, число
 *   отзывов, языки персонала, доставка — сюда не пишутся;
 * - рецепт описывается констатацией требования, без «поможем оформить»,
 *   без сроков и без «формальности»;
 * - текст обязан пройти scripts/lib/compliance-lexicon.mjs.
 */
const COPY = {
  en: {
    intro: (h1, area) =>
      `${h1}. Labs Cannabis (formerly Labs Dispensary) is a licensed cannabis dispensary at 32 Pattaya 13 Alley in South Pattaya, within reach of ${area}. Everything is handed over in store, to adults 20+ who hold a Thai prescription — this website takes no orders and no payments. Questions about the shelf, the route or the paperwork go to WhatsApp +66 66 080 6784.`,
    s1h: "What a visit looks like",
    s1b: (area) =>
      `The shop is licensed and every purchase happens face to face, at the counter. Strain types, effects and what is actually in the room that day are discussed with staff in store; the site publishes no prices, no stock lists and no advertising, because Thai law reads that as cannabis advertising. Coming from ${area}, ask for the exact route on WhatsApp before you set off.`,
    s2h: "How to find us",
    s2b: () =>
      "Address: 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150. Open the LABS DISPENSARY listing in Google Maps and navigate straight to the door. Bring ID that proves you are 20 or older, and your Thai prescription (ภ.ท.33). We do not sell vapes, e-cigarettes or tobacco.",
    faq: [
      [
        "Who may buy cannabis flower in Thailand?",
        "Adults aged 20 or older who hold a prescription issued inside Thailand. Prescriptions from other countries are not accepted, and the handover happens in person, in the shop.",
      ],
      [
        "Does the website take orders?",
        "No. There is no basket and no payment here. WhatsApp is for questions about the route, the paperwork and what is in the shop today.",
      ],
      [
        "Do you sell vapes or e-cigarettes?",
        "No. Selling vapes and e-cigarettes is illegal in Thailand and we do not stock them. Labs Cannabis is a licensed cannabis dispensary.",
      ],
    ],
    closing:
      "Send your question to WhatsApp +66 66 080 6784, or open Google Maps and walk in: 32 Pattaya 13 Alley, adults 20+ with a Thai prescription.",
  },
  ru: {
    intro: (h1, area) =>
      `${h1}. Labs Cannabis (ранее Labs Dispensary) — лицензированный каннабис-диспенсери по адресу 32 Pattaya 13 Alley, Южная Паттайя, недалеко от ${area}. Всё выдаётся в магазине, взрослым 20+ с тайским рецептом: сайт не принимает заказы и не проводит оплату. Вопросы о витрине, дороге и документах — в WhatsApp +66 66 080 6784.`,
    s1h: "Как проходит визит",
    s1b: (area) =>
      `Магазин лицензированный, покупка происходит только лично, у прилавка. Сорта, эффекты и то, что реально есть в этот день, обсуждаются с продавцом в магазине: цен, остатков и рекламных обещаний на сайте нет — в Таиланде это читается как реклама каннабиса. Из района ${area} уточните точный маршрут в WhatsApp заранее.`,
    s2h: "Как нас найти",
    s2b: () =>
      "Адрес: 32 Pattaya 13 Alley, Южная Паттайя, Чонбури 20150. Откройте карточку LABS DISPENSARY в Google Maps и стройте маршрут прямо до двери. Возьмите документ, подтверждающий возраст 20+, и тайский рецепт (ภ.ท.33). Вейпы, электронные сигареты и табак мы не продаём.",
    faq: [
      [
        "Кто может купить каннабис в Таиланде?",
        "Взрослые от 20 лет с рецептом, выданным в Таиланде. Рецепты из других стран не принимаются, выдача происходит лично в магазине.",
      ],
      [
        "Принимаете ли вы заказы через сайт?",
        "Нет. Здесь нет ни корзины, ни оплаты. WhatsApp нужен для вопросов о дороге, документах и о том, что сегодня в магазине.",
      ],
      [
        "Продаёте ли вы вейпы?",
        "Нет. Продажа вейпов и электронных сигарет в Таиланде запрещена, мы их не держим. Labs Cannabis — лицензированный каннабис-диспенсери.",
      ],
    ],
    closing:
      "Напишите в WhatsApp +66 66 080 6784 или откройте Google Maps и заходите: 32 Pattaya 13 Alley, для взрослых 20+ с тайским рецептом.",
  },
  th: {
    intro: (h1, area) =>
      `${h1} Labs Cannabis (เดิมชื่อ Labs Dispensary) เป็นร้านกัญชาที่ได้รับอนุญาต ตั้งอยู่ที่ 32 Pattaya 13 Alley พัทยาใต้ ใกล้กับ ${area} การส่งมอบทั้งหมดเกิดขึ้นที่หน้าร้าน สำหรับผู้ใหญ่อายุ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ไทย เว็บไซต์นี้ไม่รับคำสั่งซื้อและไม่รับชำระเงิน สอบถามเรื่องหน้าร้าน เส้นทาง และเอกสารได้ทาง WhatsApp +66 66 080 6784`,
    s1h: "การมาที่ร้านเป็นอย่างไร",
    s1b: (area) =>
      `ร้านมีใบอนุญาต และการซื้อทำที่เคาน์เตอร์แบบพบหน้าเท่านั้น สายพันธุ์ ผลที่ได้ และสิ่งที่มีอยู่จริงในวันนั้น พูดคุยกับพนักงานที่หน้าร้าน เว็บไซต์ไม่แสดงราคา ไม่แสดงสต็อก และไม่มีข้อความเชิญชวน เพราะกฎหมายไทยถือว่าเป็นการโฆษณากัญชา หากมาจาก ${area} ทักถามเส้นทางที่แน่นอนทาง WhatsApp ก่อนออกเดินทาง`,
    s2h: "เดินทางมาหาเรา",
    s2b: () =>
      "ที่อยู่ 32 Pattaya 13 Alley พัทยาใต้ ชลบุรี 20150 เปิดข้อมูล LABS DISPENSARY ใน Google Maps แล้วนำทางมาที่หน้าประตูได้เลย เตรียมบัตรที่ยืนยันอายุ 20 ปีขึ้นไป และใบสั่งแพทย์ไทย (ภ.ท.33) เราไม่จำหน่ายบุหรี่ไฟฟ้าและยาสูบ",
    faq: [
      [
        "ใครซื้อดอกกัญชาในไทยได้บ้าง?",
        "ผู้ที่มีอายุ 20 ปีขึ้นไปและมีใบสั่งแพทย์ที่ออกในประเทศไทย ใบสั่งจากต่างประเทศใช้ไม่ได้ และการส่งมอบทำที่หน้าร้านเท่านั้น",
      ],
      [
        "สั่งผ่านเว็บไซต์ได้ไหม?",
        "ไม่ได้ เว็บไซต์นี้ไม่มีตะกร้าและไม่มีการชำระเงิน WhatsApp ใช้สำหรับถามเส้นทาง เอกสาร และสิ่งที่มีที่หน้าร้านในวันนั้น",
      ],
      [
        "ขายบุหรี่ไฟฟ้าไหม?",
        "ไม่ขาย การจำหน่ายบุหรี่ไฟฟ้าในประเทศไทยผิดกฎหมาย เราไม่มีสินค้าประเภทนี้ Labs Cannabis เป็นร้านกัญชาที่ได้รับอนุญาต",
      ],
    ],
    closing:
      "ทักมาที่ WhatsApp +66 66 080 6784 หรือเปิด Google Maps แล้วแวะมาที่ 32 Pattaya 13 Alley สำหรับผู้ใหญ่ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ไทย",
  },
  ar: {
    intro: (h1, area) =>
      `${h1}. Labs Cannabis (سابقاً Labs Dispensary) متجر قنب مرخّص في 32 Pattaya 13 Alley، جنوب باتايا، على مقربة من ${area}. التسليم يتم داخل المتجر فقط، للبالغين 20 عاماً فأكثر ممن يحملون وصفة تايلاندية؛ هذا الموقع لا يستقبل طلبات ولا مدفوعات. الأسئلة عن المتوفر والطريق والأوراق عبر WhatsApp +66 66 080 6784`,
    s1h: "كيف تسير الزيارة",
    s1b: (area) =>
      `المتجر مرخّص، والشراء يتم وجهاً لوجه عند الطاولة. السلالات والتأثيرات وما هو موجود فعلاً في ذلك اليوم تُناقش مع الموظفين داخل المتجر؛ الموقع لا ينشر أسعاراً ولا قوائم مخزون ولا دعاية، لأن القانون التايلاندي يقرأ ذلك إعلاناً عن القنب. من ${area} اسأل عن الطريق الدقيق عبر WhatsApp قبل التحرك.`,
    s2h: "كيف تصل إلينا",
    s2b: () =>
      "العنوان: 32 Pattaya 13 Alley، جنوب باتايا، تشون بوري 20150. افتح بطاقة LABS DISPENSARY في Google Maps وابدأ التوجيه حتى الباب. أحضر ما يثبت أن عمرك 20 عاماً فأكثر، والوصفة التايلاندية (ภ.ท.33). لا نبيع السجائر الإلكترونية ولا التبغ.",
    faq: [
      [
        "من يستطيع شراء زهرة القنب في تايلاند؟",
        "البالغون 20 عاماً فأكثر ممن يحملون وصفة صادرة داخل تايلاند. الوصفات الأجنبية غير مقبولة، والتسليم يتم شخصياً داخل المتجر.",
      ],
      [
        "هل يستقبل الموقع الطلبات؟",
        "لا. لا توجد سلة ولا دفع هنا. WhatsApp للأسئلة عن الطريق والأوراق وما هو موجود في المتجر اليوم.",
      ],
      [
        "هل تبيعون السجائر الإلكترونية؟",
        "لا. بيع السجائر الإلكترونية غير قانوني في تايلاند ولا نوفّرها. Labs Cannabis متجر قنب مرخّص.",
      ],
    ],
    closing:
      "راسلنا على WhatsApp +66 66 080 6784 أو افتح Google Maps وزُر 32 Pattaya 13 Alley — للبالغين 20+ مع وصفة تايلاندية.",
  },
  zh: {
    intro: (h1, area) =>
      `${h1}。Labs Cannabis（原 Labs Dispensary）是一家持证大麻专卖店，地址 32 Pattaya 13 Alley，南芭提雅，距${area}不远。所有交付都在店内完成，面向持泰国处方的 20 岁以上成年人；本网站不接受订单，也不收款。关于店内情况、路线和证件的问题请用 WhatsApp +66 66 080 6784 咨询。`,
    s1h: "到店会遇到什么",
    s1b: (area) =>
      `本店持证经营，购买只能到店当面完成。品种、效果以及当天实际有什么，都由店员在店内当面说明；网站不公布价格、不公布库存、也不做任何宣传，因为泰国法律把这些视为大麻广告。从${area}出发前，请先用 WhatsApp 问清具体路线。`,
    s2h: "怎么找到我们",
    s2b: () =>
      "地址：32 Pattaya 13 Alley，南芭提雅，春武里 20150。在 Google Maps 打开 LABS DISPENSARY 的商家页面，直接导航到店门口。请携带可证明年满 20 岁的证件和泰国处方（ภ.ท.33）。我们不售卖电子烟和烟草。",
    faq: [
      [
        "在泰国谁可以购买大麻花？",
        "年满 20 岁并持有泰国境内开具处方的成年人。境外处方不被接受，交付须在店内当面完成。",
      ],
      [
        "可以在网站上下单吗？",
        "不可以。这里没有购物篮，也不收款。WhatsApp 只用于询问路线、证件和当天店内的情况。",
      ],
      [
        "你们卖电子烟吗？",
        "不卖。在泰国销售电子烟属于违法，我们没有这类商品。Labs Cannabis 是持证大麻专卖店。",
      ],
    ],
    closing:
      "用 WhatsApp +66 66 080 6784 提问，或打开 Google Maps 直接到店：32 Pattaya 13 Alley，仅限持泰国处方的 20 岁以上成年人。",
  },
  ko: {
    intro: (h1, area) =>
      `${h1}. Labs Cannabis(구 Labs Dispensary)는 32 Pattaya 13 Alley, 남파타야에 있는 허가받은 대마초 판매점이며 ${area}에서도 가깝습니다. 모든 전달은 태국 처방전을 소지한 만 20세 이상 성인을 대상으로 매장에서만 이루어지고, 이 웹사이트는 주문도 결제도 받지 않습니다. 매장 상황과 오는 길, 서류에 관한 질문은 WhatsApp +66 66 080 6784으로 보내주세요.`,
    s1h: "매장에서는 이렇게 진행됩니다",
    s1b: (area) =>
      `매장은 허가를 받았고, 구매는 카운터에서 대면으로만 이루어집니다. 품종과 효과, 그날 실제로 무엇이 있는지는 매장에서 직원과 직접 이야기합니다. 웹사이트에는 가격도 재고도 광고 문구도 싣지 않습니다. 태국 법이 이를 대마초 광고로 보기 때문입니다. ${area}에서 출발하기 전에 WhatsApp으로 정확한 경로를 물어보세요.`,
    s2h: "찾아오는 길",
    s2b: () =>
      "주소: 32 Pattaya 13 Alley, 남파타야, 촌부리 20150. Google Maps에서 LABS DISPENSARY 등록 정보를 열고 문 앞까지 길안내를 시작하세요. 만 20세 이상임을 확인할 수 있는 신분증과 태국 처방전(ภ.ท.33)을 가져오세요. 전자담배와 담배는 판매하지 않습니다.",
    faq: [
      [
        "태국에서 대마초 꽃은 누가 살 수 있나요?",
        "태국에서 발급된 처방전을 가진 만 20세 이상 성인입니다. 해외 처방전은 인정되지 않으며, 전달은 매장에서 대면으로 진행됩니다.",
      ],
      [
        "웹사이트에서 주문할 수 있나요?",
        "아니요. 장바구니도 결제도 없습니다. WhatsApp은 경로와 서류, 그날 매장 상황을 묻기 위한 창구입니다.",
      ],
      [
        "전자담배를 판매하나요?",
        "판매하지 않습니다. 태국에서 전자담배 판매는 불법이며 취급하지 않습니다. Labs Cannabis는 허가받은 대마초 판매점입니다.",
      ],
    ],
    closing:
      "WhatsApp +66 66 080 6784으로 문의하시거나 Google Maps를 열고 32 Pattaya 13 Alley로 오세요. 태국 처방전을 가진 만 20세 이상만 이용할 수 있습니다.",
  },
  ja: {
    intro: (h1, area) =>
      `${h1}。Labs Cannabis（旧Labs Dispensary）は32 Pattaya 13 Alley、南パタヤにある認可を受けた大麻ディスペンサリーで、${area}からも近い場所にあります。受け渡しはタイの処方箋を持つ20歳以上の方に対して店頭でのみ行い、このサイトは注文も決済も受け付けません。店頭の様子や道順、書類についてのご質問はWhatsApp +66 66 080 6784へどうぞ。`,
    s1h: "店頭での流れ",
    s1b: (area) =>
      `当店は認可を受けており、購入はカウンターでの対面のみです。品種や効果、その日に実際に何があるかは店頭でスタッフと直接お話しします。サイトには価格も在庫も宣伝文句も掲載しません。タイの法律ではそれが大麻の広告にあたるためです。${area}から向かう前に、正確な道順をWhatsAppでご確認ください。`,
    s2h: "アクセス",
    s2b: () =>
      "住所：32 Pattaya 13 Alley、南パタヤ、チョンブリー 20150。Google MapsでLABS DISPENSARYの掲載情報を開き、店の入口までナビゲーションを開始してください。20歳以上であることを確認できる身分証と、タイの処方箋（ภ.ท.33）をお持ちください。電子タバコやたばこは扱っていません。",
    faq: [
      [
        "タイで大麻の花を購入できるのは誰ですか？",
        "タイ国内で発行された処方箋を持つ20歳以上の方です。海外の処方箋は使えず、受け渡しは店頭で対面で行います。",
      ],
      [
        "サイトから注文できますか？",
        "できません。買い物かごも決済もありません。WhatsAppは道順や書類、その日の店頭の様子を尋ねるための窓口です。",
      ],
      [
        "電子タバコは売っていますか？",
        "販売していません。タイでは電子タバコの販売は違法で、当店では扱っていません。Labs Cannabisは認可を受けた大麻ディスペンサリーです。",
      ],
    ],
    closing:
      "WhatsApp +66 66 080 6784へご質問いただくか、Google Mapsを開いて32 Pattaya 13 Alleyへお越しください。タイの処方箋をお持ちの20歳以上の方が対象です。",
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
  // `page.weight` намеренно не подставляется: весовой тир в тексте — это ценовая
  // витрина, даже без самой цифры цены.
  return {
    source: "fallback",
    h1,
    intro: t.intro(h1, area),
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
