import { ADDRESS } from "@/data/site";
import { renderCopy } from "@/data/area-copy";
import { LANDMARKS } from "@/data/landmarks";
import type { Landmark } from "@/data/landmarks";
import type { Locale } from "@/lib/i18n";

/**
 * Distances from the shop to the landmarks people actually navigate by.
 *
 * Everything here is computed from coordinates, never declared. The site used to
 * promise "5 min walk from Walking Street" (`ui.location.landmark`); the shop is
 * ~800 m away, which is 10–13 minutes on foot. An overstated walk comes back as a
 * one-star review, so the rule is: if it can be calculated, it is not written by hand.
 *
 * Straight-line (haversine) distance is a lower bound — Pattaya sois are not a grid.
 * That is why walking time is reported as a range: the low end is the straight line,
 * the high end applies `STREET_DETOUR_FACTOR`.
 */

/** IUGG mean Earth radius, metres. */
const EARTH_RADIUS_M = 6_371_008.8;

/** Unhurried pace, metres per minute (~4.8 km/h) — tourists, heat, sidewalks. */
export const WALK_SPEED_M_PER_MIN = 80;

/** Straight line → real streets. Conservative: it can only make the estimate longer. */
export const STREET_DETOUR_FACTOR = 1.3;

/** Above this, nobody walks in Pattaya — quote the distance without a walking time. */
export const WALKABLE_MAX_M = 2_000;

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Ориентиры и их координаты живут в `src/data/landmarks.ts`: там же лежат
 * источник каждой координаты, оценка доверия к ней и фактура маршрута, которой
 * страница отличается от соседней. Здесь остаётся только арифметика.
 *
 * Где ориентир — улица или пляж, а не точка, координата взята с ближайшего к
 * магазину конца: расстояние должно совпадать с тем, которое человек проходит.
 */
export { LANDMARKS } from "@/data/landmarks";
export type { Landmark } from "@/data/landmarks";

export interface LandmarkWalk {
  landmark: Landmark;
  /** Straight-line distance from the shop, metres. */
  meters: number;
  /** Straight line at `WALK_SPEED_M_PER_MIN`. */
  minMinutes: number;
  /** Same distance with `STREET_DETOUR_FACTOR` applied. */
  maxMinutes: number;
  walkable: boolean;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance in metres. */
export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function distanceFromShop(point: Coordinates): number {
  return haversineMeters(ADDRESS.lat, ADDRESS.lng, point.lat, point.lng);
}

export function walkMinutes(meters: number, speed = WALK_SPEED_M_PER_MIN): number {
  return Math.max(1, Math.round(meters / speed));
}

export function getLandmark(slug: string): Landmark | undefined {
  return LANDMARKS.find((landmark) => landmark.slug === slug);
}

/** `null` for an unknown slug — a missing landmark must not turn into an invented distance. */
export function getWalkFromShop(slug: string): LandmarkWalk | null {
  const landmark = getLandmark(slug);
  if (!landmark) return null;
  const meters = distanceFromShop(landmark);
  return {
    landmark,
    meters,
    minMinutes: walkMinutes(meters),
    maxMinutes: walkMinutes(meters * STREET_DETOUR_FACTOR),
    walkable: meters <= WALKABLE_MAX_M,
  };
}

/**
 * Расхождение между всеми числами, которые нашлись по ориентиру, включая
 * принятую координату: максимальное попарное расстояние, метры.
 *
 * Считается, а не хранится, ровно по той же причине, по которой считаются
 * расстояния до магазина: записанное руками число разъедется с данными.
 */
export function landmarkSourceSpreadMeters(landmark: Landmark): number {
  const points: Coordinates[] = [{ lat: landmark.lat, lng: landmark.lng }, ...landmark.sources];
  let spread = 0;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      spread = Math.max(spread, haversineMeters(points[i].lat, points[i].lng, points[j].lat, points[j].lng));
    }
  }
  return spread;
}

/** Расхождение источников, выше которого точечный ориентир не считается проверенным. */
export const MAX_SOURCE_SPREAD_M = 150;

/**
 * ОТК набора ориентиров, срабатывающий на СБОРКЕ.
 *
 * Проверяются не тексты, а те инварианты, нарушение которых означает
 * выдуманное расстояние на странице: дубль слага, ориентир без единого
 * источника, «подтверждённая» координата с одним источником или с разбросом
 * больше допустимого, и линейный ориентир без оговорки о погрешности.
 * Линейным (`anchor`) порог разброса не применяется — у улицы нет одной
 * правильной точки, — но оговорка для них обязательна.
 *
 * Бросает при импорте: страница с непроверенной координатой не должна
 * собраться вовсе.
 */
export function assertLandmarkDataIntegrity(landmarks: readonly Landmark[] = LANDMARKS): void {
  const seen = new Set<string>();
  for (const landmark of landmarks) {
    const id = landmark.slug;
    if (!id) throw new Error("Landmark data: запись без слага");
    if (seen.has(id)) throw new Error(`Landmark data: слаг ${id} объявлен дважды`);
    seen.add(id);
    if (landmark.sources.length === 0) {
      throw new Error(`Landmark data: ${id} — координата без источника`);
    }
    const spread = landmarkSourceSpreadMeters(landmark);
    if (landmark.confidence === "corroborated") {
      if (landmark.sources.length < 2) {
        throw new Error(`Landmark data: ${id} помечен corroborated, но источник один`);
      }
      if (spread > MAX_SOURCE_SPREAD_M) {
        throw new Error(
          `Landmark data: ${id} — источники расходятся на ${Math.round(spread)} м при пороге ${MAX_SOURCE_SPREAD_M} м`,
        );
      }
    }
    if (landmark.confidence === "single-source" && spread > MAX_SOURCE_SPREAD_M) {
      throw new Error(`Landmark data: ${id} — координата отличается от своего источника на ${Math.round(spread)} м`);
    }
    if (landmark.confidence === "anchor" && !landmark.caveat) {
      throw new Error(`Landmark data: ${id} — точка на линейном объекте обязана нести caveat с погрешностью`);
    }
    /**
     * Линейный объект остаётся линейным независимо от того, сколько источников
     * дали его координату. Требование caveat висело только на `anchor`, поэтому
     * `wong-amat-beach` — километровая полоса берега — проходил проверку как
     * `single-source` вообще без оговорки: инвариант удовлетворялся записью,
     * которая описывает линию точкой. Честная оговорка была только в прозе
     * `geo-routes.ts`, и её удаление не уронило бы ни одной проверки.
     */
    /**
     * Фактура маршрута обязана называть, на чём она держится.
     *
     * У координат это `sources` с цитатой и `confidence`; у операционного
     * совета («машины у платформы не стоят», «после темноты тут тихо») до
     * третьего раунда не было ничего — а неподтверждённое расписание в тексте
     * того же класса риска, что неподтверждённые часы работы. `basis` без
     * текста — то же самое, что координата без источника.
     */
    for (const [locale, travel] of Object.entries(landmark.travel)) {
      if (!travel) continue;
      if (!travel.basis?.trim()) {
        throw new Error(
          `Landmark data: ${id}/${locale} — фактура маршрута без basis: ` +
            "operational advice must say what it rests on and what it does not claim",
        );
      }
    }
    if ((landmark.kind === "beach" || landmark.kind === "street") && !landmark.caveat) {
      throw new Error(
        `Landmark data: ${id} — ${landmark.kind} это протяжённый объект, ` +
          "у его координаты обязан быть caveat: что именно она обозначает и чего не обещает",
      );
    }
  }
}

assertLandmarkDataIntegrity();

const UNIT_METERS: Record<Locale, string> = {
  en: "m",
  ru: "м",
  th: "ม.",
  ar: "م",
  zh: "米",
  ko: "m",
  ja: "m",
};

const UNIT_KILOMETERS: Record<Locale, string> = {
  en: "km",
  ru: "км",
  th: "กม.",
  ar: "كم",
  zh: "公里",
  ko: "km",
  ja: "km",
};

/** CJK copy sets the unit tight against the number. */
const UNIT_SEPARATOR: Record<Locale, string> = {
  en: " ",
  ru: " ",
  th: " ",
  ar: " ",
  zh: "",
  ko: " ",
  ja: "",
};

const WALK_MINUTES_TEMPLATE: Record<Locale, string> = {
  en: "{min}–{max} min",
  ru: "{min}–{max} мин",
  th: "{min}–{max} นาที",
  ar: "{min}–{max} دقيقة",
  zh: "{min}–{max} 分钟",
  ko: "{min}~{max}분",
  ja: "{min}〜{max}分",
};

/**
 * The landmark name is a proper noun that has to survive seven grammars, so the
 * Russian and Chinese lines put it in front of a separator instead of after a
 * preposition ("от Пляж Джомтьен" would be broken Russian).
 */
const LANDMARK_WALK_TEMPLATE: Record<Locale, string> = {
  en: "{distance} from {landmark} · {time} on foot",
  ru: "{landmark} — {distance} · {time} пешком",
  th: "ห่างจาก {landmark} {distance} · เดิน {time}",
  ar: "{distance} من {landmark} · {time} سيرًا على الأقدام",
  zh: "{landmark}：{distance} · 步行 {time}",
  ko: "{landmark}에서 {distance} · 도보 {time}",
  ja: "{landmark}から{distance} · 徒歩{time}",
};

/** Too far to walk: distance only, no travel time we cannot vouch for. */
const LANDMARK_DISTANCE_TEMPLATE: Record<Locale, string> = {
  en: "{distance} from {landmark}",
  ru: "{landmark} — {distance}",
  th: "ห่างจาก {landmark} {distance}",
  ar: "{distance} من {landmark}",
  zh: "{landmark}：{distance}",
  ko: "{landmark}에서 {distance}",
  ja: "{landmark}から{distance}",
};

function formatNumber(value: number, locale: Locale, fractionDigits = 0): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  };
  if (locale === "ar") return value.toLocaleString("ar-EG", options);
  if (locale === "ru") return value.toLocaleString("ru-RU", options);
  return value.toLocaleString("en", options);
}

/**
 * Rounded to 50 m below a kilometre and to 100 m above it: the landmark
 * coordinates are not precise enough to justify "818 m".
 */
export function formatDistance(meters: number, locale: Locale): string {
  const separator = UNIT_SEPARATOR[locale];
  if (meters < 1000) {
    const rounded = Math.max(50, Math.round(meters / 50) * 50);
    return `${formatNumber(rounded, locale)}${separator}${UNIT_METERS[locale]}`;
  }
  const kilometers = Math.round(meters / 100) / 10;
  return `${formatNumber(kilometers, locale, 1)}${separator}${UNIT_KILOMETERS[locale]}`;
}

export function formatWalkMinutes(walk: LandmarkWalk, locale: Locale): string {
  return renderCopy(WALK_MINUTES_TEMPLATE[locale], {
    min: formatNumber(walk.minMinutes, locale),
    max: formatNumber(walk.maxMinutes, locale),
  });
}

/**
 * Ready-to-render replacement for the hand-written "5 min walk from Walking Street":
 * en → "800 m from Walking Street · 10–13 min on foot".
 * `null` for an unknown landmark, so a template renders nothing rather than a guess.
 */
export function describeLandmarkWalk(slug: string, locale: Locale): string | null {
  const walk = getWalkFromShop(slug);
  if (!walk) return null;
  const distance = formatDistance(walk.meters, locale);
  const landmark = walk.landmark.name[locale];
  if (!walk.walkable) {
    return renderCopy(LANDMARK_DISTANCE_TEMPLATE[locale], { distance, landmark });
  }
  return renderCopy(LANDMARK_WALK_TEMPLATE[locale], {
    distance,
    landmark,
    time: formatWalkMinutes(walk, locale),
  });
}
