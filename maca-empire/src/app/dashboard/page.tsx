"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home, Bot, Briefcase, Calendar, Zap, Bell,
  Search, FileText, Landmark, AlertTriangle, DollarSign,
  Lock, Mic, FileSignature, Scale, TrendingUp, Shield,
  HardHat, Globe, Wallet, Building2, PenTool, Rocket,
  Package, ShieldAlert, Coins, Leaf, ScrollText, MessageSquare, Files, Clock, CheckCircle2, User, Users, Menu, X, Activity, Server, Cpu, Globe2, Scan, Database, Info, Gem, Banknote, Loader2
} from "lucide-react";

import { AGENTS } from "@/lib/agents";

export const dynamic = "force-dynamic";


const getAgentIcon = (id: string, size = 18) => {
  switch (id) {
    case "A0": return <Cpu size={size} />;
    case "A1": return <FileText size={size} />;
    case "A2": return <Landmark size={size} />;
    case "A3": return <Scale size={size} />;
    case "A4": return <Users size={size} />;
    case "A5": return <Rocket size={size} />;
    case "A6": return <Mic size={size} />;
    case "A7": return <PenTool size={size} />;
    case "A8": return <Files size={size} />;
    case "A12": return <ShieldAlert size={size} />;
    case "A13": return <Globe size={size} />;
    case "A23": return <Leaf size={size} />;
    case "A24": return <ScrollText size={size} />;
    case "A22": return <Coins size={size} />;
    case "A25": return <Shield size={size} />;
    case "A26": return <TrendingUp size={size} />;
    case "A27": return <Gem size={size} />;
    case "A28": return <Banknote size={size} />;
    default: return <Bot size={size} />;
  }
};

// Featured Crown Layer agents first, then next top agents
const topAgents = [
  ...AGENTS.filter(a => ["A27", "A28", "A0", "A26", "A24"].includes(a.id))
    .sort((a, b) => ["A27", "A28", "A0", "A26", "A24"].indexOf(a.id) - ["A27", "A28", "A0", "A26", "A24"].indexOf(b.id))
].map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 20),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
}));

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredAgents = searchQuery.trim() === "" 
    ? [] 
    : AGENTS.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/dashboard/stats");
      const stats = await statsRes.json();
      setData(stats);

      const bRes = await fetch("/api/marketplace/user/bookings");
      const bData = await bRes.json();
      setBookings(bData.bookings || []);
    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePayment = async (booking: any) => {
    try {
      // 1. Set status to processing (optimistic UI)
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: "processing" } : b));

      // 2. Create Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.id, amount_paise: booking.amount_paise })
      });
      const { order_id } = await orderRes.json();

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: booking.amount_paise,
        currency: "INR",
        name: "maCA Empire",
        description: `Consultation with ${booking.ca_profiles?.marketplace_users?.name}`,
        order_id: order_id,
        handler: async (response: any) => {
          // 4. Verify Payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              booking_id: booking.id
            })
          });
          
          if (verifyRes.ok) {
            fetchDashboardData();
          } else {
            alert("Payment verification failed. Webhook will handle it.");
          }
        },
        theme: { color: "#B5FF2E" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      alert("Checkout failed.");
      fetchDashboardData();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000000", position: "relative", overflowX: "hidden", color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar Backdrop ── */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "active" : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── Sidebar (Overlay Mode) ── */}
      <aside className="dash-sidebar" style={{ 
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        boxShadow: isSidebarOpen ? "20px 0 50px rgba(0,0,0,0.5)" : "none"
      }}>
        <div style={{ padding: "0 20px 24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ pointerEvents: "auto", textDecoration: "none" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--acid)", letterSpacing: "-0.5px" }}>
              Imperio Neural
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#000", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0", overflowY: "auto" }}>
          <p className="sidebar-section-title" style={{ color: "#6B7280", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, paddingLeft: "28px", marginBottom: "12px" }}>Mission Control</p>
          {[
            { id: "overview", icon: <Home size={18} />, label: "Orchestrator", href: "/dashboard" },
            { id: "agents", icon: <Bot size={18} />, label: "Intelligence Vectors", href: "/agents" },
            { id: "vault", icon: <Briefcase size={18} />, label: "Document Vault", href: "/vault" },
            { id: "calendar", icon: <Calendar size={18} />, label: "Compliance Map", href: "/compliance" },
          ].map((item) => (
            <Link key={item.id} href={item.href} className={`nav-item ${item.href === "/dashboard" ? "active" : ""}`} style={{ padding: "12px 28px" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontWeight: item.href === "/dashboard" ? 700 : 400 }}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="dash-main" style={{ width: "100%", flex: 1, overflow: "hidden", background: "#000000", display: "flex", flexDirection: "column", marginLeft: 0, paddingLeft: 0, transform: "none", transition: "none" }}>
        
        {/* Top Header */}
        <header className="top-navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: "4px" }}
            >
              <Menu size={24} />
            </button>
            <Link href="/" style={{ background: "none", border: "0.5px solid #1a1a1a", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}>
              <Home size={16} />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Home</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", background: "#080808", border: "0.5px solid #1a1a1a", borderRadius: "8px" }}>
               <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--acid)" }} />
               <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--acid)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kernel Stable</span>
            </div>
            {/* Multilingual Engine Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
               <Globe2 size={12} color="rgba(255,255,255,0.4)" />
               <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Responding in English · EN-IN</span>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ background: "#080808", border: isSearchFocused ? "0.5px solid var(--acid)" : "0.5px solid #1a1a1a", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", width: "400px", transition: "all 0.2s" }}>
              <Search size={14} color={isSearchFocused ? "var(--acid)" : "rgba(255,255,255,0.2)"} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search intelligence architecture..." 
                style={{ background: "transparent", border: "none", outline: "none", fontSize: "12px", color: "#fff", width: "100%" }} 
              />
            </div>

            {/* Live Search Results Overlay */}
            {isSearchFocused && searchQuery.trim() !== "" && (
              <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#080808", border: "0.5px solid #1a1a1a", borderRadius: "12px", padding: "8px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", zIndex: 10000 }}>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map(a => (
                    <Link key={a.id} href={a.path} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", transition: "all 0.1s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#111"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: "32px", height: "32px", background: "#000", border: "0.5px solid #222", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acid)" }}>
                        {getAgentIcon(a.id, 14)}
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{a.name}</p>
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "260px" }}>{a.description}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>No operational vectors found.</div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
             <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer" }}><Bell size={18} /></button>
             <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#111", border: "0.5px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <User size={16} color="rgba(255,255,255,0.5)" />
             </div>
          </div>
        </header>

        {/* Strategic Dashboard Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: "clamp(32px, 6vw, 60px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
               <div style={{ minWidth: "280px", flex: 1 }}>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 6vw, 52px)", color: "var(--acid)", letterSpacing: "-2px", marginBottom: "8px", textTransform: "uppercase", lineHeight: 1 }}>Sovereign Command</h1>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>Legacy Elite Intelligence: ₹500Cr+ AUM Financial Stewardship Architecture</p>
               </div>

               {/* Global Compliance Index (GCI) Gauge */}
               <div style={{ display: "flex", alignItems: "center", gap: "24px", background: "#080808", border: "0.5px solid #1a1a1a", padding: "20px 28px", borderRadius: "16px" }}>
                 <div style={{ position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <svg width="52" height="52" viewBox="0 0 52 52">
                     <circle cx="26" cy="26" r="23" fill="none" stroke="#111" strokeWidth="4" />
                     <circle cx="26" cy="26" r="23" fill="none" stroke="var(--acid)" strokeWidth="4" strokeDasharray="144.5" strokeDashoffset="28.9" strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
                   </svg>
                   <span style={{ position: "absolute", fontSize: "14px", fontWeight: 900, color: "var(--acid)" }}>82</span>
                 </div>
                 <div>
                   <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Compliance Index</p>
                   <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stable</p>
                 </div>
               </div>
            </div>

            {/* Architecture Feed (Active Vectors) */}
            <div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>High-Sovereign Vectors</h2>
                  <Link href="/agents" style={{ fontSize: "10px", color: "var(--acid)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", textDecoration: "none" }}>Access Registry →</Link>
               </div>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 100%, 400px), 1fr))", gap: "20px", marginBottom: "60px" }}>
                  {topAgents.map(a => (
                    <Link key={a.id} href={a.href} style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: "24px", padding: "32px", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "var(--acid)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
                      <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ width: "52px", height: "52px", background: "#000", border: "0.5px solid #222", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acid)" }}>{a.icon}</div>
                        <div>
                           <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#000000" }}>{a.name}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{a.desc}</p>
                    </Link>
                  ))}
               </div>

                {/* ── Booking Tracker (M9) ── */}
                <div style={{ marginBottom: "60px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>Empire Engagements</h2>
                    <Link href="/hire-a-ca" style={{ fontSize: "10px", color: "var(--acid)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", textDecoration: "none" }}>Hire Specialist →</Link>
                  </div>

                  {loadingBookings ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader2 className="animate-spin" color="#B5FF2E" /></div>
                  ) : bookings.length === 0 ? (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "24px", padding: "48px", textAlign: "center" }}>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", fontStyle: "italic" }}>No active advisory sessions detected in the neural stream.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {bookings.map(b => (
                        <div key={b.id} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "24px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            <div style={{ width: "40px", height: "40px", background: "#000", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B5FF2E", fontWeight: 800, fontSize: "14px" }}>{b.ca_profiles?.marketplace_users?.name?.[0]}</div>
                            <div>
                              <p style={{ fontWeight: 800, color: "#000", margin: 0, fontSize: "14px" }}>{b.ca_profiles?.marketplace_users?.name}</p>
                              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>{b.notes.substring(0, 30)}...</p>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontSize: "10px", fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", margin: 0 }}>Protocol Status</p>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: b.status === "paid" ? "#10B981" : "#F59E0B", margin: 0 }}>{b.status.toUpperCase()}</p>
                            </div>

                            {b.status === "accepted" && (
                              <button 
                                onClick={() => handlePayment(b)}
                                style={{ background: "#B5FF2E", color: "#000", border: "none", padding: "12px 24px", borderRadius: "100px", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
                                Secure & Pay Account
                              </button>
                            )}
                            {b.status === "processing" && (
                               <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.05)", padding: "10px 20px", borderRadius: "100px" }}>
                                  <Loader2 size={14} className="animate-spin" /> <span style={{ fontSize: "12px", fontWeight: 700 }}>Processing...</span>
                               </div>
                            )}
                            {b.status === "paid" && (
                              <Link href={`/chat/${b.id}`} style={{ background: "#000", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "100px", fontWeight: 800, fontSize: "13px", textDecoration: "none" }}>
                                Join Secure Chat
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auxiliary Management Section (M9 Payment History) */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "24px", padding: "48px", textAlign: "left", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <Server size={20} color="#000" />
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#000000", margin: 0 }}>Transaction Ledger</h3>
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {bookings.filter(b => b.status === "paid" || b.status === "completed").length === 0 ? (
                        <p style={{ fontSize: "13px", color: "#4B5563" }}>No recorded transactions in the Empire ledger.</p>
                      ) : (
                        bookings.filter(b => b.status === "paid" || b.status === "completed").map(b => (
                          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F3F4F6", fontSize: "13px" }}>
                            <span style={{ fontWeight: 600 }}>{b.ca_profiles?.marketplace_users?.name} · Advisory</span>
                            <span style={{ color: "#6B7280" }}>{new Date(b.created_at).toLocaleDateString()}</span>
                            <span style={{ fontWeight: 800 }}>₹{(b.amount_paise / 100).toLocaleString()}</span>
                          </div>
                        ))
                      )}
                   </div>
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Intelligence News Ticker */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "40px", background: "#000", borderTop: "0.5px solid #1a1a1a", display: "flex", alignItems: "center", overflow: "hidden", zIndex: 9000 }}>
        <div style={{ background: "var(--acid)", height: "100%", padding: "0 16px", display: "flex", alignItems: "center", gap: "8px", zIndex: 10 }}>
          <Activity size={14} color="#000" />
          <span style={{ fontSize: "10px", fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: "0.5px" }}>Live Feed</span>
        </div>
        <div className="ticker-scroll" style={{ display: "flex", whiteSpace: "nowrap", alignItems: "center", gap: "40px", padding: "0 40px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>• <b>ORACLE:</b> Market sentiment shift detected in BFSI sector. Volatility hedge recommended.</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>• <b>AUDIT-SHIELD:</b> GST filing deadline in 48 hours for GSTIN-XX21. Auto-drafting response A6...</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>• <b>DPDP-SAFE:</b> New regulation update in EU AI Act. Processing cross-border compliance gap...</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>• <b>HEIRGUARD:</b> 3 Digital Wills finalized for Elite-Tier households in Sector-04.</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>• <b>VOICE-CA:</b> Language lock active (EN-IN). Multinodal interface ready...</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
