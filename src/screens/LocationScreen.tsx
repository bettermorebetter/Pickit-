/* ══════════════════════════════════════════════════════════════
   Location Screen — choose GPS, pin, or curated area
══════════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { isWithinSeoul, shuffle, SEOUL_BOUNDS } from '../data/constants.ts';
import { CURATED_AREAS, getCuratedRestaurants } from '../data/restaurants.ts';
import { fetchRestaurantsByLocation, getFallbackRestaurantsByLocation, makeEmojiMarkerIcon } from '../services/places.ts';
import type { LocationMode } from '../types/index.ts';

export default function LocationScreen() {
  const { state, dispatch } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [canFind, setCanFind] = useState(false);
  const pinMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const pinLatRef = useRef<number | null>(null);
  const pinLngRef = useRef<number | null>(null);
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

  const setMode = useCallback((mode: LocationMode) => {
    dispatch({ type: 'SET_LOCATION_MODE', mode });
    setError(null);
  }, [dispatch]);

  const handleGps = useCallback(() => {
    setMode('gps');
    setCanFind(false);

    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!isWithinSeoul(lat, lng)) {
          setError('서울 지역만 지원합니다. 서울 내에서 다시 시도해주세요.');
          dispatch({ type: 'CLEAR_PIN' });
          setCanFind(false);
        } else {
          setError(null);
          dispatch({ type: 'SET_PIN', lat, lng });
          pinLatRef.current = lat;
          pinLngRef.current = lng;
          setCanFind(true);
        }
      },
      (err) => {
        const messages: Record<number, string> = {
          1: '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.',
          2: '위치를 확인할 수 없습니다. 다시 시도해주세요.',
          3: '위치 요청 시간이 초과되었습니다.',
        };
        setError(messages[err.code] || '위치를 가져오는 데 실패했습니다.');
        dispatch({ type: 'CLEAR_PIN' });
        setCanFind(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [dispatch, setMode]);

  const handlePin = useCallback(() => {
    setMode('pin');
    setCanFind(false);
    dispatch({ type: 'CLEAR_PIN' });
    pinLatRef.current = null;
    pinLngRef.current = null;
  }, [dispatch, setMode]);

  // Initialize pin map when mode is 'pin'
  useEffect(() => {
    if (state.locationMode !== 'pin' || !pinMapRef.current) return;
    if (mapInstanceRef.current) {
      google.maps.event.trigger(mapInstanceRef.current, 'resize');
      return;
    }

    if (typeof google === 'undefined' || !google.maps) {
      setError('지도를 불러올 수 없습니다.');
      return;
    }

    const center = { lat: 37.5665, lng: 126.9780 };
    const map = new google.maps.Map(pinMapRef.current, {
      center,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'cooperative',
      restriction: {
        latLngBounds: {
          north: SEOUL_BOUNDS.latMax,
          south: SEOUL_BOUNDS.latMin,
          east:  SEOUL_BOUNDS.lngMax,
          west:  SEOUL_BOUNDS.lngMin,
        },
        strictBounds: false,
      },
    });

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng!.lat();
      const lng = e.latLng!.lng();
      if (!isWithinSeoul(lat, lng)) return;

      if (markerRef.current) {
        markerRef.current.setPosition(e.latLng!);
      } else {
        markerRef.current = new google.maps.Marker({
          position: e.latLng!,
          map,
          icon: makeEmojiMarkerIcon('📍'),
          title: '선택한 위치',
        });
      }

      pinLatRef.current = lat;
      pinLngRef.current = lng;
      dispatch({ type: 'SET_PIN', lat, lng });
      setCanFind(true);
      setError(null);
    });

    mapInstanceRef.current = map;
  }, [state.locationMode, dispatch]);

  const handleCurated = useCallback((areaId: 'snu' | 'konkuk') => {
    setMode(areaId);
    const area = CURATED_AREAS[areaId];
    dispatch({ type: 'SET_PIN', lat: area.lat, lng: area.lng });
    pinLatRef.current = area.lat;
    pinLngRef.current = area.lng;
    setCanFind(true);
  }, [dispatch, setMode]);

  const handleFind = useCallback(async () => {
    const lat = pinLatRef.current ?? state.pinLat;
    const lng = pinLngRef.current ?? state.pinLng;
    if (!lat || !lng) return;

    setLoading(true);
    setCanFind(false);

    const isCurated = state.locationMode === 'snu' || state.locationMode === 'konkuk';
    let restaurants;

    if (isCurated) {
      const all = getCuratedRestaurants(state.locationMode!);
      restaurants = shuffle(all).slice(0, 8);
    } else {
      try {
        restaurants = await fetchRestaurantsByLocation(lat, lng);
      } catch (e) {
        console.warn('fetchRestaurantsByLocation failed:', e);
        restaurants = getFallbackRestaurantsByLocation(lat, lng);
      }
    }

    dispatch({ type: 'SET_RESTAURANTS', restaurants });
    setLoading(false);
    setCanFind(true);
    dispatch({ type: 'SET_SCREEN', screen: 'map' });
  }, [state.pinLat, state.pinLng, state.locationMode, dispatch]);

  const activeMode = state.locationMode;

  return (
    <div className="screen">
      <div className="location-wrapper">
        <div className="location-hero">
          <div className="location-icon" onClick={handleIconTap}>🍽️</div>
          <h1 className="location-title">서울 푸드 월드컵</h1>
          <p className="location-subtitle">내 주변 맛집 8곳으로 토너먼트!</p>
        </div>

        <div className="location-form">
          <div className="mode-section-label">위치 선택</div>
          <div className="mode-buttons">
            <button
              className={`btn--mode${activeMode === 'gps' ? ' btn--mode--active' : ''}`}
              onClick={handleGps}
              aria-pressed={activeMode === 'gps'}
            >
              <span className="mode-icon">📍</span>
              <span className="mode-text">내 위치</span>
              <span className="mode-desc">GPS 사용</span>
            </button>
            <button
              className={`btn--mode${activeMode === 'pin' ? ' btn--mode--active' : ''}`}
              onClick={handlePin}
              aria-pressed={activeMode === 'pin'}
            >
              <span className="mode-icon">🗺️</span>
              <span className="mode-text">지도 선택</span>
              <span className="mode-desc">핀 찍기</span>
            </button>
          </div>

          <div className="mode-section-label">또는 인기 지역</div>
          <div className="mode-buttons">
            <button
              className={`btn--mode${activeMode === 'snu' ? ' btn--mode--active' : ''}`}
              onClick={() => handleCurated('snu')}
              aria-pressed={activeMode === 'snu'}
            >
              <span className="mode-icon">🎓</span>
              <span className="mode-text">서울대입구역</span>
              <span className="mode-desc">샤로수길 맛집</span>
            </button>
            <button
              className={`btn--mode${activeMode === 'konkuk' ? ' btn--mode--active' : ''}`}
              onClick={() => handleCurated('konkuk')}
              aria-pressed={activeMode === 'konkuk'}
            >
              <span className="mode-icon">🐄</span>
              <span className="mode-text">건대입구역</span>
              <span className="mode-desc">건대 맛집</span>
            </button>
          </div>

          {activeMode === 'pin' && (
            <div className="pin-map-section">
              <div
                ref={pinMapRef}
                className="map-container map-container--pin"
              />
            </div>
          )}

          {error && (
            <div className="location-error">{error}</div>
          )}

          <button
            className="btn btn--primary btn--full"
            disabled={!canFind || loading}
            onClick={handleFind}
          >
            {loading ? '맛집 불러오는 중... ⏳' : '식당 찾기 🔍'}
          </button>
        </div>
      </div>
    </div>
  );
}
