"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

function PayrollCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const monthly = ctc / 12;
  const basic = monthly * 0.4;
  const hra = basic * 0.5;
  const pf = Math.min(basic * 0.12, 1800);
  const esi = monthly <= 21000 ? monthly * 0.0075 : 0;
  const profTax = 200;
  const tds = monthly * 0.1;
  const netTakeHome = monthly - pf - esi - profTax - tds;

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Live CTC Calculator</p>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: "6px" }}>Annual CTC (₹)</label>
        <input type="number" value={ctc} onChange={(e) => setCtc(Number(e.target.value))} className="input-dark" style={{ fontSize: "14px" }} />
      </div>
      <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", overflow: "hidden" }}>
        {[
          { label: "Basic Salary", value: basic },
          { label: "HRA", value: hra },
          { label: "PF (Employee)", value: -pf },
          { label: "PF (Employer)", value: pf, note: "Cost to company" },
          { label: "ESI", value: monthly <= 21000 ? -esi : 0, note: monthly > 21000 ? "Not applicable" : undefined },
          { label: "Professional Tax", value: -profTax },
          { label: "TDS (est.)", value: -tds },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
            <span style={{ fontSize: "12px", color: row.value < 0 ? "var(--danger)" : "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>
              {row.value < 0 ? "-" : "+"}₹{Math.abs(row.value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--acid-muted)" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--acid)", fontFamily: "'Syne', sans-serif" }}>Net Take-Home</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--acid)", fontFamily: "'Syne', sans-serif" }}>₹{netTakeHome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/mo</span>
        </div>
      </div>
    </div>
  );
}

const prompts = [
  "Calculate salary breakup for ₹12LPA CTC",
  "What is the PF deduction for a ₹50,000 salary?",
  "Generate a payslip for my employee",
  "Explain gratuity calculation rules",
];

export default function PayrollPage() {
  return (
    <AgentChatLayout
      agentName="PayrollPilot"
      agentIcon="💰"
      agentDescription="Calculate salaries, PF, ESI, TDS, and generate payslips."
      agentId="A4"
      rightPanel={<PayrollCalculator />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">💰</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>PayrollPilot</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Instant salary breakdowns, payslip generation, and PF/ESI/TDS calculations. Use the live calculator on the right.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
        <button className="btn-primary" style={{ fontSize: "13px" }}>
          Generate Payslip PDF →
        </button>
      </div>
    </AgentChatLayout>
  );
}
