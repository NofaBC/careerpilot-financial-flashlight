'use client';

import { useState, FormEvent } from 'react';
import { todayLocalDate } from '@/lib/calculations';
import type { EntryFormData } from '@/types/financial';

interface Props {
  onSave: (data: EntryFormData) => Promise<void>;
  onExport: () => void;
  onImport: (file: File) => void;
  statusMessage: string;
}

export default function EntryForm({ onSave, onExport, onImport, statusMessage }: Props) {
  const [date, setDate] = useState(todayLocalDate());
  const [newSubs, setNewSubs] = useState(0);
  const [renewals, setRenewals] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [aiCost, setAiCost] = useState(0);
  const [jobsCost, setJobsCost] = useState(0);
  const [hostingCost, setHostingCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setDate(todayLocalDate());
    setNewSubs(0);
    setRenewals(0);
    setRevenue(0);
    setRefunds(0);
    setAiCost(0);
    setJobsCost(0);
    setHostingCost(0);
    setOtherCost(0);
    setNotes('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        date,
        newSubs,
        renewals,
        revenue,
        refunds,
        aiCost,
        jobsCost,
        hostingCost,
        otherCost,
        notes: notes.trim(),
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Daily Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="newSubs">New Subscribers</label>
          <input id="newSubs" type="number" min="0" step="1" value={newSubs} onChange={(e) => setNewSubs(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="renewals">Renewals</label>
          <input id="renewals" type="number" min="0" step="1" value={renewals} onChange={(e) => setRenewals(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="revenue">Total Revenue ($)</label>
          <input id="revenue" type="number" min="0" step="0.01" required value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="refunds">Refunds ($)</label>
          <input id="refunds" type="number" min="0" step="0.01" value={refunds} onChange={(e) => setRefunds(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="aiCost">AI API Cost ($)</label>
          <input id="aiCost" type="number" min="0" step="0.01" value={aiCost} onChange={(e) => setAiCost(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="jobsCost">Jobs API Cost ($)</label>
          <input id="jobsCost" type="number" min="0" step="0.01" value={jobsCost} onChange={(e) => setJobsCost(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="hostingCost">Hosting / Infra Cost ($)</label>
          <input id="hostingCost" type="number" min="0" step="0.01" value={hostingCost} onChange={(e) => setHostingCost(Number(e.target.value))} />
        </div>
        <div className="field span-2">
          <label htmlFor="otherCost">Other Cost ($)</label>
          <input id="otherCost" type="number" min="0" step="0.01" value={otherCost} onChange={(e) => setOtherCost(Number(e.target.value))} />
        </div>
        <div className="field span-2">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Examples: first paying user, higher API cost from resume builder, launch traffic spike..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="span-2 btn-row">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
          <button type="button" className="secondary" onClick={resetForm}>
            Clear Form
          </button>
          <button type="button" className="secondary" onClick={onExport}>
            Export JSON
          </button>
          <label className="button-like secondary" htmlFor="importFile">
            Import JSON
          </label>
          <input
            id="importFile"
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = '';
            }}
          />
        </div>
      </form>
      <div className="status">{statusMessage}</div>
      <div className="footer-note">
        Data is stored securely in Firebase Firestore. Only authenticated users can access this dashboard.
      </div>
    </div>
  );
}
