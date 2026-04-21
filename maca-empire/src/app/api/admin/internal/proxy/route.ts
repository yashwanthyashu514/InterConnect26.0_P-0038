import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path, method, body } = await req.json();
    const BACKEND = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    const adminKey = process.env.ADMIN_SECRET_KEY || "";
    const url = `${BACKEND}/internal/${path}`;
    
    // Inject admin_key into body — required by FastAPI InternalChatRequest model
    const enrichedBody = body ? { ...body, admin_key: adminKey } : { admin_key: adminKey };

    const res = await fetch(url, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify(enrichedBody),
    });

    if (res.headers.get("content-type")?.includes("text/event-stream")) {
       return new Response(res.body, { headers: res.headers });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "No path" }, { status: 400 });

  try {
    const BACKEND = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    const adminKey = process.env.ADMIN_SECRET_KEY || "";
    // Inject admin_key as query param — required by FastAPI GET route handlers
    const url = `${BACKEND}/internal/${path}?admin_key=${encodeURIComponent(adminKey)}`;
    
    const res = await fetch(url, {
      headers: {
        "x-admin-key": adminKey,
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
