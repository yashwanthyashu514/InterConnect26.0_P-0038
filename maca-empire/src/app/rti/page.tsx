"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const departments = [
  { name: "Ministry of Finance", pio: "US (OL), Dept of Revenue", address: "North Block, New Delhi - 110001" },
  { name: "EPFO", pio: "Regional PF Commissioner", address: "EPFO Regional Office, [State]" },
  { name: "Municipal Corporation", pio: "Assistant Commissioner", address: "Municipal Corporation Office, [City]" },
  { name: "Income Tax Dept", pio: "CPIO, Principal CIT", address: "Aaykar Bhawan, [City]" },
  { name: "SEBI", pio: "CPIO, SEBI", address: "C4-A, G Block, Bandra Kurla Complex, Mumbai" },
];

function RTIPanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>RTI Application Preview</p>
      <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", color: "#111", fontFamily: "Georgia, serif", fontSize: "11px", lineHeight: 1.8, marginBottom: "12px" }}>
        <p style={{ fontWeight: 700, textAlign: "center", marginBottom: "4px" }}>APPLICATION UNDER RTI ACT, 2005</p>
        <p><strong>To,</strong><br />The Public Information Officer<br />[Department Name]<br />[Address]</p>
        <p style={{ marginTop: "8px" }}><strong>Subject:</strong> Seeking information under RTI Act 2005</p>
        <p style={{ marginTop: "8px" }}>I, [Name], a citizen of India, request the following information:<br />[Information requested by AI...]</p>
        <p style={{ marginTop: "8px" }}>I am enclosing ₹10/- as application fee via IPO/Demand Draft.</p>
        <p style={{ color: "#888", fontSize: "10px", marginTop: "8px" }}>[AI-generated RTI continues...]</p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn-primary btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px" }}>Download PDF ↓</button>
        <button className="btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "11px" }}>Copy Text</button>
      </div>

      <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "0.5px solid var(--border-subtle)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>PIO Directory</p>
        {departments.map((d, i) => (
          <div key={i} style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "8px", marginBottom: "6px" }}>
            <p style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", fontWeight: 500, marginBottom: "2px" }}>{d.name}</p>
            <p style={{ fontSize: "11px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>{d.pio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "Draft an RTI application to municipal corporation",
  "Who is the PIO for EPFO?",
  "How do I file an RTI online?",
  "My RTI was rejected — file a first appeal",
];

export default function RTIPage() {
  return (
    <AgentChatLayout
      agentName="RTI Drafter"
      agentIcon="📨"
      agentDescription="File RTI applications in proper format to get information from any government body."
      rightPanel={<RTIPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">📨</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>RTI Drafter</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Information is power. File RTI applications to any government department in correct statutory format.
        </p>
        <div style={{ background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "12px 16px", maxWidth: "400px", width: "100%" }}>
          <p style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "4px" }}>📌 Application fee: ₹10</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Response must be given within 30 days under RTI Act 2005</p>
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
