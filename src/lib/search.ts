import { applyCriteriaToQuery, type FilterCriteria } from './filters';
import { supabase } from './supabase';
import type { Cafe } from './cafes';

const CAFE_COLUMNS =
  'id, name, description, address, photo_url, price_range, wifi, outlets, seat_count, ' +
  'commuter_friendly, parking, seating_spacious, seating_wide_tables, seating_patio, ' +
  'atmosphere_quiet, atmosphere_lively, lat, lng';

/** Cafes whose name matches `query`, honouring any active filter criteria. */
export async function searchCafes(query: string, criteria?: FilterCriteria): Promise<Cafe[]> {
  let q = supabase.from('cafes').select(CAFE_COLUMNS).ilike('name', `%${query}%`);
  if (criteria) q = applyCriteriaToQuery(q, criteria);
  const { data, error } = await q.order('name');
  if (error) throw error;
  return (data ?? []) as unknown as Cafe[];
}

/** Curated cafes, in their admin-set order. */
export async function getRecommendedCafes(): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('cafes')
    .select(CAFE_COLUMNS)
    .not('recommended_rank', 'is', null)
    .order('recommended_rank');
  if (error) throw error;
  return (data ?? []) as unknown as Cafe[];
}

export type RecentSearch = { query: string };

/** Most recent searches first. Empty for guests — callers gate on session. */
export async function getRecentSearches(userId: string, limit = 5): Promise<RecentSearch[]> {
  const { data, error } = await supabase
    .from('recent_searches')
    .select('query')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/**
 * Records a search, bumping `updated_at` if the term was already searched
 * rather than creating a duplicate row. Best-effort: a write failure here
 * should never block the results already shown to the user.
 */
export async function recordSearch(userId: string, query: string): Promise<void> {
  const trimmed = query.trim();
  if (!trimmed) return;

  try {
    await supabase
      .from('recent_searches')
      .upsert({ user_id: userId, query: trimmed, updated_at: new Date().toISOString() }, { onConflict: 'user_id,query' });
  } catch {
    // Best-effort — see doc comment.
  }
}
