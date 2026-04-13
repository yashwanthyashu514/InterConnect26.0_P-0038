"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function RiskGauge({ score }: { score: number }) {
  const angle = (score / 100) * 180 - 90;
  const color = score <= 30 ? "var(--acid)" : score <= 60 ? "var(--warning)" : "var(--danger)";
  const label = score <= 30 ? "Low Risk" : score <= 60 ? "Moderate Risk" : "High Risk";

  return (
    <div style={{ textAlign: "center", padding: "24px 20px 12px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Audit Risk Score</p>
      <div style={{ position: "relative", width: "160px", height: "80px", margin: "0 auto 12px" }}>
        <svg viewBox="0 0 160 80" style={{ width: "100%", height: "100%" }}>
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray="220" strokeDashoffset={220 - (score / 100) * 220} style={{ transition: "stroke-dashoffset 1s ease" }} />
          <line x1="80" y1="80" x2={80 + 55 * Math.cos((angle - 90) * Math.PI / 180)} y2={80 + 55 * Math.sin((angle - 90) * Math.PI / 180)} stroke={color} strokeWidth="3" strokeLinecap="round" style={{ transition: "all 1s ease" }} />
          <circle cx="80" cy="80" r="4" fill={color} />
        </svg>
      </div>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "36px", letterSpacing: "-2px", color, marginBottom: "4px" }}>{score}</p>
      <p style={{ fontSize: "13px", color, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function AuditPanel() {
  const [gstin, setGstin] = useState("");
  const [score, setScore] = useState(42);
  const riskFactors = [
    { factor: "ITC Mismatch", severity: "high", desc: "₹3.2L inconsistency in GSTR-2A vs 3B" },
    { factor: "Late Filings", severity: "medium", desc: "3 late GSTR-3B filings in FY24" },
    { factor: "High Cash Transactions", severity: "low", desc: "42% cash sales — acceptable threshold" },
  ];

  return (
    <div>
      <RiskGauge score={score} />
      <div style={{ padding: "0 20px 20px" }}>
        <input
          placeholder="Enter GSTIN to score"
          className="input-dark"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          style={{ marginBottom: "10px", fontSize: "13px" }}
        />
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "9px" }}
          onClick={() => setScore(Math.floor(Math.random() * 80) + 10)}>
          Calculate Risk Score →
        </button>

        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "0.5px solid var(--border-subtle)" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Risk Factors</p>
          {riskFactors.map((r, i) => (
            <div key={i} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{r.factor}</span>
                <span className={`badge ${r.severity === "high" ? "badge-danger" : r.severity === "medium" ? "badge-warning" : "badge-acid"}`} style={{ fontSize: "10px" }}>{r.severity}</span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const prompts = [
  "Score my GSTIN audit risk",
  "Explain ITC mismatch and how to fix it",
  "What triggers a GST audit?",
  "Help me prepare for a GST audit",
];

export default function AuditShieldPage() {
  return (
    <AgentChatLayout
      agentName="Audit Shield"
      agentIcon="🔒"
      agentDescription="Score your GSTIN audit risk and fix vulnerabilities before they find you."
      agentId="A12"
      rightPanel={<AuditPanel />}
    >
      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Audit Shield</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Know your audit risk before the taxman does. Score your GSTIN and fix vulnerabilities proactively.
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
