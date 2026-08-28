import type { Locale } from "@/lib/i18n";

/**
 * Дата первой публикации гида — уходит в `Article.datePublished`. Видимая и
 * машинная даты обновления берутся из `GUIDES_UPDATED_ON` (`@/data/guides`):
 * одна константа на весь знаниевый кластер, подпись собирает
 * `formatUpdatedLabel()`.
 *
 * Отдельной строки «источники сверены …» в шапке больше нет. Она заявляла
 * проделанную сверку, которой не было: домены `thaigov.go.th` и `thailand.go.th`
 * из окружения сборки не открываются, а рядом стояла вторая, другая дата — две
 * разные даты в шапке правовой страницы обесценивают обе.
 */
export const LEGAL_GUIDE_PUBLISHED_ON = "2026-08-16";

export const LEGAL_GUIDE_SOURCES = {
  thaiGovernment: "https://www.thaigov.go.th/th/news/166528",
  touristNotice:
    "https://thailand.go.th/public/issue-focus-detail/cannabis-now-strictly-regulated-in-thailand--important-notice-for-tourists",
  /**
   * Разъяснение Департамента тайской традиционной и альтернативной медицины
   * (Минздрав Таиланда) к министерскому постановлению พ.ศ. 2569 — первоисточник
   * по изменениям 2026 года.
   */
  ministerialRegulation2026: "https://med-cannabis.dtam.moph.go.th/law/2658/",
} as const;

/**
 * Основание раздела. `source` — пересказ двух уведомлений по ссылкам выше и
 * ничего сверх них. `caution` — практическая осторожность: то, как это выглядит
 * у прилавка и на границе. Разделение видимое, потому что смешивать их —
 * ровно тот способ, которым туристические гиды выдают догадку за норму.
 */
export type LegalGuideBasis = "source" | "caution";

export interface LegalGuideSection {
  h2: string;
  basis: LegalGuideBasis;
  body: string[];
}

export interface LegalGuideCopy {
  title: string;
  description: string;
  h1: string;
  intro: string;
  governmentSourceCta: string;
  touristSourceCta: string;
  /** Подпись ссылки на гид Минздрава по министерскому постановлению 2569 (2026). */
  ministerialSourceCta: string;
  factsTitle: string;
  facts: string[];
  basisLabels: Record<LegalGuideBasis, string>;
  sections: LegalGuideSection[];
  cautionTitle: string;
  caution: string;
  breadcrumb: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
}

export const LEGAL_GUIDE_COPY: Record<Locale, LegalGuideCopy> = {
  en: {
    title: "Thailand cannabis rules for tourists 2026 | Pattaya guide",
    description:
      "What Thailand's 2025 notices (B.E. 2568) say about cannabis flower, Thai prescriptions and the 30-day limit, and what the 2026 ministerial regulation changed.",
    h1: "Thailand cannabis rules for tourists in 2026",
    intro:
      "This page summarizes the official Thai notices that made cannabis flower a controlled herb in June 2025, the ministerial regulation that tightened licensing in April 2026, and then explains what those rules look like from the visitor's side of the counter in Pattaya. Everything is labelled: a block marked as an official source restates the notices and nothing more, a block marked as practical caution is experience and common sense, not a legal conclusion. This guide is not legal advice and does not confirm that any individual purchase is lawful.",
    governmentSourceCta: "Thai Government notice (17 July 2025)",
    touristSourceCta: "Official Thailand tourist notice",
    ministerialSourceCta: "Ministry of Public Health guidance on the 2026 ministerial regulation (Thai)",
    factsTitle: "What the official notices say",
    facts: [
      "The Thai Government notice says cannabis flower is a controlled herb and retail sale to the general public requires a prescription.",
      "The same notice says sales through vending machines, electronic channels or computer networks, and advertising through all channels are prohibited.",
      "The Thai Government notice limits a prescription to a supply of no more than 30 days, while the official tourist notice says tourists need a valid prescription issued in Thailand.",
      "The controlled-herb notice does not permit sale to anyone under 20 years of age, to a pregnant woman, or to a woman who is breastfeeding. That is the rule as written, not a shop policy.",
    ],
    basisLabels: {
      source: "Official source",
      caution: "Practical caution — not a legal conclusion",
    },
    sections: [
      {
        h2: "What the rule change did to buying cannabis in Thailand",
        basis: "source",
        body: [
          "The single fact a visitor needs to carry into a shop is this: cannabis flower is a controlled herb, and the Thai Government notice states that retail sale to the general public requires a prescription. The open, walk-in, nobody-asks-anything counter that a lot of travel writing still describes belongs to 2022 and 2023. It is not what the current notices describe, and a shop that behaves as if nothing changed is telling you something about itself.",
          "The same notice states that sale through vending machines, through electronic channels or computer networks, and advertising through all channels are prohibited. Two consequences follow directly from that sentence, and both of them are visible from the street. A licensed shop talks to you at the counter instead of publishing a public price list, and it does not take an order or a payment over the internet.",
          "The notice also limits a prescription to a supply of no more than 30 days. Nothing in either notice describes an exemption for foreign visitors, a tourist allowance, or a separate holiday regime.",
        ],
      },
      {
        h2: "What changed in 2026",
        basis: "source",
        body: [
          "The June 2025 notice is still the text that makes cannabis flower a controlled herb, but it is no longer the whole picture. A ministerial regulation on licensing the sale and processing of controlled herbs for commercial purposes (No. 2), B.E. 2569, was published on 29 April 2026 and took effect the following day. It narrows the kind of premises that may hold the licence: a medical facility, a pharmacy, or a registered herbal-products shop.",
          "The same regulation requires a person who has completed the official cannabis training to be present the whole time the premises is open, and it keeps cannabis flower tied to the controlled-herb prescription form, ภ.ท.33 (transliterated PT 33). The free-standing shop that held a sale licence and nothing else is the model the regulation is written to end.",
          "Nothing in the 2026 regulation creates an exemption for foreign visitors. The prescription requirement, the 30-day supply limit, the prohibition on sale through electronic channels and the prohibition on advertising all stand as the 2025 notice wrote them.",
        ],
      },
      {
        h2: "Prescriptions: what the notices actually require",
        basis: "source",
        body: [
          "The official tourist notice says tourists need a valid prescription issued in Thailand. That wording is worth reading twice, because it settles the question people ask most often: the document has to have been issued inside the country, and a prescription written at home is not what the notice describes.",
          "The 30-day boundary listed at the top of this page is an outer edge, not an allowance: the notice describes no way to stack prescriptions and no per-visit quantity separate from that limit.",
          "What the notices do not do is describe the procedure. Where a prescription is issued, what a consultation involves, and what a particular practitioner will or will not write are outside the published text, so everything about the procedure on this page sits in the blocks marked as practical caution.",
        ],
      },
      {
        h2: "Getting a prescription in practice",
        basis: "caution",
        body: [
          "In practice the document comes from a practitioner registered in Thailand, after a consultation in which you describe your situation and answer questions. It is a medical document with your name on it, not a form you tick on arrival, and it is worth treating it that way: keep the original with you rather than a photograph, and read what it says before you leave the consultation.",
          "Two questions save most of the confusion later. Ask what the document covers, and ask how long it stays valid — the 30-day supply limit in the government notice is the outer boundary, and an individual document can be narrower than that.",
          "We are a shop, not a clinic. We do not issue prescriptions, we do not arrange them, and anyone who offers a prescription without a consultation is offering something that does not match what the notices describe. If your situation is unusual — a chronic condition, medication you already take, a long stay — the right person to ask is a qualified professional in Thailand, before you plan a purchase around the answer.",
        ],
      },
      {
        h2: "Age, documents and what the counter check looks like in Pattaya",
        basis: "caution",
        body: [
          "Bring your passport. The age line for cannabis in Thailand is 20 years, and for a foreign visitor the passport is the document that proves both age and identity in a form the staff can read. A driving licence from home, a photo of a passport on a phone, or a hotel key card is not the same thing, and a shop that is doing its job will say so.",
          "Expect the check to happen every visit, not once. Expect the person behind the counter to look at the prescription as well as at the ID, and to ask questions if something does not line up — that is not suspicion, it is the shop keeping its licence.",
          "The reverse is the useful signal. A place that waves you through without looking at anything is not being friendly; it is showing you how it treats the rules it operates under. In a city with several hundred shops, that is a reason to walk out and pick a different door.",
        ],
      },
      {
        h2: "Why this website has no menu, no prices and no online orders",
        basis: "source",
        body: [
          "People assume the absence is an oversight, so it is worth stating plainly: a public price list, a basket, an order form or a product catalogue on a Thai cannabis website is not a convenience — it is the thing the two prohibitions listed at the top of this page name.",
          "So this site publishes what a website is allowed to publish — who we are, where the door is, how to walk there, what to bring, and what the official notices say. Questions about what is on the shelf on a given day are answered by a person, and the purchase itself happens at the counter, in the shop, with the documents in your hand.",
        ],
      },
      {
        h2: "Using it in Pattaya without creating a problem",
        basis: "caution",
        body: [
          "Not in public. Not on the beach, not on Beach Road, not on Walking Street, not in a soi, not in a hotel lobby or corridor. Public use is the single most common way a visitor turns a legal purchase into an encounter with the police, and it is entirely avoidable.",
          "Check your accommodation before you assume. A lot of hotels and condominium buildings in Pattaya prohibit smoking of any kind indoors, and a lot of them enforce it with a cleaning charge; smell travels through air conditioning and along corridors, and the complaint usually comes from a neighbour rather than from staff.",
          "Two more that people learn the expensive way: do not drive or ride a scooter after using, and do not hand anything to anyone else, particularly to someone under 20. Sharing is not a small favour in this context — it makes you the person who supplied it.",
        ],
      },
      {
        h2: "Leaving Thailand: do not put it in your luggage",
        basis: "caution",
        body: [
          "Whatever you have not used stays in Thailand. This applies at U-Tapao and at Suvarnabhumi in exactly the same way, and it applies to flower, to oils, to edibles and to CBD products, which travellers routinely assume are a separate category and which customs officers routinely do not.",
          "A Thai prescription is a Thai document. It does not authorise export, it has no effect at the border of another country, and the law that will be applied to you on arrival is that country's law — which in much of Asia and the Gulf is severe, and does not care where the item was purchased or how legally.",
          "The practical version: buy for the days you are actually here, and finish or leave behind what remains before you pack.",
        ],
      },
      {
        h2: "How to tell a licensed shop from someone selling on the street",
        basis: "caution",
        body: [
          "A licensed shop has a fixed address you can find on a map, a licence from the Ministry of Public Health displayed where you can read it, and staff who ask for your age and your documents before anything else happens. It discusses what it has at the counter, in person. It does not take payment through a website, and it does not advertise a price list to the public — because it is not allowed to.",
          "Someone selling on the street, in a bar, or through a chat channel has none of that. You cannot see a licence, you cannot see how the product was stored, you have no way to check what you have been handed, and you have no recourse afterwards. The saving is small and the exposure is not: outside the licensed system you are not a customer, you are a participant in an unlicensed transaction.",
          "If you only remember one test, remember this one — the shop that asks you for documents is the one protecting you, not the one making things difficult.",
        ],
      },
    ],
    cautionTitle: "Practical caution — not a legal conclusion",
    caution:
      "Rules, official guidance, and enforcement can change. Check the linked government notices before acting and seek qualified local advice when your situation is unclear. This guide does not guarantee eligibility to buy, possess, use, or travel with cannabis.",
    breadcrumb: "Tourist legal guide",
    faqTitle: "Tourist cannabis FAQ",
    faq: [
      {
        q: "Can tourists buy cannabis flower in Thailand?",
        a: "The official tourist notice says tourists need a valid prescription issued in Thailand. That is an official-source summary, not a guarantee that a particular person or transaction is compliant.",
      },
      {
        q: "Is a prescription from my own country enough?",
        a: "The tourist notice describes a prescription issued in Thailand. A document written abroad is not what that wording describes. Ask a qualified professional in Thailand before planning around a foreign document.",
      },
      {
        q: "How much can one prescription cover?",
        a: "The Thai Government notice limits a prescription to a supply of no more than 30 days. An individual document can be narrower than that limit.",
      },
      {
        q: "Can cannabis flower be ordered online in Thailand?",
        a: "The Thai Government notice says sales through vending machines, electronic channels or computer networks are prohibited. That is why this website has no basket, no price list and no order form.",
      },
      {
        q: "What is the minimum age in a Pattaya shop?",
        a: "20 years, and you should expect to prove it. Bring your passport rather than a photo of it, and expect the check on every visit.",
      },
      {
        q: "What should I bring with me to the shop?",
        a: "Your passport and your prescription in original form. A shop that does not ask for either is not doing what a licensed shop does.",
      },
      {
        q: "Can I smoke it in public in Pattaya?",
        a: "No. Public use — the beach, the street, a hotel lobby or corridor — is the most common way a legal purchase becomes a police matter. Many hotels and condominium buildings also prohibit smoking indoors.",
      },
      {
        q: "Can I take cannabis home with me when I leave?",
        a: "No. Leave it in Thailand, including oils, edibles and CBD products. A Thai prescription does not authorise export and has no effect under another country's law.",
      },
      {
        q: "How do I know a shop is licensed?",
        a: "A fixed address, a Ministry of Public Health licence displayed in the shop, staff who check your age and documents, and no public price list or online ordering — because the notices prohibit both.",
      },
      {
        q: "Which form is a Thai cannabis prescription written on?",
        a: "The controlled-herb prescription form is ภ.ท.33, transliterated PT 33. It is written by a practitioner registered in Thailand; a shop does not write it and cannot arrange one. Ask the clinic to confirm the form it issues on the day — form numbers are administrative and do get renumbered.",
      },
      {
        q: "Where can I check the current rules myself?",
        a: "Use the two official links on this page — the Thai Government notice and the official tourist notice. Rules and enforcement can change, so check the source rather than a travel article.",
      },
    ],
  },
  ru: {
    title: "Каннабис в Таиланде: правила для туристов 2026 | Паттайя",
    description:
      "Что говорят уведомления Таиланда 2025 года (พ.ศ. 2568): тайский рецепт, лимит 30 дней, запрет онлайн-продаж — и что изменило постановление 2026 года.",
    h1: "Правила каннабиса в Таиланде для туристов в 2026 году",
    intro:
      "Здесь изложены официальные уведомления Таиланда, сделавшие соцветия каннабиса контролируемой травой в июне 2025 года, министерское постановление, ужесточившее лицензирование в апреле 2026 года, а затем — как эти правила выглядят со стороны посетителя у прилавка в Паттайе. Всё размечено: блок с пометкой «официальный источник» пересказывает уведомления и ничего сверх них, блок с пометкой «практическая осторожность» — это опыт и здравый смысл, а не юридический вывод. Это не юридическая консультация и не подтверждение законности конкретной покупки.",
    governmentSourceCta: "Уведомление правительства Таиланда от 17 июля 2025 года",
    touristSourceCta: "Официальное уведомление Таиланда для туристов",
    ministerialSourceCta: "Разъяснение Минздрава Таиланда к постановлению 2569 / 2026 (на тайском)",
    factsTitle: "Что сказано в официальных уведомлениях",
    facts: [
      "Правительство Таиланда указывает, что соцветия каннабиса относятся к контролируемым травам, а для розничной продажи населению требуется рецепт.",
      "В том же уведомлении сказано, что запрещены продажи через автоматы, электронные каналы или компьютерные сети, а также реклама во всех каналах.",
      "Уведомление правительства ограничивает рецепт запасом не более чем на 30 дней, а официальное уведомление для туристов говорит, что туристам нужен действующий рецепт, выданный в Таиланде.",
      "Уведомление о контролируемых травах не допускает продажу лицам младше 20 лет, беременным и кормящим женщинам. Это норма в том виде, как она написана, а не политика магазина.",
    ],
    basisLabels: {
      source: "Официальный источник",
      caution: "Практическая осторожность — не юридический вывод",
    },
    sections: [
      {
        h2: "Что изменилось с лета 2025 года",
        basis: "source",
        body: [
          "Один факт, который стоит держать в голове у входа в магазин: соцветия каннабиса отнесены к контролируемым травам, и в уведомлении правительства сказано, что для розничной продажи населению нужен рецепт. Свободный прилавок, где ни о чём не спрашивают, — это 2022 и 2023 годы. Действующие уведомления описывают другую картину, и магазин, который ведёт себя так, будто ничего не менялось, сообщает о себе довольно много.",
          "В том же уведомлении сказано, что запрещены продажи через автоматы, электронные каналы и компьютерные сети, а также реклама во всех каналах. Из этой фразы прямо следуют две вещи, заметные с улицы: лицензированный магазин разговаривает с вами у прилавка, а не публикует прайс, и он не принимает ни заказ, ни оплату через интернет.",
          "Там же задан количественный предел: рецепт покрывает запас не более чем на 30 дней. Ни одно из двух уведомлений не описывает исключения для иностранных гостей, отдельной «туристической нормы» или курортного режима.",
        ],
      },
      {
        h2: "Что изменилось в 2026 году",
        basis: "source",
        body: [
          "Уведомление июня 2025 года по-прежнему остаётся тем текстом, который относит соцветия каннабиса к контролируемым травам, но теперь это не вся картина. Министерское постановление о разрешениях на продажу и переработку контролируемых трав в коммерческих целях (№ 2), พ.ศ. 2569, опубликовано 29 апреля 2026 года и вступило в силу на следующий день. Оно сужает круг помещений, которым может принадлежать лицензия: медицинское учреждение, аптека или зарегистрированный магазин растительных продуктов.",
          "То же постановление требует, чтобы человек, прошедший официальное обучение по медицинскому каннабису, находился на месте всё время работы заведения, и сохраняет привязку соцветий к форме рецепта на контролируемую траву — ภ.ท.33 (в латинице PT 33). Отдельно стоящий магазин, у которого была только лицензия на продажу, — это ровно та модель, которую постановление закрывает.",
          "Ничего похожего на исключение для иностранных гостей постановление 2026 года не вводит. Требование рецепта, предел в 30 дней, запрет продажи через электронные каналы и запрет рекламы действуют в том виде, в каком их написало уведомление 2025 года.",
        ],
      },
      {
        h2: "Рецепт: что именно требуют уведомления",
        basis: "source",
        body: [
          "Официальное уведомление для туристов говорит: туристу нужен действующий рецепт, выданный в Таиланде. Эту формулировку стоит прочитать дважды, потому что она закрывает самый частый вопрос — документ должен быть выдан внутри страны, и рецепт, выписанный дома, под это описание не подходит.",
          "Уведомление правительства задаёт границу по количеству: рецепт покрывает запас не более чем на 30 дней. Способа складывать рецепты в нём не описано, отдельной нормы «на один визит» — тоже.",
          "Чего в уведомлениях нет — так это описания процедуры. Где выдают рецепт, как проходит консультация и что конкретный врач напишет или не напишет, в опубликованном тексте не сказано, поэтому всё про процедуру на этой странице стоит в блоках с пометкой «практическая осторожность».",
        ],
      },
      {
        h2: "Как рецепт выглядит на практике",
        basis: "caution",
        body: [
          "На практике документ выдаёт специалист, зарегистрированный в Таиланде, после консультации, на которой вы описываете свою ситуацию и отвечаете на вопросы. Это медицинский документ с вашим именем, а не анкета на входе, и относиться к нему стоит соответственно: держите при себе оригинал, а не фотографию, и прочитайте, что в нём написано, до того как уйдёте с консультации.",
          "Два вопроса снимают большую часть последующей путаницы. Спросите, что документ покрывает, и спросите, сколько он действует: лимит в 30 дней из уведомления правительства — это внешняя граница, а конкретный документ может быть уже.",
          "Мы магазин, а не клиника. Рецепты мы не выдаём и не оформляем, а тот, кто предлагает рецепт без консультации, предлагает нечто, не совпадающее с описанием в уведомлениях. Если ситуация нестандартная — хроническое заболевание, постоянный приём лекарств, долгое пребывание, — спрашивать нужно у квалифицированного специалиста в Таиланде, и до того, как вы построите планы вокруг ответа.",
        ],
      },
      {
        h2: "Возраст, документы и как выглядит проверка у прилавка в Паттайе",
        basis: "caution",
        body: [
          "Возьмите паспорт. Возрастная граница для каннабиса в Таиланде — 20 лет, и для иностранного гостя именно паспорт подтверждает и возраст, и личность в форме, которую персонал может прочитать. Домашние водительские права, фотография паспорта в телефоне или карточка отеля — это не то же самое, и магазин, который работает как положено, вам об этом скажет.",
          "Проверка происходит каждый визит, а не один раз. Человек за прилавком посмотрит и на документ, и на рецепт, и задаст вопросы, если что-то не сходится. Это не подозрительность, а способ сохранить лицензию.",
          "Обратная ситуация — полезный сигнал. Место, где вас пропускают, ни во что не заглянув, не проявляет дружелюбие: оно показывает, как относится к правилам, по которым работает. В городе с несколькими сотнями магазинов это достаточная причина выйти и выбрать другую дверь.",
        ],
      },
      {
        h2: "Почему на этом сайте нет ни меню, ни цен, ни онлайн-заказа",
        basis: "source",
        body: [
          "Обычно это считают недоработкой, поэтому скажем прямо: уведомление правительства Таиланда запрещает продажу через электронные каналы и компьютерные сети и запрещает рекламу во всех каналах. Публичный прайс, корзина, форма заявки или каталог товара на тайском сайте о каннабисе — это не удобство, а ровно то, что названо в уведомлении.",
          "Поэтому сайт публикует то, что сайту публиковать можно: кто мы, где дверь, как до неё дойти, что взять с собой и что сказано в официальных уведомлениях. На вопрос, что стоит на полке в конкретный день, отвечает человек, а сама покупка происходит у прилавка, в магазине, с документами в руках.",
        ],
      },
      {
        h2: "Употребление в Паттайе без последствий",
        basis: "caution",
        body: [
          "Не в общественных местах. Не на пляже, не на Beach Road, не на Walking Street, не в переулке, не в лобби и не в коридоре отеля. Публичное употребление — самый частый способ превратить законную покупку в разговор с полицией, и он полностью избегаем.",
          "Проверьте правила жилья, прежде чем что-то предполагать. Многие отели и кондоминиумы в Паттайе запрещают курение любого рода внутри помещений и подкрепляют запрет счётом за уборку; запах идёт по кондиционированию и по коридору, и жалоба обычно приходит от соседа, а не от персонала.",
          "Ещё две вещи, которые узнают дорогой ценой: не садитесь за руль и за байк после употребления и не передавайте ничего другим людям, особенно тем, кому нет 20. В этом контексте «поделиться» — не мелкая любезность: так вы становитесь тем, кто предоставил.",
        ],
      },
      {
        h2: "Выезд из Таиланда: не кладите это в багаж",
        basis: "caution",
        body: [
          "Всё, что осталось неиспользованным, остаётся в Таиланде. Это одинаково верно в У-Тапао и в Суварнабхуми и одинаково относится к соцветиям, маслам, съедобным формам и к продуктам с КБД, которые путешественники привычно считают отдельной категорией, а таможенные службы — привычно нет.",
          "Тайский рецепт — тайский документ. Он не разрешает вывоз, не действует на границе другой страны, и применяться к вам по прилёте будет закон той страны, а он на значительной части Азии и в Персидском заливе суров и не интересуется тем, где и насколько законно вещь была куплена.",
          "Практическая версия: покупайте на те дни, что вы здесь, и разберитесь с остатком до того, как соберёте чемодан.",
        ],
      },
      {
        h2: "Почему покупка «с рук» — не альтернатива",
        basis: "caution",
        body: [
          "Русскоязычные гости чаще других задают вопрос, нельзя ли обойти рецепт и купить у знакомого, у продавца в баре или через чат. Ответ короткий: это не более лёгкий путь, а другой — вне лицензированной системы, где на вас не распространяется ничего из того, что защищает покупателя в магазине.",
          "Вы не видите лицензию, не знаете, что вам передали и как это хранилось, не можете ничего проверить и никуда не обратиться потом. Уличная сделка в Таиланде — это разговор не о правилах для трав, а о совсем других статьях, и участник такой сделки объясняется уже не в магазине.",
          "Легальный путь длиннее ровно на консультацию и документ. Всё остальное в нём проще: адрес на карте, лицензия на стене, вопрос о возрасте на входе и человек, с которым можно поговорить.",
        ],
      },
      {
        h2: "Как отличить лицензированный магазин от продавца на улице",
        basis: "caution",
        body: [
          "У лицензированного магазина есть постоянный адрес, который находится на карте, лицензия Министерства здравоохранения, вывешенная так, чтобы её можно было прочитать, и персонал, который спрашивает возраст и документы прежде всего остального. Он обсуждает наличие у прилавка, лично. Он не принимает оплату через сайт и не публикует прайс — потому что не имеет права.",
          "У продавца на улице, в баре или в переписке нет ничего из этого. Лицензию не посмотреть, условия хранения не увидеть, содержимое не проверить, обратиться потом некуда.",
          "Если запомнить один тест, пусть это будет такой: магазин, который просит у вас документы, вас защищает, а не усложняет вам жизнь.",
        ],
      },
    ],
    cautionTitle: "Практическое предостережение — не юридический вывод",
    caution:
      "Правила, официальные разъяснения и практика применения могут меняться. Перед любыми действиями проверьте ссылки на государственные источники, а при сомнениях обратитесь за квалифицированной консультацией на месте. Этот гид не гарантирует право покупать, хранить, употреблять или перевозить каннабис.",
    breadcrumb: "Правила для туристов",
    faqTitle: "FAQ для туристов",
    faq: [
      {
        q: "Может ли турист купить соцветия каннабиса в Таиланде?",
        a: "Официальное уведомление для туристов говорит о необходимости действующего рецепта, выданного в Таиланде. Это пересказ источника, а не гарантия законности для конкретного человека или сделки.",
      },
      {
        q: "Подойдёт ли рецепт из моей страны?",
        a: "В уведомлении для туристов сказано про рецепт, выданный в Таиланде. Документ, выписанный за границей, под это описание не подходит. Практическая осторожность, а не юридический вывод: спросите квалифицированного специалиста в Таиланде, прежде чем строить планы вокруг зарубежного документа.",
      },
      {
        q: "На какой срок рассчитан один рецепт?",
        a: "Уведомление правительства ограничивает рецепт запасом не более чем на 30 дней. Конкретный документ может быть выписан и на меньший срок.",
      },
      {
        q: "Можно заказать соцветия каннабиса онлайн в Таиланде?",
        a: "В уведомлении правительства сказано, что продажа через автоматы, электронные каналы или компьютерные сети запрещена. Поэтому на этом сайте нет ни корзины, ни прайса, ни формы заявки.",
      },
      {
        q: "С какого возраста пускают в магазин в Паттайе?",
        a: "С 20 лет, и возраст нужно будет подтвердить. Практическая осторожность: берите паспорт, а не его фотографию, и рассчитывайте на проверку при каждом визите.",
      },
      {
        q: "Что взять с собой в магазин?",
        a: "Практическая осторожность: паспорт и рецепт в оригинале. Магазин, который не просит ни того, ни другого, делает не то, что делает лицензированный магазин.",
      },
      {
        q: "Можно ли курить в общественных местах в Паттайе?",
        a: "Практическая осторожность, а не юридический вывод: нет. Пляж, улица, лобби или коридор отеля — самый частый способ превратить законную покупку в дело для полиции. Многие отели и кондоминиумы дополнительно запрещают курение внутри помещений.",
      },
      {
        q: "Можно ли увезти каннабис домой?",
        a: "Практическая осторожность: нет. Всё остаётся в Таиланде, включая масла, съедобные формы и продукты с КБД. Тайский рецепт не разрешает вывоз и не действует по закону другой страны.",
      },
      {
        q: "Что будет, если купить «с рук»?",
        a: "Практическая осторожность: вне лицензированной системы вы не покупатель, а участник сделки, к которой правила для контролируемых трав не применяются. Проверить содержимое, условия хранения и лицензию продавца невозможно, обратиться потом некуда.",
      },
      {
        q: "Где проверить актуальные правила самостоятельно?",
        a: "По двум официальным ссылкам на этой странице — уведомление правительства Таиланда и официальное уведомление для туристов. Правила и практика применения меняются, поэтому смотрите первоисточник, а не туристическую статью.",
      },
    ],
  },
  th: {
    title: "กฎกัญชาสำหรับนักท่องเที่ยวในไทย 2569 | คู่มือพัทยา",
    description:
      "สรุปประกาศทางการปี 2568: ช่อดอกกัญชาเป็นสมุนไพรควบคุม ต้องมีใบสั่งยาที่ออกในไทย จำกัด 30 วัน และกฎกระทรวงใหม่ พ.ศ. 2569 เปลี่ยนอะไรบ้าง",
    h1: "กฎกัญชาในไทยสำหรับนักท่องเที่ยว ปี 2569",
    intro:
      "หน้านี้สรุปประกาศทางการที่กำหนดให้ช่อดอกกัญชาเป็นสมุนไพรควบคุมเมื่อมิถุนายน 2568 และกฎกระทรวงที่คุมการอนุญาตเข้มขึ้นเมื่อเมษายน 2569 จากนั้นอธิบายว่ากฎเหล่านั้นมีหน้าตาอย่างไรเมื่อยืนอยู่หน้าเคาน์เตอร์ในพัทยา ทุกบล็อกมีป้ายกำกับ บล็อกที่ระบุว่าเป็นแหล่งข้อมูลทางการจะเล่าเฉพาะสิ่งที่ประกาศเขียนไว้ ส่วนบล็อกที่ระบุว่าเป็นคำเตือนเชิงปฏิบัติคือประสบการณ์และความระมัดระวัง ไม่ใช่ข้อสรุปทางกฎหมาย เนื้อหานี้ไม่ใช่คำปรึกษาทางกฎหมาย",
    governmentSourceCta: "ประกาศรัฐบาลไทย 17 กรกฎาคม 2568",
    touristSourceCta: "ประกาศทางการของไทยสำหรับนักท่องเที่ยว",
    ministerialSourceCta: "คู่มือกรมการแพทย์แผนไทยฯ ตามกฎกระทรวงใหม่ พ.ศ. 2569",
    factsTitle: "สิ่งที่ประกาศทางการระบุ",
    facts: [
      "ประกาศรัฐบาลไทยระบุว่าช่อดอกกัญชาเป็นสมุนไพรควบคุม และการขายปลีกแก่บุคคลทั่วไปต้องมีใบสั่งจ่ายยา",
      "ประกาศฉบับเดียวกันห้ามขายผ่านเครื่องอัตโนมัติ ช่องทางอิเล็กทรอนิกส์หรือเครือข่ายคอมพิวเตอร์ และห้ามโฆษณาทุกช่องทาง",
      "ประกาศรัฐบาลกำหนดให้ใบสั่งยาครอบคลุมปริมาณไม่เกิน 30 วัน และประกาศสำหรับนักท่องเที่ยวระบุว่านักท่องเที่ยวต้องมีใบสั่งยาที่ออกในประเทศไทย",
      "ประกาศสมุนไพรควบคุมไม่อนุญาตให้จำหน่ายแก่ผู้มีอายุต่ำกว่า 20 ปี สตรีมีครรภ์ และสตรีให้นมบุตร นี่คือข้อกำหนดตามที่เขียนไว้ ไม่ใช่นโยบายของร้าน",
    ],
    basisLabels: {
      source: "แหล่งข้อมูลทางการ",
      caution: "คำเตือนเชิงปฏิบัติ — ไม่ใช่ข้อสรุปทางกฎหมาย",
    },
    sections: [
      {
        h2: "สิ่งที่เปลี่ยนไปสำหรับผู้มาเยือน",
        basis: "source",
        body: [
          "ข้อเท็จจริงเดียวที่ควรจำก่อนเข้าร้านคือ ช่อดอกกัญชาเป็นสมุนไพรควบคุม และประกาศรัฐบาลไทยระบุว่าการขายปลีกแก่บุคคลทั่วไปต้องมีใบสั่งจ่ายยา ภาพร้านที่ใครก็เดินเข้าไปซื้อได้โดยไม่มีการถามอะไรเลยเป็นภาพของปี 2565 ถึง 2566 ไม่ใช่สิ่งที่ประกาศฉบับปัจจุบันอธิบายไว้",
          "ประกาศฉบับเดียวกันห้ามการขายผ่านเครื่องอัตโนมัติ ช่องทางอิเล็กทรอนิกส์หรือเครือข่ายคอมพิวเตอร์ และห้ามการโฆษณาทุกช่องทาง ผลที่ตามมาเห็นได้จากหน้าร้าน ร้านที่มีใบอนุญาตจะพูดคุยกับคุณที่เคาน์เตอร์แทนการประกาศรายการราคา และไม่รับคำสั่งซื้อหรือการชำระเงินผ่านอินเทอร์เน็ต",
          "ประกาศยังกำหนดเพดานปริมาณไว้ที่ไม่เกิน 30 วันต่อใบสั่งยาหนึ่งใบ และไม่มีข้อความใดในสองประกาศที่ระบุข้อยกเว้นสำหรับนักท่องเที่ยวต่างชาติ",
        ],
      },
      {
        h2: "สิ่งที่เปลี่ยนไปในปี 2569",
        basis: "source",
        body: [
          "ประกาศเดือนมิถุนายน 2568 ยังคงเป็นข้อความที่กำหนดให้ช่อดอกกัญชาเป็นสมุนไพรควบคุม แต่ไม่ใช่ภาพทั้งหมดอีกต่อไป กฎกระทรวงการอนุญาตให้จำหน่ายหรือแปรรูปสมุนไพรควบคุมเพื่อการค้า (ฉบับที่ 2) พ.ศ. 2569 ประกาศเมื่อ 29 เมษายน 2569 และมีผลบังคับใช้ในวันถัดมา กฎกระทรวงนี้จำกัดประเภทสถานที่ที่ขอรับใบอนุญาตได้ ให้เหลือเพียงสถานพยาบาล ร้านขายยา หรือร้านขายผลิตภัณฑ์สมุนไพรที่จดทะเบียนถูกต้อง",
          "กฎกระทรวงฉบับเดียวกันกำหนดให้ต้องมีผู้ผ่านการอบรมด้านกัญชาทางการแพทย์อยู่ประจำตลอดเวลาที่เปิดทำการ และคงการจ่ายช่อดอกผ่านใบสั่งจ่ายสมุนไพรควบคุม ภ.ท.33 ร้านที่ตั้งอยู่ลำพังโดยถือเพียงใบอนุญาตจำหน่ายคือรูปแบบที่กฎกระทรวงนี้เขียนขึ้นเพื่อยุติ",
          "กฎกระทรวงปี 2569 ไม่ได้สร้างข้อยกเว้นใดให้ผู้มาเยือนชาวต่างชาติ ข้อกำหนดเรื่องใบสั่งยา ปริมาณไม่เกิน 30 วัน การห้ามขายผ่านช่องทางอิเล็กทรอนิกส์ และการห้ามโฆษณา ยังคงเป็นไปตามที่ประกาศปี 2568 เขียนไว้",
        ],
      },
      {
        h2: "ใบสั่งยา: ประกาศเขียนไว้ว่าอย่างไร",
        basis: "source",
        body: [
          "ประกาศสำหรับนักท่องเที่ยวระบุว่าต้องมีใบสั่งยาที่ยังมีผลและออกในประเทศไทย ถ้อยคำนี้ตอบคำถามที่พบบ่อยที่สุด เอกสารต้องออกภายในประเทศ และใบสั่งยาที่เขียนจากประเทศของคุณไม่ตรงกับคำอธิบายนี้",
          "ประกาศรัฐบาลกำหนดขอบเขตด้านปริมาณไว้ที่ไม่เกิน 30 วัน ไม่มีการอธิบายวิธีนำใบสั่งยาหลายใบมารวมกัน และไม่มีการกำหนดโควตาต่อการเข้าร้านหนึ่งครั้งแยกต่างหาก",
          "สิ่งที่ประกาศไม่ได้อธิบายคือขั้นตอน ใครออกใบสั่งยา ปรึกษาอย่างไร และแพทย์แต่ละคนจะเขียนอะไร ไม่ได้อยู่ในข้อความที่เผยแพร่ ดังนั้นเนื้อหาเรื่องขั้นตอนทั้งหมดในหน้านี้จึงอยู่ในบล็อกคำเตือนเชิงปฏิบัติ",
        ],
      },
      {
        h2: "อายุ เอกสาร และการตรวจที่หน้าเคาน์เตอร์ในพัทยา",
        basis: "caution",
        body: [
          "พกหนังสือเดินทางมาด้วย เกณฑ์อายุสำหรับกัญชาในไทยคือ 20 ปี และสำหรับผู้มาเยือนชาวต่างชาติ หนังสือเดินทางคือเอกสารที่ยืนยันทั้งอายุและตัวตนในรูปแบบที่พนักงานอ่านได้ ใบขับขี่จากประเทศของคุณ ภาพถ่ายหนังสือเดินทางในโทรศัพท์ หรือคีย์การ์ดโรงแรม ไม่ใช่สิ่งเดียวกัน",
          "การตรวจจะเกิดขึ้นทุกครั้งที่มา ไม่ใช่ครั้งเดียว พนักงานจะดูทั้งเอกสารแสดงตนและใบสั่งยา และจะถามเมื่อมีอะไรไม่ตรงกัน นั่นไม่ใช่ความระแวง แต่คือวิธีที่ร้านรักษาใบอนุญาตของตนเอาไว้",
          "สัญญาณที่มีประโยชน์คือด้านตรงข้าม ร้านที่ปล่อยให้คุณเข้าไปโดยไม่ดูอะไรเลยไม่ได้กำลังเป็นมิตร แต่กำลังแสดงให้เห็นว่าเขาปฏิบัติต่อกฎที่ตนอยู่ภายใต้อย่างไร",
        ],
      },
      {
        h2: "ทำไมเว็บนี้จึงไม่มีเมนู ไม่มีราคา และไม่มีการสั่งซื้อ",
        basis: "source",
        body: [
          "ประกาศรัฐบาลไทยห้ามการขายผ่านช่องทางอิเล็กทรอนิกส์หรือเครือข่ายคอมพิวเตอร์ และห้ามการโฆษณาทุกช่องทาง รายการราคาสาธารณะ ตะกร้า แบบฟอร์มสั่งซื้อ หรือแคตตาล็อกสินค้าบนเว็บไซต์กัญชาในไทยจึงไม่ใช่ความสะดวก แต่เป็นสิ่งที่ประกาศระบุถึงโดยตรง",
          "เว็บนี้จึงเผยแพร่เฉพาะสิ่งที่เผยแพร่ได้ เราคือใคร ประตูอยู่ตรงไหน เดินมาอย่างไร ต้องเตรียมอะไร และประกาศทางการเขียนไว้ว่าอย่างไร ส่วนคำถามว่าวันนี้มีอะไรอยู่บนชั้น มีคนตอบให้ และการซื้อขายเกิดขึ้นที่เคาน์เตอร์เท่านั้น",
        ],
      },
      {
        h2: "การใช้ในพัทยาโดยไม่สร้างปัญหา",
        basis: "caution",
        body: [
          "ไม่ใช้ในที่สาธารณะ ไม่ใช้บนชายหาด บนถนนเลียบชายหาด บน Walking Street ในซอย ในล็อบบี้หรือทางเดินของโรงแรม การใช้ในที่สาธารณะคือวิธีที่พบบ่อยที่สุดที่ทำให้การซื้อที่ถูกกฎหมายกลายเป็นเรื่องกับเจ้าหน้าที่",
          "ตรวจสอบกฎของที่พักก่อน โรงแรมและคอนโดหลายแห่งในพัทยาห้ามสูบทุกชนิดภายในอาคารและคิดค่าทำความสะอาดเมื่อฝ่าฝืน กลิ่นเดินทางไปตามระบบปรับอากาศและทางเดิน และคำร้องเรียนมักมาจากเพื่อนบ้าน",
          "อีกสองข้อ อย่าขับรถหรือขี่มอเตอร์ไซค์หลังใช้ และอย่าส่งต่อให้ผู้อื่น โดยเฉพาะผู้ที่อายุต่ำกว่า 20 ปี การแบ่งปันในบริบทนี้ทำให้คุณกลายเป็นผู้จัดหา",
        ],
      },
      {
        h2: "การเดินทางออกนอกประเทศ",
        basis: "caution",
        body: [
          "สิ่งที่เหลือให้อยู่ในประเทศไทย ข้อนี้ใช้เหมือนกันทั้งที่อู่ตะเภาและสุวรรณภูมิ และใช้กับช่อดอก น้ำมัน ของกิน และผลิตภัณฑ์ CBD ที่ผู้เดินทางมักเข้าใจว่าเป็นคนละหมวด",
          "ใบสั่งยาไทยเป็นเอกสารของไทย ไม่อนุญาตให้นำออกนอกประเทศ และไม่มีผลที่ชายแดนของประเทศอื่น กฎหมายที่จะใช้กับคุณเมื่อไปถึงคือกฎหมายของประเทศปลายทาง",
          "แนวปฏิบัติที่ง่ายที่สุดคือ ซื้อเท่าที่ใช้ในวันที่อยู่ที่นี่ และจัดการส่วนที่เหลือก่อนเก็บกระเป๋า",
        ],
      },
      {
        h2: "ร้านที่มีใบอนุญาตต่างจากคนขายข้างถนนอย่างไร",
        basis: "caution",
        body: [
          "ร้านที่มีใบอนุญาตมีที่อยู่ถาวรที่ค้นเจอบนแผนที่ มีใบอนุญาตจากกระทรวงสาธารณสุขติดไว้ให้อ่านได้ และมีพนักงานที่ถามอายุและขอดูเอกสารก่อนอย่างอื่น ร้านแบบนี้คุยเรื่องของที่มีอยู่ที่เคาน์เตอร์ ไม่รับชำระเงินผ่านเว็บไซต์ และไม่ประกาศราคาต่อสาธารณะ เพราะทำไม่ได้",
          "คนขายข้างถนน ในบาร์ หรือผ่านแชท ไม่มีสิ่งเหล่านี้เลย คุณดูใบอนุญาตไม่ได้ ไม่รู้ว่าเก็บรักษามาอย่างไร ตรวจสอบสิ่งที่ได้รับไม่ได้ และไม่มีที่ให้ร้องเรียนภายหลัง",
        ],
      },
    ],
    cautionTitle: "คำเตือนเชิงปฏิบัติ — ไม่ใช่ข้อสรุปทางกฎหมาย",
    caution:
      "กฎ คำแนะนำทางการ และการบังคับใช้อาจเปลี่ยนแปลงได้ โปรดตรวจสอบประกาศรัฐบาลตามลิงก์ก่อนดำเนินการ และขอคำแนะนำจากผู้เชี่ยวชาญในพื้นที่หากไม่แน่ใจ คู่มือนี้ไม่รับรองสิทธิในการซื้อ ครอบครอง ใช้ หรือเดินทางพร้อมกัญชา",
    breadcrumb: "คู่มือกฎหมายสำหรับนักท่องเที่ยว",
    faqTitle: "คำถามสำหรับนักท่องเที่ยว",
    faq: [
      {
        q: "นักท่องเที่ยวซื้อช่อดอกกัญชาในไทยได้ไหม?",
        a: "ประกาศทางการสำหรับนักท่องเที่ยวระบุว่าต้องมีใบสั่งยาที่ออกในประเทศไทย ข้อความนี้เป็นการสรุปแหล่งข้อมูล ไม่ใช่การรับรองว่าบุคคลหรือธุรกรรมใดเป็นไปตามกฎหมาย",
      },
      {
        q: "ใบสั่งยาจากประเทศของฉันใช้ได้ไหม?",
        a: "ประกาศระบุถึงใบสั่งยาที่ออกในประเทศไทย เอกสารที่ออกจากต่างประเทศไม่ตรงกับคำอธิบายนั้น คำเตือนเชิงปฏิบัติ ไม่ใช่ข้อสรุปทางกฎหมาย",
      },
      {
        q: "ใบสั่งยาหนึ่งใบครอบคลุมเท่าไร?",
        a: "ประกาศรัฐบาลกำหนดไว้ไม่เกินปริมาณสำหรับ 30 วัน เอกสารแต่ละใบอาจกำหนดน้อยกว่านั้น",
      },
      {
        q: "สั่งซื้อช่อดอกกัญชาออนไลน์ในไทยได้ไหม?",
        a: "ประกาศรัฐบาลไทยระบุว่าห้ามขายผ่านเครื่องอัตโนมัติ ช่องทางอิเล็กทรอนิกส์หรือเครือข่ายคอมพิวเตอร์ เว็บนี้จึงไม่มีตะกร้า ไม่มีราคา และไม่มีแบบฟอร์ม",
      },
      {
        q: "อายุขั้นต่ำที่ร้านในพัทยาคือเท่าไร?",
        a: "20 ปี และต้องพิสูจน์ได้ คำเตือนเชิงปฏิบัติ พกหนังสือเดินทางตัวจริง ไม่ใช่ภาพถ่าย",
      },
      {
        q: "ต้องเตรียมอะไรมาที่ร้าน?",
        a: "คำเตือนเชิงปฏิบัติ หนังสือเดินทางและใบสั่งยาฉบับจริง ร้านที่ไม่ขอทั้งสองอย่างไม่ได้ทำสิ่งที่ร้านมีใบอนุญาตทำกัน",
      },
      {
        q: "สูบในที่สาธารณะในพัทยาได้ไหม?",
        a: "คำเตือนเชิงปฏิบัติ ไม่ใช่ข้อสรุปทางกฎหมาย ไม่ได้ ชายหาด ถนน ล็อบบี้หรือทางเดินโรงแรมเป็นเส้นทางที่พบบ่อยที่สุดที่ทำให้เรื่องกลายเป็นคดี",
      },
      {
        q: "นำกลับประเทศได้ไหม?",
        a: "คำเตือนเชิงปฏิบัติ ไม่ได้ ให้ทุกอย่างอยู่ในประเทศไทย รวมถึงน้ำมัน ของกิน และผลิตภัณฑ์ CBD ใบสั่งยาไทยไม่อนุญาตให้นำออกนอกประเทศ",
      },
      {
        q: "ตรวจสอบกฎปัจจุบันได้ที่ไหน?",
        a: "ใช้ลิงก์ทางการสองรายการในหน้านี้ กฎและการบังคับใช้เปลี่ยนแปลงได้ จึงควรดูจากต้นทางมากกว่าบทความท่องเที่ยว",
      },
    ],
  },
  ar: {
    title: "قواعد القنب للسياح في تايلاند 2026 | دليل باتايا",
    description:
      "ما تقوله إشعارات 2025 (2568): زهور القنب عشبة خاضعة للرقابة، وصفة صادرة في تايلاند، حد 30 يوما، وما غيّرته اللائحة الوزارية لعام 2026.",
    h1: "قواعد القنب في تايلاند للسياح لعام 2026",
    intro:
      "تلخص هذه الصفحة الإشعارات الرسمية التي جعلت زهور القنب عشبة خاضعة للرقابة في يونيو 2025، واللائحة الوزارية التي شددت الترخيص في أبريل 2026، ثم تشرح كيف تبدو هذه القواعد من جانب الزائر الواقف أمام الطاولة في باتايا. كل قسم موسوم: القسم الموسوم بمصدر رسمي يعيد صياغة الإشعارات ولا شيء غيرها، والقسم الموسوم بتنبيه عملي هو خبرة وحرص، وليس استنتاجا قانونيا. هذا الدليل ليس استشارة قانونية.",
    governmentSourceCta: "إشعار الحكومة التايلاندية بتاريخ 17 يوليو 2025",
    touristSourceCta: "الإشعار الرسمي التايلاندي للسياح",
    ministerialSourceCta: "إرشادات وزارة الصحة التايلاندية بشأن اللائحة الوزارية 2026 (بالتايلاندية)",
    factsTitle: "ما تقوله الإشعارات الرسمية",
    facts: [
      "يقول إشعار الحكومة التايلاندية إن زهور القنب عشبة خاضعة للرقابة وإن بيعها بالتجزئة لعامة الناس يتطلب وصفة طبية.",
      "ويقول الإشعار نفسه إن البيع عبر آلات البيع أو القنوات الإلكترونية أو شبكات الحاسوب، والإعلان عبر جميع القنوات، محظور.",
      "يحدد الإشعار الحكومي الوصفة بكمية لا تتجاوز احتياج 30 يوما، بينما يقول الإشعار الرسمي للسياح إن السائح يحتاج إلى وصفة سارية صادرة في تايلاند.",
      "لا يسمح إشعار الأعشاب الخاضعة للرقابة بالبيع لمن هم دون 20 عاما، ولا للحامل، ولا للمرضع. هذه هي القاعدة كما كُتبت، وليست سياسة متجر.",
    ],
    basisLabels: {
      source: "مصدر رسمي",
      caution: "تنبيه عملي — وليس استنتاجا قانونيا",
    },
    sections: [
      {
        h2: "ما الذي تغير بالنسبة للزائر",
        basis: "source",
        body: [
          "الحقيقة الوحيدة التي ينبغي حملها إلى باب المتجر هي أن زهور القنب عشبة خاضعة للرقابة، وأن إشعار الحكومة التايلاندية يقول إن البيع بالتجزئة لعامة الناس يتطلب وصفة طبية. أما صورة المتجر المفتوح الذي لا يسأل أحدا عن شيء فتعود إلى عامي 2022 و2023، وهي ليست ما تصفه الإشعارات الحالية.",
          "ويقول الإشعار نفسه إن البيع عبر آلات البيع أو القنوات الإلكترونية أو شبكات الحاسوب محظور، وإن الإعلان عبر جميع القنوات محظور كذلك. يترتب على ذلك أمران يراهما الزائر من الشارع: المتجر المرخص يتحدث إليك عند الطاولة بدل نشر قائمة أسعار، ولا يقبل طلبا ولا دفعا عبر الإنترنت.",
          "ويضع الإشعار حدا للكمية لا يتجاوز احتياج 30 يوما للوصفة الواحدة، ولا يرد في أي من الإشعارين استثناء للزوار الأجانب.",
        ],
      },
      {
        h2: "ما الذي تغيّر في 2026",
        basis: "source",
        body: [
          "لا يزال إشعار يونيو 2025 هو النص الذي يجعل زهور القنب عشبة خاضعة للرقابة، لكنه لم يعد الصورة كاملة. صدرت لائحة وزارية بشأن ترخيص بيع الأعشاب الخاضعة للرقابة ومعالجتها لأغراض تجارية (رقم 2) لعام 2569 في 29 أبريل 2026 وسرت في اليوم التالي، وهي تضيّق نوع المنشأة التي يجوز أن تحمل الرخصة: منشأة طبية، أو صيدلية، أو متجر منتجات عشبية مسجّل.",
          "وتشترط اللائحة نفسها وجود شخص أتمّ التدريب الرسمي على القنب الطبي طوال ساعات العمل، وتُبقي صرف الزهور مرتبطا بنموذج وصفة الأعشاب الخاضعة للرقابة ภ.ท.33 (بالحروف اللاتينية PT 33). أما المتجر القائم بذاته الذي لا يحمل سوى رخصة بيع فهو النموذج الذي كُتبت اللائحة لإنهائه.",
          "ولا تنشئ لائحة 2026 أي استثناء للزائر الأجنبي. فاشتراط الوصفة، وحد الثلاثين يوما، وحظر البيع عبر القنوات الإلكترونية، وحظر الإعلان، كلها قائمة كما كتبها إشعار 2025.",
        ],
      },
      {
        h2: "الوصفة: ما الذي تشترطه الإشعارات",
        basis: "source",
        body: [
          "يقول الإشعار الرسمي للسياح إن السائح يحتاج إلى وصفة سارية صادرة في تايلاند. هذه الصيغة تحسم السؤال الأكثر تكرارا: يجب أن تكون الوثيقة صادرة داخل البلاد، والوصفة المكتوبة في بلدك ليست ما يصفه الإشعار.",
          "ويضع الإشعار الحكومي حد الكمية عند احتياج 30 يوما، ولا يصف طريقة لجمع أكثر من وصفة، ولا ينشئ حصة منفصلة لكل زيارة.",
          "أما ما لا تصفه الإشعارات فهو الإجراء نفسه: أين تصدر الوصفة وكيف تجري الاستشارة ليسا في النص المنشور، ولذلك يقع كل ما يخص الإجراء في هذه الصفحة ضمن أقسام التنبيه العملي.",
        ],
      },
      {
        h2: "العمر والأوراق والمراجعة عند الطاولة في باتايا",
        basis: "caution",
        body: [
          "أحضر جواز سفرك. حد العمر للقنب في تايلاند هو 20 عاما، وبالنسبة للزائر الأجنبي فإن جواز السفر هو الوثيقة التي تثبت العمر والهوية معا بصيغة يقرأها الموظف. رخصة القيادة من بلدك أو صورة الجواز في الهاتف أو بطاقة الفندق ليست بديلا.",
          "توقع المراجعة في كل زيارة لا مرة واحدة، وتوقع أن ينظر الموظف إلى الوصفة كما ينظر إلى الهوية وأن يسأل إذا لم تتطابق التفاصيل. هذا ليس ارتيابا، بل هو الطريقة التي يحافظ بها المتجر على رخصته.",
          "والإشارة المفيدة هي العكس: المكان الذي يمرّرك دون أن ينظر إلى شيء لا يجاملك، بل يريك كيف يتعامل مع القواعد التي يعمل تحتها.",
        ],
      },
      {
        h2: "لماذا لا توجد قائمة ولا أسعار ولا طلب عبر هذا الموقع",
        basis: "source",
        body: [
          "إشعار الحكومة التايلاندية يحظر البيع عبر القنوات الإلكترونية أو شبكات الحاسوب ويحظر الإعلان عبر جميع القنوات. لذلك فإن قائمة أسعار عامة أو سلة شراء أو استمارة طلب على موقع قنب في تايلاند ليست خدمة إضافية، بل هي بالضبط ما يسميه الإشعار.",
          "وهكذا ينشر هذا الموقع ما يجوز نشره: من نحن، وأين الباب، وكيف تصل إليه، وماذا تحضر معك، وماذا تقول الإشعارات الرسمية. أما سؤال ما هو موجود اليوم فيجيب عنه شخص، وتتم عملية الشراء عند الطاولة داخل المتجر.",
        ],
      },
      {
        h2: "الاستخدام في باتايا دون مشكلات",
        basis: "caution",
        body: [
          "ليس في الأماكن العامة: لا على الشاطئ، ولا في الشارع، ولا في زقاق، ولا في بهو الفندق أو ممراته. الاستخدام العلني هو الطريقة الأكثر شيوعا لتحويل عملية شراء مشروعة إلى موقف مع الشرطة، وهو أمر يمكن تجنبه تماما.",
          "راجع قواعد مكان إقامتك قبل أن تفترض شيئا. كثير من الفنادق والمجمعات السكنية في باتايا تمنع التدخين بأي شكل داخل المبنى وتفرض رسوم تنظيف عند المخالفة، والرائحة تنتقل عبر التكييف وفي الممرات.",
          "ونقطتان أخيرتان: لا تقد سيارة أو دراجة بعد الاستخدام، ولا تناول شيئا لشخص آخر وخاصة من هم دون العشرين، لأن ذلك يجعلك أنت المورد.",
        ],
      },
      {
        h2: "مغادرة تايلاند",
        basis: "caution",
        body: [
          "ما لم تستخدمه يبقى في تايلاند. ينطبق ذلك في مطار أوتاباو وسوفارنابومي على السواء، وينطبق على الزهور والزيوت والمأكولات ومنتجات CBD التي يفترض المسافرون عادة أنها فئة منفصلة.",
          "الوصفة التايلاندية وثيقة تايلاندية: لا تصرح بالإخراج من البلاد ولا أثر لها على حدود دولة أخرى، والقانون الذي سيطبق عليك عند الوصول هو قانون بلد الوجهة.",
          "الخلاصة العملية: اشتر بقدر أيام إقامتك، وتخلص مما تبقى قبل أن تحزم حقيبتك.",
        ],
      },
      {
        h2: "كيف تميز متجرا مرخصا عن بائع في الشارع",
        basis: "caution",
        body: [
          "المتجر المرخص له عنوان ثابت تجده على الخريطة، ورخصة من وزارة الصحة العامة معلقة بحيث يمكن قراءتها، وموظفون يسألون عن العمر والأوراق قبل أي شيء آخر. يناقش ما لديه عند الطاولة وجها لوجه، ولا يقبل الدفع عبر موقع، ولا ينشر أسعارا للعموم لأنه غير مسموح بذلك.",
          "أما البائع في الشارع أو في حانة أو عبر محادثة فلا يملك شيئا من ذلك: لا رخصة تراها، ولا معرفة بطريقة التخزين، ولا وسيلة للتحقق مما تسلمته، ولا جهة تعود إليها لاحقا.",
        ],
      },
    ],
    cautionTitle: "تنبيه عملي — وليس استنتاجا قانونيا",
    caution:
      "قد تتغير القواعد والإرشادات الرسمية وطريقة تطبيقها. راجع الإشعارات الحكومية المرتبطة قبل التصرف واطلب مشورة محلية مؤهلة إذا لم تكن حالتك واضحة. لا يضمن هذا الدليل أهلية شراء القنب أو حيازته أو استخدامه أو السفر به.",
    breadcrumb: "الدليل القانوني للسياح",
    faqTitle: "أسئلة السياح",
    faq: [
      {
        q: "هل يستطيع السائح شراء زهور القنب في تايلاند؟",
        a: "يقول الإشعار الرسمي للسياح إنهم يحتاجون إلى وصفة سارية صادرة في تايلاند. هذا ملخص للمصدر وليس ضمانا لامتثال شخص أو معاملة بعينها.",
      },
      {
        q: "هل تكفي وصفة من بلدي؟",
        a: "يصف الإشعار وصفة صادرة في تايلاند، والوثيقة المكتوبة في الخارج ليست ما يصفه. تنبيه عملي وليس استنتاجا قانونيا.",
      },
      {
        q: "ما الكمية التي تغطيها وصفة واحدة؟",
        a: "يحدد إشعار الحكومة الوصفة بما لا يتجاوز احتياج 30 يوما، وقد تكون الوثيقة الفردية أضيق من هذا الحد.",
      },
      {
        q: "هل يمكن طلب زهور القنب عبر الإنترنت في تايلاند؟",
        a: "يقول إشعار الحكومة التايلاندية إن البيع عبر القنوات الإلكترونية أو شبكات الحاسوب محظور، ولذلك لا توجد في هذا الموقع سلة ولا قائمة أسعار ولا استمارة.",
      },
      {
        q: "ما الحد الأدنى للعمر في متجر بباتايا؟",
        a: "20 عاما مع إثبات ذلك. تنبيه عملي: أحضر جواز السفر نفسه لا صورته، وتوقع المراجعة في كل زيارة.",
      },
      {
        q: "ماذا أحضر معي إلى المتجر؟",
        a: "تنبيه عملي: جواز السفر والوصفة بصيغتهما الأصلية. المتجر الذي لا يطلب أيا منهما لا يفعل ما يفعله متجر مرخص.",
      },
      {
        q: "هل يمكن التدخين في الأماكن العامة في باتايا؟",
        a: "تنبيه عملي وليس استنتاجا قانونيا: لا. الشاطئ والشارع وبهو الفندق أو ممراته هي الطريق الأكثر شيوعا لتحويل الأمر إلى مسألة شرطة.",
      },
      {
        q: "هل يمكنني أخذ القنب معي عند المغادرة؟",
        a: "تنبيه عملي: لا. يبقى كل شيء في تايلاند، بما في ذلك الزيوت والمأكولات ومنتجات CBD. الوصفة التايلاندية لا تصرح بالإخراج.",
      },
      {
        q: "أين أراجع القواعد الحالية؟",
        a: "عبر الرابطين الرسميين في هذه الصفحة. قد تتغير القواعد وطريقة تطبيقها، فالأفضل مراجعة المصدر لا مقال سفر.",
      },
    ],
  },
  zh: {
    title: "2026 年泰国游客大麻规则 | 芭提雅指南",
    description:
      "2025 年（佛历 2568 年）官方通知怎么说：大麻花属受管制草药、需泰国签发的处方、30 天用量上限，以及 2026 年部级条例改了什么。",
    h1: "2026 年泰国游客大麻规则",
    intro:
      "本页概述了 2025 年 6 月把大麻花定为受管制草药的官方通知，以及 2026 年 4 月收紧牌照的部级条例，然后说明这些规则站在芭提雅柜台前是什么样子。每个区块都有标注：标为官方来源的区块只复述通知内容，标为实务提醒的区块是经验与谨慎，不是法律结论。本页不构成法律意见。",
    governmentSourceCta: "泰国政府通知（2025 年 7 月 17 日）",
    touristSourceCta: "泰国官方游客通知",
    ministerialSourceCta: "泰国卫生部关于 2026 年部级条例的指引（泰文）",
    factsTitle: "官方通知的内容",
    facts: [
      "泰国政府通知称，大麻花属于受管制草药，向公众零售需要处方。",
      "同一通知称，禁止通过自动售货机、电子渠道或计算机网络销售，并禁止通过任何渠道做广告。",
      "泰国政府通知将每份处方限制为不超过 30 天的用量；官方游客通知称，游客需要在泰国签发的有效处方。",
      "受管制草药通知不允许向未满 20 岁者、孕妇和哺乳期妇女销售。这是条文本身的规定，不是门店自定的政策。",
    ],
    basisLabels: {
      source: "官方来源",
      caution: "实务提醒——并非法律结论",
    },
    sections: [
      {
        h2: "对游客而言到底改了什么",
        basis: "source",
        body: [
          "走进店门前只需记住一件事：大麻花属于受管制草药，泰国政府通知写明向公众零售需要处方。很多旅游文章描述的那种走进去、没人问任何问题的柜台，属于 2022 和 2023 年，并不是现行通知所描述的情形。",
          "同一份通知禁止通过自动售货机、电子渠道或计算机网络销售，也禁止通过任何渠道做广告。由此直接产生两个从街上就能看到的后果：持牌门店在柜台跟你说明情况，而不是公开发布价目表；也不会通过网络接受下单或收款。",
          "通知同时把每份处方限制在不超过 30 天的用量。两份通知都没有为外国游客设置例外，也没有所谓的旅游配额。",
        ],
      },
      {
        h2: "2026 年改了什么",
        basis: "source",
        body: [
          "2025 年 6 月的通知仍然是把大麻花定为受管制草药的那份文本，但它已经不是全部。关于为商业目的销售、加工受管制草药之许可的部级条例（第 2 号）佛历 2569 年于 2026 年 4 月 29 日公布，次日生效。它收窄了可以持牌的场所类型：医疗机构、药店，或依法登记的草药产品店。",
          "同一条例要求完成官方医用大麻培训的人员在营业期间全程在场，并继续要求大麻花凭受管制草药处方笺 ภ.ท.33（拉丁转写 PT 33）发出。只持有一张销售牌照、别无其他资质的独立门店，正是这份条例要终结的模式。",
          "2026 年条例没有为外国访客设立任何例外。处方要求、30 天用量上限、禁止通过电子渠道销售、禁止广告，都仍按 2025 年通知的写法有效。",
        ],
      },
      {
        h2: "处方：通知到底要求什么",
        basis: "source",
        body: [
          "官方游客通知写明，游客需要在泰国签发的有效处方。这句话解决了最常见的疑问：文件必须在泰国境内签发，在本国开具的处方不属于通知所描述的情形。",
          "政府通知给出的是数量边界，即每份处方不超过 30 天用量。通知没有描述把多份处方叠加使用的方式，也没有另设“每次到店”的额度。",
          "通知没有描述的是流程本身：在哪里取得处方、问诊如何进行、具体医师会不会开具，都不在公开文本中。因此本页涉及流程的内容全部放在实务提醒区块。",
        ],
      },
      {
        h2: "年龄、证件与芭提雅柜台的查验",
        basis: "caution",
        body: [
          "请带护照。泰国大麻的年龄门槛是 20 岁，对外国访客而言，护照是同时证明年龄与身份、且店员能读懂的文件。本国驾照、手机里的护照照片或酒店房卡都不等同于护照。",
          "查验每次到店都会发生，不是只做一次。店员会同时看证件和处方，如果信息对不上还会追问。这不是怀疑，而是门店保住牌照的方式。",
          "反过来才是有用的信号：什么都不看就放你进去的店，不是友善，而是在向你展示它如何对待自己所处的规则。",
        ],
      },
      {
        h2: "为什么本网站没有菜单、价格和在线下单",
        basis: "source",
        body: [
          "泰国政府通知禁止通过电子渠道或计算机网络销售，并禁止通过任何渠道做广告。因此，泰国大麻网站上的公开价目表、购物车、订购表单或商品目录并不是便利功能，而正是通知点名的东西。",
          "所以本站只发布可以发布的内容：我们是谁、门在哪里、怎么走过来、需要带什么，以及官方通知怎么说。至于某一天架上有什么，由店员当面回答，购买本身只在店内柜台完成。",
        ],
      },
      {
        h2: "在芭提雅使用而不惹上麻烦",
        basis: "caution",
        body: [
          "不要在公共场所使用：沙滩、海滩路、Walking Street、小巷、酒店大堂和走廊都不行。公开使用是把一次合法购买变成警察事务的最常见方式，而且完全可以避免。",
          "先确认住处的规定。芭提雅很多酒店与公寓楼禁止在室内吸任何东西，并以清洁费执行；气味会顺着空调和走廊扩散，投诉通常来自邻居。",
          "还有两条：使用后不要开车或骑摩托车；不要把任何东西递给别人，尤其是未满 20 岁的人——在这种语境下，分享会让你成为提供者。",
        ],
      },
      {
        h2: "离开泰国时",
        basis: "caution",
        body: [
          "没用完的东西留在泰国。乌塔堡机场和素万那普机场同样适用，并且同样适用于花、油类、食品和 CBD 产品，旅客常以为后者属于另一类，海关通常不这么认为。",
          "泰国处方是泰国文件：它不授权带出境，在别国边境也没有效力，落地后适用于你的是目的地国家的法律。",
          "实务做法：按在泰停留的天数购买，收拾行李前处理掉剩余部分。",
        ],
      },
      {
        h2: "如何分辨持牌门店与街头卖家",
        basis: "caution",
        body: [
          "持牌门店有能在地图上找到的固定地址，有张贴出来、可以读到的公共卫生部牌照，店员会先问年龄和证件。它在柜台当面说明有什么，不通过网站收款，也不向公众公布价目表——因为不被允许。",
          "街头、酒吧或聊天软件里的卖家没有这些：看不到牌照，不知道储存条件，无法核验拿到手的是什么，事后也无处可找。",
        ],
      },
    ],
    cautionTitle: "实务提醒——并非法律结论",
    caution:
      "法规、官方指引和执法方式可能变化。行动前请查看所链接的政府通知；情况不明确时，请咨询合格的当地专业人士。本指南不保证任何人有资格购买、持有、使用或携带大麻旅行。",
    breadcrumb: "游客法律指南",
    faqTitle: "游客常见问题",
    faq: [
      {
        q: "游客可以在泰国购买大麻花吗？",
        a: "官方游客通知称，游客需要在泰国签发的有效处方。这只是对官方来源的概述，并不保证特定个人或交易合规。",
      },
      {
        q: "我本国开具的处方够用吗？",
        a: "通知描述的是在泰国签发的处方，境外开具的文件不属于该描述。实务提醒，并非法律结论。",
      },
      {
        q: "一份处方能覆盖多少？",
        a: "泰国政府通知限制为不超过 30 天的用量，具体文件可能比这一上限更短。",
      },
      {
        q: "可以在泰国网上订购大麻花吗？",
        a: "泰国政府通知称，禁止通过自动售货机、电子渠道或计算机网络销售。因此本站没有购物车、没有价目表、没有订购表单。",
      },
      {
        q: "芭提雅门店的最低年龄是多少？",
        a: "20 岁，并且需要能够证明。实务提醒：带护照原件而不是照片，并且每次到店都会查验。",
      },
      {
        q: "去店里需要带什么？",
        a: "实务提醒：护照与处方的原件。两样都不问的店，做的并不是持牌门店该做的事。",
      },
      {
        q: "可以在芭提雅公共场所吸食吗？",
        a: "实务提醒，并非法律结论：不可以。沙滩、街道、酒店大堂或走廊，是把事情变成警察事务的最常见路径。",
      },
      {
        q: "离境时可以带回家吗？",
        a: "实务提醒：不可以。包括油类、食品和 CBD 产品在内，全部留在泰国。泰国处方不授权带出境。",
      },
      {
        q: "在哪里查看当前规则？",
        a: "使用本页的两个官方链接。规则与执法可能变化，请查看来源而不是旅游文章。",
      },
    ],
  },
  ko: {
    title: "2026년 태국 관광객 대마 규정 | 파타야 가이드",
    description:
      "2025년(불기 2568년) 공식 공지 내용: 대마 꽃은 관리 대상 약초, 태국 발급 처방전, 30일분 상한, 그리고 2026년 부령이 바꾼 것.",
    h1: "2026년 태국 관광객 대마 규정",
    intro:
      "이 페이지는 2025년 6월 대마 꽃을 관리 대상 약초로 지정한 공식 공지와 2026년 4월 인허가를 강화한 부령을 요약하고, 그 규정이 파타야 매장 카운터 앞에서 어떻게 보이는지 설명합니다. 모든 블록에는 표시가 붙어 있습니다. 공식 출처로 표시된 블록은 공지 내용만 옮기고, 실무적 주의로 표시된 블록은 경험과 신중함이지 법률적 결론이 아닙니다. 이 안내는 법률 자문이 아닙니다.",
    governmentSourceCta: "태국 정부 공지(2025년 7월 17일)",
    touristSourceCta: "태국 정부의 관광객 공식 안내",
    ministerialSourceCta: "2026년 부령에 대한 태국 보건부 안내(태국어)",
    factsTitle: "공식 공지의 내용",
    facts: [
      "태국 정부 공지는 대마 꽃을 관리 대상 약초로 규정하고 일반 대중에게 소매 판매하려면 처방전이 필요하다고 밝힙니다.",
      "같은 공지는 자동판매기, 전자 채널 또는 컴퓨터 네트워크를 통한 판매와 모든 채널의 광고를 금지한다고 밝힙니다.",
      "태국 정부 공지는 처방을 최대 30일분으로 제한하며, 관광객 공식 안내는 관광객에게 태국에서 발급된 유효한 처방전이 필요하다고 밝힙니다.",
      "관리 대상 약초 공지는 만 20세 미만, 임신부, 수유부에 대한 판매를 허용하지 않습니다. 매장 방침이 아니라 조문 그대로의 규정입니다.",
    ],
    basisLabels: {
      source: "공식 출처",
      caution: "실무적 주의 — 법률적 결론이 아닙니다",
    },
    sections: [
      {
        h2: "관광객에게 실제로 달라진 것",
        basis: "source",
        body: [
          "매장 문을 열기 전에 기억할 사실은 하나입니다. 대마 꽃은 관리 대상 약초이고, 태국 정부 공지는 일반 대중에 대한 소매 판매에 처방전이 필요하다고 밝힙니다. 아무것도 묻지 않고 들어가서 사는 매장의 모습은 2022년과 2023년의 이야기이며 현행 공지가 설명하는 상황이 아닙니다.",
          "같은 공지는 자동판매기, 전자 채널, 컴퓨터 네트워크를 통한 판매와 모든 채널의 광고를 금지합니다. 여기서 길에서도 보이는 두 가지 결과가 나옵니다. 허가받은 매장은 가격표를 공개하는 대신 카운터에서 직접 설명하고, 인터넷으로 주문이나 결제를 받지 않습니다.",
          "공지는 처방 한 건을 최대 30일분으로 제한합니다. 두 공지 어디에도 외국인 방문객을 위한 예외나 관광객 한도는 없습니다.",
        ],
      },
      {
        h2: "2026년에 달라진 것",
        basis: "source",
        body: [
          "2025년 6월 공지는 여전히 대마 꽃을 관리 대상 약초로 규정하는 본문이지만, 이제 그것이 전부는 아닙니다. 상업 목적의 관리 대상 약초 판매·가공 허가에 관한 부령(제2호) 불기 2569년이 2026년 4월 29일 공포되어 다음 날 시행되었습니다. 이 부령은 허가를 받을 수 있는 시설을 의료기관, 약국, 또는 정식 등록된 약초 제품 판매점으로 좁혔습니다.",
          "같은 부령은 공식 의료용 대마 교육을 이수한 사람이 영업시간 내내 상주할 것을 요구하고, 대마 꽃은 계속해서 관리 대상 약초 처방 서식 ภ.ท.33(로마자 표기 PT 33)으로만 조제하도록 합니다. 판매 허가 하나만 들고 있던 독립 매장 형태가 바로 이 부령이 끝내려는 모델입니다.",
          "2026년 부령은 외국인 방문객을 위한 예외를 두지 않습니다. 처방전 요건, 30일분 상한, 전자 채널 판매 금지, 광고 금지는 모두 2025년 공지가 쓴 그대로 유효합니다.",
        ],
      },
      {
        h2: "처방전: 공지가 요구하는 것",
        basis: "source",
        body: [
          "관광객 공식 안내는 태국에서 발급된 유효한 처방전이 필요하다고 밝힙니다. 이 문장이 가장 자주 나오는 질문을 정리해 줍니다. 문서는 태국 국내에서 발급되어야 하며, 본국에서 받은 처방전은 공지가 설명하는 문서가 아닙니다.",
          "정부 공지는 수량의 경계를 정합니다. 처방 한 건은 30일분을 넘지 않습니다. 여러 처방을 합치는 방법도, 방문 한 번당 별도 한도도 공지에 없습니다.",
          "공지가 설명하지 않는 것은 절차입니다. 어디서 처방을 받는지, 진료가 어떻게 진행되는지는 공개된 문안에 없으므로, 절차에 관한 내용은 모두 실무적 주의 블록에 두었습니다.",
        ],
      },
      {
        h2: "나이, 서류, 파타야 카운터에서의 확인",
        basis: "caution",
        body: [
          "여권을 가져오세요. 태국에서 대마의 연령 기준은 20세이며, 외국인 방문객에게는 여권이 나이와 신원을 직원이 읽을 수 있는 형태로 함께 증명하는 문서입니다. 본국 운전면허증, 휴대폰 속 여권 사진, 호텔 카드키는 같은 것이 아닙니다.",
          "확인은 한 번이 아니라 방문할 때마다 이루어집니다. 직원은 신분증과 처방전을 함께 보고, 내용이 맞지 않으면 질문합니다. 의심이 아니라 매장이 허가를 지키는 방식입니다.",
          "반대가 오히려 신호입니다. 아무것도 보지 않고 들여보내는 곳은 친절한 것이 아니라, 자신이 지켜야 할 규정을 어떻게 다루는지 보여 주는 것입니다.",
        ],
      },
      {
        h2: "이 웹사이트에 메뉴와 가격, 온라인 주문이 없는 이유",
        basis: "source",
        body: [
          "태국 정부 공지는 전자 채널이나 컴퓨터 네트워크를 통한 판매를 금지하고 모든 채널의 광고를 금지합니다. 태국의 대마 웹사이트에 있는 공개 가격표, 결제 기능, 주문 양식, 상품 카탈로그는 편의 기능이 아니라 공지가 지목한 바로 그것입니다.",
          "그래서 이 사이트는 공개할 수 있는 것만 싣습니다. 우리가 누구인지, 문이 어디인지, 어떻게 걸어오는지, 무엇을 가져와야 하는지, 공식 공지가 무엇이라고 하는지입니다. 오늘 무엇이 있는지는 사람이 답하고, 구매는 매장 카운터에서만 이루어집니다.",
        ],
      },
      {
        h2: "파타야에서 문제를 만들지 않고 사용하기",
        basis: "caution",
        body: [
          "공공장소에서는 안 됩니다. 해변, 비치로드, Walking Street, 골목, 호텔 로비와 복도 모두 해당합니다. 공개된 장소에서의 사용은 합법적인 구매를 경찰 문제로 바꾸는 가장 흔한 경로이며 충분히 피할 수 있습니다.",
          "숙소 규정을 먼저 확인하세요. 파타야의 많은 호텔과 콘도는 실내 흡연을 전면 금지하고 청소 비용으로 이를 집행합니다. 냄새는 에어컨과 복도를 따라 퍼지고, 항의는 대개 이웃에게서 옵니다.",
          "두 가지 더 있습니다. 사용 후 운전이나 오토바이 운행은 하지 마세요. 그리고 다른 사람, 특히 20세 미만에게 건네지 마세요. 이 맥락에서 나눔은 곧 공급자가 되는 일입니다.",
        ],
      },
      {
        h2: "태국을 떠날 때",
        basis: "caution",
        body: [
          "쓰지 않은 것은 태국에 두고 가세요. 우타파오와 수완나품 모두 같으며, 꽃뿐 아니라 오일, 식용 제품, 그리고 여행자들이 흔히 별개 범주로 여기는 CBD 제품에도 그대로 적용됩니다.",
          "태국 처방전은 태국 문서입니다. 반출을 허가하지 않고 다른 나라 국경에서 효력이 없으며, 도착지에서 적용되는 것은 그 나라의 법입니다.",
          "실무적으로는 머무는 날짜만큼만 사고, 짐을 싸기 전에 남은 것을 정리하는 편이 낫습니다.",
        ],
      },
      {
        h2: "허가받은 매장과 길거리 판매자 구분법",
        basis: "caution",
        body: [
          "허가받은 매장에는 지도에서 찾을 수 있는 고정 주소가 있고, 읽을 수 있는 위치에 보건부 허가증이 걸려 있으며, 직원이 다른 무엇보다 먼저 나이와 서류를 확인합니다. 무엇이 있는지는 카운터에서 직접 설명하고, 웹사이트로 결제를 받지 않으며, 가격표를 공개하지 않습니다. 허용되지 않기 때문입니다.",
          "길거리나 바, 채팅으로 파는 쪽에는 그중 어느 것도 없습니다. 허가증을 볼 수 없고, 보관 상태를 알 수 없으며, 받은 것을 확인할 방법도, 나중에 문제를 제기할 곳도 없습니다.",
        ],
      },
    ],
    cautionTitle: "실무적 주의 — 법률적 결론이 아닙니다",
    caution:
      "규정, 공식 지침 및 집행 방식은 바뀔 수 있습니다. 행동하기 전에 연결된 정부 공지를 확인하고 상황이 불분명하면 자격을 갖춘 현지 전문가에게 문의하세요. 이 안내는 대마 구매, 소지, 사용 또는 휴대 여행 자격을 보장하지 않습니다.",
    breadcrumb: "관광객 법률 안내",
    faqTitle: "관광객 FAQ",
    faq: [
      {
        q: "관광객이 태국에서 대마 꽃을 구매할 수 있나요?",
        a: "관광객 공식 안내는 태국에서 발급된 유효한 처방전이 필요하다고 밝힙니다. 이는 공식 출처의 요약이며 특정 개인이나 거래의 준법성을 보장하지 않습니다.",
      },
      {
        q: "본국에서 받은 처방전으로 충분한가요?",
        a: "공지는 태국에서 발급된 처방전을 설명하며, 해외에서 작성된 문서는 그 설명에 해당하지 않습니다. 실무적 주의이며 법률적 결론이 아닙니다.",
      },
      {
        q: "처방 한 건은 어느 정도를 포함하나요?",
        a: "태국 정부 공지는 최대 30일분으로 제한합니다. 개별 문서는 그보다 짧을 수 있습니다.",
      },
      {
        q: "태국에서 대마 꽃을 온라인으로 주문할 수 있나요?",
        a: "태국 정부 공지는 자동판매기, 전자 채널 또는 컴퓨터 네트워크를 통한 판매를 금지합니다. 그래서 이 사이트에는 결제 기능도, 가격표도, 주문 양식도 없습니다.",
      },
      {
        q: "파타야 매장의 최소 연령은 몇 살인가요?",
        a: "20세이며 증명이 필요합니다. 실무적 주의: 사진이 아니라 여권 원본을 가져오고, 방문할 때마다 확인을 예상하세요.",
      },
      {
        q: "매장에 갈 때 무엇을 가져가야 하나요?",
        a: "실무적 주의: 여권과 처방전 원본입니다. 둘 다 요구하지 않는 매장은 허가받은 매장이 하는 일을 하고 있지 않습니다.",
      },
      {
        q: "파타야 공공장소에서 흡연할 수 있나요?",
        a: "실무적 주의이며 법률적 결론이 아닙니다: 안 됩니다. 해변, 거리, 호텔 로비나 복도는 문제가 경찰 사안으로 번지는 가장 흔한 경로입니다.",
      },
      {
        q: "출국할 때 가지고 갈 수 있나요?",
        a: "실무적 주의: 안 됩니다. 오일, 식용 제품, CBD 제품을 포함해 모두 태국에 두고 가세요. 태국 처방전은 반출을 허가하지 않습니다.",
      },
      {
        q: "현재 규정은 어디서 확인하나요?",
        a: "이 페이지의 공식 링크 두 개를 이용하세요. 규정과 집행은 바뀔 수 있으므로 여행 기사보다 출처를 확인하는 편이 낫습니다.",
      },
    ],
  },
  ja: {
    title: "2026年タイの大麻ルール（旅行者向け） | パタヤ",
    description:
      "2025年（仏暦2568年）の公式通知の内容。大麻花は管理対象ハーブ、タイで発行された処方、30日分の上限、そして2026年省令が変えたこと。",
    h1: "2026年タイ旅行者向け大麻ルール",
    intro:
      "このページは、2025年6月に大麻花を管理対象ハーブとした公式通知と、2026年4月に許可要件を厳しくした省令を要約し、そのうえで、そのルールがパタヤのカウンターの前ではどう見えるかを説明します。各ブロックには表示があります。公式情報と示したブロックは通知の内容だけを述べ、実務上の注意と示したブロックは経験と慎重さであって法的判断ではありません。本ページは法律相談ではありません。",
    governmentSourceCta: "タイ政府通知（2025年7月17日）",
    touristSourceCta: "タイ政府の旅行者向け公式通知",
    ministerialSourceCta: "2026年省令に関するタイ保健省の手引き（タイ語）",
    factsTitle: "公式通知に書かれていること",
    facts: [
      "タイ政府通知は、大麻花を管理対象のハーブとし、一般向けの小売販売には処方が必要だとしています。",
      "同じ通知は、自動販売機、電子チャネルまたはコンピューターネットワークを通じた販売と、あらゆるチャネルでの広告を禁止するとしています。",
      "タイ政府通知は処方を30日分以内に制限し、旅行者向け公式通知は旅行者にタイで発行された有効な処方が必要だとしています。",
      "管理対象ハーブの通知は、20歳未満、妊娠中の人、授乳中の人への販売を認めていません。店の方針ではなく、条文どおりの規定です。",
    ],
    basisLabels: {
      source: "公式情報",
      caution: "実務上の注意 — 法的判断ではありません",
    },
    sections: [
      {
        h2: "旅行者にとって何が変わったのか",
        basis: "source",
        body: [
          "店の扉を開ける前に覚えておく事実は一つです。大麻花は管理対象のハーブであり、タイ政府通知は一般向けの小売販売に処方が必要だとしています。何も聞かれずに買える店という描写は2022年と2023年のものであり、現行の通知が説明している状況ではありません。",
          "同じ通知は、自動販売機、電子チャネル、コンピューターネットワークを通じた販売と、あらゆるチャネルでの広告を禁止しています。ここから通りからでも見える二つの帰結が生じます。許可を受けた店は価格表を公開する代わりにカウンターで直接説明し、インターネット経由の注文も支払いも受け付けません。",
          "通知は処方1件あたり30日分以内という数量の上限も定めています。2件の通知のいずれにも、外国人旅行者向けの例外や観光客枠はありません。",
        ],
      },
      {
        h2: "2026年に変わったこと",
        basis: "source",
        body: [
          "2025年6月の通知は、いまも大麻花を管理対象ハーブとする本文ですが、それだけではもう全体像になりません。商業目的での管理対象ハーブの販売・加工の許可に関する省令（第2号）仏暦2569年が2026年4月29日に公布され、翌日施行されました。許可を受けられる施設は、医療機関、薬局、または正規に登録されたハーブ製品店に絞られています。",
          "同じ省令は、公式の医療用大麻研修を修了した者が営業時間中ずっと常駐することを求め、大麻花は引き続き管理対象ハーブの処方書式 ภ.ท.33（ラテン文字表記 PT 33）で交付されます。販売許可だけを持つ独立店舗という形が、この省令が終わらせようとしているものです。",
          "2026年省令に外国人旅行者向けの例外はありません。処方の要件、30日分の上限、電子チャネルでの販売禁止、広告禁止は、いずれも2025年通知が書いたとおり有効です。",
        ],
      },
      {
        h2: "処方：通知が求めていること",
        basis: "source",
        body: [
          "旅行者向け公式通知は、タイで発行された有効な処方が必要だとしています。この一文が最も多い疑問に答えます。書類はタイ国内で発行されている必要があり、自国で書かれた処方は通知が説明するものではありません。",
          "政府通知が定めるのは数量の境界で、処方1件は30日分を超えません。複数の処方を重ねる方法も、来店ごとの別枠も通知にはありません。",
          "通知が説明していないのは手続きそのものです。どこで処方を受けるのか、診察がどう進むのかは公開文にないため、手続きに関する記述はすべて実務上の注意のブロックに置いています。",
        ],
      },
      {
        h2: "年齢、書類、パタヤの店頭での確認",
        basis: "caution",
        body: [
          "パスポートを持参してください。タイでの大麻の年齢基準は20歳で、外国人旅行者にとってパスポートは年齢と身分をスタッフが読める形で同時に示す書類です。自国の運転免許証、スマートフォンの中のパスポート画像、ホテルのカードキーは同じものではありません。",
          "確認は一度きりではなく来店のたびに行われます。スタッフは身分証と処方の両方を見て、内容が合わなければ質問します。疑っているのではなく、店が許可を守るための手順です。",
          "むしろ逆が手がかりです。何も見ずに通す店は親切なのではなく、自分が従うべきルールをどう扱っているかを見せています。",
        ],
      },
      {
        h2: "このサイトにメニューも価格もインターネット経由の注文もない理由",
        basis: "source",
        body: [
          "タイ政府通知は電子チャネルまたはコンピューターネットワークを通じた販売を禁止し、あらゆるチャネルでの広告を禁止しています。タイの大麻関連サイトにある公開価格表、買い物かご、注文フォーム、商品カタログは便利機能ではなく、通知が名指ししているものそのものです。",
          "そのため、このサイトは公開してよいものだけを載せています。私たちが誰か、扉はどこか、どう歩けば着くか、何を持参するか、公式通知は何と書いているか。今日は何が棚にあるのかは人が答え、購入は店のカウンターでのみ行われます。",
        ],
      },
      {
        h2: "パタヤで問題を起こさない使い方",
        basis: "caution",
        body: [
          "公共の場では使わないでください。ビーチ、ビーチロード、Walking Street、ソイ、ホテルのロビーや廊下、いずれも同じです。人目のある場所での使用は、合法的な買い物を警察の案件に変える最も多い経路であり、完全に避けられます。",
          "宿泊先の規則を先に確認してください。パタヤの多くのホテルやコンドミニアムは屋内での喫煙を一切禁止し、清掃費用でそれを運用しています。においは空調と廊下を伝って広がり、苦情はたいてい隣室から来ます。",
          "もう二つ。使用後に車やバイクを運転しないこと、そして他人、とくに20歳未満に手渡さないこと。この文脈での「分ける」は、あなたを提供した側にします。",
        ],
      },
      {
        h2: "タイを出るとき",
        basis: "caution",
        body: [
          "使い切らなかったものはタイに置いていってください。ウタパオでもスワンナプームでも同じであり、花だけでなくオイル、食品、そして旅行者が別カテゴリーだと思いがちなCBD製品にも同じように当てはまります。",
          "タイの処方はタイの書類です。国外への持ち出しを認めるものではなく、他国の国境では効力を持ちません。到着地で適用されるのはその国の法律です。",
          "実務的には、滞在日数の分だけ買い、荷造りの前に残りを片づけるのが確実です。",
        ],
      },
      {
        h2: "許可店と路上の売り手の見分け方",
        basis: "caution",
        body: [
          "許可を受けた店には地図で見つかる固定の住所があり、読める場所に保健省の許可証が掲示され、スタッフが何よりも先に年齢と書類を確認します。何があるかはカウンターで直接説明し、ウェブサイトで支払いを受けず、価格表を公開しません。認められていないからです。",
          "路上やバー、チャットで売る相手にはそのどれもありません。許可証は見えず、保管状態も分からず、渡されたものを確かめる方法も、後から申し出る先もありません。",
        ],
      },
    ],
    cautionTitle: "実務上の注意 — 法的判断ではありません",
    caution:
      "規則、公式案内、運用は変わる可能性があります。行動前にリンク先の政府通知を確認し、状況が不明な場合は現地の有資格専門家に相談してください。このガイドは、大麻の購入、所持、使用、携行の適格性を保証しません。",
    breadcrumb: "旅行者向け法律ガイド",
    faqTitle: "旅行者FAQ",
    faq: [
      {
        q: "旅行者はタイで大麻花を購入できますか？",
        a: "旅行者向け公式通知は、タイで発行された有効な処方が必要だとしています。これは公式情報の要約であり、特定の人や取引の適法性を保証するものではありません。",
      },
      {
        q: "自国で受け取った処方で足りますか？",
        a: "通知が説明しているのはタイで発行された処方であり、国外で作成された書類はその説明に当たりません。実務上の注意であり、法的判断ではありません。",
      },
      {
        q: "処方1件はどれくらいをカバーしますか？",
        a: "タイ政府通知は30日分以内に制限しています。個別の書類はそれより短い場合があります。",
      },
      {
        q: "タイで大麻花をインターネット経由で注文できますか？",
        a: "タイ政府通知は、自動販売機、電子チャネルまたはコンピューターネットワークを通じた販売を禁止するとしています。だからこのサイトには買い物かごも価格表も注文フォームもありません。",
      },
      {
        q: "パタヤの店の年齢制限は？",
        a: "20歳以上で、証明が必要です。実務上の注意として、画像ではなくパスポートの原本を持参し、来店のたびに確認があると考えてください。",
      },
      {
        q: "店に行くとき何を持っていけばよいですか？",
        a: "実務上の注意として、パスポートと処方の原本です。どちらも求めない店は、許可店がしていることをしていません。",
      },
      {
        q: "パタヤの公共の場で吸えますか？",
        a: "実務上の注意であり法的判断ではありません。できません。ビーチ、通り、ホテルのロビーや廊下は、話が警察の案件になる最も多い経路です。",
      },
      {
        q: "帰国時に持ち帰れますか？",
        a: "実務上の注意として、できません。オイル、食品、CBD製品を含め、すべてタイに残してください。タイの処方は持ち出しを認めません。",
      },
      {
        q: "現在のルールはどこで確認できますか？",
        a: "このページにある2つの公式リンクをご利用ください。ルールも運用も変わるため、旅行記事ではなく情報源を確認してください。",
      },
    ],
  },
};
