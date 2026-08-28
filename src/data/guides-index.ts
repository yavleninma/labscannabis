import type { Locale } from "@/lib/i18n";
import type { CopySection, FaqItem } from "@/data/visit-copy";

/**
 * Хаб знаниевого кластера (T-07).
 *
 * Не список голых ссылок: у каждого гайда одно-два предложения о том, на какой
 * вопрос он отвечает, — это одновременно точка входа краулера в кластер и
 * единственный внятный способ для человека выбрать, куда идти. Ссылки
 * фильтруются политикой индексации в шаблоне: гайд, написанный только на en+ru,
 * не должен появляться ссылкой на тайской странице.
 */
export interface GuideIndexItem {
  /** `pathSuffix` гайда; фильтруется через `getIndexPolicy` в шаблоне. */
  suffix: string;
  label: string;
  blurb: string;
}

export interface GuidesIndexCopy {
  title: string;
  description: string;
  h1: string;
  kicker: string;
  lead: string;
  itemsTitle: string;
  items: GuideIndexItem[];
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
}

const SUFFIX = {
  legal: "guides/legal-cannabis-tourists",
  prescription: "guides/prescription-pattaya",
  firstVisit: "guides/first-visit-pattaya",
  choosing: "guides/choosing-flower-pattaya",
  /**
   * Вопросные темы (кластер `questions/*`, `src/data/question-pages.ts`).
   * Их хаб — этот же хаб: читатель не различает «гид» и «вопросы», а второй
   * хаб на шесть ссылок был бы тонкой страницей. Список фильтруется
   * `getIndexPolicy`, поэтому на локали, где темы ещё не написаны, ссылки
   * не появятся.
   */
  qRules: "questions/rules-and-prescription",
  qBuying: "questions/buying-in-person",
  qUse: "questions/where-you-can-use",
  qLeaving: "questions/taking-it-home",
  qShopCheck: "questions/checking-a-shop",
  qMyths: "questions/common-myths",
  qStorage: "questions/keeping-flower-in-the-tropics",
  qArriving: "questions/arriving-with-cannabis",
} as const;

export const GUIDES_INDEX_COPY: Record<Locale, GuidesIndexCopy> = {
  en: {
    title: "Cannabis guides for visitors to Pattaya | Labs Cannabis",
    description:
      "Guides and answer pages for visitors to Pattaya: what the official notices state, the prescription, a first visit, and the questions asked at the counter.",
    h1: "Cannabis guides for visitors to Pattaya",
    kicker: "Knowledge base",
    lead:
      "Some questions come up so often at the counter that writing them down properly was easier than answering them one at a time. The long-form guides take a subject each; the answer pages below them collect the short questions by theme, with every answer marked as an official source, as practical caution, or as something we cannot confirm. None of these pages sells anything.",
    itemsTitle: "Guides and answer pages",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "Thailand cannabis rules for tourists",
        blurb:
          "What the June 2025 notifications changed, with links to the government sources and a visible date. Start here if you are unsure whether anything you read elsewhere is still current.",
      },
      {
        suffix: SUFFIX.prescription,
        label: "Do you need a prescription?",
        blurb:
          "The document itself: who issues it, why a prescription from home does not transfer, what the thirty-day figure means and what a counter does with the paper.",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "Your first visit to a dispensary",
        blurb:
          "The part nobody publishes — what to put in your pocket, what happens at the door, how the counter conversation goes and what not to do afterwards.",
      },
      {
        suffix: SUFFIX.choosing,
        label: "How to choose flower",
        blurb:
          "Indica and sativa as shorthand rather than specification, what a lab report actually covers, how well-cured flower looks and feels, and the questions worth asking.",
      },
      {
        suffix: SUFFIX.qRules,
        label: "Prescription and eligibility questions",
        blurb:
          "Nine short answers about the document itself: what ภ.ท.33 is, who may write it, the age line, the thirty-day figure and what the 2026 regulation changed.",
      },
      {
        suffix: SUFFIX.qBuying,
        label: "Questions about buying in person",
        blurb:
          "What to carry, whether a local phone number matters, why nothing is arranged in advance, what happens on a second visit and what a message will never contain.",
      },
      {
        suffix: SUFFIX.qUse,
        label: "Where you may and may not use it",
        blurb:
          "The beach, a hotel room, a rented condo, a bar terrace, a scooter. The page that decides whether a lawful purchase stays uneventful.",
      },
      {
        suffix: SUFFIX.qLeaving,
        label: "Leaving Thailand and the airport",
        blurb:
          "Why nothing goes in the luggage, what a Thai document is worth at another border, why a layover counts, and the questions we refuse to answer for you.",
      },
      {
        suffix: SUFFIX.qShopCheck,
        label: "Checking a shop before you buy",
        blurb:
          "The checks a visitor can make personally at the door — the licence, the order of the questions, the frontage that proves nothing, the offer to bring some to your room.",
      },
      {
        suffix: SUFFIX.qMyths,
        label: "What visitors still get wrong",
        blurb:
          "Nine beliefs people arrive with, each set against what the notice says: «everything is legal», «a passport is enough», «thirty grams a month», «a small amount is fine to take home».",
      },
      {
        suffix: SUFFIX.qStorage,
        label: "Keeping flower in this heat",
        blurb:
          "The only page here with no rule behind it, because there is no rule: what tropical heat and humidity do to what you already own, and the nine practical answers that follow from it.",
      },
      {
        suffix: SUFFIX.qArriving,
        label: "Arriving with it, rather than leaving with it",
        blurb:
          "The mirror of the departure page, and the honest one: what the notices settle about visitors, and the four questions where we have no verifiable source and say so.",
      },
    ],
    sections: [
      {
        h2: "Why this site publishes guides and not a menu",
        body: [
          "Thailand restricts public advertising of a controlled herb and prohibits selling it through electronic channels. That rules out the things a cannabis website usually contains — a price list, a stock page, product photographs, a payment button — and it rules them out in every language, which is why you will not find any of them on this domain.",
          "What is left is the part that was always more useful anyway. A visitor who knows which document to bring, what the counter will ask, and how to tell a well-kept jar from a tired one has a better afternoon than one who memorised a price and arrived without a passport.",
        ],
      },
      {
        h2: "How to read what is marked on these pages",
        body: [
          "Every section in the guides carries a visible label saying where it comes from. Official source means the passage restates a published notification and nothing beyond it. Practical caution means it describes how something looks at a counter in Pattaya — accurate as far as we can see it, but not a legal conclusion and not a substitute for one.",
          "Every guide also carries a visible date of last update. The rules here changed substantially in June 2025 and a page without a date is a page that cannot be trusted on this subject, including when the page belongs to somebody else.",
        ],
      },
      {
        h2: "What these guides deliberately do not do",
        body: [
          "They do not give legal advice, they do not make medical claims, and they do not state anything about our own supply that would require a document we have not published. Where a fact is not verified, the site says so rather than filling the gap.",
          "They also do not replace asking. If your situation is unusual — an unfamiliar document, an early flight, a question about what is on the shelf today — a message gets a straight answer faster than any page can be rewritten.",
        ],
      },
    ],
    faqTitle: "About these guides",
    faq: [
      {
        q: "How current are these pages?",
        a: "Each guide shows its last update date on the page. The legal guide links the government notifications directly so you can check the primary source yourself.",
      },
      {
        q: "Is this legal advice?",
        a: "No. Passages restating an official notification are labelled as such; everything else is labelled as practical caution, which is a description of what happens at a counter rather than a legal conclusion.",
      },
      {
        q: "Why is there no price or menu information anywhere?",
        a: "Public advertising of a controlled herb is restricted and sale through electronic channels is prohibited. Questions about the current shelf are answered by message or at the counter.",
      },
    ],
  },
  ru: {
    title: "Гиды по каннабису в Паттайе для туристов | Labs Cannabis",
    description:
      "Гиды и страницы ответов для гостей Паттайи: что говорят официальные уведомления, вопрос про рецепт, первый визит и то, о чём спрашивают у прилавка.",
    h1: "Гиды по каннабису в Паттайе",
    kicker: "База знаний",
    lead:
      "Часть вопросов звучит у прилавка так часто, что записать их толком оказалось проще, чем отвечать по одному. Длинные гиды берут по предмету на каждый; страницы ответов под ними собирают короткие вопросы по темам, и над каждым ответом стоит его основание: официальный источник, практическая осторожность или прямое «подтвердить не можем». Ни одна из этих страниц ничего не продаёт.",
    itemsTitle: "Гиды и страницы ответов",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "Правила Таиланда для туристов",
        blurb:
          "Что изменили уведомления июня 2025 года, со ссылками на государственные источники и видимой датой. Начинать стоит отсюда, если непонятно, актуально ли прочитанное в другом месте.",
      },
      {
        suffix: SUFFIX.prescription,
        label: "Нужен ли рецепт",
        blurb:
          "Про сам документ: кто выдаёт, почему зарубежный рецепт не переносится, что означает срок в тридцать дней и что с бумагой делают у прилавка.",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "Первый визит в магазин",
        blurb:
          "Часть, которую не описывает никто: что положить в карман, что происходит у двери, как идёт разговор у прилавка и чего нельзя делать после.",
      },
      {
        suffix: SUFFIX.choosing,
        label: "Как выбрать цветок",
        blurb:
          "Индика и сатива как сокращение, а не спецификация; что на самом деле охватывает лабораторный отчёт, как выглядит вылежанный цветок и о чём спрашивать.",
      },
      {
        suffix: SUFFIX.qRules,
        label: "Вопросы про рецепт и допуск",
        blurb:
          "Девять коротких ответов про сам документ: что такое ภ.ท.33, кто вправе его выписать, возрастная граница, цифра тридцати дней и что изменило постановление 2026 года.",
      },
      {
        suffix: SUFFIX.qBuying,
        label: "Вопросы про покупку на месте",
        blurb:
          "Что взять с собой, нужен ли местный номер, почему ничего не оформляется заранее, что происходит на втором визите и чего никогда не будет в переписке.",
      },
      {
        suffix: SUFFIX.qUse,
        label: "Где можно и нельзя употреблять",
        blurb:
          "Пляж, номер отеля, съёмное кондо, терраса бара, байк. Страница, от которой зависит, останется ли законная покупка без последствий.",
      },
      {
        suffix: SUFFIX.qLeaving,
        label: "Отъезд и аэропорт",
        blurb:
          "Почему ничего не кладут в багаж, чего стоит тайский документ на чужой границе, почему пересадка считается и на какие вопросы мы отвечать отказываемся.",
      },
      {
        suffix: SUFFIX.qShopCheck,
        label: "Как проверить магазин до покупки",
        blurb:
          "Проверки, которые приезжий делает сам у двери: лицензия, порядок вопросов, фасад, который ничего не доказывает, предложение принести в номер.",
      },
      {
        suffix: SUFFIX.qMyths,
        label: "В чём приезжие ошибаются",
        blurb:
          "Девять убеждений, с которыми приходят, и то, что на это отвечает уведомление: «всё легально», «хватит паспорта», «тридцать граммов в месяц», «немного увезти можно».",
      },
      {
        suffix: SUFFIX.qStorage,
        label: "Хранение в этой жаре",
        blurb:
          "Единственная страница раздела, за которой не стоит норма, потому что нормы нет: что тропическая жара и влажность делают с уже купленным и какие девять практических ответов из этого следуют.",
      },
      {
        suffix: SUFFIX.qArriving,
        label: "Прилететь с этим, а не улететь",
        blurb:
          "Зеркало страницы об отъезде и самая честная из них: что уведомления решают о приезжих и четыре вопроса, по которым проверяемого источника у нас нет, о чём мы прямо и пишем.",
      },
    ],
    sections: [
      {
        h2: "Почему на сайте гиды, а не меню",
        body: [
          "Таиланд ограничивает публичную рекламу контролируемого растения и запрещает продавать его через электронные каналы. Это исключает всё, что обычно составляет каннабис-сайт: прайс-лист, страницу остатков, фотографии товара, кнопку оплаты, — и исключает на всех языках, поэтому ничего из перечисленного на этом домене нет.",
          "Остаётся то, что и так было полезнее. Гость, который знает, какой документ взять, о чём спросят у прилавка и чем свежая банка отличается от уставшей, проводит день лучше, чем тот, кто выучил цену и приехал без паспорта.",
        ],
      },
      {
        h2: "Как читать пометки на этих страницах",
        body: [
          "У каждого раздела гайдов стоит видимая пометка об основании. «Официальный источник» означает, что абзац пересказывает опубликованное уведомление и ничего сверх него. «Практическая осторожность» означает описание того, как это выглядит у прилавка в Паттайе: точное, насколько мы это видим, но не юридический вывод и не замена ему.",
          "У каждого гайда также стоит видимая дата последнего обновления. Правила заметно менялись в июне 2025 года, и страница без даты по этой теме доверия не заслуживает — включая случаи, когда страница чужая.",
        ],
      },
      {
        h2: "Чего эти гиды сознательно не делают",
        body: [
          "Не дают юридических консультаций, не делают медицинских утверждений и не заявляют о собственных поставках ничего, что требовало бы неопубликованного документа. Там, где факт не подтверждён, сайт так и пишет, а не закрывает пробел выдумкой.",
          "И они не заменяют вопрос. Если ситуация нестандартная — незнакомый документ, ранний вылет, вопрос про сегодняшнюю полку, — в переписке ответят прямо и быстрее, чем можно переписать страницу.",
        ],
      },
    ],
    faqTitle: "Про эти гиды",
    faq: [
      {
        q: "Насколько эти страницы актуальны?",
        a: "У каждого гида на странице стоит дата последнего обновления. Правовой гид даёт прямые ссылки на государственные уведомления, чтобы первоисточник можно было проверить самостоятельно.",
      },
      {
        q: "Это юридическая консультация?",
        a: "Нет. Абзацы, пересказывающие официальное уведомление, помечены как таковые; всё остальное помечено как практическая осторожность — описание происходящего у прилавка, а не юридический вывод.",
      },
      {
        q: "Почему нигде нет цен и меню?",
        a: "Публичная реклама контролируемого растения ограничена, а продажа через электронные каналы запрещена. О текущей полке отвечают в переписке или у прилавка.",
      },
    ],
  },
  th: {
    title: "คู่มือกัญชาสำหรับผู้มาเยือนพัทยา | Labs Cannabis",
    description:
      "คู่มือสำหรับผู้มาเยือนพัทยา ตั้งแต่กฎตามประกาศทางการ เรื่องใบสั่งแพทย์ การมาเยือนครั้งแรก ไปจนถึงวิธีดูช่อดอกด้วยตัวเอง",
    h1: "คู่มือกัญชาสำหรับผู้มาเยือนพัทยา",
    kicker: "ฐานความรู้",
    lead:
      "มีคำถามไม่กี่ข้อที่ถูกถามที่เคาน์เตอร์บ่อยจนการเขียนไว้ให้ครบง่ายกว่าการตอบทีละครั้ง หน้าเหล่านี้ไม่ได้ขายอะไร แต่รวมกันแล้วครอบคลุมว่ากฎหมายว่าอย่างไร ต้องใช้เอกสารอะไร การมาครั้งแรกเป็นอย่างไร และจะดูของในขวดอย่างไร",
    itemsTitle: "คู่มือทั้งหมด",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "กฎกัญชาของไทยสำหรับนักท่องเที่ยว",
        blurb:
          "ประกาศเดือนมิถุนายน 2568 เปลี่ยนอะไรบ้าง พร้อมลิงก์แหล่งข้อมูลของรัฐและวันที่ปรับปรุงที่มองเห็นได้ เริ่มที่นี่หากไม่แน่ใจว่าสิ่งที่อ่านจากที่อื่นยังใช้ได้อยู่",
      },
      {
        suffix: SUFFIX.prescription,
        label: "ต้องมีใบสั่งแพทย์ไหม",
        blurb:
          "ว่าด้วยตัวเอกสาร ใครเป็นผู้ออก ทำไมใบสั่งจากต่างประเทศใช้แทนไม่ได้ ตัวเลขสามสิบวันหมายถึงอะไร และเคาน์เตอร์ทำอะไรกับเอกสารนั้น",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "การมาร้านครั้งแรก",
        blurb:
          "ส่วนที่ไม่มีใครเขียน ต้องพกอะไร หน้าประตูเกิดอะไรขึ้น บทสนทนาที่เคาน์เตอร์เป็นอย่างไร และห้ามทำอะไรหลังจากนั้น",
      },
      {
        suffix: SUFFIX.choosing,
        label: "วิธีเลือกช่อดอก",
        blurb:
          "อินดิก้ากับซาติว่าเป็นคำย่อ ไม่ใช่ข้อกำหนด รายงานแล็บครอบคลุมอะไรจริง ๆ ช่อดอกที่บ่มดีเป็นอย่างไร และควรถามอะไร",
      },
    ],
    sections: [
      {
        h2: "ทำไมเว็บนี้มีคู่มือแทนที่จะมีเมนู",
        body: [
          "ประเทศไทยจำกัดการโฆษณาสมุนไพรควบคุมต่อสาธารณะ และห้ามการขายผ่านช่องทางอิเล็กทรอนิกส์ นั่นตัดสิ่งที่เว็บกัญชามักมีออกไปทั้งหมด ทั้งรายการราคา หน้าสินค้าคงเหลือ ภาพสินค้า และปุ่มชำระเงิน และตัดออกในทุกภาษา จึงไม่มีสิ่งเหล่านี้บนโดเมนนี้",
          "สิ่งที่เหลือคือส่วนที่มีประโยชน์กว่าอยู่แล้ว ผู้มาเยือนที่รู้ว่าต้องเตรียมเอกสารใด เคาน์เตอร์จะถามอะไร และขวดที่เก็บดีต่างจากขวดที่เหนื่อยล้าอย่างไร ย่อมมีวันที่ดีกว่าคนที่จำราคามาแต่ลืมหนังสือเดินทาง",
        ],
      },
      {
        h2: "อ่านป้ายกำกับในหน้าเหล่านี้อย่างไร",
        body: [
          "ทุกหัวข้อในคู่มือมีป้ายกำกับที่มองเห็นได้ว่ามาจากไหน แหล่งข้อมูลทางการหมายถึงย่อหน้านั้นเล่าซ้ำประกาศที่เผยแพร่แล้วโดยไม่เพิ่มเติม ส่วนข้อควรระวังเชิงปฏิบัติหมายถึงคำอธิบายว่าสิ่งนั้นเป็นอย่างไรที่เคาน์เตอร์ในพัทยา ถูกต้องเท่าที่เรามองเห็น แต่ไม่ใช่ข้อสรุปทางกฎหมายและไม่ใช่สิ่งทดแทน",
          "ทุกคู่มือยังแสดงวันที่ปรับปรุงล่าสุด กฎเปลี่ยนไปอย่างมากเมื่อมิถุนายน 2568 และหน้าที่ไม่มีวันที่ย่อมไว้ใจไม่ได้ในเรื่องนี้ รวมถึงเมื่อหน้านั้นเป็นของคนอื่น",
        ],
      },
      {
        h2: "สิ่งที่คู่มือเหล่านี้ตั้งใจไม่ทำ",
        body: [
          "ไม่ให้คำแนะนำทางกฎหมาย ไม่กล่าวอ้างทางการแพทย์ และไม่ระบุสิ่งใดเกี่ยวกับแหล่งที่มาของเราเองซึ่งต้องอาศัยเอกสารที่ยังไม่ได้เผยแพร่ ตรงไหนที่ข้อเท็จจริงยังไม่ได้รับการยืนยัน เว็บไซต์จะบอกตามนั้นแทนที่จะเติมช่องว่าง",
          "และไม่แทนที่การถาม หากสถานการณ์ของคุณไม่ปกติ เช่น เอกสารแปลก เที่ยวบินเช้า หรือคำถามเรื่องของบนชั้นวันนี้ การส่งข้อความได้คำตอบตรงกว่าและเร็วกว่าการแก้หน้าเว็บ",
        ],
      },
    ],
    faqTitle: "เกี่ยวกับคู่มือเหล่านี้",
    faq: [
      {
        q: "หน้าเหล่านี้ใหม่แค่ไหน",
        a: "คู่มือแต่ละฉบับแสดงวันที่ปรับปรุงล่าสุดบนหน้า และคู่มือกฎหมายลิงก์ประกาศของรัฐโดยตรงเพื่อให้ตรวจสอบต้นทางได้เอง",
      },
      {
        q: "นี่คือคำแนะนำทางกฎหมายหรือไม่",
        a: "ไม่ใช่ ย่อหน้าที่เล่าซ้ำประกาศทางการมีป้ายกำกับไว้ ส่วนที่เหลือกำกับว่าเป็นข้อควรระวังเชิงปฏิบัติ คือคำอธิบายสิ่งที่เกิดขึ้นที่เคาน์เตอร์ ไม่ใช่ข้อสรุปทางกฎหมาย",
      },
      {
        q: "ทำไมไม่มีราคาและเมนูที่ใดเลย",
        a: "การโฆษณาสมุนไพรควบคุมต่อสาธารณะถูกจำกัด และการขายผ่านช่องทางอิเล็กทรอนิกส์เป็นสิ่งต้องห้าม คำถามเรื่องของบนชั้นตอบทางข้อความหรือที่เคาน์เตอร์",
      },
    ],
  },
  ar: {
    title: "أدلة القنب لزوار باتايا | Labs Cannabis",
    description:
      "أدلة لزوار باتايا: القواعد كما تنص عليها الإشعارات الرسمية، ومسألة الوصفة، وأول زيارة، وكيف تحكم بنفسك على الزهرة.",
    h1: "أدلة القنب لزوار باتايا",
    kicker: "قاعدة المعرفة",
    lead:
      "تتكرر بضعة أسئلة عند المنضدة إلى حد صار معه تدوينها بإتقان أسهل من الإجابة عنها واحدة تلو الأخرى. هذه الصفحات لا تبيع شيئًا، لكنها مجتمعة تغطي ما يقوله القانون، وأي مستند تحتاج، وكيف تجري أول زيارة، وكيف تحكم على ما في العبوة.",
    itemsTitle: "الأدلة",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "قواعد القنب في تايلاند للسياح",
        blurb:
          "ما غيّرته إشعارات يونيو 2025، مع روابط المصادر الحكومية وتاريخ تحديث ظاهر. ابدأ هنا إن لم تكن واثقًا أن ما قرأته في مكان آخر ما زال ساريًا.",
      },
      {
        suffix: SUFFIX.prescription,
        label: "هل تحتاج وصفة؟",
        blurb:
          "عن المستند نفسه: من يصدره، ولماذا لا تنتقل وصفة بلدك، وماذا يعني رقم الثلاثين يومًا، وماذا تفعل المنضدة بالورقة.",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "أول زيارة لمتجر",
        blurb:
          "الجزء الذي لا ينشره أحد: ماذا تضع في جيبك، وماذا يجري عند الباب، وكيف يسير الحديث عند المنضدة، وما لا يُفعل بعد ذلك.",
      },
      {
        suffix: SUFFIX.choosing,
        label: "كيف تختار الزهرة",
        blurb:
          "الإنديكا والساتيفا اختصار لا مواصفة، وما الذي يغطيه تقرير المختبر فعلًا، وكيف تبدو الزهرة جيدة المعالجة، وأي الأسئلة تستحق الطرح.",
      },
    ],
    sections: [
      {
        h2: "لماذا ينشر هذا الموقع أدلة لا قائمة",
        body: [
          "تقيّد تايلاند الإعلان العلني عن عشبة خاضعة للرقابة وتحظر بيعها عبر القنوات الإلكترونية. وهذا يستبعد ما يحتويه موقع قنب عادةً: قائمة أسعار، وصفحة مخزون، وصور منتجات، وزر دفع؛ ويستبعده بكل اللغات، ولذلك لا تجد شيئًا منه على هذا النطاق.",
          "ويبقى الجزء الذي كان أنفع أصلًا. الزائر الذي يعرف أي مستند يحضر، وماذا ستسأله المنضدة، وكيف يميّز عبوة محفوظة جيدًا من أخرى متعبة، يقضي يومًا أفضل ممن حفظ سعرًا ووصل بلا جواز سفر.",
        ],
      },
      {
        h2: "كيف تقرأ العلامات في هذه الصفحات",
        body: [
          "كل قسم في الأدلة يحمل علامة ظاهرة تبيّن مصدره. مصدر رسمي يعني أن الفقرة تعيد صياغة إشعار منشور ولا تتجاوزه. واحتياط عملي يعني وصف ما يجري عند منضدة في باتايا: دقيق بقدر ما نراه، لكنه ليس استنتاجًا قانونيًا ولا بديلًا عنه.",
          "ويحمل كل دليل تاريخ آخر تحديث ظاهرًا. تغيّرت القواعد جوهريًا في يونيو 2025، والصفحة بلا تاريخ لا يُوثق بها في هذا الموضوع، بما في ذلك حين تكون الصفحة لغيرنا.",
        ],
      },
      {
        h2: "ما لا تفعله هذه الأدلة عن قصد",
        body: [
          "لا تقدم مشورة قانونية، ولا تطلق ادعاءات طبية، ولا تذكر عن مصادرنا شيئًا يتطلب مستندًا لم يُنشر. وحيث لا تكون الحقيقة مؤكدة يقول الموقع ذلك بدل ملء الفراغ.",
          "وهي لا تغني عن السؤال. إن كانت حالتك غير معتادة — مستند غريب، رحلة مبكرة، سؤال عن رف اليوم — فرسالة تأتي بجواب مباشر أسرع من إعادة كتابة صفحة.",
        ],
      },
    ],
    faqTitle: "عن هذه الأدلة",
    faq: [
      {
        q: "ما مدى حداثة هذه الصفحات؟",
        a: "يعرض كل دليل تاريخ آخر تحديث على الصفحة، ويربط الدليل القانوني الإشعارات الحكومية مباشرة لتراجع المصدر بنفسك.",
      },
      {
        q: "هل هذه استشارة قانونية؟",
        a: "لا. الفقرات التي تعيد صياغة إشعار رسمي مُعلَّمة بذلك، وما عداها مُعلَّم بوصفه احتياطًا عمليًا، أي وصفًا لما يجري عند المنضدة لا استنتاجًا قانونيًا.",
      },
      {
        q: "لماذا لا توجد أسعار ولا قائمة في أي مكان؟",
        a: "الإعلان العلني عن عشبة خاضعة للرقابة مقيّد، والبيع عبر القنوات الإلكترونية محظور. أسئلة الرف الحالي يُجاب عنها برسالة أو عند المنضدة.",
      },
    ],
  },
  zh: {
    title: "写给芭提雅访客的大麻指南 | Labs Cannabis",
    description:
      "写给芭提雅访客的指南：官方公告怎么规定、处方问题、第一次到店会遇到什么，以及如何自己判断干花的品相。",
    h1: "写给芭提雅访客的大麻指南",
    kicker: "知识库",
    lead:
      "有几个问题在柜台被问得太频繁，认真写下来反而比一次次回答更省事。这些页面不销售任何东西；合在一起，它们讲清了法律怎么说、需要什么文件、第一次到店会经历什么，以及怎么判断罐子里的东西。",
    itemsTitle: "全部指南",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "泰国大麻规则（面向游客）",
        blurb:
          "2025 年 6 月的公告改变了什么，附政府来源链接和可见的更新日期。如果不确定别处读到的内容是否仍然适用，请从这里开始。",
      },
      {
        suffix: SUFFIX.prescription,
        label: "需要处方吗",
        blurb:
          "讲这份文件本身：谁开具、为什么本国处方不能平移过来、三十天这个数字意味着什么，以及柜台会拿它做什么。",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "第一次到店",
        blurb:
          "没有人写的那部分：口袋里带什么、门口会发生什么、柜台对话怎么进行，以及离店之后不能做什么。",
      },
      {
        suffix: SUFFIX.choosing,
        label: "如何挑选干花",
        blurb:
          "印度与南亚品系只是速记而非规格，实验室报告到底涵盖什么，养护良好的干花是什么手感，以及值得问的问题。",
      },
    ],
    sections: [
      {
        h2: "本站为什么提供指南而不是菜单",
        body: [
          "泰国限制对受管制草本植物的公开宣传，并禁止通过电子渠道销售。这就排除了大麻网站通常会有的东西——价目表、库存页、产品照片、付款按钮——而且在所有语言里都排除，因此这个域名上没有任何一项。",
          "剩下的恰恰是本来更有用的部分。知道该带哪份文件、柜台会问什么、保存良好的罐子与状态疲惫的罐子有何区别的访客，会比背下价格却忘带护照的人过得顺利得多。",
        ],
      },
      {
        h2: "如何读页面上的标注",
        body: [
          "指南里的每一节都带有可见标注，说明它的来源。官方来源表示这一段复述已发布的公告，不作任何超出。实务提醒表示这是对芭提雅柜台情形的描述：就我们所见是准确的，但不是法律结论，也不能替代法律结论。",
          "每份指南还标有可见的最后更新日期。2025 年 6 月规则发生了实质变化，在这个主题上没有日期的页面不值得信任——包括那是别人的页面时。",
        ],
      },
      {
        h2: "这些指南刻意不做的事",
        body: [
          "不提供法律意见，不作医疗宣称，也不就我们自己的货源发表任何需要未公开文件支撑的说法。事实未经核实之处，本站会如实说明，而不是把空白填上。",
          "它们也不能替代提问。如果你的情况特殊——不熟悉的文件、很早的航班、关于今天货架的问题——发条消息得到的直接答复，比改写一个页面更快。",
        ],
      },
    ],
    faqTitle: "关于这些指南",
    faq: [
      {
        q: "这些页面有多新？",
        a: "每份指南都在页面上显示最后更新日期。法律指南直接链接政府公告，你可以自行核对原始来源。",
      },
      {
        q: "这算法律意见吗？",
        a: "不算。复述官方公告的段落已作标注，其余标注为实务提醒，即对柜台情形的描述，而不是法律结论。",
      },
      {
        q: "为什么到处都没有价格和菜单？",
        a: "对受管制草本植物的公开宣传受限制，通过电子渠道销售被禁止。关于当前货架的问题，请通过消息或在柜台询问。",
      },
    ],
  },
  ko: {
    title: "파타야 방문자를 위한 대마 가이드 | Labs Cannabis",
    description:
      "파타야 방문자를 위한 가이드 모음: 공식 고시가 정한 규칙, 처방전 문제, 첫 방문, 그리고 꽃을 스스로 판단하는 법.",
    h1: "파타야 방문자를 위한 대마 가이드",
    kicker: "지식 창고",
    lead:
      "카운터에서 너무 자주 나오는 몇 가지 질문이 있어서, 매번 답하기보다 제대로 적어 두는 편이 쉬웠습니다. 이 페이지들은 무엇도 팔지 않습니다. 다만 법이 무엇을 말하는지, 어떤 서류가 필요한지, 첫 방문은 어떻게 흘러가는지, 병 안의 것을 어떻게 판단하는지를 함께 다룹니다.",
    itemsTitle: "가이드 목록",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "여행자를 위한 태국 대마 규칙",
        blurb:
          "2025년 6월 고시가 무엇을 바꾸었는지, 정부 출처 링크와 눈에 보이는 날짜와 함께. 다른 곳에서 읽은 내용이 아직 유효한지 확신이 없다면 여기서 시작하십시오.",
      },
      {
        suffix: SUFFIX.prescription,
        label: "처방전이 필요한가",
        blurb:
          "문서 자체에 대한 이야기. 누가 발급하는지, 본국 처방전이 왜 옮겨지지 않는지, 삼십 일이라는 숫자가 무엇을 뜻하는지, 카운터는 그 종이로 무엇을 하는지.",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "첫 방문",
        blurb:
          "아무도 쓰지 않는 부분. 주머니에 무엇을 넣을지, 문 앞에서 무슨 일이 있는지, 카운터 대화는 어떻게 흘러가는지, 나온 뒤에 하지 말아야 할 것.",
      },
      {
        suffix: SUFFIX.choosing,
        label: "꽃 고르는 법",
        blurb:
          "인디카와 사티바는 규격이 아니라 줄임말이라는 것, 실험 보고서가 실제로 무엇을 담는지, 잘 숙성된 꽃은 어떤 느낌인지, 무엇을 물어야 하는지.",
      },
    ],
    sections: [
      {
        h2: "이 사이트가 메뉴 대신 가이드를 두는 이유",
        body: [
          "태국은 관리 대상 허브의 공개 광고를 제한하고 전자적 경로를 통한 판매를 금지합니다. 그러면 대마 웹사이트가 흔히 담는 것들, 즉 가격표와 재고 페이지와 제품 사진과 결제 버튼이 모두 배제되고, 이는 모든 언어에 적용됩니다. 그래서 이 도메인에는 그 어느 것도 없습니다.",
          "남는 것은 원래부터 더 쓸모 있던 부분입니다. 어떤 서류를 챙길지, 카운터가 무엇을 물을지, 잘 보관된 병과 지친 병이 어떻게 다른지 아는 방문객은 가격을 외우고 여권 없이 온 사람보다 훨씬 나은 오후를 보냅니다.",
        ],
      },
      {
        h2: "페이지의 표시를 읽는 법",
        body: [
          "가이드의 모든 절에는 출처를 알리는 표시가 눈에 보이게 붙어 있습니다. 공식 출처는 그 문단이 공표된 고시를 다시 서술할 뿐 그 이상을 넘지 않는다는 뜻입니다. 실무상 주의는 파타야의 한 카운터에서 그것이 어떻게 보이는지에 대한 설명이라는 뜻입니다. 우리가 보는 한 정확하지만 법적 결론은 아니며 그 대체물도 아닙니다.",
          "모든 가이드에는 마지막 갱신 날짜도 보이게 적혀 있습니다. 규칙은 2025년 6월에 크게 바뀌었고, 이 주제에서 날짜 없는 페이지는 신뢰할 수 없습니다. 그것이 남의 페이지일 때도 마찬가지입니다.",
        ],
      },
      {
        h2: "이 가이드가 일부러 하지 않는 것",
        body: [
          "법률 자문을 하지 않고, 의학적 주장을 하지 않으며, 공개하지 않은 문서가 필요한 이야기를 우리 공급에 대해 하지 않습니다. 확인되지 않은 사실은 빈칸을 메우는 대신 확인되지 않았다고 적습니다.",
          "그리고 묻는 일을 대신하지도 않습니다. 낯선 서류, 이른 비행기, 오늘 선반에 대한 질문처럼 상황이 특별하다면, 메시지 한 통이 페이지를 고쳐 쓰는 것보다 빠르게 직접적인 답을 줍니다.",
        ],
      },
    ],
    faqTitle: "이 가이드에 대하여",
    faq: [
      {
        q: "이 페이지들은 얼마나 최신인가요?",
        a: "각 가이드는 페이지에 마지막 갱신 날짜를 표시합니다. 법률 가이드는 정부 고시를 직접 링크하므로 원출처를 직접 확인할 수 있습니다.",
      },
      {
        q: "이것이 법률 자문인가요?",
        a: "아닙니다. 공식 고시를 다시 서술한 문단에는 그 표시가 있고, 나머지는 실무상 주의로 표시됩니다. 카운터에서 벌어지는 일에 대한 설명이지 법적 결론이 아닙니다.",
      },
      {
        q: "왜 어디에도 가격과 메뉴가 없나요?",
        a: "관리 대상 허브의 공개 광고가 제한되고 전자적 경로를 통한 판매가 금지되어 있기 때문입니다. 지금 선반에 대한 질문은 메시지나 카운터에서 답합니다.",
      },
    ],
  },
  ja: {
    title: "パタヤ訪問者のための大麻ガイド | Labs Cannabis",
    description:
      "パタヤを訪れる人のためのガイド。公式告示が定める規則、処方箋の問題、初めての来店、そして花を自分で見極める方法。",
    h1: "パタヤ訪問者のための大麻ガイド",
    kicker: "ナレッジベース",
    lead:
      "カウンターであまりに繰り返される問いがいくつかあり、その都度答えるよりきちんと書いておくほうが早いと分かりました。これらのページは何も売りません。合わせて、法が何を言い、どの書類が要り、初回の来店がどう進み、瓶の中身をどう見極めるかを扱います。",
    itemsTitle: "ガイド一覧",
    items: [
      {
        suffix: SUFFIX.legal,
        label: "旅行者のためのタイの大麻規則",
        blurb:
          "2025年6月の告示が何を変えたのか。政府の情報源へのリンクと見える更新日つき。よそで読んだ内容がまだ有効か不安なら、ここから始めてください。",
      },
      {
        suffix: SUFFIX.prescription,
        label: "処方箋は必要か",
        blurb:
          "書類そのものについて。誰が発行するのか、母国の処方箋がなぜ引き継がれないのか、三十日という数字の意味、カウンターはその紙で何をするのか。",
      },
      {
        suffix: SUFFIX.firstVisit,
        label: "初めての来店",
        blurb:
          "誰も書かない部分。ポケットに何を入れるか、扉の前で何が起きるか、カウンターの会話はどう進むか、そのあと何をしてはいけないか。",
      },
      {
        suffix: SUFFIX.choosing,
        label: "花の選び方",
        blurb:
          "インディカとサティバは規格ではなく略語であること、試験成績書が実際に何を含むか、よく熟成した花の手触り、そして尋ねる価値のある質問。",
      },
    ],
    sections: [
      {
        h2: "このサイトがメニューではなくガイドを置く理由",
        body: [
          "タイは規制対象のハーブの公開広告を制限し、電子的な経路での販売を禁じています。そうすると大麻のサイトが普通に載せるもの、つまり価格表、在庫ページ、商品写真、決済ボタンはすべて外れます。どの言語でも外れるので、このドメインにはひとつもありません。",
          "残るのは、もともと役に立つ側の部分です。どの書類を持って行くか、カウンターが何を尋ねるか、よく保たれた瓶と疲れた瓶がどう違うかを知っている訪問者は、値段を覚えて旅券を忘れた人よりずっとよい午後を過ごします。",
        ],
      },
      {
        h2: "ページの表示の読み方",
        body: [
          "ガイドのどの節にも、出どころを示す表示が見える形で付いています。公式の情報源とは、その段落が公表された告示を言い換えているだけで、それ以上に踏み込まないという意味です。実務上の注意とは、パタヤのカウンターでそれがどう見えるかの説明という意味です。私たちに見える限りでは正確ですが、法的な結論ではなく、その代わりにもなりません。",
          "どのガイドにも最終更新日が見える形で入っています。規則は2025年6月に大きく変わり、この主題で日付のないページは信用できません。それが他人のページであっても同じです。",
        ],
      },
      {
        h2: "これらのガイドが意図的にしないこと",
        body: [
          "法的助言をせず、医学的な主張をせず、公開していない書類を要するようなことを自分たちの仕入れについて述べません。事実が確認できていないところでは、空白を埋めるのではなく確認できていないと書きます。",
          "また、尋ねることの代わりにもなりません。見慣れない書類、早朝の便、今日の棚についてなど、事情が特殊なら、メッセージのほうがページを書き直すより早く率直な答えを返します。",
        ],
      },
    ],
    faqTitle: "これらのガイドについて",
    faq: [
      {
        q: "これらのページはどれくらい新しいですか。",
        a: "各ガイドはページ上に最終更新日を表示しています。法務ガイドは政府告示を直接リンクしているので、一次情報をご自身で確認できます。",
      },
      {
        q: "これは法的助言ですか。",
        a: "いいえ。公式告示を言い換えた段落にはその表示があり、それ以外は実務上の注意と表示しています。カウンターで起きることの説明であって法的結論ではありません。",
      },
      {
        q: "なぜどこにも価格やメニューがないのですか。",
        a: "規制対象のハーブの公開広告は制限され、電子的な経路での販売は禁じられているためです。いまの棚については、メッセージかカウンターでお答えします。",
      },
    ],
  },
};
