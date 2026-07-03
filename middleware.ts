import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = new Set(["/", "/_next/static", "/_next/image", "/favicon.ico", "/assets"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow public paths
  if (publicPaths.has(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // admin — allow through (server-side check happens in the page)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // patient routes — require session cookie
  if (pathname.startsWith("/patients")) {
    const sessionToken = request.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
