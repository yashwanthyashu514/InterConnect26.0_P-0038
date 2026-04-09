"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const acts = [
  { name: "Industrial Disputes Act, 1947", relevance: "Wrongful termination, lay-offs" },
  { name: "Factories Act, 1948", relevance: "Working conditions, hours, safety" },
  { name: "POSH Act, 2013", relevance: "Sexual harassment at workplace" },
  { name: "Payment of Gratuity Act, 1972", relevance: "Gratuity entitlement & calculation" },
  { name: "EPF & MP Act, 1952", relevance: "Provident fund disputes" },
  { name: "Minimum Wages Act, 1948", relevance: "Underpayment disputes" },
];

function LabourPanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Applicable Acts</p>
      {acts.map((act, i) => (
        <div key={i} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
          <p style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", fontWeight: 500, marginBottom: "3px" }}>{act.name}</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{act.relevance}</p>
        </div>
      ))}
    </div>
  );
}

const prompts = [
  "I was wrongfully terminated — what can I do?",
  "Draft a termination notice for an employee",
  "What is the gratuity I am entitled to?",
  "Help me file a complaint under POSH",
];

export default function LabourLawPage() {
  const [role, setRole] = useState<"employee" | "employer">("employee");

  return (
    <AgentChatLayout
      agentName="Labour Law"
      agentIcon="👷"
      agentDescription="Protect your employee rights and resolve workplace disputes."
      rightPanel={<LabourPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">👷</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Labour Law Agent</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Navigate Indian labour law whether you&apos;re an employee fighting for your rights or an employer ensuring compliance.
        </p>

        {/* Role selector */}
        <div style={{ display: "flex", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "4px", gap: "4px" }}>
          <button onClick={() => setRole("employee")} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", background: role === "employee" ? "var(--acid)" : "transparent", color: role === "employee" ? "var(--bg-primary)" : "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: role === "employee" ? 600 : 400, transition: "all 0.2s" }}>
            👤 I am an Employee
          </button>
          <button onClick={() => setRole("employer")} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", background: role === "employer" ? "var(--acid)" : "transparent", color: role === "employer" ? "var(--bg-primary)" : "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: role === "employer" ? 600 : 400, transition: "all 0.2s" }}>
            🏢 I am an Employer
          </button>
        </div>

        <div className="suggested-prompts">
          {(role === "employee"
            ? ["I was wrongfully terminated — what can I do?", "What is the gratuity I am entitled to?", "File a complaint under POSH", "My employer is not paying PF — help!"]
            : ["Draft a termination notice for an employee", "What are my obligations under POSH Act?", "Calculate gratuity for 8 years of service", "Draft an employment contract"]
          ).map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
