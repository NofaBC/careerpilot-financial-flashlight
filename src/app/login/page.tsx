'use client';

import { signInWithGoogle, useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  async function handleLogin() {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSigningIn(false);
    }
  }

  if (loading) {
    return (
      <div className="wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--muted)', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '40px 32px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Financial Flashlight</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '32px', fontSize: '14px' }}>
          Internal dashboard — CareerPilot AI
        </p>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={signingIn}
          style={{ width: '100%', fontSize: '16px', padding: '14px' }}
        >
          {signingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '24px' }}>
          This is an internal tool. Only authorized team members can access this dashboard.
        </p>
      </div>
    </div>
  );
}
