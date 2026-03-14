/* ══════════════════════════════════════════════════════════════
   Create World Cup Screen — 새 월드컵 만들기
══════════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { saveWorldCup } from '../services/worldCupStorage.ts';
import type { FoodCategoryKey, WorldCupRestaurant } from '../types/index.ts';

const CATEGORY_OPTIONS: { value: FoodCategoryKey; label: string; emoji: string }[] = [
  { value: 'korean',   label: '한식', emoji: '🍚' },
  { value: 'japanese', label: '일식', emoji: '🍣' },
  { value: 'chinese',  label: '중식', emoji: '🥟' },
  { value: 'western',  label: '양식', emoji: '🍔' },
];

const emptyRestaurant = (): WorldCupRestaurant => ({
  name: '',
  category: 'korean',
  photoUrl: '',
  address: '',
});

export default function CreateWorldCupScreen() {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [restaurants, setRestaurants] = useState<WorldCupRestaurant[]>(
    () => Array.from({ length: 8 }, emptyRestaurant)
  );
  const [error, setError] = useState('');

  const updateRestaurant = useCallback((idx: number, field: keyof WorldCupRestaurant, value: string) => {
    setRestaurants(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      setError('월드컵 제목을 입력해주세요.');
      return;
    }
    if (!creator.trim()) {
      setError('만든 사람 이름을 입력해주세요.');
      return;
    }
    const filledCount = restaurants.filter(r => r.name.trim()).length;
    if (filledCount < 8) {
      setError(`식당 8개를 모두 입력해주세요. (현재 ${filledCount}개)`);
      return;
    }

    const worldCup = saveWorldCup({
      title: title.trim(),
      creator: creator.trim(),
      restaurants: restaurants.map(r => ({
        ...r,
        name: r.name.trim(),
        address: r.address?.trim() || '',
        photoUrl: r.photoUrl?.trim() || '',
      })),
    });

    dispatch({ type: 'SET_WORLDCUP', worldCup });
    dispatch({ type: 'SET_SCREEN', screen: 'location' });
  }, [title, creator, restaurants, dispatch]);

  return (
    <div className="screen">
      <div className="create-wc-wrapper">
        <div className="screen-header">
          <button className="btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'location' })}>
            ← 뒤로
          </button>
          <h2 className="screen-title">새 월드컵 만들기</h2>
        </div>

        <div className="create-wc-form">
          <div className="create-wc-field">
            <label className="create-wc-label">월드컵 제목</label>
            <input
              className="create-wc-input"
              type="text"
              placeholder="예: 홍대 맛집 월드컵"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="create-wc-field">
            <label className="create-wc-label">만든 사람</label>
            <input
              className="create-wc-input"
              type="text"
              placeholder="닉네임"
              value={creator}
              onChange={e => setCreator(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="create-wc-divider" />

          <div className="create-wc-label">식당 8개 등록</div>

          {restaurants.map((r, idx) => (
            <div key={idx} className="create-wc-restaurant">
              <div className="create-wc-restaurant-header">
                <span className="create-wc-restaurant-num">{idx + 1}</span>
                {r.name.trim() ? (
                  <span className="create-wc-restaurant-check">✓</span>
                ) : null}
              </div>
              <input
                className="create-wc-input"
                type="text"
                placeholder="식당 이름 *"
                value={r.name}
                onChange={e => updateRestaurant(idx, 'name', e.target.value)}
                maxLength={30}
              />
              <div className="create-wc-row">
                <select
                  className="create-wc-select"
                  value={r.category}
                  onChange={e => updateRestaurant(idx, 'category', e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.emoji} {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  className="create-wc-input create-wc-input--small"
                  type="text"
                  placeholder="주소 (선택)"
                  value={r.address || ''}
                  onChange={e => updateRestaurant(idx, 'address', e.target.value)}
                />
              </div>
              <input
                className="create-wc-input"
                type="url"
                placeholder="사진 URL (선택)"
                value={r.photoUrl || ''}
                onChange={e => updateRestaurant(idx, 'photoUrl', e.target.value)}
              />
            </div>
          ))}

          {error && <div className="create-wc-error">{error}</div>}

          <button className="btn btn--primary btn--full" onClick={handleSubmit}>
            월드컵 만들기 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
