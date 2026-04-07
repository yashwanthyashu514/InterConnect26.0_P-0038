"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function LabourLawPage() {
  const [issue, setIssue] = useState("Wrongful Termination");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const askLabourAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${issue}: ${desc}`, agent_id: "B3" }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      saveToVault({ agent_id: "B3", doc_type: `Labour Dispute: ${issue}`, content: data.answer });
    } catch (e) {
      setAnswer("Failed to reach Labour Law agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
           <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>💼 Labour Law B3</h1>
           <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Worker Rights Defense Shield · Industrial Dispute Resolution AI</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={askLabourAgent} style={{ display: "grid", gap: "1rem" }}>
             <select value={issue} onChange={e => setIssue(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                <option>Wrongful Termination</option><option>PF Dispute / Delay</option><option>Salary Delay</option><option>ESI Claim Rejected</option><option>Factory Safety Violation</option>
             </select>
             <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the incident (e.g. fired without notice, PF not deposited for 4 months)..." rows={4} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <button disabled={loading} style={{ padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "SEARCHING INDUSTRIAL CODES..." : "⚖️ GET LEGAL DEFENSE →"}
             </button>
          </form>
        </div>
        {answer && (
          <div style={{ background: "rgba(20,184,166,0.05)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--primary)", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.7", fontFamily: "Georgia, serif" }}>
            {answer}
          </div>
        )}
      </main>
    </div>
  );
}
