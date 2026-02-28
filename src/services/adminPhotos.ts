/* ══════════════════════════════════════════════════════════════
   Admin Photos — Google Places photo search for restaurant editing
══════════════════════════════════════════════════════════════ */

import { getPhotoUrl, hasNewPlacesApi, hasOldPlacesApi } from './places.ts';
import { PHOTO_POOLS } from '../data/photos.ts';
import { shuffle } from '../data/constants.ts';

const POOL_SIZE = 15;
const FETCH_LIMIT = 30;

/* ── Review photo detection ───────────────────────────────── */

function isReviewPhoto(photo: any): boolean {
  const attrs = photo.authorAttributions;
  if (!attrs?.length) return false;
  return attrs.some((a: any) => a.uri && a.uri.includes('maps/contrib'));
}

function sortPhotosByReview(photos: any[]): string[] {
  const reviewPhotos = photos.filter(isReviewPhoto);
  const editorialPhotos = photos.filter(p => !isReviewPhoto(p));
  return [...reviewPhotos, ...editorialPhotos]
    .map(p => getPhotoUrl(p, true))
    .filter(Boolean) as string[];
}

/* ── New Places API ───────────────────────────────────────── */

async function fetchPhotosNew(name: string, lat: number, lng: number, maxResults = 1): Promise<string[]> {
  const Place = (google.maps.places as any).Place;
  const searchFn = Place.searchByText || Place.searchText;
  if (!searchFn) return [];

  const { places } = await searchFn.call(Place, {
    textQuery: name,
    fields: ['photos', 'id', 'displayName'],
    maxResultCount: maxResults,
    locationBias: { center: { lat, lng }, radius: 300 },
  });

  if (maxResults === 1) {
    if (!places?.[0]?.photos?.length) return [];
    return sortPhotosByReview(places[0].photos);
  }

  // Multiple results: gather all photos, review-first
  const allPhotos = (places || []).flatMap((pl: any) => pl.photos || []);
  const reviewPhotos = allPhotos.filter(isReviewPhoto);
  const editorialPhotos = allPhotos.filter((p: any) => !isReviewPhoto(p));
  return [...reviewPhotos, ...editorialPhotos]
    .map((p: any) => getPhotoUrl(p, true))
    .filter(Boolean) as string[];
}

/* ── Old Places API ───────────────────────────────────────── */

function fetchPhotosOld(name: string, lat: number, lng: number): Promise<string[]> {
  return new Promise(resolve => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    const timer = setTimeout(() => resolve([]), 8000);

    svc.findPlaceFromQuery(
      {
        query: name + ' 음식',
        fields: ['place_id'],
      } as any,
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
          clearTimeout(timer);
          resolve([]);
          return;
        }
        svc.getDetails(
          { placeId: results[0].place_id!, fields: ['photos'] },
          (place, detailStatus) => {
            clearTimeout(timer);
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !place?.photos) {
              resolve([]);
              return;
            }
            const all = place.photos.slice(0, POOL_SIZE + 1)
              .map(p => getPhotoUrl(p, false))
              .filter(Boolean) as string[];
            // Put first photo (often exterior/logo) last so food shots come first
            resolve((all.length > 1 ? [...all.slice(1), all[0]] : all).slice(0, POOL_SIZE));
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
  const searchFn = Place.searchByText || Place.searchText;
  if (!searchFn) return null;

  const { places } = await searchFn.call(Place, {
    textQuery: name,
    fields: ['rating', 'userRatingCount', 'displayName'],
    maxResultCount: 1,
    locationBias: { center: { lat, lng }, radius: 300 },
  });

  if (!places?.[0]) return null;
  const p = places[0];
  return {
    rating: p.rating ?? 0,
    reviewCount: p.userRatingCount ?? 0,
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

/* ── Public API ────────────────────────────────────────────── */

/**
 * Fetch photos for a restaurant (initial load).
 */
export async function fetchPhotosForRestaurant(
  name: string, lat: number, lng: number
): Promise<string[]> {
  try {
    if (hasNewPlacesApi()) {
      return await fetchPhotosNew(name, lat, lng);
    } else if (hasOldPlacesApi()) {
      return await fetchPhotosOld(name, lat, lng);
    }
  } catch (e) {
    console.warn('Google photo fetch failed:', e);
  }
  return [];
}

/**
 * Fetch more photos and return a display slice + accumulated pool.
 * Review photos are shown first (up to 15), then non-duplicate editorial photos.
 */
export async function fetchMorePhotos(
  name: string,
  lat: number,
  lng: number,
  existingPool: string[]
): Promise<{ displaySlice: string[]; fullPool: string[] }> {
  const seen = new Set(existingPool);
  let newUrls = [...existingPool];

  try {
    if (hasNewPlacesApi()) {
      const photos = await fetchPhotosNew(name, lat, lng, 3);
      for (const url of photos) {
        if (!seen.has(url)) {
          seen.add(url);
          newUrls.push(url);
        }
      }
      newUrls = newUrls.slice(0, FETCH_LIMIT);
    } else if (hasOldPlacesApi()) {
      const fetched = await fetchPhotosOld(name, lat, lng);
      for (const url of fetched) {
        if (!seen.has(url)) {
          seen.add(url);
          newUrls.push(url);
        }
      }
    }
  } catch (e) {
    console.warn('Refresh photo fetch failed:', e);
  }

  // Review photos already come first from sortPhotosByReview — keep that order, no shuffle
  let displaySlice = newUrls.slice(0, POOL_SIZE);

  // Fallback to generic food photos if empty
  if (!displaySlice.length) {
    displaySlice = shuffle(Object.values(PHOTO_POOLS).flat()).slice(0, POOL_SIZE);
  }

  return { displaySlice, fullPool: newUrls };
}
