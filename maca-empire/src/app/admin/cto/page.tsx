"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Activity, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function StatusPill({ label, status }: { label: string; status: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
      {status === "UP" ? <CheckCircle size={16} color="#34D399" /> : <AlertTriangle size={16} color="#FF5050" />}
      <span style={{ fontSize: "13px", color: "#fff", flex: 1 }}>{label}</span>
      <span style={{ fontSize: "11px", fontWeight: 800, color: status === "UP" ? "#34D399" : "#FF5050" }}>{status}</span>
    </div>
  );
}

export default function AdminCTOPage() {
  const [report, setReport] = useState<string>("");
  const [briefing, setBriefing] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<{ backend: string; db: string } | null>(null);

  const fetchBriefing = async () => {
    try {
      const res = await fetch(`${BACKEND}/internal/briefing/today`);
      const data = await res.json();
      if (data?.cto_section) setBriefing(data.cto_section);
    } catch {}
  };

  const generateLiveReport = async () => {
    setLoading(true); setReport("");
    // Health ping
    try {
      const h = await fetch(`${BACKEND}/health`);
      setHealth({ backend: h.ok ? "UP" : "DEGRADED", db: "UP" });
    } catch { setHealth({ backend: "DOWN", db: "UNKNOWN" }); }

    const res = await fetch(`${BACKEND}/internal/cto/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Generate deep-dive system health assessment." }),
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
    // Background health check
    fetch(`${BACKEND}/health`).then(h => setHealth({ backend: h.ok ? "UP" : "DEGRADED", db: "UP" })).catch(() => setHealth({ backend: "DOWN", db: "UNKNOWN" }));
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(96,165,250,0.08)", border: "0.5px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}><Cpu size={20} /></div>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>CTO AI</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Layer 2 (System Health) · A2A Protcol Active</p>
        </div>
        <button onClick={generateLiveReport} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#60A5FA", border: "none", borderRadius: "12px", color: "#000", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
          {loading ? <RefreshCw className="animate-spin" size={13} /> : <RefreshCw size={13} />} Run Neural Deep-Dive
        </button>
      </div>

      {/* A2A Consolidated Briefing (SINGLE SOURCE OF TRUTH) */}
      <div style={{ padding: "32px", background: "rgba(181, 255, 46, 0.03)", border: "1px solid rgba(181, 255, 46, 0.2)", borderRadius: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Activity size={16} color="#B5FF2E" />
          <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Consolidated A2A Briefing</h3>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0 }}>
          {briefing || "No A2A synthesis detected for today. Run a deep-dive to generate live report."}
        </p>
      </div>

      {health && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          <StatusPill label="Backend (FastAPI :8000)" status={health.backend} />
          <StatusPill label="Database (Supabase pgvector)" status={health.db} />
        </div>
      )}

      {/* Live System Report (Secondary) */}
      {report && (
        <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Activity size={15} color="#60A5FA" />
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Live Deep-Dive Report</p>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{report}</p>
        </div>
      )}

      <div style={{ marginTop: "24px", padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.04)", borderRadius: "10px" }}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
          Active agents: A0,A1,A2,A3,A4,A5,A6,A7,A8,A12,A13,A22,A23,A24,A25,A26,A27 · Reserved: A9-A11, A14-A21 · Embedding: nvidia/nv-embed-v1 (4096 dims)
        </p>
      </div>
    </div>
  );
}
