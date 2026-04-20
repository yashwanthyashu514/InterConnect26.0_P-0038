"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Classify my AI hiring tool under EU AI Act risk tiers",
  "Draft a Responsible AI Policy for my organisation",
  "Review my AI vendor contract for liability gaps",
  "Generate DPDP algorithmic audit template for my AI system",
  "My company faced a deepfake incident — help me respond legally",
];

export default function AIGovernancePage() {
  return (
    <AgentChatLayout
      agentName="AI Governance Counsel"
      agentIcon="🧠"
      agentDescription="EU AI Act Compliance, Algorithmic Accountability & Responsible AI Engine"
      agentId="A25"
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(15, 118, 110, 0.1)", color: "#0F766E" }}>🧠</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>AI Governance Counsel</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          Classifies AI systems under EU AI Act risk tiers, generates DPDP algorithmic accountability audits, redlines AI procurement contracts, drafts responsible AI policies, and responds to deepfake and synthetic media incidents.
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
