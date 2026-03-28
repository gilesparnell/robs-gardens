import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadSchedule } from './lib/loadSchedule';
import { getCurrentWeek } from './lib/weekUtils';

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
    const schedule = await loadSchedule();

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
