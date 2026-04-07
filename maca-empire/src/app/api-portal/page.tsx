"use client";

import React, { useState } from "react";
import { Terminal, Key, Cpu, Code, BarChart3, Copy, CheckCircle2, Settings } from "lucide-react";

export default function APIPortalPage() {
  const [copied, setCopied] = useState(false);
  const apiKey = "maca_live_4f8e2190c128a8d7";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1200px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "3rem" }}>
           <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-1.5px" }}>⚡ maCA API C4</h1>
           <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: "0.5rem" }}>Embed Indian Legal AI into your Fintech or ERP with 5 lines of code</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
           {/* API Key & Usage */}
           <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                 <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><Key size={16}/> YOUR API ACCESS KEY</h4>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem", alignItems: "center", padding: "1.25rem", background: "black", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--primary)", fontFamily: "monospace" }}>{apiKey}</div>
                    <button onClick={handleCopy} style={{ background: "transparent", border: "none", color: copied ? "#10b981" : "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                       {copied ? <CheckCircle2 size={20}/> : <Copy size={20}/>}
                    </button>
                 </div>
                 <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "var(--muted)" }}>⚠️ Do not share this key. It grants access to your Legal Ops account.</p>
              </div>

              <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                 <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><BarChart3 size={16}/> USAGE ANALYTICS</h4>
                 <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "900", marginBottom: "0.5rem" }}>
                       <span>MONTHLY API CALLS</span>
                       <span style={{ color: "var(--primary)" }}>412 / 1000</span>
                    </div>
                    <div style={{ width: "100%", height: "12px", background: "black", borderRadius: "1rem", overflow: "hidden" }}>
                       <div style={{ width: "41.2%", height: "100%", background: "var(--primary)" }}></div>
                    </div>
                 </div>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ padding: "1rem", background: "var(--background)", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                       <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--muted)" }}>AVG LATENCY</div>
                       <div style={{ fontSize: "1.2rem", fontWeight: "900" }}>384ms</div>
                    </div>
                    <div style={{ padding: "1rem", background: "var(--background)", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                       <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--muted)" }}>ERROR RATE</div>
                       <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#10b981" }}>0.02%</div>
                    </div>
                 </div>
              </div>

              <div style={{ background: "black", padding: "2rem", borderRadius: "1.5rem", border: "1px solid var(--border)", textAlign: "center" }}>
                 <h4 style={{ fontSize: "1rem", fontWeight: "900", color: "white" }}>GO UNLIMITED</h4>
                 <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0.5rem 0 1.5rem" }}>Upgrade to Pro for limitless requests & priority RAG access.</p>
                 <button style={{ padding: "1rem 2rem", background: "white", color: "black", borderRadius: "0.75rem", fontWeight: "900", border: "none", cursor: "pointer" }}>UPGRADE TO PRO →</button>
              </div>
           </div>

           {/* Code Snippets */}
           <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}><Code size={16}/> INTEGRATION EXAMPLE</h4>
              
              <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                 {["Node.js", "Python", "cURL"].map(x => (
                   <div key={x} style={{ fontSize: "0.9rem", fontWeight: "900", color: x === "Node.js" ? "var(--primary)" : "var(--muted)", borderBottom: x === "Node.js" ? "2px solid var(--primary)" : "none", paddingBottom: "0.5rem", cursor: "pointer" }}>{x}</div>
                 ))}
              </div>

              <div style={{ background: "black", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", position: "relative" }}>
                 <pre style={{ margin: 0, fontSize: "0.85rem", color: "#d1d5db", fontFamily: "'Fira Code', monospace", lineHeight: "1.6" }}>
{`const res = await fetch("https://api.maca.in/v1/ask", {
  method: "POST",
  headers: {
    "X-MACA-API-KEY": "${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: "GST on SaaS export invoice?",
    agent_id: "A1"
  })
});

const { answer, citations } = await res.json();
console.log(answer);`}
                 </pre>
                 <button onClick={handleCopy} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "0.4rem", borderRadius: "0.4rem", cursor: "pointer" }}><Copy size={14}/></button>
              </div>

              <div style={{ padding: "1.5rem", background: "rgba(20,184,166,0.05)", borderRadius: "1.25rem", border: "1px dashed var(--primary)" }}>
                 <h5 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}><Cpu size={16}/> API SPECS</h5>
                 <ul style={{ display: "grid", gap: "0.5rem", padding: 0, listStyle: "none", fontSize: "0.8rem", color: "var(--muted)" }}>
                    <li><strong style={{ color: "var(--foreground)" }}>Base URL:</strong> https://api.maca.in/v1</li>
                    <li><strong style={{ color: "var(--foreground)" }}>Models:</strong> Llama-3.3-70b-instruct-optimized</li>
                    <li><strong style={{ color: "var(--foreground)" }}>RAG Depth:</strong> Top 3 Legal Chunks (Act Verified)</li>
                    <li><strong style={{ color: "var(--foreground)" }}>Rate Limit:</strong> 60 req / min</li>
                 </ul>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
