"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AuditShieldPage() {
  const [gstin, setGstin] = useState("");
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = () => {
    if (!gstin) return;
    setLoading(true);
    // Simulate complex audit risk calculation
    setTimeout(() => {
      setRiskScore(14); // 14 out of 100
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <header style={{
        background: "var(--secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link href="/tax" style={{ fontWeight: "800", fontSize: "1.25rem", color: "var(--primary)" }}>
          ← maCA Tax
        </Link>
        <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Proactive Audit Defense — Included in maCA Tax
        </span>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1rem", textAlign: "center" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", color: "var(--foreground)", marginBottom: "1rem" }}>
            Audit Shield <span style={{ color: "var(--primary)" }}>🛡️</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: "580px", margin: "0 auto" }}>
            Scan your filed return patterns to flag high-risk mismatches before a notice arrives.
          </p>
        </div>

        <div style={{
          background: "var(--secondary)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem"
        }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", marginBottom: "0.5rem" }}>
              ENTER YOUR GSTIN
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="e.g. 27AAACR1234A1Z5"
                style={{
                  flex: 1,
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
              <button 
                className="button-primary" 
                onClick={calculateRisk}
                disabled={loading || !gstin}
              >
                {loading ? "Scanning..." : "Check Risk →"}
              </button>
            </div>
          </div>
        </div>

        {riskScore !== null && (
          <div className="animate-in" style={{
            background: "var(--secondary)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--primary)",
            padding: "2.5rem",
            marginTop: "2.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Audit Risk Profile</h2>
            
            {/* Visual Risk Gauge */}
            <div style={{ width: "100%", height: "20px", background: "var(--border)", borderRadius: "10px", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
              <div style={{ width: "14%", height: "100%", background: "#16a34a", position: "absolute", left: 0 }} />
            </div>
            <p style={{ fontWeight: "800", fontSize: "2rem", color: "#16a34a", marginBottom: "0.5rem" }}>
              Score: {riskScore}/100
            </p>
            <p style={{ color: "var(--muted)", fontWeight: "600" }}>STATUS: LOW RISK ✅</p>
            
            <div style={{ textAlign: "left", marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Recommendations:</h3>
              <ul style={{ color: "var(--muted)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>✅ GSTR-3B vs GSTR-1 data is 100% matched. No mismatch found in the last 6 months.</li>
                <li>✅ ITC claimed in 3B matches 2B perfectly.</li>
                <li>🛡️ Recommendation: Ensure your supplier filed GSTR-1 on time to keep this score low.</li>
              </ul>
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <button className="button-primary" style={{ padding: "0.75rem 2rem" }}>
                🎯 Download Risk Report PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
