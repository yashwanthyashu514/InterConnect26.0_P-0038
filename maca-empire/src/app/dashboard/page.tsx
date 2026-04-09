"use client";

import React, { useState } from "react";
import Link from "next/link";

const allAgents = [
  { id: "A1", name: "maCA Tax", icon: "📋", desc: "ITR guidance & tax advisory.", tag: "CORE", href: "/tax", lastUsed: "2h ago" },
  { id: "A2", name: "BankFight", icon: "🏦", desc: "RBI escalation engine.", tag: "CORE", href: "/bankfight", lastUsed: "Yesterday" },
  { id: "A3", name: "Notice Fighter", icon: "📝", desc: "IT & GST notice replies.", tag: "CORE", href: "/notice" },
  { id: "A4", name: "PayrollPilot", icon: "💰", desc: "Salary & compliance.", tag: "CORE", href: "/payroll" },
  { id: "A5", name: "ComplianceBot", icon: "📅", desc: "Filing calendar.", tag: "CORE", href: "/compliance" },
  { id: "A6", name: "Audit Shield", icon: "🔒", desc: "GSTIN risk scoring.", tag: "CORE", href: "/audit-shield" },
  { id: "A7", name: "Voice CA", icon: "🎤", desc: "Hands-free queries.", tag: "CORE", href: "/voice" },
  { id: "A8", name: "Contract Reviewer", icon: "📄", desc: "AI contract analysis.", tag: "GROWTH", href: "/contract-reviewer" },
  { id: "A9", name: "Court Filer", icon: "⚖️", desc: "Legal drafting.", tag: "GROWTH", href: "/court-filer" },
  { id: "A10", name: "Credit Fixer", icon: "📈", desc: "Credit score repair.", tag: "GROWTH", href: "/credit-fixer" },
  { id: "A11", name: "Insurance Fighter", icon: "🛡️", desc: "Claim dispute.", tag: "GROWTH", href: "/insurance-fighter" },
  { id: "A12", name: "Labour Law", icon: "👷", desc: "Employment disputes.", tag: "GROWTH", href: "/labour-law" },
  { id: "A13", name: "NRI Advisor", icon: "🌏", desc: "FEMA & DTAA.", tag: "GROWTH", href: "/nri" },
  { id: "A14", name: "Pension Pilot", icon: "🏖️", desc: "EPF & retirement.", tag: "GROWTH", href: "/pension" },
  { id: "A15", name: "RERA Fighter", icon: "🏘️", desc: "Real estate disputes.", tag: "GROWTH", href: "/rera" },
  { id: "A16", name: "RTI Drafter", icon: "📨", desc: "Government RTI filing.", tag: "GROWTH", href: "/rti" },
  { id: "A17", name: "Startup Legal", icon: "🚀", desc: "Founder legal toolkit.", tag: "ELITE", href: "/startup-legal" },
  { id: "A18", name: "Trade & EXIM", icon: "📦", desc: "Customs & export.", tag: "ELITE", href: "/trade" },
  { id: "A19", name: "AI Mock Judge", icon: "🤖", desc: "Arbitration simulator.", tag: "ELITE", href: "/ai-judge" },
  { id: "A20", name: "Enterprise API", icon: "🏢", desc: "B2B white-label.", tag: "ELITE", href: "/b2b" },
];

const recentAgents = allAgents.filter((a) => a.lastUsed);

const deadlines = [
  { date: "Apr 30", filing: "GSTR-3B April Filing", agent: "/compliance", daysLeft: 21, urgent: false },
  { date: "May 7", filing: "TDS Return Q4 FY25", agent: "/tax", daysLeft: 28, urgent: false },
  { date: "Jul 31", filing: "ITR Filing AY 2025-26", agent: "/tax", daysLeft: 113, urgent: false },
  { date: "Apr 15", filing: "GSTR-1 Monthly", agent: "/compliance", daysLeft: 6, urgent: true },
];

const recentDocs = [
  { name: "GST_Notice_March_2025.pdf", type: "PDF", agent: "Notice Fighter", date: "Apr 7", size: "2.4 MB" },
  { name: "ITR_FY24-25_Draft.xlsx", type: "XLSX", agent: "maCA Tax", date: "Apr 5", size: "1.1 MB" },
  { name: "Employment_Contract_Review.docx", type: "DOCX", agent: "Contract Reviewer", date: "Apr 3", size: "834 KB" },
];

const quickStats = [
  { label: "Queries This Month", value: "47", icon: "💬", delta: "+12 vs last month" },
  { label: "Documents in Vault", value: "23", icon: "🗄️", delta: "3 added this week" },
  { label: "Active Deadlines", value: "4", icon: "⏰", delta: "1 urgent" },
  { label: "Compliance Score", value: "87%", icon: "✅", delta: "↑ 5% this quarter" },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("overview");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        {/* Logo */}
        <div style={{ padding: "16px 20px 24px", borderBottom: "0.5px solid var(--border-subtle)" }}>
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
              maCA
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {[
            { id: "overview", icon: "🏠", label: "Overview", href: "/dashboard" },
            { id: "agents", icon: "🤖", label: "All Agents", href: "/dashboard#agents" },
            { id: "vault", icon: "🗄️", label: "Vault", href: "/vault" },
            { id: "calendar", icon: "📅", label: "Calendar", href: "/compliance" },
            { id: "api", icon: "⚡", label: "API Portal", href: "/api-portal" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div style={{ padding: "16px 20px", borderTop: "0.5px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👤</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>Arjun Sharma</p>
              <span className="badge badge-acid" style={{ fontSize: "10px", padding: "1px 6px" }}>Pro Plan</span>
            </div>
          </div>
          <Link href="/onboarding" className="btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", fontSize: "12px" }}>
            Upgrade →
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="dash-main">
        {/* Top Bar */}
        <div style={{ height: "64px", borderBottom: "0.5px solid var(--border-subtle)", display: "flex", alignItems: "center", padding: "0 32px", gap: "16px", background: "var(--bg-secondary)", position: "sticky", top: 0, zIndex: 5 }}>
          <div style={{ flex: 1, background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", maxWidth: "400px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>🔍</span>
            <input placeholder="Search agents, documents..." style={{ background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", width: "100%" }} />
          </div>
          <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "20px", padding: "4px" }}>🔔</button>
          <div style={{ width: "36px", height: "36px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer" }}>👤</div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>

          {/* Welcome */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-1px" }}>Good morning, Arjun 👋</h1>
              <span className="badge badge-acid">Pro</span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            {quickStats.map((stat, i) => (
              <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "22px" }}>{stat.icon}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{stat.delta}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-1px", color: "var(--text-primary)", marginBottom: "4px" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Agents */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>Continue where you left off</h2>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {recentAgents.map((a) => (
                <Link key={a.id} href={a.href} style={{ flexShrink: 0, background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "20px", width: "180px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "12px", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                  <div style={{ width: "40px", height: "40px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{a.icon}</div>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>{a.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{a.lastUsed}</p>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>Continue →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>Upcoming Compliance Deadlines</h2>
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden" }}>
              {deadlines.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderBottom: i < deadlines.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ background: d.urgent ? "rgba(255,94,94,0.1)" : "var(--acid-muted)", border: `0.5px solid ${d.urgent ? "rgba(255,94,94,0.25)" : "var(--border-acid)"}`, borderRadius: "8px", padding: "6px 10px", minWidth: "56px", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", color: d.urgent ? "var(--danger)" : "var(--acid)" }}>{d.date}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>{d.filing}</p>
                    <p style={{ fontSize: "12px", color: d.urgent ? "var(--danger)" : "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{d.daysLeft} days remaining{d.urgent ? " — URGENT" : ""}</p>
                  </div>
                  <Link href={d.agent} className="btn-ghost btn-sm" style={{ fontSize: "12px" }}>Handle →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* All Agents */}
          <div id="agents" style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>All Agents</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {allAgents.map((a) => (
                <Link key={a.id} href={a.href} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "16px", textDecoration: "none", display: "flex", gap: "12px", alignItems: "flex-start", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                  <div style={{ width: "36px", height: "36px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", display: "none" }}>{a.desc}</p>
                    <span className={`badge ${a.tag === "CORE" ? "badge-acid" : ""}`} style={a.tag !== "CORE" ? { background: "var(--surface)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" } : undefined}>{a.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Docs */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px" }}>Recent Vault Documents</h2>
              <Link href="/vault" style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>View all →</Link>
            </div>
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Agent</th>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map((doc, i) => (
                    <tr key={i}>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{doc.name}</td>
                      <td><span className="badge badge-acid">{doc.type}</span></td>
                      <td>{doc.agent}</td>
                      <td>{doc.date}</td>
                      <td>{doc.size}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button style={{ fontSize: "12px", background: "none", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "4px 10px", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View</button>
                          <button style={{ fontSize: "12px", background: "none", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "4px 10px", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
