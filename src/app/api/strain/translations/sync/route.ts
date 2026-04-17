import { NextResponse } from "next/server";
import { automatedLocaleCodes, type AutomatedLocale } from "@/i18n/config";
import type { StrainTranslation } from "@/lib/mock-data";
import type { PortableTextBlock } from "@/lib/portable-text";
import { syncStrainTranslations } from "@/lib/strain-translation-sync";

type SyncTranslationsRequest = {
  strain?: {
    name?: string;
    shortDescription?: string;
    fullDescription?: PortableTextBlock[] | null;
    translations?: StrainTranslation[] | null;
  };
  locales?: AutomatedLocale[];
};

function isValidLocaleList(locales?: string[]): locales is AutomatedLocale[] {
  return Boolean(locales?.every((locale) => automatedLocaleCodes.includes(locale as AutomatedLocale)));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncTranslationsRequest;
    const strain = body.strain;

    if (!strain?.shortDescription?.trim()) {
      return NextResponse.json(
        { error: "shortDescription is required for translation sync" },
        { status: 400 },
      );
    }

    const locales = isValidLocaleList(body.locales as string[] | undefined)
      ? body.locales
      : undefined;

    const result = await syncStrainTranslations(
      {
        name: strain.name,
        shortDescription: strain.shortDescription,
        fullDescription: strain.fullDescription || null,
        translations: strain.translations || [],
      },
      locales,
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync strain translations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
