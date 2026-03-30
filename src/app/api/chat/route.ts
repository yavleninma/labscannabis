import OpenAI from "openai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
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
      max_completion_tokens: 80,
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
