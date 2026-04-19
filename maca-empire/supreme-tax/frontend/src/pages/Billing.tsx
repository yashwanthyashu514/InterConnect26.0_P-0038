import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Zap, ArrowRight, CheckCircle2, Loader2, FileText } from 'lucide-react';
import '../index.css';

const PLANS = [
  {
    name: 'Sovereign Starter',
    price: '₹2,499',
    period: '/one-time',
    features: ['Agents A0-A3 Access', 'M1-M3 Modular Filing', '24/7 Neural Support', 'Email Receipts'],
    color: 'var(--text2)'
  },
  {
    name: 'Nexus Pro',
    price: '₹9,999',
    period: '/annual',
    features: ['All 18+ Neural Vectors', 'Full M1-M10 Orchestration', 'Multi-Modal RAG Support', 'Priority Forensic Audit', 'Blockchain Verified Receipts'],
    color: 'var(--acid)',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Dedicated Neural Node', 'Zero-Latency Response', 'Corporate Lead Routing', 'Custom Agent Training'],
    color: 'var(--text2)'
  }
];

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Nexus Pro');

  const handlePayment = () => {
    setLoading(true);
    // Simulate Neural/Razorpay Handshake
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 3000);
  };

  if (success) {
    return (
      <div className="st-layout" style={{ background: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          background: 'var(--bg2)', 
          padding: '48px', 
          borderRadius: '24px', 
          border: '1px solid var(--border-acid)', 
          textAlign: 'center',
          maxWidth: '480px',
          boxShadow: '0 0 40px rgba(181, 255, 46, 0.05)'
        }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--acid-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--acid)' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontFamily: 'Syne', fontSize: '28px', color: 'var(--text)', marginBottom: '12px' }}>Transmission Verified</h2>
          <p style={{ color: 'var(--text3)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
            The Razorpay handshake was successful. Your account has been upgraded to <strong style={{ color: 'var(--acid)' }}>{selectedPlan}</strong>. All neural vectors are now unlocked.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="st-upgrade-btn"
            >
              Enter Dashboard
            </button>
            <button 
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <FileText size={14} /> Download Neural Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="st-layout" style={{ background: '#000', overflowY: 'auto' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--acid-dim)', border: '1px solid var(--border-acid)', borderRadius: '20px', marginBottom: '20px' }}>
            <Zap size={14} style={{ color: 'var(--acid)' }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--acid)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Orchestration Upgrade</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '48px', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-1px' }}>
            Unlock Sovereign <span style={{ color: 'var(--acid)' }}>Intelligence</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Scalable payment mesh for enterprise-grade tax automation. Select a vector to begin the handshake.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              style={{ 
                background: 'var(--bg2)', 
                border: selectedPlan === plan.name ? '2px solid var(--acid)' : '1px solid var(--border)', 
                borderRadius: '24px', 
                padding: '40px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--acid)', color: '#000', padding: '4px 10px', borderRadius: '20px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
                  Recommended
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: plan.color, marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)' }}>{plan.price}</span>
                <span style={{ fontSize: '14px', color: 'var(--text3)' }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text2)' }}>
                    <CheckCircle2 size={16} style={{ color: plan.color === 'var(--acid)' ? 'var(--acid)' : 'var(--text3)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.name && (
                <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }}>
                  <div style={{ height: '4px', background: 'var(--acid)', borderRadius: '2px', opacity: 0.3 }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Selected Protocol</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{selectedPlan}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Total Precision</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--acid)' }}>{PLANS.find(p => p.name === selectedPlan)?.price}</div>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={handlePayment}
            className="st-upgrade-btn"
            style={{ 
              height: '56px', 
              fontSize: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Verifying Neural Pulse...
              </>
            ) : (
              <>
                Proceed to Handshake (Razorpay)
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} /> PCI-DSS Handshake
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
              <CreditCard size={14} /> 256-Bit Encryption
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
