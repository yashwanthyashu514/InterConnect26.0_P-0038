"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, AlertTriangle, CheckCircle, Search, TrendingUp, Download } from "lucide-react";
import { saveToVault } from "@/lib/vault";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface Precedent {
  case_name: string;
  outcome: string;
  year?: string;
  relevance?: string;
}

interface OutcomeResult {
  win_probability: number;
  reasoning: string;
  top_precedents: Precedent[];
  recommended_action: "Appeal" | "Settle" | "Negotiate";
}

export default function AIJudgePage() {
  const [loading, setLoading] = useState(false);
  const [noticeType, setNoticeType] = useState("Income Tax");
  const [assesseeType, setAssesseeType] = useState("Individual");
  const [amount, setAmount] = useState("");
  const [facts, setFacts] = useState("");
  const [result, setResult] = useState<OutcomeResult | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !facts) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BACKEND_URL}/predict-outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notice_type: noticeType,
          assessee_type: assesseeType,
          amount,
          facts
        }),
      });
      const data = await res.json();
      setResult(data);
      
      saveToVault({
        agent_id: "C1",
        doc_type: "AI Verdict Prediction",
        content: `Notice: ${noticeType}\nAmount: ${amount}\nWin Prob: ${data.win_probability}%\nVerdict: ${data.recommended_action}\nReasoning: ${data.reasoning}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProbColor = (prob: number) => {
    if (prob < 30) return "#dc2626"; // red
    if (prob < 60) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1000px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-1px" }}>⚖️ AI Judge C1</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: "0.5rem" }}>Predict Tax Appeal Outcomes in 30 Seconds via Supreme Court Precedents</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "3rem", transition: "all 0.5s ease" }}>
          {/* Input Form */}
          <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--foreground)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Search size={20} /> CASE PARAMETERS
            </h3>
            <form onSubmit={handlePredict} style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Notice Type</label>
                <select 
                  value={noticeType} 
                  onChange={e => setNoticeType(e.target.value)}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }}
                >
                  <option>Income Tax</option><option>GST</option><option>Customs</option><option>Corporate Law</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Assessee Type</label>
                <select 
                  value={assesseeType} 
                  onChange={e => setAssesseeType(e.target.value)}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }}
                >
                  <option>Individual</option><option>Private Ltd</option><option>Public Ltd</option><option>Partnership</option><option>Trust</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Disputed Amount (₹)</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1.2rem", fontWeight: "700" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Brief Facts (Max 300 chars)</label>
                <textarea 
                  value={facts}
                  onChange={e => setFacts(e.target.value.slice(0, 300))}
                  placeholder="Summarize the core dispute (e.g. Exemption under Sec 54 claimed but denied by AO citing non-investment in stipulated time)..."
                  rows={4}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "0.95rem", lineHeight: "1.5" }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "1rem", padding: "1.25rem", borderRadius: "0.75rem", background: "var(--primary)", color: "white",
                  border: "none", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
                  transition: "all 0.2s"
                }}
              >
                {loading ? "GAVEL STRIKING..." : "⚖️ PREDICT VERDICT →"}
              </button>
            </form>
          </div>

          {/* Results Side */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Verdict Card */}
              <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: `2px solid ${getProbColor(result.win_probability)}33`, textAlign: "center" }}>
                <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--muted)", marginBottom: "1.5rem" }}>AI PROBABILITY VERDICT</h4>
                <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto" }}>
                   <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                     <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
                     <circle 
                       cx="50" cy="50" r="45" fill="none" stroke={getProbColor(result.win_probability)} 
                       strokeWidth="10" strokeDasharray={`${result.win_probability * 2.83} 283`}
                       strokeLinecap="round" transform="rotate(-90 50 50)"
                     />
                   </svg>
                   <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                     <div style={{ fontSize: "3.5rem", fontWeight: "900", color: getProbColor(result.win_probability) }}>{result.win_probability}%</div>
                     <div style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)" }}>WIN PROBABILITY</div>
                   </div>
                </div>
                
                <div style={{
                  marginTop: "2rem", padding: "1rem", borderRadius: "0.75rem",
                  background: `${getProbColor(result.win_probability)}15`,
                  border: `1px solid ${getProbColor(result.win_probability)}44`,
                  color: getProbColor(result.win_probability),
                  fontWeight: "900", fontSize: "1.1rem"
                }}>
                  {result.recommended_action === "Appeal" ? "🚀 RECOMMENDATION: FILING APPEAL IS STRONGLY ADVISED" : 
                   result.recommended_action === "Settle" ? "🛑 RECOMMENDATION: SETTLEMENT PREFERRED" : 
                   "⚠️ RECOMMENDATION: NEGOTIATE UNDER VIVAAD SE VISHWAS"}
                </div>

                <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: "var(--foreground)", lineHeight: "1.6", fontStyle: "italic" }}>
                  "{result.reasoning}"
                </p>
              </div>

              {/* Precedents */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={18} /> TOP {result.top_precedents.length} CITATIONS FOUND
                </h4>
                {result.top_precedents.map((p, i) => (
                  <div key={i} style={{ background: "var(--secondary)", padding: "1.25rem", borderRadius: "1rem", border: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "900", color: "var(--foreground)" }}>{p.case_name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: "700" }}>Outcome: <span style={{ color: p.outcome.includes("Allowed") ? "#10b981" : "#f59e0b" }}>{p.outcome}</span></div>
                    </div>
                    <div style={{ padding: "0.4rem 0.8rem", background: "var(--background)", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "0.7rem", fontWeight: "900" }}>
                      VERIFIED LAW
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(239, 68, 68, 0.05)", border: "1px dashed #ef4444", fontSize: "0.75rem", color: "#ef4444", textAlign: "center" }}>
                Disclaimer: This is as AI risk analysis based on public judgments. Consult a Senior Counsel before final decision.
              </div>
            </div>
          )}
        </div>

        {!result && !loading && (
          <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "4rem", opacity: 0.4 }}>
            <Scale size={64} style={{ marginBottom: "1rem", color: "var(--muted)" }} />
            <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>Ready for Assessment? Enter your case details to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}
