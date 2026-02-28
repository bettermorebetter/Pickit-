/* ══════════════════════════════════════════════════════════════
   Restaurant data — fallback + curated areas
══════════════════════════════════════════════════════════════ */

import type { FallbackRestaurant, CuratedArea, CuratedRestaurantSeed, Restaurant, FoodCategoryKey } from '../types/index.ts';
import { GRADIENTS } from './constants.ts';
import { FOOD_PHOTO_URLS, PHOTO_POOLS } from './photos.ts';

/* ── Fallback restaurants (when API unavailable) ──────────── */
export const FALLBACK_RESTAURANTS: FallbackRestaurant[] = [
  // 강남구
  { id: 'f_gangnam_1', district: 'gangnam', name: '삼원가든',          category: '한우',     rating: 4.5, reviewCount: 4312,  emoji: '🥩', gradient: GRADIENTS[0], address: '서울 강남구 언주로133길 19',      lat: 37.5156, lng: 127.0319, photoUrl: FOOD_PHOTO_URLS.koreanBbq[0], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_gangnam_2', district: 'gangnam', name: '가온',              category: '한정식',   rating: 4.7, reviewCount: 512,   emoji: '🍱', gradient: GRADIENTS[1], address: '서울 강남구 도산대로 317',        lat: 37.5243, lng: 127.0401, photoUrl: FOOD_PHOTO_URLS.korean[0],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_gangnam_3', district: 'gangnam', name: '논현 양대창',       category: '구이',     rating: 4.4, reviewCount: 2130,  emoji: '🥩', gradient: GRADIENTS[2], address: '서울 강남구 논현로175길 28',      lat: 37.5117, lng: 127.0396, photoUrl: FOOD_PHOTO_URLS.koreanBbq[1], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_gangnam_4', district: 'gangnam', name: '압구정 스시야',     category: '스시',     rating: 4.6, reviewCount: 987,   emoji: '🍣', gradient: GRADIENTS[3], address: '서울 강남구 학동로97길 3',        lat: 37.5155, lng: 127.0426, photoUrl: FOOD_PHOTO_URLS.sushi[0],     photoUrls: FOOD_PHOTO_URLS.sushi },
  // 서초구
  { id: 'f_seocho_1', district: 'seocho', name: '진진',               category: '중식',     rating: 4.6, reviewCount: 2341,  emoji: '🥟', gradient: GRADIENTS[4], address: '서울 서초구 방배중앙로 60',       lat: 37.4800, lng: 126.9993, photoUrl: FOOD_PHOTO_URLS.chinese[0],   photoUrls: FOOD_PHOTO_URLS.chinese },
  { id: 'f_seocho_2', district: 'seocho', name: '방배동 카페골목',    category: '카페',     rating: 4.4, reviewCount: 3210,  emoji: '☕', gradient: GRADIENTS[5], address: '서울 서초구 방배로 198',          lat: 37.4835, lng: 126.9963, photoUrl: FOOD_PHOTO_URLS.pasta[0],     photoUrls: FOOD_PHOTO_URLS.pasta },
  { id: 'f_seocho_3', district: 'seocho', name: '서초 참숯갈비',      category: '갈비',     rating: 4.3, reviewCount: 1780,  emoji: '🥩', gradient: GRADIENTS[6], address: '서울 서초구 서초중앙로 161',      lat: 37.4913, lng: 127.0180, photoUrl: FOOD_PHOTO_URLS.koreanBbq[2], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_seocho_4', district: 'seocho', name: '양재 낙지볶음',      category: '낙지볶음', rating: 4.2, reviewCount: 876,   emoji: '🦑', gradient: GRADIENTS[7], address: '서울 서초구 양재동',              lat: 37.4757, lng: 127.0349, photoUrl: FOOD_PHOTO_URLS.korean[1],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 송파구
  { id: 'f_songpa_1', district: 'songpa', name: '풍년쌀농부',         category: '한식',     rating: 4.5, reviewCount: 2134,  emoji: '🍚', gradient: GRADIENTS[8], address: '서울 송파구 백제고분로45길 15',   lat: 37.5051, lng: 127.1086, photoUrl: FOOD_PHOTO_URLS.korean[2],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_songpa_2', district: 'songpa', name: '가락시장 횟집',      category: '해산물',   rating: 4.4, reviewCount: 3421,  emoji: '🐟', gradient: GRADIENTS[9], address: '서울 송파구 가락로 245',          lat: 37.4956, lng: 127.1158, photoUrl: FOOD_PHOTO_URLS.sushi[1],     photoUrls: FOOD_PHOTO_URLS.sushi },
  { id: 'f_songpa_3', district: 'songpa', name: '석촌 해장국',        category: '해장국',   rating: 4.2, reviewCount: 543,   emoji: '🍲', gradient: GRADIENTS[0], address: '서울 송파구 석촌호수로 76',       lat: 37.5086, lng: 127.1007, photoUrl: FOOD_PHOTO_URLS.haejangguk[0],photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_songpa_4', district: 'songpa', name: '잠실 롯데타워 레스토랑', category: '양식', rating: 4.3, reviewCount: 1120,  emoji: '🍽️', gradient: GRADIENTS[1], address: '서울 송파구 올림픽로 300',        lat: 37.5138, lng: 127.1005, photoUrl: FOOD_PHOTO_URLS.pasta[1],     photoUrls: FOOD_PHOTO_URLS.pasta },
  // 마포구
  { id: 'f_mapo_1', district: 'mapo', name: '이남장',                  category: '삼겹살',   rating: 4.3, reviewCount: 2734,  emoji: '🥩', gradient: GRADIENTS[2], address: '서울 마포구 와우산로 21-18',      lat: 37.5524, lng: 126.9225, photoUrl: FOOD_PHOTO_URLS.koreanBbq[3], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_mapo_2', district: 'mapo', name: '망원시장 어묵탕',        category: '분식',     rating: 4.5, reviewCount: 5678,  emoji: '🍢', gradient: GRADIENTS[3], address: '서울 마포구 망원시장길 37',       lat: 37.5568, lng: 126.9102, photoUrl: FOOD_PHOTO_URLS.korean[3],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_mapo_3', district: 'mapo', name: '연남동 파스타집',        category: '이탈리안', rating: 4.4, reviewCount: 1890,  emoji: '🍝', gradient: GRADIENTS[4], address: '서울 마포구 연남동 248',          lat: 37.5626, lng: 126.9234, photoUrl: FOOD_PHOTO_URLS.pasta[2],     photoUrls: FOOD_PHOTO_URLS.pasta },
  { id: 'f_mapo_4', district: 'mapo', name: '공덕 순대국',            category: '순대국',   rating: 4.3, reviewCount: 1234,  emoji: '🍲', gradient: GRADIENTS[5], address: '서울 마포구 마포대로 109',        lat: 37.5440, lng: 126.9516, photoUrl: FOOD_PHOTO_URLS.haejangguk[1],photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 용산구
  { id: 'f_yongsan_1', district: 'yongsan', name: '이태원 후통',      category: '중식',     rating: 4.5, reviewCount: 2143,  emoji: '🥟', gradient: GRADIENTS[6], address: '서울 용산구 이태원로49길 46',     lat: 37.5340, lng: 126.9964, photoUrl: FOOD_PHOTO_URLS.dumpling[0],  photoUrls: FOOD_PHOTO_URLS.dumpling },
  { id: 'f_yongsan_2', district: 'yongsan', name: '해방촌 핫도그',    category: '분식',     rating: 4.4, reviewCount: 3421,  emoji: '🌭', gradient: GRADIENTS[7], address: '서울 용산구 신흥로 31-3',         lat: 37.5413, lng: 126.9895, photoUrl: FOOD_PHOTO_URLS.burger[0],    photoUrls: FOOD_PHOTO_URLS.burger },
  { id: 'f_yongsan_3', district: 'yongsan', name: '경리단길 카페',    category: '카페',     rating: 4.3, reviewCount: 987,   emoji: '☕', gradient: GRADIENTS[8], address: '서울 용산구 회나무로44길 10',     lat: 37.5341, lng: 127.0000, photoUrl: FOOD_PHOTO_URLS.pasta[3],     photoUrls: FOOD_PHOTO_URLS.pasta },
  { id: 'f_yongsan_4', district: 'yongsan', name: '후암동 삼겹살',    category: '삼겹살',   rating: 4.3, reviewCount: 765,   emoji: '🥩', gradient: GRADIENTS[9], address: '서울 용산구 후암로 22',            lat: 37.5464, lng: 126.9804, photoUrl: FOOD_PHOTO_URLS.koreanBbq[4], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  // 종로구
  { id: 'f_jongno_1', district: 'jongno', name: '진옥화 할매 원조 닭한마리', category: '닭한마리', rating: 4.4, reviewCount: 4512, emoji: '🍗', gradient: GRADIENTS[0], address: '서울 종로구 종로 264',    lat: 37.5699, lng: 127.0095, photoUrl: FOOD_PHOTO_URLS.dakhanmari[0], photoUrls: FOOD_PHOTO_URLS.dakhanmari },
  { id: 'f_jongno_2', district: 'jongno', name: '광장시장 마약김밥', category: '분식',     rating: 4.5, reviewCount: 14780, emoji: '🍱', gradient: GRADIENTS[1], address: '서울 종로구 종로 88 광장시장', lat: 37.5700, lng: 127.0086, photoUrl: FOOD_PHOTO_URLS.korean[4],     photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_jongno_3', district: 'jongno', name: '봉피양',             category: '평양냉면', rating: 4.3, reviewCount: 1823,  emoji: '🍜', gradient: GRADIENTS[2], address: '서울 종로구 새문안로 97',         lat: 37.5752, lng: 126.9726, photoUrl: FOOD_PHOTO_URLS.kalguksu[0],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jongno_4', district: 'jongno', name: '삼청동 수제비',     category: '수제비',   rating: 4.2, reviewCount: 1234,  emoji: '🍲', gradient: GRADIENTS[3], address: '서울 종로구 삼청로 101-1',        lat: 37.5818, lng: 126.9810, photoUrl: FOOD_PHOTO_URLS.kalguksu[1],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jongno_5', district: 'jongno', name: '청진옥',             category: '해장국',   rating: 4.3, reviewCount: 987,   emoji: '🍲', gradient: GRADIENTS[4], address: '서울 종로구 종로 19',             lat: 37.5718, lng: 126.9780, photoUrl: FOOD_PHOTO_URLS.haejangguk[2], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 중구
  { id: 'f_jung_1', district: 'jung', name: '우래옥',                  category: '평양냉면', rating: 4.5, reviewCount: 3241,  emoji: '🍜', gradient: GRADIENTS[5], address: '서울 중구 창경궁로5길 13',        lat: 37.5696, lng: 126.9987, photoUrl: FOOD_PHOTO_URLS.kalguksu[2],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jung_2', district: 'jung', name: '명동교자',                category: '칼국수',   rating: 4.4, reviewCount: 8912,  emoji: '🍜', gradient: GRADIENTS[6], address: '서울 중구 명동10길 29',           lat: 37.5634, lng: 126.9840, photoUrl: FOOD_PHOTO_URLS.kalguksu[3],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jung_3', district: 'jung', name: '하동관',                  category: '곰탕',     rating: 4.5, reviewCount: 2087,  emoji: '🍲', gradient: GRADIENTS[7], address: '서울 중구 명동9길 12',            lat: 37.5637, lng: 126.9852, photoUrl: FOOD_PHOTO_URLS.haejangguk[3], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_jung_4', district: 'jung', name: '오장동 흥남집',          category: '함흥냉면', rating: 4.4, reviewCount: 1956,  emoji: '🍜', gradient: GRADIENTS[8], address: '서울 중구 오장동5길 3',            lat: 37.5630, lng: 126.9990, photoUrl: FOOD_PHOTO_URLS.kalguksu[4],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jung_5', district: 'jung', name: '을지면옥',                category: '평양냉면', rating: 4.5, reviewCount: 2876,  emoji: '🍜', gradient: GRADIENTS[9], address: '서울 중구 을지로 18',             lat: 37.5654, lng: 126.9899, photoUrl: FOOD_PHOTO_URLS.kalguksu[0],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  // 성동구
  { id: 'f_seongdong_1', district: 'seongdong', name: '성수동 뚝섬갈비',   category: '갈비',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[0], address: '서울 성동구 뚝섬로 280',          lat: 37.5479, lng: 127.0614, photoUrl: FOOD_PHOTO_URLS.koreanBbq[5], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_seongdong_2', district: 'seongdong', name: '왕십리 곱창골목',   category: '곱창',   rating: 4.4, reviewCount: 3421, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 성동구 왕십리로 257',        lat: 37.5615, lng: 127.0369, photoUrl: FOOD_PHOTO_URLS.koreanBbq[0], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_seongdong_3', district: 'seongdong', name: '성수 카페거리 브런치', category: '브런치', rating: 4.5, reviewCount: 5671, emoji: '☕', gradient: GRADIENTS[2], address: '서울 성동구 성수이로7가길 11', lat: 37.5444, lng: 127.0558, photoUrl: FOOD_PHOTO_URLS.pasta[4],     photoUrls: FOOD_PHOTO_URLS.pasta },
  // 광진구
  { id: 'f_gwangjin_1', district: 'gwangjin', name: '건대 닭갈비',    category: '닭갈비',   rating: 4.3, reviewCount: 2341,  emoji: '🍗', gradient: GRADIENTS[3], address: '서울 광진구 능동로 210',          lat: 37.5408, lng: 127.0694, photoUrl: FOOD_PHOTO_URLS.yakitori[0],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_gwangjin_2', district: 'gwangjin', name: '자양동 양꼬치', category: '양꼬치',   rating: 4.5, reviewCount: 2890,  emoji: '🍢', gradient: GRADIENTS[4], address: '서울 광진구 자양로 154',          lat: 37.5384, lng: 127.0822, photoUrl: FOOD_PHOTO_URLS.yakitori[1],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_gwangjin_3', district: 'gwangjin', name: '뚝섬 조개구이', category: '조개구이', rating: 4.4, reviewCount: 1567,  emoji: '🦀', gradient: GRADIENTS[5], address: '서울 광진구 뚝섬로 543',          lat: 37.5301, lng: 127.0822, photoUrl: FOOD_PHOTO_URLS.korean[0],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 동대문구
  { id: 'f_dongdaemun_1', district: 'dongdaemun', name: '마장동 갈비',      category: '갈비',     rating: 4.4, reviewCount: 2134, emoji: '🥩', gradient: GRADIENTS[6], address: '서울 동대문구 마장로 32',         lat: 37.5670, lng: 127.0452, photoUrl: FOOD_PHOTO_URLS.koreanBbq[1], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_dongdaemun_2', district: 'dongdaemun', name: '동대문 닭한마리', category: '닭한마리', rating: 4.3, reviewCount: 3421, emoji: '🍗', gradient: GRADIENTS[7], address: '서울 동대문구 약령시로 1',        lat: 37.5717, lng: 127.0452, photoUrl: FOOD_PHOTO_URLS.dakhanmari[1], photoUrls: FOOD_PHOTO_URLS.dakhanmari },
  { id: 'f_dongdaemun_3', district: 'dongdaemun', name: '신설동 육개장', category: '육개장',   rating: 4.2, reviewCount: 876,  emoji: '🍲', gradient: GRADIENTS[8], address: '서울 동대문구 신설로 65',         lat: 37.5744, lng: 127.0395, photoUrl: FOOD_PHOTO_URLS.haejangguk[0], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 서대문구
  { id: 'f_seodaemun_1', district: 'seodaemun', name: '신촌 황소고집',   category: '소고기',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[9], address: '서울 서대문구 신촌로 63',         lat: 37.5560, lng: 126.9368, photoUrl: FOOD_PHOTO_URLS.koreanBbq[2], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_seodaemun_2', district: 'seodaemun', name: '독립문 족발',     category: '족발',     rating: 4.4, reviewCount: 1890, emoji: '🍖', gradient: GRADIENTS[0], address: '서울 서대문구 통일로 185',        lat: 37.5791, lng: 126.9529, photoUrl: FOOD_PHOTO_URLS.koreanBbq[3], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_seodaemun_3', district: 'seodaemun', name: '연희동 갈치조림', category: '생선조림', rating: 4.5, reviewCount: 987,  emoji: '🐟', gradient: GRADIENTS[1], address: '서울 서대문구 연희로 85',         lat: 37.5711, lng: 126.9227, photoUrl: FOOD_PHOTO_URLS.korean[1],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 은평구
  { id: 'f_eunpyeong_1', district: 'eunpyeong', name: '진관사 산채비빔밥', category: '사찰음식', rating: 4.5, reviewCount: 1234, emoji: '🥗', gradient: GRADIENTS[2], address: '서울 은평구 진관길 73',           lat: 37.6364, lng: 126.9246, photoUrl: FOOD_PHOTO_URLS.korean[2],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_eunpyeong_2', district: 'eunpyeong', name: '연신내 닭갈비',    category: '닭갈비',   rating: 4.3, reviewCount: 2341, emoji: '🍗', gradient: GRADIENTS[3], address: '서울 은평구 연서로 252',          lat: 37.6177, lng: 126.9228, photoUrl: FOOD_PHOTO_URLS.yakitori[2],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_eunpyeong_3', district: 'eunpyeong', name: '불광동 삼겹살',    category: '삼겹살',   rating: 4.2, reviewCount: 654,  emoji: '🥩', gradient: GRADIENTS[4], address: '서울 은평구 불광로 120',          lat: 37.6177, lng: 126.9170, photoUrl: FOOD_PHOTO_URLS.koreanBbq[4], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  // 노원구
  { id: 'f_nowon_1', district: 'nowon', name: '중계동 은행나무식당', category: '한정식',   rating: 4.4, reviewCount: 876,  emoji: '🍱', gradient: GRADIENTS[5], address: '서울 노원구 중계로 212',          lat: 37.6393, lng: 127.0568, photoUrl: FOOD_PHOTO_URLS.korean[3],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_nowon_2', district: 'nowon', name: '공릉동 닭갈비',      category: '닭갈비',   rating: 4.3, reviewCount: 1567, emoji: '🍗', gradient: GRADIENTS[6], address: '서울 노원구 공릉로 116',          lat: 37.6291, lng: 127.0732, photoUrl: FOOD_PHOTO_URLS.yakitori[3],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_nowon_3', district: 'nowon', name: '노원 곰탕',          category: '곰탕',     rating: 4.2, reviewCount: 543,  emoji: '🍲', gradient: GRADIENTS[7], address: '서울 노원구 노원로 437',          lat: 37.6542, lng: 127.0568, photoUrl: FOOD_PHOTO_URLS.haejangguk[4], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 도봉구
  { id: 'f_dobong_1', district: 'dobong', name: '도봉산 파전막걸리', category: '파전',   rating: 4.3, reviewCount: 765,  emoji: '🥞', gradient: GRADIENTS[8], address: '서울 도봉구 도봉산길 86',         lat: 37.6688, lng: 127.0471, photoUrl: FOOD_PHOTO_URLS.korean[4],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_dobong_2', district: 'dobong', name: '쌍문동 삼겹살',    category: '삼겹살', rating: 4.2, reviewCount: 987,  emoji: '🥩', gradient: GRADIENTS[9], address: '서울 도봉구 도봉로 590',          lat: 37.6466, lng: 127.0357, photoUrl: FOOD_PHOTO_URLS.koreanBbq[5], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_dobong_3', district: 'dobong', name: '방학동 칼국수',    category: '칼국수', rating: 4.3, reviewCount: 654,  emoji: '🍜', gradient: GRADIENTS[0], address: '서울 도봉구 방학로 47',            lat: 37.6600, lng: 127.0350, photoUrl: FOOD_PHOTO_URLS.kalguksu[0],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  // 강북구
  { id: 'f_gangbuk_1', district: 'gangbuk', name: '미아동 곱창골목',  category: '곱창',   rating: 4.3, reviewCount: 1234, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 강북구 도봉로 152',          lat: 37.6397, lng: 127.0256, photoUrl: FOOD_PHOTO_URLS.koreanBbq[1], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_gangbuk_2', district: 'gangbuk', name: '수유시장 순대국', category: '순대국', rating: 4.4, reviewCount: 1890, emoji: '🍲', gradient: GRADIENTS[2], address: '서울 강북구 도봉로 250',          lat: 37.6400, lng: 127.0256, photoUrl: FOOD_PHOTO_URLS.haejangguk[1], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_gangbuk_3', district: 'gangbuk', name: '솔밭 파전',       category: '파전',   rating: 4.2, reviewCount: 543,  emoji: '🥞', gradient: GRADIENTS[3], address: '서울 강북구 4.19로 5',            lat: 37.6420, lng: 127.0100, photoUrl: FOOD_PHOTO_URLS.korean[0],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 성북구
  { id: 'f_seongbuk_1', district: 'seongbuk', name: '성북동 삼청각',   category: '한정식',   rating: 4.5, reviewCount: 2134, emoji: '🍱', gradient: GRADIENTS[4], address: '서울 성북구 대사관로 3',          lat: 37.5949, lng: 126.9969, photoUrl: FOOD_PHOTO_URLS.korean[1],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_seongbuk_2', district: 'seongbuk', name: '정릉 닭볶음탕',   category: '닭볶음탕', rating: 4.3, reviewCount: 876,  emoji: '🍗', gradient: GRADIENTS[5], address: '서울 성북구 정릉로 237',          lat: 37.6050, lng: 127.0068, photoUrl: FOOD_PHOTO_URLS.yakitori[4],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_seongbuk_3', district: 'seongbuk', name: '길음 순대볶음',   category: '분식',     rating: 4.4, reviewCount: 1567, emoji: '🍖', gradient: GRADIENTS[6], address: '서울 성북구 동소문로 22',         lat: 37.5894, lng: 127.0167, photoUrl: FOOD_PHOTO_URLS.korean[2],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 중랑구
  { id: 'f_jungnang_1', district: 'jungnang', name: '면목동 칼국수', category: '칼국수', rating: 4.3, reviewCount: 765,  emoji: '🍜', gradient: GRADIENTS[7], address: '서울 중랑구 면목로 79',           lat: 37.5963, lng: 127.0928, photoUrl: FOOD_PHOTO_URLS.kalguksu[1],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_jungnang_2', district: 'jungnang', name: '상봉 닭갈비',   category: '닭갈비', rating: 4.2, reviewCount: 987,  emoji: '🍗', gradient: GRADIENTS[8], address: '서울 중랑구 봉화산로 101',        lat: 37.6063, lng: 127.0928, photoUrl: FOOD_PHOTO_URLS.yakitori[0],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_jungnang_3', district: 'jungnang', name: '망우 순대국',   category: '순대국', rating: 4.3, reviewCount: 654,  emoji: '🍲', gradient: GRADIENTS[9], address: '서울 중랑구 망우로 254',          lat: 37.6063, lng: 127.0800, photoUrl: FOOD_PHOTO_URLS.haejangguk[2], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 강서구
  { id: 'f_gangseo_1', district: 'gangseo', name: '마곡나루 스시',  category: '스시',     rating: 4.4, reviewCount: 1234, emoji: '🍣', gradient: GRADIENTS[0], address: '서울 강서구 마곡중앙로 59',       lat: 37.5591, lng: 126.8345, photoUrl: FOOD_PHOTO_URLS.sushi[2],     photoUrls: FOOD_PHOTO_URLS.sushi },
  { id: 'f_gangseo_2', district: 'gangseo', name: '화곡 삼겹살',    category: '삼겹살',   rating: 4.3, reviewCount: 1890, emoji: '🥩', gradient: GRADIENTS[1], address: '서울 강서구 등촌로 175',          lat: 37.5509, lng: 126.8495, photoUrl: FOOD_PHOTO_URLS.koreanBbq[0], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_gangseo_3', district: 'gangseo', name: '발산역 닭한마리', category: '닭한마리', rating: 4.2, reviewCount: 765,  emoji: '🍗', gradient: GRADIENTS[2], address: '서울 강서구 공항대로 209',        lat: 37.5500, lng: 126.8367, photoUrl: FOOD_PHOTO_URLS.dakhanmari[2], photoUrls: FOOD_PHOTO_URLS.dakhanmari },
  // 양천구
  { id: 'f_yangcheon_1', district: 'yangcheon', name: '목동 쭈꾸미',    category: '쭈꾸미',   rating: 4.3, reviewCount: 1567, emoji: '🦑', gradient: GRADIENTS[3], address: '서울 양천구 목동동로 57',         lat: 37.5170, lng: 126.8665, photoUrl: FOOD_PHOTO_URLS.korean[3],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_yangcheon_2', district: 'yangcheon', name: '신정 순대국',    category: '순대국',   rating: 4.2, reviewCount: 876,  emoji: '🍲', gradient: GRADIENTS[4], address: '서울 양천구 신정중앙로 28',       lat: 37.5190, lng: 126.8700, photoUrl: FOOD_PHOTO_URLS.haejangguk[3], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_yangcheon_3', district: 'yangcheon', name: '오목교 칼국수', category: '칼국수',   rating: 4.4, reviewCount: 2341, emoji: '🍜', gradient: GRADIENTS[5], address: '서울 양천구 오목로 345',          lat: 37.5254, lng: 126.8699, photoUrl: FOOD_PHOTO_URLS.kalguksu[2],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  // 영등포구
  { id: 'f_yeongdeungpo_1', district: 'yeongdeungpo', name: '당산 꼬막',         category: '해산물',   rating: 4.4, reviewCount: 2134, emoji: '🦀', gradient: GRADIENTS[6], address: '서울 영등포구 당산로 121',       lat: 37.5263, lng: 126.8961, photoUrl: FOOD_PHOTO_URLS.korean[4],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_yeongdeungpo_2', district: 'yeongdeungpo', name: '영등포 시장 닭볶음탕', category: '닭볶음탕', rating: 4.3, reviewCount: 1234, emoji: '🍗', gradient: GRADIENTS[7], address: '서울 영등포구 영등포로 63',    lat: 37.5175, lng: 126.9036, photoUrl: FOOD_PHOTO_URLS.yakitori[1],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_yeongdeungpo_3', district: 'yeongdeungpo', name: '문래 수제버거',     category: '양식',     rating: 4.2, reviewCount: 543,  emoji: '🍔', gradient: GRADIENTS[8], address: '서울 영등포구 문래로 5',         lat: 37.5176, lng: 126.8961, photoUrl: FOOD_PHOTO_URLS.burger[1],    photoUrls: FOOD_PHOTO_URLS.burger },
  // 구로구
  { id: 'f_guro_1', district: 'guro', name: '구로 디지털단지 쌀국수', category: '쌀국수', rating: 4.3, reviewCount: 1890, emoji: '🍜', gradient: GRADIENTS[9], address: '서울 구로구 디지털로 306',        lat: 37.4854, lng: 126.9014, photoUrl: FOOD_PHOTO_URLS.ramen[0],      photoUrls: FOOD_PHOTO_URLS.ramen },
  { id: 'f_guro_2', district: 'guro', name: '신도림 갈비탕',         category: '갈비탕', rating: 4.2, reviewCount: 765,  emoji: '🍲', gradient: GRADIENTS[0], address: '서울 구로구 경인로 610',          lat: 37.5089, lng: 126.8876, photoUrl: FOOD_PHOTO_URLS.haejangguk[4], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_guro_3', district: 'guro', name: '구로시장 순대볶음',     category: '분식',   rating: 4.4, reviewCount: 2341, emoji: '🍖', gradient: GRADIENTS[1], address: '서울 구로구 고척로 17',            lat: 37.4954, lng: 126.8874, photoUrl: FOOD_PHOTO_URLS.korean[0],    photoUrls: FOOD_PHOTO_URLS.korean },
  // 금천구
  { id: 'f_geumcheon_1', district: 'geumcheon', name: '가산 칼국수',  category: '칼국수', rating: 4.3, reviewCount: 1234, emoji: '🍜', gradient: GRADIENTS[2], address: '서울 금천구 가산디지털1로 128',   lat: 37.4775, lng: 126.9030, photoUrl: FOOD_PHOTO_URLS.kalguksu[3],   photoUrls: FOOD_PHOTO_URLS.kalguksu },
  { id: 'f_geumcheon_2', district: 'geumcheon', name: '독산 삼겹살', category: '삼겹살', rating: 4.2, reviewCount: 876,  emoji: '🥩', gradient: GRADIENTS[3], address: '서울 금천구 시흥대로 159',        lat: 37.4600, lng: 126.9001, photoUrl: FOOD_PHOTO_URLS.koreanBbq[2], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  { id: 'f_geumcheon_3', district: 'geumcheon', name: '시흥 곱창',   category: '곱창',   rating: 4.3, reviewCount: 1567, emoji: '🍖', gradient: GRADIENTS[4], address: '서울 금천구 독산로 246',          lat: 37.4780, lng: 126.8923, photoUrl: FOOD_PHOTO_URLS.koreanBbq[3], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  // 동작구
  { id: 'f_dongjak_1', district: 'dongjak', name: '노량진 수산시장', category: '해산물',   rating: 4.5, reviewCount: 8901, emoji: '🐟', gradient: GRADIENTS[5], address: '서울 동작구 노들로 674',          lat: 37.5140, lng: 126.9420, photoUrl: FOOD_PHOTO_URLS.sushi[3],     photoUrls: FOOD_PHOTO_URLS.sushi },
  { id: 'f_dongjak_2', district: 'dongjak', name: '사당 닭한마리',   category: '닭한마리', rating: 4.3, reviewCount: 2134, emoji: '🍗', gradient: GRADIENTS[6], address: '서울 동작구 동작대로 109',        lat: 37.5124, lng: 126.9393, photoUrl: FOOD_PHOTO_URLS.dakhanmari[3], photoUrls: FOOD_PHOTO_URLS.dakhanmari },
  { id: 'f_dongjak_3', district: 'dongjak', name: '흑석 순두부',     category: '두부요리', rating: 4.4, reviewCount: 1234, emoji: '🍲', gradient: GRADIENTS[7], address: '서울 동작구 흑석로 84',            lat: 37.5091, lng: 126.9508, photoUrl: FOOD_PHOTO_URLS.haejangguk[0], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  // 관악구
  { id: 'f_gwanak_1', district: 'gwanak', name: '신림 순대타운',      category: '순대',   rating: 4.4, reviewCount: 5678, emoji: '🍖', gradient: GRADIENTS[8], address: '서울 관악구 신림로 316',          lat: 37.4853, lng: 126.9295, photoUrl: FOOD_PHOTO_URLS.korean[1],    photoUrls: FOOD_PHOTO_URLS.korean },
  { id: 'f_gwanak_2', district: 'gwanak', name: '서울대입구 양꼬치', category: '양꼬치', rating: 4.5, reviewCount: 3421, emoji: '🍢', gradient: GRADIENTS[9], address: '서울 관악구 관악로 211',          lat: 37.4784, lng: 126.9516, photoUrl: FOOD_PHOTO_URLS.yakitori[2],  photoUrls: FOOD_PHOTO_URLS.yakitori },
  { id: 'f_gwanak_3', district: 'gwanak', name: '봉천 육전',          category: '육전',   rating: 4.3, reviewCount: 1234, emoji: '🥩', gradient: GRADIENTS[0], address: '서울 관악구 봉천로 318',          lat: 37.4830, lng: 126.9383, photoUrl: FOOD_PHOTO_URLS.koreanBbq[4], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
  // 강동구
  { id: 'f_gangdong_1', district: 'gangdong', name: '천호 순대국',   category: '순대국', rating: 4.3, reviewCount: 1890, emoji: '🍲', gradient: GRADIENTS[1], address: '서울 강동구 천호대로 1139',       lat: 37.5390, lng: 127.1238, photoUrl: FOOD_PHOTO_URLS.haejangguk[1], photoUrls: FOOD_PHOTO_URLS.haejangguk },
  { id: 'f_gangdong_2', district: 'gangdong', name: '암사 어시장',   category: '해산물', rating: 4.4, reviewCount: 2341, emoji: '🐟', gradient: GRADIENTS[2], address: '서울 강동구 올림픽로 875',        lat: 37.5568, lng: 127.1415, photoUrl: FOOD_PHOTO_URLS.sushi[4],     photoUrls: FOOD_PHOTO_URLS.sushi },
  { id: 'f_gangdong_3', district: 'gangdong', name: '길동 삼겹살',   category: '삼겹살', rating: 4.2, reviewCount: 765,  emoji: '🥩', gradient: GRADIENTS[3], address: '서울 강동구 천호대로 1175',       lat: 37.5340, lng: 127.1300, photoUrl: FOOD_PHOTO_URLS.koreanBbq[5], photoUrls: FOOD_PHOTO_URLS.koreanBbq },
];

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

export const CURATED_DATA_VERSION = 6;

export const CURATED_AREAS: Record<string, CuratedArea> = {
  snu: {
    id: 'snu',
    label: '서울대입구역',
    lat: 37.4812,
    lng: 126.9527,
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
    lat: 37.5404,
    lng: 127.0699,
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
    photoUrl:     r.photoUrl || null,
    photoUrls:    r.photoUrls || [],
    bayesianScore: 0,
  }));
}
