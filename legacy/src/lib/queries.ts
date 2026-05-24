import { unstable_cache } from "next/cache";
import { sanityClient } from "@/sanity/client";
import { AREAS_TAG, SHOP_SETTINGS_TAG, STRAINS_TAG, getAreaTag } from "./cache-tags";
import {
  mockAreas,
  mockStrains,
  mockShopSettings,
  type Area,
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
  terpenes,
  terpeneProfile,
  isStaffPick,
  isSoldOut,
  isHidden,
  sortOrder
}`;

const areaProjection = `{
  _id,
  _updatedAt,
  name,
  nameRu,
  nameTh,
  slug,
  etaMinutes,
  shortDescription,
  shortDescriptionRu,
  shortDescriptionTh,
  landmarks,
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
        deliveryEnabled,
        pickupEnabled,
        fulfillmentNote,
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

async function fetchAllAreas(): Promise<Area[]> {
  if (!sanityClient) return mockAreas;

  try {
    const areas = await sanityClient.fetch<Area[]>(
      `*[_type == "area" && isHidden != true] | order(sortOrder asc) ${areaProjection}`,
    );
    return areas.length > 0 ? areas : mockAreas;
  } catch {
    return mockAreas;
  }
}

const getAllAreasCached = unstable_cache(fetchAllAreas, ["all-areas"], {
  revalidate: false,
  tags: [AREAS_TAG],
});

export async function getAllAreas(): Promise<Area[]> {
  return getAllAreasCached();
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
  const getAreaCached = unstable_cache(
    async () => {
      const areas = await fetchAllAreas();
      return areas.find((area) => area.slug.current === slug) || null;
    },
    ["area-by-slug", slug],
    {
      revalidate: false,
      tags: [AREAS_TAG, getAreaTag(slug)],
    },
  );

  return getAreaCached();
}
