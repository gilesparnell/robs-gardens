# Geo-Specific Availability Integration

**Purpose:** Provide the GHL AI with postcode-specific service availability data to answer questions like "Do you service my area?" and "When can you come?"

---

## What This Does

The `/api/check-availability` endpoint returns geo-specific booking information based on postcode:

```
Input:  GET /api/check-availability?postcode=2101
Output:
{
  "available": true,
  "day": "Monday",
  "area": "Elanora Heights",
  "next_date": "Monday, March 17, 2025",
  "message": "Great! We service Elanora Heights (postcode 2101). We're available on Mondays, with our next service scheduled for Monday, March 17, 2025. Would you like to book an appointment?"
}
```

---

## How It Works

1. **User asks:** "Do you service postcode 2101?" (via voice or chat)
2. **GHL Conversation AI** recognizes postcode in message
3. **GHL calls webhook:** `GET /api/check-availability?postcode=2101`
4. **API returns:** Availability data + AI-friendly message
5. **AI uses response** in its answer to provide accurate, location-specific info
6. **User hears/reads:** "Yes, we service Elanora Heights on Mondays. Next available: March 17..."

---

## Setting Up GHL Integration

### Option 1: GHL Workflow/Tool (Recommended)

**In GHL Dashboard:**
1. Go to **Workflows** → **Create New**
2. Create a trigger for chat/voice messages
3. Add a **Webhook** action:
   - **Webhook URL:** `https://yourdomain.com/api/check-availability`
   - **Method:** GET
   - **Query Params:** `postcode={{message.postcode}}`
4. Add condition: "If postcode mentioned in message"
5. Use webhook response in AI reply

### Option 2: Knowledge Base Integration

Add postcode availability directly to GHL's Knowledge Base:

```
Q: What postcodes do you service?
A: We service the Northern Beaches and greater Sydney:
- Mondays: Elanora Heights, Narrabeen (postcodes 2101-2108)
- Tuesdays: Upper North Shore (postcodes 2067-2077)
- Etc.
```

### Option 3: Custom AI System Prompt

Configure GHL Conversation AI's system prompt to include:

```
"You are a helpful assistant for Rob's Gardens.
When customers ask about service areas:
1. Ask for their postcode
2. Call the availability API
3. Provide specific dates and areas"
```

---

## API Endpoint Details

### URL
```
GET /api/check-availability?postcode=2101
POST /api/check-availability with body: { postcode: "2101" }
```

### Response Format

**If available:**
```json
{
  "available": true,
  "day": "Monday",
  "area": "Elanora Heights",
  "next_date": "Monday, March 17, 2025",
  "message": "Great! We service Elanora Heights (postcode 2101)..."
}
```

**If not available:**
```json
{
  "available": false,
  "message": "We don't currently service postcode 2101. We primarily cover the Northern Beaches..."
}
```

### Data Source

The endpoint reads from two sources (in order of preference):

1. **Vercel KV (Redis)** - Updated via ManageSchedule admin page
   - Key: `robs-garden-schedule`
   - Format: JSON array of zones

2. **Static fallback** - If KV unavailable
   - File: `data/zones.json`
   - Always available, never expires

---

## Data Structure

### Zone Definition
```typescript
type Zone = {
  day: string;              // "Monday", "Tuesday", etc.
  postcodes: string[];      // ["2101", "2102", "2103"]
  areas: string[];          // ["Elanora Heights", "Narrabeen"]
  label: string;            // "Northern Beaches Central"
};
```

### Example Schedule
```json
{
  "schedule": [
    {
      "day": "Monday",
      "postcodes": ["2101", "2102", "2103"],
      "areas": ["Elanora Heights", "Narrabeen", "Frenchs Forest"],
      "label": "Northern Beaches Central"
    },
    {
      "day": "Tuesday",
      "postcodes": ["2067", "2070", "2073"],
      "areas": ["Chatswood", "Hornsby", "Lindfield"],
      "label": "Upper North Shore"
    }
  ]
}
```

---

## Testing the Endpoint

### Test Availability Check
```bash
curl "http://localhost:3001/api/check-availability?postcode=2101"
```

### Expected Response
```json
{
  "available": true,
  "day": "Monday",
  "area": "Elanora Heights",
  "next_date": "Monday, March 17, 2025",
  "message": "Great! We service Elanora Heights (postcode 2101)..."
}
```

### Test with Admin Panel
1. Go to `/manage-schedule`
2. Add/edit zones and postcodes
3. Click "Save All Changes"
4. Data saved to Vercel KV
5. API now returns updated availability

---

## How AI Uses This Data

### Example Conversation

**User (Voice):** "I'm in postcode 2101, do you service my area?"

**Process:**
1. GHL detects "2101" postcode in speech
2. Calls `/api/check-availability?postcode=2101`
3. Gets: `{ available: true, day: "Monday", area: "Elanora Heights", ... }`
4. AI incorporates into response

**AI Response:** "Yes, we definitely service Elanora Heights! We're available on Mondays, with our next appointment available on March 17th. Would you like me to book that for you?"

---

## Benefits

✅ **Accurate Geo Data:** AI always gives correct service areas
✅ **Real-time Updates:** Changes in ManageSchedule instantly available
✅ **Dynamic Responses:** AI can say "Next available: [date]"
✅ **No Manual Updates:** Schedule admin handles updates via UI
✅ **Fallback Safety:** Works even if KV is unavailable
✅ **Voice & Chat:** Same data for both channels

---

## Configuration for Rob's Gardens

### Current Setup
- **Service Day Pattern:** Weekly (same day each week)
- **Service Areas:** Northern Beaches + Greater Sydney
- **Schedule:** Managed via `/manage-schedule` admin page
- **Postcode Data:** `src/lib/postcodeData.ts` (2000+ mappings)

### Sample Service Schedule
```
Monday:    Northern Beaches (2101-2108)
Tuesday:   Upper North Shore (2067-2077)
Wednesday: Eastern Suburbs (2011-2027)
Thursday:  Penrith Area (2750-2756)
Friday:    Inner West (2014-2038)
```

---

## Troubleshooting

### Endpoint returns "not available"
- Check that postcode is in the schedule
- Verify schedule was saved in `/manage-schedule`
- Check Vercel KV is accessible
- Check fallback `data/zones.json` file

### AI not calling the endpoint
- Verify GHL workflow/webhook is set up
- Check that webhook URL is correct
- Test endpoint manually first
- Verify GHL Conversation AI has permission to call webhooks

### Next date calculation is wrong
- Check timezone (should be en-AU format)
- Verify service day name matches exactly
- Check if schedule loaded from KV or fallback file

---

## Integration Checklist

- ✅ `/api/check-availability` endpoint exists
- ✅ `/manage-schedule` admin page updates KV
- ✅ Postcode/area mapping available
- ✅ Fallback static data in `data/zones.json`
- ⏳ **TODO:** Configure GHL workflow to call the endpoint
- ⏳ **TODO:** Test AI integration end-to-end
- ⏳ **TODO:** Update GHL system prompt if needed

---

## Summary

This endpoint bridges the gap between your schedule data and GHL's AI:

1. **Admin updates schedule** via `/manage-schedule`
2. **Schedule saved to Vercel KV**
3. **AI asks availability** for specific postcode
4. **Endpoint returns location + dates**
5. **AI gives accurate, personalized response**

No custom code needed in voice/chat flow - GHL handles everything after receiving the availability data.
