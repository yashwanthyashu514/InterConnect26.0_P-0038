"use client";

import React, { useState } from "react";
import { Building2, Users, LayoutDashboard, Key, ShieldCheck, Clock, CheckCircle, ChevronRight, Briefcase, Zap } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface B2BResult {
  company_name: string;
  cin_valid: boolean;
  upcoming_deadlines: string[];
  risk_flags: string[];
  recommended_agents: string[];
  api_key?: string;
}

export default function B2BPage() {
  const [cin, setCin] = useState("");
  const [empCount, setEmpCount] = useState("10-50");
  const [needs, setNeeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<B2BResult | null>(null);

  const toggleNeed = (n: string) => {
    setNeeds(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cin.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/b2b-onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cin, emp_count: empCount, selected_needs: needs }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1200px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "3.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-1.5px" }}>💼 B2B Legal Ops</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: "0.5rem" }}>The Dedicated Legal Department for Indian SMEs · Compliance at Scale</p>
          </div>
          <div style={{ padding: "0.5rem 1.25rem", background: "var(--primary)", color: "white", borderRadius: "2rem", fontWeight: "900", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={14} fill="currentColor" /> ENTERPRISE PLAN
          </div>
        </div>

        {!result ? (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "4rem" }}>
            {/* Left: Onboarding Form */}
            <div style={{ background: "var(--secondary)", padding: "3rem", borderRadius: "2rem", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--foreground)", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Building2 size={24} /> COMPANY ONBOARDING
              </h3>
              <form onSubmit={handleOnboard} style={{ display: "grid", gap: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                   <div>
                     <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.6rem", display: "block" }}>COMPANY CIN / GSTIN</label>
                     <input value={cin} onChange={e => setCin(e.target.value.toUpperCase())} placeholder="e.g. U74999MH2021PTC123456" style={{ width: "100%", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }} />
                   </div>
                   <div>
                     <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.6rem", display: "block" }}>EMPLOYEE COUNT</label>
                     <select value={empCount} onChange={e => setEmpCount(e.target.value)} style={{ width: "100%", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }}>
                       <option>1-10</option><option>10-50</option><option>50-200</option><option>200+</option>
                     </select>
                   </div>
                </div>

                <div>
                   <label style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--muted)", marginBottom: "1rem", display: "block" }}>PRIMARY LEGAL NEEDS (MULTI-SELECT)</label>
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                      {["GST Compliance", "Payroll & EPF", "Contract Review", "Regulatory ROC", "Banking Disputes", "LITIGATION GUARD"].map(n => (
                        <div key={n} onClick={() => toggleNeed(n)} style={{
                          padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", cursor: "pointer",
                          background: needs.includes(n) ? "var(--primary)" : "var(--background)", 
                          color: needs.includes(n) ? "white" : "var(--foreground)",
                          fontSize: "0.85rem", fontWeight: "700", textAlign: "center", transition: "0.2s"
                        }}>
                          {n}
                        </div>
                      ))}
                   </div>
                </div>

                <button type="submit" disabled={loading} style={{ padding: "1.5rem", borderRadius: "1rem", background: "var(--primary)", color: "white", border: "none", fontSize: "1.2rem", fontWeight: "900", cursor: "pointer", transition: "0.2s", marginTop: "1rem" }}>
                  {loading ? "INITIALIZING LEGAL OPS..." : "ACTIVATE ENTERPRISE SUITE →"}
                </button>
              </form>
            </div>

            {/* Right: Pitch */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
               <div style={{ background: "rgba(20,184,166,0.05)", border: "1px dashed var(--primary)", borderRadius: "1.5rem", padding: "2rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem" }}>WHY B2B?</h4>
                  <ul style={{ display: "grid", gap: "1rem", padding: 0, listStyle: "none" }}>
                    {[
                      "Unlocks all 22 Expert AI Agents",
                      "Priority Response Tier (< 10s)",
                      "Secure Company Document Vault",
                      "5 Collaborative Team Seats",
                      "Custom API Integration Key"
                    ].map(x => (
                      <li key={x} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--foreground)" }}>
                        <CheckCircle size={18} style={{ color: "var(--primary)" }} /> {x}
                      </li>
                    ))}
                  </ul>
               </div>
               <div style={{ textAlign: "center", padding: "2rem", background: "black", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                 <div style={{ fontSize: "2rem", fontWeight: "900", color: "white" }}>₹9,999<span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>/month</span></div>
                 <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>Replaces a ₹65,000/month In-house Counsel</p>
               </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "3rem" }}>
            {/* Sidebar Dashboard */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
               <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  <div style={{ width: "80px", height: "80px", background: "var(--primary)", borderRadius: "1rem", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "2rem", fontWeight: "900" }}>{result.company_name[0]}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: "900" }}>{result.company_name}</h3>
                  <p style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: "0.25rem" }}>{cin}</p>
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                     <button style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "var(--background)", border: "1px solid var(--border)", color: "white", fontSize: "0.8rem", fontWeight: "700", textAlign: "left", display: "flex", alignItems: "center", gap: "0.5rem" }}><LayoutDashboard size={14}/> Dashboard</button>
                     <button style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "transparent", border: "none", color: "var(--muted)", fontSize: "0.8rem", fontWeight: "700", textAlign: "left", display: "flex", alignItems: "center", gap: "0.5rem" }}><Users size={14}/> Team (5/5)</button>
                     <button style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "transparent", border: "none", color: "var(--muted)", fontSize: "0.8rem", fontWeight: "700", textAlign: "left", display: "flex", alignItems: "center", gap: "0.5rem" }}><Key size={14}/> API Portal</button>
                  </div>
               </div>
               <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem" }}>API ACCESS KEY</h4>
                  <div style={{ padding: "0.75rem", background: "black", borderRadius: "0.5rem", color: "var(--primary)", fontSize: "0.7rem", fontFamily: "monospace", overflowX: "auto" }}>
                    {result.api_key}
                  </div>
               </div>
            </div>

            {/* Main Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
               {/* Summary Cards */}
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                     <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><Clock size={16}/> UPCOMING COMPLIANCE</h4>
                     <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {result.upcoming_deadlines.map((d, i) => (
                          <div key={i} style={{ padding: "1rem", background: "var(--background)", borderRadius: "0.75rem", border: "1px solid var(--border)", fontSize: "0.85rem", fontWeight: "700" }}>{d}</div>
                        ))}
                     </div>
                  </div>
                  <div style={{ background: "var(--secondary)", padding: "2rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                     <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><ShieldCheck size={16}/> RISK MONITOR</h4>
                     <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {result.risk_flags.map((f, i) => (
                          <div key={i} style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "0.75rem", border: "1px dashed #ef4444", fontSize: "0.85rem", color: "#ef4444" }}>🚩 {f}</div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Agent Access Grid */}
               <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "1.5rem" }}>UNLOCK ALL AGENTS</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                     {result.recommended_agents.map(id => (
                       <div key={id} style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--primary)", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                          <Briefcase size={24} style={{ color: "var(--primary)" }} />
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "900" }}>Agent ID: {id}</div>
                            <div style={{ fontSize: "0.6rem", color: "var(--muted)" }}>Prioritized for Business</div>
                          </div>
                          <ChevronRight size={16} style={{ marginLeft: "auto", color: "var(--muted)" }} />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
