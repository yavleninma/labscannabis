import type { Locale } from "@/lib/i18n";
import { loadCachedSeoContent, mergeSeoContent, type SeoContent } from "@/lib/seo-content";
import { getPageDepth } from "@/data/page-depth";
import { renderCopy } from "@/data/area-copy";
import { describeLandmarkWalk } from "@/lib/geo";

export type { SeoContent };

/**
 * Общий compliance-FAQ. ПОЛНОСТЬЮ он стоит только на карточной странице
 * `labs-dispensary-pattaya`.
 *
 * Раньше эти три пары вопрос-ответ уходили дословно в `FAQPage` JSON-LD пяти
 * коммерческих страниц одной локали — по документации Google это
 * дублирующийся FAQ, из-за которого rich-результат не показывается, а сами
 * страницы становятся частично взаимозаменяемыми. Вместе с общим абзацем
 * «Prescription and age rules» именно этот блок держал попарную похожесть
 * коммерческого кластера на 0.12–0.14 при 0.10 по остальному сайту.
 *
 * На остальных страницах кластера остаётся не больше одного вопроса, и ответ
 * переписан под контекст конкретной страницы.
 */
const COMPLIANCE_FAQ: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: "Can I order or pay through this website?",
      a: "No. This website does not accept orders or payments. Use it for the public address, directions, and the current official-rules guide.",
    },
    {
      q: "What can I ask on WhatsApp?",
      a: "Ask what is in the shop today, how to find the door, what to bring, or anything about the paperwork — a person answers. The one thing it cannot do is take money: orders and payments happen at the counter, never through this site.",
    },
    {
      q: "Where can I check the current rules?",
      a: "Read the legal guide on this site and follow the linked Thai government sources. Rules can change.",
    },
  ],
  ru: [
    {
      q: "Можно заказать или оплатить на сайте?",
      a: "Нет. Сайт не принимает заказы и оплату. Здесь опубликованы адрес, маршрут и гайд с актуальными официальными источниками.",
    },
    {
      q: "Для чего можно использовать WhatsApp?",
      a: "Спросите, что сегодня в магазине, как найти вход, что взять с собой и что с документами — отвечает человек. Чего в WhatsApp нет, так это кассы: заказы и оплату не принимают ни там, ни где-либо на сайте.",
    },
    {
      q: "Где проверить актуальные правила?",
      a: "Читайте правовой гид на сайте и переходите к указанным там источникам правительства Таиланда. Правила могут меняться.",
    },
  ],
  th: [
    {
      q: "สั่งหรือจ่ายเงินบนเว็บได้ไหม?",
      a: "ไม่ได้ เว็บไซต์นี้ไม่รับคำสั่งซื้อหรือการชำระเงิน ใช้สำหรับที่อยู่ เส้นทาง และคู่มือกฎปัจจุบัน",
    },
    {
      q: "ใช้ WhatsApp เพื่ออะไรได้บ้าง?",
      a: "ถามได้ว่าวันนี้ที่ร้านมีอะไร เข้าประตูทางไหน ต้องเตรียมอะไรมา และเรื่องเอกสารต้องทำอย่างไร มีคนตอบให้ สิ่งเดียวที่ WhatsApp ไม่ใช่คือช่องทางชำระเงิน ไม่มีการรับคำสั่งซื้อหรือการชำระเงินทั้งที่นั่นและบนเว็บไซต์นี้",
    },
    {
      q: "ตรวจสอบกฎปัจจุบันได้ที่ไหน?",
      a: "อ่านคู่มือกฎหมายบนเว็บไซต์และแหล่งข้อมูลรัฐบาลไทยที่เชื่อมโยงไว้ กฎอาจเปลี่ยนแปลงได้",
    },
  ],
  ar: [
    {
      q: "هل يمكن الطلب أو الدفع عبر الموقع؟",
      a: "لا. هذا الموقع لا يقبل الطلبات أو المدفوعات. استخدمه للعنوان والاتجاهات ودليل القواعد الرسمية.",
    },
    {
      q: "لماذا أستخدم WhatsApp؟",
      a: "اسأل عما هو موجود في المتجر اليوم، وكيف تصل إلى الباب، وماذا تحضر معك، وعن الأوراق المطلوبة — يجيبك شخص. الشيء الوحيد الذي ليس عليه WhatsApp هو صندوق الدفع: لا تُقبل الطلبات ولا المدفوعات هناك ولا في أي مكان على هذا الموقع.",
    },
    {
      q: "أين أراجع القواعد الحالية؟",
      a: "اقرأ الدليل القانوني في الموقع واتبع روابط المصادر الحكومية التايلاندية. قد تتغير القواعد.",
    },
  ],
  zh: [
    {
      q: "可以在网站下单或付款吗？",
      a: "不可以。本网站不接受订单或付款，仅提供公开地址、路线和当前官方规则指南。",
    },
    {
      q: "WhatsApp 可以用于什么？",
      a: "可以问今天店里有什么、门在哪里、需要带什么、证件手续怎么办——由店员回答。WhatsApp 唯一不是的东西是收银台：那里和本站任何地方都不接受订单与付款。",
    },
    {
      q: "在哪里查看当前规则？",
      a: "请阅读本站法律指南并访问其中链接的泰国政府来源。规则可能变化。",
    },
  ],
  ko: [
    {
      q: "웹사이트에서 주문하거나 결제할 수 있나요?",
      a: "아니요. 이 웹사이트는 주문이나 결제를 받지 않으며 공개 주소, 길 안내와 최신 공식 규정 가이드를 제공합니다.",
    },
    {
      q: "WhatsApp은 어디에 사용할 수 있나요?",
      a: "오늘 매장에 무엇이 있는지, 입구를 어떻게 찾는지, 무엇을 가져와야 하는지, 서류는 어떻게 되는지 물어보세요. 사람이 답합니다. WhatsApp이 아닌 단 한 가지는 계산대입니다. 주문과 결제는 그곳에서도, 이 사이트 어디에서도 받지 않습니다.",
    },
    {
      q: "현재 규정은 어디서 확인하나요?",
      a: "사이트의 법률 가이드와 연결된 태국 정부 자료를 확인하세요. 규정은 변경될 수 있습니다.",
    },
  ],
  ja: [
    {
      q: "サイトで注文や支払いはできますか？",
      a: "できません。このサイトは注文や支払いを受け付けず、公開住所、道順、最新の公式ルールガイドを提供します。",
    },
    {
      q: "WhatsAppは何に使えますか？",
      a: "今日の店内の様子、入口の場所、持ち物、書類のことなど、何でも聞いてください。人が答えます。WhatsAppがそうでない唯一のものはレジです。注文と支払いは、そこでも本サイトのどこでも受け付けていません。",
    },
    {
      q: "現在のルールはどこで確認できますか？",
      a: "サイトの法的ガイドと、リンクされたタイ政府情報を確認してください。ルールは変更される場合があります。",
    },
  ],
};

/**
 * Ручные исключения: вычитанные h1/intro/closing и compliance-FAQ. Приоритет у
 * них, но они намеренно короткие — объём страницы даёт `content-cache`, см.
 * `loadSeoContent`.
 */
const PAGE_COPY: Record<string, Record<Locale, Omit<SeoContent, "source">>> = {
  "buy-cannabis-pattaya": {
    en: {
      h1: "Buy weed in Pattaya at a walk-in cannabis shop on Pattaya 13 Alley",
      intro:
        "Labs Cannabis is a physical weed shop at 32 Pattaya 13 Alley in South Pattaya — {walkingStreet}. Adults 20+ who hold a Thai prescription can ask what is on the shelf today and how to find the door before setting off. Availability is confirmed in WhatsApp and at the counter, never through a public basket.",
      sections: [
        {
          h2: "Ask what is on the shelf today",
          body:
            "Describe the aroma family you already know — pine, sweet fruit, fuel — rather than asking for a list. The site shows the shop, the address and the way to reach a person; what is actually in the jars on the day is described by that person, before you cross Pattaya.",
        },
        {
          h2: "Walk in from Walking Street or message first",
          body:
            "From Walking Street, turn into Pattaya 13 Alley and look for the LABS DISPENSARY signboard — the same shop this site calls Labs Cannabis. The Google listing is the source of truth for the pin and the current opening times. WhatsApp is the fastest way to check that someone is at the counter before you set off.",
        },
      ],
      faq: [
        {
          q: "Can I reserve today's flower and pay for it before I arrive?",
          a: "No. There is no basket, no payment and no reservation on this domain — selling cannabis through electronic channels is prohibited in Thailand. A message can tell you what is on the shelf and whether someone is at the counter; the handover itself happens in the shop.",
        },
        {
          q: "How far is the shop from Walking Street?",
          a: "The shop is on Pattaya 13 Alley in South Pattaya: {walkingStreet}. That is measured from the shop pin; open Google Maps for the live route.",
        },
        {
          q: "Is weed or marijuana the same thing as cannabis here?",
          a: "Yes. Weed and marijuana are everyday names for the same cannabis flower — a controlled herb in Thailand, sold in store to adults 20 and over who hold a prescription issued in Thailand.",
        },
      ],
      closing: "Message Labs Cannabis on WhatsApp about what is on the shelf today, then walk in at 32 Pattaya 13 Alley.",
    },
    ru: {
      h1: "Купить каннабис (марихуану) в Паттайе — магазин на Pattaya 13 Alley",
      intro:
        "Labs Cannabis — магазин каннабиса (марихуаны) по адресу 32 Pattaya 13 Alley в Южной Паттайе: {walkingStreet}. Взрослые 20+ с тайским рецептом могут заранее спросить, что сегодня на полке и как найти дверь. Наличие подтверждается в WhatsApp и у прилавка, а не через публичную корзину.",
      sections: [
        {
          h2: "Спросите, что стоит на полке сегодня",
          body:
            "Опишите знакомое семейство аромата — сосна, сладкий фрукт, топливо — вместо того чтобы просить список. Сайт показывает магазин, адрес и способ дойти до живого человека; что реально стоит в банках в этот день, расскажет этот человек, ещё до поездки через всю Паттайю.",
        },
        {
          h2: "Зайдите с Walking Street или напишите сначала",
          body:
            "С Walking Street сверните в Pattaya 13 Alley и ищите вывеску LABS DISPENSARY — это тот же магазин, который на сайте называется Labs Cannabis. Карточка Google — источник правды по пину и текущему времени работы. WhatsApp быстрее всего подтвердит, что за прилавком кто-то есть, ещё до выхода.",
        },
      ],
      faq: [
        {
          q: "Можно ли отложить цветок и оплатить его до приезда?",
          a: "Нет. На этом домене нет ни корзины, ни оплаты, ни брони: продажа каннабиса через электронные каналы в Таиланде запрещена. В сообщении расскажут, что сегодня на полке и есть ли кто-то за прилавком; сама передача происходит в магазине.",
        },
        {
          q: "Как далеко от Walking Street?",
          a: "Магазин на Pattaya 13 Alley в Южной Паттайе: {walkingStreet}. Значение посчитано от пина магазина; живой маршрут — в Google Maps.",
        },
        {
          q: "«Травка», «марихуана» и «каннабис» — это одно и то же?",
          a: "Да. «Травкой» и марихуаной в быту называют те же соцветия каннабиса — контролируемую траву в Таиланде: их отпускают в магазине, лично, взрослым от 20 лет по рецепту, выданному в Таиланде.",
        },
      ],
      closing: "Напишите в WhatsApp, что сегодня на полке, затем заходите на 32 Pattaya 13 Alley.",
    },
    th: {
      h1: "ซื้อกัญชา พัทยา — ร้านบนซอยพัทยา 13",
      intro:
        "Labs Cannabis เป็นร้านจริงที่ 32 Pattaya 13 Alley พัทยาใต้ เดินไม่ไกลจาก Walking Street ผู้ใหญ่ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ไทยถามเรื่องดอกวันนี้ เอฟเฟกต์ และเส้นทางได้ก่อนออกเดินทาง สต็อกยืนยันใน WhatsApp และที่เคาน์เตอร์ ไม่ใช่ผ่านตะกร้าสาธารณะ",
      sections: [
        {
          h2: "เริ่มจากเมนูวันนี้",
          body:
            "ถามว่าดอก indoor ไหนสดวันนี้ และต้องการเอฟเฟกต์แบบไหน เว็บแสดงร้าน ที่อยู่ และช่องทางคุยกับคนจริง ส่วนของที่อยู่ในโหล รูป และรายละเอียดล็อต คุยกันเป็นการส่วนตัวก่อนเดินทาง",
        },
        {
          h2: "เดินจาก Walking Street หรือทักก่อน",
          body:
            "จาก Walking Street เลี้ยวเข้า Pattaya 13 Alley หาร้าน Labs Cannabis เดิมชื่อ Labs Dispensary ข้อมูลใน Google เป็นแหล่งอ้างอิงของหมุดและเวลาเปิดปิดล่าสุด ทัก WhatsApp เพื่อยืนยันว่ามีคนอยู่ที่ร้านก่อนออกเดินทาง",
        },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "ทัก WhatsApp ถามเรื่องดอกวันนี้ แล้วแวะมาที่ 32 Pattaya 13 Alley",
    },
    ar: {
      h1: "شراء القنب في باتايا — متجر في Pattaya 13 Alley",
      intro:
        "Labs Cannabis متجر فعلي في 32 Pattaya 13 Alley بجنوب باتايا، على مسافة قصيرة من Walking Street. يمكن للبالغين 20+ ممن يحملون وصفة تايلاندية السؤال عن زهور اليوم والتأثيرات والطريق قبل التحرك. التوفر يؤكد في WhatsApp وعند الطاولة، لا عبر سلة عامة.",
      sections: [
        { h2: "ابدأ بقائمة اليوم", body: "اسأل عن الزهور الداخلية الطازجة اليوم والتأثير الذي تريده. الموقع يعرض المتجر والعنوان وطريقة الوصول إلى شخص حقيقي." },
        { h2: "امشِ من Walking Street أو راسلنا أولاً", body: "من Walking Street ادخل Pattaya 13 Alley وابحث عن Labs Cannabis. بطاقة Google هي المرجع للدبوس ولأوقات العمل الحالية." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "راسل WhatsApp عن زهور اليوم ثم زر 32 Pattaya 13 Alley.",
    },
    zh: {
      h1: "在芭提雅购买大麻 — Pattaya 13 Alley 实体店",
      intro:
        "Labs Cannabis 位于南芭提雅 32 Pattaya 13 Alley，步行即可到 Walking Street。持泰国处方的 20 岁以上成年人可先询问今日花、效果和路线。是否有货在 WhatsApp 和店内柜台确认，而不是通过公开购物篮。",
      sections: [
        { h2: "先看今日菜单", body: "询问今天新鲜的 indoor flower 以及你想要的效果。网站展示门店、地址和联系到真人的方式；罐子里实际是什么、批次说明和照片，都在出发前私下沟通。" },
        { h2: "从 Walking Street 步行或先发消息", body: "从 Walking Street 拐进 Pattaya 13 Alley。定位和当前营业时间以 Google 页面为准。出发前用 WhatsApp 确认店里有人。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "先用 WhatsApp 问今日花，再到 32 Pattaya 13 Alley。",
    },
    ko: {
      h1: "파타야에서 대마초 구매 — Pattaya 13 Alley 매장",
      intro:
        "Labs Cannabis는 Walking Street에서 가까운 남파타야 32 Pattaya 13 Alley의 실제 매장입니다. 태국 처방전을 가진 만 20세 이상 성인은 방문 전에 오늘의 flower, 효과, 오는 길을 문의할 수 있습니다. 재고는 WhatsApp과 매장 카운터에서 확인하며, 공개 장바구니는 없습니다.",
      sections: [
        { h2: "오늘 메뉴부터", body: "오늘 신선한 indoor flower와 원하는 효과를 문의하세요. 웹사이트는 매장과 주소, 사람에게 닿는 방법을 보여줍니다. 병 안에 실제로 무엇이 있는지와 사진은 출발 전에 개별적으로 이야기합니다." },
        { h2: "Walking Street에서 걷거나 먼저 메시지", body: "Walking Street에서 Pattaya 13 Alley로 들어오세요. 핀과 현재 영업시간은 Google 정보가 기준입니다. 출발 전에 WhatsApp으로 카운터에 사람이 있는지 확인하세요." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "WhatsApp으로 오늘의 flower를 물어본 뒤 32 Pattaya 13 Alley로 오세요.",
    },
    ja: {
      h1: "パタヤで大麻を購入 — Pattaya 13 Alleyの店舗",
      intro:
        "Labs CannabisはWalking Streetから近い南パタヤ32 Pattaya 13 Alleyの実店舗です。タイの処方箋を持つ20歳以上の方は、来店前に本日の花、効果、道順をお尋ねいただけます。在庫はWhatsAppと店頭カウンターで確認し、公開された買い物かごはありません。",
      sections: [
        { h2: "本日のメニューから", body: "今日新鮮なindoor flowerと、求める効果をお尋ねください。サイトは店舗と住所、人に連絡する方法を示します。瓶の中身やロットの詳細、写真は出発前に個別にお話しします。" },
        { h2: "Walking Streetから歩く、または先に連絡", body: "Walking StreetからPattaya 13 Alleyへ入ってください。ピンと現在の営業時間はGoogleの掲載情報が基準です。出発前にWhatsAppでカウンターに人がいるか確認できます。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "WhatsAppで本日の花を確認してから32 Pattaya 13 Alleyへお越しください。",
    },
  },
  "cannabis-near-me-pattaya": {
    en: {
      h1: "Cannabis shop near you in Pattaya",
      intro:
        "If you searched for a weed shop or the Labs location in Pattaya, use the live LABS DISPENSARY Google Maps listing for the route to 32 Pattaya 13 Alley.",
      sections: [
        {
          h2: "Verify the public listing",
          body:
            "The Maps listing and this website publish the same address and phone. The website uses Labs Cannabis; Google Maps currently shows LABS DISPENSARY.",
        },
        {
          h2: "Plan the route before travelling",
          body:
            "Open Maps from your current location for walking or driving directions. WhatsApp is the fastest way to ask what is in the shop today, how to find the door and what to bring, before you set off.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.en,
        {
          q: "How do I find the current route?",
          a: "Open the live Google Maps listing from your current location. It provides the current walking or driving route.",
        },
      ],
      closing: "Open the live Maps listing for the pin and route, or ask on WhatsApp what is on the shelf today and how to find the door.",
    },
    ru: {
      h1: "Каннабис-шоп рядом с вами в Паттайе",
      intro:
        "Если вы ищете диспенсари Labs в Паттайе, откройте актуальную карточку LABS DISPENSARY в Google Maps и маршрут к адресу 32 Pattaya 13 Alley.",
      sections: [
        {
          h2: "Проверьте публичную карточку",
          body:
            "В карточке Maps и на сайте опубликованы одинаковые адрес и телефон. Сайт использует Labs Cannabis, а Google Maps сейчас показывает LABS DISPENSARY.",
        },
        {
          h2: "Постройте маршрут до поездки",
          body:
            "Откройте Maps из текущей точки для пешего или автомобильного маршрута. В WhatsApp быстрее всего спросить, что сегодня в магазине, как найти вход и что взять с собой, ещё до выезда.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.ru,
        {
          q: "Где посмотреть актуальный маршрут?",
          a: "Откройте живую карточку Google Maps из текущей точки: там будет пеший или автомобильный маршрут.",
        },
      ],
      closing: "Откройте Maps с актуальным пином и маршрутом или спросите в WhatsApp, что сегодня на витрине и как найти вход.",
    },
    th: {
      h1: "ร้านกัญชาใกล้คุณ พัทยา",
      intro:
        "หากกำลังค้นหาที่ตั้ง Labs ในพัทยา ให้ใช้ Google Maps รายการ LABS DISPENSARY และเส้นทางไป 32 Pattaya 13 Alley",
      sections: [
        { h2: "ตรวจสอบรายการสาธารณะ", body: "Maps และเว็บไซต์แสดงที่อยู่และโทรศัพท์เดียวกัน เว็บไซต์ใช้ Labs Cannabis ส่วน Maps แสดง LABS DISPENSARY" },
        { h2: "วางแผนเส้นทาง", body: "เปิด Maps จากตำแหน่งปัจจุบัน ถ้าอยากรู้ว่าวันนี้ที่ร้านมีอะไร เข้าประตูทางไหน และต้องเตรียมอะไรมา ถามทาง WhatsApp ได้เร็วที่สุดก่อนออกเดินทาง" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิด Maps เพื่อดูหมุดและเส้นทางล่าสุด หรือทัก WhatsApp ถามว่าวันนี้หน้าร้านมีอะไรและเข้าประตูทางไหน",
    },
    ar: {
      h1: "متجر قنب قريب منك في باتايا",
      intro: "إذا كنت تبحث عن موقع Labs في باتايا، استخدم بطاقة LABS DISPENSARY المباشرة على Google Maps للوصول إلى 32 Pattaya 13 Alley.",
      sections: [
        { h2: "تحقق من البطاقة العامة", body: "تعرض Maps والموقع العنوان والهاتف نفسيهما. يستخدم الموقع Labs Cannabis وتعرض Maps اسم LABS DISPENSARY." },
        { h2: "خطط للمسار", body: "افتح Maps من موقعك الحالي. وعلى WhatsApp تسأل بأسرع طريقة عما هو موجود في المتجر اليوم، وكيف تصل إلى الباب، وماذا تحضر معك قبل أن تنطلق." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح Maps للدبوس والمسار الحاليين، أو اسأل على WhatsApp عما هو متوفر اليوم وكيف تجد الباب.",
    },
    zh: {
      h1: "芭提雅附近的大麻店",
      intro: "如需查找 Labs 在芭提雅的位置，请使用 Google Maps 上实时的 LABS DISPENSARY 页面前往 32 Pattaya 13 Alley。",
      sections: [
        { h2: "核对公开页面", body: "Maps 与本网站显示相同地址和电话。本网站使用 Labs Cannabis，Maps 当前显示 LABS DISPENSARY。" },
        { h2: "规划路线", body: "从当前位置打开 Maps。出发前想知道今天店里有什么、门在哪里、需要带什么，用 WhatsApp 问最快。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Maps 查看当前定位与路线，或用 WhatsApp 问今天店里有什么、门在哪里。",
    },
    ko: {
      h1: "파타야 근처 대마초 매장",
      intro: "파타야의 Labs 위치를 찾는다면 Google Maps의 실시간 LABS DISPENSARY 정보에서 32 Pattaya 13 Alley 경로를 확인하세요.",
      sections: [
        { h2: "공개 정보 확인", body: "Maps와 웹사이트는 같은 주소와 전화번호를 표시합니다. 웹사이트는 Labs Cannabis, Maps는 LABS DISPENSARY를 사용합니다." },
        { h2: "경로 계획", body: "현재 위치에서 Maps를 여세요. 출발 전에 오늘 매장에 무엇이 있는지, 입구를 어떻게 찾는지, 무엇을 가져와야 하는지는 WhatsApp으로 물어보는 것이 가장 빠릅니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Maps에서 현재 핀과 경로를 확인하거나, WhatsApp으로 오늘 무엇이 있는지와 입구 위치를 물어보세요.",
    },
    ja: {
      h1: "パタヤ近くの大麻店",
      intro: "パタヤの Labs の場所を探す場合は、Google Maps の最新 LABS DISPENSARY リスティングから 32 Pattaya 13 Alley への経路を確認してください。",
      sections: [
        { h2: "公開リスティングを確認", body: "Maps とサイトは同じ住所と電話番号を掲載しています。サイト名は Labs Cannabis、Maps は LABS DISPENSARY です。" },
        { h2: "経路を確認", body: "現在地から Maps を開いてください。今日の店内の様子、入口の場所、持ち物は、出かける前に WhatsApp で聞くのがいちばん早いです。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "Mapsで現在のピンと経路を開くか、WhatsAppで今日の品ぞろえと入口の場所を聞いてください。",
    },
  },
  // Слаг про «дёшево» — единственная страница, где до W1-09 лежали ставки за
  // грамм в батах. Запрос легален, публикация цены — нет, поэтому страница
  // отвечает на вопрос «от чего зависит цена», а не называет её.
  "cheap-weed-pattaya": {
    en: {
      h1: "What changes the price of cannabis in Pattaya",
      intro:
        "Thai law treats a published price for cannabis — weed — as advertising, so Labs Cannabis does not list one on this site. Neither should any dispensary that intends to keep its licence. What can be explained honestly is why one gram costs more than another, so you walk in knowing what you are looking at. What is on the shelf today is a question for WhatsApp +66 66 080 6784.",
      sections: [
        {
          h2: "Why one gram costs more than another",
          body:
            "Indoor flower costs more to grow than greenhouse or outdoor, and the difference shows up in density, smell and the quality of the trim. A slow cure, hand trimming and small batches all add cost, and so does a strain that yields badly. Flower that costs less in Pattaya is usually older, drier, machine-trimmed or grown outdoors — enough for some people, a disappointment for others.",
        },
      ],
      faq: [
        {
          q: "If nobody quotes a figure, what is worth asking in a message?",
          a: "Ask what is on the shelf today, how it was grown — indoor, greenhouse or outdoor — and how recently it was cured. Those three answers explain most of the difference between one jar and another, and none of them is a price.",
        },
      ],
      closing: "Ask on WhatsApp what is on the shelf today, or open Google Maps and come to 32 Pattaya 13 Alley — adults 20+ with a Thai prescription.",
    },
    ru: {
      h1: "От чего зависит цена каннабиса в Паттайе",
      intro:
        "В Таиланде опубликованная цена на каннабис — «травку», марихуану — считается рекламой, поэтому Labs Cannabis не публикует её на сайте. Как и любой магазин каннабиса, который собирается сохранить лицензию. Зато можно честно объяснить, из-за чего один грамм дороже другого, чтобы вы пришли подготовленными. Что сегодня на витрине — вопрос для WhatsApp +66 66 080 6784.",
      sections: [
        {
          h2: "Из-за чего один грамм дороже другого",
          body:
            "Индор — выращивание в помещении — дороже теплицы и улицы, и разница видна по плотности, запаху и качеству обрезки. Медленная просушка, ручной трим и маленькие партии добавляют себестоимости, как и сорт с низкой урожайностью. То, что в Паттайе стоит меньше, обычно лежалое, пересушенное, обрезанное машиной или выращенное на улице: кому-то этого достаточно, кого-то разочарует.",
        },
      ],
      faq: [
        {
          q: "Если цифру никто не называет, о чём тогда писать?",
          a: "Спросите, что сегодня на полке, как это выращено — индор, теплица или улица — и насколько недавно просушено. Эти три ответа объясняют большую часть разницы между банками, и ни один из них не является ценой.",
        },
      ],
      closing: "Спросите в WhatsApp, что сегодня на витрине, или откройте Google Maps и приезжайте на 32 Pattaya 13 Alley — для взрослых 20+ с тайским рецептом.",
    },
    th: {
      h1: "กัญชาราคาสมเหตุสมผลในพัทยา — อะไรทำให้ราคาต่างกัน",
      intro:
        "กฎหมายไทยถือว่าการประกาศราคากัญชาเป็นการโฆษณา Labs Cannabis จึงไม่แสดงราคาบนเว็บไซต์ สิ่งที่อธิบายได้อย่างตรงไปตรงมาคือปัจจัยที่ทำให้ดอกแต่ละกรัมไม่เท่ากัน เพื่อให้คุณเข้าใจก่อนมาถึงร้าน ส่วนวันนี้หน้าร้านมีอะไรบ้าง ถามได้ทาง WhatsApp +66 66 080 6784",
      sections: [
        {
          h2: "อะไรทำให้ดอกกรัมหนึ่งต่างจากอีกกรัม",
          body:
            "การปลูกในระบบปิดมีต้นทุนสูงกว่าโรงเรือนและกลางแจ้ง และเห็นได้จากความแน่น กลิ่น และความประณีตของการเล็ม การบ่มอย่างช้า ๆ การเล็มด้วยมือ และการปลูกทีละล็อตเล็กล้วนเพิ่มต้นทุน เช่นเดียวกับสายพันธุ์ที่ให้ผลผลิตน้อย ดอกที่มีต้นทุนต่ำกว่าในพัทยามักเก่ากว่า แห้งกว่า เล็มด้วยเครื่อง หรือปลูกกลางแจ้ง บางคนรับได้ บางคนผิดหวัง ขอดูและดมของจริงในโหลก่อนตัดสินใจ",
        },
        {
          h2: "ทำไมหน้านี้ไม่มีตัวเลข",
          body:
            "ตั้งแต่มิถุนายน 2568 ดอกกัญชาเป็นสมุนไพรควบคุม การส่งมอบทำที่หน้าร้าน ให้ผู้ใหญ่อายุ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ซึ่งออกในประเทศไทย และการโฆษณา รวมถึงการประกาศราคา คือสิ่งที่ทำให้ร้านถูกสั่งพักใบอนุญาต หน้านี้จึงไม่มีรายการราคา ไม่มีตะกร้า และไม่มีการชำระเงิน ทัก WhatsApp แล้วถามว่าวันนี้ที่ร้านมีอะไร คนเป็นผู้ตอบ ไม่ใช่หน้าเว็บ",
        },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "ทัก WhatsApp ถามว่าวันนี้หน้าร้านมีอะไร หรือเปิด Google Maps มาที่ 32 Pattaya 13 Alley สำหรับผู้ใหญ่ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ไทย",
    },
    ar: {
      h1: "قنب بأسعار معقولة في باتايا — ما الذي يغيّر السعر فعلاً",
      intro:
        "يعتبر القانون التايلاندي نشر سعر القنب إعلاناً، لذلك لا تنشره Labs Cannabis على هذا الموقع. ما يمكن شرحه بصراحة هو ما الذي يجعل غراماً يكلّف أكثر من آخر، حتى تأتي وأنت تعرف ما تنظر إليه. أما ما هو متوفر اليوم فسؤال إلى WhatsApp +66 66 080 6784",
      sections: [
        {
          h2: "ما الذي يجعل غراماً يكلّف أكثر من آخر",
          body:
            "الزراعة الداخلية أعلى كلفة من البيوت المحمية والزراعة المكشوفة، ويظهر ذلك في الكثافة والرائحة وجودة التشذيب. التجفيف المتأني والتشذيب اليدوي والدفعات الصغيرة تضيف كلفة، وكذلك السلالات قليلة الإنتاج. ما يكلّف أقل في باتايا يكون عادةً أقدم أو أكثر جفافاً أو مشذّباً آلياً أو مزروعاً في الخارج؛ يكفي ذلك بعض الناس ويخيّب آخرين. اطلب أن ترى وتشمّ ما في الوعاء قبل أن تقرر.",
        },
        {
          h2: "لماذا لا يوجد رقم في هذه الصفحة",
          body:
            "منذ يونيو 2025 صارت زهرة القنب عشبة خاضعة للرقابة: تُسلَّم داخل المتجر للبالغين 20 عاماً فأكثر ممن يحملون وصفة صادرة داخل تايلاند، والإعلان عنها — بما في ذلك السعر — هو ما يوقف ترخيص المتجر. لذلك لا توجد هنا قائمة ولا سلة ولا دفع. راسلنا على WhatsApp واسأل عما هو موجود اليوم؛ يجيبك شخص، لا صفحة.",
        },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "اسأل على WhatsApp عما هو متوفر اليوم، أو افتح Google Maps وتعال إلى 32 Pattaya 13 Alley — للبالغين 20+ مع وصفة تايلاندية.",
    },
    zh: {
      h1: "芭提雅实惠大麻 — 价格到底由什么决定",
      intro:
        "泰国法律把公布大麻价格视为广告，因此 Labs Cannabis 不在本站列出价格。能够坦白说明的是：为什么同样一克会有高低之分，让你到店时心里有数。今天店里有什么，请用 WhatsApp +66 66 080 6784 询问。",
      sections: [
        {
          h2: "为什么同样一克会有高低之分",
          body:
            "室内种植的成本高于温室和露天，这会体现在密度、香气和修剪的细致程度上。慢速熟化、手工修剪和小批量都会推高成本，产量低的品种同样如此。在芭提雅成本更低的花，通常更旧、更干、由机器修剪或露天种植，有人觉得够用，也有人会失望。决定之前，请要求当面看一看、闻一闻罐子里的东西。",
        },
        {
          h2: "为什么这页没有数字",
          body:
            "自 2025 年 6 月起，大麻花属于受管制草药：在店内交付给持泰国境内处方、年满 20 岁的成年人，而为其做广告（包括公布价格）正是导致店铺被停业整顿的原因。所以这里没有价目表，没有购物篮，也不收款。请用 WhatsApp 询问今天店里有什么——回答你的是人，不是网页。",
        },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "用 WhatsApp 问今天店里有什么，或打开 Google Maps 来 32 Pattaya 13 Alley — 仅限持泰国处方的 20 岁以上成年人。",
    },
    ko: {
      h1: "파타야의 합리적인 대마초 — 가격을 실제로 좌우하는 것",
      intro:
        "태국 법은 대마초 가격 공개를 광고로 봅니다. 그래서 Labs Cannabis는 이 사이트에 가격을 싣지 않습니다. 대신 왜 같은 1그램이라도 값이 달라지는지는 솔직하게 설명할 수 있습니다. 오늘 매장에 무엇이 있는지는 WhatsApp +66 66 080 6784으로 물어보세요.",
      sections: [
        {
          h2: "같은 1그램인데 값이 달라지는 이유",
          body:
            "실내 재배는 온실이나 노지보다 비용이 많이 들고, 그 차이는 밀도와 향, 손질 상태로 드러납니다. 천천히 큐어링하고 손으로 다듬고 소량으로 나눠 기르면 원가가 올라가며, 수확량이 적은 품종도 마찬가지입니다. 파타야에서 값이 낮은 꽃은 대개 오래됐거나 더 마르고 기계로 다듬었거나 노지에서 자란 것입니다. 누군가에게는 충분하고 누군가에게는 실망스럽습니다. 정하기 전에 병 안의 것을 직접 보고 냄새를 맡아보세요.",
        },
        {
          h2: "이 페이지에 숫자가 없는 이유",
          body:
            "2025년 6월부터 대마초 꽃은 관리 대상 약초입니다. 태국에서 발급된 처방전을 가진 만 20세 이상 성인에게 매장에서 전달되며, 가격 공개를 포함한 광고는 판매점 영업정지로 이어집니다. 그래서 여기에는 가격표도 장바구니도 결제도 없습니다. WhatsApp으로 오늘 매장 상황을 물어보세요. 답하는 것은 페이지가 아니라 사람입니다.",
        },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "WhatsApp으로 오늘 매장에 무엇이 있는지 물어보시거나, Google Maps를 열고 32 Pattaya 13 Alley로 오세요. 태국 처방전을 가진 만 20세 이상만 이용할 수 있습니다.",
    },
    ja: {
      h1: "パタヤの手頃な大麻 — 価格を実際に左右するもの",
      intro:
        "タイの法律では大麻の価格を公開すること自体が広告にあたるため、Labs Cannabisはこのサイトに価格を載せません。代わりに、同じ1グラムでも値が変わる理由は正直にご説明できます。今日の店頭の内容はWhatsApp +66 66 080 6784へお問い合わせください。",
      sections: [
        {
          h2: "同じ1グラムでも値が変わる理由",
          body:
            "屋内栽培はグリーンハウスや屋外より育てるコストが高く、その差は密度や香り、トリムの丁寧さに表れます。ゆっくり乾燥・熟成させること、手作業のトリム、小さなロットでの栽培はいずれも原価を押し上げ、収量の少ない品種も同様です。パタヤで値の低い花は、たいてい古い、乾きすぎている、機械トリム、あるいは屋外栽培です。それで十分な人もいれば、がっかりする人もいます。決める前に、瓶の中身を見て匂いを確かめてください。",
        },
        {
          h2: "このページに数字がない理由",
          body:
            "2025年6月以降、大麻の花は管理対象の生薬です。受け渡しはタイ国内で発行された処方箋を持つ20歳以上の方に対して店頭で行われ、価格の公開を含む広告こそが販売店の営業停止につながります。ですからここには価格表も買い物かごも決済もありません。WhatsAppで今日の店頭の様子をお尋ねください。答えるのはページではなく人です。",
        },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "今日の店頭の内容をWhatsAppでお尋ねいただくか、Google Mapsを開いて32 Pattaya 13 Alleyへお越しください。タイの処方箋をお持ちの20歳以上の方が対象です。",
    },
  },
  "best-cannabis-shop-pattaya": {
    en: {
      h1: "Comparing cannabis shops in Pattaya — a listing you can verify",
      intro:
        "Guests comparing cannabis and weed shops in Pattaya usually want a verifiable Google listing, a walk-in address and a direct chat. Labs Cannabis has all three at 32 Pattaya 13 Alley in South Pattaya. Open the live LABS DISPENSARY listing for the current rating, photos and hours — those change, and Google is the source of truth.",
      sections: [
        {
          h2: "What “best” means on this page",
          body:
            "This page does not rank every shop in Pattaya. It explains why visitors use Labs Cannabis as a default check: a physical alley address near Walking Street, a licensed dispensary, a WhatsApp thread a person answers, and a Google profile you can open before travelling.",
        },
        {
          h2: "Verify the listing, then ask the menu",
          body:
            "Open the Google profile for photos, reviews and directions. Then message WhatsApp about today's flower and its effects. A high rating is not a substitute for looking at today's jars at the counter.",
        },
      ],
      faq: [
        {
          q: "What should I compare, if no shop publishes a menu or a price?",
          a: "Compare what is checkable: a listing with a real address and current photos, a licence displayed where you can read it, staff who ask for age and documents before discussing anything, and a person who answers a message. The legal guide on this site explains why the menu and the price cannot be part of that comparison.",
        },
      ],
      closing: "Open the Google listing, then message WhatsApp if 32 Pattaya 13 Alley looks like the right stop.",
    },
    ru: {
      h1: "Как сравнивать каннабис-диспенсари в Паттайе — карточка, которую можно проверить",
      intro:
        "Сравнивая диспенсари в Паттайе, гости обычно хотят проверяемую карточку Google, адрес и прямой чат. У Labs Cannabis есть всё три: 32 Pattaya 13 Alley, Южная Паттайя. Актуальные оценка, фото и часы — в живой карточке LABS DISPENSARY: они меняются, и источник правды именно Google.",
      sections: [
        {
          h2: "Что здесь значит «лучший»",
          body:
            "Страница не ранжирует все магазины Паттайи. Она объясняет, зачем проверяют Labs Cannabis: физический адрес в переулке у Walking Street, лицензия на стене, WhatsApp, на который отвечает человек, и Google-профиль, который можно открыть до поездки.",
        },
        {
          h2: "Проверьте карточку, потом спросите меню",
          body:
            "Откройте Google: фото, отзывы, маршрут. Затем напишите в WhatsApp про сегодняшние цветы и эффекты. Высокая оценка не заменяет взгляд в банки у прилавка.",
        },
      ],
      faq: [
        {
          q: "Что сравнивать, если ни один магазин не публикует меню и цену?",
          a: "Сравнивайте проверяемое: карточку с реальным адресом и свежими фотографиями, лицензию на виду, сотрудников, которые спрашивают возраст и документы до разговора о товаре, и живого человека в переписке. Почему меню и цена не могут быть частью этого сравнения — в правовом гиде на сайте.",
        },
      ],
      closing: "Откройте карточку Google и напишите в WhatsApp, если 32 Pattaya 13 Alley — ваш вариант.",
    },
    th: {
      h1: "ร้านกัญชาดีที่สุด พัทยา — ร้านที่ตรวจสอบได้",
      intro: "Labs Cannabis อยู่ที่ 32 Pattaya 13 Alley พัทยาใต้ เปิดข้อมูล LABS DISPENSARY ใน Google เพื่อดูคะแนน รูป และเวลาเปิดปิดล่าสุด ข้อมูลเหล่านี้เปลี่ยนได้ และ Google คือแหล่งอ้างอิง",
      sections: [
        { h2: "คำว่าดีที่สุดในหน้านี้", body: "ไม่ได้จัดอันดับทุกร้านในพัทยา แต่ชี้ร้านที่ตรวจสอบได้: ที่อยู่จริงใกล้ Walking Street ร้านที่ได้รับอนุญาต WhatsApp ที่มีคนตอบ และโปรไฟล์ Google ที่เปิดดูก่อนเดินทางได้" },
        { h2: "เช็กข้อมูลแล้วถามเมนู", body: "เปิด Google แล้วทัก WhatsApp ถามเรื่องดอกวันนี้ คะแนนสูงไม่ได้แทนการดูของจริงที่หน้าร้าน" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิดข้อมูลใน Google แล้วทัก WhatsApp ถ้าพร้อมแวะ 32 Pattaya 13 Alley",
    },
    ar: {
      h1: "أفضل متجر قنب في باتايا — قائمة Google حقيقية",
      intro: "Labs Cannabis في 32 Pattaya 13 Alley بجنوب باتايا. افتح بطاقة LABS DISPENSARY المباشرة على Google للاطلاع على التقييم والصور وأوقات العمل الحالية.",
      sections: [
        { h2: "معنى الأفضل هنا", body: "الصفحة لا ترتب كل متاجر باتايا. إنها متجر مرخّص يمكن التحقق منه قرب Walking Street." },
        { h2: "تحقق من البطاقة ثم اسأل عن المتوفر", body: "افتح Google ثم راسل WhatsApp عن زهور اليوم. التقييم لا يغني عن النظر إلى ما في المتجر اليوم." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح قائمة Google ثم راسل WhatsApp.",
    },
    zh: {
      h1: "芭提雅最佳大麻店 — 可以核验的商家页面",
      intro: "Labs Cannabis 位于南芭提雅 32 Pattaya 13 Alley。评分、照片和营业时间请以 Google 上实时的 LABS DISPENSARY 页面为准，这些信息会变动。",
      sections: [
        { h2: "本页“最佳”指什么", body: "不是给全城店铺排名，而是 Walking Street 附近可核验的持证实体店。" },
        { h2: "先核验页面再问菜单", body: "打开 Google，再用 WhatsApp 问今日花。高分不能代替到柜台看今天的实物。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Google 页面，若要去 32 Pattaya 13 Alley 再发 WhatsApp。",
    },
    ko: {
      h1: "파타야 최고 매장 — 확인할 수 있는 등록 정보",
      intro: "Labs Cannabis는 남파타야 32 Pattaya 13 Alley에 있습니다. 평점과 사진, 영업시간은 Google의 실시간 LABS DISPENSARY 정보에서 확인하세요. 이 정보는 바뀔 수 있습니다.",
      sections: [
        { h2: "이 페이지의 최고 의미", body: "파타야 모든 매장 순위가 아니라 Walking Street 근처에서 확인 가능한 허가받은 매장입니다." },
        { h2: "등록 정보 확인 후 문의", body: "Google을 연 뒤 WhatsApp으로 오늘 flower를 문의하세요. 평점은 카운터에서 오늘 물건을 직접 보는 것을 대체하지 않습니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Google 정보를 연 뒤 32 Pattaya 13 Alley 방문이 맞으면 WhatsApp하세요.",
    },
    ja: {
      h1: "パタヤ最高の店 — 確認できる掲載情報",
      intro: "Labs Cannabisは南パタヤ32 Pattaya 13 Alleyにあります。評価や写真、営業時間はGoogleの最新LABS DISPENSARY掲載情報でご確認ください。これらは変わることがあります。",
      sections: [
        { h2: "このページの「最高」", body: "パタヤ全店のランキングではなく、Walking Street近くで確認できる認可店です。" },
        { h2: "掲載を確認してからメニュー", body: "Googleを開き、WhatsAppで本日の花を確認してください。高評価は、カウンターで実物を見ることの代わりにはなりません。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "Google掲載を開き、32 Pattaya 13 Alleyに行くならWhatsAppしてください。",
    },
  },
  "labs-dispensary-pattaya": {
    en: {
      h1: "LABS DISPENSARY Pattaya — Google Maps listing and directions",
      intro:
        "Google Maps currently lists the place at 32 Pattaya 13 Alley as LABS DISPENSARY. This website uses the Labs Cannabis name and links to that live listing for the current pin and route.",
      sections: [
        {
          h2: "One verified public listing",
          body:
            "The website and Maps listing publish the same address and phone. Listing details may change, so open the live Maps card before travelling.",
        },
        {
          h2: "Plan a visit",
          body:
            "Use Maps for the current route, and WhatsApp to ask what is in the shop today, how to find the door and what to bring with you. The website itself takes no orders and no payments — the counter does that, in person.",
        },
      ],
      faq: COMPLIANCE_FAQ.en,
      closing: "Open the LABS DISPENSARY Maps listing for the current pin and directions.",
    },
    ru: {
      h1: "LABS DISPENSARY Паттайя — карточка Google Maps и маршрут",
      intro:
        "Google Maps сейчас показывает точку по адресу 32 Pattaya 13 Alley как LABS DISPENSARY. Сайт использует название Labs Cannabis и ведёт на эту живую карточку с пином и маршрутом.",
      sections: [
        {
          h2: "Одна проверяемая публичная карточка",
          body:
            "На сайте и в карточке Maps совпадают адрес и телефон. Данные карточки могут меняться — откройте её перед поездкой.",
        },
        {
          h2: "Планирование визита",
          body:
            "Маршрут смотрите в Maps, а в WhatsApp спросите, что сегодня в магазине, как найти вход и что взять с собой. Сам сайт не принимает ни заказы, ни оплату — это делает прилавок, при личном визите.",
        },
      ],
      faq: COMPLIANCE_FAQ.ru,
      closing: "Откройте карточку LABS DISPENSARY в Maps для актуального пина и маршрута.",
    },
    th: {
      h1: "LABS DISPENSARY พัทยา — Google Maps และเส้นทาง",
      intro: "Google Maps แสดงสถานที่ที่ 32 Pattaya 13 Alley ในชื่อ LABS DISPENSARY เว็บไซต์นี้ใช้ชื่อ Labs Cannabis และเชื่อมไปยังรายการนั้น",
      sections: [
        { h2: "รายการสาธารณะที่ตรวจสอบได้", body: "เว็บไซต์และ Maps แสดงที่อยู่และโทรศัพท์เดียวกัน โปรดเปิดรายการสดก่อนเดินทาง" },
        { h2: "วางแผนการเยี่ยมชม", body: "ใช้ Maps ดูเส้นทาง และทัก WhatsApp ถามว่าวันนี้ที่ร้านมีอะไร เข้าประตูทางไหน ต้องเตรียมอะไรมา ตัวเว็บไซต์ไม่รับคำสั่งซื้อและไม่รับชำระเงิน ทุกอย่างทำที่หน้าร้าน" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิดรายการ LABS DISPENSARY ใน Maps เพื่อดูหมุดและเส้นทางล่าสุด",
    },
    ar: {
      h1: "LABS DISPENSARY باتايا — بطاقة Google Maps والاتجاهات",
      intro: "تعرض Google Maps المكان في 32 Pattaya 13 Alley باسم LABS DISPENSARY. يستخدم الموقع اسم Labs Cannabis ويرتبط بهذه البطاقة.",
      sections: [
        { h2: "بطاقة عامة قابلة للتحقق", body: "يعرض الموقع وMaps العنوان والهاتف نفسيهما. افتح البطاقة المباشرة قبل السفر." },
        { h2: "خطط للزيارة", body: "استخدم Maps للمسار، واسأل على WhatsApp عما هو موجود في المتجر اليوم وكيف تصل إلى الباب وماذا تحضر معك. الموقع نفسه لا يقبل الطلبات ولا المدفوعات؛ ذلك يتم عند الطاولة شخصياً." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح بطاقة LABS DISPENSARY على Maps للدبوس والمسار الحاليين.",
    },
    zh: {
      h1: "LABS DISPENSARY 芭提雅 — Google Maps 页面与路线",
      intro: "Google Maps 目前将 32 Pattaya 13 Alley 的地点显示为 LABS DISPENSARY。本网站使用 Labs Cannabis 名称并链接到该页面。",
      sections: [
        { h2: "可核验的公开页面", body: "本网站与 Maps 显示相同地址和电话。出发前请打开实时页面。" },
        { h2: "规划到店", body: "用 Maps 查看路线，用 WhatsApp 问今天店里有什么、门在哪里、需要带什么。网站本身不接受订单与付款，这些都在店内当面完成。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Maps 上的 LABS DISPENSARY 页面查看当前定位与路线。",
    },
    ko: {
      h1: "LABS DISPENSARY 파타야 — Google Maps 정보와 경로",
      intro: "Google Maps는 32 Pattaya 13 Alley의 장소를 LABS DISPENSARY로 표시합니다. 웹사이트는 Labs Cannabis 이름을 사용하며 해당 정보에 연결합니다.",
      sections: [
        { h2: "확인 가능한 공개 정보", body: "웹사이트와 Maps는 같은 주소와 전화번호를 표시합니다. 출발 전 실시간 정보를 여세요." },
        { h2: "방문 계획", body: "Maps에서 경로를 확인하고, 오늘 매장에 무엇이 있는지, 입구를 어떻게 찾는지, 무엇을 가져와야 하는지는 WhatsApp으로 물어보세요. 사이트 자체는 주문도 결제도 받지 않으며, 그것은 매장에서 직접 이루어집니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Maps의 LABS DISPENSARY 정보에서 현재 핀과 경로를 확인하세요.",
    },
    ja: {
      h1: "LABS DISPENSARY パタヤ — Google Maps と経路",
      intro: "Google Maps は 32 Pattaya 13 Alley の場所を LABS DISPENSARY と表示しています。このサイトは Labs Cannabis 名を使用し、そのリスティングへリンクします。",
      sections: [
        { h2: "確認可能な公開リスティング", body: "サイトと Maps は同じ住所と電話番号を掲載しています。移動前に最新情報を開いてください。" },
        { h2: "訪問を計画", body: "Maps で経路を確認し、今日の店内の様子、入口の場所、持ち物は WhatsApp で聞いてください。サイト自体は注文も支払いも受け付けません。それは店頭で直接行います。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "Maps の LABS DISPENSARY リスティングで現在のピンと経路を確認してください。",
    },
  },
  "cannabis-wholesale-pattaya": {
    en: {
      h1: "Cannabis wholesale inquiry in Pattaya",
      intro:
        "Bulk and wholesale flower questions for Pattaya are handled privately in WhatsApp for adults 20+ and verified counterparties. The public site does not publish a live wholesale stock list, reserve lots, or accept payment. Listed large tiers on the site, including 100g and 1kg, are conversation starters only.",
      sections: [
        {
          h2: "What to send in the first message",
          body:
            "Include buyer context, target volume range, preferred grade or grow type if you have one, and whether you need Pattaya handover. Ask which lots, photos, or documents are actually available. Lab-tested language is used only when a specific batch supports it.",
        },
        {
          h2: "Pattaya handover is not an online shipment",
          body:
            "Thailand-wide or farm-supply questions belong on the CannaThai wholesale page. This page is for Pattaya bulk inquiry. Timing, route, and any handover possibility are reviewed after details are checked — never as an online sale.",
        },
      ],
      faq: [
        {
          q: "Can I get a public wholesale price list?",
          a: "No. Request the current batch list and a quote in WhatsApp with your buyer context and target volume.",
        },
        {
          q: "Does the website confirm 100g or 1kg stock?",
          a: "No. Large listed tiers are not a live inventory feed. Availability is checked privately.",
        },
        {
          q: "Is this the same as CannaThai?",
          a: "CannaThai is the Thailand wholesale inquiry track. This page is the Pattaya bulk/local wholesale ask. Both go through WhatsApp.",
        },
      ],
      closing: "WhatsApp your volume range and Pattaya context. Do not expect a public wholesale cart.",
    },
    ru: {
      h1: "Оптовый запрос каннабиса в Паттайе",
      intro:
        "Опт и bulk flower по Паттайе обсуждаются приватно в WhatsApp для взрослых 20+ и проверенных контрагентов. Сайт не публикует живой оптовый сток, не резервирует партии и не принимает оплату. Крупные веса на сайте, включая 100г и 1кг, — только старт разговора.",
      sections: [
        {
          h2: "Что написать в первом сообщении",
          body:
            "Контекст покупателя, целевой объём, желаемый грейд или тип выращивания, нужна ли передача в Паттайе. Спросите, какие лоты, фото или документы реально есть. Формулировка lab-tested — только если конкретная партия это подтверждает.",
        },
        {
          h2: "Передача в Паттайе — не онлайн-отправка",
          body:
            "Вопросы по Таиланду и фермам — на странице CannaThai. Эта страница про опт в Паттайе. Сроки, маршрут и возможность передачи смотрят после проверки деталей, а не оформляют онлайн.",
        },
      ],
      faq: [
        { q: "Есть публичный оптовый прайс?", a: "Нет. Запросите batch list и котировку в WhatsApp с контекстом и объёмом." },
        { q: "Сайт подтверждает сток 100г или 1кг?", a: "Нет. Крупные веса на сайте — не живой инвентарь." },
        { q: "Это то же самое, что CannaThai?", a: "CannaThai — оптовый трек по Таиланду. Эта страница — локальный/паттайский bulk-запрос. Оба идут в WhatsApp." },
      ],
      closing: "Напишите объём и контекст по Паттайе в WhatsApp. Публичной оптовой корзины нет.",
    },
    th: {
      h1: "สอบถามกัญชาขายส่งในพัทยา",
      intro: "คำถาม bulk และขายส่งในพัทยาคุยส่วนตัวใน WhatsApp สำหรับผู้ใหญ่ 20+ และคู่ค้าที่ตรวจสอบแล้ว เว็บไม่แสดงสต็อกขายส่งสด ไม่จองล็อต และไม่รับชำระ น้ำหนักใหญ่บนเว็บรวม 100g และ 1kg เป็นจุดเริ่มคุยเท่านั้น",
      sections: [
        { h2: "ควรส่งอะไรในข้อความแรก", body: "บริบทผู้ซื้อ ปริมาณ เกรดหรือ grow type และการรับในพัทยา ถามว่าล็อต รูป หรือเอกสารมีจริง คำว่า lab-tested ใช้เมื่อล็อตนั้นรองรับ" },
        { h2: "การรับในพัทยาไม่ใช่การส่งออนไลน์", body: "คำถามทั้งประเทศอยู่หน้า CannaThai หน้านี้สำหรับขายส่งพัทยา" },
      ],
      faq: [
        { q: "มีราคาขายส่งสาธารณะไหม?", a: "ไม่มี ขอ batch list ใน WhatsApp" },
        { q: "เว็บยืนยันสต็อก 100g หรือ 1kg ไหม?", a: "ไม่ยืนยัน" },
        { q: "คือ CannaThai ไหม?", a: "CannaThai เป็นช่องทางขายส่งไทย หน้านี้เป็นคำถาม bulk ในพัทยา ทั้งคู่ผ่าน WhatsApp" },
      ],
      closing: "ส่งช่วงปริมาณและบริบทพัทยาทาง WhatsApp",
    },
    ar: {
      h1: "استعلام القنب بالجملة في باتايا",
      intro: "أسئلة الجملة في باتايا تُناقش في WhatsApp للبالغين 20+ والأطراف الموثقة. الموقع لا ينشر مخزون جملة مباشر.",
      sections: [
        { h2: "ماذا ترسل أولاً", body: "سياق المشتري والكمية والدرجة وما إذا كنت تحتاج تسليم باتايا." },
        { h2: "تسليم باتايا ليس شحنة عبر الموقع", body: "أسئلة تايلاند الأوسع على صفحة CannaThai." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "أرسل نطاق الكمية وسياق باتايا عبر WhatsApp.",
    },
    zh: {
      h1: "芭提雅大麻批发咨询",
      intro: "芭提雅批量/批发咨询在 WhatsApp 私下进行。网站不发布实时批发库存、不预留、不收款。100克和1公斤等大档仅作对话入口。",
      sections: [
        { h2: "第一条消息写什么", body: "买家背景、目标数量、等级、是否需要芭提雅交接。lab-tested 仅在具体批次支持时使用。" },
        { h2: "芭提雅交接不是网站发货", body: "泰国范围问题请看 CannaThai 页面。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "用 WhatsApp 发送数量范围和芭提雅背景。",
    },
    ko: {
      h1: "파타야 대마초 도매 문의",
      intro: "파타야 도매/대량 문의는 WhatsApp에서 비공개로 진행합니다. 사이트는 실시간 도매 재고를 게시하거나 결제하지 않습니다. 100g, 1kg 표시는 대화 시작점입니다.",
      sections: [
        { h2: "첫 메시지에 넣을 내용", body: "구매자 맥락, 수량, 등급, 파타야 인계 여부. lab-tested는 해당 배치 문서가 있을 때만 사용합니다." },
        { h2: "파타야 인계는 온라인 배송이 아닙니다", body: "태국 전역 문의는 CannaThai 페이지를 이용하세요." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "수량 범위와 파타야 맥락을 WhatsApp으로 보내세요.",
    },
    ja: {
      h1: "パタヤの大麻卸売問い合わせ",
      intro: "パタヤの卸・バルク問い合わせはWhatsAppの非公開確認です。サイトは卸在庫の公開、予約、支払いをしません。100gや1kgの掲載は会話の入口です。",
      sections: [
        { h2: "最初のメッセージ", body: "バイヤー情報、数量、グレード、パタヤでの受け渡し希望。lab-testedは当該バッチの文書がある場合のみ。" },
        { h2: "パタヤ受け渡しはサイト出荷ではない", body: "タイ全国の問い合わせはCannaThaiページへ。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "数量レンジとパタヤの背景をWhatsAppで送ってください。",
    },
  },
};

/**
 * Описание страницы для сниппета: рез по границе, а не по счётчику символов.
 *
 * ЧТО БЫЛО. `text.slice(0, max - 1) + "..."` — жёсткий рез по символу. Замер по
 * собранным страницам: ровно восемь описаний заканчивались многоточием, и это
 * были восемь самых коммерческих URL набора — `buy-`, `best-`, `cheap-` и
 * брендовая страница на en и ru. В выдаче они обрывались посреди слова:
 * «…Adults 20+ who hold a Thai prescripti...», «…живую карточку с п...».
 * Обрыв посреди слова — это не «сокращено», это «страница выглядит сломанной»
 * ровно там, где решение о клике и принимается. Заодно рез приходился на 162-й
 * символ при заявленной цели 160: `+ "..."` дописывался ПОСЛЕ среза.
 *
 * ЧТО СТАЛО. Сначала пробуем закончить предложение, потом — слово, и никакого
 * многоточия: незаконченная мысль лучше читается как законченная фраза, чем
 * как обрыв. Порог 155 — под то, что Google реально рисует в мобильной выдаче.
 *
 * Граница предложения ищется и в латинской, и в восточноазиатской пунктуации:
 * у CJK-локалей пробелов между словами нет, и словесный запасной вариант там
 * не сработал бы вовсе. Если ни одна граница не нашлась достаточно далеко
 * (короче 60% лимита описание обрезать бессмысленно — потеряется предмет),
 * режем по символу, но по-прежнему без многоточия.
 *
 * Одно значение уезжает в четыре места сразу: `meta description`,
 * `og:description`, `twitter:description` и `description` в JSON-LD
 * (`src/layouts/PageLayout.astro`), поэтому починка здесь чинит все четыре.
 */
const SENTENCE_TERMINATORS = [".", "!", "?", "。", "！", "？", "۔", "؟"];

export function seoDescription(content: SeoContent, max = 155): string {
  const text = content.intro.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  const window = text.slice(0, max);
  const floor = Math.floor(max * 0.6);

  const sentenceEnd = Math.max(...SENTENCE_TERMINATORS.map((mark) => window.lastIndexOf(mark)));
  if (sentenceEnd >= floor) return window.slice(0, sentenceEnd + 1).trim();

  const wordEnd = window.lastIndexOf(" ");
  if (wordEnd >= floor) return window.slice(0, wordEnd).trim();

  return window.trim();
}

/**
 * Контент SEO-страницы: ручная копия (приоритет) + разделы и FAQ из
 * `content-cache`. Если нет ни того, ни другого — сборка падает с именем слага.
 */
/**
 * Подстановка вычисленных расстояний в готовый текст.
 *
 * Раньше в этом файле стояли две рукописные и РАЗНЫЕ оценки пути от Walking
 * Street — одна в лиде, другая в FAQ той же страницы, — причём вторая уезжала
 * ещё и в FAQPage JSON-LD. Отчёт T-03 их не поймал, потому что грепом
 * проверяли `visit-copy.ts`, `area-routes.ts` и `page-depth.ts`, а `content.ts`
 * в список не попал. Теперь значение одно и приходит из `describeLandmarkWalk()`
 * — того же гаверсинуса, что и на страницах районов.
 */
function renderWalkPlaceholders(content: SeoContent, locale: Locale): SeoContent {
  const vars = {
    walkingStreet: describeLandmarkWalk("walking-street", locale) ?? "",
    jomtien: describeLandmarkWalk("jomtien-beach", locale) ?? "",
  };
  const render = (text: string) => renderCopy(text, vars);
  return {
    ...content,
    h1: render(content.h1),
    intro: render(content.intro),
    sections: content.sections.map((section) => ({ ...section, body: render(section.body) })),
    faq: content.faq.map((item) => ({ q: item.q, a: render(item.a) })),
    closing: render(content.closing),
  };
}

export function loadSeoContent(locale: Locale, slug: string): SeoContent {
  const curated = PAGE_COPY[slug]?.[locale];
  const cached = loadCachedSeoContent(locale, slug);
  /**
   * Добавочная глубина (волна 2) приклеивается последней и тем же
   * `mergeSeoContent`: заголовки и вопросы дедуплицируются, поэтому раздел,
   * тема которого уже есть в ручной копии или в кэше, просто не отрисуется.
   */
  const depth = getPageDepth(locale, slug);
  const withDepth = (content: SeoContent): SeoContent =>
    depth ? mergeSeoContent(content, { ...content, ...depth }) : content;

  if (curated && cached) {
    return renderWalkPlaceholders(withDepth(mergeSeoContent({ ...curated, source: "fallback" }, cached)), locale);
  }
  if (curated) return renderWalkPlaceholders(withDepth({ ...curated, source: "fallback" }), locale);
  if (cached) return renderWalkPlaceholders(withDepth(cached), locale);

  /**
   * Единственный безопасный дефолт здесь — отказ сборки.
   *
   * Раньше ниже лежал фолбэк-объект: H1 «Labs Cannabis Pattaya menu inquiry»,
   * intro про «fresh flower, effects», разделы «Check the fresh menu first» и
   * «Plan pickup or delivery possibility». Он был недостижим только потому, что
   * `CONTENT_GAP_ALLOWLIST` был пустым `Set`, — одной строки в этом множестве
   * хватило бы, чтобы меню, подбор по эффекту и доставка вышли в публикацию,
   * причём по-английски на любой из семи локалей. Ни одна из тех формулировок
   * не ловится линтером: правило `delivery-offer-en` не знает «pickup or
   * delivery possibility», а правил на «menu» и «effects» нет вовсе.
   *
   * Слаг без текста не должен становиться indexable — за этим следит allowlist
   * в `src/lib/index-policy.mjs`, а `loadSeoContent` вызывается только для
   * indexable-страниц. Если такое всё же произошло, сборка обязана упасть с
   * именем слага, а не тихо отдать рекламную заглушку.
   */
  throw new Error(
    `No SEO content for "${slug}" in locale "${locale}": add it to PAGE_COPY (src/lib/content.ts) ` +
      `or to content-cache/${locale}/${slug}.json before making the page indexable.`,
  );
}

export const HOME_FAQ = COMPLIANCE_FAQ.en;
