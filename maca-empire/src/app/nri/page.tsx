"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const countries = [
  { code: "US", label: "🇺🇸 USA", treaty: "DTAA India-USA" },
  { code: "UK", label: "🇬🇧 United Kingdom", treaty: "DTAA India-UK" },
  { code: "AE", label: "🇦🇪 UAE", treaty: "DTAA India-UAE" },
  { code: "CA", label: "🇨🇦 Canada", treaty: "DTAA India-Canada" },
  { code: "SG", label: "🇸🇬 Singapore", treaty: "DTAA India-Singapore" },
  { code: "AU", label: "🇦🇺 Australia", treaty: "DTAA India-Australia" },
];

function NRIPanel() {
  const [days, setDays] = useState(182);
  const status = days >= 182 ? "Resident" : days >= 60 ? "RNOR" : "NRI";
  const color = status === "Resident" ? "var(--warning)" : status === "RNOR" ? "var(--acid)" : "var(--acid)";

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Residency Calculator</p>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: "6px" }}>Days in India this FY</label>
        <input type="range" min="0" max="365" value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--acid)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>0 days</span>
          <span style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{days} days</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>365 days</span>
        </div>
      </div>
      <div style={{ background: "var(--bg-primary)", border: `0.5px solid ${color}44`, borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>Your Status</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", color, letterSpacing: "-1px" }}>{status}</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
          {status === "NRI" ? "Indian income only taxable in India" : status === "RNOR" ? "Foreign income generally exempt" : "Global income taxable in India"}
        </p>
      </div>
      <div style={{ background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "8px", padding: "12px" }}>
        <p style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "4px" }}>Key rules for {days >= 182 ? "Residents" : "NRIs"}:</p>
        <ul style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", paddingLeft: "16px", lineHeight: 1.7 }}>
          <li>Need NRE/NRO account for India banking</li>
          <li>Check applicable DTAA for your country</li>
          <li>File ITR if India income &gt; ₹2.5L</li>
        </ul>
      </div>
    </div>
  );
}

const prompts = [
  "What taxes do I owe as an NRI in the USA?",
  "Explain DTAA benefits between India and UAE",
  "Should I have an NRE or NRO account?",
  "How do I repatriate money from India?",
];

export default function NRIPage() {
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <AgentChatLayout
      agentName="NRI Advisor"
      agentIcon="🌏"
      agentDescription="FEMA compliance, DTAA benefits, NRE/NRO advisory for Indians abroad."
      rightPanel={<NRIPanel />}
    >
      <div className="empty-state">
        
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>NRI Advisor</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Expert guidance on FEMA, DTAA, and NRI taxation. Tailored to your country of residence.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%", maxWidth: "420px" }}>
          {countries.map((c) => (
            <button key={c.code} onClick={() => setSelectedCountry(c.code)} style={{ padding: "12px", background: selectedCountry === c.code ? "var(--acid-muted)" : "var(--bg-secondary)", border: `0.5px solid ${selectedCountry === c.code ? "var(--border-acid)" : "var(--border-subtle)"}`, borderRadius: "10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "var(--text-primary)", transition: "all 0.2s", textAlign: "center" }}>
              {c.label}
            </button>
          ))}
        </div>
        {selectedCountry && (
          <div style={{ background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "12px 16px" }}>
            <p style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>
              ✓ Context set: {countries.find((c) => c.code === selectedCountry)?.treaty}
            </p>
          </div>
        )}
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
