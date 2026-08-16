import type { Locale } from "@/lib/i18n";

export interface SeoContent {
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  closing: string;
  source?: "openai" | "fallback";
}

const COMPLIANCE_FAQ: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: "Can I order or pay through this website?",
      a: "No. This website does not accept orders or payments. Use it for the public address, directions, and the current official-rules guide.",
    },
    {
      q: "What can I ask on WhatsApp?",
      a: "Use WhatsApp only if you need help finding the published address or coordinating a visit. Do not send an order or payment.",
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
      a: "Только чтобы уточнить, как найти опубликованный адрес, или скоординировать визит. Не отправляйте заказ или оплату.",
    },
    {
      q: "Где проверить актуальные правила?",
      a: "Читайте legal guide на сайте и переходите к указанным там источникам правительства Таиланда. Правила могут меняться.",
    },
  ],
  th: [
    {
      q: "สั่งหรือจ่ายเงินบนเว็บได้ไหม?",
      a: "ไม่ได้ เว็บไซต์นี้ไม่รับคำสั่งซื้อหรือการชำระเงิน ใช้สำหรับที่อยู่ เส้นทาง และคู่มือกฎปัจจุบัน",
    },
    {
      q: "ใช้ WhatsApp เพื่ออะไรได้บ้าง?",
      a: "ใช้เพื่อขอความช่วยเหลือในการหาที่อยู่หรือประสานการเยี่ยมชมเท่านั้น ไม่ส่งคำสั่งซื้อหรือการชำระเงิน",
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
      a: "استخدمه فقط للمساعدة في العثور على العنوان المنشور أو تنسيق الزيارة. لا ترسل طلباً أو دفعة.",
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
      a: "仅用于协助查找公开地址或协调到店。请勿发送订单或付款。",
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
      a: "공개 주소를 찾거나 방문을 조율하는 도움에만 사용하세요. 주문이나 결제를 보내지 마세요.",
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
      a: "公開住所を見つける支援や来店調整のみに使用してください。注文や支払いは送らないでください。",
    },
    {
      q: "現在のルールはどこで確認できますか？",
      a: "サイトの法的ガイドと、リンクされたタイ政府情報を確認してください。ルールは変更される場合があります。",
    },
  ],
};

const PAGE_COPY: Record<string, Record<Locale, Omit<SeoContent, "source">>> = {
  "buy-cannabis-pattaya": {
    en: {
      h1: "Buy cannabis in Pattaya from a walk-in shop on Soi Hollywood",
      intro:
        "Labs Cannabis is a physical shop at 32 Pattaya 13 Alley (Soi Hollywood), a short walk from Walking Street. Adults 20+ can check today's flower, effects, listed weight tiers, and directions before visiting. Current availability is confirmed in WhatsApp, not through a public cart.",
      sections: [
        {
          h2: "Start with today's menu, not a screenshot",
          body:
            "Ask which indoor flower is fresh today, which effect you want, and whether pre-rolls or listed deals are available. The site shows the shop, listed tiers, and contact path. Stock, photos, and batch notes are checked privately before you travel across Pattaya.",
        },
        {
          h2: "Walk in from Walking Street or message first",
          body:
            "From Walking Street, enter Pattaya 13 Alley / Soi Hollywood and look for Labs Cannabis, formerly listed as Labs Dispensary. Listed hours on the site are 12:00-01:00; Google Maps is the source of truth if the listing changes. WhatsApp is the fastest way to confirm menu, pickup timing, or delivery possibility.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.en,
        {
          q: "How far is the shop from Walking Street?",
          a: "The shop is on Soi Hollywood (Pattaya 13 Alley), a short walk from Walking Street. Open Google Maps for the live route.",
        },
      ],
      closing: "Message Labs Cannabis on WhatsApp for today's menu, then walk in on Soi Hollywood or ask whether pickup timing fits.",
    },
    ru: {
      h1: "Купить каннабис в Паттайе — магазин на Soi Hollywood",
      intro:
        "Labs Cannabis — физический магазин по адресу 32 Pattaya 13 Alley (Soi Hollywood), недалеко от Walking Street. Взрослые 20+ могут проверить сегодняшние цветы, эффекты, указанные веса и маршрут до визита. Наличие подтверждается в WhatsApp, не через публичную корзину.",
      sections: [
        {
          h2: "Начните с меню дня, а не со скриншота",
          body:
            "Спросите, какой indoor свежий сегодня, какой эффект нужен и есть ли pre-rolls или указанные deals. Сайт показывает магазин, веса и контакт. Сток, фото и заметки по партии проверяются приватно до поездки по Паттайе.",
        },
        {
          h2: "Зайдите с Walking Street или напишите сначала",
          body:
            "С Walking Street заверните в Pattaya 13 Alley / Soi Hollywood и ищите Labs Cannabis, ранее Labs Dispensary. На сайте указано 12:00-01:00; если listing изменится, ориентир — Google Maps. WhatsApp быстрее всего подтверждает меню, самовывоз или возможность доставки.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.ru,
        {
          q: "Как далеко от Walking Street?",
          a: "Магазин на Soi Hollywood (Pattaya 13 Alley), короткая прогулка от Walking Street. Живой маршрут — в Google Maps.",
        },
      ],
      closing: "Напишите в WhatsApp за меню дня, затем заходите на Soi Hollywood или уточните самовывоз.",
    },
    th: {
      h1: "ซื้อกัญชา พัทยา — ร้านบนซอยฮอลลีวูด",
      intro:
        "Labs Cannabis เป็นร้านจริงที่ 32 Pattaya 13 Alley (Soi Hollywood) เดินไม่ไกลจาก Walking Street ผู้ใหญ่ 20+ เช็คดอกวันนี้ เอฟเฟกต์ ราคาตามน้ำหนักที่ระบุ และเส้นทางก่อนมา สต็อกยืนยันใน WhatsApp ไม่ใช่ตะกร้าสาธารณะ",
      sections: [
        {
          h2: "เริ่มจากเมนูวันนี้",
          body:
            "ถามว่าดอก indoor ไหนสดวันนี้ ต้องการเอฟเฟกต์แบบไหน และมี pre-rolls หรือ deals ที่ระบุหรือไม่ เว็บแสดงร้าน น้ำหนัก และช่องทางติดต่อ",
        },
        {
          h2: "เดินจาก Walking Street หรือทักก่อน",
          body:
            "จาก Walking Street เข้า Pattaya 13 Alley / Soi Hollywood หาร้าน Labs Cannabis เดิม Labs Dispensary เวลาบนเว็บ 12:00-01:00 หาก listing เปลี่ยนให้ดู Google Maps",
        },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "ทัก WhatsApp เพื่อขอเมนูวันนี้ แล้วแวะ Soi Hollywood หรือถามเวลา pickup",
    },
    ar: {
      h1: "شراء القنب في باتايا — متجر Soi Hollywood",
      intro:
        "Labs Cannabis متجر فعلي في 32 Pattaya 13 Alley (Soi Hollywood) على مسافة قصيرة من Walking Street. يمكن للبالغين 20+ التحقق من الزهور اليوم والتأثيرات والأوزان المعلنة قبل الزيارة. التوفر يؤكد في WhatsApp.",
      sections: [
        { h2: "ابدأ بقائمة اليوم", body: "اسأل عن الزهور الداخلية الطازجة اليوم والتأثير المطلوب وpre-rolls أو العروض المعلنة." },
        { h2: "امشِ من Walking Street أو راسلنا أولاً", body: "من Walking Street ادخل Pattaya 13 Alley / Soi Hollywood. ساعات الموقع 12:00-01:00، وGoogle Maps مصدر الحقيقة للقائمة." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "راسل WhatsApp لقائمة اليوم ثم زر Soi Hollywood أو اسأل عن الاستلام.",
    },
    zh: {
      h1: "在芭提雅购买大麻 — Soi Hollywood 实体店",
      intro:
        "Labs Cannabis 位于 32 Pattaya 13 Alley (Soi Hollywood)，步行即可到 Walking Street。20+ 成人可先确认今日花、效果、已列重量档和路线。库存在 WhatsApp 确认。",
      sections: [
        { h2: "先看今日菜单", body: "询问今天新鲜的 indoor flower、想要的效果，以及是否有已列的 pre-rolls 或 deals。" },
        { h2: "从 Walking Street 步行或先发消息", body: "进入 Pattaya 13 Alley / Soi Hollywood。网站列出 12:00-01:00；若 Google 列表变更，以 Maps 为准。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "先用 WhatsApp 要今日菜单，再到 Soi Hollywood，或询问取货时间。",
    },
    ko: {
      h1: "파타야에서 대마초 구매 — Soi Hollywood 매장",
      intro:
        "Labs Cannabis는 Walking Street에서 가까운 32 Pattaya 13 Alley (Soi Hollywood)의 실제 매장입니다. 성인 20+는 방문 전 오늘 flower, 효과, 표시된 중량, 길을 확인할 수 있습니다. 재고는 WhatsApp에서 확인합니다.",
      sections: [
        { h2: "오늘 메뉴부터", body: "오늘 신선한 indoor flower, 원하는 효과, 표시된 pre-rolls 또는 deals를 문의하세요." },
        { h2: "Walking Street에서 걷거나 먼저 메시지", body: "Pattaya 13 Alley / Soi Hollywood로 들어오세요. 사이트 시간은 12:00-01:00이며, 리스팅 변경 시 Google Maps가 기준입니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "WhatsApp으로 오늘 메뉴를 받은 뒤 Soi Hollywood를 방문하거나 픽업 시간을 문의하세요.",
    },
    ja: {
      h1: "パタヤで大麻を購入 — Soi Hollywood店舗",
      intro:
        "Labs Cannabisは Walking Street から近い 32 Pattaya 13 Alley (Soi Hollywood) の実店舗です。20歳以上は来店前に本日の花、効果、掲載重量、道順を確認できます。在庫はWhatsAppで確認します。",
      sections: [
        { h2: "本日のメニューから", body: "今日新鮮なindoor flower、欲しい効果、掲載のpre-rollsやdealsを聞いてください。" },
        { h2: "Walking Streetから歩く、または先に連絡", body: "Pattaya 13 Alley / Soi Hollywoodへ。サイト上の時間は12:00-01:00。掲載が変わればGoogle Mapsが基準です。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "WhatsAppで本日のメニューを確認してから Soi Hollywood へ。受け取り時間も聞けます。",
    },
  },
  "cannabis-near-me-pattaya": {
    en: {
      h1: "Cannabis shop near you in Pattaya",
      intro:
        "If you searched for the Labs location in Pattaya, use the live LABS DISPENSARY Google Maps listing for the current pin and route to 32 Pattaya 13 Alley.",
      sections: [
        {
          h2: "Verify the public listing",
          body:
            "The Maps listing and this website publish the same address and phone. The website uses Labs Cannabis; Google Maps currently shows LABS DISPENSARY.",
        },
        {
          h2: "Plan the route before travelling",
          body:
            "Open Maps from your current location for walking or driving directions. Use WhatsApp only if you need help finding the published address.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.en,
        {
          q: "How do I find the current route?",
          a: "Open the live Google Maps listing from your current location. It provides the current walking or driving route.",
        },
      ],
      closing: "Open the live Maps listing for the pin and route. Use WhatsApp only if you need directions help.",
    },
    ru: {
      h1: "Каннабис-шоп рядом с вами в Паттайе",
      intro:
        "Если вы ищете локацию Labs в Паттайе, откройте актуальную карточку LABS DISPENSARY в Google Maps и маршрут к адресу 32 Pattaya 13 Alley.",
      sections: [
        {
          h2: "Проверьте публичную карточку",
          body:
            "В карточке Maps и на сайте опубликованы одинаковые адрес и телефон. Сайт использует Labs Cannabis, а Google Maps сейчас показывает LABS DISPENSARY.",
        },
        {
          h2: "Постройте маршрут до поездки",
          body:
            "Откройте Maps из текущей точки для пешего или автомобильного маршрута. WhatsApp используйте только если нужна помощь с адресом.",
        },
      ],
      faq: [
        ...COMPLIANCE_FAQ.ru,
        {
          q: "Где посмотреть актуальный маршрут?",
          a: "Откройте живую карточку Google Maps из текущей точки: там будет пеший или автомобильный маршрут.",
        },
      ],
      closing: "Откройте Maps с актуальным пином и маршрутом. WhatsApp нужен только для помощи с адресом.",
    },
    th: {
      h1: "ร้านกัญชาใกล้คุณ พัทยา",
      intro:
        "หากกำลังค้นหาที่ตั้ง Labs ในพัทยา ให้ใช้ Google Maps รายการ LABS DISPENSARY และเส้นทางไป 32 Pattaya 13 Alley",
      sections: [
        { h2: "ตรวจสอบรายการสาธารณะ", body: "Maps และเว็บไซต์แสดงที่อยู่และโทรศัพท์เดียวกัน เว็บไซต์ใช้ Labs Cannabis ส่วน Maps แสดง LABS DISPENSARY" },
        { h2: "วางแผนเส้นทาง", body: "เปิด Maps จากตำแหน่งปัจจุบัน ใช้ WhatsApp เฉพาะเมื่อต้องการความช่วยเหลือในการหาที่อยู่" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิด Maps เพื่อดูหมุดและเส้นทางล่าสุด ใช้ WhatsApp เฉพาะเพื่อขอความช่วยเหลือด้านเส้นทาง",
    },
    ar: {
      h1: "متجر قنب قريب منك في باتايا",
      intro: "إذا كنت تبحث عن موقع Labs في باتايا، استخدم بطاقة LABS DISPENSARY المباشرة على Google Maps للوصول إلى 32 Pattaya 13 Alley.",
      sections: [
        { h2: "تحقق من البطاقة العامة", body: "تعرض Maps والموقع العنوان والهاتف نفسيهما. يستخدم الموقع Labs Cannabis وتعرض Maps اسم LABS DISPENSARY." },
        { h2: "خطط للمسار", body: "افتح Maps من موقعك الحالي. استخدم WhatsApp فقط للمساعدة في العثور على العنوان." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح Maps للدبوس والمسار الحاليين. استخدم WhatsApp فقط للمساعدة في الاتجاهات.",
    },
    zh: {
      h1: "芭提雅附近的大麻店",
      intro: "如需查找 Labs 在芭提雅的位置，请使用 Google Maps 上实时的 LABS DISPENSARY 页面前往 32 Pattaya 13 Alley。",
      sections: [
        { h2: "核对公开页面", body: "Maps 与本网站显示相同地址和电话。本网站使用 Labs Cannabis，Maps 当前显示 LABS DISPENSARY。" },
        { h2: "规划路线", body: "从当前位置打开 Maps。仅在需要查找地址帮助时使用 WhatsApp。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Maps 查看当前定位与路线。WhatsApp 仅用于路线帮助。",
    },
    ko: {
      h1: "파타야 근처 대마초 매장",
      intro: "파타야의 Labs 위치를 찾는다면 Google Maps의 실시간 LABS DISPENSARY 정보에서 32 Pattaya 13 Alley 경로를 확인하세요.",
      sections: [
        { h2: "공개 정보 확인", body: "Maps와 웹사이트는 같은 주소와 전화번호를 표시합니다. 웹사이트는 Labs Cannabis, Maps는 LABS DISPENSARY를 사용합니다." },
        { h2: "경로 계획", body: "현재 위치에서 Maps를 여세요. WhatsApp은 주소를 찾는 도움이 필요할 때만 사용하세요." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Maps에서 현재 핀과 경로를 여세요. WhatsApp은 길 안내 도움에만 사용하세요.",
    },
    ja: {
      h1: "パタヤ近くの大麻店",
      intro: "パタヤの Labs の場所を探す場合は、Google Maps の最新 LABS DISPENSARY リスティングから 32 Pattaya 13 Alley への経路を確認してください。",
      sections: [
        { h2: "公開リスティングを確認", body: "Maps とサイトは同じ住所と電話番号を掲載しています。サイト名は Labs Cannabis、Maps は LABS DISPENSARY です。" },
        { h2: "経路を確認", body: "現在地から Maps を開いてください。WhatsApp は住所を探す支援が必要な場合のみ使用します。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "Mapsで現在のピンと経路を開いてください。WhatsAppは道順の支援にのみ使用します。",
    },
  },
  "cheap-weed-pattaya": {
    en: {
      h1: "Affordable cannabis in Pattaya — listed tiers, not a hidden menu",
      intro:
        "Labs Cannabis publishes weight tiers on the site so guests can compare listed totals before WhatsApp. Current listed examples include 1g at 300฿, 10g at 1,800฿, and 30g at 4,500฿. Availability of any tier is confirmed privately. This page is not a coupon and not a public checkout.",
      sections: [
        {
          h2: "Compare listed weight tiers first",
          body:
            "Larger listed weights show a lower listed price per gram on the site. Ask which tier is actually available today. Street-price comparisons on the site are illustrative of the listed ladder, not a live competitor scrape.",
        },
        {
          h2: "Ask before assuming a deal is in stock",
          body:
            "Pre-roll or flower deals, if any, are confirmed in WhatsApp. Walk-in on Soi Hollywood if you want to see the shop after you have today's notes. Delivery possibility is separate and is never completed as an online sale.",
        },
      ],
      faq: COMPLIANCE_FAQ.en,
      closing: "Open the listed tiers, then WhatsApp to ask which weight is available today on Soi Hollywood.",
    },
    ru: {
      h1: "Доступный каннабис в Паттайе — понятные веса, без скрытого меню",
      intro:
        "Labs Cannabis публикует веса на сайте, чтобы сравнить указанные суммы до WhatsApp. Сейчас на сайте указаны примеры: 1г — 300฿, 10г — 1 800฿, 30г — 4 500฿. Наличие любой позиции подтверждается приватно. Это не купон и не checkout.",
      sections: [
        {
          h2: "Сначала сравните указанные веса",
          body:
            "На сайте у большего веса указана ниже цена за грамм. Спросите, какой вес доступен сегодня. Сравнение со street price на сайте относится к опубликованной лестнице, а не к парсингу конкурентов.",
        },
        {
          h2: "Не считайте deal подтверждённым без чата",
          body:
            "Любые deals по pre-roll или цветам подтверждаются в WhatsApp. Можно зайти на Soi Hollywood после заметок на сегодня. Доставка — отдельный вопрос и не оформляется как онлайн-продажа.",
        },
      ],
      faq: COMPLIANCE_FAQ.ru,
      closing: "Сверьте указанные веса и напишите в WhatsApp, какой объём доступен сегодня.",
    },
    th: {
      h1: "กัญชาราคาดี พัทยา — ราคาตามน้ำหนักที่ระบุ",
      intro:
        "Labs Cannabis แสดงน้ำหนักบนเว็บ เช่น 1g 300฿, 10g 1,800฿, 30g 4,500฿ สต็อกยืนยันใน WhatsApp ไม่ใช่คูปองหรือ checkout",
      sections: [
        { h2: "เทียบน้ำหนักที่ระบุก่อน", body: "น้ำหนักมากกว่าราคาต่อกรัมที่ระบุต่ำกว่า ถามว่าวันนี้มีน้ำหนักไหนบ้าง" },
        { h2: "อย่าเดาว่ามี deal", body: "deal ใด ๆ ยืนยันใน WhatsApp การจัดส่งเป็นการคุยแยก ไม่ใช่การขายออนไลน์" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "ดูน้ำหนักที่ระบุ แล้วทัก WhatsApp ว่าวันนี้มีน้ำหนักไหน",
    },
    ar: {
      h1: "قنب بأسعار معقولة في باتايا — أوزان معلنة",
      intro: "تنشر Labs Cannabis أوزاناً على الموقع مثل 1g بـ300฿ و10g بـ1,800฿ و30g بـ4,500฿. التوفر يؤكد في WhatsApp.",
      sections: [
        { h2: "قارن الأوزان المعلنة", body: "الأوزان الأكبر تظهر سعراً أقل للجرام على الموقع. اسأل ما المتاح اليوم." },
        { h2: "لا تفترض وجود عرض", body: "أي عرض يؤكد في WhatsApp. التوصيل نقاش منفصل وليس بيعاً عبر الموقع." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "راجع الأوزان المعلنة ثم اسأل في WhatsApp عما هو متاح اليوم.",
    },
    zh: {
      h1: "芭提雅实惠大麻 — 公开重量档位",
      intro: "Labs Cannabis 在网站列出重量档，例如 1克 300฿、10克 1,800฿、30克 4,500฿。是否有货在 WhatsApp 确认。",
      sections: [
        { h2: "先比较已列重量", body: "更大重量在网站上显示更低的每克标价。询问今天实际有哪个档。" },
        { h2: "不要默认有优惠", body: "任何 deal 都在 WhatsApp 确认。配送是另议，不是网站销售。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "查看已列重量，再用 WhatsApp 问今天有哪个档。",
    },
    ko: {
      h1: "파타야 합리적 대마초 — 공개 중량 가격",
      intro: "Labs Cannabis는 사이트에 1g 300฿, 10g 1,800฿, 30g 4,500฿ 등 중량을 표시합니다. 재고는 WhatsApp에서 확인합니다.",
      sections: [
        { h2: "표시된 중량부터 비교", body: "더 큰 중량은 사이트에서 그램당 표시 가격이 낮습니다. 오늘 가능한 중량을 문의하세요." },
        { h2: "딜이 있다고 단정하지 마세요", body: "딜은 WhatsApp에서 확인합니다. 배달은 별도 논의이며 온라인 판매가 아닙니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "표시된 중량을 본 뒤 WhatsApp으로 오늘 가능한 무게를 문의하세요.",
    },
    ja: {
      h1: "パタヤの手頃な大麻 — 公開されている重量価格",
      intro: "Labs Cannabisはサイトに1g 300฿、10g 1,800฿、30g 4,500฿などの重量を掲載しています。在庫はWhatsAppで確認します。",
      sections: [
        { h2: "掲載重量を先に比較", body: "大きい重量ほどサイト上のグラム単価は低く表示されます。今日どれが使えるか聞いてください。" },
        { h2: "dealがあると決めつけない", body: "dealはWhatsAppで確認。配達は別相談で、サイト販売ではありません。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "掲載重量を見てから、今日使える量をWhatsAppで確認してください。",
    },
  },
  "best-cannabis-shop-pattaya": {
    en: {
      h1: "Best cannabis shop in Pattaya — a real Soi Hollywood listing",
      intro:
        "Guests comparing cannabis shops in Pattaya usually want a verifiable Google listing, a walk-in address, and a direct chat. Labs Cannabis is on Soi Hollywood with a current Google rating of 4.8 from 91 reviews. Use Maps for the live listing; reviews and hours can change.",
      sections: [
        {
          h2: "What “best” means on this page",
          body:
            "This page does not rank every shop in Pattaya. It explains why visitors use Labs Cannabis as a default check: physical alley location near Walking Street, published weight tiers, English and Russian-capable WhatsApp contact, and a Google profile you can open before travelling.",
        },
        {
          h2: "Verify the listing, then ask the menu",
          body:
            "Open the Google profile for photos, reviews, and directions. Then WhatsApp for today's flower, effects, and whether pickup or delivery possibility can be discussed. A high rating is not a substitute for checking today's batch.",
        },
      ],
      faq: COMPLIANCE_FAQ.en,
      closing: "Open the Google listing, then message WhatsApp if Labs Cannabis looks like the right Soi Hollywood stop.",
    },
    ru: {
      h1: "Лучший каннабис-шоп в Паттайе — реальный listing на Soi Hollywood",
      intro:
        "Сравнивая шопы в Паттайе, гости обычно хотят проверяемый Google listing, адрес и прямой чат. Labs Cannabis на Soi Hollywood: сейчас 4.8 и 91 отзыв. Живой listing — в Maps; отзывы и часы могут меняться.",
      sections: [
        {
          h2: "Что здесь значит «лучший»",
          body:
            "Страница не ранжирует все магазины Паттайи. Она объясняет, зачем проверяют Labs Cannabis: физический адрес у Walking Street, опубликованные веса, WhatsApp на английском и русском, Google-профиль до поездки.",
        },
        {
          h2: "Проверьте listing, потом спросите меню",
          body:
            "Откройте Google: фото, отзывы, маршрут. Затем WhatsApp — цветы дня, эффекты, самовывоз или доставка. Высокая оценка не заменяет проверку сегодняшней партии.",
        },
      ],
      faq: COMPLIANCE_FAQ.ru,
      closing: "Откройте Google listing и напишите в WhatsApp, если это ваш стоп на Soi Hollywood.",
    },
    th: {
      h1: "ร้านกัญชาดีที่สุด พัทยา — ร้านจริงบน Soi Hollywood",
      intro: "Labs Cannabis อยู่บน Soi Hollywood คะแนน Google ปัจจุบัน 4.8 จาก 91 รีวิว ดู listing สดใน Maps",
      sections: [
        { h2: "คำว่าดีที่สุดในหน้านี้", body: "ไม่ได้จัดอันดับทุกร้านในพัทยา แต่ชี้ร้านที่ตรวจได้: ที่อยู่ใกล้ Walking Street น้ำหนักที่ระบุ WhatsApp และ Google โปรไฟล์" },
        { h2: "เช็ก listing แล้วถามเมนู", body: "เปิด Google แล้วทัก WhatsApp สำหรับดอกวันนี้ คะแนนสูงไม่ได้แทนการเช็คล็อตวันนี้" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิด Google listing แล้วทัก WhatsApp ถ้าพร้อมแวะ Soi Hollywood",
    },
    ar: {
      h1: "أفضل متجر قنب في باتايا — قائمة Google حقيقية",
      intro: "Labs Cannabis في Soi Hollywood بتقييم Google حالي 4.8 من 91 مراجعة. القائمة الحية على Maps.",
      sections: [
        { h2: "معنى الأفضل هنا", body: "الصفحة لا ترتب كل متاجر باتايا. إنها متجر يمكن التحقق منه قرب Walking Street." },
        { h2: "تحقق من القائمة ثم اسأل عن القائمة", body: "افتح Google ثم WhatsApp لزهور اليوم. التقييم لا يغني عن فحص الدفعة الحالية." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح قائمة Google ثم راسل WhatsApp.",
    },
    zh: {
      h1: "芭提雅最佳大麻店 — Soi Hollywood 真实店铺",
      intro: "Labs Cannabis 在 Soi Hollywood，当前 Google 4.8 分、91 条评价。以 Maps 上的实时列表为准。",
      sections: [
        { h2: "本页“最佳”指什么", body: "不是给全城店铺排名，而是可核验的 Walking Street 附近实体店。" },
        { h2: "先核验列表再问菜单", body: "打开 Google，再用 WhatsApp 问今日花。高分不能代替核对当前批次。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Google 列表，若要去 Soi Hollywood 再发 WhatsApp。",
    },
    ko: {
      h1: "파타야 최고 매장 — Soi Hollywood 실제 리스팅",
      intro: "Labs Cannabis는 Soi Hollywood에 있으며 현재 Google 4.8점, 91개 리뷰입니다. 실시간 리스팅은 Maps에서 확인하세요.",
      sections: [
        { h2: "이 페이지의 최고 의미", body: "파타야 모든 매장 순위가 아니라 Walking Street 근처에서 검증 가능한 매장입니다." },
        { h2: "리스팅 확인 후 메뉴 문의", body: "Google을 연 뒤 WhatsApp으로 오늘 flower를 문의하세요. 평점은 현재 배치 확인을 대체하지 않습니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Google 리스팅을 연 뒤 Soi Hollywood 방문이 맞으면 WhatsApp하세요.",
    },
    ja: {
      h1: "パタヤ最高の店 — Soi Hollywoodの実在リスティング",
      intro: "Labs Cannabisは Soi Hollywood にあり、現在のGoogle評価は4.8、91件です。最新掲載はMapsで確認してください。",
      sections: [
        { h2: "このページの「最高」", body: "パタヤ全店のランキングではなく、Walking Street近くで確認できる実店舗です。" },
        { h2: "掲載を確認してからメニュー", body: "Googleを開き、WhatsAppで本日の花を確認。高評価は現行ロット確認の代わりになりません。" },
      ],
      faq: COMPLIANCE_FAQ.ja,
      closing: "Google掲載を開き、Soi Hollywoodに行くならWhatsAppしてください。",
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
            "Use Maps for the current route. WhatsApp is available only if you need help finding the published address; this website does not accept orders or payments.",
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
            "Маршрут смотрите в Maps. WhatsApp используйте только если нужна помощь с опубликованным адресом; сайт не принимает заказы или оплату.",
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
        { h2: "วางแผนการเยี่ยมชม", body: "ใช้ Maps สำหรับเส้นทาง และ WhatsApp เฉพาะเมื่อต้องการความช่วยเหลือในการหาที่อยู่ เว็บไซต์ไม่รับคำสั่งซื้อหรือชำระเงิน" },
      ],
      faq: COMPLIANCE_FAQ.th,
      closing: "เปิดรายการ LABS DISPENSARY ใน Maps เพื่อดูหมุดและเส้นทางล่าสุด",
    },
    ar: {
      h1: "LABS DISPENSARY باتايا — بطاقة Google Maps والاتجاهات",
      intro: "تعرض Google Maps المكان في 32 Pattaya 13 Alley باسم LABS DISPENSARY. يستخدم الموقع اسم Labs Cannabis ويرتبط بهذه البطاقة.",
      sections: [
        { h2: "بطاقة عامة قابلة للتحقق", body: "يعرض الموقع وMaps العنوان والهاتف نفسيهما. افتح البطاقة المباشرة قبل السفر." },
        { h2: "خطط للزيارة", body: "استخدم Maps للمسار وWhatsApp فقط للمساعدة في العثور على العنوان. الموقع لا يقبل الطلبات أو المدفوعات." },
      ],
      faq: COMPLIANCE_FAQ.ar,
      closing: "افتح بطاقة LABS DISPENSARY على Maps للدبوس والمسار الحاليين.",
    },
    zh: {
      h1: "LABS DISPENSARY 芭提雅 — Google Maps 页面与路线",
      intro: "Google Maps 目前将 32 Pattaya 13 Alley 的地点显示为 LABS DISPENSARY。本网站使用 Labs Cannabis 名称并链接到该页面。",
      sections: [
        { h2: "可核验的公开页面", body: "本网站与 Maps 显示相同地址和电话。出发前请打开实时页面。" },
        { h2: "规划到店", body: "使用 Maps 查看路线，WhatsApp 仅用于协助查找地址。本网站不接受订单或付款。" },
      ],
      faq: COMPLIANCE_FAQ.zh,
      closing: "打开 Maps 上的 LABS DISPENSARY 页面查看当前定位与路线。",
    },
    ko: {
      h1: "LABS DISPENSARY 파타야 — Google Maps 정보와 경로",
      intro: "Google Maps는 32 Pattaya 13 Alley의 장소를 LABS DISPENSARY로 표시합니다. 웹사이트는 Labs Cannabis 이름을 사용하며 해당 정보에 연결합니다.",
      sections: [
        { h2: "확인 가능한 공개 정보", body: "웹사이트와 Maps는 같은 주소와 전화번호를 표시합니다. 출발 전 실시간 정보를 여세요." },
        { h2: "방문 계획", body: "Maps에서 경로를 확인하고 주소 찾기 도움이 필요할 때만 WhatsApp을 사용하세요. 사이트는 주문이나 결제를 받지 않습니다." },
      ],
      faq: COMPLIANCE_FAQ.ko,
      closing: "Maps의 LABS DISPENSARY 정보에서 현재 핀과 경로를 확인하세요.",
    },
    ja: {
      h1: "LABS DISPENSARY パタヤ — Google Maps と経路",
      intro: "Google Maps は 32 Pattaya 13 Alley の場所を LABS DISPENSARY と表示しています。このサイトは Labs Cannabis 名を使用し、そのリスティングへリンクします。",
      sections: [
        { h2: "確認可能な公開リスティング", body: "サイトと Maps は同じ住所と電話番号を掲載しています。移動前に最新情報を開いてください。" },
        { h2: "訪問を計画", body: "Maps で経路を確認し、住所を探す支援が必要な場合のみ WhatsApp を使用してください。サイトは注文や支払いを受けません。" },
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
            "Thailand-wide or farm-supply questions belong on the CannaThai wholesale page. This page is for Pattaya bulk inquiry. Timing, route, and any handover possibility are reviewed after details are checked — never as a website checkout.",
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
            "Вопросы по Таиланду и фермам — на странице CannaThai. Эта страница про опт в Паттайе. Сроки, маршрут и возможность передачи смотрят после проверки деталей, не через checkout.",
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

export function seoDescription(content: SeoContent, max = 160): string {
  const text = content.intro.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

export function loadSeoContent(locale: Locale, slug: string): SeoContent {
  const localized = PAGE_COPY[slug]?.[locale] ?? PAGE_COPY[slug]?.en;
  if (localized) {
    return { ...localized, source: "fallback" };
  }

  return {
    h1: "Labs Cannabis Pattaya menu inquiry",
    intro:
      "Product-led cannabis menu information for adults 20+ in Pattaya: fresh flower, effects, location, and WhatsApp contact before visiting Labs Cannabis.",
    sections: [
      {
        h2: "Check the fresh menu first",
        body:
          "Use WhatsApp to ask what flower is fresh today, which effects match your mood, and what details are available for current strains. The website is a storefront, not a public cart.",
      },
      {
        h2: "Plan pickup or delivery possibility",
        body:
          "Labs Cannabis is on Pattaya 13 Alley, also known as Soi Hollywood. Message your area first if you want to discuss pickup timing or delivery possibility.",
      },
    ],
    faq: COMPLIANCE_FAQ[locale] ?? COMPLIANCE_FAQ.en,
    closing: "Message Labs Cannabis on WhatsApp for today's menu, effects, freshness, and directions.",
    source: "fallback",
  };
}

export const HOME_FAQ = COMPLIANCE_FAQ.en;
