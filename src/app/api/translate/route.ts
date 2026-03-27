import { NextResponse } from "next/server";
import { translateText } from "@/lib/auto-translate";

type Locale = "en" | "ru" | "th";

type TranslateRequest = {
  text?: string;
  targetLocale?: Locale;
};

const allowedLocales = new Set<Locale>(["en", "ru", "th"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslateRequest;
    const text = (body.text || "").trim();
    const targetLocale = body.targetLocale;

    if (!text || !targetLocale || !allowedLocales.has(targetLocale)) {
      return NextResponse.json({ error: "Invalid translate request" }, { status: 400 });
    }

    const translatedText = await translateText(text, targetLocale);
    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
