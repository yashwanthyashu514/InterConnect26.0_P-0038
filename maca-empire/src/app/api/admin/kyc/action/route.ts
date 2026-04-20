import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { profile_id, action, reason } = await req.json();
    const adminKey = req.headers.get("x-admin-key");

    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "imperio-admin-2025")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!profile_id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const kyc_status = action === "approve" ? "approved" : "rejected";

    // 1. Update Profile
    const { data: profile, error: profileError } = await supabase
      .from("ca_profiles")
      .update({ kyc_status })
      .eq("id", profile_id)
      .select()
      .single();

    if (action === "approve") {
      await supabase
        .from("marketplace_users")
        .update({ role: "ca" }) // Or 'ca_approved' if I had updated the constraint
        .eq("id", profile.user_id);
    }

    // 2. Create Notification for CA
    await supabase
      .from("marketplace_notifications")
      .insert({
        recipient_id: profile.user_id,
        type: action === "approve" ? "ca_accepted" : "ca_declined",
        message: action === "approve" 
          ? "Your CA profile has been approved! You are now listed in the marketplace." 
          : `Your CA profile was rejected. Reason: ${reason || "Incomplete documentation"}`
      });

    return NextResponse.json({ message: `CA ${kyc_status} successfully` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
