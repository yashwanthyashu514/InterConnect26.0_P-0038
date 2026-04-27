"use client";
import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Calculate my tax liability for AY 2025-26",
  "Is my crypto swap taxable?",
  "Analyze my company for potential tax leakage",
  "Check FEMA compliance for my foreign investment",
];

export default function ChancellorPage() {
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
      agentName="The Chancellor"
      agentIcon="🏛️"
      agentDescription="India's Supreme Financial Authority — Tax, Crypto, Audit & Trade."
      agentId="E1"
    >
      <div className="empty-state">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>The Chancellor</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Combining the intelligence of Supreme Tax, CryptoTax Pro, Forensic Audit, and Trade & Forex into one sovereign interface.
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
