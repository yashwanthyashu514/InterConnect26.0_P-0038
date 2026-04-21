import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profile_id, action, reason } = await req.json();

    const kyc_status = action === "approve" ? "approved" : "rejected";
    
    const { error } = await supabase
      .from("ca_profiles")
      .update({ 
        kyc_status,
        last_modified_by: session.user_id,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile_id);

    if (error) throw error;

    return NextResponse.json({ 
      status: "success", 
      message: `CA Profile successfully ${kyc_status}.` 
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
