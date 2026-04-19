"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Agents", href: "/#agents" },
  { label: "Platform", href: "/dashboard" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/b2b" },
];

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // Main Nav should only be on static/marketing pages, not in the functional app/agents
  const isAppPage = pathname.startsWith('/dashboard') || 
                    pathname.startsWith('/compliance') || 
                    pathname.startsWith('/vault') || 
                    pathname.startsWith('/tax') || 
                    pathname.startsWith('/notice') || 
                    pathname.startsWith('/bankfight') || 
                    pathname.startsWith('/payroll') || 
                    pathname.startsWith('/audit') ||
                    pathname.startsWith('/login') ||
                    pathname.startsWith('/onboarding') ||
                    pathname.startsWith('/reset-password') ||
                    pathname.startsWith('/ca-dashboard') ||
                    pathname.startsWith('/developers') ||
                    pathname.startsWith('/agents');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check Authentication (Unified Sync)
    const checkAuth = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       setIsLoggedIn(!!session);
    };
    checkAuth();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAppPage) return null;

  return (
    <>
      <style>{`
        /* ── Nav wrapper: never wider than viewport ── */
        .nav-wrapper {
          position: fixed;
          top: 16px; left: 0; right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          pointer-events: none;
          /* Critical: prevent any child from escaping viewport */
          overflow: hidden;
          padding: 0 12px;
          box-sizing: border-box;
        }
        .nav-top-bar {
          pointer-events: auto;
          display: flex;
          align-items: center;
          padding: 0 10px 0 16px;
          height: 52px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          /* Use 100% width within the padded wrapper — no overflow */
          width: 100%;
          max-width: 860px;
          box-sizing: border-box;
          overflow: hidden;
        }
        .nav-links-desktop {
          display: flex;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }
        .nav-link-item {
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #080B07;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 8px;
          transition: 0.2s;
          font-weight: 600;
          white-space: nowrap;
        }
        .nav-link-item:hover { background: rgba(0, 0, 0, 0.04); }
        .mobile-menu-btn { display: none; }

        /* ── Mobile full-screen drawer ── */
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0; left: 0;
          background: #000;
          z-index: 2000;
          padding: 100px 28px 48px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
        }
        .mobile-drawer.open { transform: translateY(0); }
        .mobile-link {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        /* ── Tablet collapse ── */
        @media (max-width: 768px) {
          .nav-links-desktop { display: none; }
          .right-ctas-desktop { display: none; }
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #080B07;
            color: #B5FF2E;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            min-height: 40px;
            cursor: pointer;
            flex-shrink: 0; /* Never squish the button */
          }
          .nav-top-bar {
            justify-content: space-between;
            gap: 8px;
          }
        }
      `}</style>
      
      <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => setIsMenuOpen(false)} style={{ position: "absolute", top: "30px", right: "30px", background: "none", border: "none", color: "#fff" }}><X size={32} /></button>
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} className="mobile-link" onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
        ))}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
           <Link href="/login" className="btn-primary" style={{ textAlign: "center" }}>Login</Link>
           <Link href="/login?mode=signup" className="btn-ghost" style={{ textAlign: "center", color: "#fff" }}>Registration</Link>
        </div>
      </div>

      <div className="nav-wrapper">
        <nav className="nav-top-bar" style={{ background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.9)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E" }}>maCA</span>
          </Link>

          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link-item">{link.label}</Link>
            ))}
          </div>

          <div className="right-ctas-desktop" style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "24px" }}>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" style={{ fontSize: "14px", padding: "8px 16px", color: "#080B07", fontWeight: 700 }}>Dashboard</Link>
                <Link href="/profile" style={{ 
                  fontSize: "13px", 
                  padding: "10px 24px", 
                  borderRadius: "100px", 
                  background: "#B5FF2E", 
                  color: "#080B07", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px",
                  boxShadow: "0 10px 20px rgba(181,255,46,0.15)",
                  textDecoration: "none"
                }}>
                  Profile Hub →
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: "14px", padding: "8px 16px", color: "#080B07", fontWeight: 700 }}>Login</Link>
                <Link href="/login?mode=signup" style={{ fontSize: "14px", padding: "8px 20px", borderRadius: "100px", background: "#080B07", color: "#B5FF2E", fontWeight: 700 }}>Registration →</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </nav>
      </div>
    </>
  );
}
