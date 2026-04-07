"use client";

import React from "react";
import Link from "next/link";

import { agents, Agent } from "@/lib/agents";

export default function Home() {
  const coreAgents = agents.filter(a => a.category === "CORE");
  const growthAgents = agents.filter(a => a.category === "GROWTH");
  const empireAgents = agents.filter(a => a.category === "EMPIRE");

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "1rem 2rem 4rem" }}>
      <section style={{ textAlign: "center", margin: "4rem 0 6rem" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", color: "var(--foreground)", letterSpacing: "-2px", lineHeight: "1" }}>
          The First-Mover <span style={{ color: "var(--primary)" }}>AI Legal Shield</span> ⚖️
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "1.5rem", fontSize: "1.1rem", maxWidth: "700px", margin: "1.5rem auto 0", lineHeight: "1.6" }}>
          Empowering 1.4 Billion people with automated GST, Income Tax, and Banking Ombudsman intelligence. Phase 3 Document Vault Active.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2.5rem" }}>
           <button className="button-primary" style={{ padding: "1rem 2rem" }}>EXPLORE AGENTS ↓</button>
           <Link href="/vault" style={{ padding: "1rem 2rem", background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontWeight: "700", color: "var(--foreground)" }}>GO TO VAULT</Link>
        </div>
      </section>

      <main style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--primary)", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
             🏺 🏛️ CORE 8 — MVP LAUNCH GRID (A-SERIES)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {coreAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--primary)", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
             🚀 📈 GROWTH 8 — PHASE 2 EXPANSION (B-SERIES)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {growthAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#6366f1", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
             👑 🏛️ EMPIRE SUITE — PHASE 4 YEAR 2 (C-SERIES)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {empireAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: "6rem", textAlign: "center", fontSize: "0.8rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
        © 2026 maCA Empire · Confidential Build v1.4.0 · Powered by NVIDIA NIM Llama 3.3 70B & Supabase
      </footer>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={agent.href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--secondary)",
        padding: "2.5rem 2rem",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        cursor: "pointer",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "3rem" }}>{agent.icon}</span>
          <span style={{
            fontSize: "0.6rem", fontWeight: "900", padding: "0.3rem 0.8rem", borderRadius: "100px",
            background: "var(--primary)", color: "white"
          }}>
            {agent.status}
          </span>
        </div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--foreground)", marginBottom: "0.75rem" }}>{agent.name}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.6" }}>{agent.description}</p>
        
        <div style={{ 
          position: "absolute", bottom: 0, left: 0, height: "5px", width: "100%", 
          background: "var(--primary)"
        }} />
      </div>
    </Link>
  );
}
