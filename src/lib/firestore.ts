import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { FinancialEntry, EntryFormData } from '@/types/financial';

const COLLECTION = 'financial_entries';

export async function addEntry(data: EntryFormData, userId: string): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
    _serverTimestamp: serverTimestamp(),
  });
  return docRef.id;
}

export async function getEntries(userId: string): Promise<FinancialEntry[]> {
  // Try with orderBy first; fall back to client-side sort if composite index is missing
  let snapshot;
  try {
    const q = query(
      collection(db, COLLECTION),
      where('createdBy', '==', userId),
      orderBy('date', 'desc')
    );
    snapshot = await getDocs(q);
  } catch (err) {
    // Composite index may not exist yet — query without orderBy and sort client-side
    console.warn('Falling back to client-side sort (composite index may be needed):', err);
    const q = query(
      collection(db, COLLECTION),
      where('createdBy', '==', userId)
    );
    snapshot = await getDocs(q);
  }

  const entries = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      date: data.date,
      newSubs: data.newSubs ?? 0,
      renewals: data.renewals ?? 0,
      revenue: data.revenue ?? 0,
      refunds: data.refunds ?? 0,
      aiCost: data.aiCost ?? 0,
      jobsCost: data.jobsCost ?? 0,
      hostingCost: data.hostingCost ?? 0,
      otherCost: data.otherCost ?? 0,
      notes: data.notes ?? '',
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? '',
      createdBy: data.createdBy ?? '',
    } as FinancialEntry;
  });

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function deleteEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function deleteAllEntries(userId: string): Promise<void> {
  const q = query(collection(db, COLLECTION), where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  const deletes = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletes);
}
