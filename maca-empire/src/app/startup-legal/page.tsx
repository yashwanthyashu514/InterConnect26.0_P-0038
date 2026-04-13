"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const toolCards = [
  { icon: "🏛️", title: "Company Registration", desc: "Pvt Ltd / LLP / OPC incorporation" },
  { icon: "💹", title: "ESOP Calculator", desc: "Vesting schedule & option value" },
  { icon: "📋", title: "Term Sheet Reviewer", desc: "VC term sheet risk analysis" },
  { icon: "🤝", title: "SHA Drafter", desc: "Shareholders agreement builder" },
  { icon: "📝", title: "MoU Generator", desc: "Memorandum of Understanding" },
  { icon: "™️", title: "Trademark Check", desc: "Availability & class search" },
];

function StartupPanel() {
  const [totalShares, setTotalShares] = useState(1000000);
  const [employees, setEmployees] = useState(5);
  const [poolPct, setPoolPct] = useState(10);

  const poolShares = totalShares * (poolPct / 100);
  const perEmployee = poolShares / employees;
  const assumedValuation = 5000000;
  const perShareValue = assumedValuation / totalShares;
  const optionValue = perEmployee * perShareValue;

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>ESOP Calculator</p>
      {[
        { label: "Total Shares", value: totalShares, setter: setTotalShares, min: 100000, max: 10000000, step: 100000 },
        { label: `ESOP Pool (${poolPct}%)`, value: poolPct, setter: setPoolPct, min: 5, max: 25, step: 1, isRange: true },
        { label: "No. of Employees", value: employees, setter: setEmployees, min: 1, max: 50, step: 1 },
      ].map((field, i) => (
        <div key={i} style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: "5px" }}>
            {field.label}: {field.isRange ? <span style={{ color: "var(--acid)" }}>{field.value}%</span> : field.value.toLocaleString("en-IN")}
          </label>
          {field.isRange ? (
            <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={(e) => field.setter(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--acid)" }} />
          ) : (
            <input type="number" value={field.value} onChange={(e) => field.setter(Number(e.target.value))} className="input-dark" style={{ fontSize: "13px" }} />
          )}
        </div>
      ))}
      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "16px" }}>
        {[
          { label: "Pool Shares", value: poolShares.toLocaleString("en-IN") },
          { label: "Per Employee", value: Math.round(perEmployee).toLocaleString("en-IN") + " options" },
          { label: "Assumed Valuation", value: `₹${(assumedValuation / 100000).toFixed(1)}L` },
          { label: "Option Value/Employee", value: `₹${Math.round(optionValue).toLocaleString("en-IN")}` },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{r.label}</span>
            <span style={{ fontSize: "12px", color: i === 3 ? "var(--acid)" : "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "How do I incorporate a Private Limited Company?",
  "Draft a co-founder agreement",
  "Review this term sheet from a VC",
  "Calculate ESOP for 5 employees",
];

export default function StartupLegalPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <AgentChatLayout
      agentName="Startup Legal"
      agentIcon="🚀"
      agentDescription="Incorporation, ESOP, term sheets, and compliance for Indian startups."
      rightPanel={<StartupPanel />}
    >
      {!selectedTool ? (
        <div className="empty-state">
          
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Startup Legal Toolkit</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
            Everything a founder needs — from incorporation to ESOP, term sheets to shareholder agreements.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", width: "100%", maxWidth: "500px" }}>
            {toolCards.map((t) => (
              <button key={t.title} onClick={() => setSelectedTool(t.title)} style={{ padding: "16px 12px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", cursor: "pointer", textAlign: "center", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>{t.icon}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "11px", color: "var(--text-primary)", marginBottom: "2px" }}>{t.title}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{t.desc}</p>
              </button>
            ))}
          </div>
          <div className="suggested-prompts">
            {prompts.map((p, i) => (
              <button key={i} className="prompt-pill">{p}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div style={{ background: "var(--acid)", color: "var(--bg-primary)", padding: "8px 16px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500 }}>
            {toolCards.find((t) => t.title === selectedTool)?.icon} {selectedTool}
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>Describe your startup and requirements below</p>
          <button onClick={() => setSelectedTool(null)} className="btn-ghost btn-sm">← Back to Tools</button>
        </div>
      )}
    </AgentChatLayout>
  );
}
