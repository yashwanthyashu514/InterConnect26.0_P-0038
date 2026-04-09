"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const stateRERA = [
  { state: "Maharashtra", portal: "https://maharera.mahaonline.gov.in", rules: "MahaRERA 2017" },
  { state: "Delhi", portal: "https://rera.delhi.gov.in", rules: "Delhi RERA 2017" },
  { state: "Karnataka", portal: "https://rera.karnataka.gov.in", rules: "Karnataka RERA 2017" },
  { state: "Tamil Nadu", portal: "https://tnrera.in", rules: "TN RERA 2017" },
  { state: "Gujarat", portal: "https://gujrera.gujarat.gov.in", rules: "Gujarat RERA 2017" },
];

function RERAPanel() {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const stateInfo = stateRERA.find((s) => s.state === selectedState)!;

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>State RERA</p>
      <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="input-dark" style={{ marginBottom: "12px", fontSize: "13px" }}>
        {stateRERA.map((s) => <option key={s.state}>{s.state}</option>)}
      </select>
      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)", marginBottom: "4px" }}>Governing Rules</p>
        <p style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "8px" }}>{stateInfo.rules}</p>
        <p style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)", marginBottom: "4px" }}>Portal</p>
        <a href={stateInfo.portal} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", wordBreak: "break-all" }}>{stateInfo.portal}</a>
      </div>

      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Quick Complaint Builder</p>
      {["Builder Name", "Project RERA Registration No.", "Agreement Date", "Promised Possession Date", "Issue Type"].map((field, i) => (
        <input key={i} placeholder={field} className="input-dark" style={{ marginBottom: "8px", fontSize: "12px" }} />
      ))}
      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "9px" }}>
        Generate RERA Complaint →
      </button>
    </div>
  );
}

const prompts = [
  "Draft a RERA complaint for delayed possession",
  "Check if my builder is registered under RERA",
  "What compensation am I entitled to for delay?",
  "Generate a legal notice to my builder",
];

export default function RERAPage() {
  return (
    <AgentChatLayout
      agentName="RERA Fighter"
      agentIcon="🏘️"
      agentDescription="Fight builder defaults, delayed possession, and RERA violations."
      rightPanel={<RERAPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">🏘️</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>RERA Fighter</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Your builder is accountable under RERA. File complaints, get compensation, and enforce your rights.
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
