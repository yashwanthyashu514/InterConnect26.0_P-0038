"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
  "Power Agents": [
    { label: "Supreme Tax", href: "/tax" },
    { label: "Banking & Credit", href: "/bankfight" },
    { label: "Notice & Disputes", href: "/notice" },
    { label: "Payroll & HR", href: "/payroll" },
    { label: "Corporate Counsel", href: "/compliance" },
  ],
  "Elite Tools": [
    { label: "Deal Reviewer", href: "/contract-reviewer" },
    { label: "Forensic Audit", href: "/audit-shield" },
    { label: "CryptoTax Pro", href: "/crypto-tax" },
    { label: "ESG Compass", href: "/esg-compass" },
  ],
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Vault", href: "/vault" },
  ],
  Company: [
    { label: "Enterprise", href: "/b2b" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Get Started", href: "/onboarding" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/login")) return null;

  return (
    <>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(4, 1fr);
          gap: 48px;
          margin-bottom: 64px;
        }
        .footer-link {
          font-size: 14px;
          color: rgba(8, 11, 7, 0.6);
          text-decoration: none;
          transition: 0.2s;
          display: block;
          padding: 4px 0;
        }
        .footer-link:hover { color: #000; }
        
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 48px; }
          footer { padding: 80px 24px 40px !important; }
        }
      `}</style>

      <footer style={{ background: "#F7F8F3", borderTop: "0.5px solid rgba(0,0,0,0.08)", padding: "120px 48px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: "inline-block", background: "#080B07", padding: "8px 20px", borderRadius: "100px", textDecoration: "none", marginBottom: "20px" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "#B5FF2E" }}>maCA</span>
              </Link>
              <p style={{ fontSize: "14px", color: "rgba(8,11,7,0.7)", lineHeight: 1.6, maxWidth: "240px" }}>
                Big 4 quality consulting for the next billion. 18 autonomous agents protecting your sovereign wealth.
              </p>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#000", marginBottom: "24px" }}>
                  {title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <Link key={link.label} href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <p style={{ fontSize: "12px", color: "rgba(8,11,7,0.4)" }}>© 2026 maCA Empire. All rights reserved.</p>
            <p style={{ fontSize: "12px", color: "rgba(8,11,7,0.4)" }}>Built for Bharat · Not a substitute for professional legal advice.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
