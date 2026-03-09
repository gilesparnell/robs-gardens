# Geo-Availability API - Test Suite

## Overview

Comprehensive test suite for the `/api/check-availability` endpoint that powers the GHL AI agents (voice and chat).

**Test File:** `src/test/check-availability.test.ts`
**Test Status:** ✅ **34/34 passing**

---

## Running Tests

```bash
# Run all tests
npm test

# Run only availability tests
npm test check-availability

# Watch mode (re-run on file changes)
npm test -- --watch
```

---

## Test Coverage

### 1. **Success Scenarios - Available Postcodes** (5 tests)
Verifies that the API correctly identifies available service areas:
- ✅ Monday service (2101, 2102)
- ✅ Tuesday service (2070, 2071, 2073)
- ✅ Wednesday service (2103, 2104, 2105)
- ✅ Thursday service (2067, 2068, 2069)
- ✅ Friday service (2106, 2107, 2108)

**Sample User:** "I'm in postcode 2101, do you service my area?"
**Expected:** "Yes! We service Elanora Heights on Mondays..."

---

### 2. **Failure Scenarios - Unavailable Postcodes** (4 tests)
Ensures the API correctly rejects out-of-service areas:
- ✅ Sydney CBD (2000) - not in service
- ✅ Melbourne (3000) - different state
- ✅ Adelaide (5000) - different state
- ✅ Brisbane (4000) - different state

**Sample User:** "Do you service postcode 2000?"
**Expected:** "We don't currently service that postcode. We primarily cover Northern Beaches and greater Sydney..."

---

### 3. **Next Service Date Calculation** (3 tests)
Validates that the next available service date is:
- ✅ Always in the future
- ✅ On the correct day of the week
- ✅ Formatted in en-AU locale (e.g., "Monday 17 March 2025")

**Logic Test:**
```
Today: Wednesday, March 12, 2025
Service Day: Monday
Next Service: Monday, March 17, 2025 ✓
```

---

### 4. **Message Formatting** (3 tests)
Ensures API responses include:
- ✅ Postcode in confirmation message
- ✅ Service day in response
- ✅ Helpful alternatives for unavailable areas

**Example Message:**
```
"Great! We service Elanora Heights (postcode 2101).
We're available on Mondays, with our next service
scheduled for Monday, 17 March 2025.
Would you like to book an appointment?"
```

---

### 5. **User Interaction Scenarios** (6 tests)
Real-world voice/chat examples:

| Scenario | Expected Behavior |
|----------|-------------------|
| "Do you service 2101?" | Returns Monday availability |
| "I'm in 2070, when can you come?" | Returns Tuesday schedule |
| "Do you service Melbourne?" | Kindly declines, offers alternatives |
| "I have two properties: 2101 and 2067" | Handles multiple postcodes |
| "Can you come on Wednesday?" | Checks availability for Wednesday |
| "Can you make an exception?" | Politely explains limitations |

---

### 6. **Edge Cases & Error Handling** (5 tests)
Robust handling of:
- ✅ Empty postcodes
- ✅ Postcodes with spaces (trimmed)
- ✅ Invalid formats (non-numeric)
- ✅ Leading zeros preserved
- ✅ Data integrity (all zones have required fields)

---

### 7. **AI Agent Integration** (4 tests)
Ensures GHL agents follow proper guidelines:
- ✅ Agent asks for postcode if not provided
- ✅ Agent repeats exact API message for confirmation
- ✅ Agent never suggests unavailable days
- ✅ Agent suggests alternatives for out-of-service areas

---

### 8. **Coverage Analysis** (4 tests)
Data validation:
- ✅ Northern Beaches areas fully covered
- ✅ Upper North Shore fully covered
- ✅ No overlapping postcodes across days
- ✅ Each day has at least one service area

---

## Test Example

```typescript
test('Customer asks: "I'm in 2070, when can you come?"', () => {
  const zone = mockSchedule.find(z => z.postcodes.includes('2070'));
  expect(zone?.day).toBe('Tuesday');
  // AI should respond: "We can come on Tuesdays. Next available is [Tuesday date]..."
});
```

---

## Current Service Schedule

| Day | Postcodes | Areas |
|-----|-----------|-------|
| **Monday** | 2101, 2102 | Elanora Heights, Narrabeen, North Narrabeen |
| **Tuesday** | 2070, 2071, 2073 | Lindfield, Killara, Pymble |
| **Wednesday** | 2103, 2104, 2105 | Mona Vale, Bayview, Newport |
| **Thursday** | 2067, 2068, 2069 | Chatswood, Castlecrag, Roseville |
| **Friday** | 2106, 2107, 2108 | Bilgola, Avalon, Palm Beach |

---

## API Endpoint Reference

### Request
```
GET /api/check-availability?postcode=2101
```

### Success Response
```json
{
  "available": true,
  "day": "Monday",
  "area": "Elanora Heights",
  "next_date": "Monday 17 March 2025",
  "message": "Great! We service Elanora Heights (postcode 2101)..."
}
```

### Failure Response
```json
{
  "available": false,
  "message": "We don't currently service postcode 2000. We primarily cover Northern Beaches and greater Sydney area..."
}
```

---

## GHL Agent Behavior Checklist

✅ **Postcode Handling**
- Agent asks for postcode if not provided
- Agent accepts postcode in various formats (2101, 02101, "2101")
- Agent handles multiple postcodes separately

✅ **Availability Response**
- Agent calls `/api/check-availability`
- Agent repeats exact message returned by API
- Agent provides next available service date
- Agent never suggests unavailable days

✅ **Unavailable Area Response**
- Agent explains why area isn't serviced
- Agent provides contact number for exceptions
- Agent asks if customer has another property to check

✅ **Consistency**
- All responses based on API data
- No hardcoded "we service X on Y" statements
- Schedule changes immediately reflected

---

## How to Test GHL Integration

### Option 1: Manual Testing (Voice/Chat)
1. Open GHL chat widget at http://localhost:3000
2. Say/type: "Do you service postcode 2101?"
3. Agent should respond with Monday availability
4. Test various postcodes and scenarios

### Option 2: API Testing (Command Line)
```bash
# Available postcode
curl "http://localhost:5173/api/check-availability?postcode=2101"

# Unavailable postcode
curl "http://localhost:5173/api/check-availability?postcode=2000"

# Multiple postcodes
curl "http://localhost:5173/api/check-availability?postcode=2101"
curl "http://localhost:5173/api/check-availability?postcode=2070"
```

### Option 3: Automated Test Suite
```bash
npm test check-availability
```

---

## Common Test Scenarios

### Scenario 1: Customer in available area
```
User: "I'm in 2101, when can you come?"
Flow: API returns Monday availability
Agent: "We service Elanora Heights on Mondays!
       Next available is Monday, 17 March 2025.
       Would you like to book?"
```

### Scenario 2: Customer in unavailable area
```
User: "Can you service postcode 3000?"
Flow: API returns not available
Agent: "We don't service Melbourne. However, we cover
       Northern Beaches and greater Sydney.
       Do you have another property in that area?"
```

### Scenario 3: Customer with multiple properties
```
User: "I have two properties. One in 2101, one in 2067"
Flow: Agent calls API for both postcodes
Agent: "Great! We can service both:
       - 2101 (Elanora Heights) on Mondays
       - 2067 (Chatswood) on Thursdays
       When would you like to book?"
```

---

## Maintenance

### When to Run Tests
- ✅ Before deploying schedule changes
- ✅ When adding new service areas
- ✅ When modifying availability logic
- ✅ When updating GHL agent prompts

### If Tests Fail
1. Check `zones.json` for schedule changes
2. Verify no duplicate postcodes across days
3. Ensure all zones have `day`, `postcodes`, and `areas`
4. Check date calculation logic (timezone-specific)

---

## Next Steps

- [ ] Set up CI/CD to run tests on deployment
- [ ] Add performance benchmarks (API response time)
- [ ] Test with actual GHL voice widget
- [ ] Monitor real conversations for edge cases
- [ ] Expand test coverage as new features added

