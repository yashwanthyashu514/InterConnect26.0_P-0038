"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const escalationSteps = [
  { label: "Claim Filed", status: "done" },
  { label: "Insurer Response", status: "active" },
  { label: "IRDAI Grievance", status: "pending" },
  { label: "Insurance Ombudsman", status: "pending" },
  { label: "Court", status: "pending" },
];

const insurers = [
  { name: "Star Health", email: "grievance@starhealth.in", portal: "https://irdai.gov.in" },
  { name: "HDFC Ergo", email: "grievances@hdfcergo.com", portal: "https://irdai.gov.in" },
  { name: "ICICI Lombard", email: "customersupport@icicilombard.com", portal: "https://irdai.gov.in" },
  { name: "LIC", email: "co_pgredress@licindia.com", portal: "https://irdai.gov.in" },
];

function InsurancePanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Claim Escalation</p>
      <div className="stepper">
        {escalationSteps.map((step, i) => (
          <div key={i} className="step-item">
            {i < escalationSteps.length - 1 && <div className="step-line" />}
            <div className={`step-dot ${step.status}`}>{step.status === "done" ? "✓" : i + 1}</div>
            <div style={{ paddingTop: "4px" }}>
              <p style={{ fontSize: "13px", color: step.status === "pending" ? "var(--text-muted)" : "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: step.status === "active" ? 500 : 400 }}>{step.label}</p>
              {step.status === "active" && <p style={{ fontSize: "11px", color: "var(--warning)", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Awaiting · 12 days</p>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "0.5px solid var(--border-subtle)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Insurer Directory</p>
        {insurers.map((ins, i) => (
          <div key={i} style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "8px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "3px" }}>{ins.name}</p>
            <p style={{ fontSize: "11px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>{ins.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "My health claim was rejected — draft an appeal",
  "File a complaint with IRDAI against my insurer",
  "What are my rights when a claim is denied?",
  "Draft a letter to the Insurance Ombudsman",
];

export default function InsuranceFighterPage() {
  return (
    <AgentChatLayout
      agentName="Insurance Fighter"
      agentIcon="🛡️"
      agentDescription="Fight wrongful claim rejections with IRDAI-compliant dispute letters."
      rightPanel={<InsurancePanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">🛡️</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Insurance Fighter</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Don&apos;t let your insurer get away with wrongful rejections. File IRDAI complaints and ombudsman appeals.
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
