# Areas by Day API Endpoint

## Overview

New endpoint that lets customers ask **"What areas do you service on Monday?"** and get a complete list of areas with postcodes.

**Endpoint:** `/api/areas-by-day`
**Purpose:** Answer day-based service area queries from GHL voice and chat agents

---

## Changes Made

### 1. **New Endpoint**: `api/areas-by-day.ts` ✅

Complements the existing `/api/check-availability` endpoint:

| Endpoint | Purpose | Input | Output |
|----------|---------|-------|--------|
| `check-availability` | Given postcode, is it available? | postcode | availability + day |
| **areas-by-day** | **Given day, what areas are available?** | **day** | **areas + postcodes** |

### 2. **Enhanced Data Structure**: `data/zones.json` ✅

Added `areaPostcodes` mapping to each zone for precise area-to-postcode associations:

```json
{
  "day": "Monday",
  "postcodes": ["2101", "2102"],
  "areas": ["Elanora Heights", "Narrabeen", "North Narrabeen"],
  "areaPostcodes": [
    {"area": "Elanora Heights", "postcode": "2101"},
    {"area": "Narrabeen", "postcode": "2101"},
    {"area": "North Narrabeen", "postcode": "2102"}
  ],
  "label": "Northern Beaches Central"
}
```

---

## API Usage

### Request

**GET method:**
```
GET /api/areas-by-day?day=Monday
```

**POST method:**
```
POST /api/areas-by-day
Content-Type: application/json

{
  "day": "Monday"
}
```

### Success Response

```json
{
  "available": true,
  "day": "Monday",
  "label": "Northern Beaches Central",
  "areas": [
    {"name": "Elanora Heights", "postcode": "2101"},
    {"name": "Narrabeen", "postcode": "2101"},
    {"name": "North Narrabeen", "postcode": "2102"}
  ],
  "postcodes": ["2101", "2102"],
  "message": "On Mondays, we service the following areas: Elanora Heights (2101), Narrabeen (2101), North Narrabeen (2102). Would you like to book an appointment?"
}
```

### Failure Response (Invalid Day)

```json
{
  "available": false,
  "message": "We don't have scheduled service for Saturday. We service on: Monday, Tuesday, Wednesday, Thursday, Friday."
}
```

---

## Customer Conversations

### Voice Example

```
Customer: "What areas do you service on Monday?"
       ↓
API Call: GET /api/areas-by-day?day=Monday
       ↓
API Response: { areas: [...], message: "On Mondays, we service..." }
       ↓
TTS (Text-to-Speech): "On Mondays, we service the following areas:
                       Elanora Heights, Narrabeen, North Narrabeen.
                       Would you like to book?"
```

### Web Chat Example

```
Customer: "What areas do you service on Tuesday?"
       ↓
API Call: GET /api/areas-by-day?day=Tuesday
       ↓
Chat Response: "On Tuesdays, we service:
               • Lindfield (2070)
               • Killara (2071)
               • Pymble (2073)"
```

### Complete Conversation Flow

```
Customer: "What areas do you service?"
Agent: "We service the greater Sydney area. Which day would you like to know about?"

Customer: "What about Monday?"
Agent: [Calls /api/areas-by-day?day=Monday]
Agent: "On Mondays, we service Elanora Heights (2101), Narrabeen (2101),
        and North Narrabeen (2102). Are you in any of these areas?"

Customer: "Yes, I'm in Narrabeen"
Agent: [Calls /api/check-availability?postcode=2101]
Agent: "Great! We can definitely help. Would you like to book a service for
        a Monday?"
```

---

## Configuration for GHL

Add to GHL Conversation AI system prompt:

```
"When customers ask 'What areas do you service on [day]?':
1. Extract the day name from their question
2. Call: GET /api/areas-by-day?day=[day]
3. Use the message field from the response
4. If the customer mentions a specific area, call check-availability with their postcode"
```

---

## Current Service Schedule

| Day | Areas | Postcodes |
|-----|-------|-----------|
| **Monday** | Elanora Heights (2101), Narrabeen (2101), North Narrabeen (2102) | 2101, 2102 |
| **Tuesday** | Lindfield (2070), Killara (2071), Pymble (2073) | 2070, 2071, 2073 |
| **Wednesday** | Mona Vale (2103), Bayview (2104), Newport (2105) | 2103, 2104, 2105 |
| **Thursday** | Chatswood (2067), Castlecrag (2068), Roseville (2069) | 2067, 2068, 2069 |
| **Friday** | Bilgola (2106), Avalon (2107), Palm Beach (2108) | 2106, 2107, 2108 |

---

## Implementation Checklist

- ✅ New endpoint created: `/api/areas-by-day`
- ✅ CORS enabled (accessible from voice & chat)
- ✅ Data structure enhanced with `areaPostcodes` mapping
- ✅ Backwards compatible (falls back if mapping missing)
- ✅ Includes AI-friendly message field
- ⏳ **TODO:** Configure GHL system prompt to call this endpoint
- ⏳ **TODO:** Test with voice & chat agents

---

## Integration with Existing Endpoints

### Combined Query Pattern

Many conversations will use both endpoints:

```
1. Customer asks: "What areas do you service on Monday?"
   → Call /api/areas-by-day?day=Monday
   → Show list of areas

2. Customer says: "Do you service Elanora Heights?"
   → Call /api/check-availability?postcode=2101
   → Confirm availability + next date
```

### Data Consistency

Both endpoints read from the same KV store:
- `/api/areas-by-day` → Returns all areas for a day
- `/api/check-availability` → Returns availability for specific postcode

When admin updates schedule via `/manage-schedule`, **both endpoints immediately have the updated data**.

---

## Error Handling

### Invalid Day
```json
{
  "available": false,
  "message": "We don't have scheduled service for Saturday. We service on: Monday, Tuesday, Wednesday, Thursday, Friday."
}
```

### Missing Day Parameter
```json
{
  "error": "day parameter is required",
  "message": "Please specify a day (Monday, Tuesday, etc.)"
}
```

### Server Error
```json
{
  "available": false,
  "message": "Unable to check service areas right now. Please call 0468 170 318 for assistance.",
  "error": "error details"
}
```

---

## Testing

### Manual Testing

```bash
# Monday service areas
curl "http://localhost:5173/api/areas-by-day?day=Monday"

# Tuesday service areas
curl "http://localhost:5173/api/areas-by-day?day=Tuesday"

# Invalid day
curl "http://localhost:5173/api/areas-by-day?day=Saturday"
```

### Expected Responses

**Monday:**
```json
{
  "available": true,
  "day": "Monday",
  "label": "Northern Beaches Central",
  "areas": [
    {"name": "Elanora Heights", "postcode": "2101"},
    {"name": "Narrabeen", "postcode": "2101"},
    {"name": "North Narrabeen", "postcode": "2102"}
  ],
  "message": "On Mondays, we service the following areas: Elanora Heights (2101), Narrabeen (2101), North Narrabeen (2102)..."
}
```

---

## Summary

**What Changed:**
1. New `/api/areas-by-day` endpoint for "What areas on [day]?" queries
2. Enhanced `zones.json` with precise area-to-postcode mappings
3. Both endpoints now work together for complete availability info

**User Experience:**
- ✅ "What areas do you service?" → Lists all days
- ✅ "What areas on Monday?" → Lists Monday areas with postcodes
- ✅ "Do you service Narrabeen?" → Confirms availability + next date
- ✅ Works for voice AND web chat

**Next Step:** Configure GHL system prompt to call `/api/areas-by-day` when customers ask about service areas by day.

