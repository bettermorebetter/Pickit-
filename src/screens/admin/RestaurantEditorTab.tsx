/* ══════════════════════════════════════════════════════════════
   Restaurant Editor Tab — curated restaurant CRUD
══════════════════════════════════════════════════════════════ */

import { useCallback, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { CURATED_AREAS, getCuratedDataRaw, saveCuratedData } from '../../data/restaurants.ts';
import { FOOD_CATEGORIES, computeBayesianScore } from '../../data/constants.ts';
import {
  hasNewPlacesApi,
  hasOldPlacesApi,
  searchCategoryNewApi,
  searchCategoryOldApi,
} from '../../services/places.ts';
import type { CuratedRestaurantSeed, FoodCategoryKey } from '../../types/index.ts';
import RestaurantEditPanel from './RestaurantEditPanel.tsx';

const CAT_LABELS: Record<string, string> = { korean: '한식', japanese: '일식', chinese: '중식', western: '양식' };
const CAT_EMOJIS: Record<string, string> = { korean: '🍚', japanese: '🍣', chinese: '🥟', western: '🍔' };

export default function RestaurantEditorTab() {
  const { state, dispatch } = useAdmin();
  const { editorAreaId, editingRestaurantId, editorVersion } = state;

  const restaurants = useMemo(
    () => getCuratedDataRaw(editorAreaId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editorAreaId, editorVersion]
  );

  const showToast = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2200);
  }, [dispatch]);

  const handleAreaChange = useCallback((areaId: 'snu' | 'konkuk') => {
    dispatch({ type: 'SET_EDITOR_AREA', areaId });
  }, [dispatch]);

  const handleEdit = useCallback((id: string) => {
    dispatch({ type: 'SET_EDITING', id });
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm('이 식당을 삭제하시겠습니까?')) return;
    const rests = getCuratedDataRaw(editorAreaId).filter(r => r.id !== id);
    saveCuratedData(editorAreaId, rests);
    dispatch({ type: 'BUMP_VERSION' });
    if (editingRestaurantId === id) dispatch({ type: 'SET_EDITING', id: null });
  }, [editorAreaId, editingRestaurantId, dispatch]);

  const handleAdd = useCallback(() => {
    const rests = getCuratedDataRaw(editorAreaId);
    const area = CURATED_AREAS[editorAreaId];
    const newId = `${editorAreaId}_new_${Date.now()}`;
    const newRest: CuratedRestaurantSeed = {
      id: newId,
      name: '새 식당',
      category: 'korean' as FoodCategoryKey,
      address: '',
      rating: 4.0,
      reviewCount: 100,
      photoUrl: '',
      photoUrls: [],
      photoPool: [],
      lat: area ? area.lat + (Math.random() - 0.5) * 0.006 : 37.5,
      lng: area ? area.lng + (Math.random() - 0.5) * 0.006 : 127.0,
    };
    rests.push(newRest);
    saveCuratedData(editorAreaId, rests);
    dispatch({ type: 'BUMP_VERSION' });
    dispatch({ type: 'SET_EDITING', id: newId });
  }, [editorAreaId, dispatch]);

  const handleFetchFromMaps = useCallback(async () => {
    const area = CURATED_AREAS[editorAreaId];
    if (!area) return;

    showToast('구글맵에서 식당 불러오는 중...');
    const { lat, lng } = area;
    const categoryKeys = Object.keys(FOOD_CATEGORIES) as FoodCategoryKey[];
    const PER_CAT = 13;

    try {
      const categoryResults: Record<string, any[]> = {};

      if (hasNewPlacesApi()) {
        const results = await Promise.all(categoryKeys.map(k => searchCategoryNewApi(lat, lng, k)));
        categoryKeys.forEach((k, i) => { categoryResults[k] = results[i]; });
      } else if (hasOldPlacesApi()) {
        const svc = new google.maps.places.PlacesService(document.createElement('div'));
        const results = await Promise.all(categoryKeys.map(k => searchCategoryOldApi(svc, lat, lng, k)));
        categoryKeys.forEach((k, i) => { categoryResults[k] = results[i]; });
      } else {
        showToast('Places API를 사용할 수 없습니다.');
        return;
      }

      const allRests = Object.values(categoryResults).flat();
      if (!allRests.length) { showToast('식당을 찾지 못했습니다.'); return; }

      const C = allRests.reduce((s, r) => s + (r.rating || 0), 0) / allRests.length;
      allRests.forEach(r => { r.bayesianScore = computeBayesianScore(r.rating, r.reviewCount, C); });

      const allCurated: CuratedRestaurantSeed[] = [];
      categoryKeys.forEach(catKey => {
        const sorted = (categoryResults[catKey] || [])
          .sort((a: any, b: any) => b.bayesianScore - a.bayesianScore)
          .slice(0, PER_CAT);
        sorted.forEach((r: any) => {
          allCurated.push({
            id: r.id || `${editorAreaId}_${catKey}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: r.name,
            category: catKey,
            address: r.address || '',
            rating: r.rating || 0,
            reviewCount: r.reviewCount || 0,
            lat: r.lat,
            lng: r.lng,
            photoUrl: r.photoUrl || '',
            photoUrls: r.photoUrls || [],
            photoPool: [],
          });
        });
      });

      if (!allCurated.length) { showToast('식당을 찾지 못했습니다.'); return; }

      saveCuratedData(editorAreaId, allCurated);
      dispatch({ type: 'BUMP_VERSION' });
      dispatch({ type: 'SET_EDITING', id: null });
      showToast(`✅ ${allCurated.length}개 식당을 불러왔습니다!`);
    } catch (e: any) {
      showToast('불러오기 실패: ' + e.message);
    }
  }, [editorAreaId, dispatch, showToast]);

  const handleExport = useCallback(() => {
    const data: Record<string, any> = {};
    Object.keys(CURATED_AREAS).forEach(areaId => {
      data[areaId] = { ...CURATED_AREAS[areaId], restaurants: getCuratedDataRaw(areaId) };
    });
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurants-curated.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON 파일을 다운로드했습니다.');
  }, [showToast]);

  const handleReset = useCallback(() => {
    const label = CURATED_AREAS[editorAreaId]?.label || editorAreaId;
    if (!confirm(`"${label}" 지역의 식당 데이터를 기본값으로 복원하시겠습니까?\n(직접 수정한 내용이 모두 삭제됩니다)`)) return;
    try {
      const stored = JSON.parse(localStorage.getItem('pickit_curated_data') || '{}');
      delete stored[editorAreaId];
      localStorage.setItem('pickit_curated_data', JSON.stringify(stored));
    } catch (_e) {}
    dispatch({ type: 'BUMP_VERSION' });
    dispatch({ type: 'SET_EDITING', id: null });
    showToast('기본값으로 복원되었습니다.');
  }, [editorAreaId, dispatch, showToast]);

  const handleClosePanel = useCallback(() => {
    dispatch({ type: 'SET_EDITING', id: null });
  }, [dispatch]);

  const handleSaved = useCallback(() => {
    dispatch({ type: 'BUMP_VERSION' });
    showToast('저장되었습니다!');
  }, [dispatch, showToast]);

  return (
    <div className="admin-tab-panel">
      <p className="admin-hint">지역별 식당 데이터를 직접 편집하세요. 변경사항은 이 기기에 자동 저장됩니다.</p>

      <div className="editor-area-bar">
        <button
          className={`editor-area-btn${editorAreaId === 'snu' ? ' editor-area-btn--active' : ''}`}
          onClick={() => handleAreaChange('snu')}
        >
          🎓 서울대입구역
        </button>
        <button
          className={`editor-area-btn${editorAreaId === 'konkuk' ? ' editor-area-btn--active' : ''}`}
          onClick={() => handleAreaChange('konkuk')}
        >
          🐄 건대입구역
        </button>
      </div>

      <div className="editor-list">
        {restaurants.length === 0 ? (
          <p className="admin-hint">식당이 없습니다. 아래에서 추가하세요.</p>
        ) : (
          restaurants.map(r => {
            const catLabel = CAT_LABELS[r.category] || r.category;
            const emoji = CAT_EMOJIS[r.category] || '🍽️';
            const imgCount = r.photoUrls?.length || (r.photoUrl ? 1 : 0);
            return (
              <div key={r.id} className="editor-row">
                <div className="editor-thumb-wrap">
                  {r.photoUrl ? (
                    <img
                      src={r.photoUrl}
                      className="editor-thumb"
                      alt={r.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const next = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                        if (next) next.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="editor-thumb editor-thumb--emoji"
                    style={r.photoUrl ? { display: 'none' } : undefined}
                  >
                    {emoji}
                  </div>
                </div>
                <div className="editor-row-info">
                  <div className="editor-row-name">{r.name}</div>
                  <div className="editor-row-meta">
                    <span className={`editor-cat-badge editor-cat-badge--${r.category}`}>
                      {catLabel}
                    </span>
                    <span>★ {r.rating} ({r.reviewCount.toLocaleString()})</span>
                    {imgCount > 0 ? (
                      <span className="editor-img-count">📷 {imgCount}장</span>
                    ) : (
                      <span className="editor-img-count editor-img-count--none">이미지 없음</span>
                    )}
                  </div>
                  {r.address && <div className="editor-row-addr">📍 {r.address}</div>}
                </div>
                <div className="editor-row-actions">
                  <button className="admin-btn" onClick={() => handleEdit(r.id)}>✏️</button>
                  <button className="admin-btn editor-btn--danger" onClick={() => handleDelete(r.id)}>🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="editor-toolbar">
        <button className="admin-btn admin-btn--primary" onClick={handleFetchFromMaps}>
          🗺 구글맵에서 불러오기
        </button>
        <button className="admin-btn" onClick={handleAdd}>+ 식당 추가</button>
        <button className="admin-btn" onClick={handleExport}>📥 JSON 내보내기</button>
        <button className="admin-btn editor-btn--danger" onClick={handleReset}>↩ 기본값 복원</button>
      </div>

      {editingRestaurantId && (
        <RestaurantEditPanel
          areaId={editorAreaId}
          restaurantId={editingRestaurantId}
          onClose={handleClosePanel}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
