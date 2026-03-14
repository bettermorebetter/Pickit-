/* ══════════════════════════════════════════════════════════════
   Map Screen — shows restaurant preview cards
══════════════════════════════════════════════════════════════ */

import { useApp } from '../context/AppContext.tsx';
import { CURATED_AREAS } from '../data/restaurants.ts';
import type { Restaurant } from '../types/index.ts';
import PhotoCarousel from '../components/PhotoCarousel.tsx';

function formatPrice(min?: number, max?: number): string | null {
  if (min == null && max == null) return null;
  const lo = min ?? max!;
  const hi = max ?? min!;
  if (lo === hi) return `${lo.toLocaleString()}원`;
  return `${lo.toLocaleString()}~${hi.toLocaleString()}원`;
}

function PreviewCard({ r, areaLabel }: { r: Restaurant; areaLabel?: string }) {
  const mapsHref = r.gmapsUrl
    || (r.placeId ? `https://www.google.com/maps/place/?q=place_id:${r.placeId}` : '')
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + (r.address ? ' ' + r.address : ' 서울'))}`;

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
            {r.rating > 0 && (
              <>
                <span className="star">★</span>
                <span>{r.rating}</span>
                <span>({r.reviewCount.toLocaleString()})</span>
              </>
            )}
          </div>
          {formatPrice(r.priceMin, r.priceMax) && (
            <div className="preview-card-price">💰 {formatPrice(r.priceMin, r.priceMax)}</div>
          )}
          {r.walkMinutes != null && areaLabel && (
            <div className="preview-card-walk">🚶 {areaLabel}에서 도보 {r.walkMinutes}분</div>
          )}
        </div>
      </div>
      {mapsHref && (
        <a
          className="gmaps-btn"
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          📍 구글맵에서 보기
        </a>
      )}
    </div>
  );
}

export default function MapScreen() {
  const { state, dispatch } = useApp();

  const mode = state.locationMode;
  const area = mode ? CURATED_AREAS[mode] : null;
  const wc = state.activeWorldCup;
  const title = wc ? wc.title : area ? `${area.label} 맛집` : '주변 맛집';

  return (
    <div className="screen">
      <div className="map-screen-wrapper">
        <div className="screen-header">
          <button className="btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'location' })}>
            ← 뒤로
          </button>
          <h2 className="screen-title">{title}</h2>
        </div>

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
