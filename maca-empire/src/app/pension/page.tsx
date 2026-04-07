"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function PensionAgentPage() {
  const [salary, setSalary] = useState("");
  const [years, setYears] = useState("");
  const [type, setType] = useState("Gratuity");
  const [loading, setLoading] = useState(false);
  const [calc, setCalc] = useState("");

  const calculateRetirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${type}: Salary ${salary}, Years ${years}`, agent_id: "B8" }),
      });
      const data = await resp.json();
      setCalc(data.answer);
      saveToVault({ agent_id: "B8", doc_type: `Retirement Plan: ${type}`, content: data.answer });
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
           <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>👵 Pension Agent B8</h1>
           <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Gratuity & Retirement Shield (Act 1972) · Compliance Automator</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={calculateRetirement} style={{ display: "grid", gap: "1rem" }}>
             <select value={type} onChange={e => setType(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                <option>Gratuity Entitlement</option><option>EPS / PF Pension Dispute</option><option>Voluntary Retirement (VRS)</option>
             </select>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="Last Drawn Salary (Basic + DA)" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
                <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="Years of Service" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             </div>
             <button disabled={loading} style={{ padding: "1rem", background: "#8b5cf6", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "CALCULATING RETIREMENT BENEFITS..." : "👵 COMPUTE BENEFITS & DRAFT GRIEVANCE →"}
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
