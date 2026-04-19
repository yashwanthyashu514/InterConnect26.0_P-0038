import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "maca-empire-secure-2025-p-0038"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // --- TEMPORARY TESTING MODE: AUTH DISABLED ---
  /*
  // 1. Admin Guard (Special Case for Imperio Executive agents)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminKey = request.cookies.get("admin_key")?.value;
    const expected = process.env.ADMIN_SECRET_KEY || "imperio-admin-2025";
    if (!adminKey || adminKey !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. Marketplace Role Guards
  const protectedPaths = ["/dashboard", "/ca-dashboard", "/booking", "/hire-a-ca"];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      if (pathname.startsWith("/ca-dashboard") && role !== "ca") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if ((pathname.startsWith("/dashboard") || pathname.startsWith("/hire-a-ca")) && role !== "user") {
        return NextResponse.redirect(new URL("/ca-dashboard", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  */

  // 3. RAG Rate Limiting (F7)
  if (pathname.startsWith("/api/rag")) {
    // if (!token) return NextResponse.json({ error: "Auth required for RAG" }, { status: 401 });
    console.log(`[TEST_MODE] Bypassing rate limit for RAG: ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/ca-dashboard/:path*", "/booking/:path*", "/hire-a-ca/:path*"],
};
