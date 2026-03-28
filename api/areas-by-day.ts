import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { getCurrentWeek } from './lib/weekUtils';

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

type WeekSchedule = {
  week: 1 | 2;
  zones: Zone[];
};

type RotatingSchedule = {
  weeks: [WeekSchedule, WeekSchedule];
  anchorDate: string;
};

// Fallback schedule data
const DEFAULT_SCHEDULE: RotatingSchedule = {
  weeks: [
    {
      week: 1,
      zones: [
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
      ],
    },
    { week: 2, zones: [] },
  ],
  anchorDate: '2026-03-30',
};

/**
 * Detect whether stored data is legacy Zone[] or new RotatingSchedule
 */
function normaliseSchedule(stored: unknown): RotatingSchedule {
  if (stored && typeof stored === 'object' && 'weeks' in (stored as Record<string, unknown>)) {
    return stored as RotatingSchedule;
  }
  // Legacy flat array — treat as Week 1 only
  if (Array.isArray(stored)) {
    return {
      weeks: [{ week: 1, zones: stored as Zone[] }, { week: 2, zones: [] }],
      anchorDate: DEFAULT_SCHEDULE.anchorDate,
    };
  }
  return DEFAULT_SCHEDULE;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const day = req.query.day || req.body?.day;
  const weekParam = req.query.week || req.body?.week;

  if (!day || typeof day !== 'string') {
    return res.status(400).json({
      error: 'day parameter is required',
      message: 'Please specify a day (Monday, Tuesday, etc.)',
    });
  }

  try {
    let schedule: RotatingSchedule;
    try {
      const stored = await kv.get('robs-garden-schedule');
      schedule = stored ? normaliseSchedule(stored) : DEFAULT_SCHEDULE;
    } catch {
      console.warn('[areas-by-day] KV read failed, falling back to static data');
      schedule = DEFAULT_SCHEDULE;
    }

    // Determine which week to query
    const weekNumber: 1 | 2 = weekParam
      ? (parseInt(String(weekParam), 10) === 2 ? 2 : 1)
      : getCurrentWeek(schedule.anchorDate);

    const weekData = schedule.weeks.find(w => w.week === weekNumber);
    const zones = weekData?.zones ?? [];

    const zone = zones.find(z => z.day.toLowerCase() === day.toLowerCase());

    if (!zone) {
      const allDays = zones.map(z => z.day);
      const availableDays = allDays.length > 0 ? allDays.join(', ') : 'none scheduled';
      return res.status(200).json({
        available: false,
        week: weekNumber,
        message: `We don't have scheduled service for ${day} in Week ${weekNumber}. Week ${weekNumber} days: ${availableDays}.`,
      });
    }

    // Build areas array with postcodes
    let areasWithPostcodes: Array<{ name: string; postcode: string }>;

    if (zone.areaPostcodes && zone.areaPostcodes.length > 0) {
      areasWithPostcodes = zone.areaPostcodes.map((ap) => ({
        name: ap.area,
        postcode: ap.postcode,
      }));
    } else {
      areasWithPostcodes = zone.areas.map((area, index) => ({
        name: area,
        postcode: zone.postcodes[index] || zone.postcodes[0],
      }));
    }

    const areasList = areasWithPostcodes
      .map((a) => `${a.name} (${a.postcode})`)
      .join(', ');

    const message = `On ${zone.day}s (Week ${weekNumber}), we service the following areas: ${areasList}. Would you like to book an appointment?`;

    return res.status(200).json({
      available: true,
      week: weekNumber,
      day: zone.day,
      label: zone.label,
      areas: areasWithPostcodes,
      postcodes: zone.postcodes,
      message,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[areas-by-day] Error:', message);
    return res.status(500).json({
      available: false,
      message: 'Unable to check service areas right now. Please call +61 468 170 318 for assistance.',
    });
  }
}
