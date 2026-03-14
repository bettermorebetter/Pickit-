/* ══════════════════════════════════════════════════════════════
   WorldCup storage — localStorage + KV API
══════════════════════════════════════════════════════════════ */

import type { WorldCup } from '../types/index.ts';

const STORAGE_KEY = 'pickit_worldcups';
const API = '/api/worldcups';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ── localStorage ────────────────────────────────────────── */

export function getWorldCups(): WorldCup[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getWorldCupById(id: string): WorldCup | null {
  return getWorldCups().find(wc => wc.id === id) || null;
}

export function saveWorldCup(wc: Omit<WorldCup, 'id' | 'createdAt' | 'playCount'>): WorldCup {
  const worldCup: WorldCup = {
    ...wc,
    id: generateId(),
    createdAt: Date.now(),
    playCount: 0,
  };
  const all = getWorldCups();
  all.unshift(worldCup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  syncToKV(all);
  return worldCup;
}

export function deleteWorldCup(id: string): void {
  const all = getWorldCups().filter(wc => wc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  syncToKV(all);
}

export function incrementPlayCount(id: string): void {
  const all = getWorldCups();
  const wc = all.find(w => w.id === id);
  if (wc) {
    wc.playCount++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

/* ── KV sync (fire-and-forget) ──────────────────────────── */

async function syncToKV(worldCups: WorldCup[]): Promise<void> {
  try {
    await fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ worldCups }),
    });
  } catch {
    // silently ignore
  }
}

export async function hydrateWorldCupsFromKV(): Promise<void> {
  try {
    const res = await fetch(API);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const local = getWorldCups();
      // Merge: KV takes precedence, add local-only entries
      const kvIds = new Set(data.map((wc: WorldCup) => wc.id));
      const merged = [...data, ...local.filter(wc => !kvIds.has(wc.id))];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // offline — use localStorage
  }
}

/* ── URL sharing ─────────────────────────────────────────── */

export function getWorldCupShareUrl(id: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?wc=${id}`;
}

export function getWorldCupIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('wc');
}
