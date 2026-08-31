import type { Locale } from "@/lib/i18n";

/**
 * НАБОР ДАННЫХ ОРИЕНТИРОВ для гео-кластера.
 *
 * Здесь лежит ровно то, из чего гео-страница может быть непохожей на соседнюю:
 * координата (из неё гаверсинус в `src/lib/geo.ts` считает расстояние и время)
 * и фактура маршрута — чем едут, где пересадка, что меняется вечером, где
 * ошибаются поворотом. Ни одного расстояния и ни одной минуты в строках этого
 * файла нет и быть не может: числа считаются, а не пишутся (за этим следит
 * `checkHandWrittenDistances()` в `scripts/check-seo.mjs`).
 *
 * ═══ ПРАВИЛО ДОПУСКА КООРДИНАТЫ ═══
 * Ориентир попадает сюда, только если координату можно предъявить:
 *   • `corroborated` — два независимых источника, расхождение ≤ 150 м (порог
 *     проверяется на сборке: `assertLandmarkDataIntegrity()` в `src/lib/geo.ts`);
 *   • `single-source` — один источник справочного класса (Wikipedia/Wikidata,
 *     аэронавигационная контрольная точка) плюс качественная сверка географии
 *     («к северу от перекрёстка X»), которая источнику не противоречит;
 *   • `anchor` — точка на ЛИНЕЙНОМ объекте (улица, набережная), выбранная как
 *     ближайший к магазину конец. У линии нет одной «правильной» координаты,
 *     поэтому такая запись обязана нести `caveat` с честной погрешностью.
 * `caveat` требуется НЕ ТОЛЬКО у `anchor`: любой `kind: "beach"` и
 * `kind: "street"` обязан его нести независимо от числа источников. Пляж — это
 * километр берега, и запись, описывающая линию точкой, не должна удовлетворять
 * инвариант молча только потому, что координату дал справочник.
 * Каждый ориентир перечисляет `sources` с числами, которые реально нашлись.
 * Не подтвердилось — ориентир не включается: см. `REJECTED_LANDMARK_CANDIDATES`
 * внизу файла, чтобы отклонённые кандидаты не заводились заново.
 *
 * ═══ ПРАВИЛО ДОПУСКА ФАКТУРЫ МАРШРУТА ═══
 * У координаты есть источники; у совета «машины у платформы не стоят» до
 * третьего раунда не было ничего, и именно операционные утверждения — а не
 * координаты — были на этих страницах самым слабым местом. Поэтому каждый
 * `travel.<locale>` обязан нести `basis`: на чём совет держится (неизменная
 * геометрия улиц, зона обслуживания) и чего он НЕ утверждает. Ориентир без
 * `basis` страницы не получает — `assertLandmarkDataIntegrity()` валит сборку.
 *
 * ═══ ЧТО ЗДЕСЬ ЗАПРЕЩЕНО ═══
 * • цифры расстояний, минут и часов (часы ловит и compliance-линтер);
 * • СЧИТАЕМАЯ ЧАСТОТА без источника расписания: «один рейс в сутки», «каждые
 *   двадцать минут», «последний в полночь». Здесь такое утверждение уже стояло
 *   (про приходы поезда на станцию Паттайя) и было неверным двое суток из
 *   семи. Редкость описывается качественно — «прибытия идут редкими волнами», —
 *   либо приводится источник расписания;
 * • деньги в любом виде — проезд, вход, стоимость трансфера;
 * • «в двух шагах», «рядом», «short walk» — завышенная близость;
 * • факты, которых я не проверял. Если про ориентир нечего сказать по
 *   существу, у него нет `travel` для локали — и генератор не строит страницу.
 *
 * ═══ ОБЩАЯ ТРАНСПОРТНАЯ КАНВА (проверено, лежит в основе половины маршрутов) ═══
 * Beach Road односторонняя НА ЮГ, Second Road (Pattaya Sai Song) односторонняя
 * НА СЕВЕР. Главное кольцо сонгтео идёт от круга с дельфинами на север Паттайи
 * вниз по Beach Road, у Walking Street сворачивает налево на South Pattaya Road,
 * почти сразу налево на Second Road и по ней обратно на север. Остановок нет:
 * машину останавливают рукой, выходя жмут кнопку и платят водителю. Из этого
 * следует всё остальное: «обратно тем же путём» в Паттайе не работает.
 */

/** Тип ориентира: определяет, как генератор группирует страницы. */
export type LandmarkKind = "beach" | "street" | "attraction" | "transport";

/** Насколько можно верить координате. Расшифровка — в шапке файла. */
export type CoordinateConfidence = "corroborated" | "single-source" | "anchor";

export interface CoordinateSource {
  /** Кто опубликовал число И что этот пин обозначает — второе важнее первого. */
  cite: string;
  lat: number;
  lng: number;
}

/** Чем реально добираются. `transfer` — не транспорт, а место пересадки. */
export type TravelMode = "foot" | "songthaew" | "motorbike" | "taxi" | "transfer";

export interface TravelLeg {
  mode: TravelMode;
  body: string;
}

/**
 * Фактура маршрута для одной локали. Пустых полей быть не должно: ориентир без
 * `wrongTurn` и без `dayAndEvening` не отличается от соседнего и страницы не
 * получает.
 */
export interface LandmarkTravel {
  /** Способы добраться, от самого частого к самому редкому. */
  legs: TravelLeg[];
  /** Ориентиры по пути в порядке движения — их видно из окна и с тротуара. */
  waypoints: string[];
  /** Где именно ошибаются поворотом. Одно место, а не список общих слов. */
  wrongTurn: string;
  /** Чем день отличается от вечера на ЭТОМ маршруте. */
  dayAndEvening: string;
  /**
   * НА ЧЁМ ДЕРЖИТСЯ ФАКТУРА МАРШРУТА — и чего она не утверждает.
   *
   * У координаты есть `sources` с цитатой и градация `confidence`; у совета
   * «выходите к главной дороге, машины у платформы не стоят» до этого раунда
   * не было ничего. Между тем именно операционные утверждения — расписание,
   * частота, «после темноты тут тихо» — и есть то, из-за чего страница может
   * оказаться неверной: неподтверждённое расписание в тексте того же класса
   * риска, что неподтверждённые часы работы.
   *
   * Правило, которое это поле обслуживает: маршрутный совет опирается либо на
   * НЕИЗМЕННУЮ ГЕОМЕТРИЮ (направление односторонней улицы, где кольцо
   * разворачивается, где кончается зона обслуживания), либо на источник.
   * Числа, которые надо проверять по расписанию — сколько рейсов, во сколько
   * первый и последний, сколько стоит проезд, — в этих строках запрещены, и
   * `basis` обязан это проговорить. Ориентир без `basis` страницы не получает:
   * `assertLandmarkDataIntegrity()` в `src/lib/geo.ts` валит сборку.
   *
   * Текст пишется на языке локали: он печатается читателю в блоке
   * происхождения рядом с происхождением координаты.
   */
  basis: string;
}

export interface Landmark {
  slug: string;
  kind: LandmarkKind;
  lat: number;
  lng: number;
  confidence: CoordinateConfidence;
  /**
   * Все числа, которые реально нашлись при проверке, и что каждое обозначает.
   * Расхождение между ними НЕ хранится: его считает
   * `landmarkSourceSpreadMeters()` в `src/lib/geo.ts` — записанное руками, оно
   * разошлось бы с координатами при первой же правке.
   */
  sources: CoordinateSource[];
  /** Что координата НЕ означает. Обязателен для `anchor` и для площадных объектов. */
  caveat?: string;
  name: Record<Locale, string>;
  /** Локали, для которых фактура написана. Остальные страницу не получают. */
  travel: Partial<Record<Locale, LandmarkTravel>>;
}

/**
 * Координаты округлены до пяти знаков — точность источников (Wikipedia /
 * OpenStreetMap, ±100 м) большего не оправдывает.
 */
export const LANDMARKS: Landmark[] = [
  {
    // Северная арка Walking Street у набережной — точка, из которой человек
    // реально стартует. Wikipedia даёт для улицы 12.92545 / 100.87123, это
    // середина улицы, ~130 м юго-восточнее арки; обе точки на одной улице,
    // расхождение внутри допуска, и арка честнее: от неё длиннее.
    slug: "walking-street",
    kind: "attraction",
    lat: 12.9257,
    lng: 100.87,
    confidence: "corroborated",
    sources: [
      { cite: "English Wikipedia, «Walking Street, Pattaya» — точка улицы", lat: 12.92545, lng: 100.87123 },
      { cite: "Северная арка у набережной — стартовая точка маршрута сайта", lat: 12.9257, lng: 100.87 },
    ],
    caveat:
      "Точка — северная арка, а не середина улицы и не её южный конец у пирса: от пирса дорога длиннее на всю улицу.",
    /*
     * Единственный ориентир набора, у которого имя было латиницей на всех семи
     * локалях, — остальные двенадцать локализованы (Большой Будда, ถนนเลียบชายหาด,
     * 芭提雅步行街 и так далее). Строка отсюда печатается на каждой странице через
     * `describeLandmarkWalk()` в `ContactRail`, поэтому замер получался прямым:
     * кириллического «Уокинг» не было ни на одной из 67 русских страниц, тайского
     * «ถนนคนเดิน» — ни на одной из 30 тайских, а китайская страница доставки
     * выводила «Walking Street：800 米».
     *
     * Двойная форма «местное написание (Walking Street)» там, где латинская
     * форма сама является поисковым токеном, — тот же приём, что уже применён к
     * `terminal-21` («Terminal 21 Паттайя»). Для zh/ko/ja берётся только местная
     * форма: латиницу этот читатель в запросе не набирает.
     */
    name: {
      en: "Walking Street",
      ru: "Уокинг Стрит (Walking Street)",
      th: "ถนนคนเดินพัทยา (Walking Street)",
      ar: "شارع ووكينج (Walking Street)",
      zh: "芭提雅步行街",
      ko: "워킹스트리트",
      ja: "ウォーキングストリート",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "foot",
            body:
              "The whole trip is one decision: at the arch, turn your back on the sea and stay on the road that runs inland, South Pattaya Road, signposted locally as Pattaya Tai. Everything after that is flat and lit.",
          },
          {
            mode: "songthaew",
            body:
              "The main baht-bus loop comes down Beach Road and turns off it at exactly this corner, into South Pattaya Road, before turning again onto Second Road. If you flag one down on the beachfront you are on the correct vehicle already — press the buzzer once it has made the inland turn.",
          },
          {
            mode: "taxi",
            body:
              "A booked car cannot enter the street in the evening, so it will stop at the arch anyway. Give the driver the alley name and let the pin finish the job: a shop name will not be recognised.",
          },
        ],
        waypoints: [
          "The arch where Walking Street meets the beachfront",
          "The beachfront crossing — the sea goes behind you here",
          "South Pattaya Road (Pattaya Tai) running inland",
          "The block of numbered alleys off the main road",
        ],
        wrongTurn:
          "People keep walking beside the water, because that is the direction Walking Street itself points them in. The shop is inland. If the sea is still on your right, you are walking away from it.",
        dayAndEvening:
          "In the evening the street is closed to vehicles, so nobody is dropped inside it and the walk out to the main road is part of the trip for everyone. At midday it is open to traffic and the same distance is a hot, shadeless walk — that is when people take the baht bus for one leg.",
        basis:
          "What this route rests on is the fixed direction of the one-way pair and the point where the loop turns inland — street layout, which does not change with the hour. No service frequency, opening time or fare is claimed anywhere above, and none is relied on.",
      },
      ru: {
        legs: [
          {
            mode: "foot",
            body:
              "Весь маршрут — одно решение у арки: повернуться к морю спиной и идти вглубь по South Pattaya Road, на указателях Pattaya Tai. Дальше ровно и освещено.",
          },
          {
            mode: "songthaew",
            body:
              "Главное кольцо сонгтео спускается по Beach Road и сворачивает с неё именно на этом углу — на South Pattaya Road, а затем на Second Road. Пойманная на набережной машина уже та самая: кнопку жмут после поворота вглубь.",
          },
          {
            mode: "taxi",
            body:
              "Вечером машина на улицу не заедет и всё равно встанет у арки. Водителю называют переулок и ведут по пину: название магазина ему ничего не скажет.",
          },
        ],
        waypoints: [
          "Арка Walking Street у набережной",
          "Переход через набережную — здесь море остаётся за спиной",
          "South Pattaya Road (Pattaya Tai) вглубь от моря",
          "Квартал нумерованных переулков за главной дорогой",
        ],
        wrongTurn:
          "Идут вдоль воды, потому что туда же смотрит сама Walking Street. Магазин вглубь от моря. Если море справа — вы удаляетесь.",
        dayAndEvening:
          "Вечером улица закрыта для машин, поэтому внутрь не высаживают никого и выход к главной дороге входит в маршрут у всех. Днём по ней ездят, зато та же дорога — по солнцу и без тени: именно днём один отрезок проезжают на сонгтео.",
        basis:
          "Маршрут держится на неизменном направлении пары односторонних улиц и на точке, где кольцо уходит вглубь, — это геометрия улиц, а не расписание. Ни частоты, ни часов, ни стоимости проезда выше не утверждается и ни на чём таком совет не построен.",
      },
    },
  },
  {
    // Южный конец набережной — ближайшая к магазину точка Beach Road, и та,
    // мимо которой идёт пешеход. Сверка: точка Wikipedia для Walking Street
    // (12.92545 / 100.87123) лежит на той же линии берега в ~130 м, а точка
    // Wikidata «Pattaya Beach» (12.93194 / 100.87944) ложится на ту же дугу
    // берега севернее — координата не противоречит ни одной из них.
    slug: "beach-road",
    kind: "street",
    lat: 12.9265,
    lng: 100.8699,
    confidence: "anchor",
    sources: [
      { cite: "Южный конец набережной у арки Walking Street — точка сайта", lat: 12.9265, lng: 100.8699 },
      { cite: "English Wikipedia, «Walking Street, Pattaya» — соседняя точка той же линии берега", lat: 12.92545, lng: 100.87123 },
    ],
    caveat:
      "Beach Road тянется вдоль всей бухты. Здесь взят её южный конец: с северного, у Central Festival, дорога совсем другая.",
    name: {
      en: "Beach Road",
      ru: "Бич Роуд",
      th: "ถนนเลียบชายหาด",
      ar: "شارع الشاطئ",
      zh: "海滩路",
      ko: "비치로드",
      ja: "ビーチロード",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Beach Road is one-way southbound, so a baht bus on it can only take you south — which is the direction you want. It leaves the beachfront at the Walking Street corner and turns inland along South Pattaya Road.",
          },
          {
            mode: "foot",
            body:
              "On foot the beachfront is the easy part and the turn inland is the whole navigation problem: once you leave the sea behind, the route is a straight run along the main road and then one numbered alley.",
          },
        ],
        waypoints: [
          "The beachfront promenade and its line of trees",
          "The Walking Street corner, where the traffic turns inland",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "The return trip is where this goes wrong, not the way out: you cannot ride north on Beach Road. Coming back you have to be on Second Road, one block inland, which runs one-way the other way.",
        dayAndEvening:
          "In the evening the beachfront crawls, and the inland stretch moves faster than the seafront does. In the middle of the day the promenade has shade the inland road does not, so the sensible split is beach on foot, main road on wheels.",
        basis:
          "The advice here is about which way the street runs and where the traffic turns off it. That is layout, observed and stable. Nothing above rests on a schedule, and no time or frequency is quoted.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Beach Road односторонняя на юг, поэтому сонгтео по ней везёт только на юг — как раз куда нужно. С набережной поток уходит на углу Walking Street и дальше идёт вглубь по South Pattaya Road.",
          },
          {
            mode: "foot",
            body:
              "Пешком набережная — простая часть, а вся навигация — в повороте вглубь: дальше прямой отрезок по главной дороге и один нумерованный переулок.",
          },
        ],
        waypoints: [
          "Набережная и линия деревьев вдоль неё",
          "Угол Walking Street, где поток уходит вглубь",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "Ошибаются не по дороге сюда, а на обратной: по Beach Road на север не проехать. Возвращаются по Second Road — квартал вглубь, движение там встречное.",
        dayAndEvening:
          "Вечером набережная стоит, и отрезок вглубь идёт быстрее приморского. Днём на набережной есть тень, которой на главной дороге нет, поэтому разумное деление такое: берег пешком, главная дорога на колёсах.",
        basis:
          "Совет здесь — о том, куда идёт улица и где поток с неё сворачивает. Это планировка, наблюдаемая и постоянная. Ничто выше не опирается на расписание, и ни времени, ни частоты не названо.",
      },
    },
  },
  {
    // Южный конец Soi Buakhao, где переулок выходит на South Pattaya Road.
    // ВНИМАНИЕ: самая слабая координата набора. Wikimapia даёт для «Soi Buakhao
    // Night Market» 12.92444 / 100.88000 — это ~250 м юго-западнее. Обе точки
    // лежат на одной улице (она тянется примерно на полтора километра от South
    // Pattaya Road до Central Pattaya Road, между Second и Third Road), поэтому
    // противоречия нет, но и точностью это назвать нельзя.
    slug: "soi-buakhao",
    kind: "street",
    lat: 12.9266,
    lng: 100.8812,
    confidence: "anchor",
    sources: [
      { cite: "Южный конец улицы у South Pattaya Road — точка сайта", lat: 12.9266, lng: 100.8812 },
      { cite: "Wikimapia, «Soi Buakhao Night Market» — другая точка той же улицы", lat: 12.92444, lng: 100.88 },
    ],
    caveat:
      "Расхождение источников по этой улице больше, чем по любому другому ориентиру набора. Точка годится для «улица такая-то от магазина», но не для обещания конкретного угла; перед новой страницей её стоит перепроверить по карте на месте.",
    name: {
      en: "Soi Buakhao",
      ru: "Сой Буакхао",
      th: "ซอยบัวขาว",
      ar: "سوي بواخاو",
      zh: "Soi Buakhao",
      ko: "소이 부아카오",
      ja: "ソイ・ブアカオ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "foot",
            body:
              "Soi Buakhao runs north to south between two main roads, and only the southern end is useful here: walk down to South Pattaya Road, turn towards the sea, and the numbered alleys start after the Second Road crossing.",
          },
          {
            mode: "motorbike",
            body:
              "The soi is narrow, busy and full of parked bikes, which is exactly the traffic a motorbike taxi is good at. It is also the leg where a car is slower than a bike.",
          },
        ],
        waypoints: [
          "The southern mouth of Soi Buakhao at South Pattaya Road",
          "The Second Road crossing",
          "The numbered alleys running off the main road",
        ],
        wrongTurn:
          "Both ends of Soi Buakhao look alike from inside it, and the northern one drops you at Central Pattaya Road — a completely different main road, a long way from the alley. Fix which end you are aiming for before you start walking.",
        dayAndEvening:
          "In the evening the street fills with stalls and the pavement disappears, so people walk in the road and the whole thing slows to a shuffle. In the daytime it is an ordinary through-street and the same leg is quick, if hot.",
        basis:
          "The route rests on the shape of the street and on where it meets the road that runs west. Geometry rather than a service pattern: no frequency, no first or last vehicle, no fare.",
      },
      ru: {
        legs: [
          {
            mode: "foot",
            body:
              "Soi Buakhao идёт с севера на юг между двумя главными дорогами, и полезен здесь только южный конец: спуститься к South Pattaya Road, повернуть в сторону моря, нумерованные переулки начинаются за перекрёстком со Second Road.",
          },
          {
            mode: "motorbike",
            body:
              "Переулок узкий, плотный и заставлен байками — ровно тот трафик, в котором байк-такси выигрывает. На этом отрезке машина медленнее байка.",
          },
        ],
        waypoints: [
          "Южное устье Soi Buakhao у South Pattaya Road",
          "Перекрёсток со Second Road",
          "Нумерованные переулки за главной дорогой",
        ],
        wrongTurn:
          "Изнутри оба конца Soi Buakhao выглядят одинаково, а северный выводит на Central Pattaya Road — другую главную дорогу и совсем в стороне от переулка. Конец выбирают до того, как пошли.",
        dayAndEvening:
          "Вечером улицу занимают лотки, тротуара не остаётся, идут по проезжей части, и отрезок растягивается. Днём это обычная сквозная улица: быстро, но жарко.",
        basis:
          "Маршрут держится на форме улицы и на том, где она встречается с дорогой, идущей на запад. Это геометрия, а не режим движения: ни частоты, ни первой и последней машины, ни цены проезда.",
      },
    },
  },
  {
    slug: "central-festival",
    kind: "attraction",
    lat: 12.93444,
    lng: 100.88389,
    confidence: "single-source",
    sources: [
      {
        cite: "English Wikipedia, «CentralFestival Pattaya Beach» (12°56′04″N 100°53′02″E) — инфобокс здания",
        lat: 12.93444,
        lng: 100.88389,
      },
    ],
    name: {
      en: "Central Festival",
      ru: "Central Festival",
      th: "เซ็นทรัลเฟสติวัล พัทยาบีช",
      ar: "سنترال فيستيفال",
      zh: "尚泰海滩购物中心",
      ko: "센트럴 페스티벌",
      ja: "セントラルフェスティバル",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "The mall sits on the beachfront, and the beachfront runs one-way south — so the baht bus outside its doors is already pointed the right way. Stay on it past the hotels, and get off when it turns inland at the Walking Street corner.",
          },
          {
            mode: "transfer",
            body:
              "No transfer is needed southbound. It is the trip back that needs one: the return leg is on Second Road, a block inland, because nothing runs north along the beach.",
          },
          {
            mode: "taxi",
            body:
              "A car out of the mall queue takes the same beachfront line and gets stuck in the same evening traffic. The advantage is only at the end, in the alley.",
          },
        ],
        waypoints: [
          "The beachfront in front of the mall",
          "The long hotel frontage south of Central Pattaya Road",
          "The Walking Street corner, where the traffic turns inland",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "Crossing to Second Road at the mall and flagging something down there. Second Road runs north — that vehicle takes you further away, and the mistake is only obvious several blocks later.",
        dayAndEvening:
          "In the evening the beachfront is the slowest road in the city and the inland leg saves more time than the distance suggests. In the day the same ride is quick and the mall side of it is the only shaded part of the trip.",
        basis:
          "The route rests on which of the two central streets carries southbound traffic and where the loop turns inland. Street layout, stable and checkable on any map; no timetable, hour or fare is asserted.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Молл стоит на набережной, а набережная односторонняя на юг — сонгтео у его дверей уже смотрит куда надо. Едут мимо линии отелей и выходят, когда машина сворачивает вглубь на углу Walking Street.",
          },
          {
            mode: "transfer",
            body:
              "На юг пересадка не нужна. Она нужна обратно: назад едут по Second Road, кварталом вглубь, потому что вдоль моря на север не ходит ничего.",
          },
          {
            mode: "taxi",
            body:
              "Машина из очереди у молла идёт по той же набережной и стоит в той же вечерней пробке. Выигрыш только в конце, в переулке.",
          },
        ],
        waypoints: [
          "Набережная перед моллом",
          "Линия отелей южнее Central Pattaya Road",
          "Угол Walking Street, где поток уходит вглубь",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "Перейти у молла на Second Road и поймать машину там. Second Road идёт на север — она увозит дальше, и ошибка становится заметна через несколько кварталов.",
        dayAndEvening:
          "Вечером набережная — самая медленная дорога города, и отрезок вглубь экономит больше, чем кажется по расстоянию. Днём та же поездка быстрая, и участок у молла — единственная тень на маршруте.",
        basis:
          "Маршрут держится на том, какая из двух центральных улиц везёт на юг и где кольцо уходит вглубь. Планировка улиц, устойчивая и проверяемая по любой карте; ни расписания, ни часов, ни стоимости не утверждается.",
      },
    },
  },
  {
    // Wat Phra Yai на холме Khao Phra Tamnak — опорная точка Пратамнака.
    slug: "big-buddha",
    kind: "attraction",
    lat: 12.91694,
    lng: 100.8675,
    confidence: "single-source",
    sources: [
      {
        cite: "English Wikipedia, «Khao Phra Tamnak» (12°55′01″N 100°52′03″E) — холм, на котором стоит Wat Phra Yai",
        lat: 12.91694,
        lng: 100.8675,
      },
    ],
    caveat:
      "Координата — холм, а не ворота храма и не парковка: подъём наверх в расстояние по прямой не входит и ощущается длиннее, чем число.",
    name: {
      en: "Big Buddha Hill",
      ru: "Большой Будда",
      th: "วัดพระใหญ่",
      ar: "بوذا الكبير",
      zh: "大佛山",
      ko: "빅 붓다",
      ja: "ビッグブッダ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "motorbike",
            body:
              "This is the one route where the vehicle choice is not about time. The hill road climbs, and a motorbike taxi is what people take in the uphill direction; downhill, towards the shop, walking is realistic.",
          },
          {
            mode: "songthaew",
            body:
              "Baht buses do not loop the hill the way they loop the beachfront, so a shared ride here is a matter of catching one down on the main road rather than expecting one at the temple.",
          },
        ],
        waypoints: [
          "The temple terrace and its stairs",
          "The hill road down towards the town side",
          "South Pattaya Road (Pattaya Tai) at the bottom",
          "The numbered alleys off the main road",
        ],
        wrongTurn:
          "The hill has a road down each side, and the seaward one delivers you to the pier end rather than the town end. From the wrong side you end up walking the length of the seafront to get back to the same main road.",
        dayAndEvening:
          "The temple is a daytime destination and the descent is done in the heat, which is why the trip down feels longer than the trip up costs. After dark the hill road is poorly lit and quiet — a different proposition entirely from the lit main roads below.",
        basis:
          "The route rests on the shape of the hill road and on where the shared network does and does not run — coverage and layout, both observable. The evening advice describes a pattern, not a published last service: no time and no frequency is quoted.",
      },
      ru: {
        legs: [
          {
            mode: "motorbike",
            body:
              "Единственный маршрут набора, где транспорт выбирают не ради времени. Дорога на холм идёт в подъём, и наверх берут байк-такси; вниз, в сторону магазина, реально спуститься пешком.",
          },
          {
            mode: "songthaew",
            body:
              "Кольцо сонгтео холм не обслуживает так, как набережную: попутную машину ловят внизу, на главной дороге, а не ждут у храма.",
          },
        ],
        waypoints: [
          "Терраса храма и лестница",
          "Дорога с холма в сторону города",
          "South Pattaya Road (Pattaya Tai) внизу",
          "Нумерованные переулки за главной дорогой",
        ],
        wrongTurn:
          "С холма ведут две дороги, и приморская выводит к пирсу, а не к городу. С неправильной стороны приходится идти вдоль всей набережной, чтобы выйти на ту же главную дорогу.",
        dayAndEvening:
          "Храм — дневная точка, и спуск приходится на жару: обратный путь ощущается длиннее, чем стоил подъём. После темноты дорога с холма плохо освещена и пуста — это совсем не то же самое, что освещённые главные дороги внизу.",
        basis:
          "Маршрут держится на форме дороги через холм и на том, куда общий транспорт ходит, а куда нет, — это покрытие и планировка, и то и другое наблюдаемо. Вечерний совет описывает закономерность, а не объявленный последний рейс: ни времени, ни частоты здесь не названо.",
      },
    },
  },
  {
    slug: "jomtien-beach",
    kind: "beach",
    lat: 12.89583,
    lng: 100.87306,
    confidence: "single-source",
    sources: [
      {
        cite: "English Wikipedia, «Jomtien Beach» (12°53′45″N 100°52′23″E) — точка пляжа",
        lat: 12.89583,
        lng: 100.87306,
      },
    ],
    caveat: "Пляж длинный; координата — его опорная точка, а не конкретный вход с Beach Road Jomtien.",
    name: {
      en: "Jomtien Beach",
      ru: "Пляж Джомтьен",
      th: "หาดจอมเทียน",
      ar: "شاطئ جومتين",
      zh: "乔木提恩海滩",
      ko: "좀티엔 해변",
      ja: "ジョムティエンビーチ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Jomtien has its own baht-bus line, not the beachfront loop. Those vehicles carry a white band along the body and run over the hill road, Thappraya, past the Jomtien bus station and down to the beach.",
          },
          {
            mode: "transfer",
            body:
              "The Jomtien line starts and ends at the Second Road corner of South Pattaya Road, which is where this trip has its one transfer: you arrive at that corner and finish the last stretch towards the sea on foot or on a second vehicle.",
          },
          {
            mode: "taxi",
            body:
              "A booked car takes the same hill road and skips the transfer, which is the whole of its advantage here — the corner is the part of the trip people get wrong.",
          },
        ],
        waypoints: [
          "Jomtien beachfront",
          "Thappraya Road over the hill",
          "The Jomtien bus station on the way up",
          "The Second Road corner at South Pattaya Road — the transfer point",
        ],
        wrongTurn:
          "Getting into a beachfront-loop vehicle in Pattaya expecting it to continue to Jomtien. It does not: the loop turns inland at Walking Street and heads back north, and the Jomtien line is a separate one you pick up at the corner.",
        dayAndEvening:
          "In the daytime this is a beach-day trip and the hill road moves. In the evening the Jomtien line thins out well before the beachfront loop does, so the last leg back is the one to plan for rather than assume.",
        basis:
          "The route rests on Jomtien having a line of its own rather than a continuation of the beachfront loop, and on the corner where the two meet. No frequency, first or last vehicle, or fare is claimed.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "У Джомтьена своя линия сонгтео, не приморское кольцо. У этих машин белая полоса по борту, идут они через холм по Thappraya, мимо автостанции Джомтьена и вниз к пляжу.",
          },
          {
            mode: "transfer",
            body:
              "Линия Джомтьена начинается и заканчивается на углу Second Road и South Pattaya Road — здесь у маршрута единственная пересадка: до угла едут, остаток в сторону моря идут пешком или добирают второй машиной.",
          },
          {
            mode: "taxi",
            body:
              "Заказанная машина идёт той же дорогой через холм и снимает пересадку — в этом весь её смысл здесь, потому что именно на углу и ошибаются.",
          },
        ],
        waypoints: [
          "Набережная Джомтьена",
          "Thappraya Road через холм",
          "Автостанция Джомтьена по пути наверх",
          "Угол Second Road и South Pattaya Road — точка пересадки",
        ],
        wrongTurn:
          "Сесть в Паттайе в машину приморского кольца в расчёте, что она поедет в Джомтьен. Не поедет: кольцо сворачивает вглубь у Walking Street и возвращается на север, а линия Джомтьена — отдельная, её берут на углу.",
        dayAndEvening:
          "Днём это поездка на пляж, и дорога через холм едет. Вечером линия Джомтьена редеет заметно раньше приморского кольца, поэтому обратный отрезок планируют, а не рассчитывают на него.",
        basis:
          "Маршрут держится на том, что у Джомтьена своя линия, а не продолжение приморского кольца, и на углу, где они встречаются. Ни частоты, ни первой и последней машины, ни стоимости проезда не утверждается.",
      },
    },
  },
  {
    // Wong Amat — опорная точка Наклыа.
    slug: "wong-amat-beach",
    kind: "beach",
    lat: 12.96,
    lng: 100.88472,
    confidence: "single-source",
    sources: [
      {
        cite: "English Wikipedia, «Wong Amat Beach» (12°57′36″N 100°53′05″E) — точка пляжа на полуострове Наклыа",
        lat: 12.96,
        lng: 100.88472,
      },
    ],
    caveat:
      "Пляж тянется вдоль мыса Наклыа примерно на километр; координата — его опорная точка, а не конкретный спуск и не отельный фасад.",
    name: {
      en: "Wong Amat Beach",
      ru: "Пляж Вонгамат",
      th: "หาดวงศ์อมาตย์",
      ar: "شاطئ ونغ أمات",
      zh: "翁阿玛海滩",
      ko: "웡아맛 해변",
      ja: "ウォンアマットビーチ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Naklua is served by vehicles that continue north past the roundabout at the top of Second Road rather than turning back with the loop. Southbound, you are doing that in reverse: you ride down to the roundabout and change onto the beachfront run.",
          },
          {
            mode: "transfer",
            body:
              "The roundabout at the north end is the transfer, and it is the only one on this route. Past it the beachfront loop takes over and runs south without another change.",
          },
          {
            mode: "taxi",
            body:
              "A car does the whole thing in one piece, which matters more here than anywhere else on this list, because the Naklua end is where shared vehicles are least frequent.",
          },
        ],
        waypoints: [
          "The Naklua headland and its side sois",
          "The roundabout at the north end of Second Road — the transfer",
          "The beachfront run south past the malls",
          "The Walking Street corner, where the traffic turns inland",
        ],
        wrongTurn:
          "Staying on a northbound vehicle past the roundabout on the way back. Everything on that side of the roundabout is heading away from the shop, and the further north you go the thinner the return traffic gets.",
        dayAndEvening:
          "In the day this is a long but simple ride with one change. In the evening the change is the risk: the beachfront leg keeps running longer, while the Naklua leg does not, so the direction that fails is the one back out of Naklua.",
        basis:
          "The route rests on where the beachfront loop turns back and on which side of that junction is served by which traffic. The thinning described for the evening is a pattern reported as a pattern: no last service and no frequency is quoted, because none was verified.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Наклыа обслуживают машины, которые уходят на север дальше круга в конце Second Road, а не разворачиваются вместе с кольцом. На юг это делают в обратном порядке: спускаются к кругу и пересаживаются на приморский ход.",
          },
          {
            mode: "transfer",
            body:
              "Круг на северном конце — та самая пересадка, единственная на маршруте. За ним начинается приморское кольцо и везёт на юг уже без смены машины.",
          },
          {
            mode: "taxi",
            body:
              "Машина проходит весь путь целиком, и здесь это важнее, чем на любом другом маршруте набора: именно на стороне Наклыа попутных машин меньше всего.",
          },
        ],
        waypoints: [
          "Мыс Наклыа и его боковые сои",
          "Круг в северном конце Second Road — пересадка",
          "Приморский ход на юг мимо моллов",
          "Угол Walking Street, где поток уходит вглубь",
        ],
        wrongTurn:
          "На обратном пути остаться в машине, идущей на север мимо круга. Всё, что за кругом, увозит от магазина, и чем дальше на север, тем реже обратный поток.",
        dayAndEvening:
          "Днём это длинная, но простая поездка с одной пересадкой. Вечером риск как раз в пересадке: приморский отрезок ходит дольше, а отрезок Наклыа нет, и подводит направление из Наклыа, а не в неё.",
        basis:
          "Маршрут держится на том, где приморское кольцо разворачивается и какой поток обслуживает какую сторону этого узла. Вечернее «редеет» описано именно как закономерность: ни последнего рейса, ни частоты не названо, потому что ни то ни другое не подтверждалось.",
      },
    },
  },
  {
    // Здание молла на углу North Pattaya Road и Second Road, у круга с
    // дельфинами. Два источника карт сходятся: 12.94963/100.89044 (OpenStreetMap
    // через mapcarta, контур здания) и 12.94984/100.88969 — расхождение ~80 м.
    // Третий источник (страница отеля) даёт 12.9496/100.8870, это ~370 м
    // западнее и, судя по всему, фасад со стороны Second Road; в набор он не
    // принят, но записан здесь, чтобы никто не «поправил» координату по нему.
    // Косвенная сверка: Central Marina, стоящая на той же Second Road южнее,
    // имеет по Wikipedia долготу 100.89028 — то есть линия улицы проходит
    // именно там, где стоят принятые точки, а не там, где третья.
    slug: "terminal-21",
    kind: "attraction",
    lat: 12.9497,
    lng: 100.8901,
    confidence: "corroborated",
    sources: [
      { cite: "OpenStreetMap через mapcarta (way W651015521) — контур здания молла", lat: 12.94963, lng: 100.89044 },
      { cite: "Справочник координат по адресу молла на North Pattaya Road", lat: 12.94984, lng: 100.88969 },
    ],
    caveat:
      "Отклонённый третий источник даёт долготу 100.8870 (≈370 м западнее). Координата — здание, а не вход: у молла их несколько, и они выходят на разные улицы.",
    name: {
      en: "Terminal 21 Pattaya",
      ru: "Terminal 21 Паттайя",
      th: "เทอร์มินอล 21 พัทยา",
      ar: "تيرمينال 21 باتايا",
      zh: "Terminal 21 芭堤雅",
      ko: "터미널 21 파타야",
      ja: "ターミナル21 パタヤ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "The mall stands at the corner of North Pattaya Road and Second Road, beside the roundabout where the beachfront loop begins. That is convenient in one direction only: you want the loop at the start of its run, which means getting across to the beachfront rather than boarding on Second Road.",
          },
          {
            mode: "foot",
            body:
              "The walk from the mall doors across to the beachfront is the part nobody plans for, and it is the part that decides whether the rest of the trip is one vehicle or two.",
          },
          {
            mode: "taxi",
            body:
              "From the mall rank a car runs the beachfront line like everything else and hits the same evening queue; the alley at the far end is where it earns its place.",
          },
        ],
        waypoints: [
          "The roundabout at the top of Second Road",
          "North Pattaya Road down to the beachfront",
          "The beachfront run south past the malls",
          "The Walking Street corner, where the traffic turns inland",
        ],
        wrongTurn:
          "Boarding on Second Road outside the mall. Second Road is one-way northbound, so that vehicle leaves the city centre behind — the correct start is on the beachfront, one street over.",
        dayAndEvening:
          "By day the mall is the coolest place on the route and the trip is worth breaking there. In the evening the roundabout is the busiest junction in the north of town, and the loop moves better than anything trying to cross it.",
        basis:
          "The route rests on the direction of the two central one-way streets and on the junction where the loop starts its run south. Street layout, not a service pattern; no departure time, frequency or fare appears above.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Молл стоит на углу North Pattaya Road и Second Road, у круга, с которого начинается приморское кольцо. Удобно это только в одну сторону: кольцо нужно ловить в начале хода, то есть перейти к набережной, а не садиться на Second Road.",
          },
          {
            mode: "foot",
            body:
              "Переход от дверей молла к набережной — то, что не закладывают в маршрут, и именно он решает, будет дорога на одной машине или на двух.",
          },
          {
            mode: "taxi",
            body:
              "Со стоянки у молла машина идёт по той же приморской линии и встаёт в ту же вечернюю очередь; своё она отрабатывает в переулке на другом конце.",
          },
        ],
        waypoints: [
          "Круг в начале Second Road",
          "North Pattaya Road вниз к набережной",
          "Приморский ход на юг мимо моллов",
          "Угол Walking Street, где поток уходит вглубь",
        ],
        wrongTurn:
          "Сесть на Second Road у дверей молла. Second Road односторонняя на север, и такая машина увозит из центра — садиться надо на набережной, улицей западнее.",
        dayAndEvening:
          "Днём молл — самое прохладное место маршрута, и поездку разумно разбить на нём. Вечером круг рядом — самый загруженный узел севера города, и кольцо едет лучше, чем всё, что пытается этот круг пересечь.",
        basis:
          "Маршрут держится на направлении двух центральных односторонних улиц и на узле, с которого кольцо начинает ход на юг. Это планировка, а не режим движения: ни времени отправления, ни частоты, ни стоимости выше нет.",
      },
    },
  },
  {
    slug: "central-marina",
    kind: "attraction",
    lat: 12.94556,
    lng: 100.89028,
    confidence: "single-source",
    sources: [
      {
        cite: "English Wikipedia, «Central Marina» (12°56′44″N 100°53′25″E) — инфобокс комплекса на Pattaya Sai 2",
        lat: 12.94556,
        lng: 100.89028,
      },
    ],
    name: {
      en: "Central Marina",
      ru: "Central Marina",
      th: "เซ็นทรัล มารีนา",
      ar: "سنترال مارينا",
      zh: "Central Marina",
      ko: "센트럴 마리나",
      ja: "セントラルマリーナ",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "foot",
            body:
              "The complex opens onto Second Road, which is the wrong-way street for this trip, so the first move on foot is across to the beachfront — one block, and it converts the whole journey into a single ride.",
          },
          {
            mode: "songthaew",
            body:
              "Once on the beachfront you are on the loop, and the loop goes exactly where you need it to: south past the malls, then inland at the Walking Street corner.",
          },
        ],
        waypoints: [
          "The open-air market frontage on Second Road",
          "The cross street to the beachfront",
          "The beachfront run south",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "Flagging a vehicle on Second Road because it is the street you walked out onto. It runs north only, and it will happily take you further from the shop while looking like progress.",
        dayAndEvening:
          "By day the cinema-and-market end of the complex is busy and vehicles queue at its exits, so the crossing to the beachfront is faster than waiting. In the evening the market outside spills over the pavement, which is the part of the walk that slows down, not the road.",
        basis:
          "The route rests on which street the complex fronts and which way that street runs — one fact, checkable on any map. Nothing above rests on a timetable, and none is quoted.",
      },
      ru: {
        legs: [
          {
            mode: "foot",
            body:
              "Комплекс выходит на Second Road — улицу «не в ту сторону» для этой поездки, поэтому первый шаг пешком: перейти к набережной. Один квартал, и вся дорога превращается в одну машину.",
          },
          {
            mode: "songthaew",
            body:
              "На набережной вы уже на кольце, а кольцо идёт ровно туда: на юг мимо моллов и вглубь на углу Walking Street.",
          },
        ],
        waypoints: [
          "Рыночный фронт комплекса на Second Road",
          "Поперечная улица к набережной",
          "Приморский ход на юг",
          "South Pattaya Road (Pattaya Tai)",
        ],
        wrongTurn:
          "Поймать машину на Second Road просто потому, что вы вышли на неё. Она идёт только на север и увезёт дальше от магазина, выглядя при этом как движение.",
        dayAndEvening:
          "Днём у кинотеатра и рынка плотно, машины стоят на выездах, и перейти к набережной быстрее, чем ждать. Вечером рынок занимает тротуар — тормозит именно пешая часть, а не дорога.",
        basis:
          "Маршрут держится на том, на какую улицу выходит комплекс и куда эта улица идёт, — один факт, проверяемый по любой карте. Ничто выше не опирается на расписание, и расписание не приводится.",
      },
    },
  },
  {
    // Автовокзал Северной Паттайи. Два независимых источника: plus-код
    // «WWX3+M7 Pattaya City» из адреса на сайте бронирования, декодированный по
    // алгоритму Open Location Code (12.94919 / 100.90319), и справочник
    // координат по адресу 99/3 North Pattaya Road (12.94973 / 100.9034).
    // Расхождение ~65 м, оба указывают на North Pattaya Road рядом с Sukhumvit.
    slug: "north-pattaya-bus-terminal",
    kind: "transport",
    lat: 12.94946,
    lng: 100.9033,
    confidence: "corroborated",
    sources: [
      { cite: "Plus-код адреса «WWX3+M7 Pattaya City», раскрытый по Open Location Code", lat: 12.94919, lng: 100.90319 },
      { cite: "Справочник координат по адресу 99/3 North Pattaya Road", lat: 12.94973, lng: 100.9034 },
    ],
    name: {
      en: "North Pattaya Bus Terminal",
      ru: "Северный автовокзал Паттайи",
      th: "สถานีขนส่งพัทยาเหนือ",
      ar: "محطة حافلات شمال باتايا",
      zh: "北芭堤雅巴士总站",
      ko: "북파타야 버스터미널",
      ja: "北パタヤバスターミナル",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "The terminal sits out on North Pattaya Road towards the highway, well behind the strip everything else on this list belongs to. The shared way in is west along that road to the roundabout, then down onto the beachfront loop.",
          },
          {
            mode: "transfer",
            body:
              "That is one transfer, at the roundabout, and it is unavoidable on shared transport: nothing runs from the terminal to the south of town in one piece.",
          },
          {
            mode: "taxi",
            body:
              "There is a rank outside the terminal doors. A car removes the transfer and is the usual choice for anyone arriving with luggage, which is most people here.",
          },
        ],
        waypoints: [
          "The terminal forecourt with its ticket counters",
          "North Pattaya Road heading west, away from the highway",
          "The roundabout where the beachfront loop starts",
          "The beachfront run south to the Walking Street corner",
        ],
        wrongTurn:
          "Walking out of the terminal towards the highway instead of away from it. The highway side leads to long-distance traffic and nothing that helps; the town is the other way, and the mistake costs the whole width of the district.",
        dayAndEvening:
          "Arrivals cluster around the coach timetable, so the queue outside the doors is either empty or the length of a bus. In the evening the road into town is slow and the roundabout is the bottleneck; in the day the same leg is unremarkable.",
        basis:
          "The route rests on where the forecourt sits relative to the main road, and on intercity and city networks meeting at a point rather than overlapping. No coach frequency, departure time or fare is claimed.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Автовокзал стоит на North Pattaya Road в сторону шоссе — заметно позади той полосы города, к которой относится всё остальное в этом наборе. Общий транспорт идёт на запад по этой дороге до круга, а там вниз на приморское кольцо.",
          },
          {
            mode: "transfer",
            body:
              "Это одна пересадка, на круге, и на общем транспорте её не обойти: цельного хода от автовокзала на юг города нет.",
          },
          {
            mode: "taxi",
            body:
              "У дверей вокзала есть стоянка. Машина снимает пересадку и обычно выигрывает у тех, кто приехал с багажом, — а здесь это почти все.",
          },
        ],
        waypoints: [
          "Площадка вокзала с кассами",
          "North Pattaya Road на запад, прочь от шоссе",
          "Круг, с которого начинается приморское кольцо",
          "Приморский ход на юг до угла Walking Street",
        ],
        wrongTurn:
          "Выйти с вокзала в сторону шоссе, а не от него. Со стороны шоссе только междугородний поток и ничего полезного; город в другую сторону, и ошибка стоит целого района.",
        dayAndEvening:
          "Приезды привязаны к расписанию автобусов, поэтому у дверей либо пусто, либо очередь размером с автобус. Вечером дорога в город медленная и узкое место — круг; днём тот же отрезок ничем не примечателен.",
        basis:
          "Маршрут держится на том, как площадка расположена относительно главной дороги, и на том, что междугородняя и городская сети встречаются в узле, а не накладываются. Ни частоты автобусов, ни времени отправления, ни стоимости не утверждается.",
      },
    },
  },
  {
    // ОСТОРОЖНО: единственный числовой источник — Wikidata (Q13021757).
    // Независимого второго числа найти не удалось. Качественная сверка не
    // противоречит: станция описана как стоящая севернее пересечения Sukhumvit
    // с Central Pattaya Road и примерно в трёх километрах к востоку от центра —
    // ровно там, куда попадает эта точка. Для страницы с километрами этого
    // достаточно, для обещания конкретного выхода — нет.
    slug: "pattaya-railway-station",
    kind: "transport",
    lat: 12.94028,
    lng: 100.90917,
    confidence: "single-source",
    sources: [
      { cite: "Wikidata Q13021757, «Pattaya Railway Station» (12°56′25″N 100°54′33″E)", lat: 12.94028, lng: 100.90917 },
    ],
    caveat:
      "Одно число из одного справочника. Годится для расстояния в километрах и не годится для указаний вроде «выход в такую-то сторону».",
    name: {
      en: "Pattaya Railway Station",
      ru: "Ж/д станция Паттайя",
      th: "สถานีรถไฟพัทยา",
      ar: "محطة قطار باتايا",
      zh: "芭堤雅火车站",
      ko: "파타야 기차역",
      ja: "パタヤ駅",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "The station is out east by the highway, on the far side of the town from the sea, and the sensible move is west along the main road towards the beach until you meet the loop.",
          },
          {
            mode: "transfer",
            body:
              "One change, and where you make it depends on which main road you walked out to: the beachfront loop is the piece that finishes the job, and you have to reach it first.",
          },
          {
            mode: "taxi",
            body:
              "Arrivals here are thin — they come in occasional bursts rather than continuously — so shared vehicles do not wait at the station the way they wait at the coach terminal. A car booked before arrival is the reliable version.",
          },
        ],
        waypoints: [
          "The single platform and the forecourt",
          "The highway side of town",
          "The main road west towards the sea",
          "The beachfront loop and its turn inland at Walking Street",
        ],
        wrongTurn:
          "Waiting at the station for a shared vehicle that does not come. The traffic is on the main roads, not at the platform, and the walk out to one of them is part of the trip.",
        dayAndEvening:
          "Because the timetable is thin, the whole route is governed by when the train lands rather than by traffic. If that is after dark, the walk out to the main road is the part to plan, since this side of town has none of the beachfront's lighting or crowds.",
        basis:
          "The route rests on where the station sits relative to the city's shared-transport network, and on the fact that a stop with thin arrivals does not hold a standing rank of vehicles. NO TIMETABLE IS QUOTED and none is relied on: this page names no number of trains, no arrival time and no frequency, because no timetable source was verified for it.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Станция стоит на востоке у шоссе, по другую сторону города от моря, и разумный ход — на запад по главной дороге в сторону пляжа, пока не выйдете на кольцо.",
          },
          {
            mode: "transfer",
            body:
              "Одна пересадка, а где именно — зависит от того, на какую главную дорогу вы вышли: работу доделывает приморское кольцо, и до него ещё надо добраться.",
          },
          {
            mode: "taxi",
            body:
              "Прибытий тут мало, и идут они редкими волнами, а не потоком, — поэтому попутные машины у станции не стоят так, как у автовокзала. Надёжный вариант — машина, заказанная заранее.",
          },
        ],
        waypoints: [
          "Единственная платформа и привокзальная площадка",
          "Сторона города у шоссе",
          "Главная дорога на запад, к морю",
          "Приморское кольцо и его поворот вглубь у Walking Street",
        ],
        wrongTurn:
          "Ждать попутную машину на самой станции. Поток идёт по главным дорогам, а не у платформы, и выход к одной из них — часть маршрута.",
        dayAndEvening:
          "Расписание редкое, поэтому маршрут диктует не трафик, а время прибытия поезда. Если оно уже в темноте, планировать надо выход к главной дороге: на этой стороне города нет ни освещения набережной, ни её людей.",
        basis:
          "Маршрут держится на том, как станция расположена относительно городской сети общего транспорта, и на том, что у точки с редкими прибытиями не образуется стоянки машин. РАСПИСАНИЕ НЕ ПРИВОДИТСЯ И НЕ ИСПОЛЬЗУЕТСЯ: ни числа поездов, ни времени прибытия, ни частоты здесь не названо — источник расписания не проверялся.",
      },
    },
  },
  {
    // Контрольная точка аэродрома VTBU (aerodrome reference point), а не
    // терминал: у аэродрома это официальная опубликованная координата.
    slug: "u-tapao-airport",
    kind: "transport",
    lat: 12.67972,
    lng: 101.005,
    // Оба справочника печатают ОДНУ И ТУ ЖЕ официальную контрольную точку
    // аэродрома, поэтому независимыми источниками они не являются — отсюда
    // `single-source`, хотя цитат две.
    confidence: "single-source",
    sources: [
      { cite: "English Wikipedia, «U-Tapao International Airport» (12°40′47″N 101°00′18″E)", lat: 12.67972, lng: 101.005 },
      { cite: "SkyVector, аэродром VTBU — та же официальная контрольная точка", lat: 12.67972, lng: 101.005 },
    ],
    caveat:
      "Это контрольная точка аэродрома, то есть лётное поле, а не двери пассажирского терминала — они отстоят от неё на собственное расстояние.",
    name: {
      en: "U-Tapao Airport",
      ru: "Аэропорт У-Тапао",
      th: "ท่าอากาศยานอู่ตะเภา",
      ar: "مطار أوتاباو",
      zh: "乌塔堡机场",
      ko: "우타파오 공항",
      ja: "ウタパオ空港",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "taxi",
            body:
              "This is the one arrival on the list where shared transport is not the question. The airport sits well down the coast to the south-east, outside the town's baht-bus world entirely, and the trip is a road transfer.",
          },
          {
            mode: "transfer",
            body:
              "Whatever brings you in stops on a main road, not in the alley. The last piece is the same as for everyone else: the numbered alley off the main road, reached with the pin rather than by shop name.",
          },
        ],
        waypoints: [
          "The terminal and its access road",
          "The coastal highway north-west towards town",
          "The southern approach into Pattaya",
          "The numbered alleys off the main road",
        ],
        wrongTurn:
          "Treating this as a city trip. It is an intercity one, and the mistake people make is at the end rather than the start — being set down on the main road and then walking the wrong way along it, because the alleys look alike from the outside.",
        dayAndEvening:
          "By day the road is straightforward and the traffic is outside town. Late flights land into a quiet road and a town where the shared vehicles have thinned, so the arrival hour decides the plan more than the distance does.",
        basis:
          "The route rests on the airfield lying outside the city's shared-transport network, which makes the trip a road transfer rather than a boarding decision. No flight schedule, transfer frequency or fare is claimed.",
      },
      ru: {
        legs: [
          {
            mode: "taxi",
            body:
              "Единственное прибытие в наборе, где вопрос об общем транспорте не стоит. Аэропорт лежит далеко на юго-востоке по побережью, вне мира городских сонгтео, и дорога сюда — трансфер по шоссе.",
          },
          {
            mode: "transfer",
            body:
              "Что бы вас ни привезло, оно остановится на главной дороге, а не в переулке. Последний кусок такой же, как у всех: нумерованный переулок за главной дорогой, по пину, а не по названию магазина.",
          },
        ],
        waypoints: [
          "Терминал и подъездная дорога",
          "Прибрежное шоссе на северо-запад, к городу",
          "Южный въезд в Паттайю",
          "Нумерованные переулки за главной дорогой",
        ],
        wrongTurn:
          "Считать это городской поездкой. Она междугородняя, и ошибаются здесь в конце, а не в начале: высадят на главной дороге, а дальше идут вдоль неё не в ту сторону, потому что снаружи переулки похожи один на другой.",
        dayAndEvening:
          "Днём дорога простая, и пробки остаются за городом. Поздний рейс приходит в пустое шоссе и в город, где попутных машин уже мало: план здесь диктует час прилёта, а не расстояние.",
        basis:
          "Маршрут держится на том, что аэродром лежит вне городской сети общего транспорта, и поэтому дорога — это трансфер по шоссе, а не выбор места посадки. Ни расписания рейсов, ни частоты трансферов, ни стоимости не утверждается.",
      },
    },
  },
  {
    slug: "sanctuary-of-truth",
    kind: "attraction",
    lat: 12.97278,
    lng: 100.88889,
    confidence: "single-source",
    sources: [
      { cite: "Wikidata Q262459, «Sanctuary of Truth» (12°58′22″N 100°53′20″E), Soi Naklua 12", lat: 12.97278, lng: 100.88889 },
    ],
    name: {
      en: "Sanctuary of Truth",
      ru: "Храм Истины",
      th: "ปราสาทสัจธรรม",
      ar: "معبد الحقيقة",
      zh: "真理寺",
      ko: "진리의 성전",
      ja: "サンクチュアリ・オブ・トゥルース",
    },
    travel: {
      en: {
        legs: [
          {
            mode: "songthaew",
            body:
              "The wooden temple stands off a numbered Naklua soi at the far north of the city, past the point where the beachfront loop turns back. Getting out means first getting back to the roundabout at the top of Second Road.",
          },
          {
            mode: "transfer",
            body:
              "One change at that roundabout, then the beachfront loop south. It is the same transfer as the Naklua beaches use, and it is the only one on the route.",
          },
          {
            mode: "motorbike",
            body:
              "The Naklua sois are narrow and the walk out of them to the main road is longer than it looks on a map, which is why the first leg is often done on two wheels rather than on foot.",
          },
        ],
        waypoints: [
          "The temple grounds on the shoreline",
          "The numbered Naklua soi out to the main road",
          "The roundabout at the top of Second Road — the transfer",
          "The beachfront run south past the malls",
        ],
        wrongTurn:
          "Coming out of the soi and turning north because the main road looks the same in both directions. North of here the city thins out fast, and the return traffic thins with it.",
        dayAndEvening:
          "The temple closes for the day well before the town gets going, so this route is walked in daylight in one direction and after dark in the other. The northern leg is the one that empties out first, and it empties before the beachfront does.",
        basis:
          "The route rests on the temple standing beyond the turning point of the loop and on the layout of the numbered sois. That the visit ends before the town's evening is stated without an hour on purpose: no opening or closing time is quoted, because none was verified.",
      },
      ru: {
        legs: [
          {
            mode: "songthaew",
            body:
              "Деревянный храм стоит в стороне от одной из нумерованных сой Наклыа, на самом севере города — за той точкой, где приморское кольцо разворачивается. Выбраться означает сперва вернуться к кругу в начале Second Road.",
          },
          {
            mode: "transfer",
            body:
              "Одна пересадка на этом круге, дальше приморское кольцо на юг. Та же пересадка, что у пляжей Наклыа, и единственная на маршруте.",
          },
          {
            mode: "motorbike",
            body:
              "Сои Наклыа узкие, и выход из них к главной дороге длиннее, чем кажется по карте: первый отрезок чаще проезжают на двух колёсах, чем проходят.",
          },
        ],
        waypoints: [
          "Территория храма у воды",
          "Нумерованная соя Наклыа до главной дороги",
          "Круг в начале Second Road — пересадка",
          "Приморский ход на юг мимо моллов",
        ],
        wrongTurn:
          "Выйти из сои и повернуть на север, потому что главная дорога выглядит одинаково в обе стороны. Севернее город быстро редеет, а вместе с ним редеет и обратный поток.",
        dayAndEvening:
          "Храм закрывается задолго до того, как город оживает, поэтому маршрут проходят при свете в одну сторону и в темноте в другую. Северный отрезок пустеет первым — раньше, чем приморский.",
        basis:
          "Маршрут держится на том, что храм стоит за точкой разворота кольца, и на планировке нумерованных сой. То, что визит заканчивается раньше городского вечера, сказано намеренно без часа: ни времени открытия, ни времени закрытия здесь не приводится — они не подтверждались.",
      },
    },
  },
];

/**
 * ОТКЛОНЁННЫЕ КАНДИДАТЫ.
 *
 * Список нужен, чтобы отклонённый ориентир не завели заново «на всякий случай»
 * через полгода. Каждая строка — то, что реально нашлось при проверке.
 */
export interface RejectedLandmarkCandidate {
  name: string;
  reason: string;
}

export const REJECTED_LANDMARK_CANDIDATES: readonly RejectedLandmarkCandidate[] = Object.freeze([
  {
    name: "Bali Hai Pier",
    reason:
      "Источники разошлись больше чем на километр: 12.9174/100.8784 против 12.9260181/100.8677544, причём вторая точка ложится в воду у северного конца Walking Street, а пирс — у южного. Пирс длинный, но такое расхождение объясняется не длиной, а ошибкой в одном из справочников.",
  },
  {
    name: "Mike Shopping Mall",
    reason:
      "Одно число (12.9321313/100.8803911) и при этом два разных здания под одним именем: адрес указывает на Second Road, а описание — на набережную южнее Central Pattaya Road. Неясно, к какому из них относится координата.",
  },
  {
    name: "Tukcom (Tuk Com IT Center)",
    reason:
      "Одно число (12.92393/100.8787114), и оно противоречит словесному описанию из другого источника, помещающему здание напротив пересечения South Pattaya Road с Soi Buakhao. Ориентир близкий, поэтому цена ошибки максимальная: включать нельзя.",
  },
  {
    name: "Art in Paradise Pattaya",
    reason: "Адрес (78/34 Moo 9, Pattaya Sai 2) есть, координат нет ни в одном источнике.",
  },
  {
    name: "Pattaya Floating Market",
    reason: "Ни одного числа. Известно только «на Sukhumvit южнее города» — этого мало.",
  },
  {
    name: "Cosy Beach / Pratamnak Beach",
    reason:
      "Отдельных координат нет; всё сводится к точке холма Khao Phra Tamnak, которая уже в наборе как `big-buddha`.",
  },
  {
    name: "Naklua Beach",
    reason:
      "Собственной координаты нет — источники дают вместо неё соседний Wong Amat, который в наборе есть.",
  },
  {
    name: "Soi LK Metro",
    reason:
      "Координат нет. Найденный plus-код относился к району Soi Buakhao вообще, а не к этому кварталу.",
  },
  {
    name: "Second Road, Thappraya Road",
    reason:
      "Линейные объекты без опорной точки: справочники не публикуют координату улицы, а выбирать её самому — это и есть выдуманное расстояние. Обе улицы упоминаются словами в маршрутах, где они реально нужны.",
  },
  {
    name: "Royal Garden Plaza, Tiffany's Show",
    reason: "Адреса есть, координат нет.",
  },
  {
    name: "Jomtien Night Market",
    reason:
      "Два согласованных числа есть (12.89174/100.8746 и 12.8915139/100.8742024), но в источниках его путают с рынком на Thepprasit Road — это разные места. К тому же точка почти совпадает с уже имеющимся `jomtien-beach`.",
  },
]);

/** Ориентир, у которого есть фактура маршрута для этой локали. */
export function hasRouteFacts(landmark: Landmark, locale: Locale): boolean {
  return Boolean(landmark.travel[locale]);
}

/** Слаги, готовые для генератора гео-страниц на этой локали. */
export function landmarkSlugsWithRoutes(locale: Locale): string[] {
  return LANDMARKS.filter((landmark) => hasRouteFacts(landmark, locale)).map((landmark) => landmark.slug);
}
