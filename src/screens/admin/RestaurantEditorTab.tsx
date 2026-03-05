/* ══════════════════════════════════════════════════════════════
   Restaurant Editor Tab — curated restaurant CRUD
══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { CURATED_AREAS, getCuratedDataRaw, saveCuratedData } from '../../data/restaurants.ts';
import { fetchReviewData, fetchAllRestaurantData } from '../../services/adminPhotos.ts';
import type { CuratedRestaurantSeed, FoodCategoryKey, CuratedAreaId } from '../../types/index.ts';
import RestaurantEditPanel from './RestaurantEditPanel.tsx';

const CAT_LABELS: Record<string, string> = { korean: '한식', japanese: '일식', chinese: '중식', western: '양식' };
const CAT_EMOJIS: Record<string, string> = { korean: '🍚', japanese: '🍣', chinese: '🥟', western: '🍔' };
const AREA_IDS = Object.keys(CURATED_AREAS) as CuratedAreaId[];

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

  const handleAreaChange = useCallback((areaId: CuratedAreaId) => {
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

  // Auto-fetch review data on first load per area
  const fetchedAreas = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (fetchedAreas.current.has(editorAreaId)) return;
    fetchedAreas.current.add(editorAreaId);

    const rests = getCuratedDataRaw(editorAreaId);
    if (!rests.length) return;

    (async () => {
      // Preload food classifier model in parallel with data fetching
      const { preloadModel, reorderByFood } = await import('../../services/foodClassifier.ts');
      preloadModel();

      showToast('리뷰 + 이미지 자동 갱신 중...');
      let updated = 0;
      let classifiedCount = 0;
      for (let i = 0; i < rests.length; i += 3) {
        const batch = rests.slice(i, i + 3);
        const results = await Promise.all(
          batch.map(r => fetchAllRestaurantData(r.name, r.lat, r.lng))
        );
        for (let j = 0; j < results.length; j++) {
          const data = results[j];
          if (!data) continue;
          rests[i + j].rating = data.rating;
          rests[i + j].reviewCount = data.reviewCount;
          // Only set photos if restaurant doesn't already have them (preserve manual edits)
          const hasPhotos = rests[i + j].photoUrl && rests[i + j].photoUrls?.length > 0;
          if (!hasPhotos && data.photoUrls.length > 0) {
            // Classify photos: food photos first
            const { urls, foodCount } = await reorderByFood(data.photoUrls);
            rests[i + j].photoUrls = urls;
            rests[i + j].photoUrl = urls[0] || '';
            if (foodCount > 0) classifiedCount++;
          }
          updated++;
        }
        saveCuratedData(editorAreaId, rests);
        dispatch({ type: 'BUMP_VERSION' });
        if (i + 3 < rests.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      showToast(`✅ ${updated}개 갱신, 🍔 ${classifiedCount}개 음식사진 자동 설정!`);
    })();
  }, [editorAreaId, dispatch, showToast]);

  const handleRefreshReviews = useCallback(async () => {
    const rests = getCuratedDataRaw(editorAreaId);
    if (!rests.length) return;

    const { reorderByFood } = await import('../../services/foodClassifier.ts');

    showToast('리뷰 + 이미지 갱신 중...');
    let updated = 0;
    let classifiedCount = 0;

    for (let i = 0; i < rests.length; i += 3) {
      const batch = rests.slice(i, i + 3);
      const results = await Promise.all(
        batch.map(r => fetchAllRestaurantData(r.name, r.lat, r.lng))
      );
      for (let j = 0; j < results.length; j++) {
        const data = results[j];
        if (!data) continue;
        rests[i + j].rating = data.rating;
        rests[i + j].reviewCount = data.reviewCount;
        if (data.photoUrls.length > 0) {
          const { urls, foodCount } = await reorderByFood(data.photoUrls);
          rests[i + j].photoUrls = urls;
          rests[i + j].photoUrl = urls[0] || '';
          if (foodCount > 0) classifiedCount++;
        }
        updated++;
      }
      if (i + 3 < rests.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    saveCuratedData(editorAreaId, rests);
    dispatch({ type: 'BUMP_VERSION' });
    showToast(`✅ ${updated}개 갱신, 🍔 ${classifiedCount}개 음식사진 자동 설정!`);
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
    // Reset KV to seed data
    const area = CURATED_AREAS[editorAreaId];
    if (area) {
      import('../../services/kvStorage.ts').then(m => m.saveAreaToKV(editorAreaId, area.restaurants)).catch(() => {});
    }
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

      <div className="editor-area-bar editor-area-bar--scrollable">
        {AREA_IDS.map(id => (
          <button
            key={id}
            className={`editor-area-btn${editorAreaId === id ? ' editor-area-btn--active' : ''}`}
            onClick={() => handleAreaChange(id)}
          >
            {CURATED_AREAS[id].label}
          </button>
        ))}
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
        <button className="admin-btn admin-btn--primary" onClick={handleRefreshReviews}>
          ★ 리뷰 갱신
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
