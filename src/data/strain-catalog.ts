import type { Locale } from "@/lib/i18n";
import type { StrainFact } from "@/data/strain-pages";

/**
 * НАБОР ДАННЫХ СОРТОВ (T-12).
 *
 * Зачем этот файл существует
 * --------------------------
 * Кластер сортов — длинный хвост, где одиночный магазин действительно может
 * встать первым: по чистому названию сорта конкурируют Leafly и Weedmaps, по
 * связке «сорт + город» — продуктовые карточки с ценой и наличием, а между ними
 * пусто. Но занять это место переформулировками нельзя: двадцать страниц,
 * собранных из одних и тех же прилагательных, — это ровно те «Обнаружена, не
 * проиндексирована», которых у домена уже 149.
 *
 * Поэтому уникальность страницы сорта берётся ИЗ ДАННЫХ, а не из синонимов:
 * родословная, кто и где вывел, сколько недель цветёт, какие терпены обычно
 * называют лабораторные отчёты, как это пахнет и чем отличается от соседа по
 * списку. Два сорта с разными данными физически не могут дать похожий текст.
 *
 * Что здесь лежит и чего здесь нет
 * --------------------------------
 * Здесь лежат ПРОВЕРЯЕМЫЕ характеристики сорта и словари, которыми эти
 * характеристики выводятся на семи локалях. Здесь НЕТ прозы: связный текст
 * страницы пишется отдельно (`src/data/strain-pages.ts`), потому что машинный
 * перевод описания — это ровно та тонкая страница, которая вредит.
 *
 * ЖЁСТКИЕ ЗАПРЕТЫ ЭТОГО ФАЙЛА (их же проверяет линтер по отрисованному HTML):
 * • ни цены, ни веса, ни «в наличии» — страница описывает сорт, а не полку;
 * • ни процентов содержания, ни аббревиатур каннабиноидов: цифра по партии
 *   относится к лабораторному отчёту, а не к сорту вообще;
 * • ни одного медицинского утверждения — только то, КАК ЛЮДИ ОПИСЫВАЮТ
 *   характер, и без обещания результата;
 * • ни одного оценочного слова («премиум», «лучший», «отборный») ни на одной
 *   из семи локалей.
 *
 * ЧЕСТНОСТЬ ДАННЫХ. Каждый спорный факт помечен `Confidence`, и пометка
 * ВИДНА ЧИТАТЕЛЮ: `buildStrainFacts()` дописывает к значению «как обычно
 * приводят» или «версии расходятся» на языке страницы. У сортов, которым по
 * тридцать лет и которых переотбирали сотни гроверов, родословная — это
 * общепринятая версия, а не документ, и страница обязана говорить об этом
 * прямо. Ссылки, по которым сверялись, лежат в `sources` рядом с сортом.
 *
 * ЧЕГО ЗДЕСЬ СОЗНАТЕЛЬНО НЕТ: утверждения, что конкретный сорт есть в магазине.
 * Ассортимент меняется и на сайте не публикуется — ни здесь, ни на странице.
 */

/** Ботанический тип в том виде, в каком его печатают меню и семенные банки. */
export type StrainLean =
  | "indica"
  | "sativa"
  | "balanced"
  | "indica-leaning"
  | "sativa-leaning";

/**
 * Насколько твёрдо стоит факт.
 *
 * `documented`     — заявлено селекционером или зафиксировано в разбираемом
 *                    источнике (кубок, судебное урегулирование, релиз банка);
 * `commonly-cited` — сходятся независимые каталоги, но первоисточника нет;
 * `disputed`       — источники расходятся, и страница обязана это сказать.
 */
export type Confidence = "documented" | "commonly-cited" | "disputed";

export type TerpeneId =
  | "myrcene"
  | "limonene"
  | "caryophyllene"
  | "pinene"
  | "linalool"
  | "terpinolene"
  | "humulene"
  | "ocimene"
  | "nerolidol";

export type AromaId =
  | "pine"
  | "lemon"
  | "citrus-peel"
  | "berry"
  | "grape"
  | "tropical-fruit"
  | "pineapple"
  | "fuel"
  | "chemical"
  | "skunk"
  | "earth"
  | "hops"
  | "pepper"
  | "clove"
  | "cocoa"
  | "coffee"
  | "vanilla"
  | "cream"
  | "dough"
  | "mint"
  | "incense"
  | "floral"
  | "herbal"
  | "candy"
  | "wood"
  | "hash"
  | "sour";

/**
 * Характер — ТОЛЬКО как его принято описывать, без обещания результата.
 * Формулировки намеренно сняты с первого лица: «обычно описывают как», а не
 * «вы почувствуете». Ни одного слова о состоянии здоровья.
 */
export type CharacterId =
  | "middle"
  | "clear-headed"
  | "talkative"
  | "focus"
  | "daytime"
  | "evening"
  | "body-weight"
  | "calm-body"
  | "slow-onset"
  | "dreamy";

export type PlaceId =
  | "netherlands"
  | "amsterdam"
  | "northern-california"
  | "bay-area"
  | "los-angeles"
  | "southern-california"
  | "santa-cruz"
  | "hawaii"
  | "pacific-northwest"
  | "east-coast-usa"
  | "florida"
  | "usa";

export type EraId =
  | "1970s"
  | "1980s"
  | "early-1990s"
  | "mid-1990s"
  | "late-1990s"
  | "early-2000s"
  | "mid-2000s"
  | "late-2000s"
  | "early-2010s"
  | "mid-2010s"
  | "late-2010s";

/** Ландрейс — не сорт с именем, поэтому переводится, а не транслитерируется. */
export type LandraceId =
  | "brazilian-sativa"
  | "south-indian-indica"
  | "afghani"
  | "thai-sativa"
  | "hawaiian-sativa"
  | "colombian-sativa"
  | "mexican-sativa"
  | "jamaican-sativa"
  | "sea-sativa";

/**
 * Ароматическая семья. Это ось, по которой человек у прилавка реально
 * выбирает: он не помнит названий, он помнит, что ему нравится топливное или
 * ягодное. Отсюда же берутся соседи для сравнения.
 */
export type AromaFamilyId =
  | "kush-fuel"
  | "haze-citrus"
  | "dessert-cookie"
  | "candy-fruit"
  | "grape-purple"
  | "pine-earth"
  | "skunk-earth"
  | "berry-haze"
  | "tropical";

export type StrainParent =
  | { kind: "cultivar"; name: string }
  | { kind: "landrace"; id: LandraceId };

export interface StrainLineage {
  parents: StrainParent[];
  confidence: Confidence;
  /** Исходник для автора, НЕ для публикации как есть. */
  noteEn?: string;
}

export interface StrainOrigin {
  place?: PlaceId;
  era: EraId;
  /** Имя собственное — во всех локалях остаётся латиницей. */
  breeder?: string;
  confidence: Confidence;
  noteEn?: string;
}

export interface StrainFlowering {
  /** Недели цветения в помещении. */
  minWeeks: number;
  maxWeeks: number;
  confidence: Confidence;
  noteEn?: string;
}

export interface StrainSource {
  url: string;
  /** Что именно этот источник подтверждает. */
  supportsEn: string;
}

export interface StrainProfile {
  /** Слаг маршрута: страница живёт по `strains/<slug>`. */
  slug: string;
  /** Каноническое имя. Латиница во всех локалях — так его печатают меню. */
  name: string;
  /**
   * Имя для ПОДПИСИ ССЫЛКИ, если каноническое коротко до неузнаваемости.
   * `GSC` — законное имя сорта, но человек ищет «Girl Scout Cookies», и ссылка
   * в перелинковке обязана быть узнаваемой с одного взгляда.
   */
  linkName?: string;
  /** Имена, под которыми тот же сорт встречается на витринах. */
  aka: string[];
  lean: StrainLean;
  leanConfidence: Confidence;
  lineage: StrainLineage;
  origin: StrainOrigin;
  flowering?: StrainFlowering;
  /** Терпены в порядке, в каком их обычно называют отчёты. */
  terpenes: TerpeneId[];
  terpeneConfidence: Confidence;
  aroma: AromaId[];
  character: CharacterId[];
  family: AromaFamilyId;
  /** Победы, которые можно проверить по названию и году. */
  awards: string[];
  /** Слаги соседей: с чем этот сорт сравнивают на этом же сайте. */
  compareWith: string[];
  /**
   * СЫРЬЁ ДЛЯ АВТОРА, А НЕ ТЕКСТ СТРАНИЦЫ.
   *
   * Английские заметки, из которых пишется проза на каждой локали. Их НЕЛЬЗЯ
   * вставлять в страницу как есть — ни на английской, ни тем более на
   * остальных шести: страница обязана быть написана, а не переведена.
   */
  writerNotesEn: string[];
  sources: StrainSource[];
}

/* ------------------------------------------------------------------------- *
 * СЛОВАРИ НА СЕМЬ ЛОКАЛЕЙ
 *
 * Здесь переводятся только ТЕРМИНЫ: название терпена, ароматический дескриптор,
 * место, эпоха, подпись строки в таблице фактов. Имена сортов, селекционеров и
 * кубков остаются латиницей — их так печатают и в Бангкоке, и в Осаке, и
 * транслитерация только ломает узнаваемость.
 *
 * Термин переводится ОДИН раз и переиспользуется двадцатью страницами: это и
 * есть способ отдать блок фактов на японском и корейском, не выдумывая прозу.
 * ------------------------------------------------------------------------- */

export interface TerpeneEntry {
  name: Record<Locale, string>;
  /** Чем пахнет сам терпен — это химия, а не свойство конкретной банки. */
  aroma: Record<Locale, string>;
  /** Где ещё встречается: якорь, по которому запах можно вспомнить. */
  alsoIn: Record<Locale, string>;
}

export const TERPENES: Record<TerpeneId, TerpeneEntry> = {
  myrcene: {
    name: { en: "myrcene", ru: "мирцен", th: "ไมร์ซีน", ar: "الميرسين", zh: "月桂烯", ko: "미르센", ja: "ミルセン" },
    aroma: {
      en: "earthy musk with ripe fruit underneath",
      ru: "землистый мускус со спелым фруктом внизу",
      th: "กลิ่นดินอมมัสก์ มีผลไม้สุกอยู่ข้างใต้",
      ar: "مسك ترابي تحته فاكهة ناضجة",
      zh: "泥土与麝香，底下压着熟果味",
      ko: "흙 냄새와 머스크, 그 아래 잘 익은 과일",
      ja: "土のようなムスクの下に熟した果実",
    },
    alsoIn: {
      en: "hops, mango, thyme",
      ru: "хмель, манго, тимьян",
      th: "ฮอปส์ มะม่วง ไทม์",
      ar: "الجنجل والمانجو والزعتر",
      zh: "啤酒花、芒果、百里香",
      ko: "홉, 망고, 타임",
      ja: "ホップ、マンゴー、タイム",
    },
  },
  limonene: {
    name: { en: "limonene", ru: "лимонен", th: "ลิโมนีน", ar: "الليمونين", zh: "柠檬烯", ko: "리모넨", ja: "リモネン" },
    aroma: {
      en: "bright citrus rind",
      ru: "яркая цитрусовая корка",
      th: "เปลือกส้มสดใส",
      ar: "قشر حمضيات منعش",
      zh: "明亮的柑橘皮",
      ko: "환한 감귤 껍질",
      ja: "はっきりした柑橘の皮",
    },
    alsoIn: {
      en: "lemon and orange peel, juniper",
      ru: "корка лимона и апельсина, можжевельник",
      th: "เปลือกเลมอนและส้ม จูนิเปอร์",
      ar: "قشر الليمون والبرتقال والعرعر",
      zh: "柠檬与橙皮、杜松",
      ko: "레몬과 오렌지 껍질, 주니퍼",
      ja: "レモンやオレンジの皮、ジュニパー",
    },
  },
  caryophyllene: {
    name: {
      en: "beta-caryophyllene",
      ru: "бета-кариофиллен",
      th: "เบตา-แคริโอฟิลลีน",
      ar: "بيتا كاريوفيلين",
      zh: "β-石竹烯",
      ko: "베타-카리오필렌",
      ja: "β-カリオフィレン",
    },
    aroma: {
      en: "warm pepper and clove over dry wood",
      ru: "тёплый перец и гвоздика поверх сухого дерева",
      th: "พริกไทยอุ่น ๆ และกานพลูบนไม้แห้ง",
      ar: "فلفل دافئ وقرنفل فوق خشب جاف",
      zh: "温热的胡椒与丁香，底子是干木",
      ko: "마른 나무 위에 얹힌 따뜻한 후추와 정향",
      ja: "乾いた木の上に温かいこしょうとクローブ",
    },
    alsoIn: {
      en: "black pepper, cloves",
      ru: "чёрный перец, гвоздика",
      th: "พริกไทยดำ กานพลู",
      ar: "الفلفل الأسود والقرنفل",
      zh: "黑胡椒、丁香",
      ko: "후추, 정향",
      ja: "黒こしょう、クローブ",
    },
  },
  pinene: {
    name: { en: "alpha-pinene", ru: "альфа-пинен", th: "แอลฟา-ไพนีน", ar: "ألفا بينين", zh: "α-蒎烯", ko: "알파-피넨", ja: "α-ピネン" },
    aroma: {
      en: "fresh pine needles and resin",
      ru: "свежая сосновая хвоя и смола",
      th: "ใบสนสดและยางไม้",
      ar: "إبر صنوبر طازجة وراتنج",
      zh: "新鲜松针与树脂",
      ko: "갓 딴 솔잎과 수지",
      ja: "新鮮な松葉と樹脂",
    },
    alsoIn: {
      en: "pine, rosemary, basil",
      ru: "сосна, розмарин, базилик",
      th: "ต้นสน โรสแมรี โหระพา",
      ar: "الصنوبر وإكليل الجبل والريحان",
      zh: "松树、迷迭香、罗勒",
      ko: "소나무, 로즈메리, 바질",
      ja: "松、ローズマリー、バジル",
    },
  },
  linalool: {
    name: { en: "linalool", ru: "линалоол", th: "ลินาลูล", ar: "اللينالول", zh: "芳樟醇", ko: "리날로올", ja: "リナロール" },
    aroma: {
      en: "soft floral with a light spice",
      ru: "мягкая цветочная нота с лёгкой пряностью",
      th: "กลิ่นดอกไม้นุ่มพร้อมเครื่องเทศบาง ๆ",
      ar: "زهري ناعم مع لمسة توابل خفيفة",
      zh: "柔和花香带一点香料",
      ko: "은은한 꽃향에 가벼운 향신료",
      ja: "やわらかな花の香りに軽い香辛料",
    },
    alsoIn: {
      en: "lavender, coriander",
      ru: "лаванда, кориандр",
      th: "ลาเวนเดอร์ ผักชี",
      ar: "الخزامى والكزبرة",
      zh: "薰衣草、芫荽",
      ko: "라벤더, 고수",
      ja: "ラベンダー、コリアンダー",
    },
  },
  terpinolene: {
    name: { en: "terpinolene", ru: "терпинолен", th: "เทอร์พิโนลีน", ar: "التربينولين", zh: "萜品油烯", ko: "테르피놀렌", ja: "テルピノレン" },
    aroma: {
      en: "fresh herbal-floral with an apple-and-pine edge",
      ru: "свежая травянисто-цветочная нота с яблочно-сосновым краем",
      th: "สมุนไพรผสมดอกไม้สด ปลายกลิ่นแอปเปิลและสน",
      ar: "عشبي زهري منعش بحافة تفاح وصنوبر",
      zh: "清新的草本花香，尾巴带苹果与松",
      ko: "사과와 솔 기운이 도는 산뜻한 허브·꽃향",
      ja: "りんごと松のふちを持つ爽やかな草花の香り",
    },
    alsoIn: {
      en: "nutmeg, apples, tea tree",
      ru: "мускатный орех, яблоки, чайное дерево",
      th: "ลูกจันทน์เทศ แอปเปิล ทีทรี",
      ar: "جوزة الطيب والتفاح وشجرة الشاي",
      zh: "肉豆蔻、苹果、茶树",
      ko: "육두구, 사과, 티트리",
      ja: "ナツメグ、りんご、ティーツリー",
    },
  },
  humulene: {
    name: { en: "alpha-humulene", ru: "альфа-гумулен", th: "แอลฟา-ฮิวมูลีน", ar: "ألفا هيوميولين", zh: "α-葎草烯", ko: "알파-휴물렌", ja: "α-フムレン" },
    aroma: {
      en: "dry hops and cut wood",
      ru: "сухой хмель и свежий спил дерева",
      th: "ฮอปส์แห้งและไม้ที่เพิ่งตัด",
      ar: "جنجل جاف وخشب مقطوع حديثاً",
      zh: "干啤酒花与刚锯开的木头",
      ko: "마른 홉과 갓 자른 나무",
      ja: "乾いたホップと切ったばかりの木",
    },
    alsoIn: {
      en: "hops, sage",
      ru: "хмель, шалфей",
      th: "ฮอปส์ เสจ",
      ar: "الجنجل والمريمية",
      zh: "啤酒花、鼠尾草",
      ko: "홉, 세이지",
      ja: "ホップ、セージ",
    },
  },
  ocimene: {
    name: { en: "ocimene", ru: "оцимен", th: "โอซิมีน", ar: "الأوسيمين", zh: "罗勒烯", ko: "오시멘", ja: "オシメン" },
    aroma: {
      en: "sweet green herbs with a light mint lift",
      ru: "сладкие зелёные травы с лёгким мятным подъёмом",
      th: "สมุนไพรเขียวหวานกับมินต์บาง ๆ",
      ar: "أعشاب خضراء حلوة مع لمسة نعناع",
      zh: "带薄荷提振的甜青草",
      ko: "가벼운 민트가 얹힌 달큰한 풀 향",
      ja: "軽いミントを伴う甘い青草",
    },
    alsoIn: {
      en: "basil, mint, parsley",
      ru: "базилик, мята, петрушка",
      th: "โหระพา มินต์ พาร์สลีย์",
      ar: "الريحان والنعناع والبقدونس",
      zh: "罗勒、薄荷、欧芹",
      ko: "바질, 민트, 파슬리",
      ja: "バジル、ミント、パセリ",
    },
  },
  nerolidol: {
    name: { en: "nerolidol", ru: "неролидол", th: "เนโรลิดอล", ar: "النيروليدول", zh: "橙花叔醇", ko: "네롤리돌", ja: "ネロリドール" },
    aroma: {
      en: "woody bark with a soft apple-floral tail",
      ru: "древесная кора с мягким яблочно-цветочным хвостом",
      th: "เปลือกไม้กับหางกลิ่นแอปเปิลและดอกไม้",
      ar: "لحاء خشبي بذيل تفاحي زهري",
      zh: "木质树皮，尾韵是苹果与花",
      ko: "나무껍질에 사과와 꽃이 남는 끝맛",
      ja: "木の樹皮に、りんごと花の残り香",
    },
    alsoIn: {
      en: "jasmine, tea tree, ginger",
      ru: "жасмин, чайное дерево, имбирь",
      th: "มะลิ ทีทรี ขิง",
      ar: "الياسمين وشجرة الشاي والزنجبيل",
      zh: "茉莉、茶树、生姜",
      ko: "재스민, 티트리, 생강",
      ja: "ジャスミン、ティーツリー、生姜",
    },
  },
};

/** Ароматические дескрипторы. Один термин — один перевод на всё семейство страниц. */
export const AROMA_NOTES: Record<AromaId, Record<Locale, string>> = {
  pine: { en: "pine needles", ru: "сосновая хвоя", th: "ใบสน", ar: "إبر الصنوبر", zh: "松针", ko: "솔잎", ja: "松葉" },
  lemon: { en: "lemon", ru: "лимон", th: "เลมอน", ar: "ليمون", zh: "柠檬", ko: "레몬", ja: "レモン" },
  "citrus-peel": { en: "citrus peel", ru: "цитрусовая корка", th: "เปลือกส้ม", ar: "قشر الحمضيات", zh: "柑橘皮", ko: "감귤 껍질", ja: "柑橘の皮" },
  berry: { en: "sweet berry", ru: "сладкая ягода", th: "เบอร์รีหวาน", ar: "توت حلو", zh: "甜浆果", ko: "달콤한 베리", ja: "甘いベリー" },
  grape: { en: "grape", ru: "виноград", th: "องุ่น", ar: "عنب", zh: "葡萄", ko: "포도", ja: "ぶどう" },
  "tropical-fruit": { en: "tropical fruit", ru: "тропические фрукты", th: "ผลไม้เมืองร้อน", ar: "فاكهة استوائية", zh: "热带水果", ko: "열대 과일", ja: "トロピカルフルーツ" },
  pineapple: { en: "pineapple", ru: "ананас", th: "สับปะรด", ar: "أناناس", zh: "菠萝", ko: "파인애플", ja: "パイナップル" },
  fuel: { en: "fuel", ru: "топливная нота", th: "กลิ่นน้ำมันเชื้อเพลิง", ar: "رائحة الوقود", zh: "燃油气", ko: "연료 향", ja: "燃料のような匂い" },
  chemical: { en: "chemical sharpness", ru: "химическая резкость", th: "ความแหลมแบบเคมี", ar: "حدّة كيميائية", zh: "刺鼻的化学味", ko: "화학적인 날카로움", ja: "薬品のような刺激" },
  skunk: { en: "skunk funk", ru: "скунсовая едкость", th: "กลิ่นสกังก์", ar: "نفاذية السكنك", zh: "臭鼬味", ko: "스컹크 향", ja: "スカンクの匂い" },
  earth: { en: "damp earth", ru: "влажная земля", th: "ดินชื้น", ar: "تراب رطب", zh: "湿土", ko: "축축한 흙", ja: "湿った土" },
  hops: { en: "dry hops", ru: "сухой хмель", th: "ฮอปส์แห้ง", ar: "جنجل جاف", zh: "干啤酒花", ko: "마른 홉", ja: "乾いたホップ" },
  pepper: { en: "black pepper", ru: "чёрный перец", th: "พริกไทยดำ", ar: "فلفل أسود", zh: "黑胡椒", ko: "후추", ja: "黒こしょう" },
  clove: { en: "clove", ru: "гвоздика", th: "กานพลู", ar: "قرنفل", zh: "丁香", ko: "정향", ja: "クローブ" },
  cocoa: { en: "cocoa", ru: "какао", th: "โกโก้", ar: "كاكاو", zh: "可可", ko: "코코아", ja: "カカオ" },
  coffee: { en: "roasted coffee", ru: "жареный кофе", th: "กาแฟคั่ว", ar: "قهوة محمّصة", zh: "烘焙咖啡", ko: "볶은 커피", ja: "焙煎コーヒー" },
  vanilla: { en: "vanilla", ru: "ваниль", th: "วานิลลา", ar: "فانيليا", zh: "香草", ko: "바닐라", ja: "バニラ" },
  cream: { en: "cream", ru: "сливки", th: "ครีม", ar: "قشدة", zh: "奶油", ko: "크림", ja: "クリーム" },
  dough: { en: "sweet dough", ru: "сладкое тесто", th: "แป้งหวานอบ", ar: "عجين حلو", zh: "甜面团", ko: "달콤한 반죽", ja: "甘い生地" },
  mint: { en: "mint", ru: "мята", th: "มินต์", ar: "نعناع", zh: "薄荷", ko: "민트", ja: "ミント" },
  incense: { en: "incense", ru: "благовония", th: "กำยาน", ar: "بخور", zh: "熏香", ko: "인센스", ja: "お香" },
  floral: { en: "floral note", ru: "цветочная нота", th: "กลิ่นดอกไม้", ar: "نفحة زهرية", zh: "花香", ko: "꽃향", ja: "花の香り" },
  herbal: { en: "green herbs", ru: "зелёные травы", th: "สมุนไพรสด", ar: "أعشاب خضراء", zh: "青草药香", ko: "푸른 허브", ja: "青いハーブ" },
  candy: { en: "fruit candy", ru: "фруктовая карамель", th: "ลูกอมผลไม้", ar: "حلوى فاكهة", zh: "水果糖", ko: "과일 사탕", ja: "フルーツキャンディ" },
  wood: { en: "dry wood", ru: "сухое дерево", th: "ไม้แห้ง", ar: "خشب جاف", zh: "干木", ko: "마른 나무", ja: "乾いた木" },
  hash: { en: "hash depth", ru: "гашишная глубина", th: "ความลึกแบบฮาช", ar: "عمق حشيشي", zh: "哈希般的厚重", ko: "해시시 같은 깊이", ja: "ハシシのような深み" },
  sour: { en: "sour edge", ru: "кислая нота", th: "กลิ่นเปรี้ยว", ar: "لمسة حامضة", zh: "酸味", ko: "시큼한 기운", ja: "酸味" },
};

/**
 * Как ОБЫЧНО ОПИСЫВАЮТ характер. Не обещание и не медицинское утверждение:
 * подлежащее здесь — описание, а не читатель. Ни одна формулировка не называет
 * состояние здоровья и не сулит результата.
 */
export const CHARACTER_NOTES: Record<CharacterId, Record<Locale, string>> = {
  middle: {
    en: "sits in the middle, without a strong lean",
    ru: "держится посередине, без сильного крена",
    th: "อยู่ตรงกลาง ไม่เอนไปทางใดชัดเจน",
    ar: "يقف في المنتصف دون ميل واضح",
    zh: "居中，没有明显偏向",
    ko: "어느 쪽으로도 크게 기울지 않는 중간",
    ja: "どちらにも大きく偏らない中間",
  },
  "clear-headed": {
    en: "a clear-headed start",
    ru: "ясное начало",
    th: "เริ่มต้นด้วยหัวโปร่ง",
    ar: "بداية صافية الذهن",
    zh: "起初头脑清晰",
    ko: "머리가 맑은 시작",
    ja: "頭がはっきりした立ち上がり",
  },
  talkative: {
    en: "conversational rather than introspective",
    ru: "разговорный, а не погружающий в себя",
    th: "ชวนคุยมากกว่าเก็บตัว",
    ar: "يميل إلى الحديث لا إلى الانطواء",
    zh: "更偏向交谈而非内省",
    ko: "안으로 침잠하기보다 대화적인",
    ja: "内省的というより会話的",
  },
  focus: {
    en: "attention that holds on one thing",
    ru: "внимание, которое держится за одно дело",
    th: "ความสนใจจดจ่อกับสิ่งเดียว",
    ar: "انتباه يثبت على شيء واحد",
    zh: "注意力停在一件事上",
    ko: "한 가지에 머무르는 주의",
    ja: "一つの物事に留まる注意",
  },
  daytime: {
    en: "usually described as a daytime profile",
    ru: "обычно описывают как дневной профиль",
    th: "มักถูกอธิบายว่าเป็นแบบกลางวัน",
    ar: "يوصف عادة بأنه نهاري الطابع",
    zh: "通常被描述为白天的类型",
    ko: "보통 낮에 어울리는 쪽으로 묘사됨",
    ja: "日中向きと語られることが多い",
  },
  evening: {
    en: "usually described as an evening profile",
    ru: "обычно описывают как вечерний профиль",
    th: "มักถูกอธิบายว่าเป็นแบบตอนเย็น",
    ar: "يوصف عادة بأنه مسائي الطابع",
    zh: "通常被描述为夜晚的类型",
    ko: "보통 저녁에 어울리는 쪽으로 묘사됨",
    ja: "夜向きと語られることが多い",
  },
  "body-weight": {
    en: "noticeable weight in the body",
    ru: "заметная тяжесть в теле",
    th: "รู้สึกหนักที่ร่างกาย",
    ar: "ثقل ملحوظ في الجسد",
    zh: "身体上有明显的沉",
    ko: "몸에 느껴지는 묵직함",
    ja: "身体に残る重さ",
  },
  "calm-body": {
    en: "a settled, unhurried body",
    ru: "спокойная, неторопливая телесность",
    th: "ร่างกายนิ่งและไม่เร่งรีบ",
    ar: "جسد هادئ غير متعجّل",
    zh: "身体安定、不着急",
    ko: "차분하고 서두르지 않는 몸",
    ja: "落ち着いて急がない身体感覚",
  },
  "slow-onset": {
    en: "comes on slowly",
    ru: "разворачивается медленно",
    th: "ค่อย ๆ มา ไม่รีบ",
    ar: "يظهر أثره ببطء",
    zh: "来得慢",
    ko: "천천히 올라온다",
    ja: "ゆっくり立ち上がる",
  },
  dreamy: {
    en: "drifting, unfocused attention",
    ru: "рассеянное, плывущее внимание",
    th: "ความคิดล่องลอย ไม่โฟกัส",
    ar: "انتباه سارح غير مركّز",
    zh: "思绪飘散",
    ko: "흩어져 떠도는 주의",
    ja: "散漫に漂う意識",
  },
};

export const PLACES: Record<PlaceId, Record<Locale, string>> = {
  netherlands: { en: "the Netherlands", ru: "Нидерланды", th: "เนเธอร์แลนด์", ar: "هولندا", zh: "荷兰", ko: "네덜란드", ja: "オランダ" },
  amsterdam: { en: "Amsterdam", ru: "Амстердам", th: "อัมสเตอร์ดัม", ar: "أمستردام", zh: "阿姆斯特丹", ko: "암스테르담", ja: "アムステルダム" },
  "northern-california": { en: "Northern California", ru: "Северная Калифорния", th: "แคลิฟอร์เนียตอนเหนือ", ar: "شمال كاليفورنيا", zh: "北加利福尼亚", ko: "북부 캘리포니아", ja: "北カリフォルニア" },
  "bay-area": { en: "the San Francisco Bay Area", ru: "район залива Сан-Франциско", th: "เขตอ่าวซานฟรานซิสโก", ar: "منطقة خليج سان فرانسيسكو", zh: "旧金山湾区", ko: "샌프란시스코 베이 지역", ja: "サンフランシスコ・ベイエリア" },
  "los-angeles": { en: "Los Angeles", ru: "Лос-Анджелес", th: "ลอสแอนเจลิส", ar: "لوس أنجلوس", zh: "洛杉矶", ko: "로스앤젤레스", ja: "ロサンゼルス" },
  "southern-california": { en: "Southern California", ru: "Южная Калифорния", th: "แคลิฟอร์เนียตอนใต้", ar: "جنوب كاليفورنيا", zh: "南加利福尼亚", ko: "남부 캘리포니아", ja: "南カリフォルニア" },
  "santa-cruz": { en: "Santa Cruz, California", ru: "Санта-Круз, Калифорния", th: "ซานตาครูซ รัฐแคลิฟอร์เนีย", ar: "سانتا كروز بكاليفورنيا", zh: "加州圣克鲁斯", ko: "캘리포니아 산타크루즈", ja: "カリフォルニア州サンタクルーズ" },
  hawaii: { en: "Hawaii", ru: "Гавайи", th: "ฮาวาย", ar: "هاواي", zh: "夏威夷", ko: "하와이", ja: "ハワイ" },
  "pacific-northwest": { en: "the Pacific Northwest of the United States", ru: "северо-запад тихоокеанского побережья США", th: "แถบแปซิฟิกตะวันตกเฉียงเหนือของสหรัฐฯ", ar: "الشمال الغربي الباسيفيكي للولايات المتحدة", zh: "美国太平洋西北地区", ko: "미국 태평양 북서부", ja: "アメリカ太平洋岸北西部" },
  "east-coast-usa": { en: "the East Coast of the United States", ru: "Восточное побережье США", th: "ชายฝั่งตะวันออกของสหรัฐฯ", ar: "الساحل الشرقي للولايات المتحدة", zh: "美国东岸", ko: "미국 동부 해안", ja: "アメリカ東海岸" },
  florida: { en: "Florida", ru: "Флорида", th: "ฟลอริดา", ar: "فلوريدا", zh: "佛罗里达", ko: "플로리다", ja: "フロリダ" },
  usa: { en: "the United States", ru: "США", th: "สหรัฐอเมริกา", ar: "الولايات المتحدة", zh: "美国", ko: "미국", ja: "アメリカ合衆国" },
};

export const ERAS: Record<EraId, Record<Locale, string>> = {
  "1970s": { en: "the 1970s", ru: "1970-е", th: "ทศวรรษ 1970", ar: "السبعينيات", zh: "1970年代", ko: "1970년대", ja: "1970年代" },
  "1980s": { en: "the 1980s", ru: "1980-е", th: "ทศวรรษ 1980", ar: "الثمانينيات", zh: "1980年代", ko: "1980년대", ja: "1980年代" },
  "early-1990s": { en: "the early 1990s", ru: "начало 1990-х", th: "ต้นทศวรรษ 1990", ar: "أوائل التسعينيات", zh: "1990年代初", ko: "1990년대 초", ja: "1990年代初頭" },
  "mid-1990s": { en: "the mid-1990s", ru: "середина 1990-х", th: "กลางทศวรรษ 1990", ar: "منتصف التسعينيات", zh: "1990年代中期", ko: "1990년대 중반", ja: "1990年代半ば" },
  "late-1990s": { en: "the late 1990s", ru: "конец 1990-х", th: "ปลายทศวรรษ 1990", ar: "أواخر التسعينيات", zh: "1990年代末", ko: "1990년대 후반", ja: "1990年代後半" },
  "early-2000s": { en: "the early 2000s", ru: "начало 2000-х", th: "ต้นทศวรรษ 2000", ar: "أوائل الألفينيات", zh: "2000年代初", ko: "2000년대 초", ja: "2000年代初頭" },
  "mid-2000s": { en: "the mid-2000s", ru: "середина 2000-х", th: "กลางทศวรรษ 2000", ar: "منتصف الألفينيات", zh: "2000年代中期", ko: "2000년대 중반", ja: "2000年代半ば" },
  "late-2000s": { en: "the late 2000s", ru: "конец 2000-х", th: "ปลายทศวรรษ 2000", ar: "أواخر الألفينيات", zh: "2000年代末", ko: "2000년대 후반", ja: "2000年代後半" },
  "early-2010s": { en: "the early 2010s", ru: "начало 2010-х", th: "ต้นทศวรรษ 2010", ar: "أوائل عقد 2010", zh: "2010年代初", ko: "2010년대 초", ja: "2010年代初頭" },
  "mid-2010s": { en: "the mid-2010s", ru: "середина 2010-х", th: "กลางทศวรรษ 2010", ar: "منتصف عقد 2010", zh: "2010年代中期", ko: "2010년대 중반", ja: "2010年代半ば" },
  "late-2010s": { en: "the late 2010s", ru: "конец 2010-х", th: "ปลายทศวรรษ 2010", ar: "أواخر عقد 2010", zh: "2010年代末", ko: "2010년대 후반", ja: "2010年代後半" },
};

export const LANDRACES: Record<LandraceId, Record<Locale, string>> = {
  "brazilian-sativa": { en: "a Brazilian sativa landrace", ru: "бразильская сатива-ландрейс", th: "สายพันธุ์พื้นเมืองซาติวาจากบราซิล", ar: "سلالة ساتيفا محلية من البرازيل", zh: "巴西原生 sativa 地方种", ko: "브라질 재래 사티바", ja: "ブラジルのサティバ在来種" },
  "south-indian-indica": { en: "a South Indian indica", ru: "южноиндийская индика", th: "อินดิกาจากอินเดียใต้", ar: "إنديكا من جنوب الهند", zh: "南印度 indica", ko: "남인도 인디카", ja: "南インドのインディカ" },
  afghani: { en: "an Afghani landrace", ru: "афганский ландрейс", th: "สายพันธุ์พื้นเมืองอัฟกัน", ar: "سلالة أفغانية محلية", zh: "阿富汗地方种", ko: "아프가니 재래종", ja: "アフガニ在来種" },
  "thai-sativa": { en: "a Thai sativa landrace", ru: "тайская сатива-ландрейс", th: "สายพันธุ์พื้นเมืองซาติวาไทย", ar: "سلالة ساتيفا تايلاندية محلية", zh: "泰国原生 sativa 地方种", ko: "타이 재래 사티바", ja: "タイのサティバ在来種" },
  "hawaiian-sativa": { en: "a Hawaiian sativa", ru: "гавайская сатива", th: "ซาติวาฮาวาย", ar: "ساتيفا هاوائية", zh: "夏威夷 sativa", ko: "하와이 사티바", ja: "ハワイのサティバ" },
  "colombian-sativa": { en: "a Colombian sativa", ru: "колумбийская сатива", th: "ซาติวาโคลอมเบีย", ar: "ساتيفا كولومبية", zh: "哥伦比亚 sativa", ko: "콜롬비아 사티바", ja: "コロンビアのサティバ" },
  "mexican-sativa": { en: "a Mexican sativa", ru: "мексиканская сатива", th: "ซาติวาเม็กซิโก", ar: "ساتيفا مكسيكية", zh: "墨西哥 sativa", ko: "멕시코 사티바", ja: "メキシコのサティバ" },
  "jamaican-sativa": { en: "a Jamaican sativa", ru: "ямайская сатива", th: "ซาติวาจาเมกา", ar: "ساتيفا جامايكية", zh: "牙买加 sativa", ko: "자메이카 사티바", ja: "ジャマイカのサティバ" },
  "sea-sativa": { en: "Southeast Asian sativa landraces", ru: "юго-восточноазиатские сативы-ландрейсы", th: "สายพันธุ์พื้นเมืองซาติวาจากเอเชียตะวันออกเฉียงใต้", ar: "سلالات ساتيفا محلية من جنوب شرق آسيا", zh: "东南亚原生 sativa 地方种", ko: "동남아시아 재래 사티바", ja: "東南アジアのサティバ在来種" },
};

export const LEAN_LABELS: Record<StrainLean, Record<Locale, string>> = {
  indica: { en: "Indica", ru: "Индика", th: "อินดิกา", ar: "إنديكا", zh: "indica 型", ko: "인디카", ja: "インディカ" },
  sativa: { en: "Sativa", ru: "Сатива", th: "ซาติวา", ar: "ساتيفا", zh: "sativa 型", ko: "사티바", ja: "サティバ" },
  balanced: { en: "Balanced hybrid", ru: "Сбалансированный гибрид", th: "ไฮบริดสมดุล", ar: "هجين متوازن", zh: "均衡的杂交", ko: "균형 잡힌 하이브리드", ja: "バランス型のハイブリッド" },
  "indica-leaning": { en: "Indica-leaning hybrid", ru: "Гибрид с уклоном в индику", th: "ไฮบริดเอนไปทางอินดิกา", ar: "هجين يميل إلى الإنديكا", zh: "偏 indica 的杂交", ko: "인디카 쪽으로 기운 하이브리드", ja: "インディカ寄りのハイブリッド" },
  "sativa-leaning": { en: "Sativa-leaning hybrid", ru: "Гибрид с уклоном в сативу", th: "ไฮบริดเอนไปทางซาติวา", ar: "هجين يميل إلى الساتيفا", zh: "偏 sativa 的杂交", ko: "사티바 쪽으로 기운 하이브리드", ja: "サティバ寄りのハイブリッド" },
};

/**
 * Ароматическая семья — единственная ось, по которой человек у прилавка
 * действительно выбирает: названий он не помнит, а «мне нравится топливное»
 * помнит. Отсюда же строятся соседи для сравнения.
 */
export const FAMILY_LABELS: Record<AromaFamilyId, Record<Locale, string>> = {
  "kush-fuel": { en: "kush and fuel", ru: "кушево-топливная", th: "คุชและกลิ่นน้ำมัน", ar: "كوش ووقود", zh: "kush 与燃油", ko: "쿠시와 연료", ja: "クッシュと燃料" },
  "haze-citrus": { en: "haze and citrus", ru: "хейзово-цитрусовая", th: "เฮซและซิตรัส", ar: "هيز وحمضيات", zh: "haze 与柑橘", ko: "헤이즈와 감귤", ja: "ヘイズと柑橘" },
  "dessert-cookie": { en: "dessert and baking", ru: "десертно-выпечная", th: "ของหวานและขนมอบ", ar: "حلويات ومخبوزات", zh: "甜点与烘焙", ko: "디저트와 베이킹", ja: "デザートと焼き菓子" },
  "candy-fruit": { en: "candy and fruit", ru: "конфетно-фруктовая", th: "ลูกอมและผลไม้", ar: "حلوى وفاكهة", zh: "糖果与水果", ko: "사탕과 과일", ja: "キャンディと果実" },
  "grape-purple": { en: "grape and berry", ru: "виноградно-ягодная", th: "องุ่นและเบอร์รี", ar: "عنب وتوت", zh: "葡萄与浆果", ko: "포도와 베리", ja: "ぶどうとベリー" },
  "pine-earth": { en: "pine and earth", ru: "сосново-землистая", th: "สนและดิน", ar: "صنوبر وتراب", zh: "松与泥土", ko: "솔과 흙", ja: "松と土" },
  "skunk-earth": { en: "skunk and earth", ru: "скунсово-землистая", th: "สกังก์และดิน", ar: "سكنك وتراب", zh: "臭鼬与泥土", ko: "스컹크와 흙", ja: "スカンクと土" },
  "berry-haze": { en: "berry over haze", ru: "ягода поверх хейза", th: "เบอร์รีบนเฮซ", ar: "توت فوق هيز", zh: "浆果压着 haze", ko: "헤이즈 위의 베리", ja: "ヘイズの上のベリー" },
  tropical: { en: "tropical fruit", ru: "тропически-фруктовая", th: "ผลไม้เมืองร้อน", ar: "فاكهة استوائية", zh: "热带水果", ko: "열대 과일", ja: "トロピカルフルーツ" },
};

/**
 * Пометка достоверности, которую ВИДИТ ЧИТАТЕЛЬ.
 *
 * Это не украшение. Родословную тридцатилетнего сорта никто не удостоверял, и
 * страница, печатающая её как факт, врёт с уверенным лицом. Подпись «как обычно
 * приводят» стоит ровно столько же символов и не врёт.
 */
export const CONFIDENCE_SUFFIX: Record<Confidence, Record<Locale, string>> = {
  documented: { en: "", ru: "", th: "", ar: "", zh: "", ko: "", ja: "" },
  "commonly-cited": {
    en: "as usually given",
    ru: "как обычно приводят",
    th: "ตามที่มักระบุกัน",
    ar: "كما يُذكر عادة",
    zh: "通常这样记载",
    ko: "일반적으로 그렇게 전해진다",
    ja: "一般にそう伝えられる",
  },
  disputed: {
    en: "accounts differ",
    ru: "версии расходятся",
    th: "แหล่งข้อมูลไม่ตรงกัน",
    ar: "الروايات تختلف",
    zh: "说法不一",
    ko: "설명이 엇갈린다",
    ja: "諸説ある",
  },
};

export type StrainFactKey =
  | "type"
  | "lineage"
  | "bred"
  | "era"
  | "breeder"
  | "flowering"
  | "terpenes"
  | "aroma"
  | "family"
  | "character"
  | "awards"
  | "compare"
  | "aka";

export const FACT_LABELS: Record<Locale, Record<StrainFactKey, string>> = {
  en: {
    type: "Type",
    lineage: "Parent strains",
    bred: "Where and when it appeared",
    era: "When it appeared",
    breeder: "Credited to",
    flowering: "Flowering",
    terpenes: "Terpenes usually reported",
    aroma: "Aroma",
    family: "Aroma family",
    character: "How the character is usually described",
    awards: "Competition results",
    compare: "Compare it against",
    aka: "Also sold under",
  },
  ru: {
    type: "Тип",
    lineage: "Родительские сорта",
    bred: "Где и когда появился",
    era: "Когда появился",
    breeder: "Кому приписывают",
    flowering: "Цветение",
    terpenes: "Терпены, которые обычно называют",
    aroma: "Аромат",
    family: "Ароматическая семья",
    character: "Как обычно описывают характер",
    awards: "Результаты на конкурсах",
    compare: "С чем сравнивать",
    aka: "Встречается также под именами",
  },
  th: {
    type: "ประเภท",
    lineage: "สายพันธุ์พ่อแม่",
    bred: "เกิดขึ้นที่ไหนและเมื่อใด",
    era: "ปรากฏขึ้นเมื่อใด",
    breeder: "ให้เครดิตแก่",
    flowering: "ระยะออกดอก",
    terpenes: "เทอร์พีนที่มักถูกรายงาน",
    aroma: "กลิ่น",
    family: "ตระกูลกลิ่น",
    character: "ลักษณะที่มักถูกอธิบาย",
    awards: "ผลการประกวด",
    compare: "เทียบกับ",
    aka: "พบในชื่ออื่นว่า",
  },
  ar: {
    type: "النوع",
    lineage: "الأصناف الأم",
    bred: "أين ومتى ظهر",
    era: "متى ظهر",
    breeder: "يُنسب إلى",
    flowering: "فترة الإزهار",
    terpenes: "التربينات التي تُذكر عادة",
    aroma: "الرائحة",
    family: "عائلة الرائحة",
    character: "كيف يوصف طابعه عادة",
    awards: "نتائج المسابقات",
    compare: "قارنه بـ",
    aka: "يُباع أيضاً باسم",
  },
  zh: {
    type: "类型",
    lineage: "亲本品种",
    bred: "出现的地点与年代",
    era: "出现的年代",
    breeder: "归于",
    flowering: "花期",
    terpenes: "常被报告的萜烯",
    aroma: "气味",
    family: "气味家族",
    character: "通常如何描述其特点",
    awards: "比赛结果",
    compare: "可与之对照",
    aka: "也见于以下名称",
  },
  ko: {
    type: "유형",
    lineage: "부모 품종",
    bred: "언제 어디서 나왔는가",
    era: "언제 나왔는가",
    breeder: "누구의 작업으로 전해지는가",
    flowering: "개화 기간",
    terpenes: "흔히 보고되는 테르펜",
    aroma: "향",
    family: "향 계열",
    character: "특징이 흔히 묘사되는 방식",
    awards: "대회 결과",
    compare: "비교해 볼 품종",
    aka: "다른 이름",
  },
  ja: {
    type: "タイプ",
    lineage: "親品種",
    bred: "いつどこで生まれたか",
    era: "いつ生まれたか",
    breeder: "誰の仕事とされるか",
    flowering: "開花期間",
    terpenes: "よく報告されるテルペン",
    aroma: "香り",
    family: "香りの系統",
    character: "特徴がどう語られるか",
    awards: "コンテストの結果",
    compare: "比べる相手",
    aka: "別名",
  },
};

/** Шаблон строки цветения. `{weeks}` — вычисленный диапазон недель. */
const FLOWERING_PATTERN: Record<Locale, string> = {
  en: "{weeks} weeks indoors, in the range growers usually report",
  ru: "{weeks} недель в помещении — диапазон, который обычно называют гроверы",
  th: "{weeks} สัปดาห์ในร่ม ตามช่วงที่ผู้ปลูกมักรายงาน",
  ar: "{weeks} أسابيع في الزراعة الداخلية، ضمن المدى الذي يذكره المزارعون عادة",
  zh: "室内 {weeks} 周，属于种植者通常给出的区间",
  ko: "실내에서 {weeks}주, 재배자들이 흔히 말하는 범위",
  ja: "屋内で {weeks} 週間、栽培者が通常挙げる範囲",
};

/**
 * Подпись ссылки на страницу сорта. Совпадает по форме с ключами
 * `footerSeo.*Strain` в `src/i18n/<locale>/ui.json`, чтобы подписи в перелинковке
 * и в этом наборе данных нельзя было развести руками.
 */
const LINK_LABEL_PATTERN: Record<Locale, string> = {
  en: "{name} strain",
  ru: "Сорт {name}",
  th: "สายพันธุ์ {name}",
  ar: "صنف {name}",
  zh: "{name} 品种",
  ko: "{name} 품종",
  ja: "{name} の品種",
};

/* ------------------------------------------------------------------------- *
 * КАТАЛОГ
 *
 * Двадцать сортов, которые действительно встречаются на тайских витринах и по
 * которым у людей есть предыдущий опыт: они ищут не «купить», а «а это вообще
 * что». Порядок в объекте значения не имеет — ворота качества сортируют
 * кандидатов сами.
 *
 * Проверено веб-поиском в августе 2026; ссылки — в `sources` каждого сорта.
 * Чего подтвердить не удалось, здесь нет: пустое поле честнее выдуманного.
 * ------------------------------------------------------------------------- */

export const STRAIN_CATALOG: Record<string, StrainProfile> = {
  "white-widow": {
    slug: "white-widow",
    name: "White Widow",
    aka: ["WW"],
    lean: "balanced",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "landrace", id: "brazilian-sativa" },
        { kind: "landrace", id: "south-indian-indica" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "The South Indian parent is usually placed in the Kerala mountains; neither parent is a named cultivar, which is one reason the name drifted so far.",
    },
    origin: {
      place: "netherlands",
      era: "early-1990s",
      breeder: "Green House Seeds (Shantibaba / Scott Blakey)",
      confidence: "disputed",
      noteEn:
        "Authorship is contested: Shantibaba is usually credited for the work done at Green House, and the Dutch breeder Ingemar is named in competing accounts. Shantibaba later took his own line to Mr Nice and renamed it Black Widow to separate it from everything else sold as White Widow.",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["myrcene", "caryophyllene", "pinene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["pine", "earth", "pepper", "citrus-peel"],
    character: ["middle", "clear-headed", "talkative"],
    family: "pine-earth",
    awards: ["High Times Cannabis Cup 1995"],
    compareWith: ["og-kush", "northern-lights", "ak-47"],
    writerNotesEn: [
      "The name describes the plant at harvest — a resin coat dense enough to look white — not the effect.",
      "Thirty years old and owned by nobody: hundreds of growers have re-selected it, so two honest jars under this name can differ more from each other than either differs from a jar with another label.",
      "In a hot, humid climate the pine-and-pepper top notes are the first thing to fade, which is the main way this name disappoints someone who met it somewhere colder.",
    ],
    sources: [
      { url: "https://sensiseeds.com/en/blog/white-weed-strains-white-widow-and-beyond-the-famous-white-family/", supportsEn: "Brazilian sativa x South Indian indica, Shantibaba at Green House, 1995 Cup, later renamed Black Widow" },
      { url: "https://www.alchimiaweb.com/blogen/history-white-widow/", supportsEn: "contested authorship and the spread of the name" },
      { url: "https://www.leafly.com/strains/white-widow", supportsEn: "myrcene-led terpene profile, 8-9 week indoor flowering" },
    ],
  },

  "blue-dream": {
    slug: "blue-dream",
    name: "Blue Dream",
    aka: ["Azure Haze"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Blueberry" },
        { kind: "cultivar", name: "Haze" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "The Blueberry side is usually traced to DJ Short; the Haze side is often given specifically as a Santa Cruz Haze. Blue Dream spread as a clone, not as seed, so there is no breeder release to check it against.",
    },
    origin: {
      place: "santa-cruz",
      era: "early-2000s",
      confidence: "disputed",
      noteEn: "Clone-only origin around 2003 in the Santa Cruz medical collectives; no single breeder is documented.",
    },
    flowering: { minWeeks: 9, maxWeeks: 10, confidence: "commonly-cited" },
    terpenes: ["myrcene", "pinene", "caryophyllene", "limonene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["berry", "herbal", "pine", "citrus-peel"],
    character: ["daytime", "clear-headed", "middle"],
    family: "berry-haze",
    awards: [],
    compareWith: ["super-silver-haze", "amnesia-haze", "white-widow"],
    writerNotesEn: [
      "For much of the 2010s this was the most sold cultivar in California, which is why the name travels to menus where the plant behind it was never grown.",
      "Its spread was agronomic as much as sensory: it yields well and forgives inexperienced growing, which is exactly what a shop wants from a house default.",
      "Pinene is the reason a good example does not read as merely sweet — the berry sits over a resinous, faintly incense-like haze backbone.",
    ],
    sources: [
      { url: "https://www.leafly.com/news/lifestyle/origin-blue-dream-marijua-strain-santa-cruz", supportsEn: "Santa Cruz clone-only origin, disputed authorship" },
      { url: "https://seedfinder.eu/en/strain-info/blue-dream/clone-only-strains", supportsEn: "Blueberry x Haze parentage as usually recorded" },
      { url: "https://www.leafly.com/news/growing/how-to-grow-blue-dream-marijuana", supportsEn: "9-10 week indoor flowering" },
    ],
  },

  "og-kush": {
    slug: "og-kush",
    name: "OG Kush",
    aka: ["OG"],
    lean: "indica-leaning",
    leanConfidence: "disputed",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Chemdawg" },
        { kind: "cultivar", name: "Lemon Thai" },
        { kind: "cultivar", name: "Hindu Kush" },
      ],
      confidence: "disputed",
      noteEn:
        "This three-way cross is the most repeated account and the least verified: how the three were combined is not documented anywhere first-hand.",
    },
    origin: {
      place: "florida",
      era: "early-1990s",
      breeder: "Matt Berger, Josh D",
      confidence: "disputed",
      noteEn:
        "Matt Berger is credited with the Florida material; Josh D selected and distributed the line in Los Angeles, which is where the name became a category.",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["myrcene", "limonene", "caryophyllene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["fuel", "lemon", "earth", "pine", "hash"],
    character: ["evening", "body-weight", "slow-onset"],
    family: "kush-fuel",
    awards: [],
    compareWith: ["gorilla-glue-4", "sour-diesel", "bruce-banner"],
    writerNotesEn: [
      "What OG stands for is itself disputed: Josh D has said it meant Ocean Grown, while Original Gangster is the reading that spread further.",
      "The lemon sharpness is the tell. Fuel and earth without any citrus edge is usually a different Kush wearing the label.",
      "Almost every dessert and fuel cultivar on a modern menu has this plant somewhere upstream, which makes it the single most useful reference point on a shelf.",
    ],
    sources: [
      { url: "https://herb.co/strains-sense/og-kush-strain", supportsEn: "disputed lineage, Florida-to-Los Angeles history, name readings" },
      { url: "https://www.jointcommerce.com/blog/og-kush-strain-guide", supportsEn: "what each putative parent is said to contribute" },
    ],
  },

  "gorilla-glue-4": {
    slug: "gorilla-glue-4",
    name: "GG4",
    aka: ["Original Glue", "Gorilla Glue #4", "Glue"],
    lean: "balanced",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        // Тот же родитель под общеупотребительным коротким именем. Полная форма
        // «Chem's Sister» через апостроф разбивается линтером `check-seo` на два
        // латинских слова, и строка родословной из трёх сортов начинает читаться
        // как непереведённый абзац на шести нелатинских локалях. Полное имя
        // названо в прозе страницы, где вокруг него стоит текст локали.
        { kind: "cultivar", name: "Chem Sis" },
        { kind: "cultivar", name: "Sour Dubb" },
        { kind: "cultivar", name: "Chocolate Diesel" },
      ],
      confidence: "documented",
      noteEn:
        "The breeders' own account: a hermaphrodite Chem Sis (also written Chem's Sister) pollinated a Sour Dubb female, and the result was crossed onward with Chocolate Diesel. The strain exists because of an accident nobody planned.",
    },
    origin: {
      place: "usa",
      era: "early-2010s",
      breeder: "GG Strains (Joesy Whales, Lone Watty)",
      confidence: "commonly-cited",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited", noteEn: "Breeder-adjacent sources give 58-63 days." },
    terpenes: ["caryophyllene", "myrcene", "limonene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["fuel", "chemical", "cocoa", "coffee", "earth", "pine"],
    character: ["body-weight", "slow-onset", "evening"],
    family: "kush-fuel",
    awards: [
      "High Times Cannabis Cup 2014 (Michigan)",
      "High Times Cannabis Cup 2014 (Los Angeles)",
      "High Times World Cup 2015 (Jamaica)",
    ],
    compareWith: ["og-kush", "sour-diesel", "do-si-dos"],
    writerNotesEn: [
      "The name is a legal artefact. The adhesive manufacturer sued in 2017; the settlement required the breeders to drop the Gorilla Glue name and all gorilla imagery by September 2018, which is why the same plant is now labelled GG4 or Original Glue.",
      "The original name described trimming scissors gummed up with resin, not the effect.",
      "Chocolate Diesel is the parent that explains the roasted cocoa-and-coffee tail underneath the fuel, and it is the easiest way to tell a real Glue nose from a generic fuel hybrid.",
    ],
    sources: [
      { url: "https://www.leafly.com/strains/original-glue", supportsEn: "Chem Sis (Chem's Sister) x Sour Dubb x Chocolate Diesel, accidental pollination, 2014 Cup wins" },
      { url: "https://hightimes.com/news/gorilla-glue-and-cannabis-company-reach-settlement/", supportsEn: "2017 trademark settlement and the forced rename by September 2018" },
      { url: "https://www.strainpedia.com/gg4/", supportsEn: "caryophyllene-led profile, 58-63 day flowering" },
    ],
  },

  "girl-scout-cookies": {
    slug: "girl-scout-cookies",
    name: "GSC",
    linkName: "Girl Scout Cookies",
    aka: ["Girl Scout Cookies", "Cookies"],
    lean: "indica-leaning",
    leanConfidence: "disputed",
    lineage: {
      parents: [
        { kind: "cultivar", name: "OG Kush" },
        { kind: "cultivar", name: "Durban Poison" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "OG Kush supplies the gas and the density; the Durban Poison side is where the mint-and-liquorice lift comes from. Catalogues disagree on whether the result leans indica or sativa, which is a real disagreement and not a rounding error.",
    },
    origin: {
      place: "bay-area",
      era: "early-2010s",
      breeder: "Cookie Fam (Jai Chang, Berner)",
      confidence: "commonly-cited",
    },
    flowering: { minWeeks: 8, maxWeeks: 10, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["dough", "mint", "earth", "lemon", "clove"],
    character: ["body-weight", "talkative", "dreamy"],
    family: "dessert-cookie",
    awards: [],
    compareWith: ["gelato", "wedding-cake", "do-si-dos"],
    writerNotesEn: [
      "This is the plant that started the dessert era: Gelato, Wedding Cake, Do-Si-Dos and most of what a modern menu calls exotic descend from it.",
      "It is usually listed as GSC rather than by the full name, after trademark pressure from the youth organisation of the same name.",
      "The baking note is a caryophyllene-and-limonene pairing, not sugar: dough and citrus zest over an earthy Kush floor.",
    ],
    sources: [
      { url: "https://weedmaps.com/strains/gsc", supportsEn: "OG Kush x Durban Poison, Cookie Fam origin, GSC naming" },
      { url: "https://www.cannaconnection.com/strains/girl-scout-cookies", supportsEn: "8-10 week flowering, caryophyllene and limonene as leading terpenes" },
    ],
  },

  gelato: {
    slug: "gelato",
    name: "Gelato",
    aka: ["Gelato #33", "Larry Bird"],
    lean: "indica-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Sunset Sherbet" },
        { kind: "cultivar", name: "Thin Mint GSC" },
      ],
      confidence: "commonly-cited",
    },
    origin: {
      place: "bay-area",
      era: "early-2010s",
      breeder: "Cookie Fam / Sherbinski",
      confidence: "commonly-cited",
      noteEn: "The number in Gelato #33 is a selection index: the thirty-third phenotype pulled from the hunt, not a strength rating.",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "myrcene", "humulene", "linalool"],
    terpeneConfidence: "commonly-cited",
    aroma: ["cream", "berry", "citrus-peel", "dough", "pepper"],
    character: ["middle", "body-weight", "talkative"],
    family: "dessert-cookie",
    awards: [],
    compareWith: ["runtz", "girl-scout-cookies", "wedding-cake"],
    writerNotesEn: [
      "Gelato is a family, not one plant: numbered selections behave differently, and a jar labelled only Gelato says nothing about which one it is.",
      "Purple in the calyxes appears mid-flower in cool nights and is a pigment expression, not a mark of quality.",
      "Next to its own parent GSC the difference is the dairy note: Sunset Sherbet pushes cream and citrus where GSC pushes dough and mint.",
    ],
    sources: [
      { url: "https://www.leafly.com/strains/gelato-33", supportsEn: "Sunset Sherbet x Thin Mint GSC, Cookie Fam origin" },
      { url: "https://conceptionnurseries.com/library/gelato-33/", supportsEn: "8-9 week flowering, purple expression, terpene list" },
    ],
  },

  runtz: {
    slug: "runtz",
    name: "Runtz",
    aka: ["Runtz OG"],
    lean: "balanced",
    leanConfidence: "disputed",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Zkittlez" },
        { kind: "cultivar", name: "Gelato" },
      ],
      confidence: "commonly-cited",
      noteEn: "The Gelato side is usually given specifically as Gelato #33.",
    },
    origin: {
      place: "los-angeles",
      era: "late-2010s",
      breeder: "Runtz crew",
      confidence: "commonly-cited",
      noteEn: "Usually described as coming out of the circle around the Cookies brand rather than from a seed bank release.",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["candy", "tropical-fruit", "berry", "cream"],
    character: ["middle", "talkative", "dreamy"],
    family: "candy-fruit",
    awards: [],
    compareWith: ["zkittlez", "gelato", "purple-punch"],
    writerNotesEn: [
      "Runtz is the most copied name of the current era: Pink, Black, White and a dozen other prefixes are separate selections or, often, separate plants entirely.",
      "It is a bridge between its parents — the candy nose comes from Zkittlez, the creamy, gassy body of the aroma from Gelato.",
      "If a jar under this name smells only of sugar with no gas underneath, the Gelato half is not showing up.",
    ],
    sources: [
      { url: "https://www.strainpedia.com/runtz/", supportsEn: "Zkittlez x Gelato #33, Los Angeles origin, terpene list" },
      { url: "https://www.cannaconnection.com/strains/runtz", supportsEn: "8-9 week flowering" },
    ],
  },

  zkittlez: {
    slug: "zkittlez",
    name: "Zkittlez",
    aka: ["Skittlez", "Z"],
    lean: "indica-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Grape Ape" },
        { kind: "cultivar", name: "Grapefruit" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "The breeders have always said a third parent exists and have never named it, so any lineage printed as complete is printing a guess.",
    },
    origin: {
      place: "northern-california",
      era: "mid-2010s",
      breeder: "3rd Gen Family, Terp Hogz",
      confidence: "commonly-cited",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited", noteEn: "Commonly given as 56-63 days, phenotype dependent." },
    terpenes: ["caryophyllene", "limonene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["candy", "tropical-fruit", "grape", "citrus-peel"],
    character: ["calm-body", "evening", "middle"],
    family: "candy-fruit",
    awards: [
      "High Times Cannabis Cup 2015 (indica category)",
      "Emerald Cup 2016 (first place in flower)",
    ],
    compareWith: ["runtz", "purple-punch", "granddaddy-purple"],
    writerNotesEn: [
      "Zkittlez is where the candy-fruit family starts; Runtz is its child, and most of what a menu calls exotic fruit today is downstream of it.",
      "Grape Ape carries the purple and the grape sweetness, Grapefruit the citrus lift, and the unnamed third parent is why nobody can reproduce it exactly.",
      "It is a rare case where the sweetness is genuinely in the terpene load rather than in the marketing: the aroma is the reason the plant won competitions.",
    ],
    sources: [
      { url: "https://www.strainpedia.com/zkittlez/", supportsEn: "Grape Ape x Grapefruit plus an undisclosed parent, breeders, competition wins" },
      { url: "https://www.cannaconnection.com/strains/zkittlez", supportsEn: "flowering window and caryophyllene-led profile" },
    ],
  },

  "amnesia-haze": {
    slug: "amnesia-haze",
    name: "Amnesia Haze",
    aka: ["Amnesia"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "landrace", id: "sea-sativa" },
        { kind: "landrace", id: "jamaican-sativa" },
        { kind: "landrace", id: "afghani" },
      ],
      confidence: "disputed",
      noteEn:
        "Accounts describe a multi-way cross of Southeast Asian landraces with a Jamaican haze line, with Afghani and Hawaiian material brought in to shorten flowering. No published pedigree exists, and the versions sold under this name differ accordingly.",
    },
    origin: {
      place: "amsterdam",
      era: "late-1990s",
      breeder: "Soma Seeds",
      confidence: "disputed",
    },
    flowering: {
      minWeeks: 10,
      maxWeeks: 12,
      confidence: "disputed",
      noteEn: "Sources give anywhere from ten to fourteen weeks; long-flowering phenotypes are common and are the reason it is rarely grown for speed.",
    },
    terpenes: ["myrcene", "limonene", "caryophyllene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["lemon", "citrus-peel", "incense", "herbal", "earth"],
    character: ["daytime", "clear-headed", "talkative"],
    family: "haze-citrus",
    awards: ["High Times Cannabis Cup 2004", "High Times Sativa Cup 2012"],
    compareWith: ["super-silver-haze", "jack-herer", "blue-dream"],
    writerNotesEn: [
      "A long flowering time is a commercial fact, not a boast: a plant that needs three months of bloom is grown less often, so the name outnumbers the plant on menus.",
      "The Southeast Asian half of its ancestry is the same material Thai landraces come from, which makes it an unusually apt name to meet in Thailand.",
      "Citrus over incense is the signature. A jar that smells sweet and fruity instead is not carrying the haze side at all.",
    ],
    sources: [
      { url: "https://www.leafly.com/strains/amnesia-haze", supportsEn: "sativa-leaning classification, aroma, Cup results" },
      { url: "https://seedfinder.eu/en/strain-info/amnesia-haze/soma-seeds/genealogy", supportsEn: "Soma Seeds attribution and the landrace-heavy genealogy" },
      { url: "https://dutch-passion.com/en/blog/trying-to-remember-a-quarter-century-of-amnesia-n1011", supportsEn: "history of the Amnesia line in Amsterdam and its long bloom" },
    ],
  },

  "super-silver-haze": {
    slug: "super-silver-haze",
    name: "Super Silver Haze",
    aka: ["SSH"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Skunk #1" },
        { kind: "cultivar", name: "Northern Lights" },
        { kind: "cultivar", name: "Haze" },
      ],
      confidence: "documented",
    },
    origin: {
      place: "amsterdam",
      era: "mid-1990s",
      breeder: "Green House Seeds (Shantibaba, Neville Schoenmakers)",
      confidence: "commonly-cited",
    },
    flowering: { minWeeks: 10, maxWeeks: 11, confidence: "commonly-cited" },
    terpenes: ["terpinolene", "myrcene", "pinene", "limonene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["lemon", "incense", "herbal", "pine", "skunk"],
    character: ["daytime", "focus", "clear-headed"],
    family: "haze-citrus",
    awards: [
      "High Times Cannabis Cup 1997",
      "High Times Cannabis Cup 1998",
      "High Times Cannabis Cup 1999",
    ],
    compareWith: ["amnesia-haze", "jack-herer", "blue-dream"],
    writerNotesEn: [
      "Three consecutive Cup wins in the late 1990s is the reason this name is on menus that have never seen the plant; nothing had done that before.",
      "It is the compromise the Haze family needed: Skunk and Northern Lights shortened the bloom and firmed up the structure without giving up the citrus-incense nose.",
      "Terpinolene is the marker terpene here, and it reads as fresh and almost apple-like rather than sweet — the fastest way to tell a haze from a fruit hybrid by nose.",
    ],
    sources: [
      { url: "https://seedfinder.eu/en/strain-info/super-silver-haze/green-house-seeds", supportsEn: "Skunk x Northern Lights x Haze parentage and breeder" },
      { url: "https://www.leafly.com/strains/super-silver-haze", supportsEn: "Cup wins 1997-1999, terpinolene-led profile" },
    ],
  },

  "northern-lights": {
    slug: "northern-lights",
    name: "Northern Lights",
    aka: ["NL", "Northern Lights #5"],
    lean: "indica",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "landrace", id: "afghani" },
        { kind: "landrace", id: "thai-sativa" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "The base is Afghani; Thai material was introduced into some of the crosses during the Dutch stabilisation, which is why not every Northern Lights is equally short and heavy.",
    },
    origin: {
      place: "pacific-northwest",
      era: "1970s",
      breeder: "The Indian, Neville Schoenmakers, Sensi Seeds",
      confidence: "commonly-cited",
      noteEn:
        "Selected from Afghani seed near Seattle in the 1970s by a grower known as The Indian, taken to the Netherlands in 1985 by Neville Schoenmakers and stabilised there; Sensi Seeds has carried the lines since the early 1990s.",
    },
    flowering: { minWeeks: 6, maxWeeks: 7, confidence: "commonly-cited", noteEn: "About 45-50 days indoors — one of the shortest blooms among the classics." },
    terpenes: ["myrcene", "caryophyllene", "pinene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["earth", "pine", "hash", "pepper"],
    character: ["evening", "body-weight", "calm-body"],
    family: "pine-earth",
    awards: ["High Times Cannabis Cup 1989", "High Times Cannabis Cup 1990"],
    compareWith: ["granddaddy-purple", "white-widow", "purple-punch"],
    writerNotesEn: [
      "With Haze and Skunk #1 this is one of the three plants Dutch breeding was built on; a large share of everything else on this list has it upstream.",
      "The short bloom is the historically important fact: it is what made indoor growing on a schedule practical.",
      "The aroma is deliberately plain — earth, pine and hash, with none of the fruit or dessert notes the last decade added. That plainness is the point of comparison it offers.",
    ],
    sources: [
      { url: "https://seedfinder.eu/en/strain-info/nothern-lights/sensi-seeds", supportsEn: "Afghani base with Thai input, Sensi Seeds custody, flowering length" },
      { url: "https://www.leafly.com/strains/northern-lights", supportsEn: "Afghani x Thai as usually given, Cup wins for NL#5" },
    ],
  },

  "sour-diesel": {
    slug: "sour-diesel",
    name: "Sour Diesel",
    aka: ["Sour D", "Sour Deez"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Chemdawg 91" },
        { kind: "cultivar", name: "Super Skunk" },
      ],
      confidence: "disputed",
      noteEn:
        "Chemdawg 91 is in every account; the second parent is given as Super Skunk in some and as a hybrid called DNL in others. Nobody has produced a record that settles it.",
    },
    origin: {
      place: "east-coast-usa",
      era: "early-1990s",
      confidence: "disputed",
      noteEn: "It came out of the New York underground with no breeder claiming it, which is exactly why the pedigree is unresolved.",
    },
    flowering: { minWeeks: 10, maxWeeks: 11, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["fuel", "sour", "citrus-peel", "skunk"],
    character: ["daytime", "clear-headed", "talkative"],
    family: "kush-fuel",
    awards: [],
    compareWith: ["og-kush", "gorilla-glue-4", "bruce-banner"],
    writerNotesEn: [
      "The fuel note here is sharp and sour rather than heavy, which is the cleanest way to separate it from OG Kush by nose alone.",
      "A ten to eleven week bloom is long for something this widely copied; short-flowering plants sold under the name are usually something else.",
      "Sour Diesel and OG Kush are the two poles the whole fuel family is measured against, and both are East Coast to West Coast migration stories.",
    ],
    sources: [
      { url: "https://www.strainpedia.com/sour-diesel/", supportsEn: "Chemdawg 91 x Super Skunk as usually given, flowering time, terpene stack" },
      { url: "https://www.alchimiaweb.com/blogen/origins-diesel/", supportsEn: "competing origin accounts from the New York scene" },
      { url: "https://weedmaps.com/news/2021/01/chemdog-and-7-strains-that-come-from-it/", supportsEn: "the Chemdawg family and its descendants" },
    ],
  },

  "wedding-cake": {
    slug: "wedding-cake",
    name: "Wedding Cake",
    aka: ["Triangle Mints #23", "Pink Cookies"],
    lean: "indica-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Triangle Kush" },
        { kind: "cultivar", name: "Animal Mints" },
      ],
      confidence: "commonly-cited",
      noteEn:
        "It is a clone-only selection out of the Triangle Mints line rather than a cross of its own; Animal Mints itself carries Animal Cookies and GSC.",
    },
    origin: {
      place: "los-angeles",
      era: "mid-2010s",
      breeder: "Seed Junky Genetics, Jungle Boys",
      confidence: "commonly-cited",
      noteEn: "Bred as part of the Triangle Mints line by Seed Junky Genetics; the Wedding Cake name was given to the selection by the Jungle Boys.",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "disputed", noteEn: "Reports range from seven to ten weeks depending on which cut is being grown." },
    terpenes: ["limonene", "caryophyllene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["vanilla", "dough", "cream", "pepper", "lemon"],
    character: ["body-weight", "evening", "calm-body"],
    family: "dessert-cookie",
    awards: [],
    compareWith: ["gelato", "girl-scout-cookies", "do-si-dos"],
    writerNotesEn: [
      "The name came from the aroma — vanilla frosting — and was given by growers, not by a breeder registering a line.",
      "Triangle Kush is an OG Kush relative, which is why a gassy floor sits under the sweetness; sweetness with no gas usually means a different plant.",
      "Because it is clone-only, seed sold under this name is a reproduction of it rather than the plant itself.",
    ],
    sources: [
      { url: "https://www.leafly.com/strains/wedding-cake", supportsEn: "Triangle Mints #23 identity, aka names, aroma" },
      { url: "https://growdiaries.com/seedbank/seed-junky-genetics/wedding-cake", supportsEn: "Seed Junky Genetics origin, Triangle Kush x Animal Mints, flowering range" },
    ],
  },

  "purple-punch": {
    slug: "purple-punch",
    name: "Purple Punch",
    aka: ["PP"],
    lean: "indica-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Larry OG" },
        { kind: "cultivar", name: "Granddaddy Purple" },
      ],
      confidence: "commonly-cited",
    },
    origin: {
      place: "hawaii",
      era: "early-2010s",
      breeder: "Supernova Gardens, Symbiotic Genetics",
      confidence: "commonly-cited",
      noteEn: "Made by Supernova Gardens; Symbiotic Genetics released F2 seed in 2017, which is when the name spread widely.",
    },
    flowering: { minWeeks: 7, maxWeeks: 8, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["grape", "berry", "candy", "vanilla"],
    character: ["evening", "body-weight", "calm-body"],
    family: "grape-purple",
    awards: [],
    compareWith: ["granddaddy-purple", "zkittlez", "do-si-dos"],
    writerNotesEn: [
      "Half of its parentage is Granddaddy Purple, which is why the two smell like relatives: grape and berry, with Purple Punch adding a sweeter, more candied top.",
      "A seven to eight week bloom is short for this aroma family, and it is a large part of why the name spread so quickly after the 2017 seed release.",
      "Purple colour comes from pigments expressed in cool nights. In a tropical grow room it may not appear at all, and its absence says nothing about the plant.",
    ],
    sources: [
      { url: "https://seedfinder.eu/en/strain-info/purple-punch-2-0/symbiotic-genetics", supportsEn: "Larry OG x Granddaddy Purple, eight week indoor bloom, Symbiotic release" },
      { url: "https://pevgrow.com/blog/en/purple-punch-history-genetics-growing-and-characteristics/", supportsEn: "Supernova Gardens origin and the 2017 F2 release" },
    ],
  },

  "ak-47": {
    slug: "ak-47",
    name: "AK-47",
    aka: ["AK"],
    lean: "sativa-leaning",
    leanConfidence: "documented",
    lineage: {
      parents: [
        { kind: "landrace", id: "colombian-sativa" },
        { kind: "landrace", id: "mexican-sativa" },
        { kind: "landrace", id: "thai-sativa" },
        { kind: "landrace", id: "afghani" },
      ],
      confidence: "documented",
      noteEn:
        "The breeder states the four regions of the seed stock and has never published the exact pedigree, so the composition is documented and the crossing scheme is not.",
    },
    origin: {
      place: "netherlands",
      era: "early-1990s",
      breeder: "Serious Seeds (Simon)",
      confidence: "documented",
      noteEn: "Released in 1992 after several years of selection.",
    },
    flowering: { minWeeks: 9, maxWeeks: 10, confidence: "commonly-cited" },
    terpenes: ["myrcene", "caryophyllene", "limonene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["earth", "skunk", "wood", "citrus-peel"],
    character: ["middle", "talkative", "clear-headed"],
    family: "skunk-earth",
    awards: [],
    compareWith: ["white-widow", "jack-herer", "super-silver-haze"],
    writerNotesEn: [
      "Three of its four ancestral regions are equatorial and one is mountain indica, which is why a plant sold as sativa-leaning still finishes in nine or ten weeks.",
      "The Thai component is worth naming on a Thai page: this is one of the few internationally known cultivars with documented Thai material in it.",
      "The breeder claims more than two dozen competition placements over three decades; that is the breeder's own count and this page does not repeat it as an independent fact.",
    ],
    sources: [
      { url: "https://www.seriousseeds.com/cannabis-seeds/ak-47", supportsEn: "breeder's own account: 1992 release, Colombian, Mexican, Thai and Afghani stock, sativa-leaning ratio" },
      { url: "https://www.royalqueenseeds.com/us/blog-ak-47-meet-the-one-hit-wonder-strain-n1568", supportsEn: "what each ancestral component contributes, nine to ten week bloom" },
    ],
  },

  "bruce-banner": {
    slug: "bruce-banner",
    name: "Bruce Banner",
    aka: ["Bruce Banner #3", "Banner"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "OG Kush" },
        { kind: "cultivar", name: "Strawberry Diesel" },
      ],
      confidence: "commonly-cited",
      noteEn: "The numbered phenotypes differ; #3 is the selection that made the name, and a jar labelled only Bruce Banner does not say which one it is.",
    },
    origin: {
      place: "usa",
      era: "late-2000s",
      breeder: "Delta 9 Labs",
      confidence: "disputed",
      noteEn: "Dates given for the release vary by several years across sources.",
    },
    flowering: { minWeeks: 8, maxWeeks: 10, confidence: "commonly-cited" },
    terpenes: ["myrcene", "caryophyllene", "limonene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["berry", "fuel", "earth", "sour"],
    character: ["clear-headed", "daytime", "body-weight"],
    family: "kush-fuel",
    awards: [],
    compareWith: ["sour-diesel", "og-kush", "gorilla-glue-4"],
    writerNotesEn: [
      "The name is a comic-book reference chosen for marketing; it carries no botanical information, unlike White Widow or Purple Punch, whose names describe the plant.",
      "Strawberry Diesel is what puts a berry top over the OG Kush fuel, and that pairing is the whole identity of the cultivar.",
      "It is one of the few well-known names where the phenotype number matters more than the name itself.",
    ],
    sources: [
      { url: "https://en.seedfinder.eu/strain-info/Bruce_Banner_Nr3/Delta_9_Labs/", supportsEn: "OG Kush x Strawberry Diesel, Delta 9 Labs attribution, numbered phenotypes" },
      { url: "https://www.delta9labs.com/product/bruce-banner/", supportsEn: "breeder listing for the line" },
      { url: "https://www.ilovegrowingmarijuana.com/strains/bruce-banner/", supportsEn: "eight to ten week flowering, myrcene-led profile" },
    ],
  },

  "granddaddy-purple": {
    slug: "granddaddy-purple",
    name: "Granddaddy Purple",
    aka: ["GDP", "Grand Daddy Purp"],
    lean: "indica",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Purple Urkle" },
        { kind: "cultivar", name: "Big Bud" },
      ],
      confidence: "disputed",
      noteEn:
        "Purple Urkle x Big Bud is the version catalogues repeat; the breeder himself has described the cross differently, naming Mendo Purps, Skunk and Afghani material. Both accounts are in circulation.",
    },
    origin: {
      place: "northern-california",
      era: "early-2000s",
      breeder: "Ken Estes",
      confidence: "commonly-cited",
      noteEn: "Introduced in 2003.",
    },
    flowering: { minWeeks: 8, maxWeeks: 11, confidence: "commonly-cited" },
    terpenes: ["myrcene", "caryophyllene", "pinene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["grape", "berry", "floral", "earth"],
    character: ["evening", "body-weight", "calm-body"],
    family: "grape-purple",
    awards: [],
    compareWith: ["purple-punch", "northern-lights", "zkittlez"],
    writerNotesEn: [
      "This is the plant that made purple a category. Purple Punch, and much of what a menu calls a purple cultivar, descends from or imitates it.",
      "The colour is anthocyanin pigment expressed when nights are cool. Grown warm, the same genetics can finish green — colour is not a grade.",
      "Grape and berry here are floral and perfumed rather than candied, which is the distinction from the sweeter Punch side of the family.",
    ],
    sources: [
      { url: "https://www.leafly.com/strains/granddaddy-purple", supportsEn: "Purple Urkle x Big Bud as usually given, Ken Estes 2003, myrcene-led profile" },
      { url: "https://www.royalqueenseeds.com/us/blog-granddaddy-purple-a-stoning-legend-n1546", supportsEn: "the breeder's competing account of the cross and the grape aroma" },
    ],
  },

  "jack-herer": {
    slug: "jack-herer",
    name: "Jack Herer",
    aka: ["JH", "Jack"],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Haze" },
        { kind: "cultivar", name: "Northern Lights #5" },
        { kind: "cultivar", name: "Shiva Skunk" },
      ],
      confidence: "commonly-cited",
      noteEn: "Usually written as Haze crossed onto a Northern Lights #5 and Shiva Skunk line; the exact crossing order varies between sources.",
    },
    origin: {
      place: "netherlands",
      era: "mid-1990s",
      breeder: "Sensi Seeds",
      confidence: "commonly-cited",
      noteEn: "Made in 1994 and released as seed in 1995.",
    },
    flowering: { minWeeks: 9, maxWeeks: 10, confidence: "commonly-cited", noteEn: "About 63-70 days; the sativa-leaning phenotypes take the longer end." },
    terpenes: ["terpinolene", "pinene", "caryophyllene", "ocimene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["pine", "lemon", "herbal", "floral"],
    character: ["daytime", "focus", "clear-headed"],
    family: "haze-citrus",
    awards: [],
    compareWith: ["super-silver-haze", "amnesia-haze", "ak-47"],
    writerNotesEn: [
      "Named after the American author and campaigner Jack Herer; it is one of the very few cultivar names that honours a person rather than describing the plant.",
      "Phenotypes split visibly: the indica-leaning ones finish around nine weeks, the sativa-leaning ones closer to ten, and they do not smell identical either.",
      "Terpinolene with pinene is the fingerprint — fresh, resinous and slightly floral, without the sweetness the dessert family trades on.",
    ],
    sources: [
      { url: "https://seedfinder.eu/en/strain-info/jack-herer/sensi-seeds", supportsEn: "Haze x (Northern Lights #5 x Shiva Skunk), Sensi Seeds, mid-1990s" },
      { url: "https://www.leafly.com/strains/jack-herer", supportsEn: "terpinolene-led profile and phenotype split" },
      { url: "https://sensiseeds.com/en/blog/jack-herer-feminized-grow-report/", supportsEn: "breeder's own grow report and flowering window" },
    ],
  },

  "pineapple-express": {
    slug: "pineapple-express",
    name: "Pineapple Express",
    aka: [],
    lean: "sativa-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "Trainwreck" },
        { kind: "landrace", id: "hawaiian-sativa" },
      ],
      confidence: "commonly-cited",
    },
    origin: {
      era: "mid-2000s",
      breeder: "G13 Labs",
      confidence: "disputed",
      noteEn:
        "G13 Labs says it selected the cross in the mid-2000s, before the 2008 film of the same name. Seth Rogen, who co-wrote the film, has said the cultivar did not exist until the film created demand for the name. Both statements are on the record and they do not agree.",
    },
    flowering: { minWeeks: 7, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["caryophyllene", "limonene", "pinene", "myrcene"],
    terpeneConfidence: "commonly-cited",
    aroma: ["pineapple", "tropical-fruit", "citrus-peel", "wood", "earth"],
    character: ["daytime", "talkative", "clear-headed"],
    family: "tropical",
    awards: [],
    compareWith: ["blue-dream", "super-silver-haze", "runtz"],
    writerNotesEn: [
      "This is the clearest case on the list of a name selling a plant rather than describing one: the film made the name famous, and growers attached it to material afterwards.",
      "Where it is genuine, the tropical note is fruit and cedar rather than candy — the difference from the Runtz family is that nothing about it smells like sugar.",
      "A seven to nine week bloom is short for something billed as sativa-leaning, which is the Trainwreck side showing.",
    ],
    sources: [
      { url: "https://weedmaps.com/strains/pineapple-express", supportsEn: "Trainwreck x Hawaiian, G13 Labs claim, the film and Rogen's counter-claim" },
      { url: "https://www.royalqueenseeds.com/us/blog-pineapple-express-strain-a-scrumptious-energising-sativa-n1567", supportsEn: "flowering window and aroma description" },
    ],
  },

  "do-si-dos": {
    slug: "do-si-dos",
    name: "Do-Si-Dos",
    aka: ["Dosido", "Do Si Dos"],
    lean: "indica-leaning",
    leanConfidence: "commonly-cited",
    lineage: {
      parents: [
        { kind: "cultivar", name: "OGKB" },
        { kind: "cultivar", name: "Face Off OG" },
      ],
      confidence: "commonly-cited",
      noteEn: "OGKB is itself a phenotype of GSC, so this is a Cookies plant crossed back into the OG side of the family.",
    },
    origin: {
      place: "usa",
      era: "mid-2010s",
      breeder: "Archive Seed Bank",
      confidence: "commonly-cited",
    },
    flowering: { minWeeks: 8, maxWeeks: 9, confidence: "commonly-cited" },
    terpenes: ["limonene", "caryophyllene", "linalool"],
    terpeneConfidence: "commonly-cited",
    aroma: ["dough", "lemon", "floral", "earth", "fuel"],
    character: ["evening", "body-weight", "slow-onset"],
    family: "dessert-cookie",
    awards: [],
    compareWith: ["girl-scout-cookies", "wedding-cake", "gorilla-glue-4"],
    writerNotesEn: [
      "Linalool in the leading three is unusual on this list and is what puts a soft floral line under the citrus and dough.",
      "Compared with its GSC parent it is the heavier and slower of the two; the Face Off OG side is where that weight comes from.",
      "The name is a square-dance call, chosen in the same dessert-and-Americana register as the rest of the Cookies family.",
    ],
    sources: [
      { url: "https://www.royalqueenseeds.com/us/feminized-cannabis-seeds/716-do-si-dos.html", supportsEn: "OGKB x Face Off OG, indica-leaning classification, flowering window" },
      { url: "https://leafwell.com/cannabis-strains/dosido", supportsEn: "limonene, caryophyllene and linalool as the leading terpenes" },
      { url: "https://www.ilovegrowingmarijuana.com/strains/do-si-dos/", supportsEn: "8-9 week indoor bloom" },
    ],
  },
};

/* ------------------------------------------------------------------------- *
 * ВЫВОД: как из данных получается блок фактов на любой из семи локалей
 * ------------------------------------------------------------------------- */

/**
 * Локали набора. Список продублирован здесь намеренно: этот модуль читает и
 * Vite, и голый Node (`npm run check:strains`), а значимый импорт по алиасу
 * `@/` Node не резолвит. Проверка `assertCatalogIntegrity()` следит за тем,
 * чтобы ни один словарь не потерял локаль.
 */
export const CATALOG_LOCALES: readonly Locale[] = ["en", "ru", "th", "ar", "zh", "ko", "ja"];

/** Разделитель перечисления. В CJK запятая своя, в арабском тоже. */
const LIST_SEPARATOR: Record<Locale, string> = {
  en: ", ",
  ru: ", ",
  th: ", ",
  ar: "، ",
  zh: "、",
  ko: ", ",
  ja: "、",
};

export const STRAIN_SLUGS: readonly string[] = Object.keys(STRAIN_CATALOG).sort();

/** Маршрут страницы сорта. Единственное место, где собирается этот путь. */
export function strainPathSuffix(slug: string): string {
  return `strains/${slug}`;
}

export function getStrainProfile(slug: string): StrainProfile | null {
  return STRAIN_CATALOG[slug] ?? null;
}

/** Подпись ссылки на сорт — та же форма, что у ключей `footerSeo.*Strain`. */
export function strainLinkLabel(slug: string, locale: Locale): string {
  const profile = getStrainProfile(slug);
  if (!profile) return "";
  return LINK_LABEL_PATTERN[locale].replace("{name}", profile.linkName ?? profile.name);
}

function joinList(parts: string[], locale: Locale): string {
  return parts.filter(Boolean).join(LIST_SEPARATOR[locale]);
}

/** Значение с видимой читателю пометкой достоверности. */
function withConfidence(value: string, confidence: Confidence, locale: Locale): string {
  const suffix = CONFIDENCE_SUFFIX[confidence][locale];
  return suffix ? `${value} (${suffix})` : value;
}

export function formatParent(parent: StrainParent, locale: Locale): string {
  return parent.kind === "landrace" ? LANDRACES[parent.id][locale] : parent.name;
}

export function formatLineage(profile: StrainProfile, locale: Locale): string {
  const parents = profile.lineage.parents.map((parent) => formatParent(parent, locale)).join(" × ");
  return withConfidence(parents, profile.lineage.confidence, locale);
}

export function formatFlowering(profile: StrainProfile, locale: Locale): string {
  const flowering = profile.flowering;
  if (!flowering) return "";
  const weeks =
    flowering.minWeeks === flowering.maxWeeks
      ? String(flowering.minWeeks)
      : `${flowering.minWeeks}–${flowering.maxWeeks}`;
  return withConfidence(FLOWERING_PATTERN[locale].replace("{weeks}", weeks), flowering.confidence, locale);
}

export function formatOrigin(profile: StrainProfile, locale: Locale): string {
  const { place, era, confidence } = profile.origin;
  const era_ = ERAS[era][locale];
  const value = place ? joinList([PLACES[place][locale], era_], locale) : era_;
  return withConfidence(value, confidence, locale);
}

export function formatTerpenes(profile: StrainProfile, locale: Locale): string {
  const names = profile.terpenes.map((id) => TERPENES[id].name[locale]);
  return withConfidence(joinList(names, locale), profile.terpeneConfidence, locale);
}

/**
 * Блок фактов ровно в том типе, который отрисует `StrainArticle.astro`.
 *
 * Это и есть смысл всего файла: страница сорта на японском получает
 * проверяемую таблицу характеристик БЕЗ машинного перевода прозы — переведены
 * только термины, а всё остальное собрано из данных. Прозу под таблицей
 * по-прежнему пишет человек.
 *
 * `keys` позволяет взять не все строки: набор из шести-семи читается лучше, чем
 * из двенадцати, а какие именно нужны — решает автор страницы.
 */
export function buildStrainFacts(
  slug: string,
  locale: Locale,
  keys?: readonly StrainFactKey[],
): StrainFact[] {
  const profile = getStrainProfile(slug);
  if (!profile) return [];
  const labels = FACT_LABELS[locale];
  const rows: { key: StrainFactKey; value: string }[] = [
    { key: "type", value: withConfidence(LEAN_LABELS[profile.lean][locale], profile.leanConfidence, locale) },
    { key: "lineage", value: formatLineage(profile, locale) },
    { key: profile.origin.place ? "bred" : "era", value: formatOrigin(profile, locale) },
    { key: "breeder", value: profile.origin.breeder ?? "" },
    { key: "flowering", value: formatFlowering(profile, locale) },
    { key: "terpenes", value: formatTerpenes(profile, locale) },
    { key: "aroma", value: joinList(profile.aroma.map((id) => AROMA_NOTES[id][locale]), locale) },
    { key: "family", value: FAMILY_LABELS[profile.family][locale] },
    { key: "character", value: joinList(profile.character.map((id) => CHARACTER_NOTES[id][locale]), locale) },
    { key: "awards", value: joinList(profile.awards, locale) },
    { key: "aka", value: joinList(profile.aka, locale) },
    {
      key: "compare",
      /*
       * В нелатинских локалях имена соседей выводятся в локализованной форме
       * («Сорт White Widow», «White Widow 品种»), а не голой латиницей.
       *
       * Это не косметика. Три имени сорта подряд — это шесть-восемь латинских
       * слов без единого символа локали, и `check-seo` совершенно правильно
       * читает такую строку как непереведённый абзац: по её виду отличить
       * список брендов от забытого куска английского текста нельзя ни линтеру,
       * ни человеку, скользящему глазом по странице. Локализованная обёртка
       * возвращает в строку язык страницы и заодно совпадает с подписью, под
       * которой тот же сосед стоит в перелинковке.
       *
       * В английской локали обёртка не нужна и только шумит: страница и так
       * целиком латинская.
       */
      value: joinList(
        profile.compareWith.map((neighbour) => {
          const other = STRAIN_CATALOG[neighbour];
          if (!other) return "";
          return locale === "en" ? other.linkName ?? other.name : strainLinkLabel(neighbour, locale);
        }),
        locale,
      ),
    },
  ];
  const wanted = keys ? rows.filter((row) => keys.includes(row.key)) : rows;
  return wanted
    .filter((row) => row.value.length > 0)
    .map((row) => ({ label: labels[row.key], value: row.value }));
}

export interface StrainContrast {
  sharedTerpenes: TerpeneId[];
  sharedAroma: AromaId[];
  /** Дескрипторы, которые есть у первого и которых нет у второго. */
  aromaOnlyInA: AromaId[];
  aromaOnlyInB: AromaId[];
  sameFamily: boolean;
  sameLean: boolean;
  /** Разница в длине цветения, недель по нижней границе. `null`, если неизвестно. */
  floweringGapWeeks: number | null;
}

/**
 * Чем два сорта похожи и чем расходятся — ВЫЧИСЛЕНО, а не написано.
 *
 * Тот же приём, что с расстояниями в `src/lib/geo.ts`: сравнение, посчитанное
 * из данных, нельзя переписать на соседней странице по невнимательности, и оно
 * не устареет отдельно от таблицы фактов. Автор страницы получает готовый
 * список различий и превращает его в предложение на своём языке.
 */
export function compareStrains(slugA: string, slugB: string): StrainContrast | null {
  const a = getStrainProfile(slugA);
  const b = getStrainProfile(slugB);
  if (!a || !b) return null;
  const bTerpenes = new Set<string>(b.terpenes);
  const bAroma = new Set<string>(b.aroma);
  const aAroma = new Set<string>(a.aroma);
  return {
    sharedTerpenes: a.terpenes.filter((id) => bTerpenes.has(id)),
    sharedAroma: a.aroma.filter((id) => bAroma.has(id)),
    aromaOnlyInA: a.aroma.filter((id) => !bAroma.has(id)),
    aromaOnlyInB: b.aroma.filter((id) => !aAroma.has(id)),
    sameFamily: a.family === b.family,
    sameLean: a.lean === b.lean,
    floweringGapWeeks:
      a.flowering && b.flowering ? Math.abs(a.flowering.minWeeks - b.flowering.minWeeks) : null,
  };
}

/**
 * Обратный индекс `compareWith`: кто назвал этот сорт своим соседом.
 *
 * `compareWith` — поле односторонее по своей природе: автор описания White
 * Widow решает, с чем её сравнить, и ничего не знает о том, кто сравнит себя
 * с ней. Пока связь читалась только вперёд, граф кластера оказывался
 * несимметричным, и один сорт проваливался целиком: Pineapple Express не назван
 * НИ ОДНИМ другим сортом, поэтому у его страницы была ровно одна входящая
 * контекстная ссылка — с хаба — и самый низкий вес во всём indexable-наборе, на
 * обеих локалях.
 *
 * Замер по всем двадцати сортам: вперёд у каждого ровно три соседа, а
 * объединение с обратными даёт 70 связей вместо 60. То есть у двенадцати сортов
 * не меняется ничего (обратные уже входят в прямые), а починка достаётся тем
 * восьми, кому её и не хватало. Это ровно то свойство, которого ждут от
 * симметрии: она не размазывает связи ровным слоем, она чинит провалы.
 */
const REVERSE_COMPARISONS: ReadonlyMap<string, readonly string[]> = (() => {
  const index = new Map<string, string[]>();
  for (const slug of STRAIN_SLUGS) {
    for (const other of STRAIN_CATALOG[slug].compareWith) {
      const list = index.get(other);
      if (list) list.push(slug);
      else index.set(other, [slug]);
    }
  }
  return index;
})();

/**
 * Смысловые соседи в формате `related` контент-завода: слаги страниц, а не
 * сортов. Хаб и гид по выбору дописывает кластер — здесь только сорта.
 *
 * Порядок значим: сначала то, что автор выбрал сам, потом обратные связи. Так
 * ручное решение остаётся первым в блоке ссылок, а симметрия работает добором.
 */
export function getStrainNeighbourSuffixes(slug: string): string[] {
  const profile = getStrainProfile(slug);
  if (!profile) return [];
  const neighbours = new Set<string>(profile.compareWith);
  for (const other of REVERSE_COMPARISONS.get(slug) ?? []) neighbours.add(other);
  neighbours.delete(slug);
  return [...neighbours].map(strainPathSuffix);
}

/** Сорта одной ароматической семьи, кроме самого сорта. */
export function getStrainsByFamily(family: AromaFamilyId, exceptSlug?: string): StrainProfile[] {
  return STRAIN_SLUGS.map((slug) => STRAIN_CATALOG[slug]).filter(
    (profile) => profile.family === family && profile.slug !== exceptSlug,
  );
}

/* ------------------------------------------------------------------------- *
 * ЦЕЛОСТНОСТЬ
 *
 * Проверка выполняется при импорте модуля, то есть во время сборки. Ошибка в
 * данных обязана валить сборку громко: страница сорта с пустой родословной или
 * ссылкой на несуществующего соседа — это ровно та тонкая страница, ради
 * недопущения которой построены ворота качества.
 * ------------------------------------------------------------------------- */

function assertVocabulary(name: string, table: Record<string, Record<Locale, string>>): string[] {
  const problems: string[] = [];
  for (const [id, byLocale] of Object.entries(table)) {
    for (const locale of CATALOG_LOCALES) {
      if (typeof byLocale[locale] !== "string") problems.push(`${name}.${id}: нет локали ${locale}`);
    }
  }
  return problems;
}

export function collectCatalogProblems(): string[] {
  const problems: string[] = [];

  problems.push(...assertVocabulary("AROMA_NOTES", AROMA_NOTES));
  problems.push(...assertVocabulary("CHARACTER_NOTES", CHARACTER_NOTES));
  problems.push(...assertVocabulary("PLACES", PLACES));
  problems.push(...assertVocabulary("ERAS", ERAS));
  problems.push(...assertVocabulary("LANDRACES", LANDRACES));
  problems.push(...assertVocabulary("LEAN_LABELS", LEAN_LABELS));
  problems.push(...assertVocabulary("FAMILY_LABELS", FAMILY_LABELS));
  problems.push(...assertVocabulary("CONFIDENCE_SUFFIX", CONFIDENCE_SUFFIX));

  for (const [id, entry] of Object.entries(TERPENES)) {
    for (const locale of CATALOG_LOCALES) {
      if (!entry.name[locale]) problems.push(`TERPENES.${id}: нет названия на ${locale}`);
      if (!entry.aroma[locale]) problems.push(`TERPENES.${id}: нет описания запаха на ${locale}`);
      if (!entry.alsoIn[locale]) problems.push(`TERPENES.${id}: нет якоря «где ещё встречается» на ${locale}`);
    }
  }

  for (const locale of CATALOG_LOCALES) {
    if (!FLOWERING_PATTERN[locale]?.includes("{weeks}")) {
      problems.push(`FLOWERING_PATTERN.${locale}: нет подстановки {weeks}`);
    }
    if (!LINK_LABEL_PATTERN[locale]?.includes("{name}")) {
      problems.push(`LINK_LABEL_PATTERN.${locale}: нет подстановки {name}`);
    }
    if (!FACT_LABELS[locale]) problems.push(`FACT_LABELS: нет локали ${locale}`);
  }

  const seenNames = new Map<string, string>();
  for (const [key, profile] of Object.entries(STRAIN_CATALOG)) {
    const where = `STRAIN_CATALOG.${key}`;
    if (profile.slug !== key) problems.push(`${where}: slug «${profile.slug}» не совпадает с ключом`);
    if (!/^[a-z0-9-]+$/.test(profile.slug)) problems.push(`${where}: слаг не в kebab-case`);
    if (!profile.name.trim()) problems.push(`${where}: пустое имя`);
    const clash = seenNames.get(profile.name);
    if (clash) problems.push(`${where}: имя «${profile.name}» уже занято слагом ${clash}`);
    seenNames.set(profile.name, profile.slug);

    if (profile.lineage.parents.length < 2) problems.push(`${where}: родословная короче двух родителей`);
    for (const parent of profile.lineage.parents) {
      if (parent.kind === "landrace" && !LANDRACES[parent.id]) {
        problems.push(`${where}: неизвестный ландрейс ${parent.id}`);
      }
      if (parent.kind === "cultivar" && !parent.name.trim()) {
        problems.push(`${where}: пустое имя родителя`);
      }
    }

    if (profile.origin.place && !PLACES[profile.origin.place]) {
      problems.push(`${where}: неизвестное место ${profile.origin.place}`);
    }
    if (!ERAS[profile.origin.era]) problems.push(`${where}: неизвестная эпоха ${profile.origin.era}`);

    const flowering = profile.flowering;
    if (flowering) {
      if (flowering.minWeeks > flowering.maxWeeks) problems.push(`${where}: цветение min > max`);
      if (flowering.minWeeks < 5 || flowering.maxWeeks > 16) {
        problems.push(`${where}: цветение вне правдоподобного диапазона 5–16 недель`);
      }
    }

    if (profile.terpenes.length === 0) problems.push(`${where}: не назван ни один терпен`);
    if (new Set(profile.terpenes).size !== profile.terpenes.length) {
      problems.push(`${where}: терпен повторяется`);
    }
    for (const id of profile.terpenes) {
      if (!TERPENES[id]) problems.push(`${where}: неизвестный терпен ${id}`);
    }
    if (profile.aroma.length === 0) problems.push(`${where}: не назван ни один ароматический дескриптор`);
    for (const id of profile.aroma) {
      if (!AROMA_NOTES[id]) problems.push(`${where}: неизвестный дескриптор ${id}`);
    }
    if (profile.character.length === 0) problems.push(`${where}: не описан характер`);
    for (const id of profile.character) {
      if (!CHARACTER_NOTES[id]) problems.push(`${where}: неизвестное описание характера ${id}`);
    }
    if (!FAMILY_LABELS[profile.family]) problems.push(`${where}: неизвестная ароматическая семья ${profile.family}`);

    if (profile.compareWith.length < 2) problems.push(`${where}: меньше двух соседей для сравнения`);
    for (const neighbour of profile.compareWith) {
      if (neighbour === profile.slug) problems.push(`${where}: сорт сравнивается сам с собой`);
      if (!STRAIN_CATALOG[neighbour]) problems.push(`${where}: сосед ${neighbour} не существует`);
    }

    if (profile.origin.breeder) {
      // Поле уходит в страницу КАК ЕСТЬ на всех семи локалях, поэтому в нём
      // допустимы только имена собственные: любое английское пояснение здесь
      // окажется английской вставкой в японском тексте. Пояснение — в noteEn.
      if (/[;]| then | and | by |credited|usually|later/i.test(profile.origin.breeder)) {
        problems.push(`${where}: в поле breeder английская проза, а не имена: «${profile.origin.breeder}»`);
      }
      if (profile.origin.breeder.length > 60) problems.push(`${where}: breeder длиннее 60 символов`);
    }
    for (const award of profile.awards) {
      // Запятая внутри награды сливается с разделителем перечисления.
      if (award.includes(",")) problems.push(`${where}: запятая внутри награды «${award}»`);
    }
    if (profile.writerNotesEn.length === 0) problems.push(`${where}: нет заметок для автора`);
    if (profile.sources.length === 0) problems.push(`${where}: нет ни одного источника`);
    for (const source of profile.sources) {
      if (!source.url.startsWith("https://")) problems.push(`${where}: источник не по https: ${source.url}`);
      if (!source.supportsEn.trim()) problems.push(`${where}: у источника не сказано, что он подтверждает`);
    }
  }

  return problems;
}

const CATALOG_PROBLEMS = collectCatalogProblems();
if (CATALOG_PROBLEMS.length > 0) {
  throw new Error(`Набор данных сортов не сходится:\n${CATALOG_PROBLEMS.join("\n")}`);
}
