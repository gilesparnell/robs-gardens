import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadSchedule } from './lib/loadSchedule';
import { getWeekForDate } from './lib/weekUtils';

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
    const schedule = await loadSchedule();
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
