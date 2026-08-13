import type { Locale } from "@/lib/i18n";
import en from "@/i18n/en/ui.json";
import ru from "@/i18n/ru/ui.json";
import th from "@/i18n/th/ui.json";
import ar from "@/i18n/ar/ui.json";
import zh from "@/i18n/zh/ui.json";
import ko from "@/i18n/ko/ui.json";
import ja from "@/i18n/ja/ui.json";

export type UiStrings = typeof en;

const UI: Record<Locale, UiStrings> = { en, ru, th, ar, zh, ko, ja };

export function t(locale: Locale): UiStrings {
  return UI[locale] ?? UI.en;
}

export function getWhatsAppPrefill(locale: Locale, waSlug: string): string {
  const strings = t(locale);
  const key = waSlug as keyof typeof strings.whatsappPrefill;
  return strings.whatsappPrefill[key] ?? strings.whatsappPrefill["10g"];
}

export {
  DEFAULT_WHATSAPP_TRACKING_SOURCE,
  WHATSAPP_TRACKING_SOURCES,
  whatsappLinkProps,
  whatsappTrackingAttrs,
} from "@/lib/whatsapp";
export type {
  WhatsAppTrackingAttrs,
  WhatsAppTrackingOptions,
  WhatsAppTrackingSource,
} from "@/lib/whatsapp";
