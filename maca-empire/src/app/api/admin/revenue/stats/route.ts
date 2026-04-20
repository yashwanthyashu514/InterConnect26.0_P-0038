import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";
import { logAdminAudit } from "@/lib/admin-audit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch all revenue logs
    const { data: revenue } = await supabase
      .from("platform_revenue")
      .select("*")
      .order("created_at", { ascending: true });

    // 2. Fetch booking stats
    const { data: bookings } = await supabase
      .from("bookings")
      .select("status, amount_paise");

    const totalRevenue = revenue?.reduce((acc, r) => acc + r.amount, 0) || 0;
    const totalGTV = bookings?.filter(b => b.status === "paid" || b.status === "completed").reduce((acc, b) => acc + b.amount_paise, 0) || 0;

    const response = {
      revenue_ledger: revenue,
      summary: {
        total_revenue_paise: totalRevenue,
        total_gtv_paise: totalGTV,
        booking_count: bookings?.length || 0,
        paid_count: bookings?.filter(b => b.status === "paid").length || 0
      }
    };

    await logAdminAudit({
      adminUserId: String(session.user_id ?? ""),
      action: "admin.revenue_stats.read",
      metadata: { booking_count: response.summary.booking_count },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json(response);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
