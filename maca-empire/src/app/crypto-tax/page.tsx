"use client";

import React, { useState, useEffect } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function LiveTaxMeter() {
  const [price, setPrice] = useState(5842000);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => prev + (Math.random() * 2000 - 1000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tax = Math.max(0, (price - 4000000) * 0.3);

  return (
    <div style={{ position: "absolute", top: "80px", right: "16px", background: "var(--glass-bg)", backdropFilter: "blur(16px)", border: "0.5px solid rgba(181, 255, 46, 0.3)", borderRadius: "12px", padding: "14px 18px", zIndex: 10, minWidth: "240px" }}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>🔥 Live Tax Meter (VDA)</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>BTC Price</span>
        <span style={{ fontSize: "13px", fontWeight: 600 }}>₹{price.toLocaleString("en-IN", {maximumFractionDigits: 0})}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Est. 30% Tax</span>
        <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--acid)" }}>₹{tax.toLocaleString("en-IN", {maximumFractionDigits: 0})}</span>
      </div>
      <button className="btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", fontSize: "11px", padding: "7px" }}>Generate Schedule VDA →</button>
    </div>
  );
}

function CryptoSidebar() {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>VDA TAX SUMMARY</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          { label: "Cost of Acquisition", value: "₹45,00,000" },
          { label: "Realized Gains", value: "₹12,40,000" },
          { label: "TDS (Sec 194S)", value: "₹12,400" },
          { label: "Losses Carried", value: "₹0 (Blocked)" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid var(--border-subtle)", paddingBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.label}</span>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "24px", padding: "12px", background: "rgba(255,100,100,0.05)", borderRadius: "8px", border: "0.5px solid rgba(255,100,100,0.1)" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--danger)", marginBottom: "4px" }}>⚠️ FEMA ALERT</p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>Binance/Overseas trades detected. Form A2 compliance required.</p>
      </div>
    </div>
  );
}

const prompts = [
  "Calculate my crypto tax for FY 2025-26",
  "Generate Schedule VDA data for my ITR-2",
  "What is my tax liability at current BTC price?",
  "I received a crypto IT notice — help me reply",
  "Check my Binance trades for FEMA compliance",
];

export default function CryptoTaxPage() {
  return (
    <AgentChatLayout
      agentName="CryptoTax Pro"
      agentIcon="🪙"
      agentDescription="30% VDA Tax Calculator and Schedule VDA ITR Engine."
      agentId="A22"
      rightPanel={<CryptoSidebar />}
      extraTopBarContent={<LiveTaxMeter />}
    >
      <div className="empty-state">
        <div className="empty-state-icon" style={{ background: "rgba(181, 255, 46, 0.1)", color: "var(--acid)" }}>🪙</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>CryptoTax Pro</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "440px" }}>
          India's most precise virtual digital asset tax engine. Automatic Section 115BBH calculations and ITR-ready Schedule VDA generation.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
