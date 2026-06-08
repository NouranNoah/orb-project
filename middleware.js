import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./src/lib/locales.js";
import { authRedirect } from "./src/proxy";

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.includes("firebase-messaging-sw.js")) {
    return NextResponse.next();
  }

  // 0) طلبات _next و next/image: المتصفح بيطلبها كـ /en/_next/... فنحوّلها لـ /_next/...
  if (pathname.match(/^\/(ar|en)\/_next\//) || pathname === "/en/_next/image" || pathname === "/ar/_next/image") {
    const newPath = pathname.replace(/^\/(ar|en)\//, "/");
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.rewrite(url);
  }

  // 0.1) صور وأيقونات: لو الطلب جاي كـ /en/images/... أو /en/favicon.svg أو /en/logo.svg نحوّلها للجذر
  if (pathname.match(/^\/(ar|en)\/(images\/|favicon\.svg|logo\.svg)/)) {
    const newPath = pathname.replace(/^\/(ar|en)\//, "/");
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.rewrite(url);
  }

  // 1) حماية الروت: لو مفيش توكن أو الرول غلط → redirect
  const redirect = authRedirect(request);
  if (redirect) return redirect;

  // 2) بعدين next-intl (اللغة والمسارات)
  return nextIntlMiddleware(request);
}

// export const config = {
//   matcher: [
//     "/((?!api|_next|_vercel|favicon.svg|icons|images|.*\\..*).*)",
//   ],
// };
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // لازم نغطي طلبات الصور واللوجو كـ /en/logo.svg و /en/images/... عشان الـ rewrite يشتغل
    "/(ar|en)/logo.svg",
    "/(ar|en)/favicon.svg",
    "/(ar|en)/images/:path*",
  ],
};


// export const config = {
//   matcher: [
//     "/(ar|en)/((?!_next|favicon.ico|images).*)",
//   ],
// };
