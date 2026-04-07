"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function ReraAgentPage() {
  const [builder, setBuilder] = useState("");
  const [delay, setDelay] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);

  const draftReraComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: `Builder: ${builder}, Delay: ${delay} months, State: ${state}`,
          agent_id: "B2" 
        }),
      });
      const data = await resp.json();
      const match = data.answer.match(/\{[\s\S]*\}/);
      let finalComp: any;
      if (match) {
        finalComp = JSON.parse(match[0]);
      } else {
        finalComp = {
          complaint_draft: data.answer,
          compensation_entitlement: "Estimated ~SBI+2% Interest monthly",
          filing_authority: `${state} Real Estate Regulatory Authority`
        };
      }
      setComplaint(finalComp);
      saveToVault({ agent_id: "B2", doc_type: "RERA Complaint Draft", content: finalComp.complaint_draft });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "850px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🏢 RERA Agent B2</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Homeowner Compensation Specialist · Section 18 Compliance</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={draftReraComplaint} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
             <input value={builder} onChange={e => setBuilder(e.target.value)} placeholder="Builder Name" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <input type="number" value={delay} onChange={e => setDelay(e.target.value)} placeholder="Delay in months" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <select value={state} onChange={e => setState(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", gridColumn: "span 2" }}>
                <option>Maharashtra (MahaRERA)</option><option>Uttar Pradesh (UPRERA)</option><option>Karnataka (K-RERA)</option><option>Delhi (RERA Delhi)</option>
             </select>
             <button disabled={loading} style={{ gridColumn: "span 2", padding: "1rem", background: "#16a34a", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "SEARCHING RERA PRECEDENTS..." : "⚔️ DRAFT RERA COMPLAINT →"}
             </button>
          </form>
        </div>

        {complaint && (
          <div style={{ display: "grid", gap: "1.5rem" }}>
             <div style={{ padding: "1.5rem", background: "rgba(22,163,74,0.08)", borderRadius: "1rem", border: "1px solid #16a34a" }}>
                <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "#16a34a", marginBottom: "0.5rem" }}>📜 ENTITLEMENT UNDER SECTION 18</h4>
                <p style={{ fontSize: "1rem", fontWeight: "700" }}>{complaint.compensation_entitlement}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase", marginTop: "0.2rem" }}>Target: {complaint.filing_authority}</p>
             </div>
             <div style={{ padding: "2rem", background: "white", color: "#1e293b", borderRadius: "1rem", border: "1px solid var(--border)", fontSize: "0.85rem", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
                {complaint.complaint_draft}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
