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

    const { ca_id, notes, amount_paise } = await req.json();

    if (!ca_id || !notes || !amount_paise) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Calculate fees (10% platform cut)
    const commission = Math.round(amount_paise * 0.1);
    const payout = amount_paise - commission;

    // 2. Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: session.user_id,
        ca_id: ca_id,
        status: "requested",
        amount_paise: amount_paise,
        commission_paise: commission,
        ca_payout_paise: payout,
        notes: notes
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 3. Get CA user_id for notification
    const { data: caProfile } = await supabase
      .from("ca_profiles")
      .select("user_id")
      .eq("id", ca_id)
      .single();

    if (caProfile) {
      // 4. Create Notification for CA
      await supabase
        .from("marketplace_notifications")
        .insert({
          recipient_id: caProfile.user_id,
          type: "booking_request",
          booking_id: booking.id,
          message: `New hire request from ${session.email}. Requirement: ${notes.substring(0, 50)}...`
        });
    }

    return NextResponse.json({ booking_id: booking.id });

  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
