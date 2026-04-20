"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Shield, Settings, Menu, Bell, Home, Search, Globe2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [role, setRole] = useState<string>("User");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user as { email?: string });
        
        // Fetch role from marketplace_users
        const { data: userData } = await supabase
          .from("marketplace_users")
          .select("role")
          .eq("email", session.user.email)
          .single();
        
        if (userData?.role) {
          setRole(userData.role.toUpperCase());
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="top-navbar" style={{ position: "relative", zIndex: 9999 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {onMenuClick && (
          <button 
            onClick={onMenuClick} 
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: "4px" }}
          >
            <Menu size={24} />
          </button>
        )}
        <Link href="/" style={{ background: "none", border: "0.5px solid #1a1a1a", color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}>
          <Home size={16} />
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Home</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", background: "#080808", border: "0.5px solid #1a1a1a", borderRadius: "8px" }}>
           <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--acid)" }} />
           <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--acid)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kernel Stable</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
         <button style={{ background: "none", border: "none", color: "var(--acid)", cursor: "pointer" }}><Bell size={18} /></button>
         
         <div style={{ position: "relative" }}>
           <button 
             onClick={() => setShowProfile(!showProfile)}
             style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#111", border: "0.5px solid #222", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
           >
             <User size={16} color={showProfile ? "var(--acid)" : "rgba(255,255,255,0.5)"} />
           </button>

           {showProfile && (
             <div style={{ 
               position: "absolute", 
               top: "140%", 
               right: 0, 
               width: "240px", 
               background: "rgba(8,8,8,0.95)", 
               backdropFilter: "blur(20px)",
               border: "1px solid rgba(255,255,255,0.08)", 
               borderRadius: "16px", 
               padding: "8px", 
               boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
               zIndex: 10000 
             }}>
               <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "8px" }}>
                 <p style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{user?.email?.split('@')[0]}</p>
                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                   <Shield size={10} color="var(--acid)" />
                   <p style={{ fontSize: "10px", fontWeight: 800, color: "var(--acid)", textTransform: "uppercase", letterSpacing: "1px" }}>{role}</p>
                 </div>
               </div>

               <button 
                 onClick={() => {
                   setShowProfile(false);
                   const isDevPage = window.location.pathname.includes("/developers");
                   if (isDevPage) {
                     router.push("/dashboard");
                   } else {
                     router.push("/developers");
                   }
                 }}
                 style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "10px", color: "var(--acid)", fontSize: "13px", border: "1px dashed var(--acid)", background: "rgba(181,255,46,0.05)", cursor: "pointer", transition: "0.2s", marginBottom: "8px" }}
               >
                 <Zap size={16} /> Switch to {window.location.pathname.includes("/developers") ? "AI Dashboard" : "Developer Portal"}
               </button>

               <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "10px", color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                 <Home size={16} /> Dashboard
               </Link>
               
               <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "10px", color: "#ff4d4d", fontSize: "13px", border: "none", background: "none", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,77,77,0.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                 <LogOut size={16} /> Sign Out of Empire
               </button>
             </div>
           )}
         </div>
      </div>
    </header>
  );
}
