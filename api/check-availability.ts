import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { getWeekForDate } from './lib/weekUtils';

type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
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
        { day: 'Monday', postcodes: ['2101', '2102'], areas: ['Elanora Heights', 'Narrabeen', 'North Narrabeen'], label: 'Northern Beaches Central' },
        { day: 'Tuesday', postcodes: ['2070', '2071', '2073'], areas: ['Lindfield', 'Killara', 'Pymble'], label: 'Upper North Shore' },
        { day: 'Wednesday', postcodes: ['2103', '2104', '2105'], areas: ['Mona Vale', 'Bayview', 'Newport'], label: 'Northern Beaches North' },
        { day: 'Thursday', postcodes: ['2067', '2068', '2069'], areas: ['Chatswood', 'Castlecrag', 'Roseville'], label: 'Lower North Shore' },
        { day: 'Friday', postcodes: ['2106', '2107', '2108'], areas: ['Bilgola', 'Avalon', 'Palm Beach'], label: 'Palm Beach / Peninsula' },
      ],
    },
    { week: 2, zones: [] },
  ],
  anchorDate: '2026-03-30',
};

function normaliseSchedule(stored: unknown): RotatingSchedule {
  if (stored && typeof stored === 'object' && 'weeks' in (stored as Record<string, unknown>)) {
    return stored as RotatingSchedule;
  }
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

  const postcode = req.query.postcode || req.body?.postcode;

  if (!postcode || typeof postcode !== 'string') {
    return res.status(400).json({
      error: 'postcode is required',
      available: false,
      message: 'Please provide a postcode to check availability.',
    });
  }

  try {
    let schedule: RotatingSchedule;
    try {
      const stored = await kv.get('robs-garden-schedule');
      schedule = stored ? normaliseSchedule(stored) : DEFAULT_SCHEDULE;
    } catch {
      console.warn('[check-availability] KV read failed, falling back to static data');
      schedule = DEFAULT_SCHEDULE;
    }

    const trimmedPostcode = postcode.trim();

    // Search BOTH weeks for matches
    type Match = { week: 1 | 2; day: string; area: string; label: string; nextDate: string };
    const matches: Match[] = [];

    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formatter = new Intl.DateTimeFormat('en-AU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    for (const weekData of schedule.weeks) {
      const zone = weekData.zones.find(z => z.postcodes.includes(trimmedPostcode));
      if (!zone) continue;

      // Find next occurrence of this week+day combination within the next 14 days
      for (let i = 1; i <= 14; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDayName = dayNames[checkDate.getDay()];
        const checkWeek = getWeekForDate(schedule.anchorDate, checkDate);

        if (checkDayName === zone.day && checkWeek === weekData.week) {
          matches.push({
            week: weekData.week,
            day: zone.day,
            area: zone.areas[0] || zone.label || trimmedPostcode,
            label: zone.label,
            nextDate: formatter.format(checkDate),
          });
          break;
        }
      }
    }

    if (matches.length === 0) {
      return res.status(200).json({
        available: false,
        message: `We don't currently service postcode ${trimmedPostcode}. We primarily cover the Northern Beaches and greater Sydney area. Please enter a different postcode or call us at +61 468 170 318 for more information.`,
      });
    }

    // Sort by soonest next date (first match found is already soonest due to 1-14 day scan)
    const soonest = matches[0];

    // Build message
    let message: string;
    if (matches.length === 1) {
      message = `Great! We service ${soonest.area} (postcode ${trimmedPostcode}). We're available on ${soonest.day}s (Week ${soonest.week}), with our next service scheduled for ${soonest.nextDate}. Would you like to book an appointment?`;
    } else {
      const parts = matches.map(m => `${m.day}s (Week ${m.week})`);
      message = `Great! We service postcode ${trimmedPostcode}. We're available on ${parts.join(' and ')}. Our next service is ${soonest.nextDate}. Would you like to book an appointment?`;
    }

    return res.status(200).json({
      available: true,
      // Top-level fields for backward compat with GHL
      day: soonest.day,
      area: soonest.area,
      week: soonest.week,
      next_date: soonest.nextDate,
      // Full matches array
      matches,
      message,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[check-availability] Error:', errMsg);
    return res.status(500).json({
      available: false,
      message: 'Unable to check availability right now. Please call +61 468 170 318 for assistance.',
    });
  }
}
