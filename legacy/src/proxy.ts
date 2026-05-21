import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localeMatcher, removedLocaleMatcher } from "./i18n/config";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);
const studioPathname = "/studio";
const localizedStudioPathname = new RegExp(
  `^/(${localeMatcher})(?=${studioPathname}(?:/|$))`,
  "i",
);
const removedLocalePathname = new RegExp(
  `^/(${removedLocaleMatcher})(?=/|$)`,
  "i",
);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === studioPathname || pathname.startsWith(`${studioPathname}/`)) {
    return NextResponse.next();
  }

  const localizedStudioMatch = pathname.match(localizedStudioPathname);

  if (localizedStudioMatch) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(localizedStudioMatch[0].length) || studioPathname;

    return NextResponse.redirect(url, 308);
  }

  const removedLocaleMatch = pathname.match(removedLocalePathname);

  if (removedLocaleMatch) {
    const url = request.nextUrl.clone();
    const remainder = pathname.slice(removedLocaleMatch[0].length);
    url.pathname = `/${defaultLocale}${remainder}`;

    return NextResponse.redirect(url, 301);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
