import type { Locale } from "@/lib/i18n";

export interface AreaDetails {
  etaMinutes: number;
  landmarks: string[];
}

export const AREA_DETAILS: Record<string, AreaDetails> = {
  pattaya: {
    etaMinutes: 20,
    landmarks: ["Walking Street", "Beach Road", "Central Pattaya"],
  },
  jomtien: {
    etaMinutes: 30,
    landmarks: ["Jomtien Beach", "Jomtien Plaza", "View Talay"],
  },
  "walking-street": {
    etaMinutes: 15,
    landmarks: ["Walking Street", "Bali Hai Pier", "Pattaya 13 Alley"],
  },
  "soi-hollywood": {
    etaMinutes: 10,
    landmarks: ["Soi Hollywood", "Pattaya 13 Alley", "Walking Street"],
  },
  naklua: {
    etaMinutes: 30,
    landmarks: ["Naklua", "Wong Amat", "Terminal 21 Pattaya"],
  },
  pratumnak: {
    etaMinutes: 25,
    landmarks: ["Pratumnak Hill", "Cosy Beach", "Big Buddha"],
  },
  "central-pattaya": {
    etaMinutes: 15,
    landmarks: ["Central Pattaya", "Beach Road", "Central Festival"],
  },
};

export const AREA_PAGE_COPY: Record<
  Locale,
  {
    title: string;
    description: string;
    h1: string;
    intro: string;
    whyTitle: string;
    whyBody: string;
    visitTitle: string;
    visitBody: string;
    landmarksTitle: string;
  }
> = {
  en: {
    title: "Cannabis near {area} | Labs Cannabis Pattaya",
    description:
      "Cannabis information near {area}. Ask Labs Cannabis about lawful medical eligibility, Thai documentation, and directions before visiting Soi Hollywood.",
    h1: "Cannabis near {area}",
    intro:
      "Labs Cannabis on Soi Hollywood answers adult visitor questions from {area} and across Pattaya about lawful medical access, Thai documentation, and directions.",
    whyTitle: "Why this area page matters",
    whyBody:
      "{area} visitors usually need a shop they can verify quickly: real Google reviews, a clear address, and direct WhatsApp contact before travelling.",
    visitTitle: "Walk in or ask first",
    visitBody:
      "The shop is at 32 Pattaya 13 Alley (Soi Hollywood), close to Walking Street. Ask on WhatsApp what Thai medical documentation is required before visiting.",
    landmarksTitle: "Nearby landmarks",
  },
  ru: {
    title: "Каннабис рядом с {area} | Labs Cannabis Паттайя",
    description:
      "Каннабис рядом с {area}: White Widow, веса 1г-1кг, магазин на Soi Hollywood и заказ через WhatsApp.",
    h1: "Каннабис рядом с {area}",
    intro:
      "Labs Cannabis на Soi Hollywood помогает гостям из {area} и всей Паттайи: свежий indoor, понятные цены по весу и быстрый ответ в WhatsApp.",
    whyTitle: "Зачем эта страница",
    whyBody:
      "Гостям из {area} важно быстро проверить магазин: реальные отзывы Google, точный адрес и прямой WhatsApp перед поездкой.",
    visitTitle: "Заходите или сначала напишите",
    visitBody:
      "Адрес: 32 Pattaya 13 Alley (Soi Hollywood), рядом с Walking Street. Напишите в WhatsApp, чтобы уточнить наличие, требуемые тайские медицинские документы и время самовывоза.",
    landmarksTitle: "Ориентиры рядом",
  },
  th: {
    title: "กัญชาใกล้ {area} | Labs Cannabis พัทยา",
    description:
      "กัญชาใกล้ {area} White Widow น้ำหนัก 1g-1kg ร้าน Soi Hollywood และสอบถามผ่าน WhatsApp",
    h1: "กัญชาใกล้ {area}",
    intro:
      "Labs Cannabis บน Soi Hollywood ให้บริการลูกค้าจาก {area} และพัทยา ดอก indoor สด ราคาตามน้ำหนักชัดเจน และตอบ WhatsApp เร็ว",
    whyTitle: "ทำไมหน้านี้สำคัญ",
    whyBody:
      "ผู้มาเยือน {area} มักต้องการร้านที่ตรวจสอบได้เร็ว: รีวิว Google จริง ที่อยู่ชัดเจน และ WhatsApp ก่อนเดินทาง",
    visitTitle: "มาที่ร้านหรือถามก่อน",
    visitBody:
      "ร้านอยู่ที่ 32 Pattaya 13 Alley (Soi Hollywood) ใกล้ Walking Street ทัก WhatsApp เพื่อถามสต็อก เอกสารแพทย์ไทยที่ต้องใช้ และเวลารับของ",
    landmarksTitle: "จุดใกล้เคียง",
  },
  ar: {
    title: "القنب قرب {area} | Labs Cannabis باتايا",
    description:
      "قنب قرب {area}. White Widow، أوزان 1g-1kg، متجر Soi Hollywood والتواصل عبر WhatsApp.",
    h1: "القنب قرب {area}",
    intro:
      "Labs Cannabis في Soi Hollywood يخدم زوار {area} وباتايا بزهور داخلية طازجة وأسعار واضحة حسب الوزن ورد سريع على WhatsApp.",
    whyTitle: "لماذا هذه الصفحة مهمة",
    whyBody:
      "زوار {area} يحتاجون إلى متجر يمكن التحقق منه بسرعة: تقييمات Google حقيقية، عنوان واضح، وتواصل مباشر قبل الذهاب.",
    visitTitle: "زُر المتجر أو اسأل أولاً",
    visitBody:
      "العنوان 32 Pattaya 13 Alley (Soi Hollywood) قرب Walking Street. راسلنا لمعرفة المخزون والوثائق الطبية التايلاندية المطلوبة ووقت الاستلام.",
    landmarksTitle: "معالم قريبة",
  },
  zh: {
    title: "{area}附近大麻 | Labs Cannabis 芭提雅",
    description:
      "{area}附近大麻：White Widow、1克至1公斤规格、Soi Hollywood门店和WhatsApp咨询。",
    h1: "{area}附近大麻",
    intro:
      "Labs Cannabis位于Soi Hollywood，为{area}和芭提雅客人提供新鲜室内花、清晰重量价格和快速WhatsApp回复。",
    whyTitle: "为什么这个页面有用",
    whyBody:
      "{area}客人通常需要快速验证商店：真实Google评价、清楚地址，以及出发前可直接WhatsApp联系。",
    visitTitle: "到店或先咨询",
    visitBody:
      "地址：32 Pattaya 13 Alley (Soi Hollywood)，靠近Walking Street。请通过WhatsApp确认库存、所需泰国医疗文件和取货时间。",
    landmarksTitle: "附近地标",
  },
  ko: {
    title: "{area} 근처 대마초 | Labs Cannabis 파타야",
    description:
      "{area} 근처 대마초. White Widow, 1g-1kg 중량, Soi Hollywood 매장 및 WhatsApp 문의.",
    h1: "{area} 근처 대마초",
    intro:
      "Soi Hollywood의 Labs Cannabis는 {area} 및 파타야 방문객에게 신선한 실내 꽃, 명확한 중량 가격, 빠른 WhatsApp 답변을 제공합니다.",
    whyTitle: "이 지역 페이지가 중요한 이유",
    whyBody:
      "{area} 방문객은 실제 Google 리뷰, 명확한 주소, 이동 전 직접 WhatsApp 연락 등 빠르게 확인 가능한 매장이 필요합니다.",
    visitTitle: "방문 또는 먼저 문의",
    visitBody:
      "주소는 Walking Street 근처 32 Pattaya 13 Alley (Soi Hollywood)입니다. 재고, 필요한 태국 의료 문서, 픽업 시간을 WhatsApp으로 확인하세요.",
    landmarksTitle: "주변 랜드마크",
  },
  ja: {
    title: "{area}近くの大麻 | Labs Cannabis パタヤ",
    description:
      "{area}近くの大麻。White Widow、1g-1kg、Soi Hollywood店舗、WhatsApp相談。",
    h1: "{area}近くの大麻",
    intro:
      "Soi HollywoodのLabs Cannabisは、{area}とパタヤのゲストに新鮮なインドアフラワー、明確な重量価格、迅速なWhatsApp返信を提供します。",
    whyTitle: "このエリアページの役割",
    whyBody:
      "{area}の訪問者には、実際のGoogleレビュー、明確な住所、移動前に直接WhatsAppで確認できる店舗が必要です。",
    visitTitle: "来店または事前相談",
    visitBody:
      "住所はWalking Street近くの32 Pattaya 13 Alley (Soi Hollywood)。在庫、必要なタイ医療書類、受取時間をWhatsAppで確認してください。",
    landmarksTitle: "近くの目印",
  },
};

export const DELIVERY_PAGE_COPY: Record<
  Locale,
  {
    title: string;
    description: string;
    h1: string;
    intro: string;
    cta: string;
    maps: string;
    statusTitle: string;
    eta: string;
    payment: string;
    discreet: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
  }
> = {
  en: {
    title: "Cannabis pickup guidance for {area} | Labs Cannabis Pattaya",
    description:
      "Ask Labs Cannabis about compliant cannabis pickup guidance for {area}. Thai prescription requirements, current stock questions, and visit planning.",
    h1: "Cannabis pickup guidance for {area}",
    intro:
      "Message Labs Cannabis on WhatsApp before travelling from {area}. We can answer stock questions, explain compliant purchase requirements, and help plan a shop visit.",
    cta: "Ask before visiting",
    maps: "Open Maps",
    statusTitle: "Before you visit",
    eta: "Typical reply and visit coordination: about {eta} min",
    payment: "Cannabis flower sales are not completed online",
    discreet: "Valid Thai prescription or required medical documentation must be confirmed",
    faqTitle: "Visit guidance FAQ",
    faq: [
      {
        q: "Can I ask from {area} before visiting?",
        a: "Yes, contact us on WhatsApp first so we can explain current stock, timing, and legal requirements. Cannabis flower sales are not completed online.",
      },
      {
        q: "What documents are needed?",
        a: "Tourists need a valid prescription issued in Thailand by a licensed medical professional, or required Thai medical documentation. Ask before buying.",
      },
      {
        q: "Can I walk in instead?",
        a: "Yes. The shop is on Soi Hollywood, a short walk from Walking Street.",
      },
    ],
  },
  ru: {
    title: "Доставка каннабиса в {area} | Labs Cannabis Паттайя",
    description:
      "Уточните самовывоз или доставку Labs Cannabis для {area}: свежий indoor, WhatsApp и информация по тайским медицинским документам.",
    h1: "Запрос доставки каннабиса в {area}",
    intro:
      "Напишите Labs Cannabis в WhatsApp перед поездкой из {area}. Мы подтвердим наличие, требования к покупке, способы оплаты и реалистичное время.",
    cta: "Спросить в WhatsApp",
    maps: "Открыть карту",
    statusTitle: "Перед заказом",
    eta: "Обычная координация: около {eta} минут",
    payment: "Наличные или QR после подтверждения",
    discreet: "Понятные инструкции по самовывозу или доставке",
    faqTitle: "FAQ по доставке",
    faq: [
      {
        q: "Можно заказать из {area}?",
        a: "Да, сначала напишите в WhatsApp, чтобы подтвердить наличие, время и юридические требования.",
      },
      {
        q: "Какие документы нужны?",
        a: "Для цветов каннабиса в Таиланде нужна действующая тайская рецептурная или медицинская документация. Уточните до покупки.",
      },
      {
        q: "Можно просто прийти?",
        a: "Да. Магазин находится на Soi Hollywood, недалеко от Walking Street.",
      },
    ],
  },
  th: {
    title: "จัดส่งกัญชาไป {area} | Labs Cannabis พัทยา",
    description:
      "สอบถามการรับหรือจัดส่งกับ Labs Cannabis สำหรับ {area} ดอก indoor สด WhatsApp และคำแนะนำเรื่องเอกสารแพทย์ไทย",
    h1: "สอบถามจัดส่งกัญชาไป {area}",
    intro:
      "ทัก Labs Cannabis บน WhatsApp ก่อนเดินทางจาก {area} เราจะยืนยันสต็อก เงื่อนไขการซื้อ วิธีชำระเงิน และเวลาที่เหมาะสม",
    cta: "ถามใน WhatsApp",
    maps: "เปิดแผนที่",
    statusTitle: "ก่อนสั่ง",
    eta: "เวลาตอบและประสานงานประมาณ {eta} นาที",
    payment: "เงินสดหรือ QR หลังยืนยัน",
    discreet: "คำแนะนำรับของหรือจัดส่งชัดเจน",
    faqTitle: "คำถามจัดส่ง",
    faq: [
      {
        q: "สั่งจาก {area} ได้ไหม?",
        a: "ได้ กรุณาทัก WhatsApp ก่อนเพื่อยืนยันสต็อก เวลา และข้อกำหนดทางกฎหมาย",
      },
      {
        q: "ต้องใช้เอกสารอะไร?",
        a: "ดอกกัญชาในไทยต้องมีใบสั่งยาหรือเอกสารทางการแพทย์ที่ถูกต้อง กรุณาถามก่อนซื้อ",
      },
      {
        q: "เดินเข้าร้านได้ไหม?",
        a: "ได้ ร้านอยู่บน Soi Hollywood ใกล้ Walking Street",
      },
    ],
  },
  ar: {
    title: "توصيل القنب إلى {area} | Labs Cannabis باتايا",
    description:
      "اسأل Labs Cannabis عن الاستلام أو التوصيل إلى {area}. زهور داخلية، WhatsApp، وإرشاد حول الوثائق الطبية التايلاندية.",
    h1: "طلب توصيل القنب إلى {area}",
    intro:
      "راسل Labs Cannabis على WhatsApp قبل الانتقال من {area}. نؤكد المخزون والمتطلبات القانونية والدفع والوقت الواقعي.",
    cta: "اسأل على WhatsApp",
    maps: "افتح الخريطة",
    statusTitle: "قبل الطلب",
    eta: "الرد والتنسيق عادةً حوالي {eta} دقيقة",
    payment: "نقد أو QR بعد التأكيد",
    discreet: "تعليمات واضحة للاستلام أو التوصيل",
    faqTitle: "أسئلة التوصيل",
    faq: [
      {
        q: "هل يمكن الطلب من {area}؟",
        a: "نعم، راسلنا أولاً على WhatsApp لتأكيد المخزون والوقت والمتطلبات القانونية.",
      },
      {
        q: "ما الوثائق المطلوبة؟",
        a: "زهور القنب في تايلاند تتطلب وصفة تايلاندية صالحة أو وثائق طبية مطلوبة. اسأل قبل الشراء.",
      },
      {
        q: "هل يمكن زيارة المتجر؟",
        a: "نعم. المتجر في Soi Hollywood قرب Walking Street.",
      },
    ],
  },
  zh: {
    title: "{area}大麻配送咨询 | Labs Cannabis 芭提雅",
    description:
      "向Labs Cannabis咨询{area}取货或配送：新鲜室内花、WhatsApp下单、泰国医疗文件说明。",
    h1: "{area}大麻配送咨询",
    intro:
      "从{area}出发前请先WhatsApp联系Labs Cannabis。我们会确认库存、合规购买要求、付款方式和实际时间。",
    cta: "WhatsApp咨询",
    maps: "打开地图",
    statusTitle: "下单前",
    eta: "通常回复和协调约{eta}分钟",
    payment: "确认后现金或QR付款",
    discreet: "清楚的取货或配送说明",
    faqTitle: "配送常见问题",
    faq: [
      {
        q: "可以从{area}下单吗？",
        a: "可以，请先WhatsApp确认库存、时间和法律要求。",
      },
      {
        q: "需要什么文件？",
        a: "泰国大麻花需要有效泰国处方或所需医疗文件。购买前请咨询。",
      },
      {
        q: "可以直接到店吗？",
        a: "可以。门店位于Soi Hollywood，靠近Walking Street。",
      },
    ],
  },
  ko: {
    title: "{area} 대마초 배달 문의 | Labs Cannabis 파타야",
    description:
      "{area} 픽업 또는 배달을 Labs Cannabis에 문의하세요. 신선한 실내 꽃, WhatsApp 주문, 태국 의료 문서 안내.",
    h1: "{area} 대마초 배달 문의",
    intro:
      "{area}에서 이동하기 전 Labs Cannabis에 WhatsApp으로 문의하세요. 재고, 구매 요건, 결제 옵션, 현실적인 시간을 확인합니다.",
    cta: "WhatsApp 문의",
    maps: "지도 열기",
    statusTitle: "주문 전 확인",
    eta: "일반 답변 및 조율: 약 {eta}분",
    payment: "확인 후 현금 또는 QR 송금",
    discreet: "명확한 픽업 또는 배달 안내",
    faqTitle: "배달 FAQ",
    faq: [
      {
        q: "{area}에서 주문할 수 있나요?",
        a: "가능합니다. 먼저 WhatsApp으로 재고, 시간, 법적 요건을 확인하세요.",
      },
      {
        q: "어떤 문서가 필요한가요?",
        a: "태국 대마초 꽃은 유효한 태국 처방 또는 필요한 의료 문서가 필요합니다. 구매 전 문의하세요.",
      },
      {
        q: "직접 방문도 가능한가요?",
        a: "네. 매장은 Walking Street 근처 Soi Hollywood에 있습니다.",
      },
    ],
  },
  ja: {
    title: "{area}への大麻配達相談 | Labs Cannabis パタヤ",
    description:
      "{area}の受取または配達をLabs Cannabisに相談。新鮮なインドアフラワー、WhatsApp注文、タイ医療書類の案内。",
    h1: "{area}への大麻配達相談",
    intro:
      "{area}から移動する前にLabs CannabisへWhatsAppでご連絡ください。在庫、購入要件、支払い方法、現実的な時間を確認します。",
    cta: "WhatsAppで相談",
    maps: "地図を開く",
    statusTitle: "注文前に確認",
    eta: "通常の返信と調整：約{eta}分",
    payment: "確認後に現金またはQR送金",
    discreet: "明確な受取または配達案内",
    faqTitle: "配達FAQ",
    faq: [
      {
        q: "{area}から注文できますか？",
        a: "可能です。まずWhatsAppで在庫、時間、法的要件を確認してください。",
      },
      {
        q: "必要な書類は？",
        a: "タイの大麻花には有効なタイの処方または必要な医療書類が必要です。購入前にご相談ください。",
      },
      {
        q: "直接来店できますか？",
        a: "はい。店舗はWalking Street近くのSoi Hollywoodにあります。",
      },
    ],
  },
};

export const DELIVERY_COMPLIANCE_NOTE: Record<
  Locale,
  { title: string; text: string; sourceCta: string }
> = {
  en: {
    title: "Compliance first",
    text:
      "WhatsApp is for questions and visit coordination only. Thailand now treats cannabis flower as a controlled substance; tourists need a valid Thai prescription issued by a licensed medical professional before purchase.",
    sourceCta: "Official tourist notice",
  },
  ru: {
    title: "Сначала требования закона",
    text:
      "WhatsApp нужен только для вопросов и координации визита. В Таиланде цветок каннабиса контролируется; туристам нужен действующий тайский рецепт от лицензированного медицинского специалиста.",
    sourceCta: "Официальное уведомление",
  },
  th: {
    title: "ตรวจสอบข้อกำหนดก่อน",
    text:
      "WhatsApp ใช้สำหรับสอบถามและนัดหมายการมาเยี่ยมชมเท่านั้น ดอกกัญชาในไทยเป็นสารควบคุม นักท่องเที่ยวต้องมีใบสั่งยาไทยจากผู้เชี่ยวชาญที่ได้รับอนุญาตก่อนซื้อ",
    sourceCta: "ประกาศทางการ",
  },
  ar: {
    title: "الامتثال أولا",
    text:
      "WhatsApp مخصص للأسئلة وتنسيق الزيارة فقط. تعتبر تايلاند زهور القنب مادة خاضعة للرقابة؛ يحتاج السائح إلى وصفة تايلاندية صالحة من مختص طبي مرخص قبل الشراء.",
    sourceCta: "الإشعار الرسمي",
  },
  zh: {
    title: "先确认合规要求",
    text:
      "WhatsApp 仅用于咨询和到店协调。泰国现将大麻花作为受控物质；游客购买前需要由泰国持证医疗专业人员开具的有效处方。",
    sourceCta: "官方游客通知",
  },
  ko: {
    title: "규정 확인 우선",
    text:
      "WhatsApp은 문의와 방문 조율용입니다. 태국은 대마초 꽃을 통제 물질로 취급하며, 관광객은 구매 전 태국 면허 의료 전문가가 발급한 유효한 처방이 필요합니다.",
    sourceCta: "공식 관광객 안내",
  },
  ja: {
    title: "法令確認を優先",
    text:
      "WhatsApp は質問と来店調整のためのものです。タイでは大麻花は管理対象であり、旅行者は購入前にタイの認可医療専門家による有効な処方が必要です。",
    sourceCta: "公式旅行者通知",
  },
};

export function renderCopy(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
