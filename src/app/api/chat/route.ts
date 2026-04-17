import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getAllStrains, getShopSettings } from "@/lib/queries";
import type { Strain, ShopSettings } from "@/lib/mock-data";

// --- Types ---

export type ContactCard = {
  label: string;
  url: string;
  color: string;
  icon: "phone" | "whatsapp" | "telegram" | "line";
};

// --- Helpers ---

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

function buildContactCards(s: ShopSettings): ContactCard[] {
  const cards: ContactCard[] = [];

  // WhatsApp (prefer explicit URL, else build from number or phone)
  const waUrl = s.whatsappUrl?.trim() || null;
  const waNumber = (s.whatsappNumber || s.phone || "").replace(/\D/g, "");
  const whatsapp = waUrl || (waNumber ? `https://wa.me/${waNumber}` : null);
  if (whatsapp) cards.push({ label: "WhatsApp", url: whatsapp, color: "#25D366", icon: "whatsapp" });

  // Telegram
  const tgId = s.telegramId?.replace(/^@+/, "").trim();
  const telegram = s.telegramUrl?.trim() || (tgId ? `https://t.me/${tgId}` : null);
  if (telegram) cards.push({ label: "Telegram", url: telegram, color: "#0088cc", icon: "telegram" });

  // LINE
  const lineId = s.lineId?.replace(/^@+/, "").trim();
  const line = s.lineUrl?.trim() || (lineId ? `https://line.me/ti/p/~${lineId}` : null);
  if (line) cards.push({ label: "LINE", url: line, color: "#06C755", icon: "line" });

  // Phone (always last)
  if (s.phone) {
    const digits = s.phone.replace(/\D/g, "");
    if (digits) cards.push({ label: s.phone, url: `tel:+${digits}`, color: "#059669", icon: "phone" });
  }

  return cards;
}

// --- 5-minute in-memory cache ---

type CtxCache = {
  catalog: string;
  contactCards: ContactCard[];
  ts: number;
};
let cachedCtx: CtxCache | null = null;
const CTX_TTL = 5 * 60 * 1000;

async function getContext(): Promise<CtxCache> {
  if (cachedCtx && Date.now() - cachedCtx.ts < CTX_TTL) return cachedCtx;
  const [strains, settings] = await Promise.all([getAllStrains(), getShopSettings()]);
  cachedCtx = {
    catalog: formatCatalog(strains),
    contactCards: buildContactCards(settings),
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
- End with one short question to keep them talking (what vibe? relaxing? energizing?)

SHOP: Labs Cannabis, Soi Hollywood (Pattaya 13 Alley), 5 min from Walking Street. Walk-in, cash or QR.

RULES — strict:
- 1-2 short sentences MAX. Be punchy.
- End with one casual question
- Zero markdown. No asterisks, no lists, no bold. Plain text only.
- Reply in the user's language always
- One emoji max, optional
- When someone asks what's available: share from CURRENT STOCK below
- When someone wants to buy, asks how to contact us, or you mention reaching out: add exactly [CONTACTS] at the very end of your message. The system shows these as clickable buttons — do NOT write phone numbers or handles in plain text.
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
${ctx.catalog}`;

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      temperature: 0.75,
      max_completion_tokens: 120,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const showContacts = raw.includes("[CONTACTS]");
    const content = raw.replace("[CONTACTS]", "").trim();

    return NextResponse.json({
      content,
      contacts: showContacts ? ctx.contactCards : [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
