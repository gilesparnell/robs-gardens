/**
 * Suburb coordinates for NSW service areas
 * Lat/Lng pairs for Northern Beaches, Greater Sydney
 * Used by SelectAreaMap for map pin placement
 */

export type SuburbCoord = {
  suburb: string;
  lat: number;
  lng: number;
  postcodes: string[];
};

export type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  label: string;
};

// Comprehensive list of NSW suburbs with coordinates
// Data sourced from Australian Bureau of Statistics
export const SUBURB_COORDINATES: SuburbCoord[] = [
  // Northern Beaches (Monday)
  { suburb: 'Elanora Heights', lat: -33.7542, lng: 151.3024, postcodes: ['2101'] },
  { suburb: 'Narrabeen', lat: -33.7283, lng: 151.2885, postcodes: ['2101'] },
  { suburb: 'Collaroy', lat: -33.7207, lng: 151.2850, postcodes: ['2097'] },
  { suburb: 'Dee Why', lat: -33.7355, lng: 151.2803, postcodes: ['2099'] },
  { suburb: 'Frenchs Forest', lat: -33.7459, lng: 151.2511, postcodes: ['2086'] },
  { suburb: 'Manly', lat: -33.7996, lng: 151.2829, postcodes: ['2095'] },
  { suburb: 'Cremorne', lat: -33.8408, lng: 151.2320, postcodes: ['2090'] },
  { suburb: 'Neutral Bay', lat: -33.8375, lng: 151.2270, postcodes: ['2089'] },
  { suburb: 'North Sydney', lat: -33.8410, lng: 151.2107, postcodes: ['2060'] },
  { suburb: 'Mosman', lat: -33.8328, lng: 151.2425, postcodes: ['2088'] },
  { suburb: 'Palm Beach', lat: -33.5946, lng: 151.3226, postcodes: ['2108'] },
  { suburb: 'Whale Beach', lat: -33.5834, lng: 151.3180, postcodes: ['2107'] },

  // Upper North Shore (Tuesday)
  { suburb: 'Chatswood', lat: -33.7969, lng: 151.1884, postcodes: ['2067'] },
  { suburb: 'Hornsby', lat: -33.7020, lng: 151.1856, postcodes: ['2077'] },
  { suburb: 'Killara', lat: -33.7315, lng: 151.1717, postcodes: ['2071'] },
  { suburb: 'Lindfield', lat: -33.7256, lng: 151.1649, postcodes: ['2070'] },
  { suburb: 'Pymble', lat: -33.7396, lng: 151.1773, postcodes: ['2073'] },
  { suburb: 'St Ives', lat: -33.6945, lng: 151.1865, postcodes: ['2075'] },
  { suburb: 'Turramurra', lat: -33.7168, lng: 151.1511, postcodes: ['2074'] },
  { suburb: 'Pennant Hills', lat: -33.7524, lng: 151.1680, postcodes: ['2069'] },

  // Eastern Suburbs (Wednesday)
  { suburb: 'Bondi', lat: -33.8901, lng: 151.2754, postcodes: ['2026'] },
  { suburb: 'Coogee', lat: -33.9226, lng: 151.2511, postcodes: ['2034'] },
  { suburb: 'Maroubra', lat: -33.9570, lng: 151.2380, postcodes: ['2035'] },
  { suburb: 'Randwick', lat: -33.9224, lng: 151.2240, postcodes: ['2031'] },
  { suburb: 'Kingsford', lat: -33.9372, lng: 151.2139, postcodes: ['2032'] },
  { suburb: 'Zetland', lat: -33.9161, lng: 151.2022, postcodes: ['2017'] },
  { suburb: 'Daceyville', lat: -33.9122, lng: 151.1891, postcodes: ['2032'] },

  // Penrith Area (Thursday)
  { suburb: 'Penrith', lat: -33.7616, lng: 150.6689, postcodes: ['2750'] },
  { suburb: 'Kingswood', lat: -33.8087, lng: 150.6824, postcodes: ['2747'] },
  { suburb: 'Werrington', lat: -33.7750, lng: 150.6536, postcodes: ['2747'] },
  { suburb: 'Emu Plains', lat: -33.8233, lng: 150.7054, postcodes: ['2750'] },
  { suburb: 'St Marys', lat: -33.7839, lng: 150.7539, postcodes: ['2760'] },

  // Inner West (Friday)
  { suburb: 'Marrickville', lat: -33.9111, lng: 151.1469, postcodes: ['2204'] },
  { suburb: 'Dulwich Hill', lat: -33.9155, lng: 151.1299, postcodes: ['2203'] },
  { suburb: 'Ashfield', lat: -33.8878, lng: 151.1211, postcodes: ['2131'] },
  { suburb: 'Leichhardt', lat: -33.8918, lng: 151.1693, postcodes: ['2040'] },
  { suburb: 'Petersham', lat: -33.8970, lng: 151.1457, postcodes: ['2049'] },
  { suburb: 'Stanmore', lat: -33.8855, lng: 151.1147, postcodes: ['2048'] },
  { suburb: 'Enmore', lat: -33.8853, lng: 151.1620, postcodes: ['2042'] },
  { suburb: 'Newtown', lat: -33.8995, lng: 151.1760, postcodes: ['2042'] },
];

/**
 * Get coordinates for a specific suburb
 */
export function getSuburbCoordinates(suburb: string): SuburbCoord | undefined {
  return SUBURB_COORDINATES.find(
    s => s.suburb.toLowerCase() === suburb.toLowerCase()
  );
}

/**
 * Get all suburbs for a specific day
 * Requires schedule data to determine day mappings
 */
export function getSuburbsByDay(day: string, schedule: Zone[]): SuburbCoord[] {
  const zone = schedule.find(z => z.day === day);
  if (!zone) return [];

  return SUBURB_COORDINATES.filter(coord =>
    zone.areas.some((area: string) => area.toLowerCase() === coord.suburb.toLowerCase())
  );
}
