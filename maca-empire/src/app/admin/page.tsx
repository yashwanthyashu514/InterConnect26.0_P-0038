"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Gem, Cpu, Megaphone, Bell, ChevronRight, RefreshCw, ShieldCheck } from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const agentCards = [
  { id: "cfo",       label: "CFO AI",       sublabel: "Layer 1 · FINANCIAL ENGINE",  icon: <Gem size={18} />, color: "#B5FF2E", href: "/admin/cfo" },
  { id: "cto",       label: "CTO AI",       sublabel: "Layer 2 · CORE SYSTEMS",      icon: <Cpu size={18} />, color: "#60A5FA", href: "/admin/cto" },
  { id: "hr",        label: "HR AI",        sublabel: "Layer 3 · OVERWATCH",         icon: <ShieldCheck size={18} />, color: "#C084FC", href: "/admin/hr" },
  { id: "marketing", label: "MARKETING AI", sublabel: "Layer 4 · BRAND REACH",       icon: <Megaphone size={18} />, color: "#FB923C", href: "/admin/marketing" },
];

export default function AdminDashboard() {
  const [briefing, setBriefing] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, aRes, actRes] = await Promise.all([
        fetch(`${BACKEND}/internal/briefing/today?admin_key=${ADMIN_KEY}`),
        fetch(`${BACKEND}/internal/alerts/active?admin_key=${ADMIN_KEY}`),
        fetch(`${BACKEND}/internal/activity/recent?admin_key=${ADMIN_KEY}`),
      ]);
      const b = await bRes.json();
      const a = await aRes.json();
      const act = await actRes.json();
      setBriefing(b);
      setAlerts(a.alerts || []);
      setActivity(act.activity || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ padding: "120px 40px 80px", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Imperio Neural Internal</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", letterSpacing: "-1px", color: "#fff", margin: "6px 0 4px" }}>Command Centre</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Chain-of-command status · CEO View · Not visible to platform users</p>
        </div>
        <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", cursor: "pointer" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Alert Banner */}
      {alerts.filter(a => a.severity === "critical").length > 0 && (
        <div style={{ padding: "14px 20px", background: "rgba(255,80,80,0.08)", border: "0.5px solid rgba(255,80,80,0.3)", borderRadius: "12px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Bell size={16} color="#FF5050" />
          <span style={{ fontSize: "13px", color: "#FF5050", fontWeight: 700 }}>{alerts.filter(a => a.severity === "critical").length} critical alert(s) require your attention</span>
          <Link href="/admin/alerts" style={{ marginLeft: "auto", fontSize: "12px", color: "#FF5050", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View all <ChevronRight size={12} />
          </Link>
        </div>
      )}

      {/* A2A Force Command (NEW) */}
      <div style={{ padding: "32px", background: "rgba(181, 255, 46, 0.05)", border: "1px solid rgba(181, 255, 46, 0.2)", borderRadius: "24px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ width: "48px", height: "48px", background: "#B5FF2E", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
           <Activity size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>LIVE A2A COMMAND</h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Trigger immediate Agent-to-Agent sequential synthesis. Bypass 08:00 IST schedule.</p>
        </div>
        <button 
          onClick={async () => {
             setLoading(true);
             try {
               await fetch(`${BACKEND}/internal/briefing/force-compile?admin_key=${ADMIN_KEY}`, { method: "POST" });
               await fetchData();
             } catch (e) { alert("Synthesis Error: Check Terminal"); }
             setLoading(false);
          }}
          disabled={loading}
          style={{ padding: "14px 28px", background: "#B5FF2E", border: "none", borderRadius: "12px", color: "#000", fontSize: "13px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />} SYNTHESIZE A2A NOW
        </button>
      </div>

      {/* Main Intel Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginBottom: "40px" }}>
        
        {/* Left: Daily Briefing */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Activity size={16} color="#B5FF2E" />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff" }}>Today's Briefing</h2>
            {briefing?.status && (
              <span style={{ padding: "2px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 800, background: briefing.status === "ready" ? "rgba(181,255,46,0.1)" : "rgba(255,255,255,0.04)", color: briefing.status === "ready" ? "#B5FF2E" : "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                {briefing.status}
              </span>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "CFO (FINANCIAL)", content: briefing?.cfo_section, color: "#B5FF2E", icon: <Gem size={18} color="#B5FF2E" /> },
              { label: "CTO (CORE ENGINE)", content: briefing?.cto_section, color: "#60A5FA", icon: <Cpu size={18} color="#60A5FA" /> },
              { label: "HR (OVERWATCH)", content: briefing?.hr_section, color: "#C084FC", icon: <ShieldCheck size={18} color="#C084FC" /> },
              { label: "MARKETING (REACH)", content: briefing?.marketing_section, color: "#FB923C", icon: <Megaphone size={18} color="#FB923C" /> },
            ].map((section, i) => (
              <div key={i} style={{ padding: "24px", background: "#FFF", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  {React.cloneElement(section.icon as React.ReactElement<any>, { color: "#000" })}
                  <p style={{ fontSize: "11px", fontWeight: 900, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", margin: 0 }}>{section.label}</p>
                </div>
                <p style={{ fontSize: "14px", color: "#000", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                  {loading ? "Synthesizing..." : section.content || "Awaiting Command."}
                </p>
              </div>
            ))}
            {briefing?.decisions_needed && (
              <div style={{ gridColumn: "span 2", padding: "24px", background: "#FFF", border: "2px solid #B5FF2E", borderRadius: "20px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                   <Activity size={18} color="#000" />
                   <p style={{ fontSize: "11px", fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: "1.5px", margin: 0 }}>STRATEGIC DECISIONS NEEDED</p>
                 </div>
                 <p style={{ fontSize: "14px", color: "#000", fontWeight: 700, lineHeight: 1.6, margin: 0 }}>{briefing.decisions_needed}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: A2A Neural Activity Feed */}
        <div style={{ background: "#FFF", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "24px", padding: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Activity size={20} color="#000" />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: "#000", textTransform: "uppercase", letterSpacing: "1.5px" }}>GLOBAL TELEMETRY</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {activity.length > 0 ? activity.map((act, i) => (
              <div key={i} style={{ padding: "16px", background: "rgba(0,0,0,0.03)", borderRadius: "14px", border: "0.5px solid rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                   <span style={{ fontSize: "10px", fontWeight: 900, color: act.type === 'alert' ? '#FF5050' : '#000', textTransform: "uppercase" }}>{act.agent}</span>
                   <ChevronRight size={10} color="rgba(0,0,0,0.2)" />
                   <span style={{ fontSize: "10px", fontWeight: 900, color: "rgba(0,0,0,0.3)", textTransform: "uppercase" }}>{act.to}</span>
                   <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#000", margin: 0, fontWeight: 600 }}>{act.subject}</p>
              </div>
            )) : (
              <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.3)", textAlign: "center", padding: "30px", fontWeight: 600 }}>No autonomous activity detected.</p>
            )}
          </div>
        </div>

      </div>

      {/* Agent Status Grid */}
      <div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", marginBottom: "16px" }}>Executive Team Status</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {agentCards.map(agent => (
            <Link key={agent.id} href={agent.href} style={{ textDecoration: "none", display: "block", padding: "24px 20px", background: "#FFF", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "20px", transition: "all 0.2s", cursor: "pointer", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#000")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ padding: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "8px", color: "#000" }}>
                   {React.cloneElement(agent.icon as React.ReactElement<any>, { color: "#000" })}
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "14px", color: "#000", margin: 0, textTransform: "uppercase", letterSpacing: "1px", wordBreak: "break-word" }}>{agent.label}</p>
              </div>
              <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", fontWeight: 800, lineHeight: 1.4, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>{agent.sublabel}</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#000" }} />
                <span style={{ fontSize: "10px", color: "#000", fontWeight: 900 }}>{agent.id === 'hr' ? 'AUTONOMOUS OVERWATCH' : 'A2A ACTIVE'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
