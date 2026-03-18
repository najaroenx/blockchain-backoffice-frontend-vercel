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
  ...(shouldProtectDLT
    ? [/^\/dlt\/merchant(\/|$)/, /^\/dlt\/seller(\/|$)/]
    : []),
];

// Auth pages - redirect away if already authenticated
const authRedirectRoutes = new Set([
  "/dlt/sign-in",
  "/dlt/sign-up",
]);

const clearAuthCookies = (response: NextResponse) => {
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  cookieNames.forEach((cookieName) => {
    response.cookies.set(cookieName, "", { maxAge: 0, path: "/" });
  });

  return response;
};

const isTokenExpired = (token: { data?: { valid_until?: number } }): boolean => {
  const exp = token?.data?.valid_until;
  return exp !== undefined && Date.now() >= exp * 1000;
};

// Helper to determine the correct sign-in page based on the route
const getSignInPage = (path: string): string => {
  if (path.startsWith("/dlt/")) {
    return "/dlt/sign-in";
  }
  return "/dlt/sign-in";
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
  const shouldRedirectWhenAuthenticated = authRedirectRoutes.has(path);
  const signInPage = getSignInPage(path);
  const isAuthPage = authRedirectRoutes.has(path);

  // Handle expired token
  if (token && isTokenExpired(token)) {
    if (isAuthPage) {
      return clearAuthCookies(NextResponse.next());
    }

    return clearAuthCookies(
      NextResponse.redirect(new URL(signInPage, req.nextUrl)),
    );
  }

  // If trying to access protected routes without a valid token
  if (isProtectedRoute && !token) {
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
  matcher: [String.raw`/((?!api|_next/static|_next/image|.*\.png$).*)`],
};
