"use client";

import React, { useState } from "react";

type Language = "hi" | "en";
type MicState = "idle" | "listening" | "processing";

export default function VoicePage() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [language, setLanguage] = useState<Language>("en");
  const [transcript, setTranscript] = useState("");

  const sampleTranscripts: Record<Language, string> = {
    en: "What is my tax liability for AY 2024-25?",
    hi: "मेरी टैक्स लायबिलिटी क्या है AY 2024-25 के लिए?",
  };

  const handleMicClick = () => {
    if (micState === "idle") {
      setMicState("listening");
      setTranscript("");
      setTimeout(() => {
        setTranscript(sampleTranscripts[language]);
        setMicState("processing");
        setTimeout(() => setMicState("idle"), 3000);
      }, 3000);
    } else {
      setMicState("idle");
      setTranscript("");
    }
  };

  const pastSessions = [
    { time: "Today 9:42 AM", preview: "Tax liability for FY2024-25 explained" },
    { time: "Yesterday 3:15 PM", preview: "GST filing deadline reminder" },
    { time: "Apr 7, 11:00 AM", preview: "Section 80C deductions breakdown" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Orb — pulses when listening */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -60%)",
        width: micState === "listening" ? "700px" : "500px",
        height: micState === "listening" ? "700px" : "500px",
        background: `radial-gradient(ellipse at center, rgba(181,255,46,${micState === "listening" ? 0.12 : 0.05}) 0%, transparent 65%)`,
        transition: "all 1.5s ease",
        pointerEvents: "none",
        animation: micState === "listening" ? "pulse-orb 2s ease-in-out infinite" : "none",
      }} />
      <style>{`
        @keyframes pulse-orb {
          0%, 100% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -60%) scale(1.08); opacity: 0.8; }
        }
        @keyframes spin-arc {
          to { transform: rotate(360deg); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(181,255,46,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(181,255,46,0.018) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", padding: "40px 24px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
            maCA
          </span>
        </Link>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-2px", marginBottom: "8px" }}>Ask anything. Out loud.</h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>In Hindi or English. No typing needed.</p>
        </div>

        {/* Language toggle */}
        <div style={{ display: "flex", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "100px", padding: "3px" }}>
          {(["en", "hi"] as Language[]).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} style={{ padding: "8px 20px", borderRadius: "100px", border: "none", cursor: "pointer", background: language === lang ? "var(--acid)" : "transparent", color: language === lang ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s" }}>
              {lang === "en" ? "🇬🇧 English" : "🇮🇳 हिंदी"}
            </button>
          ))}
        </div>

        {/* Mic Button */}
        <div style={{ position: "relative" }}>
          {micState === "listening" && (
            <>
              <div style={{ position: "absolute", inset: "-20px", borderRadius: "50%", border: "1.5px solid rgba(181,255,46,0.4)", animation: "ripple 1.5s ease-out infinite" }} />
              <div style={{ position: "absolute", inset: "-40px", borderRadius: "50%", border: "1.5px solid rgba(181,255,46,0.2)", animation: "ripple 1.5s ease-out 0.5s infinite" }} />
            </>
          )}
          <button
            onClick={handleMicClick}
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              border: `2px solid ${micState === "idle" ? "var(--border-acid)" : "var(--acid)"}`,
              background: micState === "listening" ? "var(--acid)" : micState === "processing" ? "rgba(181,255,46,0.1)" : "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "36px",
              transition: "all 0.3s ease",
              position: "relative",
              zIndex: 1,
            }}
          >
            {micState === "processing" ? (
              <div style={{ width: "36px", height: "36px", border: "3px solid rgba(181,255,46,0.2)", borderTop: "3px solid var(--acid)", borderRadius: "50%", animation: "spin-arc 1s linear infinite" }} />
            ) : "🎤"}
          </button>
        </div>

        {/* Status text */}
        <p style={{ fontSize: "14px", color: micState === "idle" ? "var(--text-muted)" : "var(--acid)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", minHeight: "20px", transition: "color 0.3s" }}>
          {micState === "idle" && "Tap the microphone to start"}
          {micState === "listening" && "Listening..."}
          {micState === "processing" && "Processing your query..."}
        </p>

        {/* Transcript */}
        {transcript && (
          <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-acid)", borderRadius: "12px", padding: "16px 24px", maxWidth: "500px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", color: "var(--text-primary)", lineHeight: 1.5 }}>
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {/* Suggested Prompts */}
        {micState === "idle" && !transcript && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", maxWidth: "480px" }}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Try saying</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {(language === "en"
                ? ["What is the last date for GST filing?", "Explain Section 80C deductions", "Draft a complaint letter for my bank"]
                : ["मेरी टैक्स लायबिलिटी क्या है?", "GST filing की आखिरी तारीख क्या है?", "Section 80C समझाइए"]
              ).map((s, i) => (
                <button key={i} className="prompt-pill" onClick={() => setTranscript(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Past sessions */}
        <div style={{ width: "100%", maxWidth: "480px", background: "var(--bg-secondary)", border: "0.5px solid var(--border-subtle)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--border-subtle)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Past Sessions</p>
          </div>
          {pastSessions.map((s, i) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: i < pastSessions.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", marginBottom: "2px" }}>{s.preview}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>{s.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
