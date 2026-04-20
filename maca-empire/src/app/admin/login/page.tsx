"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@internal.system", password }), // Email is ignored by the new master key logic
    });
    const data = await res.json();
    if (res.ok && data?.user?.role === "admin") {
      router.push("/admin");
    } else {
      setError("Invalid Secure Access Key.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(181,255,46,0.08)", border: "0.5px solid rgba(181,255,46,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Shield size={24} color="#B5FF2E" />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", color: "#fff", letterSpacing: "-0.5px", marginBottom: "8px" }}>
            Imperio Neural
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Internal Command Centre · CEO Access</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Secure Access Key"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "14px 48px 14px 16px", color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShow(!show)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.1)", border: "0.5px solid rgba(255,80,80,0.3)", borderRadius: "8px", fontSize: "12px", color: "#FF5050", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={!password || loading}
            style={{ width: "100%", padding: "14px", background: password && !loading ? "#B5FF2E" : "rgba(181,255,46,0.2)", color: password && !loading ? "#000" : "rgba(181,255,46,0.4)", border: "none", borderRadius: "12px", fontWeight: 800, fontSize: "14px", cursor: password ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Verifying Protocol..." : "Access Command Centre"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "32px" }}>
          This panel is not visible to platform users.
        </p>
      </div>
    </div>
  );
}
