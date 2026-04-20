"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, Gem, Cpu, Megaphone, Bell, ChevronRight,
  RefreshCw, ShieldCheck, FileText, TrendingUp, Users,
  AlertTriangle, CheckCircle, Download, Zap, BarChart3
} from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";

type DeptReport = {
  title: string;
  headline: string;
  summary: string;
  metrics: { label: string; value: string | number }[];
};

type Report = {
  generated_at: string;
  status: string;
  cfo: DeptReport;
  hr: DeptReport;
  cto: DeptReport;
  marketing: DeptReport;
  decisions_needed: string[];
};

const DEPT_META = {
  cfo:       { icon: <Gem size={20} />,        color: "#B5FF2E", bg: "rgba(181,255,46,0.08)",  border: "rgba(181,255,46,0.25)" },
  hr:        { icon: <Users size={20} />,       color: "#C084FC", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.25)" },
  cto:       { icon: <Cpu size={20} />,         color: "#60A5FA", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.25)" },
  marketing: { icon: <Megaphone size={20} />,   color: "#FB923C", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.25)" },
};

export default function AdminDashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [alerts, setAlerts] = useState<{label: string}[]>([]);

  const generateReport = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      const res = await fetch("/api/admin/generate-report", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data: Report = await res.json();
      setReport(data);
      setAlerts(data.decisions_needed?.map(d => ({ label: d })) || []);
      setGenerated(true);
    } catch {
      alert("Report generation failed. Check your connection.");
    }
    setLoading(false);
  };

  // Auto-load on mount
  useEffect(() => {
    generateReport();
  }, []);

  const handleExport = () => {
    if (!report) return;
    const lines: string[] = [
      "████████████████████████████████████████████████████",
      "     maCA EMPIRE — CEO COMMAND BRIEFING REPORT",
      `     Generated: ${new Date(report.generated_at).toLocaleString("en-IN")}`,
      "████████████████████████████████████████████████████",
      "",
    ];
    (["cfo", "hr", "cto", "marketing"] as const).forEach(dept => {
      const d = report[dept];
      lines.push(`\n═══ ${d.title.toUpperCase()} ═══`);
      lines.push(d.headline);
      lines.push(`\nSummary:\n${d.summary}`);
      lines.push("\nMetrics:");
      d.metrics.forEach(m => lines.push(`  • ${m.label}: ${m.value}`));
      lines.push("");
    });
    if (report.decisions_needed?.length > 0) {
      lines.push("\n⚠ DECISIONS REQUIRED:");
      report.decisions_needed.forEach(d => lines.push(`  → ${d}`));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CEO_Report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: "1200px" }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Imperio Neural Internal
          </span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", letterSpacing: "-1px", color: "#fff", margin: "6px 0 4px" }}>
            Command Centre
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            CEO View · Chain-of-command status · Live Supabase data
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {generated && (
            <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "rgba(181,255,46,0.08)", border: "1px solid rgba(181,255,46,0.25)", borderRadius: "10px", color: "#B5FF2E", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
              <Download size={14} /> Export Report
            </button>
          )}
          <button onClick={generateReport} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "12px", cursor: "pointer" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> {loading ? "Generating..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ── Decisions Needed Banner ───────────────────────────────────── */}
      {alerts.length > 0 && (
        <div style={{ padding: "16px 20px", background: "rgba(251,146,60,0.06)", border: "0.5px solid rgba(251,146,60,0.3)", borderRadius: "14px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <AlertTriangle size={16} color="#FB923C" />
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#FB923C", textTransform: "uppercase", letterSpacing: "1px" }}>
              {alerts.length} Action{alerts.length > 1 ? "s" : ""} Required by CEO
            </span>
          </div>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingTop: "8px", borderTop: i > 0 ? "0.5px solid rgba(251,146,60,0.1)" : "none" }}>
              <ChevronRight size={13} color="#FB923C" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{a.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Generate / A2A Banner ─────────────────────────────────────── */}
      <div style={{ padding: "28px 32px", background: "rgba(181,255,46,0.04)", border: "1px solid rgba(181,255,46,0.15)", borderRadius: "20px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ width: "44px", height: "44px", background: "#B5FF2E", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", flexShrink: 0 }}>
          <Activity size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>LIVE CEO BRIEFING REPORT</h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
            {generated && report
              ? `Last generated: ${new Date(report.generated_at).toLocaleString("en-IN")}`
              : "Pull real-time intelligence from CFO, HR, CTO & Marketing layers."}
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          style={{ padding: "13px 24px", background: loading ? "rgba(255,255,255,0.08)" : "#B5FF2E", border: "none", borderRadius: "12px", color: loading ? "rgba(255,255,255,0.3)" : "#000", fontSize: "13px", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}
        >
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}
          {loading ? "Synthesizing..." : "Generate Report"}
        </button>
      </div>

      {/* ── Loading State ─────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ width: "48px", height: "48px", border: "3px solid rgba(255,255,255,0.05)", borderTop: "3px solid #B5FF2E", borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Synthesizing intelligence across all 4 departments...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Department Report Cards ───────────────────────────────────── */}
      {!loading && generated && report && (
        <>
          {/* Timestamp */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <CheckCircle size={14} color="#B5FF2E" />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>
              REPORT SYNTHESIZED · {new Date(report.generated_at).toLocaleString("en-IN")}
            </span>
          </div>

          {/* 2x2 Department Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
            {(["cfo", "hr", "cto", "marketing"] as const).map((dept) => {
              const d = report[dept];
              const meta = DEPT_META[dept];
              return (
                <div key={dept} style={{ background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden" }}>
                  {/* Glow accent */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: `radial-gradient(circle, ${meta.color}10 0%, transparent 70%)`, pointerEvents: "none" }} />

                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ color: meta.color }}>{meta.icon}</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: meta.color, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                      {d.title}
                    </h3>
                  </div>

                  {/* Headline */}
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.4 }}>
                    {d.headline}
                  </p>

                  {/* Metrics */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                    {d.metrics.slice(0, 5).map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{m.label}</span>
                        <span style={{ fontSize: "13px", color: meta.color, fontWeight: 800 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, borderTop: `0.5px solid rgba(255,255,255,0.07)`, paddingTop: "16px", margin: 0 }}>
                    {d.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Full Metrics Breakdown Table */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "32px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <BarChart3 size={18} color="#B5FF2E" />
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: "#fff", margin: 0 }}>Full Metrics Ledger</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {(["cfo", "hr", "cto", "marketing"] as const).map(dept => {
                const d = report[dept];
                const meta = DEPT_META[dept];
                return (
                  <div key={dept}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <span style={{ color: meta.color }}>{meta.icon}</span>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: meta.color, textTransform: "uppercase", letterSpacing: "1.5px" }}>{d.title}</span>
                    </div>
                    {d.metrics.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{m.label}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Nav to Sub-Dashboards */}
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "16px" }}>
              Deep Dive — Executive Sub-Dashboards
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {([
                { label: "CFO Engine",     href: "/admin/cfo",       meta: DEPT_META.cfo },
                { label: "CTO Systems",    href: "/admin/cto",       meta: DEPT_META.cto },
                { label: "HR Overwatch",   href: "/admin/hr",        meta: DEPT_META.hr },
                { label: "Marketing Reach",href: "/admin/marketing", meta: DEPT_META.marketing },
              ]).map(item => (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: item.meta.bg, border: `0.5px solid ${item.meta.border}`, borderRadius: "14px", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: item.meta.color }}>{item.meta.icon}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{item.label}</span>
                  </div>
                  <ChevronRight size={14} color={item.meta.color} />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Empty State ───────────────────────────────────────────────── */}
      {!loading && !generated && (
        <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(255,255,255,0.01)", border: "0.5px dashed rgba(255,255,255,0.08)", borderRadius: "24px" }}>
          <FileText size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", fontWeight: 600 }}>No report generated yet.</p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>Click Generate Report to synthesize live intelligence.</p>
        </div>
      )}
    </div>
  );
}
