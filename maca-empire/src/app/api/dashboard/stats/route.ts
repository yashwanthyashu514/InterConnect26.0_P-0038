import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/dashboard/stats`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
        // Fallback if backend is down
        return NextResponse.json({
            market: { status: "offline" },
            telemetry: {
                vault_docs: 0,
                kb_nodes: 0,
                legal_precedents: 0,
                uptime: "0%",
                latency: "N/A",
                kernel: "V3.2.0-Production",
                last_sync: "N/A"
            },
            stream: []
        });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard Service Proxy Error:", error);
    return NextResponse.json({ error: "Backend Unreachable" }, { status: 503 });
  }
}
