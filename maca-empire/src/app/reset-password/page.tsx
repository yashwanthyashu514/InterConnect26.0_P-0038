"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-acid)", borderRadius: "24px", padding: "48px" }}>
          <div style={{ width: "64px", height: "64px", background: "var(--acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle2 color="#000" size={32} />
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", color: "white", marginBottom: "12px" }}>Password Updated</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "32px" }}>Your security credentials have been updated successfully.</p>
          <button onClick={() => window.location.href = "/login"} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "40px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", color: "var(--acid)", marginBottom: "8px" }}>Secure Reset</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "32px" }}>Enter your new institutional-grade password below.</p>

        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && <div style={{ color: "#ff4d4d", fontSize: "13px", padding: "12px", background: "rgba(255,77,77,0.05)", borderRadius: "10px", border: "1px solid rgba(255,77,77,0.2)" }}>{error}</div>}
          
          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} size={18} />
            <input 
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Secure Password" 
              required
              className="input-dark" 
              style={{ width: "100%", paddingLeft: "48px" }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--acid)", cursor: "pointer" }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
            {loading ? <Loader2 className="animate-spin" /> : "Update Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}
