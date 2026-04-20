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

    // 1. Get CA Profile to check ICAI number
    const { data: profileToVerify, error: getError } = await supabase
      .from("ca_profiles")
      .select("user_id, icai_registration_no")
      .eq("id", profile_id)
      .single();

    if (getError || !profileToVerify) {
      return NextResponse.json({ error: "CA Profile not found." }, { status: 404 });
    }

    // =========================================================================
    // SUREPASS CORPORATE ICAI VERIFICATION
    // =========================================================================
    if (action === "approve") {
      try {
        const surepassBase = process.env.SUREPASS_API_BASE_URL || 'https://sandbox.surepass.app';
        const surepassToken = process.env.SUREPASS_BEARER_TOKEN;
        
        if (!surepassToken) {
           console.warn("No Surepass API Token found. Skipping live verification and bypassing by default in dev.");
        } else {
          // Fire request to Surepass
          const spRes = await fetch(`${surepassBase}/api/v1/corporate/icai`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${surepassToken}`
            },
            body: JSON.stringify({ id_number: profileToVerify.icai_registration_no })
          });

          // Handle response
          if (!spRes.ok) {
            const spError = await spRes.json();
            return NextResponse.json({ error: `Surepass Verification Failed: ${spError.message || "Invalid ICAI Number"}` }, { status: 400 });
          }

          const spData = await spRes.json();
          // Assuming Surepass sandbox returns `{ success: true, data: { ... }}`
          if (spData.success === false) {
             return NextResponse.json({ error: `Surepass Identity Mismatch: ${spData.message}` }, { status: 400 });
          }
        }
      } catch (spErr: unknown) {
        console.error("Surepass API Network Error:", spErr);
        return NextResponse.json({ error: "External verification service (Surepass) is currently unreachable." }, { status: 502 });
      }
    }

    const kyc_status = action === "approve" ? "approved" : "rejected";

    // 2. Update Profile State
    const { data: profile, error: profileError } = await supabase
      .from("ca_profiles")
      .update({ kyc_status })
      .eq("id", profile_id)
      .select()
      .single();

    if (action === "approve") {
      await supabase
        .from("marketplace_users")
        .update({ role: "ca" })
        .eq("id", profile.user_id);
    }

    // 3. Create Notification for CA
    await supabase
      .from("marketplace_notifications")
      .insert({
        recipient_id: profile.user_id,
        type: action === "approve" ? "ca_accepted" : "ca_declined",
        message: action === "approve" 
          ? "Your CA profile has been approved! You are now listed in the marketplace." 
          : `Your CA profile was rejected. Reason: ${reason || "Incomplete documentation or ICAI Verification Failed."}`
      });

    return NextResponse.json({ message: `CA ${kyc_status} successfully` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
