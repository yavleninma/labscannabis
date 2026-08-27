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
