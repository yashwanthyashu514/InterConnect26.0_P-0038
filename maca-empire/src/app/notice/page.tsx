"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function DraftPreviewPanel() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Draft Preview</p>
      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text-primary)" }}>To,</strong><br />
          The Assessing Officer,<br />
          Income Tax Department<br /><br />
          <strong style={{ color: "var(--text-primary)" }}>Subject:</strong> Reply to Notice under Section 148A<br /><br />
          I, the undersigned, hereby submit my response to the notice dated [Date]...<br /><br />
          <span style={{ color: "var(--acid)" }}>[AI-generated reply continues...]</span>
        </p>
      </div>
      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "9px", marginBottom: "8px" }}>
        Download PDF ↓
      </button>
      <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "9px" }}>
        Copy Text
      </button>
    </div>
  );
}

const prompts = [
  "Upload my GST notice and draft a reply",
  "Explain Section 148A notice and how to respond",
  "Draft a response to scrutiny assessment notice",
  "What documents do I need for this notice?",
];

export default function NoticePage() {
  return (
    <AgentChatLayout
      agentName="Notice Fighter"
      agentIcon="📝"
      agentDescription="Draft legally sound replies to Income Tax and GST notices in minutes."
      rightPanel={<DraftPreviewPanel />}
    >
      {/* Deadline banner */}
      <div style={{ background: "rgba(255,184,0,0.08)", border: "0.5px solid rgba(255,184,0,0.25)", borderRadius: "10px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "18px" }}>⚠️</span>
        <div>
          <p style={{ fontSize: "13px", color: "var(--warning)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Notice deadline: <strong>15 days remaining</strong> — Reply before Apr 24, 2025</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Section 148A · Income Tax Dept · AY 2023-24</p>
        </div>
      </div>

      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Notice Fighter</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Upload your notice and get a legally sound AI-drafted reply in minutes.
        </p>
        {/* Upload zone */}
        <div style={{ width: "100%", maxWidth: "400px", border: "1.5px dashed rgba(181,255,46,0.3)", borderRadius: "12px", padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "rgba(181,255,46,0.02)" }}>
          <p style={{ fontSize: "24px", marginBottom: "8px" }}>📤</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>Upload your notice</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>PDF or image · Agent auto-reads & classifies</p>
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
