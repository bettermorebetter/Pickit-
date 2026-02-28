/* ══════════════════════════════════════════════════════════════
   Google Places API service — search, scoring, fallback
══════════════════════════════════════════════════════════════ */

import type { Restaurant, FoodCategoryKey } from '../types/index.ts';
import { FOOD_CATEGORIES, GRADIENTS, computeBayesianScore, shuffle } from '../data/constants.ts';
import { FOOD_PHOTO_URLS } from '../data/photos.ts';
import { FALLBACK_RESTAURANTS } from '../data/restaurants.ts';

/* ── Helpers ──────────────────────────────────────────────── */

export function getPhotoUrl(photo: google.maps.places.PlacePhoto | google.maps.places.PlacePhoto, isNewApi: boolean): string | null {
  if (!photo) return null;
  try {
    if (isNewApi) return (photo as any).getURI({ maxHeight: 800 });
    return (photo as any).getUrl({ maxWidth: 800, maxHeight: 600 });
  } catch (_e) {
    return null;
  }
}

export function hasNewPlacesApi(): boolean {
  return typeof google !== 'undefined' &&
    (google.maps?.places as any)?.Place?.searchNearby !== undefined;
}

export function hasOldPlacesApi(): boolean {
  return typeof google !== 'undefined' &&
    google.maps?.places?.PlacesService !== undefined;
}

/* ── New API search ──────────────────────────────────────── */

export async function searchCategoryNewApi(lat: number, lng: number, categoryKey: FoodCategoryKey): Promise<Restaurant[]> {
  const Place = (google.maps.places as any).Place;
  const catConfig = FOOD_CATEGORIES[categoryKey];

  const request = {
    fields: ['displayName', 'location', 'rating', 'userRatingCount', 'formattedAddress', 'photos', 'businessStatus', 'id'],
    locationRestriction: {
      center: { lat, lng },
      radius: 1000,
    },
    includedTypes: catConfig.includedTypes,
    maxResultCount: 20,
  };

  try {
    const { places } = await Place.searchNearby(request);
    return (places as any[])
      .filter((p: any) => p.businessStatus === 'OPERATIONAL' && p.rating != null)
      .map((p: any, i: number) => ({
        id:           p.id,
        placeId:      p.id,
        name:         p.displayName,
        foodCategory: categoryKey,
        category:     catConfig.label,
        rating:       p.rating,
        reviewCount:  p.userRatingCount || 0,
        address:      p.formattedAddress || '',
        lat:          p.location.lat(),
        lng:          p.location.lng(),
        emoji:        catConfig.emoji,
        gradient:     GRADIENTS[i % GRADIENTS.length],
        photoUrl:     p.photos?.length ? getPhotoUrl(p.photos[0], true) : null,
        photoUrls:    p.photos ? p.photos.slice(0, 5).map((ph: any) => getPhotoUrl(ph, true)).filter(Boolean) : [],
        bayesianScore: 0,
      }));
  } catch (e) {
    console.warn(`New API search failed for ${categoryKey}:`, e);
    return [];
  }
}

/* ── Old API search ──────────────────────────────────────── */

export function searchCategoryOldApi(
  service: google.maps.places.PlacesService,
  lat: number,
  lng: number,
  categoryKey: FoodCategoryKey
): Promise<Restaurant[]> {
  return new Promise(resolve => {
    const catConfig = FOOD_CATEGORIES[categoryKey];
    const queryMap: Record<FoodCategoryKey, string> = {
      korean:   '한식 맛집',
      japanese: '일식 맛집',
      chinese:  '중식 맛집',
      western:  '양식 맛집',
    };

    const timer = setTimeout(() => resolve([]), 8000);

    try {
      service.textSearch(
        {
          query:    queryMap[categoryKey],
          location: new google.maps.LatLng(lat, lng),
          radius:   1000,
          type:     'restaurant',
        },
        (results, status) => {
          clearTimeout(timer);
          if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
            const mapped = results.map((p, i) => ({
              id:           p.place_id!,
              placeId:      p.place_id!,
              name:         p.name!,
              foodCategory: categoryKey,
              category:     catConfig.label,
              rating:       p.rating != null ? p.rating : 4.0,
              reviewCount:  p.user_ratings_total || 0,
              address:      p.formatted_address || p.vicinity || '',
              lat:          p.geometry!.location!.lat(),
              lng:          p.geometry!.location!.lng(),
              emoji:        catConfig.emoji,
              gradient:     GRADIENTS[i % GRADIENTS.length],
              photoUrl:     p.photos?.length ? getPhotoUrl(p.photos[0], false) : null,
              photoUrls:    p.photos ? p.photos.slice(0, 5).map(ph => getPhotoUrl(ph, false)).filter(Boolean) as string[] : [],
              bayesianScore: 0,
            }));
            resolve(mapped);
          } else {
            resolve([]);
          }
        }
      );
    } catch (e) {
      clearTimeout(timer);
      console.warn(`Old API search failed for ${categoryKey}:`, e);
      resolve([]);
    }
  });
}

/* ── Bayesian selection ──────────────────────────────────── */

function applyStoredImages(restaurants: Restaurant[]): Restaurant[] {
  let stored: Record<string, { photoUrl?: string; photoUrls?: string[] }> = {};
  try {
    stored = JSON.parse(localStorage.getItem('pickit_restaurant_images') || '{}');
  } catch (_e) {
    // ignore
  }
  return restaurants.map(r => {
    const ov = stored[r.id];
    if (!ov) return r;
    return {
      ...r,
      photoUrl:  ov.photoUrl || r.photoUrl,
      photoUrls: ov.photoUrls?.length ? ov.photoUrls : r.photoUrls,
    };
  });
}

export function applyBayesianSelection(
  categoryResults: Record<string, Restaurant[]>,
  lat: number,
  lng: number
): Restaurant[] {
  const allRestaurants = Object.values(categoryResults).flat();

  if (allRestaurants.length === 0) {
    return getFallbackRestaurantsByLocation(lat, lng);
  }

  const totalRatings = allRestaurants.reduce((sum, r) => sum + (r.rating || 0), 0);
  const C = totalRatings / allRestaurants.length;

  allRestaurants.forEach(r => {
    r.bayesianScore = computeBayesianScore(r.rating, r.reviewCount, C);
  });

  const result: Restaurant[] = [];
  const usedIds = new Set<string>();
  const leftovers: Restaurant[] = [];

  Object.keys(FOOD_CATEGORIES).forEach(catKey => {
    const catList = (categoryResults[catKey] || [])
      .sort((a, b) => (b.bayesianScore || 0) - (a.bayesianScore || 0));

    let picked = 0;
    catList.forEach(r => {
      if (picked < 2) {
        result.push(r);
        usedIds.add(r.id);
        picked++;
      } else {
        leftovers.push(r);
      }
    });
  });

  leftovers.sort((a, b) => (b.bayesianScore || 0) - (a.bayesianScore || 0));
  for (const r of leftovers) {
    if (result.length >= 8) break;
    if (!usedIds.has(r.id)) {
      result.push(r);
      usedIds.add(r.id);
    }
  }

  if (result.length < 8) {
    const fallback = getFallbackRestaurantsByLocation(lat, lng);
    for (const r of fallback) {
      if (result.length >= 8) break;
      if (!usedIds.has(r.id)) {
        result.push(r);
        usedIds.add(r.id);
      }
    }
  }

  return applyStoredImages(result.slice(0, 8));
}

/* ── Fallback restaurants by location ────────────────────── */

export function getFallbackRestaurantsByLocation(lat: number, lng: number): Restaurant[] {
  const categoryMap: Record<string, FoodCategoryKey> = {
    '한식': 'korean', '한우': 'korean', '한정식': 'korean', '갈비': 'korean', '삼겹살': 'korean',
    '닭갈비': 'korean', '닭한마리': 'korean', '냉면': 'korean', '평양냉면': 'korean', '함흥냉면': 'korean',
    '곰탕': 'korean', '해장국': 'korean', '갈비탕': 'korean', '육개장': 'korean', '순대국': 'korean',
    '낙지볶음': 'korean', '닭볶음탕': 'korean', '곱창': 'korean', '분식': 'korean', '파전': 'korean',
    '수제비': 'korean', '해산물': 'korean', '조개구이': 'korean', '칼국수': 'korean', '두부요리': 'korean',
    '사찰음식': 'korean', '순대': 'korean', '육전': 'korean', '쭈꾸미': 'korean', '족발': 'korean',
    '구이': 'korean', '소고기': 'korean', '생선조림': 'korean',
    '스시': 'japanese', '일식': 'japanese',
    '중식': 'chinese', '양꼬치': 'chinese',
    '양식': 'western', '이탈리안': 'western', '브런치': 'western', '카페': 'western', '쌀국수': 'western',
  };

  const pool = shuffle([...FALLBACK_RESTAURANTS]).map(r => {
    const foodCategory = categoryMap[r.category] || 'korean';
    return {
      id:           r.id,
      placeId:      r.id,
      name:         r.name,
      foodCategory,
      category:     FOOD_CATEGORIES[foodCategory]?.label || r.category,
      rating:       r.rating,
      reviewCount:  r.reviewCount,
      address:      r.address,
      lat:          r.lat !== undefined ? r.lat : lat + (Math.random() - 0.5) * 0.01,
      lng:          r.lng !== undefined ? r.lng : lng + (Math.random() - 0.5) * 0.01,
      emoji:        FOOD_CATEGORIES[foodCategory]?.emoji || r.emoji,
      gradient:     r.gradient,
      photoUrl:     r.photoUrl || null,
      photoUrls:    r.photoUrls || [],
      bayesianScore: 0,
    } satisfies Restaurant;
  });

  const result: Restaurant[] = [];
  const usedIds = new Set<string>();
  const categoryCount: Record<string, number> = { korean: 0, japanese: 0, chinese: 0, western: 0 };

  for (const r of pool) {
    if (result.length >= 8) break;
    const cat = r.foodCategory;
    if ((categoryCount[cat] || 0) < 2) {
      result.push(r);
      usedIds.add(r.id);
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }
  }

  for (const r of pool) {
    if (result.length >= 8) break;
    if (!usedIds.has(r.id)) {
      result.push(r);
      usedIds.add(r.id);
    }
  }

  return result.slice(0, 8);
}

/* ── Main fetch function ─────────────────────────────────── */

export async function fetchRestaurantsByLocation(lat: number, lng: number): Promise<Restaurant[]> {
  const categoryKeys = Object.keys(FOOD_CATEGORIES) as FoodCategoryKey[];
  const categoryResults: Record<string, Restaurant[]> = {};

  try {
    if (hasNewPlacesApi()) {
      const results = await Promise.all(
        categoryKeys.map(key => searchCategoryNewApi(lat, lng, key))
      );
      categoryKeys.forEach((key, i) => { categoryResults[key] = results[i]; });
    } else if (hasOldPlacesApi()) {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      const results = await Promise.all(
        categoryKeys.map(key => searchCategoryOldApi(service, lat, lng, key))
      );
      categoryKeys.forEach((key, i) => { categoryResults[key] = results[i]; });
    } else {
      console.warn('No Places API available');
      return getFallbackRestaurantsByLocation(lat, lng);
    }
  } catch (e) {
    console.warn('Restaurant fetch failed:', e);
    return getFallbackRestaurantsByLocation(lat, lng);
  }

  return applyBayesianSelection(categoryResults, lat, lng);
}

/* ── Emoji marker icon helper ────────────────────────────── */

export function makeEmojiMarkerIcon(emoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
    <text y="32" x="2" font-size="28" font-family="serif">${emoji}</text>
  </svg>`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20),
  };
}
