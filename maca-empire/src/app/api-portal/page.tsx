"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Bot, Wallet, Zap, Activity, CheckCircle, AlertTriangle, Clock, Menu, Bell, ArrowLeft, X } from "lucide-react";

const tabs = ["Overview", "API Keys", "Documentation", "Usage Analytics", "Webhooks"];

const endpoints = [
  { method: "POST", path: "/v1/agents/tax/query", desc: "Send query to maCA Tax agent", rateLimit: "100/min" },
  { method: "POST", path: "/v1/agents/bankfight/complaint", desc: "Generate RBI complaint draft", rateLimit: "50/min" },
  { method: "POST", path: "/v1/agents/notice/reply", desc: "Draft notice reply from uploaded PDF", rateLimit: "30/min" },
  { method: "POST", path: "/v1/agents/compliance/calendar", desc: "Get compliance calendar for GSTIN", rateLimit: "100/min" },
  { method: "GET", path: "/v1/vault/documents", desc: "List documents in user vault", rateLimit: "200/min" },
  { method: "POST", path: "/v1/vault/upload", desc: "Upload document to vault", rateLimit: "20/min" },
  { method: "POST", path: "/v1/agents/contract/review", desc: "AI contract review and redlining", rateLimit: "20/min" },
  { method: "GET", path: "/v1/agents", desc: "List all available agents", rateLimit: "500/min" },
];

const apiKeys = [
  { name: "Production Key", prefix: "mca_prod_...x8k2", created: "Mar 1, 2025", lastUsed: "2 min ago", permissions: ["read", "write", "agents"] },
  { name: "Staging Key", prefix: "mca_stag_...p3q9", created: "Feb 15, 2025", lastUsed: "3 days ago", permissions: ["read", "agents"] },
];

const overviewStats = [
  { label: "Total API Calls", value: "48,291", delta: "+12% this month", icon: <Activity size={20} /> },
  { label: "Successful Calls", value: "47,834", delta: "99.05% success rate", icon: <CheckCircle size={20} /> },
  { label: "Error Rate", value: "0.95%", delta: "-0.3% vs last month", icon: <AlertTriangle size={20} /> },
  { label: "Avg Response Time", value: "1.2s", delta: "-200ms improvement", icon: <Clock size={20} /> },
];

const curlExample = `curl -X POST https://api.macaempire.in/v1/agents/tax/query \\
  -H "Authorization: Bearer mca_prod_...x8k2" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "What is my tax liability for AY 2024-25?", "pan": "ABCDE1234F"}'`;

const pythonExample = `import requests

response = requests.post(
    "https://api.macaempire.in/v1/agents/tax/query",
    headers={"Authorization": "Bearer mca_prod_...x8k2"},
    json={
        "query": "What is my tax liability for AY 2024-25?",
        "pan": "ABCDE1234F"
    }
)
data = response.json()
print(data["response"])`;

const nodeExample = `const response = await fetch(
  'https://api.macaempire.in/v1/agents/tax/query',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mca_prod_...x8k2',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'What is my tax liability for AY 2024-25?',
      pan: 'ABCDE1234F',
    }),
  }
);
const data = await response.json();`;

export default function APIPortalPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<"curl" | "python" | "node">("curl");
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyHeights, setDailyHeights] = useState<number[] | null>(null);

  // Dynamic Key Management
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyData, setNewKeyData] = useState<any | null>(null);
  const [keyName, setKeyName] = useState("Production Key");
  const [isLoading, setIsLoading] = useState(true);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/marketplace/developer/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch keys", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
    // Generate simulated chart data once on mount
    setDailyHeights(Array.from({ length: 30 }, () => Math.floor(40 + Math.random() * 120)));
  }, []);

  const handleGenerateKey = async () => {
    try {
      const res = await fetch("/api/marketplace/developer/keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName })
      });
      if (res.ok) {
        const data = await res.json();
        setNewKeyData(data.key);
      }
    } catch (err) {
      console.error("Failed to generate key", err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this key? It will stop working immediately.")) return;
    try {
      const res = await fetch(`/api/marketplace/developer/keys/${id}/revoke`, { method: "POST" });
      if (res.ok) fetchKeys();
    } catch (err) {
      console.error("Failed to revoke key", err);
    }
  };

  const getCode = () => {
    if (codeLanguage === "curl") return curlExample;
    if (codeLanguage === "python") return pythonExample;
    return nodeExample;
  };

  const handleCopy = (text?: string) => {
    navigator.clipboard.writeText(text || getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#ffffff", position: "relative", overflowX: "hidden" }}>

      {/* ── Sidebar Backdrop ── */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "active" : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── Dashboard Sidebar ── */}
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
        <nav style={{ padding: "0", flex: 1, overflowY: "auto" }}>
          <p className="sidebar-section-title">Menus</p>
          {[
            { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
            { icon: <Bot size={18} />, label: "All Agents", href: "/agents" },
            { icon: <Wallet size={18} />, label: "Vault", href: "/vault" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="nav-item">
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <p className="sidebar-section-title">Service</p>
          {[
            { icon: <Zap size={18} />, label: "API Portal", href: "/api-portal", active: true },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`nav-item ${item.active ? "active" : ""}`}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Big Premium Action Pill */}
        <div style={{ padding: "16px 20px" }}>
          <Link href="/onboarding" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", borderRadius: "24px", padding: "28px 20px", textDecoration: "none", boxShadow: "0 12px 32px rgba(0,0,0,0.08)", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ width: "32px", height: "32px", background: "#000000", color: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "16px" }}>+</div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#080B07", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px", textAlign: "center" }}>Upgrade to Enterprise</p>
            <p style={{ fontSize: "11px", color: "rgba(8,11,7,0.5)", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>Or view <span style={{ fontWeight: 700, color: "#080B07" }}>Plans</span></p>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="dash-main" style={{ width: "100%", flex: 1, overflow: "hidden", background: "var(--bg-primary)", display: "flex", flexDirection: "column", paddingLeft: 0 }}>
        {/* Top Bar */}
        <div style={{ height: "64px", borderBottom: "0.5px solid var(--border-subtle)", display: "flex", alignItems: "center", padding: "0 32px", gap: "16px", background: "var(--bg-secondary)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "12px" }}>
            <Link href="/dashboard" style={{ background: "none", border: "0.5px solid var(--border-subtle)", color: "var(--text-secondary)", borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
              <ArrowLeft size={18} />
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", display: "flex", padding: "4px" }}>
              <Menu size={24} />
            </button>
          </div>
          <span className="badge" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border-subtle)", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "1px", marginLeft: "auto" }}>Enterprise</span>
          <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer", display: "flex", padding: "4px" }}><Bell size={20} /></button>
        </div>

        <div style={{ padding: "48px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "42px", color: "var(--acid)", letterSpacing: "-1.5px", marginBottom: "8px" }}>API Portal</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px", maxWidth: "600px" }}>
            Integrate maCA Empire agents into your own products via REST API.
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px", borderBottom: "0.5px solid var(--border-subtle)", width: "100%", justifyContent: "center" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)", borderBottom: activeTab === tab ? "2px solid var(--text-primary)" : "2px solid transparent", transition: "color 0.2s", marginBottom: "-0.5px" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 32px 32px" }}>

          {/* ── Overview Tab ── */}
          {activeTab === "Overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
                {overviewStats.map((s, i) => (
                  <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "22px" }}>{s.icon}</span>
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "-1px", marginBottom: "4px" }}>{s.value}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{s.label}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{s.delta}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>Available Endpoints</h3>
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden", marginBottom: "32px" }}>
                <table className="data-table">
                  <thead><tr><th>Method</th><th>Path</th><th>Description</th><th>Rate Limit</th></tr></thead>
                  <tbody>
                    {endpoints.map((ep, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                            {ep.method}
                          </span>
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--text-primary)" }}>{ep.path}</td>
                        <td>{ep.desc}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{ep.rateLimit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Code Samples */}
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>Quick Start</h3>
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "0.5px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {(["curl", "python", "node"] as const).map((lang) => (
                      <button key={lang} onClick={() => setCodeLanguage(lang)} style={{ padding: "5px 14px", borderRadius: "6px", border: "none", cursor: "pointer", background: codeLanguage === lang ? "var(--bg-secondary)" : "var(--bg-primary)", color: codeLanguage === lang ? "var(--text-primary)" : "var(--text-muted)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        {lang === "node" ? "Node.js" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleCopy()} style={{ fontSize: "12px", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", padding: "5px 14px", color: copied ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <pre className="code-block" style={{ borderRadius: 0, border: "none", background: "#0a0d09", color: "var(--text-secondary)" }}>
                  <code>{getCode()}</code>
                </pre>
              </div>
            </div>
          )}

          {/* ── API Keys Tab ── */}
          {activeTab === "API Keys" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "4px" }}>API Keys</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Manage your API keys. Never commit them to source control.</p>
                </div>
                <button onClick={() => setShowNewKeyModal(true)} className="btn-primary" style={{ fontSize: "13px" }}>
                  + Generate New Key
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {isLoading ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Loading keys...</p>
                ) : keys.length === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>No active API keys found.</p>
                ) : (
                  keys.map((key, i) => (
                    <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "20px", opacity: key.is_active ? 1 : 0.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "4px" }}>{key.name}</p>
                          <p style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>{key.key.slice(0, 15)}...</p>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {key.permissions.map((p: string) => (
                              <span key={p} className="badge" style={{ fontSize: "10px", background: "var(--bg-primary)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>{p}</span>
                            ))}
                            {!key.is_active && <span className="badge" style={{ fontSize: "10px", background: "rgba(255,94,94,0.1)", color: "var(--danger)", border: "none" }}>Revoked</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>Status: {key.is_active ? "Active" : "Inactive"}</p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Created: {new Date(key.created_at).toLocaleDateString()}</p>
                          {key.is_active && (
                            <button 
                              onClick={() => handleRevokeKey(key.id)}
                              style={{ background: "none", border: "0.5px solid rgba(255,94,94,0.25)", borderRadius: "8px", padding: "6px 14px", color: "var(--danger)", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* New Key Modal */}
              {showNewKeyModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(8,11,7,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                  <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "20px", padding: "32px", width: "440px" }}>
                    {!newKeyData ? (
                      <>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "20px", marginBottom: "8px" }}>Generate API Key</h3>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Give your key a name to identify it later.</p>
                        <input 
                          type="text" 
                          value={keyName} 
                          onChange={(e) => setKeyName(e.target.value)}
                          placeholder="e.g. Production Mobile App"
                          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)", background: "var(--bg-primary)", color: "var(--text-primary)", marginBottom: "20px" }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleGenerateKey}>Generate Key</button>
                          <button className="btn-ghost" onClick={() => setShowNewKeyModal(false)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "20px", marginBottom: "8px" }}>Key Generated Successfully</h3>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>This is shown only once. Copy it now.</p>
                        <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "14px 16px", fontFamily: "monospace", fontSize: "13px", color: "var(--text-primary)", marginBottom: "20px", wordBreak: "break-all" }}>
                          {newKeyData.key}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "13px" }} onClick={() => handleCopy(newKeyData.key)}>
                            {copied ? "✓ Copied" : "Copy Key"}
                          </button>
                          <button className="btn-ghost" style={{ fontSize: "13px" }} onClick={() => { setShowNewKeyModal(false); setNewKeyData(null); fetchKeys(); }}>Done</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Usage Analytics Tab ── */}
          {activeTab === "Usage Analytics" && (
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>API Usage Analytics</h3>
              {/* Simulated chart area */}
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Daily API Calls — Last 30 Days</p>
                <div style={{ height: "160px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  {(dailyHeights ?? Array.from({ length: 30 }, () => 80)).map((h, i) => {
                    return (
                      <div key={i} style={{ flex: 1, background: `rgba(255,255,255,${0.1 + (h / 160) * 0.4})`, borderRadius: "3px 3px 0 0", height: `${h}px`, minWidth: "4px", transition: "opacity 0.2s", cursor: "pointer" }}
                        title={`${800 + h * 30} calls`} />
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Mar 10</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Apr 9</span>
                </div>
              </div>

              {/* Calls per endpoint bar chart */}
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", padding: "24px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>Calls by Agent Endpoint</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "/agents/tax/query", pct: 38, calls: "18,350" },
                    { label: "/agents/compliance/calendar", pct: 22, calls: "10,624" },
                    { label: "/agents/bankfight/complaint", pct: 15, calls: "7,244" },
                    { label: "/vault/documents", pct: 12, calls: "5,795" },
                    { label: "/agents/notice/reply", pct: 8, calls: "3,863" },
                    { label: "Other", pct: 5, calls: "2,415" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>{item.label}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{item.calls}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${item.pct}%`, background: "var(--text-secondary)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Documentation Tab ── */}
          {activeTab === "Documentation" && (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-acid)", borderRadius: "14px", padding: "32px" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", marginBottom: "16px" }}>Getting Started</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: "20px" }}>
                  The maCA Empire API gives you programmatic access to all 15 AI agents. All requests must be authenticated using your API key in the Authorization header.
                </p>
                <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
                  <p style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--text-primary)" }}>Base URL: https://api.macaempire.in/v1</p>
                </div>
                {[
                  { title: "Authentication", content: "Pass your API key as a Bearer token in the Authorization header: `Authorization: Bearer your_api_key`" },
                  { title: "Rate Limits", content: "API calls are rate-limited per endpoint (see Overview tab). When you exceed a limit, you receive a 429 Too Many Requests response." },
                  { title: "Response Format", content: "All responses are JSON. Successful responses have a `response` field. Errors have `error` and `code` fields." },
                ].map((section, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "8px", color: "var(--text-primary)" }}>{section.title}</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65 }}>{section.content}</p>
                  </div>
                ))}
                <Link href="https://docs.macaempire.in" className="btn-primary" style={{ fontSize: "13px", display: "inline-flex" }}>
                  Full Documentation →
                </Link>
              </div>
            </div>
          )}

          {/* ── Webhooks Tab ── */}
          {activeTab === "Webhooks" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px" }}>Webhooks</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Receive real-time events from maCA Empire agents</p>
                </div>
                <button className="btn-primary" style={{ fontSize: "13px" }}>+ Add Endpoint</button>
              </div>
              <div style={{ background: "var(--bg-secondary)", border: "0.5px dashed var(--border-subtle)", borderRadius: "14px", padding: "48px", textAlign: "center" }}>
                <p style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "var(--text-secondary)" }}><Zap size={32} /></p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>No webhooks configured</p>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Add a webhook endpoint to receive events when agents complete tasks</p>
                <button className="btn-ghost" style={{ fontSize: "13px" }}>Configure Webhook →</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
