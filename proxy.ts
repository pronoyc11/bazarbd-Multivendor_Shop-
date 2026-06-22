import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // JWT token সরাসরি cookie থেকে পড়া
  const token = await getToken({
    req: request,
    secret: authSecret,
  });

  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  const isVendorRoute = pathname.startsWith("/vendor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Login করা User → Login/Register → Homepage
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Vendor route → Login নেই → Login page
  if (isVendorRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Vendor route → BUYER role → Homepage
  if (
    isVendorRoute &&
    isLoggedIn &&
    userRole !== "VENDOR" &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin route → ADMIN নেই → Homepage
  if (isAdminRoute && (!isLoggedIn || userRole !== "ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vendor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
