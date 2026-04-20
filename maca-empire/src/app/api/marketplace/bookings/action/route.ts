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

    const { id, action } = await req.json(); // "accept" or "decline"

    // 1. Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const newStatus = action === "accept" ? "accepted" : "declined";

    // 2. Update booking
    const { error: updateError } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);

    if (updateError) throw updateError;

    // 3. Notify User
    await supabase
      .from("marketplace_notifications")
      .insert({
        recipient_id: booking.user_id,
        type: action === "accept" ? "ca_accepted" : "ca_declined",
        booking_id: id,
        message: action === "accept" 
          ? `Great news! The CA has accepted your hire request. Please proceed to payment.`
          : `We regret to inform you that the CA has declined your hire request.`
      });

    return NextResponse.json({ message: `Booking ${newStatus} successfully` });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
