import type { Locale } from "@/lib/i18n";
import type { CopySection, FaqItem } from "@/data/visit-copy";

/**
 * Авторский маршрут района.
 *
 * До этой волны `areas/[area].astro` подставлял в один и тот же текст название
 * района: восемь «страниц маршрута» без маршрута, попарная похожесть 0.81-0.82.
 * Здесь лежит то, чего в шаблоне не было и что подстановкой не получается —
 * последовательность ориентиров от точки старта до двери.
 *
 * ПРАВИЛО: ни одного расстояния и ни одного числа минут в этих строках.
 * `landmarkSlug` указывает на запись в `LANDMARKS`, и шаблон печатает
 * вычисленную гаверсинусом строку `describeLandmarkWalk`. Ориентир, которого
 * нет в `LANDMARKS`, упоминается словами и без цифр — выдуманное расстояние
 * хуже отсутствующего.
 *
 * Районы без маршрута остаются на общем шаблоне и остаются noindex: мы стоим в
 * Южной Паттайе на Pattaya 13 Alley и пишем только про ту гео, где стоим.
 */
export interface AreaRouteStep {
  title: string;
  body: string;
}

export interface AreaRoute {
  /** Слаг из `LANDMARKS` для вычисленного расстояния, либо `null`. */
  landmarkSlug: string | null;
  /**
   * Мета и «лицо» страницы. Раньше `title`, `description` и `h1` собирались
   * подстановкой названия района в общий шаблон — отсюда и бралась похожесть
   * 0.81. Теперь каждый район обязан написать их сам, иначе он не
   * отрисовывается вовсе.
   */
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string;
  routeTitle: string;
  routeIntro: string;
  steps: AreaRouteStep[];
  sections: CopySection[];
  faqTitle: string;
  faq: FaqItem[];
}

export const AREA_ROUTES: Record<string, Partial<Record<Locale, AreaRoute>>> = {
  "walking-street": {
    en: {
      landmarkSlug: "walking-street",
      title: "Walking Street to LABS DISPENSARY: the walk, corner by corner",
      description:
        "The inland walk from the Walking Street arch to 32 Pattaya 13 Alley: where people lose their bearings, what changes after dark, and what to tell a driver.",
      h1: "From Walking Street to the door on Pattaya 13 Alley",
      kicker: "Route from Walking Street",
      intro:
        "Walking Street is where most first-time visitors are standing when they start looking for a dispensary, and it is also the point from which the route is most often walked in the wrong direction. The distance is short enough to cover on foot in the evening and long enough to be unpleasant at midday, and the whole thing hinges on one decision made at the arch.",
      routeTitle: "The walk, corner by corner",
      routeIntro:
        "The one thing to fix in your head before you start: the shop is inland, not along the beach. Half of the people who get lost on this route lose their bearings because they keep walking beside the sea, which is the direction Walking Street itself points them in. Turn your back on the water and the rest is straightforward.",
      steps: [
        {
          title: "Start at the arch, not at the pier",
          body:
            "Walking Street has two ends. The northern one is the arch where the street meets the beachfront; the southern one is Bali Hai Pier. The route below starts at the arch. If you are standing at the pier end, walk the length of the street back north first — it costs you the length of the street, and it is the only part of the trip you cannot shortcut.",
        },
        {
          title: "Cross the beachfront and head inland",
          body:
            "At the arch, cross the beachfront road and keep going with the sea behind you, along the main road that runs inland from that corner — South Pattaya Road, signposted locally as Pattaya Tai. This is the stretch that does the work: it takes you from the seafront strip into the block of numbered alleys where the shop is.",
        },
        {
          title: "Into the numbered alley",
          body:
            "The last part of the route leaves the main road for Pattaya 13 Alley. It is a side street, so there is nothing to see from the main road, and the useful move here is to stop reading signs and start following the pin — a phone route will take you to the correct end of the alley, which matters, because alleys in this part of town have two of them.",
        },
        {
          title: "The door",
          body:
            "Inside the alley, look for the LABS DISPENSARY sign at 32 Pattaya 13 Alley. If you are in the alley and cannot see it, send a message rather than walking the length of it twice — someone will talk you in from where you are standing.",
        },
      ],
      sections: [
        {
          h2: "Evening and daytime are two different walks",
          body: [
            "In the evening this is a pleasant route and the crowd thins out as soon as you leave the seafront: the noise of Walking Street stops almost at the arch, and the inland stretch is ordinary city street with traffic and lit shopfronts.",
            "In the middle of the day it is a different proposition. There is very little shade on the inland stretch, the pavement radiates heat, and a walk that reads as comfortable on a map is unpleasant in direct sun. Most people cover the first half by baht bus at that hour and walk the rest, and there is no reason to be a hero about it.",
          ],
        },
        {
          h2: "By baht bus, taxi or motorbike",
          body: [
            "The baht buses that run the fixed loop through the centre will take you most of the way for the standard fare — get on one heading inland, tell the driver the alley, and press the buzzer at the corner. Do not lead with the shop name: this city has several hundred cannabis shops and no driver knows them by name, while every driver knows the numbered sois.",
            "For a motorbike taxi or a booked car, the same rule holds — give the alley and show the Google Maps pin on your screen. The pin ends the conversation faster than any attempt at pronunciation, and it puts you at the right end of the street.",
          ],
        },
        {
          h2: "What you will not find on this route",
          body: [
            "There is no shortcut along the beach: the beachfront runs north, the shop is inland, and following the water takes you further away with every block. There is also nothing to collect on the way — nothing can be ordered or paid for through this website or by message, so the walk ends at a counter where you show your documents and talk to a person.",
            "Bring your passport and your prescription in original form. The age limit is 20 and the check happens on every visit, which is worth knowing before you cross the city rather than at the door.",
          ],
        },
      ],
      faqTitle: "Walking from Walking Street: questions",
      faq: [
        {
          q: "How far is it from Walking Street to the shop?",
          a: "{walk}. The distance is a straight line calculated from the shop pin to the northern entrance of Walking Street, and the time is that distance at an unhurried pace with an allowance for the detour around the blocks — treat the higher number as the real one.",
        },
        {
          q: "Which end of Walking Street should I start from?",
          a: "The northern arch, where the street meets the beachfront. From the Bali Hai Pier end you have to walk the length of Walking Street back north before the route below starts.",
        },
        {
          q: "Is it walkable in the middle of the day?",
          a: "It is, but there is almost no shade on the inland stretch. In the hottest hours most people take a baht bus for the first half and walk the rest.",
        },
        {
          q: "What do I tell the driver?",
          a: "Pattaya 13 Alley, and show the Google Maps pin. Drivers know the numbered sois; individual shop names mean nothing to them.",
        },
      ],
    },
    ru: {
      landmarkSlug: "walking-street",
      title: "От Walking Street до LABS DISPENSARY: маршрут по поворотам",
      description:
        "Дорога вглубь от арки Уокинг Стрит (Walking Street) до 32 Pattaya 13 Alley: где обычно теряются и что называть водителю.",
      // Кириллическая форма стоит в H1 и в описании, а латинская остаётся в
      // <title>: русский посетитель ищет улицу и так, и так, но заголовок
      // выдачи режется по ширине, и удваивать в нём одно и то же название
      // значит потратить видимую половину на повтор.
      h1: "От Уокинг Стрит (Walking Street) до двери в Pattaya 13 Alley",
      kicker: "Маршрут от Уокинг Стрит",
      intro:
        "Walking Street — то место, где стоит большинство приехавших впервые, когда начинает искать магазин, и оттуда же маршрут чаще всего идут не в ту сторону. Расстояние достаточно короткое, чтобы вечером пройти пешком, и достаточно длинное, чтобы днём это было неприятно, а всё дело решает один поворот у арки.",
      routeIntro:
        "Одну вещь стоит зафиксировать до старта: магазин стоит вглубь от моря, а не вдоль пляжа. Большинство тех, кто теряется на этом маршруте, продолжают идти вдоль воды — именно туда разворачивает человека сама Walking Street. Поверните к морю спиной, и дальше всё просто.",
      routeTitle: "Маршрут по поворотам",
      steps: [
        {
          title: "Старт у арки, а не у пирса",
          body:
            "У Walking Street два конца. Северный — арка там, где улица выходит к набережной; южный — пирс Бали Хай. Маршрут ниже начинается от арки. Если вы стоите у пирса, сначала пройдите улицу обратно на север: это ровно длина Walking Street, и единственный отрезок, который никак не срезать.",
        },
        {
          title: "Перейдите набережную и идите вглубь",
          body:
            "У арки перейдите дорогу вдоль пляжа и продолжайте движение, оставив море за спиной, по главной дороге, которая уходит вглубь от этого угла, — это Южная дорога Паттайи, на указателях Pattaya Tai. Именно этот отрезок и делает всю работу: он выводит с приморской полосы в квартал нумерованных переулков, где стоит магазин.",
        },
        {
          title: "Поворот в нумерованный переулок",
          body:
            "Последняя часть маршрута уходит с большой дороги в Pattaya 13 Alley. Это переулок, поэтому с проезжей части не видно ничего, и здесь полезнее перестать читать вывески и начать вести маршрут по пину: навигатор выведет к нужному концу переулка, а у переулков в этом районе их два.",
        },
        {
          title: "Дверь",
          body:
            "Внутри переулка ищите вывеску LABS DISPENSARY, адрес 32 Pattaya 13 Alley. Если вы уже в переулке и вывеску не видите, напишите, вместо того чтобы проходить его дважды: вас доведут словами от того места, где вы стоите.",
        },
      ],
      sections: [
        {
          h2: "Вечером и днём это две разные дороги",
          body: [
            "Вечером маршрут приятный, и толпа заканчивается сразу за набережной: шум Walking Street обрывается почти у арки, а дальше идёт обычная городская улица с движением и освещёнными витринами.",
            "Днём это другая история. На отрезке вглубь тени почти нет, асфальт отдаёт жар, и дорога, которая на карте выглядит комфортной, под прямым солнцем комфортной не является. В эти часы половину пути обычно проезжают на сонгтео, а остальное проходят пешком — героизм тут ни к чему.",
          ],
        },
        {
          h2: "На сонгтео, такси или байке",
          body: [
            "Сонгтео, которые идут по кругу через центр, довезут почти до места за обычный проезд: садитесь в тот, что уходит вглубь от моря, назовите переулок и нажмите кнопку на углу. Не начинайте с названия магазина: каннабис-шопов в городе несколько сотен, по названию их не знает ни один водитель, а нумерованные сои знают все.",
            "Для байк-такси и заказанной машины правило то же: называйте переулок и показывайте пин в Google Maps. Пин заканчивает разговор быстрее любых попыток произношения и высаживает вас с нужной стороны улицы.",
          ],
        },
        {
          h2: "Чего на этом маршруте нет",
          body: [
            "Нет короткого пути вдоль пляжа: набережная идёт на север, магазин стоит вглубь, и с каждым кварталом вдоль воды вы удаляетесь. Нет и ничего, что можно забрать по дороге: заказать или оплатить через сайт и через переписку нельзя, поэтому маршрут заканчивается у прилавка, где вы показываете документы и разговариваете с человеком.",
            "Возьмите паспорт и рецепт в оригинале. Возрастная граница — 20 лет, проверка бывает при каждом визите, и знать об этом лучше до того, как вы пересечёте город, а не у двери.",
          ],
        },
      ],
      faqTitle: "Дорога от Walking Street: вопросы",
      faq: [
        {
          q: "Сколько от Walking Street до магазина?",
          a: "{walk}. Расстояние — прямая от пина магазина до северного входа на Walking Street, а время — это же расстояние спокойным шагом с запасом на обход кварталов. Реальным считайте большее число.",
        },
        {
          q: "С какого конца Walking Street начинать?",
          a: "С северной арки, там, где улица выходит к набережной. От пирса Бали Хай придётся сначала пройти всю Walking Street обратно на север, и только там начинается маршрут.",
        },
        {
          q: "Реально ли идти пешком днём?",
          a: "Реально, но на отрезке вглубь тени почти нет. В самые жаркие часы половину пути обычно проезжают на сонгтео, а дальше идут пешком.",
        },
        {
          q: "Что сказать водителю?",
          a: "«Pattaya 13 Alley» и показать пин в Google Maps. Нумерованные сои знают все водители, названия отдельных магазинов им ничего не говорят.",
        },
      ],
    },
  },
  "soi-buakhao": {
    en: {
      landmarkSlug: "soi-buakhao",
      title: "Soi Buakhao to LABS DISPENSARY: the short inland route",
      description:
        "How to walk or ride from Soi Buakhao to 32 Pattaya 13 Alley in South Pattaya: which end to start from, what the corner looks like, and what to tell a driver.",
      h1: "From Soi Buakhao to Pattaya 13 Alley",
      kicker: "Route from Soi Buakhao",
      intro:
        "Soi Buakhao is where a large part of Pattaya actually lives rather than visits, and it is the closest of the busy districts to this counter. The trip is short, entirely inland, and it goes wrong in only one way: people start from the wrong end of a street that runs the better part of a kilometre and a half.",
      routeTitle: "The route, corner by corner",
      routeIntro:
        "Soi Buakhao runs roughly north to south, parallel to Second Road and one block inland from it. The shop lies south-west of the street's southern end, so everything about this trip depends on getting to that southern end first — from the northern end you are adding the length of Buakhao itself before the route below even begins.",
      steps: [
        {
          title: "Work out which end you are at",
          body:
            "The reference points along Buakhao are easy to place. Soi LK Metro and Soi Diana sit in the busy middle stretch; the fresh market and the Soi Lengkee junction sit further north. If the sois you are passing carry those names you are in the top half of the street, and the first job is to head south, not west.",
        },
        {
          title: "South to the main road",
          body:
            "Follow Buakhao south until it ends at the main east-west road — South Pattaya Road, signposted as Pattaya Tai. This is a proper junction with traffic lights and constant traffic, not a quiet corner; you will know you have reached it. Everything until this point is one straight line, which is the useful thing about Buakhao as a starting point.",
        },
        {
          title: "West, towards the sea",
          body:
            "Turn right onto South Pattaya Road and walk in the direction of the sea. This is the noisy part of the trip and the least interesting, but it is short and it is flat. Keep going until the numbered alleys start branching off to the side.",
        },
        {
          title: "Into Pattaya 13 Alley",
          body:
            "The shop is at 32 Pattaya 13 Alley, off the main road. Nothing is visible from the road itself, so follow the pin for the last part rather than looking for a sign, and look for the LABS DISPENSARY board once you are inside the alley. If you cannot see it, send a message instead of walking the alley twice.",
        },
      ],
      sections: [
        {
          h2: "Why this is the easiest walk of any Pattaya district",
          body: [
            "Of the districts people actually stay in, Soi Buakhao is the nearest to this address, and the route is a simple right angle: south, then west. There is no beachfront to confuse the direction, no one-way system to fight, and no hill.",
            "There is also more shade along parts of Buakhao than along the seafront roads, because the street is narrow and built up on both sides. In the middle of the day that difference is worth more than the distance saved.",
          ],
        },
        {
          h2: "Bar street at night, ordinary street by day",
          body: [
            "The middle stretch of Buakhao changes character completely between afternoon and evening. By day it is a working street of shops, laundries, small kitchens and motorbike repair; after dark the bar complexes around LK Metro fill it, traffic slows to walking pace and the pavement disappears under tables.",
            "For this trip that mostly affects speed rather than route. In the evening walking the length of Buakhao is often faster than riding it, and crossing South Pattaya Road takes longer than it looks — use the lights rather than the gap in the traffic.",
          ],
        },
        {
          h2: "By motorbike taxi or baht bus",
          body: [
            "Motorbike taxis wait at most junctions along Buakhao, including the southern end, and this is a distance they cover in a couple of minutes. Say the alley — Pattaya 13 Alley — and show the map pin. Do not lead with the shop name; there are several hundred cannabis counters in this city and drivers know none of them by name.",
            "Baht buses run along Buakhao and along South Pattaya Road, so the trip is possible in two hops for the standard fare, but at this distance the walk is usually simpler than the change. If you do ride, press the buzzer before the junction rather than after it.",
          ],
        },
        {
          h2: "What to bring, and what this trip does not include",
          body: [
            "Bring your passport and the original of your prescription. Both are checked at the counter on every visit, and it is a short trip to make twice for the want of a document that was in the room.",
            "Nothing can be ordered, reserved or paid for through this website or by message. The route ends at a counter where a person opens jars in front of you and answers questions, which is the only lawful way this works.",
          ],
        },
      ],
      faqTitle: "Soi Buakhao to the shop: questions",
      faq: [
        {
          q: "How far is Soi Buakhao from the shop?",
          a: "{walk}. The distance is calculated from the shop pin to the southern end of Soi Buakhao, where the street meets South Pattaya Road; from the northern end, add the length of Buakhao itself.",
        },
        {
          q: "Which end of Soi Buakhao should I start from?",
          a: "The southern end, at the junction with South Pattaya Road. If you are passing Soi LK Metro or Soi Diana you are still in the middle of the street and should head south first.",
        },
        {
          q: "Is it walkable at night?",
          a: "Yes, and in the evening walking is often faster than riding, because the middle stretch of Buakhao moves at pedestrian pace once the bars fill up.",
        },
        {
          q: "What should I tell a motorbike taxi?",
          a: "Pattaya 13 Alley, and show the Google Maps pin. Numbered sois are how drivers navigate; individual shop names mean nothing to them.",
        },
      ],
    },
    ru: {
      landmarkSlug: "soi-buakhao",
      title: "От Сой Буакхао до LABS DISPENSARY: короткий маршрут вглубь",
      description:
        "Как дойти или доехать от Сой Буакхао до 32 Pattaya 13 Alley в Южной Паттайе: с какого конца стартовать, как выглядит перекрёсток и что сказать водителю.",
      h1: "От Сой Буакхао до Pattaya 13 Alley",
      kicker: "Маршрут от Сой Буакхао",
      intro:
        "Сой Буакхао — это район, где Паттайя скорее живёт, чем отдыхает, и из всех оживлённых районов он ближе всего к этому прилавку. Дорога короткая, целиком вглубь от моря, и портится она ровно одним способом: люди стартуют не с того конца улицы, которая тянется добрых полтора километра.",
      routeTitle: "Маршрут по поворотам",
      routeIntro:
        "Сой Буакхао идёт примерно с севера на юг, параллельно Второй дороге и на квартал вглубь от неё. Магазин стоит к юго-западу от южного конца улицы, поэтому вся поездка держится на том, чтобы сначала попасть на этот южный конец: с северного вы добавляете к маршруту всю длину Буакхао ещё до того, как он начался.",
      steps: [
        {
          title: "Поймите, на каком вы конце",
          body:
            "Ориентиры вдоль Буакхао узнаются легко. Сой ЛК Метро и Сой Диана — это оживлённая середина; рынок и перекрёсток с Сой Ленгки — заметно севернее. Если вы проходите мимо этих названий, вы в верхней половине улицы, и первое дело — идти на юг, а не на запад.",
        },
        {
          title: "На юг до большой дороги",
          body:
            "Идите по Буакхао на юг, пока улица не упрётся в главную дорогу с востока на запад — Южную дорогу Паттайи, на указателях Pattaya Tai. Это полноценный перекрёсток со светофором и постоянным потоком, а не тихий угол: вы поймёте, что дошли. До этого места маршрут — одна прямая линия, и в этом главное удобство Буакхао как точки старта.",
        },
        {
          title: "На запад, к морю",
          body:
            "Поверните направо на Южную дорогу и идите в сторону моря. Это самая шумная и самая скучная часть дороги, зато короткая и ровная. Идите, пока в сторону не начнут отходить нумерованные переулки.",
        },
        {
          title: "В Pattaya 13 Alley",
          body:
            "Магазин стоит по адресу 32 Pattaya 13 Alley, в стороне от большой дороги. С проезжей части не видно ничего, поэтому последний отрезок ведите по пину, а не по вывескам, и ищите табличку LABS DISPENSARY уже внутри переулка. Не видно — напишите, вместо того чтобы проходить переулок дважды.",
        },
      ],
      sections: [
        {
          h2: "Почему это самая простая дорога из всех районов",
          body: [
            "Из районов, где люди действительно живут, Сой Буакхао ближе всех к этому адресу, а маршрут представляет собой простой прямой угол: на юг, потом на запад. Нет набережной, которая сбивает направление, нет одностороннего движения, с которым надо считаться, и нет холма.",
            "Плюс на части Буакхао тени больше, чем на приморских дорогах: улица узкая и застроена с обеих сторон. В середине дня эта разница стоит больше, чем сэкономленные метры.",
          ],
        },
        {
          h2: "Вечером барная улица, днём обычная",
          body: [
            "Средний отрезок Буакхао между днём и вечером меняет характер целиком. Днём это рабочая улица с магазинчиками, прачечными, маленькими кухнями и мотомастерскими; после темноты барные комплексы у ЛК Метро заполняют её, поток замедляется до скорости пешехода, а тротуар исчезает под столиками.",
            "Для этой поездки разница касается скорости, а не маршрута. Вечером пройти Буакхао пешком часто быстрее, чем проехать, а переход через Южную дорогу занимает больше времени, чем кажется: пользуйтесь светофором, а не просветом в потоке.",
          ],
        },
        {
          h2: "На байк-такси или сонгтео",
          body: [
            "Байк-такси стоят почти на каждом перекрёстке вдоль Буакхао, включая южный конец, и это расстояние они проезжают за пару минут. Называйте переулок — Pattaya 13 Alley — и показывайте пин на карте. Не начинайте с названия магазина: каннабис-точек в городе несколько сотен, и по названию их не знает ни один водитель.",
            "Сонгтео ходят и по Буакхао, и по Южной дороге, так что дорога складывается из двух пересадок за обычный проезд, но на такой дистанции пешком обычно проще, чем пересаживаться. Если всё же едете, нажимайте кнопку до перекрёстка, а не после.",
          ],
        },
        {
          h2: "Что взять и чего в этой поездке нет",
          body: [
            "Возьмите паспорт и оригинал рецепта. И то и другое проверяют у прилавка при каждом визите, а дорога слишком короткая, чтобы проделывать её дважды из-за документа, оставшегося в номере.",
            "Заказать, забронировать или оплатить через сайт и переписку нельзя. Маршрут заканчивается у прилавка, где банки открывают при вас и отвечают на вопросы, — это единственный законный способ.",
          ],
        },
      ],
      faqTitle: "От Сой Буакхао до магазина: вопросы",
      faq: [
        {
          q: "Сколько от Сой Буакхао до магазина?",
          a: "{walk}. Расстояние считается от пина магазина до южного конца Сой Буакхао, там, где улица выходит на Южную дорогу Паттайи; от северного конца добавьте всю длину самой Буакхао.",
        },
        {
          q: "С какого конца Сой Буакхао стартовать?",
          a: "С южного, от перекрёстка с Южной дорогой Паттайи. Если вы проходите Сой ЛК Метро или Сой Диана, вы ещё в середине улицы и сначала надо идти на юг.",
        },
        {
          q: "Можно ли идти пешком вечером?",
          a: "Да, и вечером пешком часто быстрее, чем на транспорте: как только заполняются бары, средний отрезок Буакхао движется со скоростью пешехода.",
        },
        {
          q: "Что сказать байк-такси?",
          a: "«Pattaya 13 Alley» и показать пин в Google Maps. Водители ориентируются по нумерованным сои, названия магазинов им ничего не говорят.",
        },
      ],
    },
  },
  "central-pattaya": {
    en: {
      landmarkSlug: "central-festival",
      title: "Central Pattaya to LABS DISPENSARY: the one-way loop explained",
      description:
        "Getting south from Central Pattaya and Central Festival to 32 Pattaya 13 Alley: how the baht bus loop runs, which road goes which way, and where to walk.",
      h1: "From Central Pattaya to Pattaya 13 Alley",
      kicker: "Route from Central Pattaya",
      intro:
        "Central Pattaya is the part of town most visitors are routed through by their hotel, and the trip south from it is the one that most often ends up costing three times what it should. Not because it is complicated, but because the two main roads run in opposite directions and nobody tells you which is which.",
      routeTitle: "The route, in the direction the traffic goes",
      routeIntro:
        "The single fact that makes this trip cheap and quick: through the centre of Pattaya, Beach Road is one-way heading south and Second Road is one-way heading north. Since the shop is to the south, everything about your journey should be happening on Beach Road, not on Second Road.",
      steps: [
        {
          title: "Get to Beach Road, on the sea side",
          body:
            "From Central Festival or anywhere along Central Road, walk down to the beachfront rather than trying to catch something heading south on Second Road. A baht bus on Second Road is going north, away from where you want to be, and it will take you on a long tour of the city before it comes back.",
        },
        {
          title: "Ride or walk south along the beachfront",
          body:
            "Baht buses run continuously south along Beach Road with the sea on your right. Flag one, sit at the back, and stay on it past Walking Street. If you are walking instead, the beachfront has shade on the inland side for much of the way and a breeze that the inland roads do not get.",
        },
        {
          title: "Turn inland at the south end",
          body:
            "At the southern end of the beachfront, where Walking Street begins, the route turns inland along South Pattaya Road, signposted as Pattaya Tai. This is where the sea stops being useful as a reference: from here you are heading away from it and into the block of numbered alleys.",
        },
        {
          title: "Into Pattaya 13 Alley",
          body:
            "The address is 32 Pattaya 13 Alley. It is a side street off the main road, so nothing is visible until you are in it, and the phone route matters more than the signage for the last part. The LABS DISPENSARY board is inside the alley itself.",
        },
      ],
      sections: [
        {
          h2: "The one-way loop is the whole trick",
          body: [
            "Almost every complaint about baht buses in Pattaya comes down to the loop. The fixed route runs south along Beach Road and north along Second Road, so a bus that looks like it is heading the wrong way usually is — and staying on it means a full circuit of the centre.",
            "Once you know this, the system is genuinely convenient and the fare is fixed for anywhere along the route. Get on going the way you want to go, press the buzzer on the ceiling before your turning, and pay at the window after you step off.",
          ],
        },
        {
          h2: "Walking it, and when that is a good idea",
          body: [
            "The beachfront walk south from Central Pattaya is one of the better walks in the city in the early evening: it is flat, it is shaded on one side, and the sea air makes a real difference compared with the inland roads. In the middle of the day it is a long stretch of direct sun and most people take the bus.",
            "The last part, inland from the beachfront, is the least pleasant regardless of the hour — traffic, no sea breeze, little shade. Plenty of people ride the beachfront leg and walk only that final stretch, which is a reasonable compromise.",
          ],
        },
        {
          h2: "By taxi or ride-hailing app",
          body: [
            "For a booked car the loop does not apply, but the alley still does: give the driver Pattaya 13 Alley and let the pin do the rest. A shop name will not be recognised, and describing a landmark instead usually results in being dropped on the main road rather than at the alley mouth.",
            "One local detail worth knowing: traffic through the centre backs up badly in the late afternoon, and the beachfront is often slower than walking at that hour. If a route estimate looks implausibly long, that is why.",
          ],
        },
        {
          h2: "What to bring",
          body: [
            "Passport and the original prescription document, on every visit. The counter checks both before anything else happens, and from Central Pattaya that is a long way to come back for a document left in a hotel safe.",
            "There is nothing to arrange in advance: no orders, no reservations and no payment through this website or by message. The trip ends at a counter, with a conversation.",
          ],
        },
      ],
      faqTitle: "Central Pattaya to the shop: questions",
      faq: [
        {
          q: "How far is Central Pattaya from the shop?",
          a: "{walk}. The distance is calculated from the shop pin to Central Festival on the beachfront, which is the usual reference point for the district.",
        },
        {
          q: "Which road do I take heading south?",
          a: "Beach Road. Through the centre, Beach Road is one-way southbound and Second Road is one-way northbound, so a southbound trip belongs on the beachfront.",
        },
        {
          q: "Is it walkable from Central Festival?",
          a: "It is, and the beachfront leg is pleasant in the early evening. In the middle of the day most people take a baht bus south and walk only the inland part.",
        },
        {
          q: "What do I tell a driver?",
          a: "Pattaya 13 Alley, with the Google Maps pin on screen. Landmark descriptions tend to end with being dropped on the main road instead of at the alley.",
        },
      ],
    },
    ru: {
      landmarkSlug: "central-festival",
      title: "Из Центральной Паттайи до LABS DISPENSARY: как работает круг",
      description:
        "Дорога на юг из Центральной Паттайи и от Central Festival до 32 Pattaya 13 Alley: как ходят сонгтео, какая дорога в какую сторону и где идти пешком.",
      h1: "Из Центральной Паттайи до Pattaya 13 Alley",
      kicker: "Маршрут из Центральной Паттайи",
      intro:
        "Центральная Паттайя — та часть города, куда отель отправляет большинство приезжих, и дорога отсюда на юг чаще всего обходится втрое дороже, чем должна. Не потому что она сложная, а потому что две главные дороги идут в противоположные стороны, и об этом никто не предупреждает.",
      routeTitle: "Маршрут по направлению движения",
      routeIntro:
        "Один факт, который делает эту поездку быстрой и дешёвой: через центр Паттайи Бич Роуд односторонняя и идёт на юг, а Вторая дорога односторонняя и идёт на север. Магазин стоит южнее, поэтому вся ваша дорога должна происходить на Бич Роуд, а не на Второй.",
      steps: [
        {
          title: "Выйдите на Бич Роуд, со стороны моря",
          body:
            "От Central Festival или откуда угодно с Центральной дороги спускайтесь к набережной, а не пытайтесь поймать что-то южное на Второй дороге. Сонгтео на Второй едет на север, то есть в противоположную сторону, и вернётся сюда только после длинного круга по городу.",
        },
        {
          title: "На юг вдоль набережной",
          body:
            "Сонгтео идут по Бич Роуд на юг непрерывно, море остаётся справа. Поднимите руку, садитесь в конец кузова и не выходите до самой Walking Street. Если идёте пешком, у набережной большую часть пути есть тень со стороны города и ветер, которого на внутренних улицах нет.",
        },
        {
          title: "Поворот вглубь на южном конце",
          body:
            "На южном конце набережной, там, где начинается Walking Street, маршрут уходит вглубь по Южной дороге Паттайи, на указателях Pattaya Tai. Здесь море перестаёт работать ориентиром: дальше вы идёте от него, в квартал нумерованных переулков.",
        },
        {
          title: "В Pattaya 13 Alley",
          body:
            "Адрес — 32 Pattaya 13 Alley. Это переулок в стороне от большой дороги, поэтому до входа не видно ничего, и на последнем отрезке навигатор важнее вывесок. Табличка LABS DISPENSARY стоит уже внутри переулка.",
        },
      ],
      sections: [
        {
          h2: "Круг сонгтео — это и есть весь секрет",
          body: [
            "Почти все жалобы на сонгтео в Паттайе сводятся к кругу. Маршрут фиксированный: на юг по Бич Роуд, на север по Второй дороге. Поэтому машина, которая едет как будто не туда, обычно действительно едет не туда, и остаться в ней означает проехать полный круг по центру.",
            "Если это знать, система вполне удобна, а проезд по маршруту стоит одинаково. Садитесь в ту, что идёт в вашу сторону, нажимайте кнопку на потолке до поворота и расплачивайтесь в окошко после того, как вышли.",
          ],
        },
        {
          h2: "Пешком и когда это хорошая идея",
          body: [
            "Прогулка на юг по набережной из Центральной Паттайи — одна из лучших в городе ранним вечером: ровно, с одной стороны тень, а морской воздух ощутимо отличается от внутренних улиц. В середине дня это длинный отрезок под прямым солнцем, и большинство едет.",
            "Последняя часть, от набережной вглубь, неприятна в любое время: поток, никакого ветра, почти нет тени. Многие проезжают набережную и проходят пешком только этот отрезок — разумный компромисс.",
          ],
        },
        {
          h2: "На такси и через приложение",
          body: [
            "Для заказанной машины круг не действует, а переулок действует по-прежнему: называйте водителю Pattaya 13 Alley и дальше пусть работает пин. Название магазина не опознают, а описание ориентира обычно заканчивается высадкой на большой дороге, а не у входа в переулок.",
            "Одна местная деталь: под вечер поток через центр встаёт, и набережная в эти часы бывает медленнее пешехода. Если приложение показывает неправдоподобно долгий маршрут, причина в этом.",
          ],
        },
        {
          h2: "Что взять",
          body: [
            "Паспорт и оригинал рецепта, при каждом визите. У прилавка проверяют и то и другое раньше всего остального, а из Центральной Паттайи возвращаться за документом, оставшимся в сейфе отеля, далеко.",
            "Заранее ничего организовать нельзя: ни заказа, ни брони, ни оплаты через сайт и переписку. Дорога заканчивается у прилавка и разговором.",
          ],
        },
      ],
      faqTitle: "Из Центральной Паттайи: вопросы",
      faq: [
        {
          q: "Сколько от Центральной Паттайи до магазина?",
          a: "{walk}. Расстояние считается от пина магазина до Central Festival на набережной — это обычная точка отсчёта для района.",
        },
        {
          q: "По какой дороге ехать на юг?",
          a: "По Бич Роуд. Через центр Бич Роуд односторонняя на юг, а Вторая дорога односторонняя на север, поэтому южная поездка происходит по набережной.",
        },
        {
          q: "Реально ли дойти пешком от Central Festival?",
          a: "Реально, и отрезок вдоль набережной ранним вечером приятный. В середине дня обычно проезжают на сонгтео и проходят пешком только внутреннюю часть.",
        },
        {
          q: "Что сказать водителю?",
          a: "«Pattaya 13 Alley» и показать пин в Google Maps. Описание ориентира обычно приводит к высадке на большой дороге, а не у переулка.",
        },
      ],
    },
  },
  jomtien: {
    en: {
      landmarkSlug: "jomtien-beach",
      title: "Jomtien to LABS DISPENSARY: the two ways over the hill",
      description:
        "Getting from Jomtien to 32 Pattaya 13 Alley in South Pattaya: the Thappraya route, the Bali Hai route, why walking is not realistic and what to tell a driver.",
      h1: "From Jomtien to Pattaya 13 Alley",
      kicker: "Route from Jomtien",
      intro:
        "Jomtien is a separate town in everything but administration, and the hill between it and South Pattaya is the reason. This is the one district on this site where the honest answer is that you are not walking it — but the ride is short, there are two distinct ways to do it, and one of them is considerably better in the evening.",
      routeTitle: "Two routes over the hill",
      routeIntro:
        "Everything between Jomtien and South Pattaya has to get around or over Pratumnak Hill. There are two ways: inland over the hill on Thappraya Road, or along the water to Bali Hai Pier and up from there. Which one is better depends entirely on the time of day.",
      steps: [
        {
          title: "Decide before you flag anything",
          body:
            "Baht buses in Jomtien run along Jomtien Beach Road and along Thappraya Road as separate services, and they do not continue into South Pattaya as one ride. Whichever way you go, expect to change at the Bali Hai end. Knowing that in advance stops the trip turning into an argument at a junction.",
        },
        {
          title: "Route one: over the hill on Thappraya",
          body:
            "Thappraya Road climbs across the base of Pratumnak Hill and comes down into South Pattaya near the pier. It is the direct line and the usual choice by day. In the late afternoon it is also the section that jams, and a ride that is quick at noon can crawl at sunset.",
        },
        {
          title: "Route two: along the water to Bali Hai",
          body:
            "The alternative follows Jomtien Beach Road north and comes around to Bali Hai Pier, which sits at the southern end of Walking Street. It is longer on the map and often faster in practice when Thappraya is backed up, and the view is better.",
        },
        {
          title: "From Bali Hai to the alley",
          body:
            "From the pier the last leg goes north along the beachfront and then inland on South Pattaya Road, into the block of numbered alleys where the shop is. The address is 32 Pattaya 13 Alley; follow the pin for the final stretch, because a side street shows nothing from the main road.",
        },
      ],
      sections: [
        {
          h2: "Why walking is not the answer here",
          body: [
            "The distance from Jomtien Beach to this address is enough that we do not quote a walking time for it at all. The route crosses a hill, the pavements come and go, and the stretch over Pratumnak has no shade to speak of.",
            "People do walk it, usually once. Everyone who has tried it in the middle of the day describes the same experience, and it is not one worth repeating for the sake of a short errand.",
          ],
        },
        {
          h2: "The evening problem, and how locals handle it",
          body: [
            "Between the end of the afternoon and dusk, Thappraya Road carries most of the traffic moving between Jomtien and Pattaya, and it slows to a crawl in both directions. This is the single biggest variable in how long this trip takes.",
            "The two usual answers are to go earlier, or to take the water side via Bali Hai and accept the extra distance. A motorbike gets through what a car cannot, which is why so much of Jomtien moves on two wheels at that hour.",
          ],
        },
        {
          h2: "What to say, and what not to say",
          body: [
            "Ask for Pattaya 13 Alley and show the Google Maps pin. Do not ask for the shop by name: there are several hundred cannabis counters in this city and no driver has learned the list, and a name that sounds like three other shops makes the situation worse rather than better.",
            "If you are changing at Bali Hai, say South Pattaya rather than the alley for the first leg, then give the alley for the second. Splitting the instruction that way matches how the routes actually run.",
          ],
        },
        {
          h2: "Before you set out",
          body: [
            "This is the longest trip on the site, so it is the one where a missing document costs the most. Passport and the original prescription, both checked at the counter on every visit, including for people who were here last week.",
            "Nothing about the visit can be arranged in advance — no orders, no reservations, no payment through this website or by message. If you want to know whether it is worth making the trip today, ask by message before you leave rather than after you arrive.",
          ],
        },
      ],
      faqTitle: "Jomtien to the shop: questions",
      faq: [
        {
          q: "How far is Jomtien from the shop?",
          a: "{walk}. The distance is calculated from the shop pin to Jomtien Beach, and it is beyond the range where quoting a walking time would be honest.",
        },
        {
          q: "Can I walk from Jomtien?",
          a: "In practice, no. The route crosses Pratumnak Hill with little shade and inconsistent pavements. Take a baht bus or a motorbike taxi.",
        },
        {
          q: "Which way is faster, Thappraya or Bali Hai?",
          a: "Thappraya by day, when it is the direct line. In the late afternoon it jams badly, and the longer route along the water past Bali Hai is often quicker.",
        },
        {
          q: "Is there one baht bus all the way?",
          a: "No. Jomtien services and South Pattaya services are separate, so expect to change around the Bali Hai end.",
        },
      ],
    },
    ru: {
      landmarkSlug: "jomtien-beach",
      title: "Из Джомтьена до LABS DISPENSARY: два пути через холм",
      description:
        "Дорога из Джомтьена до 32 Pattaya 13 Alley в Южной Паттайе: путь по Тхеппразит, путь через Бали Хай, почему пешком нереально и что сказать водителю.",
      h1: "Из Джомтьена до Pattaya 13 Alley",
      kicker: "Маршрут из Джомтьена",
      intro:
        "Джомтьен — отдельный город во всём, кроме административного деления, и причина тому холм между ним и Южной Паттайей. Это единственный район на сайте, про который честный ответ звучит так: пешком вы туда не пойдёте. Зато поездка короткая, путей ровно два, и вечером один из них заметно лучше другого.",
      routeTitle: "Два пути через холм",
      routeIntro:
        "Всё, что едет между Джомтьеном и Южной Паттайей, обязано обогнуть или пересечь холм Пратамнак. Способа два: вглубь через холм по дороге Тхаппрайя или вдоль воды до пирса Бали Хай и оттуда наверх. Что лучше — целиком зависит от времени суток.",
      steps: [
        {
          title: "Решите до того, как поднимете руку",
          body:
            "Сонгтео в Джомтьене ходят по пляжной дороге Джомтьена и по Тхаппрайе как разные маршруты и не продолжаются в Южную Паттайю одной поездкой. Каким бы путём вы ни ехали, рассчитывайте на пересадку в районе Бали Хай. Знание этого заранее избавляет от спора на перекрёстке.",
        },
        {
          title: "Путь первый: через холм по Тхаппрайе",
          body:
            "Дорога Тхаппрайя поднимается через основание холма Пратамнак и спускается в Южную Паттайю рядом с пирсом. Это прямая линия и обычный выбор днём. Под вечер это же и тот участок, который встаёт: поездка, занимающая в полдень считанные минуты, на закате ползёт.",
        },
        {
          title: "Путь второй: вдоль воды до Бали Хай",
          body:
            "Альтернатива идёт по пляжной дороге Джомтьена на север и выходит к пирсу Бали Хай, который стоит у южного конца Walking Street. На карте он длиннее, а на практике часто быстрее, когда Тхаппрайя забита, и вид с него лучше.",
        },
        {
          title: "От Бали Хай до переулка",
          body:
            "От пирса последний отрезок идёт на север вдоль набережной и затем вглубь по Южной дороге Паттайи, в квартал нумерованных переулков. Адрес — 32 Pattaya 13 Alley; на финальном отрезке ведите по пину, потому что с большой дороги переулок не показывает ничего.",
        },
      ],
      sections: [
        {
          h2: "Почему пешком здесь не вариант",
          body: [
            "Расстояние от пляжа Джомтьен до этого адреса такое, что времени пешком мы для него не называем вовсе. Маршрут пересекает холм, тротуары то появляются, то исчезают, а на участке через Пратамнак тени практически нет.",
            "Пешком его проходят — обычно один раз. Все, кто пробовал сделать это среди дня, описывают одно и то же впечатление, и повторять его ради короткого дела не стоит.",
          ],
        },
        {
          h2: "Вечерняя проблема и как её решают местные",
          body: [
            "Между концом дня и сумерками Тхаппрайя везёт почти весь поток между Джомтьеном и Паттайей и встаёт в обе стороны. Это главная переменная в том, сколько займёт дорога.",
            "Обычных ответов два: выезжать раньше или идти со стороны воды через Бали Хай, приняв лишние километры. Байк проезжает там, где машина стоит, и поэтому в эти часы Джомтьен передвигается в основном на двух колёсах.",
          ],
        },
        {
          h2: "Что говорить и чего не говорить",
          body: [
            "Просите Pattaya 13 Alley и показывайте пин в Google Maps. Не называйте магазин по имени: каннабис-точек в городе несколько сотен, списка не выучил ни один водитель, а название, похожее ещё на три соседних, делает ситуацию хуже, а не лучше.",
            "Если пересаживаетесь у Бали Хай, для первого отрезка говорите «Южная Паттайя», а переулок называйте уже во втором. Такое разделение соответствует тому, как маршруты ходят на самом деле.",
          ],
        },
        {
          h2: "Перед выездом",
          body: [
            "Это самая длинная дорога из описанных на сайте, поэтому забытый документ обходится здесь дороже всего. Паспорт и оригинал рецепта проверяют у прилавка при каждом визите, включая тех, кто был здесь неделю назад.",
            "Заранее ничего организовать нельзя: ни заказа, ни брони, ни оплаты через сайт и переписку. Если хочется понять, имеет ли смысл ехать сегодня, спросите в переписке до выезда, а не после приезда.",
          ],
        },
      ],
      faqTitle: "Из Джомтьена: вопросы",
      faq: [
        {
          q: "Сколько от Джомтьена до магазина?",
          a: "{walk}. Расстояние считается от пина магазина до пляжа Джомтьен и выходит за пределы, в которых называть время пешком было бы честно.",
        },
        {
          q: "Можно ли дойти из Джомтьена пешком?",
          a: "На практике нет. Маршрут пересекает холм Пратамнак, тени почти нет, тротуары непостоянные. Едьте на сонгтео или на байк-такси.",
        },
        {
          q: "Что быстрее — Тхаппрайя или Бали Хай?",
          a: "Днём Тхаппрайя, потому что это прямая линия. Под вечер она встаёт, и более длинный путь вдоль воды мимо Бали Хай часто оказывается быстрее.",
        },
        {
          q: "Есть ли один сонгтео на весь путь?",
          a: "Нет. Маршруты Джомтьена и Южной Паттайи разные, поэтому рассчитывайте на пересадку в районе Бали Хай.",
        },
      ],
    },
  },
};

export function getAreaRoute(slug: string, locale: Locale): AreaRoute | null {
  return AREA_ROUTES[slug]?.[locale] ?? null;
}
