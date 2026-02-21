/* ══════════════════════════════════════════════════════════════
   서울 푸드 월드컵 — main.js
   Stack: vanilla HTML/CSS/JS, Google Maps JS API + Places API
══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════════
   PHASE 1 — CONSTANTS & DATA
════════════════════════════════════════════════════════════ */

const ROUND_LABELS  = { 0: '8강', 1: '4강', 2: '결승' };
const TOTAL_MATCHES = [4, 2, 1];

/* ── Seoul 25 districts ────────────────────────────────────── */
const SEOUL_DISTRICTS = [
  { key: 'gangnam',      label: '강남구',   lat: 37.4979, lng: 127.0276 },
  { key: 'seocho',       label: '서초구',   lat: 37.4837, lng: 127.0324 },
  { key: 'songpa',       label: '송파구',   lat: 37.5145, lng: 127.1059 },
  { key: 'mapo',         label: '마포구',   lat: 37.5615, lng: 126.9086 },
  { key: 'yongsan',      label: '용산구',   lat: 37.5345, lng: 126.9940 },
  { key: 'jongno',       label: '종로구',   lat: 37.5726, lng: 126.9791 },
  { key: 'jung',         label: '중구',     lat: 37.5636, lng: 126.9976 },
  { key: 'seongdong',    label: '성동구',   lat: 37.5633, lng: 127.0369 },
  { key: 'gwangjin',     label: '광진구',   lat: 37.5384, lng: 127.0822 },
  { key: 'dongdaemun',   label: '동대문구', lat: 37.5744, lng: 127.0395 },
  { key: 'seodaemun',    label: '서대문구', lat: 37.5791, lng: 126.9368 },
  { key: 'eunpyeong',    label: '은평구',   lat: 37.6177, lng: 126.9228 },
  { key: 'nowon',        label: '노원구',   lat: 37.6542, lng: 127.0568 },
  { key: 'dobong',       label: '도봉구',   lat: 37.6688, lng: 127.0471 },
  { key: 'gangbuk',      label: '강북구',   lat: 37.6397, lng: 127.0256 },
  { key: 'seongbuk',     label: '성북구',   lat: 37.5894, lng: 127.0167 },
  { key: 'jungnang',     label: '중랑구',   lat: 37.6063, lng: 127.0928 },
  { key: 'gangseo',      label: '강서구',   lat: 37.5509, lng: 126.8495 },
  { key: 'yangcheon',    label: '양천구',   lat: 37.5170, lng: 126.8665 },
  { key: 'yeongdeungpo', label: '영등포구', lat: 37.5263, lng: 126.8961 },
  { key: 'guro',         label: '구로구',   lat: 37.4954, lng: 126.8874 },
  { key: 'geumcheon',    label: '금천구',   lat: 37.4600, lng: 126.9001 },
  { key: 'dongjak',      label: '동작구',   lat: 37.5124, lng: 126.9393 },
  { key: 'gwanak',       label: '관악구',   lat: 37.4784, lng: 126.9516 },
  { key: 'gangdong',     label: '강동구',   lat: 37.5301, lng: 127.1238 },
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
  'linear-gradient(135deg,#fffbeb,#fef3c7)',
  'linear-gradient(135deg,#e0f2fe,#bae6fd)',
];

/* ── Fallback data (when API unavailable) ──────────────────── */
const FALLBACK_RESTAURANTS = [
  { id: 'f1',  name: '동네 삼겹살집',   category: '삼겹살', rating: 4.5, reviewCount: 450,  emoji: '🥩', gradient: GRADIENTS[0] },
  { id: 'f2',  name: '할머니 설렁탕',   category: '설렁탕', rating: 4.7, reviewCount: 980,  emoji: '🍲', gradient: GRADIENTS[1] },
  { id: 'f3',  name: '원조 치킨',       category: '치킨',   rating: 4.6, reviewCount: 1200, emoji: '🍗', gradient: GRADIENTS[2] },
  { id: 'f4',  name: '명품 냉면',       category: '냉면',   rating: 4.4, reviewCount: 670,  emoji: '🍜', gradient: GRADIENTS[3] },
  { id: 'f5',  name: '신선 해물탕',     category: '해물탕', rating: 4.8, reviewCount: 340,  emoji: '🦀', gradient: GRADIENTS[4] },
  { id: 'f6',  name: '정성 비빔밥',     category: '비빔밥', rating: 4.5, reviewCount: 520,  emoji: '🍚', gradient: GRADIENTS[5] },
  { id: 'f7',  name: '동네 떡볶이',     category: '분식',   rating: 4.3, reviewCount: 1540, emoji: '🌶️', gradient: GRADIENTS[6] },
  { id: 'f8',  name: '장인 돈까스',     category: '돈까스', rating: 4.6, reviewCount: 789,  emoji: '🍱', gradient: GRADIENTS[7] },
  { id: 'f9',  name: '수제 버거',       category: '버거',   rating: 4.4, reviewCount: 612,  emoji: '🍔', gradient: GRADIENTS[8] },
  { id: 'f10', name: '이탈리안 파스타', category: '파스타', rating: 4.5, reviewCount: 390,  emoji: '🍝', gradient: GRADIENTS[9] },
];

/* ── State ─────────────────────────────────────────────────── */
const state = {
  screen: 'location',
  selectedDistrict: null,
  restaurants: [],
  bracket: {
    rounds: [],
    currentRound: 0,
    currentMatch: 0,
    winners: [[]],
  },
  champion: null,
  map: null,
  markers: [],
  resultMap: null,
  resultMarker: null,
  resultInfoWindow: null,
};

/* ════════════════════════════════════════════════════════════
   PHASE 2 — HELPERS
════════════════════════════════════════════════════════════ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGoogleCategory(types) {
  if (!types) return '음식점';
  if (types.includes('cafe'))          return '카페';
  if (types.includes('bakery'))        return '베이커리';
  if (types.includes('bar'))           return '바/술집';
  if (types.includes('meal_takeaway')) return '포장전문';
  return '음식점';
}

function getCategoryEmoji(types) {
  if (!types) return '🍽️';
  if (types.includes('cafe'))    return '☕';
  if (types.includes('bakery'))  return '🥐';
  if (types.includes('bar'))     return '🍺';
  return '🍽️';
}

function makeEmojiMarkerIcon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
    <text y="32" x="2" font-size="28" font-family="serif">${emoji}</text>
  </svg>`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(40, 40),
    anchor:     new google.maps.Point(20, 20),
  };
}

/* ════════════════════════════════════════════════════════════
   PHASE 3 — GOOGLE PLACES API
════════════════════════════════════════════════════════════ */

function fetchRestaurantsFromGoogle(lat, lng) {
  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.nearbySearch(
      {
        location: new google.maps.LatLng(lat, lng),
        radius: 1500,
        type: 'restaurant',
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
          const mapped = results.map((p, i) => ({
            id:          p.place_id,
            name:        p.name,
            category:    getGoogleCategory(p.types),
            rating:      p.rating        != null ? p.rating             : parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
            reviewCount: p.user_ratings_total != null ? p.user_ratings_total : Math.floor(100 + Math.random() * 900),
            address:     p.vicinity,
            lat:         p.geometry.location.lat(),
            lng:         p.geometry.location.lng(),
            emoji:       getCategoryEmoji(p.types),
            gradient:    GRADIENTS[i % GRADIENTS.length],
            placeId:     p.place_id,
          }));
          // Sort by real Google rating (highest first), take top 8
          resolve(mapped.sort((a, b) => b.rating - a.rating).slice(0, 8));
        } else {
          console.warn('Places API status:', status);
          resolve(getFallbackRestaurants(lat, lng));
        }
      }
    );
  });
}

function getFallbackRestaurants(lat, lng) {
  return shuffle(FALLBACK_RESTAURANTS).slice(0, 8).map(r => ({
    ...r,
    address: '주소 정보 없음',
    lat: lat + (Math.random() - 0.5) * 0.01,
    lng: lng + (Math.random() - 0.5) * 0.01,
  }));
}

/* ════════════════════════════════════════════════════════════
   PHASE 4 — SCREEN NAVIGATION
════════════════════════════════════════════════════════════ */

function goToScreen(name) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('screen--active'));
  const next = document.getElementById(`screen-${name}`);
  if (next) {
    next.classList.add('screen--active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  state.screen = name;

  if (name === 'map')        initMapScreen();
  if (name === 'tournament') initTournamentScreen();
  if (name === 'result')     initResultScreen();
}

/* ════════════════════════════════════════════════════════════
   PHASE 5 — LOCATION SCREEN
════════════════════════════════════════════════════════════ */

function initLocationScreen() {
  const districtSelect = document.getElementById('district-select');
  const btnFind        = document.getElementById('btn-find');

  districtSelect.innerHTML = '<option value="">구를 선택하세요</option>';
  SEOUL_DISTRICTS.forEach(d => {
    const opt = document.createElement('option');
    opt.value       = d.key;
    opt.textContent = d.label;
    districtSelect.appendChild(opt);
  });

  districtSelect.addEventListener('change', () => {
    state.selectedDistrict = districtSelect.value || null;
    btnFind.disabled = !state.selectedDistrict;
  });

  btnFind.addEventListener('click', async () => {
    if (!state.selectedDistrict) return;
    const districtData = SEOUL_DISTRICTS.find(d => d.key === state.selectedDistrict);

    btnFind.disabled    = true;
    btnFind.textContent = '맛집 불러오는 중... ⏳';

    state.restaurants = await fetchRestaurantsFromGoogle(districtData.lat, districtData.lng);

    btnFind.textContent = '식당 찾기 🔍';
    btnFind.disabled    = false;

    goToScreen('map');
  });
}

/* ════════════════════════════════════════════════════════════
   PHASE 6 — MAP SCREEN
════════════════════════════════════════════════════════════ */

function createMap(containerId, lat, lng, zoom) {
  try {
    if (typeof google === 'undefined' || !google.maps) throw new Error('Google Maps not available');
    return new google.maps.Map(document.getElementById(containerId), {
      center:           { lat, lng },
      zoom,
      mapTypeId:        google.maps.MapTypeId.ROADMAP,
      gestureHandling:  'cooperative',
    });
  } catch (e) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="map-error">
          <span class="map-error-icon">🗺️</span>
          <p class="map-error-text">지도를 불러올 수 없습니다.<br>Google Maps API 키를 확인하세요.</p>
        </div>`;
    }
    return null;
  }
}

function initMapScreen() {
  const districtData = SEOUL_DISTRICTS.find(d => d.key === state.selectedDistrict);

  document.getElementById('map-screen-title').textContent = `${districtData.label} 맛집`;

  if (state.map) {
    state.map.setCenter({ lat: districtData.lat, lng: districtData.lng });
    state.map.setZoom(14);
  } else {
    state.map = createMap('map-container', districtData.lat, districtData.lng, 14);
  }

  // Clear old markers
  state.markers.forEach(m => m.setMap(null));
  state.markers = [];

  // Place emoji markers
  if (state.map) {
    state.restaurants.forEach(r => {
      const marker = new google.maps.Marker({
        position: { lat: r.lat, lng: r.lng },
        map:       state.map,
        icon:      makeEmojiMarkerIcon(r.emoji),
        title:     r.name,
      });
      state.markers.push(marker);
    });
  }

  // Render preview cards
  const list = document.getElementById('restaurant-preview-list');
  list.innerHTML = '';
  state.restaurants.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.setAttribute('role', 'listitem');
    const mapsHref = r.placeId
      ? `https://www.google.com/maps/place/?q=place_id:${r.placeId}`
      : `https://www.google.com/maps/search/${encodeURIComponent(r.name + ' ' + (r.address || ''))}`;
    card.innerHTML = `
      <div class="preview-card-emoji" style="background:${r.gradient}">${r.emoji}</div>
      <div class="preview-card-info">
        <div class="preview-card-name">${r.name}</div>
        <div class="preview-card-meta">
          <span>${r.category}</span>
          <span class="star">★</span>
          <span>${r.rating}</span>
          <span>(${r.reviewCount.toLocaleString()})</span>
        </div>
        ${r.address ? `<div class="preview-card-address">📍 ${r.address}</div>` : ''}
      </div>
      <a class="preview-card-maps-btn" href="${mapsHref}" target="_blank" rel="noopener" aria-label="${r.name} 구글맵">🗺️</a>`;
    list.appendChild(card);
  });

  document.getElementById('map-back-btn').onclick         = () => goToScreen('location');
  document.getElementById('btn-start-tournament').onclick = () => goToScreen('tournament');
}

/* ════════════════════════════════════════════════════════════
   PHASE 7 — TOURNAMENT
════════════════════════════════════════════════════════════ */

function initBracket() {
  const shuffled = shuffle(state.restaurants);
  state.bracket = {
    rounds: [
      [[shuffled[0], shuffled[1]], [shuffled[2], shuffled[3]],
       [shuffled[4], shuffled[5]], [shuffled[6], shuffled[7]]],
    ],
    currentRound: 0,
    currentMatch: 0,
    winners: [[]],
  };
}

function getTotalMatchesSoFar() {
  const { currentRound, currentMatch } = state.bracket;
  let total = 0;
  for (let r = 0; r < currentRound; r++) total += TOTAL_MATCHES[r];
  return total + currentMatch;
}

function renderTournamentMatch() {
  const { rounds, currentRound, currentMatch } = state.bracket;
  const [a, b]       = rounds[currentRound][currentMatch];
  const roundLabel   = ROUND_LABELS[currentRound];
  const totalMatches = TOTAL_MATCHES[currentRound];
  const totalDone    = getTotalMatchesSoFar();

  document.getElementById('round-badge').textContent    = roundLabel;
  document.getElementById('progress-label').textContent = `${roundLabel} · 매치 ${currentMatch + 1}/${totalMatches}`;

  const bar = document.getElementById('progress-bar');
  bar.style.width = `${(totalDone / 7) * 100}%`;
  bar.setAttribute('aria-valuenow', totalDone);

  const leftSlot  = document.getElementById('card-left');
  const rightSlot = document.getElementById('card-right');
  leftSlot.innerHTML  = buildTournamentCard(a);
  rightSlot.innerHTML = buildTournamentCard(b);

  const newLeft  = leftSlot.querySelector('.tournament-card').cloneNode(true);
  const newRight = rightSlot.querySelector('.tournament-card').cloneNode(true);
  leftSlot.querySelector('.tournament-card').replaceWith(newLeft);
  rightSlot.querySelector('.tournament-card').replaceWith(newRight);

  newLeft.addEventListener('click',  () => pickWinner(a, newLeft,  newRight));
  newRight.addEventListener('click', () => pickWinner(b, newRight, newLeft));
}

function buildTournamentCard(r) {
  return `
    <button class="tournament-card" aria-label="${r.name} 선택" tabindex="0">
      <div class="tournament-card-hero" style="background:${r.gradient}">
        ${r.emoji}
      </div>
      <div class="tournament-card-body">
        <div class="tournament-card-name">${r.name}</div>
        <div class="tournament-card-category">${r.category}</div>
        <div class="tournament-card-rating">
          <span class="star">★</span>
          <span>${r.rating}</span>
          <span style="color:var(--color-text-muted);font-size:.75rem">(${r.reviewCount.toLocaleString()})</span>
        </div>
      </div>
    </button>`;
}

function pickWinner(winner, winnerEl, loserEl) {
  winnerEl.classList.add('card--selected');
  loserEl.style.opacity       = '.35';
  loserEl.style.transform     = 'scale(.95)';
  loserEl.style.pointerEvents = 'none';

  state.bracket.winners[state.bracket.currentRound].push(winner);
  setTimeout(() => advanceBracket(), 420);
}

function advanceBracket() {
  const { currentRound, currentMatch, rounds, winners } = state.bracket;
  const totalMatchesInRound = TOTAL_MATCHES[currentRound];

  if (currentMatch + 1 < totalMatchesInRound) {
    state.bracket.currentMatch++;
  } else {
    const roundWinners = winners[currentRound];

    if (currentRound === 2) {
      state.champion = roundWinners[0];
      goToScreen('result');
      return;
    }

    const nextRoundPairs = [];
    for (let i = 0; i < roundWinners.length; i += 2) {
      nextRoundPairs.push([roundWinners[i], roundWinners[i + 1]]);
    }
    state.bracket.rounds.push(nextRoundPairs);
    state.bracket.currentRound++;
    state.bracket.currentMatch = 0;
    state.bracket.winners.push([]);
  }

  renderTournamentMatch();
}

function initTournamentScreen() {
  initBracket();
  renderTournamentMatch();
  document.getElementById('tournament-back-btn').onclick = () => goToScreen('map');
}

/* ════════════════════════════════════════════════════════════
   PHASE 8 — RESULT SCREEN
════════════════════════════════════════════════════════════ */

function initResultScreen() {
  const c = state.champion;

  document.getElementById('champion-card-container').innerHTML = `
    <div class="champion-card">
      <div class="champion-badge">우승! 🏆</div>
      <div class="champion-card-hero" style="background:${c.gradient}">${c.emoji}</div>
      <div class="champion-card-body">
        <div class="champion-card-name">${c.name}</div>
        <div class="champion-card-category">${c.category}</div>
        ${c.address ? `<div class="champion-card-address">📍 ${c.address}</div>` : ''}
        <div class="champion-card-rating">
          <span class="star">★</span>
          <span>${c.rating}</span>
          <span style="color:var(--color-text-muted);font-size:.8125rem">(${c.reviewCount.toLocaleString()} 리뷰)</span>
        </div>
        ${c.placeId ? `<a class="champion-card-link" href="https://www.google.com/maps/place/?q=place_id:${c.placeId}" target="_blank" rel="noopener">구글맵에서 보기 →</a>` : ''}
      </div>
    </div>`;

  if (state.resultMap) {
    state.resultMap.setCenter({ lat: c.lat, lng: c.lng });
    state.resultMap.setZoom(16);
    if (state.resultMarker)     state.resultMarker.setMap(null);
    if (state.resultInfoWindow) state.resultInfoWindow.close();
  } else {
    state.resultMap = createMap('result-map-container', c.lat, c.lng, 16);
  }

  if (state.resultMap && c.lat) {
    state.resultMarker = new google.maps.Marker({
      position: { lat: c.lat, lng: c.lng },
      map:       state.resultMap,
      icon:      makeEmojiMarkerIcon(c.emoji),
      title:     c.name,
    });

    state.resultInfoWindow = new google.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-family:'Noto Sans KR',sans-serif;font-size:.875rem;font-weight:700;">${c.name}</div>`,
    });
    state.resultInfoWindow.open({ anchor: state.resultMarker, map: state.resultMap });
  }

  document.getElementById('btn-restart').onclick = () => {
    state.selectedDistrict  = null;
    state.restaurants       = [];
    state.champion          = null;
    state.bracket           = { rounds: [], currentRound: 0, currentMatch: 0, winners: [[]] };
    state.map               = null;
    state.resultMap         = null;
    state.markers           = [];
    state.resultMarker      = null;
    state.resultInfoWindow  = null;

    document.getElementById('district-select').value = '';
    document.getElementById('btn-find').disabled     = true;

    goToScreen('location');
  };
}

/* ════════════════════════════════════════════════════════════
   BOOTSTRAP — called by Google Maps after it finishes loading
════════════════════════════════════════════════════════════ */
window.initApp = function () {
  initLocationScreen();
};
