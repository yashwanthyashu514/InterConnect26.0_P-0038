"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AuditShield from "./audit-shield";
import PenaltyClock from "./penalty-clock";
import DeductionTracker from "./deduction-tracker";
import DataImporter from "./data-importer";
import GSTRDraft from "./gstr-draft";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface Citation {
  source: string;
  url: string;
  excerpt: string;
}

interface Message {
  role: "user" | "ai";
  content: string;
  citations?: Citation[];
}

export default function TaxAgentPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Namaste! I am maCA, your AI Tax & GST agent. Ask me anything about GSTR-1, ITC, notices, or your filing deadlines. I will cite the exact section from the law." }
  ]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [gstin, setGstin] = useState("27AAACR1234A1Z5"); // Mock user GSTIN
  const [daysToDeadline, setDaysToDeadline] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date("2026-04-08");
    const nextDue = new Date("2026-04-11");
    const diffTime = Math.abs(nextDue.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysToDeadline(diffDays);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentQuery = query;
    setQuery("");

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: currentQuery,
          language: language === "en" ? "English" : "Hindi" 
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "ai",
        content: data.answer || "I could not find a cited answer for that. Try rephrasing.",
        citations: data.citations || []
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Backend connection error. Make sure the FastAPI server is running on port 8000.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineColor = () => {
    if (daysToDeadline <= 3) return "#dc2626";
    if (daysToDeadline <= 7) return "#f59e0b";
    return "#16a34a";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", width: "100%", flex: 1, display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", marginTop: "1rem" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--primary)" }}>⚖️ maCA Tax Agent A1</h1>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ background: getDeadlineColor(), color: "white", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.7rem", fontWeight: "800" }}>
                GSTR-1 DUE: {daysToDeadline} DAYS
              </div>
              <button
                onClick={() => setLanguage(l => l === "en" ? "hi" : "en")}
                style={{ background: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)", padding: "0.3rem 0.7rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.7rem", fontWeight: "700" }}>
                {language === "en" ? "HINDI" : "ENGLISH"}
              </button>
            </div>
          </div>

          <div style={{ 
            flex: 1, background: "var(--secondary)", borderRadius: "var(--radius)", padding: "1.5rem", border: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "60vh", overflowY: "auto",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)"
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", marginBottom: "1.5rem" }}>
                <div style={{ 
                  background: msg.role === "user" ? "var(--primary)" : "var(--background)",
                  padding: "1.25rem", borderRadius: "1.25rem", border: msg.role === "ai" ? "1px solid var(--border)" : "none",
                  fontSize: "0.95rem", lineHeight: "1.6", color: msg.role === "user" ? "white" : "var(--foreground)",
                  boxShadow: msg.role === "ai" ? "0 4px 15px rgba(0,0,0,0.03)" : "0 4px 15px var(--primary-glow)"
                }}>
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                    {msg.citations.map((c, ci) => (
                      <a 
                        key={ci} 
                        href={c.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: "0.65rem", textDecoration: "none", color: "var(--primary)", 
                          background: "var(--primary-glow)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem",
                          border: "1px solid hsla(174, 88%, 45%, 0.2)", display: "flex", alignItems: "center", gap: "0.4rem",
                          transition: "0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.filter = "brightness(0.9)"}
                        onMouseOut={e => e.currentTarget.style.filter = "none"}
                        title={c.excerpt}
                      >
                        ⚖️ Verified: {c.source} <span style={{ opacity: 0.5 }}>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>⚖️ Examining acts...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleAsk} style={{ display: "flex", gap: "1rem" }}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about GSTR-1, Section 47, etc." style={{ flex: 1, padding: "1rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--foreground)" }} />
            <button type="submit" disabled={loading} className="button-primary">Ask →</button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxHeight: "100vh", overflowY: "auto", paddingRight: "0.25rem" }}>
          <AuditShield />
          <PenaltyClock gstin={gstin} />
          <DeductionTracker />
          <DataImporter />
          <GSTRDraft gstin={gstin} period="Mar 2026" />
        </div>
      </main>
    </div>
  );
}
