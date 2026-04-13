"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function CreditPanel() {
  const score = 648;
  const color = score >= 750 ? "var(--acid)" : score >= 650 ? "var(--warning)" : "var(--danger)";
  const label = score >= 750 ? "Excellent" : score >= 650 ? "Fair" : "Poor";
  const pct = ((score - 300) / 600) * 100;

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>CIBIL Score</p>
      <div style={{ textAlign: "center", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "52px", letterSpacing: "-2px", color, marginBottom: "4px" }}>{score}</p>
        <p style={{ fontSize: "13px", color, fontFamily: "'DM Sans', sans-serif', fontWeight: 500" }}>{label}</p>
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>300</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>900</span>
          </div>
          <div style={{ height: "8px", background: "linear-gradient(to right, var(--danger), var(--warning), var(--acid))", borderRadius: "4px", position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: "14px", height: "14px", background: "white", border: `2px solid ${color}`, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </div>

      {/* Repair roadmap */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Repair Roadmap</p>
        {[
          { period: "1 Month", action: "Dispute 2 wrong entries with CIBIL", target: "660+" },
          { period: "3 Months", action: "Clear overdue credit card bill ₹18k", target: "700+" },
          { period: "6 Months", action: "Reduce credit utilization below 30%", target: "730+" },
          { period: "12 Months", action: "Add secured credit card, maintain payments", target: "760+" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
            <div style={{ background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "6px", padding: "4px 8px", minWidth: "64px", textAlign: "center" }}>
              <span style={{ fontSize: "10px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif', fontWeight: 700" }}>{r.period}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "2px" }}>{r.action}</p>
              <p style={{ fontSize: "10px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>Target: {r.target}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "My CIBIL score is 620 — how do I improve it?",
  "Draft a dispute letter for wrong entry in my credit report",
  "Which errors in my credit report are affecting my score?",
  "What is the process to raise a dispute with CIBIL?",
];

export default function CreditFixerPage() {
  return (
    <AgentChatLayout
      agentName="Credit Fixer"
      agentIcon="📈"
      agentDescription="Dispute errors on your credit report and build a structured repair roadmap."
      rightPanel={<CreditPanel />}
    >
      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Credit Fixer</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Dispute CIBIL errors, get a personalized credit repair roadmap, and improve your score systematically.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
