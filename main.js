/* ══════════════════════════════════════════════════════════════
   서울 푸드 월드컵 — main.js
   Stack: vanilla HTML/CSS/JS, Naver Maps v3 (display), Kakao Local API (data)
══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════════
   PHASE 1 — CONSTANTS & DATA
════════════════════════════════════════════════════════════ */

// ← Paste your Kakao REST API key here
// Get it: https://developers.kakao.com → 앱 → 앱 키 → REST API 키
const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY';

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

/* ── Fallback data (used when API is unavailable) ──────────── */
const FALLBACK_RESTAURANTS = [
  { id: 'f1',  name: '동네 삼겹살집',   category: '삼겹살',  rating: 4.5, reviewCount: 450,  emoji: '🥩', gradient: GRADIENTS[0] },
  { id: 'f2',  name: '할머니 설렁탕',   category: '설렁탕',  rating: 4.7, reviewCount: 980,  emoji: '🍲', gradient: GRADIENTS[1] },
  { id: 'f3',  name: '원조 치킨',       category: '치킨',    rating: 4.6, reviewCount: 1200, emoji: '🍗', gradient: GRADIENTS[2] },
  { id: 'f4',  name: '명품 냉면',       category: '냉면',    rating: 4.4, reviewCount: 670,  emoji: '🍜', gradient: GRADIENTS[3] },
  { id: 'f5',  name: '신선 해물탕',     category: '해물탕',  rating: 4.8, reviewCount: 340,  emoji: '🦀', gradient: GRADIENTS[4] },
  { id: 'f6',  name: '정성 비빔밥',     category: '비빔밥',  rating: 4.5, reviewCount: 520,  emoji: '🍚', gradient: GRADIENTS[5] },
  { id: 'f7',  name: '동네 떡볶이',     category: '분식',    rating: 4.3, reviewCount: 1540, emoji: '🌶️', gradient: GRADIENTS[6] },
  { id: 'f8',  name: '장인 돈까스',     category: '돈까스',  rating: 4.6, reviewCount: 789,  emoji: '🍱', gradient: GRADIENTS[7] },
  { id: 'f9',  name: '수제 버거',       category: '버거',    rating: 4.4, reviewCount: 612,  emoji: '🍔', gradient: GRADIENTS[8] },
  { id: 'f10', name: '이탈리안 파스타', category: '파스타',  rating: 4.5, reviewCount: 390,  emoji: '🍝', gradient: GRADIENTS[9] },
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

function getCategoryEmoji(categoryName) {
  const n = categoryName || '';
  if (n.includes('삼겹살') || n.includes('구이') || n.includes('스테이크') || n.includes('갈비')) return '🥩';
  if (n.includes('치킨') || n.includes('닭'))                                                       return '🍗';
  if (n.includes('스시') || n.includes('초밥') || n.includes('일식'))                              return '🍣';
  if (n.includes('중식') || n.includes('짜장') || n.includes('중국'))                              return '🥡';
  if (n.includes('피자'))                                                                            return '🍕';
  if (n.includes('버거') || n.includes('햄버거'))                                                   return '🍔';
  if (n.includes('분식') || n.includes('떡볶이') || n.includes('김밥'))                            return '🌶️';
  if (n.includes('국밥') || n.includes('설렁탕') || n.includes('해장') || n.includes('한식'))      return '🍲';
  if (n.includes('냉면') || n.includes('국수') || n.includes('라멘') || n.includes('우동') || n.includes('쌀국수')) return '🍜';
  if (n.includes('해물') || n.includes('회') || n.includes('해산물') || n.includes('조개'))        return '🦀';
  if (n.includes('파스타') || n.includes('이탈리안') || n.includes('양식'))                        return '🍝';
  if (n.includes('돈까스'))                                                                          return '🍱';
  if (n.includes('찜') || n.includes('전골') || n.includes('탕'))                                  return '🫕';
  if (n.includes('인도') || n.includes('카레'))                                                     return '🍛';
  if (n.includes('멕시칸') || n.includes('타코') || n.includes('부리또'))                          return '🌮';
  if (n.includes('베트남') || n.includes('태국') || n.includes('동남아'))                          return '🍜';
  if (n.includes('카페') || n.includes('커피') || n.includes('디저트'))                            return '☕';
  if (n.includes('베이커리') || n.includes('빵'))                                                   return '🥐';
  return '🍽️';
}

/* ── Kakao Local API ────────────────────────────────────────── */
async function fetchRestaurantsFromKakao(lat, lng) {
  try {
    const url =
      `https://dapi.kakao.com/v2/local/search/category.json` +
      `?category_group_code=FD6&x=${lng}&y=${lat}&radius=1500&size=15&sort=popularity`;

    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
    });

    if (!res.ok) throw new Error(`Kakao API ${res.status}`);

    const data   = await res.json();
    const places = data.documents || [];
    if (places.length === 0) throw new Error('No results');

    const mapped = places.map((p, i) => {
      const sub = p.category_name.split(' > ').pop();
      return {
        id:          p.id,
        name:        p.place_name,
        category:    sub,
        rating:      parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        reviewCount: Math.floor(100 + Math.random() * 2900),
        address:     p.road_address_name || p.address_name,
        lat:         parseFloat(p.y),
        lng:         parseFloat(p.x),
        emoji:       getCategoryEmoji(p.category_name),
        gradient:    GRADIENTS[i % GRADIENTS.length],
        placeUrl:    p.place_url,
      };
    });

    return shuffle(mapped).slice(0, 8);
  } catch (e) {
    console.warn('Kakao API failed, using fallback:', e.message);
    return getFallbackRestaurants(lat, lng);
  }
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
   PHASE 3 — SCREEN NAVIGATION
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
   PHASE 4 — LOCATION SCREEN
════════════════════════════════════════════════════════════ */

function initLocationScreen() {
  const districtSelect = document.getElementById('district-select');
  const btnFind        = document.getElementById('btn-find');

  // Populate all 25 Seoul districts
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

    state.restaurants = await fetchRestaurantsFromKakao(districtData.lat, districtData.lng);

    btnFind.textContent = '식당 찾기 🔍';
    btnFind.disabled    = false;

    goToScreen('map');
  });
}

/* ════════════════════════════════════════════════════════════
   PHASE 5 — MAP SCREEN
════════════════════════════════════════════════════════════ */

function createMap(containerId, lat, lng, zoom) {
  try {
    if (typeof naver === 'undefined' || !naver.maps) throw new Error('Naver Maps not available');
    return new naver.maps.Map(containerId, {
      center: new naver.maps.LatLng(lat, lng),
      zoom,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
    });
  } catch (e) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="map-error">
          <span class="map-error-icon">🗺️</span>
          <p class="map-error-text">지도를 불러올 수 없습니다.<br>Naver Maps API 키를 확인하세요.</p>
        </div>`;
    }
    return null;
  }
}

function initMapScreen() {
  const districtData = SEOUL_DISTRICTS.find(d => d.key === state.selectedDistrict);

  document.getElementById('map-screen-title').textContent = `${districtData.label} 맛집`;

  if (state.map) {
    try { state.map.setCenter(new naver.maps.LatLng(districtData.lat, districtData.lng)); } catch (_) {}
  } else {
    state.map = createMap('map-container', districtData.lat, districtData.lng, 14);
  }

  // Clear old markers
  state.markers.forEach(m => { try { m.setMap(null); } catch (_) {} });
  state.markers = [];

  // Place emoji markers
  if (state.map) {
    state.restaurants.forEach(r => {
      try {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(r.lat, r.lng),
          map: state.map,
          icon: {
            content: `<div style="font-size:1.5rem;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">
                        <span class="marker-emoji">${r.emoji}</span>
                      </div>`,
            anchor: new naver.maps.Point(14, 14),
          },
          title: r.name,
        });
        state.markers.push(marker);
      } catch (_) {}
    });
  }

  // Render preview cards
  const list = document.getElementById('restaurant-preview-list');
  list.innerHTML = '';
  state.restaurants.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.setAttribute('role', 'listitem');
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
      </div>
      <div class="preview-card-num">${i + 1}</div>`;
    list.appendChild(card);
  });

  document.getElementById('map-back-btn').onclick          = () => goToScreen('location');
  document.getElementById('btn-start-tournament').onclick  = () => goToScreen('tournament');
}

/* ════════════════════════════════════════════════════════════
   PHASE 6 — TOURNAMENT
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
   PHASE 7 — RESULT SCREEN
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
        ${c.placeUrl ? `<a class="champion-card-link" href="${c.placeUrl}" target="_blank" rel="noopener">카카오맵에서 보기 →</a>` : ''}
      </div>
    </div>`;

  if (state.resultMap) {
    try {
      state.resultMap.setCenter(new naver.maps.LatLng(c.lat, c.lng));
      state.resultMap.setZoom(16);
    } catch (_) {}
  } else {
    state.resultMap = createMap('result-map-container', c.lat, c.lng, 16);
  }

  if (state.resultMap && c.lat) {
    try {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(c.lat, c.lng),
        map: state.resultMap,
        icon: {
          content: `<div style="font-size:2rem;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))">
                      <span class="marker-emoji">${c.emoji}</span>
                    </div>`,
          anchor: new naver.maps.Point(18, 18),
        },
        title: c.name,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-family:'Noto Sans KR',sans-serif;font-size:.875rem;font-weight:700;">${c.name}</div>`,
        borderColor: '#f97316',
      });
      infoWindow.open(state.resultMap, new naver.maps.LatLng(c.lat, c.lng));
    } catch (_) {}
  }

  document.getElementById('btn-restart').onclick = () => {
    state.selectedDistrict = null;
    state.restaurants      = [];
    state.champion         = null;
    state.bracket          = { rounds: [], currentRound: 0, currentMatch: 0, winners: [[]] };
    state.map              = null;
    state.resultMap        = null;
    state.markers          = [];

    const districtSelect = document.getElementById('district-select');
    const btnFind        = document.getElementById('btn-find');
    districtSelect.value = '';
    btnFind.disabled     = true;

    goToScreen('location');
  };
}

/* ════════════════════════════════════════════════════════════
   BOOTSTRAP
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLocationScreen();
});
