"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, Loader2, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SecureChatPage() {
  const params = useParams();
  const bookingId = (params?.bookingId as string) || "";
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Get Me
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setCurrentUser(meData.user);

      // 2. Get Booking
      const bRes = await fetch(`/api/marketplace/bookings/${bookingId}`);
      const bData = await bRes.json();
      
      if (bData.booking.status !== "paid" && bData.booking.status !== "completed") {
        alert("Chat locked until payment is confirmed.");
        router.push("/dashboard");
        return;
      }
      setBooking(bData.booking);

      // 3. Get History
      const { data: history } = await supabase
        .from("marketplace_chats")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      
      setMessages(history || []);
      setLoading(false);

      // 4. Subscribe to Realtime
      const channel = supabase.channel(`chat:${bookingId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "marketplace_chats", filter: `booking_id=eq.${bookingId}` }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    };
    init();
  }, [bookingId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = newMessage;
    setNewMessage("");

    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, message: msg })
    });
  };

  if (loading) return <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" color="#B5FF2E" /></div>;

  return (
    <div style={{ background: "#000", height: "100vh", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href={currentUser?.role === "ca" ? "/ca-dashboard" : "/dashboard"} style={{ color: "rgba(255,255,255,0.4)" }}><ArrowLeft size={20} /></Link>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              Secure Advisory Stream <ShieldCheck size={14} color="#B5FF2E" />
            </h2>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Engagement ID: {bookingId.slice(0, 8)}... | E2E Encrypted Architecture</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {messages.map((m, i) => {
          const isMe = m.sender_id === currentUser.user_id;
          return (
            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "60%", background: isMe ? "#B5FF2E" : "rgba(255,255,255,0.05)", color: isMe ? "#000" : "#fff", padding: "16px 24px", borderRadius: isMe ? "24px 24px 4px 24px" : "24px 24px 24px 4px", border: isMe ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, lineHeight: 1.6 }}>{m.message}</p>
                <p style={{ margin: "8px 0 0", fontSize: "10px", opacity: 0.5, textAlign: "right" }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding: "32px 40px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Transmission frequency open... type message" 
            style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "20px 80px 20px 32px", color: "#fff", outline: "none", fontSize: "14px" }} 
          />
          <button type="submit" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "#B5FF2E", border: "none", width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={18} color="#000" />
          </button>
        </div>
      </form>
    </div>
  );
}
