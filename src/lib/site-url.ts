const DEFAULT_SITE_URL = "https://labscannabis.com";

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return DEFAULT_SITE_URL;
  return normalizeUrl(configuredUrl);
}
