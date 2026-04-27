"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Cpu, Users, Megaphone, Bell, LogOut, Gem, Briefcase, Lock, Eye, EyeOff, Shield } from "lucide-react";

const navItems = [
  { label: "Command Centre", href: "/admin",            icon: <BarChart3 size={16} />,   layer: null },
  { label: "CFO AI",         href: "/admin/cfo",        icon: <Gem size={16} />,         layer: "L1" },
  { label: "CTO AI",         href: "/admin/cto",        icon: <Cpu size={16} />,         layer: "L2" },
  { label: "HR AI",          href: "/admin/hr",         icon: <Users size={16} />,       layer: "L3" },
  { label: "Marketing AI",   href: "/admin/marketing",  icon: <Megaphone size={16} />,   layer: "L4" },
  { label: "Marketplace",    href: "/admin/marketplace", icon: <Briefcase size={16} />,  layer: null },
  { label: "Alerts",         href: "/admin/alerts",     icon: <Bell size={16} />,        layer: null },
];

const SESSION_KEY = "admin_session_verified";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for existing verified session in this browser tab
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === "true") setVerified(true);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!verified || pathname === "/admin/login") return;
    fetch("/api/admin/alerts-count")
      .then(r => r.json())
      .then(d => setAlertCount(d.count || 0))
      .catch(() => {});
  }, [pathname, verified]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ceo@imperio.system", password })
      });
      const data = await res.json();
      if (res.ok && data.user?.role === "admin") {
        sessionStorage.setItem(SESSION_KEY, "true");
        setVerified(true);
      } else {
        setError("Access Denied. Invalid master key.");
      }
    } catch {
      setError("Network error. Ensure the backend is running.");
    }
    setLoading(false);
  };

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return null;

  // 🔒 Lock Screen — shown on every new browser tab / session
  if (!verified) {
    return (
      <div style={{
        minHeight: "100vh", background: "#000", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 0%, rgba(181,255,46,0.05) 0%, transparent 60%)" }} />

        <div style={{
          width: "100%", maxWidth: "400px", padding: "48px 40px",
          background: "rgba(8,11,7,0.95)", border: "1px solid rgba(181,255,46,0.12)",
          borderRadius: "24px", backdropFilter: "blur(20px)", position: "relative", zIndex: 1
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "36px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(181,255,46,0.08)", border: "1px solid rgba(181,255,46,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px"
            }}>
              <Lock size={24} color="#B5FF2E" />
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#080B07", border: "1px solid rgba(181,255,46,0.2)", borderRadius: "100px", padding: "5px 14px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "13px", color: "#B5FF2E" }}>maCA Empire</span>
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px", textAlign: "center" }}>Internal Command</h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center", margin: 0 }}>Enter your master key to access the neural command centre</p>
          </div>

          <form onSubmit={handleUnlock}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Master Key
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoFocus
                  style={{
                    width: "100%", padding: "14px 44px 14px 16px",
                    borderRadius: "12px",
                    border: error ? "1px solid rgba(255,80,80,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "14px",
                    outline: "none", boxSizing: "border-box", transition: "border 0.2s"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p style={{ fontSize: "12px", color: "#FF5050", marginTop: "8px", margin: "6px 0 0" }}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: password ? "#B5FF2E" : "rgba(181,255,46,0.15)",
                color: "#000", fontSize: "14px", fontWeight: 800,
                cursor: password ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s"
              }}
            >
              <Shield size={16} />
              {loading ? "Verifying..." : "Access Command Centre"}
            </button>
          </form>

          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", textAlign: "center", marginTop: "24px" }}>
            Authorised Personnel Only · Imperio Neural Security Layer
          </p>
        </div>
      </div>
    );
  }

  // ✅ Unlocked Admin Layout
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <aside style={{ width: "220px", flexShrink: 0, borderRight: "0.5px solid rgba(255,255,255,0.06)", padding: "24px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 16px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ background: "#080B07", border: "1px solid rgba(181,255,46,0.2)", borderRadius: "100px", padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "13px", color: "#B5FF2E" }}>maCA</span>
          </div>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase" }}>Internal Command</p>
        </div>

        <nav style={{ flex: 1, padding: "16px 8px" }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", marginBottom: "2px", background: active ? "rgba(181,255,46,0.08)" : "transparent", color: active ? "#B5FF2E" : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: active ? 700 : 400, transition: "all 0.15s", position: "relative" }}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.layer && <span style={{ fontSize: "9px", fontWeight: 800, color: active ? "#B5FF2E" : "rgba(255,255,255,0.2)", letterSpacing: "0.5px" }}>{item.layer}</span>}
                {item.href === "/admin/alerts" && alertCount > 0 && (
                  <span style={{ background: "#FF5050", color: "#fff", fontSize: "9px", fontWeight: 800, borderRadius: "100px", padding: "1px 6px" }}>{alertCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "10px 12px", background: "rgba(181,255,46,0.04)", border: "0.5px solid rgba(181,255,46,0.1)", borderRadius: "10px", marginBottom: "10px" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, color: "#B5FF2E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Chain Level</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>LVL 0 · CEO (You)</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setVerified(false); setPassword(""); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,80,80,0.6)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "8px" }}
          >
            <Lock size={13} /> Lock Admin
          </button>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            <LogOut size={13} /> Back to Platform
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
