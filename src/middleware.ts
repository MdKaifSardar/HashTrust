import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const isUserDashboard = pathname.startsWith("/pages/user/dashboard");
  const isOrgDashboard = pathname.startsWith("/pages/organisation/dashboard");
  const isAuthPage = pathname.startsWith("/pages/auth");

  // 1. Guard User Dashboard
  if (isUserDashboard && !session) {
    const loginUrl = new URL("/pages/auth/login/user", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Guard Organisation Dashboard
  if (isOrgDashboard && !session) {
    const loginUrl = new URL("/pages/auth/login/organisation", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent Authenticated Users from Accessing Login/Signup
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/user/dashboard/:path*",
    "/pages/organisation/dashboard/:path*",
    "/pages/auth/:path*",
  ],
};
