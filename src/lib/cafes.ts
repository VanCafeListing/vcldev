import { supabase } from './supabase';

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
  distance_meters?: number;
};

const CAFE_COLUMNS =
  'id, name, description, address, photo_url, price_range, wifi, outlets, seat_count, ' +
  'commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio, ' +
  'atmosphere_quiet, atmosphere_lively, lat, lng';

/** Nearest-first, via the `cafes_nearby` RPC — requires a resolved location. */
export async function getNearbyCafes(lat: number, lng: number): Promise<Cafe[]> {
  const { data, error } = await supabase.rpc('cafes_nearby', { user_lat: lat, user_lng: lng });
  if (error) throw error;
  return (data ?? []) as Cafe[];
}

/** Name-ordered fallback for when location permission is denied. */
export async function getCafesFallback(): Promise<Cafe[]> {
  const { data, error } = await supabase.from('cafes').select(CAFE_COLUMNS).order('name');
  if (error) throw error;
  return (data ?? []) as unknown as Cafe[];
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
