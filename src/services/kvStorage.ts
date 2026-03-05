import type { CuratedRestaurantSeed } from '../types/index.ts';
import { CURATED_DATA_VERSION } from '../data/restaurants.ts';

const API = '/api/curated-data';

export async function fetchAreaFromKV(areaId: string): Promise<CuratedRestaurantSeed[] | null> {
  try {
    const res = await fetch(`${API}?area=${areaId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveAreaToKV(areaId: string, restaurants: CuratedRestaurantSeed[]): Promise<void> {
  try {
    const toSave = restaurants.map(({ photoPool, ...rest }) => rest);
    await fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaId, restaurants: toSave }),
    });
  } catch {
    // fire-and-forget: silently ignore KV errors
  }
}

export async function hydrateFromKV(): Promise<void> {
  try {
    const res = await fetch(API);
    if (!res.ok) return;
    const allAreas: Record<string, CuratedRestaurantSeed[]> = await res.json();

    if (!allAreas || typeof allAreas !== 'object' || Object.keys(allAreas).length === 0) return;

    const stored = JSON.parse(localStorage.getItem('pickit_curated_data') || '{}');
    let updated = false;

    for (const [areaId, restaurants] of Object.entries(allAreas)) {
      if (!Array.isArray(restaurants) || restaurants.length === 0) continue;
      // KV data takes precedence — overwrite localStorage
      stored[areaId] = { restaurants };
      updated = true;
    }

    if (updated) {
      stored._version = CURATED_DATA_VERSION;
      localStorage.setItem('pickit_curated_data', JSON.stringify(stored));
    }
  } catch {
    // Offline or KV unavailable — silently fall back to localStorage
  }
}
