import { sanityClient } from "@/sanity/client";
import {
  mockStrains,
  mockShopSettings,
  type Strain,
  type ShopSettings,
} from "./mock-data";

export async function getAllStrains(): Promise<Strain[]> {
  if (!sanityClient) return mockStrains;

  try {
    const strains = await sanityClient.fetch<Strain[]>(
      `*[_type == "strain"] | order(sortOrder asc) {
        _id, name, slug, image, type, effect,
        thcPercent, cbdPercent, pricePerGram,
        shortDescription, shortDescriptionRu, shortDescriptionTh,
        fullDescription, fullDescriptionRu, fullDescriptionTh, terpenes,
        isStaffPick, isSoldOut, sortOrder
      }`
    );
    return strains;
  } catch {
    return [];
  }
}

export async function getStrainBySlug(slug: string): Promise<Strain | null> {
  if (!sanityClient) {
    return mockStrains.find((s) => s.slug.current === slug) || null;
  }

  try {
    const strain = await sanityClient.fetch<Strain | null>(
      `*[_type == "strain" && slug.current == $slug][0] {
        _id, name, slug, image, type, effect,
        thcPercent, cbdPercent, pricePerGram,
        shortDescription, shortDescriptionRu, shortDescriptionTh,
        fullDescription, fullDescriptionRu, fullDescriptionTh, terpenes,
        isStaffPick, isSoldOut, sortOrder
      }`,
      { slug }
    );
    return strain || null;
  } catch {
    return null;
  }
}

export async function getStaffPick(): Promise<Strain | null> {
  if (!sanityClient) {
    return mockStrains.find((s) => s.isStaffPick) || null;
  }

  try {
    const staffPick = await sanityClient.fetch<Strain | null>(
      `*[_type == "strain" && isStaffPick == true] | order(sortOrder asc)[0] {
        _id, name, slug, image, type, effect,
        thcPercent, cbdPercent, pricePerGram,
        shortDescription, shortDescriptionRu, shortDescriptionTh,
        fullDescription, fullDescriptionRu, fullDescriptionTh, terpenes,
        isStaffPick, isSoldOut, sortOrder
      }`
    );

    if (staffPick) return staffPick;

    const strainsCount = await sanityClient.fetch<number>(`count(*[_type == "strain"])`);
    if (strainsCount !== 1) return null;

    const onlyStrain = await sanityClient.fetch<Strain | null>(
      `*[_type == "strain"] | order(sortOrder asc)[0] {
        _id, name, slug, image, type, effect,
        thcPercent, cbdPercent, pricePerGram,
        shortDescription, shortDescriptionRu, shortDescriptionTh,
        fullDescription, fullDescriptionRu, fullDescriptionTh, terpenes,
        isStaffPick, isSoldOut, sortOrder
      }`
    );

    return onlyStrain || null;
  } catch {
    return null;
  }
}

export async function getShopSettings(): Promise<ShopSettings> {
  if (!sanityClient) return mockShopSettings;

  try {
    const settings = await sanityClient.fetch<ShopSettings | null>(
      `*[_type == "shopSettings"][0] {
        openTime, closeTime, isOpen24h,
        lineUrl, lineId,
        whatsappUrl, whatsappNumber,
        telegramUrl, telegramId,
        phone,
        announcement
      }`
    );
    return settings || mockShopSettings;
  } catch {
    return mockShopSettings;
  }
}

export async function getAllStrainSlugs(): Promise<string[]> {
  if (!sanityClient) return mockStrains.map((s) => s.slug.current);

  try {
    const slugs = await sanityClient.fetch<{ current: string }[]>(
      `*[_type == "strain"].slug`
    );
    const result = slugs.map((s) => s.current);
    return result.length > 0 ? result : mockStrains.map((s) => s.slug.current);
  } catch {
    return mockStrains.map((s) => s.slug.current);
  }
}
