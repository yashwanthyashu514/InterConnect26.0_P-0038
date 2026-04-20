import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "maca_webhook_secret_2025";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const { order_id, notes, amount } = event.payload.payment.entity;
      const booking_id = notes.booking_id;

      // 1. Update Booking status to paid (redundant but safe)
      const { data: booking } = await supabase
        .from("bookings")
        .update({ status: "paid" })
        .eq("id", booking_id)
        .select()
        .single();

      if (booking) {
        // 2. Log Platform Revenue (10% platform cut)
        const platformCut = booking.commission_paise;
        
        // Check if already logged to avoid duplicates from retries
        const { data: existingRev } = await supabase
          .from("platform_revenue")
          .select("id")
          .eq("payment_id", event.payload.payment.entity.id)
          .single();

        if (!existingRev) {
          await supabase.from("platform_revenue").insert({
            payment_id: event.payload.payment.entity.id,
            amount: platformCut,
            booking_id: booking_id
          });
          
          // Also log to CFO relevant metrics
          console.log(`Revenue logged: ${platformCut} paise for booking ${booking_id}`);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
