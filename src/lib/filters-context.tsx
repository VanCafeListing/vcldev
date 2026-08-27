import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { EMPTY_CRITERIA, hasActiveCriteria, type FilterCriteria } from './filters';

type FiltersState = {
  /** The currently APPLIED criteria — what Home/Search actually query with. */
  criteria: FilterCriteria;
  /** True once at least one non-cosmetic criterion is applied. */
  isActive: boolean;
  apply: (next: FilterCriteria) => void;
  clear: () => void;
};

const FiltersContext = createContext<FiltersState | null>(null);

/**
 * Holds the current session's filter criteria, shared by the Filters modal
 * and the Home/Search screens. In-memory only — matches the mockup, which
 * shows no "saved filters" affordance, so a restart resets to none.
 */
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [criteria, setCriteria] = useState<FilterCriteria>(EMPTY_CRITERIA);

  const value = useMemo<FiltersState>(
    () => ({
      criteria,
      isActive: hasActiveCriteria(criteria),
      apply: setCriteria,
      clear: () => setCriteria(EMPTY_CRITERIA),
    }),
    [criteria]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersState {
  const state = useContext(FiltersContext);

  if (!state) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }

  return state;
}
