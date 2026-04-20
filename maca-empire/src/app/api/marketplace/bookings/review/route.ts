import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking_id, ca_id, rating, comment } = await req.json();

    // 1. Insert review
    const { error: reviewError } = await supabase
      .from("reviews")
      .insert({
        booking_id,
        user_id: session.user_id,
        ca_id,
        rating,
        comment
      });

    if (reviewError) throw reviewError;

    // 2. Update CA rating (simplified update logic)
    // In a real app, I'd calculate avg, but for now I'll just increment review count
    await supabase.rpc("increment_ca_reviews", { ca_id_input: ca_id, rating_input: rating });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
