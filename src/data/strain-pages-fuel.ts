import type { Locale } from "@/lib/i18n";
import type { StrainPageCopy, StrainPages } from "@/data/strain-pages";
import { buildStrainFacts } from "./strain-catalog.ts";

/**
 * ТЕКСТ СТРАНИЦ СОРТОВ: топливная линия и классика, на которой она стоит.
 *
 * Пять сортов: GG4, Sour Diesel, Bruce Banner, AK-47, Northern Lights.
 * Каждый разбирается через СВОЮ фактуру из `strain-catalog.ts` — судебное
 * урегулирование по названию, неразрешённая родословная, номер фенотипа,
 * четыре региона в исходном семенном материале, шесть недель цветения.
 * Разделы у каждой страницы называются по-своему: одинаковые заголовки на
 * двадцати страницах — это и есть шаблон, который ворота обязаны отбить.
 *
 * Блок фактов НЕ пишется руками: его собирает `buildStrainFacts(slug, locale)`
 * из набора данных, поэтому таблица не может разойтись с прозой и не может
 * устареть отдельно от неё. Проза обязана опираться на те же числа.
 *
 * ЗАПРЕТЫ те же, что в `strain-pages.ts`, и их проверяет линтер: ни цены, ни
 * веса, ни наличия, ни аббревиатур каннабиноидов, ни процентов содержания, ни
 * медицинских обещаний, ни оценочного регистра.
 */

/** Собирает копию страницы, подставив вычисленный блок фактов. */
function withFacts(
  slug: string,
  locale: Locale,
  copy: Omit<StrainPageCopy, "facts">,
): StrainPageCopy {
  return { ...copy, facts: buildStrainFacts(slug, locale) };
}

export const FUEL_STRAIN_PAGES: StrainPages = {
  "gorilla-glue-4": {
    en: withFacts("gorilla-glue-4", "en", {
      thingName: "GG4",
      title: "GG4 (Original Glue): the accident, the lawsuit, the aroma",
      description:
        "How an unplanned pollination produced GG4, why the Gorilla Glue name had to be dropped in 2018, and what the cocoa-and-coffee tail under the fuel actually comes from.",
      h1: "GG4: a strain that exists because of a mistake",
      kicker: "Strain notes",
      lead:
        "Almost every cultivar on a menu was aimed at by somebody. This one was not. GG4 came out of a hermaphrodite plant pollinating a female nobody intended it to reach, and the growers kept the result instead of throwing it away. That is the whole origin story, and it is unusually well documented for this trade.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "The pollination nobody planned",
          body: [
            "A Chem Sis plant — the name is also written Chem's Sister — threw male flowers and pollinated a Sour Dubb female. The seeds should have been discarded; instead the growers behind GG Strains grew them out, liked what came up and crossed the survivor onward with Chocolate Diesel. The plant that came out of that second step is the one now sold under three or four names.",
            "This matters for reading a menu because the lineage is one of the few on this list that comes from the people who made it rather than from a catalogue reconstructing a family tree after the fact. Where most old names carry a pedigree that is a best guess, this one carries a story with dates attached.",
            "Chocolate Diesel is the parent that does the sensory work. It is where the roasted note under the solvent comes from, and it is the reason a genuine Glue nose reads as coffee and cocoa rather than as plain gas.",
          ],
        },
        {
          h2: "Why the name on the jar keeps changing",
          body: [
            "The adhesive manufacturer of the same name went to court in 2017. The settlement required the breeders to stop using the Gorilla Glue name and every piece of gorilla imagery by September 2018, which is why the same plant now appears as GG4, as Original Glue, or simply as Glue.",
            "So three labels here are one cultivar, and a shop using the older wording is not necessarily selling something different. This is worth knowing precisely because the reverse trick is common: a name that everyone recognises gets attached to material that has nothing to do with it.",
            "The original name was never about how the plant feels, either. It described trimming scissors gummed solid with resin at harvest — a working complaint that turned into branding, and then into a trademark problem.",
          ],
        },
        {
          h2: "What the nose gives away",
          body: [
            "The leading terpene reported for this plant is beta-caryophyllene, which is the peppery, clove-and-dry-wood side of the spectrum rather than the citrus one. Over it sits a solvent sharpness, and under both there is the roasted tail from the Chocolate Diesel side.",
            "That three-layer structure is the check. Fuel with nothing beneath it is a fuel hybrid, and there are dozens of those; fuel with cocoa and coffee behind it is the thing this name was built on. If a jar smells only of solvent, the Chocolate Diesel half is not showing.",
            "Growers usually report eight to nine weeks of bloom, with breeder-adjacent sources giving fifty-eight to sixty-three days. That is an ordinary schedule, which is part of why the plant spread so widely after its 2014 and 2015 competition results.",
          ],
        },
        {
          h2: "Placing it beside OG Kush and Sour Diesel",
          body: [
            "All three sit in the same aroma family, and a counter will often offer them as alternatives to one another. They are not interchangeable. OG Kush leads with lemon over its fuel; Sour Diesel is sharp and sour; GG4 is the heaviest and the most roasted of the three.",
            "The character is described as slow to arrive and weighted in the body, which is why it turns up as an evening suggestion rather than a daytime one. That is how people describe it and not a promise about how any particular evening will go.",
            "If you already know which of these three you prefer, you have a usable shorthand for any shelf in this city: ask for the roasted one, the sour one or the lemon one, and let whoever opened the jars this morning do the matching.",
          ],
        },
      ],
      faqTitle: "GG4: questions people actually ask",
      faq: [
        {
          q: "Why is the number 4 in the name?",
          a: "It marks which of the seedlings from that unplanned cross the breeders kept. The number is a selection index, not a rating of anything.",
        },
        {
          q: "Is it an indica or a sativa?",
          a: "It is usually given as a balanced hybrid, and the descriptions collected around it lean towards weight in the body rather than towards a racing head.",
        },
      ],
      disclaimerTitle: "The limits of this page",
      disclaimer:
        "This describes a cultivar and its documented history. It is not an offer, it names no price, no weight and nothing about what is on the shelf today, and it makes no claim that any plant treats or relieves anything. Sales here are in person, to adults of twenty and over, with the paperwork Thai rules require.",
    }),
    ru: withFacts("gorilla-glue-4", "ru", {
      thingName: "GG4",
      title: "GG4 (Original Glue): случайность, суд и аромат",
      description:
        "Как незапланированное опыление дало GG4, почему в 2018 году пришлось отказаться от названия Gorilla Glue и откуда под топливной нотой берётся какао с кофе.",
      h1: "GG4: сорт, который существует из-за ошибки",
      kicker: "Заметки о сорте",
      lead:
        "Почти каждый сорт в меню кто-то задумывал. Этот — нет. GG4 получился из растения-гермафродита, опылившего женское растение, до которого оно не должно было добраться, и гроверы оставили результат вместо того, чтобы его выбросить. Это и есть вся история происхождения, и для этой отрасли она задокументирована необычно подробно.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Опыление, которого никто не планировал",
          body: [
            "Растение Chem Sis, которое пишут и как Chem's Sister, выбросило мужские цветки и опылило женский Sour Dubb. Семена полагалось выбросить; вместо этого гроверы из GG Strains вырастили их, отобрали понравившийся сеянец и скрестили его дальше с Chocolate Diesel. Именно то, что вышло из второго шага, сегодня продаётся под тремя-четырьмя именами.",
            "Для чтения меню это важно вот чем: родословная здесь идёт от людей, которые сорт сделали, а не от каталога, восстановившего дерево задним числом. У большинства старых имён указанная родословная — это наилучшая догадка; у этого — рассказ с датами.",
            "Сенсорную работу делает Chocolate Diesel. Именно от него под растворителем стоит обжаренная нота, и именно поэтому настоящий нос Glue читается как кофе с какао, а не как просто топливо.",
          ],
        },
        {
          h2: "Почему имя на банке всё время меняется",
          body: [
            "Производитель одноимённого клея пошёл в суд в 2017 году. Урегулирование обязало селекционеров отказаться от названия Gorilla Glue и от всей обезьяньей символики к сентябрю 2018-го — отсюда GG4, Original Glue и просто Glue на одних и тех же шишках.",
            "То есть три ярлыка здесь — один сорт, и магазин, пишущий по-старому, не обязательно продаёт что-то другое. Знать это стоит именно потому, что обратный приём распространён: узнаваемое имя цепляют на материал, не имеющий к нему отношения.",
            "И само исходное название говорило не об ощущениях. Оно описывало ножницы для обрезки, намертво залипшие от смолы к сбору, — рабочая жалоба, ставшая брендом, а потом проблемой с товарным знаком.",
          ],
        },
        {
          h2: "Что выдаёт нос",
          body: [
            "Ведущим терпеном для этого растения называют бета-кариофиллен — это перечно-гвоздичная сторона спектра с сухим деревом, а не цитрусовая. Поверх неё стоит резкость растворителя, а под обеими — обжаренный хвост от линии Chocolate Diesel.",
            "Эта трёхслойность и есть проверка. Топливо, под которым ничего нет, — это топливный гибрид, и таких десятки; топливо, за которым стоят какао и кофе, — то, ради чего имя вообще появилось. Если банка пахнет одним растворителем, половина от Chocolate Diesel не проявилась.",
            "Гроверы обычно называют восемь-девять недель цветения, а источники, близкие к селекционерам, — пятьдесят восемь-шестьдесят три дня. Это обычный график, и он тоже объясняет, почему растение так широко разошлось после конкурсных результатов 2014 и 2015 годов.",
          ],
        },
        {
          h2: "Где он стоит рядом с OG Kush и Sour Diesel",
          body: [
            "Все трое живут в одной ароматической семье, и у прилавка их часто предлагают друг вместо друга. Взаимозаменяемыми они не являются. У OG Kush поверх топлива идёт лимон, Sour Diesel резкий и кислый, GG4 из трёх самый тяжёлый и самый обжаренный.",
            "Характер описывают как медленно разворачивающийся и с заметной тяжестью в теле — поэтому его чаще предлагают на вечер, чем на день. Это то, как о нём говорят, а не обещание, как пройдёт конкретный вечер.",
            "Если вы уже знаете, кто из этой тройки вам ближе, у вас есть рабочая формула для любой полки в городе: попросите обжаренный, кислый или лимонный — а подбор сделает тот, кто сегодня утром открывал банки.",
          ],
        },
      ],
      faqTitle: "GG4: что спрашивают на самом деле",
      faq: [
        {
          q: "GG4 и Gorilla Glue — это одно и то же?",
          a: "Да. Урегулирование 2017 года с производителем клея обязало селекционеров отказаться от имени Gorilla Glue и от обезьяньей символики к сентябрю 2018-го, поэтому тот же сорт теперь подписывают GG4 или Original Glue.",
        },
        {
          q: "Из чего скрещён GG4?",
          a: "Chem Sis, Sour Dubb и Chocolate Diesel. Гермафродитный Chem Sis, он же Chem's Sister, случайно опылил женский Sour Dubb, а результат скрестили дальше с Chocolate Diesel.",
        },
        {
          q: "Как должен пахнуть GG4?",
          a: "Сверху растворитель и химическая резкость, под ними влажная земля и хвоя, а в хвосте — обжаренные какао и кофе от линии Chocolate Diesel. Обжаренного слоя у обычных топливных гибридов нет.",
        },
        {
          q: "Откуда в названии четвёрка?",
          a: "Она обозначает, какой из сеянцев того случайного скрещивания селекционеры оставили. Это порядковый номер отбора, а не оценка чего бы то ни было.",
        },
        {
          q: "Это индика или сатива?",
          a: "Обычно его приводят как сбалансированный гибрид, а описания вокруг него склоняются к тяжести в теле, а не к разогнанной голове.",
        },
      ],
      disclaimerTitle: "Границы этой страницы",
      disclaimer:
        "Здесь описан сорт и его задокументированная история. Это не оферта: ни цены, ни веса, ни сведений о сегодняшней полке, ни утверждений, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "sour-diesel": {
    en: withFacts("sour-diesel", "en", {
      thingName: "Sour Diesel",
      title: "Sour Diesel strain: an unresolved pedigree and a sour nose",
      description:
        "Where Sour Diesel came from, why its second parent has never been settled, what separates its sour fuel from the heavier Kush fuel, and why eleven weeks of bloom matters.",
      h1: "Sour Diesel: the fuel note that is sharp rather than heavy",
      kicker: "Strain notes",
      lead:
        "Sour Diesel came out of the New York underground in the early 1990s, at a time and in a place where nobody was writing anything down. That is the reason its pedigree has never been closed, and it is also the reason the name spread: a plant with no owner travels faster than one with a breeder attached to it.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "A family tree with one branch missing",
          body: [
            "Every account of this cultivar puts Chemdawg 91 on one side. The other side is where they part company: some sources give Super Skunk, others a hybrid called DNL, and nobody has produced a record that decides between them. The catalogue entry on this site says so rather than picking a winner.",
            "That is not a small caveat. A parent determines what a plant smells like, and two candidate parents that disagree mean the descriptions circulating under this name were assembled from plants that may not be siblings at all.",
            "What survives across every version is the Chemdawg side, and Chemdawg is the ancestor of a large part of the modern fuel family. Reading Sour Diesel as one of two poles of that family — the other being OG Kush — is more useful than trying to fix its second parent.",
          ],
        },
        {
          h2: "Sour is not the same as heavy",
          body: [
            "The aroma is fuel with a distinctly acidic edge and a skunk backing, with citrus peel showing at the top of a good example. Compare it directly with OG Kush and the difference resolves in a second: OG is round and earthy under its lemon, this is thin, sharp and slightly vinegary.",
            "Terpene reports lead with beta-caryophyllene, limonene and myrcene, which is a fuel-and-citrus combination rather than a sweet one. Nothing about a correct Sour Diesel reads as candy, and a jar under this name that does has drifted.",
            "The character is usually described as clear-headed and conversational, and it is one of the few plants in the fuel family that gets suggested for daytime rather than evening. Descriptions are descriptions; batch, curing and the individual do the rest.",
          ],
        },
        {
          h2: "Ten to eleven weeks, and why that is a check",
          body: [
            "Growers usually report ten to eleven weeks of indoor bloom, which is long — two to three weeks longer than the Kush end of the same family. A long-flowering plant costs a grower a full extra cycle every year, so it gets grown less often than its fame suggests.",
            "This produces a specific, checkable mismatch: the name appears on far more menus than the plant can plausibly be on. Where a shop knows what it actually has, asking how long the batch took to finish is an ordinary question with a real answer.",
            "It also explains why so much of what circulates as Sour Diesel is a faster plant wearing the label. Speed is what a commercial grow room optimises for, and the name does not police itself.",
          ],
        },
        {
          h2: "Using it as a reference point",
          body: [
            "Of the three fuel names most often seen here, this is the one to try if heaviness is what puts you off the family. It has the same solvent register without the weight that GG4 and OG Kush carry underneath it.",
            "Against Bruce Banner, which pairs OG Kush with Strawberry Diesel, the difference is a berry top note: Banner has one, this does not. Against GG4 the difference is the roasted tail, which this does not have either.",
            "Say sharp and sour rather than the name, and a counter can work with that. Aroma survives translation and travel; a cultivar name from a 1990s underground does not.",
          ],
        },
      ],
      faqTitle: "Sour Diesel: common questions",
      faq: [
        {
          q: "How is it different from OG Kush?",
          a: "By nose, immediately. OG Kush is round and earthy under a lemon top; Sour Diesel is thin, acidic and skunky. Both are fuel, but one is heavy and one is sharp.",
        },
        {
          q: "Why is Sour Diesel less common than its reputation suggests?",
          a: "Ten to eleven weeks of bloom is long. A grower gives up part of a cycle to run it, so the name travels much further than the plant does.",
        },
        {
          q: "Is Sour Diesel a sativa?",
          a: "It is usually classed as sativa-leaning, and the descriptions around it are of a clear-headed, talkative daytime profile rather than a settling one.",
        },
        {
          q: "Who bred it?",
          a: "Nobody claims it. It emerged from the East Coast underground in the early 1990s without a breeder release, which is exactly why the pedigree stayed open.",
        },
      ],
      disclaimerTitle: "What this page does not do",
      disclaimer:
        "It describes a cultivar and states plainly where the record is incomplete. It is not an offer and not health advice: no price, no weight, no stock, and no suggestion that a plant treats or relieves any condition. Purchases happen in person, with adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("sour-diesel", "ru", {
      thingName: "Sour Diesel",
      title: "Сорт Sour Diesel: незакрытая родословная и кислый нос",
      description:
        "Откуда взялся Sour Diesel, почему второй родитель так и не установлен, чем его кислое топливо отличается от тяжёлого кушевого и о чём говорят одиннадцать недель цветения.",
      h1: "Sour Diesel: топливная нота, которая резкая, а не тяжёлая",
      kicker: "Заметки о сорте",
      lead:
        "Sour Diesel вышел из нью-йоркского андерграунда начала девяностых — в то время и в том месте, где никто ничего не записывал. Отсюда и незакрытая родословная, и стремительное распространение имени: растение без владельца путешествует быстрее, чем растение с приписанным селекционером.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Родословная, в которой не хватает одной ветки",
          body: [
            "С одной стороны во всех версиях стоит Chemdawg 91. Расходятся версии со второй: где-то называют Super Skunk, где-то гибрид под именем DNL, и записи, которая выбрала бы между ними, никто не предъявил. В наборе данных этого сайта так и написано — вместо того чтобы назначить победителя.",
            "Оговорка не мелкая. Родитель определяет запах, а два несогласных кандидата означают, что описания, ходящие под этим именем, собраны с растений, которые могут и не быть роднёй.",
            "Через все версии проходит сторона Chemdawg, а Chemdawg — предок значительной части современного топливного семейства. Читать Sour Diesel как один из двух полюсов этого семейства (второй — OG Kush) полезнее, чем пытаться доназначить второго родителя.",
          ],
        },
        {
          h2: "Кислый — не то же самое, что тяжёлый",
          body: [
            "Аромат — топливо с отчётливо кислым краем и скунсовой подложкой, а у хорошего образца сверху проступает цитрусовая корка. Сравните напрямую с OG Kush, и разница снимается за секунду: OG под своим лимоном круглый и землистый, этот — тонкий, резкий, чуть уксусный.",
            "В терпеновых отчётах первыми идут бета-кариофиллен, лимонен и мирцен: сочетание топлива с цитрусом, а не со сладостью. В правильном Sour Diesel нет ничего карамельного, и банка под этим именем, которая пахнет карамелью, ушла в сторону.",
            "Характер обычно описывают как ясный и разговорный — это одно из немногих растений топливной семьи, которое предлагают на день, а не на вечер. Описание остаётся описанием: остальное делают партия, вылёживание и сам человек.",
          ],
        },
        {
          h2: "Десять-одиннадцать недель — и почему это проверка",
          body: [
            "Гроверы обычно называют десять-одиннадцать недель цветения в помещении. Это долго — на две-три недели дольше, чем у кушевого края той же семьи. Долгоцветущее растение стоит гроверу лишнего цикла в год, поэтому его выращивают реже, чем можно подумать по известности имени.",
            "Отсюда конкретное и проверяемое несоответствие: имя стоит в куда большем числе меню, чем растение физически может там оказаться. Там, где магазин знает, что у него на полке, вопрос «сколько эта партия доходила» — обычный вопрос с настоящим ответом.",
            "Этим же объясняется, почему многое из ходящего под именем Sour Diesel — более быстрое растение с чужим ярлыком. Скорость — то, подо что оптимизируют коммерческую гроубоксу, а название само себя не охраняет.",
          ],
        },
        {
          h2: "Как пользоваться им как точкой отсчёта",
          body: [
            "Из трёх топливных имён, которые здесь встречаются чаще всего, это то, которое стоит попробовать, если от семьи отталкивает именно тяжесть. Регистр растворителя тот же, а веса, который несут под собой GG4 и OG Kush, нет.",
            "Против Bruce Banner, где OG Kush соединён со Strawberry Diesel, разница — в ягодной верхней ноте: у Banner она есть, здесь её нет. Против GG4 разница — в обжаренном хвосте, которого здесь тоже нет.",
            "Говорите «резкое и кислое» вместо названия, и у прилавка с этим смогут работать. Аромат переживает перевод и переезд; название сорта из андерграунда девяностых — нет.",
          ],
        },
      ],
      faqTitle: "Sour Diesel: частые вопросы",
      faq: [
        {
          q: "Кто родители Sour Diesel?",
          a: "Chemdawg 91 стоит во всех версиях. Вторым родителем в одних источниках называют Super Skunk, в других — гибрид DNL, и записи, которая это решает, нет.",
        },
        {
          q: "Чем он отличается от OG Kush?",
          a: "Носом, сразу. OG Kush под лимонной верхушкой круглый и землистый; Sour Diesel тонкий, кислый и скунсовый. Топливо и там и там, но одно тяжёлое, другое резкое.",
        },
        {
          q: "Почему он встречается реже, чем можно ждать по известности?",
          a: "Десять-одиннадцать недель цветения — это долго. Гровер отдаёт под него часть годового цикла, поэтому имя расходится намного дальше, чем растение.",
        },
        {
          q: "Sour Diesel — это сатива?",
          a: "Его обычно относят к гибридам с сативным креном, а описания вокруг него — про ясный и разговорный дневной профиль, а не про оседание.",
        },
        {
          q: "Кто его вывел?",
          a: "Никто на него не претендует. Он появился в андерграунде восточного побережья США в начале девяностых без релиза от селекционера — потому родословная и осталась открытой.",
        },
      ],
      disclaimerTitle: "Чего эта страница не делает",
      disclaimer:
        "Она описывает сорт и прямо говорит, где запись неполна. Это не оферта и не медицинский совет: ни цены, ни веса, ни наличия, ни намёка на то, что растение что-то лечит или облегчает. Покупка — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "bruce-banner": {
    en: withFacts("bruce-banner", "en", {
      thingName: "Bruce Banner",
      title: "Bruce Banner strain: berry over fuel, and why the number matters",
      description:
        "A name borrowed from a comic book, a cross of OG Kush with Strawberry Diesel, and a cultivar where the phenotype number tells you more than the label does.",
      h1: "Bruce Banner: a name that describes nothing about the plant",
      kicker: "Strain notes",
      lead:
        "White Widow is named for its resin, Purple Punch for its colour and its fruit, Wedding Cake for what it smells like. Bruce Banner is named after a comic-book character, and that is worth saying out loud on the page: the name here carries no botanical information at all, and everything useful has to come from somewhere else.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Where the berry comes from",
          body: [
            "The cross is OG Kush with Strawberry Diesel. That pairing is the entire identity of the plant: OG Kush supplies the fuel and the earthy floor, Strawberry Diesel puts a berry note over the top of it, and the tension between the two is what people are describing when they describe this cultivar.",
            "It is a useful thing to be able to check by nose. Fuel with a fruit lift is the shape; fuel with no fruit is more likely a straightforward Kush, and fruit with no fuel underneath is a dessert or candy plant that has picked up the wrong label.",
            "Reports of the release date differ by several years across sources, so the catalogue entry treats the origin as disputed. What is not disputed is the parentage, and the parentage is the part that shows up in the jar.",
          ],
        },
        {
          h2: "The number does the work the name does not",
          body: [
            "Bruce Banner #3 is the selection that made the name. Other numbered phenotypes exist and they are not the same plant: they came from the same seed line but were chosen for different traits, and they do not smell identical.",
            "So a jar labelled only Bruce Banner has told you which family it belongs to and nothing about which member. This is not unique to this cultivar — Gelato and Northern Lights have the same problem — but it is more acute here because the name itself contains no description to fall back on.",
            "Where a shop can tell you which phenotype it is, that is a sign the batch was bought with attention. Where it cannot, judge the jar rather than the label, which is good practice regardless of what is written on the lid.",
          ],
        },
        {
          h2: "What people report, and what stays unknown",
          body: [
            "Descriptions collected around this plant point to a clear-headed daytime profile with noticeable weight arriving later — a combination that comes straight from having a Kush parent and a diesel-fruit parent. Growers usually report eight to ten weeks of bloom, which is a wide window and reflects the phenotype split.",
            "None of that is a promise. How any flower reads depends on the person, the batch, how it was grown and cured, and what else the day held. This page describes a cultivar; it cannot describe your afternoon.",
            "Myrcene leads the terpene reports here, with beta-caryophyllene and limonene behind it — the same three that lead in half this family. The difference between family members is in the proportions and in the aroma descriptors, not in the list.",
          ],
        },
        {
          h2: "Where to place it on a shelf",
          body: [
            "Its nearest neighbours here are Sour Diesel and OG Kush, and the sorting question is simple: do you want the berry on top or not. Sour Diesel is the sour, unfruited version of the same register; OG Kush is the lemon-and-earth version; this is the berry one.",
            "Against GG4 the contrast is sharper still, because GG4's extra layer is roasted rather than fruity. Someone who likes Banner often does not like Glue, and the reason is usually that one layer over the fuel is sweet and the other is bitter.",
            "If a name means nothing, describe the shape instead: gas underneath, berry on top. That sentence works at any counter in this city, and it does not depend on anyone agreeing about a comic book.",
          ],
        },
      ],
      faqTitle: "Bruce Banner: questions worth asking",
      faq: [
        {
          q: "What does the #3 mean?",
          a: "It identifies a specific numbered phenotype from the seed line — the one that made the name. Other numbers exist and are different plants with different aromas.",
        },
        {
          q: "Does the name tell me anything about the plant?",
          a: "No. It is a comic-book reference chosen for marketing. Unlike White Widow or Purple Punch, whose names describe something visible, this one describes nothing.",
        },
        {
          q: "How long does it take to flower?",
          a: "Growers usually report eight to ten weeks indoors. The width of that range is the phenotype split showing up in the schedule.",
        },
        {
          q: "Is it closer to a sativa or an indica?",
          a: "It is usually classed as sativa-leaning, though the descriptions collected around it mention weight in the body as well as a clear-headed start.",
        },
      ],
      disclaimerTitle: "What this is and is not",
      disclaimer:
        "A description of a cultivar, written from published accounts and marked where those accounts disagree. Not an offer, not a stock list and not health advice: no price, no weight, no claim about treating anything. Sales are in person to adults of twenty and over holding what Thai rules require.",
    }),
    ru: withFacts("bruce-banner", "ru", {
      thingName: "Bruce Banner",
      title: "Сорт Bruce Banner: ягода поверх топлива и важность номера",
      description:
        "Имя, взятое из комикса, скрещивание OG Kush со Strawberry Diesel и сорт, у которого номер фенотипа говорит больше, чем сама этикетка.",
      h1: "Bruce Banner: название, которое не описывает растение",
      kicker: "Заметки о сорте",
      lead:
        "White Widow назван по смоле, Purple Punch — по цвету и фрукту, Wedding Cake — по запаху. Bruce Banner назван в честь персонажа комикса, и это стоит проговорить прямо: ботанической информации в этом имени нет вовсе, и всё полезное приходится брать из другого места.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Откуда берётся ягода",
          body: [
            "Скрещивание — OG Kush со Strawberry Diesel. Эта пара и есть вся личность растения: OG Kush даёт топливо и землистый пол, Strawberry Diesel кладёт поверх ягодную ноту, а напряжение между ними — это то, что описывают, когда описывают этот сорт.",
            "Проверить по носу удобно. Форма — топливо с фруктовым подъёмом; топливо без фрукта — скорее прямолинейный куш, а фрукт без топлива под ним — десертное или карамельное растение, подобравшее чужой ярлык.",
            "Даты релиза в источниках расходятся на несколько лет, поэтому в наборе данных происхождение помечено как спорное. Не спорна родословная — а именно она и проявляется в банке.",
          ],
        },
        {
          h2: "Номер делает работу, которую не делает имя",
          body: [
            "Имя сделал отбор Bruce Banner #3. Другие пронумерованные фенотипы существуют, и это не то же самое растение: они из той же семенной линии, но отобраны по другим признакам и пахнут иначе.",
            "Значит, банка, подписанная просто Bruce Banner, сообщила семью и не сообщила члена семьи. Так бывает не только здесь — та же беда у Gelato и Northern Lights, — но здесь она острее, потому что в самом имени нет описания, на которое можно опереться.",
            "Если в магазине могут назвать фенотип, это признак того, что партию покупали внимательно. Если не могут — судите по банке, а не по ярлыку; впрочем, это хорошая привычка независимо от того, что написано на крышке.",
          ],
        },
        {
          h2: "Что описывают люди и что остаётся неизвестным",
          body: [
            "Описания вокруг этого растения сходятся на ясном дневном профиле с заметной тяжестью, приходящей позже, — комбинация ровно из того, что один родитель кушевый, а второй дизельно-фруктовый. Гроверы обычно называют восемь-десять недель цветения; окно широкое, и в нём видна разница фенотипов.",
            "Обещанием это не является. Как читается любой цветок, зависит от человека, партии, того, как растили и вылёживали, и от того, что ещё было в этом дне. Страница описывает сорт, а не ваш вечер.",
            "В терпеновых отчётах здесь первым идёт мирцен, за ним бета-кариофиллен и лимонен — те же три, что возглавляют половину этой семьи. Отличаются члены семьи пропорциями и ароматическими дескрипторами, а не списком.",
          ],
        },
        {
          h2: "Куда его ставить на полке",
          body: [
            "Ближайшие соседи здесь — Sour Diesel и OG Kush, и сортирующий вопрос простой: нужна ли вам ягода сверху. Sour Diesel — кислая, безфруктовая версия того же регистра; OG Kush — лимонно-землистая; этот — ягодная.",
            "Против GG4 контраст ещё резче, потому что дополнительный слой у GG4 обжаренный, а не фруктовый. Тот, кому нравится Banner, часто не любит Glue, и причина обычно в том, что один слой поверх топлива сладкий, а другой горький.",
            "Если имя не значит ничего — опишите форму: газ снизу, ягода сверху. Эта фраза работает у любого прилавка в городе и не требует, чтобы кто-то был согласен насчёт комикса.",
          ],
        },
      ],
      faqTitle: "Bruce Banner: о чём стоит спросить",
      faq: [
        {
          q: "Из чего скрещён Bruce Banner?",
          a: "Обычно указывают OG Kush и Strawberry Diesel. Кушевая сторона даёт топливо и землю, сторона Strawberry Diesel — ягодную ноту поверх.",
        },
        {
          q: "Что означает #3?",
          a: "Это конкретный пронумерованный фенотип из семенной линии — тот, который сделал имя. Другие номера существуют и представляют собой другие растения с другим ароматом.",
        },
        {
          q: "Говорит ли название что-нибудь о растении?",
          a: "Нет. Это отсылка к комиксу, выбранная для маркетинга. В отличие от White Widow или Purple Punch, чьи имена описывают видимое, это не описывает ничего.",
        },
        {
          q: "Сколько он цветёт?",
          a: "Гроверы обычно называют восемь-десять недель в помещении. Ширина диапазона — это разница фенотипов, проступившая в графике.",
        },
        {
          q: "Он ближе к сативе или к индике?",
          a: "Его обычно относят к гибридам с сативным креном, хотя в описаниях рядом с ясным началом упоминают и тяжесть в теле.",
        },
      ],
      disclaimerTitle: "Что это такое и чем это не является",
      disclaimer:
        "Описание сорта, составленное по опубликованным версиям и помеченное там, где версии расходятся. Не оферта, не список наличия и не медицинский совет: ни цены, ни веса, ни утверждений о лечении. Отпуск — лично, взрослым от двадцати лет, с тем, чего требуют тайские правила.",
    }),
  },

  "ak-47": {
    en: withFacts("ak-47", "en", {
      thingName: "AK-47",
      title: "AK-47 strain: four landraces, one of them Thai",
      description:
        "A 1992 Serious Seeds release built from Colombian, Mexican, Thai and Afghani stock — what the breeder documented, what he never published, and why the Thai part matters here.",
      h1: "AK-47: four regions of ancestry, met in one of them",
      kicker: "Strain notes",
      lead:
        "Most of the names on this list descend from a handful of Dutch and Californian plants. This one goes back further and wider: the breeder built it from seed stock out of Colombia, Mexico, Thailand and Afghanistan, and released it in 1992. Reading about it in Thailand is a slightly odd experience, because one quarter of its ancestry is from here.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Documented composition, undocumented crossing",
          body: [
            "Serious Seeds states which four regions the parent material came from. What has never been published is how those four were combined — which was crossed onto which, in what order, over how many generations. So the composition is documented and the pedigree is not, and the catalogue entry on this site marks exactly that distinction.",
            "This is a more honest position than most strain pages take. It is common to see a neat four-way cross drawn as though somebody had the breeding notes; nobody does, and inventing the diagram would add nothing except false confidence.",
            "What can be said is that three of the four ancestral regions are equatorial and one is mountain indica. Equatorial plants flower long; the Afghani component is what pulls the finish back to nine or ten weeks and makes the plant practical to grow.",
          ],
        },
        {
          h2: "The Thai quarter",
          body: [
            "Thai landrace material sits in the ancestry of very few internationally known cultivars, and this is one of them. On a page written in Pattaya that is worth pausing on: a plant assembled in the Netherlands from four continents' worth of seed carries genetics that came from this country before the industry that now names strains existed at all.",
            "It also explains a little of the aroma. The profile is earthy and skunky with dry wood and a citrus-peel edge — not the sweet fruit of the modern dessert families, and not the incense-and-lemon of the Haze line either. It sits in its own corner, which is why it appears as its own aroma family in the list.",
            "Nothing about that ancestry makes the plant local. Thai landraces and a Dutch-bred hybrid built partly from them are different things, and a jar sold here is a jar of what somebody grew here, under this climate, this season.",
          ],
        },
        {
          h2: "What we repeat and what we do not",
          body: [
            "The breeder claims more than two dozen competition placements for this line over three decades. That is the breeder's own count, published on the breeder's own site, and this page does not repeat it as an independent fact — which is why the facts block above lists no competition results for it while listing them for plants where an outside record exists.",
            "The classification is documented rather than merely repeated: the breeder describes the ratio himself. That is the strongest form of evidence available for this kind of claim, and it is still a claim by an interested party.",
            "Where a fact is only as good as the person asserting it, this cluster says so. Confidence marks in the table above are printed for the reader, not kept in the source code.",
          ],
        },
        {
          h2: "Reading it beside White Widow and Jack Herer",
          body: [
            "White Widow is the closest comparison and the pairing is instructive: both are early-1990s Dutch work, both sit near the middle, and both have landraces rather than named cultivars as parents. The split is aromatic — White Widow is pine and pepper, this is earth, skunk and wood.",
            "Jack Herer, from the same decade and country, went the other way entirely: terpinolene and pine, bright and resinous. Someone who finds AK-47 too earthy usually gets on with Jack Herer, and the reverse holds too.",
            "The character here is described as sitting in the middle and being conversational rather than introspective. Like everything else in this section that is a description of how people talk about the plant, not a forecast of what it will do.",
          ],
        },
      ],
      faqTitle: "AK-47: common questions",
      faq: [
        {
          q: "What is AK-47 made from?",
          a: "Seed stock from four regions: Colombia, Mexico, Thailand and Afghanistan. The breeder documented the composition but never published how the four were crossed.",
        },
        {
          q: "When was it released?",
          a: "In 1992 by Serious Seeds, after several years of selection.",
        },
        {
          q: "What does it smell like?",
          a: "Damp earth and skunk with dry wood behind it and a citrus-peel edge. It is neither a dessert profile nor a haze profile, which is why it stands slightly apart from the rest of this list.",
        },
      ],
      disclaimerTitle: "The boundaries of this page",
      disclaimer:
        "A description of a cultivar and of how firmly each claim about it stands. It is not an offer and not medical guidance: nothing here states a price, a weight, what is on the shelf, or that any plant treats a condition. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("ak-47", "ru", {
      thingName: "AK-47",
      title: "Сорт AK-47: четыре ландрейса, один из них тайский",
      description:
        "Релиз Serious Seeds 1992 года на колумбийском, мексиканском, тайском и афганском материале: что селекционер задокументировал, чего не опубликовал и почему тайская часть важна именно здесь.",
      h1: "AK-47: четыре региона в предках, встреча в одном из них",
      kicker: "Заметки о сорте",
      lead:
        "Большинство имён в этом списке происходят от горстки голландских и калифорнийских растений. Это уходит дальше и шире: селекционер собрал его из семенного материала Колумбии, Мексики, Таиланда и Афганистана и выпустил в 1992 году. Читать о нём в Таиланде немного странно — четверть его происхождения отсюда.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Состав задокументирован, схема скрещивания — нет",
          body: [
            "Serious Seeds называет четыре региона, откуда взят родительский материал. Не опубликовано другое: как именно эти четыре соединяли — что на что скрещивали, в каком порядке, через сколько поколений. То есть состав задокументирован, а родословная нет, и в наборе данных этого сайта различие помечено именно так.",
            "Позиция более честная, чем на большинстве страниц о сортах. Аккуратную четырёхстороннюю схему часто рисуют так, будто у кого-то есть селекционные записи; их нет, и придуманная диаграмма добавила бы только ложную уверенность.",
            "Сказать можно вот что: три из четырёх регионов экваториальные, а один — горная индика. Экваториальные растения цветут долго; афганская составляющая — то, что стягивает финиш к девяти-десяти неделям и делает растение пригодным для выращивания.",
          ],
        },
        {
          h2: "Тайская четверть",
          body: [
            "Тайский ландрейс стоит в предках очень немногих международно известных сортов, и это один из них. На странице, написанной в Паттайе, на этом стоит остановиться: растение, собранное в Нидерландах из семян с четырёх континентов, несёт генетику, уехавшую отсюда раньше, чем вообще появилась индустрия, дающая сортам имена.",
            "Этим отчасти объясняется и аромат. Профиль землистый и скунсовый, с сухим деревом и краем цитрусовой корки, — не сладкий фрукт современных десертных семейств и не лимон с благовониями хейзовой линии. Он стоит в собственном углу, поэтому в списке у него и своя ароматическая семья.",
            "Местным растение от этого не становится. Тайские ландрейсы и голландский гибрид, частично на них построенный, — разные вещи, а банка, купленная здесь, — это банка того, что кто-то вырастил здесь, в этом климате и в этом сезоне.",
          ],
        },
        {
          h2: "Что мы повторяем, а что нет",
          body: [
            "Селекционер заявляет для этой линии больше двух десятков конкурсных мест за три десятилетия. Это его собственный счёт, опубликованный на его же сайте, и страница не повторяет его как независимый факт — поэтому в таблице выше у этого сорта конкурсных результатов нет, хотя у растений с внешней записью они перечислены.",
            "А вот классификация здесь именно задокументирована, а не просто повторена: соотношение описывает сам селекционер. Это самая сильная форма свидетельства, доступная для такого утверждения, — и всё равно утверждение заинтересованной стороны.",
            "Там, где факт стоит ровно столько, сколько тот, кто его утверждает, кластер говорит об этом прямо. Пометки доверия в таблице напечатаны для читателя, а не спрятаны в исходном коде.",
          ],
        },
        {
          h2: "Как читать его рядом с White Widow и Jack Herer",
          body: [
            "Ближайшее сравнение — White Widow, и пара поучительная: обе работы голландские и начала девяностых, обе держатся ближе к середине, у обеих в родителях ландрейсы, а не именованные сорта. Расходятся они по аромату: White Widow — хвоя и перец, этот — земля, скунс и дерево.",
            "Jack Herer из того же десятилетия и той же страны ушёл в противоположную сторону: терпинолен и сосна, светло и смолисто. Тому, кому AK-47 кажется слишком землистым, обычно подходит Jack Herer, и наоборот.",
            "Характер здесь описывают как держащийся посередине и скорее разговорный, чем погружающий в себя. Как и всё остальное в этом разделе, это описание того, как о растении говорят, а не прогноз того, что оно сделает.",
          ],
        },
      ],
      faqTitle: "AK-47: частые вопросы",
      faq: [
        {
          q: "Из чего сделан AK-47?",
          a: "Из семенного материала четырёх регионов: Колумбия, Мексика, Таиланд, Афганистан. Селекционер задокументировал состав, но не опубликовал, как именно эти четыре скрещивали.",
        },
        {
          q: "У него правда есть тайские предки?",
          a: "Да, по собственному описанию селекционера: это один из очень немногих международно известных сортов с задокументированным тайским ландрейсом.",
        },
        {
          q: "Когда он вышел?",
          a: "В 1992 году у Serious Seeds, после нескольких лет отбора.",
        },
        {
          q: "Как он пахнет?",
          a: "Влажная земля и скунс, за ними сухое дерево и край цитрусовой корки. Это ни десертный, ни хейзовый профиль — поэтому он стоит немного в стороне от остального списка.",
        },
        {
          q: "Почему в таблице фактов нет конкурсных результатов?",
          a: "Потому что обычно приводимые места идут из собственного счёта селекционера. Этот кластер перечисляет конкурсные результаты только там, где есть внешняя запись.",
        },
      ],
      disclaimerTitle: "Границы этой страницы",
      disclaimer:
        "Описание сорта и того, насколько твёрдо стоит каждое утверждение о нём. Это не оферта и не медицинское руководство: здесь нет ни цены, ни веса, ни сведений о полке, ни утверждения, что растение что-то лечит. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },

  "northern-lights": {
    en: withFacts("northern-lights", "en", {
      thingName: "Northern Lights",
      title: "Northern Lights strain: the short bloom that changed growing",
      description:
        "Selected from Afghani seed near Seattle in the 1970s, stabilised in the Netherlands, and finishing in six to seven weeks — why that number made indoor cultivation practical.",
      h1: "Northern Lights: six weeks, and what that made possible",
      kicker: "Strain notes",
      lead:
        "This is one of the three plants Dutch breeding was built on, alongside Haze and Skunk #1, and a large share of everything else described in this cluster has it somewhere upstream. Its historical importance is not aromatic. It is a number: six to seven weeks of bloom, at a time when that was extraordinary.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Seattle, then Amsterdam",
          body: [
            "The line was selected from Afghani seed near Seattle in the 1970s by a grower known as The Indian. Neville Schoenmakers took material to the Netherlands in 1985 and stabilised it there, and Sensi Seeds has carried the lines since the early 1990s. That chain of custody is unusually traceable for a plant of this age.",
            "Thai material was introduced into some of the crosses during the Dutch stabilisation, which is why not every Northern Lights is equally short and equally heavy. The name covers a range rather than a single fixed plant, and the numbered selection NL#5 is the one most competition results attach to.",
            "The 1989 and 1990 Cannabis Cup results belong to that period. They matter less as accolades than as a marker of when this plant stopped being a regional curiosity and became infrastructure for everybody else's breeding.",
          ],
        },
        {
          h2: "Why forty-five days changed the economics",
          body: [
            "About forty-five to fifty days indoors is one of the shortest blooms among the classics. Set that against the ten to eleven weeks a Haze or a Sour Diesel needs and the consequence is arithmetic: the same room produces noticeably more cycles a year.",
            "That is the reason this plant is upstream of so much else. Breeders crossed it into long-flowering sativa lines specifically to pull the finish forward, and Super Silver Haze and Jack Herer are both direct results of that strategy.",
            "It also explains why the name survives on menus where the plant itself is rare. A cultivar that made other cultivars possible gets remembered by name long after the shelf has moved on to its descendants.",
          ],
        },
        {
          h2: "A deliberately plain aroma",
          body: [
            "Damp earth, pine, a hash-like depth and black pepper. There is no fruit here, no dessert note, nothing candied — the entire vocabulary the last decade added to this trade is absent, and that absence is the most useful thing about it.",
            "Myrcene leads the reported terpenes, with beta-caryophyllene and alpha-pinene behind. That is the same skeleton as White Widow, and the two are worth smelling side by side: White Widow is brighter and drier, this is deeper and closer to hash.",
            "If you want to know what cannabis smelled like before fruit became the selling point, this is the reference. It is also the plainest possible baseline for judging whether a sweet-smelling jar is genuinely sweet or merely being sold that way.",
          ],
        },
        {
          h2: "Who it suits as a comparison",
          body: [
            "Its neighbours in this cluster are Granddaddy Purple and Purple Punch, both of which are heavier on the fruit side, and White Widow, which shares the pine-and-earth family. Against the purples, the contrast is grape and berry against earth and hash.",
            "The character is described as an evening profile with weight in the body and a settled, unhurried feel. That description has been stable for four decades, which is worth something — though it remains a description of how people talk, not a guarantee.",
            "Ask for something plain and earthy at a counter and this is the shape you are asking for. It is also the least likely name on this list to be attached to something it is not, because there is no marketing advantage in claiming it.",
          ],
        },
      ],
      faqTitle: "Northern Lights: common questions",
      faq: [
        {
          q: "Is Northern Lights pure indica?",
          a: "It is usually classed as indica, and its base is Afghani, but Thai material went into some of the crosses during the Dutch work, so not every version is equally short and heavy.",
        },
        {
          q: "What does it smell like?",
          a: "Damp earth, pine, hash-like depth and black pepper. No fruit and no sweetness, which is exactly what makes it a useful baseline.",
        },
      ],
      disclaimerTitle: "Scope of this page",
      disclaimer:
        "A description of a cultivar and of the history that made it matter. Not an offer, not a stock statement and not health advice: no price, no weight, no claim that any plant treats or relieves anything. Sales are in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("northern-lights", "ru", {
      thingName: "Northern Lights",
      title: "Сорт Northern Lights: короткое цветение, изменившее выращивание",
      description:
        "Отобран из афганских семян под Сиэтлом в семидесятые, стабилизирован в Нидерландах, доходит за шесть-семь недель — почему именно это число сделало индор практичным.",
      h1: "Northern Lights: шесть недель и то, что они сделали возможным",
      kicker: "Заметки о сорте",
      lead:
        "Это одно из трёх растений, на которых стоит голландская селекция, наряду с Haze и Skunk #1, и значительная часть всего остального в этом кластере имеет его где-то выше по родословной. Историческая важность у него не ароматическая. Она числовая: шесть-семь недель цветения тогда, когда это было чем-то исключительным.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Сиэтл, потом Амстердам",
          body: [
            "Линию отобрали из афганских семян под Сиэтлом в семидесятые; гровера знали как The Indian. Невилл Схунмакерс в 1985 году вывез материал в Нидерланды и стабилизировал его там, а с начала девяностых линии ведёт Sensi Seeds. Для растения такого возраста эта цепочка прослеживается необычно хорошо.",
            "Во время голландской стабилизации в часть скрещиваний вошёл тайский материал — поэтому не всякий Northern Lights одинаково короток и одинаково тяжёл. Имя покрывает диапазон, а не одно закреплённое растение, и большинство конкурсных результатов относится к пронумерованному отбору NL#5.",
            "Результаты Cannabis Cup 1989 и 1990 годов принадлежат тому же периоду. Важны они не как награды, а как отметка момента, когда растение перестало быть региональной диковиной и стало инфраструктурой для чужой селекции.",
          ],
        },
        {
          h2: "Почему сорок пять дней изменили экономику",
          body: [
            "Примерно сорок пять-пятьдесят дней в помещении — одно из самых коротких цветений среди классики. Поставьте рядом десять-одиннадцать недель, нужные хейзу или Sour Diesel, и следствие превращается в арифметику: та же комната даёт заметно больше циклов в год.",
            "Отсюда и то, что растение стоит выше по родословной у стольких других. Селекционеры вводили его в долгоцветущие сативные линии именно затем, чтобы подтянуть финиш, и Super Silver Haze с Jack Herer — прямые результаты этой стратегии.",
            "Этим же объясняется, почему имя держится в меню там, где само растение редкость. Сорт, сделавший возможными другие сорта, помнят по имени долго после того, как полка перешла к его потомкам.",
          ],
        },
        {
          h2: "Намеренно простой аромат",
          body: [
            "Влажная земля, хвоя, гашишная глубина и чёрный перец. Ни фрукта, ни десертной ноты, ни карамели — весь словарь, который последнее десятилетие добавило в эту отрасль, здесь отсутствует, и это отсутствие в нём самое полезное.",
            "В отчётах первым идёт мирцен, за ним бета-кариофиллен и альфа-пинен. Скелет тот же, что у White Widow, и эти два стоит понюхать рядом: White Widow светлее и суше, этот глубже и ближе к гашишу.",
            "Если вам интересно, как каннабис пах до того, как продавать начали фрукт, — вот эталон. Он же самая простая база для проверки, действительно ли сладко пахнущая банка сладкая или её просто так продают.",
          ],
        },
        {
          h2: "Кому он годится как сравнение",
          body: [
            "Соседи по кластеру — Granddaddy Purple и Purple Punch, оба заметно фруктовее, и White Widow, с которой они делят сосново-землистую семью. Против пурпурных контраст такой: виноград и ягода против земли и гашиша.",
            "Характер описывают как вечерний профиль с тяжестью в теле и спокойной, неторопливой телесностью. Это описание стабильно четвёртое десятилетие, и это чего-то стоит — но остаётся описанием того, как говорят, а не гарантией.",
            "Попросите у прилавка что-нибудь простое и землистое — вы просите именно эту форму. И это же наименее вероятное имя из списка, которым подпишут что-то другое: выдавать чужое за него маркетингово невыгодно.",
          ],
        },
      ],
      faqTitle: "Northern Lights: частые вопросы",
      faq: [
        {
          q: "Сколько цветёт Northern Lights?",
          a: "Примерно шесть-семь недель в помещении, то есть около сорока пяти-пятидесяти дней, — одно из самых коротких цветений среди классических сортов.",
        },
        {
          q: "Откуда он взялся?",
          a: "Отобран из афганских семян под Сиэтлом в семидесятые, в 1985 году вывезен Невиллом Схунмакерсом в Нидерланды и стабилизирован там; с начала девяностых линии ведёт Sensi Seeds.",
        },
        {
          q: "Northern Lights — чистая индика?",
          a: "Его обычно относят к индике, база у него афганская, но в часть скрещиваний во время голландской работы вошёл тайский материал, поэтому не всякая версия одинаково коротка и тяжела.",
        },
        {
          q: "Что такое NL#5?",
          a: "Пронумерованный отбор из линии — тот, к которому относится большинство конкурсных результатов. Банка, подписанная просто Northern Lights, не сообщает, какой это отбор.",
        },
        {
          q: "Как он пахнет?",
          a: "Влажная земля, хвоя, гашишная глубина и чёрный перец. Ни фрукта, ни сладости — именно поэтому он удобен как базовая точка.",
        },
      ],
      disclaimerTitle: "Область этой страницы",
      disclaimer:
        "Описание сорта и истории, которая сделала его значимым. Не оферта, не сообщение о наличии и не медицинский совет: ни цены, ни веса, ни утверждения, что растение что-то лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },
};
