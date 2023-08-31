import { NextResponse } from "next/server";
import { locales as localesArray } from "./lib/locales";
import { MiddlewareRequest } from "@netlify/next";

let locales = localesArray.map((language) => language.lang);
const defaultLocale = locales[0];

export async function middleware(req) {
  let pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.search;
  const locale = pathname.split("/")[1];

  const middlewareRequest = new MiddlewareRequest(req);

  // Check if the default locale is in the pathname
  if (defaultLocale === locale) {
    console.log("default locale: ", defaultLocale, "locale: ", locale, "they are equal");
    // we remove locale if pathname contains default locale, by redirecting
    if (pathname.startsWith(`/${locale}/`)) {
      console.log("pathname starts with /locale/ (because it has another param), so '/locale' will be replaced");
      // if pathname has subpath, remove "/locale", eg. from "/ca/something" to "/something"
      return NextResponse.redirect(new URL(`${pathname.replace(`/${locale}`, "")}${searchParams}`, req.url));
    } else {
      console.log(
        "pathname doesn't start with /locale/ (because it only contains the locale param), so 'locale' will be replaced"
      );
      // if it doesn't, remove "locale", eg. from "/ca to "/"
      return NextResponse.redirect(new URL(`${pathname.replace(`${locale}`, "")}${searchParams}`, req.url));
    }
  }

  const pathnameIsMissingValidLocale = locales.every((locale) => {
    // If pathname isn't "/ca" and doesn't contain "/ca/", then it isn't valid
    return pathname !== `/${locale}` && !pathname.startsWith(`/${locale}/`);
  });

  if (pathnameIsMissingValidLocale) {
    console.log(
      `pathname has no valid locale, thus it will be rewriten. page shown '/${defaultLocale}${pathname}', browser url '${pathname}'`
    );
    // Remove trailing slash
    if (pathname === "/") pathname = "";
    // we rewrite pathnames without valid locale: visit `/ca`, but browser url shows `/`
    // Incoming request: "/hello"
    // Rewritten request: page shown "/en/hello", browser url "/hello"
    return middlewareRequest.rewrite(
      // Note: Pathname already includes "/"
      new URL(`/${defaultLocale}${pathname}${searchParams}`, req.url)
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
