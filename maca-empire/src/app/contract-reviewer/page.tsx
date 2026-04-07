"use client";

import React, { useState } from "react";
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Download, Upload } from "lucide-react";
import { saveToVault } from "@/lib/vault";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface RedFlag {
  clause_text: string;
  risk_reason: string;
  law_cited: string;
}

interface ReviewResult {
  risk_score: number;
  red_flags: RedFlag[];
  missing_clauses: string[];
  verdict: string;
}

export default function ContractReviewerPage() {
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState("Rent Agreement");
  const [role, setRole] = useState("Tenant");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [text, setText] = useState("");

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BACKEND_URL}/review-contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_type: contractType,
          party_role: role,
          first_1500_chars: text.slice(0, 1500)
        }),
      });
      const data = await res.json();
      setResult(data);
      
      saveToVault({
        agent_id: "C2",
        doc_type: `Contract Review: ${contractType}`,
        content: `Verdict: ${data.verdict}\nRisk Score: ${data.risk_score}%\nRed Flags: ${data.red_flags.length}\nMissing Clauses: ${data.missing_clauses.join(", ")}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyle = (verdict: string) => {
    if (verdict.includes("Safe")) return { color: "#10b981", bg: "#10b98115", border: "#10b98133", icon: <CheckCircle2 size={24} /> };
    if (verdict.includes("Review")) return { color: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b33", icon: <AlertTriangle size={24} /> };
    return { color: "#ef4444", bg: "#ef444415", border: "#ef444433", icon: <ShieldAlert size={24} /> };
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1200px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-1px" }}>📄 Contract Reviewer C2</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: "0.5rem" }}>Indian Contract Law Audit in 30 Seconds · Red Flag Detection</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1.5fr" : "1fr", gap: "3rem" }}>
          {/* Input Section */}
          <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
               <FileText size={20} /> CONTRACT CONTEXT
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>CONTRACT TYPE</label>
                <select value={contractType} onChange={e => setContractType(e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                  <option>Rent Agreement</option><option>Vendor Agreement</option><option>Employment Contract</option><option>Partnership Deed</option><option>NOC / NDA</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>MY ROLE</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                  <option>Buyer</option><option>Seller</option><option>Employee</option><option>Employer</option><option>Tenant</option><option>Landlord</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>PASTE CONTRACT TEXT (OR FIRST 3 PAGES)</label>
              <textarea 
                value={text} 
                onChange={e => setText(e.target.value)}
                placeholder="Paste the text of the contract here..." 
                rows={12} 
                style={{ width: "100%", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "0.9rem", lineHeight: "1.6" }} 
              />
            </div>

            <button 
              onClick={handleReview}
              disabled={loading || !text.trim()}
              style={{
                padding: "1.25rem", borderRadius: "1rem", background: "var(--primary)", color: "white",
                border: "none", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
                transition: "all 0.2s"
              }}
            >
              {loading ? "AUDITING CLAUSES..." : "⚖️ RUN LEGAL AUDIT →"}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Verdict Header */}
              <div style={{
                background: getVerdictStyle(result.verdict).bg,
                border: `2px solid ${getVerdictStyle(result.verdict).border}`,
                borderRadius: "1.5rem", padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem"
              }}>
                <div style={{ color: getVerdictStyle(result.verdict).color }}>{getVerdictStyle(result.verdict).icon}</div>
                <div>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: "900", color: getVerdictStyle(result.verdict).color, marginBottom: "0.25rem" }}>CONTRACT VERDICT</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "900", color: getVerdictStyle(result.verdict).color }}>{result.verdict}</p>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                   <div style={{ fontSize: "2rem", fontWeight: "900", color: getVerdictStyle(result.verdict).color }}>{result.risk_score}</div>
                   <div style={{ fontSize: "0.6rem", fontWeight: "900", opacity: 0.6 }}>RISK SCORE</div>
                </div>
              </div>

              {/* Red Flags */}
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "900", color: "#ef4444", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldAlert size={18} /> {result.red_flags.length} CRITICAL RED FLAGS FOUND
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {result.red_flags.map((flag, i) => (
                    <div key={i} style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: "900", color: "white", marginBottom: "0.75rem", borderLeft: "4px solid #ef4444", paddingLeft: "1rem" }}>
                        "{flag.clause_text}"
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem" }}>{flag.risk_reason}</p>
                      <div style={{ fontSize: "0.7rem", fontWeight: "900", color: "#ef4444", background: "#ef444415", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", display: "inline-block" }}>
                        LAW CITED: {flag.law_cited}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Clauses */}
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem" }}>RECOMMENDED ADDITIONS</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                   {result.missing_clauses.map((c, i) => (
                     <div key={i} style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "1rem", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "var(--foreground)" }}>
                        <ChevronRight size={16} style={{ color: "var(--primary)" }} /> {c}
                     </div>
                   ))}
                </div>
              </div>

              <button style={{ padding: "1rem", borderRadius: "0.75rem", background: "var(--secondary)", color: "white", border: "1px solid var(--border)", fontWeight: "700", opacity: 0.7, cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <Download size={18} /> DOWNLOAD DETAILED AUDIT REPORT (PDF)
              </button>
            </div>
          )}
        </div>

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "6rem", opacity: 0.3 }}>
            <Upload size={64} style={{ marginBottom: "1rem", color: "var(--muted)" }} />
            <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>Drag & Drop PDF or Paste Text to Audit Your Contract</p>
          </div>
        )}
      </main>
    </div>
  );
}
