export const CONTACT = {
  phoneIntl: "+66660806784",
  phoneDisplay: "+66 66 080 6784",
  whatsapp: "https://wa.me/66660806784",
  whatsappWithMsg: (msg: string) =>
    `https://wa.me/66660806784?text=${encodeURIComponent(msg)}`,
  telegram: "https://t.me/+66660806784",
  line: "https://line.me/R/ti/p/660806784",
  tel: "tel:+66660806784",
  /*
   * Channel switches. Telegram is ON as of 2026-08-31, LINE stays OFF.
   *
   * The owner confirmed both accounts exist on this same phone number, then
   * opened the Telegram link and reported that it lands in the app on the right
   * account. That settles Telegram and it is switched on. The same claim about
   * LINE does not survive a test, and the difference is worth writing down
   * because it will look identical to the next person who checks.
   *
   * TELEGRAM — ON, with one setting the owner has to keep.
   * `t.me/+<digits>` renders a real contact page: "Chat with +66 6 6080 6784"
   * with an OPEN CHAT button that hands the number to the app. What the owner's
   * own test cannot cover is the stranger case: the app resolves a number only
   * while that account's "Who can find me by my phone number" is set to
   * Everybody. Change that setting later and every button on the site quietly
   * stops working, with nothing in this repository noticing.
   * One residual defect stays even so: `t.me/+<digits>` is ambiguous — Telegram
   * reads `+` as a private-invite hash first — so the SERVER-SIDE preview of the
   * link is `og:title = "Join group chat on Telegram"` with an empty
   * description. That is what people see when our link is forwarded in a
   * messenger. A @username fixes both the preview and the privacy dependency,
   * and is the thing to ask for next.
   *
   * LINE — ON at the owner's instruction, on the same phone number.
   * The number in the path is the national form of the shop's phone: the URL is
   * `line.me/R/ti/p/660806784` and the phone is +66 66 080 6784.
   *
   * What was argued against it, and what that argument was actually worth. The
   * documented shapes for this endpoint are `~<lineId>`, `@<officialAccount>`
   * and the `lin.ee/XXXX` short link, so a bare national number is not a shape
   * LINE documents. The supporting measurement offered on 2026-08-31 — "the
   * desktop page draws the same screen for our token, for
   * `zzzz-not-a-real-line-id-9999` and for `~labscannabis`" — was WRONG, and it
   * is worth recording why: the comparison read the QR image's base64 truncated
   * to 160 characters, which is the PNG header and nothing else. Compared in
   * full, the images differ per token (674 / 962 / 854 / 878 bytes, all
   * different hashes), so the page does encode the token it was given. The
   * visible TEXT is identical for any token; the QR is not. That kills the
   * "proves nothing" claim, and with it the case for keeping the channel off
   * against the owner's own test on a real phone.
   *
   * What still cannot be checked from here: whether LINE resolves that token to
   * the account. Desktop never validates it, and no request from this machine
   * can — only a phone that does NOT already have the shop saved as a contact.
   * If it turns out dead, this is one word: `lineEnabled: false`.
   *
   * A button that lands on an error costs more than a missing channel — it
   * spends the click the whole page was built to earn — which is why the
   * verification above is worth doing rather than assuming either way.
   */
  lineEnabled: true as boolean,
  telegramEnabled: true as boolean,
} as const;

/**
 * У заведения два действующих названия, а не старое и новое. На вывеске и в
 * карточке Google стоит LABS DISPENSARY — под ним магазин знают годами, и
 * брендовый спрос идёт в основном на него. Labs Cannabis — название сайта.
 * Ни одно из двух не называть бывшим: формулировка «ранее» обесценивает
 * узнаваемое имя и уводит брендовый запрос к однофамильцам.
 */
export const BRAND = {
  name: "Labs Cannabis",
  listingName: "LABS DISPENSARY",
  domain: "labscannabis.boutique",
} as const;

export const GOOGLE = {
  listingName: "LABS DISPENSARY",
  listingUrl: "https://www.google.com/maps?cid=4889555016312011855",
  placeId: "ChIJLTR5b56XAjERT7wBoWEw20M",
} as const;

export const ADDRESS = {
  street: "32 Pattaya 13 Alley",
  locality: "Pattaya",
  region: "Chon Buri",
  postalCode: "20150",
  country: "TH",
  lat: 12.9233467,
  lng: 100.8771557,
} as const;

/**
 * Orientation only — "near Soi Hollywood", in body copy.
 * Never a streetAddress and never part of a NAP record: the shop trades as
 * LABS DISPENSARY at `ADDRESS`, and the Soi Hollywood variant floating around
 * the cached copy is exactly the mismatch that lets Google merge the listing
 * with a different shop.
 */
export const ADDRESS_ALIAS = {
  nearbyLandmark: "Soi Hollywood",
} as const;

/** Opening hours, once they are confirmed. `opens`/`closes` are "HH:MM" in `tz`. */
export interface OpeningHours {
  opens: string;
  closes: string;
  /** true when `closes` falls on the next calendar day (e.g. 12:00 → 01:00). */
  spansMidnight: boolean;
  tz: string;
}

interface OpeningHoursRecord {
  hoursVerified: boolean;
  opens: string | null;
  closes: string | null;
  spansMidnight: boolean | null;
  tz: string;
}

/**
 * ⚠️ NOT CONFIRMED BY THE OWNER — the values are deliberately empty.
 *
 * The 12:00–01:00 pair that circulates in the repository history (deleted commit
 * e68f2cf) was never verified, so it is not stored here: a visitor who reads
 * "Open now" on the site and finds a closed door loses more than a visitor who
 * reads nothing. Until the owner confirms real hours, including holidays, nothing
 * may render hours and no `openingHoursSpecification` may be emitted.
 *
 * The shape is here so the rest of the site can be built against it — consumers
 * must go through `getPublishableHours()` and handle `null`.
 */
export const HOURS: OpeningHoursRecord = {
  hoursVerified: false,
  opens: null,
  closes: null,
  spansMidnight: null,
  tz: "Asia/Bangkok",
};

/**
 * The only sanctioned way to read the hours: returns `null` while they are
 * unconfirmed or incomplete, so a component cannot print half a fact by accident.
 */
export function getPublishableHours(): OpeningHours | null {
  if (!HOURS.hoursVerified) return null;
  if (HOURS.opens === null || HOURS.closes === null || HOURS.spansMidnight === null) return null;
  return {
    opens: HOURS.opens,
    closes: HOURS.closes,
    spansMidnight: HOURS.spansMidnight,
    tz: HOURS.tz,
  };
}

interface StaffLanguagesRecord {
  staffVerified: boolean;
  /** BCP-47 tags, in the order the shop would list them. */
  tags: string[];
}

/**
 * ⚠️ NOT CONFIRMED BY THE OWNER (O-01) — the list is deliberately empty.
 *
 * The site is published in seven languages, but that is a fact about this
 * repository, not a promise about the person who answers the phone. Declaring
 * `knowsLanguage` / `availableLanguage` invites a visitor to write in Korean
 * because the markup said so; if nobody answers, the site has generated a
 * one-star review out of thin air. The field is emitted only once the owner
 * names the languages the staff actually speak.
 */
export const STAFF_LANGUAGES: StaffLanguagesRecord = {
  staffVerified: false,
  tags: [],
};

/** `null` while the staff languages are unconfirmed — see `getPublishableHours()`. */
export function getPublishableStaffLanguages(): string[] | null {
  if (!STAFF_LANGUAGES.staffVerified || STAFF_LANGUAGES.tags.length === 0) return null;
  return [...STAFF_LANGUAGES.tags];
}

/**
 * Google listing rating. Rendered visually next to a link to `source` and never
 * as schema.org `aggregateRating`: self-serving review markup earns no stars for
 * a LocalBusiness, and these are Google's numbers, not ours to certify.
 * `checkedOn` is when the listing was last read — the count drifts.
 */
export const RATING = {
  value: 4.8,
  count: 104,
  checkedOn: "2026-08-27",
  source: GOOGLE.listingUrl,
} as const;

export type TravelMode = "walking" | "driving";

/** The Google Maps listing card: name, photos, rating, reviews. */
export function getMapsSearchUrl(): string {
  return GOOGLE.listingUrl;
}

/**
 * Deep link that opens navigation to the door straight away — on mobile it hands
 * the visitor to the Google Maps app already routing, without a card in between.
 * `destination_place_id` pins the result to our listing, so the coordinates alone
 * cannot resolve to a neighbouring shop.
 */
export function getMapsDirectionsUrl(travelmode: TravelMode = "walking"): string {
  return (
    `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS.lat}%2C${ADDRESS.lng}` +
    `&destination_place_id=${GOOGLE.placeId}&travelmode=${travelmode}`
  );
}

export function getMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${ADDRESS.lat},${ADDRESS.lng}&z=18&output=embed`;
}
