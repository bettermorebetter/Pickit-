/* ══════════════════════════════════════════════════════════════
   Location Screen — choose a curated area to start
══════════════════════════════════════════════════════════════ */

import { useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { shuffle } from '../data/constants.ts';
import { CURATED_AREAS, getCuratedRestaurants } from '../data/restaurants.ts';
import type { CuratedAreaId } from '../types/index.ts';
import InstallBanner from '../components/InstallBanner.tsx';

const AREA_CONFIGS: { id: CuratedAreaId; emoji: string; label: string; desc: string }[] = [
  { id: 'snu',        emoji: '🎓', label: '서울대입구역', desc: '샤로수길 맛집' },
  { id: 'sookmyung', emoji: '🎀', label: '숙대입구역',   desc: '숙대 맛집' },
  { id: 'konkuk',    emoji: '🐄', label: '건대입구역',   desc: '건대 맛집' },
  { id: 'hongdae',   emoji: '🎸', label: '홍대입구역',   desc: '홍대 맛집' },
  { id: 'ewha',      emoji: '🌸', label: '이대역',       desc: '이대 맛집' },
  { id: 'seongsu',   emoji: '🏭', label: '성수역',       desc: '성수 맛집' },
  { id: 'jamsil',    emoji: '🎢', label: '잠실역',       desc: '잠실 맛집' },
  { id: 'euljiro',   emoji: '🏮', label: '을지로역',     desc: '을지로 맛집' },
  { id: 'sadang',    emoji: '🚇', label: '사당역',       desc: '사당 맛집' },
  { id: 'gangnam',   emoji: '💎', label: '강남역',       desc: '강남 맛집' },
];

export default function LocationScreen() {
  const { dispatch } = useApp();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleIconTap = useCallback(() => {
    tapCountRef.current++;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      dispatch({ type: 'SET_SCREEN', screen: 'admin' });
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2000);
  }, [dispatch]);

  const handleArea = useCallback((areaId: CuratedAreaId) => {
    const all = getCuratedRestaurants(areaId);
    if (all.length < 8) return;
    const restaurants = shuffle(all).slice(0, 8);
    dispatch({ type: 'SET_LOCATION_MODE', mode: areaId });
    dispatch({ type: 'SET_RESTAURANTS', restaurants });
    dispatch({ type: 'SET_SCREEN', screen: 'map' });
  }, [dispatch]);

  return (
    <div className="screen">
      <InstallBanner />
      <div className="location-wrapper">
        <div className="location-hero">
          <h1 className="location-title" onClick={handleIconTap}><span className="location-icon">🍽️</span> Pickit!</h1>
        </div>

        <div className="location-form">
          <div className="mode-section-label">지역 선택</div>
          <div className="area-grid">
            {AREA_CONFIGS.map(({ id, emoji, label, desc }) => {
              const area = CURATED_AREAS[id];
              const count = area?.restaurants?.length || 0;
              const disabled = count < 8;
              return (
                <button
                  key={id}
                  className={`btn--area${disabled ? ' btn--area--disabled' : ''}`}
                  onClick={() => !disabled && handleArea(id)}
                  disabled={disabled}
                >
                  <span className="area-emoji">{emoji}</span>
                  <span className="area-label">{label}</span>
                  <span className="area-desc">{disabled ? '아직 준비 중' : desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
