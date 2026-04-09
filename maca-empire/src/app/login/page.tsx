"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"email" | "otp">("email");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)" }}>

      {/* Left Panel — Brand */}
      <div style={{ flex: "0 0 55%", position: "relative", overflow: "hidden", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", padding: "48px" }}>
        {/* Orb */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "700px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(181,255,46,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(181,255,46,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        {/* Logo */}
        <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
            maCA
          </span>
        </Link>

        {/* Center Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4vw, 56px)", letterSpacing: "-2px", lineHeight: 1.0, marginBottom: "24px" }}>
            India&apos;s most powerful<br />legal AI.
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
            {[
              { icon: "⚡", text: "22 specialized agents. One subscription." },
              { icon: "🔒", text: "DPDP-compliant. Your data never leaves India." },
              { icon: "🇮🇳", text: "Hindi & English. Built from ground up for India." },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>{f.icon}</span>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{f.text}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "14px 20px" }}>
            <div style={{ display: "flex" }}>
              {["👤", "👤", "👤", "👤"].map((a, i) => (
                <div key={i} style={{ width: "28px", height: "28px", background: "var(--bg-tertiary)", border: "0.5px solid var(--border-acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", marginLeft: i > 0 ? "-8px" : "0", zIndex: 4 - i }}>
                  {a}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
              <strong style={{ color: "var(--acid)" }}>12,000+</strong> Indians trust maCA Empire
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", background: "var(--bg-primary)" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "8px" }}>Welcome back</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px" }}>
            Sign in to your maCA Empire account
          </p>

          {/* Tab Toggle */}
          <div style={{ display: "flex", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", padding: "3px", marginBottom: "24px" }}>
            {(["email", "otp"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: tab === t ? 500 : 400, background: tab === t ? "var(--acid)" : "transparent", color: tab === t ? "var(--bg-primary)" : "var(--text-muted)", transition: "all 0.2s" }}
              >
                {t === "email" ? "Email & Password" : "Magic Link / OTP"}
              </button>
            ))}
          </div>

          {/* Google SSO */}
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-primary)", marginBottom: "20px", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-acid)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "0.5px", background: "var(--border-subtle)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>or continue with email</span>
            <div style={{ flex: 1, height: "0.5px", background: "var(--border-subtle)" }} />
          </div>

          {tab === "email" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="email" placeholder="Email address" className="input-dark" />
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="input-dark" style={{ paddingRight: "48px" }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px" }}>
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              <Link href="#" style={{ fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", alignSelf: "flex-end" }}>
                Forgot password?
              </Link>
              <Link href="/dashboard" className="btn-primary" style={{ justifyContent: "center", fontSize: "15px", padding: "13px 28px" }}>
                Sign In →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="email" placeholder="Enter your email for a magic link" className="input-dark" />
              <Link href="/dashboard" className="btn-primary" style={{ justifyContent: "center", fontSize: "15px", padding: "13px 28px" }}>
                Send Magic Link →
              </Link>
            </div>
          )}

          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginTop: "24px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/onboarding" style={{ color: "var(--acid)" }}>Start free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
