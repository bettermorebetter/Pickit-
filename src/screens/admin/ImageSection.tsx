/* ══════════════════════════════════════════════════════════════
   Image Section — main/sub image slots + photo pool grid
══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCuratedDataRaw, saveCuratedData } from '../../data/restaurants.ts';
import { useAdmin } from '../../context/AdminContext.tsx';
import { fetchPhotosForRestaurant, fetchMorePhotos } from '../../services/adminPhotos.ts';

const IMG_MAX = 5;

interface Props {
  areaId: string;
  restaurantId: string;
  onChanged: () => void;
}

export default function ImageSection({ areaId, restaurantId, onChanged }: Props) {
  const { state, dispatch } = useAdmin();
  const [addUrl, setAddUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [, forceUpdate] = useState(0);

  const bump = useCallback(() => {
    forceUpdate(v => v + 1);
    onChanged();
  }, [onChanged]);

  const showToast = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2200);
  }, [dispatch]);

  // Fetch photos on mount (if not cached) and auto-set main/sub images from review photos
  useEffect(() => {
    if (state.photoCache[restaurantId]) return;
    const r = getCuratedDataRaw(areaId).find(x => x.id === restaurantId);
    if (!r) return;

    let cancelled = false;
    (async () => {
      const { displaySlice, fullPool } = await fetchPhotosForRestaurant(r.name, r.lat, r.lng);
      if (cancelled) return;
      if (displaySlice.length > 0) {
        dispatch({ type: 'SET_PHOTO_CACHE', restaurantId, photos: displaySlice });
        dispatch({ type: 'SET_FULL_PHOTO_POOL', restaurantId, photos: fullPool });

        // Auto-set food photos as main + sub images (only if not already set)
        const rests = getCuratedDataRaw(areaId);
        const target = rests.find(x => x.id === restaurantId);
        if (target && !(target.photoUrl && target.photoUrls?.length > 0)) {
          const candidates = displaySlice.slice(0, IMG_MAX);
          try {
            const { reorderByFood } = await import('../../services/foodClassifier.ts');
            const { urls } = await reorderByFood(candidates);
            target.photoUrls = urls;
            target.photoUrl = urls[0] || candidates[0];
          } catch (_e) {
            target.photoUrls = candidates;
            target.photoUrl = candidates[0];
          }
          saveCuratedData(areaId, rests);
          bump();
        }
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  // Read fresh data
  const r = getCuratedDataRaw(areaId).find(x => x.id === restaurantId);
  const currentUrls = r?.photoUrls?.length ? r.photoUrls : (r?.photoUrl ? [r.photoUrl] : []);
  const atMax = currentUrls.length >= IMG_MAX;
  const pool = state.photoCache[restaurantId] || r?.photoPool || [];

  const handleRemove = useCallback((idx: number) => {
    const rests = getCuratedDataRaw(areaId);
    const target = rests.find(x => x.id === restaurantId);
    if (!target) return;
    const cur = target.photoUrls?.length ? [...target.photoUrls] : (target.photoUrl ? [target.photoUrl] : []);
    cur.splice(idx, 1);
    target.photoUrls = cur;
    target.photoUrl = cur[0] || '';
    saveCuratedData(areaId, rests);
    bump();
  }, [areaId, restaurantId, bump]);

  const handlePromote = useCallback((idx: number) => {
    const rests = getCuratedDataRaw(areaId);
    const target = rests.find(x => x.id === restaurantId);
    if (!target) return;
    const cur = target.photoUrls?.length ? [...target.photoUrls] : (target.photoUrl ? [target.photoUrl] : []);
    const [chosen] = cur.splice(idx, 1);
    cur.unshift(chosen);
    target.photoUrls = cur;
    target.photoUrl = cur[0] || '';
    saveCuratedData(areaId, rests);
    bump();
  }, [areaId, restaurantId, bump]);

  const handlePoolClick = useCallback((url: string) => {
    const rests = getCuratedDataRaw(areaId);
    const target = rests.find(x => x.id === restaurantId);
    if (!target) return;
    const cur = target.photoUrls?.length ? [...target.photoUrls] : (target.photoUrl ? [target.photoUrl] : []);
    const existIdx = cur.indexOf(url);
    if (existIdx !== -1) {
      cur.splice(existIdx, 1);
    } else if (cur.length >= IMG_MAX) {
      showToast(`최대 ${IMG_MAX}장까지 선택할 수 있습니다.`);
      return;
    } else {
      cur.push(url);
    }
    target.photoUrls = cur;
    target.photoUrl = cur[0] || '';
    saveCuratedData(areaId, rests);
    bump();
  }, [areaId, restaurantId, bump, showToast]);

  const handleAddUrl = useCallback(() => {
    const url = addUrl.trim();
    if (!url) return;
    const rests = getCuratedDataRaw(areaId);
    const target = rests.find(x => x.id === restaurantId);
    if (!target) return;
    const cur = target.photoUrls?.length ? [...target.photoUrls] : (target.photoUrl ? [target.photoUrl] : []);
    if (cur.length >= IMG_MAX) {
      showToast(`최대 ${IMG_MAX}장까지 추가할 수 있습니다.`);
      return;
    }
    if (!cur.includes(url)) cur.push(url);
    target.photoUrls = cur;
    target.photoUrl = target.photoUrl || cur[0];
    saveCuratedData(areaId, rests);
    setAddUrl('');
    bump();
  }, [areaId, restaurantId, addUrl, bump, showToast]);

  // Paste handler: add image URL or clipboard image to the pool
  const poolRef = useRef<HTMLDivElement>(null);

  const addToPool = useCallback((url: string) => {
    const cached = state.photoCache[restaurantId] || [];
    if (cached.includes(url)) {
      showToast('이미 풀에 있는 이미지입니다.');
      return;
    }
    dispatch({ type: 'SET_PHOTO_CACHE', restaurantId, photos: [...cached, url] });
    const fullPool = state.fullPhotoPool[restaurantId] || [];
    if (!fullPool.includes(url)) {
      dispatch({ type: 'SET_FULL_PHOTO_POOL', restaurantId, photos: [...fullPool, url] });
    }
    showToast('이미지가 풀에 추가되었습니다!');
  }, [restaurantId, state.photoCache, state.fullPhotoPool, dispatch, showToast]);

  useEffect(() => {
    const el = poolRef.current;
    if (!el) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        // Case 1: Pasted text that looks like an image URL
        if (item.type === 'text/plain') {
          item.getAsString(text => {
            const trimmed = text.trim();
            if (/^https?:\/\/.+/i.test(trimmed)) {
              addToPool(trimmed);
            }
          });
          e.preventDefault();
          return;
        }

        // Case 2: Pasted image blob (screenshot, copied image)
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (!blob) continue;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              addToPool(reader.result);
            }
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
          return;
        }
      }
    };

    el.addEventListener('paste', handlePaste);
    return () => el.removeEventListener('paste', handlePaste);
  }, [addToPool]);

  const handleRefresh = useCallback(async () => {
    const r = getCuratedDataRaw(areaId).find(x => x.id === restaurantId);
    if (!r) return;
    setRefreshing(true);
    const existingPool = state.fullPhotoPool[restaurantId] || [];
    const currentDisplay = state.photoCache[restaurantId] || [];
    const { displaySlice, fullPool } = await fetchMorePhotos(r.name, r.lat, r.lng, existingPool, currentDisplay);
    dispatch({ type: 'SET_FULL_PHOTO_POOL', restaurantId, photos: fullPool });
    dispatch({ type: 'SET_PHOTO_CACHE', restaurantId, photos: displaySlice });
    setRefreshing(false);
  }, [areaId, restaurantId, state.fullPhotoPool, state.photoCache, dispatch]);

  return (
    <div className="editor-images-section">
      <div className="ei-header">
        <span className="editor-label">이미지</span>
        <span className="ei-count">{currentUrls.length} / {IMG_MAX}장</span>
      </div>

      {/* Main image */}
      <div className="ei-main">
        <div className="ei-section-label">메인 이미지</div>
        {currentUrls[0] ? (
          <div className="ei-main-frame">
            <img src={currentUrls[0]} alt="메인 이미지" />
            <div className="ei-main-overlay">
              <button className="ei-action-btn ei-action-btn--remove" onClick={() => handleRemove(0)}>
                ✕ 삭제
              </button>
            </div>
            <div className="ei-main-badge">메인</div>
          </div>
        ) : (
          <div className="ei-empty-slot">
            <span className="ei-empty-icon">🖼️</span>
            <span>아래 풀에서 이미지를 선택하세요</span>
          </div>
        )}
      </div>

      {/* Sub images */}
      <div className="ei-sub">
        <div className="ei-section-label">서브 이미지</div>
        <div className="ei-sub-grid">
          {Array.from({ length: IMG_MAX - 1 }, (_, i) => {
            const idx = i + 1;
            const url = currentUrls[idx];
            return url ? (
              <div key={idx} className="ei-sub-slot ei-sub-slot--filled">
                <img src={url} alt={`서브 ${idx}`} />
                <div className="ei-sub-overlay">
                  <button
                    className="ei-action-btn ei-action-btn--promote"
                    onClick={() => handlePromote(idx)}
                    title="메인으로 설정"
                  >
                    ★ 메인
                  </button>
                  <button
                    className="ei-action-btn ei-action-btn--remove"
                    onClick={() => handleRemove(idx)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div key={idx} className="ei-sub-slot ei-sub-slot--empty">
                <span>+</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pool grid */}
      <div className="ei-pool-section" ref={poolRef} tabIndex={-1}>
        <div className="ei-pool-header">
          <span className="ei-section-label">이미지 풀 (구글 포토)</span>
          <span className="ei-pool-hint">클릭으로 선택/해제 · Ctrl+V로 이미지 추가</span>
        </div>
        <div className="ei-pool-grid">
          {pool.length === 0 ? (
            <p className="ei-pool-empty">이미지 풀이 없습니다.</p>
          ) : (
            pool.map((url, i) => {
              const selIdx = currentUrls.indexOf(url);
              const isSelected = selIdx !== -1;
              return (
                <div
                  key={`${url}-${i}`}
                  className={`ei-pool-tile${isSelected ? ' ei-pool-tile--selected' : ''}`}
                  onClick={() => handlePoolClick(url)}
                >
                  <img src={url} alt="" />
                  {isSelected && <div className="ei-pool-badge">{selIdx + 1}</div>}
                </div>
              );
            })
          )}
        </div>
        <div className="ei-pool-refresh-row">
          <button
            className="admin-btn ei-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '불러오는 중...' : '↺ 새 이미지 불러오기'}
          </button>
        </div>
      </div>

      {/* URL add */}
      <div className="ei-add-row">
        <input
          type="url"
          className="admin-url-input"
          value={addUrl}
          onChange={e => setAddUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAddUrl(); }}
          placeholder={atMax ? `최대 ${IMG_MAX}장입니다` : '이미지 URL 붙여넣기'}
          disabled={atMax}
        />
        <button className="admin-btn admin-btn--add" onClick={handleAddUrl} disabled={atMax}>
          추가
        </button>
      </div>
    </div>
  );
}
