"use client";

import React, { useState } from "react";
import Link from "next/link";

const steps = [
  {
    step: 1,
    title: "Who are you?",
    options: [
      { icon: "👤", label: "Individual / Salaried", desc: "Personal tax, loans, disputes" },
      { icon: "🏪", label: "MSME / Founder", desc: "GST, compliance, contracts" },
      { icon: "🌏", label: "NRI", desc: "FEMA, DTAA, NRO/NRE advisory" },
      { icon: "🏢", label: "Enterprise / Law Firm", desc: "B2B API and white-label access" },
    ],
  },
  {
    step: 2,
    title: "What's your biggest pain point?",
    options: [
      "Tax & ITR Filing", "GST & Compliance", "Legal Disputes",
      "Contracts & Agreements", "Banking Issues", "Real Estate Problems",
    ],
  },
  { step: 3, title: "Create your account" },
  { step: 4, title: "You're all set!" },
];

const recommendedAgents = [
  { icon: "📋", name: "maCA Tax", href: "/tax" },
  { icon: "🏦", name: "BankFight", href: "/bankfight" },
  { icon: "📝", name: "Notice Fighter", href: "/notice" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedPains, setSelectedPains] = useState<number[]>([]);
  const [agreed, setAgreed] = useState(false);

  const progress = (step / 4) * 100;

  const togglePain = (i: number) => {
    setSelectedPains((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px" }}>

      {/* Logo */}
      <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)", marginBottom: "48px" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
          maCA
        </span>
      </Link>

      {/* Progress */}
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Step {step} of 4</span>
          <span style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step Card */}
      <div style={{ width: "100%", maxWidth: "600px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "20px", padding: "40px" }}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 1</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>
              {steps[0].title}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {(steps[0].options as { icon: string; label: string; desc: string }[]).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRole(i)}
                  style={{ padding: "20px", background: selectedRole === i ? "var(--acid-muted)" : "var(--bg-primary)", border: `0.5px solid ${selectedRole === i ? "var(--border-acid)" : "var(--border-subtle)"}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>{opt.icon}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>{opt.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 2</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>
              {steps[1].title}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {(steps[1].options as string[]).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => togglePain(i)}
                  style={{ padding: "10px 20px", background: selectedPains.includes(i) ? "var(--acid)" : "var(--bg-primary)", border: `0.5px solid ${selectedPains.includes(i) ? "var(--acid)" : "var(--border-subtle)"}`, borderRadius: "100px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: selectedPains.includes(i) ? "var(--bg-primary)" : "var(--text-secondary)", fontWeight: selectedPains.includes(i) ? 500 : 400, transition: "all 0.2s" }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 3</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>
              {steps[2].title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Full Name" className="input-dark" />
              <input type="email" placeholder="Email Address" className="input-dark" />
              <input type="tel" placeholder="Phone Number" className="input-dark" />
              <input type="password" placeholder="Create Password" className="input-dark" />
              <input type="text" placeholder="Referral Code (optional)" className="input-dark" />
              <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: "3px", accentColor: "var(--acid)" }} />
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                  I agree to the <span style={{ color: "var(--acid)" }}>Terms of Service</span> and <span style={{ color: "var(--acid)" }}>Privacy Policy</span>. I understand maCA Empire is an AI tool and not a substitute for professional legal advice.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: "var(--acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px" }}>✓</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "12px" }}>You&apos;re all set!</h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "32px" }}>
              Based on your needs, here are your recommended agents:
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
              {recommendedAgents.map((a, i) => (
                <Link key={i} href={a.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "20px", background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "12px", textDecoration: "none", minWidth: "100px" }}>
                  <span style={{ fontSize: "28px" }}>{a.icon}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{a.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/dashboard" className="btn-primary" style={{ justifyContent: "center", fontSize: "15px", padding: "14px 40px" }}>
              Go to Dashboard →
            </Link>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className="btn-ghost"
              style={{ display: step === 1 ? "none" : "flex" }}
            >
              ← Back
            </button>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
              disabled={step === 3 && !agreed}
              style={{ opacity: step === 3 && !agreed ? 0.5 : 1 }}
            >
              {step === 3 ? "Create Account →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
