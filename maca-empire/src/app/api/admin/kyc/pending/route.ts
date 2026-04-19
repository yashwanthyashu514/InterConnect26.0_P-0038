import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminKey = req.headers.get("x-admin-key");

    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "imperio-admin-2025")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("ca_profiles")
      .select(`
        *,
        marketplace_users (
          name,
          email,
          phone
        )
      `)
      .eq("kyc_status", "pending");

    if (error) throw error;

    return NextResponse.json({ queue: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
