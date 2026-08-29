import { applyCriteriaToQuery, criteriaToRpcParams, type FilterCriteria } from './filters';
import { supabase } from './supabase';
import type { UserLocation } from './use-user-location';

/**
 * A cafe as returned by both `getNearbyCafes` and `getCafesFallback` — the
 * shared shape the Home feed and Cafe detail screen render from.
 *
 * `distance_meters` is only present when the query could compute it (i.e.
 * `getNearbyCafes`); the fallback path omits per-card distance entirely
 * rather than inventing one.
 */
export type Cafe = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  photo_url: string | null;
  price_range: number | null;
  wifi: boolean;
  outlets: boolean;
  seat_count: number | null;
  commuter_friendly: boolean;
  parking: boolean;
  seating_spacious: boolean;
  seating_wide_tables: boolean;
  seating_patio: boolean;
  atmosphere_quiet: boolean;
  atmosphere_lively: boolean;
  lat: number | null;
  lng: number | null;
  /** Google Places fields, synced by `scripts/sync-places.mjs`. */
  google_place_id: string | null;
  rating: number | null;
  user_ratings_total: number | null;
  website: string | null;
  phone: string | null;
  distance_meters?: number;
};

/** Shared by every cafe-shaped select so no caller's column list can drift. */
export const CAFE_COLUMNS =
  'id, name, description, address, photo_url, price_range, wifi, outlets, seat_count, ' +
  'commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio, ' +
  'atmosphere_quiet, atmosphere_lively, lat, lng, google_place_id, rating, ' +
  'user_ratings_total, website, phone';

/** Nearest-first, via the `cafes_nearby` RPC — requires a resolved location. */
export async function getNearbyCafes(
  lat: number,
  lng: number,
  criteria?: FilterCriteria
): Promise<Cafe[]> {
  const { data, error } = await supabase.rpc('cafes_nearby', {
    user_lat: lat,
    user_lng: lng,
    ...(criteria ? criteriaToRpcParams(criteria) : {}),
  });
  if (error) throw error;
  return (data ?? []) as Cafe[];
}

/** Name-ordered fallback for when location permission is denied. */
export async function getCafesFallback(criteria?: FilterCriteria): Promise<Cafe[]> {
  let query = supabase.from('cafes').select(CAFE_COLUMNS);
  if (criteria) query = applyCriteriaToQuery(query, criteria);
  const { data, error } = await query.order('name');
  if (error) throw error;
  return (data ?? []) as unknown as Cafe[];
}

/**
 * Home and Map read the exact same cafe list, so they (and the preloader)
 * build the query from this one place — a key/queryFn built separately in
 * each screen would silently stop sharing a cache entry the moment either
 * one drifted from the other.
 */
export function cafesQueryOptions(location: UserLocation, criteria?: FilterCriteria) {
  return {
    queryKey: [
      'cafes',
      location.status === 'granted' ? location.coords : 'fallback',
      criteria,
    ] as const,
    queryFn: () =>
      location.status === 'granted'
        ? getNearbyCafes(location.coords.lat, location.coords.lng, criteria)
        : getCafesFallback(criteria),
  };
}

export async function getCafeById(id: string): Promise<Cafe | null> {
  const { data, error } = await supabase
    .from('cafes')
    .select(CAFE_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Cafe | null;
}
