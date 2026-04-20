import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "ca" || session.kyc_status !== "approved") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get CA Profile ID first
    const { data: profile } = await supabase
      .from("ca_profiles")
      .select("id")
      .eq("user_id", session.user_id)
      .single();

    if (!profile) return NextResponse.json({ bookings: [] });

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        marketplace_users!bookings_user_id_fkey (
          name,
          email
        )
      `)
      .eq("ca_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ bookings: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
