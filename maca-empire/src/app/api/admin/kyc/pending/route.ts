import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: queue, error } = await supabase
      .from("ca_profiles")
      .select("*, marketplace_users(name, email, phone)")
      .eq("kyc_status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      queue: queue || [],
      count: queue?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
