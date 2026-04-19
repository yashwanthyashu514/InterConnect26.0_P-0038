"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const email = emailInput?.value;
    
    if (!email) {
      setError("Please enter your email to receive a recovery link.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setMessage("Neural recovery link dispatched to your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send recovery link");
    } finally {
      setLoading(false);
    }
  };

  const sendMagicCode = async () => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const email = emailInput?.value;

    if (!email) {
      setError("Enter email to receive secure magic entry code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      setMessage("Digital Key dispatched. Check your inbox for the access link!");
    } catch (err: any) {
      setError(err.message || "Magic Link failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem("email") as HTMLInputElement).value;
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;

      if (isSignUp) {
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        // Step 1: Redirect to onboarding with both email and password context
        // We'll pass them securely or handle them via the session
        router.push(`/onboarding?email=${encodeURIComponent(email)}&p=${encodeURIComponent(password)}&mode=signup`);
        return;
      }

      // Standard Login via Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch user role from our marketplace_users table
      const { data: userData } = await supabase
        .from("marketplace_users")
        .select("role")
        .eq("email", email)
        .single();

      const role = userData?.role || "user";
      localStorage.setItem("maca_session", "active");

      if (role === "admin") router.push("/admin");
      else if (role === "ca") router.push("/ca-dashboard");
      else if (role === "developer") router.push("/developers");
      else router.push("/dashboard");

    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setLoading(false);
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
          onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700 }}>Or credentials</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && <div style={{ color: "#ff4d4d", fontSize: "14px", background: "rgba(255,77,77,0.1)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,77,77,0.2)" }}>{error}</div>}
          {message && <div style={{ color: "var(--acid)", fontSize: "14px", background: "rgba(181,255,46,0.1)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-acid)" }}>{message}</div>}
          <div>
            <input type="email" name="email" required placeholder="Work email address" className="input-dark" style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", transition: "all 0.3s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--acid)"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} name="password" required placeholder={isSignUp ? "Set your password" : "Password"} className="input-dark" style={{ width: "100%", padding: "16px", paddingRight: "56px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", transition: "all 0.3s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--acid)"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--acid)", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Banknote className="money-icon" size={24} style={{ opacity: showPassword ? 1 : 0.3 }} />
            </button>
          </div>
          { !isSignUp && (
            <button 
              type="button"
              onClick={handleForgotPassword}
              style={{ background: "none", border: "none", fontSize: "13px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", alignSelf: "flex-end", textDecoration: "none", cursor: "pointer", fontWeight: 700 }}>
              Dispatch Recovery OTP?
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "18px", textDecoration: "none", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Authorizing..." : (isSignUp ? "Authorize & Register →" : "Enter the Empire →")}
          </button>

          {!isSignUp && (
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>Forgot password or joined without one?</p>
              <button 
                type="button"
                onClick={sendMagicCode}
                style={{ width: "100%", padding: "14px", background: "rgba(181,255,46,0.05)", border: "1px dashed var(--acid)", borderRadius: "12px", color: "var(--acid)", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(181,255,46,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(181,255,46,0.05)"}
              >
                Send Secure Magic Link
              </button>
            </div>
          )}
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
