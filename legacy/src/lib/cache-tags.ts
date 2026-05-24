export const STRAINS_TAG = "strains";
export const SHOP_SETTINGS_TAG = "shop-settings";
export const AREAS_TAG = "areas";

export function getAreaTag(slug: string): string {
  return `area:${slug}`;
}
