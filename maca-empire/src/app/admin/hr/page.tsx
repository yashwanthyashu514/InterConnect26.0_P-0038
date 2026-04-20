"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Users, RefreshCw, Package, UserCheck } from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function AdminHRPage() {
  const [report, setReport] = useState("");
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBriefing = async () => {
    try {
      const res = await fetch(`${BACKEND}/internal/briefing/today?admin_key=${ADMIN_KEY}`);
      const data = await res.json();
      if (data?.hr_section) setBriefing(data.hr_section);
    } catch {}
  };

  const generateLiveReport = async () => {
    setLoading(true); setReport("");
    const res = await fetch(`${BACKEND}/internal/hr/status`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Compile chain-of-command deep scan. Include Marketing synthesis.", admin_key: ADMIN_KEY }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split("\n")) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try { const d = JSON.parse(line.slice(6)); if (d.token) { text += d.token; setReport(text); } } catch {}
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBriefing();
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(192,132,252,0.08)", border: "0.5px solid rgba(192,132,252,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C084FC" }}><Users size={20} /></div>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>HR AI</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Layer 3 (Organizational) · A2A Protocol Active</p>
        </div>
        <button onClick={generateLiveReport} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#C084FC", border: "none", borderRadius: "12px", color: "#000", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
          {loading ? <RefreshCw className="animate-spin" size={13} /> : <RefreshCw size={13} />} Run Chain-of-Command Deep Scan
        </button>
      </div>

      {/* A2A Consolidated Briefing */}
      <div style={{ padding: "32px", background: "rgba(181, 255, 46, 0.03)", border: "1px solid rgba(181, 255, 46, 0.2)", borderRadius: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <UserCheck size={16} color="#B5FF2E" />
          <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>A2A Organizational Briefing</h3>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0 }}>
          {briefing || "No A2A synthesis detected. Run a deep scan to generate live report."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Package size={14} color="#FB923C" />
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px" }}>Vendors</p>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>HR AI monitors vendor contracts and flags expiry within 30 days.</p>
        </div>
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <UserCheck size={14} color="#34D399" />
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#34D399", textTransform: "uppercase", letterSpacing: "1px" }}>Team Members</p>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Tracks human hires, onboarding status, and 90-day reviews.</p>
        </div>
      </div>

      {report && (
        <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#C084FC", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Live Deep-Scan Report</p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{report}</p>
        </div>
      )}
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "16px" }}>Scope: Marketing AI only. CFO/CTO performance is not HR's domain.</p>
    </div>
  );
}
