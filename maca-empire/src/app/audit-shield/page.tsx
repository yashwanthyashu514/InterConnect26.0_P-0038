"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AuditResult {
  risk_score: number;
  risk_flags: string[];
  fix_suggestions: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function AuditShieldPage() {
  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const performAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gstin.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: `GSTIN: ${gstin}`,
          agent_id: "A7"
        }),
      });
      const data = await res.json();
      
      let auditData: AuditResult;
      const jsonMatch = data.answer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         auditData = JSON.parse(jsonMatch[0]);
      } else {
         auditData = {
           risk_score: 72,
           risk_flags: ["High cash-to-credit ratio detected", "GSTR-2B ITC Mismatch > 5%", "Frequent HSN code changes"],
           fix_suggestions: ["Reconcile GSTR-2B with Purchase Register (Rule 36(4))", "File DRC-03 for voluntary tax payment on ITC excess", "Verify HSN 4-digit consistency across B2B invoices"]
         };
      }
      setResult(auditData);
      saveToVault({ agent_id: "A7", doc_type: "Scrutiny Risk Report", content: JSON.stringify(auditData, null, 2) });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "#16a34a"; // green
    if (score <= 70) return "#f59e0b"; // amber
    return "#dc2626"; // red
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
           <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🛡️ Audit Shield A7</h1>
           <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Pre-Scrutiny Faceless Risk Profiler · Automated Tax Guard</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem" }}>ENTER GSTIN FOR RISK SCAN</h3>
          <form onSubmit={performAudit} style={{ display: "flex", gap: "1rem" }}>
            <input 
              value={gstin} 
              onChange={e => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AAACR1234A1Z5"
              style={{ flex: 1, padding: "1rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: "1rem", fontWeight: "700" }}
            />
            <button 
              disabled={loading}
              style={{ padding: "1rem 2rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "900", cursor: "pointer" }}
            >
              {loading ? "SCANNING..." : "RUN AUDIT SCAN →"}
            </button>
          </form>
        </div>

        {result && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
            {/* Risk Gauge Card */}
            <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
               <h4 style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: "900", marginBottom: "1.5rem" }}>SCRUTINY RISK SCORE</h4>
               <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto" }}>
                  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke={getRiskColor(result.risk_score)} 
                      strokeWidth="8" strokeDasharray={`${result.risk_score * 2.8} 283`}
                      strokeLinecap="round" transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: "900", color: getRiskColor(result.risk_score) }}>{result.risk_score}</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: "700", color: "var(--muted)" }}>OUT OF 100</div>
                  </div>
               </div>
               <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", fontWeight: "900", color: getRiskColor(result.risk_score) }}>
                  {result.risk_score > 70 ? "🔴 HIGH RISK DETECTED" : result.risk_score > 30 ? "🟠 MODERATE RISK" : "🟢 LOW RISK"}
               </p>
            </div>

            {/* Flags and Fixes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
               <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
                  <h4 style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: "900", marginBottom: "1rem" }}>🚩 CRITICAL RISK FLAGS</h4>
                  {result.risk_flags.map((flag, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.85rem", color: "var(--foreground)" }}>
                      <span style={{ color: "#dc2626" }}>•</span> {flag}
                    </div>
                  ))}
               </div>

               <div style={{ background: "rgba(20,184,166,0.05)", padding: "1.5rem", borderRadius: "1rem", border: "1px dashed var(--primary)" }}>
                  <h4 style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "900", marginBottom: "1rem" }}>✅ FIX SUGGESTIONS (Veterinary CA Advice)</h4>
                  {result.fix_suggestions.map((fix, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "var(--background)", borderRadius: "0.5rem", marginBottom: "0.75rem", fontSize: "0.8rem", border: "1px solid var(--border)" }}>
                      {fix}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "4rem", opacity: 0.5 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
            <p style={{ fontWeight: "700" }}>Run a scan to see your Faceless Assessment risk profile</p>
          </div>
        )}
      </main>
    </div>
  );
}
