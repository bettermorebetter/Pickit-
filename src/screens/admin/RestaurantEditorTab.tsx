/* ══════════════════════════════════════════════════════════════
   Restaurant Editor Tab — curated restaurant CRUD
══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { CURATED_AREAS, CURATED_DATA_VERSION, getCuratedDataRaw, saveCuratedData } from '../../data/restaurants.ts';
import { fetchAllRestaurantData, fetchRestaurantByPlaceId } from '../../services/adminPhotos.ts';
import type { CuratedRestaurantSeed, FoodCategoryKey, CuratedAreaId } from '../../types/index.ts';
import RestaurantEditPanel from './RestaurantEditPanel.tsx';

/* ── Google Maps URL → Place ID extraction ─────────────── */

function extractPlaceId(url: string): string | null {
  // Pattern 1: ChIJ... or similar place_id in URL params
  const paramMatch = url.match(/place_id[=:]([A-Za-z0-9_-]+)/);
  if (paramMatch) return paramMatch[1];

  // Pattern 2: /place/.../ data segment with !1s prefix (e.g. !1sChIJ...)
  const dataMatch = url.match(/!1s(ChIJ[A-Za-z0-9_-]+)/);
  if (dataMatch) return dataMatch[1];

  // Pattern 3: hex-encoded ftid (e.g. !1s0x357ca...:0x...)
  const ftidMatch = url.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (ftidMatch) return ftidMatch[1];

  // Pattern 4: ?ftid=0x...:0x...
  const ftidParam = url.match(/ftid=(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (ftidParam) return ftidParam[1];

  return null;
}

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

  const handleAdd = useCallback(async () => {
    const url = prompt('구글맵 URL을 붙여넣으세요:');
    if (!url?.trim()) return;

    // Extract Place ID from Google Maps URL
    const placeId = extractPlaceId(url.trim());
    if (!placeId) {
      showToast('Place ID를 추출할 수 없습니다. URL을 확인하세요.');
      return;
    }

    showToast('식당 정보를 가져오는 중...');
    const data = await fetchRestaurantByPlaceId(placeId);
    if (!data) {
      showToast('식당 정보를 가져올 수 없습니다.');
      return;
    }

    // Classify photos: food photos first
    const { reorderByFood } = await import('../../services/foodClassifier.ts');
    const { urls: orderedPhotos } = await reorderByFood(data.photoUrls);

    const rests = getCuratedDataRaw(editorAreaId);
    const newId = `${editorAreaId}_${Date.now()}`;
    const newRest: CuratedRestaurantSeed = {
      id: newId,
      name: data.name,
      category: 'korean' as FoodCategoryKey,
      address: data.address,
      rating: data.rating,
      reviewCount: data.reviewCount,
      photoUrl: orderedPhotos[0] || '',
      photoUrls: orderedPhotos.slice(0, 5),
      photoPool: orderedPhotos,
      lat: data.lat,
      lng: data.lng,
    };
    rests.push(newRest);
    saveCuratedData(editorAreaId, rests);
    dispatch({ type: 'BUMP_VERSION' });
    dispatch({ type: 'SET_EDITING', id: newId });
    showToast(`✅ "${data.name}" 추가 완료!`);
  }, [editorAreaId, dispatch, showToast]);

  // Auto-fetch photos for restaurants missing images (once per area)
  const fetchedAreas = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (fetchedAreas.current.has(editorAreaId)) return;
    fetchedAreas.current.add(editorAreaId);

    const rests = getCuratedDataRaw(editorAreaId);
    const needsPhotos = rests.filter(r => !r.photoUrl && (!r.photoUrls || !r.photoUrls.length));
    if (!needsPhotos.length) return;

    (async () => {
      const { reorderByFood } = await import('../../services/foodClassifier.ts');

      showToast(`📷 ${needsPhotos.length}개 식당 이미지 로딩 중...`);
      let filled = 0;

      for (let i = 0; i < needsPhotos.length; i += 3) {
        const batch = needsPhotos.slice(i, i + 3);
        const results = await Promise.all(
          batch.map(r => fetchAllRestaurantData(r.name, r.lat, r.lng))
        );
        // Re-read fresh data each batch to avoid overwriting deletions
        const fresh = getCuratedDataRaw(editorAreaId);
        for (let j = 0; j < batch.length; j++) {
          const data = results[j];
          if (!data || !data.photoUrls.length) continue;
          const target = fresh.find(r => r.id === batch[j].id);
          if (!target) continue; // deleted during fetch → skip

          const { urls } = await reorderByFood(data.photoUrls);
          target.photoUrls = urls.slice(0, 5);
          target.photoUrl = urls[0] || '';
          target.rating = data.rating;
          target.reviewCount = data.reviewCount;
          filled++;
        }
        saveCuratedData(editorAreaId, fresh);
        dispatch({ type: 'BUMP_VERSION' });

        if (i + 3 < needsPhotos.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      if (filled > 0) showToast(`✅ ${filled}개 식당 이미지 자동 설정!`);
    })();
  }, [editorAreaId, dispatch, showToast]);

  // Bulk photo update: fetch & classify photos for ALL restaurants in current area
  const [bulkProgress, setBulkProgress] = useState('');
  const handleBulkPhotoUpdate = useCallback(async () => {
    const rests = getCuratedDataRaw(editorAreaId);
    if (!rests.length) return;

    const { reorderByFood } = await import('../../services/foodClassifier.ts');
    setBulkProgress(`0/${rests.length}`);
    let updated = 0;

    for (let i = 0; i < rests.length; i += 3) {
      const batch = rests.slice(i, i + 3);
      const results = await Promise.all(
        batch.map(r => fetchAllRestaurantData(r.name, r.lat, r.lng))
      );
      const fresh = getCuratedDataRaw(editorAreaId);
      for (let j = 0; j < batch.length; j++) {
        const data = results[j];
        if (!data || !data.photoUrls.length) continue;
        const target = fresh.find(r => r.id === batch[j].id);
        if (!target) continue;

        const { urls } = await reorderByFood(data.photoUrls);
        target.photoUrls = urls.slice(0, 5);
        target.photoUrl = urls[0] || '';
        target.rating = data.rating;
        target.reviewCount = data.reviewCount;
        updated++;
      }
      saveCuratedData(editorAreaId, fresh);
      dispatch({ type: 'BUMP_VERSION' });
      setBulkProgress(`${Math.min(i + 3, rests.length)}/${rests.length}`);

      if (i + 3 < rests.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    setBulkProgress('');
    showToast(`✅ ${updated}/${rests.length} 식당 사진 업데이트!`);
  }, [editorAreaId, dispatch, showToast]);

  // Backup: export all curated data as JSON download
  const handleBackup = useCallback(() => {
    const allData: Record<string, any> = { _version: CURATED_DATA_VERSION, _date: new Date().toISOString() };
    let totalRestaurants = 0;
    for (const areaId of AREA_IDS) {
      const rests = getCuratedDataRaw(areaId);
      // Strip photoPool (large, from seed data)
      allData[areaId] = rests.map(({ photoPool, ...rest }) => rest);
      totalRestaurants += rests.length;
    }
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 5).replace(':', '')}`;
    a.href = url;
    a.download = `pickit-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`백업 완료! (${totalRestaurants}개 식당)`);
  }, [showToast]);

  // Restore: import JSON backup file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleRestore = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data._version) {
          showToast('잘못된 백업 파일입니다.');
          return;
        }
        if (!confirm(`${data._date || '날짜 불명'} 백업을 복원하시겠습니까?\n현재 데이터를 덮어씁니다.`)) return;
        // Write each area to localStorage + KV
        for (const areaId of AREA_IDS) {
          if (data[areaId]?.length) {
            saveCuratedData(areaId, data[areaId]);
          }
        }
        dispatch({ type: 'BUMP_VERSION' });
        showToast('복원 완료!');
      } catch {
        showToast('파일 파싱 실패');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [dispatch, showToast]);

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
        <button className="admin-btn admin-btn--primary" onClick={handleAdd}>+ 식당 추가</button>
        <button
          className="admin-btn"
          onClick={handleBulkPhotoUpdate}
          disabled={!!bulkProgress}
        >
          {bulkProgress ? `📷 ${bulkProgress}` : '📷 전체 사진 업데이트'}
        </button>
        <button className="admin-btn" onClick={handleBackup}>백업</button>
        <button className="admin-btn" onClick={handleRestore}>복원</button>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
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
