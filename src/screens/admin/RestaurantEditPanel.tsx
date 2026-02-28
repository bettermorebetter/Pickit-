/* ══════════════════════════════════════════════════════════════
   Restaurant Edit Panel — inline form for editing a restaurant
══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCuratedDataRaw, saveCuratedData } from '../../data/restaurants.ts';
import type { FoodCategoryKey } from '../../types/index.ts';
import ImageSection from './ImageSection.tsx';

interface Props {
  areaId: string;
  restaurantId: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function RestaurantEditPanel({ areaId, restaurantId, onClose, onSaved }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategoryKey>('korean');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [reviewCount, setReviewCount] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    const restaurants = getCuratedDataRaw(areaId);
    const r = restaurants.find(x => x.id === restaurantId);
    if (!r) return;
    setName(r.name || '');
    setCategory((r.category as FoodCategoryKey) || 'korean');
    setAddress(r.address || '');
    setRating(r.rating != null ? String(r.rating) : '');
    setReviewCount(r.reviewCount != null ? String(r.reviewCount) : '');
    setLat(r.lat != null ? String(r.lat) : '');
    setLng(r.lng != null ? String(r.lng) : '');
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [areaId, restaurantId]);

  const handleSave = useCallback(() => {
    const rests = getCuratedDataRaw(areaId);
    const target = rests.find(x => x.id === restaurantId);
    if (!target) return;

    target.name = name.trim();
    target.category = category;
    target.address = address.trim();
    target.rating = parseFloat(rating) || 0;
    target.reviewCount = parseInt(reviewCount) || 0;
    target.lat = parseFloat(lat) || 0;
    target.lng = parseFloat(lng) || 0;

    saveCuratedData(areaId, rests);
    onSaved();
    onClose();
  }, [areaId, restaurantId, name, category, address, rating, reviewCount, lat, lng, onSaved, onClose]);

  const mapsLink = lat && lng && name
    ? `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},17z`
    : '#';

  return (
    <div className="editor-panel" ref={panelRef}>
      <h3 className="editor-panel-title">✏️ 식당 편집</h3>
      <div className="editor-form">
        <div className="editor-field">
          <label className="editor-label">이름</label>
          <input
            type="text"
            className="editor-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="식당 이름"
          />
        </div>
        <div className="editor-field">
          <label className="editor-label">분류</label>
          <select
            className="editor-input"
            value={category}
            onChange={e => setCategory(e.target.value as FoodCategoryKey)}
          >
            <option value="korean">🍚 한식</option>
            <option value="japanese">🍣 일식</option>
            <option value="chinese">🥟 중식</option>
            <option value="western">🍔 양식</option>
          </select>
        </div>
        <div className="editor-field">
          <label className="editor-label">주소</label>
          <input
            type="text"
            className="editor-input"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="서울 ..."
          />
          <a className="edit-maps-link" href={mapsLink} target="_blank" rel="noopener">
            🗺 구글맵에서 확인
          </a>
        </div>
        <div className="editor-field-row">
          <div className="editor-field">
            <label className="editor-label">평점</label>
            <input
              type="number"
              className="editor-input"
              value={rating}
              onChange={e => setRating(e.target.value)}
              min="1" max="5" step="0.1" placeholder="4.2"
            />
          </div>
          <div className="editor-field">
            <label className="editor-label">리뷰 수</label>
            <input
              type="number"
              className="editor-input"
              value={reviewCount}
              onChange={e => setReviewCount(e.target.value)}
              min="0" placeholder="500"
            />
          </div>
        </div>
        <div className="editor-field-row">
          <div className="editor-field">
            <label className="editor-label">위도</label>
            <input
              type="number"
              className="editor-input"
              value={lat}
              onChange={e => setLat(e.target.value)}
              step="0.0001" placeholder="37.xxxx"
            />
          </div>
          <div className="editor-field">
            <label className="editor-label">경도</label>
            <input
              type="number"
              className="editor-input"
              value={lng}
              onChange={e => setLng(e.target.value)}
              step="0.0001" placeholder="127.xxxx"
            />
          </div>
        </div>

        <ImageSection areaId={areaId} restaurantId={restaurantId} onChanged={onSaved} />
      </div>
      <div className="editor-panel-footer">
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>💾 저장</button>
        <button className="admin-btn" onClick={onClose}>취소</button>
      </div>
    </div>
  );
}
