"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type MicState = "idle" | "listening" | "processing" | "speaking";
type VoiceAssistResponse = {
  text_response: string;
  transcript: string;
  detected_language: string;
  audio_base64: string;
  audio_mime_type: string;
};

export default function VoicePage() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [language, setLanguage] = useState<string>("en-IN");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-IN");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  const languages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "Hindi" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "mr-IN", name: "Marathi" }
  ];
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    try {
      setError("");
      setMicState("processing");
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-query.webm");
      formData.append("language_hint", language);

      const res = await fetch("/api/voice/assist", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as Partial<VoiceAssistResponse> & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Voice CA request failed");
      }

      const nextTranscript = data.transcript ?? "";
      const nextText = data.text_response ?? "";
      const nextLang = data.detected_language ?? language;
      const audioBase64 = data.audio_base64 ?? "";
      const audioMime = data.audio_mime_type ?? "audio/mpeg";

      setTranscript(nextTranscript);
      setAiResponse(nextText);
      setDetectedLanguage(nextLang);
      setLanguage(nextLang);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audioBytes = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
      const audioBlobOut = new Blob([audioBytes], { type: audioMime });
      const audioUrl = URL.createObjectURL(audioBlobOut);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setMicState("speaking");
      audio.onended = () => setMicState("idle");
      audio.onerror = () => {
        setMicState("idle");
        setError("Audio playback failed");
      };
      await audio.play();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Voice pipeline failed";
      setError(message);
      setMicState("idle");
    }
  };

  const handleMicClick = async () => {
    if (micState === "idle") {
      setAiResponse("");
      setTranscript("");
      setError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          stream.getTracks().forEach((t) => t.stop());
          await processAudio(blob);
        };
        recorder.start();
        setMicState("listening");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Microphone access denied";
        setError(message);
        setMicState("idle");
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      } else {
        setMicState("idle");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050705", color: "#F0F4E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: micState === "listening" || micState === "speaking" ? "700px" : "500px", height: micState === "listening" || micState === "speaking" ? "700px" : "500px", background: `radial-gradient(ellipse at center, rgba(181,255,46,${micState === "listening" ? 0.15 : micState === "speaking" ? 0.1 : 0.05}) 0%, transparent 65%)`, transition: "all 0.8s ease" }} />
      
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", maxWidth: "600px", textAlign: "center" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)", color: "#B5FF2E", fontFamily: "Syne", fontWeight: 800 }}>maCA VOICE CA (A6) · Powered by Sarvam & NVIDIA</Link>
        
        <h1 style={{ fontFamily: "Syne", fontSize: "40px", fontWeight: 800, margin: 0 }}>{micState === "speaking" ? "maCA is Speaking..." : "Multimodal Advisory"}</h1>

        {/* Responding Badge */}
        <div style={{ background: "rgba(181,255,46,0.1)", padding: "8px 16px", borderRadius: "12px", border: "1px solid rgba(181,255,46,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B5FF2E" }} />
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px" }}>
            Detected {languages.find(l => l.code === detectedLanguage)?.name ?? "English"} · Replying in {languages.find(l => l.code === language)?.name ?? "English"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", background: "#111", borderRadius: "20px", padding: "8px" }}>
          {languages.map(l => (
            <button 
              key={l.code}
              onClick={() => setLanguage(l.code)} 
              style={{ 
                padding: "10px 16px", 
                borderRadius: "14px", 
                border: "none", 
                background: language === l.code ? "#B5FF2E" : "transparent", 
                color: language === l.code ? "#000" : "#666", 
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.2s"
              }}
            >
              {l.name}
            </button>
          ))}
        </div>

        <button onClick={handleMicClick} style={{ width: "100px", height: "100px", borderRadius: "50%", border: "none", background: micState === "listening" ? "#B5FF2E" : "#1A1F18", color: micState === "listening" ? "#000" : "#B5FF2E", fontSize: "40px", cursor: "pointer", transition: "all 0.3s", boxShadow: micState === "listening" ? "0 0 40px rgba(181,255,46,0.4)" : "none" }}>{micState === "processing" ? "⌛" : micState === "listening" ? "⏹" : "🎤"}</button>

        <div style={{ minHeight: "100px" }}>
          {error && <p style={{ color: "#ff7676", fontSize: "13px" }}>{error}</p>}
          {transcript && <p style={{ fontSize: "18px", opacity: 0.7 }}>&ldquo;{transcript}&rdquo;</p>}
          {aiResponse && <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left", fontSize: "14px", lineHeight: 1.6 }}>{aiResponse}</div>}
        </div>
      </div>
    </div>
  );
}
