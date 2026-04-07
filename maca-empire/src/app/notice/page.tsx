"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const SAMPLE_NOTICE = `INCOME TAX DEPARTMENT
NOTICE UNDER SECTION 148A(b)

PAN: ABCDE1234F
Assessment Year: 2021-22

Dear Taxpayer,

It has come to the notice of this office that income of Rs. 14,50,000/- has escaped assessment for the above Assessment Year. Specifically, credits appearing in your AIS from M/s XYZ Pvt Ltd have not been included in your return of income filed on 31.07.2021.

You are hereby directed to show cause as to why assessment should not be reopened under Section 148 of the Income Tax Act, 1961.

Please reply within 7 days.

Income Tax Officer, Ward 3(1)
Mumbai`;

import { saveToVault } from "@/lib/vault";

export default function NoticeFighterPage() {
  const [noticeText, setNoticeText] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setNoticeText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!noticeText.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `Analyze this tax/GST notice and draft a formal legal reply with citations:\n\n${noticeText}`, agent_id: "A6" }),
      });
      const data = await res.json();
      if (data.answer && data.answer.length > 100) {
        setReply(data.answer);
        setLoading(false);
        saveToVault({ agent_id: "A6", doc_type: "Notice Reply Draft", content: data.answer });
        return;
      }
    } catch { /* fall through */ }

    // Template fallback
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const isSection148 = noticeText.includes("148");
    const isSection142 = noticeText.includes("142");
    const section = isSection148 ? "Section 148A(b)" : isSection142 ? "Section 142(1)" : "the above notice";

    const template = `Date: ${today}

To,
The Assessing Officer
Income Tax Department

Subject: Reply to Notice issued under ${section}

Respected Sir/Madam,

I am in receipt of the notice dated as above and I wish to submit my reply as follows:

1. FACTUAL POSITION:
All income earned during the relevant Assessment Year has been duly disclosed in the Return of Income filed within the prescribed time limit. The return was filed in good faith with accurate particulars.

2. LEGAL GROUND — "REASON TO BELIEVE":
${isSection148 ? `As per the Hon'ble Supreme Court's ruling in Union of India vs. Ashish Agarwal (2022), any reassessment proceeding must be supported by tangible material constituting "Reason to Believe." A mere entry in AIS without independent corroboration does not satisfy the threshold required under the amended Section 148A procedure.` : `The information sought is either already available on record or is not in my possession. I request the AO to specify the exact nature of income alleged to have escaped assessment.`}

3. DOCUMENTS ENCLOSED:
   a) Copy of original Return of Income (ITR)
   b) Form 26AS / AIS reconciliation statement
   c) Bank statement evidencing the source of all credits
   d) Relevant invoices / agreements (if applicable)

In view of the above, I respectfully submit that the proceedings be dropped.

Yours faithfully,
[Taxpayer Name]
PAN: [PAN Number]
Date: ${today}

[Note: This reply is prepared by maCA Notice Fighter based on available information. Please attach all supporting documents before filing.]`;

    setReply(template);
    setLoading(false);
    saveToVault({ agent_id: "A6", doc_type: "Notice Reply Draft (Fallback)", content: template });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1000px", margin: "2rem auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div style={{ gridColumn: "span 2", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary)" }}>🏰 Notice Fighter A6</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Upload IT/GST Notice → Automated Legal Reply in 30s</p>
        </div>
        {/* Left: Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: "2px dashed var(--primary)", borderRadius: "1rem", padding: "2rem", textAlign: "center", cursor: "pointer", background: "rgba(20,184,166,0.03)", transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,184,166,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(20,184,166,0.03)")}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📄</div>
            <p style={{ fontWeight: "700", color: "var(--foreground)" }}>{fileName || "Upload Notice (PDF / TXT)"}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.25rem" }}>or paste the text below</p>
            <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile} style={{ display: "none" }} />
          </div>

          <textarea
            value={noticeText}
            onChange={e => setNoticeText(e.target.value)}
            placeholder="Paste your IT / GST notice text here..."
            rows={10}
            style={{ padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--foreground)", resize: "vertical", fontSize: "0.8rem", lineHeight: "1.6" }}
          />

          <button
            onClick={() => { setNoticeText(SAMPLE_NOTICE); setFileName("Sample_148A_Notice.txt"); }}
            style={{ padding: "0.6rem", background: "transparent", border: "1px dashed var(--border)", color: "var(--muted)", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem" }}
          >
            LOAD SAMPLE NOTICE (Section 148A Demo)
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading || !noticeText.trim()}
            style={{ padding: "1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "900", cursor: "pointer", fontSize: "0.9rem", opacity: !noticeText.trim() ? 0.5 : 1 }}
          >
            {loading ? "ANALYZING NOTICE..." : "⚔️ DRAFT REPLY IN 30s"}
          </button>
        </div>

        {/* Right: Reply */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reply ? (
            <>
              <div style={{ background: "white", color: "#1e293b", padding: "2rem", borderRadius: "1rem", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", maxHeight: "500px", overflowY: "auto" }}>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: "0.8rem", lineHeight: "1.8" }}>{reply}</pre>
              </div>
              <button
                onClick={() => { const blob = new Blob([reply], {type: "text/plain"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Notice_Reply_Draft.txt"; a.click(); }}
                style={{ padding: "0.8rem", background: "#16a34a", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "900", cursor: "pointer" }}
              >
                📥 DOWNLOAD REPLY DRAFT
              </button>
            </>
          ) : (
            <div style={{ flex: 1, border: "2px dashed var(--border)", borderRadius: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)", padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚖️</div>
              <p style={{ fontWeight: "700" }}>Your cited legal reply will appear here</p>
              <p style={{ fontSize: "0.7rem", marginTop: "0.5rem" }}>Sec 148 · Sec 142(1) · Sec 143(2) · GST SCN</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
