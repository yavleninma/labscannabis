import type { Locale } from "@/lib/i18n";
import type { StrainPageCopy, StrainPages } from "@/data/strain-pages";
import { buildStrainFacts } from "./strain-catalog.ts";

/**
 * ТЕКСТ СТРАНИЦ СОРТОВ: хейзовая линия и тропическая ветка.
 *
 * Amnesia Haze, Super Silver Haze, Jack Herer, Pineapple Express.
 *
 * ЭТО САМАЯ ОПАСНАЯ ЧЕТВЁРКА КЛАСТЕРА ПО ПОХОЖЕСТИ: три из четырёх лежат в
 * одной ароматической семье, у трёх в предках Northern Lights, у двух ведущим
 * терпеном называют терпинолен. Именно здесь страница легче всего сползает в
 * шаблон «цитрус, благовония, дневной профиль», написанный четыре раза.
 *
 * Поэтому каждая разбирается через тот факт, которого нет у соседей:
 * у Amnesia Haze — цветение, которое коммерчески невыгодно, и отсутствие
 * опубликованной родословной; у Super Silver Haze — три кубка подряд и
 * задокументированное скрещивание, сделанное ради укорочения хейза;
 * у Jack Herer — имя человека и расщепление фенотипов; у Pineapple Express —
 * два публичных и несовместимых заявления о том, существовал ли сорт до фильма.
 *
 * Блок фактов собирает `buildStrainFacts(slug, locale)`: числа в прозе обязаны
 * совпадать с таблицей, потому что таблица считается из того же набора данных.
 */

function withFacts(
  slug: string,
  locale: Locale,
  copy: Omit<StrainPageCopy, "facts">,
): StrainPageCopy {
  return { ...copy, facts: buildStrainFacts(slug, locale) };
}

export const HAZE_STRAIN_PAGES: StrainPages = {
  "amnesia-haze": {
    en: withFacts("amnesia-haze", "en", {
      thingName: "Amnesia Haze",
      title: "Amnesia Haze strain: a bloom too long to be common",
      description:
        "Why a plant that needs ten to twelve weeks of flowering appears on more menus than it can possibly be on, what its Southeast Asian ancestry means, and how to tell it by nose.",
      h1: "Amnesia Haze: the name outnumbers the plant",
      kicker: "Strain notes",
      lead:
        "There is a commercial fact buried in this cultivar that explains most of what a visitor will encounter under its name. It needs ten to twelve weeks of bloom, and some phenotypes want fourteen. A grower who runs it gives up a substantial share of a year, so it is grown less than it is printed — and the gap between those two numbers is filled by other plants wearing the label.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "A pedigree that was never written down",
          body: [
            "Accounts describe a multi-way cross: Southeast Asian landraces with a Jamaican haze line, and Afghani and Hawaiian material brought in to pull the finish forward. No published pedigree exists. The catalogue entry on this site marks the lineage as disputed for that reason, and the reason is not academic — versions sold under this name genuinely differ.",
            "Soma Seeds in Amsterdam is the attribution usually given for the late-1990s work, and it too sits under a disputed mark. What is not in doubt is the Cannabis Cup result in 2004 and the Sativa Cup in 2012, both of which are outside records with a year attached.",
            "When a plant's family tree is a description rather than a document, the honest thing a page can do is say which parts are sturdy. Here the aroma and the flowering window are sturdy; the exact ancestry is not.",
          ],
        },
        {
          h2: "Ten to twelve weeks is the whole story",
          body: [
            "Compare it with the six to seven weeks a Northern Lights needs and the economics resolve immediately. A room running Amnesia Haze produces markedly fewer harvests a year than the same room running almost anything else on this list.",
            "That is why the long-flowering phenotypes are rare, why the name is often attached to faster plants, and why asking a shop how long a batch took is a genuinely diagnostic question. It is an ordinary question with an ordinary answer wherever somebody actually knows their supply.",
            "It is also why so many people who order it in Europe and then meet it in Asia report that it is not what they remember. Some of that is climate and curing. Some of it is that the two jars were not the same plant.",
          ],
        },
        {
          h2: "Lemon over incense, not fruit over sugar",
          body: [
            "The signature is citrus sitting on top of an incense-and-herbal base, with damp earth beneath. It is a dry, resinous smell rather than a sweet one, and that single distinction sorts it from three quarters of a modern menu at a sniff.",
            "A jar under this name that smells sweet and fruity is not carrying the haze side at all. Sweetness is what the dessert and candy families sell; the haze family sells brightness and resin, and the two are not close once you have smelled them side by side.",
            "The reported terpenes lead with myrcene, limonene and beta-caryophyllene. Those three appear on half the pages in this cluster — the difference between family members is in the proportions and in what the aroma descriptors say, which is exactly why the facts table lists both.",
          ],
        },
        {
          h2: "Southeast Asian ancestry, met in Southeast Asia",
          body: [
            "The Southeast Asian half of its ancestry comes from the same equatorial material Thai landraces belong to, which makes this an unusually apt name to encounter in Thailand. It is worth being precise about the claim, though: this is regional ancestry described in secondary accounts, not documented Thai landrace input.",
            "The cultivar on this list with a documented Thai component is AK-47, where the breeder states the four regions of the seed stock himself. Amnesia Haze is the looser case, and this page will not upgrade it.",
            "Its nearest neighbours here are Super Silver Haze, which is the same family with a documented pedigree and a shorter bloom, and Jack Herer, which trades incense for pine. Between those three, the haze corner of a shelf is fully mapped.",
          ],
        },
      ],
      faqTitle: "Amnesia Haze: common questions",
      faq: [
        {
          q: "How long does Amnesia Haze flower?",
          a: "Ten to twelve weeks is the range usually given, and some sources go to fourteen. Long-flowering phenotypes are common, which is why it is rarely grown for speed.",
        },
        {
          q: "Why does it taste different from the one I had in Europe?",
          a: "Partly climate and curing, partly that the name covers several different plants. A long-flowering cultivar is expensive to grow, and faster plants often carry the label.",
        },
      ],
      disclaimerTitle: "What this page is not",
      disclaimer:
        "A description of a cultivar, with the shaky parts marked as shaky. It is not an offer and not health advice: no price, no weight, nothing about today's shelf, and no claim that any plant treats or relieves a condition. Sales are in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("amnesia-haze", "ru", {
      thingName: "Amnesia Haze",
      title: "Сорт Amnesia Haze: цветение, слишком долгое для массовости",
      description:
        "Почему растение, которому нужно десять-двенадцать недель цветения, стоит в большем числе меню, чем физически возможно, что значит его юго-восточноазиатское происхождение и как узнать его по носу.",
      h1: "Amnesia Haze: имени больше, чем растения",
      kicker: "Заметки о сорте",
      lead:
        "В этом сорте зарыт коммерческий факт, который объясняет почти всё, с чем приезжий столкнётся под его именем. Ему нужно десять-двенадцать недель цветения, а некоторым фенотипам и четырнадцать. Гровер, который его ведёт, отдаёт под него заметную часть года, поэтому выращивают его реже, чем печатают, — и разрыв между этими числами заполняют другие растения с тем же ярлыком.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Родословная, которую никто не записал",
          body: [
            "Версии описывают многостороннее скрещивание: юго-восточноазиатские ландрейсы с ямайской хейзовой линией плюс афганский и гавайский материал, введённый ради укорочения цветения. Опубликованной родословной не существует. Поэтому в наборе данных линия помечена как спорная — и помета не академическая: версии, продаваемые под этим именем, действительно разные.",
            "Работу конца девяностых обычно приписывают амстердамской Soma Seeds, и эта атрибуция тоже стоит под спорной пометой. Не вызывают сомнений результат Cannabis Cup 2004 года и Sativa Cup 2012-го: это внешние записи с проставленным годом.",
            "Когда семейное дерево растения — это пересказ, а не документ, честное, что может сделать страница, — сказать, какие части держатся. Здесь держатся аромат и окно цветения; точное происхождение — нет.",
          ],
        },
        {
          h2: "Десять-двенадцать недель — и в этом вся история",
          body: [
            "Сравните с шестью-семью неделями, которые нужны Northern Lights, и экономика снимается сразу. Комната, работающая на Amnesia Haze, даёт заметно меньше сборов в год, чем та же комната почти на чём угодно другом из этого списка.",
            "Отсюда и редкость долгоцветущих фенотипов, и то, что имя цепляют на более быстрые растения, и то, что вопрос «сколько эта партия доходила» действительно диагностичен. Там, где человек знает своё снабжение, это обычный вопрос с обычным ответом.",
            "Отсюда же и жалобы тех, кто заказывал его в Европе, а встретил в Азии: не то, что помнится. Часть разницы — климат и вылёживание. Часть — в том, что это были не одно и то же растение.",
          ],
        },
        {
          h2: "Лимон поверх благовоний, а не фрукт поверх сахара",
          body: [
            "Подпись — цитрус, лежащий поверх основы из благовоний и зелёных трав, с влажной землёй снизу. Запах сухой и смолистый, а не сладкий, и одно это различие отсекает три четверти современного меню на одном вдохе.",
            "Банка под этим именем, которая пахнет сладко и фруктово, хейзовую сторону не несёт вовсе. Сладость продают десертные и карамельные семьи; хейзовая продаёт светлоту и смолу, и, если понюхать их рядом, близкими они не покажутся.",
            "В отчётах первыми называют мирцен, лимонен и бета-кариофиллен. Эти три встречаются на половине страниц кластера — члены семьи различаются пропорциями и тем, что говорят ароматические дескрипторы, поэтому таблица фактов показывает и то и другое.",
          ],
        },
        {
          h2: "Юго-восточноазиатские предки, встреченные в Юго-Восточной Азии",
          body: [
            "Юго-восточноазиатская половина его происхождения — тот же экваториальный материал, к которому относятся и тайские ландрейсы, и поэтому имя необычно уместно встретить в Таиланде. Формулировать стоит точно: это региональное происхождение по вторичным пересказам, а не задокументированный тайский ландрейс в родителях.",
            "Сорт с задокументированной тайской составляющей в этом списке один — AK-47, где четыре региона исходного семенного материала называет сам селекционер. Amnesia Haze — случай более рыхлый, и повышать его статус эта страница не станет.",
            "Ближайшие соседи здесь — Super Silver Haze, та же семья с задокументированной родословной и более коротким цветением, и Jack Herer, который меняет благовония на хвою. На этих трёх хейзовый угол полки размечается целиком.",
          ],
        },
      ],
      faqTitle: "Amnesia Haze: частые вопросы",
      faq: [
        {
          q: "Сколько цветёт Amnesia Haze?",
          a: "Обычно называют десять-двенадцать недель, а часть источников доводит до четырнадцати. Долгоцветущие фенотипы встречаются часто, поэтому ради скорости его почти не выращивают.",
        },
        {
          q: "Почему он не такой, как тот, что я пробовал в Европе?",
          a: "Отчасти климат и вылёживание, отчасти то, что имя покрывает несколько разных растений. Долгоцветущий сорт дорог в выращивании, и ярлык часто носят более быстрые растения.",
        },
        {
          q: "Как он должен пахнуть?",
          a: "Лимон и цитрусовая корка поверх благовоний и зелёных трав, снизу влажная земля. Смолисто и сухо, а не сладко.",
        },
        {
          q: "Есть ли у него проверяемые победы?",
          a: "Да: Cannabis Cup 2004 года и Sativa Cup 2012-го. В отличие от родословной это внешние записи с годами.",
        },
      ],
      disclaimerTitle: "Чем эта страница не является",
      disclaimer:
        "Описание сорта, в котором шаткое помечено как шаткое. Это не оферта и не медицинский совет: ни цены, ни веса, ничего о сегодняшней полке и ни одного утверждения, что растение что-либо лечит или облегчает. Отпуск — лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "super-silver-haze": {
    en: withFacts("super-silver-haze", "en", {
      thingName: "Super Silver Haze",
      title: "Super Silver Haze: three Cups in a row and why it exists",
      description:
        "A documented cross of Skunk #1, Northern Lights and Haze made to solve a specific problem — and the terpinolene marker that separates a haze from a fruit hybrid by nose.",
      h1: "Super Silver Haze: a haze engineered to be growable",
      kicker: "Strain notes",
      lead:
        "The Haze family had a problem in the 1990s. The plants smelled like nothing else and took three months of bloom to get there, which made them wonderful and commercially unserious. Super Silver Haze is the answer somebody built: keep the citrus and incense, borrow structure and speed from two other classics, and see whether the result still smells like a haze.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "The cross is documented, which is rare here",
          body: [
            "Skunk #1, Northern Lights and Haze. This is one of only two lineages in this cluster marked as documented rather than commonly cited, and it is worth noticing how unusual that is — most of the famous names on a menu carry a pedigree reconstructed after the fact.",
            "Each parent has a job. Haze supplies the aroma and the character. Northern Lights, which finishes in six to seven weeks, pulls the schedule back. Skunk #1 firms up the structure and the yield. The result flowers in ten to eleven weeks, which is still long but no longer impossible.",
            "The work is attributed to Green House Seeds in Amsterdam in the mid-1990s, with Shantibaba and Neville Schoenmakers named. Both names recur across this cluster: Schoenmakers is the man who took Northern Lights to the Netherlands a decade earlier, and Shantibaba is credited with the Green House work behind White Widow.",
          ],
        },
        {
          h2: "Three consecutive Cannabis Cups",
          body: [
            "1997, 1998, 1999. Nothing had done that before, and the run is the reason this name reached menus that have never had the plant anywhere near them. A competition result is one of the few claims in this trade with a date, a place and an outside record behind it.",
            "It is also a claim about a specific moment. A plant that won in 1998 tells you about a plant grown by particular people in a particular room; it says nothing about what is in a jar in Pattaya twenty-eight years later.",
            "The competition results are printed in the facts table above precisely because they are checkable. Where a claim rests only on a breeder's own count, this cluster leaves the row empty rather than filling it — the AK-47 page explains that case in detail.",
          ],
        },
        {
          h2: "Terpinolene is the fingerprint",
          body: [
            "The reported terpene profile here leads with terpinolene, which is unusual and which is the fastest way to tell a haze from a fruit hybrid without knowing anything else. Terpinolene reads as fresh and herbal with an apple-and-pine edge — it is not sweet, and it does not resemble the citrus-sugar note of the candy families.",
            "Over that sit lemon, incense, green herbs, pine and a skunk backing from the Skunk #1 side. The skunk is the detail that separates it from Amnesia Haze, which has incense and citrus but no funk underneath.",
            "The character is described as a clear-headed daytime profile with a focused quality, and that description has been stable since the Cup years. It is still a description of how people talk about the plant, not a prediction about any particular afternoon.",
          ],
        },
        {
          h2: "Choosing between the three hazes on this list",
          body: [
            "Amnesia Haze is the long, uncommercial one with the disputed ancestry. Jack Herer, made in the Netherlands at almost the same time, went towards pine and floral notes. This one keeps the citrus and adds funk.",
            "The practical sorting question at a counter is what you want underneath the brightness: incense, skunk or resinous pine. All three of those are legible to a nose that has smelled the family once, and none of them require anyone to trust a label.",
            "Against Blue Dream, its other listed neighbour, the difference is the sweetness: Blue Dream puts berry over its haze backbone and this does not. People who like haze but find Blue Dream cloying usually end up here.",
          ],
        },
      ],
      faqTitle: "Super Silver Haze: common questions",
      faq: [
        {
          q: "What is Super Silver Haze crossed from?",
          a: "Skunk #1, Northern Lights and Haze. It is one of the few lineages in this cluster that is documented rather than reconstructed from catalogues.",
        },
        {
          q: "How long does it flower?",
          a: "Ten to eleven weeks indoors. That is long, but far shorter than the pure Haze lines it was built to make practical.",
        },
        {
          q: "How do I tell it apart from Amnesia Haze by smell?",
          a: "The skunk. Both have citrus over incense; this one has a funky Skunk #1 backing underneath, and Amnesia Haze does not.",
        },
      ],
      disclaimerTitle: "Limits of what is claimed here",
      disclaimer:
        "This describes a cultivar and the competition record attached to it. It is not an offer and not medical guidance: no price, no weight, no stock, and no claim that any plant treats anything. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("super-silver-haze", "ru", {
      thingName: "Super Silver Haze",
      title: "Super Silver Haze: три кубка подряд и зачем он был сделан",
      description:
        "Задокументированное скрещивание Skunk #1, Northern Lights и Haze, сделанное ради конкретной задачи, и терпинолен как маркер, отличающий хейз от фруктового гибрида по носу.",
      h1: "Super Silver Haze: хейз, сконструированный так, чтобы его можно было растить",
      kicker: "Заметки о сорте",
      lead:
        "У хейзового семейства в девяностые была проблема. Растения пахли так, как не пахло больше ничто, и шли к этому три месяца цветения, что делало их прекрасными и коммерчески несерьёзными. Super Silver Haze — это чей-то ответ: сохранить цитрус и благовония, занять структуру и скорость у двух других классиков и посмотреть, пахнет ли результат по-прежнему хейзом.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Скрещивание задокументировано, а это здесь редкость",
          body: [
            "Skunk #1, Northern Lights и Haze. Это одна из всего двух родословных кластера, помеченных как задокументированные, а не как общепринятая версия, и стоит заметить, насколько это необычно: большинство громких имён в меню несут родословную, восстановленную задним числом.",
            "У каждого родителя своя работа. Haze даёт аромат и характер. Northern Lights, доходящий за шесть-семь недель, тянет график назад. Skunk #1 укрепляет структуру и урожай. Результат цветёт десять-одиннадцать недель — всё ещё долго, но уже не невозможно.",
            "Работу приписывают амстердамской Green House Seeds середины девяностых, называя Shantibaba и Невилла Схунмакерса. Оба имени повторяются в этом кластере: Схунмакерс десятью годами раньше привёз в Нидерланды Northern Lights, а Shantibaba приписывают работу Green House, стоящую за White Widow.",
          ],
        },
        {
          h2: "Три Cannabis Cup подряд",
          body: [
            "1997, 1998, 1999. До этого такого не делал никто, и именно эта серия занесла имя в меню, рядом с которыми растение никогда не стояло. Конкурсный результат — одно из немногих утверждений в этой отрасли, за которым есть дата, место и внешняя запись.",
            "Это ещё и утверждение о конкретном моменте. Растение, победившее в 1998-м, рассказывает о растении, выращенном конкретными людьми в конкретной комнате; о том, что лежит в банке в Паттайе двадцать восемь лет спустя, оно не говорит ничего.",
            "Конкурсные результаты стоят в таблице выше именно потому, что их можно проверить. Там, где утверждение опирается только на собственный счёт селекционера, кластер оставляет строку пустой, а не заполняет её, — подробно этот случай разбирает страница AK-47.",
          ],
        },
        {
          h2: "Терпинолен — это отпечаток пальца",
          body: [
            "В отчётах здесь первым идёт терпинолен, что необычно и что даёт самый быстрый способ отличить хейз от фруктового гибрида, ничего больше не зная. Терпинолен читается свежо и травянисто, с яблочно-сосновым краем: он не сладкий и не похож на цитрусово-сахарную ноту карамельных семейств.",
            "Поверх него стоят лимон, благовония, зелёные травы, хвоя и скунсовая подложка со стороны Skunk #1. Скунс — та деталь, что отделяет его от Amnesia Haze, где благовония и цитрус есть, а едкости под ними нет.",
            "Характер описывают как ясный дневной профиль с собранностью, и это описание стабильно со времён кубков. Оно по-прежнему остаётся описанием того, как о растении говорят, а не прогнозом на конкретный день.",
          ],
        },
        {
          h2: "Как выбирать между тремя хейзами списка",
          body: [
            "Amnesia Haze — долгий и некоммерческий, со спорным происхождением. Jack Herer, сделанный в Нидерландах почти тогда же, ушёл в хвою и цветочность. Этот сохраняет цитрус и добавляет едкость.",
            "Практический сортирующий вопрос у прилавка — что вам нужно под светлотой: благовония, скунс или смолистая хвоя. Все три читаются носом, который хоть раз нюхал это семейство, и ни один из них не требует доверять ярлыку.",
            "Против Blue Dream, второго указанного соседа, разница в сладости: Blue Dream кладёт ягоду поверх хейзовой основы, а здесь этого нет. Те, кому нравится хейз, но приторен Blue Dream, обычно оказываются тут.",
          ],
        },
      ],
      faqTitle: "Super Silver Haze: частые вопросы",
      faq: [
        {
          q: "Из чего скрещён Super Silver Haze?",
          a: "Skunk #1, Northern Lights и Haze. Это одна из немногих родословных кластера, которая задокументирована, а не восстановлена по каталогам.",
        },
        {
          q: "Что он выиграл?",
          a: "Cannabis Cup в 1997, 1998 и 1999 годах — три года подряд, чего до него не удавалось никому.",
        },
        {
          q: "Сколько он цветёт?",
          a: "Десять-одиннадцать недель в помещении. Это долго, но заметно короче чистых хейзовых линий, ради практичности которых он и был сделан.",
        },
        {
          q: "Как отличить его от Amnesia Haze по запаху?",
          a: "По скунсу. Цитрус поверх благовоний есть у обоих, но здесь снизу стоит едкая подложка от Skunk #1, а у Amnesia Haze её нет.",
        },
        {
          q: "Зачем знать про терпинолен?",
          a: "Он читается свежо и слегка яблочно, а не сладко, и возглавляет отчёты по хейзовому семейству. Если банка пахнет сахарно, это не хейзовый профиль.",
        },
      ],
      disclaimerTitle: "Границы сказанного здесь",
      disclaimer:
        "Здесь описан сорт и связанная с ним конкурсная запись. Это не оферта и не медицинское руководство: ни цены, ни веса, ни наличия и ни одного утверждения, что растение что-то лечит. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },

  "jack-herer": {
    en: withFacts("jack-herer", "en", {
      thingName: "Jack Herer",
      title: "Jack Herer strain: named after a person, split by phenotype",
      description:
        "A 1994 Sensi Seeds cross of Haze with a Northern Lights #5 and Shiva Skunk line, why its phenotypes finish at different speeds, and what ocimene adds to the nose.",
      h1: "Jack Herer: one of the few names that honours a person",
      kicker: "Strain notes",
      lead:
        "Cultivar names usually describe something — a resin coat, a colour, a smell, a fictional character picked by a marketing department. This one names an American author and campaigner, and it was made in 1994 by a Dutch seed bank that intended it as a tribute. That is almost unique on a menu, and it is the least useful thing about the plant.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "What Sensi actually crossed",
          body: [
            "The version usually written down is Haze crossed onto a line combining Northern Lights #5 and Shiva Skunk. The exact crossing order varies between sources, which is why the catalogue marks the lineage as commonly cited rather than documented. It was made in 1994 and released as seed the following year.",
            "The strategy is the same one Super Silver Haze used at almost the same moment: take a Haze, which is the aroma you want, and cross in Northern Lights, which is the schedule you can afford. Two Dutch breeders solved one problem in the same decade with overlapping ingredients and arrived at plants that do not smell alike.",
            "That divergence is the interesting part. Same family, same era, same country, overlapping parents — and one ended up citrus-and-skunk while this one ended up pine-and-floral. Parentage constrains a plant; it does not determine it.",
          ],
        },
        {
          h2: "The phenotypes finish at different speeds",
          body: [
            "Sensi's own grow report gives roughly sixty-three to seventy days, and the split inside that window is visible: the indica-leaning phenotypes come in around nine weeks, the sativa-leaning ones closer to ten. They do not smell identical either.",
            "So a jar labelled only Jack Herer has named a family and not a member of it, in the same way a jar labelled only Gelato or only Bruce Banner has. This is a recurring problem with cultivars that were released as seed rather than distributed as a single clone.",
            "Where a shop can say which side of the split a batch came from, that is a sign of attention. Where it cannot, the nose settles it: the sativa-leaning selections are brighter and more floral, the shorter ones denser and more resinous.",
          ],
        },
        {
          h2: "Terpinolene with pinene, and a little ocimene",
          body: [
            "The reported profile leads with terpinolene and alpha-pinene, and it also carries ocimene, which appears on almost no other page in this cluster. Ocimene reads as sweet green herbs with a light mint lift, and it is what gives this plant a floral edge the other hazes do not have.",
            "The aroma descriptors are pine, lemon, green herbs and a floral note. There is no sweetness in the dessert sense and no fuel at all, which puts it about as far from the Kush corner of a shelf as this cluster goes.",
            "Character descriptions converge on a clear-headed daytime profile with a focused quality — the same territory as Super Silver Haze, which is fair, since they were built from overlapping parts to solve the same problem.",
          ],
        },
        {
          h2: "Where to put it beside its neighbours",
          body: [
            "Against Super Silver Haze the difference is what sits under the brightness: skunk there, resinous pine and florals here. Against Amnesia Haze it is incense against pine. Against AK-47, its third listed neighbour, the whole register changes — AK-47 is earth and wood, and this is the opposite end of the same decade of Dutch work.",
            "If pine is what you like, this and White Widow are the two names to try, and they are not the same: White Widow is pine with pepper and a dry structure, this is pine with lemon and a floral lift.",
            "None of that requires trusting the label. Ask for something piney and bright rather than sweet, and any counter that knows its jars can work with the sentence.",
          ],
        },
      ],
      faqTitle: "Jack Herer: common questions",
      faq: [
        {
          q: "Who was Jack Herer?",
          a: "An American author and campaigner. The cultivar was named after him by Sensi Seeds in the mid-1990s, which makes it one of very few strain names honouring a person rather than describing a plant.",
        },
        {
          q: "What does it smell like?",
          a: "Pine and lemon with green herbs and a floral note. Terpinolene and pinene lead the reports, with ocimene adding the herbal-mint lift.",
        },
      ],
      disclaimerTitle: "What this page will not tell you",
      disclaimer:
        "It describes a cultivar, not a product. There is no price here, no weight, no stock status and no suggestion that any plant treats or relieves a condition. Everything sold at this counter is sold in person, to adults of twenty and over, under the paperwork Thai rules require.",
    }),
    ru: withFacts("jack-herer", "ru", {
      thingName: "Jack Herer",
      title: "Сорт Jack Herer: назван в честь человека, расщеплён по фенотипам",
      description:
        "Скрещивание Sensi Seeds 1994 года: Haze на линию Northern Lights #5 и Shiva Skunk, почему фенотипы доходят с разной скоростью и что добавляет носу оцимен.",
      h1: "Jack Herer: одно из немногих имён в честь человека",
      kicker: "Заметки о сорте",
      lead:
        "Названия сортов обычно что-то описывают: слой смолы, цвет, запах, выдуманного персонажа, выбранного отделом маркетинга. Это названо в честь американского писателя и общественного деятеля, и сделал его в 1994 году голландский семенной банк — как признание заслуг. В меню это почти уникально и при этом наименее полезно из всего, что о растении можно знать.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Что именно скрестили в Sensi",
          body: [
            "Обычно записывают так: Haze, скрещённый на линию, соединяющую Northern Lights #5 и Shiva Skunk. Порядок скрещивания у источников разный — поэтому в наборе данных родословная помечена как общепринятая версия, а не как задокументированная. Сделан в 1994 году, выпущен семенами годом позже.",
            "Стратегия та же, что у Super Silver Haze почти в тот же момент: взять хейз, который даёт нужный аромат, и ввести Northern Lights, который даёт посильный график. Два голландских селекционера решали одну задачу в одно десятилетие пересекающимися ингредиентами и пришли к растениям, которые пахнут по-разному.",
            "Вот это расхождение и есть самое интересное. Одна семья, одна эпоха, одна страна, пересекающиеся родители — и один вышел цитрусово-скунсовым, а этот сосново-цветочным. Родословная ограничивает растение, но не задаёт его.",
          ],
        },
        {
          h2: "Фенотипы доходят с разной скоростью",
          body: [
            "Собственный отчёт Sensi о выращивании даёт примерно шестьдесят три-семьдесят дней, и расщепление внутри этого окна видно глазом: фенотипы с индиковым креном приходят к девяти неделям, с сативным — ближе к десяти. Пахнут они тоже не одинаково.",
            "Значит, банка, подписанная просто Jack Herer, назвала семью, а не её члена, — ровно как банка, подписанная просто Gelato или просто Bruce Banner. Это регулярная беда сортов, которые выпускали семенами, а не раздавали одним клоном.",
            "Если в магазине могут сказать, с какой стороны расщепления партия, это признак внимания. Если не могут, вопрос решает нос: сативные отборы светлее и цветочнее, короткие — плотнее и смолистее.",
          ],
        },
        {
          h2: "Терпинолен с пиненом и немного оцимена",
          body: [
            "В отчётах первыми идут терпинолен и альфа-пинен, а ещё в профиле есть оцимен, которого почти нет ни на одной другой странице кластера. Оцимен читается как сладкие зелёные травы с лёгким мятным подъёмом — именно он даёт этому растению цветочный край, которого у других хейзов нет.",
            "Ароматические дескрипторы здесь — хвоя, лимон, зелёные травы и цветочная нота. Сладости в десертном смысле нет, топлива нет вовсе, и это уводит его от кушевого угла полки настолько далеко, насколько в этом кластере вообще возможно.",
            "Описания характера сходятся на ясном дневном профиле с собранностью — та же территория, что у Super Silver Haze, и это справедливо: их собирали из пересекающихся частей под одну задачу.",
          ],
        },
        {
          h2: "Куда его ставить рядом с соседями",
          body: [
            "Против Super Silver Haze разница в том, что лежит под светлотой: там скунс, здесь смолистая хвоя и цветочность. Против Amnesia Haze — благовония против хвои. Против AK-47, третьего указанного соседа, меняется весь регистр: AK-47 — это земля и дерево, а это противоположный край того же десятилетия голландской работы.",
            "Если вам нравится хвоя, пробовать стоит два имени — это и White Widow, и они не одинаковы: White Widow — хвоя с перцем и сухой структурой, здесь — хвоя с лимоном и цветочным подъёмом.",
            "Доверять ярлыку для этого не нужно. Попросите что-нибудь хвойное и светлое, а не сладкое, — и любой прилавок, который знает свои банки, с этой фразой справится.",
          ],
        },
      ],
      faqTitle: "Jack Herer: частые вопросы",
      faq: [
        {
          q: "Кто такой Джек Херер?",
          a: "Американский писатель и общественный деятель. Сорт назвали в его честь в Sensi Seeds в середине девяностых, и это одно из очень немногих названий, которое чествует человека, а не описывает растение.",
        },
        {
          q: "Почему две банки Jack Herer так отличаются?",
          a: "Потому что фенотипы расщепляются. Индиковые отборы доходят примерно за девять недель, сативные — ближе к десяти, и пахнут они тоже по-разному.",
        },
        {
          q: "Как он пахнет?",
          a: "Хвоя и лимон с зелёными травами и цветочной нотой. В отчётах первыми идут терпинолен и пинен, а оцимен добавляет травяно-мятный подъём.",
        },
        {
          q: "Он похож на Super Silver Haze?",
          a: "Их собирали из пересекающихся частей в одно десятилетие, и оба читаются светло и ясно, но основы разные: под Super Silver Haze скунс, здесь смолистая хвоя и цветочность.",
        },
      ],
      disclaimerTitle: "Чего эта страница не скажет",
      disclaimer:
        "Она описывает сорт, а не товар. Здесь нет ни цены, ни веса, ни сведений о наличии и ни намёка на то, что растение что-либо лечит или облегчает. Всё, что уходит с этого прилавка, уходит лично, взрослым от двадцати лет, с документами, которых требуют тайские правила.",
    }),
  },

  "pineapple-express": {
    en: withFacts("pineapple-express", "en", {
      thingName: "Pineapple Express",
      title: "Pineapple Express: a film, a breeder, and two versions of events",
      description:
        "G13 Labs says it selected the cross before the 2008 film; the film's co-writer says the plant did not exist until the name did. Both statements are on the record.",
      h1: "Pineapple Express: the clearest case of a name selling a plant",
      kicker: "Strain notes",
      lead:
        "Somewhere on every menu there is a name that got famous before the plant did. This is that name, and unusually, the disagreement about it is public: the seed bank says it made the cross in the mid-2000s, and the man who co-wrote the 2008 film says the cultivar did not exist until the film created demand for it. Neither has withdrawn.",
      factsTitle: "At a glance",
      sections: [
        {
          h2: "Two statements that cannot both be right",
          body: [
            "G13 Labs describes selecting Trainwreck crossed with Hawaiian material before the film came out. Seth Rogen, who co-wrote it, has said the name came first and growers attached plants to it afterwards. Both accounts are on the record, and the catalogue entry on this site marks the origin as disputed rather than choosing.",
            "This is not a trivia question. If a name existed before its plant, then everything sold under it in the years immediately after the film is, by construction, whatever a grower decided to call by that name — and a lot of that material is still circulating downstream.",
            "It is the sharpest illustration of the point every page in this cluster makes: nobody owns these names, no register exists, and a famous name is a marketing asset before it is a description.",
          ],
        },
        {
          h2: "What the cross actually is",
          body: [
            "Trainwreck with a Hawaiian sativa landrace, as usually given. Trainwreck is the side that explains the schedule — seven to nine weeks of bloom is short for something billed as sativa-leaning, and pure equatorial material does not finish that fast.",
            "The Hawaiian half is where the fruit comes from. It is the only page in this cluster whose aroma family is tropical, and that is not a marketing category: pineapple and tropical fruit sit over dry wood and damp earth, with a citrus-peel edge on a good example.",
            "The distinction from the candy families matters. Runtz and Zkittlez smell like sugar; this smells like fruit and cedar. If a jar under this name reads as sweets rather than as fruit, it has more in common with the Runtz side of the shelf than with anything Hawaiian.",
          ],
        },
        {
          h2: "How to judge it without trusting the name",
          body: [
            "Ignore the label and ask what the fruit sits on. Genuine tropical character here has wood underneath it, and the wood is the part that a plant merely labelled Pineapple Express usually lacks.",
            "The reported terpenes lead with beta-caryophyllene, limonene, alpha-pinene and myrcene — a combination that is fruit-forward without being sweet, and the pinene is a real part of why the aroma has a dry edge rather than a candied one.",
            "Character descriptions point to a clear-headed, talkative daytime profile. Given how much material has worn this name over the last two decades, that description should be treated as being about a family of plants rather than about the specific jar in front of you.",
          ],
        },
        {
          h2: "Where it sits against its neighbours",
          body: [
            "Blue Dream is the closest comparison and the useful one: both are sativa-leaning, both are fruit over something else, and the something else is what separates them. Blue Dream puts berry over a haze backbone; this puts pineapple over wood.",
            "Against Super Silver Haze the gap is wider — no fruit at all on that side, just citrus and incense. Against Runtz the gap is in the sugar: Runtz is candy and cream, this is fruit and cedar.",
            "If you want fruit but not sweets, this and Blue Dream are the two names to describe at a counter. Describe the fruit rather than saying either name, and you will be handed something closer to what you meant.",
          ],
        },
      ],
      faqTitle: "Pineapple Express: common questions",
      faq: [
        {
          q: "Did the strain exist before the film?",
          a: "That is exactly what is disputed. G13 Labs says it selected the cross in the mid-2000s; Seth Rogen, who co-wrote the 2008 film, has said the cultivar did not exist until the film created demand for the name.",
        },
        {
          q: "How is it different from Runtz?",
          a: "Sugar. Runtz is caramel and cream, this one is fruit and cedar. Both are fruity, and they do not smell alike.",
        },
        {
          q: "Is it a sativa?",
          a: "It is usually classed as sativa-leaning, though a seven-to-nine-week bloom is short for that description — which is the Trainwreck side showing.",
        },
      ],
      disclaimerTitle: "What is and is not claimed",
      disclaimer:
        "This page describes a cultivar and reports a public disagreement about its origin without resolving it. It is not an offer and not health advice: no price, no weight, no stock and no medical claim of any kind. Sales are in person, to adults of twenty and over, under the documents Thai rules require.",
    }),
    ru: withFacts("pineapple-express", "ru", {
      thingName: "Pineapple Express",
      title: "Pineapple Express: фильм, селекционер и две версии событий",
      description:
        "G13 Labs утверждает, что отобрала скрещивание до фильма 2008 года; соавтор сценария говорит, что сорта не существовало, пока не появилось название. Оба заявления публичны.",
      h1: "Pineapple Express: самый ясный случай, когда имя продаёт растение",
      kicker: "Заметки о сорте",
      lead:
        "В любом меню найдётся имя, которое прославилось раньше растения. Это оно, и необычно здесь то, что спор публичный: семенной банк говорит, что сделал скрещивание в середине двухтысячных, а соавтор сценария фильма 2008 года говорит, что сорта не существовало, пока фильм не создал спрос на название. Ни один из них от своих слов не отказался.",
      factsTitle: "Коротко",
      sections: [
        {
          h2: "Два заявления, которые не могут быть верны одновременно",
          body: [
            "G13 Labs описывает отбор Trainwreck, скрещённого с гавайским материалом, до выхода фильма. Сет Роген, соавтор сценария, говорил, что сначала было название, а растения к нему прицепили потом. Оба заявления публичны, и в наборе данных происхождение помечено как спорное — вместо того чтобы выбирать.",
            "Это не вопрос для викторины. Если имя появилось раньше растения, то всё, что продавалось под ним в первые годы после фильма, по построению является тем, что гровер решил так назвать, — и немалая часть того материала до сих пор ходит ниже по течению.",
            "Это самая резкая иллюстрация тезиса, который повторяет каждая страница кластера: этими именами никто не владеет, реестра не существует, и громкое имя сначала маркетинговый актив и только потом описание.",
          ],
        },
        {
          h2: "Что представляет собой само скрещивание",
          body: [
            "Обычно указывают Trainwreck с гавайской сативой-ландрейсом. Trainwreck — та сторона, которая объясняет график: семь-девять недель цветения коротко для того, что заявлено с сативным креном, а чистый экваториальный материал так быстро не доходит.",
            "Гавайская половина отвечает за фрукт. Это единственная страница кластера, где ароматическая семья тропическая, и это не маркетинговая категория: ананас и тропические фрукты стоят поверх сухого дерева и влажной земли, а у хорошего образца сверху идёт край цитрусовой корки.",
            "Отличие от карамельных семейств здесь существенно. Runtz и Zkittlez пахнут сахаром; этот пахнет фруктом и кедром. Если банка под этим именем читается как конфеты, а не как фрукт, у неё больше общего с полкой Runtz, чем с чем-либо гавайским.",
          ],
        },
        {
          h2: "Как оценить его, не доверяя названию",
          body: [
            "Не смотрите на ярлык и спросите, на чём стоит фрукт. У настоящего тропического характера под ним есть дерево, и именно дерева обычно не хватает растению, которое просто подписали Pineapple Express.",
            "В отчётах первыми идут бета-кариофиллен, лимонен, альфа-пинен и мирцен: комбинация фруктовая, но не сладкая, и пинен вполне реально отвечает за сухой, а не карамельный край аромата.",
            "Описания характера указывают на ясный разговорный дневной профиль. Учитывая, сколько материала носило это имя за два десятилетия, к этому описанию стоит относиться как к описанию семейства растений, а не той банки, что стоит перед вами.",
          ],
        },
        {
          h2: "Где он стоит относительно соседей",
          body: [
            "Ближайшее и самое полезное сравнение — Blue Dream: оба с сативным креном, оба про фрукт поверх чего-то ещё, и различает их именно это «что-то ещё». Blue Dream кладёт ягоду поверх хейзовой основы, этот — ананас поверх дерева.",
            "Против Super Silver Haze разрыв шире: там фрукта нет вовсе, только цитрус и благовония. Против Runtz разрыв в сахаре: Runtz — это карамель и сливки, а это фрукт и кедр.",
            "Если хочется фрукта, но не конфет, у прилавка стоит описывать два имени — это и Blue Dream. Опишите сам фрукт вместо названия, и вам дадут что-то более близкое к задуманному.",
          ],
        },
      ],
      faqTitle: "Pineapple Express: частые вопросы",
      faq: [
        {
          q: "Существовал ли сорт до фильма?",
          a: "Именно это и является предметом спора. G13 Labs говорит, что отобрала скрещивание в середине двухтысячных; Сет Роген, соавтор сценария фильма 2008 года, говорил, что сорта не было, пока фильм не создал спрос на имя.",
        },
        {
          q: "Он правда пахнет ананасом?",
          a: "Настоящий образец пахнет ананасом и тропическими фруктами поверх сухого дерева и земли, с цитрусовым краем. Фрукт без дерева под ним — обычно что-то другое с этим именем.",
        },
        {
          q: "Чем он отличается от Runtz?",
          a: "Сахаром. Runtz — карамель и сливки, этот — фрукт и кедр. Фруктовые оба, но пахнут они по-разному.",
        },
      ],
      disclaimerTitle: "Что утверждается, а что нет",
      disclaimer:
        "Страница описывает сорт и излагает публичное разногласие о его происхождении, не разрешая его. Это не оферта и не медицинский совет: ни цены, ни веса, ни наличия и ни одного медицинского утверждения. Отпуск — лично, взрослым от двадцати лет, по документам, которых требуют тайские правила.",
    }),
  },
};
