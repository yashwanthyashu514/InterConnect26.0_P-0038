"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home, Bot, Briefcase, Calendar, Zap, Bell,
  Search, FileText, Landmark, AlertTriangle, DollarSign,
  Lock, Mic, FileSignature, Scale, TrendingUp, Shield,
  HardHat, Globe, Wallet, Building2, PenTool, Rocket,
  Package, ShieldAlert, Coins, Leaf, ScrollText, MessageSquare,
  Files, Clock, CheckCircle2, User, Users, Menu, X,
  Activity, Server, Cpu, Globe2, Scan, Database, Info,
  Gem, Banknote, Loader2, Code2, Download, Mic2, Brain, Gavel
} from "lucide-react";

import { AGENTS, EMPIRE_AGENTS } from "@/lib/agents";
import AppHeader from "@/components/shared/AppHeader";

export const dynamic = "force-dynamic";

type DashboardStats = Record<string, unknown>;

type Booking = {
  id: string;
  status: string;
  amount_paise: number;
  notes: string;
  created_at: string;
  ca_profiles?: {
    marketplace_users?: {
      name?: string;
    };
  };
};

type RazorpayResponse = Record<string, unknown>;

type RazorpayConstructor = new (options: unknown) => { open: () => void };

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}


const getAgentIcon = (id: string, size = 18) => {
  switch (id) {
    case "A0": return <Cpu size={size} />;
    case "A1": return <FileText size={size} />;
    case "A2": return <Landmark size={size} />;
    case "A3": return <AlertTriangle size={size} />;
    case "A4": return <DollarSign size={size} />;
    case "A5": return <Rocket size={size} />;
    case "A6": return <Mic2 size={size} />;
    case "A7": return <Search size={size} />;
    case "A8": return <Scale size={size} />;
    case "A12": return <Lock size={size} />;
    case "A13": return <Globe size={size} />;
    case "A21": return <ShieldAlert size={size} />;
    case "A23": return <Leaf size={size} />;
    case "A24": return <ScrollText size={size} />;
    case "A22": return <Coins size={size} />;
    case "A25": return <Brain size={size} />;
    case "A26": return <TrendingUp size={size} />;
    case "A27": return <Gem size={size} />;
    case "A28": return <Banknote size={size} />;
    case "E1": return <Scale size={size} />;
    case "E2": return <Gavel size={size} />;
    case "E3": return <Building2 size={size} />;
    case "E4": return <Shield size={size} />;
    case "E5": return <Zap size={size} />;
    default: return <Bot size={size} />;
  }
};

const empireAgents = EMPIRE_AGENTS.map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 24),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
  subAgents: agent.subAgents
}));

const advancedSpecialists = AGENTS.filter(a => a.id !== "A0").map(agent => ({
  id: agent.id,
  name: agent.name,
  icon: getAgentIcon(agent.id, 18),
  desc: agent.description,
  tag: agent.category,
  href: agent.path,
}));

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const allSearchable = [...EMPIRE_AGENTS, ...AGENTS];
  const filteredAgents = searchQuery.trim() === "" 
    ? [] 
    : allSearchable.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const [bookings, setBookings] = useState<Booking[]>([]);
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

  const handlePayment = async (booking: Booking) => {
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
        handler: async (response: RazorpayResponse) => {
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

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      const rzp = new window.Razorpay(options);
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
            { id: "developer-api", icon: <Code2 size={18} />, label: "Developer API", href: "/developers" },
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
        
        <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Strategic Dashboard Panel */}

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

            {/* Architecture Feed (Empire Master Agents) */}
            <div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ padding: "4px 8px", background: "var(--acid)", color: "#000", fontSize: "10px", fontWeight: 900, borderRadius: "4px" }}>LEVEL 3</div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>Empire Master Agents</h2>
                  </div>
               </div>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 100%, 380px), 1fr))", gap: "24px", marginBottom: "80px" }}>
                  {empireAgents.map(a => (
                    <Link key={a.id} href={a.href} style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #000000 100%)", border: "1px solid rgba(181,255,46,0.15)", borderRadius: "32px", padding: "32px", textDecoration: "none", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", position: "relative", overflow: "hidden" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.borderColor = "var(--acid)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(181,255,46,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(181,255,46,0.15)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "24px" }}>
                        <div style={{ width: "64px", height: "64px", background: "rgba(181,255,46,0.05)", border: "1px solid rgba(181,255,46,0.2)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acid)" }}>{a.icon}</div>
                        <div>
                           <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff", marginBottom: "4px" }}>{a.name}</p>
                           <p style={{ fontSize: "10px", color: "var(--acid)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Master Class</p>
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "24px" }}>{a.desc}</p>
                      
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                         {a.subAgents.map((sub, i) => (
                           <span key={i} style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", background: "rgba(255,255,255,0.03)", padding: "4px 10px", borderRadius: "100px", border: "0.5px solid rgba(255,255,255,0.1)" }}>{sub}</span>
                         ))}
                      </div>
                    </Link>
                  ))}
               </div>
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
                          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F3F4F6", fontSize: "13px" }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 600, color: "#000" }}>{b.ca_profiles?.marketplace_users?.name} · Advisory</span>
                              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0" }}>TxID: {b.id.slice(0,8).toUpperCase()}</p>
                            </div>
                            <span style={{ color: "#6B7280", margin: "0 20px" }}>{new Date(b.created_at).toLocaleDateString()}</span>
                            <span style={{ fontWeight: 800, color: "#000", margin: "0 20px" }}>₹{(b.amount_paise / 100).toLocaleString()}</span>
                            <button 
                              onClick={() => {
                                const receipt = {
                                  tx_id: b.id,
                                  ca: b.ca_profiles?.marketplace_users?.name,
                                  amount: b.amount_paise / 100,
                                  timestamp: new Date().toISOString(),
                                  notary_seal: "IMPERIO-NEURAL-BLOCKCHAIN-SIGNED-" + Math.random().toString(36).substring(7).toUpperCase()
                                };
                                const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `NeuralReceipt_${b.id.slice(0,8)}.json`;
                                a.click();
                              }}
                              style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F3F4F6", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: "#000" }}
                            >
                              <Download size={12} /> Neural Receipt
                            </button>
                          </div>
                        ))
                      )}
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
