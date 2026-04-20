import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; // Service role key for admin ops
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, password, name, role, icai_number, specialty } = await req.json();

    // Neural Email Validation
    const cleanEmail = email?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid integrity detected: Please provide a valid work email address." }, { status: 400 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Handled by upsert logic below (Account Upgrade)

    // 2. Hash password (if new user) or use existing if we wanted to sync (but user wants 'register again' feel)
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create or Upgrade user persona (Database)
    const { data: user, error: userError } = await supabase
      .from("marketplace_users")
      .upsert({
        name,
        email: cleanEmail,
        password_hash: passwordHash,
        role: role
      }, { onConflict: 'email' })
      .select()
      .single();

    if (userError) throw userError;

    // 4. Provision Login Credentials (Identity Engine)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: { name, role }
    });

    if (authError && !authError.message.includes("already registered")) {
       console.error("Identity Engine Failure:", authError.message);
       return NextResponse.json({ error: `Auth Error: ${authError.message}. Ensure SERVICE_ROLE_KEY is valid.` }, { status: 500 });
    }

    // 5. If CA, create profile and verify via Surepass immediately
    if (role === "ca" && icai_number) {
      let isApproved = false;
      let rejectionReason = "";

      // SUREPASS ICAI VERIFICATION
      try {
        const surepassBase = process.env.SUREPASS_API_BASE_URL || 'https://sandbox.surepass.app';
        const surepassToken = process.env.SUREPASS_BEARER_TOKEN;
        
        if (!surepassToken) {
           console.warn("No Surepass API Token found. Proceeding as 'pending'.");
        } else {
          const spRes = await fetch(`${surepassBase}/api/v1/corporate/icai`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${surepassToken}`
            },
            body: JSON.stringify({ id_number: icai_number })
          });

          if (spRes.ok) {
            const spData = await spRes.json();
            // In the sandbox, if it's successful, we approve it automatically
            if (spData.success !== false) {
              isApproved = true;
            } else {
              rejectionReason = spData.message || "Surepass Identity Mismatch";
            }
          } else {
             const spError = await spRes.json();
             rejectionReason = spError.message || "Invalid ICAI Number";
          }
        }
      } catch (spErr: unknown) {
        console.error("Surepass API Network Error during registration:", spErr);
        // Fallback to pending if network drops
      }

      const finalKycStatus = isApproved ? "approved" : (rejectionReason ? "rejected" : "pending");

      const { error: profileError } = await supabase
        .from("ca_profiles")
        .insert({
          user_id: user.id,
          icai_registration_no: icai_number,
          specialties: specialty ? [specialty] : [],
          kyc_status: finalKycStatus
        });

      if (profileError) throw profileError;

      if (finalKycStatus === "rejected") {
        return NextResponse.json({ error: `ICAI Verification Failed: ${rejectionReason}` }, { status: 400 });
      } else if (finalKycStatus === "approved") {
        return NextResponse.json({ message: "Registration successful. ICAI Verified Automatically.", status: "approved" }, { status: 201 });
      }
    }

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
