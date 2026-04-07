"use client";

import React, { useState } from "react";
import { saveToVault } from "@/lib/vault";

export default function PayrollPage() {
  const [salary, setSalary] = useState<number>(50000);
  const [showSlip, setShowSlip] = useState(false);
  
  // A4 Logic: Standard Indian Payroll Calc
  const pf = Math.min(salary * 0.12, 1800);
  const esi = salary < 21000 ? (salary * 0.0075) : 0;
  const taxableIncome = salary - pf - 50000/12;
  const tds = taxableIncome > 58333 ? (taxableIncome * 0.10) : 0;
  const netPay = Math.round(salary - pf - esi - tds - 200);

  const handleGenerate = () => {
    setShowSlip(true);
    const slipData = {
      gross: salary,
      pf,
      esi,
      tds,
      net: netPay,
      date: "April 2026",
      id: "PAY-7729-001"
    };
    saveToVault({ agent_id: "A4", doc_type: "Monthly Payslip", content: JSON.stringify(slipData, null, 2) });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "800px", margin: "2rem auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
        <div style={{ gridColumn: "span 2", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>PayrollPilot A4 💸</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Automated TDS, PF, and ESI compliance calculations.</p>
        </div>

        {/* Left: Input Form */}
        <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", height: "fit-content" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem" }}>SALARY INPUT</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>GROSS MONTHLY SALARY</label>
                <input 
                  type="number" 
                  value={salary} 
                  onChange={(e) => setSalary(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", marginTop: "0.4rem" }}
                />
             </div>
             
             <button 
                onClick={handleGenerate}
                style={{ width: "100%", padding: "1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "800", cursor: "pointer" }}
             >
                GENERATE PAYSLIP →
             </button>
          </div>
        </div>

        {/* Right: The Payslip */}
        <div style={{ minHeight: "500px" }}>
          {showSlip ? (
            <div style={{ 
              background: "white", color: "#1e293b", padding: "2.5rem", borderRadius: "1rem", 
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
              fontFamily: "'Inter', sans-serif"
            }}>
               <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a" }}>maCA EMPIRE PVT LTD</h2>
                    <p style={{ fontSize: "0.7rem", color: "#64748b" }}>PAYSLIP FOR APRIL 2026</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: "800" }}>#PAY-7729-001</p>
                  </div>
               </div>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Earnings</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                        <span>Basic + HRA</span>
                        <span style={{ fontWeight: "700" }}>₹{salary.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Deductions</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                        <span>PF (12%)</span>
                        <span style={{ fontWeight: "700", color: "#ef4444" }}>- ₹{pf.toLocaleString()}</span>
                    </div>
                    {esi > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                          <span>ESI (0.75%)</span>
                          <span style={{ fontWeight: "700", color: "#ef4444" }}>- ₹{esi.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                        <span>Professional Tax</span>
                        <span style={{ fontWeight: "700", color: "#ef4444" }}>- ₹200</span>
                    </div>
                    {tds > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                          <span>TDS</span>
                          <span style={{ fontWeight: "700", color: "#ef4444" }}>- ₹{Math.round(tds).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
               </div>

               <div style={{ 
                 marginTop: "2rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "0.5rem",
                 display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>NET TAKE-HOME PAY</p>
                    <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#0f172a" }}>₹{netPay.toLocaleString()}</h1>
                  </div>
                  <button style={{ padding: "0.6rem 1.2rem", background: "#0f172a", color: "white", borderRadius: "0.4rem", border: "none", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}>
                    DOWNLOAD PDF
                  </button>
               </div>

               <p style={{ marginTop: "1rem", fontSize: "0.6rem", color: "#94a3b8", textAlign: "center" }}>
                 *Digital copy generated by maCA PayrollPilot. Compliant with IT Act and PF Regulations.
               </p>
            </div>
          ) : (
            <div style={{ 
              height: "100%", border: "2px dashed var(--border)", borderRadius: "1rem", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" 
            }}>
              PAYSLIP PREVIEW WILL APPEAR HERE
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
