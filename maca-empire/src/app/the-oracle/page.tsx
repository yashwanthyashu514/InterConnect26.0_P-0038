"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Give me your thesis on Nifty 50 at current levels",
  "Should I buy BTC right now — long or short?",
  "Review my Rs.25L portfolio and stress test it",
  "What does the current macro setup mean for Indian equities?",
  "Compare current market to 2008 GFC — what is your read?",
];

export default function TheOraclePage() {
  return (
    <AgentChatLayout
      agentName="The Oracle"
      agentIcon="📈"
      agentDescription="50-Year RAG-Powered Finance Advisor — Equities, Forex & Crypto"
      agentId="A26"
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(15, 118, 110, 0.1)", color: "#0F766E" }}>📈</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>The Oracle</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          A RAG-powered AI finance advisor carrying 50+ years of compounded trading intelligence. Two-layer intelligence: static knowledge base of crisis playbooks and billionaire investor frameworks — plus live daily-refreshed market data. Not a chatbot. A mentor.
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
