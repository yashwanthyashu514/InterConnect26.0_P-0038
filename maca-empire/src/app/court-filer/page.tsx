"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const docTypes = [
  { icon: "⚖️", label: "Petition", desc: "Civil or criminal petition" },
  { icon: "📜", label: "Affidavit", desc: "Sworn statement of facts" },
  { icon: "📨", label: "Legal Notice", desc: "Demand or cease & desist" },
  { icon: "🛒", label: "Consumer Complaint", desc: "NCDRC / State forum" },
  { icon: "🏛️", label: "Writ Petition", desc: "High Court / Supreme Court" },
  { icon: "📝", label: "Reply", desc: "Reply to notice or complaint" },
];

function CourtPreviewPanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Court Preview</p>
      <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", color: "#111", fontFamily: "Georgia, serif", fontSize: "12px", lineHeight: 1.8 }}>
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>IN THE DISTRICT COURT</p>
        <p style={{ textAlign: "center", fontSize: "12px", marginBottom: "4px" }}>AT [City], [State]</p>
        <p style={{ textAlign: "center", marginBottom: "16px" }}>Case No. ____/2025</p>
        <p style={{ textAlign: "center", marginBottom: "2px" }}>Arjun Sharma</p>
        <p style={{ textAlign: "center", marginBottom: "8px", fontSize: "11px" }}>...Petitioner/Complainant</p>
        <p style={{ textAlign: "center", marginBottom: "2px" }}>v/s</p>
        <p style={{ textAlign: "center", marginBottom: "2px" }}>Respondent Co. Ltd.</p>
        <p style={{ textAlign: "center", marginBottom: "16px", fontSize: "11px" }}>...Respondent</p>
        <p style={{ fontWeight: 700, marginBottom: "8px" }}>CONSUMER COMPLAINT</p>
        <p>The Complainant above-named respectfully submits as follows:</p>
        <p style={{ color: "#888" }}>[AI-generated complaint continues...]</p>
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button className="btn-primary btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px" }}>Download PDF</button>
        <button className="btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px" }}>Copy</button>
      </div>
    </div>
  );
}

const prompts = [
  "Draft a consumer complaint against a builder",
  "Generate a legal notice for non-payment",
  "Help me file a writ petition",
  "Draft an affidavit for property matter",
];

export default function CourtFilerPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [jurisdiction, setJurisdiction] = useState("District Court");

  return (
    <AgentChatLayout
      agentName="Court Filer"
      agentIcon="⚖️"
      agentDescription="Generate court-ready petitions, affidavits, and legal notices in correct format."
      rightPanel={<CourtPreviewPanel />}
      extraTopBarContent={
        <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}
          style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "6px 12px", color: "var(--text-secondary)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          {["District Court", "High Court", "Supreme Court", "Consumer Forum", "NCDRC"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      }
    >
      {!selected ? (
        <div className="empty-state">
          
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Select Document Type</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "400px" }}>
            Choose your document type to get a court-ready draft in proper legal format.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", width: "100%", maxWidth: "500px" }}>
            {docTypes.map((d) => (
              <button key={d.label} onClick={() => setSelected(d.label)} style={{ padding: "16px 12px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", cursor: "pointer", textAlign: "center", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>{d.icon}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "12px", color: "var(--text-primary)", marginBottom: "2px" }}>{d.label}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{d.desc}</p>
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
            {selected} selected · {jurisdiction}
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>Describe your case and the agent will draft it in proper court format</p>
          <button onClick={() => setSelected(null)} className="btn-ghost btn-sm">← Change Type</button>
        </div>
      )}
    </AgentChatLayout>
  );
}
