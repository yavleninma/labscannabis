/**
 * Compliance-линтер (W1-02) — узкий deny-list однозначных строк.
 *
 * В Таиланде запрещена не продажа каннабиса, а его РЕКЛАМА и публичная оферта:
 * опубликованные цены, скидки и промо, бесплатные образцы, «дёшево/самое дешёвое»,
 * онлайн-заказ и обещание «без рецепта». Санкция — приостановка лицензии.
 * Поэтому список намеренно короткий и буквальный: сюда попадают только строки,
 * которые нельзя истолковать иначе.
 *
 * ЯВНО: линтер ловит опечатки и регрессии — он НЕ является юридической проверкой.
 * Юридическую ответственность за формулировки несёт вычитка человеком.
 *
 * Allowlist: легальный гайд (`.../guides/...`) ОБЯЗАН называть суммы штрафов
 * («до 500 000 THB»), иначе он бесполезен. Поэтому денежные правила в гайде не
 * применяются. Все остальные правила (образцы, промо, «без рецепта», корзина)
 * действуют и там тоже.
 *
 * Оговорки по регулярным выражениям:
 * - `\b` в JS считает словом только [A-Za-z0-9_], поэтому для кириллицы и других
 *   алфавитов границы задаются через `(?<!\p{L})` / `(?!\p{L})` с флагом `u`;
 * - для th/zh/ja/ko границ слов нет вообще — там ищутся подстроки как есть.
 */

/** Правила, снимаемые в allowlist легального гайда. */
const MONEY = { money: true };
/**
 * Правила, у которых отрицание рядом меняет смысл на противоположный:
 * «this page does not accept online orders», «本页不提供在线订购», «暂无现行优惠» —
 * это дисклеймеры, а не оферта, и запрещать их нельзя: именно они снимают риск.
 * Отрицание ищется с обеих сторон — в японском и корейском оно стоит после
 * глагола («オンライン注文…提供していません»), в китайском и тайском — перед ним.
 */
const CONTEXTUAL = { contextual: true };
/**
 * Правила, которым разрешено эхо поискового запроса в `title`, `description` и
 * `H1`: «Best cannabis shop in Pattaya», «Доступный каннабис в Паттайе» —
 * это название интента, по которому страницу ищут, а не оценка товара.
 * В теле страницы те же слова уже описывают товар, и там правило действует.
 */
const QUERY_ECHO = { queryEcho: true };
/**
 * Правила, снимаемые в легальном гайде: он обязан цитировать нормативные пороги
 * (THC 0,2 %, размеры штрафов) — без них гайд бесполезен.
 */
const GUIDE = { guideAllowed: true };

/**
 * @param {string} id
 * @param {RegExp} pattern глобальная регулярка
 * @param {string} hint что именно запрещено и почему
 * @param {{ money?: boolean, contextual?: boolean, queryEcho?: boolean, guideAllowed?: boolean }} [options]
 */
function rule(id, pattern, hint, options = {}) {
  if (!pattern.global) throw new Error(`Compliance rule ${id} must use the g flag`);
  return Object.freeze({
    id,
    pattern,
    hint,
    money: false,
    contextual: false,
    queryEcho: false,
    guideAllowed: false,
    ...options,
  });
}

/** Источники текста, где эхо запроса законно: заголовок, описание, H1. */
const QUERY_ECHO_ORIGINS = /^(?:title|meta\[|h1$|\$\.h1$|\$\.sections\[\d+\]\.h2$)/;

export const COMPLIANCE_RULES = Object.freeze([
  // --- Цены -----------------------------------------------------------------
  rule(
    "price-baht-sign",
    /฿\s?\d|\d[\d., ]{0,12}฿/g,
    "опубликованная цена в батах",
    MONEY,
  ),
  rule(
    "price-thb",
    /\bTHB\s?\d|\d[\d., ]{0,12}\s?(?:THB\b|baht\b|บาท)/gi,
    "опубликованная цена в батах",
    MONEY,
  ),
  rule(
    "price-baht-ru",
    /\d[\d., ]{0,12}\s?бат(?:ов|а)?(?!\p{L})/giu,
    "опубликованная цена в батах",
    MONEY,
  ),
  rule(
    "price-per-gram",
    /\d[\d., ]{0,10}(?:฿|THB|baht)\s?\/\s?(?:g|гр?)(?!\p{L})/giu,
    "цена за грамм",
    MONEY,
  ),

  // --- Бесплатные образцы ---------------------------------------------------
  rule("free-sample-en", /\bfree\s(?:in-store\s|walk-in\s)?(?:samples?|testers?)\b/gi, "бесплатный образец"),
  rule("free-sample-ru", /(?<!\p{L})бесплатн\p{L}*\s(?:образ(?:ец|ц\p{L}*)|проб\p{L}+|сэмпл\p{L}*|семпл\p{L}*)/giu, "бесплатный образец"),
  rule("free-sample-th", /ตัวอย่างฟรี|แจกฟรี/g, "бесплатный образец"),
  rule("free-sample-zh", /免费样品|免费试用/g, "бесплатный образец"),
  rule("free-sample-ja", /無料サンプル|試供品/g, "бесплатный образец"),
  rule("free-sample-ko", /무료\s?샘플/g, "бесплатный образец"),
  rule("free-sample-ar", /عين(?:ة|ات)\s+مجاني/g, "бесплатный образец"),

  // --- Промо, скидки, «дёшево» ---------------------------------------------
  rule(
    "promo-en",
    // `unbeat\w*` покрывает и «unbeatably», и обрубленные формы: точное слово
    // ловило бы ровно одну запись словаря.
    /\bunbeat\w*\b|\bcheapest\b|\blowest price\b|\bbest price\b|\bspecial offer\b|\bdiscounts?\b|\bpromo(?:tion|\scode)?\b|\b\d{1,2}\s?%\s?off\b|\bbuy one get one\b|\bhappy hour\b/gi,
    "промо-формулировка",
  ),
  rule(
    "promo-ru",
    /(?<!\p{L})(?:скидк\p{L}*|акци[яию](?!\p{L})|распродаж\p{L}*|спецпредложени\p{L}*|самый\sдеш[её]вый|дешевле\sвсех|по\sсамой\sнизкой\sцене)/giu,
    "промо-формулировка",
  ),
  rule("promo-th", /โปรโมชั่น|ลดราคา|ราคาถูกที่สุด/g, "промо-формулировка"),
  // «优惠» в одиночку значит просто «выгодный» и встречается в дисклеймере
  // «暂无公开现行优惠» («действующих предложений нет»), поэтому нужен составной термин.
  rule("promo-zh", /优惠价|优惠活动|限时优惠|特价|折扣|促销|最便宜/g, "промо-формулировка"),
  rule("promo-ja", /割引|最安値|キャンペーン価格/g, "промо-формулировка"),
  rule("promo-ko", /할인|프로모션|최저가/g, "промо-формулировка"),
  rule("promo-ar", /خصم|عرض\s+خاص|أرخص/g, "промо-формулировка"),
  rule(
    "promo-joints",
    /\b\d+\s?joints?\s+(?:for|@)\b|(?<!\p{L})\d+\s?(?:косяк\p{L}*|джойнт\p{L}*)\s+за(?!\p{L})/giu,
    "штучное промо на джойнты",
  ),

  // --- Онлайн-заказ и оплата -----------------------------------------------
  rule("order-cart-en", /\badd to cart\b|\bcheckout\b|\bbuy now\b|\bshop now\b|\bproceed to payment\b/gi, "корзина/чекаут"),
  rule("order-online-en", /\bplace an order\b|\border online\b|\bpay online\b|\bonline payment\b/gi, "оферта онлайн-заказа", CONTEXTUAL),
  rule(
    "order-ru",
    /(?<!\p{L})(?:добавить\sв\sкорзину|оформить\sзаказ\p{L}*|заказать\sонлайн|купить\sонлайн|оплатить\sонлайн|онлайн-оплат\p{L}*)/giu,
    "корзина/чекаут/оферта онлайн-заказа",
    CONTEXTUAL,
  ),
  rule("order-th", /ตะกร้าสินค้า|สั่งซื้อออนไลน์|ชำระเงินออนไลน์/g, "корзина/чекаут", CONTEXTUAL),
  rule("order-zh", /加入购物车|在线订购|立即购买|在线支付/g, "корзина/чекаут", CONTEXTUAL),
  rule("order-ja", /カートに追加|オンライン注文|今すぐ購入/g, "корзина/чекаут", CONTEXTUAL),
  rule("order-ko", /장바구니|온라인\s?주문/g, "корзина/чекаут", CONTEXTUAL),
  rule("order-ar", /أضف\s+إلى\s+السلة|اطلب\s+عبر\s+الإنترنت/g, "корзина/чекаут", CONTEXTUAL),

  // --- «Без рецепта» --------------------------------------------------------
  // Формулировки-обещания. Констатация «продажа без рецепта запрещена» законна и
  // обязана оставаться в гайде, поэтому голое «без рецепта» в список не входит.
  rule(
    "no-prescription-en",
    /\bno prescription (?:needed|required|necessary)\b|\bprescription[-\s]free\b|\b(?:don'?t|do not) need a prescription\b/gi,
    "обещание «без рецепта»",
  ),
  rule(
    "no-prescription-ru",
    /(?<!\p{L})(?:рецепт\sне\s(?:нужен|требуется|обязателен)|не\sнужен\sрецепт|без\sрецепта\s(?:можно|продаём|продаем|отпускаем|доступн\p{L}*)|рецепт\s[—-]\s?формальность)/giu,
    "обещание «без рецепта»",
  ),
  rule("no-prescription-th", /ไม่ต้องใช้ใบสั่งยา|ไม่ต้องมีใบสั่งแพทย์/g, "обещание «без рецепта»"),
  rule("no-prescription-zh", /无需处方|不需要处方/g, "обещание «без рецепта»"),
  rule("no-prescription-ja", /処方箋不要|処方箋なしで/g, "обещание «без рецепта»"),
  rule("no-prescription-ko", /처방전\s?없이|처방전\s?불필요/g, "обещание «без рецепта»"),
  rule("no-prescription-ar", /بدون\s+وصفة/g, "обещание «без рецепта»"),

  // --- Медицинские обещания -------------------------------------------------
  rule(
    "medical-claim-en",
    /\b(?:cures?|heals?|treats?)\s(?:your\s)?(?:anxiety|insomnia|pain|cancer|depression|ptsd)\b/gi,
    "медицинское обещание",
  ),
  rule(
    "medical-claim-ru",
    /(?<!\p{L})(?:лечит|вылечит|излечивает)\s(?:от\s)?(?:тревог\p{L}*|бессонниц\p{L}*|боль|депресси\p{L}*|рак)/giu,
    "медицинское обещание",
  ),

  // --- Рекламный регистр ----------------------------------------------------
  // Приказ 2568 запрещает рекламу контролируемой травы «через все каналы», и
  // цена для состава нарушения не обязательна: достаточно расхваливания товара.
  // «premium», «highest quality», «best strains» — это оценка товара, а не факт
  // о магазине. В `title`/`description`/`H1` те же слова допустимы как эхо
  // запроса («Best cannabis shop in Pattaya»), см. QUERY_ECHO.
  rule(
    "ad-register-en",
    /\bpremium\b|\btop[-\s]?(?:quality|shelf|grade)\b|\b(?:highest|finest|superior|exceptional|unmatched)[-\s](?:quality|standards?|selection|service|cannabis|strains?)\b|\bhigh[-\s]quality\b|\bfinest\b|\bonly the best\b|\bbest (?:cannabis|weed|strains?|products?|selection|dispensary|shop|quality)\b|\bhigh standards\b|\baffordable\b|\bfantastic selection\b|\bpremier destination\b|\bwe pride ourselves\b/gi,
    "рекламный регистр (оценка товара)",
    QUERY_ECHO,
  ),
  rule(
    "ad-register-ru",
    /(?<!\p{L})(?:премиум\p{L}*|лучш\p{L}+\s+(?:каннабис\p{L}*|сорт\p{L}*|продукт\p{L}*|товар\p{L}*|качеств\p{L}*|выбор\p{L}*|сервис\p{L}*|магазин\p{L}*|шоп\p{L}*|диспенсери)|только\s+лучш\p{L}+|высококачественн\p{L}*|высочайш\p{L}+\s+качеств\p{L}*|высшего\s+качества|первоклассн\p{L}*|отборн\p{L}*|доступн\p{L}+\s+(?:каннабис\p{L}*|цен\p{L}*))/giu,
    "рекламный регистр (оценка товара)",
    QUERY_ECHO,
  ),
  rule("ad-register-th", /ที่ดีที่สุด|ดีที่สุด|คุณภาพสูง|คุณภาพดีเยี่ยม|พรีเมียม|ชั้นนำ/g, "рекламный регистр (оценка товара)", QUERY_ECHO),
  rule("ad-register-zh", /最好的|最佳|顶级|优质|高品质|精品|一流/g, "рекламный регистр (оценка товара)", QUERY_ECHO),
  rule("ad-register-ko", /최고급|최고의|최상급|프리미엄|고품질/g, "рекламный регистр (оценка товара)", QUERY_ECHO),
  rule("ad-register-ja", /最高品質|最高級|最高の|プレミアム|極上|高品質/g, "рекламный регистр (оценка товара)", QUERY_ECHO),
  rule("ad-register-ar", /أفضل\s+(?:منتج|جودة|متجر|أنواع|سلالات)|فاخر|جودة\s+عالية|أعلى\s+جودة|ممتازة?/g, "рекламный регистр (оценка товара)", QUERY_ECHO),

  // --- Весовые тиры ---------------------------------------------------------
  // «от 1 г до 1 кг» — публичная оферта количества: страница диспенсери,
  // называющая доступный диапазон веса, читается как прайс без цифр.
  rule(
    "weight-tier-en",
    /\b1\s?g\b[^.]{0,40}\b1\s?kg\b|\bweight (?:tiers?|categories|options)\b|\btiered weights?\b|\bin bulk\b|\bbulk (?:purchase|quantities|orders?)\b/gi,
    "весовые тиры / оптовое количество",
  ),
  rule(
    "weight-tier-ru",
    /(?<!\p{L})весов\p{L}*\s+катего\p{L}*|от\s?1\s?г(?:рамма)?\b[^.]{0,40}1\s?кг|(?<!\p{L})поделиться\s+с\s+друзьями/giu,
    "весовые тиры / передача третьим лицам",
  ),
  rule("weight-tier-th", /1\s?กรัม[^.]{0,30}1\s?กิโลกรัม|น้ำหนักตั้งแต่|ปริมาณตั้งแต่|ซื้อยกล็อต|จำนวนมาก/g, "весовые тиры / оптовое количество"),
  rule("weight-tier-zh", /1\s?克[^。]{0,25}1\s?公斤|重量档位|重量等级|批量购买/g, "весовые тиры / оптовое количество"),
  rule("weight-tier-ko", /1\s?그램[^.]{0,25}1\s?킬로|중량\s?단계|대량\s?구매/g, "весовые тиры / оптовое количество"),
  rule("weight-tier-ja", /1\s?グラム[^。]{0,25}1\s?キロ|重量帯|大量購入/g, "весовые тиры / оптовое количество"),
  rule("weight-tier-ar", /من\s?1\s?غرام[^.]{0,30}1\s?كيلو|فئات\s+الوزن|شراء\s+بالجملة/g, "весовые тиры / оптовое количество"),

  // --- Оферта доставки ------------------------------------------------------
  // Продажа каннабиса через электронные каналы запрещена с 26.06.2025, поэтому
  // «привезём к вашей двери» — реклама незаконной услуги. Дисклеймер «доставки
  // нет» обязан оставаться, отсюда CONTEXTUAL.
  rule(
    "delivery-offer-en",
    /\bto your door(?:step)?\b|\bat your doorstep\b|\bwe deliver\b|\bdelivery service\b|\bfast delivery\b|\bhome delivery\b|\bdeliver(?:ed|s)? (?:right )?to (?:you|your)\b|\border(?:ing)? from home\b/gi,
    "оферта доставки",
    CONTEXTUAL,
  ),
  rule(
    "delivery-offer-ru",
    /(?<!\p{L})доставк\p{L}*\s+(?:к\s+вашей\s+двери|прямо|по\s+Паттайе|на\s+дом|до\s+двери)|прямо\s+к\s+вашей\s+двери|организуем\s+доставку|привез[её]м\s+вам/giu,
    "оферта доставки",
    CONTEXTUAL,
  ),
  rule("delivery-offer-th", /จัดส่งถึง|ส่งตรงถึง|จัดส่งทั่ว|บริการจัดส่งกัญชา|ส่งถึงบ้าน/g, "оферта доставки", CONTEXTUAL),
  rule("delivery-offer-zh", /送货上门|上门配送|配送服务|送到您家|送货到府/g, "оферта доставки", CONTEXTUAL),
  rule("delivery-offer-ko", /배달\s?서비스|배송\s?서비스|집까지\s?배달|문\s?앞까지/g, "оферта доставки", CONTEXTUAL),
  rule("delivery-offer-ja", /配送サービス|デリバリー|ご自宅までお届け|玄関先まで/g, "оферта доставки", CONTEXTUAL),
  rule("delivery-offer-ar", /نوصل\s+لك|إلى\s+باب\s+منزلك|خدمة\s+التوصيل|التوصيل\s+إلى\s+المنزل/g, "оферта доставки", CONTEXTUAL),

  // --- Часы работы ----------------------------------------------------------
  // `HOURS.hoursVerified = false`: владелец часы не подтвердил, поэтому ни один
  // текстовый канал — включая отзывы и FAQ кэша — не имеет права их называть.
  rule(
    "hours-claim-en",
    /\bopen (?:late|24\/7|until|till)\b|\bopen daily from\b|\bwe are open from\b|\bdaily from \d/gi,
    "неподтверждённые часы работы",
  ),
  rule(
    "hours-claim-ru",
    /(?<!\p{L})(?:работа(?:ем|ют)|открыт\p{L}*)\s+(?:допоздна|до\s?\d|с\s?\d)|(?<!\p{L})до\s+поздна(?!\p{L})/giu,
    "неподтверждённые часы работы",
  ),
  rule("hours-claim-th", /เปิดถึงดึก|เปิดทุกวันตั้งแต่|เปิดตั้งแต่|เปิดกี่โมง/g, "неподтверждённые часы работы"),
  rule("hours-claim-zh", /营业到很晚|营业时间为|每天营业|开到很晚/g, "неподтверждённые часы работы"),
  rule("hours-claim-ko", /늦게까지|매일\s?\d{1,2}시|영업시간은/g, "неподтверждённые часы работы"),
  rule("hours-claim-ja", /遅くまで|毎日\d{1,2}時|営業時間は/g, "неподтверждённые часы работы"),
  rule("hours-claim-ar", /مفتوح\s+حتى\s+وقت\s+متأخر|نفتح\s+من|ساعات\s+العمل\s+من/g, "неподтверждённые часы работы"),
  // Часы как цифра. Двоеточие обязательно: точка встречается в датах
  // («26.06.2025»), тайская запись закрывается суффиксом «น.».
  rule(
    "hours-claim-time",
    /(?<!\d)(?:[01]?\d|2[0-3]):[0-5]\d(?!\d)|\d{1,2}[.:]\d{2}\s?น\./g,
    "опубликованное время работы",
  ),

  // --- Потенция и содержание THC -------------------------------------------
  // §1.6 плана: THC% — ЖЁЛТОЕ, только с решением владельца/юриста. «potent
  // strain» — уже не характеристика, а обещание крепости. Нормативные пороги
  // цитирует легальный гайд, поэтому там правило снимается.
  rule(
    "potency-en",
    /\bTHC\b|\bCBD\b|\bpotent (?:strain|flower|bud)\b|\bhigh[-\s]potency\b|\d{1,2}\s?[-–]\s?\d{1,2}\s?%/gi,
    "заявление о содержании THC/крепости",
    GUIDE,
  ),
  rule(
    "potency-ru",
    /(?<!\p{L})(?:ТГК|КБД)(?!\p{L})|(?<!\p{L})крепк\p{L}+\s+сорт/giu,
    "заявление о содержании THC/крепости",
    GUIDE,
  ),
  rule("potency-cjk", /四氢大麻酚|テトラヒドロカンナビノール|테트라하이드로칸나비놀|เตตราไฮโดรแคนนาบินอล/g, "заявление о содержании THC", GUIDE),

  // --- Завышенная близость к ориентиру -------------------------------------
  // Расстояние до Walking Street считается гаверсинусом в `src/lib/geo.ts`
  // (~800 м, 10–13 минут пешком) и печатается ContactRail. Обещание «в двух
  // шагах» опровергается на той же странице и возвращается отрицательным отзывом.
  rule(
    "proximity-overclaim-en",
    /\b(?:just|only)\s+(?:a\s+)?(?:stroll|short walk|few (?:steps|minutes))\b|\ba stroll away\b|\bright next to\b|\bsteps (?:away )?from\b|\ba short walk (?:from|to)\b|\bclose to the bustling\b|(?<![\d–-])[1-9]\s?min(?:ute)?s?\s+walk\b/gi,
    "завышенная близость к ориентиру",
  ),
  rule(
    "proximity-overclaim-ru",
    // Однозначное число минут — обещание; вычисленное «10–13 минут пешком»
    // законно, поэтому цифра, стоящая внутри диапазона, исключается lookbehind'ом.
    /(?<!\p{L})(?:в\s+двух\s+шагах|в\s+паре\s+шагов|буквально\s+рядом|прямо\s+рядом\s+с)|(?<![\d–—-])[1-9]\s?минут\p{L}*\s+(?:пешком|ходьбы)/giu,
    "завышенная близость к ориентиру",
  ),
  rule("proximity-overclaim-th", /ติดกับ\s?Walking|ห่างเพียงไม่กี่ก้าว|เดินเพียง\s?[1-9]\s?นาที/g, "завышенная близость к ориентиру"),
  rule("proximity-overclaim-zh", /就在.{0,8}旁边|步行\s?[1-9]\s?分钟|近在咫尺/g, "завышенная близость к ориентиру"),
  rule("proximity-overclaim-ko", /바로\s?옆|도보\s?[1-9]\s?분|근처에\s?위치/g, "завышенная близость к ориентиру"),
  rule("proximity-overclaim-ja", /すぐ隣|徒歩[1-9]分|目と鼻の先/g, "завышенная близость к ориентиру"),
  rule("proximity-overclaim-ar", /على\s+بعد\s+خطوات|بجوار\s+مباشرة|على\s+بعد\s+[1-9]\s+دقائق/g, "завышенная близость к ориентиру"),

  // --- Чужой адрес как свой -------------------------------------------------
  // §1.4: NAP-конфликт «Soi Hollywood» и научил Google склейке LABS DISPENSARY
  // с чужим магазином на той же улице. Латинская строка допустима как ориентир
  // (`ADDRESS_ALIAS.nearbyLandmark`, страница района, `areaServed`), а вот
  // транслитерации и гомоглифы не встречаются нигде законно: в них строку
  // писал только генератор, и машинная чистка по литералу их не видит.
  rule(
    "address-hollywood-translit",
    /ソーヒリウッド|ソイ[・\s]?ハリウッド|소이\s?할리우드|[Сс]ой\s?[ГХ]олливуд|[Сс]ои\s?[ГХ]олливуд/g,
    "чужой адрес Soi Hollywood в транслитерации",
  ),
  rule(
    "address-hollywood-homoglyph",
    // Кириллические С/о/і вперемешку с латиницей: «Соi Hollywood» проходит мимо
    // любого грепа по латинскому литералу.
    /(?=[^\s]*[Ѐ-ӿ])[SsСс][оo][iіi]\s?[HhНн]ollywood/gu,
    "гомоглиф в названии Soi Hollywood",
  ),
]);

/** Слова-отрицания рядом с совпадением — признак дисклеймера, а не оферты. */
const NEGATION_NEAR =
  /\b(?:not|no|never|cannot|can'?t|don'?t|doesn'?t|without|prohibit\w*|forbidden|illegal)\b|(?<!\p{L})(?:не|нет|нельзя|без|запрещ\p{L}*)(?!\p{L})|[不無无没]|ません|ありません|いません|ず[、。]|ไม่|않|없|아닙|아니(?:다|에요)/iu;
const NEGATION_BEFORE_WINDOW = 60;
const NEGATION_AFTER_WINDOW = 40;

/**
 * Единственная страница, которой разрешено называть денежные суммы и
 * нормативные пороги THC: легальный гайд обязан приводить размеры штрафов.
 *
 * Раньше здесь стояла регулярка по сегменту пути `/guides/`, то есть любой
 * будущий URL со словом «guides» автоматически получал право называть суммы.
 * Список точный и расширяется вручную.
 */
const GUIDE_ALLOWLIST_SUFFIX = "guides/legal-cannabis-tourists";

/**
 * @param {string} relativePath путь `dist/<locale>/<suffix>/index.html` или
 *   `content-cache/<locale>/<slug>.json`
 */
export function isMoneyAllowlisted(relativePath = "") {
  const clean = relativePath.replaceAll("\\", "/");
  return clean.includes(`/${GUIDE_ALLOWLIST_SUFFIX}/`) || clean.endsWith(`/${GUIDE_ALLOWLIST_SUFFIX}.json`);
}

/**
 * @param {string} text
 * @param {number} index
 * @param {number} length
 */
function hasNegationNear(text, index, length) {
  const before = text.slice(Math.max(0, index - NEGATION_BEFORE_WINDOW), index);
  const after = text.slice(index + length, index + length + NEGATION_AFTER_WINDOW);
  return NEGATION_NEAR.test(before) || NEGATION_NEAR.test(after);
}

/**
 * Нарушения в готовом тексте. По одному примеру на правило — задача линтера
 * назвать проблему, а не перечислить каждое вхождение.
 *
 * @param {string} text
 * @param {string} relativePath путь для allowlist (относительный, со слэшами)
 * @param {string} [origin] откуда взят текст: `title`, `meta[...]`, `h1`, `body`,
 *   `alt`, `prefill` или JSON-путь вида `$.sections[0].body`. По нему снимаются
 *   правила эха запроса — заголовок вправе повторять формулировку запроса.
 * @returns {{ ruleId: string, hint: string, match: string }[]}
 */
export function findComplianceViolations(text, relativePath = "", origin = "") {
  if (!text) return [];
  const guideAllowed = isMoneyAllowlisted(relativePath);
  const queryEchoAllowed = QUERY_ECHO_ORIGINS.test(origin);
  const violations = [];

  for (const complianceRule of COMPLIANCE_RULES) {
    if ((complianceRule.money || complianceRule.guideAllowed) && guideAllowed) continue;
    if (complianceRule.queryEcho && queryEchoAllowed) continue;
    for (const match of text.matchAll(complianceRule.pattern)) {
      if (complianceRule.contextual && hasNegationNear(text, match.index, match[0].length)) continue;
      violations.push({
        ruleId: complianceRule.id,
        hint: complianceRule.hint,
        match: match[0].replace(/\s+/g, " ").trim(),
      });
      break;
    }
  }
  return violations;
}
