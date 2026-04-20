"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, CheckCircle, Info, Lock } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SeeNoiOPv2Exxf";

export default function BookingPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetch(`${BACKEND}/api/marketplace/bookings/${id}`)
      .then(r => r.json())
      .then(data => {
        setBooking(data);
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      // 1. Create Order
      const orderRes = await fetch(`${BACKEND}/api/marketplace/payment/create-order?booking_id=${id}`, {
        method: "POST"
      });
      const orderData = await orderRes.json();
      
      if (orderData.status !== "ok") throw new Error("Order creation failed");

      // 2. Open Razorpay Modal
      const options = {
        key: RZP_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "maCA Empire",
        description: `Consultation with CA ${booking.ca_profiles.marketplace_users.name}`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          // 3. Verify Payment
          const verifyRes = await fetch(`${BACKEND}/api/marketplace/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              booking_id: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.status === "ok") {
            router.push(`/dashboard/bookings?status=confirmed`);
          } else {
            alert("Verification failed. Please contact support.");
          }
        },
        theme: { color: "#000000" }
      };

      const rzp = (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      alert("Payment failed to initialize.");
    }
    setPaying(false);
  };

  if (loading) return <div style={{ background: "#000", minHeight: "100vh", padding: "100px", color: "#fff" }}>Preparing secure checkout...</div>;
  if (booking?.status !== "accepted") return <div style={{ background: "#000", minHeight: "100vh", padding: "100px", color: "#fff" }}>Booking is not ready for payment. (Current status: {booking?.status})</div>;

  const total = booking.amount_paise / 100;
  const commission = booking.commission_paise / 100;
  const ca_payout = booking.ca_payout_paise / 100;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "100px 40px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(181,255,46,0.1)", border: "1px solid rgba(181,255,46,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock size={28} color="#B5FF2E" />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800 }}>Confirm & Pay.</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Secure Escrow Payment for CA Services</p>
        </div>

        {/* Breakdown Card */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
            <div>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>Professional</span>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: "4px 0" }}>CA {booking.ca_profiles.marketplace_users.name}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>Service Fee</span>
              <p style={{ fontSize: "18px", fontWeight: 700, margin: "4px 0" }}>₹{total}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              <span>Consultation Payout</span>
              <span>₹{ca_payout}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              <span>maCA Platform Fee (10%)</span>
              <span>₹{commission}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 800, color: "#fff", marginTop: "12px", paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
              <span>Total Payable</span>
              <span style={{ color: "#B5FF2E" }}>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          <div style={{ flex: 1, padding: "16px", background: "rgba(52,211,153,0.05)", border: "0.5px solid rgba(52,211,153,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={18} color="#34D399" />
            <span style={{ fontSize: "12px", color: "rgba(52,211,153,0.8)", fontWeight: 700 }}>Payments held in escrow</span>
          </div>
          <div style={{ flex: 1, padding: "16px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldCheck size={18} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Razorpay Secure Checkout</span>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={paying}
          style={{ width: "100%", padding: "20px", background: "#B5FF2E", color: "#000", borderRadius: "100px", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {paying ? "Initializing..." : <>Complete Payment <CreditCard size={18} /></>}
        </button>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "20px" }}>
          <Info size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
          Payments are release to the CA only after you mark the session as complete.
        </p>

      </div>
    </div>
  );
}
