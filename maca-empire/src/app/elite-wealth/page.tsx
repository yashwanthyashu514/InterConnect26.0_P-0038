"use client";

import React from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const prompts = [
  "Map my family's 12 entities across India, Singapore, and UAE",
  "Design an offshore SPV chain for ₹500Cr real estate portfolio",
  "We have a Section 132 I-T raid underway — what do we do right now?",
  "Structure a Private Discretionary Trust for my ₹800Cr listed company stake",
  "Assess GAAR exposure on our Mauritius holding structure",
  "Our family patriarch (age 72) has no Will — initiate succession protocol",
  "Model 3 scenarios for our PE exit with DXY shift impact",
  "Transfer Pricing documentation gaps for our Singapore HoldCo",
];

const wealthLayers = [
  { label: "Individual", desc: "Personal income & assets", color: "#B5FF2E" },
  { label: "HUF", desc: "Hindu Undivided Family unit", color: "#60A5FA" },
  { label: "Trust", desc: "Private Discretionary Trust", color: "#C084FC" },
  { label: "HoldCo", desc: "Indian Holding Company", color: "#FB923C" },
  { label: "OpCo", desc: "Operating Business Entities", color: "#34D399" },
  { label: "Offshore SPV", desc: "Singapore · UAE · Cayman · GIFT City", color: "#F472B6" },
];

function WealthLayerPanel() {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
        6-Layer Wealth Architecture
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
        {wealthLayers.map((layer, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "10px", borderLeft: `2px solid ${layer.color}` }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${layer.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: layer.color, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{layer.label}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{layer.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
        Activation Threshold
      </p>
      {[
        { label: "Net Worth", value: "₹100Cr+" },
        { label: "Entities", value: "5+ entities" },
        { label: "Jurisdictions", value: "2+ jurisdictions" },
        { label: "Annual Retainer", value: "₹25L – ₹2Cr" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#B5FF2E", fontFamily: "'DM Sans', sans-serif" }}>{item.value}</span>
        </div>
      ))}

      <div style={{ marginTop: "24px", padding: "14px", background: "rgba(181,255,46,0.05)", border: "0.5px solid rgba(181,255,46,0.2)", borderRadius: "10px" }}>
        <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#B5FF2E", marginBottom: "8px" }}>Proactive Alerts</p>
        {["Advance Tax Deadlines", "Budget Impact Briefs", "FEMA ODI Gaps", "GAAR Exposure Flags", "LRS Limit Tracking", "Succession Risk Monitor"].map((alert, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#B5FF2E", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>{alert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EliteWealthPage() {
  return (
    <AgentChatLayout
      agentName="Elite Wealth Architect"
      agentIcon="💎"
      agentDescription="UHNWI Crown Agent — Partner-level CA for ₹100Cr+ families. Shadow books, offshore SPV chains & generational legacy."
      agentId="A27"
      rightPanel={<WealthLayerPanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(181,255,46,0.08)", border: "0.5px solid rgba(181,255,46,0.3)", color: "#B5FF2E", fontSize: "32px" }}>
          💎
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "#fff" }}>
          Elite Wealth Architect
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", maxWidth: "480px", lineHeight: 1.7 }}>
          The Crown Agent of Imperio Neural. Partner-level sovereign intelligence for families with ₹100Cr+ net worth across 2+ jurisdictions.
          Shadow books. Master entity maps. Offshore SPV chains. Generational succession.
        </p>
        <div style={{ padding: "12px 20px", background: "rgba(181,255,46,0.05)", border: "0.5px solid rgba(181,255,46,0.2)", borderRadius: "10px", maxWidth: "480px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#B5FF2E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            Mandatory Diagnostics Before Any Advice
          </p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            Residential Status · Entity Map · Jurisdiction Footprint · Pending Proceedings · Family Member Roles
          </p>
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
                    const sendBtn = document.querySelector(".chat-input-bar button:not([disabled])") as HTMLButtonElement;
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
