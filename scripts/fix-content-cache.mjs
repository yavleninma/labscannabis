#!/usr/bin/env node
/**
 * Разовая чистка `content-cache/**` (W1-10). Запускается РУКАМИ:
 *   npm run fix:content-cache
 *
 * Почему не в `npm run build`: CI выполняет `git diff --exit-code`, и любой шаг
 * сборки, переписывающий отслеживаемые файлы, уронит пайплайн по постороннему
 * поводу. Результат прогона коммитится как обычная правка.
 *
 * Что вычищается и почему:
 * - пробники в подарок, промо, превосходные степени про цену, суммы в батах и
 *   весовые тиры 1g–1kg —
 *   приказ 2568 читает это как коммерческую рекламу цветка (санкция — приостановка
 *   лицензии на 30–90 дней);
 * - неподтверждённые факты: любые часы работы (генератор писал и 12:00–01:00, и
 *   «ежедневно с 10:00 до 22:00» — владельцем не подтверждено ничего) и рейтинг
 *   «4.8 из 91 отзыва» (реальный счётчик отзывов уже другой);
 * - обещание доставки. Сайт на `/:lang/delivery/pattaya/` прямо пишет, что
 *   онлайн-заказа и доставки нет, а официальное уведомление запрещает продажу
 *   цветка через электронные каналы. Кэш же местами отвечал «доставка? — да»:
 *   это и оферта, и противоречие собственной странице;
 * - эдиблы, масла, концентраты и экстракты. Магазин отвечает за цветок, а
 *   экстракты — другой регуляторный класс; ассортимент владельцем не подтверждён;
 * - «поможем с медкартой за пару минут» — реклама медицинской услуги, она
 *   регулируется отдельно и цитируется проверяющим дословно;
 * - вейпинг — единственное упоминание вейпа во всём репозитории;
 * - приглашение «напишите, чтобы оформить заказ»: онлайн-оферта запрещена
 *   отдельно от рекламы, а WhatsApp здесь — канал вопросов, а не приёма заказов;
 * - «5 минут пешком от Walking Street» — по координатам до Walking Street ~800 м,
 *   то есть 10–13 минут; завышенное обещание дистанции возвращается отзывом
 *   на одну звезду (расстояние считает `src/lib/geo.ts`, а не копирайтер);
 * - `Soi Hollywood` как место магазина. Магазин стоит по `ADDRESS`
 *   (32 Pattaya 13 Alley), а расхождение NAP — самая правдоподобная причина, по
 *   которой Google склеил карточку с чужим магазином. Замена здесь сплошная,
 *   включая слаги про сам переулок: ориентир остаётся в `AREAS` и `area-copy.ts`,
 *   а кэш описывает магазин и потому обязан называть один адрес.
 *
 * Как чистится, чтобы текст остался связным, а не превратился в рванину:
 * предложение с нарушением не режется по словам, а заменяется целиком —
 * на предложение из локального пула безопасных формулировок (`FILL`). Пул
 * ротируется по хэшу от слага и поля, поэтому 24 страницы не превращаются в один
 * и тот же абзац. Q&A с нарушением заменяется целым Q&A из `FAQ_POOL`.
 * В каждый файл добавляется описательный блок про рецепт ภ.ท.33 — без него текст
 * описывает розничную сделку, которая с 26.06.2025 незаконна.
 *
 * Скрипт идемпотентен: повторный прогон не добавляет второй блок про рецепт и
 * ничего не находит. В конце он сам проверяет результат
 * `scripts/lib/compliance-lexicon.mjs` и падает, если нарушение осталось.
 *
 * ЯВНО: автоматическая чистка снимает нарушения, но не заменяет вычитку
 * носителем языка по th/ar/zh/ko/ja — см. W1-10 в плане.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findComplianceViolations } from "./lib/compliance-lexicon.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, "content-cache");

const LOCALES = ["en", "ru", "th", "ar", "zh", "ko", "ja"];

/**
 * Файлы, вычитанные человеком: их скрипт не трогает.
 *
 * Правила `DROP_RULES` намеренно шире compliance-линтера — они режут и мягкие
 * формулировки («fair prices», «прозрачные цены по весу»), из которых страница
 * снова становится витриной. На машинном тексте это правильный размен, а на
 * вычитанном — нет: фраза «почему на этой странице нет цены» законна и нужна,
 * но слово `price` роняет её под то же правило.
 *
 * Ключ — пара `локаль/слаг`, а не слаг: вычитан именно файл, а не тема. Здесь
 * стоят все файлы за indexable-страницами (`src/lib/index-policy.mjs`) и оба
 * слага про доставку, переписанные по образцу
 * `src/pages/[lang]/delivery/[area].astro`. Добавлять сюда файл можно только
 * после ручной вычитки: compliance-линтер по `content-cache` продолжает
 * проверять его в `npm run check:seo` наравне со всеми.
 */
const ALL_LOCALE_SLUGS = ["labs-dispensary-pattaya", "cannabis-near-me-pattaya", "cannabis-delivery-pattaya", "weed-delivery-jomtien"];
const EN_RU_SLUGS = ["buy-cannabis-pattaya", "best-cannabis-shop-pattaya", "cheap-weed-pattaya"];
const HAND_REVIEWED = new Set([
  ...LOCALES.flatMap((locale) => ALL_LOCALE_SLUGS.map((slug) => `${locale}/${slug}`)),
  ...["en", "ru"].flatMap((locale) => EN_RU_SLUGS.map((slug) => `${locale}/${slug}`)),
]);

/** Единственный контактный номер. Держится целым при разбивке текста. */
const PHONE = "+66 66 080 6784";

/** Настоящий адрес и название переулка на языке локали. */
const STREET = {
  en: "Pattaya 13 Alley",
  ru: "Pattaya 13 Alley",
  th: "ซอยพัทยา 13",
  ar: "Pattaya 13 Alley",
  zh: "Pattaya 13 Alley",
  ko: "Pattaya 13 Alley",
  ja: "Pattaya 13 Alley",
};

/**
 * `Soi Hollywood` в латинице и в гомоглифах. `С`/`о`/`і` — кириллица и
 * украинская «і», внешне неотличимые от `S`/`o`/`i`; литерал их не ловит.
 */
const HOLLYWOOD_LATIN = /[SsСс][оo0][iіl]\s*[HhНн]ollywood/g;

/**
 * Замены адреса. Порядок важен: сначала снимается скобка `(Soi Hollywood)` рядом
 * с настоящим адресом, потом локальные написания, потом латиница. Замена на
 * название переулка грамматична во всех семи языках, потому что подставляется в
 * ту же позицию («located on …», «ตั้งอยู่ใน …», «에 있는 …»).
 */
const ADDRESS_REWRITES = {
  common: [
    // Прошлый прогон подставлял «ซอย พัทยา 13» с лишним пробелом — по-тайски
    // название пишется слитно. Нормализуем до правильной формы: собственный
    // прежний вывод под остальные правила уже не попадает.
    [/ซอย\s+พัทยา\s*13/g, "ซอยพัทยา 13"],
    [/\s*\(\s*(?:Soi Hollywood|ซอยฮอลลีวูด|سوِي هوليوود|سوي هوليوود|سوى هوليوود|Сои Голливуд|Сой Голливуд|소이 할리우드|ソイ・ハリウッド|ソイハリウッド|ソーヒリウッド)\s*\)/g, ""],
  ],
  // Латиница ищется классом гомоглифов, а не литералом: в кэше лежало
  // «Соi Hollywood» с кириллическими «С» и «о», и греп по латинскому
  // «Soi Hollywood» этих трёх вхождений не видел вообще.
  en: [[HOLLYWOOD_LATIN, STREET.en]],
  ru: [
    [/Со[ийi]\s+Голливуд[а-я]*/g, STREET.ru],
    [HOLLYWOOD_LATIN, STREET.ru],
  ],
  th: [
    [/ซอยฮอลลีวูด/g, STREET.th],
    [HOLLYWOOD_LATIN, STREET.th],
  ],
  ar: [
    [/سو[يىِ]?\s*هوليوود/g, STREET.ar],
    [/هوليوود/g, STREET.ar],
    [HOLLYWOOD_LATIN, STREET.ar],
  ],
  zh: [[/好莱坞/g, STREET.zh], [HOLLYWOOD_LATIN, STREET.zh]],
  ko: [
    [/소이\s*할리우드/g, STREET.ko],
    [/할리우드/g, STREET.ko],
    [HOLLYWOOD_LATIN, STREET.ko],
  ],
  ja: [
    // `ソーヒリウッド` — написание генератора; ровно оно и уехало в
    // `dist/ja/labs-dispensary-pattaya`, потому что чистка искала латиницу.
    [/ソイ・?ハリウッド|ソーヒリウッド|ソー・?ヒリウッド/g, STREET.ja],
    [HOLLYWOOD_LATIN, STREET.ja],
  ],
};

/**
 * Предложение, попавшее под любое из этих правил, заменяется целиком.
 * Список намеренно шире compliance-линтера: линтер ловит однозначные строки в
 * готовом HTML, а здесь надо снять и мягкие формулировки («fair prices»,
 * «прозрачные цены по весу»), из которых страница снова станет витриной.
 */
const DROP_RULES = {
  common: [
    /฿/,
    /\bTHB\b/i,
    /\d[\d,. ]*\s*(?:บาท|바트|バーツ|泰铢|بات)/,
    // Любое время на часах = заявленные часы работы. Владельцем не подтверждены
    // никакие, поэтому правило общее, а не список конкретных значений: генератор
    // выдавал и «12:00–01:00», и «ежедневно с 10:00 до 22:00».
    /\d{1,2}\s*[:：]\s*\d{2}/,
  ],
  en: [
    /\bsampl/i,
    /\bfree\b(?!\s+to\b)/i,
    /\bweight\s+(?:tier|option|range)/i,
    /\btiers?\b/i,
    /1\s?g\s*(?:to|up to|–|-|—)\s*1\s?kg/i,
    /1 gram to 1 kilogram/i,
    /\bpric(?:e|es|ing)\b/i,
    // `unbeat\w*` вместо точного слова: ловит и «unbeatably», и опечатки в хвосте.
    /\bunbeat\w*\b|\bcheapest\b|\bcheap\b/i,
    /\bdeals?\b|\bpromotion|\bspecial offer|\bdiscount/i,
    /\bsavings?\b|\bsave a lot\b/i,
    /\b\d+\s+reviews?\b|4\.8/,
    /12:00|01:00/,
    /\bmedical card\b/i,
    /\bvap(?:e|ing)\b|e-cigarette/i,
    /\bplace (?:an|your|the|a) order\b|\byour order\b|\bto order\b|\border online\b|\bpay online\b|\bonline payment\b/i,
    /\b(?:5|five)\s*[-–]?\s*min(?:ute)?s?\s+walk/i,
    /\bwe (?:can |do |also |offer )?deliver\b|\bdelivery (?:is )?(?:available|possible|offered)\b|\bdelivered to your\b/i,
    /\bedibles?\b|\bgummies\b|\bcannabis oils?\b|\bconcentrates?\b|\bextracts?\b|\bhashish\b/i,
    // Рекламный регистр: оценка товара без единой цифры — тот же состав
    // нарушения по приказу 2568, что и цена.
    /\bpremium\b|\btop[- ]?(?:quality|shelf|grade)\b|\bhighest[- ]quality\b|\bhigh[- ]quality\b|\bfinest\b|\bsuperior\b|\bexceptional\b|\bunmatched\b/i,
    /\bbest\b|\bonly the best\b|\bhigh standards\b|\bfantastic\b|\bpremier\b|\bpride ourselves\b|\baffordable\b|\bcurat/i,
    // Весовые тиры и опт: публичная оферта количества.
    /\bin bulk\b|\bbulk\b|\bstock up\b|\bthis flexibility\b/i,
    // Потенция и THC: §1.6 плана — только с решением владельца/юриста.
    /\bTHC\b|\bCBD\b|\bpotent\b|\d{1,2}\s?[-–]\s?\d{1,2}\s?%/i,
    // Завышенная близость: расстояние считает `src/lib/geo.ts`, а не копирайтер.
    /\bstroll\b|\bright next to\b|\bsteps (?:away )?from\b|\bshort walk\b|\bclose to the bustling\b|\bwalking distance\b/i,
    // Часы работы: `HOURS.hoursVerified = false`.
    /\bopen (?:late|until|till|24\/7)\b|\bopen daily\b|\bwe are open\b/i,
    /\bfast delivery\b|\bhome delivery\b|\bto your door(?:step)?\b|\bordering from home\b|\bdelivery service\b/i,
  ],
  ru: [
    /бесплатн/i,
    /пробник|образ(?:ец|ца|цы|цов)|сэмпл|семпл/i,
    /цен[ауыеой]|стоимост|прайс/i,
    /скидк|акци[яию]|распродаж|спецпредложен/i,
    /по\s+весу|весов[а-я]*\s+тир|(?<!\p{L})тир(?:ы|ов)?(?!\p{L})/iu,
    /1\s?г\s*[–—-]\s*1\s?кг|от\s*1\s?г\s*до\s*1\s?кг/i,
    /\d+\s+отзыв|4[.,]8/,
    /12:00|01:00/,
    /медкарт|медицинск\w*\s+карт/i,
    /вейп|вейпинг|электронн\w*\s+сигарет/i,
    /5\s*минут\p{L}*\s+(?:пешком|ходьбы)|пешком\s+(?:за\s+)?5\s*минут/iu,
    /(?<!\p{L})заказ\p{L}*(?!\p{L})/iu,
    /(?:мы\s+)?доставля[ею]м|доставка\s+(?:возможна|доступна|есть)|привез[её]м/i,
    /съедобн\w*\s+продукт|гамми|канна?бис\w*\s+масл|масл\w*\s+канна?бис|концентрат|экстракт|гашиш/i,
    // `\w` в JS — это [A-Za-z0-9_]: для кириллицы нужны явные классы, иначе
    // «весовые категории» и «лучший каннабис» проходят мимо правила.
    /премиум|лучш\p{L}*\s+\p{L}*\s*(?:каннабис|сорт|продукт|товар|качеств|выбор|сервис|магазин|шоп|диспенсери)|только\s+лучш|высококачественн|высочайш\p{L}*\s+качеств|высшего\s+качества|первоклассн|отборн|доступн\p{L}*\s+(?:каннабис|цен)/iu,
    /весов\p{L}*\s+катего|поделиться\s+с\s+друзьями|оптом|крупн\p{L}*\s+парти/iu,
    /(?<!\p{L})ТГК(?!\p{L})|крепк\p{L}*\s+сорт/iu,
    /в\s+двух\s+шагах|в\s+паре\s+шагов|прямо\s+рядом|буквально\s+рядом|(?<![\d–—-])[1-9]\s?минут\p{L}*\s+пешком/iu,
    /допоздна|работа(?:ем|ют)\s+(?:до|с)\s?\d|открыт\p{L}*\s+(?:до|с)\s?\d/iu,
    /доставк\p{L}*\s+(?:к\s+вашей\s+двери|прямо|по\s+Паттайе|на\s+дом|до\s+двери)|организуем\s+доставку|прямо\s+к\s+вашей\s+двери/iu,
  ],
  th: [
    /ฟรี|ตัวอย่าง|แจก/,
    /ราคา|ราคาถูก|ถูกกว่า|ถูกที่สุด/,
    /น้ำหนัก|1\s?กรัม|1\s?กก|1\s?กิโลกรัม|1g|1kg/i,
    /โปรโมชั่น|ส่วนลด|ข้อเสนอพิเศษ/,
    /รีวิว|4\.8/,
    /12:00|01:00/,
    /บัตรแพทย์|บัตรทางการแพทย์/,
    /บุหรี่ไฟฟ้า|เวป/,
    /สั่งซื้อออนไลน์|ชำระเงินออนไลน์|ตะกร้าสินค้า/,
    /เดิน\s*5\s*นาที|5\s*นาที\s*จาก/,
    /สั่งซื้อ|สั่งของ/,
    /มีบริการจัดส่ง|จัดส่งได้|ส่งถึงที่|ส่งถึงบ้าน/,
    /ขนมกัญชา|น้ำมันกัญชา|สารสกัด|แฮช/,
    /ที่ดีที่สุด|ดีที่สุด|คุณภาพสูง|คุณภาพดีเยี่ยม|พรีเมียม|ชั้นนำ|คัดสรร/,
    /ปริมาณตั้งแต่|น้ำหนักตั้งแต่|ซื้อยกล็อต|จำนวนมาก/,
    /THC|CBD|สารสกัดเข้มข้น/i,
    /ติดกับ|ห่างเพียง|ไม่กี่ก้าว|เดินไม่กี่นาที/,
    /เปิดถึงดึก|เปิดทุกวันตั้งแต่|เปิดตั้งแต่|เปิดกี่โมง|เปิดบริการ/,
    /จัดส่งถึง|ส่งตรงถึง|จัดส่งทั่ว|บริการจัดส่งกัญชา|1\s?กรัม[^.]{0,30}1\s?กิโลกรัม/,
  ],
  ar: [
    /مجان|عين(?:ة|ات)\s|تذوق/,
    /سعر|أسعار|ثمن|تكلفة|رخيص|ميزاني/,
    /وزن|أوزان|جرام|كيلو|1\s?غ|1\s?كغ|1g|1kg/i,
    /خصم|عرض|عروض|ترويج/,
    /مراجعة|مراجعات|4\.8/,
    /12:00|01:00/,
    /بطاقة\s+طبية/,
    /سجائر\s+إلكترونية|فيب/,
    /(?:سير|مشي|أقدام).{0,15}5\s*دقائق|5\s*دقائق.{0,15}(?:سير|مشي|أقدام)/,
    /اطلب|طلبك|الطلبات|لطلب/,
    /نوفّ?ر\s+التوصيل|التوصيل\s+(?:متاح|متوفر)|نقوم\s+بالتوصيل|توصيل\s+إلى\s+المنزل/,
    /صالح(?:ة)?\s+للأكل|مأكولات\s+القنب|زي(?:ت|وت)\s+القنب|مستخلص|حشيش/,
    /أفضل|فاخر|جودة\s+عالية|أعلى\s+جودة|ممتاز|منتقاة|فاخرة/,
    /فئات\s+الوزن|بالجملة|كميات\s+كبيرة/,
    /THC|CBD/i,
    /على\s+بعد\s+خطوات|بجوار\s+مباشرة|على\s+مقربة/,
    /مفتوح\s+حتى|نفتح\s+من|ساعات\s+العمل/,
    /نوصل\s+لك|إلى\s+باب\s+منزلك|خدمة\s+التوصيل|التوصيل\s+إلى\s+المنزل/,
  ],
  zh: [
    /免费|样品|试用|品尝/,
    /价格|价位|标价|每克|便宜|实惠/,
    /重量|档位|1克|1公斤|1g|1kg/i,
    /优惠|折扣|促销|特价/,
    /评价|评论|4\.8/,
    /12:00|01:00/,
    /医疗卡/,
    /电子烟/,
    /步行\s*5\s*分钟|5\s*分钟(?:步行|路程)|Walking Street\s*(?:步行\s*)?5\s*分钟/,
    /下单|订购|订单/,
    /可配送|可以配送|提供配送|送货上门|可送货|包邮/,
    /食用大麻|大麻食品|软糖|大麻油|浓缩物|提取物/,
    /最好|最佳|顶级|优质|高品质|精品|一流|严选|精心挑选/,
    /批量|大量采购|重量档|重量等级/,
    /THC|CBD|四氢大麻酚/i,
    /旁边|近在咫尺|几步之遥|步行几分钟/,
    /营业到很晚|营业时间|每天营业|开到/,
    /送货上门|上门配送|配送服务|送到您家/,
  ],
  ko: [
    /무료|샘플|시식|시음/,
    /가격|시세|그램당|저렴|싼/,
    /중량|무게|등급|1g|1kg/i,
    /할인|프로모션|최저가|특가/,
    /리뷰|후기|4\.8/,
    /12:00|01:00/,
    /의료\s?카드/,
    /전자담배|베이프/,
    /도보\s*5\s*분|걸어서\s*5\s*분/,
    /주문/,
    /배달\s?(?:가능|서비스|해\s?드립니다|합니다)|배송\s?(?:가능|해\s?드립니다)/,
    /식용\s?대마|젤리|대마\s?오일|농축물|추출물|해시시/,
    /최고급|최고의|최상급|프리미엄|고품질|엄선/,
    /대량\s?구매|중량\s?단계|도매/,
    /THC|CBD/i,
    /바로\s?옆|근처에\s?위치|몇\s?걸음/,
    /늦게까지|영업시간|매일\s?\d{1,2}시/,
    /배달\s?서비스|배송\s?서비스|집까지\s?배달|문\s?앞까지/,
  ],
  ja: [
    /無料|サンプル|試供|試食/,
    /価格|値段|グラム単価|安い|手頃/,
    /重量|ウェイトティア|ティア|1g|1kg/i,
    /割引|キャンペーン|最安|特価/,
    /レビュー|口コミ|4\.8/,
    /12:00|01:00/,
    /医療カード/,
    /電子タバコ|ベイプ|ベープ/,
    /徒歩\s*5\s*分/,
    /注文/,
    /配達(?:可能|いたします|します|に対応)|デリバリー(?:可能|対応|サービス)/,
    /エディブル|大麻オイル|カンナビスオイル|濃縮物|抽出物|ハッシュ/,
    /最高品質|最高級|最高の|プレミアム|極上|高品質|厳選/,
    /大量購入|重量帯|卸/,
    /THC|CBD|テトラヒドロカンナビノール/i,
    /すぐ隣|目と鼻の先|徒歩数分/,
    /遅くまで|営業時間|毎日\d{1,2}時/,
    /配送サービス|デリバリー|ご自宅までお届け|玄関先まで/,
  ],
};

/** Безопасные предложения, которыми заменяется вырезанное. */
const FILL = {
  en: [
    "Staff talk you through strain types, aromas and effects at the counter, so the choice comes from what is actually in front of you.",
    "What is in the jars changes with every harvest, so the honest answer to “what do you have today?” comes from a person rather than from a page.",
    "Cannabis flower is handed over in store, to adults aged 20 or older who hold a prescription issued in Thailand.",
    "This site publishes no prices, no stock lists and no advertising: Thai law reads that as cannabis advertising, and the penalty lands on the shop's licence.",
    "Message WhatsApp +66 66 080 6784 before you set off — it saves a trip across Pattaya.",
    "Bring identification showing you are 20 or older; the paperwork is checked at the counter, not on this website.",
    "Labs Cannabis does not stock vapes, e-cigarettes or tobacco.",
  ],
  ru: [
    "У прилавка вам расскажут про типы сортов, аромат и эффект, чтобы выбор шёл от того, что реально стоит перед вами.",
    "Содержимое банок меняется от урожая к урожаю, поэтому честный ответ на вопрос «что есть сегодня» даёт человек, а не страница.",
    "Цветок выдаётся в магазине взрослым от 20 лет с рецептом, выданным в Таиланде.",
    "На сайте нет ни витрины, ни остатков, ни рекламных обещаний: в Таиланде это читается как реклама каннабиса, а отвечает за неё лицензия магазина.",
    "Напишите в WhatsApp +66 66 080 6784 до выхода — это экономит поездку через всю Паттайю.",
    "Возьмите документ, подтверждающий возраст 20+; бумаги проверяют у прилавка, а не на сайте.",
    "Вейпы, электронные сигареты и табак Labs Cannabis не держит.",
  ],
  th: [
    "ที่เคาน์เตอร์ พนักงานจะอธิบายชนิดของสายพันธุ์ กลิ่น และผลที่ได้ เพื่อให้คุณเลือกจากของจริงตรงหน้า",
    "ของในโหลเปลี่ยนไปตามรอบเก็บเกี่ยว คำตอบว่าวันนี้มีอะไรจึงมาจากคน ไม่ใช่จากหน้าเว็บ",
    "ดอกกัญชาส่งมอบที่หน้าร้าน ให้ผู้ใหญ่อายุ 20 ปีขึ้นไปที่มีใบสั่งแพทย์ซึ่งออกในประเทศไทย",
    "เว็บไซต์นี้ไม่แสดงรายการสินค้า ไม่แสดงสต็อก และไม่มีข้อความเชิญชวน เพราะกฎหมายไทยถือว่าเป็นการโฆษณากัญชา",
    "ทัก WhatsApp +66 66 080 6784 ก่อนออกเดินทาง จะได้ไม่ต้องเดินทางเก้อ",
    "เตรียมบัตรที่ยืนยันอายุ 20 ปีขึ้นไป เอกสารตรวจที่หน้าร้าน ไม่ใช่บนเว็บไซต์",
    "Labs Cannabis ไม่จำหน่ายบุหรี่ไฟฟ้าและยาสูบ",
  ],
  ar: [
    "عند الطاولة يشرح لك الموظفون أنواع السلالات والروائح والتأثيرات، لتختار بناءً على ما هو أمامك فعلاً.",
    "ما في الأوعية يتغير مع كل حصاد، لذلك الجواب الصادق عن سؤال «ماذا لديكم اليوم؟» يأتي من شخص لا من صفحة.",
    "تُسلَّم زهرة القنب داخل المتجر للبالغين 20 عاماً فأكثر ممن يحملون وصفة صادرة داخل تايلاند.",
    "لا ينشر هذا الموقع قوائم منتجات ولا مخزوناً ولا دعاية، لأن القانون التايلاندي يعتبر ذلك إعلاناً عن القنب.",
    "راسلنا على WhatsApp +66 66 080 6784 قبل التحرك، فذلك يوفّر عليك رحلة عبر باتايا.",
    "أحضر ما يثبت أن عمرك 20 عاماً فأكثر؛ تُفحص الأوراق عند الطاولة لا على الموقع.",
    "لا توفّر Labs Cannabis السجائر الإلكترونية ولا التبغ.",
  ],
  zh: [
    "在柜台，店员会讲清品种类型、香气和效果，让你按眼前的实物来选。",
    "罐子里的东西随每一批收成变化，所以“今天有什么”这个问题由人来回答，而不是网页。",
    "大麻花在店内交付给持泰国境内处方、年满 20 岁的成年人。",
    "本站不列商品、不公布库存、也不做宣传，因为泰国法律把这些视为大麻广告。",
    "出发前先用 WhatsApp +66 66 080 6784 询问，可以省下一趟穿城的路。",
    "请带上可证明年满 20 岁的证件；证件在柜台核对，而不是在网站上。",
    "Labs Cannabis 不经营电子烟和烟草。",
  ],
  ko: [
    "카운터에서 직원이 품종 유형과 향, 효과를 설명해 주므로 눈앞의 실물을 보고 고를 수 있습니다.",
    "병 안의 내용물은 수확마다 달라지므로 “오늘 무엇이 있나요”라는 질문의 정직한 답은 페이지가 아니라 사람에게서 나옵니다.",
    "대마초 꽃은 태국에서 발급된 처방전을 가진 만 20세 이상 성인에게 매장에서 전달됩니다.",
    "이 사이트는 상품 목록도 재고도 광고 문구도 싣지 않습니다. 태국 법이 이를 대마초 광고로 보기 때문입니다.",
    "출발 전에 WhatsApp +66 66 080 6784으로 물어보면 파타야를 가로지르는 헛걸음을 줄일 수 있습니다.",
    "만 20세 이상임을 확인할 수 있는 신분증을 가져오세요. 서류는 웹사이트가 아니라 카운터에서 확인합니다.",
    "Labs Cannabis는 전자담배와 담배를 취급하지 않습니다.",
  ],
  ja: [
    "カウンターでスタッフが品種のタイプや香り、効果を説明しますので、目の前の実物を見て選べます。",
    "瓶の中身は収穫ごとに変わるため、「今日は何がありますか」への正直な答えはページではなく人から返ってきます。",
    "大麻の花は、タイ国内で発行された処方箋を持つ20歳以上の方に店頭で受け渡されます。",
    "このサイトは商品一覧も在庫も宣伝文句も掲載しません。タイの法律ではそれが大麻の広告にあたるためです。",
    "出発前にWhatsApp +66 66 080 6784へ尋ねておくと、パタヤを横断する無駄足を防げます。",
    "20歳以上であることを確認できる身分証をお持ちください。書類の確認はサイトではなく店頭で行います。",
    "Labs Cannabisは電子タバコやたばこを扱っていません。",
  ],
};

/** Замена для Q&A, в котором нарушение сидит в самом вопросе. */
const FAQ_POOL = {
  en: [
    ["Who may buy cannabis flower in Thailand?", "Adults aged 20 or older who hold a prescription issued inside Thailand. Prescriptions from other countries are not accepted, and the handover happens in person, in the shop."],
    ["Does the website take orders?", "No. There is no basket and no payment here. WhatsApp is for questions about the route, the paperwork and what is in the shop today."],
    ["What should I bring?", "Identification that shows you are 20 or older and a valid Thai prescription. Both are checked at the counter before anything is handed over."],
    ["Do you sell vapes or e-cigarettes?", "No. Selling vapes and e-cigarettes is illegal in Thailand and we do not stock them. Labs Cannabis is a licensed cannabis dispensary."],
  ],
  ru: [
    ["Кто может купить каннабис в Таиланде?", "Взрослые от 20 лет с рецептом, выданным в Таиланде. Рецепты из других стран не принимаются, а выдача происходит лично, в магазине."],
    ["Принимаете ли вы заказы через сайт?", "Нет. Здесь нет ни корзины, ни оплаты. WhatsApp нужен для вопросов о дороге, документах и о том, что сегодня в магазине."],
    ["Что взять с собой?", "Документ, подтверждающий возраст 20+, и действующий тайский рецепт. И то и другое проверяют у прилавка до выдачи."],
    ["Продаёте ли вы вейпы?", "Нет. Продажа вейпов и электронных сигарет в Таиланде запрещена, мы их не держим. Labs Cannabis — лицензированный каннабис-диспенсери."],
  ],
  th: [
    ["ใครซื้อดอกกัญชาในไทยได้บ้าง?", "ผู้ที่มีอายุ 20 ปีขึ้นไปและมีใบสั่งแพทย์ที่ออกในประเทศไทย ใบสั่งจากต่างประเทศใช้ไม่ได้ และการส่งมอบทำที่หน้าร้านเท่านั้น"],
    ["สั่งผ่านเว็บไซต์ได้ไหม?", "ไม่ได้ เว็บไซต์นี้ไม่มีตะกร้าและไม่มีการชำระเงิน WhatsApp ใช้สำหรับถามเส้นทาง เอกสาร และสิ่งที่มีที่หน้าร้านในวันนั้น"],
    ["ต้องเตรียมอะไรมาบ้าง?", "บัตรที่ยืนยันอายุ 20 ปีขึ้นไป และใบสั่งแพทย์ไทยที่ยังไม่หมดอายุ ทั้งสองอย่างตรวจที่เคาน์เตอร์ก่อนส่งมอบ"],
    ["ขายบุหรี่ไฟฟ้าไหม?", "ไม่ขาย การจำหน่ายบุหรี่ไฟฟ้าในประเทศไทยผิดกฎหมาย เราไม่มีสินค้าประเภทนี้ Labs Cannabis เป็นร้านกัญชาที่ได้รับอนุญาต"],
  ],
  ar: [
    ["من يستطيع شراء زهرة القنب في تايلاند؟", "البالغون 20 عاماً فأكثر ممن يحملون وصفة صادرة داخل تايلاند. الوصفات الأجنبية غير مقبولة، والتسليم يتم شخصياً داخل المتجر."],
    ["هل يستقبل الموقع الطلبات؟", "لا. لا توجد سلة ولا دفع هنا. WhatsApp للأسئلة عن الطريق والأوراق وما هو موجود في المتجر اليوم."],
    ["ماذا أحضر معي؟", "ما يثبت أن عمرك 20 عاماً فأكثر ووصفة تايلاندية سارية. يُفحص الاثنان عند الطاولة قبل أي تسليم."],
    ["هل تبيعون السجائر الإلكترونية؟", "لا. بيع السجائر الإلكترونية غير قانوني في تايلاند ولا نوفّرها. Labs Cannabis متجر قنب مرخّص."],
  ],
  zh: [
    ["在泰国谁可以购买大麻花？", "年满 20 岁并持有泰国境内开具处方的成年人。境外处方不被接受，交付须在店内当面完成。"],
    ["可以在网站上下单吗？", "不可以。这里没有购物篮，也不收款。WhatsApp 只用于询问路线、证件和当天店内的情况。"],
    ["需要带什么？", "可证明年满 20 岁的证件，以及有效的泰国处方。两样都在柜台核对后才会交付。"],
    ["你们卖电子烟吗？", "不卖。在泰国销售电子烟属于违法，我们没有这类商品。Labs Cannabis 是持证大麻专卖店。"],
  ],
  ko: [
    ["태국에서 대마초 꽃은 누가 살 수 있나요?", "태국에서 발급된 처방전을 가진 만 20세 이상 성인입니다. 해외 처방전은 인정되지 않으며, 전달은 매장에서 대면으로 진행됩니다."],
    ["웹사이트에서 주문할 수 있나요?", "아니요. 장바구니도 결제도 없습니다. WhatsApp은 경로와 서류, 그날 매장 상황을 묻기 위한 창구입니다."],
    ["무엇을 가져가야 하나요?", "만 20세 이상임을 보여주는 신분증과 유효한 태국 처방전입니다. 두 가지 모두 전달 전에 카운터에서 확인합니다."],
    ["전자담배를 판매하나요?", "판매하지 않습니다. 태국에서 전자담배 판매는 불법이며 취급하지 않습니다. Labs Cannabis는 허가받은 대마초 판매점입니다."],
  ],
  ja: [
    ["タイで大麻の花を購入できるのは誰ですか？", "タイ国内で発行された処方箋を持つ20歳以上の方です。海外の処方箋は使えず、受け渡しは店頭で対面で行います。"],
    ["サイトから注文できますか？", "できません。買い物かごも決済もありません。WhatsAppは道順や書類、その日の店頭の様子を尋ねるための窓口です。"],
    ["何を持っていけばよいですか？", "20歳以上であることを示す身分証と、有効なタイの処方箋です。どちらも受け渡し前にカウンターで確認します。"],
    ["電子タバコは売っていますか？", "販売していません。タイでは電子タバコの販売は違法で、当店では扱っていません。Labs Cannabisは認可を受けた大麻ディスペンサリーです。"],
  ],
};

/**
 * Описательный блок про рецепт. Формулировки строго констатирующие: без «поможем
 * оформить», без сроков оформления и без слова «формальность» — реклама
 * медицинской услуги регулируется отдельно от рекламы товара.
 */
const PRESCRIPTION_SECTION = {
  en: {
    h2: "Prescription and age rules",
    body: "Since 26 June 2025 cannabis flower has been a controlled herb in Thailand. It is dispensed in person, in the shop, to adults aged 20 or older who present a prescription issued by a licensed practitioner in Thailand; such a prescription covers a course of up to 30 days. Prescriptions issued abroad are not accepted, and flower may not be taken out of the country. This paragraph states the rule and offers to arrange nothing.",
  },
  ru: {
    h2: "Рецепт и возраст",
    body: "С 26 июня 2025 года цветок каннабиса в Таиланде — контролируемая трава. Его выдают лично, в магазине, взрослым от 20 лет, предъявившим рецепт, выписанный лицензированным специалистом в Таиланде; такой рецепт покрывает курс до 30 дней. Рецепты, выданные за границей, не принимаются, вывозить цветок из страны нельзя. Этот абзац излагает правило и ничего не предлагает оформить.",
  },
  th: {
    h2: "ใบสั่งแพทย์และเกณฑ์อายุ",
    body: "ตั้งแต่ 26 มิถุนายน 2568 ดอกกัญชาเป็นสมุนไพรควบคุมในประเทศไทย การส่งมอบทำแบบพบหน้าที่ร้าน ให้ผู้ใหญ่อายุ 20 ปีขึ้นไปที่แสดงใบสั่งซึ่งออกโดยผู้ประกอบวิชาชีพที่ได้รับอนุญาตในประเทศไทย ใบสั่งครอบคลุมได้ไม่เกิน 30 วัน ใบสั่งที่ออกจากต่างประเทศใช้ไม่ได้ และห้ามนำดอกกัญชาออกนอกประเทศ ย่อหน้านี้อธิบายกฎเท่านั้น ไม่ได้เสนอดำเนินการใด ๆ แทนคุณ",
  },
  ar: {
    h2: "الوصفة وشرط العمر",
    body: "منذ 26 يونيو 2025 صارت زهرة القنب عشبة خاضعة للرقابة في تايلاند. تُصرف شخصياً داخل المتجر للبالغين 20 عاماً فأكثر ممن يقدّمون وصفة صادرة عن ممارس مرخّص داخل تايلاند، وتغطي الوصفة مدة تصل إلى 30 يوماً. الوصفات الصادرة خارج تايلاند غير مقبولة، ولا يجوز إخراج الزهرة من البلاد. هذه الفقرة تشرح القاعدة ولا تعرض ترتيب أي شيء.",
  },
  zh: {
    h2: "处方与年龄规定",
    body: "自 2025 年 6 月 26 日起，大麻花在泰国属于受管制草药。它在店内当面交付给年满 20 岁、并出示由泰国境内执业者开具处方的成年人，处方最长覆盖 30 天疗程。境外开具的处方不被接受，大麻花也不得带出泰国。本段只说明规则，不代办任何手续。",
  },
  ko: {
    h2: "처방전과 연령 규정",
    body: "2025년 6월 26일부터 태국에서 대마초 꽃은 관리 대상 약초입니다. 태국 내 면허 의료인이 발급한 처방전을 제시하는 만 20세 이상 성인에게 매장에서 대면으로 전달되며, 처방전은 최대 30일 분까지 적용됩니다. 해외에서 발급된 처방전은 인정되지 않고, 꽃을 국외로 반출할 수 없습니다. 이 문단은 규정을 설명할 뿐, 어떤 절차도 대행하지 않습니다.",
  },
  ja: {
    h2: "処方箋と年齢の決まり",
    body: "2025年6月26日以降、タイでは大麻の花は管理対象の生薬です。タイ国内の有資格者が発行した処方箋を提示する20歳以上の方に、店頭で対面で渡されます。処方箋の対象期間は最長30日です。国外で発行された処方箋は認められず、花を国外へ持ち出すこともできません。この段落は決まりを説明するもので、手続きの代行を申し出るものではありません。",
  },
};

/**
 * Нейтральные заголовки для секции, у которой нарушение сидело в самом h2
 * (заголовок про весовые тиры и пробники). Их два: в файле такие секции
 * встречаются парой, и два одинаковых h2 подряд — это уже брак вёрстки.
 */
const SECTION_H2_FALLBACK = {
  en: ["What to know before you visit", "How a visit works"],
  ru: ["Что знать перед визитом", "Как проходит визит"],
  th: ["สิ่งที่ควรรู้ก่อนมาที่ร้าน", "การมาที่ร้านเป็นอย่างไร"],
  ar: ["ما ينبغي معرفته قبل الزيارة", "كيف تسير الزيارة"],
  zh: ["到店前需要知道的事", "到店流程是怎样的"],
  ko: ["방문 전에 알아둘 점", "매장에서는 이렇게 진행됩니다"],
  ja: ["来店前に知っておくこと", "店頭での流れ"],
};

/** Маркер, по которому блок про рецепт распознаётся при повторном прогоне. */
const PRESCRIPTION_MARKER = /26\s*(?:June|июня|มิถุนายน|يونيو|年\s*6\s*月|월|６月)|2568|2025/;

/**
 * Чистый h1 берётся из `SEO_PAGES.h1Template` — из того же места, откуда его
 * берёт `[seoSlug].astro`, когда в контенте заголовка нет. Разбор текстом, как
 * в `gen-seo-fallback.mjs`: тянуть `.ts` из `.mjs` нечем, а дублировать 24
 * заголовка × 7 локалей в скрипте — верный способ их рассинхронизировать.
 */
function loadH1Templates() {
  const src = fs.readFileSync(path.join(ROOT, "src/data/seo-matrix.ts"), "utf8");
  const section = src.slice(src.indexOf("export const SEO_PAGES"));
  const templates = {};
  for (const block of section.split(/\r?\n  \{\r?\n    slug: "/).slice(1)) {
    const slug = block.match(/^([^"]+)"/)?.[1];
    if (!slug) continue;
    const h1Block = block.match(/h1Template: \{([\s\S]*?)\n    \},/)?.[1] ?? "";
    templates[slug] = {};
    for (const locale of LOCALES) {
      const found = h1Block.match(new RegExp(`${locale}: "((?:[^"\\\\]|\\\\.)*)"`));
      if (found) templates[slug][locale] = found[1];
    }
  }
  return templates;
}

const H1_TEMPLATES = loadH1Templates();

/** Письменность локали: английский h1 в тайском файле — это тоже брак. */
const LOCALE_SCRIPT = {
  en: /[A-Za-z]/,
  ru: /[\u0400-\u04FF]/,
  th: /[\u0E01-\u0E3A\u0E40-\u0E5B]/,
  ar: /[\u0600-\u06FF]/,
  zh: /[\u4E00-\u9FFF]/,
  ko: /[\uAC00-\uD7AF]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FFF]/,
};

/** Последний рубеж, если и в матрице заголовок оказался ценовым. */
const H1_FALLBACK = {
  en: "Labs Cannabis Pattaya — licensed cannabis dispensary",
  ru: "Labs Cannabis Паттайя — лицензированный каннабис-диспенсери",
  th: "Labs Cannabis พัทยา — ร้านกัญชาที่ได้รับอนุญาต",
  ar: "Labs Cannabis باتايا — متجر قنب مرخّص",
  zh: "Labs Cannabis 芭提雅 — 持证大麻专卖店",
  ko: "Labs Cannabis 파타야 — 허가받은 대마초 판매점",
  ja: "Labs Cannabis パタヤ — 認可を受けた大麻ディスペンサリー",
};

/** Тайские связки, повисающие в воздухе, если соседний кусок вырезан. */
const TH_ORPHANS = new Set([
  "นอกจากนี้", "และ", "หรือ", "ที่", "พร้อม", "อีกทั้ง", "ดังนั้น", "ทั้งนี้", "เช่น", "โดย", "อีกด้วย", "รวมถึง",
]);

/** Плотность письма: у CJK и тайского на тот же смысл уходит примерно вдвое меньше знаков. */
const DENSITY = { en: 1, ru: 1, ar: 0.9, th: 0.55, zh: 0.45, ko: 0.55, ja: 0.45 };

const MIN_LENGTH = { intro: 220, body: 200, closing: 90, answer: 60 };

// Диапазон намеренно не весь тайский блок: символ бата ฿ — это U+0E3F, и по
// нему английский абзац с ценой определялся как тайский, а потом резался по
// пробелам в набор слов.
const THAI_LETTERS = /[\u0E01-\u0E3A\u0E40-\u0E5B]/;
const CJK_LETTERS = /[\u3040-\u30FF\u4E00-\u9FFF]/;

/**
 * Разбивка выбирается по письменности самого текста. В тайском предложения не
 * заканчиваются точкой, зато клаузы разделены пробелом — но в тех же файлах
 * попадаются целиком английские абзацы, и резать их по пробелам значит получить
 * набор слов вместо текста.
 */
function scriptOf(text, locale) {
  if (THAI_LETTERS.test(text)) return "thai";
  if (CJK_LETTERS.test(text)) return "cjk";
  if (locale === "zh" || locale === "ja") return CJK_LETTERS.test(text) ? "cjk" : "sentence";
  return "sentence";
}

function splitSentences(text, locale) {
  const script = scriptOf(text, locale);
  if (script === "cjk") return text.split(/(?<=[。！？!?])/).map((s) => s.trim()).filter(Boolean);
  if (script === "thai") return text.split(/\s+/).map((s) => s.trim()).filter(Boolean);
  return text.split(/(?<=[.!?؟])\s+/).map((s) => s.trim()).filter(Boolean);
}

const CJK_TERMINATORS = /[。！？!?」』）)]$/;

function joinSentences(parts, locale, script) {
  if (script !== "cjk") return parts.join(" ");
  // Между кусками нет пробела, поэтому фраза без завершающего знака слипается
  // со следующей: «…6784请带上…». Точку ставим сами.
  return parts.reduce((acc, part, index) => {
    if (index === 0) return part;
    return CJK_TERMINATORS.test(acc) ? acc + part : `${acc}。${part}`;
  }, "");
}

function rewriteAddress(text, locale) {
  // NFKC до замен: полноширинная латиница и составные формы иначе проходят мимо
  // любого литерала так же, как прошли кириллические гомоглифы.
  let out = text.normalize("NFKC");
  for (const [pattern, replacement] of [...ADDRESS_REWRITES.common, ...ADDRESS_REWRITES[locale]]) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/**
 * Тексты, которые сам скрипт и подставляет. Дисклеймер «вейпы продавать в
 * Таиланде нельзя, мы их не держим» состоит ровно из тех слов, которые правила
 * ищут, — поэтому собственные вставки исключаются по точному совпадению, и
 * повторный прогон скрипта ничего не переписывает.
 */
const SAFE_TEXTS = new Set([
  ...LOCALES.flatMap((locale) => FILL[locale]),
  ...LOCALES.flatMap((locale) => FAQ_POOL[locale].flat()),
  ...LOCALES.flatMap((locale) => [PRESCRIPTION_SECTION[locale].h2, PRESCRIPTION_SECTION[locale].body]),
  ...LOCALES.flatMap((locale) => SECTION_H2_FALLBACK[locale]),
  ...LOCALES.map((locale) => STREET[locale]),
  ...LOCALES.map((locale) => H1_FALLBACK[locale]),
  PHONE,
]);

/**
 * Английские правила проверяются во всех локалях: генератор оставил куски
 * английского внутри th/zh/ko/ja-файлов, и английское обещание пробника в
 * тайском файле — то же нарушение, что и в английском.
 */
function isDropped(sentence, locale) {
  if (SAFE_TEXTS.has(sentence)) return false;
  const rules = locale === "en"
    ? [...DROP_RULES.common, ...DROP_RULES.en]
    : [...DROP_RULES.common, ...DROP_RULES.en, ...DROP_RULES[locale]];
  for (const pattern of rules) if (pattern.test(sentence)) return true;
  return false;
}

/** FNV-1a: нужен только детерминированный выбор из пула, не криптография. */
function hash(value) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Выдаёт предложения из пула, не повторяя их в пределах одного файла. */
function createFillPicker(locale, seed) {
  const pool = FILL[locale];
  const used = new Set();
  let cursor = hash(seed) % pool.length;
  return (context = []) => {
    // Второй раз подряд диктовать тот же номер телефона — не текст, а шум.
    const phoneTaken = context.some((part) => part.includes(PHONE));
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < pool.length; i++) {
        const index = (cursor + i) % pool.length;
        if (used.has(index)) continue;
        if (pass === 0 && phoneTaken && pool[index].includes(PHONE)) continue;
        used.add(index);
        cursor = (index + 1) % pool.length;
        return pool[index];
      }
    }
    cursor = (cursor + 1) % pool.length;
    return pool[cursor];
  };
}

function minLength(kind, locale) {
  return Math.round(MIN_LENGTH[kind] * DENSITY[locale]);
}

/**
 * Чистит одно поле: адрес переписывается, предложения с нарушением заменяются
 * целиком, повисшие связки убираются, короткий остаток добирается из пула.
 */
/**
 * Прячет собственные вставки скрипта за односимвольные токены до разбивки.
 * Без этого повторный прогон резал тайские вставки по пробелам: клауза
 * «ไม่แสดงราคา» внутри безопасного предложения снова попадала под правило про
 * цену, и текст деградировал с каждым запуском.
 */
function maskSafeTexts(text) {
  const stash = [];
  let out = text;
  for (const safe of SAFE_TEXTS) {
    if (!out.includes(safe)) continue;
    const token = `\u0001${stash.length}\u0001`;
    stash.push(safe);
    out = out.split(safe).join(token);
  }
  return { text: out, stash };
}

function unmaskSafeTexts(text, stash) {
  return stash.reduce((acc, safe, index) => acc.split(`\u0001${index}\u0001`).join(safe), text);
}

/** Сколько соседних тайских клауз проверяется одним окном. */
const TH_WINDOW = 3;

/**
 * Отмечает куски, которые надо выкинуть.
 *
 * В тайском «предложение» — это клауза между пробелами, и правило запросто
 * пересекает границу: «ตั้งแต่ 1 กรัมถึง 1 กิโลกรัม» разваливается на «1» и
 * «กรัมถึง», по отдельности безобидные. Поэтому для тайского проверяются окна
 * из двух-трёх соседних клауз, и при совпадении выкидывается всё окно.
 */
function markDropped(sentences, locale, script) {
  const doomed = sentences.map((sentence) => isDropped(sentence, locale));
  if (script !== "thai") return doomed;

  for (let start = 0; start < sentences.length; start++) {
    for (let size = 2; size <= TH_WINDOW && start + size <= sentences.length; size++) {
      const window = sentences.slice(start, start + size).join(" ");
      if (!isDropped(window, locale)) continue;
      for (let i = start; i < start + size; i++) doomed[i] = true;
      break;
    }
  }
  return doomed;
}

function cleanField(text, { locale, kind, nextFill }) {
  const masked = maskSafeTexts(rewriteAddress(text, locale));
  const rewritten = masked.text;
  const script = scriptOf(rewritten, locale);
  const sentences = splitSentences(rewritten, locale);
  const doomed = markDropped(sentences, locale, script);
  const kept = [];
  let dropping = false;

  for (const [index, sentence] of sentences.entries()) {
    if (doomed[index]) {
      if (!dropping) {
        kept.push(nextFill(kept));
        dropping = true;
      }
      continue;
    }
    dropping = false;
    if (script === "thai" && TH_ORPHANS.has(sentence)) continue;
    if (sentence.replace(/[\s\p{P}\p{S}]/gu, "").length === 0) continue;
    kept.push(sentence);
  }

  let out = joinSentences(kept, locale, script).replace(/\s{2,}/g, " ").trim();
  out = unmaskSafeTexts(out, masked.stash);
  const floor = minLength(kind, locale);
  let guard = FILL[locale].length;
  while (out.length < floor && guard-- > 0) {
    out = joinSentences([out, nextFill([out])], locale, script).trim();
  }
  return out;
}

/** Заголовки короткие: их не заменяют предложением, а только чистят адрес. */
function cleanHeading(text, locale) {
  return rewriteAddress(text, locale).replace(/\s*\(\s*\)/g, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * Q&A заменяется целиком, если нарушение есть хоть в вопросе, хоть в ответе:
 * вырезать половину ответа значит оставить «Можно попробовать? — Да!» без
 * продолжения, то есть обещание, которого мы как раз и избегаем.
 */
/**
 * Заголовок страницы не режется по предложениям: «Cheap weed in Pattaya» нельзя
 * ни укоротить, ни дополнить — его можно только заменить целиком на заголовок,
 * который эта же страница отдаёт из `h1Template`.
 */
function cleanH1(text, locale, slug) {
  const cleaned = cleanHeading(text, locale);
  if (cleaned && !isDropped(cleaned, locale) && LOCALE_SCRIPT[locale].test(cleaned)) return cleaned;
  const template = H1_TEMPLATES[slug]?.[locale];
  if (template) {
    const rewritten = cleanHeading(template, locale);
    if (rewritten && !isDropped(rewritten, locale) && LOCALE_SCRIPT[locale].test(rewritten)) return rewritten;
  }
  if (cleaned && !isDropped(cleaned, locale)) return cleaned;
  return H1_FALLBACK[locale];
}

function cleanFaq(faq, { locale, nextFaq }) {
  const items = faq.map((item) => {
    const question = cleanHeading(item.q ?? "", locale);
    const answer = rewriteAddress(item.a ?? "", locale).trim();
    const maskedAnswer = maskSafeTexts(answer).text;
    return {
      question,
      answer,
      // `markDropped`, а не `some(isDropped)`: тайский разбивается по пробелам —
      // они там разделяют фразы, а не предложения, — и правило вроде
      // «1 กรัม … 1 กิโลกรัม» не совпадает ни с одним отдельным куском.
      dirty:
        isDropped(question, locale) ||
        markDropped(splitSentences(maskedAnswer, locale), locale, scriptOf(maskedAnswer, locale)).some(Boolean),
    };
  });

  // Q&A из пула, уже стоящий в файле после прошлого прогона, резервируется до
  // раздачи замен. Иначе следующий прогон, у которого своё правило нашло второе
  // нарушение, вставит тот же вопрос вторым экземпляром.
  for (const item of items) {
    if (!item.dirty) nextFaq.reserve(item.question);
  }

  const out = [];
  const emitted = new Set();
  for (const item of items) {
    // Повтор вопроса внутри одного файла лечится так же, как нарушение: берём
    // следующий Q&A из пула, чтобы число вопросов не падало.
    if (item.dirty || emitted.has(item.question)) {
      const replacement = nextFaq();
      if (replacement && !emitted.has(replacement[0])) {
        out.push({ q: replacement[0], a: replacement[1] });
        emitted.add(replacement[0]);
      }
      continue;
    }
    out.push({ q: item.question, a: item.answer });
    emitted.add(item.question);
  }
  return out;
}

function createFaqPicker(locale, seed) {
  const pool = FAQ_POOL[locale];
  const used = new Set();
  let cursor = hash(seed) % pool.length;
  const pick = () => {
    for (let i = 0; i < pool.length; i++) {
      const index = (cursor + i) % pool.length;
      if (used.has(index)) continue;
      used.add(index);
      cursor = (index + 1) % pool.length;
      return pool[index];
    }
    return null;
  };
  /** Пометить вопрос занятым: он уже стоит в файле, выдавать его нельзя. */
  pick.reserve = (question) => {
    const index = pool.findIndex(([poolQuestion]) => poolQuestion === question);
    if (index >= 0) used.add(index);
  };
  return pick;
}

function fixFile(locale, slug, data) {
  const seed = `${locale}/${slug}`;
  const nextFill = createFillPicker(locale, seed);
  const nextFaq = createFaqPicker(locale, `${seed}/faq`);

  const fixed = {
    h1: cleanH1(data.h1 ?? "", locale, slug),
    intro: cleanField(data.intro ?? "", { locale, kind: "intro", nextFill }),
    sections: (data.sections ?? []).map((section) => ({
      h2: cleanHeading(section.h2 ?? "", locale),
      body: cleanField(section.body ?? "", { locale, kind: "body", nextFill }),
    })),
    faq: [],
    closing: cleanField(data.closing ?? "", { locale, kind: "closing", nextFill }),
    source: data.source ?? "openai",
  };

  const usedHeadings = new Set(fixed.sections.map((section) => section.h2));
  for (const section of fixed.sections) {
    if (!isDropped(section.h2, locale)) continue;
    const fallback = SECTION_H2_FALLBACK[locale].find((title) => !usedHeadings.has(title));
    section.h2 = fallback ?? SECTION_H2_FALLBACK[locale][0];
    usedHeadings.add(section.h2);
  }

  fixed.faq = cleanFaq(data.faq ?? [], { locale, nextFaq });

  const hasPrescription = fixed.sections.some(
    (section) => section.h2 === PRESCRIPTION_SECTION[locale].h2 && PRESCRIPTION_MARKER.test(section.body),
  );
  if (!hasPrescription) fixed.sections.push({ ...PRESCRIPTION_SECTION[locale] });

  return fixed;
}

function collectStrings(value, prefix, collected = []) {
  if (typeof value === "string") {
    collected.push({ origin: prefix, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${prefix}[${index}]`, collected));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) collectStrings(child, `${prefix}.${key}`, collected);
  }
  return collected;
}

let changed = 0;
let total = 0;
const residual = [];

for (const locale of LOCALES) {
  const dir = path.join(CACHE, locale);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".json")) continue;
    total++;
    const file = path.join(dir, name);
    const slug = name.replace(/\.json$/, "");
    const before = fs.readFileSync(file, "utf8");
    const handReviewed = HAND_REVIEWED.has(`${locale}/${slug}`);
    // Чистка сходится к неподвижной точке: подставленное предложение из `FILL`
    // может встать рядом с уцелевшим куском так, что оконное правило (тайский
    // режется по пробелам) увидит нарушение только на втором проходе. Без этого
    // цикла повторный прогон переписывал бы файл снова и снова.
    let fixed = JSON.parse(before);
    if (!handReviewed) {
      fixed = fixFile(locale, slug, JSON.parse(before));
      for (let pass = 0; pass < 3; pass++) {
        const again = fixFile(locale, slug, JSON.parse(JSON.stringify(fixed)));
        if (JSON.stringify(again) === JSON.stringify(fixed)) break;
        fixed = again;
      }
    }
    const after = JSON.stringify(fixed, null, 2) + "\n";
    if (!handReviewed && after !== before) {
      fs.writeFileSync(file, after, "utf8");
      changed++;
    }

    const relative = path.relative(ROOT, file).replaceAll("\\", "/");
    for (const { origin, text } of collectStrings(fixed, "$")) {
      for (const violation of findComplianceViolations(text, relative, origin)) {
        residual.push(`${relative} (${origin}): ${violation.hint} — ${JSON.stringify(violation.match)} [${violation.ruleId}]`);
      }
    }
    if (/Soi Hollywood/.test(after)) residual.push(`${relative}: адрес по соседнему ориентиру остался`);
  }
}

console.log(`content-cache: обработано ${total}, переписано ${changed}.`);

if (residual.length > 0) {
  console.error(`Нарушения после чистки: ${residual.length}`);
  for (const line of residual.slice(0, 40)) console.error(`- ${line}`);
  if (residual.length > 40) console.error(`- …и ещё ${residual.length - 40}`);
  process.exitCode = 1;
} else {
  console.log("Compliance-линтер по content-cache чист.");
}
