/**
 * Directory listings of the shop — the registry behind `sameAs` (W1-13, T-08).
 *
 * `sameAs` is a claim of identity: "this business and that listing are the same
 * legal entity". The listings around Pattaya carry three different addresses and
 * two different names for what is one shop, and that mismatch is the most likely
 * reason Google keeps merging LABS DISPENSARY with a different Soi Hollywood
 * shop. Pointing `sameAs` at a listing that has not been read line by line would
 * feed the merge rather than fix it.
 *
 * Hence the two gates. A row reaches the markup only when it is BOTH
 * `status: "claimed"` (the owner controls the listing and can correct it) AND
 * `napVerified: true` (name, address and phone on that page match `ADDRESS` and
 * `CONTACT` character for character — including "32 Pattaya 13 Alley" rather
 * than "Soi Hollywood"). Everything else stays here as a work list for O-10.
 *
 * What changed in this round: the rows are no longer blank placeholders. Each
 * one now carries the date it was actually read, the name and address the
 * listing itself shows (`observedName` / `observedAddress`), and — where the
 * listing exists but the canonical profile URL could not be reached — the
 * indexed page that proves it exists (`evidenceUrl`). That turns the file from a
 * to-do list into a record of what is true today, which is exactly what makes
 * the two gates safe to flip one at a time.
 *
 * Both gates are still closed on every row, so `getSameAsUrls()` returns an
 * empty array and `sameAs` falls back to the Google listing alone. That is the
 * correct answer, not a bug: see `weed.th` below, whose public blurb describes a
 * different shop on a different street under a different name.
 */

/**
 * `claimed` — the owner has access and can edit the listing;
 * `pending` — the listing exists but is not under control yet;
 * `absent` — no listing on this directory at all.
 */
export type CitationStatus = "claimed" | "pending" | "absent";

/**
 * What kind of profile the row describes. `sameAs` treats all three the same
 * way, but the work of claiming them is different: a social profile is claimed
 * with a login, a directory listing with a support ticket.
 */
export type CitationKind = "directory" | "social" | "map" | "travel";

export interface Citation {
  /** Directory name as a human reads it. */
  name: string;
  kind: CitationKind;
  /** Home page of the directory — kept even when there is no listing yet. */
  directoryUrl: string;
  /** Canonical URL of our listing, or `null` while there is none. */
  listingUrl: string | null;
  status: CitationStatus;
  /** NAP on the listing matches `ADDRESS` + `CONTACT` exactly, checked by a human. */
  napVerified: boolean;
  /** ISO date the listing was last read, or `null` if it never was. */
  checkedOn: string | null;
  /**
   * The business name printed on the listing, verbatim. Filled in on the check —
   * a listing that calls us something else is the raw material of the merge, and
   * writing it down is how the correction gets requested with a quote.
   */
  observedName?: string;
  /** The address printed on the listing, verbatim. */
  observedAddress?: string;
  /**
   * A page that proves the profile exists when the profile itself could not be
   * opened (blocked, login-walled, or only reachable through search). Never goes
   * into `sameAs` — it is evidence for the person doing O-10, not an identity
   * claim.
   */
  evidenceUrl?: string;
  /** Why the row is in its current state — read by whoever picks up O-10. */
  note?: string;
}

export const CITATIONS: Citation[] = [
  {
    name: "weed.th",
    kind: "directory",
    directoryUrl: "https://weed.th/",
    listingUrl:
      "https://weed.th/shop/a0832af2-218a-4b55-815c-a19f39c2197d/pattaya-chon-buri/labs-dispensary",
    status: "pending",
    napVerified: false,
    checkedOn: "2026-08-28",
    observedName: "LABS DISPENSARY",
    observedAddress: "Pattaya / Chon Buri, described as “center of Pattaya at Soi Hollywood”",
    // Единственная карточка, которая уже индексируется и по бренду стоит выше
    // самого сайта — и одновременно документальный источник склейки: её
    // публичный текст описывает «Ganja Labs Pattaya ... at Soi Hollywood», то
    // есть чужой магазин на чужой улице под чужим именем. У GANJ LABS при этом
    // есть собственная карточка на том же weed.th
    // (/shop/b8f92e08-1759-495b-8631-80b87c12fd7a/pattaya-chon-buri/ganj-labs),
    // так что это именно ошибка описания, а не совпадение адреса.
    //
    // Пока эта строка не исправлена владельцем, ссылка из `sameAs` не расшила бы
    // склейку, а закрепила бы её машиночитаемо. Порядок действий для O-04/O-10:
    // забрать карточку → заменить описание и адрес на «32 Pattaya 13 Alley,
    // South Pattaya» → выставить napVerified.
    note: "Indexed and outranks the site on brand queries, but its public blurb still describes Ganja Labs at Soi Hollywood. Claim it and rewrite the address before it may enter sameAs (O-04).",
  },
  {
    name: "Instagram",
    kind: "social",
    // Профиль существует и уже индексируется с точным NAP: в выдаче стоит
    // публикация, подписанная «LABS DISPENSARY South Pattaya, 32 Pattaya 13
    // Alley» — единственный внешний источник, который сегодня пишет адрес ровно
    // так же, как этот сайт. Канонический URL профиля здесь намеренно `null`:
    // instagram.com недоступен из сборочного окружения, а угаданный хендлер в
    // `sameAs` — это заявка на чужой аккаунт. Владелец вписывает `listingUrl`,
    // ставит status/napVerified и получает первую живую ссылку в `sameAs`.
    directoryUrl: "https://www.instagram.com/",
    listingUrl: null,
    status: "pending",
    napVerified: false,
    checkedOn: "2026-08-28",
    observedName: "LABS DISPENSARY",
    observedAddress: "South Pattaya, 32 Pattaya 13 Alley",
    evidenceUrl: "https://www.instagram.com/reel/DSZgYOVEnFe/",
    note: "Profile is indexed with our exact NAP; the canonical profile URL still has to be supplied by the owner (O-04) — a guessed handle in sameAs would claim someone else's account.",
  },
  {
    name: "Cannabox",
    kind: "directory",
    directoryUrl: "https://cannabox.co.th/dispensaries/pattaya",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
    note: "Pattaya directory exists and is indexed; no LABS DISPENSARY entry found on 2026-08-28.",
  },
  {
    name: "Thai Weed Guide",
    kind: "directory",
    directoryUrl: "https://thaiweedguide.com/directory-dispensaries/locations/pattaya/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
    note: "Pattaya directory lists competitors including White Labs Cannabis Pattaya; no entry for this shop on 2026-08-28.",
  },
  {
    name: "The Thaiger — dispensary guide",
    kind: "directory",
    directoryUrl: "https://thethaiger.com/guides/cannabis/where-you-can-get-cannabis-in-pattaya",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
    note: "English-language Pattaya dispensary guide with its own listing pages; no entry for this shop on 2026-08-28.",
  },
  {
    name: "High Thailand",
    kind: "directory",
    directoryUrl: "https://www.highthailand.com/dispensaries/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
  },
  {
    name: "Dispensary Thailand",
    kind: "directory",
    directoryUrl: "https://dispensarythailand.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
  {
    name: "Tripadvisor",
    kind: "travel",
    directoryUrl: "https://www.tripadvisor.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
    note: "Pattaya cannabis venues are listed as attractions; no entry for this shop on 2026-08-28.",
  },
  {
    name: "Facebook",
    kind: "social",
    directoryUrl: "https://www.facebook.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: "2026-08-28",
    note: "No page found under either name on 2026-08-28. If one is created, it must carry the same NAP as ADDRESS before it may enter sameAs.",
  },
];

/**
 * Чужие карточки, которые ищутся по тем же словам и которые нельзя добавлять в
 * `sameAs` никогда, как бы похоже они ни назывались.
 *
 * Список нужен не поисковику, а человеку: рынок Паттайи содержит GANJ LABS,
 * White Labs (несколько точек) и Green Lab, а живая выдача уже один раз
 * написала «LABS DISPENSARY (also referred to as Ganja Labs Pattaya)». Строка,
 * добавленная сюда, — это прививка от того, чтобы следующий подрядчик увидел
 * знакомое слово в названии и «нашёл нашу карточку».
 */
export const CONFUSABLE_LISTINGS: readonly Readonly<{
  name: string;
  url: string;
  why: string;
}>[] = Object.freeze([
  Object.freeze({
    name: "GANJ LABS",
    url: "https://weed.th/shop/b8f92e08-1759-495b-8631-80b87c12fd7a/pattaya-chon-buri/ganj-labs",
    why: "A different shop with its own weed.th listing. Live search results and our own weed.th blurb both conflate it with us; it is the source of the Soi Hollywood address, not a variant of our own.",
  }),
  Object.freeze({
    name: "White Labs Cannabis (Pattaya, Sriracha, Terminal 21)",
    url: "https://whitelabsthailand.com/",
    why: "A different company with several Chon Buri locations and its own farm claims. Shares the word “Labs” and nothing else.",
  }),
]);

/** A row may enter `sameAs` only when it is claimed, NAP-checked and has a URL. */
export function isPublishableCitation(citation: Citation): boolean {
  return citation.status === "claimed" && citation.napVerified && Boolean(citation.listingUrl);
}

/**
 * URLs for `sameAs`, deduplicated and in registry order. Empty until the first
 * listing passes both gates — an empty array is the correct, safe answer, not a
 * bug to work around.
 */
export function getSameAsUrls(): string[] {
  const urls = CITATIONS.filter(isPublishableCitation).map((citation) => citation.listingUrl as string);
  return [...new Set(urls)];
}

/**
 * Строки, которые уже прочитаны человеком и ждут только решения владельца.
 * Используется отчётами и приёмкой O-10; в разметку не попадает ничего.
 */
export function getPendingCitations(): Citation[] {
  return CITATIONS.filter((citation) => citation.status === "pending");
}
