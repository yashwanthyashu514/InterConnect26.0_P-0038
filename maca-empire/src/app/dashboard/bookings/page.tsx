"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, CreditCard, XCircle, ChevronRight, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const STATUS_MAP: any = {
  requested: { label: "Pending CA Response", color: "#FBBF24", icon: <Clock size={14} /> },
  accepted: { label: "Accepted - Payment Pending", color: "#60A5FA", icon: <CreditCard size={14} /> },
  paid: { label: "Confirmed & In Progress", color: "#34D399", icon: <CheckCircle size={14} /> },
  completed: { label: "Session Completed", color: "#2DD4BF", icon: <Star size={14} /> },
  declined: { label: "Declined by CA", color: "#F87171", icon: <XCircle size={14} /> }
};

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/api/marketplace/bookings/me`) // We need to add this endpoint
      .then(r => r.json())
      .then(data => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ background: "#000", minHeight: "100vh", padding: "100px", color: "#fff" }}>Syncing your session vault...</div>;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "80px 40px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "60px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, margin: 0 }}>My Engagements.</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Track and manage your professional consultations</p>
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "60px", background: "rgba(255,255,255,0.02)", border: "0.5px dashed rgba(255,255,255,0.1)", borderRadius: "24px", textAlign: "center" }}>
            <MessageSquare size={40} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.3)" }}>No active engagements found.</p>
            <Link href="/hire-a-ca" style={{ display: "inline-block", marginTop: "20px", color: "#B5FF2E", fontWeight: 700, textDecoration: "none" }}>Hire an Expert →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {bookings.map(b => {
              const info = STATUS_MAP[b.status] || { label: b.status, color: "#fff" };
              return (
                <div key={b.id} style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 180px 200px", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>Professional</span>
                    <p style={{ fontSize: "18px", fontWeight: 700, margin: "4px 0" }}>CA {b.ca_profiles.marketplace_users.name}</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Request: "{b.notes}"</p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 800, color: info.color, background: `${info.color}15`, padding: "6px 12px", borderRadius: "100px", textTransform: "uppercase" }}>
                      {info.icon} {info.label}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {b.status === "accepted" ? (
                      <Link href={`/booking/${b.id}/payment`} style={{ background: "#B5FF2E", color: "#000", padding: "12px 24px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        Proceed to Pay <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <div>
                        <p style={{ fontSize: "16px", fontWeight: 700 }}>₹{b.amount_paise / 100}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Ref: {b.id.slice(0,8)}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
