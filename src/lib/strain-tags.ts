import type { Strain } from "./mock-data";

export type StrainTagType = "effect" | "type" | "terpene";

export function normalizeTagValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function createTagHref(locale: string, tagType: StrainTagType, tagValue: string): string {
  const params = new URLSearchParams({
    tagType,
    tag: normalizeTagValue(tagValue),
  });

  return `/${locale}?${params.toString()}#catalog`;
}

export function parseTagFromSearchParams(searchParams: { get: (name: string) => string | null }): {
  tagType: StrainTagType | null;
  tag: string | null;
} {
  const tagTypeRaw = searchParams.get("tagType");
  const tagRaw = searchParams.get("tag");
  if (!tagTypeRaw || !tagRaw) {
    return { tagType: null, tag: null };
  }

  if (tagTypeRaw !== "effect" && tagTypeRaw !== "type" && tagTypeRaw !== "terpene") {
    return { tagType: null, tag: null };
  }

  return {
    tagType: tagTypeRaw,
    tag: normalizeTagValue(tagRaw),
  };
}

export function strainMatchesTag(strain: Strain, tagType: StrainTagType, tag: string): boolean {
  if (tagType === "effect") {
    return normalizeTagValue(strain.effect) === tag;
  }

  if (tagType === "type") {
    return normalizeTagValue(strain.type) === tag;
  }

  return (strain.terpenes || []).some((terpene) => normalizeTagValue(terpene) === tag);
}
