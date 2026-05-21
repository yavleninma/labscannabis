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
  listingUrl: "https://maps.app.goo.gl/T67UqNDGdALMC1VZ8",
  placeQuery: "LABS DISPENSARY Pattaya",
  rating: 4.8,
  reviewCount: 91,
} as const;

export const ADDRESS = {
  street: "32 Pattaya 13 Alley (Soi Hollywood)",
  locality: "Pattaya",
  region: "Chon Buri",
  postalCode: "20150",
  country: "TH",
  lat: 12.9236,
  lng: 100.8825,
} as const;

export const HOURS = {
  open: "12:00",
  close: "01:00",
  isOpen24h: false,
} as const;

export const STREET_PRICE_ANCHOR = { min: 500, max: 700, ourPrice: 300 };

export function getMapsSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE.placeQuery)}`;
}

export function getMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(GOOGLE.placeQuery)}&output=embed`;
}
