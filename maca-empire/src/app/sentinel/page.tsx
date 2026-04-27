"use client";
import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Am I compliant with the DPDP Act 2023?",
  "Conduct an AI governance risk assessment",
  "Help me fill out my SEBI BRSR report",
  "How does the EU AI Act affect my startup?",
];

export default function SentinelPage() {
  const triggerAction = (prompt: string) => {
    const input = document.querySelector('textarea');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(input, prompt);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(() => {
        const sendBtn = document.querySelector('.neural-send-button:not([disabled])') as HTMLButtonElement;
        sendBtn?.click();
      }, 100);
    }
  };

  return (
    <AgentChatLayout
      agentName="The AI Sentinel"
      agentIcon="🛡️"
      agentDescription="DPDP, AI Safety, ESG & Governance Compliance."
      agentId="E4"
    >
      <div className="empty-state">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>The AI Sentinel</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Unifying DPDP Shield, AI Governance, and ESG Compass. Total regulatory safety for modern enterprises.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill" onClick={() => triggerAction(p)}>{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
