import { ADDRESS } from "@/data/site";
import { renderCopy } from "@/data/area-copy";
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

export interface Landmark extends Coordinates {
  slug: string;
  name: Record<Locale, string>;
}

/**
 * Landmark coordinates are public reference points (Wikipedia / OpenStreetMap level
 * of precision, ±100 m), rounded to five decimals. Where a landmark is a street or a
 * beach rather than a point, the coordinate is the end nearest the shop, so the
 * resulting distance is the one a visitor experiences.
 */
export const LANDMARKS: Landmark[] = [
  {
    // North entrance, at Beach Road — where a visitor standing "on Walking Street" starts.
    slug: "walking-street",
    lat: 12.9257,
    lng: 100.87,
    name: {
      en: "Walking Street",
      ru: "Walking Street",
      th: "Walking Street",
      ar: "Walking Street",
      zh: "Walking Street",
      ko: "Walking Street",
      ja: "Walking Street",
    },
  },
  {
    // South end of Beach Road, the closest point of the beachfront to the shop.
    slug: "beach-road",
    lat: 12.9265,
    lng: 100.8699,
    name: {
      en: "Beach Road",
      ru: "Бич Роуд",
      th: "ถนนเลียบชายหาด",
      ar: "شارع الشاطئ",
      zh: "海滩路",
      ko: "비치로드",
      ja: "ビーチロード",
    },
  },
  {
    slug: "central-festival",
    lat: 12.93444,
    lng: 100.88389,
    name: {
      en: "Central Festival",
      ru: "Central Festival",
      th: "เซ็นทรัลเฟสติวัล พัทยาบีช",
      ar: "سنترال فيستيفال",
      zh: "尚泰海滩购物中心",
      ko: "센트럴 페스티벌",
      ja: "セントラルフェスティバル",
    },
  },
  {
    // Wat Phra Yai on Khao Phra Tamnak — the Pratumnak reference point.
    slug: "big-buddha",
    lat: 12.91694,
    lng: 100.8675,
    name: {
      en: "Big Buddha Hill",
      ru: "Большой Будда",
      th: "วัดพระใหญ่",
      ar: "بوذا الكبير",
      zh: "大佛山",
      ko: "빅 붓다",
      ja: "ビッグブッダ",
    },
  },
  {
    slug: "jomtien-beach",
    lat: 12.89583,
    lng: 100.87306,
    name: {
      en: "Jomtien Beach",
      ru: "Пляж Джомтьен",
      th: "หาดจอมเทียน",
      ar: "شاطئ جومتين",
      zh: "乔木提恩海滩",
      ko: "좀티엔 해변",
      ja: "ジョムティエンビーチ",
    },
  },
  {
    // Wong Amat — the Naklua reference point.
    slug: "wong-amat-beach",
    lat: 12.96,
    lng: 100.88472,
    name: {
      en: "Wong Amat Beach",
      ru: "Пляж Вонгамат",
      th: "หาดวงศ์อมาตย์",
      ar: "شاطئ ونغ أمات",
      zh: "翁阿玛海滩",
      ko: "웡아맛 해변",
      ja: "ウォンアマットビーチ",
    },
  },
];

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
