import type { Locale } from "@/lib/i18n";

/**
 * Текст страниц `contact` и `locations`.
 *
 * До этой волны обе были самыми тонкими indexable-страницами сайта (en/contact
 * 79 слов, ru/locations 98, ar/contact 64): человек, который дошёл до страницы
 * «как нас найти», получал адрес, кнопку и ничего больше. Здесь лежат ответы на
 * то, что он на самом деле спрашивает — кто ответит, что взять, как доехать
 * из своего района и что говорить водителю.
 *
 * ЖЁСТКОЕ ПРАВИЛО: ни одного расстояния и ни одной цифры минут в этих строках.
 * Всё, что можно вычислить, вычисляется в `src/lib/geo.ts` гаверсинусом и
 * подставляется шаблоном (`LocationsCopy.routes[].slug` → `describeLandmarkWalk`).
 * Обещание «5 минут пешком» возвращается однозвёздочным отзывом.
 */

export interface CopySection {
  h2: string;
  body: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContactCopy {
  description: string;
  lead: string;
  maps: string;
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
}

/**
 * Один маршрут «откуда» → «сюда». `slug` обязан существовать в `LANDMARKS`,
 * иначе `describeLandmarkWalk` вернёт null и строка не отрисуется — это
 * сознательно: лучше не показать маршрут, чем показать выдуманный.
 */
export interface LocationRoute {
  slug: string;
  body: string;
}

export interface LocationsCopy {
  title: string;
  description: string;
  h1: string;
  bridge: string;
  lead: string;
  maps: string;
  address: string;
  phone: string;
  contact: string;
  legal: string;
  walking: string;
  routesTitle: string;
  routesIntro: string;
  routes: LocationRoute[];
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
}

export const CONTACT_COPY: Record<Locale, ContactCopy> = {
  en: {
    description:
      "One number for Labs Cannabis in Pattaya: what is on the shelf today, how to find the door on Pattaya 13 Alley, and what to bring with you.",
    lead:
      "One number for everything — ask what is on the shelf today, how to find the door, or what to bring with you. No orders and no payments are taken here; that happens at the counter.",
    maps: "Open Google Maps",
    sections: [
      {
        h2: "Who answers, and in what language",
        body: [
          "The number below is the shop, not a call centre. The person who replies is the person standing at the counter, which has one consequence worth knowing in advance: if a guest is being served, the reply comes a few minutes later rather than instantly. Write the question anyway — it will be read.",
          "Write in your own language with short sentences and you will get a straight answer rather than a template. If your question is about paperwork, say what document you already have — that alone removes most of the back and forth.",
        ],
      },
      {
        h2: "What is worth asking before you set off",
        body: [
          "What is on the shelf today, and what a particular flower actually feels like. Which of them is a sensible first choice if you have not bought in Thailand before. How to find the door on Pattaya 13 Alley, whether the counter is busy right now, and what to bring with you.",
          "The paperwork question is the one people leave too late. Tell us what you are holding — a prescription issued in Thailand, something written at home, or nothing yet — and you will hear plainly whether that is what a licensed counter can work with, before you cross the city rather than after.",
        ],
      },
      {
        h2: "What this channel is not",
        body: [
          "It is not a till. No order can be placed and no payment can be taken through this website or through a message, and this is not a policy we invented: the Thai Government notice prohibits sale through electronic channels or computer networks, and prohibits advertising through all channels. That is the same reason there is no menu and no price list published anywhere on this site.",
          "So the sequence is simple. Questions travel by message, the answer comes from a person, and the purchase itself happens at the counter, in the shop, with your documents in your hand.",
        ],
      },
      {
        h2: "The address, and what to say to a driver",
        body: [
          "The published address is 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150. That address, not the shop name, is what a taxi or a baht bus driver needs: a driver who has never heard of a particular shop knows the alley, and everyone understands a pin on a phone screen.",
          "Open the Google Maps listing before you set off and let it navigate you. The listing is named LABS DISPENSARY and carries the same address and the same phone number as this page — one door, two names, described in full on the location page.",
        ],
      },
      {
        h2: "Before you come in",
        body: [
          "Bring your passport. The age limit is 20, the check happens on every visit, and a photograph of a passport on a phone is not the same document. Bring your prescription in its original form as well.",
          "There is no dress code, no appointment and no queue system. Walk in, say what you are looking for or that you have no idea yet, and the person at the counter will work through it with you.",
        ],
      },
    ],
    faqTitle: "Questions people ask before they arrive",
    faq: [
      {
        q: "Can I place an order or pay through this website?",
        a: "No. This website does not take orders or payments, and no message channel works as a till. Purchases happen at the counter in the shop.",
      },
      {
        q: "What can I ask on WhatsApp?",
        a: "What is on the shelf today, how a particular flower behaves, how to find the door, what to bring, and anything about the paperwork. A person answers, not a bot.",
      },
      {
        q: "What do I need to bring with me?",
        a: "Your passport and your prescription, both in original form. Adults 20 and over only; the check happens on every visit.",
      },
      {
        q: "Why are there no prices anywhere on this site?",
        a: "The Thai Government notice prohibits advertising cannabis through all channels and prohibits sale through electronic channels. A published price list is exactly what that notice names, so this site does not have one.",
      },
      {
        q: "How do I find the door on Pattaya 13 Alley?",
        a: "Use the Google Maps pin rather than the shop name, and look for the LABS DISPENSARY sign. If you are already in the alley and cannot see it, send a message and someone will talk you in.",
      },
    ],
  },
  ru: {
    description:
      "Один номер Labs Cannabis в Паттайе: что сегодня на витрине, как найти вход на Pattaya 13 Alley и что взять с собой.",
    lead:
      "Один номер на всё — спросите, что сегодня на витрине, как найти вход и что взять с собой. Заказы и оплату здесь не принимают: это происходит у прилавка.",
    maps: "Открыть Google Maps",
    sections: [
      {
        h2: "Кто отвечает и на каком языке",
        body: [
          "Номер ниже — это магазин, а не колл-центр. Отвечает тот же человек, который стоит за прилавком, и отсюда следствие, о котором лучше знать заранее: если у прилавка гость, ответ придёт через несколько минут, а не мгновенно. Вопрос всё равно напишите — его прочитают.",
          "Пишите на своём языке короткими фразами — вы получите нормальный ответ, а не шаблон. Если вопрос про документы, сразу скажите, что у вас на руках: это снимает большую часть переписки.",
        ],
      },
      {
        h2: "О чём стоит спросить до выхода из отеля",
        body: [
          "Что сегодня на витрине и как конкретный сорт ощущается на практике. С чего разумно начать, если вы в Таиланде ещё не покупали. Как найти вход на Pattaya 13 Alley, много ли сейчас людей у прилавка и что взять с собой.",
          "Вопрос про документы обычно откладывают напоследок — и зря. Скажите, что именно у вас есть: рецепт, выданный в Таиланде, документ из своей страны или пока ничего. Вы услышите прямо, подходит ли это лицензированному прилавку, до того как поедете через весь город, а не после.",
        ],
      },
      {
        h2: "Чем этот канал не является",
        body: [
          "Это не касса. Через сайт и через сообщение нельзя ни разместить заказ, ни провести оплату, и это не наша выдумка: в уведомлении правительства Таиланда запрещены продажа через электронные каналы и компьютерные сети и реклама во всех каналах. По той же причине на сайте нигде нет ни меню, ни прайса.",
          "Поэтому порядок простой: вопросы идут сообщением, отвечает человек, а сама покупка происходит у прилавка, в магазине, с документами в руках.",
        ],
      },
      {
        h2: "Адрес и что сказать водителю",
        body: [
          "Опубликованный адрес: 32 Pattaya 13 Alley, Южная Паттайя, Чонбури 20150. Водителю такси или байк-такси нужен именно адрес, а не название магазина: переулок знают все, название конкретной вывески — почти никто, а пин на экране телефона понимают без слов.",
          "Перед выходом откройте карточку в Google Maps и ведите маршрут по ней. Карточка называется LABS DISPENSARY, адрес и телефон в ней те же, что на этой странице: одна дверь и два названия — подробнее об этом на странице локации.",
        ],
      },
      {
        h2: "Перед тем как зайти",
        body: [
          "Возьмите паспорт. Возрастная граница — 20 лет, проверка происходит при каждом визите, и фотография паспорта в телефоне — это не тот же документ. Рецепт тоже нужен в оригинале.",
          "Дресс-кода, записи и электронной очереди нет. Заходите, скажите, что ищете, или честно скажите, что пока не понимаете, — человек за прилавком разберёт это вместе с вами.",
        ],
      },
    ],
    faqTitle: "Что спрашивают до визита",
    faq: [
      {
        q: "Можно разместить заказ или оплатить на сайте?",
        a: "Нет. Сайт не принимает ни заказы, ни оплату, и ни один канал переписки не является кассой. Покупка происходит у прилавка в магазине.",
      },
      {
        q: "Для чего можно использовать WhatsApp?",
        a: "Спросить, что сегодня на витрине, как ведёт себя конкретный сорт, как найти вход, что взять с собой и что с документами. Отвечает человек, а не бот.",
      },
      {
        q: "Что взять с собой?",
        a: "Паспорт и рецепт, оба в оригинале. Только взрослым от 20 лет; проверка происходит при каждом визите.",
      },
      {
        q: "Почему на сайте нигде нет цен?",
        a: "Уведомление правительства Таиланда запрещает рекламу каннабиса во всех каналах и продажу через электронные каналы. Опубликованный прайс — ровно то, что там названо, поэтому его здесь нет.",
      },
      {
        q: "Как найти вход на Pattaya 13 Alley?",
        a: "Ориентируйтесь на пин в Google Maps, а не на название магазина, и ищите вывеску LABS DISPENSARY. Если вы уже в переулке и не видите её, напишите — вас доведут словами.",
      },
    ],
  },
  th: {
    description:
      "เบอร์เดียวของ Labs Cannabis ในพัทยา ถามได้ว่าวันนี้หน้าร้านมีอะไร เข้าประตูทางไหนที่ Pattaya 13 Alley และต้องเตรียมอะไรมา",
    lead:
      "เบอร์เดียวครบทุกเรื่อง ถามได้ว่าวันนี้หน้าร้านมีอะไร เข้าประตูทางไหน และต้องเตรียมอะไรมา ที่นี่ไม่รับคำสั่งซื้อและไม่รับชำระเงิน ทั้งหมดนั้นทำที่หน้าร้าน",
    maps: "เปิด Google Maps",
    sections: [
      {
        h2: "ใครเป็นคนตอบ และตอบภาษาอะไร",
        body: [
          "เบอร์ด้านล่างคือร้าน ไม่ใช่คอลเซ็นเตอร์ คนที่ตอบคือคนที่ยืนอยู่หลังเคาน์เตอร์ ดังนั้นถ้ากำลังดูแลลูกค้าอยู่ คำตอบอาจมาช้ากว่าปกติสักหน่อย แต่ข้อความจะถูกอ่านแน่นอน",
          "เขียนมาด้วยภาษาของคุณเองเป็นประโยคสั้น ๆ ได้เลย และถ้าเป็นคำถามเรื่องเอกสาร บอกไปเลยว่าตอนนี้มีอะไรอยู่ในมือ จะช่วยลดการถามไปถามมาได้มาก",
        ],
      },
      {
        h2: "ควรถามอะไรก่อนออกจากที่พัก",
        body: [
          "วันนี้หน้าร้านมีอะไร ดอกแต่ละแบบให้ความรู้สึกอย่างไร ถ้าเพิ่งซื้อครั้งแรกในไทยควรเริ่มจากอะไร เข้าประตูทางไหน ตอนนี้คนเยอะไหม และต้องเตรียมอะไรมา",
          "เรื่องเอกสารมักถูกทิ้งไว้ทีหลังสุด บอกมาว่ามีใบสั่งยาที่ออกในไทย มีเอกสารจากต่างประเทศ หรือยังไม่มีอะไรเลย แล้วคุณจะได้คำตอบตรง ๆ ก่อนจะข้ามเมืองมา",
        ],
      },
      {
        h2: "ช่องทางนี้ไม่ใช่อะไร",
        body: [
          "ไม่ใช่ช่องทางชำระเงิน ไม่มีการรับคำสั่งซื้อและไม่มีการรับเงินผ่านเว็บไซต์หรือผ่านข้อความ เพราะประกาศรัฐบาลไทยห้ามการขายผ่านช่องทางอิเล็กทรอนิกส์และห้ามโฆษณาทุกช่องทาง ด้วยเหตุผลเดียวกันนี้ เว็บนี้จึงไม่มีเมนูและไม่มีราคา",
          "ลำดับจึงง่ายมาก ถามผ่านข้อความ คนเป็นคนตอบ และการซื้อขายเกิดขึ้นที่เคาน์เตอร์พร้อมเอกสารในมือ",
        ],
      },
      {
        h2: "ที่อยู่และสิ่งที่ควรบอกคนขับ",
        body: [
          "ที่อยู่ที่เผยแพร่คือ 32 Pattaya 13 Alley พัทยาใต้ ชลบุรี 20150 สิ่งที่คนขับต้องการคือที่อยู่และหมุด ไม่ใช่ชื่อร้าน เพราะซอยนั้นทุกคนรู้จัก",
          "เปิดข้อมูลใน Google Maps ก่อนออกเดินทางแล้วให้แอปนำทาง ชื่อในแผนที่คือ LABS DISPENSARY ที่อยู่และเบอร์เดียวกับหน้านี้",
        ],
      },
    ],
    faqTitle: "คำถามก่อนมาถึงร้าน",
    faq: [
      {
        q: "สั่งหรือจ่ายเงินบนเว็บได้ไหม?",
        a: "ไม่ได้ เว็บไซต์นี้ไม่รับคำสั่งซื้อหรือการชำระเงิน และไม่มีช่องทางข้อความใดเป็นช่องทางชำระเงิน การซื้อขายเกิดขึ้นที่เคาน์เตอร์",
      },
      {
        q: "ใช้ WhatsApp เพื่ออะไรได้บ้าง?",
        a: "ถามได้ว่าวันนี้ที่ร้านมีอะไร เข้าประตูทางไหน ต้องเตรียมอะไรมา และเรื่องเอกสารต้องทำอย่างไร มีคนตอบให้",
      },
      {
        q: "ต้องเตรียมอะไรมาบ้าง?",
        a: "หนังสือเดินทางและใบสั่งยาฉบับจริง สำหรับผู้ที่อายุ 20 ปีขึ้นไปเท่านั้น และมีการตรวจทุกครั้งที่มา",
      },
      {
        q: "ทำไมเว็บนี้ไม่มีราคา?",
        a: "ประกาศรัฐบาลไทยห้ามโฆษณากัญชาทุกช่องทางและห้ามขายผ่านช่องทางอิเล็กทรอนิกส์ การประกาศราคาจึงเป็นสิ่งที่ทำไม่ได้",
      },
    ],
  },
  ar: {
    description:
      "رقم واحد لـ Labs Cannabis في باتايا: ما هو متوفر اليوم، وكيف تجد الباب في Pattaya 13 Alley، وماذا تحضر معك.",
    lead:
      "رقم واحد لكل شيء — اسأل عما هو متوفر اليوم، وكيف تجد الباب، وماذا تحضر معك. لا تُقبل هنا طلبات ولا مدفوعات؛ ذلك يتم عند الطاولة.",
    maps: "فتح Google Maps",
    sections: [
      {
        h2: "من يرد، وبأي لغة",
        body: [
          "الرقم أدناه هو المتجر نفسه وليس مركز اتصال. من يرد عليك هو الشخص الواقف خلف الطاولة، ولهذا نتيجة تستحق المعرفة مسبقا: إذا كان هناك زائر يتم خدمته، فسيصل الرد بعد دقائق لا في الحال. اكتب سؤالك على أي حال، فسوف يُقرأ.",
          "اكتب بلغتك بجمل قصيرة وستحصل على إجابة مباشرة لا على قالب جاهز. وإذا كان سؤالك عن الأوراق فاذكر ما لديك الآن، فذلك وحده يختصر معظم الأخذ والرد.",
        ],
      },
      {
        h2: "ما الذي يستحق السؤال قبل أن تتحرك",
        body: [
          "ما هو موجود اليوم، وكيف يكون إحساس نوع بعينه، وبماذا يُعقل أن تبدأ إذا لم تشترِ في تايلاند من قبل، وكيف تجد الباب في Pattaya 13 Alley، وهل الطاولة مزدحمة الآن، وماذا تحضر معك.",
          "سؤال الأوراق هو ما يؤجله الناس أكثر مما ينبغي. قل ما الذي تحمله: وصفة صادرة في تايلاند، أو وثيقة من بلدك، أو لا شيء بعد، وستسمع بوضوح ما إذا كان ذلك يصلح عند طاولة مرخصة، قبل أن تعبر المدينة لا بعدها.",
        ],
      },
      {
        h2: "ما ليست هذه القناة",
        body: [
          "ليست صندوق دفع. لا يمكن تسجيل طلب ولا استلام دفعة عبر هذا الموقع ولا عبر رسالة، وهذه ليست سياسة اخترعناها: إشعار الحكومة التايلاندية يحظر البيع عبر القنوات الإلكترونية ويحظر الإعلان بكل القنوات. وللسبب نفسه لا توجد في هذا الموقع قائمة ولا أسعار.",
          "الترتيب بسيط إذن: الأسئلة عبر الرسائل، والجواب من شخص، وعملية الشراء نفسها عند الطاولة داخل المتجر ومعك أوراقك.",
        ],
      },
      {
        h2: "العنوان وما تقوله للسائق",
        body: [
          "العنوان المنشور هو 32 Pattaya 13 Alley، جنوب باتايا، تشون بوري 20150. ما يحتاجه سائق التاكسي أو الباص المحلي هو العنوان والدبوس لا اسم المتجر، فالزقاق معروف والاسم قد لا يكون كذلك.",
          "افتح بطاقة Google Maps قبل التحرك ودع التطبيق يوجهك. اسم البطاقة LABS DISPENSARY، وفيها العنوان ورقم الهاتف نفسهما الموجودان في هذه الصفحة.",
        ],
      },
      {
        h2: "قبل أن تدخل",
        body: [
          "أحضر جواز سفرك. الحد العمري 20 عاما، والمراجعة تتم في كل زيارة، وصورة الجواز في الهاتف ليست الوثيقة نفسها. وأحضر الوصفة بصيغتها الأصلية أيضا.",
          "لا يوجد لباس محدد ولا موعد مسبق ولا نظام دور. ادخل وقل ما الذي تبحث عنه، أو قل إنك لم تقرر بعد، وسيمر معك من خلف الطاولة على الأمر خطوة خطوة. لا شيء يُحجز مسبقا، ولا شيء يُدفع في أي مكان آخر.",
        ],
      },
    ],
    faqTitle: "أسئلة قبل الوصول",
    faq: [
      {
        q: "هل يمكن الطلب أو الدفع عبر الموقع؟",
        a: "لا. هذا الموقع لا يقبل الطلبات أو المدفوعات، ولا توجد قناة رسائل تعمل كصندوق دفع. الشراء يتم عند الطاولة في المتجر.",
      },
      {
        q: "لماذا أستخدم WhatsApp؟",
        a: "اسأل عما هو موجود اليوم، وكيف تصل إلى الباب، وماذا تحضر معك، وعن الأوراق المطلوبة — يجيبك شخص.",
      },
      {
        q: "ماذا أحضر معي؟",
        a: "جواز السفر والوصفة بصيغتهما الأصلية. للبالغين 20 عاما فأكثر فقط، والمراجعة تتم في كل زيارة.",
      },
      {
        q: "لماذا لا توجد أسعار في هذا الموقع؟",
        a: "إشعار الحكومة التايلاندية يحظر الإعلان عن القنب عبر جميع القنوات ويحظر البيع عبر القنوات الإلكترونية، وقائمة الأسعار المنشورة هي بالضبط ما يسميه الإشعار.",
      },
    ],
  },
  zh: {
    description:
      "Labs Cannabis 芭提雅的一个号码：今天店里有什么、Pattaya 13 Alley 的门在哪里、需要带什么。",
    lead:
      "一个号码全搞定——问今天店里有什么、门在哪里、需要带什么。这里不接受订单与付款，这些都在柜台完成。",
    maps: "打开 Google Maps",
    sections: [
      {
        h2: "谁来回复，用什么语言",
        body: [
          "下面的号码是门店本身，不是客服中心。回复你的人就是站在柜台后面的人，因此有一点值得先知道：如果正在接待客人，回复会晚几分钟而不是秒回。问题照写就好，一定会有人读到。",
          "用你自己的语言写短句发过来就行，你会得到直接的回答而不是模板。如果问的是证件手续，请直接说明你手上现在有什么，这一句就能省掉大半来回。",
        ],
      },
      {
        h2: "出门前值得先问的事",
        body: [
          "今天架上有什么，某一款实际感受如何，第一次在泰国购买该从哪里开始，Pattaya 13 Alley 的门怎么找，此刻柜台忙不忙，以及需要带什么。",
          "证件的问题往往被拖到最后。告诉我们你手上是什么：泰国签发的处方、本国开具的文件，还是暂时什么都没有。你会在穿越半个城市之前、而不是之后，听到一个明确的答复。",
        ],
      },
      {
        h2: "这个渠道不是什么",
        body: [
          "它不是收银台。通过本网站或聊天都无法下单，也无法收款，这并不是我们自定的规矩：泰国政府通知禁止通过电子渠道销售，并禁止通过任何渠道做广告。同样的原因，本站没有菜单也没有价目表。",
          "所以顺序很简单：问题用消息发送，由人来回答，购买本身在店内柜台完成，届时请带好证件。",
        ],
      },
      {
        h2: "地址，以及该怎么告诉司机",
        body: [
          "公开地址是 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150。出租车或双条车司机需要的是地址和地图定位，而不是店名——巷子人人知道，招牌未必。",
          "出发前先打开 Google Maps 页面并按它导航。该页面名为 LABS DISPENSARY，地址与电话与本页一致。",
        ],
      },
    ],
    faqTitle: "到店前常问的问题",
    faq: [
      {
        q: "可以在网站下单或付款吗？",
        a: "不可以。本网站不接受订单或付款，任何聊天渠道也都不是收银台。购买在店内柜台完成。",
      },
      {
        q: "WhatsApp 可以用于什么？",
        a: "可以问今天店里有什么、门在哪里、需要带什么、证件手续怎么办——由店员回答。",
      },
      {
        q: "需要带什么？",
        a: "护照与处方的原件。仅限 20 岁以上成年人，每次到店都会查验。",
      },
      {
        q: "为什么本站没有价格？",
        a: "泰国政府通知禁止通过任何渠道为大麻做广告，并禁止通过电子渠道销售，公开价目表正是通知点名的内容。",
      },
    ],
  },
  ko: {
    description:
      "파타야 Labs Cannabis의 번호 하나: 오늘 무엇이 있는지, Pattaya 13 Alley 입구는 어디인지, 무엇을 가져와야 하는지.",
    lead:
      "하나의 번호로 전부 — 오늘 매장에 무엇이 있는지, 입구를 어떻게 찾는지, 무엇을 가져와야 하는지 물어보세요. 여기서는 주문과 결제를 받지 않으며 그것은 매장에서 이루어집니다.",
    maps: "Google Maps 열기",
    sections: [
      {
        h2: "누가, 어떤 언어로 답하나요",
        body: [
          "아래 번호는 콜센터가 아니라 매장입니다. 답하는 사람은 카운터에 서 있는 그 사람이며, 그래서 미리 알아 두면 좋은 점이 하나 있습니다. 손님을 응대하는 중이면 답은 즉시가 아니라 몇 분 뒤에 옵니다. 그래도 질문은 남겨 두세요. 반드시 읽습니다.",
          "자국어로 짧게 써 주시면 형식적인 문구가 아니라 실제 답을 받습니다. 서류에 관한 질문이라면 지금 무엇을 갖고 있는지 먼저 알려 주세요. 그 한 줄이 오가는 대화를 크게 줄입니다.",
        ],
      },
      {
        h2: "숙소를 나서기 전에 물어볼 것",
        body: [
          "오늘 무엇이 있는지, 특정 품종이 실제로 어떤 느낌인지, 태국에서 처음 사는 경우 무엇부터 보는 것이 합리적인지, Pattaya 13 Alley의 입구를 어떻게 찾는지, 지금 카운터가 붐비는지, 무엇을 가져와야 하는지.",
          "서류 이야기는 대개 가장 늦게 나옵니다. 태국에서 발급된 처방전인지, 본국 문서인지, 아직 아무것도 없는지 말해 주시면 도시를 가로질러 오기 전에 분명한 답을 들을 수 있습니다.",
        ],
      },
      {
        h2: "이 채널이 아닌 것",
        body: [
          "결제 창구가 아닙니다. 이 웹사이트나 메시지로는 주문을 넣을 수도, 대금을 받을 수도 없습니다. 우리가 정한 방침이 아니라 태국 정부 공지가 전자 채널을 통한 판매와 모든 채널의 광고를 금지하기 때문입니다. 같은 이유로 이 사이트에는 메뉴도 가격표도 없습니다.",
          "따라서 순서는 간단합니다. 질문은 메시지로, 답은 사람이, 구매는 서류를 들고 매장 카운터에서.",
        ],
      },
      {
        h2: "주소와 기사에게 할 말",
        body: [
          "공개 주소는 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150입니다. 택시나 썽태우 기사에게 필요한 것은 매장 이름이 아니라 주소와 지도 핀입니다. 골목은 모두가 알지만 간판 이름은 그렇지 않습니다.",
          "출발 전에 Google Maps 정보를 열고 그대로 안내를 받으세요. 이름은 LABS DISPENSARY이며 주소와 전화번호는 이 페이지와 같습니다.",
        ],
      },
    ],
    faqTitle: "도착 전에 많이 묻는 것",
    faq: [
      {
        q: "웹사이트에서 주문하거나 결제할 수 있나요?",
        a: "아니요. 이 웹사이트는 주문이나 결제를 받지 않으며, 어떤 메시지 채널도 결제 창구가 아닙니다. 구매는 매장 카운터에서 이루어집니다.",
      },
      {
        q: "WhatsApp은 어디에 사용할 수 있나요?",
        a: "오늘 매장에 무엇이 있는지, 입구를 어떻게 찾는지, 무엇을 가져와야 하는지, 서류는 어떻게 되는지 물어보세요. 사람이 답합니다.",
      },
      {
        q: "무엇을 가져가야 하나요?",
        a: "여권과 처방전 원본입니다. 20세 이상 성인만 가능하며 방문할 때마다 확인합니다.",
      },
      {
        q: "왜 사이트에 가격이 없나요?",
        a: "태국 정부 공지가 모든 채널의 대마 광고와 전자 채널을 통한 판매를 금지하기 때문입니다. 공개된 가격표가 바로 그 공지가 지목한 것입니다.",
      },
    ],
  },
  ja: {
    description:
      "パタヤのLabs Cannabis、番号は1つ。今日の品ぞろえ、Pattaya 13 Alleyの入口、持ち物を聞けます。",
    lead:
      "1番号で全部 — 今日の品ぞろえ、入口の場所、持ち物を聞いてください。ここでは注文も支払いも受け付けません。それは店頭で行います。",
    maps: "Google Mapsを開く",
    sections: [
      {
        h2: "誰が、どの言語で答えるのか",
        body: [
          "下の番号はコールセンターではなく店そのものです。返信するのはカウンターに立っている本人で、そのため先に知っておくとよいことが一つあります。接客中であれば、返事は即時ではなく数分後になります。それでも質問は送ってください。必ず読まれます。",
          "ご自分の言語で短い文にして書いていただければ、定型文ではなく実際の答えが返ります。書類の質問なら、いま手元に何があるかを最初に書いてください。それだけでやり取りの大半が省けます。",
        ],
      },
      {
        h2: "宿を出る前に聞いておくとよいこと",
        body: [
          "今日は何が棚にあるか、ある品種が実際にどう感じられるか、タイで初めて買うなら何から見るのが妥当か、Pattaya 13 Alleyの入口はどう探すか、いまカウンターは混んでいるか、そして何を持っていくか。",
          "書類の話はたいてい後回しになります。タイで発行された処方があるのか、自国の書類なのか、まだ何もないのか。それを伝えていただければ、街を横断する前に、はっきりした答えが返ります。",
        ],
      },
      {
        h2: "この窓口ではないもの",
        body: [
          "レジではありません。このサイトからもメッセージからも、注文を通すことも支払いを受け取ることもできません。これは私たちが決めた方針ではなく、タイ政府通知が電子チャネルを通じた販売と、あらゆるチャネルでの広告を禁止しているからです。同じ理由で、このサイトにはメニューも価格表もありません。",
          "順番は単純です。質問はメッセージで、答えは人から、購入は書類を持って店のカウンターで。",
        ],
      },
      {
        h2: "住所と、ドライバーへの伝え方",
        body: [
          "公開住所は 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150 です。タクシーやソンテウの運転手に必要なのは店名ではなく住所と地図のピンです。ソイは誰でも知っていますが、看板の名前はそうとは限りません。",
          "出発前に Google Maps のリスティングを開き、そのまま案内させてください。名称は LABS DISPENSARY で、住所も電話番号もこのページと同じです。",
        ],
      },
    ],
    faqTitle: "来店前によくある質問",
    faq: [
      {
        q: "サイトで注文や支払いはできますか？",
        a: "できません。このサイトは注文も支払いも受け付けず、どのメッセージ窓口もレジではありません。購入は店のカウンターで行います。",
      },
      {
        q: "WhatsAppは何に使えますか？",
        a: "今日の店内の様子、入口の場所、持ち物、書類のことなど、何でも聞いてください。人が答えます。",
      },
      {
        q: "何を持っていけばよいですか？",
        a: "パスポートと処方の原本です。20歳以上の方のみで、来店のたびに確認があります。",
      },
      {
        q: "なぜサイトに価格がないのですか？",
        a: "タイ政府通知があらゆるチャネルでの大麻の広告と、電子チャネルを通じた販売を禁止しているためです。公開された価格表は、その通知が名指ししているものそのものです。",
      },
    ],
  },
};

export const LOCATIONS_COPY: Record<Locale, LocationsCopy> = {
  en: {
    title: "Labs Cannabis location in Pattaya | Maps and address",
    description:
      "Where LABS DISPENSARY stands on Pattaya 13 Alley, how far it is from Walking Street and Jomtien, and what to tell a driver.",
    h1: "Labs Cannabis location in Pattaya",
    bridge: "Listed on Google Maps as LABS DISPENSARY",
    lead:
      "Use the live Maps listing for the current pin and route. Below: how far the door is from the places people navigate by, what to say to a driver, and what happens when you walk in.",
    maps: "Open Google Maps",
    address: "Published address",
    phone: "Phone",
    contact: "Contact and visit coordination",
    legal: "Current rules for tourists",
    walking: "Directions from Walking Street",
    routesTitle: "How far it is from where you are",
    routesIntro:
      "Every distance below is a straight line measured from the shop pin to the landmark, and every walking time is that distance at an unhurried pace with a detour allowance — calculated, not promised. Pattaya sois are not a grid, so treat the higher number as the honest one.",
    routes: [
      {
        slug: "walking-street",
        body:
          "The most common starting point. From the north end of Walking Street the walk is along the south end of the bay and then inland to Pattaya 13 Alley — flat the whole way, busy in the evening, and comfortably walkable if you are not carrying shopping. In the middle of the day, when the pavement is hot and there is no shade to speak of, most people take a baht bus for the first half and walk the rest.",
      },
      {
        slug: "beach-road",
        body:
          "If you are staying on the beachfront in South Pattaya, this is your reference. The walk turns away from the water and inland; once you leave Beach Road the noise drops quickly, which is the main way you know you are going the right way.",
      },
      {
        slug: "central-festival",
        body:
          "The Central Pattaya shopping anchor, and the point most visitors staying mid-city measure from. It is walkable in the cooler part of the day and an easy baht bus ride the rest of the time: the fixed route down Second Road drops you within a few blocks.",
      },
      {
        slug: "big-buddha",
        body:
          "For Pratumnak Hill, this is the landmark to measure from. The hill road is the part that makes it feel longer than the number suggests — it is a climb on the way back, which is why most people take a motorbike taxi in that direction.",
      },
      {
        slug: "jomtien-beach",
        body:
          "Too far to walk, and nobody does. From Jomtien it is a baht bus over the hill or a taxi, and the drop-off is easier if you name Pattaya 13 Alley rather than the shop.",
      },
      {
        slug: "wong-amat-beach",
        body:
          "The far end of Naklua, and the longest of these trips. It crosses the whole city, so plan it as a journey rather than an errand and check the pin before you set off.",
      },
    ],
    sections: [
      {
        h2: "The door you are looking for",
        body: [
          "The published address is 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150, and the sign above the door reads LABS DISPENSARY. The alley is a side street rather than a main road, which is good news once you are in it — it is short, and the shop is not hidden — and less good news from a hundred metres away, where the main road gives you no view of it at all.",
          "So navigate to the pin, not to the name. The Google Maps listing is the source of truth for the current location, and the pin is what a phone-based route follows to the correct end of the alley.",
        ],
      },
      {
        h2: "What to say to a taxi or baht bus driver",
        body: [
          "Say Pattaya 13 Alley. Do not lead with the shop name: there are several hundred cannabis shops in this city and no driver knows them all, while every driver knows the numbered sois. If there is any doubt, show the pin on your phone — that ends the conversation faster than any pronunciation.",
          "Coming from the north on Second Road, a baht bus on the fixed route will take you most of the way for the standard fare; tell the driver the alley and press the buzzer at the corner. From further out, a booked car with the pin loaded is simpler, especially in the evening.",
        ],
      },
      {
        h2: "Two names, one door",
        body: [
          "This site uses the name Labs Cannabis. The Google Maps listing for the same address and the same phone number is titled LABS DISPENSARY. It is one business and one door, and the reason to spell that out is practical: Pattaya has several shops with similar names, and a visitor who searches the name alone can easily end up standing outside somebody else's counter.",
          "The address on this page, the address in the listing and the address on the door are the same string. If anything you find online shows a different street for us, the pin and this page are the ones to trust.",
        ],
      },
      {
        h2: "What happens when you arrive",
        body: [
          "You walk in, and the first thing that happens is the check: age 20 and over, passport in original form, and the prescription. It happens every visit, and it is not personal — it is what a licensed shop is required to do.",
          "After that it is a conversation at the counter. Say what you are looking for, or say that you do not know yet and describe what you want out of the evening; the jar is opened in front of you, and there is no rule against taking your time. Nothing is ordered in advance, and nothing is paid for anywhere except here.",
        ],
      },
    ],
    faqTitle: "Getting here: common questions",
    faq: [
      {
        q: "How far is the shop from Walking Street?",
        a: "{walkingStreet}. That is a straight line from the shop pin at an unhurried pace, and it takes longer if you follow the sois rather than the map line.",
      },
      {
        q: "What should I tell a taxi driver?",
        a: "Pattaya 13 Alley, and show the Google Maps pin. Drivers know the numbered sois; they do not know individual shop names, and there are several hundred shops in the city.",
      },
      {
        q: "Can I get here from Jomtien on foot?",
        a: "No. {jomtien}, and the route crosses the hill. Take a baht bus or a taxi and give the alley as the destination.",
      },
      {
        q: "Why does Google Maps say LABS DISPENSARY and the site say Labs Cannabis?",
        a: "Same business, same address, same phone number, two names in use. The listing is titled LABS DISPENSARY; this site uses Labs Cannabis. Navigate by the pin to avoid the similarly named shops nearby.",
      },
      {
        q: "Do I need to arrange the visit in advance?",
        a: "No. There is no booking and no queue system, and nothing can be ordered or paid for through this site. Walk in with your passport and prescription.",
      },
    ],
  },
  ru: {
    title: "Локация Labs Cannabis в Паттайе | Maps и адрес",
    description:
      "Где стоит LABS DISPENSARY на Pattaya 13 Alley, сколько идти от Walking Street и Джомтьена и что сказать водителю.",
    h1: "Локация Labs Cannabis в Паттайе",
    bridge: "В Google Maps указано название LABS DISPENSARY",
    lead:
      "Текущий пин и маршрут смотрите в живой карточке Maps. Ниже — сколько до двери от мест, по которым в Паттайе ориентируются, что сказать водителю и как проходит визит.",
    maps: "Открыть Google Maps",
    address: "Опубликованный адрес",
    phone: "Телефон",
    contact: "Контакты и координация визита",
    legal: "Актуальные правила для туристов",
    walking: "Маршрут от Walking Street",
    routesTitle: "Сколько до нас от вашего района",
    routesIntro:
      "Каждое расстояние ниже — прямая линия от пина магазина до ориентира, а время — это же расстояние спокойным шагом с запасом на повороты. Всё вычислено, а не обещано: переулки Паттайи не сетка, поэтому верить стоит большему числу из диапазона.",
    routes: [
      {
        slug: "walking-street",
        body:
          "Самая частая точка старта. От северного входа дорога идёт вдоль южного конца залива, а потом сворачивает вглубь, к Pattaya 13 Alley. Рельефа нет, вечером людно, с пустыми руками доходится спокойно. Днём, когда асфальт раскалён и тени практически нет, половину пути обычно проезжают на сонгтео, а остальное идут пешком.",
      },
      {
        slug: "beach-road",
        body:
          "Ориентир для тех, кто живёт на первой линии в Южной Паттайе. Маршрут уводит от воды вглубь квартала: как только вы уходите с Beach Road, шум резко падает — это и есть главный признак, что вы свернули правильно.",
      },
      {
        slug: "central-festival",
        body:
          "Торговый ориентир Центральной Паттайи и точка отсчёта для тех, кто живёт в середине города. В прохладное время суток доходится пешком, в остальное — сонгтео по Second Road довозит почти до места.",
      },
      {
        slug: "big-buddha",
        body:
          "Ориентир для Пратамнака. Цифра выглядит скромно, а дорога кажется длиннее из-за подъёма на холм на обратном пути — поэтому в ту сторону чаще берут байк-такси.",
      },
      {
        slug: "jomtien-beach",
        body:
          "Пешком не ходят: слишком далеко и через холм. Из Джомтьена это сонгтео или машина, и высадка проще, если назвать Pattaya 13 Alley, а не магазин.",
      },
      {
        slug: "wong-amat-beach",
        body:
          "Дальний конец Наклуа и самая длинная из этих поездок: она пересекает весь город. Планируйте её как поездку, а не как «заскочить по пути», и сверьтесь с пином перед выходом.",
      },
    ],
    sections: [
      {
        h2: "Какую дверь вы ищете",
        body: [
          "Опубликованный адрес: 32 Pattaya 13 Alley, Южная Паттайя, Чонбури 20150, на вывеске написано LABS DISPENSARY. Переулок — не главная дорога, и в этом есть плюс и минус. Плюс: он короткий, и внутри магазин не спрятан. Минус: с большой дороги переулок не просматривается вовсе.",
          "Поэтому ведите маршрут на пин, а не на название. Карточка Google Maps — источник правды по текущему положению точки, и именно пин выводит навигатор к нужному концу переулка.",
        ],
      },
      {
        h2: "Что сказать водителю такси или сонгтео",
        body: [
          "Говорите «Pattaya 13 Alley». Не начинайте с названия магазина: в городе несколько сотен каннабис-шопов, и ни один водитель не знает их все, а нумерованные сои знают все. Если возникает пауза — покажите пин на телефоне: это заканчивает разговор быстрее любого произношения.",
          "С севера по Second Road сонгтео по маршруту довезёт почти до места за обычный проезд: назовите переулок и нажмите кнопку на углу. Издалека проще заказать машину с загруженным пином, особенно вечером.",
        ],
      },
      {
        h2: "Два названия, одна дверь",
        body: [
          "Сайт использует имя Labs Cannabis. Карточка Google Maps с тем же адресом и тем же телефоном называется LABS DISPENSARY. Это один бизнес и одна дверь, и проговорить это стоит по практической причине: в Паттайе есть магазины с похожими названиями, и человек, который ищет по одному имени, легко оказывается у чужого прилавка.",
          "Адрес на этой странице, адрес в карточке и адрес на двери — одна и та же строка, и это сделано намеренно. Если где-то в интернете нам приписана другая улица, доверять стоит пину и этой странице.",
        ],
      },
      {
        h2: "Как проходит визит",
        body: [
          "Вы заходите, и первое, что происходит, — проверка: 20+, паспорт в оригинале и рецепт. Она бывает при каждом визите и не имеет отношения лично к вам: так работает лицензированный магазин.",
          "Дальше — разговор у прилавка. Скажите, что ищете, или честно скажите, что пока не знаете, и опишите, каким хотите видеть вечер. Банку открывают при вас, торопиться никто не заставляет. Ничего не заказывается заранее и нигде, кроме прилавка, не оплачивается.",
        ],
      },
    ],
    faqTitle: "Как добраться: частые вопросы",
    faq: [
      {
        q: "Сколько от Walking Street до магазина?",
        a: "{walkingStreet}. Это прямая от пина магазина спокойным шагом; переулками получается дольше, чем по линии на карте.",
      },
      {
        q: "Что сказать водителю такси?",
        a: "«Pattaya 13 Alley» и показать пин в Google Maps. Нумерованные сои знают все водители, названия отдельных магазинов — никто: их в городе несколько сотен.",
      },
      {
        q: "Можно дойти пешком из Джомтьена?",
        a: "Нет. {jomtien}, и дорога идёт через холм. Берите сонгтео или машину и называйте переулок.",
      },
      {
        q: "Почему в Google Maps LABS DISPENSARY, а на сайте Labs Cannabis?",
        a: "Один бизнес, один адрес, один телефон и два используемых названия. Карточка называется LABS DISPENSARY, сайт — Labs Cannabis. Ведите маршрут по пину, чтобы не попасть в магазин с похожим именем.",
      },
      {
        q: "Нужно ли договариваться о визите заранее?",
        a: "Нет. Ни записи, ни электронной очереди нет, а заказать или оплатить что-либо через сайт нельзя. Приходите с паспортом и рецептом.",
      },
    ],
  },
  th: {
    title: "ที่ตั้ง Labs Cannabis ในพัทยา | Maps และที่อยู่",
    description:
      "ร้าน LABS DISPENSARY อยู่ตรงไหนบนซอยพัทยา 13 ห่างจาก Walking Street และจอมเทียนเท่าไร และควรบอกคนขับว่าอย่างไร",
    h1: "ที่ตั้ง Labs Cannabis ในพัทยา",
    bridge: "แสดงใน Google Maps ในชื่อ LABS DISPENSARY",
    lead:
      "ใช้ Maps สำหรับหมุดและเส้นทางปัจจุบัน ด้านล่างคือระยะจากจุดที่คนใช้อ้างอิงกันในพัทยา สิ่งที่ควรบอกคนขับ และขั้นตอนเมื่อมาถึงหน้าร้าน",
    maps: "เปิด Google Maps",
    address: "ที่อยู่ที่เผยแพร่",
    phone: "โทรศัพท์",
    contact: "ติดต่อและประสานการมาเยือน",
    legal: "กฎปัจจุบันสำหรับนักท่องเที่ยว",
    walking: "เส้นทางจาก Walking Street",
    routesTitle: "ระยะทางจากจุดอ้างอิงต่าง ๆ",
    routesIntro:
      "ระยะทางทุกค่าคำนวณเป็นเส้นตรงจากหมุดของร้านไปยังจุดอ้างอิง และเวลาเดินคำนวณจากระยะนั้นด้วยความเร็วเดินสบาย ๆ พร้อมเผื่อการอ้อม ซอยในพัทยาไม่ใช่ตารางสี่เหลี่ยม จึงควรยึดตัวเลขที่มากกว่าไว้ก่อน",
    routes: [
      {
        slug: "walking-street",
        body:
          "จุดตั้งต้นที่พบบ่อยที่สุด จากปลายด้านเหนือของ Walking Street เส้นทางเลียบอ่าวแล้วเลี้ยวเข้าด้านในไปยังซอยพัทยา 13 ทางราบตลอด ตอนกลางวันแดดแรงและแทบไม่มีร่ม คนส่วนใหญ่จึงนั่งสองแถวครึ่งทางแล้วเดินต่อ",
      },
      {
        slug: "beach-road",
        body:
          "จุดอ้างอิงสำหรับผู้ที่พักติดชายหาดฝั่งพัทยาใต้ เส้นทางออกจากทะเลเข้าด้านใน พอพ้นถนนเลียบหาดเสียงจะเบาลงทันที นั่นคือสัญญาณว่ามาถูกทาง",
      },
      {
        slug: "central-festival",
        body:
          "หมุดหมายฝั่งพัทยากลางสำหรับคนที่พักกลางเมือง ช่วงที่อากาศไม่ร้อนเดินได้ นอกนั้นนั่งสองแถวสายถนนเลียบชายหาดหรือถนนสายสองมาลงใกล้ ๆ",
      },
      {
        slug: "big-buddha",
        body:
          "จุดอ้างอิงของเขาพระตำหนัก ตัวเลขดูไม่ไกล แต่ขากลับเป็นทางขึ้นเนิน หลายคนจึงเลือกวินมอเตอร์ไซค์ในทิศทางนั้น",
      },
      {
        slug: "jomtien-beach",
        body:
          "ไกลเกินกว่าจะเดิน จากจอมเทียนใช้สองแถวข้ามเขาหรือรถยนต์ และควรบอกปลายทางเป็นซอยพัทยา 13 แทนชื่อร้าน",
      },
      {
        slug: "wong-amat-beach",
        body:
          "ปลายด้านนาเกลือ เป็นเส้นทางที่ยาวที่สุดในรายการนี้เพราะข้ามทั้งเมือง ควรวางแผนเป็นการเดินทางหนึ่งรอบและเช็กหมุดก่อนออก",
      },
    ],
    sections: [
      {
        h2: "ประตูที่คุณกำลังมองหา",
        body: [
          "ที่อยู่ที่เผยแพร่คือ 32 Pattaya 13 Alley พัทยาใต้ ชลบุรี 20150 และป้ายหน้าร้านเขียนว่า LABS DISPENSARY ซอยนี้เป็นซอยเล็ก ไม่ใช่ถนนใหญ่ ข้อดีคือเมื่อเข้ามาแล้วหาไม่ยาก ข้อเสียคือมองจากถนนใหญ่จะไม่เห็นอะไรเลย",
          "ให้นำทางไปที่หมุด ไม่ใช่ชื่อร้าน ข้อมูลใน Google Maps คือแหล่งอ้างอิงของตำแหน่งปัจจุบัน และหมุดจะพาไปยังปลายซอยที่ถูกต้อง",
        ],
      },
      {
        h2: "บอกคนขับอย่างไร",
        body: [
          "บอกว่า ซอยพัทยา 13 อย่าเริ่มด้วยชื่อร้าน เพราะร้านกัญชาในเมืองนี้มีหลายร้อยแห่งและไม่มีคนขับคนไหนจำได้ทั้งหมด แต่ซอยที่มีหมายเลขนั้นทุกคนรู้จัก ถ้าไม่แน่ใจให้เปิดหมุดในโทรศัพท์ให้ดู",
          "ถ้ามาจากทางเหนือ สองแถวสายประจำจะพามาได้เกือบถึง บอกชื่อซอยแล้วกดกริ่งที่หัวมุม ถ้ามาจากไกลกว่านั้น เรียกรถโดยปักหมุดไว้ล่วงหน้าจะง่ายกว่า โดยเฉพาะช่วงค่ำ",
        ],
      },
      {
        h2: "สองชื่อ ประตูเดียว",
        body: [
          "เว็บไซต์ใช้ชื่อ Labs Cannabis ส่วนข้อมูลใน Google Maps ที่มีที่อยู่และเบอร์เดียวกันใช้ชื่อ LABS DISPENSARY เป็นธุรกิจเดียวและประตูเดียว ที่ต้องบอกให้ชัดเพราะในพัทยามีร้านชื่อคล้ายกันหลายร้าน",
          "ที่อยู่บนหน้านี้ ในแผนที่ และบนป้ายหน้าร้าน เป็นข้อความเดียวกันโดยตั้งใจ หากที่อื่นระบุถนนอื่นให้ยึดหมุดและหน้านี้เป็นหลัก",
        ],
      },
      {
        h2: "เมื่อมาถึงหน้าร้าน",
        body: [
          "สิ่งแรกที่เกิดขึ้นคือการตรวจ อายุ 20 ปีขึ้นไป หนังสือเดินทางตัวจริง และใบสั่งยา ตรวจทุกครั้งที่มา และไม่ได้เจาะจงที่ตัวคุณ แต่เป็นสิ่งที่ร้านมีใบอนุญาตต้องทำ",
          "จากนั้นคือการพูดคุยที่เคาน์เตอร์ บอกว่ากำลังหาอะไร หรือบอกตรง ๆ ว่ายังไม่รู้ก็ได้ โหลจะถูกเปิดต่อหน้าคุณ ไม่มีการสั่งล่วงหน้าและไม่มีการชำระเงินที่อื่นนอกจากที่เคาน์เตอร์",
        ],
      },
    ],
    faqTitle: "การเดินทาง: คำถามที่พบบ่อย",
    faq: [
      {
        q: "ร้านห่างจาก Walking Street แค่ไหน?",
        a: "{walkingStreet} ค่านี้เป็นเส้นตรงจากหมุดของร้านด้วยความเร็วเดินสบาย ๆ และจะนานกว่านี้ถ้าเดินตามซอยจริง",
      },
      {
        q: "ควรบอกคนขับว่าอย่างไร?",
        a: "บอกว่าซอยพัทยา 13 และเปิดหมุดใน Google Maps ให้ดู คนขับรู้จักซอยที่มีหมายเลข แต่ไม่รู้จักชื่อร้านทีละร้าน",
      },
      {
        q: "เดินจากจอมเทียนได้ไหม?",
        a: "ไม่ได้ {jomtien} และต้องข้ามเขา ใช้สองแถวหรือรถยนต์และบอกชื่อซอยเป็นปลายทาง",
      },
      {
        q: "ทำไม Google Maps เขียนว่า LABS DISPENSARY แต่เว็บใช้ชื่อ Labs Cannabis?",
        a: "ธุรกิจเดียวกัน ที่อยู่และเบอร์เดียวกัน แต่ใช้สองชื่อ ให้นำทางด้วยหมุดเพื่อไม่ให้ไปผิดร้านที่ชื่อคล้ายกัน",
      },
    ],
  },
  ar: {
    title: "موقع Labs Cannabis في باتايا | Maps والعنوان",
    description:
      "أين يقع LABS DISPENSARY في Pattaya 13 Alley، وكم يبعد عن Walking Street وجومتين، وماذا تقول للسائق.",
    h1: "موقع Labs Cannabis في باتايا",
    bridge: "مدرج على Google Maps باسم LABS DISPENSARY",
    lead:
      "استخدم بطاقة Maps للدبوس والمسار الحاليين. في الأسفل: كم يبعد الباب عن المعالم التي يستدل بها الناس، وماذا تقول للسائق، وكيف تجري الزيارة.",
    maps: "افتح Google Maps",
    address: "العنوان المنشور",
    phone: "الهاتف",
    contact: "الاتصال وتنسيق الزيارة",
    legal: "القواعد الحالية للسياح",
    walking: "الاتجاهات من Walking Street",
    routesTitle: "كم يبعد المكان عن نقطتك",
    routesIntro:
      "كل مسافة أدناه خط مستقيم محسوب من دبوس المتجر إلى المعلم، وكل زمن مشي هو تلك المسافة بخطى غير مستعجلة مع هامش للالتفاف. أزقة باتايا ليست شبكة منتظمة، لذا اعتبر الرقم الأكبر هو الرقم الصادق.",
    routes: [
      {
        slug: "walking-street",
        body:
          "نقطة البداية الأكثر شيوعا. من الطرف الشمالي يسير الطريق بمحاذاة الطرف الجنوبي للخليج ثم ينعطف إلى الداخل نحو Pattaya 13 Alley. الأرض مستوية طوال الطريق، والمساء مزدحم، وفي منتصف النهار يفضل كثيرون ركوب الباص المحلي نصف المسافة ثم المشي.",
      },
      {
        slug: "beach-road",
        body:
          "المرجع لمن يقيم على الواجهة البحرية في جنوب باتايا. يبتعد المسار عن الماء نحو الداخل، وبمجرد مغادرة شارع الشاطئ ينخفض الضجيج بسرعة، وهذه أوضح علامة أنك في الاتجاه الصحيح.",
      },
      {
        slug: "central-festival",
        body:
          "معلم التسوق في وسط باتايا ونقطة القياس لمن يقيم في منتصف المدينة. يمكن المشي في الأوقات الأقل حرارة، وفي غير ذلك يوصلك الباص المحلي إلى مسافة قريبة.",
      },
      {
        slug: "big-buddha",
        body:
          "المعلم الذي يقاس منه لمنطقة براتومناك. الرقم يبدو قصيرا لكن طريق التل صعود في العودة، ولهذا يفضل كثيرون دراجة أجرة في ذلك الاتجاه.",
      },
      {
        slug: "jomtien-beach",
        body:
          "أبعد من أن تمشى. من جومتين تحتاج باصا محليا فوق التل أو سيارة، ويسهل النزول إذا ذكرت اسم الزقاق بدل اسم المتجر.",
      },
      {
        slug: "wong-amat-beach",
        body:
          "الطرف البعيد من ناكلوا وأطول هذه الرحلات لأنها تقطع المدينة كلها. خطط لها كرحلة قائمة بذاتها وتحقق من الدبوس قبل التحرك.",
      },
    ],
    sections: [
      {
        h2: "الباب الذي تبحث عنه",
        body: [
          "العنوان المنشور هو 32 Pattaya 13 Alley، جنوب باتايا، تشون بوري 20150، واللافتة فوق الباب تقول LABS DISPENSARY. الزقاق شارع جانبي لا طريق رئيسي، وهذه ميزة بعد دخوله لأنه قصير والمتجر غير مخفي، وعيب من على بعد مئة متر حيث لا يظهر منه شيء من الطريق الرئيسي.",
          "لذلك وجّه الملاحة إلى الدبوس لا إلى الاسم. بطاقة Google Maps هي المرجع للموقع الحالي، والدبوس هو ما يقود التطبيق إلى الطرف الصحيح من الزقاق.",
        ],
      },
      {
        h2: "ماذا تقول لسائق التاكسي أو الباص المحلي",
        body: [
          "قل Pattaya 13 Alley ولا تبدأ باسم المتجر: في المدينة مئات المتاجر ولا سائق يعرفها كلها، بينما يعرف الجميع الأزقة المرقمة. وعند أي التباس اعرض الدبوس على شاشة هاتفك، فذلك ينهي النقاش أسرع من أي نطق.",
          "قادما من الشمال، يوصلك الباص المحلي على خطه الثابت إلى معظم الطريق بأجرته المعتادة؛ اذكر الزقاق واضغط الجرس عند الزاوية. ومن أبعد من ذلك، سيارة محجوزة مع الدبوس أسهل، خاصة في المساء.",
        ],
      },
      {
        h2: "اسمان وباب واحد",
        body: [
          "يستخدم هذا الموقع اسم Labs Cannabis، بينما تحمل بطاقة Google Maps للعنوان ورقم الهاتف نفسيهما اسم LABS DISPENSARY. إنه عمل واحد وباب واحد، والسبب في توضيح ذلك عملي: في باتايا متاجر بأسماء متشابهة، ومن يبحث بالاسم وحده قد يجد نفسه أمام طاولة شخص آخر.",
          "العنوان في هذه الصفحة وفي البطاقة وعلى الباب هو النص نفسه، وذلك مقصود. وإذا وجدت في مكان ما شارعا آخر منسوبا إلينا فالدبوس وهذه الصفحة هما المرجع.",
        ],
      },
      {
        h2: "ماذا يحدث عند الوصول",
        body: [
          "أول ما يحدث هو المراجعة: العمر 20 عاما فأكثر، وجواز السفر الأصلي، والوصفة. تتم في كل زيارة وليست موجهة إليك شخصيا، بل هي ما يلزم المتجر المرخص فعله.",
          "بعد ذلك حديث عند الطاولة. قل ما الذي تبحث عنه، أو قل إنك لا تعرف بعد. يُفتح الوعاء أمامك ولا أحد يستعجلك. لا شيء يُطلب مسبقا ولا يُدفع في أي مكان آخر.",
        ],
      },
    ],
    faqTitle: "الوصول إلينا: أسئلة شائعة",
    faq: [
      {
        q: "كم يبعد المتجر عن Walking Street؟",
        a: "{walkingStreet}. القيمة خط مستقيم من دبوس المتجر بخطى هادئة، وتزيد إن سلكت الأزقة بدل خط الخريطة.",
      },
      {
        q: "ماذا أقول لسائق التاكسي؟",
        a: "Pattaya 13 Alley مع عرض الدبوس على الخريطة. السائقون يعرفون الأزقة المرقمة ولا يعرفون أسماء المتاجر فرادى.",
      },
      {
        q: "هل يمكن الوصول من جومتين مشيا؟",
        a: "لا. {jomtien}، والطريق خلف التل. استخدم باصا محليا أو سيارة واذكر الزقاق كوجهة.",
      },
      {
        q: "لماذا تكتب الخريطة LABS DISPENSARY بينما يستخدم الموقع Labs Cannabis؟",
        a: "العمل نفسه والعنوان نفسه والهاتف نفسه باسمين مستخدمين. وجّه ملاحتك بالدبوس لتجنب المتاجر ذات الأسماء المتشابهة.",
      },
    ],
  },
  zh: {
    title: "Labs Cannabis 芭提雅位置 | Maps 与地址",
    description:
      "LABS DISPENSARY 在 Pattaya 13 Alley 的具体位置、距 Walking Street 与乔木提恩多远，以及该怎么告诉司机。",
    h1: "Labs Cannabis 在芭提雅的位置",
    bridge: "Google Maps 当前显示为 LABS DISPENSARY",
    lead:
      "请使用实时 Maps 页面查看当前定位和路线。下面是门店距离各常用地标有多远、该怎么告诉司机，以及到店后的流程。",
    maps: "打开 Google Maps",
    address: "公开地址",
    phone: "电话",
    contact: "联系与到店协调",
    legal: "游客当前规则",
    walking: "从 Walking Street 前往",
    routesTitle: "从你所在的位置有多远",
    routesIntro:
      "下面每一个距离，都是从门店定位到地标的直线距离；步行时间则按不赶路的步速并留出绕行余量计算——是算出来的，不是承诺。芭提雅的巷子不是棋盘格，所以请以区间中较大的数字为准。",
    routes: [
      {
        slug: "walking-street",
        body:
          "最常见的出发点。从北入口沿着海湾南端走，再折向内侧进入 Pattaya 13 Alley，全程平路，傍晚人多。正午路面很晒且几乎没有遮荫，多数人会先坐一段双条车再步行。",
      },
      {
        slug: "beach-road",
        body:
          "住在南芭提雅海滨的人以此为参照。路线从海边折向内侧，一离开海滩路噪音立刻降下来，这就是走对方向最明显的信号。",
      },
      {
        slug: "central-festival",
        body:
          "芭提雅中部的购物地标，也是住在市中心的人常用的量度点。凉快时段可以步行，其余时间坐双条车沿二路过来即可。",
      },
      {
        slug: "big-buddha",
        body:
          "帕塔南山一带的参照点。数字看着不远，但回程要上坡，所以往那个方向的人多半会叫摩的。",
      },
      {
        slug: "jomtien-beach",
        body:
          "太远，没人步行。从乔木提恩要坐双条车翻过山或者打车，报巷名比报店名更容易下车。",
      },
      {
        slug: "wong-amat-beach",
        body:
          "那库阿最远的一端，也是这里最长的一段路，等于横穿整座城市。请当成一次出行来安排，出发前先核对定位。",
      },
    ],
    sections: [
      {
        h2: "你要找的那扇门",
        body: [
          "公开地址是 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150，门上的招牌写着 LABS DISPENSARY。这是一条支巷而不是主路：好消息是巷子很短，进来之后并不难找；坏消息是从大路上完全看不到。",
          "所以请导航到定位而不是店名。Google Maps 页面是当前位置的依据，手机导航会按定位把你带到巷子正确的一端。",
        ],
      },
      {
        h2: "该怎么告诉出租车或双条车司机",
        body: [
          "就说 Pattaya 13 Alley，不要先报店名：这座城市有几百家大麻门店，没有司机记得住，但编号的巷子人人知道。如果对方犹豫，把手机上的定位给他看，比任何发音都管用。",
          "从北边沿二路过来，固定线路的双条车按常规车资就能到附近；报巷名并在路口按铃即可。距离更远时，直接叫车并预先设好定位更省事，傍晚尤其如此。",
        ],
      },
      {
        h2: "两个名字，同一扇门",
        body: [
          "本站使用 Labs Cannabis 这个名称，而同一地址、同一电话的 Google Maps 页面标题是 LABS DISPENSARY。这是同一家店、同一扇门。之所以要讲清楚，理由很实际：芭提雅有名字相近的店，只按名字搜索的人很容易站到别人门口。",
          "本页的地址、地图页面的地址和门上的地址是同一串文字，这是有意为之。如果你在别处看到我们被写成另一条街，请以定位和本页为准。",
        ],
      },
      {
        h2: "到店后的流程",
        body: [
          "进门之后第一件事是查验：年满 20 岁、护照原件、处方。每次到店都会做，不针对任何人——持牌门店必须这样做。",
          "接下来是在柜台的交谈。说出你想找什么，或者直说还没想好。罐子会当着你的面打开，也没有人催你。任何东西都不需要提前订，除了柜台之外也不在别处付款。",
        ],
      },
    ],
    faqTitle: "到店路线常见问题",
    faq: [
      {
        q: "门店离 Walking Street 有多远？",
        a: "{walkingStreet}。这是从门店定位算起的直线距离与不赶路的步速，沿巷子走会更久。",
      },
      {
        q: "该怎么告诉出租车司机？",
        a: "说 Pattaya 13 Alley，并出示 Google Maps 定位。司机认得编号的巷子，但记不住单个店名。",
      },
      {
        q: "可以从乔木提恩步行过来吗？",
        a: "不行。{jomtien}，而且隔着一座山。请坐双条车或打车，并以巷名为目的地。",
      },
      {
        q: "为什么地图显示 LABS DISPENSARY，网站却写 Labs Cannabis？",
        a: "同一家店、同一地址、同一电话，两个在用的名称。请按定位导航，以免走进名字相近的其他门店。",
      },
    ],
  },
  ko: {
    title: "파타야 Labs Cannabis 위치 | Maps와 주소",
    description:
      "LABS DISPENSARY가 Pattaya 13 Alley 어디에 있는지, Walking Street와 좀티엔에서 얼마나 먼지, 기사에게 뭐라고 말할지.",
    h1: "파타야 Labs Cannabis 위치",
    bridge: "Google Maps에는 LABS DISPENSARY로 표시됩니다",
    lead:
      "현재 핀과 경로는 실시간 Maps 정보를 사용하세요. 아래에는 사람들이 기준으로 삼는 지점에서 문까지의 거리, 기사에게 할 말, 방문 절차가 있습니다.",
    maps: "Google Maps 열기",
    address: "공개 주소",
    phone: "전화",
    contact: "연락 및 방문 조율",
    legal: "관광객을 위한 현재 규정",
    walking: "Walking Street에서 오는 길",
    routesTitle: "지금 계신 곳에서 얼마나 먼가요",
    routesIntro:
      "아래 거리는 모두 매장 핀에서 지점까지의 직선거리이고, 도보 시간은 그 거리를 서두르지 않는 속도로 걷고 우회 여유를 더해 계산한 값입니다. 약속이 아니라 계산입니다. 파타야 골목은 격자가 아니므로 범위 중 큰 쪽을 기준으로 보세요.",
    routes: [
      {
        slug: "walking-street",
        body:
          "가장 흔한 출발점입니다. 북쪽 입구에서 만 남쪽 끝을 따라가다 안쪽으로 꺾어 Pattaya 13 Alley로 들어옵니다. 내내 평지이고 저녁에는 붐빕니다. 한낮에는 그늘이 거의 없어 절반은 썽태우로 이동하고 나머지를 걷는 경우가 많습니다.",
      },
      {
        slug: "beach-road",
        body:
          "남파타야 해변가에 묵는 분들의 기준점입니다. 경로는 바다에서 안쪽으로 들어가며, 비치로드를 벗어나는 순간 소음이 확 줄어드는 것이 방향이 맞다는 가장 확실한 신호입니다.",
      },
      {
        slug: "central-festival",
        body:
          "파타야 중심의 쇼핑 기준점이자 도심에 묵는 분들이 거리를 재는 지점입니다. 선선한 시간대에는 걸을 만하고, 그 외에는 세컨드로드를 지나는 썽태우로 가까이까지 옵니다.",
      },
      {
        slug: "big-buddha",
        body:
          "프라탐낙 지역의 기준점입니다. 숫자는 짧아 보여도 돌아가는 길이 언덕 오르막이라 그 방향으로는 오토바이 택시를 타는 분이 많습니다.",
      },
      {
        slug: "jomtien-beach",
        body:
          "걷기에는 너무 멉니다. 좀티엔에서는 언덕을 넘는 썽태우나 택시를 이용하고, 목적지는 매장 이름 대신 골목 이름으로 말하는 편이 내리기 쉽습니다.",
      },
      {
        slug: "wong-amat-beach",
        body:
          "나클루아 끝자락으로, 도시를 가로지르는 가장 긴 이동입니다. 잠깐 들르는 일이 아니라 하나의 이동으로 계획하고 출발 전에 핀을 확인하세요.",
      },
    ],
    sections: [
      {
        h2: "찾으시는 문",
        body: [
          "공개 주소는 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150이고 문 위 간판에는 LABS DISPENSARY라고 적혀 있습니다. 큰길이 아니라 골목이라 들어오면 짧아서 찾기 쉽지만, 큰길에서는 아예 보이지 않습니다.",
          "그래서 이름이 아니라 핀으로 안내를 받으세요. Google Maps 정보가 현재 위치의 기준이며, 핀이 골목의 올바른 쪽 끝으로 안내합니다.",
        ],
      },
      {
        h2: "택시나 썽태우 기사에게 할 말",
        body: [
          "Pattaya 13 Alley라고 말하세요. 매장 이름부터 꺼내지 마세요. 이 도시에는 수백 곳의 매장이 있어 기사들이 다 알 수 없지만, 번호가 붙은 골목은 누구나 압니다. 애매하면 휴대폰의 핀을 보여 주는 것이 어떤 발음보다 빠릅니다.",
          "북쪽에서 세컨드로드를 따라오면 정해진 노선의 썽태우가 기본 요금으로 근처까지 데려다줍니다. 골목 이름을 말하고 모퉁이에서 벨을 누르세요. 더 먼 곳에서는 핀을 넣어 차를 부르는 편이 간단하며, 저녁에는 특히 그렇습니다.",
        ],
      },
      {
        h2: "이름 둘, 문 하나",
        body: [
          "이 사이트는 Labs Cannabis라는 이름을 쓰고, 같은 주소와 같은 전화번호의 Google Maps 정보는 LABS DISPENSARY로 되어 있습니다. 하나의 사업체, 하나의 문입니다. 굳이 밝히는 이유는 실용적입니다. 파타야에는 비슷한 이름의 매장이 있어 이름만으로 찾으면 다른 집 카운터 앞에 서기 쉽습니다.",
          "이 페이지의 주소, 지도 정보의 주소, 문에 붙은 주소는 같은 문자열이며 의도한 것입니다. 어딘가에서 다른 거리 이름을 보셨다면 핀과 이 페이지를 믿으세요.",
        ],
      },
      {
        h2: "도착하면 어떻게 되나요",
        body: [
          "들어오시면 가장 먼저 확인 절차입니다. 20세 이상, 여권 원본, 처방전. 방문할 때마다 하며 개인적인 일이 아니라 허가받은 매장이 해야 하는 일입니다.",
          "그다음은 카운터에서의 대화입니다. 찾는 것을 말해도 되고, 아직 모르겠다고 해도 됩니다. 병은 앞에서 열어 보여 드리고 서두르게 하지 않습니다. 미리 주문할 것도 없고, 카운터 외의 어디에서도 결제하지 않습니다.",
        ],
      },
    ],
    faqTitle: "찾아오는 길: 자주 묻는 질문",
    faq: [
      {
        q: "Walking Street에서 얼마나 먼가요?",
        a: "{walkingStreet}. 매장 핀에서 잰 직선거리와 서두르지 않는 걸음 기준이며, 골목으로 돌아가면 더 걸립니다.",
      },
      {
        q: "택시 기사에게 뭐라고 말해야 하나요?",
        a: "Pattaya 13 Alley라고 말하고 Google Maps 핀을 보여 주세요. 기사들은 번호가 붙은 골목을 알지만 개별 매장 이름은 모릅니다.",
      },
      {
        q: "좀티엔에서 걸어올 수 있나요?",
        a: "아니요. {jomtien}이고 언덕 너머입니다. 썽태우나 택시를 이용하고 목적지는 골목 이름으로 말하세요.",
      },
      {
        q: "지도에는 LABS DISPENSARY, 사이트에는 Labs Cannabis인 이유는?",
        a: "같은 사업체, 같은 주소, 같은 전화번호에 사용하는 이름이 둘입니다. 비슷한 이름의 다른 매장을 피하려면 핀으로 안내를 받으세요.",
      },
    ],
  },
  ja: {
    title: "パタヤの Labs Cannabis 所在地 | Maps と住所",
    description:
      "LABS DISPENSARY が Pattaya 13 Alley のどこにあるか、Walking Street やジョムティエンからの距離、ドライバーへの伝え方。",
    h1: "パタヤの Labs Cannabis 所在地",
    bridge: "Google Maps では LABS DISPENSARY と表示されています",
    lead:
      "現在のピンと経路は Maps の最新情報をご利用ください。以下は、目印となる場所から扉までの距離、ドライバーへの伝え方、来店時の流れです。",
    maps: "Google Maps を開く",
    address: "公開住所",
    phone: "電話",
    contact: "連絡先と来店調整",
    legal: "旅行者向けの現在のルール",
    walking: "Walking Street からの経路",
    routesTitle: "いまいる場所からどれくらいか",
    routesIntro:
      "以下の距離はすべて店舗のピンから目印までの直線距離で、徒歩時間は急がない速度に迂回分を見込んで計算した値です。約束ではなく計算です。パタヤのソイは格子状ではないため、幅のある表示では大きいほうを目安にしてください。",
    routes: [
      {
        slug: "walking-street",
        body:
          "最も多い出発点です。北端から湾の南端沿いに進み、内側へ折れて Pattaya 13 Alley に入ります。終始平坦で、夕方は人通りが多くなります。日中は日陰がほとんどないため、半分をソンテウで移動して残りを歩く人が多い区間です。",
      },
      {
        slug: "beach-road",
        body:
          "南パタヤのビーチ沿いに滞在している方の基準点です。経路は海から内側へ向かい、ビーチロードを離れた途端に音が静かになります。それが方向の合図です。",
      },
      {
        slug: "central-festival",
        body:
          "パタヤ中心部の買い物の目印で、街の中ほどに滞在する人が距離を測る点です。涼しい時間帯なら歩けますし、それ以外はセカンドロードを走るソンテウですぐ近くまで来られます。",
      },
      {
        slug: "big-buddha",
        body:
          "プラタムナック方面の基準点です。数字は短く見えますが、帰りは丘の上りになるため、その方向にはバイクタクシーを使う人が多くなります。",
      },
      {
        slug: "jomtien-beach",
        body:
          "歩く距離ではありません。ジョムティエンからは丘を越えるソンテウか車で、降車は店名よりソイ名を伝えるほうがスムーズです。",
      },
      {
        slug: "wong-amat-beach",
        body:
          "ナクルアの端で、街を横断する最も長い移動になります。ついでではなく一つの移動として計画し、出発前にピンを確認してください。",
      },
    ],
    sections: [
      {
        h2: "探している扉",
        body: [
          "公開住所は 32 Pattaya 13 Alley, South Pattaya, Chon Buri 20150 で、扉の上の看板には LABS DISPENSARY とあります。大通りではなく脇のソイなので、入ってしまえば短くて見つけやすい一方、大通りからはまったく見えません。",
          "ですから名前ではなくピンに向けて案内させてください。Google Maps のリスティングが現在地の基準であり、ピンがソイの正しい側の端へ導きます。",
        ],
      },
      {
        h2: "タクシーやソンテウへの伝え方",
        body: [
          "Pattaya 13 Alley と伝えてください。店名から切り出さないこと。この街には数百軒の店があり、すべてを覚えている運転手はいませんが、番号のついたソイは誰でも知っています。迷ったら携帯のピンを見せるのが、どんな発音よりも早く話を終わらせます。",
          "北からセカンドロードを来る場合、定路線のソンテウが通常運賃で近くまで運んでくれます。ソイ名を伝え、角でブザーを押してください。もっと遠くからは、ピンを入れて車を呼ぶほうが簡単で、夕方は特にそうです。",
        ],
      },
      {
        h2: "名前は二つ、扉は一つ",
        body: [
          "このサイトは Labs Cannabis の名称を使い、同じ住所・同じ電話番号の Google Maps リスティングは LABS DISPENSARY となっています。一つの事業で一つの扉です。わざわざ書くのは実際的な理由からで、パタヤには似た名前の店があり、名前だけで探すと別の店の前に立ってしまいがちだからです。",
          "このページの住所、リスティングの住所、扉の住所は同じ文字列で、それは意図したものです。どこかで別の通りが当店として書かれていたら、ピンとこのページを信じてください。",
        ],
      },
      {
        h2: "到着してからの流れ",
        body: [
          "入って最初に行うのは確認です。20歳以上であること、パスポートの原本、そして処方。来店のたびに行い、個人に向けたものではなく、許可を受けた店が行うべき手順です。",
          "その後はカウンターでの会話です。探しているものを言っても、まだ決めていないと言っても構いません。瓶は目の前で開けますし、急かされることもありません。事前の注文はなく、カウンター以外の場所で支払うこともありません。",
        ],
      },
    ],
    faqTitle: "行き方についてよくある質問",
    faq: [
      {
        q: "Walking Street からどれくらいの距離ですか？",
        a: "{walkingStreet}。店舗のピンからの直線距離と急がない速度での目安で、ソイを辿ればもう少しかかります。",
      },
      {
        q: "タクシーの運転手には何と言えばよいですか？",
        a: "Pattaya 13 Alley と伝え、Google Maps のピンを見せてください。運転手は番号のソイを知っていますが、個々の店名は知りません。",
      },
      {
        q: "ジョムティエンから歩けますか？",
        a: "歩けません。{jomtien}で、丘を越えます。ソンテウか車を使い、行き先はソイ名で伝えてください。",
      },
      {
        q: "地図は LABS DISPENSARY、サイトは Labs Cannabis なのはなぜですか？",
        a: "同じ事業、同じ住所、同じ電話番号で、使っている名称が二つあるためです。似た名前の店を避けるため、ピンで案内させてください。",
      },
    ],
  },
};
