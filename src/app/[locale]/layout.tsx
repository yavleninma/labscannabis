import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { JsonLd } from "@/components/JsonLd";

type Locale = "en" | "ru" | "th";

const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  th: "ไทย",
};

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

  // TODO: Replace with actual domain when purchased
  const baseUrl = "https://labscannabis.com";

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
      // TODO: Add OG image
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

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {routing.locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://labscannabis.com/${l}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://labscannabis.com/en"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <JsonLd locale={locale as Locale} />
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
