"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function TradePanel() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("USA");

  const exportDocs = ["Commercial Invoice", "Packing List", "Bill of Lading", "Certificate of Origin", "Shipping Bill (IGST)"];
  const importDocs = ["Bill of Entry", "Import License (if applicable)", "FSSAI (food items)", "BIS Certificate (electronics)", "Phytosanitary Certificate"];

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>HS Code Finder</p>
      <input placeholder="Describe your product..." className="input-dark" value={product} onChange={(e) => setProduct(e.target.value)} style={{ marginBottom: "8px", fontSize: "13px" }} />
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-dark" style={{ marginBottom: "12px", fontSize: "13px" }}>
        {["USA", "UAE", "UK", "Germany", "Singapore", "Australia", "Bangladesh"].map((c) => <option key={c}>{c}</option>)}
      </select>
      {product && (
        <div style={{ background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>Suggested HS Code</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--acid)", letterSpacing: "-0.5px" }}>4202.22.10</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>Import Duty to {country}: 12.5% + 18% IGST</p>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Export Document Checklist</p>
        {exportDocs.map((doc, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "var(--acid)", fontSize: "12px" }}>☐</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{doc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const prompts = [
  "Find the HS code for handmade leather bags",
  "What is the import duty on solar panels?",
  "Explain duty drawback scheme for exporters",
  "Generate an invoice for export shipment",
];

export default function TradePage() {
  return (
    <AgentChatLayout
      agentName="Trade Advisor"
      agentIcon="📦"
      agentDescription="HS code classification, DGFT compliance, duty drawback, and EXIM documentation."
      rightPanel={<TradePanel />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Trade & EXIM</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Navigate India&apos;s import-export landscape. HS codes, duty drawback, DGFT licensing, and EXIM documentation made simple.
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
