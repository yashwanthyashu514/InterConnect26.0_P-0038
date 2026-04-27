"use client";
import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "What is the market outlook for Indian equities?",
  "Analyze this M&A deal for synergy",
  "How should I structure my family trust?",
  "Draft a will for my estate planning",
];

export default function BankerPage() {
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
      agentName="The Sovereign Banker"
      agentIcon="💰"
      agentDescription="Wealth, Market Wisdom, M&A & Succession Planning."
      agentId="E3"
    >
      <div className="empty-state">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>The Sovereign Banker</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          The Oracle, Victor Harlan, Elite Wealth, and HeirGuard combined. Institutional wisdom for high-stakes capital.
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
