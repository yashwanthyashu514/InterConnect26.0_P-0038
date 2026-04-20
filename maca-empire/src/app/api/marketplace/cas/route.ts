import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get("specialty");

    let query = supabase
      .from("ca_profiles")
      .select(`
        *,
        marketplace_users (
          name,
          email
        )
      `)
      .eq("kyc_status", "approved");

    if (specialty && specialty !== "All") {
      query = query.contains("specialties", [specialty]);
    }

    const { data, error } = await query;

    if (error) throw error;

    const sanitized = (data ?? []).map((row: Record<string, unknown>) => {
      const { bank_account_number_enc, bank_ifsc, ...rest } = row;
      const ifsc = typeof row.bank_ifsc === "string" ? row.bank_ifsc : "";
      return {
        ...rest,
        bank_ifsc_masked: ifsc ? `${ifsc.slice(0, 4)}XXXXXXX` : null,
      };
    });

    return NextResponse.json({ cas: sanitized });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
