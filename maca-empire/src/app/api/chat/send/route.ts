import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { booking_id, message } = await req.json();

    // 1. Insert message
    const { data: chat, error } = await supabase
      .from("marketplace_chats")
      .insert({
        booking_id,
        sender_id: session.user_id,
        message
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Fetch booking to find recipient
    const { data: booking } = await supabase
      .from("bookings")
      .select(`
        user_id,
        ca_id,
        ca_profiles!bookings_ca_id_fkey ( user_id )
      `)
      .eq("id", booking_id)
      .single();

    if (booking) {
      const isClient = session.user_id === booking.user_id;
      // Handle Supabase type inference which sometimes thinks relations are arrays
      const caUserId = Array.isArray(booking.ca_profiles) 
        ? booking.ca_profiles[0]?.user_id 
        : (booking.ca_profiles as any)?.user_id;

      const recipientId = isClient ? caUserId : booking.user_id;

      // 3. Notify recipient
      await supabase
        .from("marketplace_notifications")
        .insert({
          recipient_id: recipientId,
          type: "chat_message",
          booking_id: booking_id,
          message: `New message from ${isClient ? "Client" : "CA"}: ${message.substring(0, 30)}...`
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
