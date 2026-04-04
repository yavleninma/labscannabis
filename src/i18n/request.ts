import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isValidLocale } from "./config";
import { loadMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isValidLocale(locale)) {
    locale = defaultLocale;
  }

  const { messages } = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
