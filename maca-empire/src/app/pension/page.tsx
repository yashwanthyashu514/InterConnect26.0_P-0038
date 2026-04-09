"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function EPFCalculator() {
  const [salary, setSalary] = useState(50000);
  const [years, setYears] = useState(10);
  const monthlyPF = Math.min(salary * 0.12, 1800);
  const employerPF = monthlyPF;
  const annualContrib = (monthlyPF + employerPF) * 12;
  const rate = 0.081;
  const corpus = annualContrib * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate);
  const eps = years >= 10 ? Math.min(salary, 15000) * years / 70 : 0;

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>EPF Calculator</p>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: "5px" }}>Basic Salary (₹)</label>
        <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="input-dark" style={{ fontSize: "13px" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: "5px" }}>Years of Service: <span style={{ color: "var(--acid)" }}>{years}</span></label>
        <input type="range" min="1" max="35" value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--acid)" }} />
      </div>

      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>Projected EPF Corpus</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-1px", color: "var(--acid)" }}>
          ₹{(corpus / 100000).toFixed(1)}L
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>@ 8.1% p.a. · {years} years</p>
      </div>

      {[
        { label: "Your PF/month", value: `₹${monthlyPF.toLocaleString("en-IN")}` },
        { label: "Employer PF/month", value: `₹${employerPF.toLocaleString("en-IN")}` },
        { label: "Annual contribution", value: `₹${annualContrib.toLocaleString("en-IN")}` },
        { label: "EPS Pension (monthly)", value: years >= 10 ? `₹${eps.toFixed(0)}` : "Min 10 yrs needed" },
      ].map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{r.label}</span>
          <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

const prompts = [
  "How do I withdraw my EPF online?",
  "Calculate my EPF corpus at retirement",
  "What is the EPS pension formula?",
  "Can I withdraw EPF before 5 years?",
];

export default function PensionPage() {
  return (
    <AgentChatLayout
      agentName="Pension Pilot"
      agentIcon="🏖️"
      agentDescription="EPF withdrawals, EPS pension claims, and retirement corpus planning."
      rightPanel={<EPFCalculator />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">🏖️</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>Pension Pilot</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Plan your retirement confidently. Calculate EPF corpus, understand EPS pension, and navigate withdrawals.
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
