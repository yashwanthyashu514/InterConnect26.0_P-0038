"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: any[];
}

interface ConversationItem {
  id: string;
  preview: string;
  timestamp: string;
}

interface AgentChatLayoutProps {
  agentName: string;
  agentIcon: string;
  agentDescription: string;
  agentId?: string;
  children: React.ReactNode; 
  rightPanel?: React.ReactNode; 
  extraTopBarContent?: React.ReactNode;
}

const BACKEND_URL = "http://localhost:8000";

export default function AgentChatLayout({
  agentName,
  agentIcon,
  agentDescription,
  agentId,
  children,
  rightPanel,
  extraTopBarContent,
}: AgentChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Determine Route
      let endpoint = `${BACKEND_URL}/ask`;
      let payload: any = { query: userMsg.content, agent_id: agentId };

      if (agentId === "A21") {
        endpoint = `${BACKEND_URL}/api/agents/dpdp-shield/query`;
        payload = { user_message: userMsg.content };
      } else if (agentId === "A22") {
        endpoint = `${BACKEND_URL}/api/agents/cryptotax-pro/query`;
        payload = { user_message: userMsg.content };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Backend unavailable");

      // Handle Streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg: Message = { role: "assistant", content: "" };
      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.token) {
                  assistantMsg.content += data.token;
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                    return newMsgs;
                  });
                } else if (data.citations) {
                  assistantMsg.citations = data.citations;
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Failed to connect to maCA AGI. Ensure backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* ── Left Sidebar (History & Branding) ── */}
      <aside className="chat-sidebar">
        <div style={{ padding: "20px 16px", borderBottom: "0.5px solid var(--border-subtle)" }}>
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", marginBottom: "20px", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E" }}>maCA</span>
          </Link>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(181, 255, 46, 0.1)", border: "0.5px solid rgba(181, 255, 46, 0.3)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
              {agentIcon}
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px" }}>{agentName}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{agentDescription}</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
           <p style={{ fontSize: "10px", fontWeight: 700, opacity: 0.3, letterSpacing: "1px", textTransform: "uppercase" }}>Session Log</p>
           {messages.filter(m => m.role === 'user').map((m, i) => (
             <div key={i} style={{ padding: "8px 0", fontSize: "12px", opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
               {m.content}
             </div>
           ))}
        </div>
        
        <div style={{ padding: "16px", borderTop: "0.5px solid var(--border-subtle)" }}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setMessages([])}>+ New Chat</button>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
        <div className="chat-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
             <span style={{ fontSize: "20px" }}>{agentIcon}</span>
             <p style={{ fontWeight: 700 }}>{agentName}</p>
          </div>
          {extraTopBarContent}
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
             {messages.length === 0 ? children : (
               <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
                 {messages.map((m, i) => (
                   <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start", animation: "fade-up-anim 0.3s forwards" }}>
                     <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: m.role === "user" ? "var(--surface)" : "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                       {m.role === "assistant" ? agentIcon : "👤"}
                     </div>
                     <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 700 }}>{m.role === "assistant" ? agentName : "You"}</p>
                        <div style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>{m.content}</div>
                        {m.citations && (
                          <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {m.citations.map((c, j) => (
                              <span key={j} style={{ padding: "4px 10px", background: "var(--surface)", border: "0.5px solid var(--border-subtle)", borderRadius: "6px", fontSize: "10px", color: "var(--text-muted)" }}>{c.source}</span>
                            ))}
                          </div>
                        )}
                     </div>
                   </div>
                 ))}
                 {isTyping && <div style={{ fontSize: "12px", color: "var(--acid)", opacity: 0.8 }}>maCA is thinking...</div>}
               </div>
             )}
          </div>
          {rightPanel && <div style={{ width: "320px", borderLeft: "0.5px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>{rightPanel}</div>}
        </div>

        {/* ── Input Bar ── */}
        <div className="chat-input-bar">
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: "16px", padding: "12px 20px" }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything..."
                rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--text-primary)", fontSize: "15px" }}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                style={{ background: isTyping ? "var(--text-muted)" : "var(--acid)", color: "#000", border: "none", borderRadius: "100px", padding: "8px 16px", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}
              >
                {isTyping ? "..." : "Send →"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
