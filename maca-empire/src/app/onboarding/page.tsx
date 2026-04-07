"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Update user profile metadata or save to profiles table
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: name,
        phone_number: phone,
        gstin: gstin,
        onboarding_completed: true
      }
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/'); // Redirect to main app or dashboard
    }
    setLoading(false);
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
        maxWidth: '500px',
        width: '100%',
        background: 'var(--secondary)',
        padding: '3rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>One Last Step</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Let's personalize your maCA experience</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--muted)' }}>
              FULL NAME
            </label>
            <input 
              type="text" 
              placeholder="Ataru Moroboshi" 
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--muted)' }}>
              PHONE NUMBER
            </label>
            <input 
              type="tel" 
              placeholder="+91 99999 00000" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--muted)' }}>
              GSTIN (OPTIONAL)
            </label>
            <input 
              type="text" 
              placeholder="27AAACR1234A1Z5" 
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
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
            {loading ? 'Finalizing...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  );
}
