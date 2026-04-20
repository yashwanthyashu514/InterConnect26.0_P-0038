"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function PenaltyClock() {
  const [penalty, setPenalty] = useState(8400);
  useEffect(() => {
    const interval = setInterval(() => setPenalty((p) => p + 1), 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div style={{ position: "absolute", top: "80px", right: "16px", background: "var(--glass-bg)", backdropFilter: "blur(16px)", border: "0.5px solid rgba(255,94,94,0.3)", borderRadius: "12px", padding: "14px 18px", zIndex: 10, minWidth: "220px" }}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--danger)", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>⏱ Late Filing Penalty</p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--danger)", letterSpacing: "-1px" }}>₹{penalty.toLocaleString("en-IN")}</p>
      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>AY 2024-25 · Accruing now</p>
      <button 
        className="btn-primary btn-sm" 
        style={{ width: "100%", justifyContent: "center", fontSize: "11px", padding: "7px" }}
        onClick={() => triggerAction("Help me file my ITR now to stop this penalty accruing.")}
      >
        File Now →
      </button>
    </div>
  );
}

function TaxContextPanel() {
  const [regime, setRegime] = useState<"old" | "new">("new");

  useEffect(() => {
    const handleContext = (e: any) => {
      const content = e.detail?.fullContent?.toLowerCase() || "";
      if (content.includes("old regime") || content.includes("old tax regime")) {
        setRegime("old");
      } else if (content.includes("new regime") || content.includes("new tax regime")) {
        setRegime("new");
      }
    };
    window.addEventListener('neural-context-update', handleContext as EventListener);
    return () => window.removeEventListener('neural-context-update', handleContext as EventListener);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Tax Profile</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "PAN", value: "ABCDE****F" },
          { label: "Assessment Year", value: "AY 2024-25" },
          { label: "Filing Status", value: "Pending" },
          { label: "ITR Form", value: "ITR-1" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
            <span style={{ fontSize: "13px", color: item.label === "Filing Status" ? "var(--warning)" : "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Tax Regime</p>
      <div style={{ display: "flex", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "2px" }}>
        {(["old", "new"] as const).map((r) => (
          <button key={r} onClick={() => setRegime(r)} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: "none", cursor: "pointer", background: regime === r ? "var(--acid)" : "transparent", color: regime === r ? "var(--bg-primary)" : "var(--text-muted)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: regime === r ? 600 : 400 }}>
            {r === "old" ? "Old" : "New"} Regime
          </button>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "Calculate my tax liability for AY 2024-25",
  "What is the penalty for late ITR filing?",
  "Compare Old vs New tax regime for me",
  "Help me respond to a tax notice",
];

export default function TaxPage() {
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
      agentName="Supreme Tax"
      agentIcon="📋"
      agentDescription="Penalty clocks, ITR guidance, and real-time tax advisory."
      agentId="A1"
      rightPanel={<TaxContextPanel />}
      extraTopBarContent={<PenaltyClock />}
    >
      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Supreme Tax</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Your AI tax advisor for ITR filing, GST, deductions, and notices. Get expert-level guidance instantly.
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
