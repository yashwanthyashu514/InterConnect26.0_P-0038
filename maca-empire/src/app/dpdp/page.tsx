"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function DPDPComplianceWidget() {
  return (
    <div style={{ position: "absolute", top: "80px", right: "16px", background: "var(--glass-bg)", backdropFilter: "blur(16px)", border: "0.5px solid rgba(15, 118, 110, 0.3)", borderRadius: "12px", padding: "14px 18px", zIndex: 10, minWidth: "240px" }}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#0F766E", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>🚨 Penalty Exposure</p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--text-primary)", letterSpacing: "-1px" }}>₹250,00,00,000</p>
      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Max Individual Violation · Act 2023</p>
      <div style={{ height: "4px", background: "rgba(0,0,0,0.1)", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
        <div style={{ width: "15%", height: "100%", background: "#0F766E" }} />
      </div>
      <p style={{ fontSize: "10px", color: "#0F766E", fontWeight: 600 }}>15% Ready · Full Compliance by May 2027</p>
    </div>
  );
}

function DPDPSidebar() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Compliance Pillars</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          { label: "Consent Notice (Rule 3)", status: "Pending", color: "var(--warning)" },
          { label: "Data Principal Rights", status: "Critical", color: "var(--danger)" },
          { label: "Breach Notif (72 hrs)", status: "Ready", color: "var(--acid)" },
          { label: "SDF Audit Status", status: "N/A", color: "var(--text-muted)" },
        ].map((item, i) => (
          <div key={i} style={{ border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{item.label}</p>
            <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", color: item.color }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "Run a DPDP gap analysis for my company",
  "Draft a DPDP-compliant Consent Notice (Rule 3)",
  "Generate a DPIA template for my data processing",
  "Build my compliance roadmap to May 2027",
  "Am I a Significant Data Fiduciary?",
];

export default function DPDPPage() {
  return (
    <AgentChatLayout
      agentName="DPDP Shield"
      agentIcon="🛡️"
      agentDescription="Digital Personal Data Protection Act 2023 Compliance Engine."
      agentId="A21"
      rightPanel={<DPDPSidebar />}
      extraTopBarContent={<DPDPComplianceWidget />}
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(15, 118, 110, 0.1)", color: "#0F766E" }}>🛡️</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>DPDP Shield</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          Specialized AI compliance for India's DPDP Act 2023. We protect your business from ₹250Cr penalties through technical audits and legal drafting.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button 
              key={i} 
              className="prompt-pill"
              onClick={() => {
                const input = document.querySelector('textarea');
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                  nativeInputValueSetter?.call(input, p);
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  setTimeout(() => {
                    const sendBtn = document.querySelector('.neural-send-button:not([disabled])') as HTMLButtonElement;
                    sendBtn?.click();
                  }, 100);
                }
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
