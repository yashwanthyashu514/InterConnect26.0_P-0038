"use client";

import React, { useState } from "react";

interface Deduction {
  id: string;
  name: string;
  limit: number;
  current: number;
  color: string;
  type: "core" | "advanced";
}

export default function DeductionTracker() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: "80c", name: "Section 80C (PPF/ELSS/LIC)", limit: 150000, current: 85000, color: "#14b8a6", type: "core" },
    { id: "80ccd", name: "80CCD(1B) - NPS Extra", limit: 50000, current: 15000, color: "#0d9488", type: "core" },
    { id: "80d", name: "80D (Health Insurance)", limit: 25000, current: 12000, color: "#0f766e", type: "core" },
    { id: "24b", name: "Sec 24b (Home Loan Int)", limit: 200000, current: 75000, color: "#115e59", type: "core" },
    // Advanced
    { id: "80e", name: "80E (Education Loan)", limit: 500000, current: 0, color: "#991b1b", type: "advanced" },
    { id: "80eeb", name: "80EEB (Electric Vehicle)", limit: 150000, current: 0, color: "#155e75", type: "advanced" },
    { id: "80jjaa", name: "80JJAA (Business Hiring)", limit: 300000, current: 0, color: "#3730a3", type: "advanced" }
  ]);

  const totalSavedValue = deductions.reduce((acc, d) => acc + (d.current * 0.312), 0);

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
        <h3 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary)" }}>🏛️ DEDUCTION TRACKER</h3>
        <div style={{ fontSize: "0.6rem", fontWeight: "700", color: "#16a34a", background: "rgba(22, 163, 74, 0.1)", padding: "0.15rem 0.5rem", borderRadius: "1rem" }}>
          SAVED: ₹{totalSavedValue.toLocaleString()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "350px", overflowY: "auto" }}>
        {deductions.filter(d => d.type === "core" || showAdvanced).map(d => (
          <div key={d.id} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", fontWeight: "700", color: d.type === "advanced" ? "var(--primary)" : "var(--muted)" }}>
              <span>{d.name} {d.type === "advanced" && "⭐"}</span>
              <span>₹{d.current.toLocaleString()} / Max</span>
            </div>
            
            <div style={{ background: "var(--background)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ 
                width: `${Math.min((d.current / d.limit) * 100, 100)}%`, height: "100%", background: d.color, 
                transition: "width 0.6s ease-in-out" 
              }} />
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{ 
          width: "100%", padding: "0.4rem", background: "transparent", 
          border: "1px dashed var(--primary)", color: "var(--primary)", 
          borderRadius: "var(--radius)", fontSize: "0.65rem", fontWeight: "700", cursor: "pointer" 
        }}
      >
        {showAdvanced ? "HIDE RARE CASES [-]" : "SHOW EXTENDED ARSENAL (80E, 80JJAA, 80EEB) [+]"}
      </button>

      <button style={{ width: "100%", padding: "0.6rem", background: "var(--primary)", border: "none", color: "white", borderRadius: "var(--radius)", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}>
        OPTIMIZE ALL EIGHTY SECTIONS
      </button>
    </div>
  );
}
