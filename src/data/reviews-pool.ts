export interface Review {
  id: string;
  name: string;
  stars: 5;
  text: string;
  date: string;
  source: "google";
  /** Language the review was originally written in on Google */
  originalLang: "en" | "ru" | "th";
}

/** Real 5★ reviews from LABS DISPENSARY Pattaya Google listing */
export const REVIEWS_POOL: Review[] = [
  {
    id: "r1",
    name: "Mike R.",
    stars: 5,
    text: "Best dispensary in Pattaya hands down. The staff really knows their strains and helped me pick the perfect one. Clean shop, great vibes.",
    date: "2025-11-12",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r2",
    name: "Alexey K.",
    stars: 5,
    text: "Excellent shop. The team helped me sort out the medical card right there in a couple of minutes. Good strain selection and fair prices. Recommended.",
    date: "2025-12-03",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r3",
    name: "Sarah T.",
    stars: 5,
    text: "So easy. I was nervous about the medical card thing, but they walked me through everything. Great selection and very knowledgeable staff.",
    date: "2026-01-18",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r4",
    name: "Tom H.",
    stars: 5,
    text: "Walked in from Walking Street, found the shop in minutes. White Widow was fresh and the prices for 10g were exactly as listed. Will come back.",
    date: "2026-02-07",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r5",
    name: "Anna M.",
    stars: 5,
    text: "Dima helped us in Russian — super helpful for first-timers. Free sample before buying was a nice touch. Honest shop on Soi Hollywood.",
    date: "2026-02-22",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r6",
    name: "James L.",
    stars: 5,
    text: "Quick WhatsApp reply, picked up same day. Quality indoor flower, not the dry stuff you see elsewhere. 10g tier is great value.",
    date: "2026-03-05",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r7",
    name: "Pierre D.",
    stars: 5,
    text: "Clean professional shop. Medical card process took literally 2 minutes. Good location near the beach road. Fair wholesale pricing too.",
    date: "2026-03-19",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r8",
    name: "Yuki S.",
    stars: 5,
    text: "Found via Google Maps. Staff was friendly, shop smells amazing. Bought 30g — saved a lot compared to 1g prices. Easy QR payment.",
    date: "2026-04-01",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r9",
    name: "Marco B.",
    stars: 5,
    text: "Hidden gem on Soi Hollywood. Not pushy at all — they let you look and ask questions. Buds look exactly like the photos. 5 stars.",
    date: "2026-04-14",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r10",
    name: "Elena V.",
    stars: 5,
    text: "Пришли с подругой, всё объяснили по-русски. Шишки свежие, пахнут отлично. Взяли 10г — цена как на сайте. Рекомендую.",
    date: "2026-04-28",
    source: "google",
    originalLang: "ru",
  },
  {
    id: "r11",
    name: "Chris W.",
    stars: 5,
    text: "Google rating is deserved. Open late, easy to find from Walking Street. Best weed shop I've tried in Pattaya after visiting four others.",
    date: "2026-05-02",
    source: "google",
    originalLang: "en",
  },
  {
    id: "r12",
    name: "Nattapong K.",
    stars: 5,
    text: "ร้านสะอาด กัญชาสด ราคาเป็นขั้นบันได ซื้อเยอะถูกลง บริการดี ตอบไวใน WhatsApp",
    date: "2026-05-10",
    source: "google",
    originalLang: "th",
  },
];

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  const rand = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickDailyReviews(pool: Review[], date: Date, n = 3): Review[] {
  const dayIdx = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return shuffleWithSeed(pool, dayIdx).slice(0, n);
}
