"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setRole(meData.user.role);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const backUrl = role === "ca" ? "/ca-dashboard" : "/dashboard";

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href={backUrl} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "14px", marginBottom: "40px" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(181, 255, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Bell size={18} color="#B5FF2E" />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "32px", letterSpacing: "-1.5px" }}>Neural Feed</h1>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}><Loader2 className="animate-spin" color="#B5FF2E" /></div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px", background: "rgba(255,255,255,0.02)", borderRadius: "32px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Communication silence. No new notifications.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => !n.is_read && markRead(n.id)}
                style={{ 
                  background: n.is_read ? "rgba(255,255,255,0.02)" : "rgba(181, 255, 46, 0.05)", 
                  border: `1px solid ${n.is_read ? "rgba(255,255,255,0.08)" : "rgba(181, 255, 46, 0.3)"}`, 
                  borderRadius: "20px", padding: "24px", cursor: n.is_read ? "default" : "pointer",
                  transition: "all 0.2s"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: n.is_read ? "rgba(255,255,255,0.3)" : "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px" }}>{n.type.replace("_", " ")}</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: n.is_read ? "rgba(255,255,255,0.6)" : "#fff", lineHeight: 1.5, margin: 0 }}>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
