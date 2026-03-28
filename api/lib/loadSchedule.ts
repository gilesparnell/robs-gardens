import { list } from '@vercel/blob';

type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  areaPostcodes?: { area: string; postcode: string }[];
  label: string;
};

type WeekSchedule = {
  week: 1 | 2;
  zones: Zone[];
};

export type RotatingSchedule = {
  weeks: WeekSchedule[];
  anchorDate: string;
};

const BLOB_PATH = 'robs-garden-schedule.json';

const DEFAULT_SCHEDULE: RotatingSchedule = {
  weeks: [
    {
      week: 1,
      zones: [
        { day: 'Monday', postcodes: ['2101', '2102'], areas: ['Elanora Heights', 'Narrabeen', 'North Narrabeen'], areaPostcodes: [{ area: 'Elanora Heights', postcode: '2101' }, { area: 'Narrabeen', postcode: '2101' }, { area: 'North Narrabeen', postcode: '2102' }], label: 'Northern Beaches Central' },
        { day: 'Tuesday', postcodes: ['2070', '2071', '2073'], areas: ['Lindfield', 'Killara', 'Pymble'], areaPostcodes: [{ area: 'Lindfield', postcode: '2070' }, { area: 'Killara', postcode: '2071' }, { area: 'Pymble', postcode: '2073' }], label: 'Upper North Shore' },
        { day: 'Wednesday', postcodes: ['2103', '2104', '2105'], areas: ['Mona Vale', 'Bayview', 'Newport'], areaPostcodes: [{ area: 'Mona Vale', postcode: '2103' }, { area: 'Bayview', postcode: '2104' }, { area: 'Newport', postcode: '2105' }], label: 'Northern Beaches North' },
        { day: 'Thursday', postcodes: ['2067', '2068', '2069'], areas: ['Chatswood', 'Castlecrag', 'Roseville'], areaPostcodes: [{ area: 'Chatswood', postcode: '2067' }, { area: 'Castlecrag', postcode: '2068' }, { area: 'Roseville', postcode: '2069' }], label: 'Lower North Shore' },
        { day: 'Friday', postcodes: ['2106', '2107', '2108'], areas: ['Bilgola', 'Avalon', 'Palm Beach'], areaPostcodes: [{ area: 'Bilgola', postcode: '2106' }, { area: 'Avalon', postcode: '2107' }, { area: 'Palm Beach', postcode: '2108' }], label: 'Palm Beach / Peninsula' },
      ],
    },
    { week: 2, zones: [] },
  ],
  anchorDate: '2026-03-30',
};

export async function loadSchedule(): Promise<RotatingSchedule> {
  try {
    // List blobs to find our schedule file
    const { blobs } = await list({ prefix: BLOB_PATH });
    const blob = blobs[0];

    if (!blob) {
      return DEFAULT_SCHEDULE;
    }

    const response = await fetch(blob.url);
    const data = await response.json();

    // Handle legacy flat array format
    if (Array.isArray(data)) {
      return {
        weeks: [{ week: 1, zones: data }, { week: 2, zones: [] }],
        anchorDate: DEFAULT_SCHEDULE.anchorDate,
      };
    }

    if (data && data.weeks) {
      return data as RotatingSchedule;
    }

    return DEFAULT_SCHEDULE;
  } catch {
    console.warn('[loadSchedule] Blob read failed, using static fallback');
    return DEFAULT_SCHEDULE;
  }
}
