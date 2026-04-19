import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, Paperclip, Zap, Code } from 'lucide-react';
import '../index.css';

// Fixed Interface - Prevents TS2345 error
interface Message {
  role: 'user' | 'assistant';
  content: string;
  agent_id?: string;
}

const AGENT_LIST = [
  { id: 'A0', name: 'Command Nexus' },
  { id: 'A1', name: 'Supreme Tax' },
  { id: 'A3', name: 'Notice & Disputes' },
  { id: 'A12', name: 'Forensic Audit' },
  { id: 'A22', name: 'CryptoTax Pro' },
  { id: 'A27', name: 'Elite Wealth' },
  { id: 'A28', name: 'Victor Harlan' },
];

export default function Dashboard() {
  const [activeAgent, setActiveAgent] = useState('A0');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to Supreme Tax Neural Interface. I am Command Nexus — the master orchestrator.',
      agent_id: 'A0'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Phase 1: Local State Update
    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg]; // Snapshot for API call

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Phase 2: Secure API Handshake
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supreme_token')}`
        },
        body: JSON.stringify({
          agent_id: activeAgent,
          messages: updatedMessages, // Use the snapshot to avoid stale state
          conversation_id: `session-${Date.now()}`
        })
      });

      if (!res.ok) throw new Error('Neural Pulse Failure');

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          agent_id: data.agent_id || activeAgent
        }]);
        if (data.agent_id) setActiveAgent(data.agent_id);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'System Congestion. Your request has been logged. Please retry the neural link in 10s.',
        agent_id: activeAgent
      }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="st-layout">
      {/* Sidebar */}
      <aside className="st-sidebar">
        <div className="st-sidebar-header">
          <span className="st-logo">SUPREME TAX</span>
          <div className="st-live-badge">
            <div className="st-live-dot"></div>
            Live
          </div>
        </div>

        <div className="st-agents">
          <p className="st-section-label">Neural Vectors</p>
          {AGENT_LIST.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`st-agent-btn ${activeAgent === agent.id ? 'active' : ''}`}
            >
              <div className="st-agent-icon">
                <Bot size={16} />
              </div>
              <span className="st-agent-name">{agent.name}</span>
            </button>
          ))}
        </div>

        <div className="st-sidebar-footer">
          <div className="st-quota-card">
            <div className="st-quota-row">
              <span>Neural Quota</span>
              <span>12 / 20</span>
            </div>
            <div className="st-quota-bar">
              <div className="st-quota-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
          <button 
            className="st-upgrade-btn" 
            onClick={() => window.location.href = '/billing'}
          >
            Unlock Full Access
          </button>
        </div>
      </aside>

      {/* Main UI */}
      <main className="st-main">
        <header className="st-topbar">
          <div className="st-agent-info">
            <div className="st-agent-avatar"><Bot size={18} /></div>
            <div>
              <div className="st-agent-title">
                {AGENT_LIST.find(a => a.id === activeAgent)?.name || 'Nexus'}
              </div>
              <div className="st-status-badge">
                <div className="st-live-dot"></div>
                Sovereign Mode
              </div>
              <a href="/logs" style={{ fontSize: 10, color: 'var(--acid)', textDecoration: 'none', fontWeight: 800, marginTop: 4, display: 'block', textTransform: 'uppercase' }}>
                View Neural Registry →
              </a>
              <a href="/developer" style={{ fontSize: 10, color: 'var(--text2)', textDecoration: 'none', fontWeight: 800, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
                <Code size={12} /> Developer API →
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Zap size={16} style={{ color: 'var(--acid)', opacity: 0.6 }} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text3)' }}>V4.0</span>
          </div>
        </header>

        <div className="st-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`st-msg-row ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <div style={{ maxWidth: '85%' }}>
                {msg.role === 'assistant' && (
                  <div className="st-msg-meta">
                    {AGENT_LIST.find(a => a.id === msg.agent_id)?.name || 'AI Specialist'}
                  </div>
                )}
                <div className={`st-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="st-msg-row ai">
              <div className="st-typing">
                <div className="st-dot"></div>
                <div className="st-dot"></div>
                <div className="st-dot"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="st-input-area">
          <div className="st-input-bar">
            <button className="st-icon-btn"><Paperclip size={18} /></button>
            <input
              className="st-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`Query ${AGENT_LIST.find(a => a.id === activeAgent)?.name}...`}
            />
            <button className="st-icon-btn"><Mic size={18} /></button>
            <button className="st-send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
          <div className="st-footer-text">
            <span>Neural Integrity Active</span>
            <span>AY 2025-26</span>
            <span>Encrypted Stream</span>
          </div>
        </div>
      </main>
    </div>
  );
}
