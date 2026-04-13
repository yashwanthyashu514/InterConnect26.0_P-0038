"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function ContractPanel() {
  const annotations = [
    { clause: "Limitation of Liability", risk: "high", note: "Cap is too low — suggests negotiation" },
    { clause: "Auto-Renewal (Clause 12)", risk: "high", note: "30-day notice required to cancel" },
    { clause: "Governing Law", risk: "medium", note: "Jurisdiction is Delaware — consider India" },
    { clause: "IP Assignment", risk: "high", note: "Overly broad — includes future inventions" },
    { clause: "Payment Terms (Net-60)", risk: "low", note: "Standard but could negotiate Net-30" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Annotations</p>
        <button className="btn-primary btn-sm" style={{ fontSize: "10px", padding: "5px 12px" }}>Export Redlined DOCX</button>
      </div>

      {/* Mock PDF view */}
      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "16px", marginBottom: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
        <p style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "8px" }}>SERVICE AGREEMENT</p>
        <p>This Agreement is entered into as of [Date] between...</p>
        <p style={{ background: "rgba(255,94,94,0.15)", borderRadius: "3px", padding: "2px 4px", display: "inline" }}>Clause 5: Liability limited to 1 month fees</p>
        <p>…provided that all works created shall vest in the Company...</p>
        <p style={{ background: "rgba(255,184,0,0.12)", borderRadius: "3px", padding: "2px 4px", display: "inline" }}>Clause 12: Agreement auto-renews annually</p>
      </div>

      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Risk Flags</p>
      {annotations.map((a, i) => (
        <div key={i} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "10px 12px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", fontWeight: 500 }}>{a.clause}</span>
            <span className={`badge ${a.risk === "high" ? "badge-danger" : a.risk === "medium" ? "badge-warning" : "badge-acid"}`} style={{ fontSize: "10px" }}>{a.risk}</span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{a.note}</p>
        </div>
      ))}
    </div>
  );
}

const prompts = [
  "Upload a contract for review",
  "Find all unfair clauses in this agreement",
  "Summarize this NDA in plain English",
  "What is missing from this employment contract?",
];

export default function ContractReviewerPage() {
  return (
    <AgentChatLayout
      agentName="Contract Reviewer"
      agentIcon="📄"
      agentDescription="Upload any contract. Get AI redlining, risk flags, and plain-English summaries."
      rightPanel={<ContractPanel />}
    >
      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Contract Reviewer</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Upload any contract for AI-powered redlining, clause risk analysis, and plain-English summaries.
        </p>
        <div style={{ width: "100%", maxWidth: "400px", border: "1.5px dashed rgba(181,255,46,0.3)", borderRadius: "12px", padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "rgba(181,255,46,0.02)" }}>
          <p style={{ fontSize: "24px", marginBottom: "8px" }}>📤</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>Upload contract (PDF or DOCX)</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>AI will auto-read and flag risky clauses</p>
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
