/* ══════════════════════════════════════════════════════════════
   서울 푸드 월드컵 — TypeScript type definitions
══════════════════════════════════════════════════════════════ */

export type FoodCategoryKey = 'korean' | 'japanese' | 'chinese' | 'western';

export interface FoodCategoryConfig {
  label: string;
  emoji: string;
  includedTypes: string[];
}

export interface Restaurant {
  id: string;
  placeId?: string;
  name: string;
  foodCategory: FoodCategoryKey;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  emoji: string;
  gradient: string;
  photoUrl: string | null;
  photoUrls: string[];
  bayesianScore?: number;
}

export interface CuratedRestaurantSeed {
  id: string;
  name: string;
  category: FoodCategoryKey;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  photoPool: string[];
  photoUrls: string[];
  photoUrl: string;
}

export interface CuratedArea {
  id: string;
  label: string;
  lat: number;
  lng: number;
  restaurants: CuratedRestaurantSeed[];
}

export type CuratedAreaId = 'snu' | 'konkuk' | 'hongdae' | 'ewha' | 'seongsu' | 'jamsil' | 'euljiro' | 'sadang' | 'gangnam' | 'sookmyung';

export type LocationMode = CuratedAreaId | null;
export type ScreenName = 'location' | 'map' | 'tournament' | 'result' | 'admin';

export interface BracketState {
  rounds: [Restaurant, Restaurant][][];
  currentRound: number;
  currentMatch: number;
  winners: Restaurant[][];
}

export interface AppState {
  screen: ScreenName;
  locationMode: LocationMode;
  restaurants: Restaurant[];
  bracket: BracketState;
  champion: Restaurant | null;
}

export type AppAction =
  | { type: 'SET_SCREEN'; screen: ScreenName }
  | { type: 'SET_LOCATION_MODE'; mode: LocationMode }
  | { type: 'SET_RESTAURANTS'; restaurants: Restaurant[] }
  | { type: 'INIT_BRACKET'; restaurants: Restaurant[] }
  | { type: 'PICK_WINNER'; winner: Restaurant }
  | { type: 'SET_CHAMPION'; champion: Restaurant }
  | { type: 'RESET' };

export const ROUND_LABELS: Record<number, string> = { 0: '8강', 1: '4강', 2: '결승' };
export const TOTAL_MATCHES: number[] = [4, 2, 1];
