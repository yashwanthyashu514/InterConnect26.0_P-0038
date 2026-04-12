"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const agents = [
  { id: "A1", name: "maCA Tax", icon: "📋", desc: "Penalty clocks, ITR guidance & real-time tax advisory.", tag: "CORE", href: "/tax" },
  { id: "A2", name: "BankFight", icon: "🏦", desc: "Escalate banking disputes to RBI & Banking Ombudsman.", tag: "CORE", href: "/bankfight" },
  { id: "A3", name: "Notice Fighter", icon: "📝", desc: "Draft legally sound replies to IT & GST notices.", tag: "CORE", href: "/notice" },
  { id: "A4", name: "PayrollPilot", icon: "💰", desc: "Calculate salaries, PF, ESI, TDS and generate payslips.", tag: "CORE", href: "/payroll" },
  { id: "A5", name: "ComplianceBot", icon: "📅", desc: "Never miss a compliance deadline. Automated filing calendar.", tag: "CORE", href: "/compliance" },
  { id: "A6", name: "Audit Shield", icon: "🔒", desc: "Score your GSTIN audit risk before the taxman does.", tag: "CORE", href: "/audit-shield" },
  { id: "A7", name: "Voice CA", icon: "🎤", desc: "Ask anything. Out loud. In Hindi or English.", tag: "CORE", href: "/voice" },
  { id: "A8", name: "Contract Reviewer", icon: "📄", desc: "AI redlining, risk flags, and plain-English summaries.", tag: "GROWTH", href: "/contract-reviewer" },
  { id: "A9", name: "Court Filer", icon: "⚖️", desc: "Generate court-ready petitions and legal notices.", tag: "GROWTH", href: "/court-filer" },
  { id: "A10", name: "Credit Fixer", icon: "📈", desc: "Dispute CIBIL errors and build a repair roadmap.", tag: "GROWTH", href: "/credit-fixer" },
  { id: "A11", name: "Insurance Fighter", icon: "🛡️", desc: "Fight wrongful claim rejections with IRDAI letters.", tag: "GROWTH", href: "/insurance-fighter" },
  { id: "A12", name: "Labour Law", icon: "👷", desc: "Protect your rights and resolve workplace disputes.", tag: "GROWTH", href: "/labour-law" },
  { id: "A13", name: "NRI Advisor", icon: "🌏", desc: "FEMA, DTAA, and NRE/NRO advisory for Indians abroad.", tag: "GROWTH", href: "/nri" },
  { id: "A14", name: "Pension Pilot", icon: "🏖️", desc: "EPF withdrawals, EPS claims, and retirement planning.", tag: "GROWTH", href: "/pension" },
  { id: "A15", name: "RERA Fighter", icon: "🏘️", desc: "Fight builder delays and real estate violations.", tag: "GROWTH", href: "/rera" },
  { id: "A16", name: "RTI Drafter", icon: "📨", desc: "File RTI applications to any government body.", tag: "GROWTH", href: "/rti" },
  { id: "A17", name: "Startup Legal", icon: "🚀", desc: "Incorporation, ESOP, term sheets for founders.", tag: "ELITE", href: "/startup-legal" },
  { id: "A18", name: "Trade & EXIM", icon: "📦", desc: "HS codes, DGFT compliance, duty drawback.", tag: "ELITE", href: "/trade" },
  { id: "A19", name: "AI Mock Judge", icon: "🤖", desc: "Simulate arbitration. Stress-test your arguments.", tag: "ELITE", href: "/ai-judge", featured: true },
  { id: "A20", name: "Enterprise API", icon: "🏢", desc: "API access and white-label for enterprises.", tag: "ELITE", href: "/b2b" },
  { id: "A21", name: "DPDP Shield", icon: "🛡️", desc: "DPDP Act 2023 Compliance, Gap Analysis & Audit.", tag: "ELITE", href: "/dpdp" },
  { id: "A22", name: "CryptoTax Pro", icon: "🪙", desc: "30% VDA Tax Calculator & Schedule VDA ITR Filing.", tag: "ELITE", href: "/crypto-tax" },
  { id: "A23", name: "ESG Compass", icon: "🍃", desc: "SEBI BRSR Core Auto-fill, GHG Scope & EU CBAM.", tag: "ELITE", href: "/esg-compass" },
  { id: "A24", name: "HeirGuard", icon: "📜", desc: "Will Drafting, Succession Advisory & Assets.", tag: "ELITE", href: "/heirguard" },
];

const marqueeItems = [
  "Tax Advisory", "RBI Escalation", "GST Compliance", "Court Filing",
  "NRI Taxation", "Audit Shield", "Credit Repair", "RERA Disputes",
  "RTI Drafting", "Startup Legal", "Mock Judge AI", "Insurance Disputes",
  "Labour Rights", "EPF Withdrawal", "Trade & EXIM",
];

const tagColors: Record<string, { bg: string; color: string; dot: string }> = {
  CORE: { bg: "rgba(181,255,46,0.1)", color: "#B5FF2E", dot: "#B5FF2E" },
  GROWTH: { bg: "rgba(96,165,250,0.1)", color: "#60A5FA", dot: "#60A5FA" },
  ELITE: { bg: "rgba(192,132,252,0.1)", color: "#C084FC", dot: "#C084FC" },
};

export default function LandingPage() {
  const macaRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState({ cases: 0, agents: 0, saving: 0 });
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filteredAgents = activeFilter === "ALL" 
    ? agents 
    : agents.filter(a => a.tag === activeFilter);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Parallax scroll listener
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animated counter
    const targets = { cases: 12000, agents: 24, saving: 80 };
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        cases: Math.round(targets.cases * ease),
        agents: Math.round(targets.agents * ease),
        saving: Math.round(targets.saving * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // IntersectionObserver for fade-up
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    return () => { 
      clearInterval(timer); 
      observer.disconnect(); 
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        .agent-card-link {
          background: rgba(14,18,13,0.9);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.25s, transform 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .agent-card-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(181,255,46,0.06), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .agent-card-link:hover {
          border-color: rgba(181,255,46,0.3);
          transform: translateY(-3px);
          background: rgba(20,26,18,0.95);
        }
        .agent-card-link:hover::before { opacity: 1; }

        .filter-btn {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          border: 0.5px solid rgba(255,255,255,0.07);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(181, 255, 46, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(181, 255, 46, 0.3);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #B5FF2E;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .pill-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(14,18,13,0.9);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(240,244,232,0.55);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .pill-link:hover {
          border-color: rgba(181,255,46,0.3);
          color: #B5FF2E;
        }
        .pricing-card {
          background: rgba(14,18,13,0.9);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: border-color 0.25s;
        }
        .pricing-card:hover { border-color: rgba(181,255,46,0.3); }
        .pricing-card.featured {
          background: #B5FF2E;
          border-color: #B5FF2E;
        }
        .pricing-card.featured p, .pricing-card.featured h3, .pricing-card.featured span, .pricing-card.featured li {
          color: #080B07 !important;
        }
        .marquee-track {
          display: flex;
          gap: 24px;
          white-space: nowrap;
          animation: marquee-scroll 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .section-divider {
          width: 100%;
          height: 0.5px;
          background: rgba(255,255,255,0.07);
        }
        .stat-number {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(40px, 5vw, 64px);
          letter-spacing: -2px;
          line-height: 1;
          color: #F0F4E8;
        }
        .glow-line {
          width: 60px;
          height: 3px;
          background: #B5FF2E;
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(181,255,46,0.6);
        }
        @keyframes fade-up-anim {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) rotate(45deg); }
          50% { transform: translateX(150%) rotate(45deg); }
          100% { transform: translateX(150%) rotate(45deg); }
        }

        .parallax-target {
          will-change: transform;
          transition: transform 0.1s linear;
        }

        .hero-title-reveal span {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
        }
        .hero-title-reveal span b {
          display: inline-block;
          transform: translateY(110%);
          animation: title-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes title-slide-up {
          to { transform: translateY(0); }
        }

        .hero-entrance {
          animation: entrance-rise 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes entrance-rise {
          from { opacity: 0; transform: translateY(120px); }
          to { opacity: 1; transform: translateY(0); }
        }

        html { scroll-behavior: smooth; }
      `}</style>

      <main style={{ background: "#000000", paddingTop: "68px" }}>

        <div style={{ background: "#F7F8F3" }}>
            <section 
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{ 
                minHeight: "120vh", 
                background: "#000000", 
                textAlign: "center", 
                position: "relative", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "flex-start",
                overflow: "hidden",
                borderBottomLeftRadius: "160px", 
                borderBottomRightRadius: "160px",
                zIndex: 20 
              }}
            >
              {/* Mouse Follow Glow */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(181, 255, 46, 0.04), transparent 80%)`,
                pointerEvents: "none",
                zIndex: 5
              }} />

              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "1000px", height: "600px", background: "none", pointerEvents: "none" }} />
            
            <div style={{ width: "100%", textAlign: "center", paddingTop: "100px", paddingLeft: "5%", paddingRight: "5%", boxSizing: "border-box", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h1 className="hero-title-reveal" style={{ fontFamily: "'Syne', sans-serif", fontSize: "5.5vw", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-3.5px", marginBottom: "32px", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                <span><b style={{ color: "#F5F5DC", whiteSpace: "nowrap" }}>YOUR PERSONAL</b></span>
                <span style={{ color: "#B5FF2E", whiteSpace: "nowrap", textShadow: "none", filter: "none" }}>LEGAL EMPIRE</span>
              </h1>

              <div className="fade-up visible hero-cta-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", paddingLeft: "clamp(2rem, 8vw, 10rem)", paddingRight: "clamp(2rem, 8vw, 10rem)", marginTop: "32px", animationDelay: "0.4s" }}>
                <Link href="/onboarding" className="btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
                  Start Free →
                </Link>
                <Link href="#agents" className="btn-ghost" style={{ fontSize: "16px", padding: "16px 32px" }}>
                  Explore 24 Agents
                </Link>
              </div>
            </div>

            {/* Character contained within Hero - Parallax Scroll Effect */}
            <div className="hero-entrance" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
              <div className="hero-girl parallax-target" style={{ 
                position: "absolute", 
                bottom: "0", 
                left: "50%", 
                transform: `translateX(-50%) translateY(${scrollY * 0.12}px)`, 
                width: "700px", 
                height: "68vh", 
                minHeight: "500px",
                backgroundImage: "url(/assets/hero-character.png)", 
                backgroundSize: "130% auto", 
                backgroundRepeat: "no-repeat", 
                backgroundPosition: "center bottom", 
                backgroundColor: "transparent", 
                mixBlendMode: "screen",
                filter: "contrast(1.25) brightness(0.85) grayscale(0.1)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
              }} />
            </div>

            <style jsx>{`
              @media (max-width: 1024px) {
                h1 { font-size: 8vw !important; }
                .hero-girl { width: 500px !important; }
              }
              @media (max-width: 768px) {
                h1 { font-size: 10vw !important; letter-spacing: -1.5px !important; }
                .hero-girl { width: 320px !important; height: 50vh !important; }
                .hero-cta-group { flex-direction: column; gap: 12px; width: 100%; max-width: 320px; margin: 32px auto 0 !important; align-items: stretch !important; }
                .hero-cta-group a { width: 100%; text-align: center; }
                .section-container { padding: 80px 20px !important; }
                .radius-container { border-radius: 80px !important; }
                .stats-grid { grid-template-columns: 1fr !important; }
                .stat-item { border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .stat-item:last-child { border-bottom: none !important; }
              }
            `}</style>
          </section>
        </div>

        {/* ───────────────────────────────────────────────────────────────
            MARQUEE STRIP
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ background: "#F7F8F3", borderTop: "1px solid rgba(0, 0, 0, 0.03)", padding: "40px 0", overflow: "hidden", position: "relative", zIndex: 15 }}>
          <div ref={macaRef} className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: "#000000", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "24px", opacity: 0.8 }}>
                {item}
                <span style={{ opacity: 0.2 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────
            STATS — Dark section with large numbers
        ─────────────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 32px", background: "#F7F8F3" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", background: "#fff" }}>
              {[
                { value: `${counter.agents}+`, label: "Autonomous AI Agents", sub: "Covering every legal domain" },
                { value: "₹999", label: "Starting Price / Month", sub: "vs ₹5,000/hr traditional" },
                { value: "30s", label: "Average Response Time", sub: "Faster than any CA consultation" },
                { value: "100%", label: "India-First Architecture", sub: "DPDP compliant · Hindi supported" },
              ].map((s, i) => (
                <div key={i} className="fade-up stat-item" style={{ 
                  padding: "40px 32px", 
                  borderRight: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none", 
                  background: i === 1 ? "rgba(181,255,46,0.15)" : "transparent",
                  transition: "transform 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <p className="stat-number" style={{ color: "#080B07", marginBottom: "8px" }}>{s.value}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "#080B07", marginBottom: "4px" }}>{s.label}</p>
                  <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            PROBLEM — White/light background section for contrast
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ background: "#080B07" }}>
          <section style={{ padding: "140px 32px 180px", background: "#F7F8F3", borderBottomLeftRadius: "160px", borderBottomRightRadius: "160px", position: "relative", zIndex: 4 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
              <div className="fade-up">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#080B07", opacity: 0.4, marginBottom: "16px", display: "block" }}>The Problem</span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-2px", lineHeight: 1.05, color: "#080B07", marginBottom: "24px" }}>
                  The system is
                  <br />
                  rigged against
                  <br />
                  <span style={{ color: "#080B07", textDecoration: "line-through", opacity: 0.3 }}>ordinary</span>
                  <span style={{ color: "#080B07" }}> you.</span>
                </h2>
                <p style={{ fontSize: "16px", color: "rgba(8,11,7,0.6)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: "32px" }}>
                  In India, legal and financial expertise costs ₹5,000/hr or more — accessible only to the privileged few. 140 crore people deserve better.
                </p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", background: "#B5FF2E", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⚡</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(8,11,7,0.7)" }}>maCA Empire is the equalizer.</p>
                </div>
              </div>

              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: "💸", title: "Prohibitive Costs", body: "₹5,000/hr fees price out citizens, founders, and MSMEs from quality legal and financial advice." },
                  { icon: "⚖️", title: "Asymmetry of Power", body: "Individuals lose disputes against banks and institutions due to legal illiteracy and lack of expert guidance." },
                  { icon: "🐌", title: "Manual Inefficiency", body: "GST, ITR, payroll compliance — all error-prone manual processes that cost time, money, and peace of mind." },
                ].map((card, i) => (
                  <div key={i} style={{ background: "#fff", border: "0.5px solid rgba(8,11,7,0.1)", borderRadius: "14px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "44px", height: "44px", background: "rgba(181,255,46,0.15)", border: "0.5px solid rgba(181,255,46,0.3)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{card.icon}</div>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#080B07", marginBottom: "6px" }}>{card.title}</h3>
                      <p style={{ fontSize: "13px", color: "rgba(8,11,7,0.6)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{card.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* ───────────────────────────────────────────────────────────────
            SOLUTION — Back to dark with comparison table
        ─────────────────────────────────────────────────────────────── */}
        <section style={{ padding: "140px 32px 120px", background: "var(--bg-primary)", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
              <div className="fade-up">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(240,244,232,0.35)", display: "block", marginBottom: "16px" }}>The Solution</span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-2.5px", lineHeight: 1.05, marginBottom: "24px" }}>
                  Big 4 quality
                  <br />
                  at <span style={{ color: "#B5FF2E" }}>₹999</span>
                  <br />
                  per month.
                </h2>
                <p style={{ fontSize: "16px", color: "rgba(240,244,232,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: "32px" }}>
                  Every agent in maCA Empire is trained to think like a Big 4 Senior Partner — proactive risk analysis, precedent-aware responses, and legally accurate drafts.
                </p>
                <Link href="/onboarding" className="btn-primary" style={{ fontSize: "15px", padding: "13px 28px", display: "inline-flex" }}>
                  Get Started Free →
                </Link>
              </div>

              <div className="fade-up">
                <div style={{ background: "var(--bg-secondary)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ padding: "16px 20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(240,244,232,0.3)", fontFamily: "'DM Sans', sans-serif", background: "rgba(255,255,255,0.02)" }}>
                      Traditional CA
                    </div>
                    <div style={{ padding: "16px 20px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#B5FF2E", fontFamily: "'DM Sans', sans-serif", background: "rgba(181,255,46,0.05)" }}>
                      maCA Empire ✓
                    </div>
                  </div>
                  {[
                    { bad: "₹5,000+ per hour", good: "₹999/month flat" },
                    { bad: "2-5 days response", good: "30 seconds, 24/7" },
                    { bad: "Office appointments", good: "Instant, from your phone" },
                    { bad: "Single CA expertise", good: "24 specialized agents" },
                    { bad: "Paper filing", good: "Digital vault + e-filing" },
                    { bad: "English only", good: "Hindi & English" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < 5 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ padding: "13px 20px", fontSize: "13px", color: "rgba(240,244,232,0.35)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "rgba(255,94,94,0.6)", fontSize: "11px" }}>✗</span> {row.bad}
                      </div>
                      <div style={{ padding: "13px 20px", fontSize: "13px", color: "#F0F4E8", fontFamily: "'DM Sans', sans-serif", background: "rgba(181,255,46,0.02)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#B5FF2E", fontSize: "11px" }}>✓</span> {row.good}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────
            AGENTS GRID — Wrapped in Light background to fix bottom corners
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ background: "#F7F8F3" }}>
          <section id="agents" style={{ padding: "96px 32px 180px", background: "var(--bg-secondary)", borderBottomLeftRadius: "160px", borderBottomRightRadius: "160px", position: "relative", zIndex: 4 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <span className="section-tag fade-up" style={{ marginBottom: "12px" }}>The Platform</span>
                <h2 className="fade-up" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-2px" }}>
                  {filteredAgents.length} agents. Every legal need.
                </h2>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {["ALL", "CORE", "GROWTH", "ELITE"].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => setActiveFilter(filter)}
                    className="filter-btn"
                    style={{ 
                      background: activeFilter === filter ? "#B5FF2E" : "rgba(181,255,46,0.02)", 
                      color: activeFilter === filter ? "#080B07" : "rgba(240,244,232,0.45)", 
                      borderColor: activeFilter === filter ? "#B5FF2E" : "rgba(255,255,255,0.12)"
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="agent-grid">
              <style jsx>{`
                .agent-grid {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 12px;
                }
                @media (max-width: 1024px) {
                  .agent-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                  .agent-grid { grid-template-columns: 1fr; }
                }
              `}</style>
              {filteredAgents.map((agent, i) => {
                const tc = tagColors[agent.tag];
                return (
                  <Link 
                    key={agent.id} 
                    href={agent.href} 
                    className="agent-card-link fade-up" 
                    style={{ 
                      transitionDelay: `${(i % 4) * 0.1}s`,
                      transform: "translateZ(0)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ width: "44px", height: "44px", background: "rgba(181,255,46,0.08)", border: "0.5px solid rgba(181,255,46,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                        {agent.icon}
                      </div>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", fontFamily: "'DM Sans', sans-serif", background: tc.bg, color: tc.color, display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: tc.dot, display: "inline-block" }} />
                        {agent.tag}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "#F0F4E8", marginBottom: "4px" }}>{agent.name}</p>
                      <p style={{ fontSize: "12px", color: "rgba(240,244,232,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55 }}>{agent.desc}</p>
                    </div>
                    <span style={{ fontSize: "12px", color: "#B5FF2E", fontFamily: "'DM Sans', sans-serif" }}>Open Agent →</span>
                  </Link>
                );
              })}
            </div>
          </div>
          </section>
        </div>

        {/* ───────────────────────────────────────────────────────────────
            PRICING — White section again for rhythm
        ─────────────────────────────────────────────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────
            PRICING — Wrapped in Dark background to fix top corners
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ background: "#080B07" }}>
          <section id="pricing" style={{ padding: "96px 32px 140px", background: "#F7F8F3", borderTopLeftRadius: "160px", borderTopRightRadius: "160px", position: "relative", overflow: "hidden", marginTop: "-160px", zIndex: 5 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 10 }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#080B07", opacity: 0.4, display: "block", marginBottom: "12px" }}>PAYMENT SESSION</span>
              <h2 className="fade-up" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-2.5px", color: "#080B07", lineHeight: 1 }}>
                Choose Your Empire Plan
              </h2>
            </div>
            <div className="pricing-grid">
              <style jsx>{`
                .pricing-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 24px;
                  align-items: stretch;
                }
                @media (max-width: 900px) {
                  .pricing-grid {
                    grid-template-columns: 1fr;
                    max-width: 450px;
                    margin: 0 auto;
                  }
                }
              `}</style>
              {[
                {
                  name: "Starter",
                  price: "0",
                  period: "/month",
                  desc: "For individuals exploring AI legal help.",
                  features: ["3 agent queries/day", "Basic ITR guidance", "Notice templates", "Community support"],
                  cta: "Start Free",
                  href: "/onboarding",
                  featured: false,
                },
                {
                  name: "Pro",
                  price: "999",
                  period: "/month",
                  desc: "Full access for serious legal needs.",
                  features: ["Unlimited queries", "All 22 agents", "Document vault 25GB", "Priority AI responses", "Hindi support", "Download drafts as PDF"],
                  cta: "Start Pro →",
                  href: "/onboarding",
                  featured: true,
                  badge: "Most Popular",
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  desc: "API access and white-label for organizations.",
                  features: ["Full REST API access", "White-label deployment", "SLA guarantees", "Dedicated CSM", "DPDP compliance", "Custom integrations"],
                  cta: "Contact Sales →",
                  href: "/b2b",
                  featured: false,
                },
              ].map((plan, i) => (
                <div key={i} 
                  style={{ 
                    background: plan.featured ? "#B5FF2E" : "#ffffff", 
                    borderRadius: "44px", 
                    padding: "48px 40px", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: "relative",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.04)",
                    border: plan.featured ? "none" : "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-16px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 40px 80px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.04)";
                  }}
                >
                  {plan.featured && (
                    <div style={{ background: "#080B07", color: "#B5FF2E", padding: "10px 0", borderRadius: "100px", fontSize: "11px", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginBottom: "32px" }}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", color: "#080B07", marginBottom: "16px" }}>{plan.name}</h3>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "64px", letterSpacing: "-4px", lineHeight: 1, color: "#080B07" }}>{plan.price === "Custom" ? "Custom" : `₹${plan.price}`}</span>
                    <span style={{ fontSize: "15px", color: "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{plan.period}</span>
                  </div>

                  <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.55)", fontFamily: "'DM Sans', sans-serif", marginBottom: "40px", lineHeight: 1.5 }}>{plan.desc}</p>
                  
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "56px", flexGrow: 1 }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: "flex", gap: "10px", fontSize: "15px", color: plan.featured ? "#000" : "rgba(0,0,0,0.7)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        <span style={{ color: plan.featured ? "#000" : "#B5FF2E", fontSize: "16px" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} 
                    className="plan-cta-btn"
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      padding: "18px 24px", 
                      borderRadius: "18px", 
                      background: plan.featured ? "#080B07" : "#B5FF2E", 
                      color: plan.featured ? "#B5FF2E" : "#080B07", 
                      fontFamily: "'Syne', sans-serif", 
                      fontWeight: 800, 
                      fontSize: "16px", 
                      textDecoration: "none",
                      boxShadow: plan.featured ? "0 10px 20px rgba(0,0,0,0.15)" : "none",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

        {/* ───────────────────────────────────────────────────────────────
            CTA BLOCK — Bold dark section, full width
        ─────────────────────────────────────────────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────
            CTA BLOCK — Already dark, but ensure outer background is consistent
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ background: "#F7F8F3" }}>
          <section style={{ padding: "180px 32px 140px", background: "#080B07", borderTopLeftRadius: "160px", borderTopRightRadius: "160px", textAlign: "center", position: "relative", overflow: "hidden", marginTop: "-120px", zIndex: 10 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
          
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div className="hero-badge">
              <span style={{ width: "8px", height: "8px", background: "#B5FF2E", borderRadius: "50%", boxShadow: "0 0 10px #B5FF2E" }} />
              22 AI Agents · India
            </div>
            <h2 className="fade-up" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 68px)", letterSpacing: "-2.5px", lineHeight: 1.05, marginBottom: "24px", color: "#F0F4E8" }}>
              India deserves
              <br />
              <span style={{ color: "#B5FF2E" }}>better legal access.</span>
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(240,244,232,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px" }}>
              Join 12,000+ Indians using maCA Empire to take on banks, file taxes, fight notices, and build businesses with confidence.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/onboarding" className="btn-primary" style={{ fontSize: "16px", padding: "15px 36px" }}>
                Start Free →
              </Link>
              <Link href="/b2b" className="btn-ghost" style={{ fontSize: "16px", padding: "15px 32px" }}>
                B2B & Enterprise
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
