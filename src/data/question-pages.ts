import type { Locale } from "@/lib/i18n";
import type { PrefillIntent } from "@/data/cta-copy";
// Значимый импорт — относительный и с расширением: модуль читает и Vite, и
// голый Node (`npm run check:factory`), а алиас `@/` Node не резолвит.
import { EXTRA_QUESTION_PAGES } from "./question-topics-extra.ts";
import { OPEN_LOCALE_QUESTIONS } from "./question-pages-open-locales.ts";

/**
 * НАБОР ДАННЫХ ВОПРОСНЫХ СТРАНИЦ (кластер `questions/*`).
 *
 * Зачем он существует
 * -------------------
 * ИИ-поиски цитируют не страницу, а ОТВЕТ: короткий, атрибутированный, с
 * видимым основанием. По вопросам «нужен ли рецепт», «можно ли увезти»,
 * «в отеле можно?» тайская розница отвечает либо рекламной страницей с ценой,
 * либо пересказом 2022 года. Это и есть пустое место, куда можно встать честной
 * работой — ровно тем же способом, каким его занял правовой гид.
 *
 * Почему тема, а не вопрос на страницу
 * ------------------------------------
 * Страница на один короткий вопрос — это тонкая страница, и ворота качества
 * (`scripts/lib/quality-gate.mjs`, порог 400 слов) её не пропустят, а Google
 * добавит её к 149 URL в статусе «Обнаружена, не проиндексирована». Поэтому
 * единица публикации здесь — ТЕМА с 6–12 вопросами, а единица данных — вопрос.
 *
 * Дисциплина фактуры — та же, что в `legal-guide.ts` и `guide-prescription.ts`
 * -----------------------------------------------------------------------------
 * У каждого ответа ВИДИМОЕ основание, и оно печатается над ответом:
 *   `official`    — пересказ уведомления по ссылке из `sources`, и ничего сверх;
 *   `practice`    — как это выглядит у прилавка; опыт, а не юридический вывод;
 *   `unconfirmed` — проверяемого источника нет, и ответ говорит именно это.
 * Смешивать их запрещено. Третье значение добавлено сознательно: половина
 * туристических вопросов (домашние законы, транзит, пересылка, недомашние формы
 * продукта) не имеет источника, который мы можем показать, и честный пропуск
 * ценнее уверенного вымысла.
 *
 * ЛОКАЛИ ОБЪЯВЛЯЮТСЯ У ВОПРОСА, А НЕ У СТРАНИЦЫ
 * ---------------------------------------------
 * `locales` + `localeNote` у каждого вопроса — это не формальность и не
 * «перевести всё на семь языков». Вопрос «сработает ли мой домашний
 * медицинский документ» бессмыслен для тайского читателя; вопрос «накажут ли
 * меня дома за то, что я делал в Таиланде» задают почти исключительно японская,
 * корейская и китайская аудитории; пересадка в Заливе — арабская. Страница
 * локали собирается ИЗ ВОПРОСОВ, ОТНОСЯЩИХСЯ К ЭТОЙ ЛОКАЛИ, поэтому семь
 * локалей дают семь разных страниц, а не семь переводов одной. Это и есть
 * уникальность на данных, которую ворота видят.
 *
 * ЧТО ЗАПРЕЩЕНО В ЭТОМ ФАЙЛЕ (и это проверяет `scripts/lib/compliance-lexicon.mjs`)
 * • цены, суммы, штрафы в цифрах, «฿», «бат», проценты содержания и
 *   аббревиатуры каннабиноидов — они разрешены ТОЛЬКО на
 *   `guides/legal-cannabis-tourists`;
 * • часы работы, корзина, онлайн-оплата, оферта доставки;
 * • «без рецепта можно», рекламный регистр, медицинские обещания;
 * • расстояния и минуты ходьбы цифрами — их считает `src/lib/geo.ts`.
 *
 * Формат файла — стираемый TypeScript: модуль читают и Vite, и голый Node
 * (`npm run check:factory`), см. `docs/growth/CONTENT-FACTORY.md` §3.
 */

/** Основание ответа. Печатается над ответом видимой строкой. */
export type AnswerBasis = "official" | "practice" | "unconfirmed";

/**
 * Ключ первоисточника в `LEGAL_GUIDE_SOURCES` (`@/data/legal-guide`). Список
 * закрытый: ответ имеет право сослаться только на то, что уже сверено и уже
 * стоит ссылкой на правовом гиде. Новый источник добавляется туда, а не сюда.
 */
export type QuestionSourceKey = "thaiGovernment" | "touristNotice" | "ministerialRegulation2026";

/** Вопрос и ответ на одной локали. `a` — абзацы, а не одна строка с переносами. */
export interface QuestionAnswer {
  q: string;
  a: string[];
}

export interface QuestionEntry {
  /** Машинный идентификатор вопроса — уходит в `id` заголовка и в отчёты. */
  id: string;
  basis: AnswerBasis;
  /** Пусто у `practice` и `unconfirmed`: сноска на закон под опытом — подлог. */
  sources: readonly QuestionSourceKey[];
  /** Локали, на которых вопрос ИМЕЕТ СМЫСЛ. Не «переведено», а «относится». */
  locales: readonly Locale[];
  /** Обоснование состава `locales`. Читает человек, который добавит локаль. */
  localeNote: string;
  /** Текст по локалям. Локаль без текста на страницу не попадает. */
  copy: Partial<Record<Locale, QuestionAnswer>>;
}

export interface QuestionPageMeta {
  title: string;
  description: string;
  h1: string;
  kicker: string;
  lead: string;
  /** Своя строка на каждой странице: одинаковый дисклеймер на шести страницах — повтор. */
  caution: string;
}

export interface QuestionPageData {
  /** Слаг без префикса: маршрут собирает `questionSuffix()`. */
  slug: string;
  intent: PrefillIntent;
  meta: Partial<Record<Locale, QuestionPageMeta>>;
  questions: readonly QuestionEntry[];
}

/** Общие подписи. Короткие: длинная строка, повторённая на шести страницах, — дубль. */
export const QUESTION_UI: Record<
  Locale,
  { basisLabels: Record<AnswerBasis, string>; sourcesTitle: string; cautionTitle: string }
> = {
  en: {
    basisLabels: {
      official: "Official source",
      practice: "Practical caution — not a legal conclusion",
      unconfirmed: "Not confirmed — we have no verified source",
    },
    sourcesTitle: "Where these answers come from",
    cautionTitle: "Read this before you act on it",
  },
  ru: {
    basisLabels: {
      official: "Официальный источник",
      practice: "Практическая осторожность — не юридический вывод",
      unconfirmed: "Не подтверждено — проверяемого источника нет",
    },
    sourcesTitle: "Откуда взяты эти ответы",
    cautionTitle: "Прочитайте, прежде чем действовать",
  },
  th: {
    basisLabels: {
      official: "แหล่งข้อมูลทางการ",
      practice: "ข้อควรระวังในทางปฏิบัติ — ไม่ใช่ข้อสรุปทางกฎหมาย",
      unconfirmed: "ยังไม่ยืนยัน — ไม่มีแหล่งอ้างอิงที่ตรวจสอบได้",
    },
    sourcesTitle: "คำตอบเหล่านี้มาจากไหน",
    cautionTitle: "อ่านก่อนนำไปปฏิบัติ",
  },
  ar: {
    basisLabels: {
      official: "مصدر رسمي",
      practice: "تنبيه عملي — وليس استنتاجًا قانونيًا",
      unconfirmed: "غير مؤكد — لا يوجد مصدر موثّق لدينا",
    },
    sourcesTitle: "من أين جاءت هذه الإجابات",
    cautionTitle: "اقرأ هذا قبل أن تتصرف بناءً عليه",
  },
  zh: {
    basisLabels: {
      official: "官方来源",
      practice: "实务提醒——并非法律结论",
      unconfirmed: "未经证实——我们没有可核查的来源",
    },
    sourcesTitle: "这些答案的依据",
    cautionTitle: "据此行动之前请先读这一段",
  },
  ko: {
    basisLabels: {
      official: "공식 출처",
      practice: "실무상 주의 — 법적 결론이 아닙니다",
      unconfirmed: "확인되지 않음 — 검증된 출처가 없습니다",
    },
    sourcesTitle: "이 답변의 근거",
    cautionTitle: "행동에 옮기기 전에 읽어 주세요",
  },
  ja: {
    basisLabels: {
      official: "公式の出典",
      practice: "実務上の注意 — 法的結論ではありません",
      unconfirmed: "未確認 — 検証できる出典がありません",
    },
    sourcesTitle: "この回答の根拠",
    cautionTitle: "行動に移す前にお読みください",
  },
};

/**
 * ТЕМА 1 — правила и рецепт.
 *
 * Самый частый вопрос в выдаче на всех семи языках и одновременно самый
 * испорченный: половина результатов описывает 2022–2023 годы. Пересечение с
 * `guides/prescription-pattaya` держится низким сознательно — там непрерывный
 * текст про один документ, здесь короткие ответы на разные вопросы, и ни один
 * абзац не пересказывает другой.
 */
const RULES_AND_PRESCRIPTION: QuestionPageData = {
  slug: "rules-and-prescription",
  intent: "prescription",
  meta: {
    en: {
      title: "Cannabis prescription questions from visitors to Thailand",
      description:
        "What the Thai notices require before a shop may sell cannabis flower: the ภ.ท.33 form, who writes it, the age line, and the thirty-day supply limit.",
      h1: "Prescription and eligibility questions visitors ask",
      kicker: "Rules and paperwork",
      lead:
        "Is weed legal here at all, and what paperwork makes a purchase lawful? These arrive at the counter before anything else does. Each answer is labelled with what it rests on — a restatement of an official notice, an observation from working under those notices, or an admission that we have no source we can show you. None of it is legal advice, and none of it confirms that any particular person may buy.",
      caution:
        "Notices, guidance and enforcement change, and a page is only as current as its last edit. Follow the source links below and read them yourself before you plan anything around an answer on this page.",
    },
    ru: {
      title: "Рецепт на каннабис в Таиланде: вопросы приезжих",
      description:
        "Что требуют официальные уведомления до продажи соцветий: форма ภ.ท.33, кто её выписывает, возрастная граница и ограничение запаса тридцатью днями.",
      h1: "Рецепт и допуск к покупке: что спрашивают приезжие",
      kicker: "Правила и документы",
      lead:
        "Легальна ли здесь трава вообще — этот вопрос задают у прилавка раньше всех остальных. Над каждым ответом стоит его основание: пересказ официального уведомления, наблюдение из работы по этим уведомлениям или признание, что показать источник мы не можем. Это не юридическая консультация и не подтверждение, что конкретному человеку продадут.",
      caution:
        "Уведомления, разъяснения и практика применения меняются, а страница свежа ровно настолько, насколько свежа её последняя правка. Откройте источники по ссылкам ниже и прочитайте их сами, прежде чем строить планы вокруг ответа отсюда.",
    },
  },
  questions: [
    {
      id: "weed-legal-2026",
      basis: "official",
      sources: ["thaiGovernment", "ministerialRegulation2026"],
      locales: ["en", "ru"],
      localeNote:
        "Формулировка «is weed legal» — эхо англо- и русскоязычной выдачи; на остальных локалях легальность уже закрывают need-prescription и страницы правил, поэтому текст живёт ровно там, где живёт запрос.",
      copy: {
        en: {
          q: "Is weed legal in Pattaya in 2026?",
          a: [
            "Legal to sell and to buy — under conditions, not as a free-for-all. Going by the notices linked at the foot of this page, cannabis flower is a controlled herb: it may be sold at licensed premises, in person, to adults 20 and over, against a prescription issued in Thailand. The ministerial regulation of April 2026 narrowed which premises can hold that licence.",
            "What “legal” does not mean: no online sale or delivery, no advertised prices, and no counter that may skip the paperwork. Pattaya applies the same national rule as the rest of Thailand — there is no city-level exemption, and a shop offering a way around the conditions is the one to walk away from.",
          ],
        },
        ru: {
          q: "Легален ли каннабис (weed) в Паттайе в 2026 году?",
          a: [
            "Легален для продажи и покупки — но на условиях, а не как свободный товар. По уведомлениям, на которые ведут ссылки внизу страницы, соцветия каннабиса — контролируемая трава: продавать их можно только в лицензированных помещениях, лично, взрослым от 20 лет и по рецепту, выданному в Таиланде. Министерское постановление апреля 2026 года сузило круг помещений, которым доступна такая лицензия.",
            "Чего «легально» не означает: онлайн-продажи и доставки, рекламы цен и прилавка, где закроют глаза на документы. В Паттайе действует то же общенациональное правило, что и во всём Таиланде: городских исключений нет, а точка, предлагающая обойти условия, — ровно то место, откуда стоит уйти.",
          ],
        },
      },
    },
    {
      id: "need-prescription",
      basis: "official",
      sources: ["thaiGovernment", "touristNotice"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Первый вопрос на всех семи локалях без исключения: он одинаково стоит и в подсказках поиска, и в первой фразе разговора у прилавка.",
      copy: {
        en: {
          q: "Do I need a prescription to buy cannabis flower in Thailand?",
          a: [
            "Yes, going by the notices linked at the foot of this page. The Thai Government notice treats cannabis flower as a controlled herb and says retail sale to the general public requires a prescription; the official tourist notice says a visitor needs one that was issued inside Thailand.",
            "Neither text describes a holiday exemption, a tourist quota or a lighter version of the rule for someone who is here for a week. If a page you are reading says otherwise, check the date on it.",
          ],
        },
        ru: {
          q: "Нужен ли рецепт, чтобы купить соцветия в Таиланде?",
          a: [
            "Да, если читать уведомления по ссылкам внизу страницы. Правительство Таиланда относит соцветия каннабиса к контролируемым травам и указывает, что для розничной продажи населению требуется рецепт; официальное уведомление для туристов говорит, что приезжему нужен документ, выданный внутри страны.",
            "Ни в одном из этих текстов нет отпускного послабления, туристической квоты или облегчённой версии правила для тех, кто приехал на неделю. Если статья утверждает обратное — посмотрите на её дату.",
          ],
        },
      },
    },
    {
      id: "what-is-pt33",
      basis: "official",
      sources: ["ministerialRegulation2026"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Название формы приезжий впервые слышит у прилавка и не может ни записать, ни проверить: тайская запись ภ.ท.33 и транслитерация PT 33 нужны на всех локалях одинаково.",
      copy: {
        en: {
          q: "What is ภ.ท.33, and why do shops keep mentioning it?",
          a: [
            "ภ.ท.33 — transliterated PT 33 — is the controlled-herb prescription form that cannabis flower is dispensed against, and the ministerial regulation of April 2026 keeps the flower tied to it. In practice that is why a counter is looking for one specific kind of paperwork rather than for any letter from any doctor.",
            "Form numbers are administrative and do get renumbered. Ask the clinic to confirm which form it is issuing on the day you are seen, rather than arguing from a forum thread written a year ago.",
          ],
        },
        ru: {
          q: "Что такое ภ.ท.33 и почему магазины про неё говорят?",
          a: [
            "ภ.ท.33, в транслитерации PT 33, — форма рецепта на контролируемую траву, по которой отпускаются соцветия; министерское постановление апреля 2026 года сохраняет эту привязку. Именно поэтому у прилавка ищут одну конкретную бумагу, а не любое письмо от любого врача.",
            "Номера форм — вещь административная, их перенумеровывают. Спросите в клинике в день приёма, на какой форме вам выписывают документ, вместо того чтобы спорить по ветке форума годовой давности.",
          ],
        },
      },
    },
    {
      id: "who-issues",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос про порядок, а не про норму: уведомления называют класс лица, но не описывают процедуру, поэтому ответ везде одинаково остаётся практикой.",
      copy: {
        en: {
          q: "Who is allowed to write the document, and can you arrange it?",
          a: [
            "A practitioner registered in Thailand. What a counter cares about is the class of person who signed, not a named clinic, so where you are seen is your choice; what is read afterwards is the document itself, not the route you took to it.",
            "We are a retail counter and not a medical practice. We do not issue this document, we do not book the appointment, and we cannot say in advance what any practitioner will decide. What we can do is look at what you already hold and tell you whether it is the right kind of paper.",
          ],
        },
        ru: {
          q: "Кто вправе выписать документ и можете ли вы это устроить?",
          a: [
            "Практикующий специалист, зарегистрированный в Таиланде. У прилавка важен класс лица, поставившего подпись, а не конкретная клиника, поэтому куда идти на приём — ваш выбор; потом читают сам документ, а не маршрут, которым вы к нему пришли.",
            "Мы розничный прилавок, а не медицинская практика. Мы не выписываем этот документ, не записываем на приём и не можем заранее сказать, что решит специалист. Что мы можем — посмотреть на то, что у вас уже есть, и сказать, та ли это бумага.",
          ],
        },
      },
    },
    {
      id: "foreign-document",
      basis: "official",
      sources: ["touristNotice"],
      locales: ["en", "ru", "zh", "ko", "ja"],
      localeNote:
        "Вопрос имеет смысл там, где у читателя дома вообще может оказаться медицинский документ на каннабис или где спрашивают про справку от домашнего врача: англоязычная аудитория, русская, китайская, корейская, японская. Тайскому читателю домашний документ не нужен, а в арабской выдаче этот вопрос не встречается вовсе — там спрашивают про пересадку и про закон дома, см. тему про вывоз.",
      copy: {
        en: {
          q: "Will the paperwork I use at home work here?",
          a: [
            "The tourist notice describes a prescription issued in Thailand, and a medical card, a clinic letter or an app screen from another jurisdiction is not that. No counter can convert one into the other, and being asked politely does not change the answer.",
            "This catches out visitors from places where cannabis is ordinary and legal more often than anyone else, because they arrive expecting the document they always use to be read the same way. Plan around it before the flight rather than in a doorway.",
          ],
        },
        ru: {
          q: "Подойдёт ли документ, с которым я обычно хожу дома?",
          a: [
            "Уведомление для туристов описывает рецепт, выданный в Таиланде, а медицинская карта, письмо клиники или карточка в приложении из другой юрисдикции — это не он. Превратить одно в другое у прилавка нельзя, и вежливая просьба ответа не меняет.",
            "Чаще всего на этом спотыкаются приезжие из мест, где каннабис — обычная легальная вещь: они везут документ, который дома принимают не глядя. Разбираться с этим лучше до вылета, а не в дверях.",
          ],
        },
      },
    },
    {
      id: "age-and-who-not",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Возрастная граница — универсальный вопрос; вторая часть ответа (кому уведомление продавать не разрешает) на всех локалях нужна одинаково, потому что её нигде не пишут.",
      copy: {
        en: {
          q: "Is there an age limit, and is anyone else excluded?",
          a: [
            "Twenty. The controlled-herb notice does not permit sale to anyone under 20, and it does not permit sale to a pregnant woman or to a woman who is breastfeeding either. That is the rule as written, not a house policy invented by a shop.",
            "For a visitor the passport is the document that proves age in a form staff can actually read. Expect it to be read rather than glanced at, and expect that to happen on every visit rather than once.",
          ],
        },
        ru: {
          q: "Есть ли возрастная граница и кому ещё не продают?",
          a: [
            "Двадцать лет. Уведомление о контролируемых травах не допускает продажу лицам младше 20 лет, а также беременным и кормящим женщинам. Это норма в том виде, как она написана, а не выдумка отдельного магазина.",
            "Приезжему возраст подтверждает паспорт — единственный документ, который персонал действительно может прочитать. Его именно читают, а не окидывают взглядом, и делают это в каждый приход, а не один раз.",
          ],
        },
      },
    },
    {
      id: "thirty-days",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Цифру тридцати дней пересказывают все туристические статьи и почти все — как разрешённый запас. Опровержение нужно на каждой локали, где эту цифру уже прочитали, то есть на всех.",
      copy: {
        en: {
          q: "The thirty-day figure — is that an amount I am entitled to?",
          a: [
            "No. The government notice limits a prescription to a supply of no more than thirty days. That is a ceiling on what a document may cover — not an entitlement, not a monthly quota, and not a statement about what is on a shelf on a given day.",
            "An individual document can be written narrower than the ceiling. The figure that applies to you is the one on your own paper, not the one in the headline of an article.",
          ],
        },
        ru: {
          q: "Тридцать дней — это то, что мне положено?",
          a: [
            "Нет. Уведомление правительства ограничивает рецепт запасом не более чем на тридцать дней. Это верхняя граница того, что документ может покрывать, — не право, не месячная квота и не утверждение о том, что лежит на полке сегодня.",
            "Конкретный документ может быть выписан уже этой границы. Для вас действует цифра из вашей бумаги, а не из заголовка статьи.",
          ],
        },
      },
    },
    {
      id: "shop-cannot-issue",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Предложение «мы всё оформим на месте» встречается в каждой туристической зоне, поэтому проверка нужна на любой локали; формулировка ответа от локали не зависит.",
      copy: {
        en: {
          q: "A shop offered to sort the paperwork on the spot. Is that normal?",
          a: [
            "A retail counter is not where that document comes from. It is medical, it names you, and it arrives from a practitioner — the counter reads it, records the sale and hands over the goods.",
            "When someone behind a counter offers to produce the paperwork while you wait, the useful conclusion is about that counter rather than about your chances. Walk out and pick a different door; in a city with several hundred shops that costs you nothing.",
          ],
        },
        ru: {
          q: "В магазине предложили «всё оформить на месте». Так бывает?",
          a: [
            "Розничный прилавок — не то место, где этот документ выписывают. Он медицинский, он на ваше имя и приходит от специалиста, а прилавок его читает, фиксирует продажу и отдаёт товар.",
            "Если за прилавком предлагают изготовить бумагу, пока вы ждёте, вывод отсюда — про этот прилавок, а не про ваши шансы. Выйти и выбрать другую дверь в городе с несколькими сотнями магазинов не стоит ничего.",
          ],
        },
      },
    },
    {
      id: "what-changed-2026",
      basis: "official",
      sources: ["ministerialRegulation2026"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Изменение 2026 года ещё не разошлось по туристическим статьям ни на одном языке — это самый свежий проверяемый факт в кластере и самый цитируемый ИИ-поисками.",
      copy: {
        en: {
          q: "Did anything change in 2026?",
          a: [
            "On the selling side, yes. A ministerial regulation on licensing the sale and processing of controlled herbs for commercial purposes (No. 2), B.E. 2569, was published on 29 April 2026 and took effect the following day.",
            "It narrows the premises that may hold the licence to a medical facility, a pharmacy or a registered herbal-products shop, and it requires a person who has completed the official cannabis training to be present the whole time the premises is trading. Nothing in it creates an exemption for foreign visitors: the prescription requirement and the supply limit stand as the 2025 notice wrote them.",
          ],
        },
        ru: {
          q: "Изменилось ли что-то в 2026 году?",
          a: [
            "Со стороны продавца — да. Министерское постановление о лицензировании продажи и переработки контролируемых трав в коммерческих целях (№ 2), พ.ศ. 2569, опубликовано 29 апреля 2026 года и вступило в силу на следующий день.",
            "Оно сужает круг помещений, которые могут держать лицензию, до медицинского учреждения, аптеки и зарегистрированного магазина растительных продуктов и требует, чтобы человек, прошедший официальное обучение по каннабису, находился в помещении всё время работы. Послаблений для иностранцев в нём нет: требование рецепта и ограничение запаса остаются такими, какими их написало уведомление 2025 года.",
          ],
        },
      },
    },
    {
      id: "other-forms",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос про формы, кроме соцветий, задают везде, и везде на него отвечают уверенно и без источника. Мы отвечаем пропуском — на всех локалях одинаково, потому что источника нет ни на одной.",
      copy: {
        en: {
          q: "Do these answers cover oils and edibles as well as flower?",
          a: [
            "Everything on this page is written about cannabis flower, and that is the limit of what we will state. Other preparations of the plant sit under rules we have not read in an official text, so we do not describe them here.",
            "A confident answer would be worth less to you than an honest gap: it is exactly the kind of sentence that gets copied into a hundred travel pages and then quoted back at an officer. Ask the practitioner who writes your document, and read the primary sources linked at the foot of this page yourself.",
          ],
        },
        ru: {
          q: "Эти ответы относятся к маслам и съедобному или только к соцветиям?",
          a: [
            "Всё на этой странице написано про соцветия каннабиса, и дальше этого мы не идём. Другие препараты растения живут по правилам, которых мы не читали в официальном тексте, поэтому мы их здесь не описываем.",
            "Уверенный ответ стоил бы для вас меньше, чем честный пропуск: именно такие фразы расходятся по сотне туристических страниц, а потом их цитируют инспектору. Спросите специалиста, который выписывает документ, и прочитайте первоисточники по ссылкам внизу страницы.",
          ],
        },
      },
    },
  ],
};

/**
 * ТЕМА 2 — как проходит покупка на практике.
 *
 * Здесь почти нет нормы и почти всё — практика: уведомления описывают, что
 * должно быть проверено, и молчат о том, как выглядит визит. Именно этот
 * пробел заполняют рекламные страницы, и именно он лучше всего цитируется
 * ИИ-поисками, когда его закрывают честно.
 */
const BUYING_IN_PERSON: QuestionPageData = {
  slug: "buying-in-person",
  intent: "visit",
  meta: {
    en: {
      title: "Buying cannabis in person in Pattaya: visitor questions",
      description:
        "What a visit to a licensed Pattaya counter involves: what to carry, why nothing is arranged online, what is checked at the door and what a shop will not tell you in a message.",
      h1: "What actually happens at the counter in Pattaya",
      kicker: "At the counter",
      lead:
        "The rules say what must be checked. They say nothing about how a visit feels, which is why this part of the internet is written almost entirely by advertising. Below is the same ground covered from the other side of the counter, with the practical answers marked as practice and not dressed up as law.",
      caution:
        "Every counter runs its own door slightly differently, so treat this as the shape of a visit rather than a script. Where an answer says we do not publish something, that is because it is not confirmed — not because it is being kept from you.",
    },
    ru: {
      title: "Покупка каннабиса в Паттайе на месте: вопросы приезжих",
      description:
        "Из чего состоит визит в лицензированный магазин в Паттайе: что взять с собой, почему ничего не оформляется онлайн, что проверяют у двери и чего не скажут в переписке.",
      h1: "Как на самом деле проходит визит к прилавку",
      kicker: "У прилавка",
      lead:
        "Правила описывают, что обязаны проверить. Про то, как выглядит сам визит, в них нет ни слова — и этот пробел в интернете заполнен почти целиком рекламой. Ниже та же территория со стороны прилавка, где практика помечена практикой и не выдаётся за норму.",
      caution:
        "Каждая дверь устроена немного по-своему, поэтому читайте это как форму визита, а не как сценарий. Если в ответе написано, что мы чего-то не публикуем, — значит, это не подтверждено, а не спрятано от вас.",
    },
  },
  questions: [
    {
      id: "what-to-bring",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Сборы перед выходом — универсальная часть визита; отличается только документ, удостоверяющий личность, и это отличие названо прямо в ответе.",
      copy: {
        en: {
          q: "What do I actually need to carry with me?",
          a: [
            "Two things, both originals: identification and the prescription. For a visitor the identification is the passport; a resident shows a Thai identity card. Photographs of either on a phone are not the document, and this is the single most common reason a visit ends at the counter instead of at the till.",
            "Everything else is optional. There is no membership, no registration form to fill in beforehand and no third document that people sometimes arrive clutching.",
          ],
        },
        ru: {
          q: "Что реально нужно взять с собой?",
          a: [
            "Две вещи, обе в оригинале: удостоверение личности и рецепт. Приезжему удостоверение — паспорт, местному жителю — тайская идентификационная карта. Фотография любого из них в телефоне документом не является, и именно на этом чаще всего заканчивается визит, не дойдя до кассы.",
            "Всё остальное необязательно. Нет ни членства, ни анкеты, которую надо заполнить заранее, ни третьей бумаги, с которой иногда приходят.",
          ],
        },
      },
    },
    {
      id: "thai-sim",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Чисто приезжий вопрос: тайскую симку спрашивают те, кто прилетел без неё и боится, что без местного номера не обслужат. Тайскому читателю он бессмыслен, поэтому на th этот вопрос на страницу не попадает.",
      copy: {
        en: {
          q: "Do I need a Thai SIM card or a local phone number?",
          a: [
            "Not for the purchase itself. A counter here works from age, identity and the prescription; a phone number is not among the things it looks at, and nobody at ours has ever been turned away for arriving without one.",
            "A working connection is still worth having for a different reason: it is how you ask a question before crossing the city rather than after. Hotel wi-fi and a messaging app are enough for that.",
          ],
        },
        ru: {
          q: "Нужна ли тайская сим-карта или местный номер?",
          a: [
            "Для самой покупки — нет. У прилавка смотрят возраст, личность и рецепт; телефонного номера в этом перечне нет, и у нас никого не разворачивали из-за его отсутствия.",
            "Связь пригодится по другой причине: с ней вопрос задаётся до поездки через весь город, а не после. Для этого хватает отельного вайфая и мессенджера.",
          ],
        },
      },
    },
    {
      id: "no-online",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Привычка оформлять всё заранее одинаково сильна во всех аудиториях, а запрет на электронный канал — норма, а не наша политика; поэтому вопрос стоит на всех локалях.",
      copy: {
        en: {
          q: "Can I reserve or pay for something before I arrive?",
          a: [
            "No. The government notice says sale through vending machines, through electronic channels or computer networks, and advertising through all channels are prohibited. A reservation with money attached is a sale through an electronic channel, whatever the button is called.",
            "This is also the answer to the question people ask second: why this site has no basket, no stock page and no figures anywhere on it. The absence is the rule being followed, not an oversight.",
          ],
        },
        ru: {
          q: "Можно ли забронировать или оплатить заранее?",
          a: [
            "Нет. Уведомление правительства запрещает продажу через автоматы, электронные каналы и компьютерные сети, а также рекламу во всех каналах. Бронь с деньгами — это продажа через электронный канал, как бы ни называлась кнопка.",
            "Отсюда же ответ на второй по частоте вопрос: почему на сайте нет ни корзины, ни витрины, ни одной цифры. Это соблюдение нормы, а не недоделка.",
          ],
        },
      },
    },
    {
      id: "payment-methods",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Способ оплаты у прилавка спрашивают все аудитории — и ни для одной у нас нет подтверждённого ответа, поэтому вопрос стоит везде, а ответом служит честный пропуск.",
      copy: {
        en: {
          q: "How is payment handled in the shop?",
          a: [
            "In person, at the counter, when the documents have been read — that part follows from the prohibition on selling through electronic channels and is not a preference.",
            "Which means of payment a counter takes is something this site does not state, because it is not confirmed here and it is exactly the kind of detail that changes without anyone updating a web page. Ask before you travel across town; a straight answer costs one message.",
          ],
        },
        ru: {
          q: "Как проходит оплата в магазине?",
          a: [
            "Лично, у прилавка, после того как прочитаны документы, — это следствие запрета продавать через электронные каналы, а не наше предпочтение.",
            "Какие средства оплаты принимает прилавок, этот сайт не утверждает: у нас это не подтверждено, а такие детали меняются, и никто не идёт править из-за них страницу. Спросите до поездки через весь город — прямой ответ стоит одного сообщения.",
          ],
        },
      },
    },
    {
      id: "photo-of-passport",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Оставлять паспорт в сейфе и носить фотографию — привычка именно приезжего; у тайского читателя карта всегда с собой, поэтому на th вопрос не выводится.",
      copy: {
        en: {
          q: "My passport is in the hotel safe. Is a photo of it enough?",
          a: [
            "No, and it is worth knowing that before you set out rather than at the door. A photograph proves nothing about who is holding the phone, and a counter that accepts one is not applying a check at all.",
            "The same goes for the prescription. Carry both, keep them together, and treat the walk back to the hotel as part of the cost of arriving without them.",
          ],
        },
        ru: {
          q: "Паспорт в сейфе отеля — хватит ли фотографии?",
          a: [
            "Нет, и узнать это лучше до выхода, а не у двери. Фотография ничего не говорит о том, кто держит телефон, а прилавок, который её принимает, проверку попросту не делает.",
            "То же самое с рецептом. Носите оба вместе, а дорогу обратно в отель считайте частью цены прихода без них.",
          ],
        },
      },
    },
    {
      id: "every-visit",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос повторного визита возникает у любого, кто пришёл во второй раз, независимо от языка и от статуса резидента.",
      copy: {
        en: {
          q: "I came yesterday. Will I be asked for everything again?",
          a: [
            "Yes. The check is per purchase, not per person, and being remembered by a member of staff is not a substitute for it. It is quick, but it happens.",
            "Read that as a good sign rather than as suspicion: a counter that stops checking regulars is a counter that has decided the rules apply on some days and not others, and the licence on its wall is what it is gambling with.",
          ],
        },
        ru: {
          q: "Я был вчера. Спросят ли всё заново?",
          a: [
            "Да. Проверка привязана к покупке, а не к человеку, и то, что вас узнали, её не заменяет. Занимает это немного, но происходит каждый раз.",
            "Считайте это хорошим признаком, а не подозрением: прилавок, переставший проверять постоянных, решил, что правила действуют не всегда, — и рискует при этом лицензией со стены.",
          ],
        },
      },
    },
    {
      id: "buying-for-others",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Компания, в которой документ есть у одного, — типовая ситуация в любой туристической группе; вопрос одинаково актуален на всех локалях.",
      copy: {
        en: {
          q: "Can I buy for a friend who stayed at the hotel?",
          a: [
            "No. The document names a person, the check is made on the person standing there, and a purchase for somebody who is not present is not something a counter here will complete.",
            "The part visitors underestimate is what happens afterwards. Handing what you bought to somebody else — particularly to anybody under twenty — makes you the person who supplied it, and that is a different conversation entirely from the one about buying.",
          ],
        },
        ru: {
          q: "Можно ли купить для друга, который остался в отеле?",
          a: [
            "Нет. Документ выписан на человека, проверяют того, кто стоит перед прилавком, а покупку для отсутствующего у прилавка не проведут.",
            "Недооценивают обычно то, что происходит потом. Передать купленное другому — тем более тому, кому нет двадцати, — значит стать тем, кто это предоставил, а это совсем другой разговор, чем разговор о покупке.",
          ],
        },
      },
    },
    {
      id: "explain-why",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Опасение «начнут расспрашивать о здоровье» одинаково распространено везде, где документ впервые называют медицинским.",
      copy: {
        en: {
          q: "Will I have to explain my medical situation at the counter?",
          a: [
            "That conversation belongs to the consultation, not to the shop. A counter reads what the practitioner wrote and works from that; it is not the place where the reasoning is examined again.",
            "What you will be asked about is ordinary retail ground — what you are looking for, what is on the shelf that day, what is worth comparing against what. If a question feels wrong, you are allowed to leave without answering it.",
          ],
        },
        ru: {
          q: "Придётся ли объяснять у прилавка, что со мной?",
          a: [
            "Этот разговор относится к приёму у специалиста, а не к магазину. У прилавка читают то, что написал специалист, и работают с этим; заново разбирать основания там не место.",
            "Спрашивать будут обычное розничное: что вы ищете, что сегодня на полке, что с чем имеет смысл сравнить. Если вопрос кажется неуместным, уйти, не ответив, — ваше право.",
          ],
        },
      },
    },
    {
      id: "ask-before-coming",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос «можно ли уточнить заранее» задают на всех локалях, и на всех же ответ упирается в одну и ту же границу электронного канала.",
      copy: {
        en: {
          q: "Can I check anything by message before I come?",
          a: [
            "Yes, and it is the sensible order of operations. Describe what you are holding and you will get a straight answer about whether it is the right kind of document; ask how to find the door and you will get directions.",
            "What a message will not contain is a figure. We do not name numbers in electronic channels at all, so the counter is where that part of the conversation happens.",
          ],
        },
        ru: {
          q: "Можно ли что-то уточнить в переписке до визита?",
          a: [
            "Да, и это правильный порядок действий. Опишите, что у вас на руках, — получите прямой ответ, та ли это бумага; спросите, как найти дверь, — получите дорогу.",
            "Чего в сообщении не будет, так это цифр. Мы не называем их в электронных каналах вовсе, поэтому эта часть разговора происходит у прилавка.",
          ],
        },
      },
    },
    {
      id: "record-of-sale",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Опасение попасть в какой-то список одинаково у всех приезжих; для тайского читателя вопрос тоже осмыслен, потому что запись ведётся независимо от гражданства.",
      copy: {
        en: {
          q: "Does the shop write down who I am?",
          a: [
            "A licensed counter keeps its own record of what it sold and against which document — that is part of operating under a licence rather than something aimed at you, and it is the reason the paperwork is read carefully rather than waved through.",
            "We do not publish what any given shop keeps or for how long, because we have not read a source that sets it out, and inventing one would be worse than saying so. If it matters to you, ask at the door before the purchase rather than after it.",
          ],
        },
        ru: {
          q: "Записывают ли в магазине, кто я?",
          a: [
            "Лицензированный прилавок ведёт собственную запись о том, что и по какому документу продано: это часть работы по лицензии, а не мера против вас, и именно поэтому бумагу читают внимательно, а не пропускают взглядом.",
            "Что именно и как долго хранит конкретный магазин, мы не публикуем: источника, который это устанавливает, мы не читали, а выдумать его было бы хуже, чем признаться. Если для вас это важно — спросите у двери до покупки, а не после.",
          ],
        },
      },
    },
  ],
};

/**
 * ТЕМА 3 — где можно и где нельзя.
 *
 * Самая дорогая для читателя тема кластера: законная покупка превращается в
 * разговор с полицией почти всегда одним и тем же способом — употреблением на
 * улице. Ни одной цифры штрафа здесь нет и быть не может: денежные суммы
 * разрешены линтером только на правовом гиде, а ошибка в размере штрафа хуже
 * его отсутствия.
 */
const WHERE_YOU_CAN_USE: QuestionPageData = {
  slug: "where-you-can-use",
  intent: "visit",
  meta: {
    en: {
      title: "Where cannabis may not be used in Pattaya: visitor questions",
      description:
        "Public use, hotel rooms, balconies, bars and scooters: what turns a lawful purchase in Pattaya into a police matter, and what a visitor can do about it.",
      h1: "Where visitors may and may not use what they bought",
      kicker: "Public and private space",
      lead:
        "Almost every story that starts with a lawful purchase and ends badly passes through this page. Nothing here is a penalty schedule — we do not publish figures we cannot source — and everything here is the practical side of the counter rather than a legal conclusion.",
      caution:
        "House rules, tenancy agreements and local enforcement differ street by street, and none of them are published in one place. When an answer here and a sign on a wall disagree, the sign on the wall is the one you are standing under.",
    },
    ru: {
      title: "Где в Паттайе нельзя употреблять: вопросы приезжих",
      description:
        "Улица, пляж, номер отеля, балкон, бары и байк: из-за чего законная покупка в Паттайе превращается в разговор с полицией и что с этим может сделать приезжий.",
      h1: "Где приезжему можно и нельзя употреблять купленное",
      kicker: "Публичное и частное пространство",
      lead:
        "Почти каждая история, которая начинается законной покупкой и кончается плохо, проходит через эту страницу. Здесь нет ни одного размера штрафа — цифр, которых мы не можем подтвердить, мы не публикуем, — и всё здесь практическая сторона прилавка, а не юридический вывод.",
      caution:
        "Правила заведений, условия аренды и то, как за этим следят, отличаются от улицы к улице и нигде не собраны в один документ. Если ответ отсюда расходится с табличкой на стене, действует та стена, под которой вы стоите.",
    },
  },
  questions: [
    {
      id: "public-use",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Единственный вопрос кластера, который стоит выводить первым на любой локали: ошибка здесь стоит дороже всех остальных вместе взятых.",
      copy: {
        en: {
          q: "Can I use it on the beach or in the street?",
          a: [
            "No. Not on the sand, not on Beach Road, not in a soi, not in a hotel lobby or a corridor, not in a taxi. Public use is the single most common way a lawful purchase becomes an encounter with the police in this city, and it is entirely avoidable.",
            "It is also the part that visitors talk themselves out of most easily, because the street looks relaxed and somebody nearby is doing it. What somebody else is getting away with today is not a rule, and it will not be quoted back to you in your defence.",
          ],
        },
        ru: {
          q: "Можно ли употреблять на пляже или на улице?",
          a: [
            "Нет. Ни на песке, ни на Бич-роуд, ни в сое, ни в лобби отеля, ни в коридоре, ни в такси. Употребление на людях — самый частый способ превратить законную покупку в разговор с полицией в этом городе, и его целиком можно избежать.",
            "Именно здесь приезжие легче всего себя уговаривают: улица выглядит расслабленной, и кто-то рядом уже это делает. То, что сегодня сходит с рук другому, правилом не становится и в вашу защиту процитировано не будет.",
          ],
        },
      },
    },
    {
      id: "hotel-room",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Ночует в отеле каждая аудитория кластера, и запрет курения в номере устроен одинаково для всех — вопрос выводится на всех локалях.",
      copy: {
        en: {
          q: "What about my own hotel room or the balcony?",
          a: [
            "Check before you assume. A great many hotels and condominium buildings in Pattaya prohibit smoking of any kind indoors, balconies included, and enforce it with a charge on the bill; the ban is a house rule and it does not care what the substance was.",
            "The practical detail people miss is the route the complaint takes. Smell travels along corridors and through air conditioning, so the person who reports it is usually a neighbour rather than a member of staff — and by then the conversation is with the front desk, not with you.",
          ],
        },
        ru: {
          q: "А в своём номере или на балконе?",
          a: [
            "Проверьте, прежде чем решать за отель. Очень многие гостиницы и кондоминиумы в Паттайе запрещают курение в помещении в любом виде, включая балкон, и подкрепляют запрет строкой в счёте; это правило заведения, и ему всё равно, что именно вы курили.",
            "Упускают обычно путь, которым приходит жалоба. Запах идёт по коридору и по вентиляции, поэтому сообщает о нём чаще сосед, а не персонал, — и разговор к этому моменту ведётся уже со стойкой, а не с вами.",
          ],
        },
      },
    },
    {
      id: "rented-condo",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "zh"],
      localeNote:
        "Долгая аренда кондо — сценарий русскоязычных зимовщиков, англоязычных долгосрочников, местных арендаторов и китайских покупателей недвижимости. Для аудиторий короткой поездки (ar, ko, ja) вопрос почти не встречается, поэтому на их страницы он не выводится.",
      copy: {
        en: {
          q: "I rent a condo for the season. Do the same rules apply?",
          a: [
            "The public-space part does, unchanged: a lift, a lobby, a corridor, a shared pool deck and a car park are not your apartment. Inside the unit you are dealing with a second layer — the building's regulations and your tenancy agreement, which are private rules and can be stricter than anything the law requires.",
            "Read the agreement before the first evening rather than after the first complaint. A juristic person that fines a unit for smoke does not have to prove what was burning to make the charge stick.",
          ],
        },
        ru: {
          q: "Я снимаю кондо на сезон. Правила те же?",
          a: [
            "Публичная часть — та же и без изменений: лифт, лобби, коридор, общий бассейн и парковка вашей квартирой не являются. Внутри юнита добавляется второй слой — правила здания и договор аренды; это частные нормы, и они бывают строже любых требований закона.",
            "Прочитайте договор до первого вечера, а не после первой жалобы. Управляющей компании, которая выставляет счёт за дым, не нужно доказывать, что именно горело, чтобы этот счёт устоял.",
          ],
        },
      },
    },
    {
      id: "bars-and-venues",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Бары и рестораны — общая для всех точка неопределённости: заведение может выглядеть разрешающим, и это ничего не меняет.",
      copy: {
        en: {
          q: "A bar said it was fine on their terrace. Is it?",
          a: [
            "A venue can decide what it tolerates on its own premises; it cannot decide what counts as public space, and a terrace open to the street is not a private room. Being told it is fine by somebody who does not carry the consequence is worth exactly what it costs.",
            "The safer reading is the boring one: treat anywhere strangers can walk past as public, and treat permission from staff as their opinion rather than as cover.",
          ],
        },
        ru: {
          q: "В баре сказали, что на террасе можно. Можно?",
          a: [
            "Заведение вправе решать, что оно терпит у себя; решать, что считается общественным местом, оно не может, а терраса, открытая на улицу, отдельной комнатой не становится. Разрешение от того, кто не несёт последствий, стоит ровно столько, сколько за него заплачено.",
            "Безопасное прочтение — скучное: считайте публичным всё, мимо чего ходят посторонние, а согласие персонала — их мнением, а не прикрытием.",
          ],
        },
      },
    },
    {
      id: "carrying-around",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Носить с собой купленное приходится любому, кто не идёт из магазина сразу домой; вопрос не зависит ни от языка, ни от статуса.",
      copy: {
        en: {
          q: "Can I carry it with me while I am out?",
          a: [
            "If you do, keep the prescription with it. The document is what connects what you are carrying to a lawful purchase, and it is no use in a hotel safe on the other side of town at the moment somebody asks.",
            "The rest is common sense that people abandon on holiday: sealed rather than open, in a bag rather than in a hand, and not passed around a table. Carrying quietly is not the risky part — the risky part is using it where you are standing.",
          ],
        },
        ru: {
          q: "Можно ли носить купленное с собой?",
          a: [
            "Если носите — держите рецепт вместе с ним. Именно документ связывает то, что у вас с собой, с законной покупкой, и в сейфе отеля на другом конце города он бесполезен ровно в ту минуту, когда о нём спросят.",
            "Остальное — здравый смысл, который на отдыхе бросают первым: закрытым, а не открытым, в сумке, а не в руке, и не по кругу за столом. Рискованно не носить — рискованно употреблять там, где стоишь.",
          ],
        },
      },
    },
    {
      id: "driving",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Аренда байка в Паттайе одинаково массова во всех аудиториях, включая тайскую; вопрос выводится везде.",
      copy: {
        en: {
          q: "Can I ride a scooter afterwards?",
          a: [
            "Do not. This is the advice visitors ignore most cheerfully and regret most expensively, and it holds whether or not anybody stops you: Pattaya traffic punishes slow reactions on its own, without help from an officer.",
            "Insurance is the second half of it. A claim after an accident is examined by people who are looking for a reason to decline it, and there is no version of this where being impaired improves your position.",
          ],
        },
        ru: {
          q: "Можно ли потом сесть на байк?",
          a: [
            "Не садитесь. Этот совет игнорируют веселее всех остальных и жалеют дороже всех остальных, и работает он независимо от того, остановит вас кто-нибудь или нет: паттайский трафик наказывает за замедленную реакцию сам, без помощи инспектора.",
            "Вторая половина — страховка. Заявление после аварии рассматривают люди, которые ищут причину отказать, и нет такой версии событий, где состояние за рулём улучшает вашу позицию.",
          ],
        },
      },
    },
    {
      id: "sharing",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Компания за столом устроена одинаково на любом языке, и юридическая разница между «угостить» и «предоставить» нигде не очевидна читателю.",
      copy: {
        en: {
          q: "Can I pass it to a friend?",
          a: [
            "Handing what you bought to somebody else is not a small courtesy in this context — it makes you the person who supplied it, and the fact that the purchase was lawful does not travel with the item.",
            "Where the other person is under twenty, that is a category of its own and there is no grey area about it here at all. If the group wants to share an evening, each adult sorts out their own document.",
          ],
        },
        ru: {
          q: "Можно ли передать другу?",
          a: [
            "Передать купленное другому в этом контексте — не мелкая любезность: вы становитесь тем, кто это предоставил, а законность покупки вместе с предметом не переходит.",
            "Если второму человеку нет двадцати, это отдельная категория, и никакой серой зоны здесь нет. Если компании хочется провести вечер вместе, документ каждый взрослый оформляет себе сам.",
          ],
        },
      },
    },
    {
      id: "police-stop",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос задают везде, и везде на него отвечают выдуманными цифрами штрафов. Наш ответ — отказ выдумывать, и он одинаково нужен на всех локалях.",
      copy: {
        en: {
          q: "What happens if I am stopped and asked about it?",
          a: [
            "We are not going to describe a procedure we have not been shown in writing, and we do not publish penalty figures we cannot source — the internet has plenty of both, and they contradict each other page to page.",
            "What we will say is the part that is within our knowledge: what you are holding, in original form, is what connects you to a lawful purchase, and staying calm and polite has never made any version of that conversation worse. If your situation is serious, the person to ask is a lawyer in Thailand, not a shop and not a forum.",
          ],
        },
        ru: {
          q: "Что будет, если остановят и спросят?",
          a: [
            "Мы не станем описывать процедуру, которой не видели в письменном виде, и не публикуем размеры штрафов, которые не можем подтвердить, — в интернете хватает и того и другого, и они противоречат друг другу от страницы к странице.",
            "Скажем то, что в пределах нашего знания: связывает вас с законной покупкой то, что у вас на руках в оригинале, а спокойный и вежливый тон ни одну версию этого разговора ещё не ухудшил. Если дело серьёзное, спрашивать нужно юриста в Таиланде, а не магазин и не форум.",
          ],
        },
      },
    },
    {
      id: "other-provinces",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Маршрут «Паттайя плюс острова или Бангкок» типичен для всех аудиторий, а подтверждённого источника про перемещение внутри страны у нас нет ни для одной.",
      copy: {
        en: {
          q: "I am going on to another province. Can I take it with me?",
          a: [
            "We do not have an official text in front of us that sets out carriage between provinces, so we will not pretend to answer it. What we can say is that the document that made the purchase lawful is a document about you and stays with you wherever it goes.",
            "The version of this trip that never causes a problem is the boring one: buy for the days you are actually in Pattaya, and start the next leg without anything in the bag that needs explaining.",
          ],
        },
        ru: {
          q: "Я еду дальше в другую провинцию. Можно взять с собой?",
          a: [
            "Официального текста про перемещение между провинциями у нас перед глазами нет, поэтому изображать ответ мы не будем. Сказать можем то, что документ, сделавший покупку законной, — документ о вас и едет с вами всюду.",
            "Версия этой поездки, которая никогда не создаёт проблем, скучная: покупать на те дни, что вы действительно в Паттайе, и начинать следующий отрезок пути без содержимого, которое надо объяснять.",
          ],
        },
      },
    },
  ],
};

/**
 * ТЕМА 4 — вывоз, перелёт и транзит.
 *
 * Тема, где заканчивается тайское право и начинается чужое, поэтому доля
 * `unconfirmed` здесь самая высокая в кластере. Про закон страны читателя мы не
 * высказываемся вообще: это ровно тот вопрос, на который туристические сайты
 * отвечают уверенно и неправильно.
 *
 * Аббревиатуры каннабиноидов в этом файле запрещены линтером, поэтому
 * «не только соцветия» описывается словами — маслами, съедобным и продуктами
 * из растения. Это не эвфемизм, а требование к тексту вне правового гида.
 */
const TAKING_IT_HOME: QuestionPageData = {
  slug: "taking-it-home",
  intent: "visit",
  meta: {
    en: {
      title: "Taking cannabis out of Thailand: questions before the flight",
      description:
        "Why nothing bought in Pattaya goes in the luggage, what a Thai prescription is worth at another country's border, and why a layover is part of the journey.",
      h1: "Leaving Thailand: what visitors ask before the flight",
      kicker: "Departure and transit",
      lead:
        "This is where Thai rules stop and somebody else's begin, so it is also where this page says «we do not know» most often. Where an answer concerns the law of your own country, we do not give one at all — not out of caution about ourselves, but because a wrong sentence here is the most expensive sentence on the site.",
      caution:
        "Border practice is not published, does not announce changes and differs between airports and airlines. Treat everything below as a reason to leave nothing to chance rather than as a description of what will happen to you.",
    },
    ru: {
      title: "Вывоз каннабиса из Таиланда: вопросы перед вылетом",
      description:
        "Почему купленное в Паттайе не кладут в багаж, чего стоит тайский рецепт на чужой границе и почему пересадка — тоже часть маршрута.",
      h1: "Отъезд из Таиланда: что спрашивают перед вылетом",
      kicker: "Вылет и транзит",
      lead:
        "Здесь заканчиваются тайские правила и начинаются чужие, поэтому здесь же чаще всего написано «мы не знаем». Там, где вопрос про закон вашей собственной страны, ответа не будет вовсе — не из осторожности за себя, а потому что неверная фраза в этом месте самая дорогая на сайте.",
      caution:
        "Пограничная практика не публикуется, о переменах не объявляет и отличается от аэропорта к аэропорту и от перевозчика к перевозчику. Считайте написанное ниже поводом не оставлять ничего на волю случая, а не описанием того, что произойдёт именно с вами.",
    },
  },
  questions: [
    {
      id: "take-it-home",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Главный вопрос темы на любой локали: его задают в последний день поездки, когда переспросить уже негде.",
      copy: {
        en: {
          q: "Can I take what is left home with me?",
          a: [
            "No. Whatever has not been used stays in Thailand, and that holds at U-Tapao and at Suvarnabhumi in exactly the same way. There is no quantity small enough to be a souvenir and no packaging tidy enough to make it somebody else's problem.",
            "Departure is also the part of the trip where you are least in control: bags are screened, questions are asked in a language you may not follow, and a flight leaving in an hour is not a good moment to discover a disagreement about what you are carrying.",
          ],
        },
        ru: {
          q: "Можно ли забрать остаток с собой?",
          a: [
            "Нет. Всё неиспользованное остаётся в Таиланде, и в У-Тапао это работает ровно так же, как в Суварнабхуми. Нет такого маленького количества, которое считалось бы сувениром, и такой аккуратной упаковки, которая сделала бы это чужой заботой.",
            "Вылет — ещё и та часть поездки, где вы меньше всего контролируете происходящее: багаж просвечивают, вопросы задают на языке, которого можно не знать, а рейс через час — плохой момент, чтобы обнаружить разногласие о содержимом сумки.",
          ],
        },
      },
    },
    {
      id: "prescription-at-border",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Логика «у меня же рецепт» одинакова на всех языках и одинаково не работает на чужой границе.",
      copy: {
        en: {
          q: "But I have a Thai prescription. Does that not cover it?",
          a: [
            "A Thai prescription is a Thai document. It describes a lawful purchase inside Thailand and says nothing about taking anything out; there is no export permission attached to it, and no counter can give it one.",
            "On the other side, the law that will be applied to you is the law of the country you land in, which does not care where an item was bought or how correctly. In much of Asia and the Gulf that law is severe, and the document in your hand will read as an explanation rather than as a defence.",
          ],
        },
        ru: {
          q: "Но у меня же тайский рецепт. Разве он не покрывает?",
          a: [
            "Тайский рецепт — тайский документ. Он описывает законную покупку внутри Таиланда и ничего не говорит о вывозе; разрешения на вывоз к нему не приложено, и выдать его у прилавка невозможно.",
            "На той стороне к вам применят закон страны прилёта, которому безразлично, где и насколько правильно вещь куплена. В значительной части Азии и Залива этот закон суров, и бумага в руке прочитается как объяснение, а не как защита.",
          ],
        },
      },
    },
    {
      id: "other-forms-export",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Убеждение «масло и съедобное — другая категория» встречается во всех аудиториях и во всех одинаково неверно; ответ нужен везде.",
      copy: {
        en: {
          q: "Does this apply to oils and edible products too?",
          a: [
            "Travellers routinely assume that anything which is not flower belongs to a separate, softer category. Nothing we have read supports that, and the people who examine luggage are not obliged to share the assumption.",
            "Two habits close the gap for good: buy for the days you are actually here, and empty the bag deliberately before you pack rather than trusting your memory of what went in. Sachets and tins survive in side pockets remarkably well.",
          ],
        },
        ru: {
          q: "Относится ли это к маслам и съедобному?",
          a: [
            "Приезжие регулярно считают, что всё, кроме соцветий, — отдельная, более мягкая категория. Ничего, что бы это подтверждало, мы не читали, а люди, которые смотрят багаж, разделять это допущение не обязаны.",
            "Две привычки закрывают вопрос навсегда: покупать на те дни, что вы здесь, и осознанно вытряхивать сумку перед сборами, а не полагаться на память о том, что в неё клалось. Пакетики и жестянки выживают в боковых карманах на удивление хорошо.",
          ],
        },
      },
    },
    {
      id: "layover",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Пересадка — вопрос вылетающего из Таиланда, а не тайского читателя. Для арабской аудитории он самый острый в кластере: почти все маршруты из Паттайи домой идут через хабы Залива, где к этой теме относятся жёстко; у русской, китайской, корейской и японской аудитории те же хабы стоят в середине маршрута.",
      copy: {
        en: {
          q: "I only have a layover — does a transit airport count?",
          a: [
            "Treat every airport your bag touches as a country you have entered. A transfer desk is inside somebody's jurisdiction, and screening in transit is not a formality performed on the way to your real destination.",
            "The scenario nobody plans for is the one that catches people: a diversion, a missed connection, a night in a hotel on the wrong side of an immigration desk. The itinerary you booked is not a promise about which borders you will actually meet.",
          ],
        },
        ru: {
          q: "У меня только пересадка — транзитный аэропорт считается?",
          a: [
            "Считайте страной въезда каждый аэропорт, которого касается ваш багаж. Стойка пересадки находится внутри чьей-то юрисдикции, а досмотр в транзите — не формальность по дороге к настоящему пункту назначения.",
            "Ловит людей обычно тот сценарий, который не планировали: уход на запасной аэродром, сорванная стыковка, ночь в отеле по ту сторону паспортного контроля. Купленный маршрут не обещает, с какими границами вы встретитесь на самом деле.",
          ],
        },
      },
    },
    {
      id: "legal-at-home",
      basis: "practice",
      sources: [],
      locales: ["en"],
      localeNote:
        "Вопрос осмыслен только там, где дома это законно, — то есть у англоязычного читателя из США, Канады, Германии, Австралии. На остальных шести локалях он не встречается в выдаче и на страницу не выводится: там спрашивают противоположное, см. вопрос про закон своей страны.",
      copy: {
        en: {
          q: "It is legal where I live. Does that change anything?",
          a: [
            "Not on the way out. The rule that stops you is Thai, and it applies to everyone at the departure gate regardless of what is normal at home.",
            "It does not help much on the way in either. A lawful market at your destination is a market with its own licensed supply chain and its own paperwork; a bag that arrives from abroad is an import, and that is a different question from whether the substance is legal there.",
          ],
        },
      },
    },
    {
      id: "home-country-law",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Самый частый вопрос японской, корейской и китайской выдачи по этой теме: спрашивают не про Таиланд, а про ответственность дома за то, что сделано за границей. Арабская и русская аудитории задают его реже, но задают. Тайскому читателю он неприменим. Ответ везде один и тот же: чужое право мы не толкуем.",
      copy: {
        en: {
          q: "Can my own country act against me for what I did in Thailand?",
          a: [
            "That is a question about your country's law, not about Thai rules, and we are not qualified to answer it — not for one country and certainly not for the seven languages this site is written in. Anyone who answers it confidently on a shop's website is guessing with your risk.",
            "It is a real question and it deserves a real source: ask your own country's authority or a lawyer there, before the trip rather than after it. Some legal systems do reach conduct by their nationals abroad, and finding out which yours is belongs to a professional and not to a page selling nothing.",
          ],
        },
        ru: {
          q: "Может ли моя страна спросить с меня за то, что было в Таиланде?",
          a: [
            "Это вопрос про право вашей страны, а не про тайские правила, и отвечать на него мы не вправе — ни по одной стране, ни тем более на семи языках, на которых написан этот сайт. Тот, кто уверенно отвечает на него на сайте магазина, гадает вашим риском.",
            "Вопрос настоящий и заслуживает настоящего источника: спрашивайте уполномоченный орган своей страны или тамошнего юриста, и лучше до поездки, чем после. Некоторые правопорядки действительно достают до поступков своих граждан за границей, и выяснять, ваш ли это случай, должен специалист, а не страница, которая ничего не продаёт.",
          ],
        },
      },
    },
    {
      id: "domestic-flight",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Внутренний перелёт на острова — общий сценарий для всех аудиторий, включая тайскую, и подтверждённого текста у нас нет ни для одной.",
      copy: {
        en: {
          q: "What about a domestic flight inside Thailand?",
          a: [
            "We have not read an official text that settles carriage on a domestic flight, so we are not going to invent a rule for one. Airlines also publish their own conditions of carriage, and those are contractual rather than legal — a carrier can refuse something the law does not.",
            "Since the question comes up in the same week as the return flight, the simple answer usually wins: do not put it in a bag that is going anywhere near an aircraft.",
          ],
        },
        ru: {
          q: "А внутренний перелёт по Таиланду?",
          a: [
            "Официального текста, который решает вопрос о перевозке на внутреннем рейсе, мы не читали и правило под него выдумывать не станем. У авиакомпаний есть ещё и собственные условия перевозки: это договор, а не закон, и перевозчик вправе отказать в том, в чём закон не отказывает.",
            "Поскольку вопрос возникает на той же неделе, что и обратный рейс, обычно выигрывает простой ответ: не кладите это в сумку, которая едет куда-либо ближе самолёта.",
          ],
        },
      },
    },
    {
      id: "post-it-home",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Идея «отправлю почтой» приходит именно уезжающему; тайскому читателю она в этом кластере не нужна.",
      copy: {
        en: {
          q: "Could I post it home instead of carrying it?",
          a: [
            "A parcel does not change what is inside it, and it does not remove you from the transaction — your name and address are on it, which is rather the opposite of anonymity.",
            "We have no source describing a postal exception and we do not believe one exists in the form people hope for. This is the version of the question where the wrong answer arrives later, at your own front door, with somebody else's stamp on the envelope.",
          ],
        },
        ru: {
          q: "А отправить почтой вместо того, чтобы везти?",
          a: [
            "Посылка не меняет того, что внутри, и не выводит вас из этой истории: на ней ваши имя и адрес, что скорее противоположно анонимности.",
            "Источника, описывающего почтовое исключение, у нас нет, и мы не думаем, что оно существует в том виде, в каком его надеются найти. Это как раз тот случай, когда неверный ответ приходит позже — к вашей собственной двери и с чужим штемпелем на конверте.",
          ],
        },
      },
    },
    {
      id: "leftovers",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Практический финал темы, одинаково нужный всем: вопрос «а что тогда делать с остатком» без ответа превращается в попытку увезти.",
      copy: {
        en: {
          q: "So what do I do with what is left over?",
          a: [
            "Plan it away rather than deal with it at the end. Buying for the days you are actually here is the whole trick, and it is easier when you are not treating the last afternoon as a deadline to use something up.",
            "What you should not do is hand it to somebody else on the way out, which turns a tidy problem into the supply question covered elsewhere on this site. Dispose of it discreetly and leave with an empty bag.",
          ],
        },
        ru: {
          q: "Что тогда делать с остатком?",
          a: [
            "Планировать так, чтобы его не было, а не решать вопрос в последний день. Покупать на те дни, что вы здесь, — весь фокус целиком, и он даётся легче, когда последний день не превращается в дедлайн что-то израсходовать.",
            "Чего делать не стоит — отдавать это кому-то на выходе: аккуратная задача превращается в вопрос о предоставлении, разобранный в другом разделе сайта. Избавьтесь без лишних глаз и уезжайте с пустой сумкой.",
          ],
        },
      },
    },
  ],
};

/**
 * ТЕМА 5 — лицензированный магазин против уличного продавца.
 *
 * Единственная тема кластера, где ответ можно проверить самому и за десять
 * секунд, поэтому она написана как набор проверок, а не как рассуждение о
 * добросовестности. Правовой гид говорит об этом одним разделом; здесь разобраны
 * конкретные сцены у двери, и ни один ответ не пересказывает тот раздел.
 */
const CHECKING_A_SHOP: QuestionPageData = {
  slug: "checking-a-shop",
  intent: "visit",
  meta: {
    en: {
      title: "How to check a Pattaya cannabis shop before you buy",
      description:
        "The checks a visitor can make at the door of a Pattaya shop: the licence on the wall, what is asked for first, why there is no public price list, and what a runner in a bar is.",
      h1: "What a licensed counter looks like from the door",
      kicker: "Checking a shop",
      lead:
        "Pattaya has several hundred places trading in this and they do not all operate the same way. Everything below can be checked by you, in person, before any money moves — which is why this is the most useful page on the site for somebody who has just walked down an unfamiliar street.",
      caution:
        "None of these checks is a licence lookup and none of them proves a shop is compliant; they describe what is visible from the customer's side. When two of them fail at once, the sensible response is to leave rather than to weigh it up.",
    },
    ru: {
      title: "Как проверить магазин каннабиса в Паттайе до покупки",
      description:
        "Проверки, которые приезжий может сделать сам у двери: лицензия на стене, что спрашивают первым, почему нет публичного прайса и кто такой зазывала в баре.",
      h1: "Как выглядит лицензированный прилавок со стороны двери",
      kicker: "Проверка магазина",
      lead:
        "В Паттайе несколько сотен точек с этим товаром, и работают они по-разному. Всё, что ниже, вы можете проверить сами, лично и до того, как деньги сдвинулись с места, — поэтому для человека, только что свернувшего на незнакомую улицу, это самая полезная страница сайта.",
      caution:
        "Ни одна из этих проверок не заменяет сверку лицензии в реестре и ничего не доказывает о соблюдении правил: они описывают то, что видно со стороны покупателя. Если две из них не проходят разом, разумнее уйти, чем взвешивать.",
    },
  },
  questions: [
    {
      id: "licensed-look",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Первая проверка нужна каждому, кто заходит в незнакомую дверь, и от языка читателя не зависит.",
      copy: {
        en: {
          q: "What should a licensed shop look like from the outside?",
          a: [
            "A fixed address you can find on a map, a sign that matches the name in the listing you came from, a licence displayed where a customer can read it, and staff who ask about your age and your documents before they ask what you want.",
            "The order of those questions is the most reliable signal in the whole list. A counter that opens with the shelf and gets to the paperwork later — if at all — has told you which set of rules it lives by, and it is not the set that keeps a licence on a wall.",
          ],
        },
        ru: {
          q: "Как должен выглядеть лицензированный магазин снаружи?",
          a: [
            "Постоянный адрес, который находится на карте; вывеска, совпадающая с названием в карточке, откуда вы пришли; лицензия на видном месте, где её можно прочитать; и персонал, который спрашивает про возраст и документы раньше, чем про то, что вам нужно.",
            "Порядок этих вопросов — самый надёжный признак из всего списка. Прилавок, начинающий с полки и добирающийся до бумаг потом, если вообще добирается, уже сообщил вам, по каким правилам он живёт, — и это не те правила, при которых на стене висит лицензия.",
          ],
        },
      },
    },
    {
      id: "ask-to-see-licence",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Неловкость от просьбы показать лицензию одинакова во всех культурах, и снимается она одинаково — тем, что это обычная просьба.",
      copy: {
        en: {
          q: "Is it rude to ask to see the licence?",
          a: [
            "It is an ordinary request and it takes about ten seconds in a shop that has one. Nobody working legally is surprised by it, and the reaction you get is itself the answer to the question you were really asking.",
            "You are not being asked to audit anything. Look for a document on display, look at whether the business named on it is the business you are standing in, and move on. If producing it turns into a story, that is your answer.",
          ],
        },
        ru: {
          q: "Неприлично ли просить показать лицензию?",
          a: [
            "Это обычная просьба, и в магазине, у которого лицензия есть, она занимает секунд десять. Никого, кто работает законно, она не удивляет, а реакция на неё и есть ответ на вопрос, который вы на самом деле задавали.",
            "Проводить проверку вас никто не просит. Посмотрите, висит ли документ, совпадает ли названный в нём бизнес с тем, в котором вы стоите, и идите дальше. Если предъявление превращается в историю — вот и ответ.",
          ],
        },
      },
    },
    {
      id: "why-no-price-list",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Отсутствие прайса читается как скрытность на любом языке, поэтому объяснение нужно везде; сама норма от локали не зависит.",
      copy: {
        en: {
          q: "Every other shop publishes a menu. Why does this site not?",
          a: [
            "Because the government notice prohibits advertising a controlled herb through all channels and prohibits sale through electronic channels or computer networks. A public list of goods with figures beside them is the thing being named, not a convenience somebody forgot to add.",
            "Turn that around and it becomes a test you can apply to any site you land on. A page that publishes numbers, a basket or a delivery promise is not being more helpful than the one that does not — it is telling you which rules it has decided not to follow.",
          ],
        },
        ru: {
          q: "У всех есть меню с ценами. Почему на этом сайте его нет?",
          a: [
            "Потому что уведомление правительства запрещает рекламу контролируемой травы во всех каналах и продажу через электронные каналы и компьютерные сети. Публичный список товаров с цифрами рядом — это ровно то, что там названо, а не удобство, которое кто-то забыл сделать.",
            "Разверните это — и получится проверка для любого сайта, на который вы попали. Страница с цифрами, корзиной или обещанием привезти не полезнее той, где этого нет: она сообщает вам, какие правила решила не соблюдать.",
          ],
        },
      },
    },
    {
      id: "hotel-runner",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Предложение принести в номер поступает всем без разбора языка — в баре, у стойки, в мессенджере; ответ везде одинаков.",
      copy: {
        en: {
          q: "Someone in a bar offered to bring some to my room. Is that a shop?",
          a: [
            "No. There is no premises, no licence you can look at, nothing that shows how the goods were kept, and nobody to go back to if what you were handed is not what you were promised. You are not a customer in that arrangement — you are the other party to an unlicensed transaction.",
            "The saving is small and the exposure is not. It is also the version of this where a room number, a name and a hotel are now known to somebody whose business model depends on not being traceable.",
          ],
        },
        ru: {
          q: "В баре предложили принести в номер. Это магазин?",
          a: [
            "Нет. Нет помещения, нет лицензии, на которую можно посмотреть, нет ничего, что показывало бы условия хранения, и не к кому вернуться, если выданное не совпало с обещанным. Покупателем в этой схеме вы не являетесь — вы вторая сторона нелицензированной сделки.",
            "Экономия маленькая, а подставленность большая. Это ещё и та версия истории, где номер комнаты, имя и отель теперь известны человеку, чья модель заработка держится на неотслеживаемости.",
          ],
        },
      },
    },
    {
      id: "paperwork-waved-away",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Сцена «да не переживайте, у нас проще» универсальна; отличается только язык, на котором это говорят.",
      copy: {
        en: {
          q: "A shop waved the paperwork question away. What does that tell me?",
          a: [
            "That the shop has decided which parts of the rules it applies. It is worth being honest about what that means for you rather than only for them: whatever happens next, you were the one holding the goods.",
            "Read it the other way round as well, because visitors get this backwards constantly. The counter that slows you down with questions is the one protecting you; the one that makes it easy is the one that has moved the risk onto you and made it feel like service.",
          ],
        },
        ru: {
          q: "В магазине отмахнулись от вопроса про документы. О чём это?",
          a: [
            "О том, что магазин сам решил, какие части правил он применяет. Стоит честно посмотреть, что это значит для вас, а не только для него: что бы дальше ни случилось, товар в руках держали вы.",
            "И прочитайте это в обратную сторону, потому что здесь ошибаются постоянно. Прилавок, который тормозит вас вопросами, вас же и прикрывает; тот, который всё упростил, переложил риск на вас и выдал это за сервис.",
          ],
        },
      },
    },
    {
      id: "sign-and-board",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Зелёная вывеска и доска с ассортиментом — визуальный код, одинаково читаемый всеми аудиториями и одинаково ничего не доказывающий.",
      copy: {
        en: {
          q: "The place has a big green sign and a board of names. Is that a good sign?",
          a: [
            "It is a sign that somebody paid a printer. Frontage tells you about the budget, not about the paperwork, and a street of confident-looking shops can contain both kinds.",
            "Compare the frontage with the door instead. What is asked for first, whether a licence is visible, whether the name outside matches the listing that sent you there — three things that cost nothing to check and that a printed board cannot fake.",
          ],
        },
        ru: {
          q: "У точки большая зелёная вывеска и доска с названиями. Хороший признак?",
          a: [
            "Признак того, что кто-то заплатил за печать. Фасад говорит о бюджете, а не о бумагах, и на одной улице уверенно выглядящих магазинов встречаются и те и другие.",
            "Сравнивайте не фасад, а дверь. Что спрашивают первым, видна ли лицензия, совпадает ли имя снаружи с карточкой, которая вас сюда привела, — три проверки, которые ничего не стоят и которых печатная доска подделать не может.",
          ],
        },
      },
    },
    {
      id: "licence-is-not-a-clinic",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Смешение «лицензия на продажу» и «право выписать документ» происходит на всех языках, потому что оба слова в тексте вывески стоят рядом.",
      copy: {
        en: {
          q: "If the shop is licensed, can it also write my document?",
          a: [
            "A licence to sell is not a licence to prescribe, and the two are not stops on the same journey. A shop reads what a practitioner wrote; it does not stand in for the practitioner because it has a certificate on the wall.",
            "So when a licensed-looking place offers to handle both halves in one visit, the licence you saw is not the thing that makes that offer plausible. Those are separate questions, and the second one is answered by a clinic.",
          ],
        },
        ru: {
          q: "Если магазин лицензирован, может ли он и документ выписать?",
          a: [
            "Лицензия на продажу — не лицензия на назначение, и это не две остановки одного маршрута. Магазин читает то, что написал специалист, и не заменяет его собой на основании бумаги на стене.",
            "Поэтому, если лицензированное на вид место предлагает закрыть обе половины за один визит, увиденная вами лицензия правдоподобия этому предложению не добавляет. Это разные вопросы, и второй решается в клинике.",
          ],
        },
      },
    },
    {
      id: "same-name-different-shop",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Путаница однофамильцев в картах затрагивает любого, кто пришёл по карточке из поиска, независимо от языка интерфейса карт.",
      copy: {
        en: {
          q: "Several shops here have similar names. How do I know I found the right one?",
          a: [
            "Match three things and the question closes: the sign says LABS DISPENSARY, the address is 32 Pattaya 13 Alley in South Pattaya, and the phone number matches the one published on this site. Labs Cannabis is the name this website carries; both names belong to the same shop.",
            "There are no branches, so a second address under a similar name is a different business rather than another door of ours. Map listings around this city merge shops with overlapping names regularly, and the address is the part that never lies.",
          ],
        },
        ru: {
          q: "Тут несколько магазинов с похожими названиями. Как понять, что нашёл нужный?",
          a: [
            "Сойдутся три вещи — вопрос закрыт: на вывеске LABS DISPENSARY, адрес 32 Pattaya 13 Alley в Южной Паттайе, телефон совпадает с опубликованным на этом сайте. Labs Cannabis — имя, под которым идёт сайт; оба имени принадлежат одному магазину.",
            "Филиалов нет, поэтому второй адрес под похожим названием — другой бизнес, а не наша вторая дверь. Карточки на картах в этом городе регулярно склеивают заведения с пересекающимися именами, и адрес — та часть, которая не врёт.",
          ],
        },
      },
    },
    {
      id: "from-another-traveller",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Предложение перекупить остаток у уезжающего возникает в любом хостеле и на любом языке; ответ не локален.",
      copy: {
        en: {
          q: "Another traveller offered me theirs before flying out. Why not?",
          a: [
            "Because the document that made their purchase lawful names them, not you, and it does not transfer with the goods. What you would be holding is something you cannot account for, bought by somebody who has now left the country.",
            "It is presented as a favour and it works out as the worst version of a street purchase: no premises, no record, and a seller who is unreachable by the time it matters.",
          ],
        },
        ru: {
          q: "Уезжающий турист предложил забрать остаток. Почему нет?",
          a: [
            "Потому что документ, сделавший его покупку законной, выписан на него, а не на вас, и вместе с товаром не передаётся. У вас на руках окажется то, чего вы не можете объяснить, купленное человеком, который уже улетел.",
            "Подаётся это как услуга, а выходит худшая версия уличной покупки: ни помещения, ни записи, ни продавца, до которого можно дозвониться, когда это станет важно.",
          ],
        },
      },
    },
  ],
};

/**
 * ТЕМА 6 — частые заблуждения.
 *
 * Отдельная страница, потому что это отдельный интент: сюда приходят не с
 * вопросом, а с готовым неверным ответом, услышанным от знакомого или взятым из
 * статьи 2022 года. Формат «убеждение → что говорит источник» цитируется
 * ИИ-поисками лучше любого другого, и именно поэтому каждое опровержение здесь
 * помечено основанием, а не подано как общее знание.
 */
const COMMON_MYTHS: QuestionPageData = {
  slug: "common-myths",
  intent: "prescription",
  meta: {
    en: {
      title: "Cannabis in Thailand: what visitors still get wrong",
      description:
        "Nine beliefs visitors bring to a Pattaya counter — everything is legal, a passport is enough, thirty grams a month — set against what the official notices actually say.",
      h1: "Beliefs about Thai cannabis that are out of date",
      kicker: "Misconceptions",
      lead:
        "People do not usually arrive with a question. They arrive with an answer somebody gave them in a bar, or with an article that was accurate when it was written and has not been touched since. Each item below is the belief first and then what the source says, with the difference between the two marked rather than blurred.",
      caution:
        "Being out of date is not a moral failing — most of these were true at some point between 2022 and the middle of 2025. That is exactly why the date on a page matters more than its confidence, including on this one.",
    },
    ru: {
      title: "Каннабис в Таиланде: в чём приезжие всё ещё ошибаются",
      description:
        "Девять убеждений, с которыми приходят к прилавку в Паттайе: «всё легально», «хватит паспорта», «тридцать граммов в месяц» — против того, что написано в уведомлениях.",
      h1: "Убеждения о тайском каннабисе, которые устарели",
      kicker: "Заблуждения",
      lead:
        "Обычно приходят не с вопросом. Приходят с ответом, который дали в баре, или со статьёй, верной на момент написания и с тех пор не тронутой. Ниже сначала само убеждение, потом то, что говорит источник, и разница между ними помечена, а не размыта.",
      caution:
        "Устареть — не порок: почти всё перечисленное было правдой где-то между 2022 годом и серединой 2025-го. Именно поэтому дата на странице важнее её уверенности — и на этой странице тоже.",
    },
  },
  questions: [
    {
      id: "everything-is-legal",
      basis: "official",
      sources: ["thaiGovernment", "touristNotice"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Заблуждение номер один во всех семи выдачах: 2022 год разошёлся по путеводителям на всех языках и до сих пор стоит в кэше.",
      copy: {
        en: {
          q: "«Cannabis is just legal in Thailand» — is that still true?",
          a: [
            "It describes a window that has closed. Cannabis flower is a controlled herb, and the government notice says retail sale to the general public requires a prescription; the tourist notice says a visitor needs one issued in Thailand.",
            "The belief survives because the visible evidence supports it — the shops are still there, the signs are still green. What changed is what happens on the customer's side of the counter, and that is not visible from the street.",
          ],
        },
        ru: {
          q: "«В Таиланде каннабис просто легален» — это ещё так?",
          a: [
            "Это описание закрывшегося окна. Соцветия каннабиса — контролируемая трава, уведомление правительства говорит, что розничная продажа населению требует рецепта, а уведомление для туристов — что приезжему нужен документ, выданный в Таиланде.",
            "Убеждение живёт потому, что видимое его подтверждает: магазины на месте, вывески по-прежнему зелёные. Изменилось то, что происходит по сторону покупателя у прилавка, а этого с улицы не видно.",
          ],
        },
      },
    },
    {
      id: "passport-is-enough",
      basis: "official",
      sources: ["touristNotice"],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Убеждение приезжего: «покажу паспорт, и хватит». У тайского читателя эта форма заблуждения не встречается — там спрашивают про форму документа, а не про паспорт.",
      copy: {
        en: {
          q: "«Being over twenty and having a passport is enough»",
          a: [
            "Those two are necessary and they are not the whole list. Age and identity settle who you are; the prescription is a separate document and the tourist notice is explicit that a visitor needs one issued inside Thailand.",
            "This is the belief that produces the longest faces at a counter, because the person holding it has usually done everything else right and travelled across the city to get there.",
          ],
        },
        ru: {
          q: "«Мне больше двадцати и есть паспорт — этого хватит»",
          a: [
            "Это необходимое, но не весь список. Возраст и личность отвечают на вопрос, кто вы; рецепт — отдельный документ, и уведомление для туристов прямо говорит, что приезжему нужен выданный в Таиланде.",
            "Именно от этого убеждения у прилавка самые вытянутые лица: человек обычно сделал всё остальное правильно и приехал через весь город.",
          ],
        },
      },
    },
    {
      id: "need-a-medical-file",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Зеркальное заблуждение к предыдущему: «нужна медкарта, справки, диагноз». Встречается на всех локалях, включая тайскую, и отпугивает людей сильнее, чем требование документа.",
      copy: {
        en: {
          q: "«You need a medical file and a diagnosis before anyone will see you»",
          a: [
            "What a counter reads is a prescription written by a practitioner registered in Thailand. It does not read a medical file you brought with you, a translated history, or a card applied for in advance.",
            "What any individual practitioner asks about is between you and them, and we cannot speak for it — that is the consultation, not the counter. Arriving with whatever information about yourself you would give any doctor is sensible; arriving convinced that a dossier is required is a reason people never ask at all.",
          ],
        },
        ru: {
          q: "«Нужна медкарта и диагноз, иначе даже разговаривать не станут»",
          a: [
            "У прилавка читают рецепт, выписанный специалистом, зарегистрированным в Таиланде. Ни медицинской карты, привезённой с собой, ни переведённой истории болезни, ни оформленной заранее карточки там не спрашивают.",
            "О чём спросит конкретный специалист — дело между вами и им, и говорить за него мы не можем: это приём, а не прилавок. Приехать с той информацией о себе, которую вы дали бы любому врачу, разумно; приехать в уверенности, что нужно досье, — причина, по которой люди вообще не спрашивают.",
          ],
        },
      },
    },
    {
      id: "sold-to-anyone",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "«Спрашивают не везде, значит, можно везде» — вывод из наблюдения, а не из текста; делают его одинаково во всех аудиториях.",
      copy: {
        en: {
          q: "«Plenty of places sell to anyone, so the rule cannot be real»",
          a: [
            "What you are observing is that not every shop applies it, which is a statement about those shops rather than about the rule. Enforcement being uneven has never meant that the person holding the goods is the one it is uneven in favour of.",
            "It is worth noticing who carries the consequence in each version. A shop that skips the check risks a licence it may not value much; you are risking the rest of your trip.",
          ],
        },
        ru: {
          q: "«Полно мест, где продают кому угодно, — значит, правило ненастоящее»",
          a: [
            "Наблюдаете вы то, что не каждый магазин его применяет, а это утверждение про эти магазины, а не про правило. Неровность применения ещё ни разу не означала, что она неровная в пользу того, у кого товар в руках.",
            "Стоит посмотреть, кто в каждой версии несёт последствия. Магазин, пропустивший проверку, рискует лицензией, которой, возможно, не слишком дорожит; вы рискуете остатком поездки.",
          ],
        },
      },
    },
    {
      id: "thirty-grams",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Цифра «тридцать граммов в месяц» кочует по китайским, японским и корейским статьям и оттуда попала в русские и английские; опровержение опирается на то, что в цитируемом уведомлении речь идёт о днях, а не о весе, и нужно на всех локалях.",
      copy: {
        en: {
          q: "«A prescription covers thirty grams a month»",
          a: [
            "The notice we cite measures a prescription in days: a supply of no more than thirty days. That is a different kind of statement from a weight, and the two get merged in retellings until the number arrives with a unit attached to it that we cannot find in the source.",
            "So we will not repeat a weight figure. Read what your own document says, ask the practitioner who wrote it, and treat any page that quotes a number in grams without pointing at a text as a page repeating another page.",
          ],
        },
        ru: {
          q: "«По рецепту положено тридцать граммов в месяц»",
          a: [
            "Уведомление, на которое мы ссылаемся, меряет рецепт днями: запас не более чем на тридцать дней. Это утверждение другого рода, чем вес, и в пересказах их сливают до тех пор, пока к цифре не прилипает единица измерения, которой в источнике мы не находим.",
            "Поэтому цифру в граммах мы повторять не станем. Читайте, что написано в вашем документе, спрашивайте выписавшего его специалиста, а страницу, которая называет вес без ссылки на текст, считайте пересказом другой такой же страницы.",
          ],
        },
      },
    },
    {
      id: "smoke-anywhere",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Заблуждение подкрепляется тем, что видно на улице, и потому одинаково устойчиво на всех локалях.",
      copy: {
        en: {
          q: "«Everyone smokes on the street here anyway»",
          a: [
            "Some people do, and the ones who have a problem as a result are not standing there afterwards to be counted. What you are seeing is the surviving half of the sample.",
            "The advice does not change with the crowd: not in public, not on the beach, not in a lobby or a corridor, and not in a vehicle. It costs nothing to follow and it removes the single most common way this goes wrong.",
          ],
        },
        ru: {
          q: "«Тут всё равно все курят на улице»",
          a: [
            "Кто-то курит, а те, у кого из-за этого возникли проблемы, потом на улице не стоят и в выборку не попадают. Вы видите уцелевшую половину.",
            "От поведения толпы совет не меняется: не на людях, не на пляже, не в лобби и не в коридоре, и не в транспорте. Соблюдение не стоит ничего и убирает самый частый способ всё испортить.",
          ],
        },
      },
    },
    {
      id: "souvenir-amount",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Сувенирная логика — вопрос уезжающего; тайскому читателю она в этом кластере не адресована.",
      copy: {
        en: {
          q: "«A small amount for personal use is fine to take home»",
          a: [
            "There is no threshold in this that turns an item into a souvenir. Quantity may matter to somebody deciding how seriously to treat a case; it does not decide whether the item was permitted to cross a border in the first place.",
            "The belief is doing something else as well, which is worth naming: it turns a decision you already made — to buy for the trip — into a decision you are making at an airport with a boarding pass in your hand.",
          ],
        },
        ru: {
          q: "«Немного для себя увезти можно»",
          a: [
            "Порога, за которым предмет превращается в сувенир, здесь нет. Количество может влиять на то, насколько серьёзно к делу отнесутся; на то, разрешено ли предмету пересекать границу, оно не влияет.",
            "Это убеждение делает ещё кое-что, и это стоит назвать: оно превращает уже принятое решение — покупать на поездку — в решение, которое вы принимаете в аэропорту с посадочным в руке.",
          ],
        },
      },
    },
    {
      id: "hidden-online",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Уверенность, что онлайн-канал существует и просто спрятан, растёт из привычки заказывать всё с телефона и одинакова во всех аудиториях.",
      copy: {
        en: {
          q: "«Online ordering exists, shops just keep it quiet»",
          a: [
            "The notice names the channel directly: sale through vending machines, through electronic channels or computer networks is prohibited, as is advertising through all channels. A shop keeping such a route quiet would not be discreet; it would be operating outside the notice.",
            "Which is why the honest version of a cannabis website in Thailand looks strangely empty — an address, directions, what to bring, what the notices say. Everything a visitor would expect to find instead of that is the part that is not allowed.",
          ],
        },
        ru: {
          q: "«Онлайн-заказ есть, просто про него не пишут»",
          a: [
            "Уведомление называет канал прямо: продажа через автоматы, электронные каналы и компьютерные сети запрещена, как и реклама во всех каналах. Магазин, который «просто про это не пишет», был бы не скромным, а работающим вне уведомления.",
            "Поэтому честная версия сайта каннабис-магазина в Таиланде выглядит странно пустой: адрес, дорога, что взять с собой, что говорят уведомления. Всё, что приезжий рассчитывает увидеть вместо этого, и есть та часть, которую нельзя.",
          ],
        },
      },
    },
    {
      id: "shop-is-a-clinic",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Слово dispensary во многих языках звучит медицински, и ожидание врача за прилавком возникает на всех локалях, включая тайскую.",
      copy: {
        en: {
          q: "«A dispensary is basically a clinic, so they can sort everything there»",
          a: [
            "The word carries a medical echo in several languages and the echo is misleading. A retail counter sells; a practitioner assesses and writes. Those are separate roles and separate premises, and the 2026 regulation tightened who may hold the selling licence rather than merging the two.",
            "It matters practically because it changes the order of your day. Sort the document first and the shop becomes the short part of the trip; do it the other way round and the shop becomes a wasted journey.",
          ],
        },
        ru: {
          q: "«Диспенсери — это по сути клиника, там всё и решат»",
          a: [
            "В нескольких языках это слово отдаёт медициной, и отзвук вводит в заблуждение. Розничный прилавок продаёт; специалист оценивает и выписывает. Это разные роли и разные помещения, а постановление 2026 года ужесточило требования к держателю торговой лицензии, а не соединило их.",
            "Практически это меняет порядок дня. Сначала документ — и магазин становится короткой частью поездки; наоборот — и поездка в магазин оказывается напрасной.",
          ],
        },
      },
    },
  ],
};

/**
 * Все темы кластера. Порядок здесь — порядок в хабе и в перелинковке; на
 * вердикт ворот он не влияет, кандидатов сортируют по `<locale>/<suffix>`.
 */
/**
 * Вливание текста на пяти остальных языках.
 *
 * ПОЧЕМУ СЛИЯНИЕ ЗДЕСЬ, А НЕ В `getQuestionPage()`. Разрешать оверлей в момент
 * сборки страницы было бы на две строки короче — и вывело бы новый текст
 * из-под всех инвариантов разом. `assertBasisLabelHonesty()` в
 * `src/content-factory/clusters/questions.mjs` обходит именно
 * `QUESTION_PAGES[].questions[].copy`: ответ с ярлыком «практика», разбирающий
 * содержание уведомления, роняет импорт. Оверлей, подмешанный позже, эта
 * проверка не увидела бы — то есть ровно на новом, непроверенном человеком
 * тексте единственный машинный контроль честности молча перестал бы работать.
 *
 * Поэтому слияние ровно одно и на входе: дальше по коду данных из двух
 * источников не существует.
 */
function mergeOpenLocaleQuestions(pages: readonly QuestionPageData[]): readonly QuestionPageData[] {
  return pages.map((page) => {
    const overlay = OPEN_LOCALE_QUESTIONS[page.slug];
    if (!overlay) return page;
    return {
      ...page,
      meta: { ...page.meta, ...overlay.meta },
      questions: page.questions.map((question) => {
        const extra = overlay.copy[question.id];
        if (!extra) return question;
        /*
         * Локаль, объявленная в оверлее, но не объявленная у самого вопроса, —
         * это не «дописали язык», а расхождение: страница локали собирается
         * ИЗ ВОПРОСОВ, ОТНОСЯЩИХСЯ К НЕЙ, и обойти это решение текстом нельзя.
         */
        for (const locale of Object.keys(extra) as Locale[]) {
          if (question.locales.includes(locale)) continue;
          throw new Error(
            `Questions: оверлей даёт текст ${page.slug}/${question.id}/${locale}, ` +
              "но у вопроса эта локаль не объявлена в `locales`. Либо локаль относится к вопросу — " +
              "и тогда её добавляют в `locales` с объяснением в `localeNote`, — либо текст здесь лишний.",
          );
        }
        return { ...question, copy: { ...question.copy, ...extra } };
      }),
    };
  });
}

export const QUESTION_PAGES: readonly QuestionPageData[] = mergeOpenLocaleQuestions([
  RULES_AND_PRESCRIPTION,
  BUYING_IN_PERSON,
  WHERE_YOU_CAN_USE,
  TAKING_IT_HOME,
  CHECKING_A_SHOP,
  COMMON_MYTHS,
  // Темы, дописанные позже, живут отдельным модулем: этот файл уже почти две
  // тысячи строк, и дописывать в него ещё сотни значит сделать его местом,
  // куда никто не заглядывает. Контракт у них тот же.
  ...EXTRA_QUESTION_PAGES,
]);

/** Префикс маршрута кластера. Меняется здесь и нигде больше. */
export const QUESTION_ROUTE_PREFIX = "questions";

/** `pathSuffix` темы в терминах `INDEX_POLICY_RULES`. */
export function questionSuffix(slug: string): string {
  return `${QUESTION_ROUTE_PREFIX}/${slug}`;
}

/**
 * Нижняя граница числа вопросов на собранной странице.
 *
 * Шесть — не эстетика: страница на один-два вопроса не наберёт 400 слов
 * собственного текста, ворота её всё равно оставят noindex, а живой URL с
 * тремя абзацами пополнит те самые 149 отказов. Локаль, для которой набралось
 * меньше шести вопросов, страницы не получает вовсе.
 */
export const QUESTION_MIN_ITEMS = 6;

/** Вопрос, уже разрешённый под локаль: без карт локалей и без `Partial`. */
export interface ResolvedQuestionItem {
  id: string;
  basis: AnswerBasis;
  sources: readonly QuestionSourceKey[];
  q: string;
  a: string[];
}

export interface ResolvedQuestionPage {
  slug: string;
  suffix: string;
  intent: PrefillIntent;
  meta: QuestionPageMeta;
  basisLabels: Record<AnswerBasis, string>;
  sourcesTitle: string;
  cautionTitle: string;
  items: ResolvedQuestionItem[];
  /** Ключи источников, реально использованные ответами этой страницы. */
  sourceKeys: QuestionSourceKey[];
}

/**
 * Страница темы под конкретную локаль или `null`, если её не должно быть.
 *
 * Два условия, и оба обязательны: у темы есть мета на этой локали (то есть
 * заголовки и лид кто-то написал), и набралось не меньше `QUESTION_MIN_ITEMS`
 * вопросов, которые (а) объявлены относящимися к этой локали и (б) имеют на
 * ней текст. Машинного перевода здесь не будет: локаль без написанного текста
 * просто не получает страницу — см. §9 `docs/growth/CONTENT-FACTORY.md`.
 */
export function getQuestionPage(slug: string, locale: Locale): ResolvedQuestionPage | null {
  const page = QUESTION_PAGES.find((candidate) => candidate.slug === slug);
  if (!page) return null;
  const meta = page.meta[locale];
  if (!meta) return null;

  const items: ResolvedQuestionItem[] = [];
  for (const question of page.questions) {
    if (!question.locales.includes(locale)) continue;
    const copy = question.copy[locale];
    if (!copy) continue;
    items.push({
      id: question.id,
      basis: question.basis,
      sources: question.sources,
      q: copy.q,
      a: copy.a,
    });
  }
  if (items.length < QUESTION_MIN_ITEMS) return null;

  const sourceKeys: QuestionSourceKey[] = [];
  for (const item of items) {
    for (const key of item.sources) {
      if (!sourceKeys.includes(key)) sourceKeys.push(key);
    }
  }

  const ui = QUESTION_UI[locale];
  return {
    slug: page.slug,
    suffix: questionSuffix(page.slug),
    intent: page.intent,
    meta,
    basisLabels: ui.basisLabels,
    sourcesTitle: ui.sourcesTitle,
    cautionTitle: ui.cautionTitle,
    items,
    sourceKeys,
  };
}

/**
 * Локали, на которых тема СОБИРАЕТСЯ. Из этого списка берёт пути
 * `getStaticPaths()`, а не из политики индексации: страница, не прошедшая
 * ворота, обязана остаться живой под `noindex`, а не превратиться в 404.
 */
export function getQuestionLocales(slug: string, locales: readonly Locale[]): Locale[] {
  return locales.filter((locale) => getQuestionPage(slug, locale) !== null);
}
