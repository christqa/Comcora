import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "@/i18n-config";
import { i18nRouter } from "next-i18n-router";

export function middleware(request: NextRequest) {
  const isAuthenticated = Boolean(request.cookies.get("TBB_SID"));

  const { pathname } = request.nextUrl;

  if (pathname.includes("/private") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return i18nRouter(request, i18n);
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
