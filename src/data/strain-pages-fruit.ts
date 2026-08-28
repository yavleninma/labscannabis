import type { Locale } from "@/lib/i18n";
import type { StrainPageCopy, StrainPages } from "@/data/strain-pages";
import { buildStrainFacts } from "./strain-catalog.ts";

/**
 * ТЕКСТ СТРАНИЦ СОРТОВ: карамельно-фруктовая и виноградно-пурпурная семьи.
 *
 * Runtz, Zkittlez, Purple Punch, Granddaddy Purple.
 *
 * Здесь два риска шаблона сразу. Первый: две пары внутри одной семьи, где
 * каждая пара — родитель и ребёнок. Второй: пурпурный пигмент, про который
 * подмывает написать один и тот же абзац на трёх страницах.
 *
 * Разведено так: механизм пигмента разбирается ОДИН раз, на странице
 * Granddaddy Purple, — том растении, которое и сделало цвет аргументом
 * продажи; Purple Punch и Gelato только ссылаются на этот разбор. Каждая
 * страница держится за собственный факт: у Runtz — самое копируемое имя эпохи;
 * у Zkittlez — третий родитель, которого селекционеры никогда не называли;
 * у Purple Punch — короткое цветение и релиз F2 2017 года; у Granddaddy Purple —
 * две несовпадающие версии скрещивания, одна из которых от самого селекционера.
 */

function withFacts(
  slug: string,
  locale: Locale,
  copy: Omit<StrainPageCopy, "facts">,
): StrainPageCopy {
  return { ...copy, facts: buildStrainFacts(slug, locale) };
}

export const FRUIT_STRAIN_PAGES: StrainPages = {
  runtz: {
    en: withFacts("runtz", "en", {
      thingName: "Runtz",
      title: "Runtz strain: the most copied name of the current era",
      description:
        "A bridge between Zkittlez and Gelato, a name that spawned a dozen coloured prefixes, and the one check that tells you whether the Gelato half is actually there.",
      h1: "Runtz: a name with more prefixes than a plant can carry",
      kicker: "Strain notes",
      lead:
        "Pink Runtz, White Runtz, Black Runtz, Rainbow Runtz. Some of those are genuine separate selections; most are separate plants that acquired a fashionable prefix. No other name in this cluster has been copied at this rate, and understanding why is more useful to a visitor than any description of the aroma.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Why the prefixes exist",
          body: [
            "Runtz came out of the circle around the Cookies brand in Los Angeles in the late 2010s, and it was never a seed-bank release with a catalogue entry to anchor it. A name that becomes valuable without ever being pinned to a documented line is a name that anybody can extend.",
            "So a coloured prefix on a menu means one of three things: a real numbered selection, a different plant with a good marketing instinct, or a shop repeating what its supplier wrote. Nothing on the label distinguishes them, and no register exists that could.",
            "This is the same mechanism that filled the market with material called Pineapple Express after a film, and with plants called Amnesia Haze that finish three weeks too fast. A famous name is an asset; here it happened faster and more visibly than anywhere else on this list.",
          ],
        },
        {
          h2: "The bridge between two parents",
          body: [
            "The cross usually given is Zkittlez with Gelato, and the Gelato side is usually specified as Gelato #33. That makes this a bridge between the candy-fruit family and the dessert family — the two dominant aromatic registers of the last decade, joined in one plant.",
            "Zkittlez supplies the candy nose. Gelato supplies the creamy, gassy body underneath it. The interesting thing about a genuine Runtz is that both halves are legible at once, which is not a common structure.",
            "That gives a single, portable check: if a jar under this name smells only of sugar, with nothing gassy or creamy beneath, the Gelato half is not showing up. That does not necessarily make it a bad jar. It makes it a jar that has been named optimistically.",
          ],
        },
        {
          h2: "A classification that will not settle",
          body: [
            "The type is marked disputed in the facts table above, and it stays that way for a structural reason: with a candy-fruit parent and a dessert parent, and with dozens of things sold under the name, whichever way a given selection leans is a property of that selection rather than of the cultivar.",
            "Character reports place it in the middle, talkative and dreamy. Those are descriptions of how people talk about it, collected from a population of plants that is not entirely the same plant, and this page treats them accordingly.",
            "Eight to nine weeks of bloom is the usual figure. That is unremarkable, and it is worth saying so — nothing about the schedule explains the name's spread. Aroma and fashion did that.",
          ],
        },
        {
          h2: "Where to place it against the neighbours",
          body: [
            "Zkittlez is the parent and the purer candy: fruit and grape with a citrus lift and no dessert weight. Gelato is the other parent and the creamier one. Purple Punch, its third listed neighbour, is candied in a different direction — grape and vanilla rather than tropical sweets.",
            "Against Pineapple Express, which is on this site too, the difference is what sugar means: Pineapple Express is fruit and cedar, this is confectionery. People often want one and ask for the other.",
            "At a counter, the sentence that works is candy on top with something creamy underneath. That describes a genuine Runtz, and it will get you a better match than the name will, prefix or no prefix.",
          ],
        },
      ],
      faqTitle: "Runtz: common questions",
      faq: [
        {
          q: "Are Pink Runtz and White Runtz different strains?",
          a: "Sometimes. Some coloured prefixes are genuine separate selections and others are different plants that took a fashionable name. Nothing on the label distinguishes them.",
        },
        {
          q: "Is it indica or sativa?",
          a: "Disputed, and it will stay disputed — one parent comes from each register, and different selections lean different ways.",
        },
      ],
      disclaimerTitle: "What this page is not",
      disclaimer:
        "A cultivar description and an account of how its name spread. It is not an offer and not medical guidance: no price, no weight, nothing about today's shelf, and no claim that a plant treats or relieves anything. Sales are in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("runtz", "ru", {
      thingName: "Runtz",
      title: "Сорт Runtz: самое копируемое имя нынешней эпохи",
      description:
        "Мост между Zkittlez и Gelato, имя, породившее десяток цветных приставок, и одна проверка, показывающая, есть ли на месте половина от Gelato.",
      h1: "Runtz: имя, у которого приставок больше, чем растение способно унести",
      kicker: "Заметки о сорте",
      lead:
        "Приставок к этому имени в меню больше, чем растений: Pink, White, Black, Rainbow. Часть из них — настоящие отдельные отборы; большинство — отдельные растения, подобравшие модную приставку. Ни одно другое имя в этом кластере не копировали с такой скоростью, и понимать почему приезжему полезнее, чем любое описание аромата.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Откуда берутся приставки",
          body: [
            "Runtz вышел из круга вокруг бренда Cookies в Лос-Анджелесе в конце 2010-х и никогда не был релизом семенного банка с каталожной записью, которая бы его закрепляла. Имя, ставшее ценным без привязки к задокументированной линии, — это имя, которое может продолжить кто угодно.",
            "Поэтому цветная приставка в меню означает одно из трёх: настоящий пронумерованный отбор, другое растение с хорошим маркетинговым чутьём или магазин, повторивший то, что написал поставщик. Ярлык эти три случая не различает, а реестра, который мог бы, не существует.",
            "Это тот же механизм, который наполнил рынок материалом по имени Pineapple Express после фильма и растениями по имени Amnesia Haze, доходящими на три недели быстрее нужного. Громкое имя — актив; здесь это произошло быстрее и заметнее, чем где-либо ещё в списке.",
          ],
        },
        {
          h2: "Мост между двумя родителями",
          body: [
            "Скрещивание обычно указывают как Zkittlez с Gelato, причём со стороны Gelato обычно уточняют Gelato #33. Значит, это мост между карамельно-фруктовой и десертной семьями — двумя доминирующими ароматическими регистрами последнего десятилетия, соединёнными в одном растении.",
            "Zkittlez даёт карамельный нос. Gelato даёт сливочно-газовое тело под ним. Интересное в настоящем Runtz то, что обе половины читаются одновременно, а такая структура встречается нечасто.",
            "Отсюда одна переносимая проверка: если банка под этим именем пахнет одним сахаром и под ним нет ничего газового или сливочного, половина от Gelato не проявилась. Плохой банкой это её не делает. Это делает её банкой, названной оптимистично.",
          ],
        },
        {
          h2: "Классификация, которая не устоится",
          body: [
            "Тип в таблице фактов помечен как спорный, и таким останется по структурной причине: при одном карамельно-фруктовом родителе и одном десертном, да ещё при десятках вещей, продаваемых под этим именем, крен конкретного отбора — свойство отбора, а не сорта.",
            "Характер описывают как держащийся посередине, разговорный и мечтательный. Это описание того, как о нём говорят, собранное с популяции растений, которая не вполне является одним растением, — и страница относится к нему соответственно.",
            "Восемь-девять недель цветения — обычная цифра. Ничего примечательного, и это стоит проговорить: распространение имени объясняет не график. Его объяснили аромат и мода.",
          ],
        },
        {
          h2: "Куда его ставить относительно соседей",
          body: [
            "Zkittlez — родитель и более чистая карамель: фрукт и виноград с цитрусовым подъёмом и без десертного веса. Gelato — второй родитель и более сливочный. Purple Punch, третий указанный сосед, карамелен в другую сторону: виноград и ваниль, а не тропические конфеты.",
            "Против Pineapple Express, который тоже есть на этом сайте, разница в том, что понимается под сахаром: Pineapple Express — фрукт и кедр, этот — кондитерская. Люди часто хотят одно, а просят другое.",
            "У прилавка работает такая фраза: карамель сверху и что-то сливочное под ней. Она описывает настоящий Runtz и подберёт лучше, чем название, — с приставкой или без.",
          ],
        },
      ],
      faqTitle: "Runtz: частые вопросы",
      faq: [
        {
          q: "Pink Runtz и White Runtz — это разные сорта?",
          a: "Иногда. Часть цветных приставок — настоящие отдельные отборы, часть — другие растения, взявшие модное имя. Ярлык эти случаи не различает.",
        },
        {
          q: "Из чего скрещён Runtz?",
          a: "Zkittlez и Gelato, причём со стороны Gelato обычно уточняют Gelato #33.",
        },
        {
          q: "Как понять, настоящий ли Runtz в банке?",
          a: "Ищите обе половины. Структура — карамельная сладость сверху и что-то сливочное или газовое под ней; сахар, под которым ничего нет, означает, что сторона Gelato не проявилась.",
        },
        {
          q: "Это индика или сатива?",
          a: "Спорно и останется спорным: по одному родителю из каждого регистра, а разные отборы кренятся в разные стороны.",
        },
        {
          q: "Откуда он взялся?",
          a: "Лос-Анджелес, конец 2010-х; обычно описывают как выход из круга вокруг бренда Cookies, а не как релиз семенного банка.",
        },
      ],
      disclaimerTitle: "Чем эта страница не является",
      disclaimer:
        "Описание сорта и рассказ о том, как разошлось его имя. Это не оферта и не медицинское руководство: ни цены, ни веса, ничего о сегодняшней полке и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  zkittlez: {
    en: withFacts("zkittlez", "en", {
      thingName: "Zkittlez",
      title: "Zkittlez strain: the parent nobody has ever named",
      description:
        "Grape Ape crossed with Grapefruit — and a third parent the breeders have always said exists and have never disclosed. What that means for every lineage chart you will read.",
      h1: "Zkittlez: a lineage printed as complete is printing a guess",
      kicker: "Strain notes",
      lead:
        "Every catalogue prints two parents for this plant. The breeders have said from the beginning that there is a third and have never named it. So every neat two-part lineage you will see for Zkittlez is not a simplification — it is an omission, made by people who know the omission is there.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Two named parents and one withheld",
          body: [
            "Grape Ape and Grapefruit are the two on the record. Grape Ape carries the purple and the grape sweetness; Grapefruit contributes the citrus lift that keeps the whole thing from being merely sugary. Together they account for most of what the plant smells like — but not, by the breeders' own account, for all of it.",
            "The third parent is why nobody has reproduced this plant exactly. That is unusual and it is honest: most withheld information in this trade is withheld silently, and here the gap itself has been declared.",
            "The work is credited to 3rd Gen Family and Terp Hogz in Northern California in the mid-2010s. The catalogue entry on this site marks the lineage as commonly cited rather than documented, and the note explains precisely why.",
          ],
        },
        {
          h2: "The competition record is the part that can be checked",
          body: [
            "A Cannabis Cup in 2015 in the indica category, and first place in flower at the Emerald Cup in 2016. Both are outside records with a year and a category attached, and this cluster prints results of that kind and leaves the row empty when the only source is a breeder's own count.",
            "Those wins are unusually informative here, because what was being judged was largely the aroma. In a family where sweetness is normally a marketing register, this is a case where the sugar is genuinely in the terpene load — competitions are one of the few places that gets tested by people with no stake in the sale.",
            "It also marks the beginning of a family. Zkittlez is where the candy-fruit register starts; Runtz is its child, and most of what a menu now calls exotic fruit is downstream of one or the other.",
          ],
        },
        {
          h2: "What it should smell like",
          body: [
            "Fruit candy, tropical fruit, grape and citrus peel. It is sweet without the dairy of the dessert family and without the fuel floor of the Kush family — a clean, high, fruit-forward smell with very little underneath it.",
            "That lightness is the identifier. Where a jar under this name has weight and gas beneath the sweetness, you are probably holding a Runtz-adjacent plant rather than this one; the child is the heavier of the two.",
            "The reported terpenes are beta-caryophyllene, limonene and myrcene, which is the same trio that leads half this cluster. Once again the list is not what distinguishes plants — proportions and descriptors are, which is why both are printed above.",
          ],
        },
        {
          h2: "Reading it against the purple family",
          body: [
            "Granddaddy Purple, its third listed neighbour, shares the grape note and takes it in the opposite direction: floral and perfumed rather than candied. Purple Punch sits between them, with grape and vanilla.",
            "Its own child Runtz adds cream and gas. So the sorting question across these four plants is how much weight you want under the fruit — none here, some in Purple Punch, more in Runtz, and a different kind of depth in Granddaddy Purple.",
            "Character reports here point to a calm body and an evening profile, which is a slightly different picture from what the sweetness alone would suggest. Descriptions are collected from people, not measured, and this cluster prints them as such.",
          ],
        },
      ],
      faqTitle: "Zkittlez: common questions",
      faq: [
        {
          q: "What are Zkittlez's parents?",
          a: "Grape Ape and Grapefruit are on the record. The breeders have always said a third parent exists and have never named it, so any lineage printed as complete is printing a guess.",
        },
        {
          q: "How long does it flower?",
          a: "Eight to nine weeks indoors, commonly given as fifty-six to sixty-three days and dependent on phenotype.",
        },
      ],
      disclaimerTitle: "Scope of this page",
      disclaimer:
        "A description of a cultivar, including what its breeders have chosen not to disclose. Not an offer and not health advice: no price, no weight, no stock and no claim that any plant treats a condition. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("zkittlez", "ru", {
      thingName: "Zkittlez",
      title: "Сорт Zkittlez: родитель, которого так и не назвали",
      description:
        "Grape Ape, скрещённый с Grapefruit, — и третий родитель, о существовании которого селекционеры говорили всегда и которого никогда не раскрывали. Что это значит для любой схемы родословной.",
      h1: "Zkittlez: родословная, напечатанная как полная, печатает догадку",
      kicker: "Заметки о сорте",
      lead:
        "Каждый каталог печатает для этого растения двух родителей. Селекционеры с самого начала говорили, что есть третий, и никогда его не называли. Значит, любая аккуратная двухчастная родословная Zkittlez — это не упрощение, а пропуск, сделанный людьми, которые знают, что пропуск там есть.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Двое названы, один придержан",
          body: [
            "На записи стоят Grape Ape и Grapefruit. Grape Ape несёт пурпур и виноградную сладость; Grapefruit добавляет цитрусовый подъём, не дающий всему стать просто сахарным. Вдвоём они объясняют большую часть запаха — но, по собственным словам селекционеров, не весь.",
            "Третий родитель — причина, по которой это растение никто не воспроизвёл в точности. Случай нечастый и честный: в этой отрасли придержанное обычно придерживают молча, а здесь сам пропуск объявлен.",
            "Работу середины 2010-х в Северной Калифорнии приписывают 3rd Gen Family и Terp Hogz. В наборе данных линия помечена как общепринятая версия, а не как задокументированная, и в примечании сказано ровно почему.",
          ],
        },
        {
          h2: "Конкурсная запись — та часть, которую можно проверить",
          body: [
            "Cannabis Cup 2015 года в индиковой категории и первое место по соцветиям на Emerald Cup 2016-го. Это внешние записи с годом и категорией, и кластер печатает результаты такого рода, оставляя строку пустой там, где единственный источник — собственный счёт селекционера.",
            "Здесь эти победы необычно информативны, потому что судили в основном аромат. В семье, где сладость обычно является маркетинговым регистром, это случай, когда сахар действительно лежит в терпеновой нагрузке, — а конкурс одно из немногих мест, где это проверяют люди без доли в продаже.",
            "Здесь же начинается и семья. Zkittlez — точка, с которой стартует карамельно-фруктовый регистр; Runtz его ребёнок, и большая часть того, что меню сегодня зовёт экзотическим фруктом, идёт ниже по течению от одного из них.",
          ],
        },
        {
          h2: "Как он должен пахнуть",
          body: [
            "Фруктовая карамель, тропические фрукты, виноград и цитрусовая корка. Сладко без молочности десертной семьи и без топливного пола кушевой — чистый, высокий, фруктовый запах, под которым почти ничего нет.",
            "Эта лёгкость и есть опознавательный признак. Если у банки под этим именем под сладостью есть вес и газ, у вас в руках скорее растение из окрестностей Runtz, чем это: ребёнок из двоих тяжелее.",
            "В отчётах названы бета-кариофиллен, лимонен и мирцен — та же тройка, что возглавляет половину кластера. И снова растения различает не список, а пропорции и дескрипторы, — поэтому выше напечатано и то и другое.",
          ],
        },
        {
          h2: "Как читать его против пурпурной семьи",
          body: [
            "Granddaddy Purple, третий указанный сосед, делит с ним виноградную ноту и уводит её в противоположную сторону: цветочно и парфюмерно, а не карамельно. Purple Punch стоит между ними, с виноградом и ванилью.",
            "Собственный ребёнок Runtz добавляет сливки и газ. Значит, сортирующий вопрос по этим четырём растениям — сколько веса нужно под фруктом: здесь никакого, немного в Purple Punch, больше в Runtz, а в Granddaddy Purple глубина другого рода.",
            "Характер здесь описывают как спокойную телесность и вечерний профиль — картина слегка иная, чем подсказала бы одна сладость. Описания собраны с людей, а не измерены, и кластер печатает их именно так.",
          ],
        },
      ],
      faqTitle: "Zkittlez: частые вопросы",
      faq: [
        {
          q: "Кто родители Zkittlez?",
          a: "На записи Grape Ape и Grapefruit. Селекционеры всегда говорили о существовании третьего родителя и никогда его не называли, поэтому любая родословная, напечатанная как полная, печатает догадку.",
        },
        {
          q: "Что он выиграл?",
          a: "Cannabis Cup 2015 года в индиковой категории и первое место по соцветиям на Emerald Cup 2016-го.",
        },
        {
          q: "Чем он отличается от Runtz?",
          a: "Runtz — его ребёнок и тяжелее: карамель со сливками и газом под ней. Zkittlez — более лёгкий и чистый фрукт, под которым почти ничего нет.",
        },
        {
          q: "Сколько он цветёт?",
          a: "Восемь-девять недель в помещении; обычно приводят пятьдесят шесть-шестьдесят три дня в зависимости от фенотипа.",
        },
        {
          q: "Сладость настоящая или это маркетинг?",
          a: "В этом случае она в самом аромате — именно его в основном и судили на конкурсах. В других местах меню сладость часто оказывается регистром, а не запахом.",
        },
      ],
      disclaimerTitle: "Область этой страницы",
      disclaimer:
        "Описание сорта, включая то, что селекционеры решили не раскрывать. Не оферта и не медицинский совет: ни цены, ни веса, ни наличия и ни одного утверждения, что растение что-то лечит. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },

  "purple-punch": {
    en: withFacts("purple-punch", "en", {
      thingName: "Purple Punch",
      title: "Purple Punch strain: a short bloom in a slow aroma family",
      description:
        "Larry OG crossed with Granddaddy Purple in Hawaii, released as F2 seed in 2017 — and why seven to eight weeks explains how fast the name travelled.",
      h1: "Purple Punch: the grape family's fast one",
      kicker: "Strain notes",
      lead:
        "Half of this plant is Granddaddy Purple, which is why the two smell like relatives. The other half is Larry OG, and between them they produced something the grape family did not previously have: a plant with that aroma that finishes in seven to eight weeks. That single fact explains most of its spread.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Made in Hawaii, released as seed in 2017",
          body: [
            "Supernova Gardens made the cross. Symbiotic Genetics released F2 seed in 2017, and that release is the moment the name went from a regional plant to something on menus worldwide. Before seed exists, a cultivar can only travel as cuttings; after it, anybody can grow it.",
            "Hawaii is an unusual origin on this list. Almost everything else here comes from the Netherlands, California or the American East Coast, and the one other Hawaiian connection in this cluster is the landrace parent behind Pineapple Express.",
            "The lineage is marked as commonly cited rather than documented, which is the normal state of affairs for a plant made outside a seed bank's own programme. Nothing about it is contested, but there is no breeder release describing the work.",
          ],
        },
        {
          h2: "Seven to eight weeks, and why that spread it",
          body: [
            "Granddaddy Purple is usually reported at eight to eleven weeks. Its child comes in at seven to eight, which is a full cycle's worth of difference over a year for anyone growing commercially.",
            "That is the practical reason the name overtook its parent on menus. It is the same mechanism as Northern Lights shortening the Haze lines in the 1990s, run at a smaller scale: aroma the market wants, on a schedule a grower can afford.",
            "It also means the name is worth less as a guarantee than the parent's is. A fast, fashionable, seed-available plant gets grown by everyone, well and badly, and the distribution of what turns up under the label is correspondingly wide.",
          ],
        },
        {
          h2: "Grape and vanilla rather than grape and perfume",
          body: [
            "The descriptors are grape, sweet berry, fruit candy and vanilla. Set that beside its parent, whose grape is floral and perfumed, and the difference is that this one is candied — the sweetness sits forward, and there is a confectionery quality the older plant does not have.",
            "That is the sorting question between the two, and it is answerable by nose in a second. If the grape smells like a sweet shop, you are in Punch territory; if it smells like a flower shop, you are in Granddaddy Purple territory.",
            "Beta-caryophyllene, limonene and myrcene lead the reports here. Character descriptions point to an evening profile with weight and a settled body — the same territory as the parent, which is what a half-share of its genetics ought to produce.",
          ],
        },
        {
          h2: "About the colour",
          body: [
            "Purple in this plant comes from pigments expressed when nights are cool. In a tropical grow room it may not appear at all, and its absence says nothing about how the plant was grown or how it will smell.",
            "The mechanism is set out on the Granddaddy Purple page in this cluster, because that is the plant that made colour a selling point in the first place. It is worth reading before paying attention to a photograph of anything purple.",
            "What is worth attention here instead is the aroma and the state of the trichomes. Both are things you can assess with the jar open in front of you, which colour, at the point of purchase, mostly is not.",
          ],
        },
      ],
      faqTitle: "Purple Punch: common questions",
      faq: [
        {
          q: "What is Purple Punch crossed from?",
          a: "Larry OG and Granddaddy Purple. Half its parentage is the older purple cultivar, which is why the two smell like relatives.",
        },
        {
          q: "Why is it not purple?",
          a: "Purple is a pigment expressed in cool nights. Grown in a warm room it can finish green, and colour is not a measure of anything you would want to buy.",
        },
      ],
      disclaimerTitle: "What this page will not do",
      disclaimer:
        "It describes a cultivar and does not sell one. No price, no weight, no stock status, and no claim that any plant treats or relieves any condition. Everything at this counter is sold in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("purple-punch", "ru", {
      thingName: "Purple Punch",
      title: "Сорт Purple Punch: короткое цветение в медленной ароматической семье",
      description:
        "Larry OG, скрещённый с Granddaddy Purple на Гавайях, выпуск семян F2 в 2017 году — и почему семь-восемь недель объясняют скорость распространения имени.",
      h1: "Purple Punch: быстрый в виноградной семье",
      kicker: "Заметки о сорте",
      lead:
        "Половина этого растения — Granddaddy Purple, поэтому эти двое пахнут роднёй. Вторая половина — Larry OG, и вместе они дали то, чего у виноградной семьи раньше не было: растение с этим ароматом, доходящее за семь-восемь недель. Один этот факт объясняет большую часть его распространения.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Сделан на Гавайях, выпущен семенами в 2017-м",
          body: [
            "Скрещивание сделали в Supernova Gardens. Symbiotic Genetics выпустили семена F2 в 2017 году, и этот релиз — момент, когда имя из регионального растения превратилось в позицию меню по всему миру. Пока семян нет, сорт может путешествовать только черенками; после — растить его может кто угодно.",
            "Гавайи для этого списка происхождение необычное. Почти всё остальное здесь — Нидерланды, Калифорния или восточное побережье США, а единственная другая гавайская связь в кластере — родитель-ландрейс за Pineapple Express.",
            "Родословная помечена как общепринятая версия, а не как задокументированная, и для растения, сделанного вне собственной программы семенного банка, это нормальное положение дел. Спора о ней нет, но и релиза селекционера с описанием работы тоже нет.",
          ],
        },
        {
          h2: "Семь-восемь недель — и почему это его разнесло",
          body: [
            "Для Granddaddy Purple обычно называют восемь-одиннадцать недель. Его ребёнок приходит за семь-восемь, а это для коммерческого выращивания разница в целый цикл за год.",
            "Вот практическая причина, по которой имя обогнало родителя в меню. Механизм тот же, каким Northern Lights укорачивал хейзовые линии в девяностые, только масштабом меньше: аромат, который рынок хочет, на графике, который гровер может себе позволить.",
            "Из этого же следует, что как гарантия имя стоит меньше родительского. Быстрое, модное и доступное семенами растение растят все — хорошо и плохо, — и разброс того, что приходит под ярлыком, соответственно широк.",
          ],
        },
        {
          h2: "Виноград с ванилью, а не виноград с парфюмом",
          body: [
            "Дескрипторы — виноград, сладкая ягода, фруктовая карамель и ваниль. Поставьте рядом родителя, у которого виноград цветочный и парфюмерный, и разница в том, что этот засахарен: сладость вынесена вперёд, и в ней есть кондитерское качество, которого у старшего растения нет.",
            "Это и есть сортирующий вопрос между ними, и нос отвечает на него за секунду. Если виноград пахнет кондитерской — вы на территории Punch; если цветочной лавкой — на территории Granddaddy Purple.",
            "В отчётах здесь первыми идут бета-кариофиллен, лимонен и мирцен. Описания характера указывают на вечерний профиль с весом и спокойной телесностью — та же территория, что у родителя, и это ровно то, что половина его генетики и должна давать.",
          ],
        },
        {
          h2: "Про цвет",
          body: [
            "Пурпур у этого растения даёт пигмент, проявляющийся на прохладных ночах. В тропической гроубоксе он может не появиться вовсе, и его отсутствие ничего не говорит ни о том, как растение растили, ни о том, как оно будет пахнуть.",
            "Механизм разобран на странице Granddaddy Purple в этом же кластере: именно то растение и сделало цвет аргументом продажи. Прочитать это стоит раньше, чем обращать внимание на фотографию чего-нибудь пурпурного.",
            "Внимания здесь заслуживают аромат и состояние смоляных головок. И то и другое можно оценить с открытой банкой перед собой, чего о цвете в момент покупки в основном сказать нельзя.",
          ],
        },
      ],
      faqTitle: "Purple Punch: частые вопросы",
      faq: [
        {
          q: "Из чего скрещён Purple Punch?",
          a: "Larry OG и Granddaddy Purple. Половина его родословной — старший пурпурный сорт, поэтому они и пахнут роднёй.",
        },
        {
          q: "Почему имя так быстро разошлось?",
          a: "Symbiotic Genetics выпустили семена F2 в 2017 году, а растение доходит за семь-восемь недель — быстро для этой ароматической семьи, что и сделало его удобным для широкого выращивания.",
        },
        {
          q: "Чем он отличается от Granddaddy Purple?",
          a: "Виноград здесь засахаренный, а там цветочный. У этого кондитерская сладость с ванилью; родитель парфюмернее и сдержаннее.",
        },
        {
          q: "Почему он не пурпурный?",
          a: "Пурпур — пигмент, проявляющийся на прохладных ночах. В тёплой комнате растение может закончить зелёным, и цвет не является мерой чего-либо, что стоило бы покупать.",
        },
        {
          q: "Где он был сделан?",
          a: "На Гавайях, в Supernova Gardens, в начале 2010-х. Релиз семян 2017 года, сделавший имя широко доступным, — за Symbiotic Genetics.",
        },
      ],
      disclaimerTitle: "Чего эта страница делать не станет",
      disclaimer:
        "Она описывает сорт и не продаёт его. Ни цены, ни веса, ни сведений о наличии и ни одного утверждения, что растение что-либо лечит или облегчает. Всё с этого прилавка уходит лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "granddaddy-purple": {
    en: withFacts("granddaddy-purple", "en", {
      thingName: "Granddaddy Purple",
      title: "Granddaddy Purple: two accounts of the same cross",
      description:
        "Catalogues say Purple Urkle crossed with Big Bud; the breeder has described it differently. Plus how anthocyanin works, and why colour is not a grade.",
      h1: "Granddaddy Purple: the plant that made colour a selling point",
      kicker: "Strain notes",
      lead:
        "Ken Estes introduced this in Northern California in 2003, and within a few years purple had become a category. Nearly everything a menu now calls a purple cultivar either descends from this plant or imitates it. It is also the clearest example on this site of a lineage where the breeder and the catalogues do not tell the same story.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Two versions, both in circulation",
          body: [
            "Purple Urkle crossed with Big Bud is the version catalogues repeat, and it is what most readers will encounter. The breeder himself has described the cross differently, naming Mendo Purps, Skunk and Afghani material. Both accounts are in circulation and neither has been withdrawn.",
            "The facts table above marks the lineage as disputed for that reason. It would be easy to print the catalogue version alone and easier still to print the breeder's, and either choice would present a contested question as a settled one.",
            "This matters more than it looks. A pedigree is the main thing a reader uses to predict how a plant will smell; two incompatible pedigrees mean the prediction is worth less, and saying so is the only honest option.",
          ],
        },
        {
          h2: "How the colour actually works",
          body: [
            "Purple in cannabis comes from anthocyanins, the same class of pigment that colours red cabbage and blueberries. Expression depends on genetics and on temperature: cool nights during flowering bring the colour out, warm ones do not.",
            "Grown warm, the same genetics can finish entirely green. That is the whole mechanism, and it has two consequences worth carrying to a counter. First, colour is not a grade — a green plant of this cultivar is not a failed one. Second, in a tropical grow room, purple is harder to produce, so a very purple jar in this climate says something about the room rather than about the plant.",
            "Photographs of purple flower sell extremely well, which is exactly why this deserves stating plainly. What can actually be judged with the jar open is aroma, structure and the state of the resin.",
          ],
        },
        {
          h2: "Grape that is floral rather than candied",
          body: [
            "The descriptors here are grape, sweet berry, a floral note and damp earth. The grape reads as perfumed — closer to a flower shop than a sweet shop — and that is the distinction from Purple Punch, which took the same note in a candied direction.",
            "Myrcene leads the reported terpenes, with beta-caryophyllene and alpha-pinene behind it. That is the same trio Northern Lights and White Widow lead with, which is worth noticing: the grape here sits over a fairly classical earthy structure rather than replacing it.",
            "Eight to eleven weeks is the reported flowering range, which is wide. Twenty years of re-selection and two competing accounts of the parentage will do that to a number.",
          ],
        },
        {
          h2: "What it is a reference point for",
          body: [
            "Its listed neighbours are Purple Punch, which is its child and the faster, sweeter one; Northern Lights, which shares the earthy skeleton without any of the fruit; and Zkittlez, which took grape into candy territory entirely.",
            "Between those four you can map most of what a shelf means by fruit. Ask yourself whether you want the fruit perfumed, candied or absent, and the answer sorts the group without any reliance on labels.",
            "Character reports describe an evening profile with weight and a settled body, and they have been stable for two decades. As with every plant on this site, that is a summary of how people talk, not a forecast, and a specific jar remains its own thing regardless of what its ancestors were called.",
          ],
        },
      ],
      faqTitle: "Granddaddy Purple: common questions",
      faq: [
        {
          q: "Does purple mean stronger or better?",
          a: "No. Colour tracks temperature and genetics, not quality. Judge aroma, structure and resin with the jar open instead.",
        },
        {
          q: "Who made it and when?",
          a: "Ken Estes, in Northern California, introduced in 2003.",
        },
      ],
      disclaimerTitle: "The limits of what is said here",
      disclaimer:
        "A cultivar description that reports a disagreement rather than resolving it. It is not an offer and not health advice: no price, no weight, no stock, and no claim that any plant treats or relieves a condition. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("granddaddy-purple", "ru", {
      thingName: "Granddaddy Purple",
      title: "Granddaddy Purple: две версии одного скрещивания",
      description:
        "Каталоги говорят Purple Urkle с Big Bud; сам селекционер описывал скрещивание иначе. Плюс как работает антоциан и почему цвет — не сорт качества.",
      h1: "Granddaddy Purple: растение, сделавшее цвет аргументом продажи",
      kicker: "Заметки о сорте",
      lead:
        "Кен Эстес представил его в Северной Калифорнии в 2003 году, и за несколько лет пурпур стал категорией. Почти всё, что меню сегодня называет пурпурным сортом, либо происходит от этого растения, либо ему подражает. Это ещё и самый ясный на сайте пример родословной, о которой селекционер и каталоги рассказывают разное.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Две версии, обе в обращении",
          body: [
            "Purple Urkle, скрещённый с Big Bud, — версия, которую повторяют каталоги, и именно на неё наткнётся большинство читателей. Сам селекционер описывал скрещивание иначе, называя Mendo Purps, скунсовый и афганский материал. Обе версии в обращении, и ни от одной не отказались.",
            "Поэтому в таблице фактов родословная помечена как спорная. Легко было бы напечатать одну каталожную версию и ещё легче — селекционерскую, и любой из этих выборов подал бы спорный вопрос как решённый.",
            "Это важнее, чем кажется. Родословная — главное, чем читатель пользуется, предсказывая запах растения; две несовместимые родословные означают, что предсказание стоит меньше, и сказать об этом — единственный честный вариант.",
          ],
        },
        {
          h2: "Как на самом деле работает цвет",
          body: [
            "Пурпур в каннабисе дают антоцианы — тот же класс пигментов, что окрашивает краснокочанную капусту и голубику. Их проявление зависит от генетики и от температуры: прохладные ночи во время цветения цвет вытягивают, тёплые нет.",
            "Выращенная в тепле, та же генетика может закончить полностью зелёной. Вот и весь механизм, и у него два следствия, которые стоит унести с собой к прилавку. Первое: цвет — не сорт качества, зелёное растение этого сорта не является неудавшимся. Второе: в тропической гроубоксе пурпур получить труднее, поэтому очень пурпурная банка в этом климате говорит скорее о комнате, чем о растении.",
            "Фотографии пурпурных соцветий продаются исключительно хорошо — именно поэтому это заслуживает прямого проговаривания. С открытой банкой оценить можно аромат, структуру и состояние смолы.",
          ],
        },
        {
          h2: "Виноград цветочный, а не засахаренный",
          body: [
            "Дескрипторы здесь — виноград, сладкая ягода, цветочная нота и влажная земля. Виноград читается парфюмерно, ближе к цветочной лавке, чем к кондитерской, и это отличие от Purple Punch, который увёл ту же ноту в засахаренную сторону.",
            "В отчётах первым идёт мирцен, за ним бета-кариофиллен и альфа-пинен. Та же тройка возглавляет Northern Lights и White Widow, и это стоит заметить: виноград здесь лежит поверх довольно классической землистой структуры, а не заменяет её.",
            "Восемь-одиннадцать недель — заявленный диапазон цветения, и он широк. Двадцать лет переотбора и две конкурирующие версии родословной с числом именно это и делают.",
          ],
        },
        {
          h2: "Точкой отсчёта для чего он служит",
          body: [
            "Указанные соседи — Purple Punch, его ребёнок, более быстрый и более сладкий; Northern Lights, который делит с ним землистый скелет без всякого фрукта; и Zkittlez, уведший виноград в карамельную территорию целиком.",
            "На этих четырёх размечается почти всё, что полка понимает под фруктом. Спросите себя, нужен ли вам фрукт парфюмерный, засахаренный или отсутствующий, — и ответ рассортирует группу без всякой опоры на ярлыки.",
            "Характер описывают как вечерний профиль с весом и спокойной телесностью, и описание стабильно два десятилетия. Как и для любого растения на этом сайте, это сводка того, как говорят, а не прогноз, и конкретная банка остаётся собой независимо от того, как звали её предков.",
          ],
        },
      ],
      faqTitle: "Granddaddy Purple: частые вопросы",
      faq: [
        {
          q: "Из чего скрещён Granddaddy Purple?",
          a: "Каталоги повторяют Purple Urkle с Big Bud. Селекционер описывал скрещивание иначе, называя Mendo Purps, скунсовый и афганский материал. Обе версии в обращении, поэтому страница помечает родословную как спорную.",
        },
        {
          q: "Почему он пурпурный?",
          a: "Из-за антоциановых пигментов, проявляющихся при прохладных ночах во время цветения. Выращенная в тепле, та же генетика может закончить зелёной.",
        },
        {
          q: "Пурпур означает крепче или лучше?",
          a: "Нет. Цвет следует за температурой и генетикой, а не за качеством. Оценивайте аромат, структуру и смолу с открытой банкой.",
        },
        {
          q: "Чем он отличается от Purple Punch?",
          a: "Purple Punch — его ребёнок, доходит быстрее и засахарен. Этот — парфюмерная, цветочная версия той же виноградной ноты.",
        },
        {
          q: "Кто и когда его сделал?",
          a: "Кен Эстес в Северной Калифорнии; представлен в 2003 году.",
        },
      ],
      disclaimerTitle: "Границы сказанного",
      disclaimer:
        "Описание сорта, которое излагает разногласие, а не разрешает его. Это не оферта и не медицинский совет: ни цены, ни веса, ни наличия и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },
};
