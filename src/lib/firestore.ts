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
  const q = query(
    collection(db, COLLECTION),
    where('createdBy', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
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
