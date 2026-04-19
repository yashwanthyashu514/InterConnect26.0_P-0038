import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "ca") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking_id } = await req.json();

    // 1. Update status to completed
    const { error } = await supabase
      .from("bookings")
      .update({ 
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", booking_id);

    if (error) throw error;

    // 2. Notify User to leave a review
    const { data: booking } = await supabase
      .from("bookings")
      .select("user_id")
      .eq("id", booking_id)
      .single();

    if (booking) {
      await supabase
        .from("marketplace_notifications")
        .insert({
          recipient_id: booking.user_id,
          type: "payment_confirmed", // Reusing type or I could add 'session_completed'
          booking_id: booking_id,
          message: "The CA has marked the session as completed. Please share your feedback."
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
