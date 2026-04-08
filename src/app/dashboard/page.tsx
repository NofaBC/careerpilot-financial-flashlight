'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { addEntry, getEntries, deleteEntry, deleteAllEntries } from '@/lib/firestore';
import {
  computeEntry,
  computeTodayMetrics,
  computeWeekMetrics,
  computeMonthMetrics,
  todayLocalDate,
} from '@/lib/calculations';
import { currency } from '@/lib/format';
import type { FinancialEntry, ComputedEntry, EntryFormData } from '@/types/financial';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHero from '@/components/DashboardHero';
import MetricCard from '@/components/MetricCard';
import EntryForm from '@/components/EntryForm';
import MonthSnapshot from '@/components/MonthSnapshot';
import EntriesTable from '@/components/EntriesTable';
import InsightPanel from '@/components/InsightPanel';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingEntries, setLoadingEntries] = useState(true);

  const today = todayLocalDate();

  const loadEntries = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getEntries(user.uid);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
      flashStatus('Failed to load entries.', false);
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  function flashStatus(message: string, good = true) {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 2500);
  }

  const computed: ComputedEntry[] = entries.map(computeEntry);
  const todayMetrics = computeTodayMetrics(computed, today);
  const weekMetrics = computeWeekMetrics(computed, today);
  const monthMetrics = computeMonthMetrics(computed, today);

  async function handleSave(data: EntryFormData) {
    if (!user) return;
    try {
      await addEntry(data, user.uid);
      await loadEntries();
      flashStatus('Entry saved.');
    } catch (err) {
      console.error('Failed to save entry:', err);
      flashStatus('Failed to save entry.', false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
      await loadEntries();
      flashStatus('Entry deleted.', false);
    } catch (err) {
      console.error('Failed to delete entry:', err);
      flashStatus('Failed to delete entry.', false);
    }
  }

  async function handleDeleteAll() {
    if (!user) return;
    if (!confirm('Delete all saved entries? This cannot be undone.')) return;
    try {
      await deleteAllEntries(user.uid);
      await loadEntries();
      flashStatus('All entries deleted.', false);
    } catch (err) {
      console.error('Failed to delete entries:', err);
      flashStatus('Failed to delete entries.', false);
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerpilot-financial-flashlight-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flashStatus('Entries exported.');
  }

  async function handleImport(file: File) {
    if (!user) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (!Array.isArray(imported)) throw new Error('Invalid file');
      // Import each entry into Firestore
      for (const entry of imported) {
        const data: EntryFormData = {
          date: entry.date || today,
          newSubs: entry.newSubs ?? 0,
          renewals: entry.renewals ?? 0,
          revenue: entry.revenue ?? 0,
          refunds: entry.refunds ?? 0,
          aiCost: entry.aiCost ?? 0,
          jobsCost: entry.jobsCost ?? 0,
          hostingCost: entry.hostingCost ?? 0,
          otherCost: entry.otherCost ?? 0,
          notes: entry.notes ?? '',
        };
        await addEntry(data, user.uid);
      }
      await loadEntries();
      flashStatus(`Imported ${imported.length} entries.`);
    } catch {
      flashStatus('Import failed. Use a valid JSON export file.', false);
    }
  }

  if (loadingEntries) {
    return (
      <div className="wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--muted)', fontSize: '18px' }}>Loading entries...</div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <DashboardHero userEmail={user?.email} />

      {/* Today Metrics */}
      <section className="grid grid-4" style={{ marginBottom: '18px' }}>
        <MetricCard
          label="Today — Net Revenue"
          value={currency(todayMetrics.netRevenue)}
          sub="Revenue minus refunds"
          numericValue={todayMetrics.netRevenue}
        />
        <MetricCard
          label="Today — Total Cost"
          value={currency(todayMetrics.totalCost)}
          sub="AI + jobs API + hosting + other"
          numericValue={-todayMetrics.totalCost}
        />
        <MetricCard
          label="Today — Profit"
          value={currency(todayMetrics.profit)}
          sub="Daily result"
          numericValue={todayMetrics.profit}
        />
        <MetricCard
          label="Month — Net Profit"
          value={currency(monthMetrics.profit)}
          sub="Current month snapshot"
          numericValue={monthMetrics.profit}
        />
      </section>

      {/* Week Metrics */}
      <section className="grid grid-3" style={{ marginBottom: '18px' }}>
        <MetricCard
          label="This Week — Revenue"
          value={currency(weekMetrics.netRevenue)}
          sub="Sunday to Saturday"
          numericValue={weekMetrics.netRevenue}
        />
        <MetricCard
          label="This Week — Cost"
          value={currency(weekMetrics.totalCost)}
          sub="Total weekly expenses"
          numericValue={-weekMetrics.totalCost}
        />
        <MetricCard
          label="This Week — Profit"
          value={currency(weekMetrics.profit)}
          sub="Weekly result"
          numericValue={weekMetrics.profit}
        />
      </section>

      {/* Entry Form + Month Snapshot */}
      <section className="grid grid-2">
        <EntryForm
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          statusMessage={statusMessage}
        />
        <MonthSnapshot metrics={monthMetrics} />
      </section>

      {/* Saved Entries Table */}
      <EntriesTable
        entries={computed}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />

      {/* AI Insights */}
      <InsightPanel
        todayMetrics={todayMetrics}
        weekMetrics={weekMetrics}
        monthMetrics={monthMetrics}
      />
    </div>
  );
}
