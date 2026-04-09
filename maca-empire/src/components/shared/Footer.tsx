"use client";

import React from "react";
import Link from "next/link";

const footerLinks = {
  Agents: [
    { label: "maCA Tax", href: "/tax" },
    { label: "BankFight", href: "/bankfight" },
    { label: "Notice Fighter", href: "/notice" },
    { label: "PayrollPilot", href: "/payroll" },
    { label: "ComplianceBot", href: "/compliance" },
    { label: "Audit Shield", href: "/audit-shield" },
    { label: "Voice CA", href: "/voice" },
  ],
  "Legal Tools": [
    { label: "Contract Reviewer", href: "/contract-reviewer" },
    { label: "Court Filer", href: "/court-filer" },
    { label: "Credit Fixer", href: "/credit-fixer" },
    { label: "Insurance Fighter", href: "/insurance-fighter" },
    { label: "Labour Law", href: "/labour-law" },
    { label: "RTI Drafter", href: "/rti" },
    { label: "AI Mock Judge", href: "/ai-judge" },
  ],
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Document Vault", href: "/vault" },
    { label: "API Portal", href: "/api-portal" },
    { label: "NRI Advisor", href: "/nri" },
    { label: "RERA Fighter", href: "/rera" },
    { label: "Startup Legal", href: "/startup-legal" },
    { label: "Trade & EXIM", href: "/trade" },
  ],
  Company: [
    { label: "Enterprise / B2B", href: "/b2b" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Login", href: "/login" },
    { label: "Get Started", href: "/onboarding" },
  ],
};

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-col-link {
          font-size: 14px;
          color: #080B07;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
          display: block;
          padding: 2px 0;
        }
        .footer-col-link:hover { color: #080B07; }
      `}</style>
      <footer style={{ background: "#F7F8F3", borderTop: "0.5px solid rgba(0,0,0,0.08)", padding: "100px 32px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Top row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(4, auto)", gap: "48px", marginBottom: "48px" }}>
            {/* Brand */}
            <div style={{ maxWidth: "240px" }}>
              <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", marginBottom: "20px", background: "#080B07", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "#B5FF2E", letterSpacing: "-0.5px" }}>
                  maCA
                </span>
              </Link>
              <p style={{ fontSize: "14px", color: "#080B07", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                Big 4 quality consulting at consumer scale. 22 autonomous AI agents for India.
              </p>
              <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(0,0,0,0.05)", color: "#080B07", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>DPDP Compliant</span>
                <span style={{ background: "rgba(0,0,0,0.05)", color: "#080B07", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Built for India 🇮🇳</span>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#080B07", marginBottom: "24px", fontFamily: "'DM Sans', sans-serif" }}>
                  {title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {links.map((link) => (
                    <Link key={link.label} href={link.href} className="footer-col-link" style={{ color: "#080B07", fontSize: "14px" }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "12px", color: "rgba(8,11,7,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
              © 2026 maCA Empire. All rights reserved.
            </p>
            <p style={{ fontSize: "12px", color: "rgba(8,11,7,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
              Built for India 🇮🇳 · DPDP Compliant · Not a substitute for legal advice
            </p>
          </div>
        </div>

        {/* Decorative orb */}
        <div style={{ position: "absolute", bottom: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      </footer>
    </>
  );
}
