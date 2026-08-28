import type { QuestionPageData } from "@/data/question-pages";

/**
 * ДВЕ НОВЫЕ ТЕМЫ КЛАСТЕРА `questions/*`.
 *
 * Контракт полностью тот же, что у шести тем в `question-pages.ts`: тема — это
 * 6–12 вопросов, у каждого ответа ВИДИМОЕ основание (`official` / `practice` /
 * `unconfirmed`), и смешивать основания запрещено. Вынесены отдельным модулем
 * только по объёму: исходный файл уже почти две тысячи строк, и дописывать в
 * него сотни строк значит превратить его в место, куда никто не заглядывает.
 *
 * ПОЧЕМУ ИМЕННО ЭТИ ДВЕ. Шесть существующих тем закрывают дорогу от «нужен ли
 * рецепт» до «что делать с остатком в день вылета». Между ними осталось два
 * пробела, в которые люди приходят из поиска и получают в ответ либо рекламу,
 * либо пересказ 2022 года:
 *
 * 1. `keeping-flower-in-the-tropics` — что происходит с соцветиями в жару и
 *    влажность и как с этим обращаться. Здесь НЕТ нормы: это целиком опыт
 *    прилавка, и каждый ответ помечен как практическая осторожность. Тема, где
 *    честнее всего не притворяться, что у нас есть источник.
 *
 * 2. `arriving-with-cannabis` — сторона ПРИЛЁТА, зеркальная к
 *    `taking-it-home`. Половина ответов честно помечена «не подтверждено»:
 *    таможенная практика не публикуется, и показать по ней ссылку мы не можем.
 *    Страница, на которой половина ответов — признание в незнании, полезнее
 *    страницы, которая это незнание маскирует.
 *
 * ЗАПРЕЩЕНО здесь то же, что и в основном файле: цены и суммы, часы работы,
 * «без рецепта», медицинские обещания, рекламный регистр, расстояния цифрами.
 */

const KEEPING_FLOWER: QuestionPageData = {
  slug: "keeping-flower-in-the-tropics",
  intent: "menu",
  meta: {
    en: {
      title: "Keeping cannabis flower in Pattaya heat: what actually happens",
      description:
        "What tropical heat and humidity do to flower, how long it stays worth having, what to keep it in, and why buying for the whole trip at once rarely works out.",
      h1: "Keeping flower in this climate: nine practical answers",
      kicker: "After you buy",
      lead:
        "Nothing on this page rests on a rule or a notice, because there is no rule about how you store something you already own. Every answer below is marked as practical caution: this is what we see coming back over the counter, described as experience rather than as law. It is also the part of the subject that visitors from cooler places consistently underestimate.",
      caution:
        "This is observation, not chemistry and not advice about health. If something you are holding smells wrong, looks wrong or has visible growth on it, the answer is to stop, not to look for a second opinion on a web page.",
    },
    ru: {
      title: "Как хранить соцветия в жару Паттайи: что происходит на самом деле",
      description:
        "Что тропическая жара и влажность делают с соцветиями, сколько они остаются собой, в чём их держать и почему покупка сразу на всю поездку обычно не оправдывается.",
      h1: "Хранение в этом климате: девять практических ответов",
      kicker: "После покупки",
      lead:
        "Ничто на этой странице не опирается на норму или уведомление, потому что нормы о том, как хранить уже своё, не существует. Каждый ответ ниже помечен как практическая осторожность: это то, что мы видим возвращающимся к прилавку, описанное как опыт, а не как право. И это же та часть темы, которую приезжие из мест попрохладнее недооценивают стабильно.",
      caution:
        "Это наблюдение, а не химия и не совет о здоровье. Если то, что у вас в руках, пахнет не так, выглядит не так или на нём видно налёт, правильный ответ — прекратить, а не искать второе мнение на веб-странице.",
    },
  },
  questions: [
    {
      id: "how-long-good",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Первый вопрос темы на любой локали: он не зависит ни от гражданства, ни от домашнего законодательства, а зависит только от того, что человек находится в тропиках.",
      copy: {
        en: {
          q: "How long does flower stay worth having in this climate?",
          a: [
            "Shorter than you expect, and the aroma goes first. In an air-conditioned room a well-cured jar holds its character for a couple of weeks; in a bag carried around in the afternoon heat, the top notes start flattening within days. Nothing dangerous has happened at that point — it has simply stopped being the thing you chose.",
            "That is why we suggest buying for the days you are actually here rather than for the trip. It is not a sales position; it works the other way round, and we say it anyway because a flat jar on day nine is what people remember about the whole visit.",
          ],
        },
        ru: {
          q: "Сколько соцветия остаются собой в этом климате?",
          a: [
            "Меньше, чем ожидается, и первым уходит аромат. В комнате с кондиционером хорошо вылежанная банка держит характер пару недель; в пакете, который носят днём по жаре, верхние ноты начинают уплощаться за считаные дни. Ничего опасного при этом не произошло — просто перестало быть тем, что вы выбирали.",
            "Поэтому мы и советуем брать на те дни, что вы здесь, а не на всю поездку. Это не торговая позиция: она работает в обратную сторону, и мы всё равно это говорим, потому что плоская банка на девятый день — то, что запомнится о поездке целиком.",
          ],
        },
      },
    },
    {
      id: "what-heat-does",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Механизм одинаков для всех, и объяснять его нужно на каждой локали: без него все остальные ответы выглядят суеверием.",
      copy: {
        en: {
          q: "What are heat and humidity actually doing to it?",
          a: [
            "Two separate things. Heat drives off the volatile compounds that make an aroma legible — that is why a jar left in a car or on a balcony reads as generically herbal afterwards, whatever it smelled like at the counter. This part is not reversible, and no amount of careful storage later brings it back.",
            "Humidity works the other way: it puts moisture in. Damp material is where visible growth becomes a possibility, and that is a genuine reason to discard rather than a matter of taste. The two problems pull in opposite directions, which is why the answer is a stable room rather than any single trick.",
          ],
        },
        ru: {
          q: "Что именно делают с ним жара и влажность?",
          a: [
            "Две разные вещи. Жара выгоняет летучие соединения, из-за которых аромат вообще читается, — поэтому банка, оставленная в машине или на балконе, потом пахнет обобщённо травяно, чем бы она ни пахла у прилавка. Это необратимо: никакое аккуратное хранение потом не возвращает ушедшее.",
            "Влажность работает в обратную сторону: она добавляет воду. Именно на отсыревшем материале появляется видимый налёт, и это уже повод выбросить, а не вопрос вкуса. Две беды тянут в противоположные стороны — поэтому ответом является стабильная комната, а не какой-то один приём.",
          ],
        },
      },
    },
    {
      id: "container",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Практический вопрос без культурной специфики: спрашивают одинаково на всех языках.",
      copy: {
        en: {
          q: "What should I keep it in?",
          a: [
            "Whatever it came in, if that was rigid and closes properly, kept out of the light. Glass with a tight lid is the ordinary answer everywhere and it is the ordinary answer here too. The point of the container is to hold a stable little atmosphere, which a thin plastic bag cannot do.",
            "A bag has a second problem specific to travelling: it crushes. Material that has been squashed in a pocket for three days has lost its structure before it has lost anything else, and structure is a large part of what you were looking at when you chose it.",
          ],
        },
        ru: {
          q: "В чём это держать?",
          a: [
            "В том, в чём пришло, если это жёсткое и нормально закрывается, и подальше от света. Стекло с плотной крышкой — обычный ответ везде, и здесь он тоже обычный. Смысл ёмкости в том, чтобы удерживать маленькую стабильную атмосферу, а тонкий пакет этого не умеет.",
            "У пакета есть и вторая беда, специфическая для поездки: он мнётся. Материал, три дня пролежавший смятым в кармане, теряет структуру раньше, чем что-либо другое, — а структура составляет немалую часть того, на что вы смотрели при выборе.",
          ],
        },
      },
    },
    {
      id: "fridge-or-freezer",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Идея «положу в холодильник» приходит в голову всем и одинаково плохо кончается в тропиках, где перепад до комнаты максимальный.",
      copy: {
        en: {
          q: "Should I put it in the hotel fridge?",
          a: [
            "We would not. The problem is not cold, it is the trip in and out: every time a cold jar meets a room at thirty-something degrees, moisture condenses on what is inside it. Doing that twice a day for a week is a reliable way to end up with damp material.",
            "A minibar is also the least stable appliance in the room, and in a good many of them the temperature is a suggestion rather than a setting. A cupboard away from the window achieves more with less drama.",
          ],
        },
        ru: {
          q: "Стоит ли класть это в холодильник в номере?",
          a: [
            "Мы бы не стали. Проблема не в холоде, а в дороге туда-обратно: каждый раз, когда холодная банка попадает в комнату с температурой за тридцать, внутри неё конденсируется влага. Делать так дважды в день неделю — надёжный способ получить отсыревший материал.",
            "Мини-бар к тому же самый нестабильный прибор в номере, и во многих из них температура — скорее пожелание, чем настройка. Шкаф подальше от окна даёт больше и без драматизма.",
          ],
        },
      },
    },
    {
      id: "hotel-safe",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Сейф в номере — универсальная привычка путешественника; вопрос задают везде, и ответ везде один и тот же.",
      copy: {
        en: {
          q: "Is the room safe a sensible place for it?",
          a: [
            "As a place that is closed and dark, yes, and that is most of what storage requires. What a safe does not do is change anything about whose room it is or what the property's own rules say, and those two questions are answered on the page about where you may use it rather than here.",
            "One practical note: safes in this climate are often built into a wardrobe against an outside wall, and the inside of one can be warmer than the room. Check it with your hand once before deciding it is the cool option.",
          ],
        },
        ru: {
          q: "Сейф в номере — разумное место?",
          a: [
            "Как закрытое и тёмное место — да, и это большая часть того, что требуется от хранения. Чего сейф не делает, так это не меняет ничего в том, чей это номер и что говорят правила самого отеля; эти два вопроса разбираются на странице о том, где можно употреблять, а не здесь.",
            "Одно практическое замечание: в этом климате сейф часто вделан в шкаф у наружной стены, и внутри него бывает теплее, чем в комнате. Проверьте рукой один раз, прежде чем считать его прохладным вариантом.",
          ],
        },
      },
    },
    {
      id: "buy-for-the-trip",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Вопрос про запас на поездку стоит на всех локалях, но у вылетающих домой он смыкается с темой отъезда — поэтому ответ явно отсылает туда, а не повторяет её.",
      copy: {
        en: {
          q: "Is it better to buy once for the whole trip?",
          a: [
            "It usually is not, for two unrelated reasons. The first is on this page: what you buy on day one is not the same thing by day ten in this heat. The second is that whatever is left when you leave has to stay in Thailand, and that question is dealt with in full on the page about going home.",
            "Buying twice for a two-week stay solves both at once. It also means the second jar is chosen by someone who now knows what they liked about the first, which is worth more than any description on a website.",
          ],
        },
        ru: {
          q: "Не лучше ли купить один раз на всю поездку?",
          a: [
            "Обычно нет, и по двум не связанным причинам. Первая на этой странице: то, что куплено в первый день, к десятому в такой жаре уже не то же самое. Вторая в том, что всё оставшееся к отъезду остаётся в Таиланде, — и этот вопрос целиком разобран на странице об отъезде.",
            "Покупка дважды за две недели снимает обе сразу. И вторую банку выбирает уже человек, который знает, что именно ему понравилось в первой, а это стоит больше любого описания на сайте.",
          ],
        },
      },
    },
    {
      id: "grind-ahead",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Бытовая привычка, одинаковая во всех аудиториях; культурной специфики нет.",
      copy: {
        en: {
          q: "Is there any harm in preparing it in advance?",
          a: [
            "Ground material has far more surface exposed to the air, so everything described above happens to it several times faster. Prepared in the morning and left until evening in a warm room, it is noticeably flatter by the time it is used.",
            "If you are going out and want to carry a small amount, prepare that amount rather than the jar. The rest keeps better whole, and there is no benefit to be had by doing the work early.",
          ],
        },
        ru: {
          q: "Есть ли вред в том, чтобы подготовить заранее?",
          a: [
            "У измельчённого материала многократно больше поверхности, открытой воздуху, поэтому всё описанное выше происходит с ним в несколько раз быстрее. Подготовленное утром и оставленное до вечера в тёплой комнате к моменту использования заметно площе.",
            "Если вы выходите и хотите взять немного с собой — подготовьте это немного, а не банку. Остальное лучше хранится целым, и выигрыша от того, чтобы сделать работу заранее, никакого.",
          ],
        },
      },
    },
    {
      id: "too-dry-too-damp",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Умение отличить пересушенное от отсыревшего одинаково нужно всем и нигде публично не объясняется.",
      copy: {
        en: {
          q: "How do I tell whether it has gone too dry or too damp?",
          a: [
            "Too dry crumbles at a touch and has almost no smell left; it is disappointing rather than a problem. Too damp is the one to take seriously: it feels cool and slightly springy, it may smell faintly of hay or of a cupboard, and it will not break cleanly.",
            "Anything with visible fuzz, powder or discolouration on it goes in the bin. There is no rescue procedure, no airing it out for a day, and nobody at a counter will tell you otherwise. This is the single point on this page where the correct answer is to lose the material.",
          ],
        },
        ru: {
          q: "Как понять, пересушено оно или отсырело?",
          a: [
            "Пересушенное крошится от прикосновения и почти не пахнет; это обидно, но не проблема. Отсыревшее — то, к чему стоит отнестись серьёзно: оно прохладное на ощупь и слегка пружинит, может отдавать сеном или шкафом и не ломается чисто.",
            "Всё, на чём виден пушок, налёт или изменение цвета, отправляется в мусор. Процедуры спасения нет, проветривания сутки нет, и у прилавка вам никто не скажет иначе. Это единственное место на странице, где правильный ответ — расстаться с материалом.",
          ],
        },
      },
    },
    {
      id: "smell-in-a-room",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос гостя отеля, а не тайского читателя: он про то, как не создать проблему в чужом номере. Для тайской локали в такой постановке не встречается — там спрашивают про правила дома, а не про отельный номер.",
      copy: {
        en: {
          q: "The jar makes the whole room smell. What can I do about it?",
          a: [
            "Keep it closed and keep it in something rigid; most of what escapes into a room escapes while a container is open on a table, not through a closed lid. A second container around the first does more than any spray does.",
            "The reason this matters is not tidiness. A room that smells is a conversation with housekeeping, and that conversation is governed by the property's own rules, which are covered on the page about where you may use it. Storage and use are different questions, and only the first one is answered here.",
          ],
        },
        ru: {
          q: "От банки пахнет весь номер. Что с этим делать?",
          a: [
            "Держать закрытым и держать в жёстком: большая часть того, что уходит в комнату, уходит, пока ёмкость открыта на столе, а не через закрытую крышку. Вторая ёмкость поверх первой даёт больше, чем любой спрей.",
            "Дело тут не в аккуратности. Пахнущий номер — это разговор с хозяйственной службой, а такой разговор регулируется правилами самого отеля; они разобраны на странице о том, где можно употреблять. Хранение и употребление — разные вопросы, и здесь отвечают только на первый.",
          ],
        },
      },
    },
  ],
};

const ARRIVING_WITH_CANNABIS: QuestionPageData = {
  slug: "arriving-with-cannabis",
  intent: "prescription",
  meta: {
    en: {
      title: "Arriving in Thailand with cannabis: what we can and cannot tell you",
      description:
        "The arrival side of the question, answered honestly: what the notices say about visitors, and the four places where we have no verifiable source and say so.",
      h1: "Bringing it in: the questions we can answer and the ones we cannot",
      kicker: "Before you land",
      lead:
        "The page about leaving Thailand is the one people read; this is the mirror of it, and it is thinner on certainty. Border practice is not published, it differs by airport and by carrier, and much of what circulates online is somebody's single experience presented as a rule. Four of the answers below say plainly that we have no source to show you.",
      caution:
        "Nothing here is legal advice and nothing here is a prediction about your arrival. Where an answer is marked as unconfirmed, that is not modesty — it means we could not find a source we are willing to put our name to, and you should treat the question as open.",
    },
    ru: {
      title: "Прилёт в Таиланд с каннабисом: что мы можем сказать, а что нет",
      description:
        "Сторона прилёта, отвеченная честно: что уведомления говорят о приезжих и четыре места, где у нас нет проверяемого источника, о чём мы прямо и пишем.",
      h1: "Ввоз: на что мы можем ответить и на что не можем",
      kicker: "До прилёта",
      lead:
        "Страницу об отъезде читают все; это её зеркало, и определённости на ней меньше. Пограничная практика не публикуется, отличается от аэропорта к аэропорту и от перевозчика к перевозчику, а большая часть ходящего в сети — чей-то единичный опыт, поданный как правило. Четыре ответа ниже прямо говорят, что показать источник нам нечем.",
      caution:
        "Здесь нет ни юридической консультации, ни предсказания о вашем прилёте. Пометка «не подтверждено» — это не скромность: она означает, что источника, под которым мы готовы подписаться, найти не удалось, и вопрос стоит считать открытым.",
    },
  },
  questions: [
    {
      id: "bring-my-own",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Главный вопрос темы на всех локалях. Ответ везде одинаково честен: показать проверяемый источник по ввозу мы не можем.",
      copy: {
        en: {
          q: "Can I bring cannabis into Thailand with me?",
          a: [
            "We have no source we can show you that describes what a visitor may carry in. What we can say is what the arrangement here looks like from the inside: a lawful purchase happens at a licensed counter inside Thailand, against a document issued inside Thailand, and nothing in that arrangement contemplates material arriving from somewhere else.",
            "Treat an unsourced answer as a reason to ask somebody who is accountable for the answer, not as a green light. Customs, an embassy or a Thai lawyer are the people whose answer means something; a dispensary's is not.",
          ],
        },
        ru: {
          q: "Можно ли привезти каннабис с собой в Таиланд?",
          a: [
            "Источника, который бы описывал, что приезжему разрешено ввозить, и который мы могли бы вам показать, у нас нет. Сказать мы можем то, как устройство выглядит изнутри: законная покупка происходит у лицензированного прилавка внутри Таиланда, по документу, выданному внутри Таиланда, и ничего в этом устройстве не предполагает материал, приехавший откуда-то ещё.",
            "Считайте ответ без источника поводом спросить того, кто за ответ отвечает, а не разрешением. Значение имеет ответ таможни, посольства или тайского юриста; ответ магазина — нет.",
          ],
        },
      },
    },
    {
      id: "prescription-from-home",
      basis: "official",
      sources: ["touristNotice"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос стоит на всех локалях, но у прилетающего он звучит иначе, чем у стоящего у прилавка: там «продадут ли мне», здесь «пропустят ли меня с этим». Пересказ уведомления один, вывод из него разный.",
      copy: {
        en: {
          q: "I have a prescription from my own country. Does it work here?",
          a: [
            "The official tourist notice says a visitor needs a prescription that was issued inside Thailand. A document written by a doctor at home does not answer that description, and no counter can make it answer it.",
            "That is a statement about buying, not about your suitcase — the notice does not describe what happens at an arrivals hall. But it does settle the assumption people usually build their plans on, which is that paperwork from home transfers. It does not.",
          ],
        },
        ru: {
          q: "У меня рецепт из своей страны. Он здесь работает?",
          a: [
            "Официальное уведомление для туристов говорит, что приезжему нужен рецепт, выданный внутри Таиланда. Документ, выписанный врачом дома, под это описание не подходит, и заставить его подойти у прилавка невозможно.",
            "Это утверждение о покупке, а не о вашем чемодане: уведомление не описывает, что происходит в зале прилёта. Но оно снимает допущение, вокруг которого обычно строят планы, — будто домашние бумаги переносятся. Не переносятся.",
          ],
        },
      },
    },
    {
      id: "cbd-and-hemp-products",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Убеждение «это же не каннабис, а просто добавка» встречается во всех аудиториях и одинаково не имеет под собой источника, который мы могли бы показать.",
      copy: {
        en: {
          q: "What about oils, capsules and hemp products bought as supplements at home?",
          a: [
            "Travellers routinely treat these as a separate, softer category, and we have found nothing that supports treating them that way at a border. We are not in a position to tell you they are fine, and we are not in a position to tell you they are not.",
            "What we would say is that the packaging of a supplement is not an argument. The label describes what a shop in another country was allowed to sell you; it says nothing about what an officer here is looking at or how they classify it.",
          ],
        },
        ru: {
          q: "А масла, капсулы и конопляные продукты, купленные дома как добавка?",
          a: [
            "Приезжие регулярно считают их отдельной, более мягкой категорией, и ничего, что бы такое отношение на границе подтверждало, мы не нашли. Мы не в том положении, чтобы сказать вам, что с ними всё в порядке, и не в том, чтобы сказать обратное.",
            "Сказать мы можем вот что: упаковка добавки — не аргумент. Этикетка описывает, что магазину в другой стране разрешили вам продать; о том, что видит и как классифицирует сотрудник здесь, она не говорит ничего.",
          ],
        },
      },
    },
    {
      id: "seeds",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Вопрос приезжего, а не тайского читателя: у тайской аудитории про семена спрашивают в контексте домашнего выращивания, а это другая тема и другая норма.",
      copy: {
        en: {
          q: "Are seeds a different question?",
          a: [
            "They are a different question and we cannot answer it either. Seeds sit in their own category in most countries' rules, sometimes a lighter one and sometimes a heavier one, and we have no Thai source to point you at.",
            "This is one of the places where the internet is confidently wrong in both directions at once. If it matters to your plans, ask somebody official before you pack rather than after you land.",
          ],
        },
        ru: {
          q: "Семена — это другой вопрос?",
          a: [
            "Это другой вопрос, и на него мы тоже ответить не можем. В правилах большинства стран семена лежат в собственной категории — где-то более мягкой, где-то более строгой, — и тайского источника, на который можно вас направить, у нас нет.",
            "Это одно из мест, где интернет уверенно ошибается сразу в обе стороны. Если для ваших планов это важно, спросите официальную инстанцию до сборов, а не после прилёта.",
          ],
        },
      },
    },
    {
      id: "vapes-and-devices",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Единственный вопрос темы, где у нас есть собственное наблюдение, а не догадка: мы работаем в стране, где эти устройства не продаются, и видим последствия у прилавка.",
      copy: {
        en: {
          q: "Can I bring a vape or an e-cigarette?",
          a: [
            "We do not sell vapes or e-cigarettes in any form, and the reason is that their sale is prohibited in Thailand. A shop that keeps them quietly under a counter is a shop gambling with the licence that lets it open at all.",
            "What that means for your luggage is a customs question rather than ours, and we will not pretend to answer it. But a device you cannot lawfully buy here is not a device to assume is uncontroversial on arrival, and this is one of the more common ways a holiday starts badly.",
          ],
        },
        ru: {
          q: "Можно ли везти вейп или электронную сигарету?",
          a: [
            "Вейпы и электронные сигареты мы не продаём ни в каком виде, и причина в том, что их продажа в Таиланде запрещена. Магазин, который тихо держит их под прилавком, — это магазин, играющий лицензией, которая вообще позволяет ему открыться.",
            "Что это значит для вашего багажа — вопрос таможни, а не наш, и делать вид, что мы на него отвечаем, мы не станем. Но устройство, которое здесь нельзя законно купить, — не то устройство, о котором стоит считать, что на прилёте оно бесспорно; так довольно часто и начинается испорченный отпуск.",
          ],
        },
      },
    },
    {
      id: "transit-through-bangkok",
      basis: "unconfirmed",
      sources: [],
      locales: ["en", "ru", "ar", "zh", "ko", "ja"],
      localeNote:
        "Пересадка через Бангкок по дороге куда-то ещё — вопрос иностранного маршрута. Для арабской, корейской, японской и китайской аудитории Суварнабхуми стоит в середине маршрута чаще всего; тайскому читателю такой вопрос не адресован.",
      copy: {
        en: {
          q: "I am only connecting through Thailand. Does any of this apply?",
          a: [
            "We do not know, and anybody who tells you a transit area is outside a country's reach is telling you something they have not checked. What we would say is that a connection is not a guarantee: diversions happen, connections are missed, and a night in an airport hotel puts you through an immigration desk you had not planned on.",
            "The mirror of this question — a layover on the way out of Thailand — is dealt with on the page about going home, where the same reasoning applies with a different set of consequences.",
          ],
        },
        ru: {
          q: "У меня только пересадка в Таиланде. Это меня касается?",
          a: [
            "Мы не знаем, а тот, кто говорит вам, что транзитная зона находится вне досягаемости страны, сообщает непроверенное. Сказать мы можем следующее: пересадка — не гарантия. Бывают уходы на запасной аэродром, сорванные стыковки и ночь в аэропортовом отеле, которая проводит вас через паспортный контроль, куда вы не собирались.",
            "Зеркальный вопрос — пересадка на пути из Таиланда — разобран на странице об отъезде, где та же логика приводит к другому набору последствий.",
          ],
        },
      },
    },
    {
      id: "buy-here-instead",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Практический вывод из всей темы; он одинаково относится к любому приезжему независимо от маршрута.",
      copy: {
        en: {
          q: "So what is the sensible plan?",
          a: [
            "Arrive with nothing and deal with the question here, where it has a defined answer: a licensed counter, a document issued in Thailand, an age line at twenty, and a purchase made in person. Every part of that is describable, and this site describes it.",
            "The alternative asks you to guess about a border in advance, with no source to guess from and a bad downside if you guess wrong. There is no upside on the other side of that trade that a visitor could reasonably want.",
          ],
        },
        ru: {
          q: "Каков же разумный план?",
          a: [
            "Прилететь ни с чем и решать вопрос здесь, где у него есть определённый ответ: лицензированный прилавок, документ, выданный в Таиланде, возрастная граница в двадцать лет и покупка лично. Каждая часть этого описуема, и этот сайт её описывает.",
            "Альтернатива предлагает угадывать про границу заранее, не имея источника, из которого угадывать, и с плохими последствиями при неверной догадке. Выигрыша по ту сторону этой сделки, которого приезжий мог бы разумно хотеть, нет.",
          ],
        },
      },
    },
    {
      id: "age-on-arrival",
      basis: "official",
      sources: ["thaiGovernment"],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote:
        "Возрастная граница относится к покупке, а не к прилёту, и именно поэтому её нужно назвать здесь: планирующий поездку человек читает эту страницу раньше остальных.",
      copy: {
        en: {
          q: "Is there an age line I should know about before I plan anything?",
          a: [
            "Twenty. The government notice treats cannabis flower as a controlled herb sold under a prescription, and the age line at a counter here is twenty and over, with a passport as the document that proves both age and identity for a foreign visitor.",
            "This is about buying rather than about arriving, but it belongs on a page read before a trip: a plan built around somebody who will not be sold to is a plan that fails at the counter rather than at the border.",
          ],
        },
        ru: {
          q: "Есть ли возрастная граница, о которой стоит знать до планов?",
          a: [
            "Двадцать лет. Уведомление правительства относит соцветия к контролируемым травам, отпускаемым по рецепту, а возрастная граница у прилавка здесь — от двадцати, причём для иностранного гостя именно паспорт подтверждает и возраст, и личность.",
            "Это про покупку, а не про прилёт, но место ему на странице, которую читают до поездки: план, построенный вокруг человека, которому не продадут, ломается у прилавка, а не на границе.",
          ],
        },
      },
    },
    {
      id: "who-to-ask",
      basis: "practice",
      sources: [],
      locales: ["en", "ru", "th", "ar", "zh", "ko", "ja"],
      localeNote: "Завершающий вопрос темы: он объясняет, что делать с четырьмя неотвеченными выше, и нужен на каждой локали.",
      copy: {
        en: {
          q: "Who should I actually ask about the unanswered ones?",
          a: [
            "In order of usefulness: Thai customs, your own country's embassy here, and a lawyer practising in Thailand. Each of those is accountable for what they tell you in a way that a shop, a forum and a travel blog are not.",
            "Your airline is worth a message too, for a narrower reason: they are the ones who will refuse to carry something, and they answer that question in writing. That is a lower bar than legality and a much faster answer.",
          ],
        },
        ru: {
          q: "У кого тогда спрашивать про неотвеченное?",
          a: [
            "В порядке полезности: тайская таможня, посольство вашей страны здесь и юрист, практикующий в Таиланде. Каждый из них отвечает за сказанное так, как не отвечают ни магазин, ни форум, ни travel-блог.",
            "Написать стоит и авиакомпании — по более узкой причине: именно она откажется что-то везти, и на этот вопрос она отвечает письменно. Планка ниже, чем законность, а ответ куда быстрее.",
          ],
        },
      },
    },
  ],
};

/** Новые темы в порядке, в котором они встают в хабе после шести существующих. */
export const EXTRA_QUESTION_PAGES: readonly QuestionPageData[] = [KEEPING_FLOWER, ARRIVING_WITH_CANNABIS];
