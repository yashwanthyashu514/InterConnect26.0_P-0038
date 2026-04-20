"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import Link from "next/link";

export default function VoiceCAPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleRecording = async () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setLoading(true);
      // Simulate Whisper transcription + RAG + TTS
      setTimeout(() => {
        setVoiceQuery("How much is my GST penalty for 30 days delay?");
        setReply("According to Section 47 of the CGST Act, the late fee is ₹50 per day (₹25 CGST + ₹25 SGST), totaling ₹1,500 for a 30-day delay.");
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <header style={{
        background: "var(--secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link href="/tax" style={{ fontWeight: "800", fontSize: "1.25rem", color: "var(--primary)" }}>
          ← maCA Tax
        </Link>
        <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Reuses maCA RAG + Whisper + TTS — Rs. 0
        </span>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1rem", textAlign: "center" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", color: "var(--foreground)", marginBottom: "1rem" }}>
            Voice CA <span style={{ color: "var(--primary)" }}>🎙️</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: "580px", margin: "0 auto" }}>
            Ask tax and compliance questions in spoken Hindi or English. Get cited legal answers aloud.
          </p>
        </div>

        <div style={{
          background: "var(--secondary)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem"
        }}>
          <div 
            onClick={toggleRecording}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: isRecording ? "#ff4444" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: isRecording ? "0 0 40px rgba(255, 68, 68, 0.4)" : "0 10px 20px var(--primary-glow)",
              transition: "all 0.3s ease",
              fontSize: "3rem"
            }}
          >
            {isRecording ? "⏹️" : "🎤"}
          </div>
          
          <div>
            <h3 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              {isRecording ? "Listening..." : "Tap to speak"}
            </h3>
            <p style={{ color: "var(--muted)" }}>Try asking: "Hindi mein CGST Section 47 batao"</p>
          </div>
        </div>

        {voiceQuery && (
          <div className="animate-in" style={{
            background: "var(--secondary)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--primary)",
            padding: "2rem",
            marginTop: "2rem",
            textAlign: "left"
          }}>
            <h4 style={{ color: "var(--muted)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>You Asked</h4>
            <p style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "1.5rem" }}>"{voiceQuery}"</p>
            
            <h4 style={{ color: "var(--primary)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>Voice CA Response</h4>
            <div style={{ 
              background: "var(--background)", 
              padding: "1rem", 
              borderRadius: "0.5rem", 
              border: "1px solid var(--border)",
              lineHeight: "1.6"
            }}>
              {reply}
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.7rem", background: "#f0fdf4", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "0.5rem", fontWeight: "700" }}>🔊 Speaking Result</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
