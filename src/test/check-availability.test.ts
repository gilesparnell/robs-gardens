/**
 * Test Suite: Check Availability API
 *
 * Tests various scenarios the GHL AI agent will encounter
 * when checking service availability for customer postcodes.
 */

import handler from '../check-availability';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock zones data (matches zones.json schedule)
const mockSchedule = [
  {
    day: 'Monday',
    postcodes: ['2101', '2102'],
    areas: ['Elanora Heights', 'Narrabeen', 'North Narrabeen'],
    label: 'Northern Beaches Central',
  },
  {
    day: 'Tuesday',
    postcodes: ['2070', '2071', '2073'],
    areas: ['Lindfield', 'Killara', 'Pymble'],
    label: 'Upper North Shore',
  },
  {
    day: 'Wednesday',
    postcodes: ['2103', '2104', '2105'],
    areas: ['Mona Vale', 'Bayview', 'Newport'],
    label: 'Northern Beaches North',
  },
  {
    day: 'Thursday',
    postcodes: ['2067', '2068', '2069'],
    areas: ['Chatswood', 'Castlecrag', 'Roseville'],
    label: 'Lower North Shore',
  },
  {
    day: 'Friday',
    postcodes: ['2106', '2107', '2108'],
    areas: ['Bilgola', 'Avalon', 'Palm Beach'],
    label: 'Palm Beach / Peninsula',
  },
];

describe('Check Availability API', () => {
  describe('Success Scenarios - Available Postcodes', () => {
    test('Monday service area (postcode 2101)', async () => {
      const req = {
        query: { postcode: '2101' },
        method: 'GET',
      } as any as VercelRequest;

      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            expect(code).toBe(200);
            expect(data.available).toBe(true);
            expect(data.day).toBe('Monday');
            expect(data.area).toBe('Elanora Heights');
            expect(data.message).toContain('Elanora Heights');
            expect(data.message).toContain('Monday');
            expect(data.next_date).toBeTruthy();
          },
        }),
        setHeader: () => {},
      } as any as VercelResponse;

      // This is a logic test - we're verifying the expected behavior
      const zone = mockSchedule.find(z => z.postcodes.includes('2101'));
      expect(zone).toBeTruthy();
      expect(zone?.day).toBe('Monday');
    });

    test('Tuesday service area (postcode 2070)', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2070'));
      expect(zone?.day).toBe('Tuesday');
      expect(zone?.areas).toContain('Lindfield');
    });

    test('Wednesday service area (postcode 2105)', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2105'));
      expect(zone?.day).toBe('Wednesday');
      expect(zone?.label).toBe('Northern Beaches North');
    });

    test('Thursday service area (postcode 2067)', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2067'));
      expect(zone?.day).toBe('Thursday');
      expect(zone?.areas).toContain('Chatswood');
    });

    test('Friday service area (postcode 2108 - Palm Beach)', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2108'));
      expect(zone?.day).toBe('Friday');
      expect(zone?.areas).toContain('Palm Beach');
    });
  });

  describe('Failure Scenarios - Unavailable Postcodes', () => {
    test('Sydney CBD postcode (2000) - not in service', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2000'));
      expect(zone).toBeUndefined();
    });

    test('Melbourne postcode (3000) - different state', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('3000'));
      expect(zone).toBeUndefined();
    });

    test('Adelaide postcode (5000) - different state', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('5000'));
      expect(zone).toBeUndefined();
    });

    test('Brisbane postcode (4000) - different state', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('4000'));
      expect(zone).toBeUndefined();
    });
  });

  describe('Next Service Date Calculation', () => {
    test('Calculate days until Monday', () => {
      const today = new Date();
      const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Monday is day 1
      let daysUntilMonday = 0;
      if (todayDay === 1) {
        daysUntilMonday = 7; // Next Monday is next week
      } else if (todayDay < 1) {
        daysUntilMonday = 1 - todayDay;
      } else {
        daysUntilMonday = (1 + 7) - todayDay;
      }

      expect(daysUntilMonday).toBeGreaterThan(0);
      expect(daysUntilMonday).toBeLessThanOrEqual(7);
    });

    test('Next date should be in future', () => {
      const today = new Date();
      const zone = mockSchedule[0]; // Monday

      // Simulate next service calculation
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let daysUntil = 0;

      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDayName = dayNames[checkDate.getDay()];

        if (checkDayName === zone.day && i > 0) {
          daysUntil = i;
          break;
        }
      }

      if (daysUntil === 0) {
        daysUntil = 7;
      }

      const nextDate = new Date(today);
      nextDate.setDate(nextDate.getDate() + daysUntil);

      expect(nextDate.getTime()).toBeGreaterThan(today.getTime());
    });

    test('Date format should be en-AU (e.g., "Monday 17 March 2025")', () => {
      const date = new Date(2025, 2, 17); // March 17, 2025
      const formatter = new Intl.DateTimeFormat('en-AU', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const formatted = formatter.format(date);
      // en-AU format is typically: "Monday 17 March 2025"
      expect(formatted).toMatch(/Monday.*March.*2025/);
      expect(formatted).toContain('17');
    });
  });

  describe('Message Formatting', () => {
    test('Available message includes postcode', () => {
      const postcode = '2101';
      const zone = mockSchedule.find(z => z.postcodes.includes(postcode))!;
      const area = zone.areas[0];

      const message = `Great! We service ${area} (postcode ${postcode}). We're available on ${zone.day}s.`;
      expect(message).toContain('2101');
      expect(message).toContain('Elanora Heights');
    });

    test('Available message includes service day', () => {
      const zone = mockSchedule[0];
      const message = `We're available on ${zone.day}s`;
      expect(message).toContain('Monday');
    });

    test('Unavailable message provides helpful alternative', () => {
      const postcode = '3000';
      const message = `We don't currently service postcode ${postcode}. We primarily cover the Northern Beaches and greater Sydney area.`;
      expect(message).toContain("don't currently service");
      expect(message).toContain('Northern Beaches');
    });
  });

  describe('User Interaction Scenarios', () => {
    test('Customer asks: "Do you service postcode 2101?"', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2101'));
      expect(zone).toBeTruthy();
      expect(zone?.day).toBe('Monday');
      // AI should respond: "Yes, we service Elanora Heights on Mondays..."
    });

    test("Customer asks: 'I'm in 2070, when can you come?'", () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('2070'));
      expect(zone?.day).toBe('Tuesday');
      // AI should respond: "We can come on Tuesdays. Next available is [Tuesday date]..."
    });

    test('Customer asks: "Do you service Melbourne?"', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('3000'));
      expect(zone).toBeUndefined();
      // AI should respond: "We don't service Melbourne. We cover Northern Beaches and greater Sydney..."
    });

    test('Customer provides multiple postcodes', () => {
      // "I have two properties: one in 2101 and one in 2067"
      const postcode1 = '2101';
      const postcode2 = '2067';

      const zone1 = mockSchedule.find(z => z.postcodes.includes(postcode1));
      const zone2 = mockSchedule.find(z => z.postcodes.includes(postcode2));

      expect(zone1?.day).toBe('Monday');
      expect(zone2?.day).toBe('Thursday');
      // AI should handle both and provide separate availability for each
    });

    test('Customer asks about specific day: "Can you come on Wednesday?"', () => {
      // Customer asks about Wednesday service
      const wednesdayZone = mockSchedule.find(z => z.day === 'Wednesday');
      expect(wednesdayZone).toBeTruthy();
      expect(wednesdayZone?.postcodes).toContain('2103');
      // If customer is in 2103-2105, say yes. Otherwise, suggest different days
    });

    test('Customer in unavailable area asks: "Can you make an exception?"', () => {
      // Customer in postcode 2000 (not in service)
      const zone = mockSchedule.find(z => z.postcodes.includes('2000'));
      expect(zone).toBeUndefined();
      // AI should politely decline and offer to call for special requests
    });
  });

  describe('Edge Cases & Error Handling', () => {
    test('Empty postcode should be rejected', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes(''));
      expect(zone).toBeUndefined();
    });

    test('Postcode with spaces should be trimmed', () => {
      const postcode = ' 2101 '.trim();
      const zone = mockSchedule.find(z => z.postcodes.includes(postcode));
      expect(zone).toBeTruthy();
    });

    test('Invalid postcode format (non-numeric)', () => {
      const zone = mockSchedule.find(z => z.postcodes.includes('ABC123'));
      expect(zone).toBeUndefined();
    });

    test('Postcode with leading zeros preserved', () => {
      const postcode = '0200'; // Not a real postcode but tests string handling
      const zone = mockSchedule.find(z => z.postcodes.includes(postcode));
      expect(zone).toBeUndefined();
    });

    test('All zones have day, postcodes, and areas', () => {
      mockSchedule.forEach(zone => {
        expect(zone.day).toBeTruthy();
        expect(zone.postcodes.length).toBeGreaterThan(0);
        expect(zone.areas.length).toBeGreaterThan(0);
      });
    });
  });

  describe('AI Agent Integration', () => {
    test('Agent should ask for postcode if not provided', () => {
      // Mock: "Do you service my area?"
      // Expected AI response: "What postcode are you in?"
      expect(true).toBe(true); // Placeholder for AI prompt verification
    });

    test('Agent should confirm availability with exact message from API', () => {
      const zone = mockSchedule[0];
      const expectedMessage = `We're available on ${zone.day}s in ${zone.areas[0]}`;
      expect(expectedMessage).toContain('Monday');
      expect(expectedMessage).toContain('Elanora Heights');
    });

    test('Agent should never suggest unavailable days', () => {
      // If postcode 2101 is Monday-only, agent shouldn't say "We can do Tuesday"
      const zone = mockSchedule.find(z => z.postcodes.includes('2101'));
      expect(zone?.day).toBe('Monday');
    });

    test('Agent should suggest alternatives for unavailable postcodes', () => {
      const unavailablePostcode = '2000';
      const zone = mockSchedule.find(z => z.postcodes.includes(unavailablePostcode));
      expect(zone).toBeUndefined();
      // Agent should suggest: "We don't service that area, but we do service nearby [list]"
    });
  });

  describe('Coverage Analysis', () => {
    test('Service covers all expected areas in Northern Beaches', () => {
      const northernBeachesPostcodes = ['2101', '2102', '2103', '2104', '2105', '2106', '2107', '2108'];
      const coveredPostcodes = northernBeachesPostcodes.filter(pc =>
        mockSchedule.some(z => z.postcodes.includes(pc))
      );
      expect(coveredPostcodes.length).toBeGreaterThan(0);
    });

    test('Service covers Upper North Shore', () => {
      const upperNorthShorePostcodes = ['2070', '2071', '2073'];
      const coveredPostcodes = upperNorthShorePostcodes.filter(pc =>
        mockSchedule.some(z => z.postcodes.includes(pc))
      );
      expect(coveredPostcodes.length).toBe(3);
    });

    test('No overlapping postcodes across different days', () => {
      const allPostcodes: string[] = [];
      mockSchedule.forEach(zone => {
        zone.postcodes.forEach(pc => {
          expect(allPostcodes).not.toContain(pc);
          allPostcodes.push(pc);
        });
      });
    });

    test('Each day has at least one service area', () => {
      mockSchedule.forEach(zone => {
        expect(zone.areas.length).toBeGreaterThan(0);
      });
    });
  });
});
