"use client";

import React, { useState } from "react";
import AgentChatLayout from "@/components/agent/AgentChatLayout";

const today = new Date();
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const deadlines = [
  { date: 7, desc: "GSTR-1 (Monthly)", type: "gst", daysLeft: 0, status: "overdue" },
  { date: 11, desc: "GSTR-1 (Quarterly)", type: "gst", daysLeft: 4, status: "soon" },
  { date: 20, desc: "GSTR-3B", type: "gst", daysLeft: 13, status: "upcoming" },
  { date: 30, desc: "GSTR-9 Annual", type: "gst", daysLeft: 23, status: "upcoming" },
  { date: 15, desc: "TDS Return Q4", type: "tds", daysLeft: 8, status: "soon" },
  { date: 25, desc: "MCA DIR-3 KYC", type: "mca", daysLeft: 18, status: "upcoming" },
];

const typeColors: Record<string, string> = {
  gst: "var(--acid)",
  tds: "#FFB800",
  mca: "#60A5FA",
  labour: "#C084FC",
};

function ComplianceCalendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>
        {monthNames[today.getMonth()]} {today.getFullYear()}
      </p>
      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "16px" }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, padding: "4px 0" }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayDeadlines = deadlines.filter((d) => d.date === day);
          const isToday = day === today.getDate();
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: isToday ? "0.5px solid var(--border-acid)" : "0.5px solid transparent", background: selectedDate === day ? "var(--acid-muted)" : isToday ? "rgba(181,255,46,0.04)" : "transparent", cursor: "pointer", position: "relative", gap: "2px" }}
            >
              <span style={{ fontSize: "11px", color: isToday ? "var(--acid)" : "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", fontWeight: isToday ? 700 : 400 }}>{day}</span>
              {dayDeadlines.length > 0 && (
                <div style={{ display: "flex", gap: "2px" }}>
                  {dayDeadlines.slice(0, 3).map((dl, j) => (
                    <div key={j} style={{ width: "4px", height: "4px", borderRadius: "50%", background: typeColors[dl.type] }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
        {Object.entries({ gst: "GST", tds: "TDS", mca: "MCA", labour: "Labour" }).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: typeColors[k] }} />
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Deadlines list */}
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Upcoming</p>
      {deadlines.sort((a, b) => a.date - b.date).map((d, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
          <div style={{ width: "28px", height: "28px", background: `${typeColors[d.type]}18`, border: `0.5px solid ${typeColors[d.type]}44`, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: typeColors[d.type], fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
            {d.date}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>{d.desc}</p>
          </div>
          <span style={{ fontSize: "10px", color: d.status === "overdue" ? "var(--danger)" : d.status === "soon" ? "var(--warning)" : "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
            {d.status === "overdue" ? "Overdue!" : `${d.daysLeft}d`}
          </span>
        </div>
      ))}
    </div>
  );
}

const prompts = [
  "What GST filings are due this month?",
  "Set up my compliance calendar for a private limited company",
  "What is the penalty for late GSTR-3B filing?",
  "Remind me about upcoming MCA deadlines",
];

export default function CompliancePage() {
  return (
    <AgentChatLayout
      agentName="ComplianceBot"
      agentIcon="📅"
      agentDescription="Never miss a compliance deadline. Automated filing calendar for your business."
      rightPanel={<ComplianceCalendar />}
    >
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>ComplianceBot</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "420px" }}>
          Your automated compliance calendar. Never miss a GST, MCA, TDS, or labour filing deadline again.
        </p>
        <div className="suggested-prompts">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-pill">{p}</button>
          ))}
        </div>
      </div>
    </AgentChatLayout>
  );
}
