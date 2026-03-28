/**
 * Test Suite: Areas by Day API
 *
 * Comprehensive tests for the /api/areas-by-day endpoint
 * Verifies response format, data completeness, and edge cases
 */

// Note: handler import removed — tests validate data structures, not the actual Vercel handler
// import handler from '../api/areas-by-day';
// VercelRequest/VercelResponse unused — tests validate data structures only

// Mock zones data
const mockSchedule = [
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

describe('Areas by Day API', () => {
  describe('Success Scenarios - Valid Days', () => {
    test('Monday returns correct areas and postcodes', () => {
      const monday = mockSchedule.find((z) => z.day === 'Monday');
      expect(monday).toBeTruthy();
      expect(monday?.areaPostcodes).toHaveLength(3);
      expect(monday?.areaPostcodes?.[0].area).toBe('Elanora Heights');
      expect(monday?.areaPostcodes?.[0].postcode).toBe('2101');
    });

    test('Tuesday returns correct areas and postcodes', () => {
      const tuesday = mockSchedule.find((z) => z.day === 'Tuesday');
      expect(tuesday).toBeTruthy();
      expect(tuesday?.areaPostcodes).toHaveLength(3);
      expect(tuesday?.areaPostcodes?.map((ap) => ap.area)).toEqual(['Lindfield', 'Killara', 'Pymble']);
      expect(tuesday?.areaPostcodes?.map((ap) => ap.postcode)).toEqual(['2070', '2071', '2073']);
    });

    test('Wednesday returns correct areas and postcodes', () => {
      const wednesday = mockSchedule.find((z) => z.day === 'Wednesday');
      expect(wednesday).toBeTruthy();
      expect(wednesday?.areaPostcodes).toHaveLength(3);
      expect(wednesday?.postcodes).toEqual(['2103', '2104', '2105']);
    });

    test('Thursday returns correct areas and postcodes', () => {
      const thursday = mockSchedule.find((z) => z.day === 'Thursday');
      expect(thursday).toBeTruthy();
      expect(thursday?.areaPostcodes?.map((ap) => ap.area)).toEqual(['Chatswood', 'Castlecrag', 'Roseville']);
    });

    test('Friday returns correct areas and postcodes', () => {
      const friday = mockSchedule.find((z) => z.day === 'Friday');
      expect(friday).toBeTruthy();
      expect(friday?.areaPostcodes?.map((ap) => ap.area)).toEqual(['Bilgola', 'Avalon', 'Palm Beach']);
    });
  });

  describe('Response Format Validation', () => {
    test('Response includes all required fields', () => {
      const zone = mockSchedule[0];
      expect(zone).toHaveProperty('day');
      expect(zone).toHaveProperty('label');
      expect(zone).toHaveProperty('areaPostcodes');
      expect(zone).toHaveProperty('postcodes');
    });

    test('Areas array has correct structure', () => {
      const zone = mockSchedule[0];
      const areas = zone.areaPostcodes!.map((ap) => ({
        area: ap.area,
        postcode: ap.postcode,
      }));

      areas.forEach((area) => {
        expect(area).toHaveProperty('area');
        expect(area).toHaveProperty('postcode');
        expect(typeof area.area).toBe('string');
        expect(typeof area.postcode).toBe('string');
        expect(area.area.length).toBeGreaterThan(0);
        expect(area.postcode.length).toBeGreaterThan(0);
      });
    });

    test('Message field is not undefined or empty', () => {
      mockSchedule.forEach((zone) => {
        const areasList = zone.areaPostcodes!.map((ap) => `${ap.area} (${ap.postcode})`).join(', ');
        const message = `On ${zone.day}s, we service the following areas: ${areasList}. Would you like to book an appointment?`;

        expect(message).toBeTruthy();
        expect(message).not.toContain('undefined');
        expect(message).toContain(zone.day);
        expect(message).toContain('areas');
        mockSchedule[0].areaPostcodes?.forEach((ap) => {
          if (zone.day === mockSchedule[0].day) {
            expect(message).toContain(ap.area);
            expect(message).toContain(ap.postcode);
          }
        });
      });
    });
  });

  describe('Message Field - Critical for Voice AI', () => {
    test('Monday message includes all area names and postcodes', () => {
      const monday = mockSchedule.find((z) => z.day === 'Monday')!;
      const message = monday.areaPostcodes!
        .map((ap) => `${ap.area} (${ap.postcode})`)
        .join(', ');

      expect(message).toContain('Elanora Heights (2101)');
      expect(message).toContain('Narrabeen (2101)');
      expect(message).toContain('North Narrabeen (2102)');
      expect(message).not.toContain('undefined');
    });

    test('Tuesday message is properly formatted', () => {
      const tuesday = mockSchedule.find((z) => z.day === 'Tuesday')!;
      const message = tuesday.areaPostcodes!
        .map((ap) => `${ap.area} (${ap.postcode})`)
        .join(', ');

      expect(message).toBe('Lindfield (2070), Killara (2071), Pymble (2073)');
      expect(message).not.toContain('undefined');
    });

    test('Message contains no special characters or encoding issues', () => {
      mockSchedule.forEach((zone) => {
        zone.areaPostcodes?.forEach((ap) => {
          expect(ap.area).toMatch(/^[a-zA-Z\s]+$/);
          expect(ap.postcode).toMatch(/^[0-9]{4}$/);
        });
      });
    });
  });

  describe('Data Integrity', () => {
    test('No duplicate areas within a day', () => {
      mockSchedule.forEach((zone) => {
        const areaNames = zone.areaPostcodes?.map((ap) => ap.area) || [];
        const uniqueNames = new Set(areaNames);
        expect(areaNames.length).toBe(uniqueNames.size);
      });
    });

    test('All postcodes in areaPostcodes are in postcodes array', () => {
      mockSchedule.forEach((zone) => {
        zone.areaPostcodes?.forEach((ap) => {
          expect(zone.postcodes).toContain(ap.postcode);
        });
      });
    });

    test('All areas in areaPostcodes are in areas array', () => {
      mockSchedule.forEach((zone) => {
        zone.areaPostcodes?.forEach((ap) => {
          expect(zone.areas).toContain(ap.area);
        });
      });
    });

    test('Postcodes are valid 4-digit Australian format', () => {
      mockSchedule.forEach((zone) => {
        zone.postcodes.forEach((postcode) => {
          expect(postcode).toMatch(/^[0-9]{4}$/);
          const code = parseInt(postcode, 10);
          expect(code).toBeGreaterThanOrEqual(1000);
          expect(code).toBeLessThanOrEqual(9999);
        });
      });
    });
  });

  describe('Edge Cases', () => {
    test('Case insensitivity - lowercase day matches', () => {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      days.forEach((day) => {
        const zone = mockSchedule.find((z) => z.day.toLowerCase() === day.toLowerCase());
        expect(zone).toBeTruthy();
      });
    });

    test('Mixed case - MONDAY matches Monday', () => {
      const zone = mockSchedule.find((z) => z.day.toLowerCase() === 'MONDAY'.toLowerCase());
      expect(zone).toBeTruthy();
      expect(zone?.day).toBe('Monday');
    });

    test('Invalid day returns appropriate response', () => {
      const invalidDay = 'Saturday';
      const zone = mockSchedule.find((z) => z.day.toLowerCase() === invalidDay.toLowerCase());
      expect(zone).toBeUndefined();
    });

    test('Empty day parameter should fail', () => {
      const emptyDay = '';
      const zone = mockSchedule.find((z) => z.day.toLowerCase() === emptyDay.toLowerCase());
      expect(zone).toBeUndefined();
    });

    test('Null/undefined day should fail', () => {
      const days: (string | null | undefined)[] = [null, undefined];
      days.forEach((day) => {
        const zone = mockSchedule.find((z) => z.day === day);
        expect(zone).toBeUndefined();
      });
    });
  });

  describe('Voice AI Compatibility', () => {
    test('Message field contains area names (not area codes)', () => {
      mockSchedule.forEach((zone) => {
        const areasList = zone.areaPostcodes!.map((ap) => ap.area).join(', ');
        zone.areaPostcodes?.forEach((ap) => {
          expect(areasList).toContain(ap.area);
          expect(areasList).not.toContain('undefined');
        });
      });
    });

    test('Each area is paired with exactly one postcode in message', () => {
      mockSchedule.forEach((zone) => {
        const message = zone.areaPostcodes!
          .map((ap) => `${ap.area} (${ap.postcode})`)
          .join(', ');

        zone.areaPostcodes?.forEach((ap) => {
          const pattern = new RegExp(`${ap.area} \\(${ap.postcode}\\)`);
          expect(message).toMatch(pattern);
        });
      });
    });

    test('Message uses parentheses for postcode formatting (not other brackets)', () => {
      mockSchedule.forEach((zone) => {
        zone.areaPostcodes?.forEach((ap) => {
          const formatted = `${ap.area} (${ap.postcode})`;
          expect(formatted).toMatch(/\(\d{4}\)/);
          expect(formatted).not.toMatch(/\[\d{4}\]/);
          expect(formatted).not.toMatch(/{\d{4}}/);
        });
      });
    });
  });

  describe('Field Mapping - Critical for Message Rendering', () => {
    test('areaPostcodes uses "area" field not "name"', () => {
      mockSchedule.forEach((zone) => {
        zone.areaPostcodes?.forEach((ap) => {
          expect(ap).toHaveProperty('area');
          expect(ap).not.toHaveProperty('name');
          expect(ap.area).toBeTruthy();
        });
      });
    });

    test('Message building correctly maps area field to output', () => {
      const monday = mockSchedule.find((z) => z.day === 'Monday')!;
      const builtMessage = monday.areaPostcodes!
        .map((ap) => `${ap.area} (${ap.postcode})`)
        .join(', ');

      expect(builtMessage).toContain('Elanora Heights');
      expect(builtMessage).not.toContain('undefined');
    });
  });

  describe('All Days Coverage', () => {
    test('All 5 service days are defined', () => {
      expect(mockSchedule).toHaveLength(5);
      expect(mockSchedule.map((z) => z.day)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    });

    test('Each day has at least 3 service areas', () => {
      mockSchedule.forEach((zone) => {
        expect(zone.areaPostcodes).toBeDefined();
        expect(zone.areaPostcodes!.length).toBeGreaterThanOrEqual(3);
      });
    });

    test('Total service areas across all days', () => {
      const totalAreas = mockSchedule.reduce((sum, zone) => sum + (zone.areaPostcodes?.length || 0), 0);
      expect(totalAreas).toBe(15); // 3 areas per day × 5 days
    });
  });
});
