import type { Locale } from "@/lib/i18n";
import type { CopySection, FaqItem } from "@/data/visit-copy";

/**
 * Описательные страницы сортов (T-11).
 *
 * Кластер длинного хвоста, в котором первое место берётся текстом: чистый сорт
 * держат Leafly и Weedmaps, связку «сорт + город» — продуктовые URL с ценой и
 * наличием, а между ними пусто. Мы пишем описание, которое НЕ является ни тем,
 * ни другим: происхождение, аромат, на что похоже, с чем сравнить и чего от
 * названия ждать не стоит.
 *
 * ЗАПРЕЩЕНО в этом файле, и это проверяет линтер:
 * • аббревиатуры каннабиноидов и любые проценты содержания — эти правила сняты
 *   только на правовом гиде;
 * • цена, вес, «в наличии», «всегда свежий» — наличие это оферта, а не описание;
 * • медицинские обещания и обороты «помогает от»;
 * • оценочный регистр («лучший», «отборный», «высочайшего качества»).
 *
 * Разметка страницы — `Article` + `about: {"@type": "Thing"}`; ни `Product`, ни
 * `Offer`, ни `aggregateRating` (см. `JsonLd.astro`).
 */
export interface StrainFact {
  label: string;
  value: string;
}

export interface StrainPageCopy {
  /** Имя сорта как имя объекта в разметке `about`. */
  thingName: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  lead: string;
  factsTitle: string;
  facts: StrainFact[];
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
  disclaimerTitle: string;
  disclaimer: string;
}

export type StrainPages = Record<string, Partial<Record<Locale, StrainPageCopy>>>;

export const STRAIN_PAGES: StrainPages = {
  "white-widow": {
    en: {
      thingName: "White Widow",
      title: "White Widow strain: origin, aroma and character | Pattaya",
      description:
        "What White Widow actually is: a 1990s Dutch hybrid, where the name comes from, how it smells, what it looks like and what to compare it against on a Pattaya shelf.",
      h1: "White Widow: what the name actually describes",
      kicker: "Strain notes",
      lead:
        "White Widow is one of the few names in this trade that has survived thirty years without being invented twice a season, which is exactly why it turns up on almost every menu in Pattaya. That ubiquity is also the problem: the name tells you a great deal about a plant bred in the Netherlands in the 1990s and much less about the jar in front of you today.",
      factsTitle: "At a glance",
      facts: [
        { label: "Type", value: "Balanced hybrid" },
        { label: "Bred", value: "Netherlands, early 1990s" },
        { label: "Parentage, as usually given", value: "A Brazilian sativa landrace crossed with a South Indian indica" },
        { label: "Aroma", value: "Pine and damp earth with a peppery top note and a thin edge of citrus" },
        { label: "Appearance", value: "Compact, pale sage buds under a heavy coat of resin heads" },
        { label: "Where the name comes from", value: "The white cast of that resin coat, not the effect" },
      ],
      sections: [
        {
          h2: "Where it came from",
          body: [
            "White Widow appeared in Dutch coffee-shop culture in the early 1990s and won the 1995 High Times Cannabis Cup, which is the moment a regional cross becomes an international name. The lineage usually given is a sativa landrace from Brazil crossed with a resinous indica from South India — a pairing that put a tropical parent and a mountain parent in the same plant, and that is a large part of why the result sits so squarely in the middle.",
            "The name describes what the plant looks like at harvest rather than what it does to anybody. Its resin heads are dense enough that a well-grown plant looks dusted with white, and in the era before microscope photographs were on every phone, that was the most striking thing about it.",
            "Because it is old and open, White Widow has been bred, back-crossed and re-selected by hundreds of growers over three decades. Two jars carrying the name honestly can differ more from each other than either differs from a jar with a completely different label. That is not fraud; it is what happens to a name that nobody owns.",
          ],
        },
        {
          h2: "How it smells and looks",
          body: [
            "The aroma is the most reliable part. Pine and damp forest floor arrive first, then a peppery sharpness that catches at the back of the nose, and underneath, on a well-kept example, a thin line of citrus peel. It is not sweet and it is not fruity; if a jar sold under this name smells of berries or of candy, the name has drifted a long way from the plant.",
            "Visually the buds are compact and slightly conical, sage rather than deep green, with short rust-coloured pistils and enough resin to make the surface look frosted rather than merely dusty. Ground up, the material tends to be dense rather than fluffy.",
            "In this climate the aroma is the first thing to go. Heat and humidity strip the volatile compounds that make the pine and pepper legible, so a tired jar of White Widow reads as generically herbal — which is the main way this particular name disappoints people who have had it before somewhere colder.",
          ],
        },
        {
          h2: "What people describe, and what nobody can promise",
          body: [
            "Descriptions collected over thirty years converge on the same shape: a clear-headed start that does not race, settling into something calmer without becoming heavy. It has a reputation for being conversational rather than introspective, which is why it appears so often as a house recommendation for people who do not want a strong lean in either direction.",
            "None of that is a guarantee, and this page will not pretend otherwise. How any flower feels depends on the individual, on the batch, on how it was grown and cured, on how much was consumed and on what else the day contained. Anyone who tells you a name produces a fixed outcome is describing marketing rather than a plant.",
            "What the name is actually useful for is calibration. If you know how White Widow reads to you, you have a reference point you can hold against everything else on a shelf — and a reference point is worth far more on an unfamiliar menu than a list of adjectives.",
          ],
        },
        {
          h2: "What to compare it against",
          body: [
            "Against a sweet, fruit-forward hybrid such as Blue Dream, the contrast is immediate and it is mostly in the nose: pine and pepper against berry and haze. If you liked one and not the other, aroma family is probably the reason, and that is a genuinely useful thing to be able to say at a counter.",
            "Against a fuel-and-pine profile such as OG Kush, White Widow is the lighter and drier of the two. OG's heaviness sits in the aroma before it sits anywhere else, and people who find that profile too much often find White Widow to be the same neighbourhood with the volume turned down.",
            "This is the practical way to use these pages: pick the aroma family you already know you like, describe it in your own words at the counter, and let the person who opened the jars this morning tell you which of them fits. Names travel badly; aroma descriptions do not.",
          ],
        },
        {
          h2: "How it is kept at this counter",
          body: [
            "Jars stay closed and out of direct light, and they are opened in front of you rather than pre-weighed out of sight. That order matters more than any label on the lid: you are meant to look at what you are buying and to smell it before agreeing to anything, and there is no version of buying flower well that skips that step.",
            "Ask when a batch was harvested and how long it has been in the jar. Those are ordinary questions with real answers, and the answers tell you more about how a shelf is managed than any strain name can.",
            "What is on the shelf changes, so this page does not claim that any particular jar is there today. That question is answered at the counter or by message, which is also the only lawful way to answer it.",
          ],
        },
      ],
      faqTitle: "White Widow: common questions",
      faq: [
        {
          q: "What is White Widow?",
          a: "A balanced hybrid bred in the Netherlands in the early 1990s, usually credited to a Brazilian sativa landrace crossed with a South Indian indica. The name refers to its heavy white resin coat.",
        },
        {
          q: "What does White Widow smell like?",
          a: "Pine and damp earth first, then a peppery sharpness, with a thin citrus edge on a well-kept example. It is not a sweet or fruity profile.",
        },
        {
          q: "Is White Widow indica or sativa?",
          a: "Neither cleanly — it is a cross of both and it sits in the middle, which is why it is so often used as a reference point rather than as an extreme.",
        },
        {
          q: "Why does White Widow vary so much between shops?",
          a: "Because the name is thirty years old and nobody owns it. Hundreds of growers have re-selected it, so two honest jars under the same name can differ substantially.",
        },
        {
          q: "How can I tell whether a White Widow jar is fresh?",
          a: "Smell it. If pine and pepper are legible and keep developing as you hold it, it has been kept well. A flat, generically herbal smell means the aroma has already gone.",
        },
        {
          q: "Do you have it in stock right now?",
          a: "This page does not carry stock information — what is on the shelf changes daily. Ask at the counter or by message.",
        },
      ],
      disclaimerTitle: "What this page is not",
      disclaimer:
        "This is a description of a cultivar, not an offer and not health advice. Nothing here states a price, a weight or what is on the shelf today, and nothing here claims that any plant treats or relieves any condition. Cannabis is sold at this counter only to adults of twenty and over holding the paperwork Thai rules require.",
    },
    ru: {
      thingName: "White Widow",
      title: "Сорт White Widow: происхождение, аромат, характер",
      description:
        "Что такое White Widow на самом деле: голландский гибрид девяностых, откуда взялось название, как он пахнет, как выглядит и с чем его сравнивать на полке в Паттайе.",
      h1: "White Widow: что на самом деле описывает это название",
      kicker: "Заметки о сорте",
      lead:
        "White Widow — одно из немногих названий в этой отрасли, которое прожило тридцать лет и не переизобреталось дважды за сезон, и именно поэтому оно встречается почти в каждом меню Паттайи. Эта же вездесущность и есть проблема: название многое говорит о растении, выведенном в Нидерландах в девяностые, и куда меньше — о банке, которая стоит перед вами сегодня.",
      factsTitle: "Коротко",
      facts: [
        { label: "Тип", value: "Сбалансированный гибрид" },
        { label: "Выведен", value: "Нидерланды, начало 1990-х" },
        { label: "Родители, как их обычно называют", value: "Бразильская сатива-ландрейс и южноиндийская индика" },
        { label: "Аромат", value: "Сосна и влажная земля, перечная верхняя нота, тонкий цитрусовый край" },
        { label: "Внешний вид", value: "Плотные шишки цвета шалфея под густым слоем смоляных головок" },
        { label: "Откуда название", value: "От белёсого налёта смолы, а не от ощущений" },
      ],
      sections: [
        {
          h2: "Откуда он взялся",
          body: [
            "White Widow появился в культуре голландских кофешопов в начале девяностых и выиграл Cannabis Cup в 1995 году — момент, когда региональное скрещивание становится международным именем. Родословную обычно указывают так: бразильская сатива-ландрейс, скрещённая со смолистой индикой из Южной Индии. То есть в одном растении оказались тропический и горный родители, и это во многом объясняет, почему результат сидит ровно посередине.",
            "Название описывает то, как растение выглядит к сбору, а не то, что оно с кем-то делает. Смоляные головки у него настолько плотные, что хорошо выращенный куст выглядит присыпанным белым, а в эпоху до микроскопов в каждом телефоне это была самая заметная его черта.",
            "Поскольку сорт старый и никем не закреплённый, его тридцать лет скрещивали, возвращали к родителям и переотбирали сотни гроверов. Две банки, честно подписанные этим именем, могут отличаться друг от друга сильнее, чем каждая из них — от банки с совершенно другим ярлыком. Это не обман, это судьба названия, у которого нет владельца.",
          ],
        },
        {
          h2: "Как пахнет и как выглядит",
          body: [
            "Аромат — самая надёжная часть. Сначала приходит сосна и влажная лесная подстилка, затем перечная резкость, которая цепляет в глубине носа, а под ними, у хорошо сохранённого образца, тонкая линия цитрусовой корки. Он не сладкий и не фруктовый: если банка под этим именем пахнет ягодами или карамелью, название ушло от растения далеко.",
            "Визуально шишки плотные, чуть конические, скорее шалфейного, чем тёмно-зелёного тона, с короткими рыжими пестиками и таким количеством смолы, что поверхность выглядит заиндевевшей, а не просто припылённой. В измельчённом виде материал скорее плотный, чем пушистый.",
            "В этом климате первым уходит именно аромат. Тепло и влажность вымывают летучие соединения, из-за которых сосна и перец вообще читаются, и уставшая банка White Widow пахнет обобщённо травяно — это главный способ, которым сорт разочаровывает тех, кто пробовал его где-нибудь севернее.",
          ],
        },
        {
          h2: "Что описывают люди и чего никто не может обещать",
          body: [
            "Описания, накопленные за тридцать лет, сходятся к одной форме: ясное начало без гонки, переходящее в спокойное состояние, которое не становится тяжёлым. У сорта репутация скорее разговорного, чем погружающего в себя, и поэтому он так часто оказывается домашней рекомендацией для тех, кто не хочет крена ни в одну сторону.",
            "Гарантией это не является, и делать вид, что является, страница не будет. Ощущения от любого цветка зависят от человека, от партии, от того, как растили и вылёживали, сколько употребили и что ещё было в этом дне. Тот, кто обещает вам фиксированный результат по названию, описывает маркетинг, а не растение.",
            "По-настоящему это название полезно для калибровки. Если вы знаете, как White Widow читается лично для вас, у вас появляется точка отсчёта, к которой можно приложить всё остальное на полке, — а точка отсчёта в незнакомом меню стоит куда больше, чем список прилагательных.",
          ],
        },
        {
          h2: "С чем сравнивать",
          body: [
            "Рядом со сладким фруктовым гибридом вроде Blue Dream контраст читается сразу и почти целиком носом: сосна и перец против ягоды и хейза. Если одно понравилось, а другое нет, дело, скорее всего, в ароматической семье, и это по-настоящему полезная вещь, которую можно произнести у прилавка.",
            "Рядом с топливно-сосновым профилем вроде OG Kush White Widow — более лёгкий и сухой из двух. Тяжесть OG заявляет о себе сначала в аромате и только потом где-либо ещё, и те, кому этот профиль кажется чрезмерным, часто находят в White Widow тот же район с убавленной громкостью.",
            "Так этими страницами и стоит пользоваться: выберите ароматическую семью, которая вам уже нравится, опишите её своими словами у прилавка и позвольте человеку, который сегодня утром открывал эти банки, сказать, что из них подходит. Названия путешествуют плохо, описания аромата — хорошо.",
          ],
        },
        {
          h2: "Как это хранится у нашего прилавка",
          body: [
            "Банки стоят закрытыми и вне прямого света, а открывают их при вас, а не отвешивают заранее в стороне. Этот порядок важнее любой надписи на крышке: вы должны увидеть и понюхать то, что покупаете, до того как на что-то согласились, и хорошего способа купить цветок в обход этого шага не существует.",
            "Спрашивайте, когда партию собрали и сколько времени она лежит в этой банке. Это обычные вопросы с настоящими ответами, и по ответам о полке понятно больше, чем по любому названию сорта.",
            "Полка меняется, поэтому страница не утверждает, что конкретная банка стоит там сегодня. На этот вопрос отвечают у прилавка или в переписке — и это же единственный законный способ на него ответить.",
          ],
        },
      ],
      faqTitle: "White Widow: частые вопросы",
      faq: [
        {
          q: "Что такое White Widow?",
          a: "Сбалансированный гибрид, выведенный в Нидерландах в начале девяностых; родословную обычно возводят к бразильской сативе-ландрейсу и южноиндийской индике. Название отсылает к густому белёсому слою смолы.",
        },
        {
          q: "Как пахнет White Widow?",
          a: "Сначала сосна и влажная земля, затем перечная резкость, у хорошо сохранённого образца — тонкий цитрусовый край. Это не сладкий и не фруктовый профиль.",
        },
        {
          q: "White Widow — это индика или сатива?",
          a: "Ни то ни другое в чистом виде: это скрещивание обоих, и он сидит посередине. Поэтому его чаще используют как точку отсчёта, а не как крайность.",
        },
        {
          q: "Почему White Widow так различается от магазина к магазину?",
          a: "Потому что названию тридцать лет и оно никому не принадлежит. Его переотбирали сотни гроверов, поэтому две честные банки под одним именем могут заметно отличаться.",
        },
        {
          q: "Как понять, что банка White Widow свежая?",
          a: "Понюхайте. Если сосна и перец читаются и продолжают разворачиваться, пока шишка в руке, хранили хорошо. Плоский обобщённо-травяной запах означает, что аромат уже ушёл.",
        },
        {
          q: "Он есть у вас прямо сейчас?",
          a: "Страница не содержит сведений о наличии: полка меняется каждый день. Спросите у прилавка или в переписке.",
        },
      ],
      disclaimerTitle: "Чем эта страница не является",
      disclaimer:
        "Это описание сорта, а не оферта и не медицинский совет. Здесь нет ни цены, ни веса, ни сведений о том, что стоит на полке сегодня, и нет утверждений, что какое-либо растение что-либо лечит или облегчает. Каннабис отпускается у этого прилавка только взрослым от двадцати лет с документами, которых требуют тайские правила.",
    },
  },
  "blue-dream": {
    en: {
      thingName: "Blue Dream",
      title: "Blue Dream strain: origin, berry aroma and what to expect",
      description:
        "Where Blue Dream came from, why it became the default hybrid on so many menus, how the berry-and-haze aroma reads, and what to compare it against in Pattaya.",
      h1: "Blue Dream: the hybrid that became a default",
      kicker: "Strain notes",
      lead:
        "For most of the 2010s Blue Dream was the single most sold cultivar in California, and names travel: it now appears on menus in cities where the plant behind it was never grown. That history explains both why it is worth knowing and why the name on a jar in Thailand deserves a couple of questions.",
      factsTitle: "At a glance",
      facts: [
        { label: "Type", value: "Sativa-leaning hybrid" },
        { label: "Bred", value: "Northern California, mid-2000s" },
        { label: "Parentage, as usually given", value: "Blueberry crossed with a Haze" },
        { label: "Aroma", value: "Sweet blueberry over a bright, faintly incense-like haze backbone" },
        { label: "Appearance", value: "Long, airy, pale green buds with prominent orange pistils" },
        { label: "Why it spread", value: "It grows generously and pleases a wide range of people, which made it a house default" },
      ],
      sections: [
        {
          h2: "Where it came from and why it is everywhere",
          body: [
            "Blue Dream emerged in Northern California in the middle of the 2000s and spread through the dispensary system there faster than almost anything before it. The cross usually given is Blueberry — an older, sweet, deeply coloured indica-leaning line — with a Haze, the tall sativa family that gave the 1990s their reputation for long flowering times and bright, incense-like aromatics.",
            "Its dominance had as much to do with agronomy as with taste. It yields well, forgives inexperienced growing and produces something most people find agreeable rather than challenging, which is exactly the profile a shop wants as a house default. A cultivar that pleases many is not the same thing as a cultivar that impresses anyone in particular, and Blue Dream has always sat comfortably in that trade-off.",
            "The consequence for a visitor in Pattaya is worth stating plainly: this is one of the most copied names in the world. It appears on menus everywhere, sometimes on plants with a genuine link to the Californian line and sometimes on whatever the grower had that smelled sweet. Ask who grew it and where, and treat a specific answer as a good sign.",
          ],
        },
        {
          h2: "How it smells and looks",
          body: [
            "The signature is sweetness that reads as blueberry or as generic sweet fruit, sitting on top of something brighter and drier from the Haze side — a slightly incense-like, almost floral note that keeps the sweetness from becoming syrupy. When it is grown and cured well, both halves are legible at once.",
            "The buds are typically long, loose and airy rather than compact, pale green with a lot of orange pistils and a light, even resin coat rather than a heavy frost. It grinds fluffy. That structure is a fair part of why it tends to look larger than denser flower of the same weight.",
            "Sweet aromas fade fastest of all in heat. A Blue Dream jar that has spent a hot week half-open smells like plain hay with a hint of sugar, and past that point the name on the label is the only sweetness left. This one is worth smelling carefully before agreeing to it.",
          ],
        },
        {
          h2: "What people describe",
          body: [
            "The consensus description across two decades is even and undramatic: an easy start, no sharp edges, a long plateau rather than a peak. It is the cultivar people tend to name when asked what they would give somebody who is unsure of what they want, precisely because it rarely surprises anyone.",
            "That evenness is also its limitation. People who want a distinctive experience often find Blue Dream unremarkable, and there is nothing wrong with that verdict — a default is not supposed to be the most interesting thing on a shelf. As with every cultivar, how it lands depends on the person, the batch, the growing and the curing, and no name predicts it.",
            "For a first purchase in an unfamiliar city, unremarkable has real value. If you do not yet know how a local shelf compares to what you are used to, something with few sharp edges is a reasonable place to start measuring from.",
          ],
        },
        {
          h2: "What to compare it against",
          body: [
            "Against White Widow the difference is a clean split in aroma family: berry and brightness on one side, pine and pepper on the other. Most people have a clear preference between those two directions, and knowing which one you are is more useful than knowing ten strain names.",
            "Against OG Kush the contrast is heavier still. OG's fuel-and-pine profile is dense and low; Blue Dream's is light and sweet and sits higher in the nose. If a shelf has all three, smelling them side by side teaches you more in one minute than any amount of reading.",
            "The practical instruction is the same as on every page here: describe the direction rather than the name. A counter can find you something in the same family from whatever came in this week, and that is a far better outcome than insisting on a label.",
          ],
        },
      ],
      faqTitle: "Blue Dream: common questions",
      faq: [
        {
          q: "What is Blue Dream?",
          a: "A sativa-leaning hybrid from Northern California, usually given as Blueberry crossed with a Haze. It became the default menu hybrid across the 2010s.",
        },
        {
          q: "What does Blue Dream smell like?",
          a: "Sweet blueberry or generic sweet fruit over a brighter, faintly incense-like haze note. If a jar smells only of hay, the aroma has already gone.",
        },
        {
          q: "Why is Blue Dream on so many menus?",
          a: "It yields well, is forgiving to grow and suits a wide range of people. That combination makes it a natural house default rather than a specialist choice.",
        },
        {
          q: "Is a Blue Dream jar in Thailand the same plant as in California?",
          a: "Not necessarily. It is one of the most copied names in the world, so ask who grew it and where — a specific answer is the useful signal.",
        },
        {
          q: "Is Blue Dream a good first choice?",
          a: "It is a reasonable one precisely because it is even and undramatic, which makes it a decent baseline for comparing everything else on a local shelf.",
        },
        {
          q: "Can I check availability here?",
          a: "No. This page carries no stock information; ask at the counter or by message, which is the only lawful way to answer that question.",
        },
      ],
      disclaimerTitle: "What this page is not",
      disclaimer:
        "This is a description of a cultivar, not an offer and not health advice. No price, no weight, no stock status and no claim that any plant treats or relieves any condition. Sales at this counter are to adults of twenty and over with the paperwork Thai rules require.",
    },
    ru: {
      thingName: "Blue Dream",
      title: "Сорт Blue Dream: происхождение, ягодный аромат, характер",
      description:
        "Откуда взялся Blue Dream, почему он стал гибридом по умолчанию в половине меню, как читается ягодно-хейзовый аромат и с чем его сравнивать в Паттайе.",
      h1: "Blue Dream: гибрид, ставший вариантом по умолчанию",
      kicker: "Заметки о сорте",
      lead:
        "Почти всё десятилетие после 2010 года Blue Dream был самым продаваемым сортом Калифорнии, а названия путешествуют: сегодня он стоит в меню городов, где стоящее за ним растение никогда не росло. Эта история объясняет и почему его стоит знать, и почему к надписи на банке в Таиланде полагается пара вопросов.",
      factsTitle: "Коротко",
      facts: [
        { label: "Тип", value: "Гибрид с уклоном в сативу" },
        { label: "Выведен", value: "Северная Калифорния, середина 2000-х" },
        { label: "Родители, как их обычно называют", value: "Blueberry, скрещённый с хейзом" },
        { label: "Аромат", value: "Сладкая черника поверх светлой, слегка благовонной хейзовой основы" },
        { label: "Внешний вид", value: "Длинные рыхлые шишки светло-зелёного тона с заметными рыжими пестиками" },
        { label: "Почему разошёлся", value: "Щедро родит и нравится очень разным людям — идеальный «домашний вариант»" },
      ],
      sections: [
        {
          h2: "Откуда взялся и почему он повсюду",
          body: [
            "Blue Dream появился в Северной Калифорнии в середине двухтысячных и разошёлся по тамошним магазинам каннабиса быстрее почти всего, что было до него. Скрещивание обычно указывают так: Blueberry — старая сладкая линия с уклоном в индику — и хейз, то самое высокое сативное семейство, которое в девяностые прославилось долгим цветением и светлым, почти благовонным ароматом.",
            "Его господство объясняется агрономией не меньше, чем вкусом. Он хорошо родит, прощает неопытность и даёт то, что большинству кажется приятным, а не сложным, — ровно тот профиль, который магазин хочет иметь как вариант по умолчанию. «Нравится многим» и «поражает кого-то конкретного» — разные вещи, и Blue Dream всегда спокойно жил в этом размене.",
            "Для гостя Паттайи вывод стоит произнести прямо: это одно из самых копируемых названий в мире. Оно встречается в меню повсюду — иногда на растении с настоящей связью с калифорнийской линией, а иногда на том, что у гровера было сладко пахнущего. Спросите, кто и где вырастил, и считайте конкретный ответ хорошим знаком.",
          ],
        },
        {
          h2: "Как пахнет и как выглядит",
          body: [
            "Фирменная черта — сладость, которая читается как черника или просто как сладкий фрукт, поверх чего-то более светлого и сухого со стороны хейза: слегка благовонная, почти цветочная нота, которая не даёт сладости стать сиропом. Когда растение выращено и вылежано хорошо, обе половины читаются одновременно.",
            "Шишки обычно длинные, рыхлые и воздушные, а не плотные; тон светло-зелёный, много рыжих пестиков, смоляной слой ровный и лёгкий, без густого инея. Мелется пушисто. Эта структура во многом объясняет, почему при равном весе он выглядит крупнее плотных сортов.",
            "Сладкие ароматы в жаре уходят первыми. Банка Blue Dream, простоявшая горячую неделю полуоткрытой, пахнет обычным сеном с намёком на сахар, и дальше единственная сладость остаётся на этикетке. Именно этот сорт стоит нюхать внимательно, прежде чем соглашаться.",
          ],
        },
        {
          h2: "Что описывают люди",
          body: [
            "Согласованное описание за два десятилетия — ровное и недраматичное: спокойное начало, отсутствие резких краёв, долгое плато вместо пика. Это тот сорт, который называют, когда спрашивают, что дать человеку, который сам не знает, чего хочет, — именно потому, что он редко кого-то удивляет.",
            "Эта же ровность — его ограничение. Тем, кто ищет выраженный характер, Blue Dream часто кажется незапоминающимся, и в таком вердикте нет ничего обидного: вариант по умолчанию и не должен быть самым интересным на полке. Как и у любого сорта, итог зависит от человека, партии, выращивания и вылёживания, и по названию его не предскажешь.",
            "Для первой покупки в незнакомом городе «незапоминающийся» имеет реальную ценность. Если вы ещё не знаете, как местная полка соотносится с привычной, начинать измерения удобно с того, у чего мало резких краёв.",
          ],
        },
        {
          h2: "С чем сравнивать",
          body: [
            "Рядом с White Widow разница — это чистый раскол ароматических семей: ягода и светлость с одной стороны, сосна и перец с другой. У большинства людей есть внятное предпочтение между этими направлениями, и знать, к какому относитесь вы, полезнее, чем помнить десять названий.",
            "Рядом с OG Kush контраст ещё сильнее. Топливно-сосновый профиль OG плотный и низкий; у Blue Dream он лёгкий, сладкий и стоит выше в носу. Если на полке есть все три, минута сравнения запахов подряд учит большему, чем любое количество чтения.",
            "Практическое указание то же, что и на остальных страницах: описывайте направление, а не название. У прилавка подберут вам что-то из той же семьи из того, что пришло на этой неделе, и это гораздо лучший исход, чем настаивать на ярлыке.",
          ],
        },
      ],
      faqTitle: "Blue Dream: частые вопросы",
      faq: [
        {
          q: "Что такое Blue Dream?",
          a: "Гибрид с уклоном в сативу из Северной Калифорнии; родословную обычно указывают как Blueberry, скрещённый с хейзом. В 2010-е он стал гибридом по умолчанию в меню.",
        },
        {
          q: "Как пахнет Blue Dream?",
          a: "Сладкая черника или просто сладкий фрукт поверх более светлой, слегка благовонной хейзовой ноты. Если банка пахнет только сеном, аромат уже ушёл.",
        },
        {
          q: "Почему Blue Dream есть почти везде?",
          a: "Он хорошо родит, прощает ошибки в выращивании и подходит очень разным людям. Это делает его естественным «домашним вариантом», а не выбором для знатока.",
        },
        {
          q: "Банка Blue Dream в Таиланде — то же растение, что в Калифорнии?",
          a: "Не обязательно. Это одно из самых копируемых названий в мире, поэтому спрашивайте, кто и где вырастил: полезен именно конкретный ответ.",
        },
        {
          q: "Подходит ли Blue Dream для первого выбора?",
          a: "Вполне — как раз потому, что он ровный и недраматичный, и от него удобно отмерять всё остальное на местной полке.",
        },
        {
          q: "Можно ли посмотреть здесь наличие?",
          a: "Нет. Сведений о наличии на странице нет; спрашивайте у прилавка или в переписке — это единственный законный способ ответить на такой вопрос.",
        },
      ],
      disclaimerTitle: "Чем эта страница не является",
      disclaimer:
        "Это описание сорта, а не оферта и не медицинский совет. Ни цены, ни веса, ни сведений о наличии, ни утверждений, что растение что-либо лечит или облегчает. Отпуск у этого прилавка — только взрослым от двадцати лет с документами, которых требуют тайские правила.",
    },
  },
  "og-kush": {
    en: {
      thingName: "OG Kush",
      title: "OG Kush strain: lineage, fuel aroma and how it differs",
      description:
        "The contested origins of OG Kush, what the fuel-and-pine aroma actually smells like, how it differs from a sweet hybrid, and what to ask before buying it in Pattaya.",
      h1: "OG Kush: the profile behind half of modern cannabis",
      kicker: "Strain notes",
      lead:
        "If a jar has ever struck you as smelling of petrol, lemon peel and pine needles at the same time, you have met the OG Kush family. Its lineage is disputed, its name is argued about, and its descendants make up an enormous share of everything grown in the western world since the 1990s — which makes it one of the few names worth learning properly.",
      factsTitle: "At a glance",
      facts: [
        { label: "Type", value: "Hybrid, generally described as leaning heavy" },
        { label: "Emerged", value: "Southern California, early to mid 1990s" },
        { label: "Parentage", value: "Disputed; commonly linked to the Chemdawg line crossed with a Hindu Kush type" },
        { label: "Aroma", value: "Fuel and pine with lemon peel and a distinct earthy funk underneath" },
        { label: "Appearance", value: "Chunky, dense, olive-green buds with rust-coloured hairs and a sticky surface" },
        { label: "What the letters mean", value: "Disputed — the two usual readings are Ocean Grown and Original Gangster" },
      ],
      sections: [
        {
          h2: "A lineage nobody agrees on",
          body: [
            "OG Kush appeared in Southern California in the 1990s and its origin story has been argued over ever since. The most repeated account links it to the Chemdawg line, itself of contested parentage, crossed with a Hindu Kush type — the mountain indica family that gives the profile its density and its earthiness. Other accounts differ on the details, and no version has ever been settled to everybody's satisfaction.",
            "Even the letters are contested. Ocean Grown and Original Gangster are the two readings you will hear, and both have partisans who will tell you the other is a later invention. This is what history looks like in a trade that spent decades unable to keep written records.",
            "What is not disputed is its influence. A large share of the cultivars sold in North America and Europe since the 2000s trace back to it somewhere, which is why the fuel-and-pine profile feels familiar even to people who have never bought anything under this name.",
          ],
        },
        {
          h2: "How it smells and looks",
          body: [
            "The aroma is the most recognisable in the modern catalogue and the hardest to describe politely: petrol or solvent first, then sharp pine, then lemon peel, over a base that people variously call earthy, musky or simply funky. It is a low, dense smell rather than a bright one, and it fills a room faster than a sweet cultivar does.",
            "The buds are typically chunky and dense, olive rather than pale, with short rust-coloured hairs and a surface sticky enough to be noticeable on the fingers. Well-grown examples look compact and heavy for their size, which is the opposite of the airy structure of a haze-leaning hybrid.",
            "The fuel note is comparatively durable — it survives heat better than a berry sweetness does — but the lemon and pine on top of it are not. A tired OG reads as flat and vaguely musty, having lost everything that made the profile interesting while keeping the part that made it heavy.",
          ],
        },
        {
          h2: "What people describe",
          body: [
            "Reports across three decades converge on something slower and more physical than the White Widow or Blue Dream descriptions: a settling rather than a lift, more evening than afternoon. It has a long-standing reputation as the profile people reach for when they intend to stop doing things rather than start.",
            "That is a description of a tendency, not a promise. Individual response varies enormously, batches vary, growing and curing vary, and anybody who guarantees an outcome from a name is selling certainty they do not have. Nothing on this page states or implies that any plant treats, relieves or improves any condition.",
            "If you are new to this profile, the sensible approach is the one that applies to anything unfamiliar: take less than you think, wait longer than you think, and judge afterwards rather than during.",
          ],
        },
        {
          h2: "What to ask before buying it",
          body: [
            "Because the name is old and enormously influential, it gets attached to a great deal of flower with only a distant relationship to it. The single most useful question is who grew it, followed by where — a shop that can answer both is a shop that knows its own supply chain.",
            "Then smell it against something else on the shelf. If the fuel and pine are not clearly present, whatever is in the jar is not delivering the reason to buy this profile in the first place, regardless of the label.",
            "And ask the storage questions that apply to everything: when it was harvested, how long it has been in that jar, and whether the jar has been sitting in light. In this climate those three answers matter more than lineage.",
          ],
        },
      ],
      faqTitle: "OG Kush: common questions",
      faq: [
        {
          q: "What is OG Kush?",
          a: "A hybrid that emerged in Southern California in the 1990s, commonly linked to the Chemdawg line crossed with a Hindu Kush type. Its lineage has never been definitively settled.",
        },
        {
          q: "What does OG stand for?",
          a: "It is disputed. Ocean Grown and Original Gangster are the two readings you will hear, and neither has ever been conclusively established.",
        },
        {
          q: "What does OG Kush smell like?",
          a: "Fuel or solvent first, then sharp pine and lemon peel, over an earthy, musky base. It is a low, dense aroma rather than a bright one.",
        },
        {
          q: "How is it different from Blue Dream?",
          a: "Almost completely, in aroma terms. Blue Dream is light, sweet and berry-forward; OG Kush is heavy, fuel-driven and earthy. Smelling them side by side is the fastest way to learn your own preference.",
        },
        {
          q: "Why does OG Kush appear on so many menus?",
          a: "Because a large share of modern cultivars descend from it, and because the name carries weight. That also means the label is attached to plenty of flower only distantly related to it.",
        },
        {
          q: "Do you have it today?",
          a: "This page does not carry stock information. Ask at the counter or by message.",
        },
      ],
      disclaimerTitle: "What this page is not",
      disclaimer:
        "A description of a cultivar, not an offer and not health advice. No price, no weight, no stock status, and no claim that any plant treats or relieves any condition. Sales are to adults of twenty and over with the paperwork Thai rules require.",
    },
    ru: {
      thingName: "OG Kush",
      title: "Сорт OG Kush: родословная, топливный аромат, отличия",
      description:
        "Спорное происхождение OG Kush, как на самом деле пахнет топливно-сосновый профиль, чем он отличается от сладкого гибрида и что спросить до покупки в Паттайе.",
      h1: "OG Kush: профиль, из которого выросла половина современных сортов",
      kicker: "Заметки о сорте",
      lead:
        "Если вам когда-нибудь казалось, что банка пахнет бензином, лимонной коркой и хвоей одновременно, вы встречались с семейством OG Kush. Его родословную оспаривают, о названии спорят, а потомки составляют огромную долю всего, что выращивают в западном мире с девяностых, — поэтому это одно из немногих названий, которое стоит выучить как следует.",
      factsTitle: "Коротко",
      facts: [
        { label: "Тип", value: "Гибрид, который обычно описывают как тяжёлый" },
        { label: "Появился", value: "Южная Калифорния, первая половина 1990-х" },
        { label: "Родословная", value: "Спорная; чаще всего связывают линию Chemdawg с типом Hindu Kush" },
        { label: "Аромат", value: "Топливо и хвоя, лимонная корка и отчётливая землистая основа" },
        { label: "Внешний вид", value: "Крупные плотные шишки оливкового тона, рыжие волоски, липкая поверхность" },
        { label: "Что значат буквы", value: "Спорно: обычно расшифровывают как Ocean Grown или Original Gangster" },
      ],
      sections: [
        {
          h2: "Родословная, о которой никто не договорился",
          body: [
            "OG Kush появился в Южной Калифорнии в девяностые, и с тех пор о его происхождении спорят. Чаще всего повторяют версию, связывающую его с линией Chemdawg — у которой родословная тоже оспаривается — и с типом Hindu Kush, тем самым горным индика-семейством, которое даёт профилю плотность и землистость. Другие версии расходятся в деталях, и ни одна не признана всеми.",
            "Спорят даже о буквах. Ocean Grown и Original Gangster — два расхожих прочтения, и у каждого есть сторонники, готовые объяснить, что другое придумали позже. Так выглядит история в отрасли, которая десятилетиями не могла вести письменных записей.",
            "Не оспаривается влияние. Заметная доля сортов, продающихся в Северной Америке и Европе с двухтысячных, где-то в предках имеет его, и поэтому топливно-хвойный профиль кажется знакомым даже тем, кто ничего под этим именем не покупал.",
          ],
        },
        {
          h2: "Как пахнет и как выглядит",
          body: [
            "Аромат — самый узнаваемый в современном каталоге и самый трудный для вежливого описания: сначала бензин или растворитель, затем резкая хвоя, затем лимонная корка, поверх основы, которую называют то землистой, то мускусной, то просто тяжёлой. Это низкий и плотный запах, а не светлый, и комнату он заполняет быстрее сладких сортов.",
            "Шишки обычно крупные и плотные, оливковые, а не бледные, с короткими рыжими волосками и поверхностью, липкость которой заметна на пальцах. Хорошо выращенные экземпляры выглядят компактными и тяжёлыми для своего размера — противоположность воздушной структуре хейзовых гибридов.",
            "Топливная нота относительно живучая: жару она переносит лучше, чем ягодная сладость. А вот лимон и хвоя поверх неё — нет. Уставший OG читается плоско и слегка затхло: он потерял всё, что делало профиль интересным, и сохранил то, что делало его тяжёлым.",
          ],
        },
        {
          h2: "Что описывают люди",
          body: [
            "Описания за три десятилетия сходятся к чему-то более медленному и телесному, чем у White Widow или Blue Dream: не подъём, а оседание; скорее вечер, чем день. За профилем давно закрепилась репутация того, к чему тянутся, когда собираются перестать что-то делать, а не начать.",
            "Это описание тенденции, а не обещание. Индивидуальная реакция различается очень сильно, партии различаются, выращивание и вылёживание различаются, и тот, кто гарантирует результат по названию, продаёт уверенность, которой у него нет. Ничего на этой странице не утверждает и не подразумевает, что растение что-либо лечит, облегчает или улучшает.",
            "Если профиль для вас новый, разумный подход тот же, что и с любым незнакомым: взять меньше, чем кажется нужным, подождать дольше, чем кажется нужным, и судить после, а не в процессе.",
          ],
        },
        {
          h2: "Что спросить перед покупкой",
          body: [
            "Поскольку название старое и очень влиятельное, его прикрепляют к массе цветка, имеющего к нему лишь отдалённое отношение. Самый полезный вопрос — кто вырастил, следом — где. Магазин, который отвечает на оба, знает собственную цепочку поставок.",
            "Дальше понюхайте его рядом с чем-нибудь другим с этой же полки. Если топливо и хвоя не читаются отчётливо, то, что лежит в банке, не даёт того, ради чего этот профиль вообще берут, — независимо от надписи.",
            "И задайте вопросы про хранение, которые уместны для всего: когда собрали, сколько лежит в этой банке и не стояла ли банка на свету. В этом климате три таких ответа значат больше, чем родословная.",
          ],
        },
      ],
      faqTitle: "OG Kush: частые вопросы",
      faq: [
        {
          q: "Что такое OG Kush?",
          a: "Гибрид, появившийся в Южной Калифорнии в девяностые; чаще всего его связывают с линией Chemdawg, скрещённой с типом Hindu Kush. Родословная окончательно не установлена.",
        },
        {
          q: "Как расшифровывается OG?",
          a: "Единого мнения нет. Обычно называют Ocean Grown или Original Gangster, и ни одна версия не доказана.",
        },
        {
          q: "Как пахнет OG Kush?",
          a: "Сначала топливо или растворитель, затем резкая хвоя и лимонная корка поверх землистой мускусной основы. Запах низкий и плотный, а не светлый.",
        },
        {
          q: "Чем он отличается от Blue Dream?",
          a: "Почти всем, если говорить об аромате. Blue Dream лёгкий, сладкий и ягодный; OG Kush тяжёлый, топливный и землистый. Понюхать их подряд — самый быстрый способ понять своё предпочтение.",
        },
        {
          q: "Почему OG Kush есть в стольких меню?",
          a: "Потому что от него происходит заметная доля современных сортов и потому что название весит много. Из-за этого же ярлык вешают на цветок, родственный ему весьма отдалённо.",
        },
        {
          q: "Он есть у вас сегодня?",
          a: "Сведений о наличии на странице нет. Спросите у прилавка или в переписке.",
        },
      ],
      disclaimerTitle: "Чем эта страница не является",
      disclaimer:
        "Описание сорта, а не оферта и не медицинский совет. Ни цены, ни веса, ни сведений о наличии, ни утверждений, что растение что-либо лечит или облегчает. Отпуск — только взрослым от двадцати лет с документами, которых требуют тайские правила.",
    },
  },
};

export function getStrainPage(slug: string, locale: Locale): StrainPageCopy | null {
  return STRAIN_PAGES[slug]?.[locale] ?? null;
}

/**
 * Хаб кластера сортов (en+ru).
 *
 * Нужен по двум причинам. Во-первых, у кластера должен быть корень, иначе
 * страницы сортов висят по одной и достижимы только из футера. Во-вторых,
 * читателю нужно объяснить, чем эти страницы являются и чем нет: название
 * сорта — не спецификация, и человек, который ищет по названию, обычно ищет не
 * то, что думает.
 */
export interface StrainIndexItem {
  suffix: string;
  label: string;
  blurb: string;
}

export interface StrainsIndexCopy {
  title: string;
  description: string;
  h1: string;
  kicker: string;
  lead: string;
  itemsTitle: string;
  items: StrainIndexItem[];
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
}

export const STRAINS_INDEX_COPY: Partial<Record<Locale, StrainsIndexCopy>> = {
  en: {
    title: "Cannabis strain notes: what the names mean | Pattaya",
    description:
      "Descriptive notes on three cultivars you will meet on almost any Pattaya menu, and an honest account of how little a strain name guarantees.",
    h1: "Strain notes: what a name on a jar tells you",
    kicker: "Strain notes",
    lead:
      "A strain name is a family resemblance, not a specification. These pages describe where three widely sold cultivars came from, how they smell, what they look like and what people have reported for decades — and they are equally clear about the part nobody can promise.",
    itemsTitle: "The pages",
    items: [
      {
        suffix: "strains/white-widow",
        label: "White Widow",
        blurb:
          "A Dutch hybrid from the early 1990s with a pine-and-pepper aroma and a resin coat that gave it its name. The most useful reference point on most shelves.",
      },
      {
        suffix: "strains/blue-dream",
        label: "Blue Dream",
        blurb:
          "The Californian hybrid that became a house default across the 2010s: sweet berry over a bright haze backbone, even rather than dramatic.",
      },
      {
        suffix: "strains/og-kush",
        label: "OG Kush",
        blurb:
          "Fuel, pine and lemon peel over an earthy base, from a disputed lineage that half of modern western cannabis descends from.",
      },
    ],
    sections: [
      {
        h2: "Why a strain name guarantees less than people think",
        body: [
          "Nobody owns these names. A cultivar bred thirty years ago has been re-selected by hundreds of growers since, in different climates, from different cuttings, with different intentions. Two jars honestly labelled with the same name can be further apart than either is from a jar with a different label entirely.",
          "That is before the second problem, which is that names sell. A grower with something sweet and a market that recognises one sweet name will use that name, and no register exists to say otherwise. This is not unique to Thailand; it is the state of the whole trade.",
          "So use these pages the way a wine note is useful rather than the way a specification is: they tell you what a family tends to smell like and what to compare it against. The jar in front of you is still the thing being bought.",
        ],
      },
      {
        h2: "Why only three pages",
        body: [
          "These three are the names that turn up on the shelf most often, and between them they cover the whole aromatic range a visitor has to choose inside: pine and pepper, sweet berry, and fuel.",
          "Learn where your own preference sits among those three and you can navigate any shelf in the city, including the parts of it carrying names none of us have seen before. A fourth page would tell you less about the jar in front of you than a minute of smelling it does.",
        ],
      },
      {
        h2: "What these pages never contain",
        body: [
          "No price, no weight, no stock status and no product photographs — public advertising of a controlled herb is restricted in Thailand, and stock changes daily in any case. What is on the shelf today is answered at the counter or by message.",
          "No cannabinoid figures and no claims about strength: those numbers belong on a laboratory report for a specific batch, not on a page about a cultivar in general. And no health claims of any kind, because a shop is not a clinic and a description is not a diagnosis.",
        ],
      },
    ],
    faqTitle: "About strain names",
    faq: [
      {
        q: "Does the same strain name mean the same plant everywhere?",
        a: "No. Names are unowned and widely re-selected, so two honestly labelled jars can differ substantially. Treat a name as a family resemblance rather than a specification.",
      },
      {
        q: "What is more reliable than a strain name?",
        a: "Aroma. Describe the family you like — pine, sweet fruit, fuel, citrus — and a counter can match it from whatever arrived this week.",
      },
      {
        q: "Why are there no cannabinoid percentages on these pages?",
        a: "Those figures describe a specific tested batch, not a cultivar in general, and they say nothing about aroma or curing. Ask to see the lab report for the batch in the jar.",
      },
    ],
  },
  ru: {
    title: "Заметки о сортах каннабиса: что означают названия",
    description:
      "Описательные заметки о трёх сортах, которые встречаются почти в любом меню Паттайи, и честный разбор того, как мало гарантирует название сорта.",
    h1: "Заметки о сортах: что говорит название на банке",
    kicker: "Заметки о сортах",
    lead:
      "Название сорта — это семейное сходство, а не спецификация. Эти страницы рассказывают, откуда взялись три широко продаваемых сорта, как они пахнут, как выглядят и что люди описывают десятилетиями, — и так же прямо говорят о том, чего никто обещать не может.",
    itemsTitle: "Страницы",
    items: [
      {
        suffix: "strains/white-widow",
        label: "White Widow",
        blurb:
          "Голландский гибрид начала девяностых с сосново-перечным ароматом и слоем смолы, давшим ему имя. Самая полезная точка отсчёта на большинстве полок.",
      },
      {
        suffix: "strains/blue-dream",
        label: "Blue Dream",
        blurb:
          "Калифорнийский гибрид, ставший вариантом по умолчанию в 2010-е: сладкая ягода поверх светлой хейзовой основы, ровный, а не драматичный.",
      },
      {
        suffix: "strains/og-kush",
        label: "OG Kush",
        blurb:
          "Топливо, хвоя и лимонная корка поверх землистой основы; спорная родословная, от которой происходит половина современных западных сортов.",
      },
    ],
    sections: [
      {
        h2: "Почему название сорта гарантирует меньше, чем принято думать",
        body: [
          "Этими названиями никто не владеет. Сорт, выведенный тридцать лет назад, с тех пор переотбирали сотни гроверов — в разных климатах, из разных черенков, с разными целями. Две банки, честно подписанные одним именем, могут отстоять друг от друга дальше, чем каждая из них от банки с совершенно другим ярлыком.",
          "И это до второй проблемы: названия продают. Гровер, у которого есть что-то сладкое, и рынок, который узнаёт одно сладкое имя, — и это имя будет использовано, а реестра, который скажет обратное, не существует. Это не тайская особенность, а состояние всей отрасли.",
          "Поэтому пользуйтесь этими страницами как винной заметкой, а не как спецификацией: они говорят, чем обычно пахнет семейство и с чем его сравнивать. Покупается всё равно та банка, что стоит перед вами.",
        ],
      },
      {
        h2: "Почему страниц только три",
        body: [
          "Потому что о трёх мы можем честно написать в таком объёме. Страница на каждое название, раздутая до вида содержательной, была бы ровно тем тонким дублем, который никому не помогает и на удаление которого этот сайт уже потратил один раунд.",
          "Выбраны те три, что чаще всего звучат у прилавка и вместе покрывают ароматическую территорию: хвоя и перец, сладкая ягода, топливо. Поймите, где среди этих трёх находитесь вы, — и вы сориентируетесь в любом меню города, включая те его части, где стоят названия, которых никто из нас раньше не видел.",
        ],
      },
      {
        h2: "Чего на этих страницах не бывает",
        body: [
          "Ни цены, ни веса, ни сведений о наличии, ни фотографий товара: публичная реклама контролируемого растения в Таиланде ограничена, а полка в любом случае меняется каждый день. О том, что есть сегодня, отвечают у прилавка или в переписке.",
          "Ни цифр по каннабиноидам, ни утверждений о крепости: эти числа относятся к лабораторному отчёту по конкретной партии, а не к сорту вообще. И никаких медицинских утверждений, потому что магазин — не клиника, а описание — не диагноз.",
        ],
      },
    ],
    faqTitle: "О названиях сортов",
    faq: [
      {
        q: "Одно название сорта — это везде одно растение?",
        a: "Нет. Названия никому не принадлежат и широко переотбираются, поэтому две честно подписанные банки могут заметно различаться. Считайте название семейным сходством, а не спецификацией.",
      },
      {
        q: "Что надёжнее названия сорта?",
        a: "Аромат. Опишите семью, которая вам нравится, — хвоя, сладкий фрукт, топливо, цитрус, — и у прилавка подберут соответствие из того, что пришло на этой неделе.",
      },
      {
        q: "Почему на этих страницах нет процентов по каннабиноидам?",
        a: "Эти цифры описывают конкретную проверенную партию, а не сорт вообще, и ничего не говорят ни об аромате, ни о вылёживании. Просите лабораторный отчёт на партию из той банки.",
      },
    ],
  },
};
