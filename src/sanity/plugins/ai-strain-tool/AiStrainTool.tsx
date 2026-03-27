"use client";

import { useMemo, useState } from "react";
import { useClient } from "sanity";

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

type EffectItem = { key: EffectKey; amount: number };
type TerpeneItem = { name: TerpeneName; amount: number };
type PortableBlock = {
  _type: "block";
  style: "normal";
  children: Array<{ _type: "span"; text: string }>;
  markDefs: never[];
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

const effectOptions: EffectKey[] = [
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
];

const terpeneOptions: TerpeneName[] = [
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
];

function blocksToText(blocks: PortableBlock[]): string {
  return blocks
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n\n");
}

function textToBlocks(text: string): PortableBlock[] {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block" as const,
      style: "normal" as const,
      children: [{ _type: "span" as const, text: paragraph }],
      markDefs: [],
    }));
}

function createKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}

function prepareDocument(draft: StrainDraft) {
  return {
    _type: "strain",
    ...draft,
    effect: draft.effects[0]?.key ?? null,
    terpenes: draft.terpeneProfile.map((item) => item.name),
    effects: draft.effects.map((item) => ({
      _type: "object",
      _key: createKey(),
      ...item,
    })),
    terpeneProfile: draft.terpeneProfile.map((item) => ({
      _type: "object",
      _key: createKey(),
      ...item,
    })),
    fullDescription: draft.fullDescription.map((block) => ({
      ...block,
      _key: createKey(),
      children: block.children.map((child) => ({
        ...child,
        _key: createKey(),
      })),
    })),
    fullDescriptionRu: draft.fullDescriptionRu.map((block) => ({
      ...block,
      _key: createKey(),
      children: block.children.map((child) => ({
        ...child,
        _key: createKey(),
      })),
    })),
  };
}

export function AiStrainTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<StrainDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fullDescriptionText = useMemo(
    () => (draft ? blocksToText(draft.fullDescription) : ""),
    [draft]
  );
  const fullDescriptionRuText = useMemo(
    () => (draft ? blocksToText(draft.fullDescriptionRu) : ""),
    [draft]
  );

  async function handleGenerate() {
    if (!input.trim()) return;
    setError(null);
    setCreatedId(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/strain/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });

      const data = (await response.json()) as { error?: string; strainDraft?: StrainDraft };
      if (!response.ok || !data.strainDraft) {
        throw new Error(data.error || "Failed to generate draft");
      }

      setDraft(data.strainDraft);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate draft";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCreate() {
    if (!draft) return;
    setError(null);
    setCreatedId(null);
    setIsCreating(true);

    try {
      const created = await client.create(prepareDocument(draft));
      setCreatedId(created._id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create strain";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>AI Generator: New Strain Card</h2>
      <p style={{ marginTop: 0, marginBottom: 18, opacity: 0.8 }}>
        Enter a free-form description in RU/EN, generate draft fields, adjust them, then create a
        new strain document.
      </p>

      <label htmlFor="ai-strain-input" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
        Source text
      </label>
      <textarea
        id="ai-strain-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        placeholder="Example: Gelato 41, hybrid, THC 25%, 350 THB per gram, uplifting and relaxing, with limonene and caryophyllene."
        style={{ width: "100%", marginBottom: 12, padding: 12, borderRadius: 8, border: "1px solid #444" }}
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !input.trim()}
        style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #666", cursor: "pointer" }}
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>

      {error ? (
        <p style={{ color: "#ff6b6b", marginTop: 12, marginBottom: 0 }}>
          <strong>Error:</strong> {error}
        </p>
      ) : null}

      {draft ? (
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #333" }}>
          <h3 style={{ fontSize: 22, marginTop: 0 }}>Preview and edit</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              Name
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Slug
              <input
                value={draft.slug.current}
                onChange={(event) => setDraft({ ...draft, slug: { current: event.target.value } })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Type
              <select
                value={draft.type}
                onChange={(event) => setDraft({ ...draft, type: event.target.value as StrainType })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              >
                <option value="indica">indica</option>
                <option value="sativa">sativa</option>
                <option value="hybrid">hybrid</option>
              </select>
            </label>
            <label>
              Price per gram (THB)
              <input
                type="number"
                value={draft.pricePerGram}
                onChange={(event) => setDraft({ ...draft, pricePerGram: Number(event.target.value) || 0 })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              THC %
              <input
                type="number"
                value={draft.thcPercent ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    thcPercent: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              CBD %
              <input
                type="number"
                value={draft.cbdPercent ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    cbdPercent: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 16 }}>
            Short description (EN)
            <input
              value={draft.shortDescription}
              onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Short description (RU)
            <input
              value={draft.shortDescriptionRu}
              onChange={(event) => setDraft({ ...draft, shortDescriptionRu: event.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Full description (EN)
            <textarea
              value={fullDescriptionText}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  fullDescription: textToBlocks(event.target.value),
                })
              }
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Full description (RU)
            <textarea
              value={fullDescriptionRuText}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  fullDescriptionRu: textToBlocks(event.target.value),
                })
              }
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <div style={{ marginTop: 18 }}>
            <h4 style={{ marginBottom: 8 }}>Effects</h4>
            {draft.effects.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, marginBottom: 8 }}
              >
                <select
                  value={item.key}
                  onChange={(event) => {
                    const next = [...draft.effects];
                    next[index] = { ...item, key: event.target.value as EffectKey };
                    setDraft({ ...draft, effects: next });
                  }}
                  style={{ padding: 8 }}
                >
                  {effectOptions.map((effect) => (
                    <option key={effect} value={effect}>
                      {effect}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={item.amount}
                  onChange={(event) => {
                    const next = [...draft.effects];
                    next[index] = { ...item, amount: Number(event.target.value) || 1 };
                    setDraft({ ...draft, effects: next });
                  }}
                  style={{ padding: 8 }}
                />
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, effects: draft.effects.filter((_, i) => i !== index) })}
                  style={{ padding: "8px 10px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, effects: [...draft.effects, { key: "relax", amount: 3 }] })}
              style={{ padding: "8px 12px" }}
            >
              Add effect
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <h4 style={{ marginBottom: 8 }}>Terpene profile</h4>
            {draft.terpeneProfile.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, marginBottom: 8 }}
              >
                <select
                  value={item.name}
                  onChange={(event) => {
                    const next = [...draft.terpeneProfile];
                    next[index] = { ...item, name: event.target.value as TerpeneName };
                    setDraft({ ...draft, terpeneProfile: next });
                  }}
                  style={{ padding: 8 }}
                >
                  {terpeneOptions.map((terpene) => (
                    <option key={terpene} value={terpene}>
                      {terpene}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={item.amount}
                  onChange={(event) => {
                    const next = [...draft.terpeneProfile];
                    next[index] = { ...item, amount: Number(event.target.value) || 0 };
                    setDraft({ ...draft, terpeneProfile: next });
                  }}
                  style={{ padding: 8 }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, terpeneProfile: draft.terpeneProfile.filter((_, i) => i !== index) })
                  }
                  style={{ padding: "8px 10px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  terpeneProfile: [...draft.terpeneProfile, { name: "Limonene", amount: 1 }],
                })
              }
              style={{ padding: "8px 12px" }}
            >
              Add terpene
            </button>
          </div>

          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !draft.name.trim() || !draft.slug.current.trim()}
              style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #666", cursor: "pointer" }}
            >
              {isCreating ? "Creating..." : "Create strain card"}
            </button>

            {createdId ? (
              <a href={`/studio/structure/strain;${createdId}`} style={{ textDecoration: "underline" }}>
                Open in editor
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
