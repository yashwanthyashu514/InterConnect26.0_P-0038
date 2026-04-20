import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!cleanEmail || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 1. Fetch user
    const { data: user, error } = await supabase
      .from("marketplace_users")
      .select("*")
      .eq("email", cleanEmail)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. For CA, check KYC status
    let kycStatus = "approved";
    if (user.role === "ca") {
      const { data: profile } = await supabase
        .from("ca_profiles")
        .select("kyc_status")
        .eq("user_id", user.id)
        .single();
      
      kycStatus = profile?.kyc_status || "pending";
    }

    // 4. Generate JWT
    const token = await signJWT({
      user_id: user.id,
      email: user.email,
      role: user.role,
      kyc_status: kycStatus
    });

    // 5. Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24h
      path: "/"
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        kyc_status: kycStatus
      }
    });

  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
