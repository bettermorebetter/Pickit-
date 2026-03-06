/* ══════════════════════════════════════════════════════════════
   Map Screen — shows map with markers and restaurant preview cards
══════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CURATED_AREAS } from '../data/restaurants.ts';
import { makeEmojiMarkerIcon } from '../services/places.ts';
import type { Restaurant } from '../types/index.ts';
import PhotoCarousel from '../components/PhotoCarousel.tsx';

function PreviewCard({ r, areaLabel }: { r: Restaurant; areaLabel?: string }) {
  const mapsHref = r.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${r.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + (r.address ? ' ' + r.address : ' 서울'))}`;

  return (
    <div className="preview-card" role="listitem">
      <div
        className={`preview-card-photo${r.photoUrls?.length > 1 ? ' preview-card-photo--multi' : ''}`}
        style={{ background: r.gradient }}
      >
        {r.photoUrl ? (
          <PhotoCarousel photos={r.photoUrls?.length ? r.photoUrls : [r.photoUrl]} alt={r.name} />
        ) : (
          <span className="card-fallback-emoji">{r.emoji}</span>
        )}
        <span className={`category-badge category-badge--${r.foodCategory}`}>{r.category}</span>
      </div>
      <div className="preview-card-bottom">
        <div className="preview-card-info">
          <div className="preview-card-name">{r.name}</div>
          <div className="preview-card-meta">
            <span>{r.category}</span>
            <span className="star">★</span>
            <span>{r.rating}</span>
            <span>({r.reviewCount.toLocaleString()})</span>
          </div>
          {r.address && <div className="preview-card-address">📍 {r.address}</div>}
          {r.walkMinutes != null && areaLabel && (
            <div className="preview-card-walk">🚶 {areaLabel}에서 도보 {r.walkMinutes}분</div>
          )}
        </div>
      </div>
      <a
        className="gmaps-btn"
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 구글맵에서 보기
      </a>
    </div>
  );
}

export default function MapScreen() {
  const { state, dispatch } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const mode = state.locationMode;
  const area = mode ? CURATED_AREAS[mode] : null;
  const lat = area?.lat ?? 37.5665;
  const lng = area?.lng ?? 126.9780;
  const title = area ? `${area.label} 맛집` : '주변 맛집';

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    try {
      if (typeof google === 'undefined' || !google.maps) throw new Error('no maps');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(16);
      } else {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'cooperative',
        });
      }

      state.restaurants.forEach(r => {
        const marker = new google.maps.Marker({
          position: { lat: r.lat, lng: r.lng },
          map: mapInstanceRef.current!,
          icon: makeEmojiMarkerIcon(r.emoji),
          title: r.name,
        });
        markersRef.current.push(marker);
      });
    } catch (_e) {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="map-error">
            <span class="map-error-icon">🗺️</span>
            <p class="map-error-text">지도를 불러올 수 없습니다.<br>Google Maps API 키를 확인하세요.</p>
          </div>`;
      }
    }
  }, [lat, lng, state.restaurants]);

  return (
    <div className="screen">
      <div className="map-screen-wrapper">
        <div className="screen-header">
          <button className="btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'location' })}>
            ← 뒤로
          </button>
          <h2 className="screen-title">{title}</h2>
        </div>

        <div ref={mapRef} className="map-container" />

        <div className="restaurant-list-header">
          <div className="restaurant-list-title">후보 맛집 {state.restaurants.length}곳</div>
          <div className="restaurant-list-sub">이 식당들로 토너먼트가 진행됩니다</div>
        </div>

        <div className="restaurant-preview-list" role="list">
          {state.restaurants.map(r => (
            <PreviewCard key={r.id} r={r} areaLabel={area?.label} />
          ))}
        </div>

        <div className="map-screen-footer">
          <button
            className="btn btn--primary btn--full"
            onClick={() => {
              dispatch({ type: 'INIT_BRACKET', restaurants: state.restaurants });
              dispatch({ type: 'SET_SCREEN', screen: 'tournament' });
            }}
          >
            🏆 월드컵 시작!
          </button>
        </div>
      </div>
    </div>
  );
}
