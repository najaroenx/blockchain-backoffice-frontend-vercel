import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/"];
const publicRoutes = ["/auth/login", "/auth/register"];

const isTokenExpired = (token: any): boolean => {
  // console.log(Date.now(), token.data.exp * 1000);
  return Date.now() >= token?.data.valid_until * 1000;
};

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Handle expired token
  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL("/auth/login", req.nextUrl));

    // Clear session cookies
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });

    return response;
  }

  // If trying to access protected routes without a valid token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // Redirect logged-in users away from public routes (except the home page)
  if (isPublicRoute && token && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
