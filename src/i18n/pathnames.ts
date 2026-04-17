import { isValidLocale, type AppLocale } from "./config";

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "/";
  }

  if (isValidLocale(segments[0])) {
    const nextSegments = segments.slice(1);
    return nextSegments.length > 0 ? `/${nextSegments.join("/")}` : "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildLocalizedPathname(pathname: string, locale: AppLocale): string {
  const unlocalizedPathname = stripLocaleFromPathname(pathname);
  return unlocalizedPathname === "/" ? `/${locale}` : `/${locale}${unlocalizedPathname}`;
}
