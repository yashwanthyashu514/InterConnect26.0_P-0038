"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Home, Bot, Briefcase, Calendar, Zap, Bell,
  Search, FileText, Landmark, AlertTriangle, DollarSign,
  Lock, Mic, FileSignature, Scale, TrendingUp, Shield,
  HardHat, Globe, Wallet, Building2, PenTool, Rocket,
  Package, ShieldAlert, Coins, Leaf, ScrollText, MessageSquare,
  Files, Clock, CheckCircle2, User, Users, Menu, X, ArrowLeft,
  Cpu, Gem, Banknote, Mic2, Brain, Gavel
} from "lucide-react";

import { AGENTS, EMPIRE_AGENTS } from "@/lib/agents";

const getAgentIcon = (id: string, size = 18) => {
  switch (id) {
    case "A0": return <Cpu size={size} />;
    case "A1": return <FileText size={size} />;
    case "A2": return <Landmark size={size} />;
    case "A3": return <AlertTriangle size={size} />;
    case "A4": return <DollarSign size={size} />;
    case "A5": return <Rocket size={size} />;
    case "A6": return <Mic2 size={size} />;
    case "A7": return <Search size={size} />;
    case "A8": return <Scale size={size} />;
    case "A12": return <Lock size={size} />;
    case "A13": return <Globe size={size} />;
    case "A21": return <ShieldAlert size={size} />;
    case "A23": return <Leaf size={size} />;
    case "A24": return <ScrollText size={size} />;
    case "A22": return <Coins size={size} />;
    case "A25": return <Brain size={size} />;
    case "A26": return <TrendingUp size={size} />;
    case "A27": return <Gem size={size} />;
    case "A28": return <Banknote size={size} />;
    case "E1": return <Scale size={size} />;
    case "E2": return <Gavel size={size} />;
    case "E3": return <Building2 size={size} />;
    case "E4": return <Shield size={size} />;
    case "E5": return <Zap size={size} />;
    default: return <Bot size={size} />;
  }
};

const allEmpireAgents = EMPIRE_AGENTS.map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 24),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
  subAgents: agent.subAgents
}));

const allSpecialistAgents = AGENTS.map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 20),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
}));

export default function AllAgentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const categories = ["EMPIRE", "CORE", "GROWTH", "ELITE", "ALL"];
  const [filter, setFilter] = useState("EMPIRE");

  const filteredAgents = filter === "ALL" 
    ? [...allEmpireAgents, ...allSpecialistAgents] 
    : filter === "EMPIRE" 
      ? allEmpireAgents 
      : allSpecialistAgents.filter(a => a.tag === filter);


  return (
    <div style={{ minHeight: "100vh", background: "#000000", position: "relative", overflowX: "hidden", color: "#ffffff" }}>

      {/* ── Sidebar Backdrop ── */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "active" : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar" style={{ 
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        boxShadow: isSidebarOpen ? "20px 0 50px rgba(0,0,0,0.5)" : "none"
      }}>
        <div style={{ padding: "0 20px 24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "transparent", padding: "6px 0", borderRadius: 0, border: "none" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--acid)", letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
              maCA Empire
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#000", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}>
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0", overflowY: "auto" }}>
          <p className="sidebar-section-title" style={{ color: "#6B7280" }}>Terminal Menus</p>
          {[
            { id: "overview", icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
            { id: "agents", icon: <Bot size={18} />, label: "All Agents", href: "/agents" },
            { id: "vault", icon: <Briefcase size={18} />, label: "Vault", href: "/vault" },
            { id: "calendar", icon: <Calendar size={18} />, label: "Calendar", href: "/compliance" },
          ].map((item) => (
            <Link key={item.id} href={item.href} className={`nav-item ${item.id === "agents" ? "active" : ""}`}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div className="dash-main" style={{ width: "100%", flex: 1, overflow: "hidden", background: "#000000", display: "flex", flexDirection: "column", paddingLeft: 0, marginLeft: 0, transform: "none", transition: "none" }}>
        
        {/* Top Bar */}
        <header className="top-navbar" style={{ background: "#000", borderBottom: "0.5px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: "4px" }}
            >
              <Menu size={24} />
            </button>
            <Link href="/" style={{ background: "none", border: "0.5px solid #1a1a1a", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}>
              <Home size={16} />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Home</span>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ 
                padding: "6px 16px", 
                borderRadius: "100px", 
                border: filter === cat ? "0.5px solid var(--acid)" : "0.5px solid #1a1a1a", 
                background: filter === cat ? "rgba(181, 255, 46, 0.05)" : "transparent",
                color: filter === cat ? "var(--acid)" : "rgba(255,255,255,0.4)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ width: "100px", display: "flex", justifyContent: "flex-end" }}>
             <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer" }}><Bell size={20} /></button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "48px 32px" }}>
           <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "42px", color: "var(--acid)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "-1px" }}>NEURAL REGISTRY</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "48px" }}>Deploying Sovereign Intelligence from the Empire Command Tier.</p>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                gap: "20px"
              }}>
                {filteredAgents.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", gridColumn: "1/-1" }}>No agents found in this category.</p>
                ) : filteredAgents.map((a) => (
                  <Link key={a.id} href={a.href}
                    style={{
                      display: "block",
                      background: "#0D1117",
                      border: "1px solid #21262d",
                      borderRadius: "16px",
                      padding: "24px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#B5FF2E";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(181,255,46,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#21262d";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}>
                    {/* Icon */}
                    <div style={{
                      width: "44px", height: "44px",
                      background: "rgba(181,255,46,0.08)",
                      border: "1px solid rgba(181,255,46,0.2)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#B5FF2E",
                      marginBottom: "16px"
                    }}>{a.icon}</div>
                    {/* Name */}
                    <p style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#FFFFFF",
                      marginBottom: "8px",
                      letterSpacing: "-0.3px"
                    }}>{a.name}</p>
                    {/* Description */}
                    <p style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                      marginBottom: "20px"
                    }}>{a.desc}</p>
                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        background: "rgba(181,255,46,0.06)",
                        color: "#B5FF2E",
                        border: "1px solid rgba(181,255,46,0.15)",
                        borderRadius: "6px",
                        padding: "3px 10px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.5px"
                      }}>{a.tag}</span>
                      {a.tag === "EMPIRE" && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--acid)" }}></span>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--acid)" }}></span>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--acid)" }}></span>
                        </div>
                      )}
                      <span style={{ fontSize: "11px", color: "#B5FF2E", fontWeight: 700 }}>Deploy Command →</span>
                    </div>
                  </Link>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
