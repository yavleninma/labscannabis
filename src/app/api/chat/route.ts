import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getAllStrains, getShopSettings } from "@/lib/queries";
import type { Strain, ShopSettings } from "@/lib/mock-data";

// --- Context helpers ---

function formatCatalog(strains: Strain[]): string {
  const available = strains.filter((s) => !s.isSoldOut);
  const soldOut = strains.filter((s) => s.isSoldOut);

  const lines = available.map((s) => {
    const thc = s.thcPercent ? ` | THC ${s.thcPercent}%` : "";
    const effects = (s.effects ?? [])
      .slice(0, 2)
      .map((e) => e.key)
      .join("+");
    const pick = s.isStaffPick ? " ⭐ Staff Pick" : "";
    return `- ${s.name} | ${s.type}${thc} | ${effects} | ฿${s.pricePerGram}/g${pick}`;
  });

  if (soldOut.length) {
    lines.push(`SOLD OUT: ${soldOut.map((s) => s.name).join(", ")}`);
  }

  return lines.join("\n") || "Catalog temporarily unavailable.";
}

function formatContacts(s: ShopSettings): string {
  const lines: string[] = [];

  if (s.phone) lines.push(`Phone/WhatsApp: ${s.phone}`);

  const tg = s.telegramId
    ? `@${s.telegramId.replace(/^@/, "")}`
    : s.telegramUrl ?? null;
  if (tg) lines.push(`Telegram: ${tg}`);

  const lineContact = s.lineId
    ? `LINE: @${s.lineId.replace(/^@/, "")}`
    : s.lineUrl
      ? `LINE: ${s.lineUrl}`
      : null;
  if (lineContact) lines.push(lineContact);

  return lines.join("\n") || "Phone: +66 66 080 6784";
}

// --- 5-minute in-memory cache ---

type CtxCache = { catalog: string; contacts: string; ts: number };
let cachedCtx: CtxCache | null = null;
const CTX_TTL = 5 * 60 * 1000;

async function getContext(): Promise<CtxCache> {
  if (cachedCtx && Date.now() - cachedCtx.ts < CTX_TTL) return cachedCtx;
  const [strains, settings] = await Promise.all([getAllStrains(), getShopSettings()]);
  cachedCtx = {
    catalog: formatCatalog(strains),
    contacts: formatContacts(settings),
    ts: Date.now(),
  };
  return cachedCtx;
}

// --- System prompt ---

const BASE_PROMPT = `
You are a chill, friendly assistant for Labs Cannabis in Pattaya, Thailand.

KEY TASK: Many visitors are looking for vapes, HQD, IQOS, e-cigs. When they ask:
- Be warm, not preachy — like a friend giving a heads-up
- Quickly mention vapes are illegal here (fines, police) — you're doing them a favor
- Pivot: weed is totally legal, Dima personally picks only the freshest top strains
- End with one short question to keep them talking (what vibe are they after? relaxing? energizing?)

For other questions: super short, friendly answer.

SHOP: Labs Cannabis, Soi Hollywood (Pattaya 13 Alley), 5 min from Walking Street. Walk-in, cash or QR.

RULES — strict:
- 1-2 short sentences MAX. Be punchy.
- End with one casual question
- Zero markdown. No asterisks, no lists, no bold. Plain text only.
- Reply in the user's language always
- One emoji max, optional
- When someone asks what's available, mentions a strain name, or wants to buy: share the relevant info from CURRENT STOCK and finish with the CONTACTS. Keep it natural, don't dump everything at once.
`.trim();

// --- Route ---

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages: ChatMessage[] };
    const messages = (body.messages ?? []).slice(-20);

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const ctx = await getContext();

    const systemPrompt = `${BASE_PROMPT}

CURRENT STOCK:
${ctx.catalog}

CONTACTS — share these when someone wants to buy, asks about a strain, or asks how to reach us:
${ctx.contacts}`;

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      temperature: 0.75,
      max_completion_tokens: 120,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
