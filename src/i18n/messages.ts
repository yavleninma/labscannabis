import { defaultLocale, getMessageFallbackLocales, isValidLocale, type AppLocale } from "./config";

export type AppMessages = Record<string, unknown>;

const messageLoaders: Record<AppLocale, () => Promise<{ default: AppMessages }>> = {
  en: () => import("../../messages/en.json"),
  ru: () => import("../../messages/ru.json"),
  th: () => import("../../messages/th.json"),
  "zh-CN": () => import("../../messages/zh-CN.json"),
  "zh-TW": () => import("../../messages/zh-TW.json"),
  ja: () => import("../../messages/ja.json"),
  ko: () => import("../../messages/ko.json"),
  hi: () => import("../../messages/hi.json"),
  ar: () => import("../../messages/ar.json"),
  he: () => import("../../messages/he.json"),
  de: () => import("../../messages/de.json"),
  fr: () => import("../../messages/fr.json"),
  es: () => import("../../messages/es.json"),
  it: () => import("../../messages/it.json"),
  "pt-BR": () => import("../../messages/pt-BR.json"),
  nl: () => import("../../messages/nl.json"),
  pl: () => import("../../messages/pl.json"),
  tr: () => import("../../messages/tr.json"),
  vi: () => import("../../messages/vi.json"),
  id: () => import("../../messages/id.json"),
  ms: () => import("../../messages/ms.json"),
  tl: () => import("../../messages/tl.json"),
  uk: () => import("../../messages/uk.json"),
  cs: () => import("../../messages/cs.json"),
  ro: () => import("../../messages/ro.json"),
  hu: () => import("../../messages/hu.json"),
  sv: () => import("../../messages/sv.json"),
  no: () => import("../../messages/no.json"),
  da: () => import("../../messages/da.json"),
  fi: () => import("../../messages/fi.json"),
};

async function importMessages(locale: AppLocale): Promise<AppMessages> {
  const messageModule = await messageLoaders[locale]();
  return messageModule.default as AppMessages;
}

export async function loadMessages(localeInput: string): Promise<{
  locale: AppLocale;
  messages: AppMessages;
}> {
  const locale = isValidLocale(localeInput) ? localeInput : defaultLocale;

  for (const candidate of getMessageFallbackLocales(locale)) {
    try {
      return {
        locale,
        messages: await importMessages(candidate),
      };
    } catch {
      // Fall through to the next locale candidate.
    }
  }

  return {
    locale: defaultLocale,
    messages: await importMessages(defaultLocale),
  };
}
