import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "ca") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("ca_profiles")
      .select("id")
      .eq("user_id", session.user_id)
      .single();

    if (!profile) return NextResponse.json({});

    // Fetch all paid/completed bookings for this CA
    const { data: bookings } = await supabase
      .from("bookings")
      .select("ca_payout_paise, status")
      .eq("ca_id", profile.id)
      .in("status", ["paid", "completed"]);

    const total_earned = bookings?.reduce((acc, b) => acc + (b.ca_payout_paise || 0), 0) || 0;
    const pending_payout = bookings?.filter(b => b.status === "paid").reduce((acc, b) => acc + (b.ca_payout_paise || 0), 0) || 0;

    return NextResponse.json({
      total_earned_paise: total_earned,
      pending_payout_paise: pending_payout,
      session_count: bookings?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
