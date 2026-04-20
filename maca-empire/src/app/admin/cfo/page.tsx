"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { Gem, TrendingUp, BarChart3, AlertCircle, Loader2, ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";

const ADMIN_KEY = "imperio-admin-2025";

export default function CFODashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/revenue/stats", {
        headers: { "x-admin-key": ADMIN_KEY }
      });
      const json = await res.json();
      setData(json);
      
      // Fetch A2A Briefing (Synthesis)
      const bRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/internal/briefing/today?admin_key=${ADMIN_KEY}`);
      const bData = await bRes.json();
      if (bData?.cfo_section) setBriefing(bData.cfo_section);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" color="#B5FF2E" /></div>;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "14px", marginBottom: "40px" }}>
          <ArrowLeft size={16} /> Back to Command
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "60px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(181, 255, 46, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gem size={20} color="#B5FF2E" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "36px", letterSpacing: "-1.5px" }}>CFO FINANCIAL ENGINE</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" }}>A2A PROTOCOL: ACTIVE · REVENUE ORCHESTRATION</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Total Platform Revenue", value: `₹${((data?.summary?.total_revenue_paise || 0) / 100).toLocaleString()}`, icon: <TrendingUp size={16} />, color: "#B5FF2E" },
            { label: "Total GTV (Gross Transaction Val)", value: `₹${((data?.summary?.total_gtv_paise || 0) / 100).toLocaleString()}`, icon: <BarChart3 size={16} />, color: "#60A5FA" },
            { label: "Active Engagements", value: data?.summary?.booking_count || 0, icon: <Gem size={16} />, color: "#C084FC" },
            { label: "Settled Payments", value: data?.summary?.paid_count || 0, icon: <ShieldCheck size={16} color="#34D399" />, color: "#34D399" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "rgba(255,255,255,0.4)" }}>
                {s.icon} <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</span>
              </div>
              <p style={{ fontSize: "32px", fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* A2A Synthesis Box */}
        <div style={{ background: "rgba(181, 255, 46, 0.03)", border: "1px solid rgba(181, 255, 46, 0.2)", borderRadius: "32px", padding: "40px", marginBottom: "40px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <BrainCircuit size={24} color="#B5FF2E" />
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, color: "#B5FF2E", margin: 0 }}>CFO ORACLE A2A BRIEFING</h3>
           </div>
           <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0 }}>
             {briefing || "Awaiting final A2A Chain synthesis from CTO/HR subordinates..."}
           </p>
        </div>

        {/* Ledger Table */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "40px" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, marginBottom: "32px" }}>Neural Revenue Ledger</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                <th style={{ paddingBottom: "20px" }}>Payment ID</th>
                <th style={{ paddingBottom: "20px" }}>Engagement ID</th>
                <th style={{ paddingBottom: "20px" }}>Date</th>
                <th style={{ paddingBottom: "20px", textAlign: "right" }}>Platform Fee</th>
              </tr>
            </thead>
            <tbody>
              {data?.revenue_ledger?.length > 0 ? (
                data.revenue_ledger.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "14px" }}>
                    <td style={{ padding: "16px 0", color: "#60A5FA", fontWeight: 700 }}>{r.payment_id?.slice(0, 12)}...</td>
                    <td style={{ padding: "16px 0", color: "rgba(255,255,255,0.4)" }}>{r.booking_id?.slice(0, 8)}</td>
                    <td style={{ padding: "16px 0", color: "rgba(255,255,255,0.6)" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "16px 0", textAlign: "right", fontWeight: 800, color: "#B5FF2E" }}>₹{(r.amount / 100).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
                    No financial streams detected in current ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const ShieldCheck = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
