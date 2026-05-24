import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localeMatcher, removedLocaleMatcher } from "./i18n/config";
import { routing } from "./i18n/routing";
import {
  UTM_CAMPAIGN_COOKIE,
  UTM_COOKIE_MAX_AGE,
  UTM_SOURCE_COOKIE,
} from "./lib/utm-constants";

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

function cleanUtmValue(value: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/[\[\]\n\r]/g, "").slice(0, 80);
}

function withUtmCookies(response: NextResponse, request: NextRequest): NextResponse {
  const source = cleanUtmValue(request.nextUrl.searchParams.get("utm_source"));
  const campaign = cleanUtmValue(request.nextUrl.searchParams.get("utm_campaign"));

  if (source) {
    response.cookies.set(UTM_SOURCE_COOKIE, source, {
      maxAge: UTM_COOKIE_MAX_AGE,
      sameSite: "lax",
      path: "/",
    });

    if (campaign) {
      response.cookies.set(UTM_CAMPAIGN_COOKIE, campaign, {
        maxAge: UTM_COOKIE_MAX_AGE,
        sameSite: "lax",
        path: "/",
      });
    } else {
      response.cookies.set(UTM_CAMPAIGN_COOKIE, "", {
        maxAge: 0,
        sameSite: "lax",
        path: "/",
      });
    }
  }

  return response;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === studioPathname || pathname.startsWith(`${studioPathname}/`)) {
    return withUtmCookies(NextResponse.next(), request);
  }

  const localizedStudioMatch = pathname.match(localizedStudioPathname);

  if (localizedStudioMatch) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(localizedStudioMatch[0].length) || studioPathname;

    return withUtmCookies(NextResponse.redirect(url, 308), request);
  }

  const removedLocaleMatch = pathname.match(removedLocalePathname);

  if (removedLocaleMatch) {
    const url = request.nextUrl.clone();
    const remainder = pathname.slice(removedLocaleMatch[0].length);
    url.pathname = `/${defaultLocale}${remainder}`;

    return withUtmCookies(NextResponse.redirect(url, 301), request);
  }

  return withUtmCookies(handleI18nRouting(request), request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
