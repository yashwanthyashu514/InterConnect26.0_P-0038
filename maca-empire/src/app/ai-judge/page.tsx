"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Argument {
  side: "claimant" | "respondent";
  text: string;
  timestamp: string;
}

const initialArguments: Argument[] = [
  { side: "claimant", text: "The respondent failed to deliver the agreed software within the stipulated 90-day period, causing direct financial losses of ₹14 lakhs.", timestamp: "10:02 AM" },
  { side: "respondent", text: "The delay was caused by the claimant's failure to provide required API documentation for 45 days, which constituted a material breach of the project specification.", timestamp: "10:05 AM" },
];

const judgeResponses = [
  "Having examined the submissions, this tribunal notes that both parties bear partial responsibility. The claimant's failure to provide documentation within agreed timelines constitutes contributory conduct.",
  "The tribunal is examining the force majeure clause. Counsel for the respondent is directed to produce documentary evidence of the documentation delays within 7 days.",
  "After careful deliberation, this tribunal finds merit in the claimant's position regarding delivery timelines. However, contributory negligence reduces damages proportionally.",
];

export default function AIJudgePage() {
  const [claimantInput, setClaimantInput] = useState("");
  const [respondentInput, setRespondentInput] = useState("");
  const [arguments_, setArguments] = useState<Argument[]>(initialArguments);
  const [judgeResponse, setJudgeResponse] = useState(judgeResponses[0]);
  const [jurisdiction, setJurisdiction] = useState("Arbitration Tribunal");
  const [showAward, setShowAward] = useState(false);
  const [isRuling, setIsRuling] = useState(false);

  const submitArgument = (side: "claimant" | "respondent", text: string) => {
    if (!text.trim()) return;
    const newArg: Argument = { side, text, timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
    setArguments((prev) => [...prev, newArg]);
    setIsRuling(true);
    setTimeout(() => {
      setJudgeResponse(judgeResponses[Math.floor(Math.random() * judgeResponses.length)]);
      setIsRuling(false);
    }, 2000);
    if (side === "claimant") setClaimantInput("");
    else setRespondentInput("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>

      {/* Courtroom Header */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid rgba(181,255,46,0.2)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "12px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
            maCA
          </span>
        </Link>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", letterSpacing: "2px", color: "var(--text-primary)", textTransform: "uppercase" }}>
            Before the AI Mock Judge
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px" }}>
            Arbitration Simulator · Contract Dispute Matter No. 2025/001
          </p>
        </div>
        <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "6px 12px", color: "var(--text-muted)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          {["Arbitration Tribunal", "Consumer Forum", "Labour Tribunal", "RERA Tribunal", "NCDRC"].map((j) => (
            <option key={j}>{j}</option>
          ))}
        </select>
      </div>

      {/* 3-Panel Courtroom */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Claimant Panel ── */}
        <div style={{ flex: "0 0 35%", borderRight: "0.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Claimant</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px" }}>Party A</p>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {arguments_.filter((a) => a.side === "claimant").map((arg, i) => (
              <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-acid)", borderLeft: "3px solid var(--acid)", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: "6px" }}>{arg.text}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{arg.timestamp}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px", borderTop: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
            <textarea
              value={claimantInput}
              onChange={(e) => setClaimantInput(e.target.value)}
              placeholder="Submit your argument..."
              rows={3}
              style={{ width: "100%", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "10px 12px", color: "var(--text-primary)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "none", marginBottom: "8px" }}
            />
            <button className="btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", fontSize: "12px" }} onClick={() => submitArgument("claimant", claimantInput)}>
              Submit Argument →
            </button>
          </div>
        </div>

        {/* ── Judge Panel (Center) ── */}
        <div style={{ flex: "0 0 30%", display: "flex", flexDirection: "column", borderRight: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)", position: "relative" }}>
          {/* Judge orb */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", background: "radial-gradient(ellipse at center, rgba(181,255,46,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div style={{ padding: "24px 20px", textAlign: "center", borderBottom: "0.5px solid var(--border-acid)", position: "relative", zIndex: 1 }}>
            <div style={{ width: "64px", height: "64px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 12px" }}>
              🤖
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-primary)", marginBottom: "4px" }}>AI Mock Judge</p>
            <span className={`status-online`} style={{ background: isRuling ? "rgba(255,184,0,0.1)" : undefined, color: isRuling ? "var(--warning)" : undefined }}>
              {isRuling ? "Deliberating..." : "Session Active"}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px", position: "relative", zIndex: 1 }}>
            <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-acid)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--acid)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
                {isRuling ? "⏳ DELIBERATING..." : "📋 RULING IN PROGRESS"}
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-primary)", fontFamily: "Georgia, serif", lineHeight: 1.7, fontStyle: "italic" }}>
                &ldquo;{judgeResponse}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ── Respondent Panel ── */}
        <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Respondent</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px" }}>Party B</p>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {arguments_.filter((a) => a.side === "respondent").map((arg, i) => (
              <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid rgba(255,94,94,0.2)", borderLeft: "3px solid var(--danger)", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: "6px" }}>{arg.text}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{arg.timestamp}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px", borderTop: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
            <textarea
              value={respondentInput}
              onChange={(e) => setRespondentInput(e.target.value)}
              placeholder="Submit your argument..."
              rows={3}
              style={{ width: "100%", background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", padding: "10px 12px", color: "var(--text-primary)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "none", marginBottom: "8px" }}
            />
            <button style={{ width: "100%", justifyContent: "center", fontSize: "12px", background: "transparent", border: "0.5px solid rgba(255,94,94,0.3)", color: "var(--danger)", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => submitArgument("respondent", respondentInput)}>
              Submit Argument →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ background: "var(--bg-secondary)", borderTop: "0.5px solid var(--border-acid)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Case: Contract Dispute · {jurisdiction}</p>
          <span className="badge badge-acid">In Session</span>
        </div>
        <button className="btn-primary btn-sm" style={{ fontSize: "12px" }} onClick={() => setShowAward(true)}>
          Request Final Award ⚖️
        </button>
      </div>

      {/* Final Award Modal */}
      {showAward && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,11,7,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-acid)", borderRadius: "20px", padding: "40px", maxWidth: "600px", width: "90%" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px", textAlign: "center", marginBottom: "4px", textTransform: "uppercase" }}>Final Arbitration Award</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginBottom: "24px" }}>AI Mock Judge · {jurisdiction} · {new Date().toLocaleDateString("en-IN")}</p>
            <div style={{ background: "var(--bg-primary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "24px", fontFamily: "Georgia, serif", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "20px" }}>
              <p><strong style={{ color: "var(--text-primary)" }}>FINDINGS:</strong> Having heard both parties, this tribunal finds that the respondent was in breach of the delivery timeline. However, the claimant&apos;s 45-day delay in providing API documentation constitutes 40% contributory negligence.</p>
              <p style={{ marginTop: "12px" }}><strong style={{ color: "var(--text-primary)" }}>RULING:</strong> Respondent to pay ₹8,40,000 (being 60% of claimed ₹14,00,000) within 30 days. Each party to bear own costs.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "13px" }}>Download Award PDF ↓</button>
              <button className="btn-ghost" style={{ fontSize: "13px" }} onClick={() => setShowAward(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
