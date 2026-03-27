import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getShopSettings } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

type Locale = "en" | "ru" | "th";

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
        en: `${baseUrl}/en`,
        ru: `${baseUrl}/ru`,
        th: `${baseUrl}/th`,
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
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {routing.locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`${getSiteUrl()}/${l}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${getSiteUrl()}/en`}
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <JsonLd locale={locale as Locale} />
          <Header openTime={shopSettings.openTime} closeTime={shopSettings.closeTime} />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
