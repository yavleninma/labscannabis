import type { PartialGuideCopyByLocale } from "@/data/guides";

/**
 * Гайд «как выбрать цветок» (T-11), en+ru.
 *
 * Интент, которого нет ни у Leafly, ни у продуктовых каталогов: не «что такое
 * сорт», а «как покупателю самому оценить то, что стоит перед ним». Именно
 * поэтому здесь нет ни одного утверждения о собственном товаре, о ферме, о
 * сертификате и о происхождении цветка: конкуренты выигрывают на доказуемых
 * активах, а заявление без документа — брак.
 *
 * ЗАПРЕЩЕНО в этом файле: аббревиатуры каннабиноидов и любые проценты
 * содержания (линтер снимает это правило только на правовом гиде), оценочные
 * обороты про товар, цены, вес и наличие.
 */
export const CHOOSING_FLOWER_GUIDE: PartialGuideCopyByLocale = {
  en: {
    title: "How to choose cannabis flower in Pattaya: a buyer's guide",
    description:
      "Indica, sativa and hybrid labels, what a lab report actually tells you, how to spot well-cured flower, and the questions worth asking at a Pattaya counter.",
    h1: "How to choose cannabis flower in Pattaya",
    kicker: "Choosing guide",
    basisLabels: {
      official: "Official source",
      practice: "Practical caution — not a legal conclusion",
    },
    intro:
      "Most advice about choosing flower is written for people shopping from a catalogue, and none of it survives contact with a counter in a tropical city where the jar in front of you was grown three provinces away and stored through a rainy season. This guide is about the part you can actually judge: what your eyes, your nose and four decent questions can tell you before you commit to anything.",
    checklistTitle: "What to check, in order",
    checklist: [
      "Smell first — a jar that smells of hay or of nothing has lost the part you were buying.",
      "Look at the trim: hand-finished flower keeps its shape, machine-finished flower looks shaved.",
      "Check the moisture by feel: it should give slightly and spring back, not crumble and not squash.",
      "Ask when it was harvested and how long it has been in that jar.",
      "Ask what the lab report covers — cannabinoid content is one line of it, contaminants are the rest.",
      "Buy a small amount of something new before buying more of it.",
    ],
    sections: [
      {
        h2: "Indica, sativa, hybrid: a shorthand, not a specification",
        basis: "practice",
        body: [
          "The three words are the oldest shorthand in the trade and they still describe something real about how plants grow — broad leaves and short bushes at one end, tall narrow plants at the other. What they no longer describe reliably is how a given jar will feel, because almost everything sold anywhere today is a cross of crosses, and the label attached to it is a marketing decision as much as a botanical one.",
          "Use the words as a starting direction rather than a promise. Saying you want something on the heavier, slower side communicates more than a category name, and a person behind a counter can work with that. What is on the shelf tomorrow will carry different names than what is on it today; the direction you described will still make sense.",
          "In this climate there is a second reason to hold the labels loosely. Heat changes how anything feels — a long humid afternoon flattens the sharp end of most things, and people who arrive with strong preferences from a cold country routinely find their usual choice behaves differently here. That is worth knowing before deciding a shop got the label wrong.",
        ],
      },
      {
        h2: "What a lab report actually tells you",
        basis: "practice",
        body: [
          "A certificate of analysis is a laboratory's statement about a specific batch. The line everybody looks at is cannabinoid content, and it is the least useful line on the page for choosing between two jars that are both in the ordinary range. It says nothing about aroma, nothing about how the flower was dried, and nothing about how it will feel.",
          "The parts worth reading sit further down: screening for pesticides, for heavy metals, for residual solvents where any extraction was involved, and for microbial contamination and mould. In a humid climate that last group is not a formality. Look at the batch number and the date as well — a report that does not match the jar in front of you is a report about something else, which is a surprisingly common thing to discover.",
          "If a shop cannot show you a report, that is an answer in itself. It does not automatically mean the flower is bad, but it does mean you are relying entirely on the word of the person selling it, and you should price that in when deciding how much to buy.",
        ],
      },
      {
        h2: "How well-cured flower looks and feels",
        basis: "practice",
        body: [
          "Curing is the slow part after drying, and it is where most of the difference between a pleasant jar and a harsh one is decided. Well-cured flower has a smell that arrives immediately and keeps developing as you hold it. Under-cured flower smells green and grassy and feels damp; over-dried flower has almost no smell at all and turns to dust when handled.",
          "Squeeze a bud gently. It should compress slightly and open back up. If it crumbles between your fingers it has been dried too hard or sat too long in the open; if it stays flattened and feels sticky-wet rather than resinous, it has moisture in it that should not be there — and in this climate that is the beginning of a mould problem rather than a sign of freshness.",
          "Look at the surface in daylight if you can. Trichomes are the tiny resin heads that give good flower its frosted look; they should look like a coating rather than a dusting, and the flower under them should be intact rather than shaved down to a smooth ball. Seeds and thick stems are not a scandal, but you are paying for weight either way, so notice them.",
        ],
      },
      {
        h2: "Aroma is the most honest signal on the counter",
        basis: "practice",
        body: [
          "The aromatic compounds in cannabis are the same family of compounds that make citrus peel smell of citrus and pine forests smell of pine, and they are fragile: heat, light and time destroy them. That makes aroma the single best proxy available to a buyer standing at a counter for how the flower was handled after harvest.",
          "Learn your own vocabulary for it rather than borrowing one. Whether a jar reads as citrus, fuel, pepper, pine, sweet or earthy tells you far more about whether you will enjoy it than a strain name will, and it is a description a counter can act on — most people behind a counter can find you something in the same aromatic family even when the names have nothing in common.",
          "One practical note: smell the jar rather than the open bag, and give it a moment. The first impression when a lid comes off is not the whole picture, and the difference between a flat jar and a lively one usually shows up in the second or third breath.",
        ],
      },
      {
        h2: "Storage, which matters more in Thailand than at home",
        basis: "practice",
        body: [
          "Everything that goes wrong with flower goes wrong faster here. Warmth accelerates the loss of aroma, sunlight bleaches it, and ambient humidity swings between two extremes across a single day. A paper bag on a hotel windowsill will noticeably degrade in a few days what a sealed jar in a dark drawer would hold for weeks.",
          "So ask how the shop stores what it sells, and look at whether jars are opened, closed and put back out of the light in front of you. Then do the same yourself: keep it sealed, keep it dark, keep it away from the air conditioner as well as away from the balcony. Do not decant into a plastic bag for the walk home if you can avoid it.",
          "Buy in the quantity you will actually use during the trip rather than the quantity that feels efficient. Flower that spends two weeks degrading in a room is not a saving.",
        ],
      },
      {
        h2: "Four questions worth asking, and the answers to listen for",
        basis: "practice",
        body: [
          "When was it harvested, and when did it go into that jar? A specific answer — a month, a batch — is a good sign. A vague one is not necessarily a lie, but it tells you the shop is not tracking what a shop with records tracks.",
          "Who grew it and where? Again, specificity is the signal rather than the answer itself. Somebody who knows the farm can tell you whether it was grown indoors or in a greenhouse and what the last season did to it.",
          "What does the report cover and can I see it? Reasonable in any shop that has one; the reaction to the question is often more informative than the document.",
          "What would you compare this to on the shelf right now? This is the question that separates a person who knows their inventory from a person reciting labels. A useful answer names a second jar and says how the two differ; an unhelpful answer repeats the marketing copy on the first one.",
        ],
      },
      {
        h2: "Red flags that are worth walking away from",
        basis: "practice",
        body: [
          "A shop that will not open the jar. There is no good reason for it; buying flower unopened and unsniffed is buying a picture of flower.",
          "A jar that smells of hay, of damp cardboard, or of nothing at all. The first two mean it was dried or stored badly and the third means whatever you were buying has already evaporated.",
          "Visible white fuzz at the base of a bud, or a smell of a damp basement, both of which point at mould. In a climate like this one that is a routine hazard rather than an exotic one, and no price makes it a good idea.",
          "And the non-product one: a counter that does not ask for documents. Everything above is about quality, but a shop operating outside the licensing rules has already told you how much weight to give its answers about anything else.",
        ],
      },
    ],
    faqTitle: "Choosing flower: common questions",
    faq: [
      {
        q: "Is indica or sativa better for a hot climate?",
        a: "Neither label predicts that reliably — almost everything sold today is a cross. Describe the effect direction you want and let the counter suggest something from the current shelf.",
      },
      {
        q: "Does a higher cannabinoid percentage mean better flower?",
        a: "No. It is one line on a lab report and says nothing about aroma, curing or how a jar will feel. Two jars in the ordinary range can be completely different experiences.",
      },
      {
        q: "How can I tell if flower is fresh?",
        a: "Smell it and squeeze it gently. It should smell alive and keep developing, and it should compress slightly and spring back rather than crumbling or staying flat.",
      },
      {
        q: "What should a lab report include?",
        a: "Cannabinoid content plus screening for pesticides, heavy metals, residual solvents and microbial contamination, with a batch number and date that match the jar in front of you.",
      },
      {
        q: "How should I store it during a trip?",
        a: "Sealed, dark, away from heat and out of the air-conditioning draught. Buy what you will use rather than a larger amount that will degrade in the room.",
      },
      {
        q: "Are seeds or stems a sign of bad flower?",
        a: "Not necessarily bad, but you are paying for weight either way, so it is worth noticing them before you decide.",
      },
    ],
    cautionTitle: "About what this page does not claim",
    caution:
      "Nothing here is a statement about the flower on our own shelf, about a farm or about a certificate we hold — those are claims that require documents, and documents are published when they are verified rather than when they would be convenient. This page describes what any buyer can check for themselves at any counter in the city.",
  },
  ru: {
    title: "Как выбрать каннабис в Паттайе: гид покупателя",
    description:
      "Что на самом деле значат индика, сатива и гибрид, что читать в лабораторном отчёте, как отличить правильно вылеченный цветок и что спросить у прилавка.",
    h1: "Как выбрать каннабис в Паттайе",
    kicker: "Гид по выбору",
    basisLabels: {
      official: "Официальный источник",
      practice: "Практическая осторожность — не юридический вывод",
    },
    intro:
      "Почти все советы о выборе цветка написаны для человека, который выбирает по каталогу, и ни один из них не переживает встречи с прилавком в тропическом городе, где банка перед вами выросла за три провинции отсюда и пережила сезон дождей на складе. Этот гид — о той части, которую вы действительно можете оценить сами: что вам скажут глаза, нос и четыре нормальных вопроса до того, как вы на что-то согласились.",
    checklistTitle: "Что проверять и в каком порядке",
    checklist: [
      "Сначала запах: банка, которая пахнет сеном или ничем, потеряла ровно то, за чем вы пришли.",
      "Посмотрите на подрезку: ручная сохраняет форму шишки, машинная выглядит обритой.",
      "Проверьте влажность на ощупь: шишка должна слегка поддаваться и распрямляться, а не крошиться и не сминаться.",
      "Спросите, когда собрали урожай и сколько времени содержимое лежит в этой банке.",
      "Спросите, что охватывает лабораторный отчёт: содержание каннабиноидов — это одна строка, остальное про примеси.",
      "Незнакомое берите понемногу и только потом решайте, брать ли ещё.",
    ],
    sections: [
      {
        h2: "Индика, сатива, гибрид: сокращение, а не спецификация",
        basis: "practice",
        body: [
          "Три слова — старейшее сокращение в отрасли, и они до сих пор описывают кое-что настоящее про то, как растёт растение: широкий лист и низкий куст на одном полюсе, высокое узколистное растение на другом. Чего они больше не описывают надёжно, так это ощущений от конкретной банки: почти всё, что продаётся сегодня где угодно, — это скрещивание скрещиваний, и ярлык на банке в той же мере маркетинговое решение, что и ботаническое.",
          "Пользуйтесь этими словами как направлением, а не как обещанием. Фраза «хочу что-то потяжелее и помедленнее» сообщает больше, чем название категории, и с ней человек за прилавком может работать. Завтра на полке будут другие названия, а описанное вами направление останется понятным.",
          "В этом климате есть и вторая причина держать ярлыки на дистанции. Жара меняет ощущения: длинный влажный день сглаживает острый край почти у всего, и гости, приехавшие с твёрдыми предпочтениями из холодной страны, регулярно обнаруживают, что привычный выбор ведёт себя иначе. Об этом полезно помнить прежде, чем решить, что магазин перепутал ярлык.",
        ],
      },
      {
        h2: "Что на самом деле говорит лабораторный отчёт",
        basis: "practice",
        body: [
          "Сертификат анализа — это утверждение лаборатории о конкретной партии. Строка, в которую все смотрят, — содержание каннабиноидов, и для выбора между двумя банками из обычного диапазона она наименее полезна на всей странице. Она ничего не говорит ни об аромате, ни о том, как цветок сушили, ни о том, каким он окажется.",
          "Читать стоит то, что ниже: проверка на пестициды, на тяжёлые металлы, на остаточные растворители, если была экстракция, и на микробиологию и плесень. Во влажном климате последняя группа — не формальность. Посмотрите заодно на номер партии и дату: отчёт, который не совпадает с банкой перед вами, — это отчёт про что-то другое, и обнаруживается такое неожиданно часто.",
          "Если отчёт показать не могут, это тоже ответ. Он не означает автоматически, что цветок плохой, но означает, что вы полагаетесь исключительно на слово продавца, — и это стоит учитывать, решая, сколько брать.",
        ],
      },
      {
        h2: "Как выглядит и ощущается правильно вылеченный цветок",
        basis: "practice",
        body: [
          "Вылеживание — это медленная часть после сушки, и именно там решается почти вся разница между приятной банкой и жёсткой. У правильно вылеченного цветка запах приходит сразу и продолжает разворачиваться, пока шишка у вас в руке. Недовылежанный пахнет травой и зеленью и ощущается сырым; пересушенный почти не пахнет и рассыпается в пыль от прикосновения.",
          "Сожмите шишку осторожно. Она должна слегка сжаться и вернуться в форму. Крошится между пальцами — сушили слишком жёстко или она долго лежала открытой. Осталась смятой и ощущается мокро-липкой, а не смолистой, — внутри влага, которой там быть не должно, а в этом климате это начало проблемы с плесенью, а не признак свежести.",
          "Посмотрите на поверхность при дневном свете, если есть возможность. Трихомы — это крошечные смоляные головки, из-за которых хороший цветок выглядит заиндевевшим; они должны читаться как покрытие, а не как пыль, а сама шишка под ними — быть целой, а не сбритой до гладкого шарика. Семена и толстые стебли — не скандал, но вес вы оплачиваете в любом случае, так что заметить их стоит.",
        ],
      },
      {
        h2: "Аромат — самый честный сигнал у прилавка",
        basis: "practice",
        body: [
          "Ароматические соединения каннабиса — та же семья веществ, из-за которых цитрусовая корка пахнет цитрусом, а сосновый лес сосной, и они хрупкие: их разрушают тепло, свет и время. Поэтому аромат — лучший доступный покупателю у прилавка косвенный признак того, как с цветком обращались после сбора.",
          "Заведите собственный словарь вместо чужого. Читается банка как цитрус, топливо, перец, сосна, сладость или земля — это скажет вам о будущем удовольствии куда больше, чем название сорта, и это описание, с которым прилавок может что-то сделать: подобрать соседа из той же ароматической семьи можно даже тогда, когда названия не имеют между собой ничего общего.",
          "Практическая деталь: нюхайте банку, а не открытый пакет, и дайте себе секунду. Первое впечатление при снятой крышке — ещё не вся картина, а разница между плоской банкой и живой обычно проявляется на втором-третьем вдохе.",
        ],
      },
      {
        h2: "Хранение, которое в Таиланде важнее, чем дома",
        basis: "practice",
        body: [
          "Всё, что портится с цветком, портится здесь быстрее. Тепло ускоряет потерю аромата, солнце его выжигает, а влажность за один день успевает сходить в обе крайности. Бумажный пакет на подоконнике в отеле за несколько дней ощутимо уронит то, что закрытая банка в тёмном ящике держала бы неделями.",
          "Поэтому спросите, как магазин хранит то, что продаёт, и посмотрите, открывают ли банку при вас, закрывают ли обратно и убирают ли из-под света. Дальше делайте то же самое сами: закрыто, темно, подальше и от кондиционера, и от балкона. По возможности не пересыпайте в пластиковый пакет ради дороги до отеля.",
          "Берите столько, сколько реально используете за поездку, а не столько, сколько кажется рациональным. Цветок, который две недели портится в номере, — это не экономия.",
        ],
      },
      {
        h2: "Четыре вопроса и то, что слушать в ответах",
        basis: "practice",
        body: [
          "Когда собрали и когда положили в эту банку? Конкретный ответ — месяц, партия — хороший признак. Расплывчатый не обязательно означает ложь, но говорит, что магазин не отслеживает то, что отслеживает магазин с учётом.",
          "Кто вырастил и где? И здесь сигналом служит конкретность, а не сам ответ. Тот, кто знает ферму, скажет, росло это в помещении или в теплице и что с ним сделал прошлый сезон.",
          "Что охватывает отчёт и можно ли на него посмотреть? Нормальная просьба в любом магазине, у которого он есть; реакция на вопрос часто информативнее самого документа.",
          "С чем из того, что сейчас на полке, вы бы это сравнили? Именно этот вопрос отделяет человека, который знает свою полку, от человека, пересказывающего ярлыки. Полезный ответ называет вторую банку и объясняет разницу; бесполезный повторяет описание первой.",
        ],
      },
      {
        h2: "Красные флаги, при которых стоит уйти",
        basis: "practice",
        body: [
          "Магазин, который не открывает банку. Разумной причины для этого нет: купить цветок, не открыв и не понюхав, — значит купить его фотографию.",
          "Банка, которая пахнет сеном, сырым картоном или ничем. Первые два запаха означают, что сушили или хранили плохо, третий — что то, за чем вы пришли, уже испарилось.",
          "Белый пушок у основания шишки или запах сырого подвала — оба указывают на плесень. В таком климате это рядовая опасность, а не экзотика, и никакая договорённость не делает такую покупку хорошей идеей.",
          "И последний, не про товар: прилавок, который не спрашивает документы. Всё выше — про качество, но магазин, работающий вне разрешительных правил, уже сообщил вам, какой вес имеют его ответы обо всём остальном.",
        ],
      },
    ],
    faqTitle: "Выбор цветка: частые вопросы",
    faq: [
      {
        q: "Индика или сатива лучше для жаркого климата?",
        a: "Ни тот, ни другой ярлык этого надёжно не предсказывает: почти всё сегодня — гибриды. Опишите нужное направление, и у прилавка подберут что-то с текущей полки.",
      },
      {
        q: "Чем выше процент каннабиноидов, тем лучше цветок?",
        a: "Нет. Это одна строка отчёта, и она ничего не говорит ни об аромате, ни о вылеживании, ни об ощущениях. Две банки из обычного диапазона могут оказаться совершенно разными.",
      },
      {
        q: "Как понять, что цветок свежий?",
        a: "Понюхайте и осторожно сожмите. Запах должен быть живым и разворачиваться, а шишка — слегка сжиматься и распрямляться, а не крошиться и не оставаться смятой.",
      },
      {
        q: "Что должно быть в лабораторном отчёте?",
        a: "Содержание каннабиноидов плюс проверка на пестициды, тяжёлые металлы, остаточные растворители и микробиологию, с номером партии и датой, совпадающими с банкой перед вами.",
      },
      {
        q: "Как хранить в поездке?",
        a: "Закрыто, в темноте, подальше от тепла и не под потоком кондиционера. Берите столько, сколько используете, а не запас, который испортится в номере.",
      },
      {
        q: "Семена и стебли — признак плохого цветка?",
        a: "Не обязательно плохого, но вес вы оплачиваете в любом случае, поэтому заметить их стоит до того, как вы решили.",
      },
    ],
    cautionTitle: "О чём эта страница не заявляет",
    caution:
      "Здесь нет ни одного утверждения о цветке на нашей собственной полке, о ферме или о сертификате, который у нас якобы есть: такие заявления требуют документов, а документы публикуются тогда, когда они проверены, а не тогда, когда это удобно. Страница описывает то, что любой покупатель может проверить сам у любого прилавка в городе.",
  },
};
