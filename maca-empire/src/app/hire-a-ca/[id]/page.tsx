"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Star, Clock, ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";

export default function CAProfileView() {
  const { id } = useParams();
  const router = useRouter();
  const [ca, setCa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requirement, setRequirement] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/marketplace/cas/${id}`)
      .then(r => r.json())
      .then(data => {
        setCa(data.ca);
        setLoading(false);
      });
  }, [id]);

  const handleHire = async () => {
    if (!requirement) {
      alert("Please describe your requirement.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/marketplace/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ca_id: id,
          notes: requirement,
          amount_paise: ca.listed_price_paise
        })
      });

      if (res.ok) {
        router.push("/dashboard?status=requested");
      } else {
        alert("Hire request failed.");
      }
    } catch (e) {
      alert("Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" color="#B5FF2E" /></div>;
  if (!ca) return <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Profile not found.</div>;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Navigation */}
        <Link href="/hire-a-ca" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "14px", marginBottom: "40px" }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "64px" }}>
          {/* Left: Info */}
          <div>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-end", marginBottom: "32px" }}>
              <div style={{ width: "96px", height: "96px", background: "#111", border: "1px solid #222", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: 800, color: "#B5FF2E" }}>
                {ca.marketplace_users?.name?.[0]}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, margin: 0 }}>{ca.marketplace_users?.name}</h1>
                  <ShieldCheck size={24} color="#B5FF2E" />
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Senior Chartered Accountant · ICAI-MRN-{ca.icai_registration_no}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={18} color="#B5FF2E" fill="#B5FF2E" />
                <span style={{ fontWeight: 800, fontSize: "18px" }}>{ca.rating || "4.8"}</span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>(12 verified reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)" }}>
                <Clock size={16} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Available for next 48h</span>
              </div>
            </div>

            <div style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#B5FF2E", marginBottom: "16px" }}>Expertise Domain</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {ca.specialties?.map((s: string) => (
                  <span key={s} style={{ padding: "8px 16px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "0.1px solid rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 700 }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#B5FF2E", marginBottom: "16px" }}>Sovereign Bio</h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{ca.bio}</p>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div style={{ position: "sticky", top: "40px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "32px" }}>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Professional Service Fee</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "36px", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>₹{(ca.listed_price_paise / 100).toLocaleString()}</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>/session</span>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#B5FF2E", display: "block", marginBottom: "8px" }}>Requirement Brief</label>
                <textarea 
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe your matter (e.g., succession planning for family trust or GST litigation notice)..."
                  style={{ width: "100%", background: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px", color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", minHeight: "120px", outline: "none", resize: "none" }} 
                />
              </div>

              <button 
                onClick={handleHire}
                disabled={submitting}
                style={{ width: "100%", background: "#B5FF2E", color: "#000", border: "none", padding: "18px", borderRadius: "100px", fontWeight: 800, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Hire this Professional</>}
              </button>
              
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
                By clicking Hire, you agree to the Imperio Escrow terms. 10% platform fee applies. Payout released on completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
