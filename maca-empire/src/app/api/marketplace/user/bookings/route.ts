import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        ca_profiles!bookings_ca_id_fkey (
          marketplace_users!ca_profiles_user_id_fkey (
            name
          )
        )
      `)
      .eq("user_id", session.user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ bookings: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
