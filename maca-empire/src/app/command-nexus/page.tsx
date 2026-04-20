"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "I have a PE deal, an I-T notice, and a succession to handle — orchestrate all three",
  "Our family has 20 entities across 4 jurisdictions — who should manage what?",
  "There's a SEBI SAST disclosure due tomorrow AND a TDS deadline — triage this",
  "Route me to the right agent for a ₹2,000Cr M&A cross-border deal",
  "Elite client onboarding — 15 entities, Singapore + Mauritius + India",
];

const escalationChains = [
  { trigger: "Compliance Deadline Breach", agents: ["A1", "A8"], color: "#60A5FA" },
  { trigger: "Tax Raid Active (S.132)", agents: ["A3", "A12", "A27"], color: "#FF5E5E" },
  { trigger: "M&A Deal Live", agents: ["A7", "A13", "A27"], color: "#FB923C" },
  { trigger: "Succession Event", agents: ["A24", "A27"], color: "#C084FC" },
  { trigger: "SEBI Notice", agents: ["A3", "A27"], color: "#FFB800" },
  { trigger: "Crypto Notice", agents: ["A22", "A3"], color: "#34D399" },
];

function OrchestratorPanel() {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
        Escalation Matrix
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
        {escalationChains.map((chain, i) => (
          <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "10px", borderLeft: `2px solid ${chain.color}` }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: chain.color, fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>{chain.trigger}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {chain.agents.map((a, j) => (
                <span key={j} style={{ padding: "2px 8px", background: `${chain.color}18`, border: `0.5px solid ${chain.color}44`, borderRadius: "4px", fontSize: "10px", fontWeight: 800, color: chain.color, fontFamily: "'DM Sans', sans-serif" }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
        Elite Mode Trigger
      </p>
      <div style={{ padding: "14px", background: "rgba(181,255,46,0.05)", border: "0.5px solid rgba(181,255,46,0.2)", borderRadius: "10px" }}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
          Auto-routes to <span style={{ color: "#B5FF2E", fontWeight: 700 }}>A27 Elite Wealth Architect</span> when:<br />
          Net Worth &gt; <span style={{ color: "#B5FF2E" }}>₹100Cr</span> <span style={{ opacity: 0.4 }}>OR</span> <span style={{ color: "#B5FF2E" }}>5+ entities</span> <span style={{ opacity: 0.4 }}>OR</span> <span style={{ color: "#B5FF2E" }}>2+ jurisdictions</span>
        </p>
      </div>
    </div>
  );
}

export default function CommandNexusPage() {
  return (
    <AgentChatLayout
      agentName="Command Nexus"
      agentIcon="⚡"
      agentDescription="Master Orchestrator — intent classification, urgency triage, and elite agent dispatch."
      agentId="A0"
      rightPanel={<OrchestratorPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(181,255,46,0.08)", border: "0.5px solid rgba(181,255,46,0.3)", color: "#B5FF2E", fontSize: "32px" }}>
          ⚡
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "#fff" }}>
          Command Nexus
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", maxWidth: "460px", lineHeight: 1.7 }}>
          The Master Orchestrator of Imperio Neural. Every sovereign query starts here — classified, triaged, routed to the correct specialist, and synthesized into a unified response.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "460px" }}>
          {["Intent Classification", "Urgency Triage", "Elite Mode Routing", "Multi-Agent Fanout", "Response Synthesis"].map((tag, i) => (
            <span key={i} style={{ padding: "4px 12px", background: "rgba(181,255,46,0.08)", border: "0.5px solid rgba(181,255,46,0.2)", borderRadius: "100px", fontSize: "11px", color: "#B5FF2E", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button
              key={i}
              className="prompt-pill"
              onClick={() => {
                const input = document.querySelector("textarea");
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                  nativeInputValueSetter?.call(input, p);
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                  setTimeout(() => {
                    const sendBtn = document.querySelector(".neural-send-button:not([disabled])") as HTMLButtonElement;
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
