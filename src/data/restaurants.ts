/* ══════════════════════════════════════════════════════════════
   Restaurant data — curated areas
══════════════════════════════════════════════════════════════ */

import type { CuratedArea, CuratedRestaurantSeed, Restaurant, FoodCategoryKey } from '../types/index.ts';
import { PHOTO_POOLS } from './photos.ts';

/* ── Curated area helpers ─────────────────────────────────── */
const _AREA_GRADIENTS = [
  'linear-gradient(135deg,#fef3c7,#fde68a)',
  'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'linear-gradient(135deg,#fee2e2,#fecaca)',
  'linear-gradient(135deg,#eff6ff,#dbeafe)',
  'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
  'linear-gradient(135deg,#ecfdf5,#a7f3d0)',
  'linear-gradient(135deg,#fff7ed,#fed7aa)',
];

const _AREA_EMOJIS: Record<string, string> = { korean: '🍚', japanese: '🍣', chinese: '🥟', western: '🍔' };
const _AREA_CAT_LABEL: Record<string, string> = { korean: '한식', japanese: '일식', chinese: '중식', western: '양식' };

export const CURATED_DATA_VERSION = 11;

export const CURATED_AREAS: Record<string, CuratedArea> = {
  snu: {
    id: 'snu',
    label: '서울대입구역',
    lat: 37.48121,
    lng: 126.952712,
    restaurants: [
      // Korean (13)
      { id: 'snu_k01', name: '구딩이 서울대점',           category: 'korean',   rating: 4.5, reviewCount: 1400, address: '서울 관악구 봉천동 1620-20',              lat: 37.4818, lng: 126.9519, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k02', name: '정숙성',                    category: 'korean',   rating: 4.5, reviewCount: 1100, address: '서울 관악구 봉천동 1603-3',               lat: 37.4808, lng: 126.9528, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k03', name: '충청삼겹',                  category: 'korean',   rating: 4.5, reviewCount: 980,  address: '서울 관악구 봉천동 1612-5',               lat: 37.4813, lng: 126.9524, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k04', name: '청기와타운 서울대점',       category: 'korean',   rating: 4.6, reviewCount: 2100, address: '서울 관악구 봉천동 1600-1',               lat: 37.4810, lng: 126.9526, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k05', name: '진안흙돼지농장',            category: 'korean',   rating: 4.9, reviewCount: 760,  address: '서울 관악구 봉천동 1598-5',               lat: 37.4807, lng: 126.9523, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k06', name: '아우네장터순대국',          category: 'korean',   rating: 4.5, reviewCount: 840,  address: '서울 관악구 봉천동 1666-1',               lat: 37.4824, lng: 126.9533, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'snu_k07', name: '정남옥 서울대입구점',       category: 'korean',   rating: 4.3, reviewCount: 670,  address: '서울 관악구 봉천동 1598-20',              lat: 37.4807, lng: 126.9521, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'snu_k08', name: '만양순대국',                category: 'korean',   rating: 4.2, reviewCount: 590,  address: '서울 관악구 봉천동 458-8',               lat: 37.4820, lng: 126.9498, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'snu_k09', name: '신선설농탕 서울대역점',     category: 'korean',   rating: 4.0, reviewCount: 510,  address: '서울 관악구 봉천동 863-2',               lat: 37.4831, lng: 126.9518, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'snu_k10', name: '왕세숫대야냉면왕돈까스',   category: 'korean',   rating: 4.3, reviewCount: 730,  address: '서울 관악구 봉천동 1572-1',              lat: 37.4804, lng: 126.9507, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'snu_k11', name: '목구뭉 서울대입구역점',     category: 'korean',   rating: 4.3, reviewCount: 860,  address: '서울 관악구 봉천동 1602-4',              lat: 37.4809, lng: 126.9527, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'snu_k12', name: '들깨향밀내음',              category: 'korean',   rating: 4.1, reviewCount: 450,  address: '서울 관악구 관악로 210 2층',             lat: 37.4797, lng: 126.9540, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'snu_k13', name: '우장군 보쌈&족발',          category: 'korean',   rating: 4.2, reviewCount: 620,  address: '서울 관악구 봉천로 487',                 lat: 37.4817, lng: 126.9531, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      // Japanese (13)
      { id: 'snu_j01', name: '텐동요츠야',                category: 'japanese', rating: 4.4, reviewCount: 1680, address: '서울 관악구 관악로14길 35 1층',           lat: 37.4800, lng: 126.9530, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j02', name: '킷사서울',                  category: 'japanese', rating: 4.1, reviewCount: 430,  address: '서울 관악구 남부순환로226길 31 2층',      lat: 37.4806, lng: 126.9521, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j03', name: '동경산책 서울대점',         category: 'japanese', rating: 3.9, reviewCount: 520,  address: '서울 관악구 관악로14길 30 2층',           lat: 37.4799, lng: 126.9529, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j04', name: '카도야라멘',                category: 'japanese', rating: 3.9, reviewCount: 340,  address: '서울 관악구 봉천동 870-13',              lat: 37.4832, lng: 126.9516, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j05', name: '타베루 서울대입구역점',     category: 'japanese', rating: 4.0, reviewCount: 280,  address: '서울 관악구 봉천동 874-8',               lat: 37.4831, lng: 126.9514, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j06', name: '후추스시',                  category: 'japanese', rating: 4.3, reviewCount: 390,  address: '서울 관악구 관악로14길 87 2층',          lat: 37.4802, lng: 126.9538, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j07', name: '스시려',                    category: 'japanese', rating: 4.8, reviewCount: 210,  address: '서울 관악구 봉천로 456 202호',           lat: 37.4816, lng: 126.9530, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j08', name: '상무초밥 서울대입구역점',   category: 'japanese', rating: 4.6, reviewCount: 870,  address: '서울 관악구 관악로 168 1층',             lat: 37.4795, lng: 126.9543, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'snu_j09', name: '닷사서울',                  category: 'japanese', rating: 4.1, reviewCount: 360,  address: '서울 관악구 남부순환로226길 31 2층',      lat: 37.4806, lng: 126.9520, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j10', name: '키라키라쿠라인 샤로수길점', category: 'japanese', rating: 4.2, reviewCount: 480,  address: '서울 관악구 관악로 154-5',               lat: 37.4793, lng: 126.9545, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j11', name: '혼네',                      category: 'japanese', rating: 4.2, reviewCount: 510,  address: '서울 관악구 관악로14길 6-4 1층',         lat: 37.4797, lng: 126.9533, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j12', name: '토크주방',                  category: 'japanese', rating: 4.5, reviewCount: 640,  address: '서울 관악구 관악로12길 97 1층',          lat: 37.4793, lng: 126.9536, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'snu_j13', name: '숙성회136',                 category: 'japanese', rating: 4.3, reviewCount: 720,  address: '서울 관악구 관악로14길 35 지하1층',      lat: 37.4800, lng: 126.9531, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      // Chinese (12)
      { id: 'snu_c01', name: '외래향',                    category: 'chinese',  rating: 4.2, reviewCount: 1100, address: '서울 관악구 봉천동 874-4',               lat: 37.4831, lng: 126.9514, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c02', name: '타이펑',                    category: 'chinese',  rating: 4.7, reviewCount: 1340, address: '서울 관악구 관악로24길 61',              lat: 37.4795, lng: 126.9544, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c03', name: '마부마라탕 샤로수길점',     category: 'chinese',  rating: 4.9, reviewCount: 650,  address: '서울 관악구 봉천동 1604-1',              lat: 37.4809, lng: 126.9529, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c04', name: '쵸리마라탕 샤로수길점',     category: 'chinese',  rating: 4.6, reviewCount: 730,  address: '서울 관악구 봉천동 855-2',               lat: 37.4829, lng: 126.9517, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c05', name: '탕화쿵푸마라탕 서울대입구역점', category: 'chinese', rating: 4.7, reviewCount: 890, address: '서울 관악구 봉천동 1598-18',           lat: 37.4807, lng: 126.9521, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c06', name: '소백양샤브샤브',            category: 'chinese',  rating: 4.3, reviewCount: 540,  address: '서울 관악구 봉천동 860-36',              lat: 37.4826, lng: 126.9518, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c07', name: '충청마라훠궈 2호점',        category: 'chinese',  rating: 4.3, reviewCount: 480,  address: '서울 관악구 봉천동 1611-3',              lat: 37.4813, lng: 126.9524, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c08', name: '성민양꼬치 본점',           category: 'chinese',  rating: 4.4, reviewCount: 920,  address: '서울 관악구 봉천동 1602-37',             lat: 37.4809, lng: 126.9527, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c09', name: '빌리향도삭면',              category: 'chinese',  rating: 4.2, reviewCount: 410,  address: '서울 관악구 봉천동 857-5',               lat: 37.4828, lng: 126.9518, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c10', name: '안동장',                    category: 'chinese',  rating: 4.0, reviewCount: 580,  address: '서울 관악구 봉천동 883-16',              lat: 37.4835, lng: 126.9516, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c11', name: '만리장성',                  category: 'chinese',  rating: 4.5, reviewCount: 670,  address: '서울 관악구 봉천동 1598-21',             lat: 37.4807, lng: 126.9521, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'snu_c12', name: '하이보',                    category: 'chinese',  rating: 4.4, reviewCount: 490,  address: '서울 관악구 봉천동 1597-23',             lat: 37.4806, lng: 126.9522, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      // Western (12)
      { id: 'snu_w01', name: '모힝',                      category: 'western',  rating: 4.2, reviewCount: 560,  address: '서울 관악구 남부순환로226길 36 2층',      lat: 37.4806, lng: 126.9520, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w02', name: '쥬벤쿠바',                  category: 'western',  rating: 4.5, reviewCount: 720,  address: '서울 관악구 관악로14나길 10',             lat: 37.4798, lng: 126.9532, photoPool: PHOTO_POOLS.burger,     photoUrls: [], photoUrl: '' },
      { id: 'snu_w03', name: '피자파쪼',                  category: 'western',  rating: 4.1, reviewCount: 680,  address: '서울 관악구 봉천동 874-6',               lat: 37.4831, lng: 126.9514, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w04', name: '레그나나펠리',              category: 'western',  rating: 4.9, reviewCount: 430,  address: '서울 관악구 봉천동 1603-21',             lat: 37.4808, lng: 126.9528, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w05', name: '클랩피자 샤로수길점',       category: 'western',  rating: 4.7, reviewCount: 580,  address: '서울 관악구 관악로14나길 13 1층',        lat: 37.4799, lng: 126.9533, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w06', name: '포시즌버거',                category: 'western',  rating: 4.5, reviewCount: 490,  address: '서울 관악구 봉천동 1612-10',             lat: 37.4813, lng: 126.9524, photoPool: PHOTO_POOLS.burger,     photoUrls: [], photoUrl: '' },
      { id: 'snu_w07', name: '프레디버거 서울대입구점',   category: 'western',  rating: 4.5, reviewCount: 1040, address: '서울 관악구 남부순환로 1842 1층',         lat: 37.4820, lng: 126.9525, photoPool: PHOTO_POOLS.burger,     photoUrls: [], photoUrl: '' },
      { id: 'snu_w08', name: '파앤피파스타하우스 샤로수길점', category: 'western', rating: 3.9, reviewCount: 320, address: '서울 관악구 남부순환로234길 18 1층',    lat: 37.4812, lng: 126.9530, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w09', name: '이태리파파',                category: 'western',  rating: 4.6, reviewCount: 510,  address: '서울 관악구 봉천동 1598-26',             lat: 37.4807, lng: 126.9522, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w10', name: '캡스 샤로수길점',           category: 'western',  rating: 4.8, reviewCount: 640,  address: '서울 관악구 봉천동 1621-21',             lat: 37.4818, lng: 126.9520, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w11', name: '서울테이블',                category: 'western',  rating: 4.2, reviewCount: 390,  address: '서울 관악구 관악로14길 28 2층',          lat: 37.4799, lng: 126.9529, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'snu_w12', name: '사담',                      category: 'western',  rating: 4.2, reviewCount: 430,  address: '서울 관악구 남부순환로 1852 5층',         lat: 37.4821, lng: 126.9524, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
    ],
  },
  konkuk: {
    id: 'konkuk',
    label: '건대입구역',
    lat: 37.540372,
    lng: 127.069276,
    restaurants: [
      // Korean (13)
      { id: 'kk_k01', name: '육일관 건대본점',          category: 'korean',   rating: 4.2, reviewCount: 580,  address: '서울 광진구 화양동 8-35',            lat: 37.5406, lng: 127.0709, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k02', name: '오일내 건대점',            category: 'korean',   rating: 4.5, reviewCount: 1240, address: '서울 광진구 아차산로31길 29',         lat: 37.5393, lng: 127.0718, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k03', name: '우리소황소곱창 건대점',    category: 'korean',   rating: 4.7, reviewCount: 1870, address: '서울 광진구 동일로22길 17',           lat: 37.5430, lng: 127.0672, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k04', name: '60년전통신촌황소곱창 건대직영점', category: 'korean', rating: 4.6, reviewCount: 1540, address: '서울 광진구 아차산로31길 7',    lat: 37.5392, lng: 127.0720, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k05', name: '만경상회 건대본점',        category: 'korean',   rating: 4.4, reviewCount: 920,  address: '서울 광진구 화양동 49-14',           lat: 37.5418, lng: 127.0723, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k06', name: '정면',                    category: 'korean',   rating: 4.7, reviewCount: 2100, address: '서울 광진구 화양동 32-17',           lat: 37.5409, lng: 127.0735, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'kk_k07', name: '현이네고기국수',          category: 'korean',   rating: 4.3, reviewCount: 760,  address: '서울 광진구 화양동 14-23',           lat: 37.5413, lng: 127.0726, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'kk_k08', name: '선기형닭한마리',          category: 'korean',   rating: 4.2, reviewCount: 680,  address: '서울 광진구 화양동 6-14',            lat: 37.5408, lng: 127.0706, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'kk_k09', name: '화양시장할머니순대국',    category: 'korean',   rating: 3.9, reviewCount: 450,  address: '서울 광진구 자양동 227-136',         lat: 37.5427, lng: 127.0662, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'kk_k10', name: '왕십리정곱창',            category: 'korean',   rating: 4.8, reviewCount: 1320, address: '서울 광진구 능동로19길 5',           lat: 37.5446, lng: 127.0738, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k11', name: '신선술집 도원',           category: 'korean',   rating: 4.7, reviewCount: 1480, address: '서울 광진구 화양동 8-19',            lat: 37.5407, lng: 127.0711, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'kk_k12', name: '상구네솥뚜껑삼겹살',      category: 'korean',   rating: 4.1, reviewCount: 540,  address: '서울 광진구 화양동 18-5',            lat: 37.5416, lng: 127.0719, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'kk_k13', name: '송탄부대찌개',            category: 'korean',   rating: 4.0, reviewCount: 490,  address: '서울 광진구 화양동 6-2',             lat: 37.5405, lng: 127.0703, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      // Japanese (12)
      { id: 'kk_j01', name: '우마이도 건대점',         category: 'japanese', rating: 4.2, reviewCount: 890,  address: '서울 광진구 화양동 3-29',            lat: 37.5400, lng: 127.0705, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j02', name: '초라면',                  category: 'japanese', rating: 4.7, reviewCount: 1650, address: '서울 광진구 화양동 16-28',           lat: 37.5415, lng: 127.0717, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j03', name: '메지 건대점',             category: 'japanese', rating: 4.6, reviewCount: 1230, address: '서울 광진구 화양동 11-1',            lat: 37.5411, lng: 127.0714, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j04', name: '나카노라멘',              category: 'japanese', rating: 4.2, reviewCount: 710,  address: '서울 광진구 화양동 2-30',            lat: 37.5402, lng: 127.0700, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j05', name: '호야초밥참치 본점',       category: 'japanese', rating: 3.9, reviewCount: 1980, address: '서울 광진구 화양동 10-1',            lat: 37.5410, lng: 127.0716, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j06', name: '홍도초밥',                category: 'japanese', rating: 4.5, reviewCount: 1100, address: '서울 광진구 화양동 10-24',           lat: 37.5411, lng: 127.0717, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j07', name: '오사이초밥 건대본점',     category: 'japanese', rating: 4.3, reviewCount: 870,  address: '서울 광진구 화양동 1-16',            lat: 37.5400, lng: 127.0699, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'kk_j08', name: '서울녹업',                category: 'japanese', rating: 4.5, reviewCount: 1340, address: '서울 광진구 화양동 5-35',            lat: 37.5406, lng: 127.0708, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'kk_j09', name: '일양전',                  category: 'japanese', rating: 4.6, reviewCount: 1020, address: '서울 광진구 화양동 8-58',            lat: 37.5408, lng: 127.0712, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'kk_j10', name: '하츠엔',                  category: 'japanese', rating: 4.7, reviewCount: 820,  address: '서울 광진구 자양동 2-13',            lat: 37.5420, lng: 127.0695, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'kk_j11', name: '고베규카츠 건대점',       category: 'japanese', rating: 4.1, reviewCount: 520,  address: '서울 광진구 화양동 3-73',            lat: 37.5402, lng: 127.0706, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'kk_j12', name: '우동가조쿠 건대점',       category: 'japanese', rating: 3.9, reviewCount: 430,  address: '서울 광진구 화양동 499-1',           lat: 37.5423, lng: 127.0731, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      // Chinese (13)
      { id: 'kk_c01', name: '중경식객',                category: 'chinese',  rating: 4.4, reviewCount: 840,  address: '서울 광진구 동일로20길 109',         lat: 37.5465, lng: 127.0685, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c02', name: '송화산시도삭면 본점',     category: 'chinese',  rating: 4.4, reviewCount: 1560, address: '서울 광진구 자양동 6-73',            lat: 37.5432, lng: 127.0676, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c03', name: '송화산시도삭면 2호점',    category: 'chinese',  rating: 4.4, reviewCount: 1280, address: '서울 광진구 자양동 6-63',            lat: 37.5431, lng: 127.0675, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c04', name: '하이디라오 건대점',       category: 'chinese',  rating: 4.5, reviewCount: 3200, address: '서울 광진구 능동로 110',             lat: 37.5442, lng: 127.0745, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c05', name: '송화양꼬치',              category: 'chinese',  rating: 4.4, reviewCount: 1080, address: '서울 광진구 자양동 11-2',            lat: 37.5437, lng: 127.0681, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c06', name: '훈쳔양꼬치',              category: 'chinese',  rating: 4.4, reviewCount: 960,  address: '서울 광진구 자양동 5-26',            lat: 37.5429, lng: 127.0673, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c07', name: '매화반점',                category: 'chinese',  rating: 4.0, reviewCount: 2300, address: '서울 광진구 화양동 49-13',           lat: 37.5419, lng: 127.0723, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c08', name: '한란양꼬치',              category: 'chinese',  rating: 4.3, reviewCount: 740,  address: '서울 광진구 자양동 9-12',            lat: 37.5435, lng: 127.0680, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c09', name: '허씨전통중경마라샹궈',    category: 'chinese',  rating: 4.2, reviewCount: 1140, address: '서울 광진구 동일로20길 83',           lat: 37.5461, lng: 127.0682, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c10', name: '용가회전훠궈 건대점',     category: 'chinese',  rating: 4.3, reviewCount: 870,  address: '서울 광진구 동일로22길 101',         lat: 37.5468, lng: 127.0683, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c11', name: '봉자마라탕',              category: 'chinese',  rating: 3.9, reviewCount: 580,  address: '서울 광진구 자양동 12-5',            lat: 37.5439, lng: 127.0683, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c12', name: '경성양육관',              category: 'chinese',  rating: 4.1, reviewCount: 630,  address: '서울 광진구 자양동 11-12',           lat: 37.5438, lng: 127.0682, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'kk_c13', name: '매운향솥',                category: 'chinese',  rating: 4.1, reviewCount: 720,  address: '서울 광진구 동일로18길 61',           lat: 37.5457, lng: 127.0678, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      // Western (12)
      { id: 'kk_w01', name: '뉴웨이브서울',            category: 'western',  rating: 4.7, reviewCount: 560,  address: '서울 광진구 화양동 5-56',            lat: 37.5406, lng: 127.0709, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w02', name: '탄토탄토',                category: 'western',  rating: 4.7, reviewCount: 490,  address: '서울 광진구 화양동 11-7',            lat: 37.5411, lng: 127.0714, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w03', name: '로니로티 건대점',         category: 'western',  rating: 4.0, reviewCount: 1120, address: '서울 광진구 화양동 7-44',            lat: 37.5408, lng: 127.0711, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w04', name: '호 파스타',               category: 'western',  rating: 4.4, reviewCount: 380,  address: '서울 광진구 화양동 12-52',           lat: 37.5412, lng: 127.0715, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w05', name: '마초쉐프 건대점',         category: 'western',  rating: 4.2, reviewCount: 1680, address: '서울 광진구 화양동 5-3',             lat: 37.5405, lng: 127.0707, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w06', name: '조용한주택',              category: 'western',  rating: 4.4, reviewCount: 420,  address: '서울 광진구 화양동 44-77',           lat: 37.5419, lng: 127.0724, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w07', name: '엘루이 피자 & 펍',        category: 'western',  rating: 4.1, reviewCount: 920,  address: '서울 광진구 아차산로33길 35',         lat: 37.5415, lng: 127.0729, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w08', name: '페르시안걸프',            category: 'western',  rating: 4.0, reviewCount: 760,  address: '서울 광진구 능동로13길 46',           lat: 37.5445, lng: 127.0741, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w09', name: '아웃백스테이크하우스 건대스타시티점', category: 'western', rating: 4.3, reviewCount: 2840, address: '서울 광진구 자양동 227-342', lat: 37.5436, lng: 127.0762, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w10', name: '버거링 건대입구역점',     category: 'western',  rating: 4.5, reviewCount: 670,  address: '서울 광진구 화양동 7-3',             lat: 37.5407, lng: 127.0710, photoPool: PHOTO_POOLS.burger,     photoUrls: [], photoUrl: '' },
      { id: 'kk_w11', name: '매드포갈릭 건대스타시티점', category: 'western', rating: 4.2, reviewCount: 1950, address: '서울 광진구 자양동 227-342',       lat: 37.5436, lng: 127.0762, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'kk_w12', name: '드로잉레시피',            category: 'western',  rating: 4.5, reviewCount: 580,  address: '서울 광진구 자양동 533-4',           lat: 37.5428, lng: 127.0758, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
    ],
  },
  hongdae: {
    id: 'hongdae',
    label: '홍대입구역',
    lat: 37.557527,
    lng: 126.924467,
    restaurants: [
      // Korean (13)
      { id: 'hd_k01', name: '401정육식당',               category: 'korean',   rating: 4.4, reviewCount: 2200, address: '서울 마포구 서교동 395-166',              lat: 37.5541, lng: 126.9218, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k02', name: '돼지저금통 홍대본점',       category: 'korean',   rating: 4.2, reviewCount: 1800, address: '서울 마포구 와우산로21길 19-18',          lat: 37.5548, lng: 126.9263, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k03', name: '목구멍 홍대입구역점',       category: 'korean',   rating: 4.3, reviewCount: 1500, address: '서울 마포구 어울마당로 118',              lat: 37.5570, lng: 126.9230, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k04', name: '산굼부리',                  category: 'korean',   rating: 4.5, reviewCount: 1200, address: '서울 마포구 와우산로29길 48',             lat: 37.5555, lng: 126.9270, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'hd_k05', name: '오우 연남점',               category: 'korean',   rating: 4.6, reviewCount: 980,  address: '서울 마포구 연남로1길 39',                lat: 37.5608, lng: 126.9235, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'hd_k06', name: '솔솥 연남점',               category: 'korean',   rating: 4.5, reviewCount: 870,  address: '서울 마포구 동교로38길 35',               lat: 37.5620, lng: 126.9248, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'hd_k07', name: '수작반상',                  category: 'korean',   rating: 4.3, reviewCount: 760,  address: '서울 마포구 와우산로 94',                 lat: 37.5538, lng: 126.9251, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'hd_k08', name: '서강식당',                  category: 'korean',   rating: 4.1, reviewCount: 640,  address: '서울 마포구 어울마당로 92',               lat: 37.5558, lng: 126.9225, photoPool: PHOTO_POOLS.kalguksu,   photoUrls: [], photoUrl: '' },
      { id: 'hd_k09', name: '솥돈',                      category: 'korean',   rating: 4.4, reviewCount: 820,  address: '서울 마포구 연남로 59',                   lat: 37.5615, lng: 126.9228, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k10', name: '천사곱창 홍대점',           category: 'korean',   rating: 4.2, reviewCount: 1100, address: '서울 마포구 와우산로21길 20',             lat: 37.5549, lng: 126.9264, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k11', name: '국제식당 홍대점',           category: 'korean',   rating: 4.3, reviewCount: 950,  address: '서울 마포구 홍익로6길 22',               lat: 37.5565, lng: 126.9243, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k12', name: '노루목황소곱창',            category: 'korean',   rating: 4.4, reviewCount: 680,  address: '서울 마포구 와우산로 35',                 lat: 37.5530, lng: 126.9255, photoPool: PHOTO_POOLS.koreanBbq,  photoUrls: [], photoUrl: '' },
      { id: 'hd_k13', name: '배꼽시계',                  category: 'korean',   rating: 4.0, reviewCount: 520,  address: '서울 마포구 연남로1길 26',                lat: 37.5606, lng: 126.9232, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      // Japanese (13)
      { id: 'hd_j01', name: '스시지현',                  category: 'japanese', rating: 4.7, reviewCount: 1400, address: '서울 마포구 와우산로 48',                 lat: 37.5535, lng: 126.9250, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j02', name: '기요한',                    category: 'japanese', rating: 4.6, reviewCount: 1200, address: '서울 마포구 서교동 358-22',               lat: 37.5558, lng: 126.9210, photoPool: PHOTO_POOLS.sushi,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j03', name: '멘야산다이메',              category: 'japanese', rating: 4.5, reviewCount: 1600, address: '서울 마포구 홍익로5안길 24',              lat: 37.5572, lng: 126.9247, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j04', name: '하쿠텐라멘',                category: 'japanese', rating: 4.4, reviewCount: 980,  address: '서울 마포구 양화로16길 16',               lat: 37.5559, lng: 126.9199, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j05', name: '지로우라멘',                category: 'japanese', rating: 4.3, reviewCount: 870,  address: '서울 마포구 와우산로29나길 17',           lat: 37.5552, lng: 126.9268, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j06', name: '오자와',                    category: 'japanese', rating: 4.5, reviewCount: 750,  address: '서울 마포구 잔다리로 15',                 lat: 37.5545, lng: 126.9205, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'hd_j07', name: '하카타나카',                category: 'japanese', rating: 4.2, reviewCount: 620,  address: '서울 마포구 와우산로21길 38',             lat: 37.5551, lng: 126.9267, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'hd_j08', name: '요쇼쿠야코우',              category: 'japanese', rating: 4.4, reviewCount: 540,  address: '서울 마포구 와우산로 94',                 lat: 37.5539, lng: 126.9252, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'hd_j09', name: '겐로쿠우동',                category: 'japanese', rating: 4.3, reviewCount: 480,  address: '서울 마포구 홍익로3길 20',               lat: 37.5567, lng: 126.9239, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j10', name: '우동카덴',                  category: 'japanese', rating: 4.1, reviewCount: 430,  address: '서울 마포구 어울마당로 108',              lat: 37.5566, lng: 126.9228, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j11', name: '츠케루',                    category: 'japanese', rating: 4.3, reviewCount: 380,  address: '서울 마포구 와우산로19길 9',              lat: 37.5543, lng: 126.9259, photoPool: PHOTO_POOLS.ramen,      photoUrls: [], photoUrl: '' },
      { id: 'hd_j12', name: '테즈쿠리',                  category: 'japanese', rating: 4.2, reviewCount: 350,  address: '서울 마포구 홍익로5안길 32',              lat: 37.5573, lng: 126.9249, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      { id: 'hd_j13', name: '고베규카츠 홍대점',         category: 'japanese', rating: 4.4, reviewCount: 920,  address: '서울 마포구 양화로 160',                  lat: 37.5561, lng: 126.9201, photoPool: PHOTO_POOLS.yakitori,   photoUrls: [], photoUrl: '' },
      // Chinese (12)
      { id: 'hd_c01', name: '동보성',                    category: 'chinese',  rating: 4.3, reviewCount: 1300, address: '서울 마포구 서교동 395-52',               lat: 37.5543, lng: 126.9220, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c02', name: '풍태',                      category: 'chinese',  rating: 4.2, reviewCount: 1100, address: '서울 마포구 마포대로14길 22',             lat: 37.5520, lng: 126.9280, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c03', name: '진진',                      category: 'chinese',  rating: 4.1, reviewCount: 880,  address: '서울 마포구 와우산로 56',                 lat: 37.5537, lng: 126.9248, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c04', name: '초마',                      category: 'chinese',  rating: 4.4, reviewCount: 760,  address: '서울 마포구 서교동 364-16',               lat: 37.5555, lng: 126.9214, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c05', name: '중화복춘',                  category: 'chinese',  rating: 4.3, reviewCount: 650,  address: '서울 마포구 와우산로29길 18',             lat: 37.5553, lng: 126.9266, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c06', name: '하이디라오 홍대점',         category: 'chinese',  rating: 4.2, reviewCount: 2800, address: '서울 마포구 양화로 152',                  lat: 37.5560, lng: 126.9195, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c07', name: '신룽푸마라탕 홍대점',       category: 'chinese',  rating: 4.5, reviewCount: 940,  address: '서울 마포구 어울마당로 52',               lat: 37.5555, lng: 126.9222, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c08', name: '티엔미미 홍대',             category: 'chinese',  rating: 4.4, reviewCount: 720,  address: '서울 마포구 양화로 186',                  lat: 37.5565, lng: 126.9205, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c09', name: '연교',                      category: 'chinese',  rating: 4.5, reviewCount: 580,  address: '서울 마포구 연남로 57',                   lat: 37.5613, lng: 126.9230, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c10', name: '몽중식',                    category: 'chinese',  rating: 4.3, reviewCount: 490,  address: '서울 마포구 연남로1길 54',                lat: 37.5612, lng: 126.9238, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c11', name: '손오공마라탕',              category: 'chinese',  rating: 4.6, reviewCount: 820,  address: '서울 마포구 홍익로6길 30',               lat: 37.5568, lng: 126.9244, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      { id: 'hd_c12', name: '진화쿵푸마라탕 홍대본점',   category: 'chinese',  rating: 4.2, reviewCount: 670,  address: '서울 마포구 서교동 346-25',               lat: 37.5550, lng: 126.9208, photoPool: PHOTO_POOLS.chinese,    photoUrls: [], photoUrl: '' },
      // Western (12)
      { id: 'hd_w01', name: '레이몬드',                  category: 'western',  rating: 4.7, reviewCount: 1500, address: '서울 마포구 와우산로29길 22',             lat: 37.5554, lng: 126.9267, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w02', name: '스파카나폴리',              category: 'western',  rating: 4.5, reviewCount: 2200, address: '서울 마포구 와우산로 42',                 lat: 37.5533, lng: 126.9254, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w03', name: '카멜로 연남',               category: 'western',  rating: 4.5, reviewCount: 980,  address: '서울 마포구 연남로 35',                   lat: 37.5605, lng: 126.9225, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w04', name: '파델라',                    category: 'western',  rating: 4.7, reviewCount: 860,  address: '서울 마포구 홍익로3길 34',               lat: 37.5569, lng: 126.9241, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w05', name: '랑트 연남',                 category: 'western',  rating: 4.3, reviewCount: 750,  address: '서울 마포구 연남로1길 17',                lat: 37.5604, lng: 126.9230, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w06', name: '메종브리크',                category: 'western',  rating: 4.6, reviewCount: 680,  address: '서울 마포구 서교동 365-20',               lat: 37.5556, lng: 126.9215, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w07', name: '알척',                      category: 'western',  rating: 4.4, reviewCount: 520,  address: '서울 마포구 연남동 228-15',               lat: 37.5618, lng: 126.9242, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w08', name: '헤이죠지',                  category: 'western',  rating: 4.3, reviewCount: 1200, address: '서울 마포구 양화로 124',                  lat: 37.5557, lng: 126.9192, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w09', name: '플롭 연남',                 category: 'western',  rating: 4.7, reviewCount: 640,  address: '서울 마포구 연남로3길 22',                lat: 37.5610, lng: 126.9233, photoPool: PHOTO_POOLS.pizza,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w10', name: '비스트로주',                category: 'western',  rating: 4.4, reviewCount: 570,  address: '서울 마포구 서교동 399-24',               lat: 37.5545, lng: 126.9222, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
      { id: 'hd_w11', name: '알페로',                    category: 'western',  rating: 4.3, reviewCount: 480,  address: '서울 마포구 와우산로 94',                 lat: 37.5539, lng: 126.9253, photoPool: PHOTO_POOLS.burger,     photoUrls: [], photoUrl: '' },
      { id: 'hd_w12', name: '오스테리아오라',            category: 'western',  rating: 4.5, reviewCount: 410,  address: '서울 마포구 연남동 566-55',               lat: 37.5622, lng: 126.9245, photoPool: PHOTO_POOLS.pasta,      photoUrls: [], photoUrl: '' },
    ],
  },
  gangnam: {
    id: 'gangnam',
    label: '강남역',
    lat: 37.497952,
    lng: 127.027619,
    restaurants: [
      // Korean (13)
      { id: 'gn_k01', name: '1992 덮밥&짜글이 강남본점',                    category: 'korean',    rating: 4.3,  reviewCount: 1400,  address: '서울 강남구 역삼동 824-11',                               lat: 37.4985, lng: 127.0283, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'gn_k02', name: '소뭉집 본점',                              category: 'korean',    rating: 4.5,  reviewCount: 1100,  address: '서울 강남구 역삼동 832-3',                                lat: 37.4988, lng: 127.0290, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k03', name: '무월식탁',                                category: 'korean',    rating: 4.2,  reviewCount: 870,   address: '서울 강남구 강남대로102길 23',                              lat: 37.4963, lng: 127.0299, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'gn_k04', name: '강남불백 1호점',                            category: 'korean',    rating: 4.1,  reviewCount: 920,   address: '서울 강남구 역삼동 814-4',                                lat: 37.4991, lng: 127.0271, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k05', name: '호보식당',                                category: 'korean',    rating: 4.4,  reviewCount: 780,   address: '서울 강남구 역삼동 678-20',                               lat: 37.4995, lng: 127.0310, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k06', name: '팔백집',                                 category: 'korean',    rating: 4.3,  reviewCount: 1050,  address: '서울 강남구 강남대로94길 21',                               lat: 37.4970, lng: 127.0289, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k07', name: '육전식당',                                category: 'korean',    rating: 4.5,  reviewCount: 680,   address: '서울 강남구 역삼동 825-7',                                lat: 37.4982, lng: 127.0278, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k08', name: '돝고기506',                              category: 'korean',    rating: 4.3,  reviewCount: 740,   address: '서울 강남구 역삼동 826-37',                               lat: 37.4986, lng: 127.0295, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k09', name: '고기꾼 김춘배',                             category: 'korean',    rating: 4.3,  reviewCount: 650,   address: '서울 강남구 강남대로96길 17',                               lat: 37.4975, lng: 127.0285, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'gn_k10', name: '모아 강남',                               category: 'korean',    rating: 4.2,  reviewCount: 560,   address: '서울 강남구 강남대로98길 12',                               lat: 37.4968, lng: 127.0281, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'gn_k11', name: '봉된장',                                 category: 'korean',    rating: 4.1,  reviewCount: 490,   address: '서울 강남구 역삼동 824-18',                               lat: 37.4984, lng: 127.0276, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'gn_k12', name: '전주식당',                                category: 'korean',    rating: 4.6,  reviewCount: 520,   address: '서울 강남구 테헤란로1길 38',                                lat: 37.4990, lng: 127.0265, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'gn_k13', name: '시골야채된장',                              category: 'korean',    rating: 4.2,  reviewCount: 430,   address: '서울 강남구 역삼동 831-42',                               lat: 37.4978, lng: 127.0292, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      // Japanese (13)
      { id: 'gn_j01', name: '갓덴스시',                                category: 'japanese',  rating: 4.1,  reviewCount: 1680,  address: '서울 강남구 테헤란로 109',                                 lat: 37.4992, lng: 127.0298, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'gn_j02', name: '스시마이우',                               category: 'japanese',  rating: 4.3,  reviewCount: 1420,  address: '서울 강남구 역삼동 825-22',                               lat: 37.4985, lng: 127.0280, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'gn_j03', name: '오레노라멘 강남점',                           category: 'japanese',  rating: 4.4,  reviewCount: 1200,  address: '서울 강남구 역삼동 824-26',                               lat: 37.4983, lng: 127.0275, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'gn_j04', name: '멘노아지 강남본점',                           category: 'japanese',  rating: 4.4,  reviewCount: 980,   address: '서울 강남구 테헤란로4길 38',                                lat: 37.4989, lng: 127.0287, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'gn_j05', name: '나에코',                                 category: 'japanese',  rating: 4.3,  reviewCount: 870,   address: '서울 서초구 서초대로75길 45',                               lat: 37.4971, lng: 127.0264, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'gn_j06', name: '센야 본점',                               category: 'japanese',  rating: 4.1,  reviewCount: 760,   address: '서울 강남구 역삼로9길 25',                                 lat: 37.4994, lng: 127.0306, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'gn_j07', name: '이자카야 열',                              category: 'japanese',  rating: 4.5,  reviewCount: 650,   address: '서울 강남구 역삼동 832-8',                                lat: 37.4987, lng: 127.0291, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'gn_j08', name: '닌스시',                                 category: 'japanese',  rating: 4.2,  reviewCount: 540,   address: '서울 강남구 강남대로94길 15',                               lat: 37.4972, lng: 127.0286, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'gn_j09', name: '초이다이닝 강남점',                           category: 'japanese',  rating: 4,    reviewCount: 820,   address: '서울 강남구 강남대로96길 23',                               lat: 37.4976, lng: 127.0282, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'gn_j10', name: '우동명가 기리야마',                           category: 'japanese',  rating: 4.3,  reviewCount: 710,   address: '서울 강남구 역삼동 826-15',                               lat: 37.4980, lng: 127.0293, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'gn_j11', name: '태양의토마토라멘 강남점',                        category: 'japanese',  rating: 4.4,  reviewCount: 590,   address: '서울 강남구 역삼동 814-8',                                lat: 37.4990, lng: 127.0269, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'gn_j12', name: '오레노카츠 강남역점',                          category: 'japanese',  rating: 4.2,  reviewCount: 480,   address: '서울 강남구 역삼동 825-30',                               lat: 37.4984, lng: 127.0277, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'gn_j13', name: '감탄성신',                                category: 'japanese',  rating: 4.1,  reviewCount: 420,   address: '서울 강남구 강남대로102길 15',                              lat: 37.4965, lng: 127.0297, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      // Chinese (12)
      { id: 'gn_c01', name: '초선과여포',                               category: 'chinese',   rating: 4.5,  reviewCount: 1350,  address: '서울 서초구 서초대로78길 44',                               lat: 37.4969, lng: 127.0260, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c02', name: '사천루',                                 category: 'chinese',   rating: 4.3,  reviewCount: 1100,  address: '서울 강남구 역삼동 832-15',                               lat: 37.4988, lng: 127.0294, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c03', name: '일일향',                                 category: 'chinese',   rating: 4.1,  reviewCount: 950,   address: '서울 강남구 역삼동 824-5',                                lat: 37.4986, lng: 127.0281, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c04', name: '삼성각',                                 category: 'chinese',   rating: 4.2,  reviewCount: 870,   address: '서울 강남구 역삼동 826-22',                               lat: 37.4981, lng: 127.0288, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c05', name: '홍보각',                                 category: 'chinese',   rating: 4.4,  reviewCount: 780,   address: '서울 서초구 서초대로77길 3',                                lat: 37.4966, lng: 127.0258, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c06', name: '중경마라탕 강남역점',                          category: 'chinese',   rating: 4.2,  reviewCount: 720,   address: '서울 강남구 테헤란로1길 44',                                lat: 37.4991, lng: 127.0267, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c07', name: '라공방 강남역본점',                           category: 'chinese',   rating: 4.3,  reviewCount: 660,   address: '서울 강남구 테헤란로4길 6',                                 lat: 37.4989, lng: 127.0284, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c08', name: '하이디라오 강남점',                           category: 'chinese',   rating: 4.4,  reviewCount: 2200,  address: '서울 강남구 강남대로 396',                                 lat: 37.4974, lng: 127.0275, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c09', name: '용가훠궈 강남점',                            category: 'chinese',   rating: 4.1,  reviewCount: 580,   address: '서울 강남구 역삼동 814-12',                               lat: 37.4992, lng: 127.0270, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c10', name: '훠궈나라 강남점',                            category: 'chinese',   rating: 4,    reviewCount: 490,   address: '서울 강남구 강남대로94길 9',                                lat: 37.4973, lng: 127.0290, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c11', name: '무한숯불양꼬치 강남본점',                        category: 'chinese',   rating: 4.1,  reviewCount: 630,   address: '서울 강남구 역삼동 825-15',                               lat: 37.4983, lng: 127.0279, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'gn_c12', name: '따롱이훠궈 강남점',                           category: 'chinese',   rating: 4.2,  reviewCount: 550,   address: '서울 강남구 강남대로96길 8',                                lat: 37.4977, lng: 127.0283, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      // Western (12)
      { id: 'gn_w01', name: '바비레드 강남본점',                           category: 'western',   rating: 4.3,  reviewCount: 1500,  address: '서울 강남구 봉은사로6길 39',                                lat: 37.4968, lng: 127.0305, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w02', name: '매드포갈릭 강남점',                           category: 'western',   rating: 4.1,  reviewCount: 1800,  address: '서울 강남구 강남대로 396',                                 lat: 37.4975, lng: 127.0276, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w03', name: '라그릴리아 강남점',                           category: 'western',   rating: 4.2,  reviewCount: 980,   address: '서울 강남구 강남대로 374',                                 lat: 37.4972, lng: 127.0280, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w04', name: '도치피자 강남점',                            category: 'western',   rating: 4.4,  reviewCount: 870,   address: '서울 강남구 역삼동 824-32',                               lat: 37.4984, lng: 127.0273, photoPool: PHOTO_POOLS.pizza, photoUrls: [], photoUrl: '' },
      { id: 'gn_w05', name: '을지다락 강남',                             category: 'western',   rating: 4,    reviewCount: 720,   address: '서울 강남구 역삼동 826-10',                               lat: 37.4982, lng: 127.0291, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w06', name: '마녀주방 강남점',                            category: 'western',   rating: 4.1,  reviewCount: 640,   address: '서울 강남구 강남대로94길 18',                               lat: 37.4971, lng: 127.0288, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w07', name: '로리스더프라임립',                            category: 'western',   rating: 4.5,  reviewCount: 2100,  address: '서울 서초구 서초대로 411',                                 lat: 37.4960, lng: 127.0266, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'gn_w08', name: '헤비스테이크 강남점',                          category: 'western',   rating: 4.2,  reviewCount: 760,   address: '서울 강남구 역삼동 831-38',                               lat: 37.4979, lng: 127.0296, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'gn_w09', name: '파이브가이즈 강남점',                          category: 'western',   rating: 4.2,  reviewCount: 1350,  address: '서울 강남구 강남대로 382',                                 lat: 37.4970, lng: 127.0278, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'gn_w10', name: '바스버거 강남점',                            category: 'western',   rating: 4.6,  reviewCount: 890,   address: '서울 강남구 역삼동 825-18',                               lat: 37.4985, lng: 127.0278, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'gn_w11', name: '리에또',                                 category: 'western',   rating: 4.4,  reviewCount: 530,   address: '서울 강남구 역삼동 678-15',                               lat: 37.4996, lng: 127.0308, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'gn_w12', name: '더플라잉팬레드',                             category: 'western',   rating: 4.3,  reviewCount: 620,   address: '서울 서초구 서초대로78길 42',                               lat: 37.4961, lng: 127.0267, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
    ],
  },
  sookmyung: {
    id: 'sookmyung',
    label: '숙대입구역',
    lat: 37.545134,
    lng: 126.971957,
    restaurants: [
      // Korean (13)
      { id: 'sm_k01', name: '한강로칼국수',                             category: 'korean',    rating: 4.8,  reviewCount: 673,   address: '서울 용산구 두텁바위로 9',                                 lat: 37.5454, lng: 126.9731, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'sm_k02', name: '뼈탄집 용산 직영점',                        category: 'korean',    rating: 5,    reviewCount: 449,   address: '서울 용산구 백범로99길 62',                                lat: 37.5358, lng: 126.9729, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k03', name: '원할머니보쌈 남영점',                        category: 'korean',    rating: 3.9,  reviewCount: 43,    address: '서울 용산구 한강대로 254',                                 lat: 37.5410, lng: 126.9734, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      { id: 'sm_k04', name: '문배동육칼 본점',                           category: 'korean',    rating: 4.1,  reviewCount: 1533,  address: '서울 용산구 백범로90길 50',                                lat: 37.5366, lng: 126.9703, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'sm_k05', name: '일미집',                                 category: 'korean',    rating: 4.2,  reviewCount: 1253,  address: '서울 용산구 후암로 1-1',                                   lat: 37.5461, lng: 126.9783, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'sm_k06', name: '선명 구이가',                              category: 'korean',    rating: 4.2,  reviewCount: 155,   address: '서울 용산구 두텁바위로 81-2',                               lat: 37.5468, lng: 126.9809, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k08', name: '초원',                                   category: 'korean',    rating: 4.6,  reviewCount: 611,   address: '서울 용산구 남영동 80-4',                                  lat: 37.5427, lng: 126.9733, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k09', name: '한촌설렁탕 용산동자점',                        category: 'korean',    rating: 4.4,  reviewCount: 980,   address: '서울 용산구 한강대로 361',                                 lat: 37.5506, lng: 126.9717, photoPool: PHOTO_POOLS.kalguksu, photoUrls: [], photoUrl: '' },
      { id: 'sm_k10', name: '돈수백 서울역점',                           category: 'korean',    rating: 4.1,  reviewCount: 83,    address: '서울 용산구 후암로 107',                                   lat: 37.5534, lng: 126.9734, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k11', name: '조대포',                                 category: 'korean',    rating: 4.4,  reviewCount: 795,   address: '서울 용산구 한강대로 272-1',                               lat: 37.5426, lng: 126.9729, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k12', name: '남영돈',                                 category: 'korean',    rating: 4.4,  reviewCount: 767,   address: '서울 용산구 한강대로80길 17',                               lat: 37.5428, lng: 126.9738, photoPool: PHOTO_POOLS.koreanBbq, photoUrls: [], photoUrl: '' },
      { id: 'sm_k13', name: '봉추찜닭 숙대점',                           category: 'korean',    rating: 4.4,  reviewCount: 100,   address: '서울 용산구 청파로45길 13',                                lat: 37.5442, lng: 126.9698, photoPool: PHOTO_POOLS.dakhanmari, photoUrls: [], photoUrl: '' },
      // Japanese (13)
      { id: 'sm_j01', name: '단박왕돈까스',                             category: 'japanese',  rating: 4.1,  reviewCount: 1063,  address: '서울 용산구 문배동 11-29',                                 lat: 37.5378, lng: 126.9704, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'sm_j02', name: '이춘복참치 용산본점',                        category: 'japanese',  rating: 3.9,  reviewCount: 1314,  address: '서울 용산구 남영동 85-1',                                  lat: 37.5421, lng: 126.9732, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'sm_j03', name: '마구로',                                 category: 'japanese',  rating: 4.5,  reviewCount: 284,   address: '서울 용산구 한강대로 271',                                 lat: 37.5424, lng: 126.9724, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'sm_j04', name: '시후쿠 삼각지점',                           category: 'japanese',  rating: 4.3,  reviewCount: 348,   address: '서울 용산구 백범로99길 46',                                lat: 37.5361, lng: 126.9720, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'sm_j05', name: '긴자료코 숙대점',                           category: 'japanese',  rating: 4.4,  reviewCount: 90,    address: '서울 용산구 청파동3가 107-1',                               lat: 37.5445, lng: 126.9683, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'sm_j06', name: '산카이 숙대입구점',                          category: 'japanese',  rating: 4.1,  reviewCount: 125,   address: '서울 용산구 한강대로 292',                                 lat: 37.5457, lng: 126.9708, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'sm_j07', name: '모코시야',                                category: 'japanese',  rating: 4.1,  reviewCount: 315,   address: '서울 용산구 백범로87길 50-1',                               lat: 37.5394, lng: 126.9694, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'sm_j08', name: '멘타미',                                 category: 'japanese',  rating: 4.5,  reviewCount: 117,   address: '서울 용산구 한강대로76길 9',                                lat: 37.5416, lng: 126.9736, photoPool: PHOTO_POOLS.ramen, photoUrls: [], photoUrl: '' },
      { id: 'sm_j09', name: '타케모토',                                category: 'japanese',  rating: 4.5,  reviewCount: 109,   address: '서울 용산구 두텁바위로 61',                                 lat: 37.5462, lng: 126.9791, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'sm_j10', name: '유키사키',                                category: 'japanese',  rating: 4.3,  reviewCount: 134,   address: '서울 용산구 동자동 35-141',                                lat: 37.5512, lng: 126.9741, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      { id: 'sm_j11', name: '키움참치',                                category: 'japanese',  rating: 4.3,  reviewCount: 130,   address: '서울 용산구 청파동3가 24-4',                                lat: 37.5440, lng: 126.9704, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'sm_j12', name: '네코노스시',                              category: 'japanese',  rating: 4.7,  reviewCount: 81,    address: '서울 용산구 청파로47나길 8',                                lat: 37.5452, lng: 126.9671, photoPool: PHOTO_POOLS.sushi, photoUrls: [], photoUrl: '' },
      { id: 'sm_j13', name: '이자와 숙대점',                            category: 'japanese',  rating: 4.4,  reviewCount: 109,   address: '서울 용산구 청파동3가 71-40',                               lat: 37.5445, lng: 126.9684, photoPool: PHOTO_POOLS.yakitori, photoUrls: [], photoUrl: '' },
      // Chinese (12)
      { id: 'sm_c01', name: '탕화쿵푸 숙대점',                           category: 'chinese',   rating: 4.5,  reviewCount: 1200,  address: '서울 용산구 청파동2가 63-21',                               lat: 37.5451, lng: 126.9662, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c02', name: '홍콩반점0410 용산문배점',                     category: 'chinese',   rating: 3.9,  reviewCount: 766,   address: '서울 용산구 백범로90길 38',                                lat: 37.5367, lng: 126.9695, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c03', name: '정',                                     category: 'chinese',   rating: 4.1,  reviewCount: 466,   address: '서울 용산구 청파동2가 67-6',                                lat: 37.5450, lng: 126.9670, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c04', name: '명화원',                                 category: 'chinese',   rating: 4.1,  reviewCount: 416,   address: '서울 용산구 한강로1가 14-28',                               lat: 37.5363, lng: 126.9746, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c05', name: '화양연가 1호점',                           category: 'chinese',   rating: 4.4,  reviewCount: 219,   address: '서울 용산구 한강대로76길 5',                                lat: 37.5416, lng: 126.9734, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c06', name: '동천홍',                                 category: 'chinese',   rating: 4.1,  reviewCount: 317,   address: '서울 용산구 두텁바위로 69',                                 lat: 37.5462, lng: 126.9799, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c07', name: '태향',                                   category: 'chinese',   rating: 3.9,  reviewCount: 385,   address: '서울 용산구 후암로57길 3-10',                               lat: 37.5532, lng: 126.9747, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c08', name: '태양 용산점',                              category: 'chinese',   rating: 4.4,  reviewCount: 168,   address: '서울 용산구 백범로99길 54',                                lat: 37.5359, lng: 126.9725, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c09', name: '신룽푸마라탕',                             category: 'chinese',   rating: 4.4,  reviewCount: 530,   address: '서울 용산구 청파동3가 111-58',                              lat: 37.5446, lng: 126.9669, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c10', name: '덕순루',                                 category: 'chinese',   rating: 4.3,  reviewCount: 138,   address: '서울 용산구 남영동 80-2',                                  lat: 37.5427, lng: 126.9735, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c11', name: '홍짜장 서울역점',                           category: 'chinese',   rating: 3.8,  reviewCount: 222,   address: '서울 용산구 한강대로 361',                                 lat: 37.5503, lng: 126.9736, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      { id: 'sm_c12', name: '경성양꼬치구이',                            category: 'chinese',   rating: 4.1,  reviewCount: 144,   address: '서울 용산구 청파로47길 8',                                 lat: 37.5436, lng: 126.9705, photoPool: PHOTO_POOLS.chinese, photoUrls: [], photoUrl: '' },
      // Western (12)
      { id: 'sm_w01', name: '바스버거 후암점',                           category: 'western',   rating: 4.4,  reviewCount: 723,   address: '서울 용산구 동자동 23-30',                                 lat: 37.5502, lng: 126.9740, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w02', name: '맘스터치 숙명여대점',                        category: 'western',   rating: 3.9,  reviewCount: 61,    address: '서울 용산구 청파동2가 64-15',                               lat: 37.5449, lng: 126.9660, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w03', name: '버거인',                                 category: 'western',   rating: 4.4,  reviewCount: 547,   address: '서울 용산구 청파로43길 12',                                lat: 37.5437, lng: 126.9700, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w04', name: '도미노피자 후암점',                          category: 'western',   rating: 4.2,  reviewCount: 45,    address: '서울 용산구 두텁바위로 13',                                 lat: 37.5455, lng: 126.9739, photoPool: PHOTO_POOLS.pizza, photoUrls: [], photoUrl: '' },
      { id: 'sm_w05', name: '살팀보카',                                category: 'western',   rating: 4.5,  reviewCount: 87,    address: '서울 용산구 한강대로76길 11-36',                            lat: 37.5423, lng: 126.9737, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
      { id: 'sm_w06', name: '나폴리키친',                              category: 'western',   rating: 4,    reviewCount: 193,   address: '서울 용산구 청파동3가 24-64',                               lat: 37.5443, lng: 126.9689, photoPool: PHOTO_POOLS.pizza, photoUrls: [], photoUrl: '' },
      { id: 'sm_w07', name: '롯데리아 숙대입구역점',                       category: 'western',   rating: 3.8,  reviewCount: 633,   address: '서울 용산구 한강대로 283',                                 lat: 37.5435, lng: 126.9721, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w08', name: '레이브피자',                              category: 'western',   rating: 4.9,  reviewCount: 140,   address: '서울 용산구 청파로43길 7',                                 lat: 37.5435, lng: 126.9702, photoPool: PHOTO_POOLS.pizza, photoUrls: [], photoUrl: '' },
      { id: 'sm_w10', name: 'KFC 숙대입구점',                           category: 'western',   rating: 4,    reviewCount: 261,   address: '서울 용산구 한강대로 297',                                 lat: 37.5448, lng: 126.9717, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w11', name: '프랭크버거 숙대점',                          category: 'western',   rating: 4.5,  reviewCount: 22,    address: '서울 용산구 청파로47길 52',                                lat: 37.5450, lng: 126.9676, photoPool: PHOTO_POOLS.burger, photoUrls: [], photoUrl: '' },
      { id: 'sm_w12', name: '와플하우스',                              category: 'western',   rating: 4.2,  reviewCount: 620,   address: '서울 용산구 청파로45길 37',                                lat: 37.5445, lng: 126.9686, photoPool: PHOTO_POOLS.pasta, photoUrls: [], photoUrl: '' },
    ],
  },
};

/**
 * Returns raw curated seed data for admin editing (not converted to Restaurant).
 */
export function getCuratedDataRaw(areaId: string): CuratedRestaurantSeed[] {
  const area = CURATED_AREAS[areaId];
  if (!area) return [];

  const seedMap: Record<string, CuratedRestaurantSeed> = {};
  area.restaurants.forEach(r => { seedMap[r.id] = r; });

  try {
    const stored = JSON.parse(localStorage.getItem('pickit_curated_data') || '{}');
    if (stored[areaId]?.restaurants?.length && stored._version === CURATED_DATA_VERSION) {
      return stored[areaId].restaurants.map((r: CuratedRestaurantSeed) => {
        const seed = seedMap[r.id];
        return { ...r, photoPool: seed?.photoPool || [] };
      });
    }
  } catch (_e) {}

  return JSON.parse(JSON.stringify(area.restaurants));
}

/**
 * Saves curated restaurant data to localStorage (strips photoPool).
 */
export function saveCuratedData(areaId: string, restaurants: CuratedRestaurantSeed[]): void {
  try {
    const stored = JSON.parse(localStorage.getItem('pickit_curated_data') || '{}');
    const toSave = restaurants.map(({ photoPool, ...rest }) => rest);
    stored[areaId] = { restaurants: toSave };
    stored._version = CURATED_DATA_VERSION;
    localStorage.setItem('pickit_curated_data', JSON.stringify(stored));
  } catch (e) {
    console.warn('Failed to save curated data:', e);
  }
  // Sync to KV (fire-and-forget)
  import('../services/kvStorage.ts').then(m => m.saveAreaToKV(areaId, restaurants)).catch(() => {});
}

/**
 * Returns the curated restaurants for an area, merging any localStorage edits.
 */
export function getCuratedRestaurants(areaId: string): Restaurant[] {
  const area = CURATED_AREAS[areaId];
  if (!area) return [];

  let source = area.restaurants;
  try {
    const stored = JSON.parse(localStorage.getItem('pickit_curated_data') || '{}');
    if (stored[areaId]?.restaurants?.length && stored._version === CURATED_DATA_VERSION) {
      source = stored[areaId].restaurants.map((r: CuratedRestaurantSeed) => {
        const seed = area.restaurants.find(s => s.id === r.id);
        return { ...r, photoPool: seed?.photoPool || [] };
      });
    }
  } catch (_e) {
    // ignore parse errors
  }

  return source.map(r => ({
    id:           r.id,
    name:         r.name,
    foodCategory: r.category as FoodCategoryKey,
    category:     _AREA_CAT_LABEL[r.category] || r.category,
    rating:       r.rating,
    reviewCount:  r.reviewCount,
    address:      r.address,
    lat:          r.lat,
    lng:          r.lng,
    emoji:        _AREA_EMOJIS[r.category] || '🍽️',
    gradient:     _AREA_GRADIENTS[Math.abs(r.id.charCodeAt(r.id.length - 1)) % _AREA_GRADIENTS.length],
    photoUrl:     r.photoUrl || r.photoPool?.[0] || null,
    photoUrls:    r.photoUrls || [],
    walkMinutes:  r.walkMinutes,
    priceMin:     r.priceMin,
    priceMax:     r.priceMax,
    gmapsUrl:     r.gmapsUrl,
    naverUrl:     r.naverUrl,
    bayesianScore: 0,
  }));
}
