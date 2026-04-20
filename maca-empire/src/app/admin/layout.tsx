"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Cpu, Users, TrendingUp, Megaphone, Bell, MessageSquare, LogOut, ChevronRight, Gem, Briefcase } from "lucide-react";

const navItems = [
  { label: "Command Centre", href: "/admin",            icon: <BarChart3 size={16} />,   layer: null },
  { label: "CFO AI",         href: "/admin/cfo",        icon: <Gem size={16} />,         layer: "L1" },
  { label: "CTO AI",         href: "/admin/cto",        icon: <Cpu size={16} />,         layer: "L2" },
  { label: "HR AI",          href: "/admin/hr",         icon: <Users size={16} />,       layer: "L3" },
  { label: "Marketing AI",   href: "/admin/marketing",     icon: <Megaphone size={16} />,   layer: "L4" },
  { label: "Marketplace",    href: "/admin/marketplace",   icon: <Briefcase size={16} />,   layer: null },
  { label: "Alerts",         href: "/admin/alerts",        icon: <Bell size={16} />,        layer: null },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/alerts-count")
      .then(r => r.json())
      .then(d => setAlertCount(d.count || 0))
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      {/* Sidebar */}
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            <LogOut size={13} /> Back to Platform
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
