import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: "Manual admin KYC action is disabled. CA verification is fully automatic via ICAI/Surepass during registration."
    },
    { status: 410 }
  );
}
