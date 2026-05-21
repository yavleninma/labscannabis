import type { Locale } from "@/lib/i18n";

const EN_NUMBER = new Intl.NumberFormat("en");

export function formatPrice(total: number, locale: Locale): string {
  if (locale === "ar") {
    return `${total.toLocaleString("ar-EG")} ฿`;
  }
  if (locale === "ru") {
    return `${total.toLocaleString("ru-RU")} ฿`;
  }
  if (locale === "th") {
    return `${EN_NUMBER.format(total)} บาท`;
  }
  return `${EN_NUMBER.format(total)} ฿`;
}

export function formatPerGram(perGram: number, locale: Locale): string {
  const unit =
    locale === "ru"
      ? "฿/г"
      : locale === "th"
        ? "บาท/กรัม"
        : locale === "ar"
          ? "฿/غرام"
          : locale === "zh"
            ? "฿/克"
            : locale === "ko"
              ? "฿/g"
              : locale === "ja"
                ? "฿/g"
                : "฿/g";
  const num =
    locale === "ar"
      ? perGram.toLocaleString("ar-EG")
      : locale === "ru"
        ? perGram.toLocaleString("ru-RU")
        : EN_NUMBER.format(perGram);
  return `${num} ${unit}`;
}

export function formatSavings(pct: number, locale: Locale): string {
  if (pct <= 0) return "";
  const labels: Record<Locale, string> = {
    en: `save ${pct}%`,
    ru: `−${pct}%`,
    th: `ประหยัด ${pct}%`,
    ar: `وفر ${pct}%`,
    zh: `省${pct}%`,
    ko: `${pct}% 할인`,
    ja: `${pct}% OFF`,
  };
  return labels[locale];
}
