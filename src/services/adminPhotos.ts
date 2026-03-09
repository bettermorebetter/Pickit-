/* ══════════════════════════════════════════════════════════════
   Admin Photos — Google Places photo search for restaurant editing
   Uses Place.fetchFields for maximum photo count per place.
══════════════════════════════════════════════════════════════ */

import { getPhotoUrl, hasNewPlacesApi, hasOldPlacesApi } from './places.ts';
import { PHOTO_POOLS } from '../data/photos.ts';
import { shuffle } from '../data/constants.ts';

const POOL_SIZE = 15;

/* ── Review photo detection ───────────────────────────────── */

function isReviewPhoto(photo: any): boolean {
  const attrs = photo.authorAttributions;
  if (!attrs?.length) return false;
  return attrs.some((a: any) => a.uri && a.uri.includes('maps/contrib'));
}

/**
 * Sort photos: review photos first, then editorial.
 * Returns raw photo objects (not URLs) to allow further processing.
 */
function partitionPhotos(photos: any[]): { review: any[]; editorial: any[] } {
  return {
    review: photos.filter(isReviewPhoto),
    editorial: photos.filter(p => !isReviewPhoto(p)),
  };
}

/* ── New Places API (fetchFields for max photos) ────────── */

async function findPlaceId(name: string, lat: number, lng: number): Promise<any | null> {
  const Place = (google.maps.places as any).Place;
  const searchFn = Place.searchByText || Place.searchText;
  if (!searchFn) return null;

  const { places } = await searchFn.call(Place, {
    textQuery: name,
    fields: ['id', 'displayName'],
    maxResultCount: 1,
    locationBias: { center: { lat, lng }, radius: 300 },
  });

  return places?.[0] || null;
}

async function fetchPhotosViaFetchFields(name: string, lat: number, lng: number): Promise<{ reviewUrls: string[]; editorialUrls: string[] }> {
  const Place = (google.maps.places as any).Place;
  const empty = { reviewUrls: [], editorialUrls: [] };

  // Step 1: Find place by text search
  const found = await findPlaceId(name, lat, lng);
  if (!found?.id) return empty;

  // Step 2: Use fetchFields to get all available photos
  const place = new Place({ id: found.id });
  await place.fetchFields({ fields: ['photos'] });

  if (!place.photos?.length) return empty;

  const { review, editorial } = partitionPhotos(place.photos);
  return {
    reviewUrls: review.map((p: any) => getPhotoUrl(p, true)).filter(Boolean) as string[],
    editorialUrls: editorial.map((p: any) => getPhotoUrl(p, true)).filter(Boolean) as string[],
  };
}

/* ── Old Places API ───────────────────────────────────────── */

function fetchPhotosOld(name: string, lat: number, lng: number): Promise<{ reviewUrls: string[]; editorialUrls: string[] }> {
  const empty = { reviewUrls: [], editorialUrls: [] };
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve(empty), 8000);

    svc.findPlaceFromQuery(
      { query: name, fields: ['place_id'] } as any,
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
          clearTimeout(timer);
          resolve(empty);
          return;
        }
        svc.getDetails(
          { placeId: results[0].place_id!, fields: ['photos'] },
          (place, detailStatus) => {
            clearTimeout(timer);
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !place?.photos) {
              resolve(empty);
              return;
            }
            // Old API doesn't have authorAttributions — treat all as review photos
            // but move first photo (often exterior/logo) to end
            const all = place.photos
              .map(p => getPhotoUrl(p, false))
              .filter(Boolean) as string[];
            const reordered = all.length > 1 ? [...all.slice(1), all[0]] : all;
            resolve({ reviewUrls: reordered, editorialUrls: [] });
          }
        );
      }
    );
  });
}

/* ── Review data fetch ────────────────────────────────────── */

export interface ReviewData {
  rating: number;
  reviewCount: number;
}

async function fetchReviewDataNew(name: string, lat: number, lng: number): Promise<ReviewData | null> {
  const Place = (google.maps.places as any).Place;

  const found = await findPlaceId(name, lat, lng);
  if (!found?.id) return null;

  const place = new Place({ id: found.id });
  await place.fetchFields({ fields: ['rating', 'userRatingCount'] });

  return {
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
  };
}

function fetchReviewDataOld(name: string, lat: number, lng: number): Promise<ReviewData | null> {
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve(null), 8000);

    svc.findPlaceFromQuery(
      { query: name, fields: ['place_id'] } as any,
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
          clearTimeout(timer);
          resolve(null);
          return;
        }
        svc.getDetails(
          { placeId: results[0].place_id!, fields: ['rating', 'user_ratings_total'] },
          (place, detailStatus) => {
            clearTimeout(timer);
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !place) {
              resolve(null);
              return;
            }
            resolve({
              rating: place.rating ?? 0,
              reviewCount: (place as any).user_ratings_total ?? 0,
            });
          }
        );
      }
    );
  });
}

/**
 * Fetch real rating + reviewCount for a single restaurant from Google Places API.
 */
export async function fetchReviewData(name: string, lat: number, lng: number): Promise<ReviewData | null> {
  try {
    if (hasNewPlacesApi()) {
      try { return await fetchReviewDataNew(name, lat, lng); }
      catch (_e) { /* fall through to old API */ }
    }
    if (hasOldPlacesApi()) return await fetchReviewDataOld(name, lat, lng);
  } catch (e) {
    console.warn('Review data fetch failed:', e);
  }
  return null;
}

/**
 * Combined fetch: review data + main photo in one API call per restaurant.
 * Returns rating, reviewCount, and first review photo URL.
 */
export interface RestaurantUpdateData {
  rating: number;
  reviewCount: number;
  photoUrl: string;
  photoUrls: string[];
}

async function fetchAllDataNew(name: string, lat: number, lng: number): Promise<RestaurantUpdateData | null> {
  const Place = (google.maps.places as any).Place;

  const found = await findPlaceId(name, lat, lng);
  if (!found?.id) return null;

  const place = new Place({ id: found.id });
  await place.fetchFields({ fields: ['rating', 'userRatingCount', 'photos'] });

  const { review, editorial } = partitionPhotos(place.photos || []);
  const allUrls = [
    ...review.map((p: any) => getPhotoUrl(p, true)).filter(Boolean) as string[],
    ...editorial.map((p: any) => getPhotoUrl(p, true)).filter(Boolean) as string[],
  ];
  // Deduplicate
  const seen = new Set<string>();
  const unique = allUrls.filter(url => { if (seen.has(url)) return false; seen.add(url); return true; });

  return {
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
    photoUrl: unique[0] || '',
    photoUrls: unique.slice(0, 5),
  };
}

function fetchAllDataOld(name: string, lat: number, lng: number): Promise<RestaurantUpdateData | null> {
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve(null), 8000);

    svc.findPlaceFromQuery(
      { query: name, fields: ['place_id'] } as any,
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
          clearTimeout(timer);
          resolve(null);
          return;
        }
        svc.getDetails(
          { placeId: results[0].place_id!, fields: ['rating', 'user_ratings_total', 'photos'] },
          (place, detailStatus) => {
            clearTimeout(timer);
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !place) {
              resolve(null);
              return;
            }
            const all = (place.photos || [])
              .map(p => getPhotoUrl(p, false))
              .filter(Boolean) as string[];
            // Move exterior photo to end
            const reordered = all.length > 1 ? [...all.slice(1), all[0]] : all;
            resolve({
              rating: place.rating ?? 0,
              reviewCount: (place as any).user_ratings_total ?? 0,
              photoUrl: reordered[0] || '',
              photoUrls: reordered.slice(0, 5),
            });
          }
        );
      }
    );
  });
}

/**
 * Fetch review data + food photos for a restaurant in one call.
 */
export async function fetchAllRestaurantData(name: string, lat: number, lng: number): Promise<RestaurantUpdateData | null> {
  try {
    if (hasNewPlacesApi()) {
      try { return await fetchAllDataNew(name, lat, lng); }
      catch (_e) { /* fall through to old API */ }
    }
    if (hasOldPlacesApi()) return await fetchAllDataOld(name, lat, lng);
  } catch (e) {
    console.warn('Restaurant data fetch failed:', e);
  }
  return null;
}

/* ── Fetch by Place ID ─────────────────────────────────────── */

export interface PlaceIdData {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  photoUrls: string[];
}

async function fetchByPlaceIdNew(placeId: string): Promise<PlaceIdData | null> {
  const Place = (google.maps.places as any).Place;
  const place = new Place({ id: placeId });
  await place.fetchFields({
    fields: ['displayName', 'rating', 'userRatingCount', 'formattedAddress', 'location', 'photos'],
  });

  const photos = (place.photos || [])
    .map((p: any) => getPhotoUrl(p, true))
    .filter(Boolean) as string[];

  return {
    name: place.displayName || '',
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
    address: place.formattedAddress || '',
    lat: place.location?.lat() ?? 0,
    lng: place.location?.lng() ?? 0,
    photoUrls: photos.slice(0, 10),
  };
}

function fetchByPlaceIdOld(placeId: string): Promise<PlaceIdData | null> {
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve(null), 8000);

    svc.getDetails(
      { placeId, fields: ['name', 'rating', 'user_ratings_total', 'formatted_address', 'geometry', 'photos'] },
      (place, status) => {
        clearTimeout(timer);
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          resolve(null);
          return;
        }
        const photos = (place.photos || [])
          .map(p => getPhotoUrl(p, false))
          .filter(Boolean) as string[];

        resolve({
          name: place.name || '',
          rating: place.rating ?? 0,
          reviewCount: (place as any).user_ratings_total ?? 0,
          address: (place as any).formatted_address || '',
          lat: place.geometry?.location?.lat() ?? 0,
          lng: place.geometry?.location?.lng() ?? 0,
          photoUrls: photos.slice(0, 10),
        });
      }
    );
  });
}

export async function fetchRestaurantByPlaceId(placeId: string): Promise<PlaceIdData | null> {
  try {
    if (hasNewPlacesApi()) {
      try { return await fetchByPlaceIdNew(placeId); }
      catch (_e) { /* fall through to old API */ }
    }
    if (hasOldPlacesApi()) return await fetchByPlaceIdOld(placeId);
  } catch (e) {
    console.warn('fetchRestaurantByPlaceId failed:', e);
  }
  return null;
}

/**
 * Text search with wider radius — used when we only have name + approx coordinates.
 */
async function findPlaceIdWide(name: string, lat: number, lng: number): Promise<any | null> {
  const Place = (google.maps.places as any).Place;
  const searchFn = Place.searchByText || Place.searchText;
  if (!searchFn) {
    console.warn('[findPlaceIdWide] searchByText/searchText not available');
    return null;
  }

  // Try with increasing radius: 500m → 2000m → 5000m
  for (const radius of [500, 2000, 5000]) {
    try {
      const { places } = await searchFn.call(Place, {
        textQuery: name,
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
        maxResultCount: 1,
        locationBias: { center: { lat, lng }, radius },
      });
      if (places?.[0]?.id) {
        console.log(`[findPlaceIdWide] Found "${places[0].displayName}" with radius=${radius}m`);
        return places[0];
      }
    } catch (e) {
      console.warn(`[findPlaceIdWide] searchByText failed (radius=${radius}):`, e);
    }
  }

  // Last resort: search without location bias
  try {
    const { places } = await searchFn.call(Place, {
      textQuery: `${name} 서울`,
      fields: ['id', 'displayName', 'formattedAddress', 'location'],
      maxResultCount: 1,
    });
    if (places?.[0]?.id) {
      console.log(`[findPlaceIdWide] Found "${places[0].displayName}" with no location bias`);
      return places[0];
    }
  } catch (e) {
    console.warn('[findPlaceIdWide] fallback search failed:', e);
  }

  return null;
}

/**
 * Fetch full restaurant data by text search (name + coordinates).
 * Used when we don't have a valid Place ID (e.g. ftid-based URLs).
 */
export async function fetchRestaurantBySearch(name: string, lat: number, lng: number): Promise<PlaceIdData | null> {
  console.log(`[fetchRestaurantBySearch] name="${name}", lat=${lat}, lng=${lng}`);
  console.log(`[fetchRestaurantBySearch] hasNewApi=${hasNewPlacesApi()}, hasOldApi=${hasOldPlacesApi()}`);

  // Strategy A: New Places API with wider search
  if (hasNewPlacesApi()) {
    try {
      const found = await findPlaceIdWide(name, lat, lng);
      if (found?.id) {
        console.log(`[fetchRestaurantBySearch] New API found place id: ${found.id}`);
        const result = await fetchByPlaceIdNew(found.id);
        if (result) return result;
      }
    } catch (e) {
      console.warn('[fetchRestaurantBySearch] New API failed:', e);
    }
  }

  // Strategy B: Old Places API
  if (hasOldPlacesApi()) {
    console.log('[fetchRestaurantBySearch] Trying old API...');
    try {
      const result = await new Promise<PlaceIdData | null>(resolve => {
        const svc = new google.maps.places.PlacesService(document.createElement('div'));
        const timer = setTimeout(() => {
          console.warn('[fetchRestaurantBySearch] Old API timed out');
          resolve(null);
        }, 10000);

        svc.findPlaceFromQuery(
          {
            query: name,
            fields: ['place_id', 'name', 'geometry'],
            locationBias: new google.maps.LatLng(lat, lng),
          } as any,
          (results, status) => {
            console.log(`[fetchRestaurantBySearch] findPlaceFromQuery status: ${status}, results: ${results?.length}`);
            if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]?.place_id) {
              clearTimeout(timer);
              resolve(null);
              return;
            }
            clearTimeout(timer);
            console.log(`[fetchRestaurantBySearch] Old API found: ${results[0].name} (${results[0].place_id})`);
            fetchByPlaceIdOld(results[0].place_id!).then(resolve).catch(() => resolve(null));
          }
        );
      });
      if (result) return result;
    } catch (e) {
      console.warn('[fetchRestaurantBySearch] Old API failed:', e);
    }
  }

  console.warn('[fetchRestaurantBySearch] All strategies failed');
  return null;
}

/* ── Price range fetch ─────────────────────────────────────── */

export interface PriceRange {
  min: number;
  max: number;
}

// Old API price_level → estimated Korean price range (won)
const PRICE_LEVEL_TO_RANGE: Record<number, PriceRange> = {
  1: { min: 5000, max: 10000 },
  2: { min: 10000, max: 20000 },
  3: { min: 20000, max: 40000 },
  4: { min: 40000, max: 80000 },
};

async function fetchPriceRangeNew(name: string, lat: number, lng: number): Promise<PriceRange | null> {
  const Place = (google.maps.places as any).Place;
  const found = await findPlaceId(name, lat, lng);
  if (!found?.id) return null;

  const place = new Place({ id: found.id });
  await place.fetchFields({ fields: ['priceRange'] });

  const pr = place.priceRange;
  if (!pr) return null;

  const min = Number(pr.startPrice?.units) || 0;
  const max = Number(pr.endPrice?.units) || 0;
  if (min === 0 && max === 0) return null;

  return { min, max: max || min };
}

function fetchPriceRangeOld(name: string, lat: number, lng: number): Promise<PriceRange | null> {
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve(null), 8000);

    svc.findPlaceFromQuery(
      { query: name, fields: ['place_id'] } as any,
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
          clearTimeout(timer);
          resolve(null);
          return;
        }
        svc.getDetails(
          { placeId: results[0].place_id!, fields: ['price_level'] },
          (place, detailStatus) => {
            clearTimeout(timer);
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !place) {
              resolve(null);
              return;
            }
            const level = (place as any).price_level;
            if (level == null || level === 0) { resolve(null); return; }
            resolve(PRICE_LEVEL_TO_RANGE[level] ?? null);
          }
        );
      }
    );
  });
}

export async function fetchPriceRange(name: string, lat: number, lng: number): Promise<PriceRange | null> {
  try {
    if (hasNewPlacesApi()) {
      try { return await fetchPriceRangeNew(name, lat, lng); }
      catch (_e) { /* fall through */ }
    }
    if (hasOldPlacesApi()) return await fetchPriceRangeOld(name, lat, lng);
  } catch (e) {
    console.warn('Price range fetch failed:', e);
  }
  return null;
}

/* ── Public API ────────────────────────────────────────────── */

/**
 * Fetch photos for a restaurant (initial load via edit panel).
 * Uses fetchFields for maximum photo count.
 * Returns: review photos first, then editorial, deduplicated.
 */
export async function fetchPhotosForRestaurant(
  name: string, lat: number, lng: number
): Promise<{ displaySlice: string[]; fullPool: string[] }> {
  const empty = { displaySlice: [], fullPool: [] };
  try {
    let result: { reviewUrls: string[]; editorialUrls: string[] };

    if (hasNewPlacesApi()) {
      try {
        result = await fetchPhotosViaFetchFields(name, lat, lng);
      } catch (_e) {
        if (hasOldPlacesApi()) {
          result = await fetchPhotosOld(name, lat, lng);
        } else {
          return empty;
        }
      }
    } else if (hasOldPlacesApi()) {
      result = await fetchPhotosOld(name, lat, lng);
    } else {
      return empty;
    }

    // Deduplicate: review photos first, then editorial (no duplicates)
    const seen = new Set<string>();
    const allUrls: string[] = [];
    for (const url of [...result.reviewUrls, ...result.editorialUrls]) {
      if (!seen.has(url)) {
        seen.add(url);
        allUrls.push(url);
      }
    }

    if (!allUrls.length) return empty;

    // Show first 15 (review photos come first)
    return {
      displaySlice: allUrls.slice(0, POOL_SIZE),
      fullPool: allUrls,
    };
  } catch (e) {
    console.warn('Google photo fetch failed:', e);
  }
  return empty;
}

/**
 * Refresh photos: show a different random set from the full pool.
 * If pool is exhausted, re-fetch from API.
 */
export async function fetchMorePhotos(
  name: string,
  lat: number,
  lng: number,
  existingPool: string[],
  currentDisplay: string[]
): Promise<{ displaySlice: string[]; fullPool: string[] }> {
  let pool = [...existingPool];

  // If pool has more photos than currently displayed, show different ones
  if (pool.length > POOL_SIZE) {
    // Exclude currently displayed photos, pick from remaining
    const remaining = pool.filter(url => !currentDisplay.includes(url));
    if (remaining.length >= POOL_SIZE) {
      return { displaySlice: shuffle(remaining).slice(0, POOL_SIZE), fullPool: pool };
    }
    // Not enough remaining — shuffle the whole pool for a new random set
    return { displaySlice: shuffle([...pool]).slice(0, POOL_SIZE), fullPool: pool };
  }

  // Pool too small — re-fetch to try to get more
  try {
    let result: { reviewUrls: string[]; editorialUrls: string[] } | null = null;
    if (hasNewPlacesApi()) {
      try { result = await fetchPhotosViaFetchFields(name, lat, lng); }
      catch (_e) { /* fall through to old API */ }
    }
    if (!result && hasOldPlacesApi()) {
      result = await fetchPhotosOld(name, lat, lng);
    }
    if (!result) {
      result = { reviewUrls: [], editorialUrls: [] };
    }

    const seen = new Set(pool);
    for (const url of [...result.reviewUrls, ...result.editorialUrls]) {
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  } catch (e) {
    console.warn('Refresh photo fetch failed:', e);
  }

  // Show a shuffled set different from current display
  let displaySlice = shuffle([...pool]).slice(0, POOL_SIZE);

  // Fallback to generic food photos if empty
  if (!displaySlice.length) {
    displaySlice = shuffle(Object.values(PHOTO_POOLS).flat()).slice(0, POOL_SIZE);
  }

  return { displaySlice, fullPool: pool };
}
