import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const shouldProtectPortal =
  (process.env.PORTAL_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

const protectedRoutePatterns = [
  ...(shouldProtectAdmin ? [/^\/admin(\/|$)/] : []),
  ...(shouldProtectPortal ? [/^\/portal(\/|$)/] : []),
];
const authRedirectRoutes = ["/auth/sign-in", "/auth/sign-up"];

const isTokenExpired = (token: any): boolean => {
  return Date.now() >= token?.data.valid_until * 1000;
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
    const response = NextResponse.redirect(
      new URL("/auth/sign-in", req.nextUrl)
    );

    // Clear session cookies
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });

    return response;
  }

  // If trying to access protected routes without a valid token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
  }

  // Redirect logged-in users away from auth routes
  if (shouldRedirectWhenAuthenticated && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
