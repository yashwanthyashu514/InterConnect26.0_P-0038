import React, { useState } from 'react';
import { Terminal, Code, Key, Globe, Shield, Zap, Copy, Check, Server } from 'lucide-react';
import '../index.css';

export default function DeveloperPortal() {
  const [apiKey, setApiKey] = useState('sk_live_6f72_nexus_4k99_alpha_822');
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.supremetax.ai/v1/verify_notice \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_id": "ST-992-NX",
    "neural_depth": "sovereign"
  }'`,
    node: `const nexus = require('@supreme-tax/nexus-sdk');

const client = new nexus.Client('${apiKey}');

async function runAudit() {
  const result = await client.forensic.auditNotice('ST-992-NX');
  console.log('Neural Logic Verified:', result.reasoning_chain);
}`,
    python: `import supreme_tax_nexus as nexus

client = nexus.SovereignClient(api_key='${apiKey}')

# Execute Zero-Hallucination Liability Kernel
liability = client.kernel.compute_liability(
    income_vectors={'vda': 250000, 'lrs': 50000},
    regime='2026-NEURAL'
)

print(f"Verified Tax: {liability.amount}")`
  };

  const [activeSnippet, setActiveSnippet] = useState<'curl' | 'node' | 'python'>('node');

  return (
    <div className="st-layout" style={{ background: '#000', overflowY: 'auto' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', width: '100%' }}>
        <header style={{ marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--acid-dim)', border: '1px solid var(--border-acid)', borderRadius: '20px', marginBottom: '20px' }}>
            <Server size={14} style={{ color: 'var(--acid)' }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--acid)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sovereign Developer Gateway</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '42px', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>
            Build on the <span style={{ color: 'var(--acid)' }}>Command Nexus</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: '16px', maxWidth: '700px' }}>
            Integrate our AGI-driven tax forensic kernels directly into your enterprise fintech ecosystem via high-throughput gRPC and REST endpoints.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
          {/* Main Content */}
          <section>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {(['curl', 'node', 'python'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveSnippet(lang)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: activeSnippet === lang ? 'var(--acid)' : 'var(--text3)',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        padding: '4px 0',
                        borderBottom: activeSnippet === lang ? '2px solid var(--acid)' : '2px solid transparent'
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <button onClick={() => {}} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  <Copy size={16} />
                </button>
              </div>
              <div style={{ padding: '32px', background: '#080808' }}>
                <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <code>{codeSnippets[activeSnippet]}</code>
                </pre>
              </div>
            </div>

            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nexus Core Endpoints</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { path: 'POST /v1/forensic/audit_notice', desc: 'Execute deep neural decomposition of tax scrutiny notices.', icon: <Shield size={16} /> },
                  { path: 'POST /v1/kernel/compute_tax', desc: 'Access the zero-hallucination mathematical engine.', icon: <Zap size={16} /> },
                  { path: 'GET /v1/law/sync_status', desc: 'Fetch latest synchronized statutory law mandates.', icon: <Globe size={16} /> }
                ].map(endpoint => (
                  <div key={endpoint.path} style={{ background: 'var(--bg2)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--acid-dim)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--acid)' }}>
                      {endpoint.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono' }}>{endpoint.path}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{endpoint.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           sections</section>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg2)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Key size={16} style={{ color: 'var(--acid)' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase' }}>Sovereign API Key</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  readOnly 
                  value={apiKey} 
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'var(--text2)', fontSize: '11px', fontFamily: 'JetBrains Mono' }} 
                />
                <button 
                  onClick={copyKey}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? 'var(--acid)' : 'var(--text3)' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <button 
                style={{ width: '100%', padding: '12px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '10px', marginTop: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Rotate API Secret
              </button>
            </div>

            <div style={{ background: 'var(--bg2)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Terminal size={16} style={{ color: 'var(--acid)' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase' }}>API Statistics</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Request Success Rate</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--acid)', fontFamily: 'Syne' }}>99.99%</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Latency (Global Edge)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne' }}>42ms</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
