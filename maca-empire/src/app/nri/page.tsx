"use client";

import React, { useState } from "react";
import { Globe, PlaneTakeoff, Info, CheckCircle, CreditCard, Ship, Landmark, Send, Loader2 } from "lucide-react";
import { saveToVault } from "@/lib/vault";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface Citation {
  source: string;
  url: string;
  excerpt: string;
}

export default function NRIAgentPage() {
  const [country, setCountry] = useState("USA");
  const [issue, setIssue] = useState("NRI Tax");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    setCitations([]);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Country: ${country}, Issue: ${issue}, Question: ${query}`,
          agent_id: "C5"
        })
      });
      const data = await res.json();
      setAnswer(data.answer);
      setCitations(data.citations || []);
      
      saveToVault({
        agent_id: "C5",
        doc_type: `NRI Consultation: ${issue}`,
        content: `Question: ${query}\nAnswer: ${data.answer}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1200px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
             <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "#6366f1", letterSpacing: "-1.5px" }}>🌍 NRI Legal Agent C5</h1>
             <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: "0.5rem" }}>Indian Tax, FEMA & Property compliance for the Global Indian Diaspora</p>
           </div>
           <div style={{ padding: "0.75rem 1.5rem", borderRadius: "1rem", background: "black", border: "1px solid #6366f1", color: "#6366f1", fontWeight: "900", fontSize: "0.9rem" }}>
              PREMIUM TIER: $35/mo
           </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem" }}>
           {/* Controls & Checklist */}
           <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                 <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "#6366f1", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><Globe size={16}/> RESIDENCY PROFILE</h4>
                 
                 <div style={{ display: "grid", gap: "1.5rem" }}>
                    <div>
                       <label style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>COUNTRY OF RESIDENCE</label>
                       <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }}>
                          {["USA", "UK", "Canada", "UAE", "Australia", "Singapore", "Germany", "Qatar"].map(c => <option key={c}>{c}</option>)}
                       </select>
                    </div>
                    <div>
                       <label style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>COMPLIANCE FOCUS</label>
                       <select value={issue} onChange={e => setIssue(e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "white", fontSize: "1rem" }}>
                          {["NRI Tax", "FEMA Compliance", "Property Sale/Rent", "NRO to NRE Remittance", "Inheritance Law", "OCI / Visa Issues"].map(i => <option key={i}>{i}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <div style={{ background: "#6366f110", padding: "2.5rem", borderRadius: "1.5rem", border: "1px dashed #6366f1" }}>
                 <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "#6366f1", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><PlaneTakeoff size={16}/> FEMA LRS LIMITS</h4>
                 <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "900", color: "#6366f1" }}>$250,000</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--muted)" }}>ANNUAL REMITTANCE LIMIT (LRS)</div>
                 </div>
                 <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {["Form 15CA/15CB Needed", "TDS on Property @ 20%+", "SBR Filing Requirement"].map(x => (
                      <div key={x} style={{ fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={14} style={{ color: "#6366f1" }}/> {x}</div>
                    ))}
                 </div>
              </div>

              <div style={{ textAlign: "center", padding: "1rem", opacity: 0.5 }}>
                 <p style={{ fontSize: "0.65rem" }}>Cited Laws: Income Tax Act 1961, FEMA 1999, RBI Master Circular on NRI Accounts</p>
              </div>
           </div>

           {/* Chat Window */}
           <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "var(--secondary)", borderRadius: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", minHeight: "500px", padding: "2rem" }}>
                 {!answer && !loading ? (
                   <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
                      <Landmark size={80} style={{ marginBottom: "1.5rem" }} />
                      <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>How can maCA help you with your Indian assets today?</p>
                   </div>
                 ) : (
                   <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ padding: "1.25rem", background: "var(--background)", borderRadius: "1.25rem", border: "1px solid var(--border)", alignSelf: "flex-end", maxWidth: "80%" }}>
                         <p style={{ fontSize: "0.95rem" }}>{query}</p>
                      </div>
                      
                      {loading ? (
                         <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#6366f1", fontWeight: "700" }}>
                            <Loader2 size={24} className="animate-spin" /> maCA is analyzing FEMA compliance...
                         </div>
                      ) : (
                         <div style={{ padding: "1.5rem", background: "rgba(99, 102, 241, 0.05)", borderRadius: "1.25rem", border: "1px solid #6366f1", alignSelf: "flex-start", maxWidth: "90%" }}>
                            <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "#6366f1", marginBottom: "0.75rem" }}>Expert Answer</div>
                            <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--foreground)", whiteSpace: "pre-wrap" }}>{answer}</p>
                            
                            {citations.length > 0 && (
                               <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(99, 102, 241, 0.2)" }}>
                                  <h6 style={{ fontSize: "0.7rem", fontWeight: "900", color: "#6366f1", marginBottom: "1rem" }}>VERIFIED LAW CITATIONS</h6>
                                  {citations.map((c, i) => (
                                     <div key={i} style={{ padding: "0.75rem", background: "var(--background)", borderRadius: "0.5rem", border: "1px solid var(--border)", marginBottom: "0.5rem", fontSize: "0.75rem" }}>
                                        <div style={{ fontWeight: "900" }}>{c.source}</div>
                                        <a href={c.url} target="_blank" style={{ color: "#6366f1", textDecoration: "none" }}>Read Official Act ↗</a>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      )}
                   </div>
                 )}
              </div>

              <form onSubmit={handleAsk} style={{ position: "relative" }}>
                 <input 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask about NRO account, Property tax, or FEMA limits..." 
                    style={{ width: "100%", padding: "1.25rem 4rem 1.25rem 1.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", background: "var(--secondary)", color: "white", fontSize: "1rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                 />
                 <button type="submit" disabled={loading} style={{ position: "absolute", right: "0.75rem", top: "0.6rem", padding: "0.6rem", borderRadius: "1rem", background: "#6366f1", color: "white", border: "none", cursor: "pointer" }}>
                    <Send size={20} />
                 </button>
              </form>
           </div>
        </div>
      </main>
    </div>
  );
}
