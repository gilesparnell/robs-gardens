import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

/**
 * Get Service Areas by Day
 *
 * Used by GHL Conversation AI to answer questions like:
 * "What areas do you service on Monday?"
 * "What postcodes do you cover on Tuesday?"
 *
 * Request:
 * - GET /api/areas-by-day?day=Monday
 * - POST /api/areas-by-day with body: { day: "Monday" }
 *
 * Returns:
 * {
 *   day: string (e.g., "Monday"),
 *   label: string (e.g., "Northern Beaches Central"),
 *   areas: Array<{ name: string, postcode: string }>,
 *   message: string (AI-friendly description)
 * }
 */

type AreaPostcode = {
  area: string;
  postcode: string;
};

type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  areaPostcodes?: AreaPostcode[];
  label: string;
};

// Fallback schedule data (updated from zones.json)
const DEFAULT_SCHEDULE: Zone[] = [
  {
    day: 'Monday',
    postcodes: ['2101', '2102'],
    areas: ['Elanora Heights', 'Narrabeen', 'North Narrabeen'],
    areaPostcodes: [
      { area: 'Elanora Heights', postcode: '2101' },
      { area: 'Narrabeen', postcode: '2101' },
      { area: 'North Narrabeen', postcode: '2102' },
    ],
    label: 'Northern Beaches Central',
  },
  {
    day: 'Tuesday',
    postcodes: ['2070', '2071', '2073'],
    areas: ['Lindfield', 'Killara', 'Pymble'],
    areaPostcodes: [
      { area: 'Lindfield', postcode: '2070' },
      { area: 'Killara', postcode: '2071' },
      { area: 'Pymble', postcode: '2073' },
    ],
    label: 'Upper North Shore',
  },
  {
    day: 'Wednesday',
    postcodes: ['2103', '2104', '2105'],
    areas: ['Mona Vale', 'Bayview', 'Newport'],
    areaPostcodes: [
      { area: 'Mona Vale', postcode: '2103' },
      { area: 'Bayview', postcode: '2104' },
      { area: 'Newport', postcode: '2105' },
    ],
    label: 'Northern Beaches North',
  },
  {
    day: 'Thursday',
    postcodes: ['2067', '2068', '2069'],
    areas: ['Chatswood', 'Castlecrag', 'Roseville'],
    areaPostcodes: [
      { area: 'Chatswood', postcode: '2067' },
      { area: 'Castlecrag', postcode: '2068' },
      { area: 'Roseville', postcode: '2069' },
    ],
    label: 'Lower North Shore',
  },
  {
    day: 'Friday',
    postcodes: ['2106', '2107', '2108'],
    areas: ['Bilgola', 'Avalon', 'Palm Beach'],
    areaPostcodes: [
      { area: 'Bilgola', postcode: '2106' },
      { area: 'Avalon', postcode: '2107' },
      { area: 'Palm Beach', postcode: '2108' },
    ],
    label: 'Palm Beach / Peninsula',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const day = req.query.day || req.body?.day;

  if (!day || typeof day !== 'string') {
    return res.status(400).json({
      error: 'day parameter is required',
      message: 'Please specify a day (Monday, Tuesday, etc.)',
    });
  }

  try {
    // Try to get schedule from Vercel KV
    let schedule: Zone[] | null = null;
    try {
      const stored = await kv.get('robs-garden-schedule');
      if (stored) schedule = stored as Zone[];
    } catch (kvError) {
      console.warn('[areas-by-day] KV read failed, falling back to static data');
    }

    // Fallback to default schedule
    if (!schedule) {
      schedule = DEFAULT_SCHEDULE;
    }

    // Find the zone for this day (case-insensitive)
    const zone = schedule.find(z => z.day.toLowerCase() === day.toLowerCase());

    if (!zone) {
      // List available days
      const availableDays = schedule.map(z => z.day).join(', ');
      return res.status(200).json({
        available: false,
        message: `We don't have scheduled service for ${day}. We service on: ${availableDays}.`,
      });
    }

    // Build areas array with postcodes
    // Use the areaPostcodes mapping if available, otherwise fall back to simple mapping
    let areasWithPostcodes: Array<{ name: string; postcode: string }>;

    if (zone.areaPostcodes && zone.areaPostcodes.length > 0) {
      // Use the explicit mapping, normalizing field names (area → name)
      areasWithPostcodes = zone.areaPostcodes.map((ap) => ({
        name: ap.area,
        postcode: ap.postcode,
      }));
    } else {
      // Fallback: map areas to postcodes in order (for backwards compatibility)
      areasWithPostcodes = zone.areas.map((area, index) => ({
        name: area,
        postcode: zone.postcodes[index] || zone.postcodes[0],
      }));
    }

    // Create a detailed message for the AI to read
    const areasList = areasWithPostcodes
      .map((a) => `${a.name} (${a.postcode})`)
      .join(', ');

    const message = `On ${zone.day}s, we service the following areas: ${areasList}. Would you like to book an appointment?`;

    return res.status(200).json({
      available: true,
      day: zone.day,
      label: zone.label,
      areas: areasWithPostcodes,
      postcodes: zone.postcodes,
      message,
    });
  } catch (err: any) {
    console.error('[areas-by-day] Error:', err);
    return res.status(500).json({
      available: false,
      message: 'Unable to check service areas right now. Please call +61 468 170 318 for assistance.',
      error: err.message,
    });
  }
}
