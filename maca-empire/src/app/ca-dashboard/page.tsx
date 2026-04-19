"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Check, X, CreditCard, User, Settings, PieChart, Clock, 
  ShieldCheck, Gem, LayoutDashboard, Wallet, Bell, 
  ArrowUpRight, Users, Activity, ExternalLink, MoreVertical, TrendingUp
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const STATUS_COLORS: any = {
  requested: { bg: "rgba(251, 191, 36, 0.1)", text: "#FBBF24" },
  accepted: { bg: "rgba(96, 165, 250, 0.1)", text: "#60A5FA" },
  paid: { bg: "rgba(52, 211, 153, 0.1)", text: "#34D399" },
  completed: { bg: "rgba(45, 212, 191, 0.1)", text: "#2DD4BF" },
  declined: { bg: "rgba(248, 113, 113, 0.1)", text: "#F87171" }
};

export default function CADashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Bookings");
  const [kycStatus, setKycStatus] = useState("approved");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, eRes, profileRes] = await Promise.all([
        fetch("/api/marketplace/ca/bookings"),
        fetch("/api/marketplace/ca/earnings"),
        fetch("/api/auth/me")
      ]);
      const bData = await bRes.json();
      const eData = await eRes.json();
      const profileData = await profileRes.json();
      
      setBookings(bData.bookings || []);
      setEarnings(eData);
      setKycStatus(profileData.user.kyc_status || "pending");
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "accept" | "decline") => {
    await fetch("/api/marketplace/bookings/action", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action })
    });
    fetchData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Earnings":
        return (
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(181, 255, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Wallet size={16} color="#B5FF2E" />
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 700 }}>Financial Architecture</h2>
            </div>
            
            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", marginBottom: "32px" }}>
               <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: "12px" }}>Neural Payout Balance</p>
               <h3 style={{ fontSize: "56px", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#B5FF2E", letterSpacing: "-2px", marginBottom: "24px" }}>₹{(earnings?.pending_payout_paise / 100 || 0).toLocaleString()}</h3>
               <button style={{ padding: "16px 32px", background: "#B5FF2E", color: "#000", border: "none", borderRadius: "100px", fontWeight: 800, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                 Withdraw to Bank <ArrowUpRight size={18} />
               </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
               <div style={{ background: "rgba(255,255,255,0.02)", border: "0.1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
                  <p style={{ fontWeight: 700, marginBottom: "20px" }}>Settlement History</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                     {[1,2,3].map(i => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "12px", borderBottom: "0.1px solid rgba(255,255,255,0.05)" }}>
                           <span style={{ color: "rgba(255,255,255,0.5)" }}>Apr {10+i}, 2026</span>
                           <span style={{ fontWeight: 700 }}>₹4,500.00</span>
                           <span style={{ color: "#34D399" }}>Settled</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div style={{ background: "rgba(255,255,255,0.02)", border: "0.1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
                  <p style={{ fontWeight: 700, marginBottom: "20px" }}>Tax Projections</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Your estimated GST liability for Q2 is ₹12,400. We recommend setting aside 18% of every settlement into your secure vault.</p>
               </div>
            </div>
          </section>
        );
      case "Activity":
        return (
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(181, 255, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Activity size={16} color="#B5FF2E" />
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 700 }}>Neural Stream</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
               {bookings.map((b, i) => (
                  <div key={b.id} style={{ padding: "24px", borderLeft: "2px solid rgba(181, 255, 46, 0.2)", position: "relative", marginBottom: "8px" }}>
                     <div style={{ width: "10px", height: "10px", background: "#B5FF2E", borderRadius: "50%", position: "absolute", left: "-6px", top: "30px", boxShadow: "0 0 10px #B5FF2E" }} />
                     <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{b.status === "requested" ? "Incoming Request" : "Session Update"}: {b.marketplace_users.name}</p>
                     <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{new Date(b.created_at).toLocaleString()} · Protocol {b.status.toUpperCase()}</p>
                  </div>
               ))}
            </div>
          </section>
        );
      case "Settings":
        return (
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(181, 255, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Settings size={16} color="#B5FF2E" />
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 700 }}>Profile Architecture</h2>
            </div>
            <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>
               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Professional Bio</label>
                  <textarea defaultValue="Expert CA with 10+ years in GST litigation and high-net-worth tax planning." style={{ background: "rgba(255,255,255,0.03)", border: "0.1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", minHeight: "100px", outline: "none" }} />
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                     <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Advisory Rate (₹)</label>
                     <input type="number" defaultValue="4999" style={{ background: "rgba(255,255,255,0.03)", border: "0.1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "#fff", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                     <label style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Availability Protocol</label>
                     <select style={{ background: "rgba(255,255,255,0.03)", border: "0.1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "#fff", outline: "none" }}>
                        <option>Open for High Priority</option>
                        <option>DND Mode</option>
                        <option>Scheduled Only</option>
                     </select>
                  </div>
               </div>
               <button style={{ alignSelf: "flex-start", padding: "14px 32px", background: "rgba(181, 255, 46, 0.1)", color: "#B5FF2E", border: "1px solid #B5FF2E", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Save Configuration</button>
            </div>
          </section>
        );
      default:
        return (
          <>
            {/* ── Statistics Grid ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "64px" }}>
              {[
                { label: "Total Revenue Generated", val: `₹${(earnings?.total_earned_paise / 100 || 0).toLocaleString()}`, icon: <TrendingUp size={20} />, trend: "+12.5%" },
                { label: "Neutral Settlements Pending", val: `₹${(earnings?.pending_payout_paise / 100 || 0).toLocaleString()}`, icon: <Wallet size={20} />, color: "#B5FF2E" },
                { label: "Active Advisory Count", val: earnings?.session_count || 0, icon: <Users size={20} />, trend: "Elite Status" }
              ].map((stat, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "0.1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>{stat.icon}</div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: "8px" }}>{stat.label}</p>
                  <p style={{ fontSize: "36px", fontWeight: 800, color: stat.color || "#fff", fontFamily: "'Syne', sans-serif" }}>{stat.val}</p>
                  {stat.trend && <div style={{ position: "absolute", top: "24px", right: "24px", fontSize: "12px", color: "#B5FF2E", fontWeight: 800, background: "rgba(181, 255, 46, 0.1)", padding: "4px 10px", borderRadius: "100px" }}>{stat.trend}</div>}
                </div>
              ))}
            </div>

            {/* ── Immediate Advisory Requests ── */}
            <section style={{ marginBottom: "64px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(251, 191, 36, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <Clock size={16} color="#FBBF24" />
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>Priority Requests</h2>
                </div>
                <Link href="/ca-onboarding" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: 700 }}>Update Profile Architecture →</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {bookings.filter(b => b.status === "requested").length === 0 ? (
                  <div style={{ padding: "48px", textAlign: "center", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "24px" }}>
                    <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px", fontStyle: "italic" }}>No new advisory requests detected in the neural stream.</p>
                  </div>
                ) : (
                  bookings.filter(b => b.status === "requested").map(b => (
                    <div key={b.id} className="request-card" style={{ background: "rgba(255,255,255,0.03)", border: "0.1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }}>
                      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", color: "#B5FF2E", fontSize: "18px", fontWeight: 800 }}>{b.marketplace_users.name[0]}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                            <span style={{ fontWeight: 800, fontSize: "18px" }}>{b.marketplace_users.name}</span>
                            <div style={{ background: "rgba(181, 255, 46, 0.1)", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", color: "#B5FF2E", fontWeight: 800, textTransform: "uppercase" }}>High Priority</div>
                          </div>
                          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "16px", maxWidth: "480px", lineHeight: 1.6 }}>"{b.notes}"</p>
                          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>
                            <span>REQ ID: {b.id.slice(0, 12)}</span>
                            <span>DATE: {new Date(b.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ textAlign: "right", marginRight: "24px" }}>
                          <p style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>₹{(b.amount_paise / 100).toLocaleString()}</p>
                          <p style={{ fontSize: "11px", color: "rgba(181,255,46,0.6)", fontWeight: 700 }}>Settlement: ₹{(b.ca_payout_paise / 100).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleAction(b.id, "accept")} style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#B5FF2E", color: "#000", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} title="Accept Request">
                          <Check size={22} strokeWidth={3} />
                        </button>
                        <button onClick={() => handleAction(b.id, "decline")} style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,80,80,0.1)", color: "#FF5050", border: "0.1px solid rgba(255,80,80,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} title="Decline Request">
                          <X size={22} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ── Global Advisory Portfolio ── */}
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(52, 211, 153, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <ShieldCheck size={16} color="#34D399" />
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>Sovereign Portfolio</h2>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "0.1px solid rgba(255,255,255,0.08)", borderRadius: "24px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "0.1px solid rgba(255,255,255,0.08)", textAlign: "left" }}>
                      <th style={{ padding: "20px 24px", fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Client Architecture</th>
                      <th style={{ padding: "20px 24px", fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Status Protocol</th>
                      <th style={{ padding: "20px 24px", fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Financial Volume</th>
                      <th style={{ padding: "20px 24px", fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Execution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => b.status !== "requested" && b.status !== "declined").length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No active sessions in the current cycle.</td>
                      </tr>
                    ) : (
                      bookings.filter(b => b.status !== "requested" && b.status !== "declined").map(b => (
                        <tr key={b.id} style={{ borderBottom: "0.1px solid rgba(255,255,255,0.05)", transition: "all 0.1s" }} className="table-row">
                          <td style={{ padding: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                               <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>{b.marketplace_users.name[0]}</div>
                               <div>
                                  <p style={{ fontWeight: 800, fontSize: "14px", margin: 0 }}>{b.marketplace_users.name}</p>
                                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>SID: {b.id.slice(0,10)}</p>
                               </div>
                            </div>
                          </td>
                          <td style={{ padding: "24px" }}>
                            <span style={{ 
                              fontSize: "10px", fontWeight: 800, padding: "6px 14px", borderRadius: "100px", 
                              background: STATUS_COLORS[b.status]?.bg || "rgba(255,255,255,0.05)", 
                              color: STATUS_COLORS[b.status]?.text || "#fff", 
                              textTransform: "uppercase", letterSpacing: "0.5px" 
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: "24px" }}>
                             <p style={{ fontSize: "15px", fontWeight: 800, margin: 0 }}>₹{(b.amount_paise / 100).toLocaleString()}</p>
                             <p style={{ fontSize: "10px", color: "#B5FF2E", fontWeight: 700, opacity: 0.6 }}>Settled: Yes</p>
                          </td>
                          <td style={{ padding: "24px" }}>
                            {b.status === "paid" ? (
                              <button style={{ 
                                padding: "10px 20px", background: "rgba(181,255,46,0.1)", color: "#B5FF2E", 
                                border: "1px solid rgba(181, 255, 46, 0.3)", borderRadius: "100px", 
                                fontSize: "11px", fontWeight: 800, cursor: "pointer", 
                                textTransform: "uppercase", letterSpacing: "1px" 
                              }}>
                                Complete Session
                              </button>
                            ) : b.status === "completed" ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 700 }}>
                                 <Check size={14} /> Archiving Ready
                              </div>
                            ) : (
                              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>Awaiting Payment...</span>
                            )}
                          </td>
                        </tr>
                      )).reverse() // Most recent first
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "24px" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(181, 255, 46, 0.1)", borderTopColor: "#B5FF2E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#B5FF2E", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Synchronizing Neural Vault...</p>
        <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", color: "#fff", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      
      {/* ── Sidebar ── */}
      <aside style={{ width: "280px", borderRight: "0.1px solid rgba(255,255,255,0.1)", padding: "48px 24px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 8px 48px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
             <div style={{ background: "#B5FF2E", color: "#000", padding: "8px 12px", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px" }}>maCA</div>
             <span style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Professional</span>
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "0.1px solid rgba(255,255,255,0.08)" }}>
             <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #111, #222)", display: "flex", alignItems: "center", justifyContent: "center", border: "0.1px solid rgba(255,255,255,0.1)" }}>
                <User size={18} color="#B5FF2E" />
             </div>
             <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Professional Account</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>ICAI Registered</p>
             </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Bookings", icon: <LayoutDashboard size={18} /> },
            { label: "Earnings", icon: <Wallet size={18} /> },
            { label: "Activity", icon: <Activity size={18} /> },
            { label: "Settings", icon: <Settings size={18} /> }
          ].map(item => (
            <button 
              key={item.label} 
              onClick={() => setActiveTab(item.label)}
              style={{ 
                display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px", 
                color: activeTab === item.label ? "#B5FF2E" : "rgba(255,255,255,0.4)", 
                background: activeTab === item.label ? "rgba(181, 255, 46, 0.08)" : "transparent", 
                border: "none", fontSize: "14px", fontWeight: activeTab === item.label ? 700 : 500, 
                cursor: "pointer", transition: "all 0.2s", textAlign: "left"
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "0.1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
           <button style={{ width: "100%", padding: "14px", background: "transparent", border: "0.1px solid rgba(255,80,80,0.3)", borderRadius: "12px", color: "#FF5050", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <X size={14} /> Termination Session
           </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "64px 80px", background: "radial-gradient(circle at top right, rgba(181, 255, 46, 0.03), transparent 40%)" }}>
        
        {/* Header Section */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px" }}>
           <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "40px", fontWeight: 800, color: "#B5FF2E", letterSpacing: "-1.5px", marginBottom: "8px" }}>PROFESSIONAL ARCHITECTURE</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 500 }}>Managing elite tax advisory and marketplace settlements.</p>
           </div>
           
           <div style={{ display: "flex", gap: "16px" }}>
             {kycStatus !== "approved" && (
                <div style={{ background: kycStatus === "pending" ? "rgba(251, 191, 36, 0.1)" : "rgba(248, 113, 113, 0.1)", border: `1px solid ${kycStatus === "pending" ? "#FBBF24" : "#F87171"}`, padding: "12px 24px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <ShieldCheck size={18} color={kycStatus === "pending" ? "#FBBF24" : "#F87171"} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 800, color: "#fff", margin: 0 }}>KYC STATUS: {kycStatus.toUpperCase()}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                      {kycStatus === "pending" ? "Review in progress by Admin" : "Rejected. Please re-upload ICAI docs."}
                    </p>
                  </div>
                </div>
             )}
             <div style={{ background: "rgba(255,255,255,0.03)", border: "0.1px solid rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#B5FF2E", boxShadow: "0 0 10px #B5FF2E" }} />
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#B5FF2E", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Live</span>
             </div>
           </div>
        </header>

        {renderContent()}

      </main>

      <style jsx global>{`
        .request-card:hover {
          transform: translateY(-2px);
          border-color: rgba(181, 255, 46, 0.3) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .table-row:hover {
          background: rgba(255, 255, 255, 0.01);
        }
      `}</style>
    </div>
  );
}
