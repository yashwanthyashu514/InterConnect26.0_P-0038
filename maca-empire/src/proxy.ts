import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/rag")) {
    console.log(`[TEST_MODE] Bypassing rate limit for RAG: ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/ca-dashboard/:path*", "/booking/:path*", "/hire-a-ca/:path*"],
};
