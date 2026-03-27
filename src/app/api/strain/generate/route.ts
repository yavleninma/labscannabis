import OpenAI from "openai";
import { NextResponse } from "next/server";

type StrainType = "indica" | "sativa" | "hybrid";
type EffectKey =
  | "relax"
  | "energy"
  | "creative"
  | "sleep"
  | "euphoria"
  | "focus"
  | "happy"
  | "uplifted"
  | "talkative"
  | "hungry";
type TerpeneName =
  | "Myrcene"
  | "Caryophyllene"
  | "Limonene"
  | "Pinene"
  | "Terpinolene"
  | "Ocimene"
  | "Linalool"
  | "Humulene"
  | "Nerolidol"
  | "Bisabolol"
  | "Fenchol";

type GenerateRequest = {
  text?: string;
};

type EffectItem = { key: EffectKey; amount: number };
type TerpeneItem = { name: TerpeneName; amount: number };

type ParsedStrain = {
  name: string;
  type: StrainType;
  effects: EffectItem[];
  thcPercent: number | null;
  cbdPercent: number | null;
  pricePerGram: number;
  shortDescription: string;
  shortDescriptionRu: string;
  fullDescription: string;
  fullDescriptionRu: string;
  terpeneProfile: TerpeneItem[];
};

type StrainDraft = {
  name: string;
  slug: { current: string };
  type: StrainType;
  effect: EffectKey | null;
  effects: EffectItem[];
  thcPercent: number | null;
  cbdPercent: number | null;
  pricePerGram: number;
  shortDescription: string;
  shortDescriptionRu: string;
  shortDescriptionTh: null;
  fullDescription: PortableBlock[];
  fullDescriptionRu: PortableBlock[];
  fullDescriptionTh: null;
  terpenes: string[];
  terpeneProfile: TerpeneItem[];
  isStaffPick: boolean;
  isSoldOut: boolean;
  isHidden: boolean;
  sortOrder: number;
};

type PortableBlock = {
  _type: "block";
  style: "normal";
  children: Array<{ _type: "span"; text: string }>;
  markDefs: never[];
};

const allowedTypes = new Set<StrainType>(["indica", "sativa", "hybrid"]);
const allowedEffects = new Set<EffectKey>([
  "relax",
  "energy",
  "creative",
  "sleep",
  "euphoria",
  "focus",
  "happy",
  "uplifted",
  "talkative",
  "hungry",
]);
const allowedTerpenes = new Set<TerpeneName>([
  "Myrcene",
  "Caryophyllene",
  "Limonene",
  "Pinene",
  "Terpinolene",
  "Ocimene",
  "Linalool",
  "Humulene",
  "Nerolidol",
  "Bisabolol",
  "Fenchol",
]);

const schema = {
  name: "strain_generation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      type: { type: "string", enum: ["indica", "sativa", "hybrid"] },
      effects: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            key: {
              type: "string",
              enum: [
                "relax",
                "energy",
                "creative",
                "sleep",
                "euphoria",
                "focus",
                "happy",
                "uplifted",
                "talkative",
                "hungry",
              ],
            },
            amount: { type: "integer", minimum: 1, maximum: 5 },
          },
          required: ["key", "amount"],
        },
      },
      thcPercent: { type: ["number", "null"], minimum: 0, maximum: 100 },
      cbdPercent: { type: ["number", "null"], minimum: 0, maximum: 100 },
      pricePerGram: { type: "number", minimum: 0 },
      shortDescription: { type: "string", maxLength: 150 },
      shortDescriptionRu: { type: "string", maxLength: 150 },
      fullDescription: { type: "string" },
      fullDescriptionRu: { type: "string" },
      terpeneProfile: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
              enum: [
                "Myrcene",
                "Caryophyllene",
                "Limonene",
                "Pinene",
                "Terpinolene",
                "Ocimene",
                "Linalool",
                "Humulene",
                "Nerolidol",
                "Bisabolol",
                "Fenchol",
              ],
            },
            amount: { type: "number", minimum: 0, maximum: 100 },
          },
          required: ["name", "amount"],
        },
      },
    },
    required: [
      "name",
      "type",
      "effects",
      "thcPercent",
      "cbdPercent",
      "pricePerGram",
      "shortDescription",
      "shortDescriptionRu",
      "fullDescription",
      "fullDescriptionRu",
      "terpeneProfile",
    ],
  },
} as const;

const systemPrompt = `
You convert a free-form cannabis strain note into structured JSON for a product card.
Use only allowed enums exactly as provided.
If unknown, infer sensible defaults:
- type -> "hybrid"
- effects -> at least one item, amount 3 if uncertain
- cbdPercent/thcPercent -> null if not mentioned
- terpeneProfile -> [] if not mentioned
- pricePerGram -> estimate from context if absent, otherwise use 300
Descriptions:
- shortDescription must be in English, <=150 chars.
- shortDescriptionRu must be in Russian, <=150 chars.
- fullDescription must be a concise English paragraph for product page.
- fullDescriptionRu must be a concise Russian paragraph for product page.
Name should be market-friendly and concise.
Return valid JSON only.
`.trim();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeType(value: string): StrainType {
  return allowedTypes.has(value as StrainType) ? (value as StrainType) : "hybrid";
}

function normalizeEffects(items: EffectItem[]): EffectItem[] {
  const deduped = new Map<EffectKey, EffectItem>();
  for (const item of items) {
    if (!allowedEffects.has(item.key)) continue;
    deduped.set(item.key, {
      key: item.key,
      amount: clamp(Math.round(item.amount), 1, 5),
    });
  }

  const output = [...deduped.values()];
  return output.length > 0 ? output : [{ key: "relax", amount: 3 }];
}

function normalizeTerpenes(items: TerpeneItem[]): TerpeneItem[] {
  const deduped = new Map<TerpeneName, TerpeneItem>();
  for (const item of items) {
    if (!allowedTerpenes.has(item.name)) continue;
    deduped.set(item.name, {
      name: item.name,
      amount: clamp(Number(item.amount) || 0, 0, 100),
    });
  }
  return [...deduped.values()];
}

function trimText(input: string, maxLength: number): string {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 1).trimEnd() + "…";
}

function toPortableBlocks(text: string): PortableBlock[] {
  const paragraphs = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [];

  return paragraphs.map((paragraph) => ({
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: paragraph }],
    markDefs: [],
  }));
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/['".,()/\\]/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `strain-${Date.now()}`;
}

function buildDraft(parsed: ParsedStrain): StrainDraft {
  const name = parsed.name.trim() || "Unknown Strain";
  const effects = normalizeEffects(parsed.effects ?? []);
  const terpeneProfile = normalizeTerpenes(parsed.terpeneProfile ?? []);

  return {
    name,
    slug: { current: slugify(name) },
    type: normalizeType(parsed.type),
    effect: effects[0]?.key ?? null,
    effects,
    thcPercent: parsed.thcPercent === null ? null : clamp(Number(parsed.thcPercent) || 0, 0, 100),
    cbdPercent: parsed.cbdPercent === null ? null : clamp(Number(parsed.cbdPercent) || 0, 0, 100),
    pricePerGram: Math.max(0, Number(parsed.pricePerGram) || 0),
    shortDescription: trimText(parsed.shortDescription || "", 150),
    shortDescriptionRu: trimText(parsed.shortDescriptionRu || "", 150),
    shortDescriptionTh: null,
    fullDescription: toPortableBlocks(parsed.fullDescription || ""),
    fullDescriptionRu: toPortableBlocks(parsed.fullDescriptionRu || ""),
    fullDescriptionTh: null,
    terpenes: terpeneProfile.map((item) => item.name),
    terpeneProfile,
    isStaffPick: false,
    isSoldOut: false,
    isHidden: false,
    sortOrder: 0,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const text = (body.text || "").trim();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-5.4",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: schema,
      },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Model returned empty response" }, { status: 502 });
    }

    const parsed = JSON.parse(content) as ParsedStrain;
    const strainDraft = buildDraft(parsed);

    return NextResponse.json({ strainDraft });
  } catch {
    return NextResponse.json({ error: "Failed to generate strain draft" }, { status: 500 });
  }
}
