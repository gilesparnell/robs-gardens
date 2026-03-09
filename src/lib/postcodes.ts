/**
 * Australian postcode and suburb data with geocoding
 * Source: https://github.com/Elkfox/Australian-Postcode-Data
 */

export interface PostcodeEntry {
  postcode: number;
  place_name: string;
  state_name: string;
  state_code: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface SearchResult {
  postcode: string;
  suburb: string;
  state: string;
  lat: number;
  lng: number;
}

// Lazy-loaded postcode database
let postcodeCache: PostcodeEntry[] | null = null;

/**
 * Load the full Australian postcode database
 * Called on first use, cached in memory
 */
async function loadPostcodes(): Promise<PostcodeEntry[]> {
  if (postcodeCache) return postcodeCache;

  try {
    // In production, this could be loaded from a CDN or API
    // For now, we'll fetch from the GitHub source
    const response = await fetch(
      'https://raw.githubusercontent.com/Elkfox/Australian-Postcode-Data/master/au_postcodes.json'
    );
    postcodeCache = await response.json();
    return postcodeCache;
  } catch (error) {
    console.error('[Postcodes] Failed to load postcode database:', error);
    return [];
  }
}

/**
 * Search postcodes and suburbs by query string
 * Searches in postcode, place_name, and state
 * Returns up to maxResults matches
 */
export async function searchPostcodes(
  query: string,
  maxResults: number = 15
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const postcodes = await loadPostcodes();
  const lowerQuery = query.toLowerCase().trim();

  // Score and filter results
  const results = postcodes
    .map((entry) => {
      const postcodeStr = entry.postcode.toString();
      const place = entry.place_name.toLowerCase();
      const state = entry.state_code.toLowerCase();

      let score = 0;

      // Exact postcode match gets highest priority
      if (postcodeStr === lowerQuery) score += 1000;
      // Postcode prefix match
      else if (postcodeStr.startsWith(lowerQuery)) score += 500;

      // Exact suburb match
      if (place === lowerQuery) score += 300;
      // Suburb starts with query
      else if (place.startsWith(lowerQuery)) score += 150;
      // Suburb contains query
      else if (place.includes(lowerQuery)) score += 50;

      // State match
      if (state.includes(lowerQuery)) score += 10;

      return { score, entry };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ entry }) => ({
      postcode: entry.postcode.toString(),
      suburb: entry.place_name,
      state: entry.state_code,
      lat: entry.latitude,
      lng: entry.longitude,
    }));

  return results;
}

/**
 * Get all postcodes within a bounding box (for map viewport)
 * Useful for showing relevant postcodes when user zooms into an area
 */
export async function getPostcodesInBounds(
  south: number,
  west: number,
  north: number,
  east: number
): Promise<SearchResult[]> {
  const postcodes = await loadPostcodes();

  return postcodes
    .filter(
      (entry) =>
        entry.latitude >= south &&
        entry.latitude <= north &&
        entry.longitude >= west &&
        entry.longitude <= east
    )
    .map((entry) => ({
      postcode: entry.postcode.toString(),
      suburb: entry.place_name,
      state: entry.state_code,
      lat: entry.latitude,
      lng: entry.longitude,
    }));
}

/**
 * Get unique suburbs (deduplicated by suburb name per postcode)
 * Useful for building a clean list of selectable areas
 */
export async function getUniqueSuburbs(
  stateCode?: string
): Promise<SearchResult[]> {
  const postcodes = await loadPostcodes();

  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const entry of postcodes) {
    if (stateCode && entry.state_code !== stateCode) continue;

    const key = `${entry.postcode}-${entry.place_name}`;
    if (seen.has(key)) continue;

    seen.add(key);
    results.push({
      postcode: entry.postcode.toString(),
      suburb: entry.place_name,
      state: entry.state_code,
      lat: entry.latitude,
      lng: entry.longitude,
    });
  }

  return results;
}
