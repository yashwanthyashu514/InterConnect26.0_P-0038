"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Draft my Last Will and Testament",
  "Who are my legal heirs under Hindu Succession Act?",
  "Generate asset transmission checklist after death",
  "How do I update my nominee in demat and mutual funds?",
  "Create a digital asset inheritance plan for my crypto",
];

export default function HeirGuardPage() {
  return (
    <AgentChatLayout
      agentName="HeirGuard"
      agentIcon="📜"
      agentDescription="Will Drafting, Succession Planning & Estate Transmission Engine"
      agentId="A24"
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(15, 118, 110, 0.1)", color: "#0F766E" }}>📜</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>HeirGuard</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          Drafts legally sound Wills under Indian Succession Act 1925, provides religion-specific succession advisory under Hindu, Muslim, and Christian personal laws, generates probate applications, and builds complete asset transmission checklists.
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
