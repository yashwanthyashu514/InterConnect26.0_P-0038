"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plug, Fingerprint, Users, BarChart3, ShieldCheck, Headset,
  Mail, Phone, MapPin, CheckCircle2
} from "lucide-react";

const features = [
  { icon: <Plug size={32} color="var(--acid)" />, title: "API Portal Access", desc: "Full REST API access to all 15 agents with 99.9% SLA guarantees and dedicated rate limits." },
  { icon: <Fingerprint size={32} color="var(--acid)" />, title: "White-Label", desc: "Deploy under your brand. Your domain, your identity. Custom styling and branding supported." },
  { icon: <Users size={32} color="var(--acid)" />, title: "Team Accounts", desc: "Multi-user with role-based access control. Unlimited seats with enterprise plan." },
  { icon: <BarChart3 size={32} color="var(--acid)" />, title: "Analytics Dashboard", desc: "Full usage analytics, agent performance metrics, and audit logs for compliance." },
  { icon: <ShieldCheck size={32} color="var(--acid)" />, title: "Data Residency", desc: "On-prem deployment options for sensitive data. DPDP Act fully compliant." },
  { icon: <Headset size={32} color="var(--acid)" />, title: "Dedicated CSM", desc: "Dedicated customer success manager with SLA for enterprise customers." },
];

const clients = [
  "HDFC Bank", "Razorpay", "Nasscom", "Legalzoom IN", "Quicko", "ClearTax"
];

export default function B2BPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", teamSize: "11-50", useCase: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: "var(--bg-primary)", paddingTop: "68px" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .empire-form-container input, 
        .empire-form-container select, 
        .empire-form-container textarea {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          padding: 16px !important;
          border-radius: 12px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          width: 100%;
          transition: all 0.3s ease;
          appearance: none;
        }
        .empire-form-container select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b5ff2e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          padding-right: 48px !important;
        }
        .empire-form-container input:focus, 
        .empire-form-container select:focus, 
        .empire-form-container textarea:focus {
          outline: none;
          border-color: var(--acid) !important;
          background: rgba(181, 255, 46, 0.05) !important;
          box-shadow: 0 0 20px rgba(181, 255, 46, 0.1);
        }
        @media (max-width: 768px) {
          .empire-plate-mobile { border-radius: 40px !important; }
          .hero-gap-mobile { margin-top: 20px !important; }
        }
      `}} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "100px 24px 80px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-3px", lineHeight: 1, marginBottom: "24px" }}>
            maCA Empire for
            <br />
            <span style={{ color: "var(--acid)" }}>Enterprise</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.65 }}>
            Full API access to 15 AI agents. White-label deployment. Enterprise SLAs. Built for legal tech firms, banks, and large corporates.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="#contact" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px", textDecoration: "none" }}>Book a Demo →</Link>
            <Link href="/api-portal" className="btn-ghost" style={{ fontSize: "16px", padding: "14px 32px", textDecoration: "none" }}>View API Docs</Link>
          </div>
        </div>
      </section>

      {/* ── CLIENT LOGOS ── */}
      <section className="empire-plate-mobile hero-gap-mobile" style={{ 
        padding: "80px 24px", 
        background: "#ffffff", 
        borderRadius: "80px", 
        marginTop: "40px", 
        position: "relative", 
        zIndex: 10,
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)"
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#000000", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "32px" }}>Trusted by India&apos;s leading organizations</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            {clients.map((c) => (
              <div key={c} style={{ padding: "14px 28px", background: "#080B07", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.15)", transition: "transform 0.3s ease" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--acid)", letterSpacing: "-0.5px" }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Enterprise Features</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-2px" }}>
              Built for scale. Built for India.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: "28px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ 
        padding: "100px 24px 80px", 
        background: "var(--bg-primary)", 
        borderRadius: "0", 
        marginTop: "0", 
        position: "relative", 
        zIndex: 20 
      }}>
        <div className="container">
          <div className="empire-plate-mobile" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "1px", 
            background: "rgba(0,0,0,0.05)", 
            borderRadius: "32px", 
            overflow: "hidden", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)" 
          }}>
            {[
              { value: "99.9%", label: "API Uptime SLA" },
              { value: "< 2s", label: "Avg Response Time" },
              { value: "15", label: "Specialized Agents" },
              { value: "DPDP", label: "Compliant" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "60px 24px", textAlign: "center", background: "#ffffff" }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 44px)", letterSpacing: "-2px", color: "#080B07", marginBottom: "6px" }}>{s.value}</p>
                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact" style={{ 
        padding: "120px 24px 100px", 
        background: "var(--bg-secondary)", 
        borderRadius: "0", 
        marginTop: "0", 
        position: "relative", 
        zIndex: 30,
        borderBottom: "0.5px solid rgba(181,255,46,0.1)"
      }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
            <div>
              <span className="section-tag" style={{ marginBottom: "16px" }}>Contact Sales</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-2px", marginBottom: "20px" }}>
                Let&apos;s build something together.
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: "32px" }}>
                Our enterprise team will work with you to create a custom deployment plan. Expect a response within 24 business hours.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { icon: <Mail size={18} color="var(--acid)" />, label: "enterprise@macaempire.in" },
                  { icon: <Phone size={18} color="var(--acid)" />, label: "+91 98765 43210" },
                  { icon: <MapPin size={18} color="var(--acid)" />, label: "Bengaluru, Karnataka, India" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {c.icon}
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-acid)", borderRadius: "32px", padding: "60px 40px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                   <CheckCircle2 size={48} color="var(--acid)" />
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "24px", marginBottom: "8px" }}>Request received!</h3>
                <p style={{ fontSize: "15px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Our enterprise team will contact you within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="empire-form-container" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>Company</label>
                    <input placeholder="MaCA Empire" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>Full Name</label>
                    <input placeholder="Arjun Khanna" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>Business Email</label>
                    <input type="email" placeholder="name@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>Team Size</label>
                    <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                      <option value="">Select size...</option>
                      {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>Requirements</label>
                  <textarea placeholder="Describe your use case..." rows={4} value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })} style={{ resize: "none" }} required />
                </div>
                <button type="submit" className="btn-primary" style={{ justifyContent: "center", fontSize: "16px", padding: "18px", border: "none", cursor: "pointer" }}>
                  Submit Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
