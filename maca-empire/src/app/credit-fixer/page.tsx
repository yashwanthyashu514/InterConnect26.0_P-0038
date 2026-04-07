"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function CreditFixerPage() {
  const [score, setScore] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [dispute, setDispute] = useState("");

  const draftCreditDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `CIBIL: ${score}, Error: ${errorDesc}`, agent_id: "B5" }),
      });
      const data = await resp.json();
      setDispute(data.answer);
      saveToVault({ agent_id: "B5", doc_type: "CIBIL Dispute Draft", content: data.answer });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>💳 Credit Fixer B5</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>CIBIL Accuracy Shield · CIC Act 2005 Specialist</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={draftCreditDispute} style={{ display: "grid", gap: "1rem" }}>
             <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="Current CIBIL Score (e.g. 640)" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <textarea value={errorDesc} onChange={e => setErrorDesc(e.target.value)} placeholder="Describe the error (e.g. loan showing active after closure, unknown default entry)..." rows={4} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <button disabled={loading} style={{ padding: "1rem", background: "#f59e0b", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "SEARCHING CIC ACT PRECEDENTS..." : "⚔️ GENERATE BUREAU DISPUTE →"}
             </button>
          </form>
        </div>
        {dispute && (
          <div style={{ background: "white", color: "#1e293b", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--border)", whiteSpace: "pre-wrap", fontSize: "0.85rem", lineHeight: "1.7", fontFamily: "Georgia, serif" }}>
            {dispute}
          </div>
        )}
      </main>
    </div>
  );
}
