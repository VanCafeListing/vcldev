/**
 * The Filters sheet's criteria. Every field is optional/undefined when not
 * selected — `undefined` means "don't filter on this", matching the sheet's
 * implicit-AND-across-categories semantics. `nearest` is tracked only so the
 * chip can render as selected; it has no effect on any query (see design.md
 * — the mockup draws no alternate sort for it to toggle between).
 */
export type FilterCriteria = {
  nearest?: boolean;
  commuterFriendly?: boolean;
  easyParking?: boolean;
  wifi?: boolean;
  outlets?: boolean;
  minPrice?: number;
  maxPrice?: number;
  seatingSpacious?: boolean;
  seatingWideTables?: boolean;
  seatingPatio?: boolean;
  atmosphereQuiet?: boolean;
  atmosphereLively?: boolean;
};

export const PRICE_MIN = 5;
export const PRICE_MAX = 20;

export const EMPTY_CRITERIA: FilterCriteria = { nearest: true };

/** Whether any criterion narrows results — drives the active-filter badge. */
export function hasActiveCriteria(criteria: FilterCriteria): boolean {
  return (
    Boolean(criteria.commuterFriendly) ||
    Boolean(criteria.easyParking) ||
    Boolean(criteria.wifi) ||
    Boolean(criteria.outlets) ||
    Boolean(criteria.seatingSpacious) ||
    Boolean(criteria.seatingWideTables) ||
    Boolean(criteria.seatingPatio) ||
    Boolean(criteria.atmosphereQuiet) ||
    Boolean(criteria.atmosphereLively) ||
    (criteria.minPrice != null && criteria.minPrice > PRICE_MIN) ||
    (criteria.maxPrice != null && criteria.maxPrice < PRICE_MAX)
  );
}

/** Maps criteria to the `cafes_nearby` RPC's optional filter parameters. */
export function criteriaToRpcParams(criteria: FilterCriteria) {
  return {
    f_wifi: criteria.wifi || null,
    f_outlets: criteria.outlets || null,
    f_commuter_friendly: criteria.commuterFriendly || null,
    f_parking: criteria.easyParking || null,
    f_min_price: criteria.minPrice ?? null,
    f_max_price: criteria.maxPrice ?? null,
    f_seating_spacious: criteria.seatingSpacious || null,
    f_seating_wide_tables: criteria.seatingWideTables || null,
    f_seating_patio: criteria.seatingPatio || null,
    f_atmosphere_quiet: criteria.atmosphereQuiet || null,
    f_atmosphere_lively: criteria.atmosphereLively || null,
  };
}

/** The subset of Postgrest's filter builder `applyCriteriaToQuery` needs. */
type FilterableQuery<T> = {
  eq(column: string, value: boolean): T;
  gte(column: string, value: number): T;
  lte(column: string, value: number): T;
};

/**
 * Applies criteria to a plain Postgrest query builder (the name-ordered
 * fallback and search paths, which don't go through the `cafes_nearby` RPC).
 * Each boolean criterion becomes `.eq(column, true)`; price becomes a
 * `.gte`/`.lte` range. Chained filters combine with implicit AND.
 */
export function applyCriteriaToQuery<T extends FilterableQuery<T>>(
  query: T,
  criteria: FilterCriteria
): T {
  let q = query;

  if (criteria.wifi) q = q.eq('wifi', true);
  if (criteria.outlets) q = q.eq('outlets', true);
  if (criteria.commuterFriendly) q = q.eq('commuter_friendly', true);
  if (criteria.easyParking) q = q.eq('parking', true);
  if (criteria.seatingSpacious) q = q.eq('seating_spacious', true);
  if (criteria.seatingWideTables) q = q.eq('seating_wide_tables', true);
  if (criteria.seatingPatio) q = q.eq('seating_patio', true);
  if (criteria.atmosphereQuiet) q = q.eq('atmosphere_quiet', true);
  if (criteria.atmosphereLively) q = q.eq('atmosphere_lively', true);
  if (criteria.minPrice != null && criteria.minPrice > PRICE_MIN) {
    q = q.gte('price_range', criteria.minPrice);
  }
  if (criteria.maxPrice != null && criteria.maxPrice < PRICE_MAX) {
    q = q.lte('price_range', criteria.maxPrice);
  }

  return q;
}
