"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bot, Send, Mic, Paperclip, ChevronRight, Search, 
  LayoutDashboard, FileText, CreditCard, LogOut, Menu, X, Bell
} from 'lucide-react';

const AGENT_LIST = [
  { id: 'A0', name: 'Command Nexus', category: 'Auto' },
  { id: 'A1', name: 'Supreme Tax', category: 'Core' },
  { id: 'A3', name: 'Notice & Disputes', category: 'Core' },
  { id: 'A22', name: 'CryptoTax Pro', category: 'Elite' },
  { id: 'A27', name: 'Elite Wealth', category: 'Elite' },
  { id: 'A28', name: 'Victor Harlan', category: 'Elite' },
];

export default function SupremeTaxDashboard() {
  const [activeAgent, setActiveAgent] = useState('A0');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to Supreme Tax Neural Interface. I am Command Nexus. How can I assist with your financial architecture today?', agent_id: 'A0' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input, agent_id: activeAgent };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Simulate 2-3 second delay 
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      const response = await fetch('/api/supreme-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: activeAgent,
          messages: [...messages, userMsg],
          conversation_id: `session-${Date.now()}`
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.reply,
          agent_id: data.agent_id || activeAgent 
        }]);
        if (data.agent_id) setActiveAgent(data.agent_id);
      }
    } catch (err) {
      console.error("Neural Link Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#000000] text-[#F0F4E8] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-[#050505] border-r border-[#1a1a1a] flex flex-col z-20">
        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <Link href="/" className="text-xl font-black italic tracking-tighter text-[#B5FF2E] no-underline">
            SUPREME TAX
          </Link>
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 bg-[#B5FF2E] rounded-full animate-pulse"></div>
             <span className="text-[9px] uppercase font-bold tracking-widest text-[#B5FF2E]">Live</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="w-full bg-[#080808] border border-[#1a1a1a] rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#B5FF2E] transition-all"
            />
          </div>

          <div className="space-y-1">
            <p className="px-2 mb-2 text-[10px] uppercase font-bold text-[#444] tracking-[0.2em]">Neural Vectors</p>
            {AGENT_LIST.map(agent => (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeAgent === agent.id 
                  ? 'bg-[#B5FF2E] text-[#000]' 
                  : 'hover:bg-[#0A0A0A] text-[#888] hover:text-[#fff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeAgent === agent.id ? 'bg-black/10' : 'bg-[#B5FF2E]/10 text-[#B5FF2E]'}`}>
                    <Bot size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">{agent.name}</span>
                </div>
                {activeAgent === agent.id && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="p-4 bg-gradient-to-br from-[#080808] to-[#050505] rounded-2xl border border-[#1a1a1a] mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-[#444] tracking-wider">Neural Quota</span>
              <span className="text-[10px] font-bold text-[#B5FF2E]">12 / 20</span>
            </div>
            <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
              <div className="h-full bg-[#B5FF2E] transition-all" style={{ width: '60%' }}></div>
            </div>
          </div>
          <button className="w-full py-3 text-[11px] font-bold uppercase tracking-widest bg-[#B5FF2E] text-[#000] rounded-xl hover:scale-[1.02] transition-transform">
            Unlock Full Access
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-[#000]">
        {/* Header */}
        <header className="h-16 bg-[#000]/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#B5FF2E]/10 text-[#B5FF2E] rounded-xl border border-[#B5FF2E]/20">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-tight">{AGENT_LIST.find(a => a.id === activeAgent)?.name}</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#B5FF2E] rounded-full animate-pulse"></span>
                <span className="text-[9px] uppercase font-black text-[#B5FF2E] tracking-widest">Sovereign Mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
             <button className="p-2 hover:bg-[#111] rounded-full transition-colors text-[#555] hover:text-[#B5FF2E]">
               <Bell size={20} />
             </button>
             <div className="h-4 w-[1px] bg-[#1a1a1a]"></div>
             <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white group-hover:text-[#B5FF2E] transition-colors uppercase tracking-tight">John Promoter</p>
                  <p className="text-[9px] text-[#444] group-hover:text-[#666] transition-colors uppercase font-bold tracking-widest">Elite Tier</p>
                </div>
                <div className="w-9 h-9 bg-[#B5FF2E] rounded-full flex items-center justify-center text-black font-black text-xs">JP</div>
             </div>
          </div>
        </header>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-up visible`}>
              <div className={`max-w-[75%] group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <span className="text-[9px] font-black text-[#B5FF2E] uppercase tracking-[0.2em]">
                      {AGENT_LIST.find(a => a.id === msg.agent_id)?.name}
                    </span>
                    <div className="w-1 h-1 bg-[#1a1a1a] rounded-full"></div>
                    <span className="text-[8px] text-[#444]">V4.0-SOVEREIGN</span>
                  </div>
                )}
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'user' 
                  ? 'bg-[#B5FF2E] text-[#000] rounded-tr-none font-medium' 
                  : 'bg-[#050505] border border-[#1a1a1a] text-[#F0F4E8] rounded-tl-none leading-relaxed'
                }`}>
                  <p className="text-[13.5px] whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#050505] border border-[#1a1a1a] p-5 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#B5FF2E] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#B5FF2E] rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#B5FF2E] rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-8 pt-0">
          <div className="max-w-4xl mx-auto bg-[#050505] border border-[#1a1a1a] rounded-2xl shadow-2xl p-2.5 flex items-center gap-3 focus-within:border-[#B5FF2E]/40 transition-all">
            <button className="p-3.5 hover:bg-[#111] rounded-xl transition-colors text-[#444] hover:text-[#B5FF2E]">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Query ${AGENT_LIST.find(a => a.id === activeAgent)?.name}...`}
              className="flex-1 bg-transparent border-none focus:outline-none text-[13.5px] py-3 text-white placeholder:text-[#333]"
            />
            <button className="p-3.5 hover:bg-[#111] rounded-xl transition-colors text-[#444] hover:text-[#B5FF2E]">
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSend}
              className="p-3.5 bg-[#B5FF2E] text-[#000] rounded-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex justify-center gap-6 mt-5">
             <span className="text-[8px] text-[#222] uppercase font-bold tracking-[0.3em]">Neural Integrity Active</span>
             <span className="text-[8px] text-[#222] uppercase font-bold tracking-[0.3em]">SECURE ARCHITECTURE AY 2025-26</span>
             <span className="text-[8px] text-[#222] uppercase font-bold tracking-[0.3em]">Encrypted Vector Stream</span>
          </div>
        </div>
      </main>
    </div>
  );
}
