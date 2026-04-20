"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Briefcase, ShieldCheck, Mail, Lock, Phone, CreditCard, Building, Award, Upload, CheckCircle2 } from "lucide-react";

export default function CARegistrationPage() {
  const MARKETPLACE_BACKEND = process.env.NEXT_PUBLIC_MARKETPLACE_URL || "http://localhost:5000";
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    icai_registration_no: "", specialties: [] as string[], bio: "",
    listed_price_inr: 3000, bank_account_number: "", bank_ifsc: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableSpecialties = ["GST", "ITR", "Forensic Audit", "Succession Planning", "FEMA", "RERA", "Crypto Taxation", "Corporate Law"];

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.icai_registration_no) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "ca",
          icai_number: formData.icai_registration_no,
          specialty: formData.specialties[0] || "General"
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.status === "approved") {
           setSuccess(true);
        } else {
           alert("Registration completed but pending admin review (Sandbox API may be off).");
           // Redirect to login or show pending state
           window.location.href = "/login";
        }
      } else {
        alert(data.error || "Verification failed: Invalid credentials");
      }
    } catch (err) {
      alert("Verification server or network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8F3", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: "500px", width: "100%", background: "#fff", borderRadius: "32px", padding: "48px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "80px", height: "80px", background: "rgba(181,255,46,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle2 size={40} color="#B5FF2E" />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", marginBottom: "16px" }}>You are Now Live</h1>
          <p style={{ color: "rgba(0,0,0,0.5)", lineHeight: 1.6, marginBottom: "32px" }}>
            Your professional profile (ICAI: <strong>{formData.icai_registration_no}</strong>) has been verified and listed on the MaCA Elite Panel. You can now receive booking requests and start advisory sessions.
          </p>
          <Link href="/ca-dashboard" className="btn-primary" style={{ display: "inline-block", padding: "16px 32px" }}>Access CA Dashboard →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8F3", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "600px", width: "100%", background: "#fff", borderRadius: "40px", padding: "48px", boxShadow: "0 20px 80px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "36px", letterSpacing: "-1.5px", color: "#B5FF2E" }}>Join the Elite Panel</h2>
            <p style={{ color: "rgba(0,0,0,0.4)", fontSize: "15px", marginTop: "8px" }}>Provide your institutional credentials to begin advisory.</p>
          </div>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Full Professional Name</label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
                  <input type="text" placeholder="CA Rajesh Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "16px 16px 16px 48px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", outline: "none", fontSize: "15px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                 <div className="input-group">
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Email</label>
                    <input type="email" placeholder="rajesh@demo.in" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", outline: "none" }} />
                 </div>
                 <div className="input-group">
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Phone</label>
                    <input type="text" placeholder="+91 98XXX XXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", outline: "none" }} />
                 </div>
              </div>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Secure Password</label>
                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", outline: "none" }} />
              </div>
              <button 
                onClick={() => { if(formData.name && formData.email) setStep(2); }} 
                className="btn-primary" 
                style={{ width: "100%", padding: "18px", marginTop: "12px" }}
              >
                Continue to Profile →
              </button>
              <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(0,0,0,0.4)", marginTop: "12px" }}>
                Already part of the Elite Panel? <Link href="/login" style={{ color: "#000", fontWeight: 700, textDecoration: "none", borderBottom: "1px solid #B5FF2E" }}>Login here</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>ICAI Registration Number (MRN)</label>
                <input type="text" placeholder="ICAI-MRN-0XXXXX" value={formData.icai_registration_no} onChange={(e) => setFormData({...formData, icai_registration_no: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)" }} />
              </div>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Specialties</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {availableSpecialties.map(s => (
                    <button 
                      key={s} 
                      onClick={() => {
                        const next = formData.specialties.includes(s) ? formData.specialties.filter(x => x !== s) : [...formData.specialties, s];
                        setFormData({...formData, specialties: next});
                      }}
                      style={{ 
                        padding: "8px 16px", borderRadius: "100px", border: "1px solid", fontSize: "13px", cursor: "pointer",
                        borderColor: formData.specialties.includes(s) ? "#B5FF2E" : "rgba(0,0,0,0.1)",
                        background: formData.specialties.includes(s) ? "#B5FF2E" : "transparent"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Professional Bio</label>
                <textarea placeholder="Tell us about your years of experience and core advisory domain..." rows={3} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "18px", border: "1.5px solid rgba(0,0,0,0.08)", background: "transparent", borderRadius: "14px", fontWeight: 700 }}>Back</button>
                <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 2, padding: "18px" }}>Final Step →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="input-group">
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(0,0,0,0.5)", marginBottom: "8px", textTransform: "uppercase" }}>Advisory Fee (per booking - INR)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontWeight: 800 }}>₹</span>
                  <input type="number" value={formData.listed_price_inr || ""} onChange={(e) => setFormData({...formData, listed_price_inr: e.target.value === "" ? 0 : parseInt(e.target.value)})} style={{ width: "100%", padding: "16px 16px 16px 32px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)" }} />
                </div>
              </div>
              <div style={{ background: "rgba(181,255,46,0.05)", border: "1px dashed rgba(181,255,46,0.5)", borderRadius: "14px", padding: "20px" }}>
                 <p style={{ fontSize: "11px", fontWeight: 700, color: "#455a11", textTransform: "uppercase", marginBottom: "12px" }}>Bank Settlement Details</p>
                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input type="text" placeholder="Bank Account Number" value={formData.bank_account_number} onChange={(e) => setFormData({...formData, bank_account_number: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.05)" }} />
                    <input type="text" placeholder="IFSC Code" value={formData.bank_ifsc} onChange={(e) => setFormData({...formData, bank_ifsc: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.05)" }} />
                 </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "18px", border: "1.5px solid rgba(0,0,0,0.08)", background: "transparent", borderRadius: "14px", fontWeight: 700 }}>Back</button>
                <button 
                  onClick={handleRegister} 
                  disabled={loading}
                  className="btn-primary" 
                  style={{ flex: 2, padding: "18px" }}
                >
                  {loading ? "Verifying..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
