"use client";
import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Draft a reply to this income tax notice",
  "Redline this SHA for risk factors",
  "How do I incorporate a startup in India?",
  "Check the status of my e-court filing",
];

export default function AdvocatePage() {
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
      agentName="The Grand Advocate"
      agentIcon="⚖️"
      agentDescription="Master of Disputes, Corporate Counsel, Contracts & Courts."
      agentId="E2"
    >
      <div className="empty-state">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>The Grand Advocate</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Unifying Notice Advisor, Corporate Counsel, Deal Reviewer, and Filing Ops for total legal situational awareness.
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
