"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type MicState = "idle" | "listening" | "processing" | "speaking";

export default function VoicePage() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [language, setLanguage] = useState<"en-IN" | "hi-IN">("en-IN");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setMicState("processing");
        processQuery(text);
      };

      recognitionRef.current.onerror = () => setMicState("idle");
      recognitionRef.current.onend = () => { if (micState === "listening") setMicState("idle"); };
    }
    
    synthRef.current = window.speechSynthesis;
    return () => { if (synthRef.current) synthRef.current.cancel(); };
  }, [micState]);

  const processQuery = async (query: string) => {
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, agent_id: "A6" }),
      });
      
      if (!res.ok) throw new Error("Backend Error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.token) fullText += data.token;
              } catch (e) {}
            }
          }
        }
      }

      setAiResponse(fullText);
      speak(fullText);
    } catch (err) {
      setMicState("idle");
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.onstart = () => setMicState("speaking");
    utterance.onend = () => setMicState("idle");
    synthRef.current.speak(utterance);
  };

  const handleMicClick = () => {
    if (micState === "idle") {
      setAiResponse("");
      setTranscript("");
      setMicState("listening");
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } else {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
      setMicState("idle");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050705", color: "#F0F4E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: micState === "listening" || micState === "speaking" ? "700px" : "500px", height: micState === "listening" || micState === "speaking" ? "700px" : "500px", background: `radial-gradient(ellipse at center, rgba(181,255,46,${micState === "listening" ? 0.15 : micState === "speaking" ? 0.1 : 0.05}) 0%, transparent 65%)`, transition: "all 0.8s ease" }} />
      
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", maxWidth: "600px", textAlign: "center" }}>
        <Link href="/" style={{ textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)", color: "#B5FF2E", fontFamily: "Syne", fontWeight: 800 }}>maCA VOICE</Link>
        
        <h1 style={{ fontFamily: "Syne", fontSize: "40px", fontWeight: 800, margin: 0 }}>{micState === "speaking" ? "maCA is Speaking..." : "Ask me anything."}</h1>

        <div style={{ display: "flex", background: "#111", borderRadius: "100px", padding: "4px" }}>
          <button onClick={() => setLanguage("en-IN")} style={{ padding: "8px 20px", borderRadius: "100px", border: "none", background: language === "en-IN" ? "#B5FF2E" : "transparent", color: language === "en-IN" ? "#000" : "#888", cursor: "pointer" }}>English</button>
          <button onClick={() => setLanguage("hi-IN")} style={{ padding: "8px 20px", borderRadius: "100px", border: "none", background: language === "hi-IN" ? "#B5FF2E" : "transparent", color: language === "hi-IN" ? "#000" : "#888", cursor: "pointer" }}>Hindi</button>
        </div>

        <button onClick={handleMicClick} style={{ width: "100px", height: "100px", borderRadius: "50%", border: "none", background: micState === "listening" ? "#B5FF2E" : "#1A1F18", color: micState === "listening" ? "#000" : "#B5FF2E", fontSize: "40px", cursor: "pointer", transition: "all 0.3s", boxShadow: micState === "listening" ? "0 0 40px rgba(181,255,46,0.4)" : "none" }}>{micState === "processing" ? "⌛" : "🎤"}</button>

        <div style={{ minHeight: "100px" }}>
          {transcript && <p style={{ fontSize: "18px", opacity: 0.7 }}>&ldquo;{transcript}&rdquo;</p>}
          {aiResponse && <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left", fontSize: "14px", lineHeight: 1.6 }}>{aiResponse}</div>}
        </div>
      </div>
    </div>
  );
}
