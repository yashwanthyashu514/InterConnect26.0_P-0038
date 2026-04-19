import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; // Service role key for admin ops
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, password, name, role, icai_number, specialty } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from("marketplace_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user
    // Requirements: User, CA, or Developer
    let dbRole = "user";
    if (role === "ca") dbRole = "ca";
    if (role === "developer") dbRole = "developer";
    
    const { data: user, error: userError } = await supabase
      .from("marketplace_users")
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role: dbRole
      })
      .select()
      .single();

    if (userError) throw userError;

    // 4. If CA, create profile
    if (role === "ca" && icai_number) {
      const { error: profileError } = await supabase
        .from("ca_profiles")
        .insert({
          user_id: user.id,
          icai_registration_no: icai_number,
          specialties: specialty ? [specialty] : [],
          kyc_status: "pending"
        });

      if (profileError) throw profileError;
    }

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
