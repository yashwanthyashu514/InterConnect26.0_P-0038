"use client";
import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Fix my banking dispute with the ombudsman",
  "Automate my payroll and PF compliance",
  "How can I improve my credit score?",
  "Run a command nexus scan for business efficiency",
];

export default function OptimizerPage() {
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
      agentName="The Master Optimizer"
      agentIcon="⚙️"
      agentDescription="Operations, Payroll, HR & Banking Efficiency."
      agentId="E5"
    >
      <div className="empty-state">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>The Master Optimizer</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Consolidating Banking & Credit, Payroll & HR, and Command Nexus. Frictionless operations for your empire.
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
