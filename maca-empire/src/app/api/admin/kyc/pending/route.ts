import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    queue: [],
    message: "Manual admin KYC queue is disabled. CA verification is automatic at registration."
  });
}
