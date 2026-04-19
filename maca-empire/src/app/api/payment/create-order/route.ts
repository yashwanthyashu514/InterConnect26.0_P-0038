import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAuthSession } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { booking_id, amount_paise } = await req.json();

    const options = {
      amount: amount_paise,
      currency: "INR",
      receipt: `receipt_${booking_id}`,
      notes: {
        booking_id: booking_id
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order_id: order.id });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
