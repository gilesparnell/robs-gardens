import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

/**
 * Check Availability - Geo-specific service availability
 *
 * Used by GHL Conversation AI to provide context-aware responses
 * to questions about service availability for specific postcodes.
 *
 * Can be called as:
 * - GET /api/check-availability?postcode=2101
 * - POST /api/check-availability with body: { postcode: "2101" }
 *
 * Returns:
 * {
 *   available: boolean,
 *   day?: string (e.g. "Monday"),
 *   area?: string (e.g. "Elanora Heights"),
 *   next_date?: string (e.g. "Monday, March 17, 2025"),
 *   message: string (AI-friendly description)
 * }
 */

type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  label: string;
};

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
    // Try to get schedule from Vercel KV
    let schedule: Zone[] | null = null;
    try {
      const stored = await kv.get('robs-garden-schedule');
      if (stored) schedule = stored as Zone[];
    } catch (kvError) {
      console.warn('[check-availability] KV read failed, falling back to static data');
    }

    // Fallback to static data
    if (!schedule) {
      try {
        const zonesJson = require('../data/zones.json');
        schedule = zonesJson.schedule || [];
      } catch (importError) {
        console.error('[check-availability] Failed to load zones.json:', importError);
        schedule = [];
      }
    }

    // Find matching postcode
    const zone = schedule.find(z => z.postcodes.includes(postcode.trim()));

    if (!zone) {
      return res.status(200).json({
        available: false,
        message: `We don't currently service postcode ${postcode}. We primarily cover the Northern Beaches and greater Sydney area. Please enter a different postcode or call us at 0468 170 318 for more information.`,
      });
    }

    // Calculate days until next service
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDay = dayNames[today.getDay()];
    let daysUntil = 0;

    // Find next occurrence of the service day
    const zoneDay = zone.day;
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() + i);
      const checkDayName = dayNames[checkDate.getDay()];

      if (checkDayName === zoneDay && i > 0) {
        daysUntil = i;
        break;
      }
    }

    if (daysUntil === 0) {
      daysUntil = 7; // If today is service day, next one is next week
    }

    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + daysUntil);

    const formatter = new Intl.DateTimeFormat('en-AU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const nextDateStr = formatter.format(nextDate);

    const area = zone.areas[0] || zone.label || postcode;

    return res.status(200).json({
      available: true,
      day: zone.day,
      area,
      next_date: nextDateStr,
      message: `Great! We service ${area} (postcode ${postcode}). We're available on ${zone.day}s, with our next service scheduled for ${nextDateStr}. Would you like to book an appointment?`,
    });
  } catch (err: any) {
    console.error('[check-availability] Error:', err);
    return res.status(500).json({
      available: false,
      message: 'Unable to check availability right now. Please call 0468 170 318 for assistance.',
      error: err.message,
    });
  }
}
