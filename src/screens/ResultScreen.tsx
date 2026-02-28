/* ══════════════════════════════════════════════════════════════
   Result Screen — champion card, map, share, restart
══════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { makeEmojiMarkerIcon } from '../services/places.ts';
import PhotoCarousel from '../components/PhotoCarousel.tsx';

export default function ResultScreen() {
  const { state, dispatch } = useApp();
  const c = state.champion;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [shareLabel, setShareLabel] = useState('공유하기 📤');

  useEffect(() => {
    if (!c || !mapRef.current) return;

    // Clean up old
    if (markerRef.current) markerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();

    try {
      if (typeof google === 'undefined' || !google.maps) throw new Error('no maps');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat: c.lat, lng: c.lng });
        mapInstanceRef.current.setZoom(16);
      } else {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: c.lat, lng: c.lng },
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'cooperative',
        });
      }

      markerRef.current = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: mapInstanceRef.current,
        icon: makeEmojiMarkerIcon(c.emoji),
        title: c.name,
      });

      infoWindowRef.current = new google.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-family:'Noto Sans KR',sans-serif;font-size:.875rem;font-weight:700;">${c.name}</div>`,
      });
      infoWindowRef.current.open({ anchor: markerRef.current, map: mapInstanceRef.current });
    } catch (_e) {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="map-error">
            <span class="map-error-icon">🗺️</span>
            <p class="map-error-text">지도를 불러올 수 없습니다.</p>
          </div>`;
      }
    }
  }, [c]);

  const handleShare = useCallback(() => {
    if (!c) return;
    const shareText = `🏆 서울 푸드 월드컵 우승!\n${c.name} (${c.category}) ★${c.rating}\n📍 ${c.address || '서울'}`;

    if (navigator.share) {
      navigator.share({ title: '서울 푸드 월드컵', text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareLabel('복사됨! ✅');
        setTimeout(() => setShareLabel('공유하기 📤'), 2000);
      }).catch(() => {});
    }
  }, [c]);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  if (!c) return null;

  const championMapsUrl = c.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${c.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + (c.address ? ' ' + c.address : ' 서울'))}`;

  const hasMultiplePhotos = c.photoUrls && c.photoUrls.length > 1;

  return (
    <div className="screen">
      <div className="result-wrapper">
        <div className="result-crown">🏆</div>
        <h2 className="result-title">나의 최애 맛집은?</h2>

        <div className="champion-card">
          <div className="champion-badge">우승! 🎉</div>
          <div className="champion-card-hero" style={{ background: c.gradient }}>
            {hasMultiplePhotos ? (
              <PhotoCarousel photos={c.photoUrls} alt={c.name} autoPlay />
            ) : c.photoUrl ? (
              <img src={c.photoUrl} alt={c.name} className="card-photo" />
            ) : (
              c.emoji
            )}
          </div>
          <div className="champion-card-body">
            <div className="champion-card-name">{c.name}</div>
            <div className="champion-card-category">{c.category}</div>
            {c.address && <div className="champion-card-address">📍 {c.address}</div>}
            <div className="champion-card-rating">
              <span className="star">★</span>
              <span>{c.rating}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '.8125rem' }}>
                ({c.reviewCount.toLocaleString()} 리뷰)
              </span>
            </div>
            <a
              className="champion-card-link"
              href={championMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              구글맵에서 보기 →
            </a>
          </div>
        </div>

        <div ref={mapRef} className="map-container map-container--result" />

        <button className="btn btn--share btn--full" onClick={handleShare}>
          {shareLabel}
        </button>

        <button className="btn btn--secondary btn--full" onClick={handleRestart}>
          다시 하기 🔄
        </button>
      </div>
    </div>
  );
}
