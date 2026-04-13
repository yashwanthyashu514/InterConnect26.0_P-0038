"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home, Bot, Briefcase, Calendar, Zap, Bell,
  Search, FileText, Landmark, AlertTriangle, DollarSign,
  Lock, Mic, FileSignature, Scale, TrendingUp, Shield,
  HardHat, Globe, Wallet, Building2, PenTool, Rocket,
  Package, ShieldAlert, Coins, Leaf, ScrollText, MessageSquare, Files, Clock, CheckCircle2, User, Users, Menu, X, Activity, Server, Cpu, Globe2, Scan, Database, Info
} from "lucide-react";

import { AGENTS } from "@/lib/agents";

const getAgentIcon = (id: string, size = 18) => {
  switch (id) {
    case "A1": return <FileText size={size} />;
    case "A2": return <Landmark size={size} />;
    case "A3": return <Scale size={size} />;
    case "A4": return <Users size={size} />;
    case "A5": return <Rocket size={size} />;
    case "A6": return <Mic size={size} />;
    case "A7": return <PenTool size={size} />;
    case "A8": return <Files size={size} />;
    case "A12": return <ShieldAlert size={size} />;
    case "A13": return <Globe size={size} />;
    case "A23": return <Leaf size={size} />;
    case "A24": return <ScrollText size={size} />;
    case "A22": return <Coins size={size} />;
    case "A25": return <Shield size={size} />;
    case "A26": return <TrendingUp size={size} />;
    default: return <Bot size={size} />;
  }
};

const topAgents = AGENTS.slice(0, 4).map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 20),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
}));

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard synchronization error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000000", position: "relative", overflowX: "hidden", color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar Backdrop ── */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "active" : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── Sidebar (Overlay Mode) ── */}
      <aside className="dash-sidebar" style={{ 
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        boxShadow: isSidebarOpen ? "20px 0 50px rgba(0,0,0,0.5)" : "none"
      }}>
        <div style={{ padding: "0 20px 24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--acid)", letterSpacing: "-0.5px" }}>
              maCA Empire
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#000", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0", overflowY: "auto" }}>
          <p className="sidebar-section-title" style={{ color: "#6B7280", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, paddingLeft: "28px", marginBottom: "12px" }}>Mission Control</p>
          {[
            { id: "overview", icon: <Home size={18} />, label: "Orchestrator", href: "/dashboard" },
            { id: "agents", icon: <Bot size={18} />, label: "Intelligence Vectors", href: "/agents" },
            { id: "vault", icon: <Briefcase size={18} />, label: "Document Vault", href: "/vault" },
            { id: "calendar", icon: <Calendar size={18} />, label: "Compliance Map", href: "/compliance" },
          ].map((item) => (
            <Link key={item.id} href={item.href} className={`nav-item ${item.href === "/dashboard" ? "active" : ""}`} style={{ padding: "12px 28px" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontWeight: item.href === "/dashboard" ? 700 : 400 }}>{item.label}</span>
            </Link>
          ))}
          <p className="sidebar-section-title" style={{ color: "#6B7280", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, paddingLeft: "28px", marginTop: "24px", marginBottom: "12px" }}>Infrastructure</p>
          <Link href="/api-portal" className="nav-item" style={{ padding: "12px 28px" }}>
            <span style={{ fontSize: "18px" }}><Zap size={18} /></span>
            API Gateway
          </Link>
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="dash-main" style={{ width: "100%", flex: 1, overflow: "hidden", background: "#000000", display: "flex", flexDirection: "column", marginLeft: 0, paddingLeft: 0, transform: "none", transition: "none" }}>
        
        {/* Top Header */}
        <header className="top-navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: "4px" }}
            >
              <Menu size={24} />
            </button>
            <Link href="/" style={{ background: "none", border: "0.5px solid #1a1a1a", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}>
              <Home size={16} />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Home</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", background: "#080808", border: "0.5px solid #1a1a1a", borderRadius: "8px" }}>
               <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--acid)" }} />
               <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--acid)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kernel Stable</span>
            </div>
          </div>

          <div style={{ background: "#080808", border: "0.5px solid #1a1a1a", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", width: "400px" }}>
            <Search size={14} color="rgba(255,255,255,0.2)" />
            <input placeholder="Search intelligence architecture..." style={{ background: "transparent", border: "none", outline: "none", fontSize: "12px", color: "#fff", width: "100%" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
             <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer" }}><Bell size={18} /></button>
             <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#111", border: "0.5px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <User size={16} color="rgba(255,255,255,0.5)" />
             </div>
          </div>
        </header>

        {/* Strategic Dashboard Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "60px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: "60px" }}>
               <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "52px", color: "var(--acid)", letterSpacing: "-2px", marginBottom: "8px", textTransform: "uppercase" }}>Orchestrator</h1>
               <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" }}>Universal Intelligence Architecture Control</p>
            </div>

            {/* Architecture Feed (Active Vectors) */}
            <div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>Primary Intelligence Vectors</h2>
                  <Link href="/agents" style={{ fontSize: "11px", color: "var(--acid)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", textDecoration: "none" }}>Access Registry →</Link>
               </div>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "24px", marginBottom: "60px" }}>
                  {topAgents.map(a => (
                    <Link key={a.id} href={a.href} style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: "24px", padding: "32px", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "var(--acid)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
                      <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ width: "52px", height: "52px", background: "#000", border: "0.5px solid #222", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acid)" }}>{a.icon}</div>
                        <div>
                           <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#000000" }}>{a.name}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{a.desc}</p>
                    </Link>
                  ))}
               </div>

                {/* Auxiliary Management Section (Global Document Flow placeholder) */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "24px", padding: "48px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                   <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#000", border: "0.5px solid #222", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                     <Server size={20} color="var(--acid)" />
                   </div>
                   <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#000000", marginBottom: "8px" }}>Unified Global Flow</h3>
                   <p style={{ fontSize: "13px", color: "#4B5563", maxWidth: "400px", margin: "0 auto" }}>Secure vector streams are empty. Feed the architecture to begin real-time data orchestration.</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
