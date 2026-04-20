"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Shield, LogOut, ChevronRight, Activity, Zap, Info, ArrowLeft, Gem, Mail, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      // Fetch additional profile data
      const { data } = await supabase
        .from("marketplace_users")
        .select("*")
        .eq("email", session.user.email)
        .single();
      
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Zap className="animate-pulse" color="#B5FF2E" size={40} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ── Navigation ── */}
      <nav style={{ padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)" }}>
          <ArrowLeft size={18} /> <span style={{ fontSize: "14px", fontWeight: 700 }}>Back to Empire</span>
        </Link>
        <button onClick={handleLogout} style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", color: "#ff4d4d", padding: "10px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
          Sign Out
        </button>
      </nav>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Profile Header */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "60px 40px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
           <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "radial-gradient(circle at top right, rgba(181,255,46,0.05) 0%, transparent 70%)" }} />
           
           <div style={{ display: "flex", gap: "40px", alignItems: "center", position: "relative", zIndex: 2 }}>
              <div style={{ width: "120px", height: "120px", borderRadius: "40px", background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(181,255,46,0.2)" }}>
                 <User size={60} color="#000" />
              </div>
              <div>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                   <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "40px", margin: 0 }}>{profile?.full_name || profile?.name || "Sovereign Citizen"}</h1>
                   <div style={{ background: "rgba(181,255,46,0.15)", border: "1px solid #B5FF2E", padding: "4px 12px", borderRadius: "100px" }}>
                     <span style={{ color: "#B5FF2E", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{profile?.role || "USER"}</span>
                   </div>
                 </div>
                 <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                       <Mail size={16} color="var(--acid)" /> {user?.email}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                       <Shield size={14} /> Password Secured by Empire Protocol
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
           {[
             { icon: <Zap size={20} />, label: "Security Status", val: "Operational" },
             { icon: <Gem size={20} />, label: "Empire Rating", val: "Tier 1 Elite" },
             { icon: <Activity size={20} />, label: "Neural Access", val: "Unlocked" }
           ].map((s, i) => (
             <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ color: "var(--acid)", marginBottom: "16px" }}>{s.icon}</div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px" }}>{s.label}</p>
                <p style={{ fontSize: "20px", fontWeight: 600, marginTop: "4px" }}>{s.val}</p>
             </div>
           ))}
        </div>

        {/* Action List */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", overflow: "hidden" }}>
           {[
             { icon: <Zap />, label: "Identity Verification", sub: "Verify your PAN/Aadhar for elite access.", href: "/onboarding", accent: "var(--acid)" },
             { icon: <Shield />, label: "Privacy Protocol", sub: "Manage your India-first data sovereignty settings.", href: "/profile" },
             { icon: <Info />, label: "Institutional Support", sub: "Connect with lead partners in Gift City.", href: "/b2b" }
           ].map((item, i) => (
             <Link key={i} href={item.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px 40px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
               <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                 <div style={{ color: item.accent || "rgba(255,255,255,0.3)" }}>{item.icon}</div>
                 <div>
                   <p style={{ fontWeight: 700, fontSize: "16px", color: "#fff", marginBottom: "4px" }}>{item.label}</p>
                   <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{item.sub}</p>
                 </div>
               </div>
               <ChevronRight size={20} color="rgba(255,255,255,0.1)" />
             </Link>
           ))}
        </div>

      </main>
    </div>
  );
}
