/* ══════════════════════════════════════════════════════════════
   Admin Context — isolated state for the admin screen
══════════════════════════════════════════════════════════════ */

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Restaurant } from '../types/index.ts';

export interface AdminState {
  activeTab: 'search' | 'editor';
  searchLat: number | null;
  searchLng: number | null;
  searchStatus: string | null;
  searchResults: Record<string, Restaurant[]>;
  selectedIds: string[];
  editorAreaId: 'snu' | 'konkuk';
  editingRestaurantId: string | null;
  photoCache: Record<string, string[]>;
  fullPhotoPool: Record<string, string[]>;
  toast: string | null;
  editorVersion: number;
}

export type AdminAction =
  | { type: 'SET_TAB'; tab: 'search' | 'editor' }
  | { type: 'SET_SEARCH_LOCATION'; lat: number; lng: number }
  | { type: 'SET_SEARCH_STATUS'; status: string | null }
  | { type: 'SET_SEARCH_RESULTS'; results: Record<string, Restaurant[]>; selectedIds: string[] }
  | { type: 'SET_EDITOR_AREA'; areaId: 'snu' | 'konkuk' }
  | { type: 'SET_EDITING'; id: string | null }
  | { type: 'SET_PHOTO_CACHE'; restaurantId: string; photos: string[] }
  | { type: 'SET_FULL_PHOTO_POOL'; restaurantId: string; photos: string[] }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'BUMP_VERSION' };

const initialState: AdminState = {
  activeTab: 'search',
  searchLat: null,
  searchLng: null,
  searchStatus: null,
  searchResults: {},
  selectedIds: [],
  editorAreaId: 'snu',
  editingRestaurantId: null,
  photoCache: {},
  fullPhotoPool: {},
  toast: null,
  editorVersion: 0,
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_SEARCH_LOCATION':
      return { ...state, searchLat: action.lat, searchLng: action.lng };
    case 'SET_SEARCH_STATUS':
      return { ...state, searchStatus: action.status };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.results, selectedIds: action.selectedIds, searchStatus: null };
    case 'SET_EDITOR_AREA':
      return { ...state, editorAreaId: action.areaId, editingRestaurantId: null };
    case 'SET_EDITING':
      return { ...state, editingRestaurantId: action.id };
    case 'SET_PHOTO_CACHE':
      return { ...state, photoCache: { ...state.photoCache, [action.restaurantId]: action.photos } };
    case 'SET_FULL_PHOTO_POOL':
      return { ...state, fullPhotoPool: { ...state.fullPhotoPool, [action.restaurantId]: action.photos } };
    case 'SHOW_TOAST':
      return { ...state, toast: action.message };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'BUMP_VERSION':
      return { ...state, editorVersion: state.editorVersion + 1 };
    default:
      return state;
  }
}

interface AdminContextValue {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
