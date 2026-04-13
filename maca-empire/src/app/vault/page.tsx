"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Folder, FileText, Scale, PenTool, Mail, Wallet, Search, Cloud, File, Menu, Bell, ArrowLeft, Home, Bot, Calendar, Zap, Briefcase, X } from "lucide-react";

const folders = [
  { icon: <Folder size={16} />, label: "All Documents", count: 0 },
  { icon: <FileText size={16} />, label: "Tax Documents", count: 0 },
  { icon: <Scale size={16} />, label: "Legal Filings", count: 0 },
  { icon: <PenTool size={16} />, label: "Contracts", count: 0 },
  { icon: <Mail size={16} />, label: "Notices & Replies", count: 0 },
  { icon: <Wallet size={16} />, label: "Financial Records", count: 0 },
];

const documents: any[] = [];

export default function VaultPage() {
  const [activeFolder, setActiveFolder] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative", overflowX: "hidden" }}>

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
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "transparent", padding: "6px 0", borderRadius: "none", border: "none" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--acid)", letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
              maCA Empire
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#000", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}>
            <X size={18} />
          </button>
        </div>
        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0", overflowY: "auto" }}>
          <p className="sidebar-section-title">Menus</p>
          {[
            { id: "overview", icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
            { id: "agents", icon: <Bot size={18} />, label: "All Agents", href: "/agents" },
            { id: "vault", icon: <Briefcase size={18} />, label: "Vault", href: "/vault", active: true },
            { id: "calendar", icon: <Calendar size={18} />, label: "Calendar", href: "/compliance" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div style={{ padding: "0 16px 12px", marginTop: "20px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "10px 14px" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}><Search size={16} /></span>
              <input placeholder="Search files..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", width: "100%" }} />
            </div>
          </div>
          <p className="sidebar-section-title" style={{ marginTop: "12px" }}>Folders</p>
          {folders.map((f, i) => (
            <button
              key={i}
              className={`nav-item ${activeFolder === i ? "active" : ""}`}
              onClick={() => setActiveFolder(i)}
              style={{ justifyContent: "space-between" }}
            >
              <span style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                {f.icon} {f.label}
              </span>
              <span style={{
                fontSize: "11px",
                background: activeFolder === i ? "var(--acid-muted)" : "rgba(0,0,0,0.05)",
                border: activeFolder === i ? "0.5px solid var(--border-acid)" : "none",
                borderRadius: "100px",
                padding: "2px 8px",
                color: activeFolder === i ? "var(--acid)" : "#374151",
                fontWeight: activeFolder === i ? 700 : 500
              }}>
                {f.count}
              </span>
            </button>
          ))}
        </nav>

        {/* Storage Meter & Button */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ marginBottom: "16px", padding: "0 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif", fontWeight: "600" }}>Storage Used</span>
              <span style={{ fontSize: "12px", color: "#080B07", fontFamily: "'DM Sans', sans-serif", fontWeight: "700" }}>0 / 25 GB</span>
            </div>
            <div className="progress-bar" style={{ background: "rgba(0,0,0,0.05)", border: "none", height: "6px", borderRadius: "10px", position: "relative" }}>
              <div className="progress-fill" style={{ width: "0%", background: "var(--acid)" }} />
            </div>
          </div>
          <Link href="/onboarding" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", borderRadius: "24px", padding: "28px 20px", textDecoration: "none", boxShadow: "0 12px 32px rgba(0,0,0,0.08)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ width: "32px", height: "32px", background: "#000000", color: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "16px" }}>+</div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#080B07", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px", textAlign: "center" }}>Upgrade to Enterprise</p>
            <p style={{ fontSize: "11px", color: "rgba(8,11,7,0.5)", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>Or view <span style={{ fontWeight: 700, color: "#080B07" }}>Plans</span></p>
          </Link>
        </div>
      </aside>

      {/* ── Main Vault Area ── */}
      <div className="dash-main" style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-primary)", paddingLeft: 0, marginLeft: 0, transform: "none", transition: "none" }}>
        {/* Top Bar */}
        <div style={{ height: "64px", borderBottom: "0.5px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "var(--bg-secondary)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "12px" }}>
            <Link href="/dashboard" style={{ background: "none", border: "0.5px solid var(--border-subtle)", color: "var(--text-secondary)", borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
              <ArrowLeft size={18} />
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", display: "flex", padding: "4px" }}>
              <Menu size={24} />
            </button>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--acid)", textAlign: "center", flex: 1 }}>
            {folders[activeFolder].label}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", width: "120px" }}>
             <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer", display: "flex", padding: "4px" }}><Bell size={20} /></button>
          </div>
        </div>

        {/* Content Area Controls */}
        <div style={{ padding: "16px 24px", display: "flex", gap: "12px", alignItems: "center", borderBottom: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
          <div style={{ display: "flex", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "2px" }}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: view === v ? "var(--bg-secondary)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-muted)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
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

          <button className="btn-primary btn-sm" style={{ marginLeft: "auto" }}>
            ↑ Upload
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Upload Zone */}
          <div style={{ border: "1.5px dashed var(--border-subtle)", borderRadius: "14px", padding: "32px", textAlign: "center", marginBottom: "24px", background: "var(--bg-primary)", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "var(--bg-primary)"; }}>
            <p style={{ display: "flex", justifyContent: "center", marginBottom: "8px", color: "var(--text-secondary)" }}><Cloud size={24} /></p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "4px" }}>Drop files or click to upload</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Supports PDF, DOCX, XLSX, JPG, PNG · Max 50MB per file</p>
          </div>

          {/* Documents */}
          {documents.length > 0 ? (
            view === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {documents.map((doc, i) => (
                  <div
                    key={i}
                    style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" }}
                    onClick={() => setSelectedDoc(doc)}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px", color: "var(--text-secondary)" }}>{doc.icon}</div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>{doc.size} · {doc.date}</p>
                    <span className="badge" style={{ fontSize: "10px", background: "var(--bg-primary)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>{doc.agent}</span>
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
                        <td style={{ color: "var(--text-primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>{doc.icon} {doc.name}</td>
                        <td><span className="badge" style={{ fontSize: "10px", background: "var(--bg-primary)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>{doc.type}</span></td>
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
            )
          ) : (
            <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px" }}>
              <p style={{ display: "flex", justifyContent: "center", marginBottom: "16px", color: "var(--text-muted)" }}><File size={32} /></p>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "4px" }}>No documents found</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Your uploaded files will appear here.</p>
            </div>
          )}
        </div>
      </div>

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

            <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>AI Summary</p>
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
