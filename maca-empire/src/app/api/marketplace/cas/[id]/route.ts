import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("ca_profiles")
      .select(`
        *,
        marketplace_users (
          name,
          email
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    const { bank_account_number_enc, bank_ifsc, ...safeProfile } = (data ?? {}) as Record<string, unknown>;
    const ifsc = typeof bank_ifsc === "string" ? bank_ifsc : "";

    return NextResponse.json({
      ca: {
        ...safeProfile,
        bank_ifsc_masked: ifsc ? `${ifsc.slice(0, 4)}XXXXXXX` : null,
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
