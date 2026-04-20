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
    const url = `${BACKEND}/internal/${path}`;
    
    const res = await fetch(url, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": process.env.ADMIN_SECRET_KEY || "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.headers.get("content-type")?.includes("text/event-stream")) {
       // Handle streaming if needed, but for now we'll just return the status
       return new Response(res.body, { headers: res.headers });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const url = `${BACKEND}/internal/${path}`;
    
    const res = await fetch(url, {
      headers: {
        "x-admin-key": process.env.ADMIN_SECRET_KEY || "",
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
