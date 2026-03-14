/* ══════════════════════════════════════════════════════════════
   Location Screen — choose a curated area or a user world cup
══════════════════════════════════════════════════════════════ */

import { useCallback, useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { shuffle, FOOD_CATEGORIES } from '../data/constants.ts';
import { CURATED_AREAS, getCuratedRestaurants } from '../data/restaurants.ts';
import { getWorldCups, deleteWorldCup, incrementPlayCount, getWorldCupShareUrl, getWorldCupById } from '../services/worldCupStorage.ts';
import type { CuratedAreaId, WorldCup, FoodCategoryKey, Restaurant } from '../types/index.ts';
import InstallBanner from '../components/InstallBanner.tsx';

const AREA_CONFIGS: { id: CuratedAreaId; emoji: string; label: string; desc: string }[] = [
  { id: 'snu',        emoji: '🎓', label: '서울대입구역', desc: '샤로수길 맛집' },
  { id: 'sookmyung', emoji: '🎀', label: '숙대입구역',   desc: '숙대 맛집' },
  { id: 'konkuk',    emoji: '🐄', label: '건대입구역',   desc: '건대 맛집' },
  { id: 'hongdae',   emoji: '🎸', label: '홍대입구역',   desc: '홍대 맛집' },
  { id: 'gangnam',   emoji: '💎', label: '강남역',       desc: '강남 맛집' },
];

const GRADIENTS = [
  'linear-gradient(135deg,#fef3c7,#fde68a)',
  'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'linear-gradient(135deg,#fee2e2,#fecaca)',
  'linear-gradient(135deg,#eff6ff,#dbeafe)',
  'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
  'linear-gradient(135deg,#ecfdf5,#a7f3d0)',
  'linear-gradient(135deg,#fff7ed,#fed7aa)',
];

const EMOJIS: Record<string, string> = { korean: '🍚', japanese: '🍣', chinese: '🥟', western: '🍔' };
const CAT_LABELS: Record<string, string> = { korean: '한식', japanese: '일식', chinese: '중식', western: '양식' };

function worldCupToRestaurants(wc: WorldCup): Restaurant[] {
  return wc.restaurants.map((r, i) => ({
    id: `wc_${wc.id}_${i}`,
    name: r.name,
    foodCategory: r.category,
    category: CAT_LABELS[r.category] || r.category,
    rating: 0,
    reviewCount: 0,
    address: r.address || '',
    lat: 0,
    lng: 0,
    emoji: EMOJIS[r.category] || '🍽️',
    gradient: GRADIENTS[i % GRADIENTS.length],
    photoUrl: r.photoUrl || null,
    photoUrls: r.photoUrl ? [r.photoUrl] : [],
  }));
}

type Tab = 'area' | 'worldcup';

export default function LocationScreen() {
  const { dispatch } = useApp();
  const [tab, setTab] = useState<Tab>('area');
  const [worldCups, setWorldCups] = useState<WorldCup[]>([]);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWorldCups(getWorldCups());
  }, [tab]);

  // Check URL for shared world cup on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wcId = params.get('wc');
    if (wcId) {
      const wc = getWorldCupById(wcId);
      if (wc) {
        handleWorldCup(wc);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

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
    dispatch({ type: 'SET_WORLDCUP', worldCup: null });
    dispatch({ type: 'SET_RESTAURANTS', restaurants });
    dispatch({ type: 'SET_SCREEN', screen: 'map' });
  }, [dispatch]);

  const handleWorldCup = useCallback((wc: WorldCup) => {
    const restaurants = worldCupToRestaurants(wc);
    incrementPlayCount(wc.id);
    dispatch({ type: 'SET_LOCATION_MODE', mode: null });
    dispatch({ type: 'SET_WORLDCUP', worldCup: wc });
    dispatch({ type: 'SET_RESTAURANTS', restaurants });
    dispatch({ type: 'SET_SCREEN', screen: 'map' });
  }, [dispatch]);

  const handleShare = useCallback((wc: WorldCup) => {
    const url = getWorldCupShareUrl(wc.id);
    if (navigator.share) {
      navigator.share({ title: wc.title, text: `${wc.title} - Pickit 푸드 월드컵`, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareToast('링크 복사됨!');
        setTimeout(() => setShareToast(null), 2000);
      }).catch(() => {});
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteWorldCup(id);
    setWorldCups(getWorldCups());
  }, []);

  return (
    <div className="screen">
      <InstallBanner />
      <div className="location-wrapper">
        <div className="location-hero">
          <h1 className="location-title" onClick={handleIconTap}><span className="location-icon">🍽️</span> Pickit!</h1>
        </div>

        <div className="location-form">
          {/* Tab switcher */}
          <div className="location-tabs">
            <button
              className={`location-tab${tab === 'area' ? ' location-tab--active' : ''}`}
              onClick={() => setTab('area')}
            >
              지역 선택
            </button>
            <button
              className={`location-tab${tab === 'worldcup' ? ' location-tab--active' : ''}`}
              onClick={() => setTab('worldcup')}
            >
              큐레이션 월드컵
            </button>
          </div>

          {tab === 'area' && (
            <>
              <div className="mode-section-label">지역을 선택하세요</div>
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
            </>
          )}

          {tab === 'worldcup' && (
            <>
              <button
                className="btn btn--primary btn--full wc-create-btn"
                onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'create-worldcup' })}
              >
                + 새 월드컵 만들기
              </button>

              {worldCups.length === 0 ? (
                <div className="wc-empty">
                  <div className="wc-empty-icon">🏆</div>
                  <div className="wc-empty-text">아직 만들어진 월드컵이 없어요</div>
                  <div className="wc-empty-sub">직접 식당 8곳을 골라 나만의 월드컵을 만들어보세요!</div>
                </div>
              ) : (
                <div className="wc-list">
                  {worldCups.map(wc => (
                    <div key={wc.id} className="wc-card">
                      <div className="wc-card-main" onClick={() => handleWorldCup(wc)}>
                        <div className="wc-card-title">{wc.title}</div>
                        <div className="wc-card-meta">
                          <span>by {wc.creator}</span>
                          <span className="wc-card-dot">·</span>
                          <span>{wc.playCount}회 플레이</span>
                        </div>
                        <div className="wc-card-restaurants">
                          {wc.restaurants.map((r, i) => (
                            <span key={i} className="wc-card-tag">
                              {EMOJIS[r.category]} {r.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="wc-card-actions">
                        <button className="wc-action-btn" onClick={() => handleShare(wc)} title="공유">
                          📤
                        </button>
                        <button className="wc-action-btn wc-action-btn--danger" onClick={() => handleDelete(wc.id)} title="삭제">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {shareToast && (
          <div className="wc-toast">{shareToast}</div>
        )}
      </div>
    </div>
  );
}
