import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; // Service role key for admin ops
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      name,
      phone,
      role,
      icai_number,
      specialty,
      specialties,
      bio,
      listed_price_inr,
      bank_account_number,
      bank_ifsc,
    } = await req.json();

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
        phone: typeof phone === "string" ? phone : null,
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
      let kycReferenceId = "";

      // SUREPASS ICAI VERIFICATION
      try {
        const surepassBase = process.env.SUREPASS_API_BASE_URL || 'https://sandbox.surepass.app';
        const surepassToken = process.env.SUREPASS_BEARER_TOKEN;
        
        if (!surepassToken) {
           return NextResponse.json(
             { error: "Automatic ICAI verification is currently unavailable. Please try again later." },
             { status: 503 }
           );
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
            kycReferenceId =
              typeof spData?.request_id === "string"
                ? spData.request_id
                : typeof spData?.id === "string"
                  ? spData.id
                  : "";
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
        return NextResponse.json(
          { error: "Automatic ICAI verification service is unreachable. Please retry." },
          { status: 503 }
        );
      }

      const finalKycStatus = isApproved ? "approved" : "rejected";

      const normalizedSpecialties: string[] = Array.isArray(specialties)
        ? specialties.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
        : (typeof specialty === "string" && specialty.trim().length > 0 ? [specialty] : []);

      const listedPricePaise =
        typeof listed_price_inr === "number" && Number.isFinite(listed_price_inr)
          ? Math.max(0, Math.round(listed_price_inr * 100))
          : 300000;

      const caProfilePayload: Record<string, unknown> = {
        user_id: user.id,
        icai_registration_no: icai_number,
        specialties: normalizedSpecialties,
        bio: typeof bio === "string" ? bio : null,
        listed_price_paise: listedPricePaise,
        bank_account_number_enc:
          typeof bank_account_number === "string" && bank_account_number.trim().length > 0
            ? bank_account_number.trim()
            : null,
        bank_ifsc: typeof bank_ifsc === "string" ? bank_ifsc.trim().toUpperCase() : null,
        kyc_status: finalKycStatus,
        kyc_provider: "surepass",
        kyc_reference_id: kycReferenceId || null,
        kyc_verified_at: finalKycStatus === "approved" ? new Date().toISOString() : null,
        kyc_reason: finalKycStatus === "rejected" ? (rejectionReason || "ICAI verification failed") : null
      };

      const { data: existingProfile } = await supabase
        .from("ca_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let profileError = null;
      if (existingProfile?.id) {
        const { error } = await supabase
          .from("ca_profiles")
          .update(caProfilePayload)
          .eq("id", existingProfile.id);
        profileError = error;
      } else {
        const { error } = await supabase
          .from("ca_profiles")
          .insert(caProfilePayload);
        profileError = error;
      }

      if (profileError) throw profileError;

      if (finalKycStatus !== "approved") {
        return NextResponse.json({ error: `ICAI Verification Failed: ${rejectionReason}` }, { status: 400 });
      }

      return NextResponse.json({ message: "Registration successful. ICAI Verified Automatically.", status: "approved" }, { status: 201 });
    }

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
