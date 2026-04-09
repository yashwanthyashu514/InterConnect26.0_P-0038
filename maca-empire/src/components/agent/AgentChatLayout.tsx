"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ConversationItem {
  id: string;
  preview: string;
  timestamp: string;
}

interface AgentChatLayoutProps {
  agentName: string;
  agentIcon: string;
  agentDescription: string;
  agentTagline?: string;
  accentColor?: string;
  children: React.ReactNode; // main chat content (messages + empty state)
  rightPanel?: React.ReactNode; // optional right panel
  extraTopBarContent?: React.ReactNode;
  conversations?: ConversationItem[];
}

const defaultConversations: ConversationItem[] = [
  { id: "1", preview: "Calculate my tax liability for FY...", timestamp: "2h ago" },
  { id: "2", preview: "What deductions apply under Sec...", timestamp: "Yesterday" },
  { id: "3", preview: "Draft a notice reply for my GST...", timestamp: "2d ago" },
];

export default function AgentChatLayout({
  agentName,
  agentIcon,
  agentDescription,
  accentColor = "var(--acid)",
  children,
  rightPanel,
  extraTopBarContent,
  conversations = defaultConversations,
}: AgentChatLayoutProps) {
  const [activeConv, setActiveConv] = useState("1");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* ── Left Sidebar ── */}
      <aside className="chat-sidebar">
        {/* Agent Header */}
        <div style={{ padding: "20px 16px", borderBottom: "0.5px solid var(--border-subtle)" }}>
          <Link href="/" style={{ display: "flex", width: "fit-content", alignItems: "center", textDecoration: "none", marginBottom: "20px", background: "#080B07", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(181, 255, 46, 0.2)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#B5FF2E", letterSpacing: "-0.4px" }}>
              maCA
            </span>
          </Link>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "44px", height: "44px", background: "var(--acid-muted)", border: "0.5px solid var(--border-acid)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              {agentIcon}
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "2px" }}>{agentName}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{agentDescription}</p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", padding: "12px 16px 6px", fontFamily: "'DM Sans', sans-serif" }}>
            Recent
          </p>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`history-item ${activeConv === conv.id ? "active" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>
                {conv.preview}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                {conv.timestamp}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ padding: "16px", borderTop: "0.5px solid var(--border-subtle)", display: "flex", gap: "8px" }}>
          <button className="btn-primary" style={{ flex: 1, fontSize: "13px", padding: "10px 16px", justifyContent: "center" }}>
            + New Chat
          </button>
          <Link href="/dashboard" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", border: "0.5px solid var(--border-subtle)", borderRadius: "10px", fontSize: "16px", color: "var(--text-secondary)", textDecoration: "none" }}>
            ⚙️
          </Link>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Top Bar */}
        <div className="chat-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>{agentIcon}</span>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>{agentName}</p>
            </div>
          </div>
          <span className="status-online">Online</span>
          {extraTopBarContent}
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button style={{ padding: "6px 14px", background: "var(--surface)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Export ↑
            </button>
            <button style={{ padding: "6px 14px", background: "var(--surface)", border: "0.5px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Share ⤢
            </button>
          </div>
        </div>

        {/* Messages / Content Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div className="chat-messages" style={{ flex: 1 }}>
            {children}
          </div>
          {rightPanel && (
            <div style={{ width: "320px", borderLeft: "0.5px solid var(--border-subtle)", overflowY: "auto", background: "var(--bg-secondary)" }}>
              {rightPanel}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <ChatInputBar />
      </main>
    </div>
  );
}

function ChatInputBar() {
  const [value, setValue] = useState("");

  return (
    <div className="chat-input-bar">
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "8px", background: "var(--bg-tertiary)", border: "0.5px solid var(--border-subtle)", borderRadius: "12px", padding: "10px 14px", transition: "border-color 0.2s" }}>
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px", padding: "2px", flexShrink: 0 }}>📎</button>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask anything legal or financial..."
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--text-primary)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, maxHeight: "120px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px", padding: "2px", flexShrink: 0 }}>🎤</button>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "10px 20px", fontSize: "14px", borderRadius: "12px", flexShrink: 0 }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}
