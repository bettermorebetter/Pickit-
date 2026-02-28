/* ══════════════════════════════════════════════════════════════
   Constants & configuration
══════════════════════════════════════════════════════════════ */

import type { FoodCategoryKey, FoodCategoryConfig } from '../types/index.ts';

export const SEOUL_BOUNDS = {
  latMin: 37.413,
  latMax: 37.715,
  lngMin: 126.734,
  lngMax: 127.269,
} as const;

export const BAYESIAN_M = 100;

export const FOOD_CATEGORIES: Record<FoodCategoryKey, FoodCategoryConfig> = {
  korean:   { label: '한식', emoji: '🍚', includedTypes: ['korean_restaurant'] },
  japanese: { label: '일식', emoji: '🍣', includedTypes: ['japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant'] },
  chinese:  { label: '중식', emoji: '🥟', includedTypes: ['chinese_restaurant'] },
  western:  { label: '양식', emoji: '🍔', includedTypes: ['american_restaurant', 'italian_restaurant', 'french_restaurant', 'pizza_restaurant', 'hamburger_restaurant', 'mediterranean_restaurant', 'steak_house'] },
};

export const GRADIENTS = [
  'linear-gradient(135deg,#fef3c7,#fde68a)',
  'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'linear-gradient(135deg,#fee2e2,#fecaca)',
  'linear-gradient(135deg,#eff6ff,#dbeafe)',
  'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
  'linear-gradient(135deg,#ecfdf5,#a7f3d0)',
  'linear-gradient(135deg,#fff7ed,#fed7aa)',
  'linear-gradient(135deg,#fffbeb,#fef3c7)',
  'linear-gradient(135deg,#e0f2fe,#bae6fd)',
] as const;

export function isWithinSeoul(lat: number, lng: number): boolean {
  return (
    lat >= SEOUL_BOUNDS.latMin &&
    lat <= SEOUL_BOUNDS.latMax &&
    lng >= SEOUL_BOUNDS.lngMin &&
    lng <= SEOUL_BOUNDS.lngMax
  );
}

export function computeBayesianScore(
  rating: number,
  reviewCount: number,
  globalMeanRating: number
): number {
  const v = reviewCount || 0;
  const R = rating || 0;
  const m = BAYESIAN_M;
  const C = globalMeanRating;
  return (v / (v + m)) * R + (m / (v + m)) * C;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
