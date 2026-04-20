"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Check, X, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";

export default function AdminKYCQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kyc/pending", {
        headers: { "x-admin-key": ADMIN_KEY }
      });
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleAction = async (profile_id: string, action: "approve" | "reject") => {
    let reason = "";
    if (action === "reject") {
      reason = prompt("Enter rejection reason:") || "Incomplete documentation";
      if (!reason) return;
    }

    setProcessingId(profile_id);
    try {
      const res = await fetch("/api/admin/kyc/action", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY 
        },
        body: JSON.stringify({ profile_id, action, reason })
      });

      if (res.ok) {
        setQueue(prev => prev.filter(p => p.id !== profile_id));
      } else {
        alert("Action failed");
      }
    } catch (e) {
      alert("Error processing request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", minHeight: "100vh", background: "#000", color: "#fff" }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "12px", marginBottom: "32px" }}>
        <ArrowLeft size={14} /> Back to Command Centre
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(181, 255, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <ShieldCheck size={18} color="#B5FF2E" />
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", letterSpacing: "-1.5px" }}>Verification Queue</h1>
        <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.03)", padding: "10px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", fontWeight: 700 }}>
          {queue.length} Pending Applications
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Loader2 className="animate-spin" size={32} color="#B5FF2E" />
        </div>
      ) : queue.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px", background: "rgba(255,255,255,0.02)", borderRadius: "32px", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>The neural verification queue is currently empty.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {queue.map(p => (
            <div key={p.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", color: "#B5FF2E", fontSize: "18px", fontWeight: 800 }}>
                  {p.marketplace_users?.name?.[0]}
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "4px" }}>{p.marketplace_users?.name}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>ICAI MRN: <strong>{p.icai_registration_no}</strong> · {p.marketplace_users?.email}</p>
                  
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {p.specialties?.map((s: string) => (
                      <span key={s} style={{ fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "0.1px solid rgba(255,255,255,0.1)" }}>{s}</span>
                    ))}
                  </div>

                  <button 
                    onClick={() => window.open(p.kyc_document_url || "#", "_blank")}
                    style={{ background: "none", border: "none", color: "#B5FF2E", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: 0 }}>
                    <ExternalLink size={14} /> View ICAI Certificate / Credentials
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  disabled={!!processingId}
                  onClick={() => handleAction(p.id, "reject")}
                  style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,80,80,0.1)", color: "#FF5050", border: "1px solid rgba(255,80,80,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={20} strokeWidth={3} />
                </button>
                <button 
                  disabled={!!processingId}
                  onClick={() => handleAction(p.id, "approve")}
                  style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#B5FF2E", color: "#000", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {processingId === p.id ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
