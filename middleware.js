import { NextResponse } from "next/server";
import { locales as localesArray } from "./lib/locales";
import { MiddlewareRequest } from "@netlify/next";

let locales = localesArray.map((language) => language.lang);
const defaultLocale = locales[0];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.search;
  const locale = pathname.split("/")[1];

  const middlewareRequest = new MiddlewareRequest(req);

  // Check if the default locale is in the pathname
  if (defaultLocale === locale) {
    console.log("remove default locale");
    // we remove locale if pathname contains default locale, by redirecting
    if (pathname.startsWith(`/${locale}/`)) {
      // if pathname has subpath, remove "/locale", eg. from "/ca/something" to "/something"
      return NextResponse.redirect(new URL(`${pathname.replace(`/${locale}`, "")}${searchParams}`, req.url));
    } else {
      // if it doesn't, remove "locale", eg. from "/ca to "/"
      return NextResponse.redirect(new URL(`${pathname.replace(`${locale}`, "")}${searchParams}`, req.url));
    }
  }

  const pathnameIsMissingValidLocale = locales.every((locale) => {
    return !pathname.startsWith(`/${locale}`);
  });

  if (pathnameIsMissingValidLocale) {
    console.log("hide default locale, but add it", new URL("/ca", req.url));
    // we rewrite pathnames without valid locale: visit `/ca`, but browser url shows `/`
    // Incoming request: "/hello"
    // Rewritten request: page shown "/en/hello", browser url "/hello"
    return middlewareRequest.rewrite(
      // Pathname already includes "/"
      new URL("/ca", req.url)
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|admin|_next/static|_next/image|assets|favicon.ico|under-development.svg|public).*)",
  ],
};
