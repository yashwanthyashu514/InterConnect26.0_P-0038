"use client";

import React, { useState } from "react";
import Link from "next/link";

const folders = [
  { icon: "📁", label: "All Documents", count: 23 },
  { icon: "💸", label: "Tax Documents", count: 8 },
  { icon: "⚖️", label: "Legal Filings", count: 5 },
  { icon: "📝", label: "Contracts", count: 4 },
  { icon: "📨", label: "Notices & Replies", count: 3 },
  { icon: "💰", label: "Financial Records", count: 3 },
];

const documents = [
  { icon: "📄", name: "GST_Notice_March_2025.pdf", size: "2.4 MB", date: "Apr 7", agent: "Notice Fighter", type: "PDF" },
  { icon: "📊", name: "ITR_FY24-25_Draft.xlsx", size: "1.1 MB", date: "Apr 5", agent: "maCA Tax", type: "XLSX" },
  { icon: "📝", name: "Employment_Contract_Review.docx", size: "834 KB", date: "Apr 3", agent: "Contract Reviewer", type: "DOCX" },
  { icon: "📄", name: "GSTR-3B_March_2025.pdf", size: "456 KB", date: "Apr 1", agent: "ComplianceBot", type: "PDF" },
  { icon: "🖼️", name: "RBI_Complaint_Scan.jpg", size: "3.2 MB", date: "Mar 28", agent: "BankFight", type: "IMG" },
  { icon: "📄", name: "Notice_Reply_Draft_Sec148A.pdf", size: "890 KB", date: "Mar 25", agent: "Notice Fighter", type: "PDF" },
  { icon: "📊", name: "Payslip_March_2025.xlsx", size: "245 KB", date: "Mar 20", agent: "PayrollPilot", type: "XLSX" },
  { icon: "📝", name: "Founders_Agreement_v2.docx", size: "1.6 MB", date: "Mar 15", agent: "Startup Legal", type: "DOCX" },
];

export default function VaultPage() {
  const [activeFolder, setActiveFolder] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: "260px", minWidth: "260px", background: "var(--bg-secondary)", borderRight: "0.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 20px", borderBottom: "0.5px solid var(--border-subtle)", marginBottom: "12px" }}>
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", marginBottom: "20px", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
              maCA
            </span>
          </Link>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>🔍</span>
            <input placeholder="Search files..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", width: "100%" }} />
          </div>
        </div>

        {/* Folders */}
        <div style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
          {folders.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFolder(i)}
              style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: activeFolder === i ? "var(--acid-muted)" : "transparent", color: activeFolder === i ? "var(--acid)" : "var(--text-secondary)", marginBottom: "2px", transition: "all 0.15s", justifyContent: "space-between" }}
            >
              <span style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                {f.icon} {f.label}
              </span>
              <span style={{ fontSize: "11px", background: activeFolder === i ? "rgba(181,255,46,0.15)" : "var(--surface)", borderRadius: "100px", padding: "2px 7px", color: activeFolder === i ? "var(--acid)" : "var(--text-muted)" }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Storage Meter */}
        <div style={{ padding: "16px 20px", borderTop: "0.5px solid var(--border-subtle)", marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Storage Used</span>
            <span style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>11.8 / 25 GB</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "47%" }} />
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "6px" }}>47% used</p>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ height: "64px", borderBottom: "0.5px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "12px", padding: "0 24px", background: "var(--bg-secondary)" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", flex: 1 }}>
            {folders[activeFolder].label}
          </h2>

          {/* View Toggle */}
          <div style={{ display: "flex", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "2px" }}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: view === v ? "var(--acid)" : "transparent", color: view === v ? "var(--bg-primary)" : "var(--text-muted)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
                {v === "grid" ? "⊞ Grid" : "☰ List"}
              </button>
            ))}
          </div>

          <select style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px", color: "var(--text-secondary)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Name A-Z</option>
            <option>Size ↓</option>
          </select>

          <button className="btn-primary btn-sm">
            ↑ Upload
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Upload Zone */}
          <div style={{ border: "1.5px dashed rgba(181,255,46,0.25)", borderRadius: "14px", padding: "32px", textAlign: "center", marginBottom: "24px", background: "rgba(181,255,46,0.02)", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(181,255,46,0.5)"; e.currentTarget.style.background = "rgba(181,255,46,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(181,255,46,0.25)"; e.currentTarget.style.background = "rgba(181,255,46,0.02)"; }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>☁️</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "4px" }}>Drop files or click to upload</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Supports PDF, DOCX, XLSX, JPG, PNG · Max 50MB per file</p>
          </div>

          {/* Documents */}
          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {documents.map((doc, i) => (
                <div
                  key={i}
                  style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" }}
                  onClick={() => setSelectedDoc(doc)}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                >
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{doc.icon}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>{doc.size} · {doc.date}</p>
                  <span className="badge badge-acid" style={{ fontSize: "10px" }}>{doc.agent}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden" }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Type</th><th>Agent</th><th>Date</th><th>Size</th><th>Actions</th></tr></thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={i} style={{ cursor: "pointer" }} onClick={() => setSelectedDoc(doc)}>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{doc.icon} {doc.name}</td>
                      <td><span className="badge badge-acid" style={{ fontSize: "10px" }}>{doc.type}</span></td>
                      <td>{doc.agent}</td>
                      <td>{doc.date}</td>
                      <td>{doc.size}</td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button style={{ fontSize: "11px", background: "none", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "3px 8px", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View</button>
                          <button style={{ fontSize: "11px", background: "none", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "3px 8px", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>↓</button>
                          <button style={{ fontSize: "11px", background: "none", border: "0.5px solid rgba(255,94,94,0.25)", borderRadius: "6px", padding: "3px 8px", color: "var(--danger)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Right Preview Panel ── */}
      {selectedDoc && (
        <div style={{ width: "320px", background: "var(--bg-secondary)", borderLeft: "0.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "20px", borderBottom: "0.5px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px" }}>File Preview</h3>
            <button onClick={() => setSelectedDoc(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>
          <div style={{ padding: "24px", flex: 1 }}>
            <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "40px 24px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{selectedDoc.icon}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-muted)" }}>{selectedDoc.type} · {selectedDoc.size}</p>
            </div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{selectedDoc.name}</h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Uploaded {selectedDoc.date} · Via {selectedDoc.agent}</p>

            <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>AI Summary</p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55 }}>
                This document appears to be a government notice requiring a response within 30 days. Key section referenced: 148A. Recommended action: File written objection with supporting documents.
              </p>
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "13px", padding: "11px" }}>
              Ask maCA about this doc →
            </button>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button className="btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "12px" }}>Download ↓</button>
              <button className="btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: "12px" }}>Share ⤢</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
