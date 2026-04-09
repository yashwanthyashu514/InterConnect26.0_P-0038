"use client";

import React, { useState } from "react";
import Link from "next/link";

const features = [
  { icon: "🔌", title: "API Portal Access", desc: "Full REST API access to all 22 agents with 99.9% SLA guarantees and dedicated rate limits." },
  { icon: "🏷️", title: "White-Label", desc: "Deploy under your brand. Your domain, your identity. Custom styling and branding supported." },
  { icon: "👥", title: "Team Accounts", desc: "Multi-user with role-based access control. Unlimited seats with enterprise plan." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Full usage analytics, agent performance metrics, and audit logs for compliance." },
  { icon: "🔒", title: "Data Residency", desc: "On-prem deployment options for sensitive data. DPDP Act fully compliant." },
  { icon: "🤝", title: "Dedicated CSM", desc: "Dedicated customer success manager with SLA for enterprise customers." },
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

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "100px 24px 80px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <span className="section-tag" style={{ marginBottom: "20px" }}>Enterprise & B2B</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-2.5px", lineHeight: 1.05, marginBottom: "20px" }}>
            maCA Empire for
            <br />
            <span style={{ color: "var(--acid)" }}>Enterprise</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.65 }}>
            Full API access to 22 AI agents. White-label deployment. Enterprise SLAs. Built for legal tech firms, banks, and large corporates.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>Book a Demo →</a>
            <Link href="/api-portal" className="btn-ghost" style={{ fontSize: "16px", padding: "14px 32px" }}>View API Docs</Link>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "20px" }}>
            Starting from <span style={{ color: "var(--acid)" }}>₹25,000/month</span> · Custom contract · Dedicated support
          </p>
        </div>
      </section>

      {/* ── CLIENT LOGOS ── */}
      <section style={{ padding: "40px 24px", borderTop: "0.5px solid var(--border-subtle)", borderBottom: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>Trusted by India&apos;s leading organizations</p>
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            {clients.map((c) => (
              <div key={c} style={{ padding: "10px 20px", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--text-muted)" }}>{c}</span>
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
      <section style={{ padding: "60px 24px", background: "var(--bg-secondary)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", border: "0.5px solid var(--border-acid)", borderRadius: "16px", overflow: "hidden", background: "var(--bg-primary)" }}>
            {[
              { value: "99.9%", label: "API Uptime SLA" },
              { value: "< 2s", label: "Avg Response Time" },
              { value: "22", label: "Specialized Agents" },
              { value: "DPDP", label: "Compliant" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "32px 24px", textAlign: "center", borderRight: i < 3 ? "0.5px solid var(--border-subtle)" : "none" }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "40px", letterSpacing: "-2px", color: "var(--acid)", marginBottom: "6px" }}>{s.value}</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact" style={{ padding: "80px 24px" }}>
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
                  { icon: "📧", label: "enterprise@macaempire.in" },
                  { icon: "📞", label: "+91 98765 43210" },
                  { icon: "🏢", label: "Bengaluru, Karnataka, India" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "20px" }}>{c.icon}</span>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-acid)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "22px", marginBottom: "8px" }}>Request received!</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Our enterprise team will contact you within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input placeholder="Company Name" className="input-dark" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  <input placeholder="Your Name" className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input type="email" placeholder="Email Address" className="input-dark" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input type="tel" placeholder="Phone Number" className="input-dark" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <select className="input-dark" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                  {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
                <textarea placeholder="Describe your use case and requirements..." rows={4} className="input-dark" value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })} style={{ resize: "none" }} required />
                <button type="submit" className="btn-primary" style={{ justifyContent: "center", fontSize: "15px", padding: "14px" }}>
                  Contact Enterprise Sales →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
