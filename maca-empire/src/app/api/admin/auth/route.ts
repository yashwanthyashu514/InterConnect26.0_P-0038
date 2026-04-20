import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use role-based login via /login and JWT session." },
    { status: 410 }
  );
}
