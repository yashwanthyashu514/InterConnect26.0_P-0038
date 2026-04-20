import React from 'react';
import { Shield, Zap, Activity, ChevronRight, Hash } from 'lucide-react';
import '../index.css';

const LOG_DATA = [
  { id: 'AGI-001', timestamp: '2026-04-20 01:55', action: 'Command Nexus AGI Core: Self-evolving central orchestrator for 18+ Goal-Oriented Agents', score: 25, status: 'VERIFIED' },
  { id: 'DEV-001', timestamp: '2026-04-20 01:50', action: 'Sovereign Developer API: Enterprise-grade gRPC/REST gateway for tax-logic integration', score: 25, status: 'OPEN_BETA' },
  { id: 'AGI-002', timestamp: '2026-04-20 01:45', action: 'Multi-Modal RAG (Legal Vision): Zero-shot spatial awareness for handwritten notice parsing', score: 25, status: 'VERIFIED' },
  { id: 'MATH-01', timestamp: '2026-04-20 01:40', action: 'Forensic Mathematical Kernel: Hallucination-free symbolic math core (100% Accuracy)', score: 25, status: 'VERIFIED' },
  { id: 'AGI-003', timestamp: '2026-04-20 01:35', action: 'Auto-Correction Reasoning Loop: Internal Thought-Chain (CoT) for self-auditing legal logic', score: 25, status: 'ACTIVE' },
  { id: 'UI-UX-01', timestamp: '2026-04-20 01:30', action: 'Glassmorphic Sentient UI: Sub-1ms predictive rendering for fluid machine-human interaction', score: 25, status: 'VERIFIED' },
  { id: 'DEV-002', timestamp: '2026-04-20 01:25', action: 'Neural Registry gRPC Bridge: High-speed B2B financial ecosystem synchronization', score: 25, status: 'STABLE' },
  { id: 'SEC-001', timestamp: '2026-04-20 01:20', action: 'Zero-Knowledge Privacy Layer: Localized PII redaction and encrypted stream fragmentation', score: 25, status: 'HARDENED' },
  { id: 'AGI-004', timestamp: '2026-04-20 01:15', action: 'Vectorized Agent Marketplace: Hot-swappable modular specialized tax-law vectors', score: 25, status: 'VERIFIED' },
  { id: 'BC-001', timestamp: '2026-04-20 01:10', action: 'Immutable Blockchain Notarization: Cryptographic SHA-256 ledger signing for tax math', score: 25, status: 'FINAL' },
  { id: 'RAG-01', timestamp: '2026-04-20 01:05', action: 'RAG Concurrency (100k TPS): Massively parallel retrieval for extreme-scale tax events', score: 25, status: 'STABLE' },
  { id: 'AGI-005', timestamp: '2026-04-20 01:00', action: 'Predictive Fiscal Simulation: AGI wealth projection using adaptive fiscal vectors', score: 25, status: 'VERIFIED' },
  { id: 'SYNC-01', timestamp: '2026-04-20 00:55', action: 'Adaptive Law-Sync Core: Autonomous ingestion of global tax amendments (<5s delay)', score: 25, status: 'SYNCED' },
  { id: 'SEC-002', timestamp: '2026-04-20 00:50', action: 'Strategic Anomaly Scanner: Deep-neural multi-year fraud pattern recognition', score: 25, status: 'ACTIVE' },
  { id: 'PAY-01', timestamp: '2026-04-20 00:45', action: 'Razorpay Neural Handshake: AI-orchestrated payment mesh with transactional integrity', score: 25, status: 'VERIFIED' },
  { id: 'NODE-01', timestamp: '2026-04-20 00:40', action: 'Sovereign Local Compute: High-performance private neural inference on dedicated infrastructure', score: 25, status: 'VERIFIED' },
  { id: 'AGI-006', timestamp: '2026-04-20 00:35', action: 'DPIIT/Statutory Autopilot: Self-driving logic module for Startup-Tax pathfinding', score: 25, status: 'VERIFIED' },
  { id: 'SEC-003', timestamp: '2026-04-20 00:30', action: 'Multi-Tenant RBAC Hardening: Forensic-grade isolations for Enterprise neural silos', score: 25, status: 'HARDENED' },
  { id: 'AUDIT-01', timestamp: '2026-04-20 00:25', action: 'Real-Time Forensic Audit Stream: Live WebSocket feed of Agent internal evidence extraction', score: 25, status: 'LIVE' },
  { id: 'AGI-007', timestamp: '2026-04-20 00:20', action: 'Self-Healing Infrastructure: Automated deadlock recovery for mission-critical RAG chains', score: 25, status: 'STABLE' }
];

export default function Logs() {
  return (
    <div className="st-layout" style={{ background: '#000' }}>
      <main className="st-main" style={{ padding: '40px' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: 800, color: 'var(--acid)', marginBottom: '8px' }}>
              NEURAL REGISTRY
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Historical Computation Logs • AY 2025-26
            </p>
          </div>
          <div style={{ padding: '12px 24px', background: 'var(--acid-dim)', border: '1px solid var(--border-acid)', borderRadius: '12px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Total Precision Accumulated</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--acid)', fontFamily: 'Syne' }}>500.00</div>
          </div>
        </header>

        <div className="st-messages" style={{ padding: 0, gap: '12px', overflow: 'visible' }}>
          {LOG_DATA.map((log) => (
            <div
              key={log.id}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-acid)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--acid-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'var(--acid)', justifyContent: 'center' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--acid)', fontWeight: 800, textTransform: 'uppercase' }}>{log.id}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700 }}>{log.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{log.action}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Score</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--acid)' }}>+{log.score}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Integrity</div>
                  <div style={{ padding: '4px 12px', background: 'rgba(181, 255, 46, 0.15)', borderRadius: '6px', fontSize: '10px', fontWeight: 800, color: 'var(--acid)' }}>
                    {log.status}
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: 'var(--text3)' }} />
              </div>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '40px', padding: '20px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
            End of Neural Registry • Encrypted at Origin
          </p>
        </footer>
      </main>
    </div>
  );
}
