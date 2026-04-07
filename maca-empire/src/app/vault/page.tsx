"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SavedDoc {
  doc_id: string;
  agent_id: string;
  doc_type: string;
  content: string;
  created_at: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function VaultPage() {
  const [docs, setDocs] = useState<SavedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    // Hackathon demo ID: "user_demo_123"
    fetch(`${BACKEND_URL}/vault/user/user_demo_123`)
      .then(res => res.json())
      .then(data => {
        setDocs(data.documents || []);
        setLoading(false);
      })
      .catch(e => {
        console.error("Vault fetch error", e);
        setLoading(false);
      });
  }, []);

  const downloadDoc = (doc: SavedDoc) => {
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.agent_id}_${doc.doc_type.replace(/\s+/g, '_')}_${new Date(doc.created_at).getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocs = filter === "ALL" ? docs : docs.filter(d => d.agent_id === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem" }}>
      <main style={{ maxWidth: "1100px", margin: "0 auto", marginTop: "2rem" }}>
        <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "-0.5px" }}>🗄️ Document Vault</h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "0.2rem" }}>Every generated document, stored forever in the Empire.</p>
          </div>
          <div style={{ textAlign: "right" }}>
             <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--muted)" }}>TOTAL DOCUMENTS</p>
             <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--primary)" }}>{docs.length}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: "1.5rem" }}>
           {["ALL", "A1", "A2", "A6", "A8", "B2", "B4", "B7"].map(tag => (
             <button 
               key={tag} 
               onClick={() => setFilter(tag)}
               style={{ 
                 padding: "0.6rem 1.25rem", borderRadius: "0.75rem", fontWeight: "800", fontSize: "0.75rem", cursor: "pointer",
                 background: filter === tag ? "var(--primary)" : "var(--secondary)",
                 color: filter === tag ? "white" : "var(--foreground)",
                 border: `1.5px solid ${filter === tag ? "var(--primary)" : "var(--border)"}`,
                 whiteSpace: "nowrap",
                 transition: "0.2s"
               }}
             >
               {tag === "ALL" ? "🗂️ All Records" : `📍 Agent ${tag}`}
             </button>
           ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "4rem" }}>
             <div style={{ width: "40px", height: "40px", border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
             <p style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--muted)" }}>DECRYPTING VAULT RECORDS...</p>
             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--secondary)", borderRadius: "1.5rem", border: "2px dashed var(--border)" }}>
            <span style={{ fontSize: "4rem" }}>📂</span>
            <h2 style={{ marginTop: "1.5rem", fontWeight: "900", color: "var(--muted)" }}>Your legal vault is empty.</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", maxWidth: "400px", margin: "0.5rem auto 2rem" }}>
              Documents are automatically saved when you use any agent. Try maCA Tax or BankFight now.
            </p>
            <Link href="/" style={{ padding: "0.8rem 2rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", fontWeight: "900", textDecoration: "none" }}>
              FIND AN AGENT →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {filteredDocs.map(doc => (
              <div key={doc.doc_id} style={{ 
                display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center", padding: "1.5rem 2rem", 
                background: "var(--secondary)", borderRadius: "1.25rem", border: "1px solid var(--border)",
                transition: "0.2s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
              }}>
                 <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                       <span style={{ padding: "0.25rem 0.6rem", background: "var(--primary-glow)", color: "var(--primary)", borderRadius: "0.5rem", fontSize: "0.7rem", fontWeight: "900" }}>{doc.agent_id}</span>
                       <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "var(--foreground)" }}>{doc.doc_type}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: "600" }}>
                        🗓️ {new Date(doc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: "600", fontFamily: "monospace" }}>
                        🔒 {doc.doc_id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                 </div>
                 <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button 
                      onClick={() => {
                        const win = window.open("", "_blank");
                        win?.document.write(`<pre style="padding: 2rem; white-space: pre-wrap; font-family: sans-serif;">${doc.content}</pre>`);
                      }}
                      style={{ padding: "0.7rem 1.25rem", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: "0.75rem", fontWeight: "800", cursor: "pointer", fontSize: "0.75rem" }}
                    >
                       👁️ VIEW
                    </button>
                    <button 
                      onClick={() => downloadDoc(doc)} 
                      style={{ padding: "0.7rem 1.25rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: "900", cursor: "pointer", fontSize: "0.75rem", boxShadow: "0 4px 12px var(--primary-glow)" }}
                    >
                       📥 DOWNLOAD
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div style={{ maxWidth: "1100px", margin: "4rem auto 0", padding: "2rem", borderRadius: "1.5rem", background: "var(--primary-glow)", border: "1px solid hsla(174, 88%, 45%, 0.1)" }}>
         <h4 style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>🛡️ SECURITY NOTE</h4>
         <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: "1.6" }}>
           Your documents are encrypted and stored in the Empire's secure vault. No human CA can access these unless you explicitly share them in the Marketplace. All generation logs are periodically purged, but your Vault records are permanent until deleted by you.
         </p>
      </div>
    </div>
  );
}
