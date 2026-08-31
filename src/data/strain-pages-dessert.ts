import type { Locale } from "@/lib/i18n";
import type { StrainPageCopy, StrainPages } from "@/data/strain-pages";
import { buildStrainFacts } from "./strain-catalog.ts";

/**
 * ТЕКСТ СТРАНИЦ СОРТОВ: десертно-печенечная семья.
 *
 * GSC, Gelato, Wedding Cake, Do-Si-Dos — четыре растения одной ароматической
 * семьи, три из которых происходят от первого. Риск шаблона здесь максимальный
 * во всём кластере: «сладкое тесто, цитрус, тяжесть в теле» можно написать
 * четыре раза подряд и не заметить.
 *
 * Разводит их фактура, которой у соседа нет: у GSC — давление правообладателя
 * на имя и реальное расхождение каталогов в классификации; у Gelato — номер
 * отбора и то, что это семья, а не одно растение; у Wedding Cake — клоновость и
 * то, что имя дали гроверы, а не селекционер; у Do-Si-Dos — линалоол в первой
 * тройке, чего нет больше нигде на этих страницах.
 *
 * Блок фактов собирается `buildStrainFacts(slug, locale)` из набора данных.
 */

function withFacts(
  slug: string,
  locale: Locale,
  copy: Omit<StrainPageCopy, "facts">,
): StrainPageCopy {
  return { ...copy, facts: buildStrainFacts(slug, locale) };
}

export const DESSERT_STRAIN_PAGES: StrainPages = {
  "girl-scout-cookies": {
    en: withFacts("girl-scout-cookies", "en", {
      thingName: "GSC",
      title: "GSC (Girl Scout Cookies): the plant that started the dessert era",
      description:
        "How a Bay Area cross of OG Kush and Durban Poison produced the ancestor of most modern menus, why it is now listed as GSC, and why catalogues cannot agree on which way it leans.",
      h1: "GSC: the ancestor almost every dessert name traces back to",
      kicker: "Strain notes",
      lead:
        "If you look at a menu anywhere in the world today and see a list of names that sound like confectionery, you are looking at the descendants of one Bay Area plant. Gelato, Wedding Cake, Do-Si-Dos and most of what a shop calls exotic came out of this cross or out of something that did. It is the single most consequential cultivar of the last fifteen years.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "OG Kush meets Durban Poison",
          body: [
            "The parents usually given are OG Kush and Durban Poison, and the pairing explains the plant completely. OG Kush brings gas and density; Durban Poison, a South African line, brings a mint-and-liquorice lift that nothing in the Kush family has. The collision of those two is the whole dessert register.",
            "The Cookie Fam in the Bay Area is credited with the work in the early 2010s. Within a few years the aromatic vocabulary of the entire trade had changed: before this plant, a menu described pine, fuel, skunk and citrus, and after it, menus described baked goods.",
            "It is worth being clear that the baking note is not sugar. Beta-caryophyllene and limonene lead the reported terpenes, which is a peppery-citrus pairing; the impression of dough and zest over an earthy floor is what those two do together, not what any sweetener does.",
          ],
        },
        {
          h2: "Why it is written GSC now",
          body: [
            "The youth organisation of the same name applied trademark pressure, and the trade responded by contracting the name. GSC is what most sellers print, and it means the same plant. This is the second example in this cluster of a cultivar renamed by a lawyer rather than a breeder; GG4 is the other.",
            "The pattern is worth recognising because it runs the other way too. A name that gets shortened for legal reasons stays attached to the same genetics, while a name that gets famous attracts genetics it never had. One is a relabelling, the other is a substitution.",
            "The catalogue entry on this site keeps the full name as an alternative label precisely because that is what people search for and ask for at a counter, while printing the short form the trade actually uses.",
          ],
        },
        {
          h2: "A classification that genuinely does not resolve",
          body: [
            "Catalogues disagree about whether this leans indica or sativa, and the disagreement is real rather than sloppy. It has a heavy Kush parent and an equatorial African parent, and different selections express different sides of that inheritance.",
            "So the facts table above marks the type as disputed and says so in the row itself, on every language version of this page. A confident single word there would be easier to read and would be worse information.",
            "The character descriptions collected around it point in both directions at once: weight in the body, but conversational and dreamy rather than settling. That is exactly what a plant with those two parents ought to produce, and it is a good reminder that the indica-and-sativa vocabulary is a rough map rather than a measurement.",
          ],
        },
        {
          h2: "Telling it from its own descendants",
          body: [
            "Gelato is its child and the difference is dairy: Sunset Sherbet pushes cream and citrus where this pushes dough and mint. Wedding Cake, further down the same line, is vanilla frosting over a gassy floor. Do-Si-Dos crossed back into the OG side and came out heavier and slower.",
            "The mint is this plant's own signature and the one thing the descendants mostly lost. If a jar sold as GSC has no green, minty lift over the dough, it may be a fine plant but it is not showing the Durban Poison half.",
            "Eight to ten weeks of bloom is the usual report — a wide window for a plant this widely grown, and another sign of how much variation the name covers after fifteen years of re-selection.",
          ],
        },
      ],
      faqTitle: "GSC: common questions",
      faq: [
        {
          q: "Why is it called GSC and not the full name?",
          a: "Trademark pressure from the youth organisation of the same name. The trade contracted the name; the plant behind it did not change.",
        },
        {
          q: "Does it smell sweet?",
          a: "It smells of dough, mint, lemon and clove over damp earth. The impression of baking comes from caryophyllene and limonene together, not from anything sugary.",
        },
        {
          q: "Which strains descend from it?",
          a: "Gelato, Wedding Cake and Do-Si-Dos are all on this site, and a large share of everything else a modern menu calls exotic traces back here.",
        },
      ],
      disclaimerTitle: "What this page is for",
      disclaimer:
        "It describes a cultivar and its influence on what a menu looks like today. It is not an offer and not health advice: no price, no weight, no stock and no claim that any plant treats or relieves a condition. Sales are in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("girl-scout-cookies", "ru", {
      thingName: "GSC",
      title: "Сорт GSC (Girl Scout Cookies): начало десертной эпохи",
      description:
        "Как скрещивание OG Kush с Durban Poison в области залива Сан-Франциско дало предка современных меню, почему его теперь пишут GSC и почему каталоги не сходятся в классификации.",
      h1: "GSC: предок, к которому сводится почти каждое десертное имя",
      kicker: "Заметки о сорте",
      lead:
        "Если сегодня посмотреть на меню в любой точке мира и увидеть список названий, звучащих как кондитерская, — вы смотрите на потомков одного растения из области залива Сан-Франциско. Gelato, Wedding Cake, Do-Si-Dos и большая часть того, что магазин называет экзотикой, вышли из этого скрещивания или из чего-то, что из него вышло. Это самый последствательный сорт последних пятнадцати лет.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "OG Kush встречает Durban Poison",
          body: [
            "Родителями обычно называют OG Kush и Durban Poison, и эта пара объясняет растение целиком. OG Kush приносит газ и плотность; Durban Poison, южноафриканская линия, приносит мятно-лакричный подъём, которого в кушевой семье нет ни у кого. Столкновение этих двух и есть весь десертный регистр.",
            "Работу начала 2010-х приписывают Cookie Fam из района залива. За несколько лет ароматический словарь всей отрасли сменился: до этого растения меню описывало хвою, топливо, скунс и цитрус, а после — выпечку.",
            "Стоит проговорить прямо: нота выпечки — это не сахар. В отчётах первыми идут бета-кариофиллен и лимонен, то есть перечно-цитрусовая пара; впечатление теста и цедры поверх землистого пола создают именно они вдвоём, а не какой-либо подсластитель.",
          ],
        },
        {
          h2: "Почему теперь пишут GSC",
          body: [
            "Одноимённая молодёжная организация надавила через товарный знак, и отрасль ответила сокращением имени. GSC печатает большинство продавцов, и это то же самое растение. Это второй в кластере случай сорта, переименованного юристом, а не селекционером; первый — GG4.",
            "Закономерность стоит распознавать, потому что она работает и в обратную сторону. Имя, сокращённое по юридическим причинам, остаётся при той же генетике, а имя, ставшее громким, притягивает генетику, которой у него никогда не было. Одно — переклейка ярлыка, другое — подмена.",
            "В наборе данных полное имя сохранено как альтернативное именно потому, что его ищут и его называют у прилавка, — при этом печатается короткая форма, которой пользуется отрасль.",
          ],
        },
        {
          h2: "Классификация, которая по-настоящему не сходится",
          body: [
            "Каталоги расходятся, индиковый это крен или сативный, и расхождение настоящее, а не небрежность. У растения тяжёлый кушевый родитель и экваториальный африканский, и разные отборы проявляют разные стороны этого наследства.",
            "Поэтому в таблице фактов тип помечен как спорный, и сказано это в самой строке — на всех языковых версиях страницы. Уверенное одно слово читалось бы легче и было бы худшей информацией.",
            "Описания характера вокруг него указывают сразу в обе стороны: тяжесть в теле, но при этом разговорность и мечтательность, а не оседание. Растение с такими двумя родителями ровно это и должно давать, и это хорошее напоминание, что словарь «индика — сатива» есть грубая карта, а не измерение.",
          ],
        },
        {
          h2: "Как отличить его от собственных потомков",
          body: [
            "Gelato — его ребёнок, и разница молочная: Sunset Sherbet выдвигает сливки и цитрус там, где этот выдвигает тесто и мяту. Wedding Cake, ещё дальше по той же линии, — это ванильная глазурь поверх газового пола. Do-Si-Dos вернули в кушевую сторону, и он вышел тяжелее и медленнее.",
            "Мята — собственная подпись этого растения и то, что потомки в основном потеряли. Если у банки, проданной как GSC, поверх теста нет зелёного мятного подъёма, растение может быть хорошим, но половину от Durban Poison оно не показывает.",
            "Восемь-десять недель цветения — обычный отчёт. Окно широкое для настолько распространённого растения, и это ещё один признак того, сколько разброса покрывает имя после пятнадцати лет переотбора.",
          ],
        },
      ],
      faqTitle: "GSC: частые вопросы",
      faq: [
        {
          q: "Почему пишут GSC, а не полное имя?",
          a: "Из-за давления через товарный знак со стороны одноимённой молодёжной организации. Отрасль сократила имя; растение за ним не изменилось.",
        },
        {
          q: "Из чего скрещён GSC?",
          a: "Обычно указывают OG Kush и Durban Poison. Кушевая сторона даёт газ и плотность, сторона Durban Poison — мятно-лакричный подъём.",
        },
        {
          q: "GSC — индика или сатива?",
          a: "Каталоги действительно расходятся, поэтому страница помечает классификацию как спорную. Один родитель — тяжёлый куш, второй — экваториальная африканская линия, и отборы проявляют разные стороны.",
        },
        {
          q: "Он пахнет сладко?",
          a: "Он пахнет тестом, мятой, лимоном и гвоздикой поверх влажной земли. Впечатление выпечки создают кариофиллен с лимоненом вместе, а не что-то сахарное.",
        },
        {
          q: "Какие сорта от него происходят?",
          a: "Gelato, Wedding Cake и Do-Si-Dos есть на этом сайте, а большая часть того, что современное меню называет экзотикой, сводится сюда же.",
        },
      ],
      disclaimerTitle: "Для чего эта страница",
      disclaimer:
        "Она описывает сорт и его влияние на то, как сегодня выглядит меню. Это не оферта и не медицинский совет: ни цены, ни веса, ни наличия и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  gelato: {
    en: withFacts("gelato", "en", {
      thingName: "Gelato",
      title: "Gelato strain: a family of numbered selections, not one plant",
      description:
        "What the number in Gelato #33 actually means, where the cream note comes from, and why a jar labelled only Gelato has told you almost nothing.",
      h1: "Gelato: the label names a family and stops there",
      kicker: "Strain notes",
      lead:
        "Gelato is not one plant. It is a hunt — a batch of seedlings from the same cross, from which several were kept and numbered. Those numbered selections behave differently, smell differently and finish differently, which means the single word on a jar lid has told you which family you are in and nothing about which member.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "What the number means",
          body: [
            "The 33 in Gelato #33 is a selection index. It records that this was the thirty-third phenotype pulled out of the hunt and kept, and it says nothing about strength, quality or rank. People read it as a grade constantly, and it is not one.",
            "Larry Bird is the other name the same selection travels under, which is a basketball reference rather than a description. Between a number and a nickname, neither label on this plant tells you anything sensory — the facts table above does that work instead.",
            "The cross is Sunset Sherbet with Thin Mint GSC, made by the Cookie Fam and Sherbinski in the Bay Area in the early 2010s. It is a second-generation dessert plant: its own parent is a selection from the cultivar that started the category.",
          ],
        },
        {
          h2: "Cream is what separates it from its parent",
          body: [
            "Put it beside GSC and the difference resolves immediately. GSC pushes dough and mint over an earthy floor. This pushes cream and citrus, because Sunset Sherbet is the parent doing the work on that side.",
            "The reported terpene list is longer here than on most pages in this cluster: beta-caryophyllene, limonene, myrcene, alpha-humulene and linalool. Humulene is the dry-hops-and-cut-wood note and linalool the soft floral one, and together they are why a good example smells layered rather than simply sweet.",
            "The aroma descriptors are cream, sweet berry, citrus peel, sweet dough and black pepper. The pepper at the end is the caryophyllene showing through, and it is the detail that keeps the whole thing from reading as dessert with nothing underneath.",
          ],
        },
        {
          h2: "Purple is a pigment, not a grade",
          body: [
            "Purple in the calyxes appears mid-flower when nights are cool, and photographs of it sell a great many jars. It is a pigment expression and it correlates with temperature rather than with anything you would want to buy.",
            "In a tropical grow room it may not appear at all. A green Gelato grown well in this climate is a better jar than a purple one grown badly somewhere cooler, and colour cannot tell the two apart. The Granddaddy Purple page in this cluster goes into how that pigment works, because that is the plant that made colour a selling point in the first place.",
            "Eight to nine weeks of bloom is the usual report, which is ordinary — this is a plant that spread on aroma and on lineage, not on being fast or slow.",
          ],
        },
        {
          h2: "Sorting it against the rest of the dessert shelf",
          body: [
            "Runtz is its child on one side and the sweetest of this group; Wedding Cake is vanilla frosting with a gassy floor; Do-Si-Dos is the heavy, floral one. This sits between them: creamier than GSC, less candied than Runtz, less gassy than Wedding Cake.",
            "The practical question at a counter is which of those four descriptions you want, and it is a better question than the name, because all four names get applied loosely and the descriptions do not.",
            "Character reports place it in the middle without a strong lean, with weight in the body and a talkative quality. That is how people describe it; a specific jar, grown by specific people, is still its own thing.",
          ],
        },
      ],
      faqTitle: "Gelato: common questions",
      faq: [
        {
          q: "Why does one Gelato smell different from another?",
          a: "Because Gelato is a family of numbered selections rather than a single plant, and a jar labelled only Gelato does not say which selection it holds.",
        },
        {
          q: "How is it different from GSC?",
          a: "Cream and citrus in place of dough and mint. The milky note comes from the Sunset Sherbet parent.",
        },
      ],
      disclaimerTitle: "The scope of this description",
      disclaimer:
        "A cultivar description, not an offer and not medical guidance. Nothing here states a price, a weight or what is on the shelf today, and nothing here claims any plant treats or relieves a condition. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("gelato", "ru", {
      thingName: "Gelato",
      title: "Сорт Gelato: семья пронумерованных отборов, а не одно растение",
      description:
        "Что на самом деле означает номер в Gelato #33, откуда берётся сливочная нота и почему банка, подписанная просто Gelato, почти ничего не сообщила.",
      h1: "Gelato: ярлык называет семью и на этом останавливается",
      kicker: "Заметки о сорте",
      lead:
        "Gelato — не одно растение. Это отбор: партия сеянцев из одного скрещивания, из которой несколько оставили и пронумеровали. Эти пронумерованные отборы ведут себя по-разному, пахнут по-разному и доходят по-разному, а значит, одно слово на крышке сообщило, в какой вы семье, и ничего — о том, кто именно её член.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Что означает номер",
          body: [
            "33 в Gelato #33 — порядковый номер отбора. Он фиксирует, что это тридцать третий фенотип, вытащенный из просмотра и оставленный, и ничего не говорит ни о крепости, ни о качестве, ни о ранге. Его постоянно читают как оценку, а это не оценка.",
            "Larry Bird — второе имя того же отбора, и это баскетбольная отсылка, а не описание. Ни номер, ни прозвище не сообщают об этом растении ничего сенсорного — эту работу вместо них делает таблица фактов выше.",
            "Скрещивание — Sunset Sherbet с Thin Mint GSC, сделано Cookie Fam и Sherbinski в области залива в начале 2010-х. Это десертное растение второго поколения: его собственный родитель — отбор из сорта, с которого категория началась.",
          ],
        },
        {
          h2: "Сливки — то, что отделяет его от родителя",
          body: [
            "Поставьте рядом с GSC, и разница снимется сразу. GSC выдвигает тесто и мяту поверх землистого пола. Этот выдвигает сливки и цитрус, потому что с той стороны работает родитель Sunset Sherbet.",
            "Список терпенов здесь длиннее, чем на большинстве страниц кластера: бета-кариофиллен, лимонен, мирцен, альфа-гумулен и линалоол. Гумулен — это сухой хмель и свежий спил дерева, линалоол — мягкая цветочность, и вместе они объясняют, почему хороший образец пахнет слоями, а не просто сладко.",
            "Ароматические дескрипторы — сливки, сладкая ягода, цитрусовая корка, сладкое тесто и чёрный перец. Перец в конце — это проступающий кариофиллен, и именно эта деталь не даёт всему прочитаться как десерт, под которым ничего нет.",
          ],
        },
        {
          h2: "Пурпур — это пигмент, а не сорт качества",
          body: [
            "Пурпур в чашелистиках появляется в середине цветения на прохладных ночах, и его фотографии продают изрядное число банок. Это выражение пигмента, и коррелирует оно с температурой, а не с чем-то, что стоило бы покупать.",
            "В тропической гроубоксе он может не появиться вовсе. Зелёный Gelato, хорошо выращенный в этом климате, — банка лучше, чем пурпурный, выращенный плохо где-нибудь прохладнее, и цвет эти два случая не различает. Как работает пигмент, разбирает страница Granddaddy Purple: именно то растение и сделало цвет аргументом продажи.",
            "Восемь-девять недель цветения — обычный отчёт, то есть ничего особенного: это растение разошлось на аромате и родословной, а не на скорости.",
          ],
        },
        {
          h2: "Как сортировать его на десертной полке",
          body: [
            "Runtz с одной стороны — его ребёнок и самый сладкий в этой группе; Wedding Cake — ванильная глазурь с газовым полом; Do-Si-Dos — тяжёлый и цветочный. Этот стоит между ними: сливочнее GSC, менее карамельный, чем Runtz, менее газовый, чем Wedding Cake.",
            "Практический вопрос у прилавка — какое из этих четырёх описаний вам нужно, и он лучше названия: все четыре имени применяют вольно, а описания — нет.",
            "Характер описывают как держащийся посередине без сильного крена, с тяжестью в теле и разговорностью. Так о нём говорят; конкретная банка, выращенная конкретными людьми, всё равно остаётся собой.",
          ],
        },
      ],
      faqTitle: "Gelato: частые вопросы",
      faq: [
        {
          q: "Почему один Gelato пахнет не так, как другой?",
          a: "Потому что Gelato — семья пронумерованных отборов, а не одно растение, и банка, подписанная просто Gelato, не сообщает, какой в ней отбор.",
        },
        {
          q: "Чем он отличается от GSC?",
          a: "Сливками и цитрусом вместо теста и мяты. Молочную ноту вносит родитель Sunset Sherbet.",
        },
      ],
      disclaimerTitle: "Область этого описания",
      disclaimer:
        "Описание сорта, а не оферта и не медицинское руководство. Здесь нет ни цены, ни веса, ни сведений о сегодняшней полке и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },

  "wedding-cake": {
    en: withFacts("wedding-cake", "en", {
      thingName: "Wedding Cake",
      title: "Wedding Cake strain: a clone-only selection named by growers",
      description:
        "Why Wedding Cake is a selection out of the Triangle Mints line rather than a cross of its own, where the vanilla comes from, and what clone-only means when you see seed for sale.",
      h1: "Wedding Cake: the name came from the smell, and from growers",
      kicker: "Strain notes",
      lead:
        "Most cultivar names are given by whoever made the cross. This one was not. The plant was bred as part of the Triangle Mints line by Seed Junky Genetics, and the Wedding Cake name was attached to one selection out of that line by the Jungle Boys, who were growing it. The name describes an aroma somebody noticed, which is a different kind of naming altogether.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "A selection, not a cross",
          body: [
            "The parentage usually given is Triangle Kush with Animal Mints, and Animal Mints itself carries Animal Cookies and GSC. But the important structural fact is that Wedding Cake is a clone-only selection out of the Triangle Mints line — Triangle Mints #23 is the same plant under its original designation.",
            "That matters commercially. A clone-only plant is propagated by cutting, so every genuine example is genetically the same individual. Seed sold under this name is therefore a reproduction of it, not the plant itself, and the results of growing that seed vary in ways the original does not.",
            "Pink Cookies is a third name for the same selection. Three labels, one plant, and that is before anybody starts using the name loosely — which, given how well it sells, they do.",
          ],
        },
        {
          h2: "Vanilla over gas",
          body: [
            "The aroma descriptors are vanilla, sweet dough, cream, black pepper and lemon. The vanilla is the top note that gave the plant its name, and it is genuinely unusual: nothing else in this cluster leads with it.",
            "Underneath, there is gas. Triangle Kush is an OG Kush relative, and that inheritance puts a solvent floor beneath the sweetness. That floor is the check on a jar: sweetness with no gas underneath usually means a different plant has borrowed the name, because the name sells and the label does not police itself.",
            "Limonene leads the reported terpenes here, ahead of beta-caryophyllene and myrcene. That ordering is the difference from GSC and Gelato, where caryophyllene comes first, and it is part of why this reads as brighter and more perfumed than either.",
          ],
        },
        {
          h2: "A flowering window nobody agrees on",
          body: [
            "Reports range from seven to ten weeks depending on which cut is being grown, which is wide enough that the catalogue marks the flowering figure as disputed rather than commonly cited. The facts table above says so on the row itself.",
            "That spread is a direct consequence of the clone-only problem. Where the name is applied to seed-grown material and to several different cuttings, the schedule stops being a property of the cultivar and becomes a property of whatever is actually in the room.",
            "It also means the usual diagnostic question — how long did this batch take — is less informative here than it is for, say, Sour Diesel, where the long bloom is itself the tell. Judge this one by nose instead.",
          ],
        },
        {
          h2: "Placing it in the dessert group",
          body: [
            "Against GSC, which is upstream of it, this is sweeter and less minty. Against Gelato it is more perfumed and less creamy. Against Do-Si-Dos, its third listed neighbour, it is lighter: Do-Si-Dos is the heavy floral end of this family and this is the bright one.",
            "The character reports point to weight in the body, an evening profile and a settled quality. As everywhere in this cluster, that is a summary of how people describe it and not a statement about what any particular jar will do.",
            "If you want the dessert register without the earthiness that GSC keeps, this is the name to describe at a counter — vanilla and lemon over gas, rather than dough and mint over soil.",
          ],
        },
      ],
      faqTitle: "Wedding Cake: common questions",
      faq: [
        {
          q: "How should it smell?",
          a: "Vanilla, sweet dough and cream on top, black pepper and lemon through the middle, and a gassy Kush floor underneath. Sweetness with no gas usually means something else.",
        },
        {
          q: "Why does the flowering time vary so much?",
          a: "Reports run from seven to ten weeks because several different cuts and seed-grown plants all carry the name. The catalogue marks that figure as disputed.",
        },
      ],
      disclaimerTitle: "What this page does not claim",
      disclaimer:
        "It describes a cultivar and the naming history behind it. It is not an offer and not health advice: no price, no weight, nothing about today's shelf and no claim that a plant treats or relieves anything. Sales are in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("wedding-cake", "ru", {
      thingName: "Wedding Cake",
      title: "Сорт Wedding Cake: клоновый отбор, названный гроверами",
      description:
        "Почему Wedding Cake — это отбор из линии Triangle Mints, а не собственное скрещивание, откуда берётся ваниль и что значит «только клон», когда вы видите в продаже семена.",
      h1: "Wedding Cake: имя пришло от запаха и от гроверов",
      kicker: "Заметки о сорте",
      lead:
        "Имя сорту обычно даёт тот, кто сделал скрещивание. Здесь не так. Растение было выведено в составе линии Triangle Mints в Seed Junky Genetics, а название Wedding Cake прикрепили к одному отбору из этой линии Jungle Boys, которые его растили. Имя описывает аромат, который кто-то заметил, — а это совсем другой способ называть.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Отбор, а не скрещивание",
          body: [
            "Родословную обычно приводят как Triangle Kush с Animal Mints, а сам Animal Mints несёт Animal Cookies и GSC. Но структурно важно другое: Wedding Cake — клоновый отбор из линии Triangle Mints, и Triangle Mints #23 — то же растение под исходным обозначением.",
            "Коммерчески это существенно. Клоновое растение размножают черенком, поэтому каждый настоящий образец генетически — та же особь. Семена под этим именем, следовательно, воспроизведение, а не само растение, и результаты их выращивания разбегаются так, как оригинал не разбегается.",
            "Pink Cookies — третье имя того же отбора. Три ярлыка, одно растение, и это ещё до того, как имя начинают употреблять вольно, — а его, учитывая, как хорошо оно продаётся, употребляют.",
          ],
        },
        {
          h2: "Ваниль поверх газа",
          body: [
            "Ароматические дескрипторы — ваниль, сладкое тесто, сливки, чёрный перец и лимон. Ваниль здесь верхняя нота, давшая растению имя, и она действительно необычна: больше ни у кого в кластере она не идёт первой.",
            "Под ней — газ. Triangle Kush родственник OG Kush, и это наследство кладёт под сладость пол из растворителя. Этот пол и есть проверка банки: сладость без газа под ней обычно означает, что имя одолжило другое растение, — имя продаёт, а ярлык себя не охраняет.",
            "В отчётах здесь первым идёт лимонен, впереди бета-кариофиллена и мирцена. Этот порядок и отличает его от GSC и Gelato, где первым стоит кариофиллен, и отчасти объясняет, почему он читается светлее и парфюмернее обоих.",
          ],
        },
        {
          h2: "Окно цветения, о котором никто не договорился",
          body: [
            "Отчёты дают от семи до десяти недель в зависимости от того, какой черенок растят, и разброс достаточно велик, чтобы в наборе данных цветение было помечено как спорное, а не как общепринятая версия. В таблице выше это сказано прямо в строке.",
            "Разброс — прямое следствие клоновой природы. Там, где имя применяют и к семенному материалу, и к нескольким разным черенкам, график перестаёт быть свойством сорта и становится свойством того, что реально стоит в комнате.",
            "Значит, и обычный диагностический вопрос «сколько эта партия доходила» здесь менее информативен, чем, скажем, у Sour Diesel, где долгое цветение само по себе улика. Этот судите носом.",
          ],
        },
        {
          h2: "Место в десертной группе",
          body: [
            "Против GSC, который стоит выше по линии, этот слаще и менее мятный. Против Gelato — парфюмернее и менее сливочный. Против Do-Si-Dos, третьего указанного соседа, он легче: Do-Si-Dos — тяжёлый цветочный край семьи, а этот светлый.",
            "Описания характера указывают на тяжесть в теле, вечерний профиль и спокойствие. Как и везде в кластере, это сводка того, как о нём говорят, а не утверждение о том, что сделает конкретная банка.",
            "Если нужен десертный регистр без землистости, которую сохраняет GSC, у прилавка стоит описывать именно это: ваниль и лимон поверх газа, а не тесто и мята поверх почвы.",
          ],
        },
      ],
      faqTitle: "Wedding Cake: частые вопросы",
      faq: [
        {
          q: "Кто его назвал?",
          a: "Jungle Boys, которые растили этот отбор. Линию вывели Seed Junky Genetics, а имя Wedding Cake пришло от гроверов и от аромата.",
        },
        {
          q: "Что значит «только клон» для покупателя?",
          a: "Каждый настоящий образец размножен черенком от одной и той же особи. Семена под этим именем — воспроизведение, а не то самое растение, и разброс у них больше.",
        },
        {
          q: "Как он должен пахнуть?",
          a: "Сверху ваниль, сладкое тесто и сливки, в середине чёрный перец и лимон, снизу газовый кушевый пол. Сладость без газа обычно означает что-то другое.",
        },
        {
          q: "Почему время цветения так расходится?",
          a: "Отчёты дают от семи до десяти недель, потому что имя носят несколько разных черенков и семенной материал. В наборе данных этот показатель помечен как спорный.",
        },
      ],
      disclaimerTitle: "Чего эта страница не утверждает",
      disclaimer:
        "Она описывает сорт и историю его имени. Это не оферта и не медицинский совет: ни цены, ни веса, ничего о сегодняшней полке и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "do-si-dos": {
    en: withFacts("do-si-dos", "en", {
      thingName: "Do-Si-Dos",
      title: "Do-Si-Dos strain: linalool under the citrus and dough",
      description:
        "A cross of OGKB with Face Off OG, why linalool in the leading three is unusual on a dessert page, and what a square-dance call is doing on a jar lid.",
      h1: "Do-Si-Dos: the Cookies line crossed back where it came from",
      kicker: "Strain notes",
      lead:
        "Most of the dessert family moved away from its Kush ancestor, adding cream, vanilla and candy with each generation. This one went back. OGKB is itself a phenotype of GSC, and crossing it with Face Off OG returned a Cookies plant to the OG side of its own family — which is why it is the heaviest thing on the dessert shelf.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "A return trip through the family tree",
          body: [
            "The parents usually given are OGKB and Face Off OG. OGKB — the initials stand for a GSC phenotype that acquired its own following — carries the dough and the density; Face Off OG is where the weight comes from, and it is a straightforwardly heavy Kush.",
            "So the structure of this plant is a Cookies selection crossed with an OG, which is the same combination GSC itself started from, run again a generation later with different ingredients. Compared with its GSC parent it is slower and heavier, and the Face Off OG side is why.",
            "Archive Seed Bank is credited with the work in the mid-2010s. Eight to nine weeks of bloom is the usual report, which is unremarkable — nothing about how this plant grows explains its reputation, and everything about how it smells does.",
          ],
        },
        {
          h2: "Linalool is the thing to notice",
          body: [
            "The reported terpenes here are limonene, beta-caryophyllene and linalool. That third one is unusual: linalool appears in the leading three on almost no other page in this cluster, and it is the soft floral-with-light-spice note, the one that also turns up in lavender and coriander.",
            "It is what puts a floral line under the citrus and dough, and it is the fastest way to identify this plant blind. A dessert-smelling jar with a floral undertone rather than a minty or creamy one is showing you the linalool.",
            "The full descriptor list is sweet dough, lemon, a floral note, damp earth and fuel. That last one is the Face Off OG side, and it sits at the bottom rather than the top — this is not a fuel plant, it is a dessert plant with fuel underneath it.",
          ],
        },
        {
          h2: "The name is a dance step",
          body: [
            "Do-si-do is a call in American square dancing, and the name belongs to the same Americana-and-baking register the rest of the Cookies family trades in. It carries no botanical information, exactly like Bruce Banner and unlike White Widow.",
            "The spellings vary — Dosido, Do Si Dos — which is worth knowing when reading a menu written by someone working in a second language. They are the same plant, and none of the spellings tells you which cut it is.",
            "Naming conventions are not a trivial matter in this trade. A name that describes something is a name you can check against the jar; a name that references a dance, a comic or a film can only be trusted or not trusted, and there is no third option.",
          ],
        },
        {
          h2: "Where it belongs on a shelf",
          body: [
            "Of the four dessert plants described on this site, this is the heavy one. GSC is minty and earthy, Gelato creamy, Wedding Cake bright and perfumed, and this one is floral, slow and weighted.",
            "Its third listed neighbour is GG4, which is outside the dessert family altogether, and the comparison is instructive: both are described as slow to arrive and heavy in the body, but GG4 gets there through roasted fuel and this through citrus and florals.",
            "Character reports place it as an evening profile with a slow onset. Descriptions of onset are the least reliable thing in this entire vocabulary, since they depend on the person and the batch far more than on the cultivar — treat them as a hint about what people expect, not about what will happen.",
          ],
        },
      ],
      faqTitle: "Do-Si-Dos: common questions",
      faq: [
        {
          q: "What does the name mean?",
          a: "It is a call from American square dancing. Like Bruce Banner, it carries no information about the plant.",
        },
        {
          q: "Are Dosido and Do Si Dos the same thing?",
          a: "Yes — they are spelling variants of the same name. None of the spellings tells you which cut is in the jar.",
        },
      ],
      disclaimerTitle: "Boundaries of this page",
      disclaimer:
        "A description of a cultivar and its place in a family tree. Not an offer, not a stock list, not health advice: no price, no weight, and no claim that any plant treats or relieves a condition. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("do-si-dos", "ru", {
      thingName: "Do-Si-Dos",
      title: "Сорт Do-Si-Dos: линалоол под цитрусом и тестом",
      description:
        "Скрещивание OGKB с Face Off OG, почему линалоол в первой тройке необычен для десертной страницы и что делает на крышке банки название фигуры кадрили.",
      h1: "Do-Si-Dos: линия Cookies, скрещённая обратно туда, откуда пришла",
      kicker: "Заметки о сорте",
      lead:
        "Большая часть десертной семьи уходила от кушевого предка, добавляя с каждым поколением сливки, ваниль и карамель. Этот вернулся. OGKB сам по себе фенотип GSC, и скрещивание с Face Off OG отправило печенечное растение обратно в кушевую сторону собственной семьи — поэтому он и самый тяжёлый на десертной полке.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Обратный путь по родословной",
          body: [
            "Родителями обычно называют OGKB и Face Off OG. OGKB — аббревиатура фенотипа GSC, у которого появилась собственная известность, — несёт тесто и плотность; Face Off OG отвечает за вес и представляет собой прямолинейно тяжёлый куш.",
            "То есть структура этого растения — печенечный отбор, скрещённый с OG, а это та же комбинация, с которой начинался сам GSC, повторённая поколением позже на других ингредиентах. Против родительского GSC он медленнее и тяжелее, и причина — сторона Face Off OG.",
            "Работу середины 2010-х приписывают Archive Seed Bank. Восемь-девять недель цветения — обычный отчёт, ничего примечательного: репутацию этого растения объясняет не то, как оно растёт, а то, как оно пахнет.",
          ],
        },
        {
          h2: "Замечать здесь надо линалоол",
          body: [
            "В отчётах названы лимонен, бета-кариофиллен и линалоол. Третий необычен: в первой тройке линалоол не стоит почти ни на одной другой странице кластера, а это мягкая цветочная нота с лёгкой пряностью — та же, что встречается в лаванде и кориандре.",
            "Именно он кладёт цветочную линию под цитрус и тесто, и это самый быстрый способ опознать растение вслепую. Десертно пахнущая банка с цветочным, а не мятным и не сливочным подтоном показывает вам линалоол.",
            "Полный список дескрипторов — сладкое тесто, лимон, цветочная нота, влажная земля и топливо. Последнее — сторона Face Off OG, и стоит оно снизу, а не сверху: это не топливное растение, это десертное растение с топливом под ним.",
          ],
        },
        {
          h2: "Название — это па из танца",
          body: [
            "Do-si-do — фигура американской кадрили, и имя принадлежит тому же регистру американы и выпечки, в котором торгует вся остальная печенечная семья. Ботанической информации в нём нет — ровно как у Bruce Banner и в отличие от White Widow.",
            "Написания гуляют: Dosido, Do Si Dos. Это стоит знать, читая меню, составленное человеком, работающим на неродном языке. Растение одно и то же, и ни одно из написаний не сообщает, какой в банке черенок.",
            "Способ называть здесь не мелочь. Имя, которое что-то описывает, можно сверить с банкой; имени, отсылающему к танцу, комиксу или фильму, можно только верить или не верить, и третьего варианта нет.",
          ],
        },
        {
          h2: "Где его место на полке",
          body: [
            "Из четырёх десертных растений, описанных на этом сайте, это тяжёлое. GSC мятный и землистый, Gelato сливочный, Wedding Cake светлый и парфюмерный, а этот цветочный, медленный и с весом.",
            "Третий указанный сосед — GG4, вообще вне десертной семьи, и сравнение поучительно: оба описывают как медленно разворачивающиеся и тяжёлые в теле, но GG4 приходит туда через обжаренное топливо, а этот через цитрус и цветочность.",
            "Характер описывают как вечерний профиль с медленным разворачиванием. Описания разворачивания — наименее надёжное во всём этом словаре: они зависят от человека и партии куда сильнее, чем от сорта. Считайте их подсказкой о том, чего ждут, а не о том, что произойдёт.",
          ],
        },
      ],
      faqTitle: "Do-Si-Dos: частые вопросы",
      faq: [
        {
          q: "Из чего скрещён Do-Si-Dos?",
          a: "Обычно указывают OGKB и Face Off OG. OGKB сам по себе фенотип GSC, поэтому это печенечное растение, скрещённое обратно в кушевую сторону собственной семьи.",
        },
        {
          q: "Чем он отличается от GSC?",
          a: "Он тяжелее и медленнее, и он цветочный, а не мятный. Вес приходит от родителя Face Off OG.",
        },
      ],
      disclaimerTitle: "Границы этой страницы",
      disclaimer:
        "Описание сорта и его места в родословной. Не оферта, не список наличия, не медицинский совет: ни цены, ни веса и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },
};
