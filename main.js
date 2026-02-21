/* ══════════════════════════════════════════════════════════════
   푸드 월드컵 — main.js
   Stack: vanilla HTML/CSS/JS, Naver Maps API v3, no build step
══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════════
   PHASE 1 — DATA
════════════════════════════════════════════════════════════ */

const ROUND_LABELS  = { 0: '8강', 1: '4강', 2: '결승' };
const TOTAL_MATCHES = [4, 2, 1];

/* ── Location Data ─────────────────────────────────────────── */
const LOCATION_DATA = {
  seoul: {
    label: '서울특별시', lat: 37.5665, lng: 126.9780,
    districts: [
      { key: 'gangnam',  label: '강남구',   lat: 37.4979, lng: 127.0276 },
      { key: 'mapo',     label: '마포구',   lat: 37.5615, lng: 126.9086 },
      { key: 'jongno',   label: '종로구',   lat: 37.5726, lng: 126.9791 },
      { key: 'songpa',   label: '송파구',   lat: 37.5145, lng: 127.1059 },
      { key: 'hongdae',  label: '홍대(마포)', lat: 37.5572, lng: 126.9254 },
      { key: 'itaewon',  label: '이태원(용산)', lat: 37.5345, lng: 126.9940 },
      { key: 'sinchon',  label: '신촌(서대문)', lat: 37.5596, lng: 126.9426 },
      { key: 'jamsil',   label: '잠실(송파)', lat: 37.5133, lng: 127.1002 },
      { key: 'dongdaemun', label: '동대문구', lat: 37.5744, lng: 127.0395 },
      { key: 'seocho',   label: '서초구',   lat: 37.4837, lng: 127.0324 },
    ],
  },
  busan: {
    label: '부산광역시', lat: 35.1796, lng: 129.0756,
    districts: [
      { key: 'haeundae', label: '해운대구', lat: 35.1628, lng: 129.1636 },
      { key: 'busanjin', label: '부산진구', lat: 35.1598, lng: 129.0530 },
      { key: 'nam',      label: '남구',     lat: 35.1368, lng: 129.0840 },
      { key: 'saha',     label: '사하구',   lat: 35.1041, lng: 128.9748 },
      { key: 'geumjeong', label: '금정구',  lat: 35.2431, lng: 129.0851 },
    ],
  },
  daegu: {
    label: '대구광역시', lat: 35.8714, lng: 128.6014,
    districts: [
      { key: 'jung',    label: '중구',   lat: 35.8694, lng: 128.6064 },
      { key: 'suseong', label: '수성구', lat: 35.8580, lng: 128.6306 },
      { key: 'dalseo',  label: '달서구', lat: 35.8298, lng: 128.5327 },
      { key: 'buk',     label: '북구',   lat: 35.8858, lng: 128.5825 },
    ],
  },
  incheon: {
    label: '인천광역시', lat: 37.4563, lng: 126.7052,
    districts: [
      { key: 'namdong', label: '남동구', lat: 37.4494, lng: 126.7310 },
      { key: 'yeonsu',  label: '연수구', lat: 37.4103, lng: 126.6780 },
      { key: 'bupyeong', label: '부평구', lat: 37.5075, lng: 126.7230 },
      { key: 'michuhol', label: '미추홀구', lat: 37.4639, lng: 126.6499 },
    ],
  },
  gwangju: {
    label: '광주광역시', lat: 35.1595, lng: 126.8526,
    districts: [
      { key: 'dong',   label: '동구',   lat: 35.1460, lng: 126.9230 },
      { key: 'seo',    label: '서구',   lat: 35.1518, lng: 126.8907 },
      { key: 'buk_gj', label: '북구',   lat: 35.1739, lng: 126.9113 },
      { key: 'gwangsan', label: '광산구', lat: 35.1396, lng: 126.7936 },
    ],
  },
  daejeon: {
    label: '대전광역시', lat: 36.3504, lng: 127.3845,
    districts: [
      { key: 'yuseong', label: '유성구', lat: 36.3623, lng: 127.3566 },
      { key: 'seo_dj',  label: '서구',   lat: 36.3553, lng: 127.3834 },
      { key: 'dong_dj', label: '동구',   lat: 36.3128, lng: 127.4540 },
      { key: 'jung_dj', label: '중구',   lat: 36.3259, lng: 127.4215 },
    ],
  },
  ulsan: {
    label: '울산광역시', lat: 35.5384, lng: 129.3114,
    districts: [
      { key: 'nam_us',  label: '남구',   lat: 35.5388, lng: 129.3248 },
      { key: 'dong_us', label: '동구',   lat: 35.5055, lng: 129.4162 },
      { key: 'jung_us', label: '중구',   lat: 35.5696, lng: 129.3322 },
      { key: 'buk_us',  label: '북구',   lat: 35.5854, lng: 129.3613 },
    ],
  },
  sejong: {
    label: '세종특별자치시', lat: 36.4801, lng: 127.2890,
    districts: [
      { key: 'sejong_center', label: '세종시', lat: 36.4801, lng: 127.2890 },
    ],
  },
  gyeonggi: {
    label: '경기도', lat: 37.4138, lng: 127.5183,
    districts: [
      { key: 'suwon',    label: '수원시', lat: 37.2636, lng: 127.0286 },
      { key: 'seongnam', label: '성남시', lat: 37.4449, lng: 127.1389 },
      { key: 'goyang',   label: '고양시', lat: 37.6583, lng: 126.8320 },
      { key: 'yongin',   label: '용인시', lat: 37.2411, lng: 127.1776 },
      { key: 'bucheon',  label: '부천시', lat: 37.5034, lng: 126.7660 },
      { key: 'ansan',    label: '안산시', lat: 37.3219, lng: 126.8309 },
    ],
  },
  gangwon: {
    label: '강원특별자치도', lat: 37.8813, lng: 127.7298,
    districts: [
      { key: 'chuncheon', label: '춘천시', lat: 37.8748, lng: 127.7342 },
      { key: 'wonju',     label: '원주시', lat: 37.3422, lng: 127.9202 },
      { key: 'gangneung', label: '강릉시', lat: 37.7519, lng: 128.8760 },
      { key: 'sokcho',    label: '속초시', lat: 38.2070, lng: 128.5918 },
    ],
  },
  chungbuk: {
    label: '충청북도', lat: 36.8, lng: 127.7,
    districts: [
      { key: 'cheongju', label: '청주시', lat: 36.6424, lng: 127.4890 },
      { key: 'chungju',  label: '충주시', lat: 36.9910, lng: 127.9259 },
      { key: 'jecheon',  label: '제천시', lat: 37.1324, lng: 128.1910 },
    ],
  },
  chungnam: {
    label: '충청남도', lat: 36.5184, lng: 126.8000,
    districts: [
      { key: 'cheonan', label: '천안시', lat: 36.8151, lng: 127.1139 },
      { key: 'asan',    label: '아산시', lat: 36.7898, lng: 127.0020 },
      { key: 'gongju',  label: '공주시', lat: 36.4465, lng: 127.1191 },
    ],
  },
  jeonbuk: {
    label: '전라북도', lat: 35.7175, lng: 127.1530,
    districts: [
      { key: 'jeonju',   label: '전주시', lat: 35.8242, lng: 127.1480 },
      { key: 'iksan',    label: '익산시', lat: 35.9483, lng: 126.9578 },
      { key: 'gunsan',   label: '군산시', lat: 35.9676, lng: 126.7368 },
    ],
  },
  jeonnam: {
    label: '전라남도', lat: 34.8679, lng: 126.9910,
    districts: [
      { key: 'mokpo',    label: '목포시', lat: 34.8118, lng: 126.3922 },
      { key: 'yeosu',    label: '여수시', lat: 34.7604, lng: 127.6622 },
      { key: 'suncheon', label: '순천시', lat: 34.9506, lng: 127.4877 },
    ],
  },
  gyeongbuk: {
    label: '경상북도', lat: 36.4919, lng: 128.8889,
    districts: [
      { key: 'pohang',  label: '포항시', lat: 36.0190, lng: 129.3435 },
      { key: 'gyeongju', label: '경주시', lat: 35.8562, lng: 129.2247 },
      { key: 'gumi',    label: '구미시', lat: 36.1195, lng: 128.3446 },
      { key: 'andong',  label: '안동시', lat: 36.5684, lng: 128.7294 },
    ],
  },
  gyeongnam: {
    label: '경상남도', lat: 35.4606, lng: 128.2132,
    districts: [
      { key: 'changwon', label: '창원시', lat: 35.2279, lng: 128.6817 },
      { key: 'jinju',    label: '진주시', lat: 35.1799, lng: 128.1076 },
      { key: 'gimhae',   label: '김해시', lat: 35.2285, lng: 128.8893 },
    ],
  },
  jeju: {
    label: '제주특별자치도', lat: 33.4996, lng: 126.5312,
    districts: [
      { key: 'jeju_si',    label: '제주시',   lat: 33.4996, lng: 126.5312 },
      { key: 'seogwipo',   label: '서귀포시', lat: 33.2541, lng: 126.5600 },
    ],
  },
};

/* ── Restaurant Data ───────────────────────────────────────── */
const RESTAURANTS = {
  gangnam: [
    { id: 'g1',  name: '봉피양 강남점',     category: '평양냉면',   rating: 4.8, reviewCount: 1240, address: '강남구 테헤란로 305', lat: 37.5055, lng: 127.0509, emoji: '🍜', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
    { id: 'g2',  name: '스시 오마카세 히나', category: '스시/일식', rating: 4.9, reviewCount: 328,  address: '강남구 도산대로 45', lat: 37.5218, lng: 127.0342, emoji: '🍣', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'g3',  name: '만포면옥',          category: '냉면/국밥',  rating: 4.7, reviewCount: 892,  address: '강남구 삼성로 146', lat: 37.5090, lng: 127.0540, emoji: '🥣', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'g4',  name: '두꺼비집',          category: '삼겹살',     rating: 4.6, reviewCount: 1541, address: '강남구 역삼로 175', lat: 37.5010, lng: 127.0332, emoji: '🥩', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'g5',  name: '강남 교자',         category: '만두/분식',  rating: 4.5, reviewCount: 673,  address: '강남구 강남대로 396', lat: 37.4980, lng: 127.0276, emoji: '🥟', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'g6',  name: '이남장',            category: '설렁탕',     rating: 4.8, reviewCount: 2012, address: '강남구 논현로 857', lat: 37.5135, lng: 127.0390, emoji: '🍲', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'g7',  name: '진진',              category: '중식',       rating: 4.9, reviewCount: 445,  address: '강남구 압구정로 446', lat: 37.5270, lng: 127.0300, emoji: '🥡', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'g8',  name: '강남면옥',          category: '갈비탕',     rating: 4.6, reviewCount: 780,  address: '강남구 도산대로 156', lat: 37.5245, lng: 127.0379, emoji: '🍖', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'g9',  name: '안동찜닭 본점',     category: '찜닭',       rating: 4.7, reviewCount: 953,  address: '강남구 선릉로 126', lat: 37.5060, lng: 127.0490, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'g10', name: '더 파스타',         category: '이탈리안',   rating: 4.5, reviewCount: 367,  address: '강남구 봉은사로 418', lat: 37.5168, lng: 127.0551, emoji: '🍝', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  ],
  mapo: [
    { id: 'm1', name: '공덕 순대국',     category: '순대국밥', rating: 4.7, reviewCount: 1102, address: '마포구 마포대로 148', lat: 37.5480, lng: 126.9519, emoji: '🥘', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'm2', name: '마포 갈비',       category: '갈비',    rating: 4.8, reviewCount: 825,  address: '마포구 토정로 8',    lat: 37.5488, lng: 126.9473, emoji: '🍖', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'm3', name: '합정 곱창',       category: '곱창',    rating: 4.6, reviewCount: 643,  address: '마포구 양화로 80',   lat: 37.5493, lng: 126.9151, emoji: '🫙', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'm4', name: '염리동 닭볶음탕', category: '닭볶음탕', rating: 4.7, reviewCount: 489,  address: '마포구 염리동 164', lat: 37.5546, lng: 126.9399, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'm5', name: '서교 칼국수',     category: '칼국수',  rating: 4.5, reviewCount: 732,  address: '마포구 서교동 395', lat: 37.5505, lng: 126.9240, emoji: '🍜', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'm6', name: '마포 짜장면',     category: '중식',    rating: 4.6, reviewCount: 1020, address: '마포구 신촌로 12',  lat: 37.5482, lng: 126.9482, emoji: '🥡', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'm7', name: '마포구 김밥천국', category: '김밥/분식', rating: 4.3, reviewCount: 2340, address: '마포구 백범로 10', lat: 37.5495, lng: 126.9460, emoji: '🍱', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'm8', name: '레드버거 마포',   category: '버거',    rating: 4.5, reviewCount: 567,  address: '마포구 독막로 31',  lat: 37.5440, lng: 126.9485, emoji: '🍔', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'm9', name: '마포 피자',       category: '피자',    rating: 4.4, reviewCount: 412,  address: '마포구 양화로 55',  lat: 37.5510, lng: 126.9182, emoji: '🍕', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'm10', name: '한강뷰 돼지갈비', category: '삼겹살', rating: 4.9, reviewCount: 1789, address: '마포구 한강로 22',  lat: 37.5440, lng: 126.9520, emoji: '🥩', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
  ],
  jongno: [
    { id: 'j1', name: '광화문 국밥',     category: '국밥',   rating: 4.7, reviewCount: 1450, address: '종로구 세종대로 165', lat: 37.5716, lng: 126.9769, emoji: '🥣', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'j2', name: '인사동 쌈밥집',   category: '쌈밥',  rating: 4.6, reviewCount: 834,  address: '종로구 인사동길 32', lat: 37.5744, lng: 126.9847, emoji: '🥬', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'j3', name: '익선동 설렁탕',   category: '설렁탕', rating: 4.8, reviewCount: 2100, address: '종로구 익선동 11',   lat: 37.5749, lng: 126.9993, emoji: '🍲', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'j4', name: '북촌 비빔밥',     category: '비빔밥', rating: 4.5, reviewCount: 967,  address: '종로구 북촌로 32',   lat: 37.5811, lng: 126.9853, emoji: '🍚', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'j5', name: '청계천 떡볶이',   category: '분식',   rating: 4.4, reviewCount: 3240, address: '종로구 청계천로 45', lat: 37.5700, lng: 126.9933, emoji: '🌶️', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'j6', name: '서울 공화춘',     category: '짜장면', rating: 4.7, reviewCount: 1120, address: '종로구 낙원동 283',  lat: 37.5752, lng: 126.9920, emoji: '🥡', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'j7', name: '삼청동 수제비',   category: '수제비', rating: 4.8, reviewCount: 678,  address: '종로구 삼청로 100', lat: 37.5817, lng: 126.9796, emoji: '🥘', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'j8', name: '피맛골 곱창전골', category: '전골',   rating: 4.6, reviewCount: 542,  address: '종로구 종로 21',    lat: 37.5703, lng: 126.9831, emoji: '🫕', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'j9', name: '광장시장 육회',   category: '육회',   rating: 4.9, reviewCount: 4560, address: '종로구 창경궁로 88', lat: 37.5700, lng: 126.9998, emoji: '🥩', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'j10', name: '낙원 삼계탕',    category: '삼계탕', rating: 4.7, reviewCount: 890,  address: '종로구 낙원동 55',  lat: 37.5760, lng: 126.9921, emoji: '🍗', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
  ],
  songpa: [
    { id: 'sp1', name: '잠실 어우동', category: '어묵/국물', rating: 4.5, reviewCount: 780, address: '송파구 올림픽로 300', lat: 37.5144, lng: 127.1028, emoji: '🍲', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'sp2', name: '석촌호수 삼겹살', category: '삼겹살', rating: 4.7, reviewCount: 1230, address: '송파구 석촌호수로 30', lat: 37.5082, lng: 127.1005, emoji: '🥩', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'sp3', name: '가든파이브 초밥', category: '초밥', rating: 4.6, reviewCount: 456, address: '송파구 충민로 10', lat: 37.4795, lng: 127.1228, emoji: '🍣', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'sp4', name: '방이 매운갈비', category: '갈비', rating: 4.8, reviewCount: 923, address: '송파구 방이동 174', lat: 37.5167, lng: 127.1173, emoji: '🍖', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'sp5', name: '송파 국수집', category: '국수', rating: 4.4, reviewCount: 342, address: '송파구 마천동 26', lat: 37.4895, lng: 127.1463, emoji: '🍜', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'sp6', name: '가락 순대볶음', category: '순대볶음', rating: 4.6, reviewCount: 661, address: '송파구 가락로 55', lat: 37.4948, lng: 127.1198, emoji: '🥘', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'sp7', name: '풍납 치킨집', category: '치킨', rating: 4.5, reviewCount: 1200, address: '송파구 풍납동 60', lat: 37.5240, lng: 127.1227, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'sp8', name: '잠실 피자나라', category: '피자', rating: 4.3, reviewCount: 870, address: '송파구 잠실본동 100', lat: 37.5117, lng: 127.0995, emoji: '🍕', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'sp9', name: '석촌 냉면', category: '냉면', rating: 4.7, reviewCount: 510, address: '송파구 석촌동 12', lat: 37.5070, lng: 127.1009, emoji: '🍜', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
    { id: 'sp10', name: '잠실 버거킹 수제', category: '버거', rating: 4.2, reviewCount: 2340, address: '송파구 올림픽로35가길 12', lat: 37.5130, lng: 127.0999, emoji: '🍔', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
  ],
  hongdae: [
    { id: 'hd1', name: '홍대 양꼬치', category: '양꼬치', rating: 4.6, reviewCount: 1560, address: '마포구 와우산로 94', lat: 37.5572, lng: 126.9261, emoji: '🍢', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'hd2', name: '경의선숲길 돈까스', category: '돈까스', rating: 4.7, reviewCount: 987, address: '마포구 잔다리로 45', lat: 37.5580, lng: 126.9280, emoji: '🍱', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'hd3', name: '홍대 타코 가게', category: '멕시칸', rating: 4.4, reviewCount: 342, address: '마포구 어울마당로 35', lat: 37.5525, lng: 126.9228, emoji: '🌮', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'hd4', name: '홍익 치킨', category: '치킨', rating: 4.8, reviewCount: 2310, address: '마포구 홍익로 4길 8', lat: 37.5560, lng: 126.9235, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'hd5', name: '연남 동경식당', category: '일식', rating: 4.7, reviewCount: 780, address: '마포구 연남로 42', lat: 37.5608, lng: 126.9219, emoji: '🍱', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'hd6', name: '홍대 파스타 인', category: '파스타', rating: 4.5, reviewCount: 441, address: '마포구 동교로 241', lat: 37.5538, lng: 126.9253, emoji: '🍝', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'hd7', name: '합정 베이글', category: '베이커리', rating: 4.6, reviewCount: 1120, address: '마포구 합정동 386', lat: 37.5494, lng: 126.9142, emoji: '🥯', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'hd8', name: '홍대 떡볶이 본점', category: '분식', rating: 4.5, reviewCount: 3400, address: '마포구 홍익로 5', lat: 37.5571, lng: 126.9264, emoji: '🌶️', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'hd9', name: '경의선 꼬마김밥', category: '김밥', rating: 4.3, reviewCount: 890, address: '마포구 성미산로 153', lat: 37.5602, lng: 126.9249, emoji: '🍱', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'hd10', name: '홍대입구역 국수', category: '국수', rating: 4.6, reviewCount: 670, address: '마포구 양화로 188', lat: 37.5575, lng: 126.9244, emoji: '🍜', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
  ],
  itaewon: [
    { id: 'it1', name: '이태원 부리또', category: '멕시칸', rating: 4.6, reviewCount: 890, address: '용산구 이태원로 157', lat: 37.5347, lng: 126.9944, emoji: '🌯', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'it2', name: '경리단길 스테이크', category: '스테이크', rating: 4.8, reviewCount: 450, address: '용산구 회나무로 26', lat: 37.5370, lng: 126.9952, emoji: '🥩', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'it3', name: '해방촌 피자', category: '피자', rating: 4.5, reviewCount: 620, address: '용산구 신흥로 18', lat: 37.5413, lng: 126.9914, emoji: '🍕', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'it4', name: '이태원 쌀국수', category: '베트남', rating: 4.7, reviewCount: 1340, address: '용산구 이태원로 200', lat: 37.5360, lng: 126.9935, emoji: '🍜', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'it5', name: '한남동 일식', category: '라멘', rating: 4.8, reviewCount: 780, address: '용산구 한남대로 48', lat: 37.5382, lng: 127.0005, emoji: '🍱', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'it6', name: '이태원 인도음식', category: '인도', rating: 4.5, reviewCount: 320, address: '용산구 이태원로 27가길 10', lat: 37.5355, lng: 126.9960, emoji: '🍛', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'it7', name: '녹사평 햄버거', category: '버거', rating: 4.6, reviewCount: 1100, address: '용산구 녹사평대로 244', lat: 37.5345, lng: 126.9880, emoji: '🍔', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'it8', name: '이태원 바베큐', category: '바베큐', rating: 4.7, reviewCount: 560, address: '용산구 이태원로 190', lat: 37.5356, lng: 126.9940, emoji: '🔥', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
    { id: 'it9', name: '용산 순대국', category: '국밥', rating: 4.4, reviewCount: 930, address: '용산구 한강대로 373', lat: 37.5298, lng: 126.9644, emoji: '🥣', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
    { id: 'it10', name: '한남 카레우동', category: '일식', rating: 4.6, reviewCount: 475, address: '용산구 대사관로 8', lat: 37.5387, lng: 127.0011, emoji: '🍜', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
  ],
  haeundae: [
    { id: 'hae1', name: '해운대 암소갈비', category: '갈비', rating: 4.8, reviewCount: 2100, address: '해운대구 달맞이길 117', lat: 35.1628, lng: 129.1784, emoji: '🍖', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { id: 'hae2', name: '해운대 해물탕', category: '해물탕', rating: 4.7, reviewCount: 1560, address: '해운대구 해운대해변로 200', lat: 35.1587, lng: 129.1604, emoji: '🦀', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
    { id: 'hae3', name: '구남로 회집', category: '회/해산물', rating: 4.9, reviewCount: 934, address: '해운대구 구남로 25', lat: 35.1601, lng: 129.1619, emoji: '🐟', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { id: 'hae4', name: '해운대 어묵', category: '어묵', rating: 4.5, reviewCount: 4500, address: '해운대구 중동 1415', lat: 35.1617, lng: 129.1626, emoji: '🍢', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    { id: 'hae5', name: '마린시티 스테이크', category: '스테이크', rating: 4.7, reviewCount: 445, address: '해운대구 마린시티1로 75', lat: 35.1655, lng: 129.1356, emoji: '🥩', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    { id: 'hae6', name: '해운대 돼지국밥', category: '돼지국밥', rating: 4.8, reviewCount: 3200, address: '해운대구 센텀2로 10', lat: 35.1693, lng: 129.1325, emoji: '🥣', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
    { id: 'hae7', name: '달맞이 이탈리안', category: '파스타', rating: 4.6, reviewCount: 380, address: '해운대구 달맞이길 68', lat: 35.1573, lng: 129.1778, emoji: '🍝', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    { id: 'hae8', name: '해운대 낙지볶음', category: '낙지볶음', rating: 4.7, reviewCount: 1100, address: '해운대구 해운대로 670', lat: 35.1622, lng: 129.1577, emoji: '🐙', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
    { id: 'hae9', name: '벡스코 치킨', category: '치킨', rating: 4.4, reviewCount: 1800, address: '해운대구 APEC로 58', lat: 35.1685, lng: 129.1318, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
    { id: 'hae10', name: '해운대 밀면', category: '밀면', rating: 4.8, reviewCount: 2890, address: '해운대구 좌동 195', lat: 35.1813, lng: 129.2024, emoji: '🍜', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
  ],
};

/* ── Fallback restaurants (used when no specific data exists) ── */
const FALLBACK_RESTAURANTS = [
  { id: 'f1',  name: '동네 삼겹살집',  category: '삼겹살',  rating: 4.5, reviewCount: 450,  emoji: '🥩', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
  { id: 'f2',  name: '할머니 설렁탕',  category: '설렁탕',  rating: 4.7, reviewCount: 980,  emoji: '🍲', gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
  { id: 'f3',  name: '원조 치킨',      category: '치킨',    rating: 4.6, reviewCount: 1200, emoji: '🍗', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
  { id: 'f4',  name: '명품 냉면',      category: '냉면',    rating: 4.4, reviewCount: 670,  emoji: '🍜', gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
  { id: 'f5',  name: '신선 해물탕',    category: '해물탕',  rating: 4.8, reviewCount: 340,  emoji: '🦀', gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  { id: 'f6',  name: '정성 비빔밥',    category: '비빔밥',  rating: 4.5, reviewCount: 520,  emoji: '🍚', gradient: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
  { id: 'f7',  name: '동네 떡볶이',    category: '분식',    rating: 4.3, reviewCount: 1540, emoji: '🌶️', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
  { id: 'f8',  name: '장인 돈까스',    category: '돈까스',  rating: 4.6, reviewCount: 789,  emoji: '🍱', gradient: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' },
  { id: 'f9',  name: '수제 버거',      category: '버거',    rating: 4.4, reviewCount: 612,  emoji: '🍔', gradient: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
  { id: 'f10', name: '이탈리안 파스타', category: '파스타', rating: 4.5, reviewCount: 390,  emoji: '🍝', gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
];

/* ── State ─────────────────────────────────────────────────── */
const state = {
  screen: 'location',
  selectedCity: null,
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
   PHASE 2 — SCREEN NAVIGATION + LOCATION SCREEN
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

/* ── Fisher-Yates shuffle ──────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Get 8 restaurants for a district ─────────────────────── */
function getRestaurantsForDistrict(districtKey, cityData, districtData) {
  let pool = RESTAURANTS[districtKey] ? [...RESTAURANTS[districtKey]] : [];

  if (pool.length < 8) {
    // Add fallback entries enriched with district location
    const fallbackEnriched = FALLBACK_RESTAURANTS.map(r => ({
      ...r,
      id: r.id + '_' + districtKey,
      address: districtData.label + ' 일대',
      lat: districtData.lat + (Math.random() - 0.5) * 0.01,
      lng: districtData.lng + (Math.random() - 0.5) * 0.01,
    }));
    pool = [...pool, ...fallbackEnriched];
  }

  return shuffle(pool).slice(0, 8);
}

/* ── Location screen init ──────────────────────────────────── */
function initLocationScreen() {
  const citySelect     = document.getElementById('city-select');
  const districtSelect = document.getElementById('district-select');
  const btnFind        = document.getElementById('btn-find');

  // Populate city dropdown
  citySelect.innerHTML = '<option value="">시/도 선택</option>';
  Object.entries(LOCATION_DATA).forEach(([key, city]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = city.label;
    citySelect.appendChild(opt);
  });

  // City change → populate districts
  citySelect.addEventListener('change', () => {
    const cityKey = citySelect.value;
    state.selectedCity = cityKey || null;
    state.selectedDistrict = null;

    if (cityKey && LOCATION_DATA[cityKey]) {
      const { districts } = LOCATION_DATA[cityKey];
      districtSelect.innerHTML = '<option value="">구/군 선택</option>';
      districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.key;
        opt.textContent = d.label;
        districtSelect.appendChild(opt);
      });
      districtSelect.disabled = false;
    } else {
      districtSelect.innerHTML = '<option value="">먼저 시/도를 선택하세요</option>';
      districtSelect.disabled = true;
    }
    btnFind.disabled = true;
  });

  // District change → enable button
  districtSelect.addEventListener('change', () => {
    state.selectedDistrict = districtSelect.value || null;
    btnFind.disabled = !state.selectedDistrict;
  });

  // Find button
  btnFind.addEventListener('click', () => {
    if (!state.selectedCity || !state.selectedDistrict) return;
    const cityData     = LOCATION_DATA[state.selectedCity];
    const districtData = cityData.districts.find(d => d.key === state.selectedDistrict);
    state.restaurants  = getRestaurantsForDistrict(state.selectedDistrict, cityData, districtData);
    goToScreen('map');
  });
}

/* ════════════════════════════════════════════════════════════
   PHASE 3 — MAP SCREEN
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
  const cityData     = LOCATION_DATA[state.selectedCity];
  const districtData = cityData.districts.find(d => d.key === state.selectedDistrict);

  // Update header title
  document.getElementById('map-screen-title').textContent =
    `${districtData.label} 맛집`;

  // Create or re-center map
  if (state.map) {
    try {
      state.map.setCenter(new naver.maps.LatLng(districtData.lat, districtData.lng));
    } catch (_) {}
  } else {
    state.map = createMap('map-container', districtData.lat, districtData.lng, 14);
  }

  // Clear old markers
  state.markers.forEach(m => { try { m.setMap(null); } catch (_) {} });
  state.markers = [];

  // Place emoji markers
  if (state.map) {
    state.restaurants.forEach((r, i) => {
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

  // Back button
  document.getElementById('map-back-btn').onclick = () => goToScreen('location');

  // Start tournament button
  document.getElementById('btn-start-tournament').onclick = () => goToScreen('tournament');
}

/* ════════════════════════════════════════════════════════════
   PHASE 4 — TOURNAMENT
════════════════════════════════════════════════════════════ */

function initBracket() {
  const shuffled = shuffle(state.restaurants);
  state.bracket = {
    rounds: [
      // 8강: pairs [0,1], [2,3], [4,5], [6,7]
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
  const [a, b] = rounds[currentRound][currentMatch];
  const roundLabel   = ROUND_LABELS[currentRound];
  const totalMatches = TOTAL_MATCHES[currentRound];
  const matchNum     = currentMatch + 1;
  const totalDone    = getTotalMatchesSoFar();

  // Update progress
  document.getElementById('round-badge').textContent = roundLabel;
  document.getElementById('progress-label').textContent =
    `${roundLabel} · 매치 ${matchNum}/${totalMatches}`;

  const bar = document.getElementById('progress-bar');
  bar.style.width = `${(totalDone / 7) * 100}%`;
  bar.setAttribute('aria-valuenow', totalDone);

  // Build cards
  const leftSlot  = document.getElementById('card-left');
  const rightSlot = document.getElementById('card-right');
  leftSlot.innerHTML  = buildTournamentCard(a);
  rightSlot.innerHTML = buildTournamentCard(b);

  // Attach click listeners (use fresh nodes to avoid stale listeners)
  const leftCard  = leftSlot.querySelector('.tournament-card');
  const rightCard = rightSlot.querySelector('.tournament-card');

  const newLeft  = leftCard.cloneNode(true);
  const newRight = rightCard.cloneNode(true);
  leftCard.replaceWith(newLeft);
  rightCard.replaceWith(newRight);

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
  loserEl.style.opacity = '.35';
  loserEl.style.transform = 'scale(.95)';
  loserEl.style.pointerEvents = 'none';

  state.bracket.winners[state.bracket.currentRound].push(winner);

  setTimeout(() => advanceBracket(), 420);
}

function advanceBracket() {
  const { currentRound, currentMatch, rounds, winners } = state.bracket;
  const totalMatchesInRound = TOTAL_MATCHES[currentRound];

  if (currentMatch + 1 < totalMatchesInRound) {
    // More matches in current round
    state.bracket.currentMatch++;
  } else {
    // Round finished
    const roundWinners = winners[currentRound];

    if (currentRound === 2) {
      // 결승 done → champion
      state.champion = roundWinners[0];
      goToScreen('result');
      return;
    }

    // Build next round's pairs
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
   PHASE 5 — RESULT SCREEN
════════════════════════════════════════════════════════════ */

function initResultScreen() {
  const c = state.champion;

  // Champion card
  const container = document.getElementById('champion-card-container');
  container.innerHTML = `
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
      </div>
    </div>`;

  // Result map centered on champion
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

  // Restart button
  document.getElementById('btn-restart').onclick = () => {
    // Reset state
    state.selectedCity     = null;
    state.selectedDistrict = null;
    state.restaurants      = [];
    state.champion         = null;
    state.bracket          = { rounds: [], currentRound: 0, currentMatch: 0, winners: [[]] };

    // Destroy maps so they're recreated fresh
    state.map       = null;
    state.resultMap = null;
    state.markers   = [];

    // Reset dropdowns
    const citySelect     = document.getElementById('city-select');
    const districtSelect = document.getElementById('district-select');
    const btnFind        = document.getElementById('btn-find');
    citySelect.value       = '';
    districtSelect.value   = '';
    districtSelect.disabled = true;
    districtSelect.innerHTML = '<option value="">먼저 시/도를 선택하세요</option>';
    btnFind.disabled = true;

    goToScreen('location');
  };
}

/* ════════════════════════════════════════════════════════════
   BOOTSTRAP
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLocationScreen();
});
