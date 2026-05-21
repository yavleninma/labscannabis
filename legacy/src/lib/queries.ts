import { unstable_cache } from "next/cache";
import { sanityClient } from "@/sanity/client";
import { SHOP_SETTINGS_TAG, STRAINS_TAG } from "./cache-tags";
import {
  mockStrains,
  mockShopSettings,
  type Strain,
  type ShopSettings,
} from "./mock-data";

const strainProjection = `{
  _id,
  _updatedAt,
  name,
  slug,
  image,
  type,
  effect,
  effects,
  thcPercent,
  cbdPercent,
  pricePerGram,
  shortDescription,
  shortDescriptionRu,
  shortDescriptionTh,
  fullDescription,
  fullDescriptionRu,
  fullDescriptionTh,
  translations[]{
    locale,
    shortDescription,
    fullDescription,
    sourceHash,
    translatedAt,
    model
  },
  terpenes,
  terpeneProfile,
  isStaffPick,
  isSoldOut,
  isHidden,
  sortOrder
}`;

async function fetchAllStrains(): Promise<Strain[]> {
  if (!sanityClient) return mockStrains;

  try {
    const strains = await sanityClient.fetch<Strain[]>(
      `*[_type == "strain" && isHidden != true] | order(sortOrder asc) ${strainProjection}`
    );
    return strains.length > 0 ? strains : mockStrains;
  } catch {
    return mockStrains;
  }
}

const getAllStrainsCached = unstable_cache(fetchAllStrains, ["all-strains"], {
  revalidate: false,
  tags: [STRAINS_TAG],
});

export async function getAllStrains(): Promise<Strain[]> {
  return getAllStrainsCached();
}

export async function getStrainBySlug(slug: string): Promise<Strain | null> {
  const strains = await getAllStrains();
  return strains.find((strain) => strain.slug.current === slug) || null;
}

export async function getStaffPick(): Promise<Strain | null> {
  const strains = await getAllStrains();
  const explicitStaffPick = strains.find((strain) => strain.isStaffPick);
  if (explicitStaffPick) {
    return explicitStaffPick;
  }

  return strains.length === 1 ? strains[0] : null;
}

async function fetchShopSettings(): Promise<ShopSettings> {
  if (!sanityClient) return mockShopSettings;

  try {
    const settings = await sanityClient.fetch<ShopSettings | null>(
      `*[_type == "shopSettings"][0] {
        openTime, closeTime, isOpen24h,
        lineUrl, lineId,
        whatsappUrl, whatsappNumber,
        telegramUrl, telegramId,
        phone,
        announcement,
        googleRating,
        googleReviewCount,
        guidePhoto,
        teamPhoto
      }`
    );
    return settings || mockShopSettings;
  } catch {
    return mockShopSettings;
  }
}

const getShopSettingsCached = unstable_cache(fetchShopSettings, ["shop-settings"], {
  revalidate: false,
  tags: [SHOP_SETTINGS_TAG],
});

export async function getShopSettings(): Promise<ShopSettings> {
  return getShopSettingsCached();
}

export async function getAllStrainSlugs(): Promise<string[]> {
  const strains = await getAllStrains();
  return strains.map((strain) => strain.slug.current);
}
