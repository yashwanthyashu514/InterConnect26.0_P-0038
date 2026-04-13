"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote } from "lucide-react";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state based on search params
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");

  // Keep state in sync if URL changes
  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [searchParams]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth logic
    if (isSignUp) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", background: "#000000" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", letterSpacing: "-1.5px", marginBottom: "8px", color: "white" }}>
          {isSignUp ? "Create account" : "Welcome back"}
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: "40px" }}>
          {isSignUp ? "Register for your maCA Empire account" : "Sign in to your maCA Empire account"}
        </p>

        {/* Google SSO */}
        <button type="button" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "white", marginBottom: "32px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--acid)"; e.currentTarget.style.background = "rgba(181,255,46,0.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          onClick={handleAuth}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700 }}>Or credentials</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <input type="email" required placeholder="Work email address" className="input-dark" style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", transition: "all 0.3s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--acid)"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} required placeholder="Password" className="input-dark" style={{ width: "100%", padding: "16px", paddingRight: "56px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", transition: "all 0.3s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--acid)"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--acid)", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Banknote className="money-icon" size={24} style={{ opacity: showPassword ? 1 : 0.3 }} />
            </button>
          </div>
          { !isSignUp && (
            <Link href="#" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", alignSelf: "flex-end", textDecoration: "none" }}>
              Recovery options?
            </Link>
          )}
          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "18px", textDecoration: "none", border: "none", cursor: "pointer" }}>
            {isSignUp ? "Authorize & Register →" : "Enter the Empire →"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginTop: "40px" }}>
          {isSignUp ? "Already part of the Empire?" : "New to the Empire?"}{" "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "none", border: "none", color: "var(--acid)", textDecoration: "none", fontWeight: 700, cursor: "pointer", padding: 0 }}>
            {isSignUp ? "Login here" : "Register now"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#000000" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes money-sparkle {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 2px var(--acid)) brightness(1); }
          25% { transform: scale(1.15) translateY(-2px) rotate(5deg); filter: drop-shadow(0 0 15px var(--acid)) brightness(1.3); }
          50% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 4px var(--acid)) brightness(1.1); }
          75% { transform: scale(1.15) translateY(-2px) rotate(-5deg); filter: drop-shadow(0 0 15px var(--acid)) brightness(1.3); }
        }
        .money-icon {
          animation: money-sparkle 2.5s ease-in-out infinite;
        }
        .input-dark:focus + button .money-icon {
          color: var(--acid) !important;
          animation-duration: 0.8s;
          filter: drop-shadow(0 0 20px var(--acid)) brightness(1.5);
        }
        .input-dark::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}} />

      {/* Left Panel — Brand */}
      <div style={{ flex: "0 0 55%", position: "relative", overflow: "hidden", background: "#000000", display: "flex", flexDirection: "column", padding: "64px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "8px 18px", borderRadius: "100px", border: "1.5px solid var(--acid)", position: "relative", zIndex: 1, boxShadow: "0 0 20px rgba(181,255,46,0.1)" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: "#B5FF2E", letterSpacing: "-0.5px" }}>
            maCA
          </span>
        </Link>
 
        {/* Center Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(48px, 6vw, 84px)", letterSpacing: "-4px", lineHeight: 0.85, marginBottom: "24px", color: "white" }}>
            India&apos;s most <br />
            <span style={{ color: "var(--acid)" }}>powerful</span> <br />
            legal AI.
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", maxWidth: "400px" }}>
            15 specialized agents. One subscription. <br />
            Institutional-grade intelligence.
          </p>
        </div>
      </div>
 
      {/* Right Panel — Form wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "var(--acid)" }}>Loading...</span></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
