import type { Locale } from "@/lib/i18n";

export const LEGAL_GUIDE_SOURCE_URL =
  "https://thailand.go.th/issue-focus-detail/cannabis-now-strictly-regulated-in-thailand--important-notice-for-tourists?hl=en";

export interface LegalGuideCopy {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sourceLabel: string;
  sourceCta: string;
  breadcrumb: string;
  sections: { h2: string; body: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
}

export const LEGAL_GUIDE_COPY: Record<Locale, LegalGuideCopy> = {
  en: {
    title: "Thailand cannabis rules for tourists | Labs Cannabis Pattaya",
    description:
      "Practical cannabis guidance for tourists in Pattaya: Thai prescription or required medical documentation, age limits, public-use caution, and border rules.",
    h1: "Thailand cannabis rules for tourists",
    intro:
      "Cannabis flower in Thailand is strictly regulated as a controlled substance. Before visiting a shop, tourists should understand that purchase or possession requires a valid Thai prescription and should not assume recreational use is unrestricted.",
    sourceLabel: "Official tourist notice",
    sourceCta: "Read Thailand.go.th guidance",
    breadcrumb: "Tourist legal guide",
    sections: [
      {
        h2: "Bring the right documentation",
        body: "Tourists need a valid prescription issued in Thailand by a licensed medical professional. Cannabis flower should be treated as a controlled medical purchase, not an open recreational purchase.",
      },
      {
        h2: "Stay discreet and follow local rules",
        body: "Do not use cannabis in public places, near schools, or anywhere it may disturb other people. Keep products sealed while travelling and follow staff instructions.",
      },
      {
        h2: "Do not cross borders with cannabis",
        body: "Do not carry cannabis through airports, across borders, or into another country. Rules change quickly, so confirm official guidance before travelling.",
      },
    ],
    faqTitle: "Tourist cannabis FAQ",
    faq: [
      {
        q: "Can tourists buy cannabis in Thailand?",
        a: "Only with compliant medical documentation, including a valid Thai prescription issued by a licensed medical professional. Tourists should not assume open recreational access.",
      },
      {
        q: "Is public cannabis use allowed?",
        a: "Avoid public use. It can disturb others and create legal risk under nuisance and public-health rules.",
      },
      {
        q: "Can I take cannabis out of Thailand?",
        a: "No. Do not take cannabis through airports, across borders, or into another country.",
      },
    ],
  },
  ru: {
    title: "Правила каннабиса для туристов в Таиланде | Labs Cannabis Pattaya",
    description:
      "Практичная памятка для туристов в Паттайе: тайский рецепт или нужные медицинские документы, возрастные ограничения, осторожность с публичным употреблением и правила на границе.",
    h1: "Правила каннабиса в Таиланде для туристов",
    intro:
      "Каннабис в Таиланде строго регулируется. Перед визитом в магазин туристам важно уточнить требования к медицинским документам и не считать доступ полностью рекреационным.",
    sourceLabel: "Официальное уведомление для туристов",
    sourceCta: "Открыть Thailand.go.th",
    breadcrumb: "Гид для туристов",
    sections: [
      {
        h2: "Подготовьте документы",
        body: "Покупку цветка каннабиса стоит воспринимать как регулируемую медицинскую покупку. До покупки уточните, нужен ли действующий тайский рецепт или требуемая медицинская документация.",
      },
      {
        h2: "Соблюдайте местные правила",
        body: "Не употребляйте каннабис в общественных местах, рядом со школами и там, где это может мешать другим людям. Держите продукт закрытым во время поездок.",
      },
      {
        h2: "Не перевозите через границу",
        body: "Не берите каннабис в аэропорт, через границу или в другую страну. Правила меняются, поэтому перед поездкой проверяйте официальные источники.",
      },
    ],
    faqTitle: "FAQ для туристов",
    faq: [
      {
        q: "Может ли турист купить каннабис в Таиланде?",
        a: "Не стоит считать доступ свободным рекреационным. Сначала уточните требования к тайскому рецепту или медицинским документам.",
      },
      {
        q: "Можно ли употреблять публично?",
        a: "Избегайте публичного употребления: это может мешать другим и создать юридический риск.",
      },
      {
        q: "Можно вывезти каннабис из Таиланда?",
        a: "Нет. Не перевозите каннабис через аэропорты, границы или в другую страну.",
      },
    ],
  },
  th: {
    title: "กฎกัญชาสำหรับนักท่องเที่ยวไทย | Labs Cannabis Pattaya",
    description:
      "คำแนะนำสำหรับนักท่องเที่ยวในพัทยาเรื่องเอกสารแพทย์ไทย ข้อจำกัดอายุ การหลีกเลี่ยงการใช้ในที่สาธารณะ และการเดินทางข้ามแดน",
    h1: "กฎกัญชาในไทยสำหรับนักท่องเที่ยว",
    intro:
      "กัญชาในประเทศไทยอยู่ภายใต้การควบคุมอย่างเข้มงวด นักท่องเที่ยวควรถามเรื่องใบสั่งยาไทยหรือเอกสารทางการแพทย์ที่จำเป็นก่อนซื้อ",
    sourceLabel: "ประกาศทางการสำหรับนักท่องเที่ยว",
    sourceCta: "อ่านข้อมูลจาก Thailand.go.th",
    breadcrumb: "คู่มือนักท่องเที่ยว",
    sections: [
      {
        h2: "เตรียมเอกสารให้ถูกต้อง",
        body: "การซื้อดอกกัญชาควรมองเป็นการซื้อเพื่อวัตถุประสงค์ทางการแพทย์ที่มีการควบคุม กรุณาถามก่อนว่าต้องใช้ใบสั่งยาไทยหรือเอกสารใด",
      },
      {
        h2: "ใช้ด้วยความระมัดระวัง",
        body: "หลีกเลี่ยงการใช้ในที่สาธารณะ ใกล้โรงเรียน หรือบริเวณที่อาจรบกวนผู้อื่น เก็บสินค้าให้ปิดสนิทระหว่างเดินทาง",
      },
      {
        h2: "ห้ามนำข้ามแดน",
        body: "อย่านำกัญชาไปสนามบิน ข้ามพรมแดน หรือเข้าประเทศอื่น ตรวจสอบคำแนะนำทางการก่อนเดินทางเสมอ",
      },
    ],
    faqTitle: "คำถามสำหรับนักท่องเที่ยว",
    faq: [
      {
        q: "นักท่องเที่ยวซื้อกัญชาในไทยได้ไหม?",
        a: "ไม่ควรถือว่าเป็นการซื้อเพื่อสันทนาการแบบเปิดเสรี กรุณาถามเรื่องใบสั่งยาไทยหรือเอกสารทางการแพทย์ก่อน",
      },
      {
        q: "ใช้ในที่สาธารณะได้ไหม?",
        a: "ควรหลีกเลี่ยง เพราะอาจรบกวนผู้อื่นและมีความเสี่ยงทางกฎหมาย",
      },
      {
        q: "นำกัญชาออกจากไทยได้ไหม?",
        a: "ไม่ได้ อย่านำกัญชาผ่านสนามบิน ข้ามแดน หรือเข้าประเทศอื่น",
      },
    ],
  },
  ar: {
    title: "قواعد القنب للسياح في تايلاند | Labs Cannabis Pattaya",
    description:
      "إرشادات عملية للسياح في باتايا حول الوصفة التايلاندية أو الوثائق الطبية المطلوبة، العمر، الاستخدام العام، والسفر عبر الحدود.",
    h1: "قواعد القنب في تايلاند للسياح",
    intro:
      "القنب في تايلاند منظم بصرامة. قبل زيارة المتجر، يجب على السياح السؤال عن الوصفة التايلاندية أو الوثائق الطبية المطلوبة وعدم افتراض أن الاستخدام الترفيهي مفتوح.",
    sourceLabel: "إشعار رسمي للسياح",
    sourceCta: "اقرأ إرشادات Thailand.go.th",
    breadcrumb: "دليل السياح",
    sections: [
      {
        h2: "أحضر الوثائق الصحيحة",
        body: "يجب التعامل مع شراء زهور القنب كشراء طبي منظم. اسأل قبل الشراء عن الوصفة التايلاندية الصالحة أو الوثائق الطبية المطلوبة.",
      },
      {
        h2: "التزم بالقواعد المحلية",
        body: "تجنب الاستخدام في الأماكن العامة أو قرب المدارس أو في أي مكان قد يزعج الآخرين. أبق المنتج مغلقا أثناء التنقل.",
      },
      {
        h2: "لا تعبر الحدود بالقنب",
        body: "لا تحمل القنب عبر المطارات أو الحدود أو إلى دولة أخرى. تحقق من الإرشادات الرسمية قبل السفر.",
      },
    ],
    faqTitle: "أسئلة السياح",
    faq: [
      {
        q: "هل يمكن للسائح شراء القنب في تايلاند؟",
        a: "لا تفترض أن الوصول الترفيهي مفتوح. اسأل أولا عن الوصفة التايلاندية أو الوثائق الطبية المطلوبة.",
      },
      {
        q: "هل يسمح بالاستخدام العام؟",
        a: "تجنب الاستخدام العام لأنه قد يزعج الآخرين ويخلق مخاطر قانونية.",
      },
      {
        q: "هل يمكن إخراج القنب من تايلاند؟",
        a: "لا. لا تحمل القنب عبر المطارات أو الحدود أو إلى بلد آخر.",
      },
    ],
  },
  zh: {
    title: "泰国游客大麻规则 | Labs Cannabis Pattaya",
    description:
      "芭提雅游客实用指南：泰国处方或所需医疗文件、年龄限制、公共场所注意事项以及出入境规则。",
    h1: "泰国游客大麻规则",
    intro:
      "泰国对大麻实行严格监管。游客到店前应先确认泰国处方或所需医疗文件，不应默认娱乐用途完全开放。",
    sourceLabel: "官方游客通知",
    sourceCta: "阅读 Thailand.go.th 指引",
    breadcrumb: "游客法律指南",
    sections: [
      {
        h2: "准备正确文件",
        body: "购买大麻花应视为受监管的医疗购买。购买前请询问是否需要有效泰国处方或所需医疗文件。",
      },
      {
        h2: "遵守当地规则",
        body: "不要在公共场所、学校附近或可能影响他人的地方使用。旅行途中请保持产品密封。",
      },
      {
        h2: "不要携带出入境",
        body: "不要将大麻带到机场、跨越边境或带入其他国家。旅行前请确认官方信息。",
      },
    ],
    faqTitle: "游客常见问题",
    faq: [
      {
        q: "游客可以在泰国购买大麻吗？",
        a: "不要默认娱乐用途开放。请先询问泰国处方或所需医疗文件。",
      },
      {
        q: "可以公开使用吗？",
        a: "应避免公共使用，因为可能影响他人并带来法律风险。",
      },
      {
        q: "可以把大麻带出泰国吗？",
        a: "不可以。不要通过机场、边境或带入其他国家。",
      },
    ],
  },
  ko: {
    title: "태국 관광객 대마초 규정 | Labs Cannabis Pattaya",
    description:
      "파타야 관광객을 위한 안내: 태국 처방 또는 필요한 의료 문서, 연령 제한, 공공장소 주의, 국경 이동 규칙.",
    h1: "태국 관광객을 위한 대마초 규정",
    intro:
      "태국의 대마초는 엄격히 규제됩니다. 매장 방문 전 태국 처방 또는 필요한 의료 문서를 확인하고, 오락용 접근이 자유롭다고 가정하지 마세요.",
    sourceLabel: "공식 관광객 안내",
    sourceCta: "Thailand.go.th 안내 보기",
    breadcrumb: "관광객 법률 가이드",
    sections: [
      {
        h2: "필요한 문서를 준비하세요",
        body: "대마초 꽃 구매는 규제되는 의료 구매로 보아야 합니다. 구매 전 유효한 태국 처방 또는 필요한 의료 문서를 문의하세요.",
      },
      {
        h2: "현지 규칙을 따르세요",
        body: "공공장소, 학교 근처, 다른 사람에게 불편을 줄 수 있는 곳에서는 사용하지 마세요. 이동 중에는 제품을 밀봉해 두세요.",
      },
      {
        h2: "국경을 넘겨 가져가지 마세요",
        body: "공항, 국경, 다른 국가로 대마초를 가져가지 마세요. 여행 전 공식 안내를 확인하세요.",
      },
    ],
    faqTitle: "관광객 FAQ",
    faq: [
      {
        q: "관광객도 태국에서 대마초를 살 수 있나요?",
        a: "오락용 접근이 자유롭다고 가정하지 마세요. 태국 처방 또는 필요한 의료 문서를 먼저 문의하세요.",
      },
      {
        q: "공공장소에서 사용해도 되나요?",
        a: "피하는 것이 좋습니다. 다른 사람에게 불편을 주거나 법적 위험이 생길 수 있습니다.",
      },
      {
        q: "태국 밖으로 가져갈 수 있나요?",
        a: "안 됩니다. 공항, 국경, 다른 국가로 가져가지 마세요.",
      },
    ],
  },
  ja: {
    title: "タイ旅行者向け大麻ルール | Labs Cannabis Pattaya",
    description:
      "パタヤ旅行者向けの実用ガイド。タイの処方または必要な医療書類、年齢制限、公共の場での注意、国境移動のルール。",
    h1: "タイ旅行者向け大麻ルール",
    intro:
      "タイの大麻は厳しく規制されています。来店前にタイの処方または必要な医療書類を確認し、娯楽目的で自由に購入できるとは考えないでください。",
    sourceLabel: "旅行者向け公式通知",
    sourceCta: "Thailand.go.th の案内を読む",
    breadcrumb: "旅行者向け法務ガイド",
    sections: [
      {
        h2: "必要な書類を確認",
        body: "大麻花の購入は規制された医療購入として扱ってください。購入前に有効なタイの処方または必要な医療書類を確認しましょう。",
      },
      {
        h2: "現地ルールを守る",
        body: "公共の場所、学校の近く、他人の迷惑になる場所での使用は避けてください。移動中は製品を密封してください。",
      },
      {
        h2: "国外へ持ち出さない",
        body: "空港、国境、他国へ大麻を持ち込まないでください。旅行前に公式情報を確認してください。",
      },
    ],
    faqTitle: "旅行者FAQ",
    faq: [
      {
        q: "旅行者はタイで大麻を購入できますか？",
        a: "娯楽目的で自由に購入できると考えないでください。タイの処方または必要な医療書類を先に確認してください。",
      },
      {
        q: "公共の場で使用できますか？",
        a: "避けてください。他人の迷惑や法的リスクにつながる可能性があります。",
      },
      {
        q: "タイ国外へ持ち出せますか？",
        a: "できません。空港、国境、他国へ持ち出さないでください。",
      },
    ],
  },
};
