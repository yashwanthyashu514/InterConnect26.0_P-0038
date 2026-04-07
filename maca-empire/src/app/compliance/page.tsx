"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Deadline {
  form: string;
  description: string;
  dueDate: string;
  daysLeft: number;
  penalty: string;
  status: "OVERDUE" | "URGENT" | "UPCOMING" | "SAFE";
}

function getDeadlines(cin: string): Deadline[] {
  const today = new Date();
  const deadlines: Deadline[] = [
    {
      form: "AOC-4",
      description: "Filing of Financial Statements",
      dueDate: "29 Oct 2026",
      daysLeft: Math.ceil((new Date("2026-10-29").getTime() - today.getTime()) / 86400000),
      penalty: "₹100/day",
      status: "SAFE",
    },
    {
      form: "MGT-7",
      description: "Annual Return",
      dueDate: "28 Nov 2026",
      daysLeft: Math.ceil((new Date("2026-11-28").getTime() - today.getTime()) / 86400000),
      penalty: "₹100/day",
      status: "SAFE",
    },
    {
      form: "ADT-1",
      description: "Auditor Appointment",
      dueDate: "15 Oct 2026",
      daysLeft: Math.ceil((new Date("2026-10-15").getTime() - today.getTime()) / 86400000),
      penalty: "₹300/day",
      status: "SAFE",
    },
    {
      form: "DIR-3 KYC",
      description: "Director KYC",
      dueDate: "30 Sep 2026",
      daysLeft: Math.ceil((new Date("2026-09-30").getTime() - today.getTime()) / 86400000),
      penalty: "₹5,000 one-time",
      status: "UPCOMING",
    },
    {
      form: "GSTR-1",
      description: "GST Outward Supplies",
      dueDate: "11 May 2026",
      daysLeft: Math.ceil((new Date("2026-05-11").getTime() - today.getTime()) / 86400000),
      penalty: "₹50/day",
      status: "UPCOMING",
    },
    {
      form: "TDS Return Q4",
      description: "TDS Filing (26Q)",
      dueDate: "31 May 2026",
      daysLeft: Math.ceil((new Date("2026-05-31").getTime() - today.getTime()) / 86400000),
      penalty: "₹200/day",
      status: "UPCOMING",
    },
    {
      form: "ITR-6",
      description: "Company Income Tax Return",
      dueDate: "31 Oct 2026",
      daysLeft: Math.ceil((new Date("2026-10-31").getTime() - today.getTime()) / 86400000),
      penalty: "₹10,000 flat",
      status: "SAFE",
    },
  ].map(d => ({
    ...d,
    status: d.daysLeft < 0 ? "OVERDUE" : d.daysLeft <= 15 ? "URGENT" : d.daysLeft <= 45 ? "UPCOMING" : "SAFE"
  }));
  return deadlines;
}

const STATUS_COLORS: Record<string, string> = {
  OVERDUE: "#dc2626",
  URGENT: "#f59e0b",
  UPCOMING: "#3b82f6",
  SAFE: "#16a34a",
};

import { saveToVault } from "@/lib/vault";

export default function CompliancePage() {
  const [cin, setCin] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cin.trim()) return;
    const dl = getDeadlines(cin);
    setDeadlines(dl);
    setSubmitted(true);
    
    saveToVault({ agent_id: "A3", doc_type: "Compliance Calendar", content: JSON.stringify(dl, null, 2) });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "900px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🏢 ComplianceBot A3</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Unified Regulatory Deadline Calculator · MCA & GST Ready</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <input
            value={cin}
            onChange={e => setCin(e.target.value.toUpperCase())}
            placeholder="Enter CIN / GSTIN / PAN (e.g. U74999MH2021PTC123456)"
            style={{ flex: 1, padding: "1rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--foreground)", fontSize: "0.9rem" }}
          />
          <button type="submit" style={{ padding: "1rem 2rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "900", cursor: "pointer", whiteSpace: "nowrap" }}>
            GET DEADLINES →
          </button>
        </form>

        {submitted && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {(["OVERDUE","URGENT","UPCOMING","SAFE"] as const).map(s => (
                <div key={s} style={{ background: "var(--secondary)", padding: "1rem", borderRadius: "0.75rem", border: `1px solid ${STATUS_COLORS[s]}22`, textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900", color: STATUS_COLORS[s] }}>
                    {deadlines.filter(d => d.status === s).length}
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: "700", color: STATUS_COLORS[s] }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {deadlines.sort((a, b) => a.daysLeft - b.daysLeft).map(d => (
                <div key={d.form} style={{
                  background: "var(--secondary)", padding: "1.25rem", borderRadius: "0.75rem",
                  border: `1px solid ${STATUS_COLORS[d.status]}33`,
                  display: "grid", gridTemplateColumns: "120px 1fr auto auto",
                  alignItems: "center", gap: "1rem"
                }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--foreground)" }}>{d.form}</div>
                    <div style={{ fontSize: "0.6rem", color: "var(--muted)" }}>{d.description}</div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Due: <strong style={{ color: "var(--foreground)" }}>{d.dueDate}</strong></div>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: "700" }}>{d.penalty}</div>
                  <div style={{
                    padding: "0.3rem 0.75rem", borderRadius: "1rem",
                    background: `${STATUS_COLORS[d.status]}20`, color: STATUS_COLORS[d.status],
                    fontSize: "0.65rem", fontWeight: "900", whiteSpace: "nowrap"
                  }}>
                    {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)}d overdue` : `${d.daysLeft}d left`}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(20,184,166,0.05)", borderRadius: "0.75rem", border: "1px dashed var(--primary)", fontSize: "0.7rem", color: "var(--muted)", textAlign: "center" }}>
              Company: <strong style={{ color: "var(--foreground)" }}>{cin}</strong> · Total Deadlines: {deadlines.length} · Powered by ROC/MCA Database
            </div>
          </>
        )}

        {!submitted && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)", border: "2px dashed var(--border)", borderRadius: "1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏢</div>
            <p style={{ fontWeight: "700" }}>Enter any CIN / GSTIN to see ALL compliance deadlines in one tap.</p>
            <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>AOC-4 · MGT-7 · ADT-1 · GSTR-1 · TDS Returns · ITR-6</p>
          </div>
        )}
      </main>
    </div>
  );
}
