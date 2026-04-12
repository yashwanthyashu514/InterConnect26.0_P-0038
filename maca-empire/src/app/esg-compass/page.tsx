"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Auto-fill my BRSR Core template for FY 2024-25",
  "Calculate my company Scope 1, 2, and 3 GHG emissions",
  "Analyse my EU CBAM exposure as a steel exporter",
  "Draft my ESG policy document",
  "Generate board-ready ESG narrative for annual report",
];

export default function ESGCompassPage() {
  return (
    <AgentChatLayout
      agentName="ESG Compass"
      agentIcon="🍃"
      agentDescription="SEBI BRSR Reporting Engine & EU CBAM Carbon Compliance"
      agentId="A23"
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(15, 118, 110, 0.1)", color: "#0F766E" }}>🍃</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>ESG Compass</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          Automates SEBI BRSR Core filing for listed companies, calculates GHG Scope 1/2/3 emissions, analyses EU CBAM carbon border tax exposure for Indian exporters, and generates board-ready ESG reports.
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
                    const sendBtn = document.querySelector('.chat-input-bar button:not([disabled])') as HTMLButtonElement;
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
