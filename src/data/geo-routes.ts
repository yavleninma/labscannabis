import type { Locale } from "@/lib/i18n";
import type { TravelMode } from "@/data/landmarks";

/**
 * КОПИРАЙТ ГЕО-КЛАСТЕРА «КАК ДОБРАТЬСЯ ОТ ОРИЕНТИРА» (`getting-here/<слаг>`).
 *
 * Что здесь лежит и чего здесь нет
 * --------------------------------
 * Фактура маршрута — чем едут, где пересадка, что видно по пути, где ошибаются
 * поворотом, чем день отличается от вечера — уже собрана и лежит в
 * `src/data/landmarks.ts`. Дублировать её здесь нельзя: страница берёт её
 * оттуда напрямую. В этом файле лежит только то, чего в наборе ориентиров нет,
 * — авторские разделы, лид, происхождение координаты и вопросы, — и лежит
 * ОТДЕЛЬНО для каждого ориентира и каждой локали.
 *
 * ═══ НИ ОДНОГО ЧИСЛА РАССТОЯНИЯ И ВРЕМЕНИ ═══
 * Расстояние и время печатает `describeLandmarkWalk(slug, locale)` из
 * `src/lib/geo.ts` — гаверсинус от пина магазина. В строках этого файла цифр
 * метров, километров и минут ходьбы нет и быть не может: это блокирующая
 * проверка `checkHandWrittenDistances()` в `scripts/check-seo.mjs`. Неверное
 * расстояние в прозе хуже отсутствующей страницы — человек пойдёт не туда.
 *
 * ═══ НИ ОДНОЙ СЧИТАЕМОЙ ЧАСТОТЫ БЕЗ ИСТОЧНИКА ═══
 * «Один рейс в сутки», «каждые двадцать минут», «последний в полночь» — это
 * проверяемые числа, и здесь они запрещены так же, как расстояния. На странице
 * ж/д станции такое утверждение стояло в H1, в описании, в лиде и в ответе FAQ
 * на обеих локалях — и было неверным двое суток из семи. Редкость описывается
 * качественно («прибытия идут редкими волнами, а не потоком»): вывод от этого
 * не меняется, а проверяемого ложного факта на странице не остаётся.
 * `checkHandWrittenDistances()` этого не поймает — это не расстояние.
 *
 * ═══ ПОЧЕМУ ОРИЕНТИРОВ ЗДЕСЬ МЕНЬШЕ, ЧЕМ В LANDMARKS ═══
 * Страница заводится только там, где про маршрут есть что сказать сверх
 * расстояния И где этого ещё не сказала написанная руками страница района.
 * Отказы перечислены в `GEO_ROUTE_EXCLUSIONS` вместе с причиной — чтобы
 * ориентир не завели заново «на всякий случай» через полгода.
 *
 * ═══ ЧТО РЕШАЕТ СУДЬБУ СТРАНИЦЫ ═══
 * Не этот файл и не генератор, а ворота качества
 * (`scripts/lib/quality-gate.mjs`). Написанный здесь текст — кандидат; в
 * индекс он попадает, только если прошёл ворота. Не прошёл — страница
 * остаётся живой под `noindex, follow`.
 */

/** Подписи способов передвижения. `transfer` — не транспорт, а место пересадки. */
export type GeoModeLabels = Record<TravelMode, string>;

/** Структурные заголовки страницы. Одни на локаль, не на ориентир. */
export interface GeoRouteLabels {
  arrivalTitle: string;
  waypointsTitle: string;
  wrongTurnTitle: string;
  dayEveningTitle: string;
  provenanceTitle: string;
  faqTitle: string;
  modes: GeoModeLabels;
}

export interface GeoRouteSection {
  h2: string;
  body: string[];
}

export interface GeoRouteFaqItem {
  q: string;
  a: string;
}

/** Копирайт одной страницы на одной локали. Пустых полей быть не должно. */
export interface GeoRouteCopy {
  title: string;
  description: string;
  h1: string;
  kicker: string;
  lead: string;
  /** Авторские разделы — то, чего нет в наборе ориентиров. */
  sections: GeoRouteSection[];
  /**
   * Откуда взята координата и чего она НЕ обещает. Пишется словами на языке
   * локали, а не печатью поля `sources`: цитаты в наборе ориентиров ведутся
   * по-русски, и на английской странице они дали бы кириллицу в прозе.
   */
  provenance: string[];
  faq: GeoRouteFaqItem[];
}

export const GEO_ROUTE_LABELS: Partial<Record<Locale, GeoRouteLabels>> = {
  en: {
    arrivalTitle: "How people actually make this trip",
    waypointsTitle: "What you pass, in order",
    wrongTurnTitle: "Where this goes wrong",
    dayEveningTitle: "Daytime and evening are not the same trip",
    provenanceTitle: "Where the distance on this page comes from",
    faqTitle: "Questions people ask about this route",
    modes: {
      foot: "On foot",
      songthaew: "By baht bus",
      motorbike: "By motorbike taxi",
      taxi: "By car",
      transfer: "Where you change",
    },
  },
  ru: {
    arrivalTitle: "Как этот путь проходят на самом деле",
    waypointsTitle: "Что проходите по порядку",
    wrongTurnTitle: "Где сбиваются с пути",
    dayEveningTitle: "Днём и вечером это разные поездки",
    provenanceTitle: "Откуда на этой странице взято расстояние",
    faqTitle: "Что спрашивают об этом маршруте",
    modes: {
      foot: "Пешком",
      songthaew: "На сонгтео",
      motorbike: "На байк-такси",
      taxi: "На машине",
      transfer: "Где пересадка",
    },
  },
};

/**
 * ОРИЕНТИРЫ, КОТОРЫМ СТРАНИЦА НЕ ЗАВОДИТСЯ, И ПОЧЕМУ.
 *
 * Правило одно: страница обязана нести что-то сверх расстояния и не повторять
 * уже написанную. Ориентир из `LANDMARKS`, которого нет ни здесь, ни в
 * `GEO_ROUTES`, — это недосмотр; поэтому список ведётся явно, а
 * `assertGeoRouteCoverage()` в кластере сверяет, что вместе они покрывают
 * весь набор.
 */
export interface GeoRouteExclusion {
  slug: string;
  reason: string;
}

export const GEO_ROUTE_EXCLUSIONS: readonly GeoRouteExclusion[] = Object.freeze([
  {
    slug: "walking-street",
    reason:
      "Маршрут от Walking Street уже написан руками: `areas/walking-street` в `AREA_ROUTES`, обе локали в индексе. Вторая страница про тот же старт — дубль по смыслу, а не новая тема.",
  },
  {
    slug: "soi-buakhao",
    reason:
      "Написан руками: `areas/soi-buakhao`. Плюс это самая слабая координата набора (разброс источников выше, чем у любого другого ориентира) — вторая страница на ней не нужна.",
  },
  {
    slug: "central-festival",
    reason:
      "Написан руками: `areas/central-pattaya` использует именно этот ориентир как точку старта.",
  },
  {
    slug: "jomtien-beach",
    reason:
      "Написан руками: `areas/jomtien` — там же разобрана отдельная линия сонгтео Джомтьена и её пересадка.",
  },
  {
    slug: "beach-road",
    reason:
      "Сверх расстояния сказать нечего. Принятая точка — южный конец набережной у арки Walking Street, то есть тот же угол, что и у ориентира walking-street: тот же поворот вглубь, та же South Pattaya Road, а односторонность пары Beach Road / Second Road уже разобрана на `areas/central-pattaya`. Осталась бы страница, отличающаяся от соседней только заголовком.",
  },
]);

/**
 * `slug` ориентира → копирайт по локалям. Локаль без копирайта страницы не
 * получает вовсе: машинный перевод маршрута — ровно та тонкая страница, из-за
 * которой в Search Console набрались отказы «Обнаружена, не проиндексирована».
 */
export const GEO_ROUTES: Record<string, Partial<Record<Locale, GeoRouteCopy>>> = {
  "terminal-21": {
    en: {
      title: "Terminal 21 Pattaya to Pattaya 13 Alley: the route",
      description:
        "Getting from Terminal 21 in North Pattaya to 32 Pattaya 13 Alley: which street to board on, why the one outside the mall doors runs the wrong way, and what the roundabout does to the trip after dark.",
      h1: "Terminal 21 to Pattaya 13 Alley: catching the loop at its start",
      kicker: "Route from Terminal 21",
      lead:
        "Terminal 21 stands at the top of the strip, at the junction where the shared-transport loop begins its run south. That is a genuine advantage — you can board the loop before anyone else has filled it — but only if you leave the building on the correct side. The mall has entrances on more than one street, and the two streets involved here run in opposite directions, so the exit you pick is the whole of the navigation problem. Which of those two streets runs which way, and how to tell them apart from the pavement, is set out on the Central Pattaya route rather than told again here; this page starts from the consequence of it.",
      sections: [
        {
          h2: "Why breaking the trip here is worth doing on purpose",
          body: [
            "The mall is air-conditioned and the rest of this route is not. In the middle of the day the sensible order of operations is to do the indoor part of your day first and the road part afterwards, rather than arriving hot and then queueing outside. That is not a scenic recommendation — it is that the whole southbound run happens in the open, and the seafront has less shade than the inland street it parallels.",
            "The other reason to plan the break here is that this is the last indoor point on the route. Everything after it — the boarding, the ride, the alley at the far end — happens outdoors and cannot be paused; whatever you were going to sort out sitting down is sorted out here or not at all.",
          ],
        },
        {
          h2: "Coming back is a different street, not the same one reversed",
          body: [
            "Getting back to the mall from the shop is not the outbound trip played backwards, and this catches out almost everyone once. The seafront road will not carry you north, so the return leg runs on the inland street, and it approaches the mall from the other side of the block. It is the same building, reached by a different frontage.",
            "This matters more than it sounds, because people plan the return by memory of the outbound view. If you memorised the sea on your right, you will look for the sea on your left going back and never find it — the return leg does not touch the water at all.",
          ],
        },
      ],
      provenance: [
        "The figure at the top of this page is calculated, not written by a copywriter: the site stores the shop's own pin and the landmark's coordinate and computes the great-circle distance between them, then reports walking time as a range rather than a single number, because a straight line is always shorter than the streets.",
        "The mall's coordinate is corroborated: two independent mapping references place the building within a stone's throw of each other, and a third one that disagreed by several city blocks was rejected and written down as rejected, so nobody re-adopts it later. What the coordinate marks is the building, not a specific entrance — the mall has several, and they open onto different streets, which is exactly the distinction this page is about.",
      ],
      faq: [
        {
          q: "Can I stay on one vehicle the whole way?",
          a: "Yes, provided you board on the seafront side. The loop that starts at this junction runs south along the water and turns inland at the far end without a change. Boarding on the inland street instead means a vehicle going the opposite way and a second one afterwards to correct it.",
        },
        {
          q: "Is the mall a landmark a driver will recognise?",
          a: "As a starting point, yes — it is one of the most recognisable buildings in the north of the city. As a destination it is no help at all: give the alley address and let the map pin finish the job, because the shop name is not something a driver here will know.",
        },
        {
          q: "Does the route change after dark?",
          a: "The road does not, but the junction does. In the evening it is the slowest point of the whole trip, and the loop moving through it does better than anything attempting to cross it. Nothing about the direction changes — only how long the first part takes.",
        },
      ],
    },
    ru: {
      title: "От Terminal 21 до Pattaya 13 Alley: как доехать",
      description:
        "Дорога от Terminal 21 в Северной Паттайе до 32 Pattaya 13 Alley: на какой улице садиться, почему машина у дверей молла везёт не туда и что делает с поездкой круг рядом с моллом.",
      h1: "От Terminal 21 до Pattaya 13 Alley: поймать кольцо в начале хода",
      kicker: "Маршрут от Terminal 21",
      lead:
        "Terminal 21 стоит в начале городской полосы, у того самого узла, с которого кольцо общественного транспорта начинает ход на юг. Это настоящее преимущество: машину можно взять раньше, чем её наберут другие. Но работает оно только при выходе с правильной стороны здания. У молла выходы на разные улицы, а эти две улицы идут в противоположных направлениях — и весь маршрут сводится к тому, каким выходом вы вышли. Какая из этих двух улиц куда идёт и как отличить их с тротуара, разобрано на маршруте по центральной Паттайе, и здесь это не пересказывается: страница начинается со следствия.",
      sections: [
        {
          h2: "Почему разбить дорогу здесь стоит нарочно",
          body: [
            "В молле есть кондиционер, дальше по маршруту его нет. Днём разумный порядок такой: сначала закрытая часть дня, потом дорога, а не наоборот — иначе приходишь разогретым и стоишь на солнце. Это не про виды: весь южный ход проходит под открытым небом, и на приморской улице тени меньше, чем на параллельной внутренней.",
            "Вторая причина — сам узел. Это самый загруженный перекрёсток севера города, и всё, что пытается его пересечь, движется хуже, чем поток, который через него уже идёт. Выйти из молла в момент, когда узел стоит, — значит потратить на первую часть дороги больше, чем на всю остальную. Сдвинуть выход на полчаса в любую сторону — не расписание, а единственное решение, которое меняет эту поездку сильнее всего.",
          ],
        },
        {
          h2: "Обратно — по другой улице, а не по той же задом наперёд",
          body: [
            "Дорога от магазина к моллу — не тот же путь в обратном порядке, и на этом один раз спотыкаются почти все. Приморская улица на север не везёт, поэтому обратный отрезок идёт по внутренней и подходит к моллу с другой стороны квартала. Здание то же, фасад другой.",
            "Звучит мелочью, но обратный путь планируют по памяти о виде из окна. Запомнили море справа — будете искать море слева и не найдёте: обратный отрезок воды не касается вообще.",
          ],
        },
      ],
      provenance: [
        "Число вверху страницы вычислено, а не написано копирайтером: сайт хранит пин магазина и координату ориентира и считает между ними расстояние по дуге большого круга, а время печатает диапазоном, а не одной цифрой, — прямая всегда короче улиц.",
        "Координата молла подтверждена: два независимых картографических справочника ставят здание практически в одну точку, а третий, разошедшийся на несколько кварталов, отклонён и записан как отклонённый, чтобы его не приняли обратно через полгода. Координата обозначает здание, а не конкретный вход: входов у молла несколько, и выходят они на разные улицы — ровно то различие, о котором эта страница.",
      ],
      faq: [
        {
          q: "Можно доехать на одной машине без пересадки?",
          a: "Да, если сесть со стороны моря. Кольцо, начинающееся у этого узла, идёт вдоль воды на юг и в конце сворачивает вглубь без смены машины. Сесть на внутренней улице — значит уехать в противоположную сторону и потом брать вторую машину, чтобы это исправить.",
        },
        {
          q: "Молл — понятный ориентир для водителя?",
          a: "Как точка старта — да, это одно из самых узнаваемых зданий севера города. Как точка назначения — бесполезен: называйте адрес переулка и ведите по пину, потому что название магазина водителю здесь ничего не скажет.",
        },
        {
          q: "Меняется ли маршрут после темноты?",
          a: "Дорога — нет, узел — да. Вечером это самое медленное место всей поездки, и кольцо, идущее сквозь него, справляется лучше, чем всё, что пытается его пересечь. Направление при этом не меняется, меняется только длительность первой части.",
        },
      ],
    },
  },

  "central-marina": {
    en: {
      title: "Central Marina to Pattaya 13 Alley: how to get there",
      description:
        "The route from Central Marina to 32 Pattaya 13 Alley: why the street the complex opens onto is the wrong one, what slows the walk in the evening, and how not to confuse it with the other Central.",
      h1: "Central Marina to our alley: one block decides the whole ride",
      kicker: "Route from Central Marina",
      lead:
        "Central Marina sits on the inland of the two central one-way streets, which is the one that carries traffic away from the shop. Everything about this trip follows from that single fact. The complex is easy to leave and easy to leave in the wrong direction, and the correction costs one block on foot at the start — or a good deal more once you are moving.",
      sections: [
        {
          h2: "An address on one street, a route on the other",
          body: [
            "The frontage you walk out of faces the northbound street. It is busy, it has shared vehicles on it, and every one of them is going the wrong way for this trip. Nothing about the scene tells you that: a vehicle with people in it looks like transport regardless of which way the street runs.",
            "Crossing one block towards the water converts the journey into a single ride with no change at all. It is the smallest correction available anywhere on this list of routes, and it has to be made before you get in something, not after. Once you are moving north you are committed until the next place a vehicle can turn, and by then the block you saved has cost several.",
          ],
        },
        {
          h2: "Two places called Central, and only one of them is here",
          body: [
            "There are two Central-branded complexes on this side of Pattaya, and they are not near each other: one is up here on the inland street, the other stands down on the seafront much further south. Drivers know both. If you name only the brand, you have named two places, and which one you get depends on which is closer to where the driver already is.",
            "For this route the difference is not academic — the two are far enough apart that starting from the wrong one puts you on a different part of the loop entirely. Name the full complex name, or better, show the map pin. This is the one landmark on the site where a partial name is actively worse than no name.",
          ],
        },
        {
          h2: "In the evening it is the pavement that slows down",
          body: [
            "The open-air market along the frontage spreads over the walkway after dark, and pedestrians end up in the road alongside the traffic. The road itself is not the bottleneck here; the walk to the crossing is. That inverts the usual advice about this city, where the roads are what jam and the pavements are what stay clear.",
            "Practically, it means the crossing to the seaward street is the part to do first and unhurriedly, and the ride afterwards is the easy half. People who leave it the other way round — ride first, walk at the end — arrive at the far end of the route with the walking still to do, in the dark, in a part of town where the alleys look alike.",
          ],
        },
      ],
      provenance: [
        "The distance shown here is computed from coordinates by the site itself, using the shop's pin and the landmark's, and it is reported as a straight line with walking time given as a range. Streets are never straight, so the range exists to stop the page promising the short end of something it cannot control.",
        "This landmark's coordinate rests on a single reference-grade source — an encyclopaedia infobox for the complex — rather than two agreeing ones. That is enough to say honestly how far the complex is; it is not enough to promise which exit or which corner, and this page does not try to.",
      ],
      faq: [
        {
          q: "How do I make sure I mean this Central and not the other one?",
          a: "Use the full complex name or the map pin. There are two Central-branded centres in Pattaya, a long way apart, and each is a plausible answer to the brand name on its own. Getting the wrong one puts you on a different part of the route.",
        },
        {
          q: "Is this walkable rather than ridden?",
          a: "The calculated distance shown at the top is past the point where this site will quote a walking time at all, so it prints the distance alone. Treat it as a ride, with the one block on foot at the start of it that this page is mostly about.",
        },
      ],
    },
    ru: {
      title: "От Central Marina до Pattaya 13 Alley: как добраться",
      description:
        "Дорога от Central Marina до 32 Pattaya 13 Alley: почему улица, на которую выходит комплекс, — не та, что тормозит вечером и как не перепутать его со вторым Central.",
      h1: "От Central Marina до нашего переулка: один квартал решает поездку",
      kicker: "Маршрут от Central Marina",
      lead:
        "Central Marina стоит на внутренней из двух центральных односторонних улиц — на той, что увозит от магазина. Из этого одного факта следует вся поездка. Из комплекса легко выйти и так же легко выйти не в ту сторону, а исправление стоит одного квартала пешком в начале — или заметно дороже, когда вы уже поехали.",
      sections: [
        {
          h2: "Адрес на одной улице, маршрут — на другой",
          body: [
            "Фасад, из которого вы выходите, смотрит на улицу с движением на север. Она загружена, попутные машины по ней идут, и все они для этой поездки едут не туда. По виду этого не понять: машина с людьми выглядит транспортом независимо от того, куда идёт улица.",
            "Один квартал в сторону воды превращает дорогу в одну поездку вообще без пересадки. Это самое дешёвое исправление из всех маршрутов набора, и сделать его надо до посадки, а не после. Как только вы поехали на север, вы едете до ближайшего места, где машина может повернуть, — и сэкономленный квартал к этому моменту стоит уже нескольких.",
          ],
        },
        {
          h2: "Два места по имени Central, и здесь только одно из них",
          body: [
            "На этой стороне Паттайи два комплекса под маркой Central, и стоят они не рядом: один здесь, на внутренней улице, второй — внизу на набережной, заметно южнее. Водители знают оба. Назвав только марку, вы назвали два места, и какое достанется — зависит от того, к какому водитель ближе.",
            "Для этого маршрута разница не теоретическая: точки разнесены настолько, что старт не от того комплекса выводит совсем на другой участок кольца. Называйте полное имя комплекса, а лучше показывайте пин. Это единственный ориентир на сайте, где неполное название хуже, чем никакого.",
          ],
        },
        {
          h2: "Вечером тормозит тротуар, а не дорога",
          body: [
            "Открытый рынок вдоль фасада после темноты занимает проход, и пешеходы оказываются на проезжей части рядом с машинами. Узкое место здесь не дорога, а путь до перехода. Это переворачивает обычный совет по этому городу, где стоят дороги, а тротуары остаются свободными.",
            "На практике это значит: переход к приморской улице делают первым и без спешки, а поездка после него — лёгкая половина. Кто делает наоборот — сперва едет, а пешую часть оставляет на конец, — доходит до дальнего конца маршрута в темноте, с непройденной пешей частью, в той части города, где переулки похожи один на другой.",
          ],
        },
      ],
      provenance: [
        "Расстояние на этой странице сайт считает сам по координатам — пин магазина и точка ориентира, — и печатает как прямую, а время ходьбы даёт диапазоном. Улицы прямыми не бывают, и диапазон нужен затем, чтобы страница не обещала нижний край того, чем не управляет.",
        "Координата этого ориентира держится на одном источнике справочного класса — инфобоксе энциклопедии по комплексу, — а не на двух сходящихся. Этого достаточно, чтобы честно назвать расстояние до комплекса, и недостаточно, чтобы обещать конкретный выход или угол; страница этого и не делает.",
      ],
      faq: [
        {
          q: "Почему нельзя сесть в первую же машину у комплекса?",
          a: "Потому что улица под ним односторонняя и уводит от магазина. Машина настоящая, просто едет на север. Один квартал пешком к приморской улице — это то, что превращает дорогу в одну поездку без пересадки.",
        },
        {
          q: "Как не перепутать этот Central со вторым?",
          a: "Называть полное имя комплекса или показывать пин. В Паттайе два центра под этой маркой, они далеко друг от друга, и каждый — правдоподобный ответ на одну только марку. Не тот комплекс выводит на другой участок маршрута.",
        },
        {
          q: "Это пешая дистанция или всё-таки ехать?",
          a: "Вычисленное расстояние вверху страницы больше того предела, за которым сайт вообще называет время ходьбы, поэтому напечатано одно расстояние. Считайте это поездкой — с тем одним кварталом пешком в начале, о котором эта страница в основном и написана.",
        },
      ],
    },
  },

  "north-pattaya-bus-terminal": {
    en: {
      title: "North Pattaya Bus Terminal to Pattaya 13 Alley",
      description:
        "Coach arrivals at North Pattaya Bus Terminal: which way to walk out of the forecourt, why shared transport cannot do this in one piece, and what luggage changes about the plan.",
      h1: "Off the coach at North Pattaya Terminal, on to Pattaya 13 Alley",
      kicker: "Route from the coach terminal",
      lead:
        "This is an arrival route rather than a city one. The terminal sits back from the strip, towards the highway, and it is the one point on this list where almost everybody starting the journey is carrying something. That single fact — bags — reorders the whole decision, because the option that works best on a city trip is the one that works worst with luggage.",
      sections: [
        {
          h2: "Which way out of the forecourt",
          body: [
            "There are two directions out, and only one of them is the town. The highway side leads to long-distance traffic, service roads and vehicles that are leaving the province rather than crossing the city; the town side leads to the road that eventually meets the shared-transport loop. Nothing at the terminal doors signposts this in a language most arrivals read.",
            "The error is expensive because it is not self-correcting. Walk the wrong way and there is no landmark that tells you within the first few minutes; the surroundings simply get emptier and more industrial, which people read as ordinary outskirts rather than as the wrong bearing. The check is which direction the through-traffic is denser in: town is the busier way.",
          ],
        },
        {
          h2: "Bags change which option is right",
          body: [
            "On a shared vehicle the fare is small and the space is a bench. That is fine crossing the city with nothing; it is a genuinely bad idea with a suitcase and a change of vehicle in the middle, because the change means unloading and reloading on a roadside with traffic passing. The forecourt has a car rank precisely because arrivals have luggage.",
            "The other thing bags change is the last part. Wherever the vehicle stops, the alley is not a drive-through; the final approach is on foot in every version of this trip. Doing that with everything you own at the end of a coach journey is a different proposition from doing it empty-handed, and it is worth deciding in the forecourt rather than at the alley mouth.",
          ],
        },
        {
          h2: "Why nothing runs straight through",
          body: [
            "The terminal was placed for coaches, not for the city: it faces the road that brings buses in from outside, and the city's own shared-transport network is built around the seafront, some distance west of here. The two systems meet at a junction rather than overlapping, so on shared transport this trip is always in two parts.",
            "That is not a warning, just an accurate expectation. Anyone who plans it as one uninterrupted ride spends the first part of the journey waiting at the terminal for a vehicle that is not coming, which is the most common way this particular route goes badly.",
          ],
        },
      ],
      provenance: [
        "The distance at the top of the page is calculated between the shop's pin and the terminal's coordinate, not asserted. It is reported as a straight line, with a walking range only when the straight line is short enough that walking is a real option at all.",
        "The terminal's coordinate is corroborated by two independent sources that agree closely: a plus-code published as part of the terminal's own address, decoded back into latitude and longitude, and a coordinate directory entry for its street address. Both land on the same stretch of the main road near the highway, which is also what every written description of the place says.",
      ],
      faq: [
        {
          q: "Should I wait at the terminal for a shared vehicle?",
          a: "Waiting at the doors is the classic mistake here. The traffic is on the main road, not in the forecourt. Either walk out to the road or take a car from the rank; standing in the forecourt is the one option that does not progress.",
        },
        {
          q: "What do I tell the driver?",
          a: "The alley address, plus the map pin. Do not lead with the shop name — it will not be recognised, and describing a nearby landmark instead usually ends with being set down on the main road rather than at the mouth of the alley.",
        },
      ],
    },
    ru: {
      title: "От автовокзала Северной Паттайи до Pattaya 13 Alley",
      description:
        "Приезд на автовокзал Северной Паттайи: в какую сторону выходить с площадки, почему общий транспорт не довезёт целиком и что меняет багаж.",
      h1: "С автобуса на северном вокзале — дальше на Pattaya 13 Alley",
      kicker: "Маршрут от автовокзала",
      lead:
        "Это маршрут приезда, а не городская поездка. Вокзал стоит в стороне от городской полосы, ближе к шоссе, и это единственная точка набора, где почти каждый начинает дорогу с вещами. Один этот факт — багаж — переставляет все решения: то, что дешевле всего при городской поездке, с чемоданом оказывается худшим вариантом.",
      sections: [
        {
          h2: "В какую сторону выходить с площадки",
          body: [
            "Направлений с площадки два, и город только одно из них. Сторона шоссе — это междугородний поток, служебные съезды и машины, которые уезжают из провинции, а не пересекают город; городская сторона выводит на дорогу, которая в итоге встречает кольцо сонгтео. У дверей вокзала это не написано ни на одном языке, который читает большинство приезжающих.",
            "Ошибка дорога тем, что сама себя не исправляет. Пойдёте не туда — в первые минуты ни один ориентир об этом не скажет; вокруг просто становится пустее и промышленнее, а это читают как обычную окраину, а не как неверное направление. Проверка одна: город — та сторона, где сквозной поток плотнее.",
          ],
        },
        {
          h2: "Багаж меняет то, какой вариант правильный",
          body: [
            "В общей машине проезд стоит копейки, а место — это лавка. Пересечь город налегке так можно; с чемоданом и пересадкой посередине — плохая затея, потому что пересадка означает выгрузку и погрузку на обочине под проезжающим потоком. Стоянка машин у вокзала существует ровно потому, что приезжают с вещами.",
            "Второе, что меняет багаж, — последний отрезок. Где бы машина ни остановилась, переулок не проездной: финальный подход везде пеший. Пройти его со всем нажитым в конце автобусного переезда — совсем не то же, что налегке, и решать это стоит на площадке вокзала, а не у входа в переулок.",
          ],
        },
        {
          h2: "Почему целиком не везёт ничего",
          body: [
            "Вокзал ставили под автобусы, а не под город: он смотрит на дорогу, по которой приходят междугородние рейсы, а собственная городская сеть сонгтео построена вокруг набережной, заметно западнее. Две системы не накладываются, а встречаются в узле — поэтому на общем транспорте эта дорога всегда состоит из двух частей.",
            "Это не предупреждение, а точное ожидание. Кто планирует её как одну непрерывную поездку, тратит начало пути на ожидание у вокзала машины, которая не придёт, — самый частый способ испортить именно этот маршрут.",
          ],
        },
      ],
      provenance: [
        "Расстояние вверху страницы вычисляется между пином магазина и координатой вокзала, а не утверждается. Печатается прямая, а диапазон ходьбы — только тогда, когда прямая достаточно коротка, чтобы идти пешком вообще имело смысл.",
        "Координата вокзала подтверждена двумя независимыми источниками, которые сходятся близко: plus-код из собственного адреса вокзала, раскрытый обратно в широту и долготу, и запись справочника координат по его почтовому адресу. Обе попадают на один и тот же участок главной дороги у шоссе — туда же, куда его помещает любое словесное описание.",
      ],
      faq: [
        {
          q: "Можно доехать от вокзала до магазина без пересадки?",
          a: "На общем транспорте — нет. Городское кольцо до вокзала не доходит, поэтому общая поездка — это дорога на запад до узла, а дальше кольцо на юг. Заказанная машина пересадку снимает, поэтому её и берут те, кто приехал с вещами.",
        },
        {
          q: "Стоит ждать попутную машину на самом вокзале?",
          a: "Ожидание у дверей — классическая здешняя ошибка. Поток идёт по главной дороге, а не по привокзальной площадке. Либо выходить к дороге, либо брать машину со стоянки; стоять на площадке — единственный вариант, который никуда не ведёт.",
        },
        {
          q: "Что говорить водителю?",
          a: "Адрес переулка и пин на карте. Не начинайте с названия магазина — его не узнают, а описание соседнего ориентира вместо адреса обычно заканчивается высадкой на главной дороге, а не у входа в переулок.",
        },
      ],
    },
  },

  "pattaya-railway-station": {
    en: {
      title: "Pattaya Railway Station to Pattaya 13 Alley: directions",
      description:
        "Arriving by train: why the station has no waiting shared transport, which way the town is from the platform, and what a timetable this thin does to the plan.",
      h1: "From Pattaya Railway Station when the timetable sets the plan",
      kicker: "Route from the railway station",
      lead:
        "The railway station is on the far side of town from the sea, out by the highway, and it behaves nothing like the coach terminal a short way north of it. The difference is not distance — it is frequency. A station whose arrivals come in occasional bursts rather than continuously does not accumulate the standing rank of vehicles that a busy terminal does, and every practical decision on this route follows from that.",
      sections: [
        {
          h2: "Thin arrivals mean no waiting transport",
          body: [
            "At a busy arrival point, transport waits for passengers. At a thin one, it does not: there is no reason for a driver to sit at a platform that produces a crowd only when a train is due, so the vehicles are out on the main roads where the steady traffic is. The platform can therefore look abandoned at exactly the moment you need it not to be, and that is normal rather than a sign something has gone wrong.",
            "The consequence is that this route begins with a walk out to a road, not with boarding. People who wait instead are waiting on a pattern that does not exist here. Anyone who wants to skip that part arranges the car before the train arrives rather than after, because arranging it from the platform means arranging it from the one place with the least passing traffic.",
          ],
        },
        {
          h2: "The east side of town after dark",
          body: [
            "The seafront is lit, crowded and full of people going somewhere until late. This side of the city is not. The road network here is built around the highway, the blocks are longer and the pedestrian provision is thinner, so a walk that would be unremarkable near the beach is a different experience out here at night.",
            "If the train lands after dark, the walk out to a main road is the part of the trip to plan properly, and it is the part most people plan least — they plan the middle of the journey, which is the easy bit, and improvise the first ten minutes, which is the bit that is actually unfamiliar.",
          ],
        },
        {
          h2: "Rail and coach are not the same arrival",
          body: [
            "It is tempting to treat every arrival from outside the city as one problem with one answer. It is not. The coach terminal has a car rank because it produces passengers all day; the railway station produces them in occasional bursts and then nothing. The coach terminal error is walking the wrong way; the railway station error is not walking at all.",
            "Both trips end the same way — on the main road, and then into a numbered alley on foot — but they start under opposite conditions, which is why they are written up separately rather than as one page with the name swapped.",
          ],
        },
      ],
      provenance: [
        "As everywhere on this site, the figure at the top is computed from the two coordinates rather than written down, and walking time is given as a range because the straight line understates every real path.",
        "This coordinate has one source and one only: a structured entry in a public knowledge base. No independent second number could be found. A qualitative cross-check does not contradict it — the station is consistently described as sitting north of a particular main-road junction and out towards the highway, which is where this point falls — but one source is enough for a distance in kilometres and not enough for instructions like 'leave by the such-and-such exit'. This page does not give any.",
      ],
      faq: [
        {
          q: "Is it better to arrange a car in advance?",
          a: "For this arrival, yes — because arranging one from the platform means doing it from the place with the least passing traffic. That is a practical point about where vehicles are, not a promise about any particular service.",
        },
        {
          q: "How is this different from arriving by coach?",
          a: "The coach terminal has constant arrivals and a car rank; the station has an occasional burst and then quiet. The mistake at the terminal is walking the wrong way out of the forecourt. The mistake here is standing still and waiting for transport that is not coming.",
        },
      ],
    },
    ru: {
      title: "От ж/д станции Паттайя до Pattaya 13 Alley: дорога",
      description:
        "Приезд поездом: почему у станции не стоят попутные машины, в какой стороне город от платформы и что меняет настолько редкое расписание.",
      h1: "От ж/д станции Паттайя, когда план диктует расписание",
      kicker: "Маршрут от железнодорожной станции",
      lead:
        "Железнодорожная станция стоит по другую сторону города от моря, у шоссе, и ведёт себя совсем не так, как автовокзал чуть севернее. Разница не в расстоянии, а в частоте. Станция, куда прибытия приходят редкими волнами, а не потоком, не накапливает у себя стоянку машин, какая есть у загруженного вокзала, — и все практические решения этого маршрута следуют отсюда.",
      sections: [
        {
          h2: "Редкие прибытия — значит, транспорт не ждёт",
          body: [
            "Там, где прибытий много, транспорт ждёт пассажиров. Там, где их мало, — нет: водителю незачем стоять у платформы, которая даёт толпу только к приходу поезда, поэтому машины там, где идёт постоянный поток, — на главных дорогах. Платформа поэтому может выглядеть пустой ровно тогда, когда вам это меньше всего нужно, и это норма, а не признак, что что-то пошло не так.",
            "Следствие: маршрут начинается с выхода к дороге, а не с посадки. Кто вместо этого ждёт, ждёт закономерности, которой здесь нет. Кто хочет обойтись без этого отрезка, договаривается о машине до прибытия поезда, а не после: договариваться с платформы — значит делать это из точки с наименьшим проезжающим потоком.",
          ],
        },
        {
          h2: "Восточная сторона города после темноты",
          body: [
            "Набережная освещена, полна людей, и там всегда кто-то куда-то идёт. Эта сторона города — нет. Дорожная сеть здесь построена вокруг шоссе, кварталы длиннее, пешеходной инфраструктуры меньше, и путь, который у пляжа ничем не примечателен, здесь ночью ощущается иначе.",
            "Если поезд приходит уже в темноте, планировать надо именно выход к главной дороге — и именно его планируют меньше всего: продумывают середину поездки, которая проста, и импровизируют первые минуты, которые как раз незнакомы.",
          ],
        },
        {
          h2: "Поезд и автобус — разные прибытия",
          body: [
            "Соблазн считать любое прибытие извне города одной задачей с одним ответом велик. Ответы разные. У автовокзала есть стоянка машин, потому что пассажиры идут весь день; станция даёт их редкими волнами, а потом тишина. Ошибка на автовокзале — пойти не в ту сторону; ошибка на станции — вообще никуда не пойти.",
            "Заканчиваются обе дороги одинаково — главной дорогой, а потом пешим входом в нумерованный переулок, — но начинаются в противоположных условиях. Поэтому они и описаны отдельно, а не одной страницей с подменённым названием.",
          ],
        },
      ],
      provenance: [
        "Как и везде на сайте, число вверху вычисляется по двум координатам, а не пишется, и время ходьбы даётся диапазоном: прямая занижает любой реальный путь.",
        "У этой координаты источник ровно один — структурированная запись в публичной базе знаний. Независимого второго числа найти не удалось. Качественная сверка ему не противоречит: станцию последовательно описывают как стоящую севернее определённого перекрёстка главных дорог и в сторону шоссе, куда эта точка и попадает. Но одного источника хватает на расстояние в километрах и не хватает на указания вроде «выход в такую-то сторону». Страница таких указаний и не даёт.",
      ],
      faq: [
        {
          q: "Лучше договориться о машине заранее?",
          a: "Для этого прибытия — да, потому что договариваться с платформы значит делать это из точки с наименьшим проезжающим потоком. Это замечание о том, где находятся машины, а не обещание конкретной услуги.",
        },
        {
          q: "Чем это отличается от приезда автобусом?",
          a: "У автовокзала прибытия идут постоянно и есть стоянка машин; у станции одна волна и потом тишина. Ошибка на вокзале — выйти с площадки не в ту сторону. Ошибка здесь — стоять и ждать транспорт, которого не будет.",
        },
      ],
    },
  },

  "u-tapao-airport": {
    en: {
      title: "U-Tapao Airport to Pattaya 13 Alley: the transfer",
      description:
        "Landing at U-Tapao and getting to 32 Pattaya 13 Alley: why this is an intercity transfer rather than a city trip, and why the mistake happens at the end rather than the start.",
      h1: "From U-Tapao to Pattaya 13 Alley: a road transfer and one alley",
      kicker: "Route from U-Tapao",
      lead:
        "U-Tapao sits well down the coast to the south-east, outside the city entirely. That puts this route in a different category from everything else on this site: it is not a question of which street to board on, because the city's shared-transport network does not extend anywhere near the airfield. It is a road transfer, and the interesting part of it is not the long middle but the last few minutes.",
      sections: [
        {
          h2: "An intercity leg, not a city one",
          body: [
            "Almost every navigation problem in Pattaya is about one-way streets and which side of a road you are standing on. None of that applies here. The airport connects to the city by highway, the vehicle that takes you is a road transfer of one kind or another, and for the great majority of the journey there are no decisions to make at all.",
            "That is worth saying plainly because it changes what to prepare. On a city route you prepare the boarding. Here the middle looks after itself and what needs preparing is the handover at the far end: where exactly the vehicle stops, and what happens between that point and the door.",
          ],
        },
        {
          h2: "The mistake happens at the end",
          body: [
            "Whatever brings you in will stop on a main road, because the alley is not somewhere a car waits. From that point the approach is on foot, and this is where a long, effortless journey turns awkward: seen from the main road, the numbered alleys look alike, and the difference between the right one and its neighbours is a sign rather than anything about the shape of the entrance.",
            "The fix is unglamorous and reliable. Navigate the last part by map pin rather than by shop name or by any description of what is nearby. A driver here will not recognise the shop name, and a landmark description usually results in being set down somewhere plausible on the main road instead of at the alley mouth — which is a different thing entirely when you have just got off a flight.",
          ],
        },
        {
          h2: "The landing hour decides more than the distance",
          body: [
            "An arrival hour is the one variable on this route you sometimes get to choose, and it is worth choosing deliberately rather than by ticket price. Everything else here is fixed: the road, the distance, the handover point and the walk at the end do not move with the clock.",
            "So the useful planning question is not how far it is — the distance is fixed and shown at the top of this page — but what time you will be standing on that main road. Two arrivals with identical distances can be completely different trips.",
          ],
        },
      ],
      provenance: [
        "The distance shown is computed between the shop's pin and the airport's published coordinate. It is far beyond walking range, so the page states distance only and gives no walking time at all: a time we cannot vouch for would be worse than no time.",
        "The coordinate used is the aerodrome reference point — the official published position of the airfield itself. Two directories print it, but they print the same official figure, so they are one source rather than two, and the record says so. It marks the airfield, not the passenger terminal doors, which stand at their own distance from it. For a distance measured in tens of kilometres that difference does not change the picture; for anything finer it would.",
      ],
      faq: [
        {
          q: "Is there a shared-transport option from the airport?",
          a: "The city's baht-bus network does not reach the airfield — it is built around the seafront and stays inside town. Getting in from here is a road transfer of one kind or another, and this page does not name a particular operator or service.",
        },
        {
          q: "Why does the page not show a walking time?",
          a: "Because it is far outside walking range. The site prints a walking range only when the calculated distance is short enough for walking to be a real option; beyond that it prints distance alone rather than a number it cannot stand behind.",
        },
      ],
    },
    ru: {
      title: "От аэропорта У-Тапао до Pattaya 13 Alley: трансфер",
      description:
        "Прилёт в У-Тапао и дорога до 32 Pattaya 13 Alley: почему это междугородний трансфер, а не городская поездка, и почему ошибаются в конце, а не в начале.",
      h1: "От У-Тапао до Pattaya 13 Alley: трансфер по шоссе и один переулок",
      kicker: "Маршрут от У-Тапао",
      lead:
        "У-Тапао лежит далеко по побережью на юго-восток, вне города. Это переводит маршрут в другую категорию по сравнению со всем остальным на сайте: вопрос «на какой улице садиться» здесь не стоит вовсе, потому что городская сеть сонгтео до аэродрома не дотягивается. Это трансфер по дороге, и интересна в нём не длинная середина, а последние минуты.",
      sections: [
        {
          h2: "Междугородний отрезок, а не городской",
          body: [
            "Почти любая навигационная задача в Паттайе — это односторонние улицы и то, с какой стороны дороги вы стоите. Здесь это не работает. Аэропорт связан с городом шоссе, везёт вас дорожный трансфер того или иного вида, и на подавляющей части пути решений принимать не нужно вообще.",
            "Сказать это прямо стоит потому, что меняется предмет подготовки. В городском маршруте готовят посадку. Здесь середина держится сама, а готовить надо передачу на дальнем конце: где именно машина встанет и что происходит между этой точкой и дверью.",
          ],
        },
        {
          h2: "Ошибаются в конце",
          body: [
            "Что бы вас ни привезло, оно остановится на главной дороге: в переулке машина не ждёт. Дальше подход пеший, и здесь длинная беспроблемная дорога становится неудобной: с главной дороги нумерованные переулки выглядят одинаково, и нужный отличается от соседних вывеской, а не формой входа.",
            "Решение непарадное и надёжное: последний отрезок проходят по пину, а не по названию магазина и не по описанию того, что рядом. Название магазина водителю здесь ничего не скажет, а описание ориентира обычно кончается высадкой в правдоподобном месте на главной дороге вместо входа в переулок — а это совсем другое дело, когда вы только что с рейса.",
          ],
        },
        {
          h2: "Час прилёта решает больше, чем расстояние",
          body: [
            "Час прилёта — единственная переменная этого маршрута, которую иногда можно выбрать, и выбирать её стоит осознанно, а не по цене билета. Всё остальное здесь неизменно: дорога, расстояние, точка высадки и пеший конец от часов не зависят.",
            "Поэтому полезный вопрос при планировании здесь не «сколько километров» — расстояние фиксировано и напечатано вверху страницы, — а «в котором часу вы окажетесь на той главной дороге». Два прилёта с одинаковым расстоянием бывают совершенно разными поездками.",
          ],
        },
      ],
      provenance: [
        "Расстояние вычисляется между пином магазина и опубликованной координатой аэропорта. Оно далеко за пешим пределом, поэтому страница печатает только расстояние и не печатает времени ходьбы вовсе: время, за которое нельзя поручиться, хуже отсутствующего.",
        "Взята контрольная точка аэродрома — официальная опубликованная позиция самого лётного поля. Её печатают два справочника, но печатают одну и ту же официальную цифру, поэтому это один источник, а не два, и в записи так и сказано. Точка обозначает лётное поле, а не двери пассажирского терминала: они отстоят от неё на собственное расстояние. Для дистанции в десятки километров это картины не меняет, для чего-то более точного — изменило бы.",
      ],
      faq: [
        {
          q: "Есть ли от аэропорта общий транспорт?",
          a: "Городская сеть сонгтео до аэродрома не доходит — она построена вокруг набережной и остаётся внутри города. Добираются отсюда дорожным трансфером того или иного вида; конкретного перевозчика или рейса эта страница не называет.",
        },
        {
          q: "Почему на странице нет времени ходьбы?",
          a: "Потому что это далеко за пешим пределом. Сайт печатает пеший диапазон только тогда, когда вычисленное расстояние достаточно коротко, чтобы идти пешком имело смысл; дальше печатается одно расстояние, а не цифра, за которую нельзя отвечать.",
        },
        {
          q: "Что важнее всего сделать правильно?",
          a: "Последние минуты. Просите отвезти по адресу переулка и доводите по пину. Длинная часть дороги проходит сама; ошибаются в том, что в конце идут вдоль главной дороги не в ту сторону, потому что снаружи переулки похожи один на другой.",
        },
      ],
    },
  },

  "sanctuary-of-truth": {
    en: {
      title: "Sanctuary of Truth to Pattaya 13 Alley: the way back",
      description:
        "Leaving the Sanctuary of Truth for 32 Pattaya 13 Alley: getting out of a Naklua soi, the single change at the roundabout, and why the light matters more here than the traffic.",
      h1: "Sanctuary of Truth to South Pattaya before the light goes",
      kicker: "Route from the Sanctuary of Truth",
      lead:
        "The wooden temple stands at the far north of the city, off one of the numbered Naklua sois, beyond the point where the seafront loop turns back on itself. That places it outside the part of the network that runs all evening, and it means this route is planned around the hour rather than around the traffic — a reversal of how almost every other trip in Pattaya works.",
      sections: [
        {
          h2: "The visit ends before the town starts",
          body: [
            "The temple is a daytime destination: it closes for the day well before the city's evening begins. That produces an unusual shape for a journey. You travel out in full daylight and back at the point when the north of the city is emptying, not when it is filling up, so the return leg is quieter every minute you delay it rather than busier.",
            "For anyone planning to visit the shop on the same outing, this is the whole of the practical advice: the northern leg is the constraint, not the southern one. Once you are back on the seafront run you are inside the part of the network that keeps going; before that you are dependent on a stretch that thins early.",
          ],
        },
        {
          h2: "Getting out of the soi is the real first leg",
          body: [
            "Naklua's numbered sois are narrow, walled and longer than they look on a map, where they appear as short spurs off the main road. On the ground they are the part of the trip where you cannot see very far ahead and where nothing much passes, which is why the first leg out to the main road is often done on two wheels rather than on foot even by people who would happily walk the same distance elsewhere.",
            "The other thing about them is orientation. Inside a walled soi you lose the sea as a reference, and a wall on both sides removes every cue the rest of this city gives you for free — no shopfronts, no water on one side, no traffic noise coming from a direction you can name.",
          ],
        },
      ],
      provenance: [
        "The distance at the top of this page is calculated from coordinates rather than written down, and the walking figure, when there is one, is a range that accounts for streets not being straight lines.",
        "The temple's coordinate comes from a single structured entry in a public knowledge base, which also records the numbered Naklua soi it stands on. There is no independent second measurement here. That supports a distance and the general geography of the trip; it does not support fine claims about the grounds themselves, and this page makes none.",
      ],
      faq: [
        {
          q: "Why plan around the hour rather than the traffic?",
          a: "Because the temple closes for the day before the town's evening begins, and the northern leg of the route thins out earlier than the seafront does. The constraint on this trip is the northern half still running, not congestion.",
        },
        {
          q: "Is it the same trip as coming from the Naklua beaches?",
          a: "It uses the same single change at the same roundabout, but it starts differently: a walled numbered soi rather than an open beachfront, which is why the first leg here is usually ridden rather than walked.",
        },
      ],
    },
    ru: {
      title: "От Храма Истины до Pattaya 13 Alley: дорога обратно",
      description:
        "Выезд от Храма Истины к 32 Pattaya 13 Alley: как выбраться из сои Наклыа, единственная пересадка на круге и почему здесь важнее свет, а не пробки.",
      h1: "От Храма Истины в Южную Паттайю, пока не стемнело",
      kicker: "Маршрут от Храма Истины",
      lead:
        "Деревянный храм стоит на самом севере города, в стороне от одной из нумерованных сой Наклыа, за той точкой, где приморское кольцо разворачивается обратно. Он оказывается вне той части сети, которая работает весь вечер, и поэтому маршрут планируют по часам, а не по пробкам — обратное тому, как устроена почти любая другая поездка в Паттайе.",
      sections: [
        {
          h2: "Визит заканчивается раньше, чем начинается город",
          body: [
            "Храм — дневная точка: он закрывается задолго до того, как у города начинается вечер. Это даёт поездке необычную форму. Туда едут при полном свете, обратно — в тот момент, когда север города пустеет, а не наполняется, и обратный отрезок с каждой минутой промедления становится тише, а не плотнее.",
            "Для того, кто собирается той же вылазкой зайти в магазин, весь практический совет в этом: ограничение — северный отрезок, а не южный. Вернувшись на приморский ход, вы уже внутри той части сети, которая продолжает работать; до этого вы зависите от участка, который редеет рано.",
          ],
        },
        {
          h2: "Выбраться из сои — вот настоящий первый отрезок",
          body: [
            "Нумерованные сои Наклыа узкие, зажатые заборами и длиннее, чем кажутся по карте, где они выглядят короткими отростками от главной дороги. На месте это та часть пути, где далеко вперёд не видно и мимо мало что проезжает, — поэтому первый отрезок до главной дороги часто проезжают на двух колёсах даже те, кто в другом месте спокойно прошёл бы то же самое пешком.",
            "Второе про них — ориентировка. Внутри сои между заборами теряется море как опорная точка, а забор с двух сторон отнимает все подсказки, которые этот город обычно даёт бесплатно: ни витрин, ни пляжа с одной стороны, ни шума дороги, про который можно сказать, откуда он.",
          ],
        },
      ],
      provenance: [
        "Расстояние вверху страницы вычислено по координатам, а не записано, и пешая цифра, когда она есть, — это диапазон, который учитывает, что улицы не прямые.",
        "Координата храма взята из одной структурированной записи публичной базы знаний; там же указана нумерованная соя Наклыа, на которой он стоит. Независимого второго измерения здесь нет. Этого хватает на расстояние и на общую географию поездки и не хватает на точные утверждения о самой территории — их страница и не делает.",
      ],
      faq: [
        {
          q: "Сколько пересадок на маршруте?",
          a: "Одна — на круге в северном конце внутренней центральной улицы. Севернее вы на потоке Наклыа, южнее — на приморском кольце, и кольцо довозит остаток пути без второй смены машины.",
        },
        {
          q: "Почему планировать по часам, а не по пробкам?",
          a: "Потому что храм закрывается раньше, чем у города начинается вечер, а северный отрезок маршрута редеет раньше приморского. Ограничение здесь — работающая северная половина, а не загруженность дорог.",
        },
        {
          q: "Это та же дорога, что с пляжей Наклыа?",
          a: "Пересадка та же и на том же круге, но начало другое: закрытая нумерованная соя вместо открытой набережной — поэтому первый отрезок здесь обычно проезжают, а не проходят.",
        },
      ],
    },
  },

  "wong-amat-beach": {
    en: {
      title: "Wong Amat Beach to Pattaya 13 Alley: the ride south",
      description:
        "From Wong Amat on the Naklua headland to 32 Pattaya 13 Alley: the one change at the roundabout, why the return direction is the fragile one, and what a beach day does to the timing.",
      h1: "Wong Amat to Pattaya 13 Alley: one change at the roundabout",
      kicker: "Route from Wong Amat",
      lead:
        "Wong Amat is on the Naklua headland, north of the point where the city's seafront loop turns back. That makes this the longest of the ordinary in-town routes on the site and one of only two that require a change of vehicle. Neither of those is a problem in the outbound direction. Both of them are worth thinking about before you set out, because the fragile part of this trip is the way back rather than the way there.",
      sections: [
        {
          h2: "Beyond the turning point of the loop",
          body: [
            "The city's shared-transport loop is a circuit, and every circuit has an end. This one turns back at a roundabout, and Wong Amat lies past it. Vehicles that continue north of the roundabout are doing something different from the loop — they serve the headland rather than circling the town — and the two systems meet at that one junction.",
            "That is why the change happens where it happens, and why there is exactly one of them. It also explains something that surprises visitors: the headland is not far from the town in a straight line, but it is served by a thinner network, so the practical difficulty of a trip there is not proportional to its distance.",
          ],
        },
        {
          h2: "The direction that fails is the one out of Naklua",
          body: [
            "Southbound, into town, this route works all day and most of the evening: the seafront leg is the busiest piece of shared transport in the city and it keeps running. Northbound, back out to the headland, it does not hold up as well, and the leg that thins first is the one on the headland side of the roundabout.",
            "This is worth saying because most people plan trips in the outbound direction only and assume symmetry. On this route there is none. If you are coming into town from Wong Amat in the evening, the leg you should have a plan for is the one you have not travelled yet, in the direction you are not currently thinking about.",
          ],
        },
        {
          h2: "Beach days set the timing, and beach days run late",
          body: [
            "The rhythm of a day that starts on this beach is not the rhythm of a day that starts at a mall or a station. People stay until the light goes, and the light going is also roughly when the headland's transport starts to thin. Those two things happening together is what turns a simple trip with one change into a trip where you are waiting.",
            "The straightforward fix is to treat the roundabout as the deadline rather than the destination. Once you are on the seafront side of it, the rest of the evening is elastic; before you are, it is not.",
          ],
        },
      ],
      provenance: [
        "The distance quoted at the top comes from a calculation between two coordinates and is a straight line; the walking figure, where one is given, is a range rather than a single number, because the direct line is a floor no real path reaches.",
        "The beach's coordinate is taken from a single reference-grade encyclopaedia entry for the beach itself. A beach is a stretch rather than a point, so the number stands for the beach as a whole and not for any particular access or hotel frontage, and the distance should be read with that in mind.",
      ],
      faq: [
        {
          q: "Which direction should I worry about?",
          a: "The way back out to the headland. The seafront leg keeps running into the evening; the headland leg thins earlier. Plan the leg you have not travelled yet rather than the one you just did.",
        },
        {
          q: "Is a car worth it on this route more than elsewhere?",
          a: "It removes the change, which matters more here than on the shorter routes because this is the part of town where shared vehicles are least frequent. That is a statement about the network, not a recommendation of any particular operator.",
        },
      ],
    },
    ru: {
      title: "От пляжа Вонгамат до Pattaya 13 Alley: дорога на юг",
      description:
        "От Вонгамата на мысе Наклыа до 32 Pattaya 13 Alley: одна пересадка на круге, почему хрупким оказывается обратное направление и что делает с расчётом времени день на пляже.",
      h1: "От Вонгамата до Pattaya 13 Alley: одна пересадка на круге",
      kicker: "Маршрут от пляжа Вонгамат",
      lead:
        "Вонгамат лежит на мысе Наклыа, севернее той точки, где приморское кольцо города разворачивается обратно. Это делает маршрут самым длинным из обычных внутригородских на сайте и одним из двух, где нужна пересадка. Ни то ни другое не мешает по дороге в город. Но подумать об этом стоит до выезда: хрупкая часть здесь — обратный путь, а не путь туда.",
      sections: [
        {
          h2: "За точкой разворота кольца",
          body: [
            "Кольцо городского общего транспорта — это круг, а у круга есть конец. Здесь он разворачивается на кругу, и Вонгамат лежит за ним. Машины, идущие севернее круга, делают не то же, что кольцо: они обслуживают мыс, а не объезжают город, и две системы встречаются ровно в этом узле.",
            "Отсюда и место пересадки, и то, почему она одна. Отсюда же то, что удивляет приезжих: по прямой мыс от города недалеко, но обслуживается более редкой сетью — и практическая сложность поездки туда не пропорциональна расстоянию.",
          ],
        },
        {
          h2: "Подводит направление из Наклыа, а не в неё",
          body: [
            "На юг, в город, маршрут работает весь день и почти весь вечер: приморский отрезок — самая плотная часть общего транспорта в городе, и он продолжает ходить. На север, обратно на мыс, всё держится хуже, и первым редеет как раз отрезок по ту сторону круга.",
            "Сказать это стоит потому, что поездки обычно планируют в одну сторону и считают симметричными. Здесь симметрии нет. Если вы едете в город из Вонгамата вечером, план нужен на тот отрезок, который вы ещё не проезжали, — в направлении, о котором сейчас не думаете.",
          ],
        },
        {
          h2: "Время задаёт пляжный день, а он затягивается",
          body: [
            "Ритм дня, который начался на этом пляже, не похож на ритм дня, начавшегося у молла или у вокзала. С пляжа уходят, когда уходит свет, — а уход света примерно совпадает с тем, когда начинает редеть транспорт мыса. Совпадение этих двух вещей и превращает простую поездку с одной пересадкой в поездку с ожиданием.",
            "Простое решение — считать крайним сроком круг, а не пункт назначения. Оказались на приморской стороне круга — дальше вечер тянется как угодно; не оказались — не тянется.",
          ],
        },
      ],
      provenance: [
        "Расстояние вверху получено расчётом между двумя координатами и является прямой; пешая цифра, если она есть, — диапазон, а не одно число: прямая линия — это пол, до которого не дотягивается ни один реальный путь.",
        "Координата пляжа взята из одной энциклопедической записи справочного класса по самому пляжу. Пляж — это протяжённость, а не точка, поэтому число обозначает пляж в целом, а не конкретный спуск или отельный фасад, и расстояние стоит читать с этой поправкой.",
      ],
      faq: [
        {
          q: "Почему вообще нужна пересадка?",
          a: "Потому что приморское кольцо разворачивается на кругу и дальше на мыс не идёт. Севернее этого узла ходит другой поток. Пересадка — на кругу, и она единственная.",
        },
        {
          q: "О каком направлении беспокоиться?",
          a: "Об обратном, на мыс. Приморский отрезок ходит до вечера, отрезок мыса редеет раньше. Планировать надо тот кусок, который вы ещё не проезжали, а не тот, который только что проехали.",
        },
        {
          q: "Машина здесь оправданнее, чем на других маршрутах?",
          a: "Она снимает пересадку, и здесь это весит больше, чем на коротких маршрутах: именно в этой части города попутных машин меньше всего. Это утверждение о сети, а не рекомендация конкретного перевозчика.",
        },
      ],
    },
  },

  "big-buddha": {
    en: {
      title: "Big Buddha Hill to Pattaya 13 Alley: the way down",
      description:
        "Coming down from Wat Phra Yai on Khao Phra Tamnak to 32 Pattaya 13 Alley: which side of the hill to descend, why uphill and downhill are different trips, and what the hill road is like after dark.",
      h1: "Down from Big Buddha Hill to the alley in South Pattaya",
      kicker: "Route from Big Buddha Hill",
      lead:
        "This is the only route on the site where the choice of transport is not really about time. The temple sits on the hill between South Pattaya and Pratamnak, and a hill has a direction: going up and coming down are different journeys over the same ground. The shop is at the bottom on the town side, so this page is about the descent — and about which of the hill's two roads you take to make it.",
      sections: [
        {
          h2: "Uphill and downhill are not the same trip",
          body: [
            "Going up, people take two wheels almost regardless of the distance, because the gradient rather than the length is what decides it. Coming down, the same stretch is a realistic walk for most people, and the vehicle stops being necessary. That asymmetry is why a visit here often uses one mode in each direction, which is unusual anywhere else in the city.",
            "It also means the return half of a visit to the temple is the half worth planning around the heat rather than around traffic. The descent is done in the open with the town below in view, and in the middle of the day that is a warmer walk than the flat routes near the beach, even though it is going downhill.",
          ],
        },
        {
          h2: "The hill has two roads down, and one of them is wrong",
          body: [
            "Roads leave the summit on more than one side. The seaward one takes you towards the pier end of the seafront; the other brings you down towards the town side and the main road that runs inland. Both are legitimate roads and both look like the way down, which is precisely the problem: the decision is made at the top, where the consequence is not yet visible.",
            "What makes this the costliest decision on the route is when it is taken: at the summit, before anything about the consequence is visible, and by a person who has just spent an hour looking at a view rather than at a map. Every other mistake on these pages is correctable within a block or two of making it.",
          ],
        },
        {
          h2: "After dark this is a different kind of road",
          body: [
            "The temple is a daytime destination, and the hill road is not the lit, busy, shop-lined kind of street the rest of these routes use. It is quiet and poorly lit once the light goes, and quiet in a way that has nothing to do with the beachfront's version of evening. Anyone who has only travelled Pattaya's main roads will find the contrast sharper than they expect.",
            "The practical reading is simple: if you are combining the temple with anything at the bottom of the hill, do the hill part while it is light and the flat part afterwards. The flat part keeps its lighting and its traffic long after the hill road has neither.",
          ],
        },
      ],
      provenance: [
        "The distance shown is calculated between the shop's pin and the hill's coordinate, and reported as a straight line with a walking range where walking is realistic.",
        "The coordinate here is the hill on which the temple stands, taken from a single reference-grade encyclopaedia entry — not the temple gate and not the car park. The climb to the top is not part of a straight-line measurement, which is why the walk feels longer than the number suggests. That is a property of measuring hills flat, and the page says so rather than quietly rounding the figure up.",
      ],
      faq: [
        {
          q: "Can I walk down to the shop rather than ride?",
          a: "Downhill it is a realistic walk for most people, which is not true of the climb in the other direction. The page shows the calculated distance and a walking range; read the upper end, because a hill descent is slower than flat ground of the same length.",
        },
        {
          q: "Is the hill road a good route in the evening?",
          a: "It is quiet and poorly lit after dark, unlike the main roads below. If you are combining the temple with a stop at the bottom, the sensible order is the hill while it is light and the flat part afterwards.",
        },
      ],
    },
    ru: {
      title: "От Большого Будды до Pattaya 13 Alley: спуск с холма",
      description:
        "Спуск от Wat Phra Yai на холме Кхао Пхра Тамнак к 32 Pattaya 13 Alley: по какой стороне холма спускаться, почему подъём и спуск — разные поездки и какова дорога с холма после темноты.",
      h1: "С холма Большого Будды вниз, к переулку в Южной Паттайе",
      kicker: "Маршрут от Большого Будды",
      lead:
        "Это единственный маршрут на сайте, где транспорт выбирают не ради времени. Храм стоит на холме между Южной Паттайей и Пратамнаком, а у холма есть направление: подъём и спуск — разные поездки по одной и той же земле. Магазин внизу, со стороны города, поэтому страница про спуск — и про то, по какой из двух дорог холма его делать.",
      sections: [
        {
          h2: "Вверх и вниз — не одна и та же дорога",
          body: [
            "Наверх берут два колеса почти независимо от расстояния: решает уклон, а не длина. Вниз тот же отрезок для большинства — реальная пешая дорога, и транспорт перестаёт быть нужным. Из-за этой асимметрии визит сюда часто проходит разным способом в каждую сторону, чего в остальном городе почти не бывает.",
            "Отсюда же следует, что обратную половину визита планируют по жаре, а не по пробкам. Спуск идёт по открытому месту, с городом внизу перед глазами, и в середине дня это более горячая дорога, чем ровные маршруты у пляжа, — при том что идти под гору.",
          ],
        },
        {
          h2: "С холма ведут две дороги, и одна из них не та",
          body: [
            "Дороги уходят с вершины больше чем в одну сторону. Приморская выводит к пирсовому концу набережной, вторая спускает в сторону города и к главной дороге, идущей вглубь. Обе настоящие, обе выглядят как «дорога вниз» — в этом и проблема: решение принимают наверху, где последствие ещё не видно.",
            "Приморская сторона — не маленький крюк. Она ставит вас не с того конца набережной, а исправление означает пройти её всю, чтобы выйти на ту же главную дорогу, к которой можно было выйти напрямую. Это самая дорогая ошибка маршрута, и совершают её в первую же минуту.",
          ],
        },
        {
          h2: "После темноты это дорога другого рода",
          body: [
            "Храм — дневная точка, а дорога с холма не относится к освещённым оживлённым улицам с витринами, по которым идут остальные маршруты набора. Со светом она становится тихой и плохо освещённой — тихой совсем не в том смысле, в каком бывает вечер на набережной. Кто ездил только по главным дорогам Паттайи, найдёт контраст резче ожидаемого.",
            "Практический вывод простой: если храм совмещают с чем-то внизу, холмовую часть проходят по свету, а ровную — после. Ровная часть сохраняет и освещение, и поток ещё долго после того, как у дороги с холма нет ни того ни другого.",
          ],
        },
      ],
      provenance: [
        "Расстояние вычисляется между пином магазина и координатой холма и печатается как прямая, с пешим диапазоном там, где идти пешком реалистично.",
        "Здесь координата — это холм, на котором стоит храм, взятая из одной энциклопедической записи справочного класса, а не ворота храма и не парковка. Подъём наверх в измерение по прямой не входит, поэтому дорога ощущается длиннее числа. Это свойство измерения холмов по плоскости, и страница говорит об этом прямо, а не округляет цифру молча.",
      ],
      faq: [
        {
          q: "Можно спуститься к магазину пешком, а не ехать?",
          a: "Вниз это для большинства реальная пешая дорога, чего не скажешь о подъёме в обратную сторону. Страница печатает вычисленное расстояние и пеший диапазон; читать стоит верхний край — спуск с холма медленнее ровного отрезка той же длины.",
        },
        {
          q: "По какой дороге спускаться?",
          a: "По той, что в сторону города, а не по приморской. Приморская выводит к пирсовому концу набережной, и возвращаться оттуда придётся вдоль всей набережной до той же главной дороги.",
        },
        {
          q: "Годится ли дорога с холма вечером?",
          a: "После темноты она тихая и плохо освещённая, в отличие от главных дорог внизу. Если храм совмещают с остановкой внизу, разумный порядок — холм по свету, ровная часть после.",
        },
      ],
    },
  },
};

/** `pathSuffix` страницы маршрута. Единственное место, где он собирается. */
export function geoRouteSuffix(slug: string): string {
  return `getting-here/${slug}`;
}

/** `null`, если для этой локали маршрут не написан: страницы тогда нет вовсе. */
export function getGeoRoute(slug: string, locale: Locale): GeoRouteCopy | null {
  return GEO_ROUTES[slug]?.[locale] ?? null;
}

/** Локали, на которых у ориентира есть написанный текст, в устойчивом порядке. */
export function geoRouteLocales(slug: string): string[] {
  return Object.keys(GEO_ROUTES[slug] ?? {}).sort();
}
