"use client";

import React, { useState, useEffect } from "react";

export default function AuditShield() {
  const [riskScore, setRiskScore] = useState(12); // Starting with low risk (Good)
  const [status, setStatus] = useState("LOW RISK");

  useEffect(() => {
    // Top-tier risk scoring simulation
    if (riskScore > 40) setStatus("MEDIUM RISK - SCRUTINY POSSIBLE");
    if (riskScore > 70) setStatus("HIGH RISK - NOTICE IMMINENT");
  }, [riskScore]);

  return (
    <div style={{
      background: "var(--secondary)",
      padding: "1.25rem",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary)" }}>🛡️ TOP-TIER AUDIT SHIELD</h3>
        <div style={{ 
            fontSize: "0.6rem", fontWeight: "800", color: riskScore < 40 ? "#16a34a" : "#dc2626", 
            background: riskScore < 40 ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)", 
            padding: "0.15rem 0.5rem", borderRadius: "1rem" 
        }}>
          {status}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ background: "var(--background)", height: "12px", borderRadius: "6px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            width: `${riskScore}%`, height: "100%", 
            background: riskScore < 40 ? "#16a34a" : riskScore < 70 ? "#f59e0b" : "#dc2626", 
            transition: "width 1s ease-in-out" 
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "700", color: "var(--muted)" }}>
          <span>COMPLIANCE LEVEL: {100 - riskScore}%</span>
          <span>RISK: {riskScore}%</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)" }}>
             ✅ AIS Reconciliation: OK
          </div>
          <div style={{ fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem", color: riskScore > 40 ? "#dc2626" : "var(--foreground)" }}>
             {riskScore > 40 ? "⚠️ GST/ITR Mismatch detected" : "✅ GST/ITR Mismatch: NIL"}
          </div>
          <div style={{ fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)" }}>
             ✅ Schedule FA (Foreign Assets): Filed
          </div>
      </div>

      <button 
        onClick={() => setRiskScore(Math.floor(Math.random() * 100))}
        style={{ 
          width: "100%", padding: "0.5rem", background: "transparent", 
          border: "1px solid var(--primary)", color: "var(--primary)", 
          borderRadius: "var(--radius)", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" 
        }}
      >
        RE-CALCULATE SCRUTINY RISK
      </button>
      
      <p style={{ fontSize: "0.55rem", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
        *Algorithm calibrated for Faceless Assessment 2026 guidelines.
      </p>
    </div>
  );
}
