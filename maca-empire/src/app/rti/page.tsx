"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function RtiAgentPage() {
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("Central");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [rtiBody, setRtiBody] = useState("");

  const draftRti = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `Dept: ${dept}, Level: ${level}, Info Required: ${query}`, agent_id: "B7" }),
      });
      const data = await resp.json();
      setRtiBody(data.answer);
      saveToVault({ agent_id: "B7", doc_type: "RTI Application Draft", content: data.answer });
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
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>📄 RTI Agent B7</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Power to the Citizen · RTI Act 2005 Specialist</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={draftRti} style={{ display: "grid", gap: "1rem" }}>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input value={dept} onChange={e => setDept(e.target.value)} placeholder="Department (e.g. NHAI, BMC, EPFO)" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
                <select value={level} onChange={e => setLevel(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                   <option>Central Government</option><option>State Government</option>
                </select>
             </div>
             <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder="What information do you need from the government? (e.g. road repair budget, total employees, tender copy)..." rows={4} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
             <button disabled={loading} style={{ padding: "1rem", background: "#3b82f6", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
                {loading ? "DRAFTING RTI APPLICATION..." : "📄 DRAFT RTI APPLICATION →"}
             </button>
          </form>
        </div>
        {rtiBody && (
          <div style={{ background: "white", color: "#1e293b", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--border)", whiteSpace: "pre-wrap", fontSize: "0.85rem", lineHeight: "1.7", fontFamily: "Georgia, serif" }}>
            {rtiBody}
          </div>
        )}
      </main>
    </div>
  );
}
