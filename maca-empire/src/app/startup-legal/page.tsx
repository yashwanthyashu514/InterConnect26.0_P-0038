"use client";

import React, { useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function StartupLegalPage() {
  const [company, setCompany] = useState("");
  const [stage, setStage] = useState("Seed");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const askStartupAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: `Company: ${company}, Stage: ${stage}, Question: ${issue}`,
          agent_id: "B1" 
        }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      saveToVault({ agent_id: "B1", doc_type: `Startup Legal Advice: ${company}`, content: data.answer });
    } catch (e) {
      setAnswer("Failed to reach Startup Legal agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
           <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🚀 Startup Legal B1</h1>
           <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>DPIIT Registration & FEMA Compliance Shield · Venture Capital Ready</p>
        </div>
        <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <form onSubmit={askStartupAgent} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company Name" style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }} />
              <select value={stage} onChange={e => setStage(e.target.value)} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white" }}>
                <option>Idea</option><option>Seed</option><option>Series A+</option>
              </select>
            </div>
            <textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe Term Sheet clause or FEMA query..." rows={3} style={{ padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", width: "100%" }} />
            <button disabled={loading} style={{ padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", fontWeight: "900", border: "none", cursor: "pointer" }}>
              {loading ? "ANALYZING LEGALITIES..." : "RUN STARTUP SCAN →"}
            </button>
          </form>
        </div>

        {answer && (
          <div style={{ background: "rgba(20,184,166,0.05)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--primary)", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.6" }}>
            {answer}
          </div>
        )}
      </main>
    </div>
  );
}
