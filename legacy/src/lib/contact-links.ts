import type { ContactMessageLocale } from "@/i18n/config";
import type { ShopSettings } from "@/lib/mock-data";

export type ContactLocale = ContactMessageLocale;

export type MessageKind = "general" | "purchase" | "pickup" | "delivery";

export interface ContactLinkOptions {
  kind?: MessageKind;
  productName?: string;
  destinationName?: string;
  source?: string | null;
  campaign?: string | null;
}

export interface ContactLinks {
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  line: string | null;
  reserve: string | null;
}

type ContactOptionsInput = ContactLinkOptions | string;

function cleanValue(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeContactOptions(options?: ContactOptionsInput): ContactLinkOptions {
  return typeof options === "string" ? { productName: options } : options ?? {};
}

function normalizePhone(value?: string | null): string | null {
  const raw = cleanValue(value);
  if (!raw) return null;
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return hasPlus ? `+${digits}` : digits;
}

function normalizeTelegramId(value?: string | null): string | null {
  const raw = cleanValue(value);
  if (!raw) return null;
  return raw.replace(/^@+/, "").replace(/^https?:\/\/t\.me\//i, "").trim() || null;
}

function normalizeLineId(value?: string | null): string | null {
  const raw = cleanValue(value);
  if (!raw) return null;
  return raw.replace(/^@+/, "").trim() || null;
}

function appendQueryParam(urlValue: string, key: string, value: string): string {
  try {
    const url = new URL(urlValue);
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    const joiner = urlValue.includes("?") ? "&" : "?";
    return `${urlValue}${joiner}${key}=${encodeURIComponent(value)}`;
  }
}

function getRefTag(source?: string | null, campaign?: string | null): string {
  const safeSource = cleanValue(source)?.replace(/[\[\]\n\r]/g, "").slice(0, 80);
  const safeCampaign = cleanValue(campaign)?.replace(/[\[\]\n\r]/g, "").slice(0, 80);
  if (!safeSource) return "";
  return safeCampaign ? `[ref: ${safeSource}/${safeCampaign}]` : `[ref: ${safeSource}]`;
}

function appendRefTag(message: string, options?: ContactLinkOptions): string {
  const refTag = getRefTag(options?.source, options?.campaign);
  return refTag ? `${message}\n\n${refTag}` : message;
}

export function createContactMessage(
  locale: ContactLocale,
  kind: MessageKind,
  options?: ContactOptionsInput,
): string {
  const normalizedOptions = normalizeContactOptions(options);

  if (kind === "purchase") {
    const safeName = normalizedOptions.productName?.trim() || "this strain";
    if (locale === "ru") {
      return `Здравствуйте! Хотим купить "${safeName}". Подскажите, пожалуйста, наличие и детали.`;
    }
    if (locale === "th") {
      return `สวัสดีครับ/ค่ะ สนใจซื้อ "${safeName}" รบกวนแจ้งสต็อกและรายละเอียดเพิ่มเติมด้วยครับ/ค่ะ`;
    }
    return `Hello! We would like to buy "${safeName}". Could you please confirm availability and details?`;
  }

  if (kind === "pickup") {
    if (locale === "ru") {
      return "Здравствуйте! Хочу забрать заказ в магазине. Подскажите, что есть в наличии.";
    }
    if (locale === "th") {
      return "สวัสดีครับ/ค่ะ อยากรับสินค้าที่ร้าน รบกวนแจ้งสต็อกที่มีด้วยครับ/ค่ะ";
    }
    return "Hello! I would like to pick up an order at the shop. Could you share what's in stock?";
  }

  if (kind === "delivery") {
    const product = normalizedOptions.productName?.trim();
    const destination = normalizedOptions.destinationName?.trim();
    if (product && destination) {
      if (locale === "ru") {
        return `Здравствуйте! Хочу заказать доставку "${product}" в ${destination}. Подскажите наличие и как оформить.`;
      }
      if (locale === "th") {
        return `สวัสดีครับ/ค่ะ ต้องการสั่งจัดส่ง "${product}" ไปที่ ${destination} รบกวนแจ้งสต็อกและวิธีสั่งด้วยครับ/ค่ะ`;
      }
      return `Hello! I would like to order delivery of "${product}" to ${destination}. Could you confirm availability and how to order?`;
    }

    if (product) {
      if (locale === "ru") {
        return `Здравствуйте! Хочу заказать доставку "${product}" по Паттайе. Подскажите наличие и как оформить.`;
      }
      if (locale === "th") {
        return `สวัสดีครับ/ค่ะ ต้องการสั่งจัดส่ง "${product}" ในพัทยา รบกวนแจ้งสต็อกและวิธีสั่งด้วยครับ/ค่ะ`;
      }
      return `Hello! I would like to order delivery of "${product}" in Pattaya. Could you confirm availability and how to order?`;
    }

    if (destination) {
      if (locale === "ru") {
        return `Здравствуйте! Хочу заказать доставку в ${destination}. Подскажите наличие и как оформить.`;
      }
      if (locale === "th") {
        return `สวัสดีครับ/ค่ะ ต้องการสั่งจัดส่งไปที่ ${destination} รบกวนแจ้งสต็อกและวิธีสั่งด้วยครับ/ค่ะ`;
      }
      return `Hello! I would like to order delivery to ${destination}. Could you share availability and how to order?`;
    }

    if (locale === "ru") {
      return "Здравствуйте! Хочу заказать доставку по Паттайе. Подскажите наличие и как оформить.";
    }
    if (locale === "th") {
      return "สวัสดีครับ/ค่ะ ต้องการสั่งจัดส่งในพัทยา รบกวนแจ้งสต็อกและวิธีสั่งด้วยครับ/ค่ะ";
    }
    return "Hello! I would like to order delivery in Pattaya. Could you share availability and how to order?";
  }

  if (locale === "ru") return "Здравствуйте! Хочу уточнить наличие и цену.";
  if (locale === "th") return "สวัสดีครับ/ค่ะ ขอสอบถามสต็อกและราคาสินค้าครับ/ค่ะ";
  return "Hello! I would like to check product availability and pricing.";
}

function buildPhoneLink(settings: ShopSettings): string | null {
  const normalizedPhone = normalizePhone(settings.phone);
  return normalizedPhone ? `tel:${normalizedPhone}` : null;
}

function buildWhatsappLink(settings: ShopSettings, message?: string): string | null {
  const providedUrl = cleanValue(settings.whatsappUrl);
  if (providedUrl) {
    return message ? appendQueryParam(providedUrl, "text", message) : providedUrl;
  }

  const phoneSource = normalizePhone(settings.whatsappNumber) || normalizePhone(settings.phone);
  if (!phoneSource) return null;
  const phoneDigitsOnly = phoneSource.replace(/\D/g, "");
  if (!phoneDigitsOnly) return null;
  if (!message) return `https://wa.me/${phoneDigitsOnly}`;
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}

function buildTelegramLink(settings: ShopSettings, message?: string): string | null {
  const providedUrl = cleanValue(settings.telegramUrl);
  if (providedUrl) {
    return message ? appendQueryParam(providedUrl, "text", message) : providedUrl;
  }

  const telegramId = normalizeTelegramId(settings.telegramId);
  if (!telegramId) return null;
  const baseUrl = `https://t.me/${telegramId}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

function buildLineLink(settings: ShopSettings): string | null {
  const providedUrl = cleanValue(settings.lineUrl);
  if (providedUrl) return providedUrl;

  const lineId = normalizeLineId(settings.lineId);
  if (lineId) return `https://line.me/ti/p/~${lineId}`;

  return buildPhoneLink(settings);
}

export function buildContactLinks(
  settings: ShopSettings,
  locale: ContactLocale,
  options?: ContactLinkOptions,
): ContactLinks {
  const normalizedOptions = normalizeContactOptions(options);
  const kind = normalizedOptions.kind ?? "general";
  const message = appendRefTag(
    createContactMessage(locale, kind, normalizedOptions),
    normalizedOptions,
  );
  const phone = buildPhoneLink(settings);
  const whatsapp = buildWhatsappLink(settings, message);
  const telegram = buildTelegramLink(settings, message);
  const line = buildLineLink(settings);

  return {
    phone,
    whatsapp,
    telegram,
    line,
    reserve: whatsapp || telegram || line || phone,
  };
}

