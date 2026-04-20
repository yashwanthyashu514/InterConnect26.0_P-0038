import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  try {
    const BACKEND = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${BACKEND}/internal/alerts/count`, {
      headers: {
        "x-admin-key": process.env.ADMIN_SECRET_KEY || "",
      }
    });

    const data = await res.json();
    return NextResponse.json({ count: data.count || 0 });

  } catch {
    return NextResponse.json({ count: 0 });
  }
}
