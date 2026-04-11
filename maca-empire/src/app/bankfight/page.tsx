"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const majorBanks = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Bank of Baroda", "Punjab National Bank", "Canara Bank", "Union Bank", "IndusInd Bank"];

const escalationSteps = [
  { label: "Complaint Filed", status: "done" },
  { label: "Bank Response Awaited", status: "active" },
  { label: "Nodal Officer Escalated", status: "pending" },
  { label: "RBI Ombudsman", status: "pending" },
  { label: "Resolved", status: "pending" },
];

const nodalDirectory = [
  { bank: "HDFC Bank", email: "nodal.officer@hdfcbank.com", portal: "https://www.hdfcbank.com/grievance" },
  { bank: "SBI", email: "cgm.bcmcc@sbi.co.in", portal: "https://crcf.sbi.co.in" },
  { bank: "ICICI Bank", email: "head.service@icicibank.com", portal: "https://www.icicibank.com/grievance" },
  { bank: "Axis Bank", email: "nodaloff@axisbank.com", portal: "https://www.axisbank.com/grievance" },
];

function EscalationPanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Escalation Tracker</p>
      <div className="stepper">
        {escalationSteps.map((step, i) => (
          <div key={i} className="step-item">
            {i < escalationSteps.length - 1 && <div className="step-line" />}
            <div className={`step-dot ${step.status}`}>{step.status === "done" ? "✓" : i + 1}</div>
            <div style={{ paddingTop: "4px" }}>
              <p style={{ fontSize: "13px", color: step.status === "pending" ? "var(--text-muted)" : "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: step.status === "active" ? 500 : 400 }}>{step.label}</p>
              {step.status === "active" && <p style={{ fontSize: "11px", color: "var(--warning)", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>In progress · 5 days</p>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "0.5px solid var(--border-subtle)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Nodal Directory</p>
        {nodalDirectory.map((item, i) => (
          <div key={i} style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "8px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "3px" }}>{item.bank}</p>
            <p style={{ fontSize: "11px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>{item.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "Draft an RBI Ombudsman complaint for unauthorized debit",
  "Find the nodal officer email for HDFC Bank",
  "My loan was mis-sold — what are my options?",
  "Generate a banking grievance letter",
];

export default function BankFightPage() {
  const [selectedBank, setSelectedBank] = useState("");

  return (
    <AgentChatLayout
      agentName="BankFight"
      agentIcon="🏦"
      agentDescription="Escalate banking disputes to RBI, nodal officers, and Banking Ombudsman."
      agentId="A2"
      rightPanel={<EscalationPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">🏦</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>BankFight</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Fight back against your bank. Generate RBI complaints, escalation letters, and ombudsman filings.
        </p>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="input-dark"
            style={{ marginBottom: "16px" }}
          >
            <option value="">Select your bank to get started...</option>
            {majorBanks.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
