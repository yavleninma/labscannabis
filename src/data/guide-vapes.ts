import type { PartialGuideCopyByLocale } from "@/data/guides";

/**
 * Гайд «вейпы и каннабис в Таиланде» (W2-07), en+ru.
 *
 * Зачем он существует: по данным Search Console почти весь текущий поисковый
 * трафик домена — вейп- и смок-запросы, приземляющиеся на главную. Эта страница
 * даёт такому визитёру честный ответ («вейпы в Таиланде запрещены к продаже,
 * мы их не продаём») вместо нерелевантной главной — и заодно снимает
 * enforcement-риск: в Паттайе рейды на каннабис-магазины случались именно
 * из-за вейпов на витрине.
 *
 * ЗАПРЕЩЕНО в этом файле: аббревиатуры каннабиноидов и проценты (линтер снимает
 * это правило только на правовом гиде), суммы штрафов цифрами (только словами),
 * упоминания THC-вейпов и картриджей с экстрактами, цены, промо-обороты.
 */
export const VAPES_GUIDE: PartialGuideCopyByLocale = {
  en: {
    title: "Vapes and cannabis in Thailand: two different laws",
    description:
      "Selling and importing vapes and e-cigarettes is banned in Thailand, and LABS DISPENSARY does not stock them. Licensed cannabis flower runs under a separate set of rules — here is how the two differ.",
    h1: "Vapes and cannabis in Thailand are covered by two different laws",
    kicker: "Vapes and the law",
    basisLabels: {
      official: "Official source",
      practice: "Practical caution — not a legal conclusion",
    },
    intro:
      "A lot of people find this website while searching for a vape shop in Pattaya, so let us save you time: we do not sell vapes, e-cigarettes, pods, nicotine pouches or tobacco, in any form, and no licensed cannabis dispensary in Thailand should. The two products live under two different laws — one bans a trade outright, the other allows it under strict conditions — and confusing them is how visitors get into trouble. This page separates them.",
    checklistTitle: "The short version",
    checklist: [
      "Selling and importing vapes and e-cigarettes is banned in Thailand — the import ban since 2014, the sale ban since 2015.",
      "Any shop or street stall selling vape devices is trading outside that ban, whatever its signage says.",
      "LABS DISPENSARY does not stock vapes, e-cigarettes, cartridges, nicotine pouches or tobacco.",
      "Cannabis flower is a separate regime: a controlled herb, sold at licensed premises, in person, to adults 20 and over with a prescription issued in Thailand.",
      "The rules for flower are summarised, with links to the official notices, in the tourist legal guide on this site.",
    ],
    sections: [
      {
        h2: "The vape ban: what is actually prohibited",
        basis: "official",
        body: [
          "Thailand prohibits the import and the sale of e-cigarettes, vaping devices and their liquids. The import ban rests on a Ministry of Commerce notification in force since late 2014; the sale ban on Consumer Protection Board orders in force since early 2015. Neither is a recent or a provisional measure, and both apply to nicotine and non-nicotine devices alike.",
          "The two bans reach different people through different laws. Import and possession of imported devices fall under customs law, where the routine outcome is confiscation and a fine assessed against the value of the goods; selling is pursued separately under the consumer-protection orders, which carry their own penalties for the trader. Between them, the stall and its customer both carry risk.",
        ],
      },
      {
        h2: "Why a cannabis dispensary keeps clear of vapes entirely",
        basis: "practice",
        body: [
          "A cannabis licence in Thailand is conditional and revocable, and enforcement — uneven in the past, visibly tightening now — has most often reached Pattaya's cannabis shops through something else on the shelf, vapes being the recurring example. A dispensary that sells you a vape is telling you how it weighs rules against revenue, and that is worth knowing before you trust it on anything else.",
          "So the answer at our counter is simply no: no devices, no pods, no liquids, no tobacco. If you came looking for a vape shop, this page cannot point you to a legal one, because under the current ban there is no such thing in Thailand.",
        ],
      },
      {
        h2: "Cannabis flower: the regime that does exist",
        basis: "official",
        body: [
          "Cannabis flower is treated by the Thai notices as a controlled herb. It may be sold at licensed premises, in person, to adults 20 and over, against a prescription issued in Thailand; sale through electronic channels and advertising are prohibited. The ministerial regulation of April 2026 tightened which premises can hold a licence.",
          "That is a conditional permission, not a free market — but unlike the vape trade, it is a legal one. The full summary, with links to the government notices it restates, is in the tourist legal guide on this site.",
        ],
      },
      {
        h2: "If you arrived in Thailand with a vape in your bag",
        basis: "practice",
        body: [
          "This guide cannot tell you what will happen at any given checkpoint, and it does not try. What can be said is that the import ban applies at the border, that confiscation is the routine outcome, and that buying a replacement from a beach vendor puts money into exactly the trade the ban targets — with no recourse if the device is faulty or the liquid is not what it claims.",
          "The practical advice is unexciting: treat vaping the way you would treat any banned goods while you are a guest in the country, and do not let a street stall convince you the rule stopped existing because the stall does.",
        ],
      },
    ],
    faqTitle: "Vapes and the law: questions",
    faq: [
      {
        q: "Do you sell vapes, pods, cartridges or e-cigarettes?",
        a: "No, none of them, in any form — and no tobacco or nicotine pouches either. The sale of vaping devices is banned in Thailand, and LABS DISPENSARY is a licensed cannabis dispensary, not a smoke shop.",
      },
      {
        q: "Is there a legal vape shop anywhere in Pattaya?",
        a: "Under the current ban, selling vaping devices is prohibited nationwide, so a legally operating vape shop is not something this page can point you to. A stall selling them is trading outside the ban.",
      },
      {
        q: "Is cannabis flower legal, then?",
        a: "Under conditions, yes: licensed premises, in-person sale, age 20 and over, and a prescription issued in Thailand. The tourist legal guide on this site restates the official notices and links to them.",
      },
    ],
    cautionTitle: "What this page is not",
    caution:
      "This page is a plain-language summary written by a shop, not legal advice, and enforcement practice changes faster than any web page. Check official Thai government channels before relying on any of it.",
  },
  ru: {
    title: "Вейпы и каннабис в Таиланде: два разных закона",
    description:
      "Продажа и ввоз вейпов и электронных сигарет в Таиланде запрещены, и LABS DISPENSARY их не продаёт. Лицензированные соцветия каннабиса живут по отдельным правилам — вот чем эти режимы различаются.",
    h1: "Вейпы и каннабис в Таиланде регулируются двумя разными законами",
    kicker: "Вейпы и закон",
    basisLabels: {
      official: "Официальный источник",
      practice: "Практическая осторожность — не юридический вывод",
    },
    intro:
      "Многие находят этот сайт, когда ищут вейп-шоп в Паттайе, поэтому сэкономим вам время: мы не продаём вейпы, электронные сигареты, поды, никотиновые паучи и табак — ни в каком виде, и ни один лицензированный каннабис-магазин Таиланда не должен. Эти товары живут под двумя разными законами: один запрещает торговлю целиком, другой разрешает её на жёстких условиях, и путаница между ними — типичный способ туриста попасть в неприятности. Эта страница их разводит.",
    checklistTitle: "Коротко",
    checklist: [
      "Продажа и ввоз вейпов и электронных сигарет в Таиланде запрещены: ввоз — с 2014 года, продажа — с 2015-го.",
      "Любая точка, торгующая вейпами, работает вне этого запрета, что бы ни было написано на вывеске.",
      "LABS DISPENSARY не держит вейпы, электронные сигареты, картриджи, никотиновые паучи и табак.",
      "Соцветия каннабиса — отдельный режим: контролируемая трава, лицензированные помещения, продажа лично, взрослым от 20 лет, по рецепту, выданному в Таиланде.",
      "Правила по соцветиям со ссылками на официальные уведомления собраны в правовом гиде на этом сайте.",
    ],
    sections: [
      {
        h2: "Запрет вейпов: что именно запрещено",
        basis: "official",
        body: [
          "Таиланд запрещает ввоз и продажу электронных сигарет, вейп-устройств и жидкостей к ним. Ввоз закрыт уведомлением Министерства торговли, действующим с конца 2014 года; продажа — предписаниями совета по защите прав потребителей, действующими с начала 2015-го. Ни то ни другое не свежая и не временная мера, и обе касаются устройств и с никотином, и без него.",
          "Два запрета дотягиваются до разных людей через разные законы. Ввоз и владение ввезёнными устройствами попадают под таможенное право: рутинный исход — конфискация и штраф, посчитанный от стоимости товара. Продажу преследуют отдельно, по потребительским предписаниям с собственными санкциями для торговца. На двоих эти режимы накрывают и лоток, и его покупателя.",
        ],
      },
      {
        h2: "Почему каннабис-магазин обходит вейпы стороной",
        basis: "practice",
        body: [
          "Каннабис-лицензия в Таиланде условна и отзываема, а проверки — в прошлом неровные, сейчас заметно ужесточившиеся — чаще всего доходили до каннабис-магазинов Паттайи через что-то постороннее на полке, и повторяющийся пример здесь именно вейпы. Магазин, продающий вам вейп, показывает, как он взвешивает правила против выручки, — и это полезно знать до того, как доверять ему в чём-то ещё.",
          "Поэтому ответ у нашего прилавка простой: нет. Ни устройств, ни подов, ни жидкостей, ни табака. Если вы искали вейп-шоп — легальный эта страница подсказать не может: при действующем запрете такого в Таиланде не существует.",
        ],
      },
      {
        h2: "Соцветия каннабиса: режим, который существует",
        basis: "official",
        body: [
          "Соцветия каннабиса тайские уведомления относят к контролируемым травам. Продавать их можно в лицензированных помещениях, лично, взрослым от 20 лет, по рецепту, выданному в Таиланде; продажа через электронные каналы и реклама запрещены. Министерское постановление апреля 2026 года сузило круг помещений, которым доступна лицензия.",
          "Это разрешение на условиях, а не свободный рынок — но, в отличие от торговли вейпами, оно легально. Полная сводка со ссылками на уведомления, которые она пересказывает, — в правовом гиде для туристов на этом сайте.",
        ],
      },
      {
        h2: "Если вы приехали в Таиланд с вейпом в сумке",
        basis: "practice",
        body: [
          "Эта страница не скажет, что случится на конкретном досмотре, и не пытается. Сказать можно вот что: запрет на ввоз действует на границе, конфискация — рутинный исход, а покупка замены у пляжного торговца отправляет деньги ровно в ту торговлю, против которой запрет написан, — без каких-либо гарантий, если устройство неисправно или жидкость не то, чем названа.",
          "Практический совет скучный: относитесь к вейпингу как к любым запрещённым товарам, пока вы в гостях у этой страны, и не позволяйте уличному лотку убедить вас, что правило перестало существовать, потому что лоток существует.",
        ],
      },
    ],
    faqTitle: "Вейпы и закон: вопросы",
    faq: [
      {
        q: "Вы продаёте вейпы, поды, картриджи или электронные сигареты?",
        a: "Нет, ничего из перечисленного и ни в каком виде — как и табак с никотиновыми паучами. Продажа вейп-устройств в Таиланде запрещена, а LABS DISPENSARY — лицензированный каннабис-диспенсари, не смок-шоп.",
      },
      {
        q: "Есть ли в Паттайе легальный вейп-шоп?",
        a: "При действующем запрете продажа вейп-устройств закрыта по всей стране, поэтому легально работающий вейп-шоп эта страница подсказать не может. Точка, которая ими торгует, работает вне запрета.",
      },
      {
        q: "А соцветия каннабиса тогда легальны?",
        a: "На условиях — да: лицензированное помещение, продажа лично, возраст от 20 лет и рецепт, выданный в Таиланде. Правовой гид на этом сайте пересказывает официальные уведомления и ведёт на них по ссылкам.",
      },
    ],
    cautionTitle: "Чем эта страница не является",
    caution:
      "Это пересказ простыми словами, написанный магазином, а не юридическая консультация, и практика применения меняется быстрее любой веб-страницы. Прежде чем на что-то опираться, сверьтесь с официальными тайскими источниками.",
  },
};
