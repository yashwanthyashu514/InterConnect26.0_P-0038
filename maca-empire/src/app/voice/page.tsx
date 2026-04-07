"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { saveToVault } from "@/lib/vault";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function VoiceCAPage() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      askAgent(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListen = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    else { recognitionRef.current?.start(); setListening(true); setTranscript(""); setReply(""); }
  };

  const askAgent = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, agent_id: "A5" }),
      });
      const data = await res.json();
      const answer = data.answer || "Backend connection issue. Please check the FastAPI server.";
      setReply(answer);
      
      saveToVault({ agent_id: "A5", doc_type: "Voice Consultation Transcription", content: `User: ${query}\nmaCA: ${answer}` });

      // Text-to-Speech
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.lang = query.match(/[\u0900-\u097F]/) ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      setReply("Backend not reachable. Start FastAPI server on port 8000.");
    }
    setLoading(false);
  };

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    await askAgent(transcript);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <main style={{ width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginTop: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "var(--primary)" }}>🗣️ Voice CA A5</h1>
          <p style={{ fontSize: "1rem", color: "var(--muted)" }}>Speak in Hindi or English · Instant Law Citation</p>
        </div>

        {/* Mic Button */}
        <button
          onClick={toggleListen}
          disabled={!supported}
          style={{
            width: "160px", height: "160px", borderRadius: "50%",
            background: listening ? "rgba(220,38,38,0.15)" : "rgba(20,184,166,0.1)",
            border: `4px solid ${listening ? "#dc2626" : "var(--primary)"}`,
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            transition: "all 0.3s",
            boxShadow: listening ? "0 0 0 20px rgba(220,38,38,0.08), 0 0 0 40px rgba(220,38,38,0.04)" : "0 0 0 0 transparent",
          }}
        >
          <span style={{ fontSize: "3rem" }}>{listening ? "🔴" : "🎙️"}</span>
          <span style={{ fontSize: "0.7rem", fontWeight: "900", color: listening ? "#dc2626" : "var(--primary)" }}>
            {listening ? "LISTENING..." : "TAP TO SPEAK"}
          </span>
        </button>

        {!supported && (
          <p style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: "700" }}>
            ⚠️ Voice not supported in this browser. Use Chrome for full Voice CA experience.
          </p>
        )}

        <form onSubmit={handleTypeSubmit} style={{ width: "100%", display: "flex", gap: "0.75rem" }}>
          <input
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="या यहाँ टाइप करें... / Or type your question..."
            style={{ flex: 1, padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--foreground)", fontSize: "0.9rem" }}
          />
          <button type="submit" disabled={loading || !transcript.trim()} style={{ padding: "1rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "900", cursor: "pointer" }}>
            ASK →
          </button>
        </form>

        {transcript && (
          <div style={{ width: "100%", background: "var(--secondary)", padding: "1rem 1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--muted)", marginBottom: "0.4rem" }}>YOU SAID:</p>
            <p style={{ fontSize: "1rem", color: "var(--foreground)" }}>{transcript}</p>
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--primary)", fontWeight: "700" }}>
            <span style={{ fontSize: "1.5rem", animation: "spin 1s linear infinite" }}>⚖️</span> maCA is thinking...
          </div>
        )}

        {reply && !loading && (
          <div style={{ width: "100%", background: "rgba(20,184,166,0.05)", border: "1px solid var(--primary)", borderRadius: "1rem", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--primary)", marginBottom: "0.75rem" }}>⚖️ maCA VOICE CA SAYS:</p>
            <p style={{ fontSize: "0.95rem", color: "var(--foreground)", lineHeight: "1.7" }}>{reply}</p>
            <button
              onClick={() => { const u = new SpeechSynthesisUtterance(reply); u.lang = "hi-IN"; u.rate = 0.9; window.speechSynthesis.speak(u); }}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" }}
            >
              🔊 REPLAY ANSWER
            </button>
          </div>
        )}

        <p style={{ fontSize: "0.65rem", color: "var(--muted)", textAlign: "center" }}>
          Speak in Hindi or English · maCA understands both · Answers cite exact law sections
        </p>
      </main>
    </div>
  );
}
