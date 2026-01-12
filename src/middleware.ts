import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const shouldProtectPortal =
  (process.env.PORTAL_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";
const shouldProtectDLT =
  (process.env.DLT_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Routes that require authentication
const protectedRoutePatterns = [
  ...(shouldProtectAdmin ? [/^\/admin(\/|$)/] : []),
  ...(shouldProtectPortal ? [/^\/portal(\/|$)/] : []),
  ...(shouldProtectDLT ? [/^\/dlt\/merchant(\/|$)/] : []),
];

// Auth pages - redirect away if already authenticated
const authRedirectRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/dlt/sign-in",
  "/dlt/sign-up",
];

const isTokenExpired = (token: any): boolean => {
  return Date.now() >= token?.data.valid_until * 1000;
};

// Helper to determine the correct sign-in page based on the route
const getSignInPage = (path: string): string => {
  if (path.startsWith("/dlt/")) {
    return "/dlt/sign-in";
  }
  return "/auth/sign-in";
};

// Helper to determine the redirect destination after login
const getPostLoginRedirect = (path: string): string => {
  if (path.startsWith("/dlt/")) {
    return "/dlt";
  }
  return "/";
};

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutePatterns.some((pattern) =>
    pattern.test(path)
  );
  const shouldRedirectWhenAuthenticated = authRedirectRoutes.includes(path);

  // Handle expired token
  if (token && isTokenExpired(token)) {
    const signInPage = getSignInPage(path);
    const response = NextResponse.redirect(new URL(signInPage, req.nextUrl));

    // Clear session cookies
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });

    return response;
  }

  // If trying to access protected routes without a valid token
  if (isProtectedRoute && !token) {
    const signInPage = getSignInPage(path);
    return NextResponse.redirect(new URL(signInPage, req.nextUrl));
  }

  // Redirect logged-in users away from auth routes
  if (shouldRedirectWhenAuthenticated && token) {
    const redirectTo = getPostLoginRedirect(path);
    return NextResponse.redirect(new URL(redirectTo, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
