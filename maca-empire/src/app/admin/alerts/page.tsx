"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, AlertTriangle, Info, AlertCircle, RefreshCw } from "lucide-react";

const ADMIN_KEY = "imperio-admin-2025";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const severityConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
  critical: { color: "#FF5050", icon: <AlertTriangle size={14} />, bg: "rgba(255,80,80,0.06)" },
  high:     { color: "#FFB800", icon: <AlertCircle size={14} />, bg: "rgba(255,184,0,0.06)" },
  normal:   { color: "#60A5FA", icon: <Info size={14} />, bg: "rgba(96,165,250,0.06)" },
  low:      { color: "rgba(255,255,255,0.3)", icon: <Bell size={14} />, bg: "rgba(255,255,255,0.02)" },
};

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acking, setAcking] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/internal/alerts/active?admin_key=${ADMIN_KEY}`);
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch {}
    setLoading(false);
  };

  const ackAlert = async (id: string) => {
    setAcking(id);
    try {
      await fetch(`${BACKEND}/internal/alerts/ack`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: id, admin_key: ADMIN_KEY }),
      });
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch {}
    setAcking(null);
  };

  const ackAll = async () => {
    for (const a of alerts) await ackAlert(a.id);
  };

  useEffect(() => { fetchAlerts(); }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,80,80,0.08)", border: "0.5px solid rgba(255,80,80,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5050" }}><Bell size={20} /></div>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>Alert Queue</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Unacknowledged alerts from all executive agents · {alerts.length} pending</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {alerts.length > 0 && (
            <button onClick={ackAll} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "rgba(52,211,153,0.08)", border: "0.5px solid rgba(52,211,153,0.2)", borderRadius: "8px", color: "#34D399", fontSize: "12px", cursor: "pointer" }}>
              <CheckCheck size={13} /> Acknowledge All
            </button>
          )}
          <button onClick={fetchAlerts} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", cursor: "pointer" }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <CheckCheck size={32} color="rgba(52,211,153,0.4)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#34D399", marginBottom: "8px" }}>All clear</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>No unacknowledged alerts from the executive team.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {alerts.map(alert => {
            const cfg = severityConfig[alert.severity] || severityConfig.normal;
            return (
              <div key={alert.id} style={{ display: "flex", gap: "14px", padding: "16px 20px", background: cfg.bg, border: `0.5px solid ${cfg.color}33`, borderRadius: "12px", alignItems: "flex-start" }}>
                <div style={{ color: cfg.color, marginTop: "2px", flexShrink: 0 }}>{cfg.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: cfg.color, textTransform: "uppercase", letterSpacing: "1px" }}>{alert.severity}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>from {alert.source_agent?.toUpperCase() || "SYSTEM"}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>{new Date(alert.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{alert.message}</p>
                </div>
                <button onClick={() => ackAlert(alert.id)} disabled={acking === alert.id}
                  style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontSize: "11px", cursor: "pointer", flexShrink: 0, fontWeight: 700 }}>
                  {acking === alert.id ? "..." : "Ack"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
