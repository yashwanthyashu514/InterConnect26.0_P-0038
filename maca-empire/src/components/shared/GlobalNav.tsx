"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Agents", href: "/#agents" },
  { label: "Platform", href: "/dashboard" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/b2b" },
];

const agentPaths = [
  "/tax", "/bankfight", "/notice", "/payroll", "/compliance",
  "/audit-shield", "/voice", "/contract-reviewer", "/court-filer",
  "/credit-fixer", "/insurance-fighter", "/labour-law", "/nri",
  "/pension", "/rera", "/rti", "/startup-legal", "/trade",
  "/ai-judge", "/dashboard", "/vault", "/api-portal"
];

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isExcludedPage = agentPaths.some((p) => pathname?.startsWith(p)) || pathname?.startsWith("/login") || pathname?.startsWith("/onboarding");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isExcludedPage) return null;


  return (
    <>
      <style>{`
        .nav-wrapper {
          position: fixed;
          top: 20px; left: 0; right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .nav-top-bar {
          pointer-events: auto;
          display: flex;
          align-items: center;
          padding: 0 16px 0 24px;
          height: 56px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          max-width: 900px;
          width: calc(100% - 40px);
        }
        .nav-link-item {
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #080B07;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          font-weight: 600;
        }
        .nav-link-item:hover {
          color: #080B07;
          background: rgba(0, 0, 0, 0.04);
        }
      `}</style>
      <div className="nav-wrapper">
        <nav
          className="nav-top-bar"
          style={{
            background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.9)",
            borderColor: scrolled ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)"
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginRight: "32px", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
              maCA
            </span>
          </Link>

          {/* Center Links */}
          <div style={{ display: "flex", gap: "2px", flex: 1, justifyContent: "center" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link-item">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "24px" }}>
            <Link href="/login" style={{ fontSize: "12px", padding: "8px 16px", borderRadius: "100px", color: "#080B07", textDecoration: "none", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Login</Link>
            <Link href="/login?mode=signup" style={{ fontSize: "12px", padding: "8px 16px", borderRadius: "100px", background: "#080B07", color: "#B5FF2E", textDecoration: "none", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Registration →</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
