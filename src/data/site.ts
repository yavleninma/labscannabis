export const CONTACT = {
  phoneIntl: "+66660806784",
  phoneDisplay: "+66 66 080 6784",
  whatsapp: "https://wa.me/66660806784",
  whatsappWithMsg: (msg: string) =>
    `https://wa.me/66660806784?text=${encodeURIComponent(msg)}`,
  telegram: "https://t.me/+66660806784",
  line: "https://line.me/R/ti/p/660806784",
  tel: "tel:+66660806784",
} as const;

export const BRAND = {
  name: "Labs Cannabis",
  formerName: "Labs Dispensary",
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

export function getMapsSearchUrl(): string {
  return GOOGLE.listingUrl;
}

export function getMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${ADDRESS.lat},${ADDRESS.lng}&z=18&output=embed`;
}
