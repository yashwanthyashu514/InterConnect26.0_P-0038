import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "imperio-admin-2025")) {
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

    return NextResponse.json({
      revenue_ledger: revenue,
      summary: {
        total_revenue_paise: totalRevenue,
        total_gtv_paise: totalGTV,
        booking_count: bookings?.length || 0,
        paid_count: bookings?.filter(b => b.status === "paid").length || 0
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
