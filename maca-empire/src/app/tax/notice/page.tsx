"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function NoticeFighterPage() {
  const [noticeText, setNoticeText] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim() || loading) return;
    setLoading(true);
    setReply("");

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `You are an expert Indian tax lawyer. Read this IT/GST notice and draft a formal, legally-cited reply. Identify the ground, cite the relevant Section of the Income Tax Act or CGST Act, and draft the reply in the format expected by the Income Tax Department. Notice text:\n\n${noticeText}`
        }),
      });
      const data = await res.json();
      setReply(data.answer || "Could not generate reply. Please try again.");
    } catch {
      setReply("Backend connection error. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, show file name and prompt user to paste text
    setNoticeText(`[Uploaded: ${file.name}]\n\nPlease paste the notice text here, or we will support PDF auto-extraction in the next build.`);
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
          Replaces a Rs. 20,000 CA fee
        </span>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", color: "var(--foreground)", marginBottom: "1rem" }}>
            Notice Fighter <span style={{ color: "var(--primary)" }}>📄→⚖️</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: "600px", margin: "0 auto" }}>
            Upload or paste a GST or Income Tax notice. Get a legally cited reply in 30 seconds.
          </p>
        </div>

        <div style={{
          background: "var(--secondary)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          padding: "2rem",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "var(--background)",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius)",
                padding: "1rem 2rem",
                cursor: "pointer",
                color: "var(--muted)",
                fontWeight: "600",
                fontSize: "0.9rem",
                flex: 1,
                textAlign: "center"
              }}
            >
              📎 Upload Notice PDF (Beta)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", marginBottom: "0.5rem" }}>
              OR PASTE NOTICE TEXT
            </label>
            <textarea
              value={noticeText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoticeText(e.target.value)}
              placeholder="Paste your IT notice or GST notice text here..."
              rows={8}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "calc(var(--radius) * 0.75)",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                resize: "vertical",
                fontFamily: "inherit",
                marginBottom: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <button
              type="submit"
              disabled={loading || !noticeText.trim()}
              className="button-primary"
              style={{ width: "100%", padding: "1rem", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "⚖️ Reading notice and drafting reply..." : "⚖️ Generate Legal Reply — 30 Seconds"}
            </button>
          </form>
        </div>

        {reply && (
          <div className="animate-in" style={{
            background: "var(--secondary)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--primary)",
            padding: "2rem"
          }}>
            <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>📄 Your Legal Reply</h3>
            <div style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) * 0.75)",
              padding: "1.5rem",
              fontFamily: "Georgia, serif",
              lineHeight: "1.8",
              fontSize: "0.9rem",
              whiteSpace: "pre-wrap",
              maxHeight: "500px",
              overflowY: "auto"
            }}>
              {reply}
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => navigator.clipboard.writeText(reply)}
                className="button-primary"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                📋 Copy Reply
              </button>
              <button
                style={{
                  flex: 1, background: "var(--background)",
                  border: "1px solid var(--border)", padding: "0.75rem",
                  borderRadius: "var(--radius)", cursor: "pointer",
                  fontWeight: "600", color: "var(--foreground)"
                }}
              >
                🤝 Connect to CA for Rs. 999
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
