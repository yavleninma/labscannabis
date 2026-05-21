import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Noto_Sans,
  Noto_Sans_Thai,
  Noto_Serif,
  Noto_Serif_Thai,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  defaultLocale,
  getLocaleDirection,
  getLocaleHrefLang,
  getLocaleOgLocale,
  getLocaleScript,
  isValidLocale,
  localeCodes,
  type AppLocale,
} from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { buildLanguageAlternates, getKeywordsFromMessages } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-latin",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-thai",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heading-latin",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heading-thai",
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const { messages } = await loadMessages(locale);
  const baseUrl = getSiteUrl();

  return {
    title: t("title"),
    description: t("description"),
    keywords: getKeywordsFromMessages(messages),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: buildLanguageAlternates(baseUrl, (alternateLocale) => `/${alternateLocale}`),
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${baseUrl}/${locale}`,
      siteName: "Labs Cannabis",
      locale: getLocaleOgLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;

  if (!isValidLocale(requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as AppLocale;
  const messages = await getMessages();
  const shopSettings = await getShopSettings();
  const direction = getLocaleDirection(locale);
  const script = getLocaleScript(locale);
  const baseUrl = getSiteUrl();

  return (
    <html lang={locale} dir={direction} data-locale={locale} data-script={script}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        {localeCodes.map((alternateLocale) => (
          <link
            key={alternateLocale}
            rel="alternate"
            hrefLang={getLocaleHrefLang(alternateLocale)}
            href={`${baseUrl}/${alternateLocale}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/${defaultLocale}`}
        />
      </head>
      <body className={`${notoSans.variable} ${notoSansThai.variable} ${notoSerif.variable} ${notoSerifThai.variable} bg-bg-primary text-text-primary antialiased min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <JsonLd
            locale={locale}
            openTime={shopSettings.openTime}
            closeTime={shopSettings.closeTime}
            isOpen24h={shopSettings.isOpen24h}
            googleRating={shopSettings.googleRating}
            googleReviewCount={shopSettings.googleReviewCount}
            phone={shopSettings.phone}
          />
          <Header
            openTime={shopSettings.openTime}
            closeTime={shopSettings.closeTime}
            isOpen24h={shopSettings.isOpen24h}
          />
          <main>{children}</main>
          <ChatWidget locale={locale} />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
