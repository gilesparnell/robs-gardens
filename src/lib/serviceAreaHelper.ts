/**
 * Generate service area text from schedule configuration
 * Used to dynamically update the Hero and Contact components
 */

export type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  label: string;
};

/**
 * Generate a readable service area summary from zones
 * Examples:
 * - "Northern Beaches & Greater Sydney, NSW"
 * - "Northern Beaches, Eastern Suburbs & Penrith, NSW"
 */
export function generateServiceAreaText(zones: Zone[]): string {
  if (!zones || zones.length === 0) {
    return 'Northern Beaches & Greater Sydney, NSW';
  }

  // Collect all unique zone labels
  const labels = Array.from(new Set(zones.map(z => z.label).filter(Boolean)));

  if (labels.length === 0) {
    return 'Northern Beaches & Greater Sydney, NSW';
  }

  // If only one label, use it
  if (labels.length === 1) {
    return `${labels[0]}, NSW`;
  }

  // If 2-3 labels, join with &
  if (labels.length <= 3) {
    const joined = labels.slice(0, -1).join(', ') + ' & ' + labels[labels.length - 1];
    return `${joined}, NSW`;
  }

  // If more than 3, use first 3 + "& more"
  const joined = labels.slice(0, 2).join(', ') + ' & Greater Sydney, NSW';
  return joined;
}

/**
 * Generate service area description for contact card
 * Example: "Homes, strata, business parks & aged care"
 */
export function generateServiceAreaDescription(zones: Zone[]): string {
  const serviceTypes = [
    'Homes',
    'Strata',
    'Business parks',
    'Aged care',
    'Residential properties',
    'Commercial spaces',
  ];

  // Return standard description - could be expanded based on zone types in future
  return 'Homes, strata, business parks & aged care';
}
