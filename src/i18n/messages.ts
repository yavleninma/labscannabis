import { defaultLocale, isValidLocale, type AppLocale } from "./config";

export type AppMessages = Record<string, unknown>;

const messageLoaders: Record<AppLocale, () => Promise<{ default: AppMessages }>> = {
  en: () => import("../../messages/en.json"),
  ru: () => import("../../messages/ru.json"),
  th: () => import("../../messages/th.json"),
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

  try {
    return { locale, messages: await importMessages(locale) };
  } catch {
    return { locale: defaultLocale, messages: await importMessages(defaultLocale) };
  }
}
