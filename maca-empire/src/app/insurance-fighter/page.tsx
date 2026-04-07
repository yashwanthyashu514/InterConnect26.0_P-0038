"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface InsuranceComplaint {
  complaint_letter: string;
  irdai_grounds?: string;
  compensation_claim?: string;
}

import { saveToVault } from "@/lib/vault";

export default function InsuranceFighterPage() {
  const [insurer, setInsurer] = useState("");
  const [type, setType] = useState("Health");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<InsuranceComplaint | null>(null);

  const draftInsuranceComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `Insurer: ${insurer}, Type: ${type}, Rejection Reason: ${reason}`, agent_id: "B4" }),
      });
      const data = await resp.json();
      const match = data.answer.match(/\{[\s\S]*\}/);
      let finalComp: InsuranceComplaint;
      if (match) {
        finalComp = JSON.parse(match[0]);
      } else {
        finalComp = { complaint_letter: data.answer, irdai_grounds: "Deficiency of Insurance Service", compensation_claim: "Original Claim + 12% Interest" };
      }
      setComplaint(finalComp);
      saveToVault({ agent_id: "B4", doc_type: "Insurance Appeal Draft", content: finalComp.complaint_letter });
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
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🛡️ Insurance Fighter B4</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Claim Rejection Reversal Shield · IRDAI 2026 Ready</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={draftInsuranceComplaint} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
             <input value={insurer} onChange={e => setInsurer(e.target.value)} placeholder="Insurer Name" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <select value={type} onChange={e => setType(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                <option>Health</option><option>Life</option><option>Motor / Car</option><option>Travel</option><option>Property</option>
             </select>
             <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the rejection (e.g. denied due to pre-existing condition, claim rejected without proof)..." rows={4} style={{ gridColumn: "span 2", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <button disabled={loading} style={{ gridColumn: "span 2", padding: "1rem", background: "#ef4444", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "SEARCHING IRDAI CIRCULARS..." : "⚔️ DRAFT CLARIFICATION & APPEAL →"}
             </button>
          </form>
        </div>
        {complaint && (
          <div style={{ padding: "2rem", background: "white", color: "#1e293b", borderRadius: "1rem", border: "1px solid var(--border)", fontSize: "0.85rem", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
             {complaint.complaint_letter}
          </div>
        )}
      </main>
    </div>
  );
}
