import { useMemo } from 'react';
import { AU_POSTCODE_MAP } from '@/lib/postcodeData';

export interface SuburbOption {
  suburb: string;
  postcode: string;
}

/**
 * Hook for autocompleting Australian suburbs by postcode map
 * Filters suburbs that match the query string (case-insensitive substring match)
 * Limits results to 12 items for performance
 */
export function useSuburbAutocomplete(query: string): SuburbOption[] {
  return useMemo(() => {
    if (query.trim().length < 2) return [];

    const lower = query.toLowerCase().trim();
    const results: SuburbOption[] = [];
    const seen = new Set<string>();

    // Iterate through postcodes and collect matching suburbs
    Object.entries(AU_POSTCODE_MAP).forEach(([postcode, suburbs]) => {
      suburbs.forEach(suburb => {
        if (suburb.toLowerCase().includes(lower) && !seen.has(suburb)) {
          seen.add(suburb);
          results.push({ suburb, postcode });
          if (results.length >= 12) return; // Limit to 12 results
        }
      });
      if (results.length >= 12) return;
    });

    return results.slice(0, 12);
  }, [query]);
}
