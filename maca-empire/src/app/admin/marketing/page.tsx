"use client";
import React, { useState, useEffect } from "react";
import { Megaphone, RefreshCw, AlertCircle } from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function AdminMarketingPage() {
  const [report, setReport] = useState("");
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetchBriefing = async () => {
    try {
      const res = await fetch(`${BACKEND}/internal/briefing/today?admin_key=${ADMIN_KEY}`);
      const data = await res.json();
      if (data?.marketing_section) setBriefing(data.marketing_section);
    } catch {}
  };

  const generateLiveReport = async () => {
    setLoading(true); setReport("");
    const res = await fetch(`${BACKEND}/internal/marketing/task`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Execute full market scan and calendar audit. Maintain invitation-only authority.", admin_key: ADMIN_KEY }),
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
    fetchBriefing(); 
    
    // Load local inquiries submitted from /b2b
    const saved = localStorage.getItem("b2b_inquiries");
    if (saved) {
      setInquiries(JSON.parse(saved));
    }
  }, []);

  const brandRules = [
    "Invitation-only tone — zero cold outreach language",
    "Target: CA firms, family offices, investment bankers",
    "Platform: Imperio Neural (not MaCA Empire)",
    "Threshold: ₹100Cr+ net worth, ₹500Cr+ AUM always implied",
  ];

  const targets = ["ET Wealth", "Mint", "Business Standard", "Forbes India", "ICAI Journals", "Bar & Bench"];

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(251,146,60,0.08)", border: "0.5px solid rgba(251,146,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FB923C" }}><Megaphone size={20} /></div>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>Marketing AI</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Layer 4 (Tactical) · A2A Protocol Active</p>
        </div>
        <button onClick={generateLiveReport} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#FB923C", border: "none", borderRadius: "12px", color: "#000", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
          {loading ? <RefreshCw className="animate-spin" size={13} /> : <RefreshCw size={13} />} Execute Neural Mission
        </button>
      </div>

      {/* A2A Strategy Briefing */}
      <div style={{ padding: "32px", background: "rgba(181, 255, 46, 0.03)", border: "1px solid rgba(181, 255, 46, 0.2)", borderRadius: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Megaphone size={16} color="#B5FF2E" />
          <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>A2A Strategy Briefing</h3>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0 }}>
          {briefing || "No A2A strategy detected. Run a neural mission for live market scan."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Brand Constraints</p>
          {brandRules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FB923C", marginTop: "7px", flexShrink: 0 }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{r}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Target Publications</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {targets.map((t, i) => (
              <span key={i} style={{ padding: "3px 10px", background: "rgba(251,146,60,0.08)", border: "0.5px solid rgba(251,146,60,0.2)", borderRadius: "100px", fontSize: "11px", color: "#FB923C", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px", padding: "8px 10px", background: "rgba(255,184,0,0.06)", border: "0.5px solid rgba(255,184,0,0.15)", borderRadius: "8px" }}>
            <AlertCircle size={12} color="#FFB800" />
            <span style={{ fontSize: "11px", color: "#FFB800" }}>Alpha Vantage quota monitor active</span>
          </div>
        </div>
      </div>

      {report && (
        <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Live Neural Mission Report</p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{report}</p>
        </div>
      )}

      {/* Enterprise Inquiries */}
      <div style={{ marginTop: "32px", padding: "32px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>B2B Enterprise Inquiries</p>
        
        {inquiries.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {inquiries.slice().reverse().map((inq, i) => (
              <div key={i} style={{ padding: "16px", background: "rgba(0,0,0,0.5)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", margin: 0 }}>{inq.company}</h4>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{new Date(inq.date).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#FB923C", marginBottom: "8px", fontWeight: 600 }}>{inq.name} · {inq.email} · {inq.teamSize} employees</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "8px", margin: 0 }}>{inq.useCase}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>No inquiries received yet.</p>
        )}
      </div>
    </div>
  );
}
