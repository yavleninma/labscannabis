import { CONTACT } from "@/data/site";
import { renderCopy } from "@/data/area-copy";
import { LOCALES, type Locale } from "@/lib/i18n";

/**
 * Единственный источник текстов для контактных CTA (W1-04).
 *
 * Прежние префиллы заканчивались юридической оговоркой, написанной от лица
 * посетителя («я не оформляю онлайн-заказ и не отправляю оплату»), а
 * `TrackingScript` дописывал в тело сообщения технический тег
 * `[source: …; page: …; utm: …]`. То и другое человек читал в своём мессенджере
 * ДО отправки: чужая оговорка вместо его вопроса и служебная строка, выглядящая
 * как спам. Это единственная правка, которая действует на 100% текущего трафика
 * в день деплоя.
 *
 * Правила, которым обязан подчиняться любой текст в этом файле:
 * - язык локали, ни одной английской строки в неанглийской локали;
 * - ≤ `MAX_PREFILL_LENGTH` символов — длинный префилл обрезается в превью WhatsApp;
 * - живой вопрос про наличие, часы или дорогу; без цен, без «заказать», без обещаний;
 * - ни `source`, ни `page`, ни `utm`, ни `ref` в теле: атрибуция снимается с
 *   `data-*`-атрибутов ссылки, а `wa.me` всё равно понимает только параметр `text`.
 */

/** Что человек на самом деле хочет спросить, нажимая кнопку. */
export type PrefillIntent =
  /** Пришёл за адресом и временем: «зайду сегодня, вы открыты?» */
  | "visit"
  /** Пришёл с коммерческим интентом: «что сегодня на витрине?» */
  | "menu"
  /** Стоит в конкретном районе и ищет дорогу. */
  | "area"
  /** Единственный вопрос — часы работы. */
  | "hours"
  /** Турист, вопрос про рецепт ภ.ท.33 — самый горячий вопрос на legal-гайде. */
  | "prescription";

export interface PrefillVars {
  /** Название района на языке локали; без него `area` вырождается в `visit`. */
  area?: string;
}

type PrefillBuilder = (vars?: PrefillVars) => string;

/** Превью сообщения в WhatsApp обрезается — всё, что длиннее, человек не прочитает. */
export const MAX_PREFILL_LENGTH = 160;

/**
 * Тексты хранятся шаблонами с `{area}`, а наружу отдаются функциями: вызывающему
 * коду не нужно знать, какой intent принимает переменные, а какой нет.
 */
const PREFILL_TEMPLATES: Record<Locale, Record<PrefillIntent, string>> = {
  en: {
    visit:
      "Hi! I am in Pattaya, 20+. I would like to drop by today — are you open now, and how do I find the door?",
    menu: "Hi! I am in Pattaya, 20+. What is on the shelf today and how late are you open?",
    area: "Hi! I am in {area} right now, 20+. Are you open, and what is the easiest way to reach you?",
    hours: "Hi! Are you open right now, and until what time today?",
    prescription:
      "Hi! I am a visitor and I have a question about the prescription requirement. When can I come in?",
  },
  ru: {
    visit:
      "Здравствуйте! Я в Паттайе, мне 20+. Хочу зайти сегодня — вы сейчас открыты и как проще всего вас найти?",
    menu: "Здравствуйте! Я в Паттайе, мне 20+. Что сегодня есть на витрине и до скольких вы работаете?",
    area: "Здравствуйте! Мой район — {area}, мне 20+. Вы открыты сейчас? Как удобнее до вас добраться?",
    hours: "Здравствуйте! Вы сейчас открыты и до скольких работаете сегодня?",
    prescription:
      "Здравствуйте! Я турист, вопрос про рецепт: как это устроено у вас и когда можно подойти?",
  },
  th: {
    visit:
      "สวัสดีครับ/ค่ะ ผมอยู่พัทยา อายุ 20 ปีขึ้นไป อยากแวะวันนี้ ตอนนี้ร้านเปิดอยู่ไหม และเข้าทางไหนครับ",
    menu: "สวัสดีครับ/ค่ะ ผมอยู่พัทยา อายุ 20 ปีขึ้นไป วันนี้หน้าร้านมีอะไรบ้าง และเปิดถึงกี่โมงครับ",
    area: "สวัสดีครับ/ค่ะ ตอนนี้ผมอยู่แถว {area} อายุ 20 ปีขึ้นไป ร้านเปิดอยู่ไหม และไปทางไหนสะดวกที่สุดครับ",
    hours: "สวัสดีครับ/ค่ะ ตอนนี้ร้านเปิดอยู่ไหม และวันนี้เปิดถึงกี่โมงครับ",
    prescription:
      "สวัสดีครับ/ค่ะ ผมเป็นนักท่องเที่ยว อยากสอบถามเรื่องใบสั่งแพทย์ และเข้าไปที่ร้านได้ตอนไหนครับ",
  },
  ar: {
    visit:
      "مرحباً! أنا في باتايا وعمري 20 عاماً فأكثر. أود المرور اليوم — هل أنتم مفتوحون الآن؟ وكيف أصل إلى الباب؟",
    menu: "مرحباً! أنا في باتايا وعمري 20 عاماً فأكثر. ما المتوفر على الرف اليوم؟ وحتى أي ساعة تعملون؟",
    area: "مرحباً! أنا الآن في {area} وعمري 20 عاماً فأكثر. هل أنتم مفتوحون؟ وما أسهل طريق للوصول إليكم؟",
    hours: "مرحباً! هل أنتم مفتوحون الآن؟ وحتى أي ساعة تعملون اليوم؟",
    prescription: "مرحباً! أنا زائر ولدي سؤال عن شرط الوصفة الطبية. متى يمكنني الحضور؟",
  },
  zh: {
    visit: "你好！我在芭提雅，已满20岁。今天想过去看看，现在营业吗？门口怎么找？",
    menu: "你好！我在芭提雅，已满20岁。今天店里有什么？营业到几点？",
    area: "你好！我现在在{area}，已满20岁。你们现在营业吗？怎么走最方便？",
    hours: "你好！你们现在营业吗？今天营业到几点？",
    prescription: "你好！我是游客，想问一下处方的相关规定，什么时候可以到店？",
  },
  ko: {
    visit:
      "안녕하세요! 파타야에 있고 20세 이상입니다. 오늘 들르고 싶은데 지금 영업하시나요? 입구는 어디인가요?",
    menu: "안녕하세요! 파타야에 있고 20세 이상입니다. 오늘 매장에 어떤 게 있나요? 몇 시까지 영업하시나요?",
    area: "안녕하세요! 지금 {area}에 있고 20세 이상입니다. 지금 영업하시나요? 어떻게 가면 제일 편할까요?",
    hours: "안녕하세요! 지금 영업 중이신가요? 오늘 몇 시까지 하시나요?",
    prescription: "안녕하세요! 여행 중인데 처방전 요건에 대해 문의드립니다. 언제 방문하면 될까요?",
  },
  ja: {
    visit:
      "こんにちは！パタヤにいる20歳以上です。今日お伺いしたいのですが、今営業していますか？入口はどこですか？",
    menu: "こんにちは！パタヤにいる20歳以上です。今日はどんなものがありますか？何時まで営業していますか？",
    area: "こんにちは！今{area}にいる20歳以上です。今営業していますか？どう行くのが一番簡単ですか？",
    hours: "こんにちは！今営業していますか？今日は何時まで営業していますか？",
    prescription: "こんにちは！旅行者ですが、処方箋の要件について伺いたいです。いつ伺えますか？",
  },
};

const PREFILL_INTENTS: readonly PrefillIntent[] = [
  "visit",
  "menu",
  "area",
  "hours",
  "prescription",
];

function buildPrefill(locale: Locale, intent: PrefillIntent, vars?: PrefillVars): string {
  // Без названия района «Я сейчас в районе {area}» превращается в оборванную фразу,
  // поэтому пустой `area` откатывается на нейтральный вопрос про визит.
  const effective = intent === "area" && !vars?.area ? "visit" : intent;
  return renderCopy(PREFILL_TEMPLATES[locale][effective], { area: vars?.area ?? "" }).trim();
}

export const CTA_PREFILL: Record<Locale, Record<PrefillIntent, PrefillBuilder>> = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    Object.fromEntries(
      PREFILL_INTENTS.map((intent) => [intent, (vars?: PrefillVars) => buildPrefill(locale, intent, vars)]),
    ),
  ]),
) as Record<Locale, Record<PrefillIntent, PrefillBuilder>>;

export function ctaPrefill(locale: Locale, intent: PrefillIntent, vars?: PrefillVars): string {
  return buildPrefill(locale, intent, vars);
}

/**
 * Готовая `wa.me`-ссылка. Параметра `source` здесь нет и быть не может: `wa.me`
 * понимает только `text`, а всё лишнее уезжает в тело сообщения. Атрибуция —
 * через `data-*` на самом якоре.
 */
export function ctaWhatsAppHref(locale: Locale, intent: PrefillIntent, vars?: PrefillVars): string {
  return CONTACT.whatsappWithMsg(ctaPrefill(locale, intent, vars));
}

export interface CtaLabels {
  /** Основная кнопка: продаёт повод написать, а не то, что Google Maps даёт бесплатно. */
  whatsapp: string;
  /** Тот же смысл для узких мест — sticky-панель на 320 px, шапка. */
  whatsappShort: string;
  /** Deep link навигации (`getMapsDirectionsUrl`), а не карточка с отзывами. */
  directions: string;
  directionsShort: string;
}

/**
 * Прежние подписи — «Ask for directions» / «Спросить маршрут» — продавали то, что
 * человек и так получает в Google Maps, и конкурировали с соседней кнопкой карты.
 * Новый текст ставит вопрос, ответ на который есть только у магазина.
 *
 * `whatsappShort` — подпись главной кнопки sticky-панели, и там на неё остаётся
 * ~107 px при ширине экрана 320 px: два круга по 48 px, отступы и иконка съедают
 * остальное. Поэтому короткая форма держится в пределах 8-10 символов на
 * латинице и кириллице — иначе `truncate` режет её до «What is in t…» именно на
 * той кнопке, ради которой панель и сделана.
 */
export const CTA_LABELS: Record<Locale, CtaLabels> = {
  en: {
    whatsapp: "See what is on the shelf today",
    whatsappShort: "What's in",
    directions: "Get directions",
    directionsShort: "Directions",
  },
  ru: {
    whatsapp: "Узнать, что есть сегодня",
    whatsappShort: "Что есть",
    directions: "Проложить маршрут",
    directionsShort: "Маршрут",
  },
  th: {
    whatsapp: "ถามว่าวันนี้มีอะไรบ้าง",
    whatsappShort: "วันนี้มีอะไร",
    directions: "นำทางไปร้าน",
    directionsShort: "เส้นทาง",
  },
  ar: {
    whatsapp: "اسأل عمّا هو متوفر اليوم",
    whatsappShort: "المتوفر اليوم",
    directions: "احصل على الاتجاهات",
    directionsShort: "الاتجاهات",
  },
  zh: {
    whatsapp: "问问今天有什么",
    whatsappShort: "今天有什么",
    directions: "导航到店",
    directionsShort: "导航",
  },
  ko: {
    whatsapp: "오늘 뭐가 있는지 물어보기",
    whatsappShort: "오늘 뭐?",
    directions: "길찾기",
    directionsShort: "길찾기",
  },
  ja: {
    whatsapp: "今日の品ぞろえを聞く",
    whatsappShort: "今日の品",
    directions: "ルート案内",
    directionsShort: "ルート",
  },
};

/**
 * Гейт длины срабатывает на этапе сборки, а не в проде: строка, выросшая при
 * переводе, обязана уронить `astro build`, а не приехать обрезанной в мессенджер
 * посетителя. Район подставляется самый длинный из реальных — «Walking Street».
 */
const LONGEST_AREA_SAMPLE = "Walking Street";

for (const locale of LOCALES) {
  for (const intent of PREFILL_INTENTS) {
    const text = buildPrefill(locale, intent, { area: LONGEST_AREA_SAMPLE });
    if (text.length > MAX_PREFILL_LENGTH) {
      throw new Error(
        `CTA prefill ${locale}/${intent} is ${text.length} characters, limit is ${MAX_PREFILL_LENGTH}`,
      );
    }
    if (/\[(?:source|page|utm|ref)\b/i.test(text)) {
      throw new Error(`CTA prefill ${locale}/${intent} carries a tracking tag in the message body`);
    }
  }
}
