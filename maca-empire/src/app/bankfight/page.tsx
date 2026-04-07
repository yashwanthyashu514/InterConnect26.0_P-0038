"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { saveToVault } from "@/lib/vault";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const NODAL_DB: Record<string, { officer: string; address: string; email: string }> = {
  "SBI": { officer: "Nodal Officer, SBI", address: "State Bank Bhavan, Madame Cama Road, Mumbai - 400021", email: "nodal.officer@sbi.co.in" },
  "HDFC": { officer: "Principal Nodal Officer, HDFC Bank", address: "HDFC Bank Ltd, Ramon House, H.T. Parekh Marg, Mumbai - 400020", email: "pno@hdfcbank.com" },
  "ICICI": { officer: "Principal Nodal Officer, ICICI Bank", address: "ICICI Bank Towers, Bandra-Kurla Complex, Mumbai - 400051", email: "pno@icicibank.com" },
  "AXIS": { officer: "Nodal Officer, Axis Bank", address: "Axis House, C-2, Wadia International Centre, Mumbai - 400025", email: "nodal.officer@axisbank.com" },
  "BOB": { officer: "Nodal Officer, Bank of Baroda", address: "Baroda Corporate Centre, C-26 G Block, BKC, Mumbai - 400051", email: "nodal.officer@bankofbaroda.com" },
  "PNB": { officer: "Principal Nodal Officer, PNB", address: "PNB House, 7 Bhikhaiji Cama Place, New Delhi - 110066", email: "pno@pnb.co.in" },
  "KOTAK": { officer: "Nodal Officer, Kotak Mahindra Bank", address: "27 BKC, C 27, G Block, BKC, Mumbai - 400051", email: "nodal.officer@kotak.com" },
  "INDUSIND": { officer: "Nodal Officer, IndusInd Bank", address: "IndusInd Bank Ltd., 2401 Gen. Thimmayya Road, Pune - 411001", email: "nodal.officer@indusind.com" },
  "CANARA": { officer: "Nodal Officer, Canara Bank", address: "CS Wing, HO Building, 112 JC Road, Bengaluru - 560002", email: "nodalofficer@canarabank.com" },
  "UNION": { officer: "Nodal Officer, Union Bank of India", address: "Union Bank Bhavan, 239 Vidhan Bhavan Marg, Mumbai - 400021", email: "pno@unionbankofindia.bank" },
  "IDFC": { officer: "Nodal Officer, IDFC FIRST Bank", address: "KRM Tower, 7th Floor, Harrington Road, Chetpet, Chennai - 600031", email: "pno@idfcfirstbank.com" },
  "YES": { officer: "Nodal Officer, Yes Bank", address: "IFC, Tower 2, Senapati Bapat Marg, Mumbai - 400013", email: "nodal.officer@yesbank.in" },
  "FEDERAL": { officer: "Nodal Officer, Federal Bank", address: "Federal Towers, Aluva, Kerala - 683101", email: "nodalofficer@federalbank.co.in" },
  "IDBI": { officer: "Nodal Officer, IDBI Bank", address: "IDBI Tower, WTC Complex, Cuffe Parade, Mumbai - 400005", email: "pno@idbi.co.in" },
  "CENTRAL": { officer: "Nodal Officer, Central Bank of India", address: "Chander Mukhi, Nariman Point, Mumbai - 400021", email: "complaints@centralbank.co.in" },
  "IOB": { officer: "Nodal Officer, Indian Overseas Bank", address: "Central Office, 763 Anna Salai, Chennai - 600002", email: "pno@iob.in" },
  "BOI": { officer: "Nodal Officer, Bank of India", address: "Star House, C-5, G Block, BKC, Mumbai - 400051", email: "headoffice.complaints@bankofindia.co.in" },
  "SIDBI": { officer: "Nodal Officer, SIDBI", address: "Swavalamban Bhavan, C-11, G Block, BKC, Mumbai - 400051", email: "nodal.officer@sidbi.in" },
  "RBL": { officer: "Nodal Officer, RBL Bank", address: "One Indiabulls Centre, Tower 2B, Mumbai - 400013", email: "principalnodalofficer@rblbank.com" },
  "BANDHAN": { officer: "Nodal Officer, Bandhan Bank", address: "Adventz Infinity @ 5, BN-5, Salt Lake, Kolkata - 700091", email: "pno@bandhanbank.com" },
  "HSBC": { officer: "Nodal Officer, HSBC India", address: "52/60, M.G. Road, Fort, Mumbai - 400001", email: "nodalofficer@hsbc.co.in" },
  "STANC": { officer: "Nodal Officer, Standard Chartered", address: "19, Rajaji Salai, Chennai - 600001", email: "nodal.officer@sc.com" },
  "DBS": { officer: "Nodal Officer, DBS Bank India", address: "Capital Tower, 1st Floor, BKC, Mumbai - 400051", email: "india_nodalofficer@dbs.com" },
};

const COMPLAINT_TYPES = [
  "Account frozen / blocked without notice",
  "Wrong / unauthorized debit",
  "Loan sanction unreasonably denied",
  "Excessive / undisclosed charges",
  "Cheque / NEFT / RTGS failure",
  "Credit card dispute (Unauthorized)",
  "KYC harassment / Update delay",
  "FD / RD premature closure refused",
  "Non-receipt of interest",
  "Delay in pension disbursement",
  "Harassment by recovery agents",
  "Failed ATM withdrawal (Money deducted)",
  "Unauthorized insurance cross-selling",
  "Delay in closing bank account",
  "Non-adherence to restructuring guidelines",
  "Issue with Forex / Remittance",
  "Mobile Banking / Net Banking failure",
  "Incorrect CIBIL / Credit reporting",
  "Locker access / Fee dispute",
  "Mis-selling of investment products",
];

const LANGUAGES = [
  "English", "Hindi (हिन्दी)", "Marathi (मराठी)", "Bengali (বাংলা)", "Telugu (తెలుగు)",
  "Tamil (தமிழ்)", "Gujarati (ગુજરાતી)", "Kannada (ಕನ್ನಡ)", "Malayalam (മലയാളം)",
  "Punjabi (ਪੰਜਾਬੀ)", "Odia (ଓਡ਼ੀଆ)"
];

interface Citation {
  source: string;
  url: string;
  excerpt: string;
}

export default function BankFightPage() {
  const [step, setStep] = useState(1);
  const [bank, setBank] = useState("SBI");
  const [complaintType, setComplaintType] = useState(COMPLAINT_TYPES[0]);
  const [language, setLanguage] = useState("English");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [letter, setLetter] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);
  const [rbiDays, setRbiDays] = useState(30);

  useEffect(() => {
    if (letter) {
      const interval = setInterval(() => setRbiDays(d => d > 0 ? d - 1 : 0), 86400000);
      return () => clearInterval(interval);
    }
  }, [letter]);

  const generateLetter = async () => {
    setLoading(true);
    const nodal = NODAL_DB[bank] || NODAL_DB["SBI"];
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: `Draft a formal complaint letter to ${bank} Nodal Officer for: ${complaintType}. Customer: ${name}, Account: ${account}. Details: ${details}. Include citation of RB-IOS 2026. Respond strictly in ${language}.`,
          agent_id: "A2",
          language: language
        }),
      });
      const data = await res.json();
      if (data.answer && data.answer.length > 100) {
        setLetter(data.answer);
        setCitations(data.citations || []);
        setLoading(false);
        setStep(3);
        
        saveToVault({
          agent_id: "A2",
          doc_type: `Bank Complaint: ${complaintType}`,
          content: data.answer
        });
        
        return;
      }
    } catch { /* fall through to template */ }

    // Template fallback
    const template = `Date: ${today}
To,
${nodal.officer}
${nodal.address}

Subject: Formal Complaint — ${complaintType}

Respected Sir/Madam,

I, ${name || "[Your Name]"}, Account No. ${account || "[Account Number]"}, wish to register a formal complaint regarding: ${complaintType}.

${details || "[Details of issue]"}

As per the Reserve Bank — Integrated Ombudsman Scheme (RB-IOS) 2026, I request resolution within 30 days from receipt of this letter, failing which I reserve the right to escalate this matter to the RBI Ombudsman.

Thanking you,
${name || "[Your Name]"}
A/C: ${account || "[Account Number]"}
Language: ${language}`;

    setLetter(template);
    setLoading(false);
    setStep(3);
    saveToVault({
      agent_id: "A2",
      doc_type: `Bank Complaint: ${complaintType} (Template)`,
      content: template
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", marginTop: "2rem" }}>
        <div>
          {step === 1 && (
            <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--foreground)" }}>Step 1 — Grievance Intake</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>FULL NAME</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Kumar" style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>A/C OR LOAN NO.</label>
                  <input value={account} onChange={e => setAccount(e.target.value)} placeholder="1234567890" style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>SELECT BANK</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
                    {Object.keys(NODAL_DB).sort().map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>LETTER LANGUAGE</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>COMPLAINT TYPE</label>
                <select value={complaintType} onChange={e => setComplaintType(e.target.value)} style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
                  {COMPLAINT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>PROBLEM DETAILS</label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4} placeholder="Describe exactly what happened..." style={{ width: "100%", marginTop: "0.4rem", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", resize: "vertical" }} />
              </div>

              <button onClick={() => setStep(2)} style={{ padding: "1.2rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "900", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 15px rgba(20,184,166,0.3)" }}>
                REVIEW TARGET OFFICER →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "var(--secondary)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--foreground)" }}>Step 2 — Destination Verified</h2>
              <div style={{ background: "rgba(20,184,166,0.05)", border: "1.5px solid var(--primary)", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--primary)", textTransform: "uppercase" }}>📍 {NODAL_DB[bank]?.officer}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: "1.4" }}>{NODAL_DB[bank]?.address}</p>
                <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary)" }}>📧 {NODAL_DB[bank]?.email}</p>
              </div>
              <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "var(--background)", border: "1px solid var(--border)", fontSize: "0.8rem" }}>
                <strong>Issue:</strong> {complaintType}<br/>
                <strong>Language:</strong> {language}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "1rem", background: "transparent", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: "0.75rem", fontWeight: "700", cursor: "pointer" }}>← BACK</button>
                <button onClick={generateLetter} disabled={loading} style={{ flex: 2, padding: "1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "900", cursor: "pointer" }}>
                  {loading ? "GENIUS AI DRAFTING..." : "⚔️ GENERATE LEGAL NOTICE"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "white", color: "#0f172a", padding: "3rem", borderRadius: "1rem", boxShadow: "0 25px 60px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }}>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.9rem", lineHeight: "1.9", color: "#1e293b" }}>{letter}</pre>
                
                {citations.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                    {citations.map((c, ci) => (
                      <a 
                        key={ci} 
                        href={c.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: "0.65rem", textDecoration: "none", color: "var(--primary)", 
                          background: "var(--primary-glow)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem",
                          border: "1px solid hsla(174, 88%, 45%, 0.2)", display: "flex", alignItems: "center", gap: "0.4rem"
                        }}
                        title={c.excerpt}
                      >
                        ⚖️ {c.source} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <button onClick={() => { setStep(1); setLetter(""); }} style={{ flex: 1, padding: "1rem", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: "0.75rem", fontWeight: "700", cursor: "pointer" }}>NEW CASE</button>
                <button onClick={() => { const blob = new Blob([letter], {type: "text/plain"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `BankFight_${bank}_Complaint.txt`; a.click(); }} style={{ flex: 2, padding: "1rem", background: "#059669", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "900", cursor: "pointer" }}>📥 DOWNLOAD DOCUMENT</button>
                <Link href="/vault" style={{ flex: "1 1 100%", textAlign: "center", padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "0.75rem", fontWeight: "900", textDecoration: "none" }}>💾 GO TO DOCUMENT VAULT (P5) →</Link>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--primary)" }}></div>
            <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>⏱️ RBI 30-DAY CLOCK</h3>
            <div style={{ fontSize: "2.8rem", fontWeight: "900", color: letter ? (rbiDays < 10 ? "#ef4444" : "var(--primary)") : "var(--muted)", textAlign: "center", transition: "color 0.3s" }}>
              {letter ? `${rbiDays}d` : "--"}
            </div>
            <p style={{ fontSize: "0.6rem", color: "var(--muted)", textAlign: "center", marginTop: "0.8rem", lineHeight: "1.4" }}>
              {letter ? "Legally required response window before Ombudsman escalation." : "Clock starts after sending the Nodal Complaint."}
            </p>
          </div>

          <div style={{ background: "var(--secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", marginBottom: "1rem", textTransform: "uppercase" }}>📋 ESCALATION FLOW</h3>
            {[
              { step: "1", label: "Principal Nodal Officer", desc: "Internal Grievance", done: step >= 3 },
              { step: "2", label: "RBI Ombudsman", desc: "RB-IOS 2026", done: false },
              { step: "3", label: "Consumer Court", desc: "E-Daakhil", done: false },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: s.done ? "var(--primary)" : "var(--background)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "900", color: s.done ? "white" : "var(--primary)", flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: s.done ? "var(--primary)" : "var(--foreground)" }}>{s.label}</div>
                  <div style={{ fontSize: "0.6rem", color: "var(--muted)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "1.25rem", borderRadius: "1rem", background: "rgba(255,193,7,0.05)", border: "1px dashed rgba(255,193,7,0.3)", fontSize: "0.65rem", color: "var(--muted)", lineHeight: "1.5" }}>
            <strong>PRO TIP:</strong> Always attach your last bank statement and a screenshot of the error/incident to the email you send to the Nodal Officer.
          </div>
        </div>
      </main>
    </div>
  );
}
