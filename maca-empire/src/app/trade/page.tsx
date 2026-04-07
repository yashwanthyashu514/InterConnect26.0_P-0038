"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function TradeAgentPage() {
  const [hsn, setHsn] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Import");
  const [loading, setLoading] = useState(false);
  const [calc, setCalc] = useState("");

  const calculateDuty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${type}: HS Code ${hsn}, Product: ${desc}`, agent_id: "B6" }),
      });
      const data = await resp.json();
      setCalc(data.answer);
      saveToVault({ agent_id: "B6", doc_type: `Trade Duty Calc: ${hsn}`, content: data.answer });
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
           <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🚢 Trade Agent B6</h1>
           <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Customs Duty Calculation & HS Code Verification · DGFT Ready</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={calculateDuty} style={{ display: "grid", gap: "1rem" }}>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input value={hsn} onChange={e => setHsn(e.target.value)} placeholder="HS Code (6 or 8 digits)" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
                <select value={type} onChange={e => setType(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                   <option>Import</option><option>Export</option>
                </select>
             </div>
             <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Product description (e.g. Lithium-ion batteries, Industrial pump)..." rows={3} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <button disabled={loading} style={{ padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "SEARCHING CUSTOMS TARIFF..." : "🚢 CALCULATE DUTIES & REBATES →"}
             </button>
          </form>
        </div>
        {calc && (
          <div style={{ background: "rgba(20,184,166,0.05)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--primary)", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.7" }}>
            {calc}
          </div>
        )}
      </main>
    </div>
  );
}
