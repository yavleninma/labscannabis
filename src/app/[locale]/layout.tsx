import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { notoSans, notoSerif, notoSansThai, notoSerifThai } from "@/lib/fonts";
import "../globals.css";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

type Locale = "en" | "ru" | "th";
export const revalidate = 60;

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const baseUrl = getSiteUrl();

  const localeMap: Record<string, string> = {
    en: "en_US",
    ru: "ru_RU",
    th: "th_TH",
  };

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "x-default": `${baseUrl}/en`,
        "en-US": `${baseUrl}/en`,
        "ru-RU": `${baseUrl}/ru`,
        "th-TH": `${baseUrl}/th`,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${baseUrl}/${locale}`,
      siteName: "Labs Cannabis",
      locale: localeMap[locale] ?? "en_US",
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
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const shopSettings = await getShopSettings();

  const fontClasses = [
    notoSans.variable,
    notoSerif.variable,
    notoSansThai.variable,
    notoSerifThai.variable,
  ].join(" ");

  return (
    <html lang={locale} className={fontClasses}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <JsonLd
            locale={locale as Locale}
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
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
