import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "maca-empire-secure-2025-p-0038"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  if (pathname.startsWith("/api/rag")) {
    console.log(`[TEST_MODE] Bypassing rate limit for RAG: ${pathname}`);
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (_err: unknown) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/ca-dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;
      const kycStatus = payload.kyc_status;

      if (role !== "ca") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (kycStatus !== "approved") {
        return NextResponse.redirect(new URL("/ca-onboarding?kyc=pending", request.url));
      }
    } catch (_err: unknown) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/ca-dashboard/:path*", "/booking/:path*", "/hire-a-ca/:path*"],
};
