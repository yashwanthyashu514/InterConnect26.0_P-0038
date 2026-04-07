"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) setMessage(error.message);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'var(--background)'
    }}>
      <div className="animate-in" style={{
        maxWidth: '400px',
        width: '100%',
        background: 'var(--secondary)',
        padding: '3rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Home</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Access the maCA Empire suite</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#f9f9f9')}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = 'white')}
        >
           Login with Google
        </button>

        <div style={{ textAlign: 'center', margin: '1.5rem 0', position: 'relative' }}>
          <hr style={{ border: '0', borderTop: '1px solid var(--border)' }} />
          <span style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'var(--secondary)',
            padding: '0 1rem',
            color: 'var(--muted)',
            fontSize: '0.75rem'
          }}>OR</span>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--muted)' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="button-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <p style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            fontSize: '0.875rem', 
            color: message.includes('link') ? 'var(--primary)' : '#ff4444' 
          }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            ← Back to maCA Empire
          </Link>
        </div>
      </div>
    </div>
  );
}
