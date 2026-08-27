/**
 * Directory listings of the shop — the registry behind `sameAs` (W1-13).
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
 * Nothing in this file is confirmed yet, so `getSameAsUrls()` returns an empty
 * array and `sameAs` falls back to the Google listing alone. Rows are filled in
 * one at a time, each with the date it was actually checked.
 */

/**
 * `claimed` — the owner has access and can edit the listing;
 * `pending` — the listing exists but is not under control yet;
 * `absent` — no listing on this directory at all.
 */
export type CitationStatus = "claimed" | "pending" | "absent";

export interface Citation {
  /** Directory name as a human reads it. */
  name: string;
  /** Home page of the directory — kept even when there is no listing yet. */
  directoryUrl: string;
  /** Canonical URL of our listing, or `null` while there is none. */
  listingUrl: string | null;
  status: CitationStatus;
  /** NAP on the listing matches `ADDRESS` + `CONTACT` exactly, checked by a human. */
  napVerified: boolean;
  /** ISO date the listing was last read, or `null` if it never was. */
  checkedOn: string | null;
  /** Why the row is in its current state — read by whoever picks up O-10. */
  note?: string;
}

export const CITATIONS: Citation[] = [
  {
    name: "weed.th",
    directoryUrl: "https://weed.th/",
    listingUrl:
      "https://weed.th/shop/a0832af2-218a-4b55-815c-a19f39c2197d/pattaya-chon-buri/labs-dispensary",
    status: "pending",
    napVerified: false,
    checkedOn: null,
    // Единственная карточка, которая уже индексируется и по бренду стоит выше
    // самого сайта. Поэтому она же — первый кандидат в sameAs и первый риск:
    // пока владелец не подтвердил адрес и телефон на ней (O-04, O-10), ссылка
    // из разметки только закрепит расхождение NAP.
    note: "Indexed and outranks the site on brand queries; claim and align NAP first (O-04).",
  },
  {
    name: "Cannabox",
    directoryUrl: "https://cannabox.co.th/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
  {
    name: "Thai Weed Guide",
    directoryUrl: "https://thaiweedguide.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
  {
    name: "Dispensary Thailand",
    directoryUrl: "https://dispensarythailand.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
  {
    name: "High Thailand",
    directoryUrl: "https://highthailand.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
  {
    name: "Tripadvisor",
    directoryUrl: "https://www.tripadvisor.com/",
    listingUrl: null,
    status: "absent",
    napVerified: false,
    checkedOn: null,
  },
];

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
