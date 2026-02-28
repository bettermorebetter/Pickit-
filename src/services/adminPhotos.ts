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
    if (hasNewPlacesApi()) return await fetchReviewDataNew(name, lat, lng);
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
    if (hasNewPlacesApi()) return await fetchAllDataNew(name, lat, lng);
    if (hasOldPlacesApi()) return await fetchAllDataOld(name, lat, lng);
  } catch (e) {
    console.warn('Restaurant data fetch failed:', e);
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
      result = await fetchPhotosViaFetchFields(name, lat, lng);
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
    let result: { reviewUrls: string[]; editorialUrls: string[] };
    if (hasNewPlacesApi()) {
      result = await fetchPhotosViaFetchFields(name, lat, lng);
    } else if (hasOldPlacesApi()) {
      result = await fetchPhotosOld(name, lat, lng);
    } else {
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
