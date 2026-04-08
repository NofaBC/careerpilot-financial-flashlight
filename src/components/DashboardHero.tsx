'use client';

import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Props {
  userEmail?: string | null;
}

export default function DashboardHero({ userEmail }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <section className="hero">
      <div>
        <h1>CareerPilot AI – Financial Flashlight</h1>
        <p>
          A simple internal dashboard to track daily revenue, expenses, profit,
          and weekly/monthly totals before NOFA Command Core™ is built.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {userEmail && (
          <button className="secondary" onClick={handleSignOut} style={{ fontSize: '13px' }}>
            Sign Out
          </button>
        )}
        <div className="hero-badge">Internal Utility</div>
      </div>
    </section>
  );
}
