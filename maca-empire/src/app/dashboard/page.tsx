"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Briefcase,
  FileText,
  BarChart3,
  Layers
} from "lucide-react";
import Link from "next/link";
import { agents } from "@/lib/agents";

interface Stats {
  total_docs: number;
  total_value: number;
  active_cases: number;
  savings: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total_docs: 0,
    total_value: 0,
    active_cases: 0,
    savings: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${BACKEND_URL}/vault/user/user_demo_123`);
        const data = await res.json();
        const docs = data.documents || [];
        
        // Value estimates per agent
        const valueMap: Record<string, number> = {
          "A1": 500,  // Tax query
          "A2": 2500, // Bank complaint
          "A4": 200,  // Payslip
          "A6": 5000, // Notice reply
          "A8": 15000, // Court petition
          "B2": 7500, // RERA
          "B4": 3500, // Insurance
          "B5": 1000, // Credit fix
          "B7": 1000, // RTI
        };

        const totalVal = docs.reduce((acc: number, doc: any) => acc + (valueMap[doc.agent_id] || 500), 0);
        
        setStats({
          total_docs: docs.length,
          total_value: totalVal,
          active_cases: docs.filter((d: any) => d.agent_id === "A2" || d.agent_id === "A8" || d.agent_id === "B2").length,
          savings: Math.round(totalVal * 0.9) // Assuming 90% savings over human CA/Lawyer
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1200px", margin: "2rem auto" }}>
        <header style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-1px" }}>Imperial Dashboard 📈</h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem" }}>Revenue Proof & Ecosystem Impact Analytics</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
           <StatCard icon={<FileText size={24}/>} label="TOTAL DOCUMENTS" value={stats.total_docs} sub="Fully Automated" color="#14b8a6"/>
           <StatCard icon={<TrendingUp size={24}/>} label="PROJECTED REVENUE" value={`₹${stats.total_value.toLocaleString()}`} sub="Service Market Value" color="#3b82f6"/>
           <StatCard icon={<ShieldCheck size={24}/>} label="USER SAVINGS" value={`₹${stats.savings.toLocaleString()}`} sub="vs Traditional Fees" color="#16a34a"/>
           <StatCard icon={<Briefcase size={24}/>} label="ACTIVE CASES" value={stats.active_cases} sub="Pending Resolution" color="#f59e0b"/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", marginBottom: "4rem" }}>
          <div style={{ background: "var(--secondary)", borderRadius: "1.5rem", padding: "2rem", border: "1px solid var(--border)" }}>
             <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
               <BarChart3 size={20} color="var(--primary)"/> VALUE GENERATION BY AGENT
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <ProgressBar label="Notice Fighter (A6)" percentage={45} color="#ef4444" value="₹25k Cap" />
                <ProgressBar label="Court Filer (A8)" percentage={70} color="#3b82f6" value="₹120k Cap" />
                <ProgressBar label="BankFight (A2)" percentage={30} color="#14b8a6" value="₹15k Cap" />
                <ProgressBar label="Tax Agent (A1)" percentage={90} color="#16a34a" value="₹5k Cap" />
             </div>
          </div>

          <div style={{ background: "var(--secondary)", borderRadius: "1.5rem", padding: "2rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
             <h3 style={{ fontSize: "1.1rem", fontWeight: "900" }}>ELITE STATUS</h3>
             <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--primary-glow)", border: "4px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                   <Users size={40} color="var(--primary)"/>
                </div>
                <h4 style={{ fontWeight: "900", fontSize: "1.3rem" }}>GOLD TIER</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>You have secured ₹{stats.savings.toLocaleString()} in legal savings this month.</p>
             </div>
             <button style={{ padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "0.75rem", border: "none", fontWeight: "900", cursor: "pointer" }}>
               UPGRADE TO PLATINUM →
             </button>
          </div>
        </div>

        {/* --- ALL AGENTS GRID --- */}
        <section style={{ marginBottom: "4rem" }}>
           <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Layers size={24}/> ACTIVATE EMPIRE AGENTS
           </h2>
           
           <div style={{ marginBottom: "3rem" }}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--muted)", marginBottom: "1rem" }}>A-SERIES: CORE 8</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                 {agents.filter(a => a.category === "CORE").map(agent => <DashboardAgentCard key={agent.id} agent={agent} />)}
              </div>
           </div>

           <div style={{ marginBottom: "3rem" }}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--muted)", marginBottom: "1rem" }}>B-SERIES: GROWTH 8</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                 {agents.filter(a => a.category === "GROWTH").map(agent => <DashboardAgentCard key={agent.id} agent={agent} />)}
              </div>
           </div>

           <div>
              <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--muted)", marginBottom: "1rem" }}>C-SERIES: EMPIRE SUITE</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                 {agents.filter(a => a.category === "EMPIRE").map(agent => <DashboardAgentCard key={agent.id} agent={agent} />)}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

function DashboardAgentCard({ agent }: { agent: any }) {
  return (
    <Link href={agent.href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--background)",
        padding: "1.5rem",
        borderRadius: "1rem",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "all 0.2s"
      }} className="hover-scale">
        <span style={{ fontSize: "1.8rem" }}>{agent.icon}</span>
        <div>
           <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--foreground)" }}>{agent.name}</div>
           <div style={{ fontSize: "0.7rem", color: "var(--muted)", display: "block", marginTop: "0.1rem" }}>{agent.status} • {agent.id}</div>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", position: "relative" }}>
       <div style={{ color: color, marginBottom: "0.75rem" }}>{icon}</div>
       <div style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
       <div style={{ fontSize: "1.8rem", fontWeight: "900", margin: "0.25rem 0" }}>{value}</div>
       <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}

function ProgressBar({ label, percentage, color, value }: any) {
  return (
    <div>
       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>{label}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: color }}>{value}</span>
       </div>
       <div style={{ width: "100%", height: "8px", background: "var(--background)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${percentage}%`, height: "100%", background: color }}></div>
       </div>
    </div>
  );
}
