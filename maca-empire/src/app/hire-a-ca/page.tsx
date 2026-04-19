"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, ShieldCheck, MapPin, ChevronRight, Briefcase, Home } from "lucide-react";

interface CAProfile {
  id: string;
  marketplace_users: { name: string };
  specialties: string[];
  bio: string;
  listed_price_paise: number;
  rating: number;
  is_available: boolean;
  profile_photo_url?: string;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function HireACAMarketplace() {
  const [cas, setCas] = useState<CAProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(`${BACKEND}/api/marketplace/cas${filter ? `?specialty=${filter}` : ""}`)
      .then(r => r.json())
      .then(data => {
        setCas(data.cas || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      {/* Hero Section - Light Rhythm */}
      <section style={{ padding: "100px 20px 80px", background: "#f5f5f7", color: "#000", textAlign: "center", borderBottomLeftRadius: "60px", borderBottomRightRadius: "60px", position: "relative", zIndex: 10 }}>
        <Link href="/" style={{ position: "absolute", top: "24px", left: "24px", color: "#000", background: "rgba(0,0,0,0.05)", padding: "10px", borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Home size={20} />
        </Link>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(0,0,0,0.4)" }}>Expert Network</span>
          <h1 style={{ color: "#000", fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 8vw, 56px)", fontWeight: 800, letterSpacing: "-2px", margin: "10px 0 20px", lineHeight: 1 }}>Hire a Sovereign CA.</h1>
          <p style={{ fontSize: "clamp(14px, 4vw, 18px)", color: "rgba(0,0,0,0.6)", lineHeight: 1.6, marginBottom: "40px" }}>
            Connect with India's elite Chartered Accountants specializing in UHNWI wealth structuring, 
            Succession, and Sovereign Tax strategy.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
              <input 
                type="text" 
                placeholder="Search specialty..."
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: "100%", padding: "16px 24px 16px 50px", borderRadius: "100px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "14px", outline: "none" }}
              />
              <Search style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.3)" }} size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section - Dark Rhythm */}
      <section style={{ padding: "60px 20px", background: "#000" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700 }}>Approved Professionals</h2>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", width: "100%", maxWidth: "100%" }} className="no-scrollbar">
              {["All", "GST", "Succession", "ITR", "Forensic"].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s === "All" ? "" : s)}
                  style={{ 
                    padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    background: (filter === s || (s === "All" && !filter)) ? "#B5FF2E" : "rgba(255,255,255,0.05)",
                    color: (filter === s || (s === "All" && !filter)) ? "#000" : "rgba(255,255,255,0.6)",
                    border: "none", transition: "all 0.2s", whiteSpace: "nowrap"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Curating elite network...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {cas.map(ca => (
                <div key={ca.id} style={{ 
                  background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.1)", 
                  borderRadius: "24px", padding: "32px", position: "relative", transition: "all 0.3s"
                }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#B5FF2E66"}>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(181,255,46,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase size={28} color="#B5FF2E" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                        {ca.marketplace_users.name} <ShieldCheck size={16} color="#B5FF2E" />
                      </h3>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "4px 0" }}>Senior Executive CA</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {ca.specialties.map(s => (
                      <span key={s} style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s}</span>
                    ))}
                  </div>

                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, height: "44px", overflow: "hidden", marginBottom: "24px" }}>
                    {ca.bio}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Consultation Fee</span>
                      <p style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>₹{ca.listed_price_paise / 100}</p>
                    </div>
                    <Link href={`/hire-a-ca/${ca.id}`} style={{ 
                      background: "#B5FF2E", color: "#000", padding: "12px 24px", borderRadius: "100px", 
                      fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" 
                    }}>
                      Hire <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
