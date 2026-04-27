"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Store, Globe, Building2, FileText, Landmark, Scale, Check, AlertTriangle, Eye, EyeOff, Code2, Zap, Home, Mail, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const steps = [
  {
    step: 1,
    title: "Who are you?",
    options: [
      { icon: <User size={28} />, label: "Individual / Salaried", desc: "Personal tax, loans, disputes" },
      { icon: <Store size={28} />, label: "MSME / Founder", desc: "GST, compliance, contracts" },
      { icon: <Globe size={28} />, label: "NRI", desc: "FEMA, DTAA, NRO/NRE advisory" },
      { icon: <Building2 size={28} />, label: "Enterprise / Law Firm", desc: "B2B API and white-label access" },
      { icon: <Code2 size={28} />, label: "Developer", desc: "API Keys, webhooks & endpoints" },
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
  { step: 3, title: "Profile & Compliance" },
  { step: 4, title: "You're all set!" },
];

const recommendedAgents = [
  { icon: <FileText size={28} />, name: "Supreme Tax", href: "/tax" },
  { icon: <Landmark size={28} />, name: "Banking & Credit", href: "/bankfight" },
  { icon: <AlertTriangle size={28} />, name: "Notice & Disputes", href: "/notice" },
];

const TERMS_CONTENT = `
1. INSTITUTIONAL ACCEPTANCE
By accessing maCA Empire, you enter into a binding agreement with the Empire's digital ecosystem. These terms govern your use of 15 proprietary AI agents designed for high-fidelity legal and financial orchestration.

2. AI ORCHESTRATION & RESPONSIBILITY
maCA Empire utilizes advanced Generative AI and RAG (Retrieval-Augmented Generation) technology. While our agents are trained on Indian case law, statutory filings, and Big 4 methodologies, the outputs are for informational and intelligence-gathering purposes only. The platform is an autonomous assistant, not a licensed professional.

3. NO LEGAL/FINANCIAL PRACTICE
Users acknowledge that maCA Empire is not a registered Law Firm or Chartered Accountancy practice. Our 'Voice CA' and 'Supreme Tax' agents provide intelligence intended to augment user decision-making. All critical filings must be reviewed by an authorized human professional.

4. SUBSCRIPTION & BILLING PROTOCOLS
Subscriptions are billed as recurring monthly payments. Access to 'The Oracle' live feeds and institutional vaults is contingent upon active standing. We reserve the right to terminate access for misuse or attempted reverse-engineering of agent system prompts.

5. INTELLECTUAL PROPERTY
The unique logic, architecture, and prompt-engineering of the 15 agents, along with the 'Empire Monolith' UI design, reside exclusively with maCA Empire. Unauthorized copying or redistribution is strictly prohibited.

6. LIMITATION OF LIABILITY
The Empire shall not be liable for indirect, incidental, or consequential damages resulting from AI-generated projections or autonomous drafting.
`;

const PRIVACY_CONTENT = `
1. DPDP COMPLIANCE & DATA SOVEREIGNTY
maCA Empire is built on India-first principles. We strictly adhere to the Digital Personal Data Protection (DPDP) Act. All user-uploaded documents are stored in encrypted clusters within authorized Indian data centers.

2. SECURE RAG PIPELINES
Your private data is processed through isolated RAG (Retrieval-Augmented Generation) pipelines. Crucially, your confidential financial or legal data is NEVER shared with foundational model providers for training purposes. Your intelligence remains private.

3. INFORMATION ARCHITECTURE
We collect: 
- Professional credentials (Work email, phone) 
- Business context for agent tuning 
- Vault documents for specialized RAG analysis
This data is used solely to enhance the fidelity of your 15 autonomous agents.

4. THE ZERO-TRAIN GUARANTEE
We guarantee that your proprietary business logic and private contracts uploaded to the Empire Vault will not be utilized to power or train the intelligence models of other users.

5. RETENTION & DELETION
Users have the 'Right to be Forgotten.' Upon deletion of an Empire account, all associated data is purged from our primary and secondary clusters within 30 days.
`;

function OnboardingComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialEmail = searchParams.get("email") || "";
  const initialPass = searchParams.get("p") || "";

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedPains, setSelectedPains] = useState<number[]>([]);
  
  const [regData, setRegData] = useState({
    name: "",
    email: initialEmail,
    password: initialPass,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  
  const [showModal, setShowModal] = useState<"terms" | "privacy" | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingUserInfo, setCheckingUserInfo] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const { user: session } = await res.json();
          if (session) {
            setIsLoggedIn(true);
            setRegData(prev => ({ ...prev, email: session.email || prev.email }));
            
            // If user already exists in the marketplace database, skip onboarding
            const { data: userData } = await supabase
              .from("marketplace_users")
              .select("id")
              .eq("id", session.user_id)
              .maybeSingle();
            
            if (userData) {
              router.push("/");
              return;
            }
          }
        }
      } catch (err) {
        console.error("Onboarding auth sync error:", err);
      } finally {
        setCheckingUserInfo(false);
      }
    };
    checkUser();
  }, [router]);

  const progress = (step / 4) * 100;

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      setScrolledToBottom(true);
    }
  };

  const handleFinish = async () => {
    if (!isComplianceComplete) return;
    
    setLoading(true);
    setError("");

    try {
      let submitEmail = regData.email;
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        const { user: session } = await authRes.json();
        if (session?.email) {
          submitEmail = session.email;
        }
      }

      if (!submitEmail) {
        setError("Identity not found. Please ensure you have entered an email or are logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regData,
          email: submitEmail,
          password: regData.password || "EMPIRE_SESSION_UPGRADE",
          role: selectedRole === 4 ? "developer" : "user"
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStep(4);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLegal = () => {
    if (showModal === "terms") {
      setHasReadTerms(true);
      setShowModal("privacy");
      setScrolledToBottom(false);
      const scrollEl = document.getElementById("legal-scroll-area");
      if (scrollEl) scrollEl.scrollTop = 0;
    } else {
      setHasReadPrivacy(true);
      setShowModal(null);
      setScrolledToBottom(false);
    }
  };

  const togglePain = (i: number) => {
    setSelectedPains((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const isComplianceComplete = hasReadTerms && hasReadPrivacy;

  if (checkingUserInfo) {
    return (
      <div style={{ minHeight: '100vh', background: '#080B07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#B5FF2E', fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 800 }}>ANALYZING EMPIRE CREDENTIALS...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px" }}>
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--bg-secondary)", width: "100%", maxWidth: "550px", borderRadius: "28px", border: "1px solid var(--border-acid)", display: "flex", flexDirection: "column", maxHeight: "85vh", boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}>
            <div style={{ padding: "28px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--acid)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>
                  Institutional Review — {showModal === "terms" ? "Phase 1/2" : "Phase 2/2"}
                </span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", color: "white", marginTop: "4px" }}>
                  {showModal === "terms" ? "Terms of Service" : "Privacy Policy"}
                </h3>
              </div>
            </div>
            <div id="legal-scroll-area" onScroll={handleModalScroll} style={{ padding: "28px", overflowY: "auto", fontSize: "15px", lineHeight: "1.8", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
              <div style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {showModal === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT}
                <div style={{ marginTop: "60px", padding: "32px", background: "rgba(181,255,46,0.05)", borderRadius: "16px", border: "1.5px dashed rgba(181,255,46,0.2)", textAlign: "center" }}>
                   <p style={{ color: "var(--acid)", fontWeight: 800, letterSpacing: "1px" }}>[ VALIDATED END OF {showModal?.toUpperCase()} ]</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "28px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "16px", background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => { setShowModal(null); setScrolledToBottom(false); }} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Exit Review</button>
              <button onClick={proceedWithLegal} disabled={!scrolledToBottom} className="btn-primary" style={{ flex: 2, justifyContent: "center", opacity: scrolledToBottom ? 1 : 0.3, cursor: scrolledToBottom ? "pointer" : "not-allowed" }}>
                {scrolledToBottom ? (showModal === "terms" ? "Continue to Privacy Policy →" : "Authorize & Complete Review →") : "Scroll to Validate Document"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)", marginBottom: "48px" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>maCA</span>
      </Link>
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Step {step} of 4</span>
          <span style={{ fontSize: "12px", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif" }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "600px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "20px", padding: "40px" }}>
        {step === 1 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 1</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>{steps[0].title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {(steps[0].options as any[]).map((opt, i) => (
                <button key={i} onClick={() => setSelectedRole(i)} style={{ padding: "20px", background: selectedRole === i ? "var(--acid-muted)" : "var(--bg-primary)", border: `0.5px solid ${selectedRole === i ? "var(--border-acid)" : "var(--border-subtle)"}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <div style={{ color: "var(--acid)", marginBottom: "10px" }}>{opt.icon}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>{opt.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 2</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>{steps[1].title}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {(steps[1].options as string[]).map((opt, i) => (
                <button key={i} onClick={() => togglePain(i)} style={{ padding: "10px 20px", background: selectedPains.includes(i) ? "var(--acid)" : "var(--bg-primary)", border: `0.5px solid ${selectedPains.includes(i) ? "var(--acid)" : "var(--border-subtle)"}`, borderRadius: "100px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: selectedPains.includes(i) ? "var(--bg-primary)" : "var(--text-secondary)", fontWeight: selectedPains.includes(i) ? 500 : 400, transition: "all 0.2s" }}>{opt}</button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <span className="section-tag" style={{ marginBottom: "16px" }}>Step 3</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "28px" }}>{steps[2].title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {error && <div style={{ color: "#ff4d4d", fontSize: "13px", padding: "10px", background: "rgba(255,77,77,0.05)", borderRadius: "8px" }}>{error}</div>}
              <input type="text" placeholder="Full Legal Name" className="input-dark" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} />
              <div style={{ padding: "16px", background: "rgba(181,255,46,0.05)", border: "1px solid rgba(181,255,46,0.2)", borderRadius: "12px", marginBottom: "8px" }}>
                <p style={{ fontSize: "11px", color: "var(--acid)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Identity Authenticated</p>
                <p style={{ fontSize: "15px", color: "white", fontWeight: 600 }}>{regData.email || "Empire Member"}</p>
              </div>
              <input type="text" placeholder="Referral Code (optional)" className="input-dark" />
              <div style={{ marginTop: "24px", padding: "20px", background: isComplianceComplete ? "rgba(181,255,46,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${isComplianceComplete ? "var(--border-acid)" : "rgba(255,255,255,0.08)"}`, borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "white", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Step 3: Legal Compliance</span>
                  {isComplianceComplete && <Check size={18} color="var(--acid)" />}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button onClick={() => setShowModal("terms")} style={{ padding: "12px", borderRadius: "10px", background: hasReadTerms ? "rgba(181,255,46,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${hasReadTerms ? "var(--acid)" : "rgba(255,255,255,0.1)"}`, color: hasReadTerms ? "white" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Terms of Service {hasReadTerms && "✓"}</button>
                  <button onClick={() => setShowModal("privacy")} style={{ padding: "12px", borderRadius: "10px", background: hasReadPrivacy ? "rgba(181,255,46,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${hasReadPrivacy ? "var(--acid)" : "rgba(255,255,255,0.1)"}`, color: hasReadPrivacy ? "white" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Privacy Policy {hasReadPrivacy && "✓"}</button>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "16px", lineHeight: "1.6" }}>Institutional scale requires active authorization. Please scroll through both documents to activate your Empire account credentials.</p>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: "var(--acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Check size={40} color="#080B07" /></div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", letterSpacing: "-1px", marginBottom: "12px" }}>You&apos;re all set!</h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "32px" }}>Based on your needs, here are your recommended agents:</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
              {recommendedAgents.map((a, i) => (
                <Link key={i} href={a.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "20px", background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "12px", textDecoration: "none", minWidth: "120px" }}>
                  <span style={{ color: "var(--acid)" }}>{a.icon}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{a.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/" className="btn-primary" style={{ justifyContent: "center", fontSize: "15px", padding: "14px 40px" }}>Enter the Empire Home →</Link>
          </div>
        )}
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button onClick={() => setStep(Math.max(1, step - 1))} className="btn-ghost" style={{ display: step === 1 ? "none" : "flex" }}>← Back</button>
            <div style={{ flex: 1 }} />
            <button onClick={() => { if (step === 1 && selectedRole === 4) { window.location.href = "/developers"; return; } if (step === 3) { handleFinish(); } else { setStep(step + 1); } }} className="btn-primary" disabled={(step === 3 && !isComplianceComplete) || loading} style={{ opacity: (step === 3 && !isComplianceComplete) || loading ? 0.3 : 1, cursor: (step === 3 && !isComplianceComplete) || loading ? "not-allowed" : "pointer" }}>{loading ? "Verifying..." : (step === 3 ? "Complete Profile & Enter Empire →" : "Continue →")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080B07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#B5FF2E', fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 800 }}>INITIALIZING EMPIRE PROTOCOLS...</p>
      </div>
    }>
      <OnboardingComponent />
    </Suspense>
  );
}
