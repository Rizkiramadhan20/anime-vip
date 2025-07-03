import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/signin",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
];

// List of auth pages that should redirect authenticated users
const authPages = ["/signin", "/signup", "/verify-email"];

// List of paths that require email verification
const requireEmailVerification = [
  "/anime",
  "/dashboard",
  "/profile",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has("session");

  // If user is logged in and tries to access auth pages
  if (hasSessionCookie && authPages.includes(pathname)) {
    try {
      // Verify session
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();

      if (data.authenticated) {
        // If authenticated, redirect to anime page
        return NextResponse.redirect(new URL("/anime", request.url));
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      // If there's an error, clear the session and redirect to signin
      const response = NextResponse.redirect(new URL("/anime", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // If user is logged in but tries to access pages that require email verification
  if (
    hasSessionCookie &&
    requireEmailVerification.some((path) => pathname.startsWith(path))
  ) {
    try {
      // Verify session and check email verification status
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();

      if (data.authenticated && !data.user?.emailVerified) {
        // If authenticated but email not verified, redirect to verification page
        return NextResponse.redirect(
          new URL(
            `/verify-email?email=${encodeURIComponent(data.user?.email || "")}`,
            request.url
          )
        );
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
      // If there's an error, redirect to signin
      return NextResponse.redirect(new URL("/anime", request.url));
    }
  }

  // If user is not logged in and tries to access protected routes
  if (
    !hasSessionCookie &&
    !publicPaths.includes(pathname) &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/anime/") &&
    !pathname.startsWith("/donghua/") &&
    !pathname.startsWith("/manga/")
  ) {
    // Tidak melakukan redirect, biarkan request berjalan normal
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
