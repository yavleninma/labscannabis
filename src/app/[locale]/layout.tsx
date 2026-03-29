import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Noto_Sans, Noto_Serif, Noto_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

type Locale = "en" | "ru" | "th";
export const revalidate = 60;

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-thai",
  display: "swap",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading-thai",
  display: "swap",
});

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
      locale: locale === "th" ? "th_TH" : locale === "ru" ? "ru_RU" : "en_US",
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

  return (
    <html
      lang={locale}
      className={`${notoSans.variable} ${notoSerif.variable} ${notoSansThai.variable} ${notoSerifThai.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
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
