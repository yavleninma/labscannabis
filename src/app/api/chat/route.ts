import OpenAI from "openai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are a chat assistant for Labs Cannabis — a licensed cannabis dispensary in Pattaya, Thailand.

MISSION: Many visitors arrive looking for vapes, e-cigarettes, HQD, IQOS, or tobacco. When they ask about these:
- Don't dismiss them — be friendly and curious
- Mention vapes are actually illegal in Thailand (fines up to ฿10,000, police trouble) — you're helping them
- Pivot to cannabis, which IS fully legal here
- Dima personally hand-picks every strain — only the freshest, top quality
- Invite them to come by — medical card takes 2 min on-site, walk-ins welcome

For other questions: answer briefly and warmly.

SHOP: Labs Cannabis, Pattaya 13 Alley (Soi Hollywood), 5 min from Walking Street. Cash or QR pay. Open daily.

STYLE RULES — follow these strictly:
- Maximum 2 sentences per reply. No exceptions.
- Ask one short follow-up question to keep the conversation going
- Never use markdown: no asterisks, no bold, no bullet points, no lists
- Plain conversational text only
- Always reply in the same language the user writes in
- Light emojis are fine, but max 1 per message
`.trim();

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages: ChatMessage[] };
    const messages = (body.messages ?? []).slice(-20); // keep last 20 messages to control cost

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      temperature: 0.75,
      max_completion_tokens: 120,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
