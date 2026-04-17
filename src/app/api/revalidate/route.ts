import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SHOP_SETTINGS_TAG, STRAINS_TAG } from "@/lib/cache-tags";

type RevalidateRequest = {
  documentType?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RevalidateRequest;
    const documentType = body.documentType || "all";

    if (documentType === "strain") {
      revalidateTag(STRAINS_TAG, "max");
      return NextResponse.json({ revalidated: true, tags: [STRAINS_TAG] });
    }

    if (documentType === "shopSettings") {
      revalidateTag(SHOP_SETTINGS_TAG, "max");
      return NextResponse.json({ revalidated: true, tags: [SHOP_SETTINGS_TAG] });
    }

    revalidateTag(STRAINS_TAG, "max");
    revalidateTag(SHOP_SETTINGS_TAG, "max");
    return NextResponse.json({ revalidated: true, tags: [STRAINS_TAG, SHOP_SETTINGS_TAG] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to revalidate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
