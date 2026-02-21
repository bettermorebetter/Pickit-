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
  // 강남구
  { id: 'f_gangnam_1', district: 'gangnam', name: '삼원가든',          category: '한우',     rating: 4.5, reviewCount: 4312,  emoji: '🥩', gradient: GRADIENTS[0], address: '서울 강남구 언주로133길 19',      lat: 37.5156, lng: 127.0319 },
  { id: 'f_gangnam_2', district: 'gangnam', name: '가온',              category: '한정식',   rating: 4.7, reviewCount: 512,   emoji: '🍱', gradient: GRADIENTS[1], address: '서울 강남구 도산대로 317',        lat: 37.5243, lng: 127.0401 },
  { id: 'f_gangnam_3', district: 'gangnam', name: '논현 양대창',       category: '구이',     rating: 4.4, reviewCount: 2130,  emoji: '🥩', gradient: GRADIENTS[2], address: '서울 강남구 논현로175길 28',      lat: 37.5117, lng: 127.0396 },
  { id: 'f_gangnam_4', district: 'gangnam', name: '압구정 스시야',     category: '스시',     rating: 4.6, reviewCount: 987,   emoji: '🍣', gradient: GRADIENTS[3], address: '서울 강남구 학동로97길 3',        lat: 37.5155, lng: 127.0426 },

  // 서초구
  { id: 'f_seocho_1', district: 'seocho', name: '진진',               category: '중식',     rating: 4.6, reviewCount: 2341,  emoji: '🥟', gradient: GRADIENTS[4], address: '서울 서초구 방배중앙로 60',       lat: 37.4800, lng: 126.9993 },
  { id: 'f_seocho_2', district: 'seocho', name: '방배동 카페골목',    category: '카페',     rating: 4.4, reviewCount: 3210,  emoji: '☕', gradient: GRADIENTS[5], address: '서울 서초구 방배로 198',          lat: 37.4835, lng: 126.9963 },
  { id: 'f_seocho_3', district: 'seocho', name: '서초 참숯갈비',      category: '갈비',     rating: 4.3, reviewCount: 1780,  emoji: '🥩', gradient: GRADIENTS[6], address: '서울 서초구 서초중앙로 161',      lat: 37.4913, lng: 127.0180 },
  { id: 'f_seocho_4', district: 'seocho', name: '양재 낙지볶음',      category: '낙지볶음', rating: 4.2, reviewCount: 876,   emoji: '🦑', gradient: GRADIENTS[7], address: '서울 서초구 양재동',              lat: 37.4757, lng: 127.0349 },

  // 송파구
  { id: 'f_songpa_1', district: 'songpa', name: '풍년쌀농부',         category: '한식',     rating: 4.5, reviewCount: 2134,  emoji: '🍚', gradient: GRADIENTS[8], address: '서울 송파구 백제고분로45길 15',   lat: 37.5051, lng: 127.1086 },
  { id: 'f_songpa_2', district: 'songpa', name: '가락시장 횟집',      category: '해산물',   rating: 4.4, reviewCount: 3421,  emoji: '🐟', gradient: GRADIENTS[9], address: '서울 송파구 가락로 245',          lat: 37.4956, lng: 127.1158 },
  { id: 'f_songpa_3', district: 'songpa', name: '석촌 해장국',        category: '해장국',   rating: 4.2, reviewCount: 543,   emoji: '🍲', gradient: GRADIENTS[0], address: '서울 송파구 석촌호수로 76',       lat: 37.5086, lng: 127.1007 },
  { id: 'f_songpa_4', district: 'songpa', name: '잠실 롯데타워 레스토랑', category: '양식', rating: 4.3, reviewCount: 1120,  emoji: '🍽️', gradient: GRADIENTS[1], address: '서울 송파구 올림픽로 300',        lat: 37.5138, lng: 127.1005 },

  // 마포구
  { id: 'f_mapo_1', district: 'mapo', name: '이남장',                  category: '삼겹살',   rating: 4.3, reviewCount: 2734,  emoji: '🥩', gradient: GRADIENTS[2], address: '서울 마포구 와우산로 21-18',      lat: 37.5524, lng: 126.9225 },
  { id: 'f_mapo_2', district: 'mapo', name: '망원시장 어묵탕',        category: '분식',     rating: 4.5, reviewCount: 5678,  emoji: '🍢', gradient: GRADIENTS[3], address: '서울 마포구 망원시장길 37',       lat: 37.5568, lng: 126.9102 },
  { id: 'f_mapo_3', district: 'mapo', name: '연남동 파스타집',        category: '이탈리안', rating: 4.4, reviewCount: 1890,  emoji: '🍝', gradient: GRADIENTS[4], address: '서울 마포구 연남동 248',          lat: 37.5626, lng: 126.9234 },
  { id: 'f_mapo_4', district: 'mapo', name: '공덕 순대국',            category: '순대국',   rating: 4.3, reviewCount: 1234,  emoji: '🍲', gradient: GRADIENTS[5], address: '서울 마포구 마포대로 109',        lat: 37.5440, lng: 126.9516 },

  // 용산구
  { id: 'f_yongsan_1', district: 'yongsan', name: '이태원 후통',      category: '중식',     rating: 4.5, reviewCount: 2143,  emoji: '🥟', gradient: GRADIENTS[6], address: '서울 용산구 이태원로49길 46',     lat: 37.5340, lng: 126.9964 },
  { id: 'f_yongsan_2', district: 'yongsan', name: '해방촌 핫도그',    category: '분식',     rating: 4.4, reviewCount: 3421,  emoji: '🌭', gradient: GRADIENTS[7], address: '서울 용산구 신흥로 31-3',         lat: 37.5413, lng: 126.9895 },
  { id: 'f_yongsan_3', district: 'yongsan', name: '경리단길 카페',    category: '카페',     rating: 4.3, reviewCount: 987,   emoji: '☕', gradient: GRADIENTS[8], address: '서울 용산구 회나무로44길 10',     lat: 37.5341, lng: 127.0000 },
  { id: 'f_yongsan_4', district: 'yongsan', name: '후암동 삼겹살',    category: '삼겹살',   rating: 4.3, reviewCount: 765,   emoji: '🥩', gradient: GRADIENTS[9], address: '서울 용산구 후암로 22',            lat: 37.5464, lng: 126.9804 },

  // 종로구
  { id: 'f_jongno_1', district: 'jongno', name: '진옥화 할매 원조 닭한마리', category: '닭한마리', rating: 4.4, reviewCount: 4512, emoji: '🍗', gradient: GRADIENTS[0], address: '서울 종로구 종로 264',    lat: 37.5699, lng: 127.0095 },
  { id: 'f_jongno_2', district: 'jongno', name: '광장시장 마약김밥', category: '분식',     rating: 4.5, reviewCount: 14780, emoji: '🍱', gradient: GRADIENTS[1], address: '서울 종로구 종로 88 광장시장', lat: 37.5700, lng: 127.0086 },
  { id: 'f_jongno_3', district: 'jongno', name: '봉피양',             category: '평양냉면', rating: 4.3, reviewCount: 1823,  emoji: '🍜', gradient: GRADIENTS[2], address: '서울 종로구 새문안로 97',         lat: 37.5752, lng: 126.9726 },
  { id: 'f_jongno_4', district: 'jongno', name: '삼청동 수제비',     category: '수제비',   rating: 4.2, reviewCount: 1234,  emoji: '🍲', gradient: GRADIENTS[3], address: '서울 종로구 삼청로 101-1',        lat: 37.5818, lng: 126.9810 },
  { id: 'f_jongno_5', district: 'jongno', name: '청진옥',             category: '해장국',   rating: 4.3, reviewCount: 987,   emoji: '🍲', gradient: GRADIENTS[4], address: '서울 종로구 종로 19',             lat: 37.5718, lng: 126.9780 },

  // 중구
  { id: 'f_jung_1', district: 'jung', name: '우래옥',                  category: '평양냉면', rating: 4.5, reviewCount: 3241,  emoji: '🍜', gradient: GRADIENTS[5], address: '서울 중구 창경궁로5길 13',        lat: 37.5696, lng: 126.9987 },
  { id: 'f_jung_2', district: 'jung', name: '명동교자',                category: '칼국수',   rating: 4.4, reviewCount: 8912,  emoji: '🍜', gradient: GRADIENTS[6], address: '서울 중구 명동10길 29',           lat: 37.5634, lng: 126.9840 },
  { id: 'f_jung_3', district: 'jung', name: '하동관',                  category: '곰탕',     rating: 4.5, reviewCount: 2087,  emoji: '🍲', gradient: GRADIENTS[7], address: '서울 중구 명동9길 12',            lat: 37.5637, lng: 126.9852 },
  { id: 'f_jung_4', district: 'jung', name: '오장동 흥남집',          category: '함흥냉면', rating: 4.4, reviewCount: 1956,  emoji: '🍜', gradient: GRADIENTS[8], address: '서울 중구 오장동5길 3',            lat: 37.5630, lng: 126.9990 },
  { id: 'f_jung_5', district: 'jung', name: '을지면옥',                category: '평양냉면', rating: 4.5, reviewCount: 2876,  emoji: '🍜', gradient: GRADIENTS[9], address: '서울 중구 을지로 18',             lat: 37.5654, lng: 126.9899 },

  // 성동구
  { id: 'f_seongdong_1', district: 'seongdong', name: '성수동 뚝섬갈비',   category: '갈비',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[0], address: '서울 성동구 뚝섬로 280',          lat: 37.5479, lng: 127.0614 },
  { id: 'f_seongdong_2', district: 'seongdong', name: '왕십리 곱창골목',   category: '곱창',   rating: 4.4, reviewCount: 3421, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 성동구 왕십리로 257',        lat: 37.5615, lng: 127.0369 },
  { id: 'f_seongdong_3', district: 'seongdong', name: '성수 카페거리 브런치', category: '브런치', rating: 4.5, reviewCount: 5671, emoji: '☕', gradient: GRADIENTS[2], address: '서울 성동구 성수이로7가길 11', lat: 37.5444, lng: 127.0558 },

  // 광진구
  { id: 'f_gwangjin_1', district: 'gwangjin', name: '건대 닭갈비',    category: '닭갈비',   rating: 4.3, reviewCount: 2341,  emoji: '🍗', gradient: GRADIENTS[3], address: '서울 광진구 능동로 210',          lat: 37.5408, lng: 127.0694 },
  { id: 'f_gwangjin_2', district: 'gwangjin', name: '자양동 양꼬치', category: '양꼬치',   rating: 4.5, reviewCount: 2890,  emoji: '🍢', gradient: GRADIENTS[4], address: '서울 광진구 자양로 154',          lat: 37.5384, lng: 127.0822 },
  { id: 'f_gwangjin_3', district: 'gwangjin', name: '뚝섬 조개구이', category: '조개구이', rating: 4.4, reviewCount: 1567,  emoji: '🦀', gradient: GRADIENTS[5], address: '서울 광진구 뚝섬로 543',          lat: 37.5301, lng: 127.0822 },

  // 동대문구
  { id: 'f_dongdaemun_1', district: 'dongdaemun', name: '마장동 갈비',      category: '갈비',     rating: 4.4, reviewCount: 2134, emoji: '🥩', gradient: GRADIENTS[6], address: '서울 동대문구 마장로 32',         lat: 37.5670, lng: 127.0452 },
  { id: 'f_dongdaemun_2', district: 'dongdaemun', name: '동대문 닭한마리', category: '닭한마리', rating: 4.3, reviewCount: 3421, emoji: '🍗', gradient: GRADIENTS[7], address: '서울 동대문구 약령시로 1',        lat: 37.5717, lng: 127.0452 },
  { id: 'f_dongdaemun_3', district: 'dongdaemun', name: '신설동 육개장', category: '육개장',   rating: 4.2, reviewCount: 876,  emoji: '🍲', gradient: GRADIENTS[8], address: '서울 동대문구 신설로 65',         lat: 37.5744, lng: 127.0395 },

  // 서대문구
  { id: 'f_seodaemun_1', district: 'seodaemun', name: '신촌 황소고집',   category: '소고기',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[9], address: '서울 서대문구 신촌로 63',         lat: 37.5560, lng: 126.9368 },
  { id: 'f_seodaemun_2', district: 'seodaemun', name: '독립문 족발',     category: '족발',     rating: 4.4, reviewCount: 1890, emoji: '🍖', gradient: GRADIENTS[0], address: '서울 서대문구 통일로 185',        lat: 37.5791, lng: 126.9529 },
  { id: 'f_seodaemun_3', district: 'seodaemun', name: '연희동 갈치조림', category: '생선조림', rating: 4.5, reviewCount: 987,  emoji: '🐟', gradient: GRADIENTS[1], address: '서울 서대문구 연희로 85',         lat: 37.5711, lng: 126.9227 },

  // 은평구
  { id: 'f_eunpyeong_1', district: 'eunpyeong', name: '진관사 산채비빔밥', category: '사찰음식', rating: 4.5, reviewCount: 1234, emoji: '🥗', gradient: GRADIENTS[2], address: '서울 은평구 진관길 73',           lat: 37.6364, lng: 126.9246 },
  { id: 'f_eunpyeong_2', district: 'eunpyeong', name: '연신내 닭갈비',    category: '닭갈비',   rating: 4.3, reviewCount: 2341, emoji: '🍗', gradient: GRADIENTS[3], address: '서울 은평구 연서로 252',          lat: 37.6177, lng: 126.9228 },
  { id: 'f_eunpyeong_3', district: 'eunpyeong', name: '불광동 삼겹살',    category: '삼겹살',   rating: 4.2, reviewCount: 654,  emoji: '🥩', gradient: GRADIENTS[4], address: '서울 은평구 불광로 120',          lat: 37.6177, lng: 126.9170 },

  // 노원구
  { id: 'f_nowon_1', district: 'nowon', name: '중계동 은행나무식당', category: '한정식',   rating: 4.4, reviewCount: 876,  emoji: '🍱', gradient: GRADIENTS[5], address: '서울 노원구 중계로 212',          lat: 37.6393, lng: 127.0568 },
  { id: 'f_nowon_2', district: 'nowon', name: '공릉동 닭갈비',      category: '닭갈비',   rating: 4.3, reviewCount: 1567, emoji: '🍗', gradient: GRADIENTS[6], address: '서울 노원구 공릉로 116',          lat: 37.6291, lng: 127.0732 },
  { id: 'f_nowon_3', district: 'nowon', name: '노원 곰탕',          category: '곰탕',     rating: 4.2, reviewCount: 543,  emoji: '🍲', gradient: GRADIENTS[7], address: '서울 노원구 노원로 437',          lat: 37.6542, lng: 127.0568 },

  // 도봉구
  { id: 'f_dobong_1', district: 'dobong', name: '도봉산 파전막걸리', category: '파전',   rating: 4.3, reviewCount: 765,  emoji: '🥞', gradient: GRADIENTS[8], address: '서울 도봉구 도봉산길 86',         lat: 37.6688, lng: 127.0471 },
  { id: 'f_dobong_2', district: 'dobong', name: '쌍문동 삼겹살',    category: '삼겹살', rating: 4.2, reviewCount: 987,  emoji: '🥩', gradient: GRADIENTS[9], address: '서울 도봉구 도봉로 590',          lat: 37.6466, lng: 127.0357 },
  { id: 'f_dobong_3', district: 'dobong', name: '방학동 칼국수',    category: '칼국수', rating: 4.3, reviewCount: 654,  emoji: '🍜', gradient: GRADIENTS[0], address: '서울 도봉구 방학로 47',            lat: 37.6600, lng: 127.0350 },

  // 강북구
  { id: 'f_gangbuk_1', district: 'gangbuk', name: '미아동 곱창골목',  category: '곱창',   rating: 4.3, reviewCount: 1234, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 강북구 도봉로 152',          lat: 37.6397, lng: 127.0256 },
  { id: 'f_gangbuk_2', district: 'gangbuk', name: '수유시장 순대국', category: '순대국', rating: 4.4, reviewCount: 1890, emoji: '🍲', gradient: GRADIENTS[2], address: '서울 강북구 도봉로 250',          lat: 37.6400, lng: 127.0256 },
  { id: 'f_gangbuk_3', district: 'gangbuk', name: '솔밭 파전',       category: '파전',   rating: 4.2, reviewCount: 543,  emoji: '🥞', gradient: GRADIENTS[3], address: '서울 강북구 4.19로 5',            lat: 37.6420, lng: 127.0100 },

  // 성북구
  { id: 'f_seongbuk_1', district: 'seongbuk', name: '성북동 삼청각',   category: '한정식',   rating: 4.5, reviewCount: 2134, emoji: '🍱', gradient: GRADIENTS[4], address: '서울 성북구 대사관로 3',          lat: 37.5949, lng: 126.9969 },
  { id: 'f_seongbuk_2', district: 'seongbuk', name: '정릉 닭볶음탕',   category: '닭볶음탕', rating: 4.3, reviewCount: 876,  emoji: '🍗', gradient: GRADIENTS[5], address: '서울 성북구 정릉로 237',          lat: 37.6050, lng: 127.0068 },
  { id: 'f_seongbuk_3', district: 'seongbuk', name: '길음 순대볶음',   category: '분식',     rating: 4.4, reviewCount: 1567, emoji: '🍖', gradient: GRADIENTS[6], address: '서울 성북구 동소문로 22',         lat: 37.5894, lng: 127.0167 },

  // 중랑구
  { id: 'f_jungnang_1', district: 'jungnang', name: '면목동 칼국수', category: '칼국수', rating: 4.3, reviewCount: 765,  emoji: '🍜', gradient: GRADIENTS[7], address: '서울 중랑구 면목로 79',           lat: 37.5963, lng: 127.0928 },
  { id: 'f_jungnang_2', district: 'jungnang', name: '상봉 닭갈비',   category: '닭갈비', rating: 4.2, reviewCount: 987,  emoji: '🍗', gradient: GRADIENTS[8], address: '서울 중랑구 봉화산로 101',        lat: 37.6063, lng: 127.0928 },
  { id: 'f_jungnang_3', district: 'jungnang', name: '망우 순대국',   category: '순대국', rating: 4.3, reviewCount: 654,  emoji: '🍲', gradient: GRADIENTS[9], address: '서울 중랑구 망우로 254',          lat: 37.6063, lng: 127.0800 },

  // 강서구
  { id: 'f_gangseo_1', district: 'gangseo', name: '마곡나루 스시',  category: '스시',     rating: 4.4, reviewCount: 1234, emoji: '🍣', gradient: GRADIENTS[0], address: '서울 강서구 마곡중앙로 59',       lat: 37.5591, lng: 126.8345 },
  { id: 'f_gangseo_2', district: 'gangseo', name: '화곡 삼겹살',    category: '삼겹살',   rating: 4.3, reviewCount: 1890, emoji: '🥩', gradient: GRADIENTS[1], address: '서울 강서구 등촌로 175',          lat: 37.5509, lng: 126.8495 },
  { id: 'f_gangseo_3', district: 'gangseo', name: '발산역 닭한마리', category: '닭한마리', rating: 4.2, reviewCount: 765,  emoji: '🍗', gradient: GRADIENTS[2], address: '서울 강서구 공항대로 209',        lat: 37.5500, lng: 126.8367 },

  // 양천구
  { id: 'f_yangcheon_1', district: 'yangcheon', name: '목동 쭈꾸미',    category: '쭈꾸미',   rating: 4.3, reviewCount: 1567, emoji: '🦑', gradient: GRADIENTS[3], address: '서울 양천구 목동동로 57',         lat: 37.5170, lng: 126.8665 },
  { id: 'f_yangcheon_2', district: 'yangcheon', name: '신정 순대국',    category: '순대국',   rating: 4.2, reviewCount: 876,  emoji: '🍲', gradient: GRADIENTS[4], address: '서울 양천구 신정중앙로 28',       lat: 37.5190, lng: 126.8700 },
  { id: 'f_yangcheon_3', district: 'yangcheon', name: '오목교 칼국수', category: '칼국수',   rating: 4.4, reviewCount: 2341, emoji: '🍜', gradient: GRADIENTS[5], address: '서울 양천구 오목로 345',          lat: 37.5254, lng: 126.8699 },

  // 영등포구
  { id: 'f_yeongdeungpo_1', district: 'yeongdeungpo', name: '당산 꼬막',         category: '해산물',   rating: 4.4, reviewCount: 2134, emoji: '🦀', gradient: GRADIENTS[6], address: '서울 영등포구 당산로 121',       lat: 37.5263, lng: 126.8961 },
  { id: 'f_yeongdeungpo_2', district: 'yeongdeungpo', name: '영등포 시장 닭볶음탕', category: '닭볶음탕', rating: 4.3, reviewCount: 1234, emoji: '🍗', gradient: GRADIENTS[7], address: '서울 영등포구 영등포로 63',    lat: 37.5175, lng: 126.9036 },
  { id: 'f_yeongdeungpo_3', district: 'yeongdeungpo', name: '문래 수제버거',     category: '양식',     rating: 4.2, reviewCount: 543,  emoji: '🍔', gradient: GRADIENTS[8], address: '서울 영등포구 문래로 5',         lat: 37.5176, lng: 126.8961 },

  // 구로구
  { id: 'f_guro_1', district: 'guro', name: '구로 디지털단지 쌀국수', category: '쌀국수', rating: 4.3, reviewCount: 1890, emoji: '🍜', gradient: GRADIENTS[9], address: '서울 구로구 디지털로 306',        lat: 37.4854, lng: 126.9014 },
  { id: 'f_guro_2', district: 'guro', name: '신도림 갈비탕',         category: '갈비탕', rating: 4.2, reviewCount: 765,  emoji: '🍲', gradient: GRADIENTS[0], address: '서울 구로구 경인로 610',          lat: 37.5089, lng: 126.8876 },
  { id: 'f_guro_3', district: 'guro', name: '구로시장 순대볶음',     category: '분식',   rating: 4.4, reviewCount: 2341, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 구로구 고척로 17',            lat: 37.4954, lng: 126.8874 },

  // 금천구
  { id: 'f_geumcheon_1', district: 'geumcheon', name: '가산 칼국수',  category: '칼국수', rating: 4.3, reviewCount: 1234, emoji: '🍜', gradient: GRADIENTS[2], address: '서울 금천구 가산디지털1로 128',   lat: 37.4775, lng: 126.9030 },
  { id: 'f_geumcheon_2', district: 'geumcheon', name: '독산 삼겹살', category: '삼겹살', rating: 4.2, reviewCount: 876,  emoji: '🥩', gradient: GRADIENTS[3], address: '서울 금천구 시흥대로 159',        lat: 37.4600, lng: 126.9001 },
  { id: 'f_geumcheon_3', district: 'geumcheon', name: '시흥 곱창',   category: '곱창',   rating: 4.3, reviewCount: 1567, emoji: '🍖', gradient: GRADIENTS[4], address: '서울 금천구 독산로 246',          lat: 37.4780, lng: 126.8923 },

  // 동작구
  { id: 'f_dongjak_1', district: 'dongjak', name: '노량진 수산시장', category: '해산물',   rating: 4.5, reviewCount: 8901, emoji: '🐟', gradient: GRADIENTS[5], address: '서울 동작구 노들로 674',          lat: 37.5140, lng: 126.9420 },
  { id: 'f_dongjak_2', district: 'dongjak', name: '사당 닭한마리',   category: '닭한마리', rating: 4.3, reviewCount: 2134, emoji: '🍗', gradient: GRADIENTS[6], address: '서울 동작구 동작대로 109',        lat: 37.5124, lng: 126.9393 },
  { id: 'f_dongjak_3', district: 'dongjak', name: '흑석 순두부',     category: '두부요리', rating: 4.4, reviewCount: 1234, emoji: '🍲', gradient: GRADIENTS[7], address: '서울 동작구 흑석로 84',            lat: 37.5091, lng: 126.9508 },

  // 관악구
  { id: 'f_gwanak_1', district: 'gwanak', name: '신림 순대타운',      category: '순대',   rating: 4.4, reviewCount: 5678, emoji: '🍖', gradient: GRADIENTS[8], address: '서울 관악구 신림로 316',          lat: 37.4853, lng: 126.9295 },
  { id: 'f_gwanak_2', district: 'gwanak', name: '서울대입구 양꼬치', category: '양꼬치', rating: 4.5, reviewCount: 3421, emoji: '🍢', gradient: GRADIENTS[9], address: '서울 관악구 관악로 211',          lat: 37.4784, lng: 126.9516 },
  { id: 'f_gwanak_3', district: 'gwanak', name: '봉천 육전',          category: '육전',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[0], address: '서울 관악구 봉천로 318',          lat: 37.4830, lng: 126.9383 },

  // 강동구
  { id: 'f_gangdong_1', district: 'gangdong', name: '천호 순대국',   category: '순대국', rating: 4.3, reviewCount: 1890, emoji: '🍲', gradient: GRADIENTS[1], address: '서울 강동구 천호대로 1139',       lat: 37.5390, lng: 127.1238 },
  { id: 'f_gangdong_2', district: 'gangdong', name: '암사 어시장',   category: '해산물', rating: 4.4, reviewCount: 2341, emoji: '🐟', gradient: GRADIENTS[2], address: '서울 강동구 올림픽로 875',        lat: 37.5568, lng: 127.1415 },
  { id: 'f_gangdong_3', district: 'gangdong', name: '길동 삼겹살',   category: '삼겹살', rating: 4.2, reviewCount: 765,  emoji: '🥩', gradient: GRADIENTS[3], address: '서울 강동구 천호대로 1175',       lat: 37.5340, lng: 127.1300 },
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

function fetchRestaurantsFromGoogle(lat, lng, districtLabel, districtKey) {
  return new Promise((resolve) => {
    // If Google Maps SDK didn't load, fall back immediately
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      console.warn('Google Maps SDK not available');
      resolve(getFallbackRestaurants(lat, lng, districtKey));
      return;
    }

    // Safety timeout — resolve with fallback after 8 seconds
    const timeout = setTimeout(() => {
      console.warn('Places API timed out');
      resolve(getFallbackRestaurants(lat, lng, districtKey));
    }, 8000);

    try {
      const service = new google.maps.places.PlacesService(document.createElement('div'));

      service.textSearch(
        {
          query:    `${districtLabel} 맛집`,
          location: new google.maps.LatLng(lat, lng),
          radius:   2000,
          type:     'restaurant',
        },
        (results, status) => {
          clearTimeout(timeout);
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
            const mapped = results.map((p, i) => ({
              id:          p.place_id,
              name:        p.name,
              category:    getGoogleCategory(p.types),
              rating:      p.rating            != null ? p.rating            : parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
              reviewCount: p.user_ratings_total != null ? p.user_ratings_total : Math.floor(100 + Math.random() * 900),
              address:     p.formatted_address || p.vicinity,
              lat:         p.geometry.location.lat(),
              lng:         p.geometry.location.lng(),
              emoji:       getCategoryEmoji(p.types),
              gradient:    GRADIENTS[i % GRADIENTS.length],
              placeId:     p.place_id,
              photoUrl:    p.photos?.length ? p.photos[0].getUrl({ maxWidth: 600, maxHeight: 400 }) : null,
            }));
            // Sort by real Google rating (highest first), take top 8
            resolve(mapped.sort((a, b) => b.rating - a.rating).slice(0, 8));
          } else {
            console.warn('Places API status:', status);
            resolve(getFallbackRestaurants(lat, lng, districtKey));
          }
        }
      );
    } catch (e) {
      clearTimeout(timeout);
      console.warn('Places API error:', e);
      resolve(getFallbackRestaurants(lat, lng, districtKey));
    }
  });
}

function getFallbackRestaurants(lat, lng, districtKey) {
  // Filter by district first; if fewer than 8 matches, use the whole list
  let pool = districtKey
    ? FALLBACK_RESTAURANTS.filter(r => r.district === districtKey)
    : [];
  if (pool.length < 8) pool = FALLBACK_RESTAURANTS;

  return shuffle(pool).slice(0, 8).map(r => ({
    ...r,
    photoUrl: r.photoUrl || null,
    lat: r.lat !== undefined ? r.lat : lat + (Math.random() - 0.5) * 0.01,
    lng: r.lng !== undefined ? r.lng : lng + (Math.random() - 0.5) * 0.01,
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

    try {
      state.restaurants = await fetchRestaurantsFromGoogle(districtData.lat, districtData.lng, districtData.label, districtData.key);
    } catch (e) {
      state.restaurants = getFallbackRestaurants(districtData.lat, districtData.lng, districtData.key);
    }

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
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}&query_place_id=${r.placeId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' 서울')}`;
    card.innerHTML = `
      <div class="preview-card-emoji" style="background:${r.gradient}">
        ${r.photoUrl ? `<img src="${r.photoUrl}" alt="${r.name}" class="card-photo">` : r.emoji}
      </div>
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
        ${r.photoUrl ? `<img src="${r.photoUrl}" alt="${r.name}" class="card-photo">` : r.emoji}
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

  const championMapsUrl = c.placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}&query_place_id=${c.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' 서울')}`;

  document.getElementById('champion-card-container').innerHTML = `
    <div class="champion-card">
      <div class="champion-badge">우승! 🏆</div>
      <div class="champion-card-hero" style="background:${c.gradient}">
        ${c.photoUrl ? `<img src="${c.photoUrl}" alt="${c.name}" class="card-photo">` : c.emoji}
      </div>
      <div class="champion-card-body">
        <div class="champion-card-name">${c.name}</div>
        <div class="champion-card-category">${c.category}</div>
        ${c.address ? `<div class="champion-card-address">📍 ${c.address}</div>` : ''}
        <div class="champion-card-rating">
          <span class="star">★</span>
          <span>${c.rating}</span>
          <span style="color:var(--color-text-muted);font-size:.8125rem">(${c.reviewCount.toLocaleString()} 리뷰)</span>
        </div>
        <a class="champion-card-link" href="${championMapsUrl}" target="_blank" rel="noopener">구글맵에서 보기 →</a>
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
   BOOTSTRAP
════════════════════════════════════════════════════════════ */

// Populate the district dropdown immediately — doesn't need Google Maps
document.addEventListener('DOMContentLoaded', () => {
  initLocationScreen();
});

// Called by Google Maps SDK once it finishes loading (no-op here)
window.initApp = function () {};
