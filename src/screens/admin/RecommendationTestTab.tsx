/* ══════════════════════════════════════════════════════════════
   Recommendation Test Tab — search nearby restaurants with Bayesian scoring
══════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { isWithinSeoul, FOOD_CATEGORIES } from '../../data/constants.ts';
import {
  hasNewPlacesApi,
  hasOldPlacesApi,
  searchCategoryNewApi,
  searchCategoryOldApi,
  applyBayesianSelection,
} from '../../services/places.ts';
import type { FoodCategoryKey, Restaurant } from '../../types/index.ts';
import SearchResultsSection from './SearchResultsSection.tsx';

export default function RecommendationTestTab() {
  const { state, dispatch } = useAdmin();

  const handleGps = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_STATUS', status: '위치 가져오는 중...' });
    if (!navigator.geolocation) {
      dispatch({ type: 'SET_SEARCH_STATUS', status: '위치 서비스 미지원' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!isWithinSeoul(lat, lng)) {
          dispatch({ type: 'SET_SEARCH_STATUS', status: '서울 지역만 지원합니다' });
          return;
        }
        dispatch({ type: 'SET_SEARCH_LOCATION', lat, lng });
        dispatch({ type: 'SET_SEARCH_STATUS', status: `위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)}` });
      },
      () => {
        dispatch({ type: 'SET_SEARCH_STATUS', status: '위치를 가져오지 못했습니다' });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [dispatch]);

  const handleSearch = useCallback(async () => {
    const { searchLat: lat, searchLng: lng } = state;
    if (!lat || !lng) return;

    dispatch({ type: 'SET_SEARCH_STATUS', status: '검색 중...' });
    const keys = Object.keys(FOOD_CATEGORIES) as FoodCategoryKey[];
    const categoryResults: Record<string, Restaurant[]> = {};

    try {
      if (hasNewPlacesApi()) {
        const res = await Promise.all(keys.map(k => searchCategoryNewApi(lat, lng, k)));
        keys.forEach((k, i) => { categoryResults[k] = res[i]; });
      } else if (hasOldPlacesApi()) {
        const svc = new google.maps.places.PlacesService(document.createElement('div'));
        const res = await Promise.all(keys.map(k => searchCategoryOldApi(svc, lat, lng, k)));
        keys.forEach((k, i) => { categoryResults[k] = res[i]; });
      } else {
        dispatch({ type: 'SET_SEARCH_STATUS', status: 'Places API를 사용할 수 없습니다.' });
        return;
      }
    } catch (e: any) {
      dispatch({ type: 'SET_SEARCH_STATUS', status: '검색 실패: ' + e.message });
      return;
    }

    const selected8 = applyBayesianSelection(categoryResults);
    const selectedIds = selected8.map(r => r.id);

    dispatch({ type: 'SET_SEARCH_RESULTS', results: categoryResults, selectedIds });
  }, [state.searchLat, state.searchLng, dispatch]);

  const hasLocation = state.searchLat !== null && state.searchLng !== null;
  const isSearching = state.searchStatus === '검색 중...';

  return (
    <div className="admin-tab-panel">
      <div className="admin-location-row">
        <button className="admin-btn" onClick={handleGps}>📍 내 위치 사용</button>
        <span className="admin-location-label">
          {state.searchStatus || '위치를 선택하세요'}
        </span>
      </div>
      <button
        className="admin-btn admin-btn--primary"
        disabled={!hasLocation || isSearching}
        onClick={handleSearch}
      >
        {isSearching ? '검색 중... ⏳' : '검색하기'}
      </button>
      {Object.keys(state.searchResults).length > 0 && (
        <SearchResultsSection
          results={state.searchResults}
          selectedIds={state.selectedIds}
        />
      )}
    </div>
  );
}
