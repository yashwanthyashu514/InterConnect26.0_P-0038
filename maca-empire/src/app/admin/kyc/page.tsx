"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Check, X, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminKYCQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kyc/pending");
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const [reasonModal, setReasonModal] = useState<{ open: boolean, profileId: string }>({ open: false, profileId: "" });
  const [rejectReason, setRejectReason] = useState("");

  const handleAction = async (profile_id: string, action: "approve" | "reject", reasonArg?: string) => {
    if (action === "reject" && !reasonArg) {
      setReasonModal({ open: true, profileId: profile_id });
      return;
    }

    setProcessingId(profile_id);
    try {
      const res = await fetch("/api/admin/kyc/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id, action, reason: reasonArg || "Incomplete documentation" })
      });

      if (res.ok) {
        setQueue(prev => prev.filter(p => p.id !== profile_id));
        setReasonModal({ open: false, profileId: "" });
        setRejectReason("");
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
      {/* Rejection Reason Modal */}
      {reasonModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "400px", background: "#111", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "24px", padding: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, marginBottom: "8px", color: "#FF5050" }}>Rejection Reason</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Provide a specific reason for declining this CA application.</p>
            <textarea
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., ICAI certificate is expired or blurred..."
              style={{ width: "100%", height: "100px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", marginBottom: "24px", resize: "none" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => setReasonModal({ open: false, profileId: "" })}
                style={{ flex: 1, padding: "12px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button 
                onClick={() => handleAction(reasonModal.profileId, "reject", rejectReason)}
                disabled={!rejectReason}
                style={{ flex: 2, padding: "12px", background: "#FF5050", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: 800, cursor: "pointer", opacity: rejectReason ? 1 : 0.5 }}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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
