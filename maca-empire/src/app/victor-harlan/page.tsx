"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "We're selling our SaaS company — $40M revenue, $12M EBITDA, 35% growth. What are we worth?",
  "What's an LBO and how does the returns math work?",
  "A strategic just submitted a hostile bid at a 15% premium. What do we do?",
  "Is now a good time to do an IPO?",
  "Build me a valuation range for a $200M revenue fintech using comps",
  "Walk me through a sell-side M&A process start to finish",
];

export default function VictorHarlanPage() {
  return (
    <AgentChatLayout
      agentName="Victor Harlan"
      agentIcon="🏦"
      agentDescription="Senior Managing Director — 52 Years on Wall Street"
      agentId="A28"
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(181,255,46,0.08)", color: "#B5FF2E" }}>🏦</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>Victor Harlan</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "500px" }}>
          52 years on Wall Street. Goldman Sachs to Managing Director. 340+ transactions across M&A, IPOs, LBOs, and sovereign debt. 11 clients taken from sub-$100M to billionaire status through deal sequencing. Tell me what you're working on — deal, question, or problem. Skip the preamble.
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
